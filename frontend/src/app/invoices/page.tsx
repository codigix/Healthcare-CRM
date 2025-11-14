'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { invoiceAPI, patientAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, Download, Search } from 'lucide-react';
import Modal from '@/components/UI/Modal';
import InvoiceForm from '@/components/Forms/InvoiceForm';

interface Invoice {
  id: string;
  amount: number;
  status: string;
  date: string;
  patientId: string;
  dueDate?: string;
  notes?: string;
  patient?: { id: string; name: string };
}

interface Patient {
  id: string;
  name: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [page, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const filters: any = { page, limit: 10 };
      if (statusFilter) filters.status = statusFilter;

      const [invoicesRes, patientsRes] = await Promise.all([
        invoiceAPI.list(page, 10, filters),
        patientAPI.list(1, 100),
      ]);

      setInvoices(invoicesRes.data.invoices);
      setTotal(invoicesRes.data.total);
      setPatients(patientsRes.data.patients);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete invoice', error);
      }
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await invoiceAPI.downloadPdf(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Failed to download PDF', error);
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setEditingId(invoice.id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingInvoice(null);
    setEditingId(null);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-tertiary';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Invoices</h1>
            <p className="text-gray-400">Manage patient billing and invoices</p>
          </div>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            New Invoice
          </button>
        </div>

        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 flex items-center gap-2 bg-dark-tertiary rounded-lg px-4">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                className="bg-transparent py-3 flex-1 outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Invoice ID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Patient</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary transition-colors">
                      <td className="py-3 px-4 font-mono text-sm">{inv.id.substring(0, 8)}</td>
                      <td className="py-3 px-4">{inv.patient.name}</td>
                      <td className="py-3 px-4 font-semibold">${inv.amount}</td>
                      <td className="py-3 px-4">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`status-badge ${getStatusColor(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(inv.id)}
                            className="p-2 hover:bg-green-500 hover:bg-opacity-20 rounded transition-colors"
                            title="Download PDF"
                          >
                            <Download size={18} className="text-green-500" />
                          </button>
                          <button
                            onClick={() => handleEdit(inv)}
                            className="p-2 hover:bg-blue-500 hover:bg-opacity-20 rounded transition-colors"
                          >
                            <Edit2 size={18} className="text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(inv.id)}
                            className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-400 text-sm">Showing 1 to {invoices.length} of {total}</p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page * 10 >= total}
                onClick={() => setPage(page + 1)}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Invoice' : 'New Invoice'}>
        <InvoiceForm
          invoice={editingInvoice}
          patients={patients}
          onSuccess={() => {
            setShowModal(false);
            fetchData();
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}
