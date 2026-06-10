import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  CalendarRange,
  Wrench,
  Users,
  X,
} from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/vehicles', icon: Car, label: 'Vehicles' },
  { to: '/bookings', icon: CalendarDays, label: 'Bookings' },
  { to: '/monthly-rentals', icon: CalendarRange, label: 'Monthly Rentals' },
  { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { to: '/customers', icon: Users, label: 'Customers' },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <div className="w-64 h-screen bg-sidebar text-white flex flex-col">
      <div className="p-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-bold text-sidebar text-lg">
            S
          </div>
          <span className="text-xl font-bold tracking-tight">Summon</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-white/70 hover:text-white hover:bg-sidebar-hover'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/40">Summon v1.0</p>
        <p className="text-xs text-white/40">Car Rental Management</p>
      </div>
    </div>
  );
};

export default Sidebar;
