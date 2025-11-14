'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Download, Plus, Edit, Trash2, MoreVertical, Filter } from 'lucide-react';
import Link from 'next/link';

interface DeathRecord {
  id: string;
  name: string;
  age: number;
  dateOfDeath: string;
  causeOfDeath: string;
  status: 'Verified' | 'Pending' | 'Under Review';
  department: string;
  attendingDoctor: string;
}

export default function DeathRecordsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const deathRecords: DeathRecord[] = [
    {
      id: 'DR-2025-001',
      name: 'Robert Anderson',
      age: 78,
      dateOfDeath: '5/10/2025',
      causeOfDeath: 'Natural causes',
      status: 'Verified',
      department: 'Cardiology',
      attendingDoctor: 'Dr. Lisa Chen',
    },
    {
      id: 'DR-2025-002',
      name: 'Eleanor Thompson',
      age: 85,
      dateOfDeath: '5/10/2025',
      causeOfDeath: 'Heart failure',
      status: 'Pending',
      department: 'Cardiology',
      attendingDoctor: 'Dr. Robert Kim',
    },
    {
      id: 'DR-2025-003',
      name: 'George Harris',
      age: 87,
      dateOfDeath: '5/10/2025',
      causeOfDeath: 'Respiratory failure',
      status: 'Verified',
      department: 'Pulmonology',
      attendingDoctor: 'Dr. Lisa Chen',
    },
    {
      id: 'DR-2025-004',
      name: 'Margaret Clark',
      age: 92,
      dateOfDeath: '5/10/2025',
      causeOfDeath: 'Natural causes',
      status: 'Verified',
      department: 'Geriatrics',
      attendingDoctor: 'Dr. John Smith',
    },
    {
      id: 'DR-2025-005',
      name: 'Thomas Wright',
      age: 71,
      dateOfDeath: '5/20/2025',
      causeOfDeath: 'Cardiac arrest',
      status: 'Pending',
      department: 'Cardiology',
      attendingDoctor: 'Dr. Lisa Chen',
    },
  ];

  const filteredRecords = deathRecords.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.causeOfDeath.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'verified') return matchesSearch && record.status === 'Verified';
    if (activeTab === 'pending') return matchesSearch && record.status === 'Pending';
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Under Review':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Death Records</h1>
            <p className="text-gray-400 mt-2">Manage and track all death records in the system</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>

        <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <Link href="/records/death/add">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium">
                <Plus size={18} />
                <span>Add Record</span>
              </button>
            </Link>
          </div>

          <div className="flex gap-2 mb-6 border-b border-dark-tertiary">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'verified'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Pending
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Record ID
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Age
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Date of Death
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Cause of Death
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-white text-sm font-medium">{record.id}</td>
                    <td className="px-4 py-3 text-white text-sm font-medium">{record.name}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{record.age}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{record.dateOfDeath}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{record.causeOfDeath}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-blue-400 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
            <span>Showing {filteredRecords.length} records</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
