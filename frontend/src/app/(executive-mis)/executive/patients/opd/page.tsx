"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function OPDAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Specialty', accessor: 'specialty', sortable: true },
    { header: 'Total Visits', accessor: 'totalvisits', sortable: true },
    { header: 'New vs Review', accessor: 'newvsreview', sortable: true },
    { header: 'Avg Wait Time', accessor: 'avgwaittime', sortable: true },
    { header: 'Conversion to IPD', accessor: 'conversiontoipd', sortable: true },
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
    const specs = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Internal Med', 'Gynecology'];
    return { specialty: specs[i], totalvisits: (1500 - i * 200).toString(), newvsreview: '30% / 70%', avgwaittime: (20 + i * 5) + ' Mins', conversiontoipd: (10 - i) + '%', status: 'Optimal' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-500" size={24} />
            OPD Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-1">Trends, demographics, and patterns of Outpatient Department visits.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Total OPD (MTD)</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>12,500</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">New Patients</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>3,200</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Avg Conversion</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>8%</p>
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