"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function SurgeryStatisticsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Specialty', accessor: 'specialty', sortable: true },
    { header: 'Total Surgeries', accessor: 'totalsurgeries', sortable: true },
    { header: 'Major Surgeries', accessor: 'majorsurgeries', sortable: true },
    { header: 'Minor Surgeries', accessor: 'minorsurgeries', sortable: true },
    { header: 'Complication Rate', accessor: 'complicationrate', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Completed' || val === 'Results Ready' || val === 'Reported' || val === 'Issued' || val === 'Compatible' || val === 'Transfused' || val === 'Completed (Passed)' || val === 'Returned' || val === 'Admitted' || val === 'Transferred' || val === 'Discharged' || val === 'Signed & Sent' || val === 'Generated' || val === 'Met Target' || val === 'Acceptable' || val === 'Excellent' || val === 'Optimal' || val === 'Adequate Stock' || val === 'Active';
        const isWarning = val === 'Pending' || val === 'STAT Pending' || val === 'Processing' || val === 'Scheduled' || val === 'Pending Blood Bank' || val === 'Reserved' || val === 'In Progress' || val === 'Transfusing' || val === 'Washing' || val === 'Ultrasonic Cleaning' || val === 'Packing' || val === 'Repair' || val === 'Expiring Soon' || val === 'Running' || val === 'In OT' || val === 'Pending Bed' || val === 'Expected' || val === 'En Route' || val === 'Pending Handover' || val === 'Waiting for Bed' || val === 'Pending Cleaning' || val === 'Summary Pending' || val === 'Pending Vitals' || val === 'Pending Companion' || val === 'Pending Sign-off' || val === 'Lagging' || val === 'High Variance' || val === 'Low Stock' || val === 'Maintenance' || val === 'Draft';
        const isNeutral = val === 'Sent to Lab' || val === 'Received' || val === 'In Fridge' || val === 'Available' || val === 'In Use' || val === 'Available (Sterile)';
        const isDanger = val === 'Closed' || val === 'Under Investigation';

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
    const specialties = ['General Surgery', 'Orthopedics', 'Cardiothoracic', 'Neurosurgery', 'Gynecology'];
    return { specialty: specialties[i], totalsurgeries: (50 + i * 10).toString(), majorsurgeries: (20 + i * 5).toString(), minorsurgeries: (30 + i * 5).toString(), complicationrate: '0.' + i + '%', status: 'Generated' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Surgery Statistics
          </h1>
          <p className="text-sm text-gray-400 mt-1">Breakdown of surgeries by specialty, surgeon, and complexity.</p>
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
          <p className="text-sm text-gray-400 font-medium">Total Surgeries (MTD)</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>345</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Major Cases</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>120</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Overall Success Rate</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>99.1%</p>
        </div>
      </div>

      <div className="bg-dark-secondary rounded-xl border border-gray-800 overflow-hidden">
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