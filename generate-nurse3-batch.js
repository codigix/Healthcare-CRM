const fs = require('fs');
const path = require('path');

const config = [
  // ICU
  {
    path: 'nurse/icu/central-line', title: 'Central Line Care', desc: 'Central Venous Catheter (CVC) insertion logs and site care.',
    cols: ['Line ID', 'Patient Name', 'Line Type', 'Insertion Site', 'Days In Situ', 'Status'],
    stats: [{ label: 'Active Lines', val: '8', col: 'text-blue-400' }, { label: 'Dressing Due', val: '2', col: 'text-amber-400' }, { label: 'CLABSI Risk', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const types = ['CVC', 'PICC', 'Arterial Line', 'CVC', 'PICC'];
      const statuses = ['Active', 'Active', 'Dressing Due', 'Active', 'Remove Today'];
      return { lineid: 'CLN-' + (1001+i), patientname: names[i], linetype: types[i], insertionsite: 'Rt Subclavian', daysinsitu: (2+i) + ' Days', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/icu/dialysis', title: 'Dialysis Monitoring', desc: 'CRRT/Hemodialysis session monitoring and fluid tracking.',
    cols: ['Session ID', 'Patient Name', 'Modality', 'Blood Flow (Qb)', 'Fluid Removal', 'Status'],
    stats: [{ label: 'Active Sessions', val: '2', col: 'text-blue-400' }, { label: 'Completed', val: '3', col: 'text-emerald-400' }, { label: 'Alarms', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const modes = ['CRRT', 'SLED', 'CRRT', 'HD', 'CRRT'];
      const statuses = ['Running', 'Running', 'Completed', 'Completed', 'Paused'];
      return { sessionid: 'DYL-' + (2001+i), patientname: names[i], modality: modes[i], bloodflowqb: '150 ml/min', fluidremoval: '50 ml/hr', status: statuses[i] };
    })`
  },

  // EDUCATION
  {
    path: 'nurse/education/diet', title: 'Dietary Education', desc: 'Patient and family education regarding therapeutic diets.',
    cols: ['Edu ID', 'Patient Name', 'Diet Type', 'Educated By', 'Understanding', 'Status'],
    stats: [{ label: 'Sessions Today', val: '12', col: 'text-blue-400' }, { label: 'Diabetic Diets', val: '5', col: 'text-amber-400' }, { label: 'Completed', val: '10', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const diets = ['Diabetic', 'Low Sodium', 'Renal', 'Clear Liquid', 'Diabetic'];
      const statuses = ['Completed', 'Completed', 'Pending', 'Completed', 'Follow-up Needed'];
      return { eduid: 'EDU-D-' + (1001+i), patientname: names[i], diettype: diets[i], educatedby: 'Nurse Joy', understanding: 'Good', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/education/medication', title: 'Medication Education', desc: 'Counseling on new prescriptions and medication adherence.',
    cols: ['Edu ID', 'Patient Name', 'Medication Class', 'Educated By', 'Handouts Given', 'Status'],
    stats: [{ label: 'Sessions Today', val: '18', col: 'text-blue-400' }, { label: 'Inhaler Technique', val: '4', col: 'text-amber-400' }, { label: 'Completed', val: '16', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const meds = ['Insulin', 'Inhalers', 'Anticoagulants', 'Antibiotics', 'Insulin'];
      const statuses = ['Completed', 'Completed', 'Pending', 'Completed', 'Completed'];
      return { eduid: 'EDU-M-' + (2001+i), patientname: names[i], medicationclass: meds[i], educatedby: 'Nurse Smith', handoutsgiven: 'Yes', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/education/discharge', title: 'Discharge Education', desc: 'Final checklist of educational needs prior to patient discharge.',
    cols: ['Edu ID', 'Patient Name', 'Topic Covered', 'Family Present', 'Time Spent', 'Status'],
    stats: [{ label: 'Pending Discharges', val: '8', col: 'text-amber-400' }, { label: 'Cleared', val: '6', col: 'text-emerald-400' }, { label: 'Refusals', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const statuses = ['Cleared', 'Pending', 'Cleared', 'Cleared', 'Pending'];
      return { eduid: 'EDU-X-' + (3001+i), patientname: names[i], topiccovered: 'Wound Care & Meds', familypresent: 'Yes', timespent: '15 mins', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/education/home-care', title: 'Home Care Training', desc: 'Specialized training for devices (e.g. ostomies, catheters) at home.',
    cols: ['Edu ID', 'Patient Name', 'Device/Skill', 'Demonstration', 'Return Demo', 'Status'],
    stats: [{ label: 'Trainings Required', val: '5', col: 'text-blue-400' }, { label: 'Competent', val: '3', col: 'text-emerald-400' }, { label: 'Needs Review', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const skills = ['Ostomy Care', 'Foley Care', 'Drain Mgmt', 'Insulin Injection', 'Trach Care'];
      const statuses = ['Competent', 'Needs Review', 'Competent', 'Competent', 'Pending Demo'];
      return { eduid: 'EDU-H-' + (4001+i), patientname: names[i], deviceskill: skills[i], demonstration: 'Done', returndemo: 'Pending', status: statuses[i] };
    })`
  },

  // SPECIMEN
  {
    path: 'nurse/specimen/collection', title: 'Specimen Collection', desc: 'Tasks for collecting blood, urine, or swab samples.',
    cols: ['Task ID', 'Patient Name', 'Specimen Type', 'Test Ordered', 'Due Time', 'Status'],
    stats: [{ label: 'Pending Collections', val: '12', col: 'text-amber-400' }, { label: 'Collected Today', val: '45', col: 'text-emerald-400' }, { label: 'STAT', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const specs = ['Blood (EDTA)', 'Urine MSU', 'Blood (Serum)', 'Sputum', 'Wound Swab'];
      const statuses = ['Pending Collection', 'Collected', 'Pending Collection', 'Overdue', 'Collected'];
      return { taskid: 'SPC-' + (1001+i), patientname: names[i], specimentype: specs[i], testordered: 'CBC', duetime: '10:00 AM', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/specimen/dispatch', title: 'Specimen Dispatch', desc: 'Log of specimens sent to the laboratory.',
    cols: ['Dispatch ID', 'Patient Name', 'Specimen Type', 'Sent Via', 'Time Sent', 'Status'],
    stats: [{ label: 'Dispatched Today', val: '40', col: 'text-blue-400' }, { label: 'In Transit', val: '5', col: 'text-amber-400' }, { label: 'Received by Lab', val: '35', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const statuses = ['Received by Lab', 'In Transit', 'Received by Lab', 'Received by Lab', 'In Transit'];
      return { dispatchid: 'DSP-' + (2001+i), patientname: names[i], specimentype: 'Blood', sentvia: 'Pneumatic Tube', timesent: '09:30 AM', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/specimen/pending', title: 'Pending Lab Results', desc: 'Track specimens awaiting results from the laboratory.',
    cols: ['Req ID', 'Patient Name', 'Test Name', 'Lab Dept', 'Turnaround Time', 'Status'],
    stats: [{ label: 'Awaiting Results', val: '24', col: 'text-amber-400' }, { label: 'Overdue (TAT)', val: '2', col: 'text-red-400' }, { label: 'Results Ready', val: '10', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const statuses = ['Processing', 'Results Ready', 'Processing', 'Overdue', 'Processing'];
      return { reqid: 'REQ-' + (3001+i), patientname: names[i], testname: 'Electrolytes', labdept: 'Biochemistry', turnaroundtime: '2 hours', status: statuses[i] };
    })`
  },

  // CHECKLISTS
  {
    path: 'nurse/checklists/admission', title: 'Admission Checklist', desc: 'Standardized checks for incoming patient admissions.',
    cols: ['Checklist ID', 'Patient Name', 'Ward', 'Items Complete', 'Missing Docs', 'Status'],
    stats: [{ label: 'Admissions Today', val: '8', col: 'text-blue-400' }, { label: 'Checklists Pending', val: '3', col: 'text-amber-400' }, { label: 'Completed', val: '5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const statuses = ['Completed', 'In Progress', 'Completed', 'In Progress', 'Completed'];
      return { checklistid: 'CHK-A-' + (1001+i), patientname: names[i], ward: 'General', itemscomplete: '10/12', missingdocs: 'Consent Form', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/checklists/shift', title: 'Shift Checklist', desc: 'Start/End of shift responsibilities and equipment checks.',
    cols: ['Checklist ID', 'Nurse Name', 'Shift', 'Crash Cart Checked', 'Narcotics Counted', 'Status'],
    stats: [{ label: 'Shift Checks Done', val: '22', col: 'text-emerald-400' }, { label: 'Pending', val: '2', col: 'text-amber-400' }, { label: 'Discrepancies', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Verified', 'Verified', 'Pending', 'Verified', 'Verified'];
      return { checklistid: 'CHK-S-' + (2001+i), nursename: 'Nurse Joy', shift: 'Morning', crashcartchecked: 'Yes', narcoticscounted: 'Match', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/checklists/ot', title: 'Pre-Op / OT Checklist', desc: 'Preparation checklist before transferring patient to the OR.',
    cols: ['Checklist ID', 'Patient Name', 'Surgery', 'Consent Signed', 'NPO Status', 'Status'],
    stats: [{ label: 'Surgeries Today', val: '6', col: 'text-blue-400' }, { label: 'Cleared for OT', val: '4', col: 'text-emerald-400' }, { label: 'Prep Pending', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const statuses = ['Cleared', 'Prep Pending', 'Cleared', 'Cleared', 'Prep Pending'];
      return { checklistid: 'CHK-O-' + (3001+i), patientname: names[i], surgery: 'Appendectomy', consentsigned: 'Yes', npostatus: 'Confirmed >8h', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/checklists/icu', title: 'ICU Transfer Checklist', desc: 'Critical care transfer protocols and equipment readiness.',
    cols: ['Checklist ID', 'Patient Name', 'From Ward', 'Bed Prepared', 'Ventilator Ready', 'Status'],
    stats: [{ label: 'Transfers Pending', val: '2', col: 'text-amber-400' }, { label: 'Completed', val: '3', col: 'text-emerald-400' }, { label: 'Equipment Issues', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const statuses = ['Ready', 'Ready', 'Preparing', 'Ready', 'Preparing'];
      return { checklistid: 'CHK-I-' + (4001+i), patientname: names[i], fromward: 'Ward A', bedprepared: 'Yes', ventilatorready: 'Yes', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/checklists/discharge', title: 'Discharge Checklist', desc: 'Verification of meds, belongings, and follow-up plans.',
    cols: ['Checklist ID', 'Patient Name', 'Cannula Out', 'Meds Given', 'Belongings Returned', 'Status'],
    stats: [{ label: 'Discharges Today', val: '12', col: 'text-blue-400' }, { label: 'Cleared', val: '10', col: 'text-emerald-400' }, { label: 'Pending Pharmacy', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const statuses = ['Cleared', 'Cleared', 'Pending Meds', 'Cleared', 'In Progress'];
      return { checklistid: 'CHK-D-' + (5001+i), patientname: names[i], cannulaout: 'Yes', medsgiven: 'Yes', belongingsreturned: 'Yes', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/checklists/infection', title: 'Infection Control Checks', desc: 'Isolation protocols, hygiene audits, and PPE compliance.',
    cols: ['Audit ID', 'Ward/Room', 'Isolation Type', 'Signage Posted', 'PPE Available', 'Status'],
    stats: [{ label: 'Isolation Rooms', val: '4', col: 'text-amber-400' }, { label: 'Audits Passed', val: '4/4', col: 'text-emerald-400' }, { label: 'Violations', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const rooms = ['Iso-1', 'Iso-2', 'Iso-3', 'Ward-A (Gen)', 'Ward-B (Gen)'];
      const types = ['Contact', 'Airborne', 'Droplet', 'Standard', 'Standard'];
      const statuses = ['Compliant', 'Compliant', 'Compliant', 'Compliant', 'Compliant'];
      return { auditid: 'INF-' + (6001+i), wardroom: rooms[i], isolationtype: types[i], signageposted: 'Yes', ppeavailable: 'Adequate', status: statuses[i] };
    })`
  },

  // DOCUMENTATION
  {
    path: 'nurse/documentation/assessment', title: 'Nursing Assessments', desc: 'Comprehensive admission and shift-based patient assessments.',
    cols: ['Doc ID', 'Patient Name', 'Assessment Type', 'System Reviewed', 'Authored By', 'Status'],
    stats: [{ label: 'Assessments Logged', val: '34', col: 'text-blue-400' }, { label: 'Pending Review', val: '4', col: 'text-amber-400' }, { label: 'Signed', val: '30', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const statuses = ['Signed', 'Signed', 'Draft', 'Signed', 'Signed'];
      return { docid: 'DOC-A-' + (1001+i), patientname: names[i], assessmenttype: 'Initial Shift', systemreviewed: 'Neurological', authoredby: 'Nurse Joy', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/documentation/care-plan', title: 'Care Plan Updates', desc: 'Documentation of revisions to nursing care plans.',
    cols: ['Update ID', 'Patient Name', 'Plan ID', 'Change Reason', 'Updated By', 'Status'],
    stats: [{ label: 'Plans Updated', val: '12', col: 'text-blue-400' }, { label: 'Approved', val: '10', col: 'text-emerald-400' }, { label: 'Pending Approval', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const statuses = ['Approved', 'Pending Auth', 'Approved', 'Approved', 'Approved'];
      return { updateid: 'CPL-' + (2001+i), patientname: names[i], planid: 'NCP-' + (7000+i), changereason: 'Change in condition', updatedby: 'Nurse Smith', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/documentation/handover', title: 'Handover Documentation', desc: 'Formal SBAR (Situation-Background-Assessment-Recommendation) records.',
    cols: ['SBAR ID', 'Patient Name', 'To Shift', 'Receiving Nurse', 'Time', 'Status'],
    stats: [{ label: 'Handovers Logged', val: '22', col: 'text-blue-400' }, { label: 'Acknowledged', val: '20', col: 'text-emerald-400' }, { label: 'Incomplete', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const statuses = ['Acknowledged', 'Acknowledged', 'Pending Ack', 'Acknowledged', 'Acknowledged'];
      return { sbarid: 'SBR-' + (3001+i), patientname: names[i], toshift: 'Evening', receivingnurse: 'Nurse Chapel', time: '14:00', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/documentation/incident', title: 'Incident Reports', desc: 'Documentation of adverse events, falls, or medication errors.',
    cols: ['Incident ID', 'Patient/Staff Involved', 'Event Type', 'Severity', 'Reported By', 'Status'],
    stats: [{ label: 'Incidents Today', val: '1', col: 'text-amber-400' }, { label: 'Under Investigation', val: '1', col: 'text-blue-400' }, { label: 'Closed', val: '5 (Monthly)', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const types = ['Patient Fall', 'Med Error (Near Miss)', 'Equipment Failure', 'Patient Fall', 'Aggressive Behavior'];
      const statuses = ['Investigating', 'Closed', 'Closed', 'Investigating', 'Closed'];
      return { incidentid: 'INC-' + (4001+i), patientstaffinvolved: names[i], eventtype: types[i], severity: 'Low', reportedby: 'Nurse Joy', status: statuses[i] };
    })`
  },

  // COMMUNICATION
  {
    path: 'nurse/communication/doctor', title: 'Doctor Comm Log', desc: 'Tracking calls and pages made to physicians.',
    cols: ['Comm ID', 'Doctor Name', 'Regarding Patient', 'Reason for Call', 'Response Time', 'Status'],
    stats: [{ label: 'Calls Made', val: '15', col: 'text-blue-400' }, { label: 'Avg Response', val: '8 mins', col: 'text-emerald-400' }, { label: 'Awaiting Call Back', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const docs = ['Dr. Grey', 'Dr. Shepherd', 'Dr. Sloan', 'Dr. Jenkins', 'Dr. House'];
      const statuses = ['Resolved', 'Resolved', 'Awaiting Callback', 'Resolved', 'Resolved'];
      return { commid: 'CAL-' + (1001+i), doctorname: docs[i], regardingpatient: 'Ward Bed ' + (1+i), reasonforcall: 'Abnormal Labs', responsetime: '5 mins', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/communication/messages', title: 'Internal Messages', desc: 'Secure text and broadcast messages with other ward staff.',
    cols: ['Msg ID', 'From', 'To/Group', 'Subject', 'Time', 'Status'],
    stats: [{ label: 'Unread Messages', val: '4', col: 'text-amber-400' }, { label: 'Sent Today', val: '24', col: 'text-blue-400' }, { label: 'Broadcasts', val: '1', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Unread', 'Read', 'Read', 'Unread', 'Read'];
      return { msgid: 'MSG-' + (2001+i), from: 'Charge Nurse', togroup: 'All Ward Nurses', subject: 'Bed Availability Update', time: '10:00 AM', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/communication/handover', title: 'Inter-Department Comm', desc: 'Communication logs between nursing and pharmacy, lab, etc.',
    cols: ['Comm ID', 'Department', 'Contact Person', 'Reason', 'Resolution', 'Status'],
    stats: [{ label: 'Inter-Dept Comms', val: '12', col: 'text-blue-400' }, { label: 'Pharmacy Issues', val: '3', col: 'text-amber-400' }, { label: 'Resolved', val: '10', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Pharmacy', 'Laboratory', 'Radiology', 'Dietary', 'Pharmacy'];
      const statuses = ['Resolved', 'Resolved', 'Pending', 'Resolved', 'Pending'];
      return { commid: 'IDC-' + (3001+i), department: depts[i], contactperson: 'Pharmacist Desk', reason: 'Missing Meds', resolution: 'Dispensed', status: statuses[i] };
    })`
  },

  // REPORTS
  {
    path: 'nurse/reports/census', title: 'Ward Census Report', desc: 'Daily summary of admissions, discharges, and bed occupancy.',
    cols: ['Report ID', 'Date', 'Total Beds', 'Occupied', 'Admissions', 'Discharges'],
    stats: [{ label: 'Avg Occupancy', val: '88%', col: 'text-blue-400' }, { label: 'Highest Volume Day', val: 'Monday', col: 'text-gray-400' }, { label: 'Turnover Rate', val: '12%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportid: 'RPT-C-' + (1001+i), date: (10+i) + ' Jul 2026', totalbeds: '50', occupied: '45', admissions: '5', discharges: '4', status: 'Generated' };
    })`
  },
  {
    path: 'nurse/reports/medication', title: 'Medication Admin Report', desc: 'Analytics on medication timings, errors, and PRN usage.',
    cols: ['Report ID', 'Ward', 'Meds Given', 'On-Time %', 'Missed/Refused', 'Status'],
    stats: [{ label: 'On-Time Admin', val: '96%', col: 'text-emerald-400' }, { label: 'PRN Doses', val: '45', col: 'text-blue-400' }, { label: 'Errors Reported', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportid: 'RPT-M-' + (2001+i), ward: 'General Ward ' + ['A','B','C','ICU','ER'][i], medsgiven: '350', ontime: '95%', missedrefused: '5', status: 'Generated' };
    })`
  },
  {
    path: 'nurse/reports/vitals', title: 'Vitals Compliance', desc: 'Report on nursing compliance with scheduled vitals checks.',
    cols: ['Report ID', 'Date Range', 'Total Checks Due', 'Checks Done', 'Compliance %', 'Status'],
    stats: [{ label: 'Overall Compliance', val: '98%', col: 'text-emerald-400' }, { label: 'Missed Checks', val: '12', col: 'text-amber-400' }, { label: 'Night Shift Diff', val: '-2%', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportid: 'RPT-V-' + (3001+i), daterange: 'Week ' + (1+i), totalchecksdue: '1200', checksdone: '1180', compliance: '98%', status: 'Generated' };
    })`
  },
  {
    path: 'nurse/reports/care', title: 'Care Plan Audits', desc: 'Audit reports measuring the completeness of nursing care plans.',
    cols: ['Audit ID', 'Ward', 'Charts Audited', 'Complete Plans', 'Deficiencies', 'Status'],
    stats: [{ label: 'Charts Audited', val: '50', col: 'text-blue-400' }, { label: 'Pass Rate', val: '92%', col: 'text-emerald-400' }, { label: 'Action Required', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Passed', 'Action Req', 'Passed', 'Passed', 'Passed'];
      return { auditid: 'ADT-C-' + (4001+i), ward: 'Ward ' + (1+i), chartsaudited: '10', completeplans: '9', deficiencies: '1', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/reports/shift', title: 'Shift Summary Reports', desc: 'Aggregated data on nurse workload, overtime, and staffing ratios.',
    cols: ['Report ID', 'Date', 'Shift', 'Nurses on Duty', 'Patient Ratio', 'Status'],
    stats: [{ label: 'Avg Ratio', val: '1:5', col: 'text-blue-400' }, { label: 'Overtime Hours', val: '12', col: 'text-amber-400' }, { label: 'Sick Calls', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const shifts = ['Morning', 'Evening', 'Night', 'Morning', 'Evening'];
      return { reportid: 'RPT-S-' + (5001+i), date: 'Today', shift: shifts[i], nursesonduty: '8', patientratio: '1:5', status: 'Generated' };
    })`
  },
  {
    path: 'nurse/reports/incident', title: 'Incident Analytics', desc: 'Trends and analysis of nursing-related incident reports.',
    cols: ['Report ID', 'Month', 'Total Incidents', 'Falls', 'Med Errors', 'Status'],
    stats: [{ label: 'Incidents (YTD)', val: '15', col: 'text-amber-400' }, { label: 'Fall Rate', val: '1.2/1000', col: 'text-emerald-400' }, { label: 'Action Plans', val: '3', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportid: 'RPT-I-' + (6001+i), month: ['Jan', 'Feb', 'Mar', 'Apr', 'May'][i], totalincidents: '3', falls: '2', mederrors: '0', status: 'Generated' };
    })`
  },

  // PERFORMANCE & SETTINGS
  {
    path: 'nurse/performance/tasks', title: 'Task Efficiency', desc: 'Metrics tracking individual nurse task completion times.',
    cols: ['Metric ID', 'Nurse Name', 'Tasks Assigned', 'Completed On-Time', 'Efficiency %', 'Status'],
    stats: [{ label: 'Avg Efficiency', val: '94%', col: 'text-emerald-400' }, { label: 'High Performers', val: '12', col: 'text-blue-400' }, { label: 'Needs Support', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Nurse Joy', 'Nurse Smith', 'Nurse Chapel', 'Nurse Ratched', 'Nurse Jackie'];
      const statuses = ['Excellent', 'Good', 'Excellent', 'Average', 'Good'];
      return { metricid: 'PER-T-' + (1001+i), nursename: names[i], tasksassigned: '45', completedontime: '43', efficiency: '95%', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/performance/assignments', title: 'Assignment Load', desc: 'Analysis of patient acuity and workload distribution.',
    cols: ['Log ID', 'Nurse Name', 'Avg Patients', 'Acuity Score', 'Overtime Hrs', 'Status'],
    stats: [{ label: 'Avg Acuity Load', val: 'Medium-High', col: 'text-amber-400' }, { label: 'Balanced Shifts', val: '85%', col: 'text-emerald-400' }, { label: 'Overburdened', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Nurse Joy', 'Nurse Smith', 'Nurse Chapel', 'Nurse Ratched', 'Nurse Jackie'];
      const statuses = ['Balanced', 'Heavy Load', 'Balanced', 'Balanced', 'Light Load'];
      return { logid: 'PER-A-' + (2001+i), nursename: names[i], avgpatients: '5', acuityscore: '24', overtimehrs: '2', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/performance/medication', title: 'Medication Safety Score', desc: 'Individual nurse metrics for safe medication administration.',
    cols: ['Metric ID', 'Nurse Name', 'Meds Administered', 'Errors', 'Barcode Scan %', 'Status'],
    stats: [{ label: 'Overall Safety', val: '99.8%', col: 'text-emerald-400' }, { label: 'Barcode Compliance', val: '98%', col: 'text-emerald-400' }, { label: 'Errors (30d)', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Nurse Joy', 'Nurse Smith', 'Nurse Chapel', 'Nurse Ratched', 'Nurse Jackie'];
      const statuses = ['Excellent', 'Excellent', 'Excellent', 'Good', 'Excellent'];
      return { metricid: 'PER-M-' + (3001+i), nursename: names[i], medsadministered: '450', errors: '0', barcodescan: '99%', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/performance/kpis', title: 'Nursing KPIs', desc: 'Overall department and individual key performance indicators.',
    cols: ['KPI ID', 'Metric Name', 'Target', 'Current Score', 'Variance', 'Status'],
    stats: [{ label: 'KPIs Met', val: '15/18', col: 'text-emerald-400' }, { label: 'Overall Grade', val: 'A-', col: 'text-blue-400' }, { label: 'Focus Areas', val: 'Documentation', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Patient Satisfaction', 'Fall Rate', 'CLABSI Rate', 'Charting Compliance', 'Overtime %'];
      const statuses = ['Target Met', 'Target Met', 'Target Met', 'Lagging', 'Target Met'];
      return { kpiid: 'KPI-N-' + (4001+i), metricname: metrics[i], target: '95%', currentscore: '96%', variance: '+1%', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/settings/profile', title: 'Nurse Profile', desc: 'Manage your personal details, credentials, and certifications.',
    cols: ['Credential ID', 'Document Type', 'Issue Date', 'Expiry Date', 'Verification', 'Status'],
    stats: [{ label: 'License Status', val: 'Active', col: 'text-emerald-400' }, { label: 'CEUs Earned', val: '24/30', col: 'text-blue-400' }, { label: 'Expiring Soon', val: 'BLS (30 days)', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const docs = ['RN License', 'BLS Certification', 'ACLS Certification', 'PALS Certification', 'Infection Control Module'];
      const statuses = ['Valid', 'Expiring Soon', 'Valid', 'Valid', 'Valid'];
      return { credentialid: 'CRD-' + (1001+i), documenttype: docs[i], issuedate: '01 Jan 2024', expirydate: '01 Jan 2026', verification: 'Verified', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/settings/preferences', title: 'Dashboard Preferences', desc: 'Customize layout, notifications, and default ward views.',
    cols: ['Setting ID', 'Preference Name', 'Category', 'Current Value', 'Last Updated', 'Status'],
    stats: [{ label: 'Theme', val: 'Dark Mode', col: 'text-blue-400' }, { label: 'Alerts', val: 'Enabled (High)', col: 'text-emerald-400' }, { label: 'Default View', val: 'My Patients', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const prefs = ['Default Ward', 'Push Notifications', 'Sound Alerts', 'Language', 'Data Refresh Rate'];
      const vals = ['ICU', 'Enabled', 'High Priority Only', 'English', 'Auto (1m)'];
      return { settingid: 'SET-' + (2001+i), preferencename: prefs[i], category: 'UI/UX', currentvalue: vals[i], lastupdated: 'Today', status: 'Active' };
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
