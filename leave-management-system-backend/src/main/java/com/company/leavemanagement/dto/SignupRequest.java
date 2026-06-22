package com.company.leavemanagement.dto;

import com.company.leavemanagement.enums.Role;

public record SignupRequest(
    String email,
    String password,
    String firstName,
    String lastName,
    String department,
    Role role
) {}
