"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function AdmittedPatientsIPDPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'IPD No', accessor: 'ipdno', sortable: true },
    { header: 'Patient Name', accessor: 'patientname', sortable: true },
    { header: 'Ward/Bed', accessor: 'wardbed', sortable: true },
    { header: 'Diagnosis', accessor: 'diagnosis', sortable: true },
    { header: 'Admitted On', accessor: 'admittedon', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Stable' || val === 'Completed' || val === 'Signed' || val === 'Active' || val === 'Cleared' || val === 'Stabilized' || val === 'Confirmed' || val === 'Ready for Discharge';
        const isWarning = val === 'Critical' || val === 'Overdue' || val === 'Pending Review' || val === 'Update Required' || val === 'In Progress' || val === 'Immediate' || val === 'Urgent' || val === 'Active Code' || val === 'Resuscitation';
        const isNeutral = val === 'Pending' || val === 'Draft' || val === 'Scheduled' || val === 'Pending Transfer' || val === 'Awaiting Bed' || val === 'Waiting Lab' || val === 'Observation' || val === 'Provisional' || val === 'Archived';

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
    const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
    const beds = ['ICU-01', 'General-12', 'General-14', 'Private-02', 'ICU-03'];
    const diags = ['Blunt Trauma', 'Exhaustion', 'Fracture', 'Burns', 'Concussion'];
    const dates = ['12 Jun', '14 Jun', '15 Jun', '10 Jun', '16 Jun'];
    const statuses = ['Critical', 'Stable', 'Stable', 'Stable', 'Ready for Discharge'];
    return { ipdno: 'IPD-' + (1001 + i), patientname: names[i], wardbed: beds[i], diagnosis: diags[i], admittedon: dates[i], status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Admitted Patients (IPD)
          </h1>
          <p className="text-sm text-gray-400 mt-1">List of all inpatients currently under your primary care.</p>
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
          <p className="text-sm text-gray-400 font-medium">My IPD Patients</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>18</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Critical Condition</p>
          <p className={"text-2xl font-bold mt-2 " + "text-red-400"}>2</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Ready for Discharge</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>4</p>
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