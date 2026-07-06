"use client";

import React, { useState } from 'react';
import { Activity, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function SpecialtiesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Specialty ID', accessor: 'specialtyid', sortable: true },
    { header: 'Specialty Name', accessor: 'specialtyname', sortable: true },
    { header: 'Parent Dept', accessor: 'parentdept', sortable: true },
    { header: 'Specialists', accessor: 'specialists', sortable: true },
    { header: 'Wait Time (Avg)', accessor: 'waittimeavg', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Active' || row.status === 'On Track' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
          row.status === 'Pending' || row.status === 'Interim' || row.status === 'Warning' || row.status === 'Maintenance' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
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
    const specs = ['Interventional Cardiology', 'Neuro-Surgery', 'Pediatric Oncology', 'Trauma Surgery', 'MRI Diagnostics', 'Neonatology'];
    const parents = ['Cardiology', 'Neurology', 'Oncology', 'Emergency', 'Radiology', 'Pediatrics'];
    const specialists = [12, 8, 6, 24, 15, 18];
    const waitTimes = ['15 mins', '45 mins', '20 mins', '5 mins', '30 mins', '10 mins'];
    return {
      specialtyid: `SPC-${2001 + i}`,
      specialtyname: specs[i],
      parentdept: parents[i],
      specialists: specialists[i],
      waittimeavg: waitTimes[i],
      status: 'Active'
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl  text-white flex items-center gap-2">
            <Activity className="text-emerald-500" size={24} />
            Specialties
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage clinical specialties and sub-specialties.</p>
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
          <p className="text-sm text-gray-400 font-medium">Total Specialties</p>
          <p className="text-2xl  mt-2 text-blue-400">64</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Surgical</p>
          <p className="text-2xl  mt-2 text-emerald-400">24</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Consultation</p>
          <p className="text-2xl  mt-2 text-purple-400">40</p>
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