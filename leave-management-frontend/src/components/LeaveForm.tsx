import { useState } from 'react';
import { applyLeave } from '../api/leaveApi';
import type { LeaveType } from '../types/leave';

interface LeaveFormProps {
  userId: number;
  onSuccess: () => void;
}

function LeaveForm({ userId, onSuccess }: LeaveFormProps) {
  const [leaveType, setLeaveType] = useState<LeaveType>('ANNUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await applyLeave({ userId, leaveType, startDate, endDate, reason });
      setStartDate('');
      setEndDate('');
      setReason('');
      setLeaveType('ANNUAL');
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit leave application');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="field">
        <label>Leave Type</label>
        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value as LeaveType)}
        >
          <option value="ANNUAL">Annual</option>
          <option value="SICK">Sick</option>
          <option value="CASUAL">Casual</option>
        </select>
      </div>

      <div className="field">
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label>Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={3}
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Apply for Leave'}
      </button>
    </form>
  );
}

export default LeaveForm;