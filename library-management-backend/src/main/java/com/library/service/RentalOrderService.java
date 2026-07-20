package com.library.service;

import com.library.dto.request.RentalOrderRequest;
import com.library.dto.response.PageResponse;
import com.library.dto.response.RentalOrderResponse;
import com.library.entity.*;
import com.library.enums.BookStatus;
import com.library.enums.RentalStatus;
import com.library.enums.TransactionType;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import com.library.repository.RentalOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class RentalOrderService {

    private final RentalOrderRepository rentalOrderRepository;
    private final BookRepository bookRepository;
    private final WalletService walletService;

    @Transactional(readOnly = true)
    public PageResponse<RentalOrderResponse> getMyOrders(User user, RentalStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<RentalOrder> orderPage;
        if (status != null) {
            orderPage = rentalOrderRepository.findByUserIdAndStatus(user.getId(), status, pageable);
        } else {
            orderPage = rentalOrderRepository.findByUserId(user.getId(), pageable);
        }
        return buildPage(orderPage);
    }

    @Transactional(readOnly = true)
    public PageResponse<RentalOrderResponse> getAllOrders(Long userId, RentalStatus status, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<RentalOrder> orderPage = rentalOrderRepository.findAllWithFilters(userId, status, keyword, pageable);
        return buildPage(orderPage);
    }

    @Transactional(readOnly = true)
    public RentalOrderResponse getOrderById(Long id, User currentUser) {
        RentalOrder order = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn thuê", "id", id));
        if (currentUser.getRole().name().equals("USER") && !order.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Bạn không có quyền xem đơn thuê này");
        }
        return RentalOrderResponse.fromEntity(order);
    }

    @Transactional
    public RentalOrderResponse createOrder(User user, RentalOrderRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Sách", "id", request.getBookId()));

        if (book.getStatus() != BookStatus.AVAILABLE || book.getStockQuantity() <= 0) {
            throw new BadRequestException("Sách hiện không có sẵn để thuê");
        }

        LocalDate startDate = request.getStartDate();
        LocalDate endDate = startDate.plusDays(request.getRentalDays());

        BigDecimal rentalPrice = book.getDailyRentalPrice()
                .multiply(BigDecimal.valueOf(request.getRentalDays()));
        BigDecimal depositAmount = book.getDepositAmount();
        BigDecimal totalAmount = rentalPrice.add(depositAmount);

        // Deduct from wallet
        Wallet wallet = walletService.getOrCreateWallet(user);
        walletService.deductForRental(wallet, rentalPrice, null,
                "Thanh toán thuê sách: " + book.getTitle(), TransactionType.RENTAL_PAYMENT);
        walletService.deductForRental(wallet, depositAmount, null,
                "Đặt cọc thuê sách: " + book.getTitle(), TransactionType.RENTAL_DEPOSIT);

        // Decrease stock
        book.setStockQuantity(book.getStockQuantity() - 1);
        if (book.getStockQuantity() == 0) {
            book.setStatus(BookStatus.UNAVAILABLE);
        }
        bookRepository.save(book);

        RentalOrder order = RentalOrder.builder()
                .user(user)
                .book(book)
                .startDate(startDate)
                .endDate(endDate)
                .rentalDays(request.getRentalDays())
                .rentalPrice(rentalPrice)
                .depositAmount(depositAmount)
                .totalAmount(totalAmount)
                .status(RentalStatus.PENDING)
                .deliveryAddress(request.getDeliveryAddress())
                .notes(request.getNotes())
                .build();

        RentalOrder saved = rentalOrderRepository.save(order);

        // Update wallet transactions with the rental order reference
        return RentalOrderResponse.fromEntity(saved);
    }

    @Transactional
    public RentalOrderResponse updateOrderStatus(Long id, RentalStatus newStatus, User currentUser) {
        RentalOrder order = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn thuê", "id", id));

        RentalStatus oldStatus = order.getStatus();

        // Validate transitions
        validateStatusTransition(oldStatus, newStatus, currentUser.getRole().name());

        // If returning book
        if (newStatus == RentalStatus.RETURNED) {
            order.setActualReturnDate(LocalDate.now());
            // Increase stock
            Book book = order.getBook();
            book.setStockQuantity(book.getStockQuantity() + 1);
            book.setStatus(BookStatus.AVAILABLE);
            bookRepository.save(book);
            // Refund deposit
            Wallet wallet = walletService.getOrCreateWallet(order.getUser());
            walletService.refundDeposit(wallet, order.getDepositAmount(), order);
        }

        // If cancelled and was PENDING - refund both
        if (newStatus == RentalStatus.CANCELLED && oldStatus == RentalStatus.PENDING) {
            Book book = order.getBook();
            book.setStockQuantity(book.getStockQuantity() + 1);
            book.setStatus(BookStatus.AVAILABLE);
            bookRepository.save(book);
            Wallet wallet = walletService.getOrCreateWallet(order.getUser());
            walletService.refundDeposit(wallet, order.getTotalAmount(), order);
        }

        order.setStatus(newStatus);
        return RentalOrderResponse.fromEntity(rentalOrderRepository.save(order));
    }

    private void validateStatusTransition(RentalStatus from, RentalStatus to, String role) {
        boolean isAdmin = role.equals("ADMIN") || role.equals("LIBRARIAN");
        boolean isUser = role.equals("USER");

        switch (from) {
            case PENDING:
                if (to == RentalStatus.CANCELLED && isUser) return;
                if ((to == RentalStatus.ACTIVE || to == RentalStatus.CANCELLED) && isAdmin) return;
                break;
            case ACTIVE:
                if ((to == RentalStatus.RETURNED || to == RentalStatus.OVERDUE) && isAdmin) return;
                break;
            default:
                break;
        }
        throw new BadRequestException("Không thể chuyển trạng thái từ " + from + " sang " + to);
    }

    private PageResponse<RentalOrderResponse> buildPage(Page<RentalOrder> page) {
        return PageResponse.<RentalOrderResponse>builder()
                .content(page.getContent().stream().map(RentalOrderResponse::fromEntity).toList())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
