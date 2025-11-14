'use client';

import { useState, useEffect } from 'react';
import { appointmentAPI } from '@/lib/api';

interface Appointment {
  id?: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  doctor?: { id: string; name: string };
  patient?: { id: string; name: string };
}

interface Doctor {
  id: string;
  name: string;
}

interface Patient {
  id: string;
  name: string;
}

interface AppointmentFormProps {
  appointment?: Appointment | null;
  doctors: Doctor[];
  patients: Patient[];
  onSuccess: () => void;
}

export default function AppointmentForm({ appointment, doctors, patients, onSuccess }: AppointmentFormProps) {
  const [formData, setFormData] = useState<Appointment>({
    doctorId: '',
    patientId: '',
    date: '',
    time: '',
    status: 'pending',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (appointment) {
      setFormData({
        ...appointment,
        doctorId: appointment.doctor?.id || '',
        patientId: appointment.patient?.id || '',
        date: appointment.date.split('T')[0],
      });
    }
  }, [appointment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (appointment?.id) {
        await appointmentAPI.update(appointment.id, formData);
      } else {
        await appointmentAPI.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save appointment');
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
          Doctor
        </label>
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="input-field w-full"
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="input-field w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Time
        </label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="input-field w-full"
          required
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
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
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
          placeholder="Add appointment notes..."
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
        {loading ? 'Saving...' : 'Save Appointment'}
      </button>
    </form>
  );
}
