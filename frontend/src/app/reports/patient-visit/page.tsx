'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw, Users } from 'lucide-react';

interface PatientVisit {
  patient: string;
  visitDate: string;
  department: string;
  doctor: string;
  visitType: string;
  duration: string;
  status: string;
}

export default function PatientVisitReportsPage() {
  const [dateRange, setDateRange] = useState('Nov 12, 2025 - Nov 12, 2025');
  const [department, setDepartment] = useState('All Departments');
  const [doctor, setDoctor] = useState('All Doctors');
  const [activeTab, setActiveTab] = useState('overview');

  const visitStats = [
    { label: 'Total Visits', value: '3,842', change: '+18.3% from previous period', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'New Patients', value: '428', change: '+8.2% from previous period', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { label: 'Avg. Visit Duration', value: '32 min', change: '-3.4 min from previous period', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { label: 'No-Show Rate', value: '6.8%', change: '+0.6% from previous period', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  ];

  const visitTypeDistribution = [
    { name: 'Follow-up', value: 45, fill: '#3b82f6' },
    { name: 'Consultation', value: 35, fill: '#10b981' },
    { name: 'Check-up', value: 15, fill: '#f59e0b' },
    { name: 'Emergency', value: 5, fill: '#ef4444' },
  ];

  const visitOutcomes = [
    { name: 'Discharged', value: 50, fill: '#10b981' },
    { name: 'Admitted', value: 20, fill: '#3b82f6' },
    { name: 'Referred', value: 15, fill: '#f59e0b' },
    { name: 'Treatment', value: 15, fill: '#8b5cf6' },
  ];

  const departmentDemographics = [
    { department: 'Cardiology', visits: 450, newPatients: 85, avgDuration: 38 },
    { department: 'Neurology', visits: 380, newPatients: 62, avgDuration: 35 },
    { department: 'Orthopedics', visits: 320, newPatients: 58, avgDuration: 30 },
    { department: 'Pediatrics', visits: 290, newPatients: 72, avgDuration: 28 },
    { department: 'Dermatology', visits: 240, newPatients: 48, avgDuration: 25 },
    { department: 'General Medicine', visits: 582, newPatients: 103, avgDuration: 32 },
  ];

  const recentPatientVisits: PatientVisit[] = [
    { patient: 'Robert Chen', visitDate: '2025-11-12', department: 'Cardiology', doctor: 'Dr. Smith', visitType: 'Consultation', duration: '35 min', status: 'Discharged' },
    { patient: 'Maria Garcia', visitDate: '2025-11-12', department: 'Neurology', doctor: 'Dr. Johnson', visitType: 'Follow-up', duration: '28 min', status: 'Treatment' },
    { patient: 'James Wilson', visitDate: '2025-11-11', department: 'Orthopedics', doctor: 'Dr. Williams', visitType: 'Check-up', duration: '32 min', status: 'Discharged' },
    { patient: 'Emma Taylor', visitDate: '2025-11-11', department: 'Pediatrics', doctor: 'Dr. Martinez', visitType: 'Consultation', duration: '25 min', status: 'Admitted' },
    { patient: 'Michael Brown', visitDate: '2025-11-10', department: 'Dermatology', doctor: 'Dr. Anderson', visitType: 'Follow-up', duration: '20 min', status: 'Discharged' },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      'Discharged': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
      'Admitted': { bg: 'bg-blue-500/10', text: 'text-blue-500' },
      'Treatment': { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
      'Referred': { bg: 'bg-purple-500/10', text: 'text-purple-500' },
    };
    return badges[status] || badges['Discharged'];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patient Visit Report</h1>
            <p className="text-gray-400">Track patient visits, demographics, and health trends</p>
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
            { id: 'demographics', label: 'Demographics' },
            { id: 'visit-trends', label: 'Visit Trends' },
            { id: 'conditions', label: 'Conditions' },
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
              <option>Pediatrics</option>
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
              <option>Dr. Martinez</option>
            </select>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {visitStats.map((stat, index) => (
                <div key={index} className={`card ${stat.bgColor}`}>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <h3 className={`text-2xl font-bold ${stat.color} my-2`}>{stat.value}</h3>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Visit Types</h2>
            <p className="text-sm text-gray-400 mb-4">Distribution of patient visits by type</p>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={visitTypeDistribution} cx="50%" cy="50%" outerRadius={100} paddingAngle={2} dataKey="value">
                    {visitTypeDistribution.map((entry, index) => (
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
            <h2 className="text-lg font-semibold mb-4">Visit Outcomes</h2>
            <p className="text-sm text-gray-400 mb-4">Outcomes of patient visits</p>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={visitOutcomes} cx="50%" cy="50%" outerRadius={100} paddingAngle={2} dataKey="value">
                    {visitOutcomes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', border: 'none', borderRadius: '8px', color: 'white' }} formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Visits by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentDemographics}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="department" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', border: 'none', borderRadius: '8px', color: 'white' }} />
              <Legend />
              <Bar dataKey="visits" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-blue-500" />
              <h2 className="text-lg font-semibold">Recent Patient Visits</h2>
            </div>
            <button className="text-emerald-500 hover:text-emerald-400 text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Patient</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Visit Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Department</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Doctor</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Visit Type</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPatientVisits.map((visit, index) => {
                  const badge = getStatusBadge(visit.status);
                  return (
                    <tr key={index} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50">
                      <td className="py-3 px-4">{visit.patient}</td>
                      <td className="py-3 px-4 text-gray-400">{visit.visitDate}</td>
                      <td className="py-3 px-4">{visit.department}</td>
                      <td className="py-3 px-4 text-gray-400">{visit.doctor}</td>
                      <td className="py-3 px-4">{visit.visitType}</td>
                      <td className="py-3 px-4">{visit.duration}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {visit.status}
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

        {(activeTab === 'demographics' || activeTab === 'visit-trends' || activeTab === 'conditions') && (
          <div className="card p-12 text-center">
            <p className="text-gray-400 text-lg">Coming soon...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
