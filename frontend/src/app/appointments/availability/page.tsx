"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function DoctorAvailabilityPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Doctor', accessor: 'doctor', sortable: true },
    { header: 'Specialty', accessor: 'specialty', sortable: true },
    { header: 'Date', accessor: 'date', sortable: true },
    { header: 'Shift Time', accessor: 'shifttime', sortable: true },
    { header: 'Available Slots', accessor: 'availableslots', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Available' || val === 'Checked In' || val === 'Assigned' || val === 'Booked' || val === 'Completed' || val === 'Consulting' || val === 'Active Call' || val === 'In Room';
        const isWarning = val === 'Filling Fast' || val === 'Waiting' || val === 'Arrived' || val === 'Pending' || val === 'Pending Reply' || val === 'Scheduled';
        const isNeutral = val === 'Expected';

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
    const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Derek Shepherd', 'Dr. Meredith Grey', 'Dr. Cristina Yang'];
    const specs = ['Cardiology', 'Plastic Surgery', 'Neurosurgery', 'General Surgery', 'Cardiothoracic'];
    const dates = ['Today', 'Today', 'Tomorrow', 'Today', 'Today'];
    const shifts = ['09:00 AM - 05:00 PM', '10:00 AM - 06:00 PM', '08:00 AM - 04:00 PM', '12:00 PM - 08:00 PM', '09:00 AM - 02:00 PM'];
    const slots = ['4 Slots', '0 Slots', '12 Slots', '2 Slots', '1 Slot'];
    const statuses = ['Available', 'Fully Booked', 'Available', 'Filling Fast', 'Filling Fast'];
    return { doctor: docs[i], specialty: specs[i], date: dates[i], shifttime: shifts[i], availableslots: slots[i], status: statuses[i] };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Doctor Availability
          </h1>
          <p className="text-sm text-gray-400 mt-1">Real-time overview of doctor schedules and slot availability.</p>
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
          <p className="text-sm text-gray-400 font-medium">Total Doctors</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>84</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Available Now</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>24</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Fully Booked</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>12</p>
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