"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function VentilatorMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Bed ID', accessor: 'bedid', sortable: true },
    { header: 'Patient Name', accessor: 'patientname', sortable: true },
    { header: 'Vent Mode', accessor: 'ventmode', sortable: true },
    { header: 'FiO2 / PEEP', accessor: 'fio2peep', sortable: true },
    { header: 'Latest ABG (PaO2)', accessor: 'latestabgpao2', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Confirmed' || val === 'Approved' || val === 'Available' || val === 'Completed' || val === 'Cleared' || val === 'Complete' || val === 'Ready' || val === 'Prepped' || val === 'Assigned' || val === 'Verified' || val === 'Logged' || val === 'Finalized' || val === 'Stable' || val === 'Recovering' || val === 'Ready for Ward' || val === 'Improving' || val === 'Normal' || val === 'Functional' || val === 'Recorded' || val === 'Administered';
        const isWarning = val === 'Tentative' || val === 'Pending' || val === 'Cleaning' || val === 'Maintenance' || val === 'Waiting' || val === 'Scheduled' || val === 'Pending Labs' || val === 'Pending Patient' || val === 'Pending Doctor' || val === 'Incomplete' || val === 'Prepping' || val === 'In Progress' || val === 'Ongoing' || val === 'Relief Req' || val === 'Draft' || val === 'Active' || val === 'Extended Observation' || val === 'Pending Review' || val === 'Weaning' || val === 'NIV' || val === 'Near Empty' || val === 'Dressing Due' || val === 'Positive Balance' || val === 'Correction Active' || val === 'Sign In Done' || val === 'Time Out Done';
        const isNeutral = val === 'Rescheduled' || val === 'Deferred' || val === 'Next Up' || val === 'Finishing' || val === 'Scrubbed In' || val === 'Scrubbed Out' || val === 'Paused' || val === 'Negative Balance' || val === 'Monitoring' || val === 'Maintaining Target';
        const isDanger = val === 'In Use' || val === 'In OT' || val === 'Prep' || val === 'High Risk' || val === 'Unfit (Cardio consult)' || val === 'Prolonged' || val === 'Alarm (BP Drop)' || val === 'Alarm (Low BP)' || val === 'Remove Today' || val === 'Critical' || val === 'Deteriorating' || val === 'Critical Low K+';

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
    const modes = ['PRVC', 'SIMV', 'CPAP/PS', 'BiPAP', 'PRVC'];
    const statuses = ['Ventilated', 'Ventilated', 'Weaning', 'NIV', 'Ventilated'];
    return { bedid: 'ICU-' + (1 + i), patientname: 'Patient ' + (i + 1), ventmode: modes[i], fio2peep: '40% / 5', latestabgpao2: '85 mmHg', status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Ventilator Monitoring
          </h1>
          <p className="text-sm text-gray-400 mt-1">Tracking ventilator modes, settings, ABGs, and weaning progress.</p>
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
          <p className="text-sm text-gray-400 font-medium">Patients Ventilated</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>15</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Weaning Trials</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>4</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Extubated Today</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>2</p>
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