"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function DoctorProfilesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Doctor ID', accessor: 'doctorid', sortable: true },
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Specialty', accessor: 'specialty', sortable: true },
    { header: 'License No', accessor: 'licenseno', sortable: true },
    { header: 'Consultation Fee', accessor: 'consultationfee', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Active' || val === 'Completed' || val === 'Available' || val === 'Checked In';
        const isWarning = val === 'Locked' || val === 'Expiring Soon' || val === 'Fully Booked' || val === 'Scheduled';
        const isNeutral = val === 'On Leave';

        let colorClass = 'bg-red-500/10 text-red-500 border border-red-500/20';
        if (isGood) colorClass = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
        else if (isWarning) colorClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        else if (isNeutral) colorClass = 'bg-gray-500/10 text-gray-400 border border-gray-500/20';

        return (
          <span className={"px-2 py-1 rounded text-xs font-medium " + colorClass}>
            {val}
          </span>
        )
      },
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

  const mockData = Array.from({ length: 5 }).map((_, i) => {
    const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Derek Shepherd', 'Dr. Meredith Grey', 'Dr. Cristina Yang'];
    const specs = ['Cardiology', 'Plastic Surgery', 'Neurosurgery', 'General Surgery', 'Cardiothoracic'];
    const lics = ['MED-109283', 'MED-293847', 'MED-948273', 'MED-102938', 'MED-584739'];
    const fees = ['$150', '$200', '$250', '$150', '$300'];
    const statuses = ['Active', 'Active', 'Active', 'Active', 'Expiring Soon'];
    return { doctorid: 'DOC-' + (3001 + i), name: docs[i], specialty: specs[i], licenseno: lics[i], consultationfee: fees[i], status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Doctor Profiles
          </h1>
          <p className="text-sm text-gray-400 mt-1">Directory of clinical staff profiles, credentials, and settings.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all">
            <Plus size={16} /> Create New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Total Doctors</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>124</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Active/On-Duty</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>85</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Licenses Expiring</p>
          <p className={"text-2xl font-bold mt-2 " + "text-red-400"}>2</p>
        </div>
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
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-white w-64 transition-colors"
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