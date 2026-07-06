"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function VehicleFleetManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Vehicle No', accessor: 'vehicleno', sortable: true },
    { header: 'Type', accessor: 'type', sortable: true },
    { header: 'Driver Assigned', accessor: 'driverassigned', sortable: true },
    { header: 'Current Location', accessor: 'currentlocation', sortable: true },
    { header: 'Last Service', accessor: 'lastservice', sortable: true },
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
    const vehs = ['AMB-01 (ICU)', 'AMB-02 (BLS)', 'AMB-03 (BLS)', 'VAN-01 (Staff)', 'VAN-02 (Staff)'];
    const types = ['Advanced Life Support', 'Basic Life Support', 'Basic Life Support', 'Staff Transport', 'Staff Transport'];
    const drivers = ['John D.', 'Mike S.', 'Unassigned', 'Sarah T.', 'Unassigned'];
    const locs = ['En route (North St)', 'Base Station', 'Base Station', 'City Center Drop', 'Maintenance Bay'];
    const statuses = ['Active', 'Available', 'Available', 'Active', 'Maintenance'];
    return { vehicleno: vehs[i], type: types[i], driverassigned: drivers[i], currentlocation: locs[i], lastservice: '12 May, 2026', status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Vehicle & Fleet Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">Monitor hospital ambulances and transport vehicles.</p>
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
          <p className="text-sm text-gray-400 font-medium">Total Fleet</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>18</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Active/On-trip</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>5</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Available</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>12</p>
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