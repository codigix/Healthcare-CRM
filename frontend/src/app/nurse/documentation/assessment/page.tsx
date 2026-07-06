"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function NursingAssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Doc ID', accessor: 'docid', sortable: true },
    { header: 'Patient Name', accessor: 'patientname', sortable: true },
    { header: 'Assessment Type', accessor: 'assessmenttype', sortable: true },
    { header: 'System Reviewed', accessor: 'systemreviewed', sortable: true },
    { header: 'Authored By', accessor: 'authoredby', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Completed' || val === 'Active' || val === 'Running' || val === 'Cleared' || val === 'Competent' || val === 'Collected' || val === 'Received by Lab' || val === 'Results Ready' || val === 'Verified' || val === 'Ready' || val === 'Compliant' || val === 'Signed' || val === 'Approved' || val === 'Acknowledged' || val === 'Closed' || val === 'Resolved' || val === 'Read' || val === 'Generated' || val === 'Passed' || val === 'Excellent' || val === 'Good' || val === 'Balanced' || val === 'Target Met' || val === 'Valid';
        const isWarning = val === 'Dressing Due' || val === 'Remove Today' || val === 'Follow-up Needed' || val === 'Pending Demo' || val === 'Needs Review' || val === 'Pending Collection' || val === 'Overdue' || val === 'In Transit' || val === 'Processing' || val === 'In Progress' || val === 'Pending' || val === 'Prep Pending' || val === 'Preparing' || val === 'Pending Meds' || val === 'Draft' || val === 'Pending Auth' || val === 'Pending Ack' || val === 'Investigating' || val === 'Awaiting Callback' || val === 'Unread' || val === 'Action Req' || val === 'Average' || val === 'Heavy Load' || val === 'Lagging' || val === 'Expiring Soon';
        const isNeutral = val === 'Paused' || val === 'Incomplete' || val === 'Light Load' || val === 'Review Due' || val === 'Goal Met';

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
    const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
    const statuses = ['Signed', 'Signed', 'Draft', 'Signed', 'Signed'];
    return { docid: 'DOC-A-' + (1001 + i), patientname: names[i], assessmenttype: 'Initial Shift', systemreviewed: 'Neurological', authoredby: 'Nurse Joy', status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Nursing Assessments
          </h1>
          <p className="text-sm text-gray-400 mt-1">Comprehensive admission and shift-based patient assessments.</p>
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
          <p className="text-sm text-gray-400 font-medium">Assessments Logged</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>34</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Pending Review</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>4</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Signed</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>30</p>
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