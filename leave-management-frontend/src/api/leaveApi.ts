
import type { LeaveApplicationRequest, LeaveResponse, LeaveBalanceResponse } from '../types/leave';

// ... keep all your existing functions exactly as they are ...

export async function getLeaveBalances(userId: number): Promise<LeaveBalanceResponse[]> {
  const response = await fetch(`http://localhost:8080/api/leave-balances/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch leave balances');
  }

  return response.json();
}

const BASE_URL = 'http://localhost:8080/api/leaves';

export async function getAllLeaves(): Promise<LeaveResponse[]> {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch leave requests');
  }

  return response.json();
}

export async function applyLeave(request: LeaveApplicationRequest): Promise<void> {
  const response = await fetch(`${BASE_URL}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to submit leave application');
  }
}

export async function approveLeave(id: number, managerId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}/approve?managerId=${managerId}`, {
    method: 'PUT',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to approve leave request');
  }
}

export async function rejectLeave(id: number, managerId: number, managerNote: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}/reject?managerId=${managerId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'text/plain' },
    body: managerNote,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to reject leave request');
  }
}

export async function cancelLeave(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}/cancel`, {
    method: 'PUT',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to cancel leave request');
  }
}
