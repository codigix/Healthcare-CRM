"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function BenchmarkingComparisonPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Entity', accessor: 'entity', sortable: true },
    { header: 'Comparison Metric', accessor: 'comparisonmetric', sortable: true },
    { header: 'Score', accessor: 'score', sortable: true },
    { header: 'Industry Avg', accessor: 'industryavg', sortable: true },
    { header: 'Percentile', accessor: 'percentile', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Active' || val === 'Normal' || val === 'Optimal' || val === 'Approved' || val === 'Exceeding' || val === 'Excellent' || val === 'Leading' || val === 'Processed' || val === 'On Track' || val === 'Improving' || val === 'Reviewed' || val === 'Completed';
        const isWarning = val === 'Pending' || val === 'High' || val === 'Warning' || val === 'Action Required' || val === 'Review Needed' || val === 'Pending Review' || val === 'High Alert' || val === 'Under Review' || val === 'Delayed' || val === 'High Volume';
        const isNeutral = val === 'Stable' || val === 'Archived';

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
    const entities = ['Cardiology Dept', 'Neurology Dept', 'North Branch', 'South Branch', 'ER Dept'];
    const metrics = ['Infection Rate', 'Recovery Time', 'Patient Satisfaction', 'Patient Satisfaction', 'Wait Time'];
    const scores = ['0.5%', '4.2 Days', '4.9/5', '4.6/5', '12 mins'];
    const ind = ['1.2%', '5.1 Days', '4.2/5', '4.2/5', '25 mins'];
    const percs = ['95th', '88th', '99th', '85th', '92nd'];
    const statuses = ['Leading', 'Above Avg', 'Leading', 'Above Avg', 'Leading'];
    return { entity: entities[i], comparisonmetric: metrics[i], score: scores[i], industryavg: ind[i], percentile: percs[i], status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Benchmarking & Comparison
          </h1>
          <p className="text-sm text-gray-400 mt-1">Compare departments and branches.</p>
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
          <p className="text-sm text-gray-400 font-medium">Top Percentile</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>3 Depts</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Below Avg</p>
          <p className={"text-2xl font-bold mt-2 " + "text-gray-400"}>0</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Industry Rank</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>#12</p>
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