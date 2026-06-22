package com.company.leavemanagement.dto;

import com.company.leavemanagement.enums.LeaveType;

public record LeaveBalanceResponse(
        LeaveType leaveType,
        Integer totalDays,
        Integer usedDays,
        Integer remainingDays
) {}
