const fs = require('fs');
const path = require('path');

const config = [
  // IPD
  {
    path: 'doctor/ipd/admitted', title: 'Admitted Patients (IPD)', desc: 'List of all inpatients currently under your primary care.',
    cols: ['IPD No', 'Patient Name', 'Ward/Bed', 'Diagnosis', 'Admitted On', 'Status'],
    stats: [{ label: 'My IPD Patients', val: '18', col: 'text-blue-400' }, { label: 'Critical Condition', val: '2', col: 'text-red-400' }, { label: 'Ready for Discharge', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const beds = ['ICU-01', 'General-12', 'General-14', 'Private-02', 'ICU-03'];
      const diags = ['Blunt Trauma', 'Exhaustion', 'Fracture', 'Burns', 'Concussion'];
      const dates = ['12 Jun', '14 Jun', '15 Jun', '10 Jun', '16 Jun'];
      const statuses = ['Critical', 'Stable', 'Stable', 'Stable', 'Ready for Discharge'];
      return { ipdno: 'IPD-' + (1001+i), patientname: names[i], wardbed: beds[i], diagnosis: diags[i], admittedon: dates[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/ipd/rounds', title: 'Ward Rounds List', desc: 'Schedule and log daily ward rounds for IPD patients.',
    cols: ['Round ID', 'Patient Name', 'Ward/Bed', 'Last Checked', 'Next Round Due', 'Status'],
    stats: [{ label: 'Rounds Pending', val: '12', col: 'text-amber-400' }, { label: 'Completed Today', val: '8', col: 'text-emerald-400' }, { label: 'Missed Rounds', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Lex Luthor', 'Joker', 'Riddler', 'Penguin', 'Two-Face'];
      const beds = ['ICU-01', 'General-12', 'General-14', 'Private-02', 'ICU-03'];
      const last = ['08:00 AM', '09:30 AM', 'Yesterday', '07:00 AM', '10:00 AM'];
      const next = ['14:00 PM', '15:30 PM', '09:00 AM', '13:00 PM', '16:00 PM'];
      const statuses = ['Pending', 'Pending', 'Overdue', 'Completed', 'Completed'];
      return { roundid: 'RND-' + (2001+i), patientname: names[i], wardbed: beds[i], lastchecked: last[i], nextrounddue: next[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/ipd/progress-notes', title: 'Progress Notes', desc: 'Daily clinical progress notes for admitted patients.',
    cols: ['Note ID', 'Patient Name', 'Recorded By', 'Note Summary', 'Timestamp', 'Status'],
    stats: [{ label: 'Notes Logged Today', val: '24', col: 'text-blue-400' }, { label: 'Pending Reviews', val: '3', col: 'text-amber-400' }, { label: 'Co-signed', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const summaries = ['Patient stable. Vitals normal.', 'Complains of mild pain.', 'Fever reduced.', 'Awaiting lab results.', 'Ready for discharge.'];
      const times = ['09:15 AM', '10:30 AM', '11:45 AM', '01:20 PM', '02:00 PM'];
      const statuses = ['Draft', 'Signed', 'Signed', 'Pending Review', 'Signed'];
      return { noteid: 'PRG-' + (3001+i), patientname: names[i], recordedby: 'Dr. Jenkins', notesummary: summaries[i], timestamp: times[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/ipd/treatment-plan', title: 'Treatment Plans', desc: 'Active treatment plans, medications, and diet orders.',
    cols: ['Plan ID', 'Patient Name', 'Primary Dx', 'Plan Type', 'Last Updated', 'Status'],
    stats: [{ label: 'Active Plans', val: '18', col: 'text-blue-400' }, { label: 'Updates Needed', val: '2', col: 'text-amber-400' }, { label: 'Completed Plans', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const dxs = ['Fracture', 'Asthma', 'Pneumonia', 'Anemia', 'Appendicitis'];
      const types = ['Surgical + Meds', 'Medication Only', 'IV Fluids + Meds', 'Dietary + Meds', 'Post-Op Care'];
      const statuses = ['Active', 'Active', 'Update Required', 'Active', 'Completed'];
      return { planid: 'TPL-' + (4001+i), patientname: names[i], primarydx: dxs[i], plantype: types[i], lastupdated: 'Today', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/ipd/transfer-requests', title: 'Transfer Requests', desc: 'Manage patient transfers between ICU, wards, and other facilities.',
    cols: ['Transfer ID', 'Patient Name', 'Current Ward', 'Target Ward', 'Reason', 'Status'],
    stats: [{ label: 'Pending Outbound', val: '2', col: 'text-amber-400' }, { label: 'Pending Inbound', val: '1', col: 'text-amber-400' }, { label: 'Completed Today', val: '5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const currents = ['ICU', 'ER', 'General Med', 'Surgery', 'VIP Suite'];
      const targets = ['General Med', 'ICU', 'Cardiology', 'Discharge Lounge', 'ICU'];
      const reasons = ['Condition Stable', 'Critical Vitals', 'Specialist Care', 'Post-Op Recovery', 'Requested Upgrade'];
      const statuses = ['Pending Transfer', 'Completed', 'Awaiting Bed', 'Completed', 'Declined'];
      return { transferid: 'TRF-' + (5001+i), patientname: names[i], currentward: currents[i], targetward: targets[i], reason: reasons[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/ipd/discharge-planning', title: 'Discharge Planning', desc: 'Prepare discharge summaries, prescriptions, and follow-ups.',
    cols: ['Discharge ID', 'Patient Name', 'Admit Date', 'Planned Discharge', 'Summary Status', 'Status'],
    stats: [{ label: 'Discharges Today', val: '8', col: 'text-blue-400' }, { label: 'Summaries Pending', val: '3', col: 'text-red-400' }, { label: 'Cleared to Leave', val: '5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const admits = ['10 Jun', '12 Jun', '14 Jun', '15 Jun', '16 Jun'];
      const plans = ['Today', 'Tomorrow', 'Today', '18 Jun', 'Today'];
      const sums = ['Drafted', 'Pending', 'Signed', 'Pending', 'Signed'];
      const statuses = ['In Progress', 'Scheduled', 'Cleared', 'Scheduled', 'Cleared'];
      return { dischargeid: 'DIS-' + (6001+i), patientname: names[i], admitdate: admits[i], planneddischarge: plans[i], summarystatus: sums[i], status: statuses[i] };
    })`
  },

  // EMERGENCY
  {
    path: 'doctor/emergency/dashboard', title: 'ER Dashboard', desc: 'Live metrics and status of the Emergency Department.',
    cols: ['Bed/Zone', 'Patient Name', 'Triage Level', 'Time in ER', 'Primary Physician', 'Status'],
    stats: [{ label: 'Active Cases', val: '14', col: 'text-blue-400' }, { label: 'Critical (Red)', val: '2', col: 'text-red-500' }, { label: 'Avg Turnaround', val: '2h 15m', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const beds = ['Resus-1', 'Trauma-2', 'Triage-A', 'Bed-5', 'Bed-6'];
      const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Brown', 'Emily Davis'];
      const triages = ['Level 1 (Resus)', 'Level 2 (Emergent)', 'Level 3 (Urgent)', 'Level 4 (Less Urgent)', 'Level 5 (Non-Urgent)'];
      const times = ['45 mins', '1h 20m', '30 mins', '2h 10m', '1h 0m'];
      const statuses = ['Critical', 'Stabilizing', 'Waiting Lab', 'Ready to Disch', 'Observation'];
      return { bedzone: beds[i], patientname: names[i], triagelevel: triages[i], timeiner: times[i], primaryphysician: 'Dr. House', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/emergency/triage', title: 'ER Triage', desc: 'Assess and prioritize incoming emergency patients.',
    cols: ['Triage ID', 'Patient/Demo', 'Chief Complaint', 'Vitals', 'Assigned Priority', 'Status'],
    stats: [{ label: 'Waiting Triage', val: '5', col: 'text-amber-400' }, { label: 'Triaged Today', val: '42', col: 'text-blue-400' }, { label: 'Avg Triage Time', val: '4 mins', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Unknown Male, ~40', 'Sarah Connor', 'Peter Parker', 'Mary Jane', 'Tony Stark'];
      const comps = ['Unconscious', 'Chest Pain', 'Laceration', 'Fever', 'Minor Burn'];
      const vitals = ['BP 80/50, HR 120', 'BP 160/90, HR 95', 'Stable', 'Temp 102F', 'Stable'];
      const pris = ['Level 1 (Red)', 'Level 2 (Orange)', 'Level 3 (Yellow)', 'Level 4 (Green)', 'Level 5 (Blue)'];
      const statuses = ['Immediate', 'Urgent', 'Standard', 'Standard', 'Standard'];
      return { triageid: 'TRG-' + (1001+i), patientdemo: names[i], chiefcomplaint: comps[i], vitals: vitals[i], assignedpriority: pris[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/emergency/critical', title: 'Critical Care (Resus)', desc: 'Monitor and log interventions for Level 1 & 2 critical patients.',
    cols: ['Resus ID', 'Patient', 'Primary Dx', 'Interventions', 'Time in Resus', 'Status'],
    stats: [{ label: 'Active Resus', val: '2', col: 'text-red-500' }, { label: 'Transferred to ICU', val: '4', col: 'text-blue-400' }, { label: 'Stabilized', val: '3', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Brown', 'Emily Davis'];
      const dxs = ['Cardiac Arrest', 'Massive Hemorrhage', 'Stroke', 'Resp Failure', 'Septic Shock'];
      const inters = ['CPR, Defib', 'Blood Transfusion', 'TPA Given', 'Intubated', 'IV Antibiotics'];
      const statuses = ['Active Code', 'Stabilizing', 'Transfer ICU', 'Transfer ICU', 'Stabilized'];
      return { resusid: 'RSC-' + (2001+i), patient: names[i], primarydx: dxs[i], interventions: inters[i], timeinresus: (20 + i*15) + ' mins', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/emergency/trauma', title: 'Trauma Cases', desc: 'Specific log for trauma and surgical emergency cases.',
    cols: ['Trauma ID', 'Patient Name', 'Mechanism of Injury', 'Trauma Surgeon', 'Imaging', 'Status'],
    stats: [{ label: 'Trauma Cases Today', val: '8', col: 'text-blue-400' }, { label: 'In OR', val: '2', col: 'text-amber-400' }, { label: 'Cleared', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const mechs = ['MVA', 'Fall from height', 'Assault', 'MVA', 'Sports Injury'];
      const surgs = ['Dr. Shepherd', 'Dr. Shepherd', 'Dr. Sloan', 'Dr. Shepherd', 'Dr. Sloan'];
      const imgs = ['CT Whole Body', 'X-Ray Cervical', 'CT Head', 'Pending', 'X-Ray Knee'];
      const statuses = ['In OR', 'Cleared', 'Observation', 'Awaiting Scan', 'Cleared'];
      return { traumaid: 'TRM-' + (3001+i), patientname: names[i], mechanismofinjury: mechs[i], traumasurgeon: surgs[i], imaging: imgs[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/emergency/procedures', title: 'ER Procedures', desc: 'Log minor surgical procedures performed in the ER.',
    cols: ['Procedure ID', 'Patient Name', 'Procedure', 'Performed By', 'Time Taken', 'Status'],
    stats: [{ label: 'Procedures Today', val: '24', col: 'text-blue-400' }, { label: 'Sutures/Staples', val: '12', col: 'text-emerald-400' }, { label: 'Splints/Casts', val: '8', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const procs = ['Suturing (Forehead)', 'Splint (Wrist)', 'Chest Tube', 'Central Line', 'Joint Reduction'];
      const docs = ['Dr. Grey', 'Dr. Yang', 'Dr. Shepherd', 'Dr. Sloan', 'Dr. Grey'];
      const statuses = ['Completed', 'Completed', 'Completed', 'In Progress', 'Completed'];
      return { procedureid: 'ERP-' + (4001+i), patientname: names[i], procedure: procs[i], performedby: docs[i], timetaken: (15 + i*5) + ' mins', status: statuses[i] };
    })`
  },

  // CONSULTATION
  {
    path: 'doctor/consultation/soap-notes', title: 'SOAP Notes', desc: 'Subjective, Objective, Assessment, and Plan notes.',
    cols: ['Note ID', 'Patient Name', 'Consult Type', 'Last Edited', 'Primary Dx', 'Status'],
    stats: [{ label: 'Draft Notes', val: '8', col: 'text-amber-400' }, { label: 'Signed Today', val: '24', col: 'text-emerald-400' }, { label: 'Missing Notes', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const types = ['OPD Initial', 'OPD Follow-Up', 'Telemedicine', 'IPD Round', 'OPD Initial'];
      const dxs = ['Hypertension', 'Migraine', 'Anemia', 'Asthma', 'Diabetes Type 2'];
      const statuses = ['Signed', 'Draft', 'Signed', 'Signed', 'Draft'];
      return { noteid: 'SOP-' + (1001+i), patientname: names[i], consulttype: types[i], lastedited: 'Today', primarydx: dxs[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/consultation/clinical-notes', title: 'Clinical Notes', desc: 'General unstructured clinical observations and history.',
    cols: ['Note ID', 'Patient Name', 'Category', 'Author', 'Timestamp', 'Status'],
    stats: [{ label: 'Total Notes', val: '14,520', col: 'text-blue-400' }, { label: 'Added Today', val: '45', col: 'text-emerald-400' }, { label: 'Archived', val: '1,200', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const cats = ['History of Illness', 'Allergy Update', 'Family History', 'Surgical Hx', 'General Observation'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Archived'];
      return { noteid: 'CLN-' + (2001+i), patientname: names[i], category: cats[i], author: 'Dr. House', timestamp: '12 Jun 2026', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/consultation/diagnosis', title: 'Diagnosis List', desc: 'ICD-10 coded diagnosis tracker for patient encounters.',
    cols: ['Dx ID', 'Patient Name', 'ICD-10 Code', 'Diagnosis Description', 'Type', 'Status'],
    stats: [{ label: 'Primary Dx', val: '45', col: 'text-blue-400' }, { label: 'Secondary Dx', val: '120', col: 'text-emerald-400' }, { label: 'Unconfirmed', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const icds = ['I10', 'E11.9', 'J45.909', 'R51', 'M54.5'];
      const descs = ['Essential Hypertension', 'Type 2 Diabetes', 'Asthma, Unspecified', 'Headache', 'Low Back Pain'];
      const types = ['Primary', 'Secondary', 'Primary', 'Primary', 'Primary'];
      const statuses = ['Confirmed', 'Confirmed', 'Provisional', 'Confirmed', 'Provisional'];
      return { dxid: 'DIAG-' + (3001+i), patientname: names[i], icd10code: icds[i], diagnosisdescription: descs[i], type: types[i], status: statuses[i] };
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
        const isGood = val === 'Stable' || val === 'Completed' || val === 'Signed' || val === 'Active' || val === 'Cleared' || val === 'Stabilized' || val === 'Confirmed' || val === 'Ready for Discharge';
        const isWarning = val === 'Critical' || val === 'Overdue' || val === 'Pending Review' || val === 'Update Required' || val === 'In Progress' || val === 'Immediate' || val === 'Urgent' || val === 'Active Code' || val === 'Resuscitation';
        const isNeutral = val === 'Pending' || val === 'Draft' || val === 'Scheduled' || val === 'Pending Transfer' || val === 'Awaiting Bed' || val === 'Waiting Lab' || val === 'Observation' || val === 'Provisional' || val === 'Archived';
        
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
