"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function CommunicationHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Log ID', accessor: 'logid', sortable: true },
    { header: 'UHID', accessor: 'uhid', sortable: true },
    { header: 'Patient', accessor: 'patient', sortable: true },
    { header: 'Channel', accessor: 'channel', sortable: true },
    { header: 'Direction', accessor: 'direction', sortable: true },
    { header: 'Timestamp', accessor: 'timestamp', sortable: true },
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
    const channels = ['WhatsApp', 'SMS', 'Email', 'Voice', 'WhatsApp'];
    return { logid: 'LOG-' + (4001 + i), uhid: 'UHID-' + (100 + i), patient: 'Patient ' + (1 + i), channel: channels[i], direction: i === 0 ? 'Inbound' : 'Outbound', timestamp: 'Today 10:' + (10 + i) };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Communication History
          </h1>
          <p className="text-sm text-gray-400 mt-1">Central audit log of every message, email, or call made to any patient.</p>
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
          <p className="text-sm text-gray-400 font-medium">Total Logs (YTD)</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>1.2M</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Most Used Channel</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>WhatsApp</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Outbound %</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>75%</p>
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