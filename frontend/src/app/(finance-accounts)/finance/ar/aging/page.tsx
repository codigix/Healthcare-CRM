"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function AgingAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Account Type', accessor: 'accounttype', sortable: true },
    { header: '0-30 Days', accessor: '030days', sortable: true },
    { header: '31-60 Days', accessor: '3160days', sortable: true },
    { header: '61-90 Days', accessor: '6190days', sortable: true },
    { header: '> 90 Days', accessor: '90days', sortable: true },
    { header: 'Total', accessor: 'total', sortable: true },
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

  const mockData = Array.from({ length: 4 }).map((_, i) => {
    const types = ['Patient', 'Insurance', 'Corporate', 'Government'];
    return { accounttype: types[i], '030days': '$' + (100000 + i * 20000), '3160days': '$' + (50000 + i * 10000), '6190days': '$' + (20000 + i * 5000), '90days': '$' + (10000 + i * 10000), total: '$' + (180000 + i * 45000) };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Aging Analysis
          </h1>
          <p className="text-sm text-gray-400 mt-1">Categorizing all receivables by the length of time they have been outstanding.</p>
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
          <p className="text-sm text-gray-400 font-medium">Overall AR</p>
          <p className={"text-2xl font-bold mt-2 " + "text-red-400"}>$3.4M</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Healthy (<30D)</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>$1.8M</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Toxic (>90D)</p>
          <p className={"text-2xl font-bold mt-2 " + "text-red-400"}>$650K</p>
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