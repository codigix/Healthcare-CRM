'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { dashboardAPI } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Calendar, Users, UserCheck, TrendingUp, Calendar as CalendarIcon, FileText, Bell, BarChart3 } from 'lucide-react';

interface Stats {
  totalDoctors?: number;
  totalPatients?: number;
  totalAppointments?: number;
  totalRevenue?: number;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  patient: { name: string; avatar?: string };
  type: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [revenueData, setRevenueData] = useState([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [statsRes, revenueRes, appointmentsRes] = await Promise.all([
          dashboardAPI.stats().catch(() => ({ data: {} })),
          dashboardAPI.revenueChart().catch(() => ({ data: [] })),
          dashboardAPI.recentAppointments().catch(() => ({ data: [] })),
        ]);

        setStats(statsRes.data || {});
        setRevenueData(revenueRes.data || []);
        
        const aptList = appointmentsRes.data || [];
        const mapped = (Array.isArray(aptList) ? aptList : []).slice(0, 12).map((apt: any) => ({
          id: apt.id,
          date: apt.date,
          time: apt.time,
          patient: apt.patient || { name: 'Unknown' },
          type: 'Check-up',
          status: apt.status || 'confirmed',
        }));
        
        setAppointments(mapped);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'in progress':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatTime = (time24: string) => {
    if (!time24 || !time24.includes(':')) return time24;
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, Dr. Johnson! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary rounded-lg hover:bg-dark-tertiary transition-colors">
              <CalendarIcon size={18} />
              <span className="text-sm">Nov 11, 2025 - Nov 11, 2025</span>
            </button>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card card-hover border border-dark-tertiary">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="text-emerald-500" size={20} />
                      <p className="text-gray-400 text-sm">Total Revenue</p>
                    </div>
                    <p className="text-3xl font-bold">${(typeof stats?.totalRevenue === 'number' ? stats.totalRevenue.toFixed(2) : '0.00').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    <p className="text-emerald-500 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp size={14} />
                      +20.1% from last month
                    </p>
                  </div>
                </div>
              </div>

              <div className="card card-hover border border-dark-tertiary">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="text-blue-500" size={20} />
                      <p className="text-gray-400 text-sm">Appointments</p>
                    </div>
                    <p className="text-3xl font-bold">+{stats?.totalAppointments?.toLocaleString() || '2,350'}</p>
                    <p className="text-blue-500 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp size={14} />
                      +10.1% from last month
                    </p>
                  </div>
                </div>
              </div>

              <div className="card card-hover border border-dark-tertiary">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="text-yellow-500" size={20} />
                      <p className="text-gray-400 text-sm">Patients</p>
                    </div>
                    <p className="text-3xl font-bold">+{stats?.totalPatients?.toLocaleString() || '12,234'}</p>
                    <p className="text-yellow-500 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp size={14} />
                      +19% from last month
                    </p>
                  </div>
                </div>
              </div>

              <div className="card card-hover border border-dark-tertiary">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="text-purple-500" size={20} />
                      <p className="text-gray-400 text-sm">Staff</p>
                    </div>
                    <p className="text-3xl font-bold">+{stats?.totalDoctors || '573'}</p>
                    <p className="text-purple-500 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp size={14} />
                      +4 new this month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex gap-4 border-b border-dark-tertiary mb-6">
                {['overview', 'analytics', 'reports', 'notifications'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium capitalize transition-colors relative ${
                      activeTab === tab
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                    )}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Overview</h3>
                    <p className="text-gray-400 text-sm mb-6">Patient visits and revenue for the current period.</p>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                        <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(30, 30, 30, 0.95)', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '8px' 
                          }} 
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Appointments</h3>
                    <p className="text-gray-400 text-sm mb-6">You have {appointments.length} recent appointments.</p>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {appointments.length > 0 ? (
                        appointments.map((apt) => (
                          <div key={apt.id} className="flex items-center justify-between p-3 bg-dark-secondary rounded-lg hover:bg-dark-tertiary transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
                                {apt.patient.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium">{apt.patient.name}</p>
                                <p className="text-sm text-gray-400">{apt.type}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <CalendarIcon size={12} />
                                  {new Date(apt.date).toLocaleDateString()} {formatTime(apt.time)}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                              {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">No recent appointments</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Key Performance Indicators</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-dark-secondary rounded-lg p-4 border border-dark-tertiary">
                      <p className="text-gray-400 text-sm mb-2">Appointment Completion Rate</p>
                      <p className="text-2xl font-bold">87%</p>
                      <p className="text-emerald-500 text-xs mt-2">+5% from last month</p>
                    </div>
                    <div className="bg-dark-secondary rounded-lg p-4 border border-dark-tertiary">
                      <p className="text-gray-400 text-sm mb-2">Average Rating</p>
                      <p className="text-2xl font-bold">4.8/5</p>
                      <p className="text-emerald-500 text-xs mt-2">Based on 342 reviews</p>
                    </div>
                    <div className="bg-dark-secondary rounded-lg p-4 border border-dark-tertiary">
                      <p className="text-gray-400 text-sm mb-2">Patient Satisfaction</p>
                      <p className="text-2xl font-bold">92%</p>
                      <p className="text-emerald-500 text-xs mt-2">+3% from last month</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                        <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(30, 30, 30, 0.95)', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '8px' 
                          }} 
                        />
                        <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-dark-secondary rounded-lg border border-dark-tertiary hover:bg-dark-tertiary transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-500" size={24} />
                        <div>
                          <p className="font-medium">Revenue Report</p>
                          <p className="text-sm text-gray-400">Monthly revenue summary and trends</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-emerald-500/20 text-emerald-500 rounded hover:bg-emerald-500/30 transition-colors text-sm">
                        Generate
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dark-secondary rounded-lg border border-dark-tertiary hover:bg-dark-tertiary transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="text-emerald-500" size={24} />
                        <div>
                          <p className="font-medium">Patient Demographics</p>
                          <p className="text-sm text-gray-400">Patient distribution and statistics</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-emerald-500/20 text-emerald-500 rounded hover:bg-emerald-500/30 transition-colors text-sm">
                        Generate
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dark-secondary rounded-lg border border-dark-tertiary hover:bg-dark-tertiary transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="text-yellow-500" size={24} />
                        <div>
                          <p className="font-medium">Staff Performance</p>
                          <p className="text-sm text-gray-400">Doctor and staff performance metrics</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-emerald-500/20 text-emerald-500 rounded hover:bg-emerald-500/30 transition-colors text-sm">
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    <div className="flex items-start gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-400">New Appointment Scheduled</p>
                        <p className="text-sm text-gray-400 mt-1">Dr. Smith has a new appointment with John Doe scheduled for Nov 15, 2025</p>
                        <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-emerald-400">Appointment Completed</p>
                        <p className="text-sm text-gray-400 mt-1">Appointment with patient Sarah Johnson has been marked as completed</p>
                        <p className="text-xs text-gray-500 mt-2">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-yellow-400">Pending Appointment</p>
                        <p className="text-sm text-gray-400 mt-1">There is 1 pending appointment awaiting confirmation</p>
                        <p className="text-xs text-gray-500 mt-2">6 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-purple-400">System Update</p>
                        <p className="text-sm text-gray-400 mt-1">System maintenance scheduled for Nov 20, 2025 from 2:00 AM to 4:00 AM</p>
                        <p className="text-xs text-gray-500 mt-2">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
