"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ControlledDrugIssuePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Issue ID', accessor: 'issueid', sortable: true },
    { header: 'Drug Name', accessor: 'drugname', sortable: true },
    { header: 'Qty Issued', accessor: 'qtyissued', sortable: true },
    { header: 'Issued To (Staff)', accessor: 'issuedtostaff', sortable: true },
    { header: 'Patient/OT', accessor: 'patientot', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Dispensed' || val === 'Verified' || val === 'Completed' || val === 'Fulfilled' || val === 'Dispatched' || val === 'Restocked' || val === 'In Stock' || val === 'Available' || val === 'Active' || val === 'Stock Updated' || val === 'Credit Received' || val === 'Overridden by Dr' || val === 'Prescription Modified' || val === 'Alternative Prescribed' || val === 'Dose Adjusted' || val === 'Drug Stopped' || val === 'Safe' || val === 'De-escalated' || val === 'Balanced' || val === 'Issued & Logged' || val === 'Audit Passed' || val === 'Stock Arrived' || val === 'Notified' || val === 'Approved' || val === 'PO Created' || val === 'Sensitive (Continue)' || val === 'Intentional (Overridden)' || val === 'Acknowledged' || val === 'Received';
        const isWarning = val === 'Pending' || val === 'Processing' || val === 'Draft' || val === 'Pending Clarification' || val === 'Packing' || val === 'Waiting' || val === 'Dispensing' || val === 'Awaiting Stock' || val === 'Low Stock' || val === 'Expiring Soon' || val === 'Pending Action' || val === 'Pending Approval' || val === 'Pending Auth' || val === 'Partially Received' || val === 'Pending QA' || val === 'Warning' || val === 'Pending Dispatch' || val === 'Pending Verification' || val === 'Pending Culture' || val === 'Sent to Vendor';
        const isNeutral = val === 'Ready' || val === 'Written Off' || val === 'Consumed' || val === 'Sent to Lab';
        const isDanger = val === 'Rejected' || val === 'Expired' || val === 'Out of Stock' || val === 'Quarantined' || val === 'Delayed' || val === 'Shortage Noted' || val === 'Blacklisted' || val === 'Price Mismatch' || val === 'Resistant (Change)';

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
    return { issueid: 'CDI-' + (1001 + i), drugname: 'Fentanyl 50mcg', qtyissued: '2 Ampoules', issuedtostaff: 'Nurse Joy', patientot: 'OT 1 / Pat ' + (1 + i), status: 'Issued & Logged' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Controlled Drug Issue
          </h1>
          <p className="text-sm text-gray-400 mt-1">Logging the issuance of narcotics to OT and ICU against specific prescriptions.</p>
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
          <p className="text-sm text-gray-400 font-medium">Issues Today</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>18</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Doctor Auth Pending</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>0</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Empty Ampoules Rtd</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>15</p>
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