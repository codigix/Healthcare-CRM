'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { appointmentAPI, doctorAPI } from '@/lib/api';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  type?: string;
  doctor?: { id: string; name: string };
  patient?: { id: string; name: string };
}

interface Doctor {
  id: string;
  name: string;
}

export default function CalendarViewPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [currentDate, selectedDoctor]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, doctorsRes] = await Promise.all([
        appointmentAPI.list(1, 100),
        doctorAPI.list(1, 100),
      ]);
      setAppointments(appointmentsRes.data.appointments);
      setDoctors(doctorsRes.data.doctors);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const getAppointmentsForTimeSlot = (time: string) => {
    const currentDateStr = currentDate.toISOString().split('T')[0];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date).toISOString().split('T')[0];
      return aptDate === currentDateStr && apt.time.startsWith(time);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-blue-600 border-blue-700';
      case 'completed':
        return 'bg-blue-600 border-blue-700';
      case 'in progress':
        return 'bg-orange-500 border-orange-600';
      default:
        return 'bg-slate-600 border-slate-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Appointment Calendar</h1>
            <p className="text-gray-400">View and manage appointments in calendar view.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/appointments/all">
              <button className="btn-secondary flex items-center gap-2">
                <List size={20} />
                List View
              </button>
            </Link>
            <Link href="/appointments/add">
              <button className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                New
              </button>
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-center min-w-[250px]">
                <h2 className="text-2xl font-bold">
                  {view === 'day' ? getDayName(currentDate) : getMonthName(currentDate)}
                </h2>
              </div>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={goToToday}
                className="btn-secondary"
              >
                Today
              </button>
            </div>

            <div className="flex gap-3">
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="input-field"
              >
                <option value="all">All Doctors</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name}
                  </option>
                ))}
              </select>

              <div className="flex bg-dark-tertiary rounded-lg p-1">
                <button
                  onClick={() => setView('day')}
                  className={`px-4 py-2 rounded transition-colors ${
                    view === 'day' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-4 py-2 rounded transition-colors ${
                    view === 'week' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setView('month')}
                  className={`px-4 py-2 rounded transition-colors ${
                    view === 'month' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading calendar...</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-[100px_1fr] gap-0 border border-dark-tertiary rounded-lg overflow-hidden">
                  <div className="bg-blue-500/20 p-4 border-b border-dark-tertiary">
                    <span className="text-sm font-medium text-blue-100">Time</span>
                  </div>
                  <div className="bg-blue-500/20 p-4 border-b border-dark-tertiary">
                    <span className="text-sm font-medium text-blue-100">Appointments</span>
                  </div>

                  {timeSlots.map((time, index) => {
                    const slotAppointments = getAppointmentsForTimeSlot(time);
                    return (
                      <div key={time} className="contents">
                        <div className={`p-4 border-b border-dark-tertiary ${index % 2 === 0 ? 'bg-blue-400/15' : 'bg-blue-400/20'}`}>
                          <span className="text-sm font-medium text-blue-50">{time}</span>
                        </div>
                        <div className={`p-4 border-b border-dark-tertiary ${index % 2 === 0 ? 'bg-blue-400/15' : 'bg-blue-400/20'}`}>
                          {slotAppointments.length > 0 ? (
                            <div className="space-y-2">
                              {slotAppointments.map((apt) => (
                                <div
                                  key={apt.id}
                                  className={`p-3 rounded-lg border-l-4 ${getStatusColor(apt.status)} bg-opacity-10 hover:bg-opacity-20 transition-all cursor-pointer`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="font-medium text-white">{apt.patient?.name || 'N/A'}</div>
                                      <div className="text-sm text-gray-400">Dr. {apt.doctor?.name || 'N/A'}</div>
                                      <div className="text-xs text-gray-500 mt-1">{apt.type || 'Check-up'}</div>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded bg-blue-500/30">
                                      {apt.time}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-blue-100/60 italic">No appointments</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <CalendarIcon className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {appointments.filter(a => new Date(a.date).toDateString() === currentDate.toDateString()).length}
                </div>
                <div className="text-sm text-gray-400">Today's Appointments</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                <CalendarIcon className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {appointments.filter(a => a.status.toLowerCase() === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-400">Confirmed</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <CalendarIcon className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {appointments.filter(a => a.status.toLowerCase() === 'pending').length}
                </div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
