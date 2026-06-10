import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Vehicle, Customer, Booking, MonthlyRental, MaintenanceRecord } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { createLinkedSeedData } from '@/lib/seedData';

interface DataContextType {
  vehicles: Vehicle[];
  customers: Customer[];
  bookings: Booking[];
  monthlyRentals: MonthlyRental[];
  maintenance: MaintenanceRecord[];
  addVehicle: (v: Vehicle) => void;
  updateVehicle: (v: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  addCustomer: (c: Customer) => void;
  updateCustomer: (c: Customer) => void;
  deleteCustomer: (id: string) => void;
  addBooking: (b: Booking) => void;
  updateBooking: (b: Booking) => void;
  deleteBooking: (id: string) => void;
  addMonthlyRental: (r: MonthlyRental) => void;
  updateMonthlyRental: (r: MonthlyRental) => void;
  deleteMonthlyRental: (id: string) => void;
  addMaintenance: (m: MaintenanceRecord) => void;
  updateMaintenance: (m: MaintenanceRecord) => void;
  deleteMaintenance: (id: string) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
  getCustomerById: (id: string) => Customer | undefined;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

function initData() {
  const hasData = localStorage.getItem('summon_vehicles');
  if (hasData) {
    return {
      vehicles: loadFromStorage<Vehicle[]>('vehicles', []),
      customers: loadFromStorage<Customer[]>('customers', []),
      bookings: loadFromStorage<Booking[]>('bookings', []),
      monthlyRentals: loadFromStorage<MonthlyRental[]>('monthlyRentals', []),
      maintenance: loadFromStorage<MaintenanceRecord[]>('maintenance', []),
    };
  }
  return createLinkedSeedData();
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(initData);

  useEffect(() => { saveToStorage('vehicles', data.vehicles); }, [data.vehicles]);
  useEffect(() => { saveToStorage('customers', data.customers); }, [data.customers]);
  useEffect(() => { saveToStorage('bookings', data.bookings); }, [data.bookings]);
  useEffect(() => { saveToStorage('monthlyRentals', data.monthlyRentals); }, [data.monthlyRentals]);
  useEffect(() => { saveToStorage('maintenance', data.maintenance); }, [data.maintenance]);

  const addVehicle = useCallback((v: Vehicle) => setData(d => ({ ...d, vehicles: [...d.vehicles, v] })), []);
  const updateVehicle = useCallback((v: Vehicle) => setData(d => ({ ...d, vehicles: d.vehicles.map(x => x.id === v.id ? v : x) })), []);
  const deleteVehicle = useCallback((id: string) => setData(d => ({ ...d, vehicles: d.vehicles.filter(x => x.id !== id) })), []);

  const addCustomer = useCallback((c: Customer) => setData(d => ({ ...d, customers: [...d.customers, c] })), []);
  const updateCustomer = useCallback((c: Customer) => setData(d => ({ ...d, customers: d.customers.map(x => x.id === c.id ? c : x) })), []);
  const deleteCustomer = useCallback((id: string) => setData(d => ({ ...d, customers: d.customers.filter(x => x.id !== id) })), []);

  const addBooking = useCallback((b: Booking) => setData(d => ({ ...d, bookings: [...d.bookings, b] })), []);
  const updateBooking = useCallback((b: Booking) => setData(d => ({ ...d, bookings: d.bookings.map(x => x.id === b.id ? b : x) })), []);
  const deleteBooking = useCallback((id: string) => setData(d => ({ ...d, bookings: d.bookings.filter(x => x.id !== id) })), []);

  const addMonthlyRental = useCallback((r: MonthlyRental) => setData(d => ({ ...d, monthlyRentals: [...d.monthlyRentals, r] })), []);
  const updateMonthlyRental = useCallback((r: MonthlyRental) => setData(d => ({ ...d, monthlyRentals: d.monthlyRentals.map(x => x.id === r.id ? r : x) })), []);
  const deleteMonthlyRental = useCallback((id: string) => setData(d => ({ ...d, monthlyRentals: d.monthlyRentals.filter(x => x.id !== id) })), []);

  const addMaintenance = useCallback((m: MaintenanceRecord) => setData(d => ({ ...d, maintenance: [...d.maintenance, m] })), []);
  const updateMaintenance = useCallback((m: MaintenanceRecord) => setData(d => ({ ...d, maintenance: d.maintenance.map(x => x.id === m.id ? m : x) })), []);
  const deleteMaintenance = useCallback((id: string) => setData(d => ({ ...d, maintenance: d.maintenance.filter(x => x.id !== id) })), []);

  const getVehicleById = useCallback((id: string) => data.vehicles.find(v => v.id === id), [data.vehicles]);
  const getCustomerById = useCallback((id: string) => data.customers.find(c => c.id === id), [data.customers]);

  return (
    <DataContext.Provider value={{
      ...data,
      addVehicle, updateVehicle, deleteVehicle,
      addCustomer, updateCustomer, deleteCustomer,
      addBooking, updateBooking, deleteBooking,
      addMonthlyRental, updateMonthlyRental, deleteMonthlyRental,
      addMaintenance, updateMaintenance, deleteMaintenance,
      getVehicleById, getCustomerById,
    }}>
      {children}
    </DataContext.Provider>
  );
};
