package com.company.leavemanagement.service;

import com.company.leavemanagement.dto.SignupRequest;
import com.company.leavemanagement.dto.UserResponse;
import com.company.leavemanagement.dto.LoginRequest;
import com.company.leavemanagement.dto.LoginResponse;
import com.company.leavemanagement.entity.User;
import com.company.leavemanagement.entity.LeaveBalances;
import com.company.leavemanagement.enums.LeaveType;
import com.company.leavemanagement.enums.Role;
import com.company.leavemanagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder; // CHANGED
import com.company.leavemanagement.repository.LeaveBalanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final PasswordEncoder passwordEncoder; // CHANGED

    public UserService(UserRepository userRepository,
                       LeaveBalanceRepository leaveBalanceRepository,
                       PasswordEncoder passwordEncoder) { // CHANGED
        this.userRepository = userRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void createNewUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User newUser = new User();
        newUser.setEmail(request.email());

        String secureHash = passwordEncoder.encode(request.password());
        newUser.setPasswordHash(secureHash);

        newUser.setFirstName(request.firstName());
        newUser.setLastName(request.lastName());
        newUser.setDepartment(request.department());
        newUser.setRole(request.role() != null ? request.role() : Role.EMPLOYEE);
        newUser.setIsActive(true);

        User savedUser = userRepository.save(newUser);

        if (savedUser.getRole() == Role.EMPLOYEE) {
            allocateDefaultBalances(savedUser);
        }
    }

    public LoginResponse verifyLogin(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Error: Invalid email or password!"));

        boolean isPasswordCorrect = passwordEncoder.matches(request.password(), user.getPasswordHash());
        if (!isPasswordCorrect) {
            throw new RuntimeException("Error: Invalid email or password!");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Error: This account has been deactivated.");
        }

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                "Login successful!"
        );
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getDepartment(),
                        user.getRole(),
                        user.getIsActive()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Error: User profile not found.");
        }
        userRepository.deleteById(id);
    }

    private void allocateDefaultBalances(User user) {
        LeaveBalances annualLeave = new LeaveBalances(null, user, LeaveType.ANNUAL, 14, 0);
        LeaveBalances sickLeave = new LeaveBalances(null, user, LeaveType.SICK, 14, 0);
        LeaveBalances casualLeave = new LeaveBalances(null, user, LeaveType.CASUAL, 14, 0);

        leaveBalanceRepository.save(annualLeave);
        leaveBalanceRepository.save(sickLeave);
        leaveBalanceRepository.save(casualLeave);
    }
}