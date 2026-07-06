"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function OPDFollowUpsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Patient Name', accessor: 'patientname', sortable: true },
    { header: 'Initial Visit', accessor: 'initialvisit', sortable: true },
    { header: 'Diagnosis', accessor: 'diagnosis', sortable: true },
    { header: 'Recommended Date', accessor: 'recommendeddate', sortable: true },
    { header: 'Reminders', accessor: 'reminders', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Completed' || val === 'Confirmed' || val === 'Approved' || val === 'Ready' || val === 'Stabilized' || val === 'Discharged' || val === 'Active Call' || val === 'On Track' || val === 'Booked';
        const isWarning = val === 'Scheduled' || val === 'Upcoming' || val === 'Pending Approval' || val === 'Waiting' || val === 'Triage Needed' || val === 'Resuscitation' || val === 'Observation' || val === 'Notes Pending' || val === 'Pending Reply' || val === 'Lagging' || val === 'In Progress';
        const isNeutral = val === 'Consulting' || val === 'Triage';

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
    const names = ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson', 'Maggie Simpson'];
    const initials = ['12 Jun', '15 Jun', '20 Jun', '01 Jul', '10 Jul'];
    const diags = ['Hypertension', 'Anemia', 'Asthma', 'Myopia', 'Immunization'];
    const recs = ['12 Jul', '15 Jul', '20 Jul', '01 Aug', '10 Aug'];
    const statuses = ['Booked', 'Pending Reply', 'Overdue', 'Booked', 'Booked'];
    return { patientname: names[i], initialvisit: initials[i], diagnosis: diags[i], recommendeddate: recs[i], reminders: 'Sent (2)', status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            OPD Follow-Ups
          </h1>
          <p className="text-sm text-gray-400 mt-1">Track and plan return visits from OPD patients.</p>
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
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Due This Week</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>45</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Booked</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>32</p>
        </div>
        <div className="bg-dark-secondary rounded4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">No Shows</p>
          <p className={"text-2xl font-bold mt-2 " + "text-red-400"}>4</p>
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