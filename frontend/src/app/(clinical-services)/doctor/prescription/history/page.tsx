"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function PrescriptionHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Rx ID', accessor: 'rxid', sortable: true },
    { header: 'Patient Name', accessor: 'patientname', sortable: true },
    { header: 'Date Issued', accessor: 'dateissued', sortable: true },
    { header: 'Primary Med', accessor: 'primarymed', sortable: true },
    { header: 'Dispensed', accessor: 'dispensed', sortable: true },
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
    const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
    const dates = ['12 Jun 2026', '10 Jun 2026', '01 Jun 2026', '15 May 2026', '10 May 2026'];
    const meds = ['Amoxicillin', 'Lisinopril', 'Paracetamol', 'Metformin', 'Ibuprofen'];
    const disps = ['Yes', 'Yes', 'Yes', 'No', 'Yes'];
    const statuses = ['Dispensed', 'Dispensed', 'Dispensed', 'Expired', 'Dispensed'];
    return { rxid: 'RXH-' + (2001 + i), patientname: names[i], dateissued: dates[i], primarymed: meds[i], dispensed: disps[i], status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Prescription History
          </h1>
          <p className="text-sm text-gray-400 mt-1">Log of all past prescriptions issued to patients.</p>
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
          <p className="text-sm text-gray-400 font-medium">Total Rx Logged</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>45,120</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Dispensed</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>98%</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Expired</p>
          <p className={"text-2xl font-bold mt-2 " + "text-gray-400"}>2%</p>
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