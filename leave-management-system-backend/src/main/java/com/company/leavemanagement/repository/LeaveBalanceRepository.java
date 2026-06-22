package com.company.leavemanagement.repository;

import com.company.leavemanagement.entity.LeaveBalances;
import com.company.leavemanagement.enums.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalances, Long> {
    
    // Finds a specific balance row (e.g., fetch the 'SICK' leave row for User ID 5)
    Optional<LeaveBalances> findByUserIdAndLeaveType(Long userId, LeaveType leaveType);

    // Finds all balance rows for a user (ANNUAL, SICK, CASUAL all at once)
    List<LeaveBalances> findByUserId(Long userId);
}