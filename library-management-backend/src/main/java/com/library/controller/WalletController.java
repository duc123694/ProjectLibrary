package com.library.controller;

import com.library.dto.request.WalletDepositRequest;
import com.library.dto.response.ApiResponse;
import com.library.dto.response.PageResponse;
import com.library.dto.response.WalletResponse;
import com.library.dto.response.WalletTransactionResponse;
import com.library.entity.User;
import com.library.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<ApiResponse<WalletResponse>> getMyWallet(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(walletService.getWallet(user)));
    }

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<WalletResponse>> deposit(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody WalletDepositRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Nạp tiền thành công", walletService.deposit(user, request)));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<PageResponse<WalletTransactionResponse>>> getTransactions(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(walletService.getTransactions(user, page, size)));
    }
}
