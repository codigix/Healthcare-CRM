"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function GatePassMaterialPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Gate Pass No', accessor: 'gatepassno', sortable: true },
    { header: 'Type', accessor: 'type', sortable: true },
    { header: 'Vendor/Person', accessor: 'vendorperson', sortable: true },
    { header: 'Items Description', accessor: 'itemsdescription', sortable: true },
    { header: 'Authorized By', accessor: 'authorizedby', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Active' || val === 'Available' || val === 'Pass' || val === 'On Track' || val === 'Completed' || val === 'Functional' || val === 'Deployed' || val === 'Compliant' || val === 'Clean' || val === 'Signed Off' || val === 'Sufficient' || val === 'On Duty' || val === 'Normal' || val === 'Resolved' || val === 'Returned' || val === 'Sterile';
        const isWarning = val === 'Under Maintenance' || val === 'Pending Approval' || val === 'In Progress' || val === 'Action Required' || val === 'Open' || val === 'Due Now' || val === 'Scheduled' || val === 'Awaiting Spares' || val === 'Assigned' || val === 'Due Soon' || val === 'Processing' || val === 'Overstaying' || val === 'Pending Return' || val === 'Under Investigation' || val === 'In Safe';
        const isNeutral = val === 'Pending' || val === 'Logged' || val === 'Verified' || val === 'Generated';
        const isDanger = val === 'Failed' || val === 'Faulty' || val === 'Offline' || val === 'Condemned';

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
    return { gatepassno: 'GP-' + (2001 + i), type: i % 2 === 0 ? 'Returnable' : 'Non-Returnable', vendorperson: 'Vendor A', itemsdescription: 'IT Equipment Repair', authorizedby: 'IT Head', status: i === 0 ? 'Pending Return' : 'Closed' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Gate Pass (Material)
          </h1>
          <p className="text-sm text-gray-400 mt-1">Returnable and non-returnable gate passes for material entering/leaving premises.</p>
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
          <p className="text-sm text-gray-400 font-medium">Active Passes</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>15</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Pending Return</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>3</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Outward Movement</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>45 (Today)</p>
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