"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ColdStorageMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Cabinet No', accessor: 'cabinetno', sortable: true },
    { header: 'Current Temp', accessor: 'currenttemp', sortable: true },
    { header: 'Set Temp', accessor: 'settemp', sortable: true },
    { header: 'Alarm Status', accessor: 'alarmstatus', sortable: true },
    { header: 'Last Defrost', accessor: 'lastdefrost', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Active' || val === 'Available' || val === 'Completed' || val === 'Functional' || val === 'Optimal' || val === 'On Track' || val === 'Moving' || val === 'Logged' || val === 'Billed' || val === 'Normal' || val === 'Operational' || val === 'Standby' || val === 'Running' || val === 'Approved' || val === 'Issued' || val === 'Dispatched' || val === 'Filed' || val === 'Released';
        const isWarning = val === 'Pending Dispatch' || val === 'En Route to Patient' || val === 'Action Required' || val === 'Maintenance Due' || val === 'Pending' || val === 'Pending Approval' || val === 'Pending Police Clearance' || val === 'Scheduled' || val === 'Awaiting Purchase';
        const isNeutral = val === 'Stored' || val === 'Admitted' || val === 'Generated';
        const isDanger = val === 'Faulty' || val === 'Failed' || val === 'Rejected';

        let colorClass = 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
        if (isGood) colorClass = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
        else if (isWarning) colorClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        else if (isNeutral) colorClass = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        else if (isDanger) colorClass = 'bg-red-500/10 text-red-500 border border-red-500/20';

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
    return { cabinetno: 'C-' + (1 + i), currenttemp: i === 4 ? '8°C' : '3°C', settemp: '3°C', alarmstatus: i === 4 ? 'Triggered' : 'Normal', lastdefrost: 'Last Week', status: i === 4 ? 'Faulty' : 'Optimal' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Cold Storage Monitoring
          </h1>
          <p className="text-sm text-gray-400 mt-1">Monitoring temperature and maintenance of the mortuary cabinets.</p>
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
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Total Cabinets</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>12</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Functional</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>11</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Under Maintenance</p>
          <p className={"text-2xl font-bold mt-2 " + "text-red-400"}>1</p>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between items-center my-3">
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