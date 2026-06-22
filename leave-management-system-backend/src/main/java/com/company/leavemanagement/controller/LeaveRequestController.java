package com.company.leavemanagement.controller;

import com.company.leavemanagement.dto.LeaveApplicationRequest;
import com.company.leavemanagement.dto.LeaveResponse;
import com.company.leavemanagement.service.LeaveRequestService; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    // Dependency Injection connects the Controller directly to the Service Layer instance
    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    // 1. Submit a Leave Application Form
    @PostMapping("/apply")
    public ResponseEntity<String> applyLeave(@RequestBody LeaveApplicationRequest request) {
       
        leaveRequestService.applyLeave(request);
        return new ResponseEntity<>("Leave application submitted successfully!", HttpStatus.CREATED);
    }

    // 2. Manager Action: Approve Leave Request
    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveLeave(@PathVariable Long id, @RequestParam Long managerId) {
        // FIXED: Using lowercase instance variable 'leaveRequestService'
        leaveRequestService.approveLeaveRequest(id, managerId);
        return ResponseEntity.ok("Leave request approved successfully.");
    }

    // 3. Manager Action: Reject Leave Request
    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectLeave(
            @PathVariable Long id, 
            @RequestParam Long managerId, 
            @RequestBody String managerNote) {
        // FIXED: Matches the exact method parameters inside your fixed Service layer
        leaveRequestService.rejectLeaveRequest(id, managerId, managerNote);
        return ResponseEntity.ok("Leave request rejected.");
    }

    // 4. Employee Action: Cancel Own Pending Request
    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelLeave(@PathVariable Long id) {
        // FIXED: Using lowercase instance variable 'leaveRequestService'
        leaveRequestService.cancelLeaveRequest(id);
        return ResponseEntity.ok("Leave request cancelled successfully.");
    }

    // 5. Dashboard Feed: View All System Leaves

   @GetMapping
    public ResponseEntity<List<LeaveResponse>> getAllLeaves() {
        List<LeaveResponse> requests = leaveRequestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }
}