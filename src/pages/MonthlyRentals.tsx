import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import type { MonthlyRental } from '@/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import StatusBadge from '@/components/StatusBadge';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const MonthlyRentals: React.FC = () => {
  const { monthlyRentals, addMonthlyRental, updateMonthlyRental, deleteMonthlyRental, vehicles, customers, getVehicleById, getCustomerById } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<MonthlyRental | null>(null);
  const [search, setSearch] = useState('');

  const emptyForm = {
    vehicleId: vehicles[0]?.id || '',
    customerId: customers[0]?.id || '',
    startDate: '',
    endDate: '',
    monthlyRate: 0,
    status: 'active' as MonthlyRental['status'],
    notes: '',
    createdAt: new Date().toISOString().split('T')[0],
  };

  const [form, setForm] = useState(emptyForm);

  const filtered = monthlyRentals.filter(r => {
    const vehicle = getVehicleById(r.vehicleId);
    const customer = getCustomerById(r.customerId);
    const text = `${vehicle?.make || ''} ${vehicle?.model || ''} ${customer?.firstName || ''} ${customer?.lastName || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };

  const openEdit = (r: MonthlyRental) => {
    setEditing(r);
    setForm({ vehicleId: r.vehicleId, customerId: r.customerId, startDate: r.startDate, endDate: r.endDate, monthlyRate: r.monthlyRate, status: r.status, notes: r.notes, createdAt: r.createdAt });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMonthlyRental({ ...form, id: editing.id });
    } else {
      addMonthlyRental({ ...form, id: uuidv4() });
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) deleteMonthlyRental(deleteId); setDeleteId(null); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Rentals</h1>
          <p className="text-gray-500 mt-1">Manage long-term rental agreements</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium">
          <Plus size={18} /> New Rental
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search rentals..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Vehicle</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Period</th>
                <th className="text-left px-4 py-3 font-medium">Monthly Rate</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => {
                const vehicle = getVehicleById(r.vehicleId);
                const customer = getCustomerById(r.customerId);
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}</td>
                    <td className="px-4 py-3 text-gray-600">{customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.startDate} — {r.endDate}</td>
                    <td className="px-4 py-3 text-gray-600">${r.monthlyRate}/mo</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(r)} className="text-gray-400 hover:text-primary mr-2"><Edit2 size={16} /></button>
                      <button onClick={() => { setDeleteId(r.id); setConfirmOpen(true); }} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No monthly rentals found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Rental' : 'New Monthly Rental'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
              <select required value={form.vehicleId} onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select required value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {customers.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" required value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" required value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate ($)</label>
              <input type="number" required value={form.monthlyRate} onChange={e => setForm(f => ({ ...f, monthlyRate: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as MonthlyRental['status'] }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark">{editing ? 'Update' : 'Create'} Rental</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Rental" message="Are you sure you want to delete this monthly rental?" />
    </div>
  );
};

export default MonthlyRentals;
