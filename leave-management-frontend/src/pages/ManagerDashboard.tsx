import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllLeaves, approveLeave, rejectLeave } from '../api/leaveApi';
import type { LeaveResponse } from '../types/leave';
import LeaveCalendar from '../components/LeaveCalendar';
import '../styles/shared.css';
import './Dashboard.css';

function ManagerDashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  async function fetchLeaves() {
    setLoading(true);
    try {
      const allLeaves = await getAllLeaves();
      setLeaves(allLeaves);
    } catch (err) {
      setError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaves();
  }, []);

  async function handleApprove(leaveId: number) {
    if (!user) return;
    try {
      await approveLeave(leaveId, user.id);
      fetchLeaves();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  }

  function handleRejectClick(leaveId: number) {
    setRejectingId(leaveId);
    setRejectNote('');
  }

  async function handleRejectConfirm() {
    if (!user || rejectingId === null) return;
    try {
      await rejectLeave(rejectingId, user.id, rejectNote);
      setRejectingId(null);
      fetchLeaves();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  }

  const pendingLeaves = leaves.filter((leave) => leave.status === 'PENDING');

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName}</h1>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Pending Leave Requests</h2>
          <span className="badge badge-PENDING">{pendingLeaves.length} pending</span>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && pendingLeaves.length === 0 && (
          <p className="empty-state">No pending leave requests.</p>
        )}

        {!loading && !error && pendingLeaves.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.userFirstName} {leave.userLastName}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.startDate} – {leave.endDate}</td>
                  <td>{leave.totalDays}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApprove(leave.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRejectClick(leave.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {rejectingId !== null && (
          <div
            style={{
              marginTop: '8px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              background: 'var(--color-bg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>Reason for rejection</p>
            <textarea
              placeholder="Let the employee know why this was rejected"
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              rows={3}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-danger btn-sm" onClick={handleRejectConfirm}>
                Confirm Reject
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setRejectingId(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Team Leave Calendar</h2>
        <LeaveCalendar />
      </div>
    </div>
  );
}

export default ManagerDashboard;