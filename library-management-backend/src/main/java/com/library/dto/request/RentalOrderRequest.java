package com.library.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RentalOrderRequest {

    @NotNull(message = "Sách không được để trống")
    private Long bookId;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startDate;

    @NotNull(message = "Số ngày thuê không được để trống")
    @Min(value = 1, message = "Số ngày thuê tối thiểu là 1")
    @Max(value = 60, message = "Số ngày thuê tối đa là 60")
    private Integer rentalDays;

    @NotBlank(message = "Địa chỉ nhận sách không được để trống")
    @Size(max = 500, message = "Địa chỉ tối đa 500 ký tự")
    private String deliveryAddress;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String notes;
}
