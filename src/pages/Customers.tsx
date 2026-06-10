import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import type { Customer } from '@/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Customers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');

  const emptyForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    driversLicense: '',
    address: '',
    createdAt: new Date().toISOString().split('T')[0],
  };

  const [form, setForm] = useState(emptyForm);

  const filtered = customers.filter(c => {
    const text = `${c.firstName} ${c.lastName} ${c.email} ${c.phone} ${c.driversLicense}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      driversLicense: c.driversLicense,
      address: c.address,
      createdAt: c.createdAt,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateCustomer({ ...form, id: editing.id });
    } else {
      addCustomer({ ...form, id: uuidv4() });
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) deleteCustomer(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer database</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium">
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-left px-4 py-3 font-medium">Driver's License</th>
                <th className="text-left px-4 py-3 font-medium">Address</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.firstName} {c.lastName}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{c.driversLicense}</td>
                  <td className="px-4 py-3 text-gray-600">{c.address}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-primary mr-2"><Edit2 size={16} /></button>
                    <button onClick={() => { setDeleteId(c.id); setConfirmOpen(true); }} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Customer' : 'Add Customer'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver's License</label>
              <input required value={form.driversLicense} onChange={e => setForm(f => ({ ...f, driversLicense: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark">{editing ? 'Update' : 'Add'} Customer</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Customer" message="Are you sure you want to delete this customer? This action cannot be undone." />
    </div>
  );
};

export default Customers;
