import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'vehicle' | 'booking' | 'maintenance' | 'rental';
}

const colorMap: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  rented: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  active: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-amber-100 text-amber-800',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colors = colorMap[status] || 'bg-gray-100 text-gray-800';
  const label = status.replace(/_/g, ' ');

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
