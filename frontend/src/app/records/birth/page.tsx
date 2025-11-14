'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Download, Plus, Edit, Trash2, MoreVertical, Filter } from 'lucide-react';
import Link from 'next/link';

interface BirthRecord {
  id: string;
  childName: string;
  dateOfBirth: string;
  parents: string;
  attendingDoctor: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  weight: string;
  gender: string;
  hospitalName: string;
}

export default function BirthRecordsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const birthRecords: BirthRecord[] = [
    {
      id: 'BR-2025-001',
      childName: 'Emma Johnson',
      dateOfBirth: '5/10/2025',
      parents: 'Sarah and Michael Johnson',
      attendingDoctor: 'Dr. Lisa Chen',
      status: 'Verified',
      weight: '3.2 kg',
      gender: 'Female',
      hospitalName: 'MedixPro Hospital',
    },
    {
      id: 'BR-2025-002',
      childName: 'Noah Williams',
      dateOfBirth: '5/18/2025',
      parents: 'Jessica and David Williams',
      attendingDoctor: 'Dr. Robert Kim',
      status: 'Pending',
      weight: '3.5 kg',
      gender: 'Male',
      hospitalName: 'MedixPro Hospital',
    },
    {
      id: 'BR-2025-003',
      childName: 'Olivia Davis',
      dateOfBirth: '5/20/2025',
      parents: 'Emily and James Davis',
      attendingDoctor: 'Dr. Lisa Chen',
      status: 'Verified',
      weight: '3.1 kg',
      gender: 'Female',
      hospitalName: 'MedixPro Hospital',
    },
    {
      id: 'BR-2025-004',
      childName: 'Liam Miller',
      dateOfBirth: '5/22/2025',
      parents: 'Sophie and William Miller',
      attendingDoctor: 'Dr. John Smith',
      status: 'Verified',
      weight: '3.8 kg',
      gender: 'Male',
      hospitalName: 'MedixPro Hospital',
    },
    {
      id: 'BR-2025-005',
      childName: 'Ava Wilson',
      dateOfBirth: '5/25/2025',
      parents: 'Jennifer and Robert Wilson',
      attendingDoctor: 'Dr. Lisa Chen',
      status: 'Pending',
      weight: '3.0 kg',
      gender: 'Female',
      hospitalName: 'MedixPro Hospital',
    },
  ];

  const filteredRecords = birthRecords.filter((record) => {
    const matchesSearch =
      record.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.parents.toLowerCase().includes(searchQuery.toLowerCase());

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
      case 'Rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Birth Records</h1>
            <p className="text-gray-400 mt-2">Manage and track all birth records in the system</p>
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
            <Link href="/records/birth/add">
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
                    Child Name
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Date of Birth
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Parents
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Attending Doctor
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
                    <td className="px-4 py-3 text-white text-sm font-medium">{record.childName}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{record.dateOfBirth}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{record.parents}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{record.attendingDoctor}</td>
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
