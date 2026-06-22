package com.company.leavemanagement.controller;

import com.company.leavemanagement.dto.SignupRequest;
import com.company.leavemanagement.dto.UserResponse;
import com.company.leavemanagement.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    //Create User Account
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody SignupRequest request) {
        userService.createNewUser(request);
        return new ResponseEntity<>("User account created successfully!", HttpStatus.CREATED);
    }

    // view users
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    //  Delete Users
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok("User account removed successfully.");
    }
}
