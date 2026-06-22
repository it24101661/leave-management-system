package com.company.leavemanagement.service;

import com.company.leavemanagement.dto.LeaveApplicationRequest;
import com.company.leavemanagement.dto.LeaveBalanceResponse;
import com.company.leavemanagement.dto.LeaveResponse;
import com.company.leavemanagement.entity.LeaveBalances;
import com.company.leavemanagement.entity.LeaveRequest;
import com.company.leavemanagement.entity.User;
import com.company.leavemanagement.enums.Role;
import com.company.leavemanagement.enums.Status;
import com.company.leavemanagement.repository.LeaveBalanceRepository;
import com.company.leavemanagement.repository.LeaveRequestRepository;
import com.company.leavemanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveRequestService {

    // FIXED: Removed 'static' keywords and added the missing UserRepository field mapping
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;

    // Standard constructor injection for all three repositories
    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository, 
                               LeaveBalanceRepository leaveBalanceRepository, 
                               UserRepository userRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.userRepository = userRepository;
    }

    // 1. Submit Leave Application & Perform Validation Checks
    @Transactional
    public void applyLeave(LeaveApplicationRequest request) {
        // Fetch the employee profile
        User employee = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("Error: Employee profile not found."));

        // Guardrail: Validate dates make chronological sense
        if (request.startDate().isAfter(request.endDate())) {
            throw new RuntimeException("Error: Start date cannot be after the End date!");
        }

        // Business Logic: Calculate total days requested (inclusive of start/end days)
        int requestedDays = (int) ChronoUnit.DAYS.between(request.startDate(), request.endDate()) + 1;

        // Business Rule: Check for Calendar Date Overlaps
        boolean isOverlapping = leaveRequestRepository.hasOverlappingLeave(
                request.userId(), request.startDate(), request.endDate()
        );
        if (isOverlapping) {
            throw new RuntimeException("Error: You already have a pending or approved leave during these dates!");
        }

        // Business Rule: Fetch leave balance and verify allocation availability
        LeaveBalances balance = leaveBalanceRepository.findByUserIdAndLeaveType(request.userId(), request.leaveType())
                .orElseThrow(() -> new RuntimeException("Error: No leave allocation found for this category."));

        int remainingDays = balance.getTotalDays() - balance.getUsedDays();
        if (requestedDays > remainingDays) {
            throw new RuntimeException("Error: Insufficient leave balance! Requested: " + requestedDays + " days. Available: " + remainingDays + " days.");
        }

        // Mapping data to the LeaveRequest Entity to insert into MySQL
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setUser(employee);
        leaveRequest.setLeaveType(request.leaveType());
        leaveRequest.setStartDate(request.startDate());
        leaveRequest.setEndDate(request.endDate());
        leaveRequest.setTotalDays(requestedDays);
        leaveRequest.setReason(request.reason());

        leaveRequestRepository.save(leaveRequest);
    }

    // 2. Handles Rule: Manager Approval Lifecycle
    @Transactional
    public void approveLeaveRequest(Long id, Long managerId) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Leave request record not found."));

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Error: Manager profile not found."));

        // Security Guardrail: Verify the reviewer is actually authorized as a manager
        if (manager.getRole() != Role.MANAGER) {
            throw new RuntimeException("Error: Unauthorized! Only Managers can approve leaves.");
        }

        if (request.getStatus() != Status.PENDING) {
            throw new RuntimeException("Error: This request has already been processed!");
        }

        // Fetch user leave balance row to physically deduct the requested days
        LeaveBalances balance = leaveBalanceRepository.findByUserIdAndLeaveType(request.getUser().getId(), request.getLeaveType())
                .orElseThrow(() -> new RuntimeException("Error: Employee balance row mapping missing."));

        // Update the Allocation Counter
        balance.setUsedDays(balance.getUsedDays() + request.getTotalDays());
        leaveBalanceRepository.save(balance);

        // Update the request status state
        request.setStatus(Status.APPROVED);
        request.setReviewedBy(manager);
        leaveRequestRepository.save(request);
    }

    // 3. FIXED Structure: Manager Rejection Lifecycle
    @Transactional
    public void rejectLeaveRequest(Long id, Long managerId, String managerNote) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Leave request record not found."));

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Error: Manager profile not found."));

        if (manager.getRole() != Role.MANAGER) {
            throw new RuntimeException("Error: Unauthorized! Only Managers can reject leaves.");
        }

        if (request.getStatus() != Status.PENDING) {
            throw new RuntimeException("Error: This request has already been processed!");
        }

        // Update status state (We leave the leave_balances table completely alone since it's a rejection)
        request.setStatus(Status.REJECTED);
        request.setReviewedBy(manager);
        request.setManagerNote(managerNote); // Save the explanation reason text
        leaveRequestRepository.save(request);
    }

    // 4. Handles Rule: Employee Cancellation Lifecycle
    @Transactional
    public void cancelLeaveRequest(Long id) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Leave request record not found."));

        if (request.getStatus() != Status.PENDING) {
            throw new RuntimeException("Error: You can only cancel applications that are still PENDING review.");
        }

        request.setStatus(Status.CANCELLED);
        leaveRequestRepository.save(request);
    }

   
   // 5. Read operations for Dashboard viewing
    public List<LeaveResponse> getAllRequests() {
        return leaveRequestRepository.findAll().stream()
                .map(lr -> new LeaveResponse(
                        lr.getId(),
                        lr.getUser().getId(),
                        lr.getUser().getFirstName(),
                        lr.getUser().getLastName(),
                        lr.getLeaveType(),
                        lr.getStartDate(),
                        lr.getEndDate(),
                        lr.getTotalDays(),
                        lr.getReason(),
                        lr.getStatus(),
                        lr.getReviewedBy() != null ? lr.getReviewedBy().getId() : null,
                        lr.getReviewedBy() != null ? lr.getReviewedBy().getFirstName() : null,
                        lr.getManagerNote(),
                        lr.getAppliedAt(),
                        lr.getReviewedAt()
                ))
                .collect(Collectors.toList());
    }
    // 6. Fetch all leave balances for a specific employee
    public List<LeaveBalanceResponse> getBalancesForUser(Long userId) {
        return leaveBalanceRepository.findByUserId(userId).stream()
                .map(balance -> new LeaveBalanceResponse(
                        balance.getLeaveType(),
                        balance.getTotalDays(),
                        balance.getUsedDays(),
                        balance.getTotalDays() - balance.getUsedDays()
                ))
                .collect(Collectors.toList());
    }
}

