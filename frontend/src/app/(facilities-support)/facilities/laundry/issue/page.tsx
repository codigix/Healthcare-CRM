"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function LinenIssuePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Transaction ID', accessor: 'transactionid', sortable: true },
    { header: 'Department/Ward', accessor: 'departmentward', sortable: true },
    { header: 'Linen Type', accessor: 'linentype', sortable: true },
    { header: 'Qty Issued', accessor: 'qtyissued', sortable: true },
    { header: 'Issued By', accessor: 'issuedby', sortable: true },
    { header: 'Date', accessor: 'date', sortable: true },
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
    return { transactionid: 'IS-' + (1001 + i), departmentward: 'Ward ' + (1 + i), linentype: 'Bed Sheets', qtyissued: (50 - i * 5).toString(), issuedby: 'Store Admin', date: 'Today 08:00' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Linen Issue
          </h1>
          <p className="text-sm text-gray-400 mt-1">Dispatching fresh linen from the central store to various wards and departments.</p>
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
          <p className="text-sm text-gray-400 font-medium">Pieces Issued (Today)</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>1,200</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Requests Pending</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>4</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Top Requestor</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>ICU</p>
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