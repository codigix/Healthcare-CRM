"use client";

import React, { useState } from 'react';
import { Activity, Building2, Users, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function RoomAllocationPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Room No', accessor: 'roomno', sortable: true },
    { header: 'Room Type', accessor: 'roomtype', sortable: true },
    { header: 'Ward/Floor', accessor: 'wardfloor', sortable: true },
    { header: 'Amenities', accessor: 'amenities', sortable: true },
    { header: 'Current Rate', accessor: 'currentrate', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Active' || row.status === 'Available' || row.status === 'Stable' || row.status === 'Approved' || row.status === 'Discharged' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
          row.status === 'Admitted' || row.status === 'Occupied' || row.status === 'Under Obs' || row.status === 'Pending' || row.status === 'Visa Pending' || row.status === 'Cleaning' || row.status === 'Maintenance' || row.status === 'Reserved' || row.status === 'Inspection Required' || row.status === 'Full Capacity' || row.status === 'Police Notified' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
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

  const mockData = Array.from({ length: 6 }).map((_, i) => {
    const rooms = ['Room 101', 'Room 102', 'Suite 201', 'Room 305', 'Suite 401 (VIP)', 'Room 105'];
    const types = ['Semi-Private', 'Private', 'Deluxe Suite', 'Private', 'Presidential VIP', 'Semi-Private'];
    const wards = ['General Medical A', 'Surgical Ward B', 'Maternity Wing', 'Pediatric Ward', 'Main Tower (Top)', 'General Medical A'];
    const amenities = ['TV, AC', 'TV, AC, Fridge', 'Lounge, Kitchenette', 'TV, AC, Sofa', 'Full Apartment Setup', 'TV, AC'];
    const rates = ['$150/day', '$300/day', '$800/day', '$300/day', '$2,500/day', '$150/day'];
    const statuses = ['Occupied', 'Available', 'Occupied', 'Cleaning', 'Reserved', 'Occupied'];
    return {
      roomno: rooms[i],
      roomtype: types[i],
      wardfloor: wards[i],
      amenities: amenities[i],
      currentrate: rates[i],
      status: statuses[i]
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl  text-white flex items-center gap-2">
            <Activity className="text-indigo-500" size={24} />
            Room Allocation
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage private, semi-private, and VIP patient rooms.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Private Rooms</p>
          <p className="text-2xl  mt-2 text-blue-400">120</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Occupied</p>
          <p className="text-2xl  mt-2 text-amber-400">95</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Available</p>
          <p className="text-2xl  mt-2 text-emerald-400">25</p>
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
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-white w-64 transition-colors"
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