const fs = require('fs');
const path = require('path');

const config = [
  // SCHEDULE
  {
    path: 'doctor/schedule/calendar', title: 'Schedule Calendar', desc: 'Monthly/Weekly view of appointments, procedures, and blocks.',
    cols: ['Event ID', 'Date & Time', 'Event Type', 'Patient/Details', 'Location', 'Status'],
    stats: [{ label: 'Events This Week', val: '42', col: 'text-blue-400' }, { label: 'Appts Today', val: '12', col: 'text-emerald-400' }, { label: 'Conflicts', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const dates = ['Today 09:00 AM', 'Today 10:30 AM', 'Tomorrow 14:00 PM', '15 Jul, 2026', '16 Jul, 2026'];
      const types = ['Consultation', 'Surgery Block', 'Telemedicine', 'OPD Duty', 'Seminar'];
      const details = ['John Doe', 'Appendectomy', 'Jane Smith', 'General OPD', 'Medical Conference'];
      const locs = ['Room 101', 'OR-3', 'Virtual Link', 'OPD Wing A', 'Auditorium'];
      const statuses = ['Upcoming', 'Confirmed', 'Scheduled', 'Scheduled', 'Approved'];
      return { eventid: 'EVT-' + (1001+i), datetime: dates[i], eventtype: types[i], patientdetails: details[i], location: locs[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/schedule/leave', title: 'Leave Management', desc: 'Apply for leaves, track balances, and manage absences.',
    cols: ['Leave ID', 'Leave Type', 'Start Date', 'End Date', 'Reason', 'Status'],
    stats: [{ label: 'Annual Leave Balance', val: '14 Days', col: 'text-blue-400' }, { label: 'Sick Leave', val: '5 Days', col: 'text-amber-400' }, { label: 'Pending Requests', val: '1', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Annual Leave', 'Sick Leave', 'Conference', 'Annual Leave', 'Unpaid Leave'];
      const starts = ['15 Aug, 2026', '12 Mar, 2026', '01 Sep, 2026', '20 Dec, 2025', '10 Nov, 2025'];
      const ends = ['30 Aug, 2026', '14 Mar, 2026', '05 Sep, 2026', '02 Jan, 2026', '12 Nov, 2025'];
      const statuses = ['Pending Approval', 'Approved', 'Approved', 'Completed', 'Completed'];
      return { leaveid: 'LVE-' + (2001+i), leavetype: types[i], startdate: starts[i], enddate: ends[i], reason: 'Personal', status: statuses[i] };
    })`
  },

  // QUEUE
  {
    path: 'doctor/queue/today', title: "Today's Queue", desc: 'Comprehensive list of all patients queued for today.',
    cols: ['Token', 'Patient Name', 'Visit Type', 'Scheduled Time', 'Check-In Time', 'Status'],
    stats: [{ label: 'Total Queued', val: '32', col: 'text-blue-400' }, { label: 'Seen', val: '14', col: 'text-emerald-400' }, { label: 'Waiting', val: '18', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const types = ['First Visit', 'Follow-Up', 'Routine', 'First Visit', 'Post-Op'];
      const times = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'];
      const checks = ['08:50 AM', '09:20 AM', '-', '10:15 AM', '-'];
      const statuses = ['Completed', 'Consulting', 'Scheduled', 'Waiting', 'Scheduled'];
      return { token: 'TKN-' + (10+i), patientname: names[i], visittype: types[i], scheduledtime: times[i], checkintime: checks[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/queue/waiting', title: 'Waiting Room', desc: 'Live list of patients physically present and waiting.',
    cols: ['Wait No', 'Patient Name', 'Condition', 'Wait Duration', 'Assigned Nurse', 'Status'],
    stats: [{ label: 'Currently Waiting', val: '12', col: 'text-amber-400' }, { label: 'Avg Wait', val: '18 mins', col: 'text-blue-400' }, { label: 'Next Turn', val: 'TKN-15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const conds = ['Fever', 'Routine Check', 'Mild Pain', 'BP Check', 'Dressing'];
      const waits = ['25 mins', '15 mins', '10 mins', '5 mins', 'Just Arrived'];
      const statuses = ['Next', 'Waiting', 'Waiting', 'Waiting', 'Triage'];
      return { waitno: 'WT-' + (1+i), patientname: names[i], condition: conds[i], waitduration: waits[i], assignednurse: 'Nurse Joy', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/queue/checked-in', title: 'Checked-In Patients', desc: 'Patients who have completed front desk registration.',
    cols: ['Appt ID', 'Patient Name', 'Vitals Recorded', 'Payment Status', 'Arrival Time', 'Status'],
    stats: [{ label: 'Checked In', val: '24', col: 'text-blue-400' }, { label: 'Vitals Pending', val: '5', col: 'text-amber-400' }, { label: 'Ready for Doctor', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const vitals = ['Yes (BP/HR/Temp)', 'Yes (BP/HR)', 'Pending', 'Yes (Full)', 'Pending'];
      const pays = ['Cleared', 'Insurance', 'Co-Pay Pending', 'Cleared', 'Cleared'];
      const statuses = ['Ready', 'Ready', 'Triage Needed', 'Ready', 'Triage Needed'];
      return { apptid: 'APT-' + (3000+i), patientname: names[i], vitalsrecorded: vitals[i], paymentstatus: pays[i], arrivaltime: '09:' + (10+i) + ' AM', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/queue/emergency', title: 'Emergency Queue', desc: 'High-priority urgent cases bypassing the standard queue.',
    cols: ['ER ID', 'Patient Name', 'Severity/Triage', 'Arrival Time', 'Primary Complaint', 'Status'],
    stats: [{ label: 'Active ER Cases', val: '3', col: 'text-red-400' }, { label: 'Critical', val: '1', col: 'text-red-500' }, { label: 'Stabilized', val: '2', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Unknown (Trauma)', 'Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince'];
      const sevs = ['Red (Immediate)', 'Yellow (Delayed)', 'Green (Minor)', 'Yellow (Delayed)', 'Green (Minor)'];
      const comps = ['MVA Trauma', 'Laceration', 'Sprain', 'Fever', 'Allergic Reaction'];
      const statuses = ['Resuscitation', 'Stabilized', 'Discharged', 'Observation', 'Discharged'];
      return { erid: 'ER-' + (500+i), patientname: names[i], severitytriage: sevs[i], arrivaltime: '14:' + (10+i), primarycomplaint: comps[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/queue/follow-up', title: 'Follow-Up Queue', desc: 'Patients returning for review or post-operative checks.',
    cols: ['Appt ID', 'Patient Name', 'Previous Visit', 'Reason', 'Progress', 'Status'],
    stats: [{ label: 'Follow-ups Today', val: '18', col: 'text-blue-400' }, { label: 'Post-Op', val: '4', col: 'text-amber-400' }, { label: 'Routine', val: '14', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Peter Parker', 'Mary Jane', 'Harry Osborn'];
      const prevs = ['12 Jun, 2026', '15 Jun, 2026', '20 Jun, 2026', '01 Jul, 2026', '10 Jul, 2026'];
      const reasons = ['Incision Check', 'Stitch Removal', 'Medication Review', 'Lab Results', 'Routine Check'];
      const progs = ['Healing Well', 'Normal', 'Improved', 'Pending Review', 'Stable'];
      const statuses = ['Checked In', 'Scheduled', 'Waiting', 'Completed', 'Scheduled'];
      return { apptid: 'FLW-' + (4000+i), patientname: names[i], previousvisit: prevs[i], reason: reasons[i], progress: progs[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/queue/telemedicine', title: 'Telemedicine Queue', desc: 'Virtual waiting room for online consultations.',
    cols: ['Session ID', 'Patient Name', 'Platform', 'Scheduled For', 'Connection', 'Status'],
    stats: [{ label: 'Virtual Appts', val: '8', col: 'text-blue-400' }, { label: 'Active Calls', val: '1', col: 'text-emerald-400' }, { label: 'Waiting Online', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Lex Luthor', 'Joker', 'Riddler', 'Penguin', 'Two-Face'];
      const plats = ['Zoom', 'In-house Video', 'In-house Video', 'Phone Call', 'Zoom'];
      const scheds = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM'];
      const conns = ['Excellent', 'Good', 'Pending Join', 'N/A', 'Pending Join'];
      const statuses = ['Completed', 'Active Call', 'Waiting', 'Scheduled', 'Scheduled'];
      return { sessionid: 'TEL-' + (5000+i), patientname: names[i], platform: plats[i], scheduledfor: scheds[i], connection: conns[i], status: statuses[i] };
    })`
  },

  // OPD
  {
    path: 'doctor/opd/dashboard', title: 'OPD Dashboard', desc: 'Central command center for Outpatient Department activities.',
    cols: ['Metric', "Today's Target", 'Current Progress', 'Last Week Avg', 'Trend', 'Status'],
    stats: [{ label: 'Total OPD Footfall', val: '142', col: 'text-blue-400' }, { label: 'Avg Consult Time', val: '14m', col: 'text-emerald-400' }, { label: 'Revenue (Est)', val: '$12,450', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Total Consultations', 'New Registrations', 'Prescriptions Issued', 'Lab Referrals', 'Follow-up Bookings'];
      const targets = ['50', '15', '45', '20', '25'];
      const currents = ['32', '12', '28', '14', '18'];
      const lasts = ['45', '14', '42', '18', '22'];
      const statuses = ['On Track', 'On Track', 'Lagging', 'On Track', 'On Track'];
      return { metric: metrics[i], todaystarget: targets[i], currentprogress: currents[i], lastweekavg: lasts[i], trend: '+5%', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/opd/consultation', title: 'OPD Consultations', desc: 'Detailed log of ongoing and completed OPD sessions.',
    cols: ['Consult ID', 'Patient Name', 'Chief Complaint', 'Diagnosis Notes', 'Prescription', 'Status'],
    stats: [{ label: 'Completed Today', val: '24', col: 'text-blue-400' }, { label: 'Pending Notes', val: '3', col: 'text-amber-400' }, { label: 'Referred Out', val: '1', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Gwen Stacy', 'Miles Morales', 'Miguel O\\'Hara', 'Jessica Drew', 'Peni Parker'];
      const comps = ['Headache', 'Cough', 'Back Pain', 'Fever', 'Rash'];
      const diags = ['Tension Headache', 'Viral URI', 'Muscle Spasm', 'Influenza', 'Contact Dermatitis'];
      const pres = ['Issued', 'Issued', 'Pending', 'Issued', 'Issued'];
      const statuses = ['Completed', 'Completed', 'Notes Pending', 'Completed', 'Completed'];
      return { consultid: 'OPD-' + (6000+i), patientname: names[i], chiefcomplaint: comps[i], diagnosisnotes: diags[i], prescription: pres[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/opd/follow-up', title: 'OPD Follow-Ups', desc: 'Track and plan return visits from OPD patients.',
    cols: ['Patient Name', 'Initial Visit', 'Diagnosis', 'Recommended Date', 'Reminders', 'Status'],
    stats: [{ label: 'Due This Week', val: '45', col: 'text-blue-400' }, { label: 'Booked', val: '32', col: 'text-emerald-400' }, { label: 'No Shows', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson', 'Maggie Simpson'];
      const initials = ['12 Jun', '15 Jun', '20 Jun', '01 Jul', '10 Jul'];
      const diags = ['Hypertension', 'Anemia', 'Asthma', 'Myopia', 'Immunization'];
      const recs = ['12 Jul', '15 Jul', '20 Jul', '01 Aug', '10 Aug'];
      const statuses = ['Booked', 'Pending Reply', 'Overdue', 'Booked', 'Booked'];
      return { patientname: names[i], initialvisit: initials[i], diagnosis: diags[i], recommendeddate: recs[i], reminders: 'Sent (2)', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/opd/procedures', title: 'Minor Procedures', desc: 'Log minor surgical or diagnostic procedures performed in OPD.',
    cols: ['Procedure ID', 'Patient Name', 'Procedure Type', 'Duration', 'Consumables Used', 'Status'],
    stats: [{ label: 'Procedures Today', val: '8', col: 'text-blue-400' }, { label: 'Billed Value', val: '$1,240', col: 'text-emerald-400' }, { label: 'Complications', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Griffin', 'Lois Griffin', 'Meg Griffin', 'Chris Griffin', 'Stewie Griffin'];
      const procs = ['Stitch Removal', 'Wound Dressing', 'Mole Excision', 'Cast Application', 'Vaccination'];
      const durs = ['10 mins', '15 mins', '30 mins', '45 mins', '5 mins'];
      const statuses = ['Completed', 'Completed', 'Scheduled', 'In Progress', 'Completed'];
      return { procedureid: 'PRC-' + (7000+i), patientname: names[i], proceduretype: procs[i], duration: durs[i], consumablesused: 'Logged', status: statuses[i] };
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
