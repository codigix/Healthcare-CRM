'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { appointmentAPI, doctorAPI, patientAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Modal from '@/components/UI/Modal';
import AppointmentForm from '@/components/Forms/AppointmentForm';

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  doctorId: string;
  patientId: string;
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

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [page, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const filters: any = { page, limit: 10 };
      if (statusFilter) filters.status = statusFilter;

      const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
        appointmentAPI.list(page, 10, filters),
        doctorAPI.list(1, 100),
        patientAPI.list(1, 100),
      ]);

      setAppointments(appointmentsRes.data.appointments);
      setTotal(appointmentsRes.data.total);
      setDoctors(doctorsRes.data.doctors);
      setPatients(patientsRes.data.patients);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete appointment', error);
      }
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setEditingId(appointment.id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingAppointment(null);
    setEditingId(null);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Appointments</h1>
            <p className="text-gray-400">Schedule and manage appointments</p>
          </div>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            New Appointment
          </button>
        </div>

        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 flex items-center gap-2 bg-dark-tertiary rounded-lg px-4">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Patient</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Doctor</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary transition-colors">
                      <td className="py-3 px-4">{apt.patient?.name || 'N/A'}</td>
                      <td className="py-3 px-4">{apt.doctor?.name || 'N/A'}</td>
                      <td className="py-3 px-4">{new Date(apt.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{apt.time}</td>
                      <td className="py-3 px-4">
                        <span className={`status-badge ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(apt)}
                            className="p-2 hover:bg-blue-500 hover:bg-opacity-20 rounded transition-colors"
                          >
                            <Edit2 size={18} className="text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(apt.id)}
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
            <p className="text-gray-400 text-sm">Showing 1 to {appointments.length} of {total}</p>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Appointment' : 'New Appointment'}>
        <AppointmentForm
          appointment={editingAppointment}
          doctors={doctors}
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
