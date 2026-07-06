"use client";

import React, { useState } from 'react';
import { Activity, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function HospitalManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Status', accessor: 'status', sortable: true },
    { header: 'Last Updated', accessor: 'updatedAt', sortable: true },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex justify-end gap-2">
          <button className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-white transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      )
    }
  ];

  const mockData = Array.from({ length: 12 }).map((_, i) => ({
    id: `${title.substring(0, 3).toUpperCase()}-${1000 + i}`,
    name: `Sample ${title} ${i + 1}`,
    status: i % 3 === 0 ? 'Pending' : 'Active',
    updatedAt: new Date(Date.now() - i * 86400000).toLocaleDateString()
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3 my-3">
        <div>
          <h1 className="text-2xl  text-white">Hospital Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage hospital branches and facilities.</p>
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
        {[
          { label: 'Total Records', value: '1,234', color: 'text-blue-400' },
          { label: 'Active', value: '856', color: 'text-emerald-400' },
          { label: 'Pending Review', value: '45', color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-dark-secondary rounded4 border border-gray-800">
            <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
            <p className={`text-2xl  mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="">
        <div className="flex justify-between items-center my-3 my-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search records..."
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