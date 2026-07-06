"use client";

import React, { useState } from 'react';
import { UserCheck, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function DoctorAvailabilityPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Track ID', accessor: 'trackid', sortable: true },
    { header: 'Doctor', accessor: 'doctor', sortable: true },
    {
      header: 'Current Status',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.currentstatus === 'Active' || row.currentstatus === 'Available' || row.currentstatus === 'Consulting' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
          row.currentstatus === 'In Surgery' || row.currentstatus === 'On Leave' || row.currentstatus === 'Modified' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
            'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
          {row.currentstatus}
        </span>
      ),
      sortable: true
    },
    { header: 'Next Available', accessor: 'nextavailable', sortable: true },
    { header: 'Location', accessor: 'location', sortable: true },
    { header: 'Updates', accessor: 'updates', sortable: true },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex justify-end gap-2">
          <button className="p-1.5 hover:bg-dark-tertiary rounded text-gray-400 hover:text-white transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      )
    }
  ];

  const mockData = Array.from({ length: 6 }).map((_, i) => {
    const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Emily Chen', 'Dr. Robert King', 'Dr. Lisa Cuddy', 'Dr. Peter Benton'];
    const statuses = ['Available', 'In Surgery', 'Consulting', 'On Leave', 'Available', 'In Surgery'];
    const nextAvail = ['Now', '14:30 Today', '11:15 Today', '12 Aug, 2026', 'Now', '16:00 Today'];
    const locs = ['OPD Room 12', 'OR 3', 'OPD Room 4', 'Out of Office', 'OPD Room 2', 'OR 1'];
    const updates = ['Updated 5m ago', 'Updated 1h ago', 'Updated 10m ago', 'Updated 2d ago', 'Updated 2m ago', 'Updated 3h ago'];
    return {
      trackid: `TRK-${3001 + i}`,
      doctor: docs[i],
      currentstatus: statuses[i],
      nextavailable: nextAvail[i],
      location: locs[i],
      updates: updates[i]
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl  text-white flex items-center gap-2">
            <UserCheck className="text-emerald-500" size={24} />
            Doctor Availability
          </h1>
          <p className="text-sm text-gray-400 mt-1">Real-time tracking of doctor availability and leaves.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Doctors Available</p>
          <p className="text-2xl  mt-2 text-emerald-400">142</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">In Surgery</p>
          <p className="text-2xl  mt-2 text-amber-400">28</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">On Leave</p>
          <p className="text-2xl  mt-2 text-gray-400">15</p>
        </div>
      </div>

      <div className="my-3">
        <div className="my-3 flex justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 text-white w-64 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition-colors text-white">
            <Filter size={16} /> Filter
          </button>
        </div>
        <DataTable
          columns={columns}
          data={mockData}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}