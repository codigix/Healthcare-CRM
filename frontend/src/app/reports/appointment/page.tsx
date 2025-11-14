'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw, Filter } from 'lucide-react';

interface Appointment {
  patient: string;
  doctor: string;
  date: string;
  time: string;
  service: string;
  status: 'completed' | 'scheduled' | 'cancelled' | 'no-show';
}

export default function AppointmentReportsPage() {
  const [dateRange, setDateRange] = useState('Nov 12, 2025 - Nov 12, 2025');
  const [department, setDepartment] = useState('All Departments');
  const [doctor, setDoctor] = useState('All Doctors');
  const [activeTab, setActiveTab] = useState('overview');

  const appointmentStats = [
    { label: 'Total Appointments', value: '1,248', change: '+12% from last month', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Completed', value: '876', change: '70.2% completion rate', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { label: 'Cancelled', value: '187', change: '15% cancellation rate', color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { label: 'No-Shows', value: '85', change: '6.8% no-show rate', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  ];

  const appointmentByDepartment = [
    { name: 'Cardiology', value: 280, appointments: 280 },
    { name: 'Neurology', value: 220, appointments: 220 },
    { name: 'Orthopedics', value: 180, appointments: 180 },
    { name: 'Pediatrics', value: 160, appointments: 160 },
    { name: 'Dermatology', value: 140, appointments: 140 },
    { name: 'General Medicine', value: 288, appointments: 288 },
  ];

  const appointmentStatus = [
    { name: 'Completed', value: 70, fill: '#10b981' },
    { name: 'Scheduled', value: 8, fill: '#3b82f6' },
    { name: 'Cancelled', value: 15, fill: '#ef4444' },
    { name: 'No-Show', value: 7, fill: '#f59e0b' },
  ];

  const recentAppointments: Appointment[] = [
    { patient: 'John Doe', doctor: 'Dr. Smith', date: '2025-11-12', time: '10:30 AM', service: 'General Checkup', status: 'completed' },
    { patient: 'Jane Smith', doctor: 'Dr. Johnson', date: '2025-11-12', time: '02:00 PM', service: 'Cardiac Consultation', status: 'scheduled' },
    { patient: 'Michael Brown', doctor: 'Dr. Williams', date: '2025-11-11', time: '11:15 AM', service: 'Physical Therapy', status: 'completed' },
    { patient: 'Sarah Davis', doctor: 'Dr. Martinez', date: '2025-11-11', time: '03:30 PM', service: 'Follow-up', status: 'cancelled' },
    { patient: 'Robert Wilson', doctor: 'Dr. Anderson', date: '2025-11-10', time: '09:00 AM', service: 'Dermatology Consultation', status: 'no-show' },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
      scheduled: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
      cancelled: { bg: 'bg-red-500/10', text: 'text-red-500' },
      'no-show': { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
    };
    return badges[status] || badges.scheduled;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Appointment Reports</h1>
            <p className="text-gray-400">Analyze appointment data, track trends, and generate detailed reports</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <RefreshCw size={18} />
              Refresh
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        <div className="flex border-b border-dark-tertiary gap-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'trends', label: 'Trends' },
            { id: 'by-doctor', label: 'By Doctor' },
            { id: 'by-service', label: 'By Service' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
            >
              <option>All Departments</option>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Orthopedics</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Doctor</label>
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
            >
              <option>All Doctors</option>
              <option>Dr. Smith</option>
              <option>Dr. Johnson</option>
              <option>Dr. Williams</option>
            </select>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {appointmentStats.map((stat, index) => (
                <div key={index} className={`card ${stat.bgColor}`}>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <h3 className={`text-2xl font-bold ${stat.color} my-2`}>{stat.value}</h3>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Appointments by Department</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={appointmentByDepartment}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', border: 'none', borderRadius: '8px', color: 'white' }} />
                <Bar dataKey="appointments" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Appointment Status Distribution</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={appointmentStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {appointmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', border: 'none', borderRadius: '8px', color: 'white' }} formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Appointments</h2>
            <button className="text-emerald-500 hover:text-emerald-400 text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Patient</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Doctor</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date & Time</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Service</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((apt, index) => {
                  const badge = getStatusBadge(apt.status);
                  return (
                    <tr key={index} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50">
                      <td className="py-3 px-4">{apt.patient}</td>
                      <td className="py-3 px-4 text-gray-400">{apt.doctor}</td>
                      <td className="py-3 px-4 text-gray-400">{apt.date} {apt.time}</td>
                      <td className="py-3 px-4">{apt.service}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1).replace('-', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}

        {(activeTab === 'trends' || activeTab === 'by-doctor' || activeTab === 'by-service') && (
          <div className="card p-12 text-center">
            <p className="text-gray-400 text-lg">Coming soon...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
