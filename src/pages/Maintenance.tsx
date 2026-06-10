import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import type { MaintenanceRecord } from '@/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import StatusBadge from '@/components/StatusBadge';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Maintenance: React.FC = () => {
  const { maintenance, addMaintenance, updateMaintenance, deleteMaintenance, vehicles, getVehicleById } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<MaintenanceRecord | null>(null);
  const [search, setSearch] = useState('');

  const emptyForm = {
    vehicleId: vehicles[0]?.id || '',
    type: 'oil_change' as MaintenanceRecord['type'],
    description: '',
    cost: 0,
    date: '',
    status: 'scheduled' as MaintenanceRecord['status'],
    nextDueDate: '',
    vendor: '',
    createdAt: new Date().toISOString().split('T')[0],
  };

  const [form, setForm] = useState(emptyForm);

  const filtered = maintenance.filter(m => {
    const vehicle = getVehicleById(m.vehicleId);
    const text = `${vehicle?.make || ''} ${vehicle?.model || ''} ${m.type} ${m.vendor || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };

  const openEdit = (m: MaintenanceRecord) => {
    setEditing(m);
    setForm({ vehicleId: m.vehicleId, type: m.type, description: m.description, cost: m.cost, date: m.date, status: m.status, nextDueDate: m.nextDueDate || '', vendor: m.vendor || '', createdAt: m.createdAt });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record = { ...form, nextDueDate: form.nextDueDate || undefined, vendor: form.vendor || undefined };
    if (editing) {
      updateMaintenance({ ...record, id: editing.id });
    } else {
      addMaintenance({ ...record, id: uuidv4() });
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) deleteMaintenance(deleteId); setDeleteId(null); };

  const typeLabels: Record<string, string> = {
    oil_change: 'Oil Change',
    tire_rotation: 'Tire Rotation',
    brake_service: 'Brake Service',
    engine_repair: 'Engine Repair',
    inspection: 'Inspection',
    other: 'Other',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
          <p className="text-gray-500 mt-1">Track vehicle maintenance records</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium">
          <Plus size={18} /> New Record
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search maintenance..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Vehicle</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Cost</th>
                <th className="text-left px-4 py-3 font-medium">Vendor</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(m => {
                const vehicle = getVehicleById(m.vehicleId);
                return (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}</td>
                    <td className="px-4 py-3 text-gray-600">{typeLabels[m.type] || m.type}</td>
                    <td className="px-4 py-3 text-gray-600">{m.date}</td>
                    <td className="px-4 py-3 text-gray-600">${m.cost}</td>
                    <td className="px-4 py-3 text-gray-600">{m.vendor || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(m)} className="text-gray-400 hover:text-primary mr-2"><Edit2 size={16} /></button>
                      <button onClick={() => { setDeleteId(m.id); setConfirmOpen(true); }} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No maintenance records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Record' : 'New Maintenance Record'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
              <select required value={form.vehicleId} onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as MaintenanceRecord['type'] }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
              <input type="number" required value={form.cost} onChange={e => setForm(f => ({ ...f, cost: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as MaintenanceRecord['status'] }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
              <input type="date" value={form.nextDueDate} onChange={e => setForm(f => ({ ...f, nextDueDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark">{editing ? 'Update' : 'Create'} Record</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Record" message="Are you sure you want to delete this maintenance record?" />
    </div>
  );
};

export default Maintenance;
