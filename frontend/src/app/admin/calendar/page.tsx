"use client";

import React, { useState } from 'react';
import { Activity, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function HospitalCalendarPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Event ID', accessor: 'eventid', sortable: true },
    { header: 'Event Name', accessor: 'eventname', sortable: true },
    { header: 'Date', accessor: 'date', sortable: true },
    { header: 'Time', accessor: 'time', sortable: true },
    { header: 'Location', accessor: 'location', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Active' || row.status === 'Operational' || row.status === 'Approved' || row.status === 'Resolved' || row.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
          row.status === 'Pending' || row.status === 'In Progress' || row.status === 'Occupied' || row.status === 'Under Review' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
            'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
          {row.status}
        </span>
      ),
      sortable: true
    },
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

  const mockData = Array.from({ length: 12 }).map((_, i) => ({
    eventid: `${'Hospital Calendar'.substring(0, 3).toUpperCase()}-${1000 + i}`,
    eventname: `Sample ${'Hospital Calendar'} ${i + 1}`,
    date: `Sample Data ${i + 1}`,
    time: `Sample Data ${i + 1}`,
    location: `Sample Data ${i + 1}`,
    status: i % 5 === 0 ? 'Pending' : (i % 7 === 0 ? 'Inactive' : 'Active')
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3 my-3">
        <div>
          <h1 className="text-2xl  text-white flex items-center gap-2">
            <Activity className="text-emerald-500" size={24} />
            Hospital Calendar
          </h1>
          <p className="text-sm text-gray-400 mt-1">Events and schedules.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Upcoming Events</p>
          <p className="text-2xl  mt-2 text-blue-400">24</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">This Week</p>
          <p className="text-2xl  mt-2 text-purple-400">8</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Holidays</p>
          <p className="text-2xl  mt-2 text-emerald-400">3</p>
        </div>
      </div>

      <div className="my-3">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center my-3 my-3 bg-dark-tertiary/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search hospital calendar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded text-sm focus:outline-none focus:border-emerald-500 text-white w-64 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 p-2 bg-dark-tertiary border border-gray-700 rounded text-sm hover:bg-gray-800 transition-colors text-white">
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