'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { appointmentAPI, doctorAPI, patientAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, Search, Calendar, Filter, MoreVertical } from 'lucide-react';
import Modal from '@/components/UI/Modal';
import AppointmentForm from '@/components/Forms/AppointmentForm';
import Link from 'next/link';

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  type?: string;
  duration?: string;
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

export default function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchData();
  }, [page, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const filters: any = { page, limit: 10 };
      if (statusFilter && statusFilter !== 'all') filters.status = statusFilter;

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
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'in progress':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const tabs = [
    { id: 'all', label: 'All Appointments' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'today', label: 'Today' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Appointments</h1>
            <p className="text-gray-400">Manage your clinic's appointments and schedules.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/appointments/calendar">
              <button className="btn-secondary flex items-center gap-2">
                <Calendar size={20} />
                Calendar View
              </button>
            </Link>
            <Link href="/appointments/add">
              <button className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                New Appointment
              </button>
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="border-b border-dark-tertiary mb-6">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'all') setStatusFilter('all');
                    else if (tab.id === 'completed') setStatusFilter('completed');
                    else if (tab.id === 'cancelled') setStatusFilter('cancelled');
                  }}
                  className={`pb-4 px-2 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-emerald-500'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-dark-tertiary rounded-lg px-4">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent py-3 flex-1 outline-none"
              />
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <Filter size={20} />
              Filter
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Patient</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Doctor</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Date & Time</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Type</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Duration</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-semibold">
                            {apt.patient?.name?.charAt(0) || '?'}
                          </div>
                          <span className="font-medium">{apt.patient?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300">Dr. {apt.doctor?.name || 'Unassigned'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-white">{new Date(apt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          <span className="text-sm text-gray-400">{apt.time}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300">{apt.type || 'Check-up'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300">{apt.duration || '30 min'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(apt)}
                            className="p-2 hover:bg-blue-500/20 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} className="text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(apt.id)}
                            className="p-2 hover:bg-red-500/20 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                          <button className="p-2 hover:bg-gray-500/20 rounded transition-colors" title="More">
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-tertiary">
            <p className="text-gray-400 text-sm">
              Showing {appointments.length > 0 ? ((page - 1) * 10) + 1 : 0} to {Math.min(page * 10, total)} of {total} appointments
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page * 10 >= total}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
