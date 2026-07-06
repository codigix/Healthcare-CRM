const fs = require('fs');
const path = require('path');

const config = [
  {
    path: 'appointments/availability', title: 'Doctor Availability', desc: 'Real-time overview of doctor schedules and slot availability.',
    cols: ['Doctor', 'Specialty', 'Date', 'Shift Time', 'Available Slots', 'Status'],
    stats: [{ label: 'Total Doctors', val: '84', col: 'text-blue-400' }, { label: 'Available Now', val: '24', col: 'text-emerald-400' }, { label: 'Fully Booked', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Derek Shepherd', 'Dr. Meredith Grey', 'Dr. Cristina Yang'];
      const specs = ['Cardiology', 'Plastic Surgery', 'Neurosurgery', 'General Surgery', 'Cardiothoracic'];
      const dates = ['Today', 'Today', 'Tomorrow', 'Today', 'Today'];
      const shifts = ['09:00 AM - 05:00 PM', '10:00 AM - 06:00 PM', '08:00 AM - 04:00 PM', '12:00 PM - 08:00 PM', '09:00 AM - 02:00 PM'];
      const slots = ['4 Slots', '0 Slots', '12 Slots', '2 Slots', '1 Slot'];
      const statuses = ['Available', 'Fully Booked', 'Available', 'Filling Fast', 'Filling Fast'];
      return { doctor: docs[i], specialty: specs[i], date: dates[i], shifttime: shifts[i], availableslots: slots[i], status: statuses[i] };
    })`
  },
  {
    path: 'appointments/queue', title: 'Live Patient Queue', desc: 'Monitor the live waiting room and ongoing consultations.',
    cols: ['Queue No', 'Patient', 'Doctor', 'Est Wait Time', 'Check-in Time', 'Status'],
    stats: [{ label: 'Currently Waiting', val: '45', col: 'text-amber-400' }, { label: 'Avg Wait Time', val: '18 mins', col: 'text-blue-400' }, { label: 'Consulting Now', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Brown', 'Emily Davis'];
      const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Derek Shepherd', 'Dr. Meredith Grey', 'Dr. Cristina Yang'];
      const waits = ['5 mins', 'In Room', '15 mins', '30 mins', 'In Room'];
      const times = ['09:15 AM', '09:00 AM', '09:20 AM', '09:30 AM', '08:45 AM'];
      const statuses = ['Waiting', 'Consulting', 'Waiting', 'Delayed', 'Consulting'];
      return { queueno: 'Q-' + (1001+i), patient: pats[i], doctor: docs[i], estwaittime: waits[i], checkintime: times[i], status: statuses[i] };
    })`
  },
  {
    path: 'appointments/check-in', title: 'Self Check-In & Arrivals', desc: 'Manage patients arriving for their scheduled appointments.',
    cols: ['Appt ID', 'Patient', 'Scheduled Time', 'Arrival Time', 'Verification', 'Status'],
    stats: [{ label: 'Expected Arrivals', val: '120', col: 'text-blue-400' }, { label: 'Checked In', val: '45', col: 'text-emerald-400' }, { label: 'No Shows', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const scheds = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'];
      const arrivals = ['08:50 AM', '09:25 AM', '-', '10:20 AM', '-'];
      const verifs = ['ID Verified', 'Pending', '-', 'ID Verified', '-'];
      const statuses = ['Checked In', 'Arrived', 'Expected', 'Checked In', 'No Show'];
      return { apptid: 'APT-' + (2001+i), patient: pats[i], scheduledtime: scheds[i], arrivaltime: arrivals[i], verification: verifs[i], status: statuses[i] };
    })`
  },
  {
    path: 'appointments/walk-in', title: 'Walk-In Registrations', desc: 'Register and assign doctors to unplanned walk-in patients.',
    cols: ['Reg ID', 'Patient Name', 'Symptom/Reason', 'Assigned Dept', 'Priority', 'Status'],
    stats: [{ label: 'Walk-ins Today', val: '32', col: 'text-blue-400' }, { label: 'Avg Assign Time', val: '4 mins', col: 'text-emerald-400' }, { label: 'Urgent Cases', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const reasons = ['Fever & Chills', 'Minor Cut', 'Sprained Ankle', 'Migraine', 'Chest Pain'];
      const depts = ['General Med', 'ER', 'Orthopedics', 'Neurology', 'Cardiology'];
      const pris = ['Normal', 'Normal', 'Normal', 'High', 'Urgent'];
      const statuses = ['Assigned', 'Pending', 'Assigned', 'Assigned', 'In Room'];
      return { regid: 'WLK-' + (3001+i), patientname: names[i], symptomreason: reasons[i], assigneddept: depts[i], priority: pris[i], status: statuses[i] };
    })`
  },
  {
    path: 'appointments/follow-up', title: 'Follow-Up Appointments', desc: 'Track and schedule post-treatment follow-up visits.',
    cols: ['Patient', 'Previous Visit', 'Doctor', 'Recommended Date', 'Reminders Sent', 'Status'],
    stats: [{ label: 'Due This Week', val: '145', col: 'text-blue-400' }, { label: 'Booked', val: '80', col: 'text-emerald-400' }, { label: 'Overdue', val: '24', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const prevs = ['12 May, 2026', '01 Jun, 2026', '15 Jun, 2026', '10 Apr, 2026', '01 Jul, 2026'];
      const docs = ['Dr. Jenkins', 'Dr. Sloan', 'Dr. Shepherd', 'Dr. Grey', 'Dr. Yang'];
      const recs = ['12 Jun, 2026', '01 Jul, 2026', '15 Jul, 2026', '10 May, 2026', '01 Aug, 2026'];
      const statuses = ['Overdue', 'Booked', 'Pending Reply', 'Overdue', 'Booked'];
      return { patient: pats[i], previousvisit: prevs[i], doctor: docs[i], recommendeddate: recs[i], reminderssent: (2 + i) + ' SMS', status: statuses[i] };
    })`
  },
  {
    path: 'appointments/telemedicine', title: 'Telemedicine Consultations', desc: 'Manage virtual appointments and video consultations.',
    cols: ['Session ID', 'Patient', 'Doctor', 'Scheduled Time', 'Meeting Link', 'Status'],
    stats: [{ label: 'Virtual Appts', val: '65', col: 'text-blue-400' }, { label: 'Active Calls', val: '8', col: 'text-emerald-400' }, { label: 'Connection Issues', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const docs = ['Dr. Jenkins', 'Dr. Sloan', 'Dr. Shepherd', 'Dr. Grey', 'Dr. Yang'];
      const times = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'];
      const statuses = ['Completed', 'Active Call', 'Waiting', 'Scheduled', 'Scheduled'];
      return { sessionid: 'TEL-' + (4001+i), patient: pats[i], doctor: docs[i], scheduledtime: times[i], meetinglink: 'Join Room ' + (i+1), status: statuses[i] };
    })`
  }
];

const template = (page, componentName) => {
  let columnsGen = "";
  page.cols.forEach(col => {
    const accessorKey = col.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (col === 'Status') {
      columnsGen += `
    { 
      header: '${col}', 
      accessor: (row: any) => {
        const val = row.${accessorKey};
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
    },`;
    } else {
      columnsGen += `
    { header: '${col}', accessor: '${accessorKey}', sortable: true },`;
    }
  });


  let statsGen = "";
  page.stats.forEach(stat => {
    statsGen += `
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">${stat.label}</p>
          <p className={"text-2xl font-bold mt-2 " + "${stat.col}"}>${stat.val}</p>
        </div>`;
  });

  return `"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ${componentName}Page() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [${columnsGen}
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

  const mockData = ${page.mockDataGenerator};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            ${page.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">${page.desc}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">${statsGen}
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
}`;
};

config.forEach(page => {
  const dir = path.join(__dirname, 'frontend', 'src', 'app', ...page.path.split('/'));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page, componentName));
  console.log('Generated: ' + page.path);
});
