'use client';

import { useState, useEffect } from 'react';
import { invoiceAPI } from '@/lib/api';

interface Invoice {
  id?: string;
  patientId: string;
  amount: number;
  status: string;
  dueDate?: string;
  notes?: string;
  patient?: { id: string; name: string };
}

interface Patient {
  id: string;
  name: string;
}

interface InvoiceFormProps {
  invoice?: Invoice | null;
  patients: Patient[];
  onSuccess: () => void;
}

export default function InvoiceForm({ invoice, patients, onSuccess }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Invoice>({
    patientId: '',
    amount: 0,
    status: 'pending',
    dueDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        patientId: invoice.patient?.id || '',
        dueDate: invoice.dueDate?.split('T')[0] || '',
      });
    }
  }, [invoice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (invoice?.id) {
        await invoiceAPI.update(invoice.id, formData);
      } else {
        await invoiceAPI.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Patient
        </label>
        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          className="input-field w-full"
          required
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="0.00"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="input-field w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input-field w-full"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="Add invoice notes..."
          rows={3}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Saving...' : 'Save Invoice'}
      </button>
    </form>
  );
}
