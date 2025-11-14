'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Plus, Users, Calendar, MoreVertical } from 'lucide-react';

interface Donor {
  id: string;
  name: string;
  bloodType: string;
  contact: string;
  email: string;
  lastDonation: string;
  nextEligible: string;
  totalDonations: number;
  status: 'Eligible' | 'Ineligible' | 'New Donor' | 'Gold Donor';
}

export default function BloodDonorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const [donors] = useState<Donor[]>([
    {
      id: 'D-0001',
      name: 'John Smith',
      bloodType: 'O+',
      contact: '+1 (555) 123-4567',
      email: 'john.smith@example.com',
      lastDonation: '3/15/2023',
      nextEligible: '7/15/2023',
      totalDonations: 8,
      status: 'Eligible'
    },
    {
      id: 'D-0002',
      name: 'Sarah Johnson',
      bloodType: 'A-',
      contact: '+1 (555) 987-6543',
      email: 'sarah.johnson@example.com',
      lastDonation: '5/22/2023',
      nextEligible: '9/22/2023',
      totalDonations: 3,
      status: 'Ineligible'
    },
    {
      id: 'D-0003',
      name: 'Michael Chen',
      bloodType: 'B+',
      contact: '+1 (555) 456-7890',
      email: 'michael.chen@example.com',
      lastDonation: '1/10/2023',
      nextEligible: '5/10/2023',
      totalDonations: 12,
      status: 'Eligible'
    },
    {
      id: 'D-0004',
      name: 'Emily Rodriguez',
      bloodType: 'AB+',
      contact: '+1 (555) 234-5678',
      email: 'emily.r@example.com',
      lastDonation: 'Never donated',
      nextEligible: 'N/A',
      totalDonations: 0,
      status: 'New Donor'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Eligible':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Ineligible':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'New Donor':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Gold Donor':
        return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const getBloodTypeColor = (bloodType: string) => {
    return bloodType.includes('+') 
      ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
      : 'bg-red-500/10 text-red-500 border border-red-500/20';
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         donor.contact.includes(searchQuery) ||
                         donor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBloodType = bloodTypeFilter === 'all' || donor.bloodType === bloodTypeFilter;
    const matchesStatus = statusFilter === 'all' || donor.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'eligible' && donor.status === 'Eligible') ||
                      (activeTab === 'ineligible' && donor.status === 'Ineligible') ||
                      (activeTab === 'new' && donor.status === 'New Donor');
    return matchesSearch && matchesBloodType && matchesStatus && matchesTab;
  });

  const totalDonors = donors.length;
  const donationsThisMonth = 38;
  const eligibleDonors = donors.filter(d => d.status === 'Eligible').length;
  const frequentDonors = 42;

  const bloodTypeDistribution = [
    { type: 'O+', percentage: 38, count: 94 },
    { type: 'A+', percentage: 16, count: 40 },
    { type: 'B+', percentage: 12, count: 30 },
    { type: 'AB+', percentage: 6, count: 15 },
    { type: 'O-', percentage: 9, count: 22 },
    { type: 'A-', percentage: 7, count: 17 },
    { type: 'B-', percentage: 6, count: 15 },
    { type: 'AB-', percentage: 4, count: 10 }
  ];

  const donationFrequency = [
    { label: 'First Time', count: 56, percentage: 23 },
    { label: '2-4 Times', count: 107, percentage: 43 },
    { label: '5-9 Times', count: 34, percentage: 14 },
    { label: '10-24 Times', count: 12, percentage: 5 },
    { label: '25+ Times', count: 8, percentage: 3 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blood Donors</h1>
            <p className="text-gray-400">Manage and track blood donors in your blood bank</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Register New Donor
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalDonors}</div>
                <div className="text-sm text-gray-400">Total Donors</div>
                <div className="text-xs text-emerald-500">+5 from last month</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{donationsThisMonth}</div>
                <div className="text-sm text-gray-400">Donations This Month</div>
                <div className="text-xs text-blue-500">+3 compared to last month</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Users className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{eligibleDonors}</div>
                <div className="text-sm text-gray-400">Eligible Donors</div>
                <div className="text-xs text-emerald-500">Ready for donation</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="text-purple-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{frequentDonors}</div>
                <div className="text-sm text-gray-400">Frequent Donors</div>
                <div className="text-xs text-purple-500">5+ donations</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Donors by Blood Type</h2>
            <p className="text-gray-400 text-sm mb-6">Distribution of registered donors by blood type</p>
            
            <div className="grid grid-cols-4 gap-4">
              {bloodTypeDistribution.map((item) => (
                <div key={item.type} className="text-center">
                  <div className={`h-32 rounded-lg flex flex-col items-center justify-end p-3 ${item.type.includes('+') ? 'bg-blue-500' : 'bg-red-500'}`} style={{ height: `${item.percentage * 3}px` }}>
                    <div className="text-white font-bold text-lg mb-1">{item.type}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Donation Frequency</h2>
            <p className="text-gray-400 text-sm mb-6">Number of donors by donation frequency</p>
            
            <div className="space-y-4">
              {donationFrequency.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <span className="text-sm text-gray-400">{item.count}</span>
                  </div>
                  <div className="w-full bg-dark-tertiary rounded-full h-2">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{ width: `${item.percentage * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search donors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none"
            />
          </div>

          <div className="flex gap-4 mb-6 border-b border-dark-tertiary">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              All Donors
            </button>
            <button
              onClick={() => setActiveTab('eligible')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'eligible'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Eligible
            </button>
            <button
              onClick={() => setActiveTab('ineligible')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'ineligible'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Ineligible
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'new'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              New
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <select
              value={bloodTypeFilter}
              onChange={(e) => setBloodTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Blood Types</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="Eligible">Eligible</option>
              <option value="Ineligible">Ineligible</option>
              <option value="New Donor">New Donor</option>
              <option value="Gold Donor">Gold Donor</option>
            </select>
            <button className="btn-secondary ml-auto">Export</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Donor</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Blood Type</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Contact</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Last Donation</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Total Donations</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Next Eligible</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map((donor) => (
                  <tr key={donor.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-semibold text-emerald-500">
                          {donor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-white">{donor.name}</div>
                          <div className="text-sm text-gray-400">{donor.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBloodTypeColor(donor.bloodType)}`}>
                        {donor.bloodType}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-300">{donor.contact}</div>
                      <div className="text-xs text-gray-400">{donor.email}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{donor.lastDonation}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donor.status)}`}>
                        {donor.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${donor.totalDonations >= 10 ? 'bg-yellow-500/10 text-yellow-500' : 'text-gray-300'}`}>
                        {donor.totalDonations}
                        {donor.totalDonations >= 10 && ' 🏆'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{donor.nextEligible}</td>
                    <td className="py-4 px-4">
                      <button className="p-2 hover:bg-gray-500/20 rounded transition-colors">
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
