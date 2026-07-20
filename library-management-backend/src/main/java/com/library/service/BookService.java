package com.library.service;

import com.library.dto.request.BookRequest;
import com.library.dto.response.BookResponse;
import com.library.dto.response.PageResponse;
import com.library.entity.Book;
import com.library.entity.Category;
import com.library.enums.BookStatus;
import com.library.exception.BadRequestException;
import com.library.exception.DuplicateResourceException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import com.library.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public PageResponse<BookResponse> getAllBooks(String keyword, Long categoryId, BookStatus status,
                                                  int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Book> bookPage = bookRepository.findAllWithFilters(keyword, categoryId, status, pageable);

        return PageResponse.<BookResponse>builder()
                .content(bookPage.getContent().stream().map(BookResponse::fromEntity).toList())
                .pageNumber(bookPage.getNumber())
                .pageSize(bookPage.getSize())
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .first(bookPage.isFirst())
                .last(bookPage.isLast())
                .build();
    }

    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sách", "id", id));
        return BookResponse.fromEntity(book);
    }

    @Transactional
    public BookResponse createBook(BookRequest request) {
        if (request.getIsbn() != null && !request.getIsbn().isBlank()
                && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new DuplicateResourceException("Sách", "ISBN", request.getIsbn());
        }

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", request.getCategoryId()));
        }

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .category(category)
                .isbn(request.getIsbn())
                .description(request.getDescription())
                .coverImage(request.getCoverImage())
                .dailyRentalPrice(request.getDailyRentalPrice())
                .depositAmount(request.getDepositAmount())
                .stockQuantity(request.getStockQuantity())
                .status(request.getStatus() != null ? request.getStatus() : BookStatus.AVAILABLE)
                .publisher(request.getPublisher())
                .publishedYear(request.getPublishedYear())
                .pageCount(request.getPageCount())
                .build();

        return BookResponse.fromEntity(bookRepository.save(book));
    }

    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sách", "id", id));

        if (request.getIsbn() != null && !request.getIsbn().isBlank()
                && !request.getIsbn().equals(book.getIsbn())
                && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new DuplicateResourceException("Sách", "ISBN", request.getIsbn());
        }

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", request.getCategoryId()));
        }

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setCategory(category);
        book.setIsbn(request.getIsbn());
        book.setDescription(request.getDescription());
        book.setCoverImage(request.getCoverImage());
        book.setDailyRentalPrice(request.getDailyRentalPrice());
        book.setDepositAmount(request.getDepositAmount());
        book.setStockQuantity(request.getStockQuantity());
        if (request.getStatus() != null) book.setStatus(request.getStatus());
        book.setPublisher(request.getPublisher());
        book.setPublishedYear(request.getPublishedYear());
        book.setPageCount(request.getPageCount());

        return BookResponse.fromEntity(bookRepository.save(book));
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sách", "id", id));
        bookRepository.delete(book);
    }
}
