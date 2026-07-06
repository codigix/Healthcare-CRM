"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function DischargeAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Discharge Type', accessor: 'dischargetype', sortable: true },
    { header: 'Total Count', accessor: 'totalcount', sortable: true },
    { header: 'Avg Discharge Time', accessor: 'avgdischargetime', sortable: true },
    { header: 'Against Med Advice', accessor: 'againstmedadvice', sortable: true },
    { header: 'Readmit Risk', accessor: 'readmitrisk', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'On Target' || val === 'Positive' || val === 'Stable' || val === 'Optimal' || val === 'Normal' || val === 'Growing' || val === 'Efficient' || val === 'Strong' || val === 'Excellent' || val === 'Within Limits' || val === 'Compliant' || val === 'Reconciled' || val === 'Profitable' || val === 'Paid' || val === 'Healthy';
        const isWarning = val === 'Needs Attention' || val === 'At Risk' || val === 'High Utilization' || val === 'Requires Review' || val === 'Review Required' || val === 'Near Capacity' || val === 'High Variance' || val === 'Payment Delayed' || val === 'Action Required';
        const isNeutral = val === 'Acknowledged';
        const isDanger = val === 'Action Needed' || val === 'Critical' || val === 'Critical Monitored' || val === 'Inefficient' || val === 'Loss Making' || val === 'High Disallowance' || val === 'High Risk';

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
    return { dischargetype: i === 0 ? 'Routine' : i === 1 ? 'Transfer' : i === 2 ? 'LAMA' : i === 3 ? 'Absconded' : 'Deceased', totalcount: i === 0 ? '1200' : i === 1 ? '50' : '25', avgdischargetime: '3 Hrs', againstmedadvice: i === 2 ? 'Yes' : 'No', readmitrisk: i === 2 ? 'High' : 'Low', status: i === 2 ? 'Requires Review' : 'Normal' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-500" size={24} />
            Discharge Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-1">Analysis of discharge process efficiency and destination outcomes.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Discharges (MTD)</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>1,350</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Avg Process Time</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>3.5 Hrs</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">LAMA %</p>
          <p className={"text-2xl font-bold mt-2 " + "text-red-400"}>2.1%</p>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between items-center my-3
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
      </div >
    </div >
  );
}