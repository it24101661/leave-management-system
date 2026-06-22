package com.company.leavemanagement.entity;

import com.company.leavemanagement.enums.LeaveType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_balances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalances {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false)
    private LeaveType leaveType;

    @Column(name = "total_days", nullable = false)
    private Integer totalDays = 14;

    @Column(name = "used_days", nullable = false)
    private Integer usedDays = 0;
}