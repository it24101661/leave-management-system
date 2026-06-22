package com.company.leavemanagement.controller;

import com.company.leavemanagement.dto.LeaveBalanceResponse;
import com.company.leavemanagement.service.LeaveRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-balances")
@CrossOrigin(origins = "*")
public class LeaveBalanceController {

    private final LeaveRequestService leaveRequestService;

    public LeaveBalanceController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<LeaveBalanceResponse>> getBalances(@PathVariable Long userId) {
        List<LeaveBalanceResponse> balances = leaveRequestService.getBalancesForUser(userId);
        return ResponseEntity.ok(balances);
    }
}