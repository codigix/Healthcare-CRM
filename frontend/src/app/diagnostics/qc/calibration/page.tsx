"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function EquipmentCalibrationPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Machine ID', accessor: 'machineid', sortable: true },
    { header: 'Machine Name', accessor: 'machinename', sortable: true },
    { header: 'Last Calibrated', accessor: 'lastcalibrated', sortable: true },
    { header: 'Next Due Date', accessor: 'nextduedate', sortable: true },
    { header: 'Performed By', accessor: 'performedby', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Pass' || val === 'Passed' || val === 'Valid' || val === 'Completed' || val === 'Validated' || val === 'Online' || val === 'Active' || val === 'Resolved' || val === 'Sent to Portal' || val === 'Signed' || val === 'Delivered' || val === 'Amended' || val === 'Available' || val === 'Printed' || val === 'Read' || val === 'Opened' || val === 'Generated' || val === 'Clear' || val === 'Met Target' || val === 'Reconciled' || val === 'Excellent' || val === 'Good' || val === 'Connected';
        const isWarning = val === 'Warning (1:2s)' || val === 'Pending Results' || val === 'Due Soon' || val === 'Pending' || val === 'Pending Validation' || val === 'Expiring Soon' || val === 'Offline - Repair' || val === 'Under Repair' || val === 'Pending Dispatch' || val === 'Pending Sign-off' || val === 'Expiring' || val === 'Printing' || val === 'Sent' || val === 'Backlog' || val === 'Lagging' || val === 'Average' || val === 'Draft';
        const isNeutral = val === 'Archived' || val === 'Inactive' || val === 'Disconnected' || val === 'Retry Pending';
        const isDanger = val === 'Fail (1:3s)' || val === 'Expired' || val === 'Low Stock' || val === 'Critical Low' || val === 'Held for Review' || val === 'Failed' || val === 'Bounced' || val === 'DND Failed' || val === 'Revoked';

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
    const machines = ['Cobas 6000', 'Sysmex XN', 'Architect', 'Centrifuge', 'Microscope'];
    const statuses = ['Valid', 'Valid', 'Due Soon', 'Valid', 'Valid'];
    return { machineid: 'EQ-' + (3001 + i), machinename: machines[i], lastcalibrated: '01 Jul 2026', nextduedate: '31 Jul 2026', performedby: 'Tech John', status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Equipment Calibration
          </h1>
          <p className="text-sm text-gray-400 mt-1">Record of routine machine calibration to ensure accurate results.</p>
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
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Calibrations Due</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>2</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Completed (Month)</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>15</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Overdue</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>0</p>
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