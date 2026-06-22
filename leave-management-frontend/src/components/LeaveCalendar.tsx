import { useEffect, useState } from 'react';
import { getAllLeaves } from '../api/leaveApi';
import type { LeaveResponse } from '../types/leave';

interface LeaveCalendarProps {
  userId?: number;
}

function LeaveCalendar({ userId }: LeaveCalendarProps) {
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaves() {
      try {
        const allLeaves = await getAllLeaves();
        let approvedOnly = allLeaves.filter((leave) => leave.status === 'APPROVED');

        if (userId !== undefined) {
          approvedOnly = approvedOnly.filter((leave) => leave.userId === userId);
        }

        setLeaves(approvedOnly);
      } catch (err) {
        console.error('Failed to load leaves for calendar', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaves();
  }, [userId]);

  if (loading) {
    return <p>Loading calendar...</p>;
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startWeekday = firstDayOfMonth.getDay();

  const monthName = today.toLocaleString('default', { month: 'long' });

  function getLeavesForDay(day: number): LeaveResponse[] {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return leaves.filter((leave) => {
      return dateStr >= leave.startDate && dateStr <= leave.endDate;
    });
  }

  const dayCells = [];

  for (let i = 0; i < startWeekday; i++) {
    dayCells.push(<td key={`empty-${i}`} className="calendar-cell"></td>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayLeaves = getLeavesForDay(day);

    dayCells.push(
      <td key={day} className="calendar-cell">
        <div className="calendar-day-number">{day}</div>
        {dayLeaves.map((leave) => (
          <div key={leave.id} className="calendar-tag">
            {userId !== undefined ? leave.leaveType : `${leave.userFirstName} · ${leave.leaveType}`}
          </div>
        ))}
      </td>
    );
  }

  const weeks = [];
  for (let i = 0; i < dayCells.length; i += 7) {
    weeks.push(dayCells.slice(i, i + 7));
  }

  return (
    <div>
      <p style={{ marginBottom: '12px', fontWeight: 600, color: 'var(--color-text)' }}>
        {monthName} {year}
      </p>
      <table className="calendar-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>{week}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveCalendar;