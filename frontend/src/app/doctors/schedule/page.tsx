'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Loader } from 'lucide-react';
import Link from 'next/link';
import { doctorAPI, appointmentAPI } from '@/lib/api';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  experience: number;
  avatar?: string;
  schedule?: string;
}

interface Appointment {
  id: string;
  time: string;
  patient: {
    name: string;
  };
  doctorId: string;
  doctor: Doctor;
  status: string;
  date: string;
  notes?: string;
}

export default function DoctorSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month' | 'list'>('day');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setDoctorsLoading(true);
        const response = await doctorAPI.list(1, 100);
        setDoctors(response.data.doctors);
      } catch (err) {
        setError('Failed to fetch doctors');
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);

        const filters: any = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        if (selectedDoctor !== 'all') {
          filters.doctorId = selectedDoctor;
        }

        const response = await appointmentAPI.list(1, 100, filters);
        setAppointments(response.data.appointments);
      } catch (err) {
        setError('Failed to fetch appointments');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate, selectedDoctor]);

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const currentMonth = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(selectedDate);

  const previousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const selectedDateStr = selectedDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleDateClick = (day: number | null) => {
    if (day !== null) {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
    }
  };

  const getWeekDates = () => {
    const curr = new Date(selectedDate);
    const first = curr.getDate() - curr.getDay();
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(new Date(curr.setDate(first + i)));
    }
    return weekDates;
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date).toDateString();
      return aptDate === date.toDateString();
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/doctors" className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Doctor Schedule</h1>
            <p className="text-gray-400">Manage and view doctor schedules and appointments.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-4">Calendar</h3>
                <p className="text-sm text-gray-400">Select a date to view schedules.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{currentMonth}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={previousMonth}
                      className="p-1 hover:bg-dark-tertiary rounded transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-1 hover:bg-dark-tertiary rounded transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center text-xs text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                  {days.map((day, index) => {
                    const isSelected = day === selectedDate.getDate() && 
                                     selectedDate.getMonth() === new Date().getMonth() &&
                                     selectedDate.getFullYear() === new Date().getFullYear();
                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(day)}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                          day === null
                            ? 'invisible'
                            : isSelected
                            ? 'bg-emerald-500 text-white font-semibold'
                            : 'hover:bg-dark-tertiary'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-dark-tertiary">
                <h4 className="font-semibold mb-4">Filter by Doctor</h4>
                {doctorsLoading ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Loader size={16} className="animate-spin" />
                    Loading doctors...
                  </div>
                ) : (
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="all">All Doctors</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <Link href="/appointments/add" className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                <Plus size={20} />
                Add Appointment
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">{view === 'day' ? 'Daily' : view === 'week' ? 'Weekly' : view === 'month' ? 'Monthly' : 'All'} Schedule</h3>
                  <p className="text-sm text-gray-400">
                    {view === 'day' && `Schedule for ${selectedDateStr}`}
                    {view === 'week' && `Week of ${selectedDateStr}`}
                    {view === 'month' && `Month of ${selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                    {view === 'list' && 'All Appointments'}
                    {' '} • {selectedDoctor === 'all' ? 'All Doctors' : doctors.find(d => d.id === selectedDoctor)?.name || 'Doctor'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setView('day')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      view === 'day'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-dark-tertiary hover:bg-dark-tertiary/80'
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setView('week')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      view === 'week'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-dark-tertiary hover:bg-dark-tertiary/80'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setView('month')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      view === 'month'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-dark-tertiary hover:bg-dark-tertiary/80'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      view === 'list'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-dark-tertiary hover:bg-dark-tertiary/80'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>

              {selectedDoctor !== 'all' && doctors.find(d => d.id === selectedDoctor) && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Doctor Working Schedule</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-300">
                          <span className="text-gray-400">Name:</span> {doctors.find(d => d.id === selectedDoctor)?.name}
                        </p>
                        <p className="text-sm text-gray-300">
                          <span className="text-gray-400">Specialization:</span> {doctors.find(d => d.id === selectedDoctor)?.specialization}
                        </p>
                        {doctors.find(d => d.id === selectedDoctor)?.schedule && (
                          <p className="text-sm text-gray-300 mt-2">
                            <span className="text-gray-400">Working Hours:</span> {doctors.find(d => d.id === selectedDoctor)?.schedule}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Loader size={24} className="animate-spin" />
                    <p>Loading schedule...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
                  {error}
                </div>
              ) : view === 'day' ? (
                <div className="space-y-4">
                  {timeSlots.map((time) => {
                    const appointmentsAtTime = appointments.filter((apt) => apt.time === time);
                    
                    return (
                      <div key={time} className="flex gap-4">
                        <div className="w-24 text-sm text-gray-400 pt-2">{formatTime(time)}</div>
                        <div className="flex-1">
                          {appointmentsAtTime.length > 0 ? (
                            <div className="space-y-2">
                              {appointmentsAtTime.map((appointment) => (
                                <div
                                  key={appointment.id}
                                  className={`p-4 rounded-lg border-l-4 ${
                                    appointment.status === 'emergency'
                                      ? 'bg-blue-500/10 border-blue-500'
                                      : appointment.status === 'completed'
                                      ? 'bg-emerald-500/10 border-emerald-500'
                                      : 'bg-blue-500/10 border-blue-500'
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold mb-1">{appointment.patient.name}</h4>
                                      <p className="text-sm text-gray-400">
                                        {formatTime(appointment.time)} • {appointment.status}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-semibold">
                                          {appointment.doctor.name.charAt(0)}
                                        </div>
                                        <span className="text-sm text-gray-300">{appointment.doctor.name}</span>
                                      </div>
                                    </div>
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        appointment.status === 'completed'
                                          ? 'bg-emerald-500/20 text-emerald-500'
                                          : 'bg-blue-500/20 text-blue-500'
                                      }`}
                                    >
                                      {appointment.status === 'completed' ? 'Completed' : 'Confirmed'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-dark-tertiary rounded-lg">
                              No appointments
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : view === 'week' ? (
                <div className="grid grid-cols-7 gap-2">
                  {getWeekDates().map((date) => {
                    const dateAppointments = getAppointmentsForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = date.getDate();
                    
                    return (
                      <div key={date.toDateString()} className={`p-3 rounded-lg border ${isToday ? 'border-emerald-500 bg-emerald-500/5' : 'border-dark-tertiary'}`}>
                        <div className="text-center mb-3">
                          <p className="text-xs text-gray-400">{dayName}</p>
                          <p className={`text-sm font-semibold ${isToday ? 'text-emerald-500' : ''}`}>{dayNum}</p>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {dateAppointments.length > 0 ? (
                            dateAppointments.map((apt) => (
                              <div key={apt.id} className="text-xs bg-blue-500/10 border-l-2 border-blue-500 p-2 rounded">
                                <p className="font-semibold text-blue-400 truncate">{apt.patient.name}</p>
                                <p className="text-gray-400">{formatTime(apt.time)}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500 text-center py-2">No appointments</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : view === 'month' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-1">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-center text-xs text-gray-400 py-2 font-semibold">
                        {day}
                      </div>
                    ))}
                    {days.map((day, index) => {
                      const date = day !== null ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day) : null;
                      const dateAppointments = date ? getAppointmentsForDate(date) : [];
                      
                      return (
                        <div
                          key={index}
                          className={`aspect-square p-2 rounded-lg border transition-colors ${
                            day === null
                              ? 'invisible'
                              : dateAppointments.length > 0
                              ? 'border-emerald-500 bg-emerald-500/5 cursor-pointer hover:bg-emerald-500/10'
                              : 'border-dark-tertiary hover:bg-dark-tertiary'
                          }`}
                        >
                          {day !== null && (
                            <div>
                              <p className="text-sm font-semibold text-gray-300 mb-1">{day}</p>
                              <div className="text-xs space-y-1">
                                {dateAppointments.slice(0, 2).map((apt) => (
                                  <div key={apt.id} className="bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded truncate">
                                    {apt.patient.name.split(' ')[0]}
                                  </div>
                                ))}
                                {dateAppointments.length > 2 && (
                                  <div className="text-gray-400 text-xs">+{dateAppointments.length - 2} more</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-dark-tertiary">
                        <th className="text-left py-3 px-4 text-gray-400">Patient</th>
                        <th className="text-left py-3 px-4 text-gray-400">Doctor</th>
                        <th className="text-left py-3 px-4 text-gray-400">Date & Time</th>
                        <th className="text-left py-3 px-4 text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length > 0 ? (
                        appointments.map((apt) => (
                          <tr key={apt.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50">
                            <td className="py-3 px-4">{apt.patient.name}</td>
                            <td className="py-3 px-4">{apt.doctor.name}</td>
                            <td className="py-3 px-4">
                              {new Date(apt.date).toLocaleDateString()} {formatTime(apt.time)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                apt.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-500'
                                  : 'bg-blue-500/20 text-blue-500'
                              }`}>
                                {apt.status === 'completed' ? 'Completed' : 'Confirmed'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-500">
                            No appointments
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
