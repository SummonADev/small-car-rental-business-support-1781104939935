import React from 'react';
import { useData } from '@/context/DataContext';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { Car, CalendarDays, Wrench, Users, DollarSign, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { vehicles, bookings, monthlyRentals, maintenance, customers, getVehicleById, getCustomerById } = useData();

  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
  const activeRentals = monthlyRentals.filter(r => r.status === 'active').length;
  const pendingMaintenance = maintenance.filter(m => m.status === 'scheduled' || m.status === 'in_progress').length;

  const bookingRevenue = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalCost, 0);
  const rentalRevenue = monthlyRentals.filter(r => r.status !== 'cancelled').reduce((sum, r) => sum + r.monthlyRate, 0);
  const totalRevenue = bookingRevenue + rentalRevenue;
  const maintenanceCost = maintenance.reduce((sum, m) => sum + m.cost, 0);

  const recentBookings = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const upcomingMaintenance = maintenance.filter(m => m.status !== 'completed').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your rental business.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Vehicles" value={vehicles.length} icon={Car} />
        <StatCard title="Available" value={availableVehicles} icon={Car} color="text-emerald-600" />
        <StatCard title="Active Bookings" value={activeBookings} icon={CalendarDays} color="text-blue-600" />
        <StatCard title="Monthly Rentals" value={activeRentals} icon={TrendingUp} color="text-purple-600" />
        <StatCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="text-emerald-600" />
        <StatCard title="Maintenance" value={pendingMaintenance} icon={Wrench} color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBookings.length === 0 && (
              <p className="p-5 text-sm text-gray-500">No bookings yet.</p>
            )}
            {recentBookings.map(b => {
              const vehicle = getVehicleById(b.vehicleId);
              const customer = getCustomerById(b.customerId);
              return (
                <div key={b.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'} • {b.startDate} to {b.endDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">${b.totalCost}</span>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Maintenance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Maintenance</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingMaintenance.length === 0 && (
              <p className="p-5 text-sm text-gray-500">No scheduled maintenance.</p>
            )}
            {upcomingMaintenance.map(m => {
              const vehicle = getVehicleById(m.vehicleId);
              return (
                <div key={m.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {m.type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'} • {m.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">${m.cost}</span>
                      <StatusBadge status={m.status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fleet Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Fleet Overview</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 divide-x divide-gray-100">
          {['sedan', 'suv', 'truck', 'van', 'compact', 'luxury'].map(cat => {
            const count = vehicles.filter(v => v.category === cat).length;
            return (
              <div key={cat} className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-500 capitalize mt-1">{cat}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
