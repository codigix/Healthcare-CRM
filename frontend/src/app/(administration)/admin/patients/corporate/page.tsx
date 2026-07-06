"use client";

import React, { useState } from 'react';
import { Activity, Building2, Users, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function CorporatePatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Corp ID', accessor: 'corpid', sortable: true },
    { header: 'Patient Name', accessor: 'patientname', sortable: true },
    { header: 'Company', accessor: 'company', sortable: true },
    { header: 'Insurance TPA', accessor: 'insurancetpa', sortable: true },
    { header: 'Policy Max', accessor: 'policymax', sortable: true },
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
    const names = ['Michael Chang', 'Jessica Roberts', 'David Foster', 'Amanda Clarke', 'James Wilson', 'Lisa Cuddy'];
    const companies = ['TechCorp Inc.', 'Global Logistics', 'Stark Industries', 'Wayne Enterprises', 'TechCorp Inc.', 'Massive Dynamic'];
    const tpas = ['BlueCross', 'Aetna', 'MediShield', 'UnitedHealth', 'BlueCross', 'Cigna'];
    const maxes = ['$500,000', '$250,000', '$1,000,000', '$750,000', '$500,000', '$1,000,000'];
    const statuses = ['Approved', 'Pending', 'Approved', 'Discharged', 'Rejected', 'Approved'];
    return {
      corpid: `CRP-${4001 + i}`,
      patientname: names[i],
      company: companies[i],
      insurancetpa: tpas[i],
      policymax: maxes[i],
      status: statuses[i]
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl  text-white flex items-center gap-2">
            <Activity className="text-indigo-500" size={24} />
            Corporate Patients
          </h1>
          <p className="text-sm text-gray-400 mt-1">Track patients associated with corporate tie-ups and insurance.</p>
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
          <p className="text-sm text-gray-400 font-medium">Corporate Ties</p>
          <p className="text-2xl  mt-2 text-blue-400">120</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Active Patients</p>
          <p className="text-2xl  mt-2 text-emerald-400">315</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Pending Approvals</p>
          <p className="text-2xl  mt-2 text-amber-400">18</p>
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