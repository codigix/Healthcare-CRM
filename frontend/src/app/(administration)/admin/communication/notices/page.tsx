"use client";

import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Filter, MoreVertical, Download, AlertTriangle } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function InternalNoticesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Notice ID', accessor: 'noticeid', sortable: true },
    { header: 'Subject', accessor: 'subject', sortable: true },
    { header: 'Target Audience', accessor: 'targetaudience', sortable: true },
    { header: 'Published By', accessor: 'publishedby', sortable: true },
    { header: 'Date', accessor: 'date', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Active' || row.status === 'Live' || row.status === 'Delivered' || row.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
          row.status === 'Draft' || row.status === 'Action Required' || row.status === 'Scheduled' || row.status === 'Sending...' || row.status === 'False Alarm' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
            row.status === 'Archived' || row.status === 'Expired' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
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
    const subjects = ['Updated Scrub Policy', 'Cafeteria Hours Change', 'New Parking Guidelines', 'IT System Maintenance', 'Annual Leave Policy', 'Fire Drill Schedule'];
    const audiences = ['All Staff', 'All Staff', 'Doctors', 'All Staff', 'Nurses', 'All Staff'];
    const publishers = ['HR Dept', 'Admin Dept', 'Facilities', 'IT Dept', 'HR Dept', 'Safety Comm'];
    const dates = ['Today', 'Yesterday', '12 Aug', '10 Aug', '05 Aug', '01 Aug'];
    const statuses = ['Active', 'Active', 'Active', 'Archived', 'Draft', 'Archived'];
    return {
      noticeid: `NOT-${1001 + i}`,
      subject: subjects[i],
      targetaudience: audiences[i],
      publishedby: publishers[i],
      date: dates[i],
      status: statuses[i]
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl  text-white flex items-center gap-2">
            {'Internal Notices' === 'Emergency Alerts' ? <AlertTriangle className="text-red-500 animate-pulse" size={24} /> : <MessageSquare className="text-violet-500" size={24} />}
            Internal Notices
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage and distribute internal hospital notices.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-all ${'Internal Notices' === 'Emergency Alerts' ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20' : 'bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/20'}`}>
            <Plus size={16} /> Create New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Active Notices</p>
          <p className="text-2xl  mt-2 text-blue-400">12</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Drafts</p>
          <p className="text-2xl  mt-2 text-amber-400">4</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Archived</p>
          <p className="text-2xl  mt-2 text-gray-400">156</p>
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
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-violet-500 text-white w-64 transition-colors"
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