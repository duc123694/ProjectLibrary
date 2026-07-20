package com.library.repository;

import com.library.entity.RentalOrder;
import com.library.enums.RentalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RentalOrderRepository extends JpaRepository<RentalOrder, Long> {

    Page<RentalOrder> findByUserId(Long userId, Pageable pageable);

    Page<RentalOrder> findByUserIdAndStatus(Long userId, RentalStatus status, Pageable pageable);

    @Query("""
        SELECT r FROM RentalOrder r
        WHERE (:userId IS NULL OR r.user.id = :userId)
        AND (:status IS NULL OR r.status = :status)
        AND (:keyword IS NULL OR LOWER(r.book.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
    """)
    Page<RentalOrder> findAllWithFilters(
            @Param("userId") Long userId,
            @Param("status") RentalStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    List<RentalOrder> findByStatusAndEndDateBefore(RentalStatus status, LocalDate date);

    long countByStatus(RentalStatus status);

    long countByUserId(Long userId);
}
