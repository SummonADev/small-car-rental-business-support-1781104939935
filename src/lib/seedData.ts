import { v4 as uuidv4 } from 'uuid';
import type { Vehicle, Customer, Booking, MonthlyRental, MaintenanceRecord } from '@/types';

export const seedVehicles: Vehicle[] = [
  {
    id: uuidv4(),
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    licensePlate: 'ABC-1234',
    color: 'Silver',
    category: 'sedan',
    dailyRate: 55,
    monthlyRate: 1200,
    status: 'available',
    mileage: 12500,
  },
  {
    id: uuidv4(),
    make: 'Honda',
    model: 'CR-V',
    year: 2024,
    licensePlate: 'DEF-5678',
    color: 'White',
    category: 'suv',
    dailyRate: 75,
    monthlyRate: 1600,
    status: 'rented',
    mileage: 8200,
  },
  {
    id: uuidv4(),
    make: 'Ford',
    model: 'F-150',
    year: 2023,
    licensePlate: 'GHI-9012',
    color: 'Black',
    category: 'truck',
    dailyRate: 85,
    monthlyRate: 1800,
    status: 'available',
    mileage: 15300,
  },
  {
    id: uuidv4(),
    make: 'BMW',
    model: '5 Series',
    year: 2024,
    licensePlate: 'JKL-3456',
    color: 'Blue',
    category: 'luxury',
    dailyRate: 120,
    monthlyRate: 2800,
    status: 'maintenance',
    mileage: 5100,
  },
  {
    id: uuidv4(),
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    licensePlate: 'MNO-7890',
    color: 'Red',
    category: 'compact',
    dailyRate: 45,
    monthlyRate: 950,
    status: 'available',
    mileage: 18900,
  },
  {
    id: uuidv4(),
    make: 'Toyota',
    model: 'Sienna',
    year: 2023,
    licensePlate: 'PQR-1122',
    color: 'Gray',
    category: 'van',
    dailyRate: 90,
    monthlyRate: 1900,
    status: 'available',
    mileage: 22100,
  },
];

export const seedCustomers: Customer[] = [
  {
    id: uuidv4(),
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    driversLicense: 'DL-98765432',
    address: '123 Main St, Anytown, USA',
    createdAt: '2024-01-15',
  },
  {
    id: uuidv4(),
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    driversLicense: 'DL-12345678',
    address: '456 Oak Ave, Springfield, USA',
    createdAt: '2024-02-20',
  },
  {
    id: uuidv4(),
    firstName: 'Mike',
    lastName: 'Williams',
    email: 'mike.w@email.com',
    phone: '(555) 456-7890',
    driversLicense: 'DL-55667788',
    address: '789 Pine Rd, Lakewood, USA',
    createdAt: '2024-03-10',
  },
];

export const seedBookings: Booking[] = [
  {
    id: uuidv4(),
    vehicleId: '',
    customerId: '',
    startDate: '2024-12-01',
    endDate: '2024-12-05',
    totalCost: 275,
    status: 'completed',
    notes: 'Business trip rental',
    createdAt: '2024-11-28',
  },
  {
    id: uuidv4(),
    vehicleId: '',
    customerId: '',
    startDate: '2025-01-10',
    endDate: '2025-01-17',
    totalCost: 525,
    status: 'active',
    notes: 'Family vacation',
    createdAt: '2025-01-05',
  },
  {
    id: uuidv4(),
    vehicleId: '',
    customerId: '',
    startDate: '2025-02-01',
    endDate: '2025-02-03',
    totalCost: 170,
    status: 'confirmed',
    notes: 'Weekend trip',
    createdAt: '2025-01-20',
  },
];

export const seedMonthlyRentals: MonthlyRental[] = [
  {
    id: uuidv4(),
    vehicleId: '',
    customerId: '',
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    monthlyRate: 1600,
    status: 'active',
    notes: 'Long term business rental',
    createdAt: '2024-12-20',
  },
];

export const seedMaintenance: MaintenanceRecord[] = [
  {
    id: uuidv4(),
    vehicleId: '',
    type: 'oil_change',
    description: 'Regular oil change and filter replacement',
    cost: 75,
    date: '2025-01-05',
    status: 'completed',
    nextDueDate: '2025-04-05',
    vendor: 'Quick Lube Auto',
    createdAt: '2025-01-03',
  },
  {
    id: uuidv4(),
    vehicleId: '',
    type: 'brake_service',
    description: 'Front and rear brake pad replacement',
    cost: 450,
    date: '2025-01-20',
    status: 'in_progress',
    vendor: 'City Auto Service',
    createdAt: '2025-01-18',
  },
  {
    id: uuidv4(),
    vehicleId: '',
    type: 'inspection',
    description: 'Annual vehicle safety inspection',
    cost: 50,
    date: '2025-02-15',
    status: 'scheduled',
    vendor: 'State Inspection Center',
    createdAt: '2025-01-25',
  },
];

export function createLinkedSeedData() {
  const vehicles = [...seedVehicles];
  const customers = [...seedCustomers];

  const bookings = seedBookings.map((b, i) => ({
    ...b,
    vehicleId: vehicles[i % vehicles.length].id,
    customerId: customers[i % customers.length].id,
  }));

  const monthlyRentals = seedMonthlyRentals.map((r) => ({
    ...r,
    vehicleId: vehicles[1].id,
    customerId: customers[1].id,
  }));

  const maintenance = seedMaintenance.map((m, i) => ({
    ...m,
    vehicleId: vehicles[i < 2 ? 3 : 0].id,
  }));

  return { vehicles, customers, bookings, monthlyRentals, maintenance };
}
