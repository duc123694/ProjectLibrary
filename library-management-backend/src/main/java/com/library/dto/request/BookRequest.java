package com.library.dto.request;

import com.library.enums.BookStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookRequest {

    @NotBlank(message = "Tên sách không được để trống")
    @Size(max = 255, message = "Tên sách tối đa 255 ký tự")
    private String title;

    @NotBlank(message = "Tên tác giả không được để trống")
    @Size(max = 150, message = "Tên tác giả tối đa 150 ký tự")
    private String author;

    private Long categoryId;

    @Size(max = 20, message = "ISBN tối đa 20 ký tự")
    private String isbn;

    private String description;

    private String coverImage;

    @NotNull(message = "Giá thuê hằng ngày không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá thuê phải lớn hơn 0")
    private BigDecimal dailyRentalPrice;

    @NotNull(message = "Tiền đặt cọc không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Tiền đặt cọc phải lớn hơn 0")
    private BigDecimal depositAmount;

    @NotNull(message = "Số lượng kho không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    private Integer stockQuantity;

    private BookStatus status;

    @Size(max = 150, message = "Nhà xuất bản tối đa 150 ký tự")
    private String publisher;

    private Integer publishedYear;

    private Integer pageCount;
}
