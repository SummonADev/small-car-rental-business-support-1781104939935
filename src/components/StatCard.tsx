import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'text-primary' }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && <p className="text-xs text-emerald-600 mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-gray-50 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
