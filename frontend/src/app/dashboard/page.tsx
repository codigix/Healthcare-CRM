'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { dashboardAPI } from '@/lib/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, Calendar, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

interface Stats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
}

interface Appointment {
  id: string;
  date: string;
  patient?: { name: string };
  doctor?: { name: string };
  status: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [revenueData, setRevenueData] = useState([]);
  const [patientGrowth, setPatientGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appointmentsRes, revenueRes, growthRes] = await Promise.all([
          dashboardAPI.stats(),
          dashboardAPI.recentAppointments(),
          dashboardAPI.revenueChart(),
          dashboardAPI.patientGrowth(),
        ]);

        setStats(statsRes.data);
        setAppointments(appointmentsRes.data);
        setRevenueData(revenueRes.data);
        setPatientGrowth(growthRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Here's an overview of your clinic's performance.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card card-hover">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                    <p className="text-2xl font-bold">${typeof stats?.totalRevenue === 'number' ? stats.totalRevenue.toFixed(2) : 0}</p>
                    <p className="text-emerald-500 text-xs mt-2">+20.1% from last month</p>
                  </div>
                  <DollarSign className="text-emerald-500" size={24} />
                </div>
              </div>

              <div className="card card-hover">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Appointments</p>
                    <p className="text-2xl font-bold">+{stats?.totalAppointments || 0}</p>
                    <p className="text-emerald-500 text-xs mt-2">+10.1% from last month</p>
                  </div>
                  <Calendar className="text-blue-500" size={24} />
                </div>
              </div>

              <div className="card card-hover">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Patients</p>
                    <p className="text-2xl font-bold">+{stats?.totalPatients || 0}</p>
                    <p className="text-emerald-500 text-xs mt-2">+19% from last month</p>
                  </div>
                  <Users className="text-yellow-500" size={24} />
                </div>
              </div>

              <div className="card card-hover">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Doctors</p>
                    <p className="text-2xl font-bold">{stats?.totalDoctors || 0}</p>
                    <p className="text-emerald-500 text-xs mt-2">Active doctors</p>
                  </div>
                  <UserCheck className="text-purple-500" size={24} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Patient Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={patientGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', border: 'none', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Recent Appointments</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-tertiary">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Patient</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Doctor</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary transition-colors">
                        <td className="py-3 px-4">{apt.patient?.name || 'N/A'}</td>
                        <td className="py-3 px-4">{apt.doctor?.name || 'N/A'}</td>
                        <td className="py-3 px-4">{new Date(apt.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span className={`status-badge ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
