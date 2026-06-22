
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllLeaves } from '../api/leaveApi';
import type { LeaveResponse } from '../types/leave';
import LeaveForm from '../components/LeaveForm';
import LeaveBalance from '../components/LeaveBalance';
import LeaveCalendar from '../components/LeaveCalendar';
import '../styles/shared.css';
import './Dashboard.css';

function EmployeeDashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchLeaves() {
    if (!user) return;
    setLoading(true);
    try {
      const allLeaves = await getAllLeaves();
      const myLeaves = allLeaves.filter((leave) => leave.userId === user.id);
      setLeaves(myLeaves);
    } catch (err) {
      setError('Failed to load your leave requests');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName}</h1>
      </div>

      <div className="card">
        <h2>Leave Balance</h2>
        {user && <LeaveBalance userId={user.id} />}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2>Apply for Leave</h2>
          {user && <LeaveForm userId={user.id} onSuccess={fetchLeaves} />}
        </div>

        <div className="card">
          <h2>My Leave Requests</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && leaves.length === 0 && (
            <p className="empty-state">You haven't applied for any leave yet.</p>
          )}

          {!loading && !error && leaves.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.leaveType}</td>
                    <td>{leave.startDate} – {leave.endDate}</td>
                    <td>{leave.totalDays}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`badge badge-${leave.status}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="card">
      
        {user && <LeaveCalendar userId={user.id} />}
      </div>
    </div>
  );
}

export default EmployeeDashboard;