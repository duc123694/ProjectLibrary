package com.library.repository;

import com.library.entity.Book;
import com.library.enums.BookStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    boolean existsByIsbn(String isbn);

    @Query(value = """
        SELECT b FROM Book b LEFT JOIN FETCH b.category c
        WHERE (:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR c.id = :categoryId)
        AND (:status IS NULL OR b.status = :status)
        """,
        countQuery = """
        SELECT COUNT(b) FROM Book b LEFT JOIN b.category c
        WHERE (:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR c.id = :categoryId)
        AND (:status IS NULL OR b.status = :status)
        """)
    Page<Book> findAllWithFilters(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("status") BookStatus status,
            Pageable pageable
    );
}
