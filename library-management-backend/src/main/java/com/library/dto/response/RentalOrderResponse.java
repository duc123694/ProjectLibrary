package com.library.dto.response;

import com.library.entity.RentalOrder;
import com.library.enums.RentalStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RentalOrderResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookCoverImage;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate actualReturnDate;
    private Integer rentalDays;
    private BigDecimal rentalPrice;
    private BigDecimal depositAmount;
    private BigDecimal totalAmount;
    private RentalStatus status;
    private String deliveryAddress;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static RentalOrderResponse fromEntity(RentalOrder order) {
        return RentalOrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userFullName(order.getUser().getFullName())
                .userEmail(order.getUser().getEmail())
                .bookId(order.getBook().getId())
                .bookTitle(order.getBook().getTitle())
                .bookAuthor(order.getBook().getAuthor())
                .bookCoverImage(order.getBook().getCoverImage())
                .startDate(order.getStartDate())
                .endDate(order.getEndDate())
                .actualReturnDate(order.getActualReturnDate())
                .rentalDays(order.getRentalDays())
                .rentalPrice(order.getRentalPrice())
                .depositAmount(order.getDepositAmount())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
