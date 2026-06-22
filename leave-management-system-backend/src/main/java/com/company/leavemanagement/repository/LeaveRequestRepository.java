package com.company.leavemanagement.repository;

import com.company.leavemanagement.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    // Enforces Business Rule: Checks if a user has any overlapping active leaves
    @Query("SELECT COUNT(lr) > 0 FROM LeaveRequest lr WHERE lr.user.id = :userId " +
           "AND lr.status IN (com.company.leavemanagement.enums.Status.PENDING, com.company.leavemanagement.enums.Status.APPROVED) " +
           "AND (:startDate <= lr.endDate AND :endDate >= lr.startDate)")
    boolean hasOverlappingLeave(@Param("userId") Long userId, 
                                @Param("startDate") LocalDate startDate, 
                                @Param("endDate") LocalDate endDate);
}
