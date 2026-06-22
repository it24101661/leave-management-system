package com.company.leavemanagement.dto;

import com.company.leavemanagement.enums.LeaveType;
import java.time.LocalDate;

public record LeaveApplicationRequest(
    Long userId,
    LeaveType leaveType,
    LocalDate startDate,
    LocalDate endDate,
    String reason
) {}