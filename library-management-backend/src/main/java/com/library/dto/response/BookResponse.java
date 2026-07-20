package com.library.dto.response;

import com.library.entity.Book;
import com.library.enums.BookStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private Long categoryId;
    private String categoryName;
    private String isbn;
    private String description;
    private String coverImage;
    private BigDecimal dailyRentalPrice;
    private BigDecimal depositAmount;
    private Integer stockQuantity;
    private BookStatus status;
    private String publisher;
    private Integer publishedYear;
    private Integer pageCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BookResponse fromEntity(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .categoryId(book.getCategory() != null ? book.getCategory().getId() : null)
                .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
                .isbn(book.getIsbn())
                .description(book.getDescription())
                .coverImage(book.getCoverImage())
                .dailyRentalPrice(book.getDailyRentalPrice())
                .depositAmount(book.getDepositAmount())
                .stockQuantity(book.getStockQuantity())
                .status(book.getStatus())
                .publisher(book.getPublisher())
                .publishedYear(book.getPublishedYear())
                .pageCount(book.getPageCount())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }
}
