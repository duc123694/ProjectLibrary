package com.library.controller;

import com.library.dto.request.RentalOrderRequest;
import com.library.dto.response.ApiResponse;
import com.library.dto.response.PageResponse;
import com.library.dto.response.RentalOrderResponse;
import com.library.entity.User;
import com.library.enums.RentalStatus;
import com.library.service.RentalOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/rental-orders")
@RequiredArgsConstructor
public class RentalOrderController {

    private final RentalOrderService rentalOrderService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PageResponse<RentalOrderResponse>>> getMyOrders(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) RentalStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                rentalOrderService.getMyOrders(user, status, page, size)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<PageResponse<RentalOrderResponse>>> getAllOrders(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) RentalStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                rentalOrderService.getAllOrders(userId, status, keyword, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RentalOrderResponse>> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(ApiResponse.success(rentalOrderService.getOrderById(id, user)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RentalOrderResponse>> createOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody RentalOrderRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Đặt thuê sách thành công", rentalOrderService.createOrder(user, request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RentalOrderResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal User user
    ) {
        RentalStatus status = RentalStatus.valueOf(request.get("status"));
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công",
                rentalOrderService.updateOrderStatus(id, status, user)));
    }
}
