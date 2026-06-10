import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Vehicles from '@/pages/Vehicles';
import Bookings from '@/pages/Bookings';
import MonthlyRentals from '@/pages/MonthlyRentals';
import Maintenance from '@/pages/Maintenance';
import Customers from '@/pages/Customers';
import { DataProvider } from '@/context/DataContext';

const App: React.FC = () => {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="monthly-rentals" element={<MonthlyRentals />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="customers" element={<Customers />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </DataProvider>
  );
};

export default App;
