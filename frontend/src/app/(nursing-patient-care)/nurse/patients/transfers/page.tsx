"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function UnitTransfersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Transfer ID', accessor: 'transferid', sortable: true },
    { header: 'Patient Name', accessor: 'patientname', sortable: true },
    { header: 'From/To Unit', accessor: 'fromtounit', sortable: true },
    { header: 'Transfer Time', accessor: 'transfertime', sortable: true },
    { header: 'Reason', accessor: 'reason', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Completed' || val === 'Acknowledged' || val === 'Stable' || val === 'Allocated' || val === 'Cleared' || val === 'Normal' || val === 'Balanced' || val === 'Controlled' || val === '15 (Normal)' || val === 'Standard' || val === 'Administered' || val === 'Given' || val === 'Notified' || val === 'Recovered' || val === 'Signed' || val === 'Active';
        const isWarning = val === 'Pending Ack' || val === 'Observation' || val === 'Pending Transfer' || val === 'Awaiting Assessment' || val === 'Pending Meds' || val === 'Elevated' || val === 'Monitor closely' || val === 'Fluid Retention' || val === 'Intervening' || val === '12 (Mild)' || val === 'Monitor' || val === 'Monitor' || val === 'Due' || val === 'Sign Pending' || val === 'Running' || val === 'Awaiting Blood' || val === 'Pending Stock' || val === 'Rescheduled' || val === 'Scheduled';
        const isNeutral = val === 'Upcoming' || val === 'Off Duty' || val === 'Vacant' || val === 'Discharging' || val === 'In Transit' || val === 'Paused' || val === 'Discontinued' || val === 'In Progress';

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
    const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
    const units = ['ER -> ICU', 'ICU -> Ward', 'Ward -> Surgery', 'Surgery -> ICU', 'Ward -> Ward'];
    const statuses = ['In Transit', 'Completed', 'Pending', 'Completed', 'In Transit'];
    return { transferid: 'TRF-' + (6001 + i), patientname: names[i], fromtounit: units[i], transfertime: '14:30', reason: 'Upgrade of Care', status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Unit Transfers
          </h1>
          <p className="text-sm text-gray-400 mt-1">Patients moving into or out of your assigned unit.</p>
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
          <p className="text-sm text-gray-400 font-medium">Incoming Transfers</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>2</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Outgoing Transfers</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>1</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Completed</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>4</p>
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