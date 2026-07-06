"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function DepartmentAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Department', accessor: 'department', sortable: true },
    { header: 'Headcount', accessor: 'headcount', sortable: true },
    { header: 'Salary Cost %', accessor: 'salarycost', sortable: true },
    { header: 'Attrition %', accessor: 'attrition', sortable: true },
    { header: 'Avg Performance', accessor: 'avgperformance', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Active' || val === 'Verified' || val === 'Completed' || val === 'Approved' || val === 'Filed' || val === 'Compliant' || val === 'Recorded' || val === 'Monitored' || val === 'Cleared' || val === 'Read' || val === 'Published' || val === 'Ready' || val === 'Generated' || val === 'Stable' || val === 'Analyzed' || val === 'Valid';
        const isWarning = val === 'Scheduled' || val === 'Expiring Soon' || val === 'Pending Verification' || val === 'Action Required' || val === 'Incomplete' || val === 'Requires Review' || val === 'Due for Reading' || val === 'Under Investigation' || val === 'Pending Auth' || val === 'Pending Review' || val === 'Unread' || val === 'Response Pending' || val === 'Action Needed' || val === 'Over Budget' || val === 'Monitored';
        const isNeutral = val === 'Intervention Needed';
        const isDanger = val === 'Expired' || val === 'Non-Compliant' || val === 'Fail' || val === 'Closed' || val === 'Rejected';

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
    const depts = ['Nursing', 'Doctors', 'Administration', 'Support Staff', 'IT'];
    return { department: depts[i], headcount: (300 - i * 50).toString(), salarycost: (30 - i * 3) + '%', attrition: (15 - i) + '%', avgperformance: '3.' + (8 + i) + '/5', status: 'Analyzed' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Department Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-1">Comparing HR metrics (cost, attrition, performance) across different departments.</p>
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
          <p className="text-sm text-gray-400 font-medium">Largest Dept</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>Nursing (45%)</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Highest Cost</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>Doctors (40%)</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Best Retention</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>Administration</p>
        </div>
      </div>

      <div className="bg-dark-secondary rounded-xl border border-gray-800 overflow-hidden">
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