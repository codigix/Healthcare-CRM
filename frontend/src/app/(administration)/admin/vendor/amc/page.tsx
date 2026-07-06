"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function AMCContractsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Contract ID', accessor: 'contractid', sortable: true },
    { header: 'Vendor', accessor: 'vendor', sortable: true },
    { header: 'Equipment/System', accessor: 'equipmentsystem', sortable: true },
    { header: 'Start Date', accessor: 'startdate', sortable: true },
    { header: 'End Date', accessor: 'enddate', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Active' || val === 'Normal' || val === 'Optimal' || val === 'Approved' || val === 'Exceeding' || val === 'Excellent' || val === 'Leading' || val === 'Processed' || val === 'On Track' || val === 'Improving' || val === 'Reviewed' || val === 'Completed' || val === 'Compliant' || val === 'Available';
        const isWarning = val === 'Pending' || val === 'High' || val === 'Warning' || val === 'Action Required' || val === 'Review Needed' || val === 'Pending Review' || val === 'High Alert' || val === 'Under Review' || val === 'Delayed' || val === 'High Volume' || val === 'Expiring Soon' || val === 'In Use';
        const isNeutral = val === 'Stable' || val === 'Archived' || val === 'Maintenance' || val === 'Pending Pickup';

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
    const vendors = ['Siemens Health', 'GE Medical', 'Johnson Controls', 'Elevator Co', 'IT Infra Services'];
    const systems = ['MRI Scanner', 'CT Scanner', 'HVAC System', 'Lifts 1-4', 'Server Racks'];
    const starts = ['01 Jan, 2026', '15 Mar, 2026', '01 Jun, 2025', '12 Aug, 2025', '01 Nov, 2025'];
    const ends = ['31 Dec, 2027', '14 Mar, 2028', '31 May, 2026', '11 Aug, 2026', '31 Oct, 2026'];
    const statuses = ['Active', 'Active', 'Expiring Soon', 'Active', 'Active'];
    return { contractid: 'AMC-' + (1001 + i), vendor: vendors[i], equipmentsystem: systems[i], startdate: starts[i], enddate: ends[i], status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            AMC Contracts
          </h1>
          <p className="text-sm text-gray-400 mt-1">Annual Maintenance Contracts for equipment and facilities.</p>
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
          <p className="text-sm text-gray-400 font-medium">Active Contracts</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>45</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Expiring Soon</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>4</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Expired</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>0</p>
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