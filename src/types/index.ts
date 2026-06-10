export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  category: 'sedan' | 'suv' | 'truck' | 'van' | 'compact' | 'luxury';
  dailyRate: number;
  monthlyRate: number;
  status: 'available' | 'rented' | 'maintenance';
  mileage: number;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  driversLicense: string;
  address: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
}

export interface MonthlyRental {
  id: string;
  vehicleId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  monthlyRate: number;
  status: 'active' | 'expired' | 'cancelled';
  notes: string;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'oil_change' | 'tire_rotation' | 'brake_service' | 'engine_repair' | 'inspection' | 'other';
  description: string;
  cost: number;
  date: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  nextDueDate?: string;
  vendor?: string;
  createdAt: string;
}
