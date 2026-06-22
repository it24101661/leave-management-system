package com.company.leavemanagement.dto;

import com.company.leavemanagement.enums.Role;

public record UserResponse(
    Long id,
    String email,
    String firstName,
    String lastName,
    String department,
    Role role,
    Boolean isActive
) {}