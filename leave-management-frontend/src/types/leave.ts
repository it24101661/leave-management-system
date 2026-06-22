export type LeaveType = 'ANNUAL' | 'SICK' | 'CASUAL';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveApplicationRequest {
  userId: number;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveResponse {
  id: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  reviewedById: number | null;
  reviewedByFirstName: string | null;
  managerNote: string | null;
  appliedAt: string;
  reviewedAt: string | null;
}
export interface LeaveBalanceResponse {
  leaveType: LeaveType;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}