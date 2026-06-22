import { useEffect, useState } from 'react';
import { getLeaveBalances } from '../api/leaveApi';
import type { LeaveBalanceResponse } from '../types/leave';

interface LeaveBalanceProps {
  userId: number;
}

function LeaveBalance({ userId }: LeaveBalanceProps) {
  const [balances, setBalances] = useState<LeaveBalanceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBalances() {
      try {
        const data = await getLeaveBalances(userId);
        setBalances(data);
      } catch (err) {
        console.error('Failed to load leave balances', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBalances();
  }, [userId]);

  if (loading) {
    return <p>Loading balances...</p>;
  }

  return (
    <div className="balance-grid">
      {balances.map((balance) => (
        <div className="balance-tile" key={balance.leaveType}>
          <div className="balance-tile-type">{balance.leaveType}</div>
          <div className="balance-tile-remaining">{balance.remainingDays}</div>
          <div className="balance-tile-detail">
            of {balance.totalDays} days · {balance.usedDays} used
          </div>
        </div>
      ))}
    </div>
  );
}

export default LeaveBalance;