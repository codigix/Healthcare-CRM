"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ExpiryAnalysisReportPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Month', accessor: 'month', sortable: true },
    { header: 'Expired Value', accessor: 'expiredvalue', sortable: true },
    { header: 'Returned for Credit', accessor: 'returnedforcredit', sortable: true },
    { header: 'Net Loss', accessor: 'netloss', sortable: true },
    { header: 'Alerts Triggered', accessor: 'alertstriggered', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Paid' || val === 'Approved' || val === 'Processed' || val === 'Clear' || val === 'Active' || val === 'Delivered' || val === 'Sent' || val === 'Received' || val === 'Issued' || val === 'Completed' || val === 'Matched' || val === 'Destroyed' || val === 'Closed' || val === 'Optimal' || val === 'Maintained' || val === 'Valid' || val === 'Generated' || val === 'Analyzed' || val === 'Met Target' || val === 'Within Limit' || val === 'Claim Submitted';
        const isWarning = val === 'Pending' || val === 'Pending Auth' || val === 'Partially Paid' || val === 'Pending Approval' || val === 'Pending Collection' || val === 'Overdue' || val === 'Scheduled' || val === 'Pending Dispatch' || val === 'Out for Delivery' || val === 'Pending QA' || val === 'Variance Logged' || val === 'Pending Agency' || val === 'Quarantined' || val === 'Expiring Soon' || val === 'Reorder Now' || val === 'Action Required' || val === 'Draft';
        const isNeutral = val === 'Unpaid' || val === 'Restocked' || val === 'Dispatched' || val === 'Returned to Vendor';
        const isDanger = val === 'Rejected' || val === 'Rejected (Not Covered)' || val === 'Exceeded Limit' || val === 'Patient Refused' || val === 'Failed' || val === 'Discarded';

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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    return { month: months[i] + ' 2026', expiredvalue: '$' + (500 + i * 50), returnedforcredit: '$' + (400 + i * 40), netloss: '$' + (100 + i * 10), alertstriggered: (15 + i).toString(), status: 'Generated' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Expiry Analysis Report
          </h1>
          <p className="text-sm text-gray-400 mt-1">Financial impact analysis of medicines expired and nearing expiry.</p>
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
          <p className="text-sm text-gray-400 font-medium">YTD Net Loss</p>
          <p className={"text-2xl font-bold mt-2 " + "text-red-400"}>$1,200</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Successfully Returned</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>$5,400</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Expiry Rate</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>0.8%</p>
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