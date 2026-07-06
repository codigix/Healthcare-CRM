"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function SurgicalAuditPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Surgery ID', accessor: 'surgeryid', sortable: true },
    { header: 'Procedure', accessor: 'procedure', sortable: true },
    { header: 'Surgeon', accessor: 'surgeon', sortable: true },
    { header: 'Est. Time', accessor: 'esttime', sortable: true },
    { header: 'Actual Time', accessor: 'actualtime', sortable: true },
    { header: 'Complication', accessor: 'complication', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Active' || val === 'Completed' || val === 'Stabilized' || val === 'Securely Archived' || val === 'Dispatched' || val === 'Signed' || val === 'Finalized' || val === 'Handed Over' || val === 'Indexed' || val === 'Complete' || val === 'Merged' || val === 'Digitized' || val === 'Secured' || val === 'Coded' || val === 'Mapped' || val === 'Assigned' || val === 'Passed QA' || val === 'Compliant' || val === 'Audited' || val === 'Monitored' || val === 'Closed' || val === 'Acknowledged' || val === 'Submitted' || val === 'Published';
        const isWarning = val === 'Review' || val === 'Review Needed' || val === 'Action Required' || val === 'In Progress' || val === 'Pending Auth' || val === 'Dictation Pending' || val === 'Pending Eval' || val === 'Deficient' || val === 'Pending Doctor' || val === 'Merge Pending' || val === 'Pending QA' || val === 'Pending Coding' || val === 'Feedback Sent' || val === 'Under Review' || val === 'Action Needed' || val === 'Report Drafting';
        const isNeutral = val === 'Draft' || val === 'Checked Out' || val === 'In Transit' || val === 'Returned';
        const isDanger = val === 'Archived' || val === 'Overdue' || val === 'Failed QA' || val === 'Failed' || val === 'Rejected' || val === 'Missing Document';

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
    return { surgeryid: 'SUR-' + (6001 + i), procedure: 'Appendectomy', surgeon: 'Dr. Surgeon', esttime: '60 Mins', actualtime: (55 + i * 10) + ' Mins', complication: i === 4 ? 'Prolonged Time' : 'None', status: 'Audited' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Surgical Audit
          </h1>
          <p className="text-sm text-gray-400 mt-1">Review of surgical outcomes, prolonged OT times, and post-op complications.</p>
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
          <p className="text-sm text-gray-400 font-medium">Avg OT Utilization</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>85%</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Surgical Site Infections</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>0</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Re-explorations</p>
          <p className={"text-2xl font-bold mt-2 " + "text-red-400"}>1</p>
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