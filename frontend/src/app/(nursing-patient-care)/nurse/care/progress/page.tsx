"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function CareProgressPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Record ID', accessor: 'recordid', sortable: true },
    { header: 'Patient Name', accessor: 'patientname', sortable: true },
    { header: 'Care Goal', accessor: 'caregoal', sortable: true },
    { header: 'Current Progress', accessor: 'currentprogress', sortable: true },
    { header: 'Evaluated By', accessor: 'evaluatedby', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Completed' || val === 'Acknowledged' || val === 'Stable' || val === 'Allocated' || val === 'Cleared' || val === 'Normal' || val === 'Balanced' || val === 'Controlled' || val === 'Goal Met' || val === 'Improving' || val === 'Secure' || val === 'Tolerating' || val === 'Extubated' || val === 'ROSC' || val === 'Signed' || val === 'Audited';
        const isWarning = val === 'Pending Ack' || val === 'Urgent' || val === 'Overdue' || val === 'Critical' || val === 'Review Due' || val === 'Needs Review' || val === 'Infected' || val === 'High Output' || val === 'Change Required' || val === 'Restock Required' || val === 'Desaturating' || val === 'Active Code' || val === 'Resuscitation';
        const isNeutral = val === 'Pending Execution' || val === 'In Progress' || val === 'Awaiting Result' || val === 'Pending' || val === 'Draft' || val === 'Active' || val === 'Monitoring' || val === 'No Change' || val === 'Healing' || val === 'Ready to Remove' || val === 'Waiting' || val === 'Sedated' || val === 'Weaning' || val === 'Pending Sign' || val === 'Deceased';

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
    const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
    const goals = ['Pain < 3/10', 'Ambulates 50ft', 'Clear Lung Sounds', 'Tolerates Oral Diet', 'Wound Healing'];
    const progs = ['Currently 2/10', 'Ambulates 20ft', 'Rhonchi present', 'Tolerating liquids', 'Granulation present'];
    const statuses = ['Goal Met', 'Improving', 'No Change', 'Improving', 'Improving'];
    return { recordid: 'PRG-' + (8001 + i), patientname: names[i], caregoal: goals[i], currentprogress: progs[i], evaluatedby: 'Nurse Smith', status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Care Progress
          </h1>
          <p className="text-sm text-gray-400 mt-1">Track patient progression against established nursing goals.</p>
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
          <p className="text-sm text-gray-400 font-medium">Goals Tracked</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>32</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Improving</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>28</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">No Change/Declining</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>4</p>
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