"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function PatientVitalsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Record ID', accessor: 'recordid', sortable: true },
    { header: 'Patient Name', accessor: 'patientname', sortable: true },
    { header: 'BP (mmHg)', accessor: 'bpmmhg', sortable: true },
    { header: 'Heart Rate', accessor: 'heartrate', sortable: true },
    { header: 'Temp (F)', accessor: 'tempf', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Confirmed' || val === 'Active' || val === 'Normal' || val === 'Reviewed' || val === 'Controlled' || val === 'Standard Care' || val === 'Finalized' || val === 'Resolved' || val === 'Issued' || val === 'Dispensed' || val === 'Approved' || val === 'Delivered' || val === 'Results Ready' || val === 'Completed' || val === 'Reserved';
        const isWarning = val === 'Investigating' || val === 'Elevated' || val === 'Critical' || val === 'Pending Review' || val === 'Intervening' || val === 'Draft' || val === 'Provisional' || val === 'Requires Consult' || val === 'Failed' || val === 'Pending Collection' || val === 'Pending Read' || val === 'Pending' || val === 'Pending Schedule' || val === 'Urgent Request' || val === 'Pending Auth' || val === 'In Progress';
        const isNeutral = val === 'Ruled Out' || val === 'Archived' || val === 'Monitoring' || val === 'N/A' || val === 'Expired' || val === 'Transmitting' || val === 'In Process' || val === 'Scheduled' || val === 'Pending Crossmatch';

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
    const bps = ['120/80', '110/70', '145/95', '115/75', '160/100'];
    const hrs = ['72 bpm', '65 bpm', '98 bpm', '70 bpm', '110 bpm'];
    const temps = ['98.6', '98.4', '99.2', '98.5', '101.4'];
    const statuses = ['Normal', 'Normal', 'Elevated', 'Normal', 'Critical'];
    return { recordid: 'VIT-' + (3001 + i), patientname: names[i], bpmmhg: bps[i], heartrate: hrs[i], tempf: temps[i], status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Patient Vitals
          </h1>
          <p className="text-sm text-gray-400 mt-1">Record and track routine patient vital signs.</p>
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
          <p className="text-sm text-gray-400 font-medium">Vitals Logged Today</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>84</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Abnormal Vitals</p>
          <p className={"text-2xl font-bold mt-2 " + "text-red-400"}>6</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Pending Checks</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>12</p>
        </div>
      </div>

      <div className="">
        <div className="my-3 flex justify-between items-center my-3">
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