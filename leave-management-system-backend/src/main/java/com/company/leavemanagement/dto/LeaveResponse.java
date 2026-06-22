package com.company.leavemanagement.dto;

import com.company.leavemanagement.enums.LeaveType;
import com.company.leavemanagement.enums.Status;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record LeaveResponse(
        Long id,
        Long userId,
        String userFirstName,
        String userLastName,
        LeaveType leaveType,
        LocalDate startDate,
        LocalDate endDate,
        Integer totalDays,
        String reason,
        Status status,
        Long reviewedById,
        String reviewedByFirstName,
        String managerNote,
        LocalDateTime appliedAt,
        LocalDateTime reviewedAt
) {}