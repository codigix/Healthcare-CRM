'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { appointmentAPI } from '@/lib/api';
import { Calendar, FileText, Heart, Activity, Clock, MapPin, Phone, Mail, Loader } from 'lucide-react';

interface PatientStats {
  upcomingAppointments: number;
  medicalRecords: number;
  prescriptions: number;
  testResults: number;
}

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
}

interface RecentActivity {
  id: string;
  action: string;
  date: string;
  time: string;
  type: 'appointment' | 'activity' | 'record';
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
}

interface HealthMetric {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: any;
  color: string;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientStats, setPatientStats] = useState<PatientStats>({
    upcomingAppointments: 0,
    medicalRecords: 0,
    prescriptions: 0,
    testResults: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [primaryDoctor, setPrimaryDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const upcomingRes = await appointmentAPI.list(1, 100, {
          startDate: tomorrow.toISOString(),
        });

        const allRes = await appointmentAPI.list(1, 100, {});

        const upcomingAppts = upcomingRes.data.appointments || [];
        const allAppts = allRes.data.appointments || [];

        const mapped: Appointment[] = upcomingAppts.map((apt: any) => ({
          id: apt.id,
          doctorName: apt.doctor?.name || 'Unknown Doctor',
          specialty: apt.doctor?.specialization || 'General',
          date: new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: apt.time || '00:00',
          location: 'Hospital',
          type: 'Check-up',
          status: apt.status || 'confirmed',
        }));

        const activities: RecentActivity[] = allAppts.slice(0, 3).map((apt: any) => ({
          id: apt.id,
          action: `Appointment with ${apt.doctor?.name || 'Doctor'}`,
          date: new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: apt.time || '00:00',
          type: 'appointment',
        }));

        let primaryDoc: Doctor | null = null;
        if (allAppts.length > 0) {
          const firstApt = allAppts[0];
          primaryDoc = {
            id: firstApt.doctor?.id || '',
            name: firstApt.doctor?.name || 'Unknown Doctor',
            specialty: firstApt.doctor?.specialization || 'General',
            phone: firstApt.doctor?.phone || '(555) 123-4567',
            email: firstApt.doctor?.email || 'doctor@medixpro.com',
          };
        }

        setUpcomingAppointments(mapped);
        setRecentActivities(activities);
        setPrimaryDoctor(primaryDoc);
        setPatientStats({
          upcomingAppointments: upcomingAppts.length,
          medicalRecords: 0,
          prescriptions: 0,
          testResults: 0,
        });
      } catch (err) {
        console.error('Failed to fetch appointments', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'record':
        return '📋';
      case 'activity':
        return '✓';
      default:
        return '•';
    }
  };

  const healthMetrics: HealthMetric[] = [
    {
      label: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'normal',
      icon: Heart,
      color: 'text-red-500',
    },
    {
      label: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      label: 'Temperature',
      value: '98.6',
      unit: '°F',
      status: 'normal',
      icon: Activity,
      color: 'text-yellow-500',
    },
    {
      label: 'Weight',
      value: '165',
      unit: 'lbs',
      status: 'normal',
      icon: Activity,
      color: 'text-emerald-500',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-emerald-500/10 text-emerald-500';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'critical':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-400';
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
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Patient</h1>
          <p className="text-gray-400 mt-1">Here's your health overview and upcoming appointments.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <Loader className="animate-spin" size={24} />
              <p className="text-gray-400">Loading appointments...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card card-hover border border-dark-tertiary">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Calendar className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Upcoming</p>
                    <p className="text-sm text-gray-400">Appointments</p>
                  </div>
                </div>
                <p className="text-3xl font-bold">{patientStats.upcomingAppointments}</p>
                <p className="text-sm text-gray-400 mt-2">Next: Nov 15, 2025</p>
              </div>

              <div className="card card-hover border border-dark-tertiary">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <FileText className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Medical</p>
                    <p className="text-sm text-gray-400">Records</p>
                  </div>
                </div>
                <p className="text-3xl font-bold">{patientStats.medicalRecords}</p>
                <p className="text-sm text-gray-400 mt-2">Total documents</p>
              </div>

              <div className="card card-hover border border-dark-tertiary">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <FileText className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Active</p>
                    <p className="text-sm text-gray-400">Prescriptions</p>
                  </div>
                </div>
                <p className="text-3xl font-bold">{patientStats.prescriptions}</p>
                <p className="text-sm text-gray-400 mt-2">Current medications</p>
              </div>

              <div className="card card-hover border border-dark-tertiary">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <Activity className="text-yellow-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Test</p>
                    <p className="text-sm text-gray-400">Results</p>
                  </div>
                </div>
                <p className="text-3xl font-bold">{patientStats.testResults}</p>
                <p className="text-sm text-gray-400 mt-2">Available reports</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="card">
                  <div className="flex gap-4 border-b border-dark-tertiary mb-6">
                    {['overview', 'appointments', 'records', 'prescriptions'].map((tab) => (
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
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Health Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {healthMetrics.map((metric, idx) => {
                            const Icon = metric.icon;
                            return (
                              <div key={idx} className="p-4 bg-dark-secondary rounded-lg border border-dark-tertiary">
                                <div className="flex items-center justify-between mb-3">
                                  <Icon className={metric.color} size={24} />
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(metric.status)}`}>
                                    {metric.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
                                <p className="text-2xl font-bold">
                                  {metric.value} <span className="text-sm text-gray-400">{metric.unit}</span>
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                        {recentActivities.length === 0 ? (
                          <div className="text-center py-6 text-gray-400">
                            <p>No recent activities</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {recentActivities.map((activity) => (
                              <div key={activity.id} className="flex items-center justify-between p-3 bg-dark-secondary rounded-lg">
                                <div>
                                  <p className="font-medium">{activity.action}</p>
                                  <p className="text-sm text-gray-400 mt-1">{activity.date} at {formatTime(activity.time)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'appointments' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
                      {upcomingAppointments.map((apt) => (
                        <div key={apt.id} className="p-4 bg-dark-secondary rounded-lg border border-dark-tertiary hover:bg-dark-tertiary transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-lg">{apt.doctorName}</p>
                              <p className="text-sm text-gray-400">{apt.specialty}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                              {apt.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Calendar size={16} />
                              <span>{apt.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <Clock size={16} />
                              <span>{formatTime(apt.time)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 col-span-2">
                              <MapPin size={16} />
                              <span>{apt.location}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button 
                              onClick={() => router.push(`/appointments/all`)}
                              className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm transition-colors"
                            >
                              View Details
                            </button>
                            <button className="px-4 py-2 bg-dark-tertiary hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'records' && (
                    <div className="text-center py-12 text-gray-400">
                      <FileText className="mx-auto mb-4" size={48} />
                      <p>Medical records will be displayed here</p>
                    </div>
                  )}

                  {activeTab === 'prescriptions' && (
                    <div className="text-center py-12 text-gray-400">
                      <FileText className="mx-auto mb-4" size={48} />
                      <p>Prescriptions will be displayed here</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => router.push('/appointments/add')}
                      className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar size={18} />
                      Book Appointment
                    </button>
                    <button 
                      onClick={() => router.push('/records')}
                      className="w-full px-4 py-3 bg-dark-secondary hover:bg-dark-tertiary text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      View Records
                    </button>
                    <button 
                      onClick={() => router.push('/chat')}
                      className="w-full px-4 py-3 bg-dark-secondary hover:bg-dark-tertiary text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone size={18} />
                      Contact Doctor
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Primary Care Physician</h3>
                  {primaryDoctor ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-lg font-semibold">
                          {primaryDoctor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold">Dr. {primaryDoctor.name}</p>
                          <p className="text-sm text-gray-400">{primaryDoctor.specialty}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Phone size={16} />
                          <span>{primaryDoctor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Mail size={16} />
                          <span>{primaryDoctor.email}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No doctor assigned</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
