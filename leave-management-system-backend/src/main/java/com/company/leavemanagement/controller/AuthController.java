package com.company.leavemanagement.controller;

import com.company.leavemanagement.dto.LoginRequest;
import com.company.leavemanagement.dto.LoginResponse; // Imported your new DTO!
import com.company.leavemanagement.dto.SignupRequest;
import com.company.leavemanagement.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    private final UserService userService;

    // Direct dependency injection of our UserService bean
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // 1. Process Registration Submissions
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        userService.createNewUser(request);
        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
    }

    // 2. Process Authentication Sessions
    @PostMapping("/signin")
    public ResponseEntity<LoginResponse> signin(@RequestBody LoginRequest request) {
        // Delegates credential verification to our service layer
        LoginResponse response = userService.verifyLogin(request);
        
        // Returns the user's role profile alongside a clean 200 OK status
        return ResponseEntity.ok(response);
    }
}
