"use client";

import React, { useState } from 'react';
import { Users, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function StaffTransfersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Req ID', accessor: 'reqid', sortable: true },
    { header: 'Employee', accessor: 'employee', sortable: true },
    { header: 'From Dept', accessor: 'fromdept', sortable: true },
    { header: 'To Dept', accessor: 'todept', sortable: true },
    { header: 'Effective Date', accessor: 'effectivedate', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Active' || row.status === 'Completed' || row.status === 'Approved' || row.status === 'On Duty' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
          row.status === 'Pending' || row.status === 'On Leave' || row.status === 'Assigned' || row.status === 'Pending Print' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
            'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
          {row.status}
        </span>
      ),
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

  const mockData = Array.from({ length: 6 }).map((_, i) => {
    const emps = ['Michael Chang', 'Jessica Roberts', 'Amanda Clarke', 'David Foster', 'James Wilson', 'Lisa Cuddy'];
    const froms = ['General Ward', 'Recruitment', 'Billing', 'Helpdesk', 'Ambulance 1', 'Records'];
    const tos = ['ICU', 'Employee Relations', 'Front Desk', 'IT Sec Ops', 'Emergency', 'Administration'];
    const dates = ['12 Aug, 2026', '15 Aug, 2026', '01 Sep, 2026', '10 Aug, 2026', '05 Aug, 2026', '01 Aug, 2026'];
    const statuses = ['Approved', 'Pending', 'Rejected', 'Approved', 'Completed', 'Completed'];
    return {
      reqid: `TRF-${3001 + i}`,
      employee: emps[i],
      fromdept: froms[i],
      todept: tos[i],
      effectivedate: dates[i],
      status: statuses[i]
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl  text-white flex items-center gap-2">
            <Users className="text-blue-500" size={24} />
            Staff Transfers
          </h1>
          <p className="text-sm text-gray-400 mt-1">Process internal transfers and promotions.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Pending Transfers</p>
          <p className="text-2xl  mt-2 text-amber-400">8</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Completed This Month</p>
          <p className="text-2xl  mt-2 text-emerald-400">24</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Rejected</p>
          <p className="text-2xl  mt-2 text-red-400">2</p>
        </div>
      </div>

      <div className="my-3">
        <div className="my-3 flex justify-between">
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