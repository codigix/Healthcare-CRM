const fs = require('fs');
const path = require('path');

const config = [
  // ORDERS
  {
    path: 'nurse/orders/new', title: 'New Medical Orders', desc: 'Recently placed physician orders requiring acknowledgment.',
    cols: ['Order ID', 'Patient Name', 'Ordered By', 'Order Type', 'Time Placed', 'Status'],
    stats: [{ label: 'Unacknowledged', val: '8', col: 'text-amber-400' }, { label: 'Stat Orders', val: '2', col: 'text-red-400' }, { label: 'Acknowledged Today', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const docs = ['Dr. Grey', 'Dr. Shepherd', 'Dr. Sloan', 'Dr. Jenkins', 'Dr. House'];
      const types = ['Lab (CBC)', 'Medication (IV)', 'Radiology (X-Ray)', 'Diet Change', 'Physiotherapy'];
      const statuses = ['Pending Ack', 'Pending Ack', 'Pending Ack', 'Pending Ack', 'Pending Ack'];
      return { orderid: 'ORD-' + (1001+i), patientname: names[i], orderedby: docs[i], ordertype: types[i], timeplaced: '10 mins ago', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/orders/pending', title: 'Pending Orders', desc: 'Orders acknowledged but awaiting execution or results.',
    cols: ['Order ID', 'Patient Name', 'Order Type', 'Execution Due', 'Assigned To', 'Status'],
    stats: [{ label: 'Pending Execution', val: '12', col: 'text-amber-400' }, { label: 'Awaiting Results', val: '8', col: 'text-blue-400' }, { label: 'Overdue', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const types = ['Blood Draw', 'Med Administration', 'ECG', 'Sputum Collection', 'Wound Swab'];
      const statuses = ['Pending Execution', 'In Progress', 'Awaiting Result', 'Pending Execution', 'In Progress'];
      return { orderid: 'ORD-' + (2001+i), patientname: names[i], ordertype: types[i], executiondue: 'Within 1 hour', assignedto: 'Nurse Joy', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/orders/completed', title: 'Completed Orders', desc: 'Log of fully executed and resulted physician orders.',
    cols: ['Order ID', 'Patient Name', 'Order Type', 'Executed By', 'Time Completed', 'Status'],
    stats: [{ label: 'Completed Today', val: '84', col: 'text-blue-400' }, { label: 'Medications', val: '45', col: 'text-emerald-400' }, { label: 'Lab/Tests', val: '39', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const types = ['X-Ray Chest', 'IV Antibiotics', 'Diet Change', 'Blood Transfusion', 'Catheter Removal'];
      const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Completed'];
      return { orderid: 'ORD-' + (3001+i), patientname: names[i], ordertype: types[i], executedby: 'Nurse Smith', timecompleted: 'Today 09:00 AM', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/orders/stat', title: 'STAT Orders', desc: 'High-priority emergency orders requiring immediate execution.',
    cols: ['STAT ID', 'Patient Name', 'Ordered By', 'Order Detail', 'Time Placed', 'Status'],
    stats: [{ label: 'Active STATs', val: '2', col: 'text-red-500' }, { label: 'Avg Response', val: '4 mins', col: 'text-emerald-400' }, { label: 'Completed', val: '12', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const details = ['ECG Immediate', 'IV Epinephrine', 'Arterial Blood Gas', 'Portable X-Ray', 'Push IV Fluids'];
      const statuses = ['Urgent', 'In Progress', 'Completed', 'Completed', 'Completed'];
      return { statid: 'STA-' + (4001+i), patientname: names[i], orderedby: 'Dr. House', orderdetail: details[i], timeplaced: (5+i) + ' mins ago', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/orders/tasks', title: 'Nursing Tasks', desc: 'Daily checklist and routine care tasks for assigned patients.',
    cols: ['Task ID', 'Patient Name', 'Task Description', 'Due By', 'Priority', 'Status'],
    stats: [{ label: 'Total Tasks', val: '45', col: 'text-blue-400' }, { label: 'Completed', val: '22', col: 'text-emerald-400' }, { label: 'Overdue', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const tasks = ['Patient Turning Q2H', 'Sponge Bath', 'Check Cannula', 'Empty Catheter Bag', 'Assist to Chair'];
      const pris = ['High', 'Routine', 'Routine', 'High', 'Routine'];
      const statuses = ['Pending', 'Completed', 'Pending', 'Overdue', 'In Progress'];
      return { taskid: 'TSK-' + (5001+i), patientname: names[i], taskdescription: tasks[i], dueby: '12:00 PM', priority: pris[i], status: statuses[i] };
    })`
  },

  // CARE
  {
    path: 'nurse/care/notes', title: 'Nursing Care Notes', desc: 'Routine shift notes and general patient observations.',
    cols: ['Note ID', 'Patient Name', 'Note Category', 'Authored By', 'Time', 'Status'],
    stats: [{ label: 'Notes Logged', val: '56', col: 'text-blue-400' }, { label: 'Drafts', val: '4', col: 'text-amber-400' }, { label: 'Signed', val: '52', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const cats = ['Shift Summary', 'Behavioral', 'Dietary Intake', 'General Obs', 'Shift Summary'];
      const statuses = ['Signed', 'Signed', 'Draft', 'Signed', 'Draft'];
      return { noteid: 'NTE-' + (6001+i), patientname: names[i], notecategory: cats[i], authoredby: 'Nurse Joy', time: '14:30', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/care/plan', title: 'Nursing Care Plans', desc: 'Structured, individualized plans of care and nursing diagnoses.',
    cols: ['Plan ID', 'Patient Name', 'Nursing Diagnosis', 'Interventions', 'Last Reviewed', 'Status'],
    stats: [{ label: 'Active Plans', val: '24', col: 'text-blue-400' }, { label: 'Due for Review', val: '3', col: 'text-amber-400' }, { label: 'Goals Met', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const diags = ['Impaired Skin Integrity', 'Acute Pain', 'Risk for Fall', 'Ineffective Airway', 'Fluid Imbalance'];
      const inters = ['Q2H Turning', 'Analgesics PRN', 'Bed Alarm', 'Suctioning PRN', 'Strict I/O'];
      const statuses = ['Active', 'Active', 'Review Due', 'Active', 'Goal Met'];
      return { planid: 'NCP-' + (7001+i), patientname: names[i], nursingdiagnosis: diags[i], interventions: inters[i], lastreviewed: 'Yesterday', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/care/progress', title: 'Care Progress', desc: 'Track patient progression against established nursing goals.',
    cols: ['Record ID', 'Patient Name', 'Care Goal', 'Current Progress', 'Evaluated By', 'Status'],
    stats: [{ label: 'Goals Tracked', val: '32', col: 'text-blue-400' }, { label: 'Improving', val: '28', col: 'text-emerald-400' }, { label: 'No Change/Declining', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const goals = ['Pain < 3/10', 'Ambulates 50ft', 'Clear Lung Sounds', 'Tolerates Oral Diet', 'Wound Healing'];
      const progs = ['Currently 2/10', 'Ambulates 20ft', 'Rhonchi present', 'Tolerating liquids', 'Granulation present'];
      const statuses = ['Goal Met', 'Improving', 'No Change', 'Improving', 'Improving'];
      return { recordid: 'PRG-' + (8001+i), patientname: names[i], caregoal: goals[i], currentprogress: progs[i], evaluatedby: 'Nurse Smith', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/care/dressing', title: 'Dressing Changes', desc: 'Schedule and log surgical and wound dressing changes.',
    cols: ['Task ID', 'Patient Name', 'Wound Location', 'Dressing Type', 'Next Due', 'Status'],
    stats: [{ label: 'Changes Today', val: '18', col: 'text-blue-400' }, { label: 'Completed', val: '14', col: 'text-emerald-400' }, { label: 'Overdue', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const locs = ['Abdomen (Surgical)', 'Left Knee', 'Sacrum', 'Right Forearm', 'Chest'];
      const types = ['Gauze & Tape', 'Hydrocolloid', 'Foam Dressing', 'Transparent Film', 'Gauze & Tape'];
      const statuses = ['Pending', 'Completed', 'Overdue', 'Completed', 'Pending'];
      return { taskid: 'DRS-' + (9001+i), patientname: names[i], woundlocation: locs[i], dressingtype: types[i], nextdue: '14:00 PM', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/care/catheter', title: 'Catheter Care', desc: 'Log insertion, removal, and maintenance of urinary/IV catheters.',
    cols: ['Log ID', 'Patient Name', 'Catheter Type', 'Inserted On', 'Days In Situ', 'Status'],
    stats: [{ label: 'Active Catheters', val: '22', col: 'text-blue-400' }, { label: 'Due for Change', val: '4', col: 'text-amber-400' }, { label: 'Removed Today', val: '5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const types = ['Foley Catheter', 'Peripheral IV', 'Central Line (CVC)', 'Peripheral IV', 'Foley Catheter'];
      const days = ['3 Days', '1 Day', '5 Days', '4 Days (Change Due)', '2 Days'];
      const statuses = ['Active', 'Active', 'Active', 'Change Required', 'Active'];
      return { logid: 'CATH-' + (10001+i), patientname: names[i], cathertype: types[i], insertedon: '12 Jul', daysinsitu: days[i], status: statuses[i] };
    })`
  },
  {
    path: 'nurse/care/wound', title: 'Wound Care', desc: 'Detailed assessments of wound healing, drainage, and tissue type.',
    cols: ['Assessment ID', 'Patient Name', 'Wound Type', 'Size (cm)', 'Tissue Type', 'Status'],
    stats: [{ label: 'Active Wounds', val: '15', col: 'text-blue-400' }, { label: 'Healing/Granulating', val: '12', col: 'text-emerald-400' }, { label: 'Infected/Slough', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const types = ['Surgical Incision', 'Pressure Ulcer (Stg 2)', 'Laceration', 'Diabetic Foot Ulcer', 'Surgical Incision'];
      const tissues = ['Granulation', 'Slough', 'Granulation', 'Necrotic', 'Epithelializing'];
      const statuses = ['Healing', 'Needs Review', 'Healing', 'Infected', 'Healing'];
      return { assessmentid: 'WND-' + (11001+i), patientname: names[i], woundtype: types[i], sizecm: (2+i) + 'x' + (1+i), tissuetype: tissues[i], status: statuses[i] };
    })`
  },
  {
    path: 'nurse/care/drain', title: 'Drain Management', desc: 'Track output volumes and maintenance of surgical drains.',
    cols: ['Drain ID', 'Patient Name', 'Drain Type/Loc', 'Output (ml)', 'Fluid Color', 'Status'],
    stats: [{ label: 'Active Drains', val: '8', col: 'text-blue-400' }, { label: 'Ready for Removal', val: '2', col: 'text-emerald-400' }, { label: 'High Output', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const types = ['JP Drain (Abd)', 'Hemovac (Knee)', 'Chest Tube (L)', 'JP Drain (Neck)', 'Penrose (Abd)'];
      const outs = ['45', '20', '150', '10', '5'];
      const colors = ['Serosanguinous', 'Serous', 'Sanguinous', 'Serous', 'Serous'];
      const statuses = ['Active', 'Active', 'High Output', 'Ready to Remove', 'Ready to Remove'];
      return { drainid: 'DRN-' + (12001+i), patientname: names[i], draintypeloc: types[i], outputml: outs[i], fluidcolor: colors[i], status: statuses[i] };
    })`
  },

  // EMERGENCY
  {
    path: 'nurse/emergency/patients', title: 'ER Patients (Nurse View)', desc: 'Triage queue and active ER patients requiring nursing care.',
    cols: ['ER ID', 'Patient Name', 'Triage Priority', 'Assigned Bed', 'Primary Complaint', 'Status'],
    stats: [{ label: 'My ER Patients', val: '6', col: 'text-blue-400' }, { label: 'Critical (Red)', val: '1', col: 'text-red-500' }, { label: 'Waiting Triage', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const pris = ['Level 1', 'Level 3', 'Level 2', 'Level 4', 'Level 3'];
      const beds = ['Resus-1', 'Bed-4', 'Bed-2', 'Waiting Room', 'Bed-6'];
      const statuses = ['Resuscitation', 'Stable', 'Stabilizing', 'Waiting', 'Stable'];
      return { erid: 'ER-' + (1001+i), patientname: names[i], triagepriority: pris[i], assignedbed: beds[i], primarycomplaint: 'Trauma/Chest Pain', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/emergency/code-blue', title: 'Code Blue Log', desc: 'Documentation of cardiac/respiratory arrest events.',
    cols: ['Code ID', 'Patient Name', 'Location', 'Code Start', 'Code End', 'Status'],
    stats: [{ label: 'Codes This Month', val: '4', col: 'text-blue-400' }, { label: 'ROSC Achieved', val: '3', col: 'text-emerald-400' }, { label: 'Active Codes', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Brown', 'Emily Davis'];
      const locs = ['ER Resus', 'ICU-3', 'General Ward', 'ICU-1', 'ER Triage'];
      const statuses = ['ROSC', 'Deceased', 'ROSC', 'ROSC', 'Active Code'];
      return { codeid: 'CDB-' + (2001+i), patientname: names[i], location: locs[i], codestart: '14:20', codeend: '14:45', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/emergency/cpr', title: 'CPR/Resus Records', desc: 'Detailed logs of compressions, shocks, and meds during a code.',
    cols: ['Record ID', 'Code ID', 'Recorder', 'Total Shocks', 'Epinephrine Given', 'Status'],
    stats: [{ label: 'Records Pending Sign', val: '1', col: 'text-amber-400' }, { label: 'Signed', val: '14', col: 'text-emerald-400' }, { label: 'Audited', val: '10', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Signed', 'Pending Sign', 'Signed', 'Audited', 'Signed'];
      return { recordid: 'CPR-' + (3001+i), codeid: 'CDB-' + (2000+i), recorder: 'Nurse Joy', totalshocks: (1+i), epinephrinegiven: (2+i) + ' doses', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/emergency/medication', title: 'ER Crash Cart/Meds', desc: 'Usage logs and inventory checks for emergency medications.',
    cols: ['Check ID', 'Cart Location', 'Checked By', 'Missing/Used Items', 'Last Checked', 'Status'],
    stats: [{ label: 'Carts Checked', val: '5/5', col: 'text-emerald-400' }, { label: 'Restock Required', val: '1', col: 'text-amber-400' }, { label: 'Expired Items', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const locs = ['ER Main', 'ER Trauma', 'ICU 1', 'ICU 2', 'Ward A'];
      const miss = ['None', 'Epinephrine (2)', 'None', 'None', 'Defib Pads'];
      const statuses = ['Secure', 'Restock Required', 'Secure', 'Secure', 'Restock Required'];
      return { checkid: 'CRT-' + (4001+i), cartlocation: locs[i], checkedby: 'Nurse Smith', missinguseditems: miss[i], lastchecked: '07:00 AM', status: statuses[i] };
    })`
  },

  // ICU
  {
    path: 'nurse/icu/monitoring', title: 'ICU Flowsheet', desc: 'Intensive hour-by-hour monitoring logs for critical patients.',
    cols: ['Flowsheet ID', 'Patient Name', 'Bed', 'Hemodynamics', 'Neuro (GCS)', 'Status'],
    stats: [{ label: 'ICU Patients', val: '4', col: 'text-blue-400' }, { label: 'Flowsheets Active', val: '4', col: 'text-emerald-400' }, { label: 'Missed Hourly Check', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const hemo = ['MAP 75', 'MAP 60 (Low)', 'MAP 80', 'MAP 90', 'MAP 70'];
      const statuses = ['Stable', 'Critical', 'Stable', 'Stable', 'Monitoring'];
      return { flowsheetid: 'ICU-' + (1001+i), patientname: names[i], bed: 'ICU-' + (1+i), hemodynamics: hemo[i], neurogcs: '14', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/icu/ventilator', title: 'Ventilator Checks', desc: 'Routine checks of ventilator settings, alarms, and patient tolerance.',
    cols: ['Check ID', 'Patient Name', 'Mode', 'FiO2 / PEEP', 'Tidal Volume', 'Status'],
    stats: [{ label: 'Vented Patients', val: '3', col: 'text-blue-400' }, { label: 'Weaning Trials', val: '1', col: 'text-amber-400' }, { label: 'Checks Overdue', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const modes = ['SIMV', 'ACVC', 'CPAP (Weaning)', 'Off Vent', 'ACVC'];
      const sets = ['40% / 5', '50% / 8', '30% / 5', 'N/A', '60% / 10'];
      const statuses = ['Tolerating', 'Sedated', 'Weaning', 'Extubated', 'Desaturating'];
      return { checkid: 'VNT-' + (2001+i), patientname: names[i], mode: modes[i], fio2peep: sets[i], tidalvolume: '450ml', status: statuses[i] };
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
    },`;
    } else {
      columnsGen += `
    { header: '${col}', accessor: '${accessorKey}', sortable: true },`;
    }
  });


  let statsGen = "";
  page.stats.forEach(stat => {
    statsGen += `
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
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
}`;
};

const uniqueConfig = config.filter((v, i, a) => a.findIndex(v2 => (v2.path === v.path)) === i);

uniqueConfig.forEach(page => {
  const dir = path.join(__dirname, 'frontend', 'src', 'app', ...page.path.split('/'));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page, componentName));
  console.log('Generated: ' + page.path);
});
