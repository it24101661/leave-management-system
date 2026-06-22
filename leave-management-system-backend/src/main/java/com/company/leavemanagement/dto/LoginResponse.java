package com.company.leavemanagement.dto;

import com.company.leavemanagement.enums.Role;

public record LoginResponse(
    Long id,
    String email,
    String firstName,
    String lastName,
    Role role,
    String message
) {}
