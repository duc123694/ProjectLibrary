package com.library.service;

import com.library.dto.request.WalletDepositRequest;
import com.library.dto.response.PageResponse;
import com.library.dto.response.WalletResponse;
import com.library.dto.response.WalletTransactionResponse;
import com.library.entity.RentalOrder;
import com.library.entity.User;
import com.library.entity.Wallet;
import com.library.entity.WalletTransaction;
import com.library.enums.TransactionType;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.WalletRepository;
import com.library.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;

    public Wallet getOrCreateWallet(User user) {
        return walletRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Wallet w = Wallet.builder().user(user).balance(BigDecimal.ZERO).build();
                    return walletRepository.save(w);
                });
    }

    public WalletResponse getWallet(User user) {
        Wallet wallet = getOrCreateWallet(user);
        return WalletResponse.fromEntity(wallet);
    }

    @Transactional
    public WalletResponse deposit(User user, WalletDepositRequest request) {
        Wallet wallet = getOrCreateWallet(user);
        wallet.setBalance(wallet.getBalance().add(request.getAmount()));
        walletRepository.save(wallet);

        WalletTransaction tx = WalletTransaction.builder()
                .wallet(wallet)
                .type(TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .balanceAfter(wallet.getBalance())
                .description("Nạp tiền vào ví")
                .build();
        transactionRepository.save(tx);

        return WalletResponse.fromEntity(wallet);
    }

    @Transactional
    public void deductForRental(Wallet wallet, BigDecimal amount, RentalOrder order, String description, TransactionType type) {
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new BadRequestException("Số dư ví không đủ. Vui lòng nạp thêm tiền.");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        WalletTransaction tx = WalletTransaction.builder()
                .wallet(wallet)
                .type(type)
                .amount(amount)
                .balanceAfter(wallet.getBalance())
                .description(description)
                .rentalOrder(order)
                .build();
        transactionRepository.save(tx);
    }

    @Transactional
    public void refundDeposit(Wallet wallet, BigDecimal amount, RentalOrder order) {
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        WalletTransaction tx = WalletTransaction.builder()
                .wallet(wallet)
                .type(TransactionType.DEPOSIT_REFUND)
                .amount(amount)
                .balanceAfter(wallet.getBalance())
                .description("Hoàn cọc - đơn thuê #" + order.getId())
                .rentalOrder(order)
                .build();
        transactionRepository.save(tx);
    }

    public PageResponse<WalletTransactionResponse> getTransactions(User user, int page, int size) {
        Wallet wallet = getOrCreateWallet(user);
        Pageable pageable = PageRequest.of(page, size);
        Page<WalletTransaction> txPage = transactionRepository
                .findByWalletIdOrderByCreatedAtDesc(wallet.getId(), pageable);

        return PageResponse.<WalletTransactionResponse>builder()
                .content(txPage.getContent().stream().map(WalletTransactionResponse::fromEntity).toList())
                .pageNumber(txPage.getNumber())
                .pageSize(txPage.getSize())
                .totalElements(txPage.getTotalElements())
                .totalPages(txPage.getTotalPages())
                .first(txPage.isFirst())
                .last(txPage.isLast())
                .build();
    }
}
