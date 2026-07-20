package com.library.dto.response;

import com.library.entity.Category;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private long bookCount;
    private LocalDateTime createdAt;

    public static CategoryResponse fromEntity(Category category, long bookCount) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .bookCount(bookCount)
                .createdAt(category.getCreatedAt())
                .build();
    }

    // Overload for cases where bookCount is not needed (e.g., create/update)
    public static CategoryResponse fromEntity(Category category) {
        return fromEntity(category, 0L);
    }
}
