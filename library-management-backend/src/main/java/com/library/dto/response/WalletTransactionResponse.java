package com.library.dto.response;

import com.library.entity.WalletTransaction;
import com.library.enums.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WalletTransactionResponse {
    private Long id;
    private TransactionType type;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String description;
    private Long rentalOrderId;
    private LocalDateTime createdAt;

    public static WalletTransactionResponse fromEntity(WalletTransaction tx) {
        return WalletTransactionResponse.builder()
                .id(tx.getId())
                .type(tx.getType())
                .amount(tx.getAmount())
                .balanceAfter(tx.getBalanceAfter())
                .description(tx.getDescription())
                .rentalOrderId(tx.getRentalOrder() != null ? tx.getRentalOrder().getId() : null)
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
