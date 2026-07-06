const fs = require('fs');
const path = require('path');

const config = [
  // SHIFT
  {
    path: 'nurse/shift/today', title: "Today's Shift", desc: 'Current shift overview and primary responsibilities.',
    cols: ['Assignment ID', 'Ward/Unit', 'Patients Assigned', 'Start Time', 'End Time', 'Status'],
    stats: [{ label: 'My Patients Today', val: '8', col: 'text-blue-400' }, { label: 'Tasks Pending', val: '12', col: 'text-amber-400' }, { label: 'Time Left', val: '4h 15m', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const wards = ['ICU', 'General Ward A', 'Post-Op', 'ER', 'NICU'];
      const statuses = ['Active', 'Completed', 'Upcoming', 'Active', 'Active'];
      return { assignmentid: 'ASN-' + (1001+i), wardunit: wards[i], patientsassigned: (5+i), starttime: '08:00 AM', endtime: '04:00 PM', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/shift/roster', title: 'Shift Roster', desc: 'Monthly nursing schedule and upcoming shifts.',
    cols: ['Shift Date', 'Day', 'Shift Timing', 'Ward/Unit', 'Charge Nurse', 'Status'],
    stats: [{ label: 'Total Shifts', val: '22', col: 'text-blue-400' }, { label: 'Night Shifts', val: '5', col: 'text-amber-400' }, { label: 'Leave Days', val: '4', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const timings = ['08:00 AM - 04:00 PM', '04:00 PM - 12:00 AM', '12:00 AM - 08:00 AM', '08:00 AM - 04:00 PM', 'Off Duty'];
      const wards = ['ICU', 'General Ward A', 'Post-Op', 'ER', 'N/A'];
      const statuses = ['Completed', 'Completed', 'Active', 'Scheduled', 'Off Duty'];
      return { shiftdate: (10+i) + ' Jul, 2026', day: days[i], shifttiming: timings[i], wardunit: wards[i], chargenurse: 'Nurse Joy', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/shift/handover', title: 'Shift Handovers', desc: 'Critical patient notes transferred between nursing shifts.',
    cols: ['Handover ID', 'Patient Name', 'Bed', 'Outgoing Nurse', 'Key Notes', 'Status'],
    stats: [{ label: 'Pending Handovers', val: '4', col: 'text-amber-400' }, { label: 'Acknowledged', val: '24', col: 'text-emerald-400' }, { label: 'Critical Patients', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const notes = ['BP unstable', 'Awaiting Labs', 'Ready for discharge', 'Check IV at 10 AM', 'No issues'];
      const statuses = ['Pending Ack', 'Acknowledged', 'Acknowledged', 'Pending Ack', 'Acknowledged'];
      return { handoverid: 'HND-' + (2001+i), patientname: names[i], bed: 'ICU-' + (1+i), outgoingnurse: 'Nurse Smith', keynotes: notes[i], status: statuses[i] };
    })`
  },
  {
    path: 'nurse/shift/wards', title: 'Ward Overview', desc: 'High-level view of all beds and patients in your current ward.',
    cols: ['Bed Number', 'Patient Name', 'Admission Reason', 'Attending Dr', 'Last Check', 'Status'],
    stats: [{ label: 'Total Beds', val: '20', col: 'text-blue-400' }, { label: 'Occupied', val: '18', col: 'text-amber-400' }, { label: 'Vacant', val: '2', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const statuses = ['Stable', 'Critical', 'Observation', 'Discharging', 'Vacant'];
      return { bednumber: 'Ward A - ' + (1+i), patientname: i === 4 ? '-' : names[i], admissionreason: i === 4 ? '-' : 'Observation', attendingdr: i === 4 ? '-' : 'Dr. Grey', lastcheck: '15 mins ago', status: statuses[i] };
    })`
  },

  // PATIENTS
  {
    path: 'nurse/patients/my-patients', title: 'My Assigned Patients', desc: 'Directory of all patients currently under your care.',
    cols: ['Patient ID', 'Patient Name', 'Age/Gender', 'Bed', 'Primary Dx', 'Status'],
    stats: [{ label: 'Total Assigned', val: '8', col: 'text-blue-400' }, { label: 'High Acuity', val: '2', col: 'text-red-400' }, { label: 'Routine Care', val: '6', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const genders = ['22/M', '21/F', '23/M', '21/F', '18/M'];
      const statuses = ['Stable', 'Monitoring', 'Critical', 'Stable', 'Discharging'];
      return { patientid: 'PAT-' + (3001+i), patientname: names[i], agegender: genders[i], bed: 'ICU-' + (1+i), primarydx: 'Fever', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/patients/bed-allocation', title: 'Bed Allocations', desc: 'Manage and update patient bed assignments within the ward.',
    cols: ['Allocation ID', 'Patient Name', 'Current Bed', 'New Bed (Transfer)', 'Action By', 'Status'],
    stats: [{ label: 'Beds Managed', val: '20', col: 'text-blue-400' }, { label: 'Pending Transfers', val: '3', col: 'text-amber-400' }, { label: 'Allocated Today', val: '5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const currents = ['ER-1', 'ICU-3', 'Ward-12', 'Ward-5', 'N/A'];
      const news = ['Ward-2', 'N/A', 'ICU-1', 'Discharged', 'Ward-1'];
      const statuses = ['Pending Transfer', 'Allocated', 'Pending Transfer', 'Completed', 'Allocated'];
      return { allocationid: 'BED-' + (4001+i), patientname: names[i], currentbed: currents[i], newbedtransfer: news[i], actionby: 'Admin', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/patients/admitted', title: 'Admitted Log', desc: 'Log of newly admitted patients requiring initial assessment.',
    cols: ['Admit ID', 'Patient Name', 'Time of Admit', 'From Dept', 'Initial Vitals', 'Status'],
    stats: [{ label: 'Admitted Today', val: '12', col: 'text-blue-400' }, { label: 'Assessments Pending', val: '4', col: 'text-red-400' }, { label: 'Stabilized', val: '8', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const depts = ['ER', 'OPD', 'Surgery', 'ER', 'ICU Transfer'];
      const vitals = ['Pending', 'Completed', 'Completed', 'Pending', 'Completed'];
      const statuses = ['Awaiting Assessment', 'Stable', 'Monitoring', 'Awaiting Assessment', 'Stable'];
      return { admitid: 'ADM-' + (5001+i), patientname: names[i], timeofadmit: '10:00 AM', fromdept: depts[i], initialvitals: vitals[i], status: statuses[i] };
    })`
  },
  {
    path: 'nurse/patients/transfers', title: 'Unit Transfers', desc: 'Patients moving into or out of your assigned unit.',
    cols: ['Transfer ID', 'Patient Name', 'From/To Unit', 'Transfer Time', 'Reason', 'Status'],
    stats: [{ label: 'Incoming Transfers', val: '2', col: 'text-amber-400' }, { label: 'Outgoing Transfers', val: '1', col: 'text-blue-400' }, { label: 'Completed', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const units = ['ER -> ICU', 'ICU -> Ward', 'Ward -> Surgery', 'Surgery -> ICU', 'Ward -> Ward'];
      const statuses = ['In Transit', 'Completed', 'Pending', 'Completed', 'In Transit'];
      return { transferid: 'TRF-' + (6001+i), patientname: names[i], fromtounit: units[i], transfertime: '14:30', reason: 'Upgrade of Care', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/patients/discharge', title: 'Discharge Processing', desc: 'Finalize nursing checklist for departing patients.',
    cols: ['Discharge ID', 'Patient Name', 'Bed', 'Checklist', 'Cannula Removed', 'Status'],
    stats: [{ label: 'Discharges Today', val: '8', col: 'text-blue-400' }, { label: 'Cleared to Leave', val: '5', col: 'text-emerald-400' }, { label: 'Pending Meds', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const checks = ['4/5', '5/5', '1/5', '5/5', '2/5'];
      const canns = ['Yes', 'Yes', 'No', 'Yes', 'No'];
      const statuses = ['Pending Meds', 'Cleared', 'In Progress', 'Cleared', 'In Progress'];
      return { dischargeid: 'DIS-' + (7001+i), patientname: names[i], bed: 'Ward-' + (10+i), checklist: checks[i], cannularemoved: canns[i], status: statuses[i] };
    })`
  },

  // MONITORING
  {
    path: 'nurse/monitoring/vitals', title: 'Vitals Log', desc: 'Record and track routine vital signs for assigned patients.',
    cols: ['Record ID', 'Patient Name', 'Time Logged', 'BP (mmHg)', 'HR / Temp', 'Status'],
    stats: [{ label: 'Vitals Logged Today', val: '45', col: 'text-blue-400' }, { label: 'Overdue Logs', val: '2', col: 'text-red-400' }, { label: 'Abnormal', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const statuses = ['Normal', 'Elevated', 'Normal', 'Normal', 'Overdue'];
      return { recordid: 'VIT-' + (8001+i), patientname: names[i], timelogged: '10:00 AM', bpmmhg: '120/80', hrtemp: '72 bpm / 98.6F', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/monitoring/io', title: 'Intake/Output (I/O)', desc: 'Track patient fluid balance, intake, and output volumes.',
    cols: ['I/O ID', 'Patient Name', 'Shift', 'Total Intake (ml)', 'Total Output (ml)', 'Status'],
    stats: [{ label: 'Patients Tracked', val: '12', col: 'text-blue-400' }, { label: 'Negative Balance', val: '2', col: 'text-amber-400' }, { label: 'Target Met', val: '10', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const ins = ['1500', '1200', '800', '2000', '1000'];
      const outs = ['1400', '1300', '600', '1950', '400'];
      const statuses = ['Balanced', 'Balanced', 'Monitor closely', 'Balanced', 'Fluid Retention'];
      return { ioid: 'IO-' + (1001+i), patientname: names[i], shift: 'Morning', totalintakeml: ins[i], totaloutputml: outs[i], status: statuses[i] };
    })`
  },
  {
    path: 'nurse/monitoring/pain', title: 'Pain Assessments', desc: 'Regular pain scale scoring and intervention tracking.',
    cols: ['Record ID', 'Patient Name', 'Pain Scale', 'Location', 'Intervention', 'Status'],
    stats: [{ label: 'Assessments Done', val: '28', col: 'text-blue-400' }, { label: 'High Pain (>7)', val: '1', col: 'text-red-400' }, { label: 'Interventions', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const scales = ['2/10', '8/10', '5/10', '0/10', '9/10'];
      const statuses = ['Controlled', 'Intervening', 'Monitoring', 'Controlled', 'Critical'];
      return { recordid: 'PAN-' + (2001+i), patientname: names[i], painscale: scales[i], location: 'Leg', intervention: 'Meds Given', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/monitoring/gcs', title: 'GCS Tracking', desc: 'Glasgow Coma Scale monitoring for neurological patients.',
    cols: ['Eval ID', 'Patient Name', 'Eye (E)', 'Verbal (V)', 'Motor (M)', 'Total Score / Status'],
    stats: [{ label: 'GCS Tracked', val: '5', col: 'text-blue-400' }, { label: 'Deteriorating', val: '1', col: 'text-red-400' }, { label: 'Stable', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const e = ['4', '3', '4', '1', '4'];
      const v = ['5', '4', '5', '1', '5'];
      const m = ['6', '5', '6', '1', '6'];
      const statuses = ['15 (Normal)', '12 (Mild)', '15 (Normal)', '3 (Severe)', '15 (Normal)'];
      return { evalid: 'GCS-' + (3001+i), patientname: names[i], eyee: e[i], verbalv: v[i], motorm: m[i], totalscorestatus: statuses[i] };
    })`
  },
  {
    path: 'nurse/monitoring/ews', title: 'Early Warning Score', desc: 'Track EWS parameters to identify clinical deterioration.',
    cols: ['Record ID', 'Patient Name', 'Time', 'EWS Score', 'Clinical Response', 'Status'],
    stats: [{ label: 'Total Scores', val: '45', col: 'text-blue-400' }, { label: 'High Risk (Score >6)', val: '2', col: 'text-red-500' }, { label: 'Low Risk', val: '40', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const scores = ['0', '3', '1', '7', '0'];
      const resps = ['Routine', 'Increase frequency', 'Routine', 'Urgent medical review', 'Routine'];
      const statuses = ['Normal', 'Monitor', 'Normal', 'Critical', 'Normal'];
      return { recordid: 'EWS-' + (4001+i), patientname: names[i], time: '12:00 PM', ewsscore: scores[i], clinicalresponse: resps[i], status: statuses[i] };
    })`
  },
  {
    path: 'nurse/monitoring/fall-risk', title: 'Fall Risk Assessments', desc: 'Evaluate and log patient fall risks (e.g., Morse Fall Scale).',
    cols: ['Eval ID', 'Patient Name', 'Scale Used', 'Score', 'Precautions', 'Status'],
    stats: [{ label: 'Patients Assessed', val: '22', col: 'text-blue-400' }, { label: 'High Fall Risk', val: '4', col: 'text-red-400' }, { label: 'Bed Alarms Active', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const scores = ['45 (High)', '10 (Low)', '50 (High)', '0 (Low)', '25 (Medium)'];
      const statuses = ['Active', 'Standard', 'Active', 'Standard', 'Monitor'];
      return { evalid: 'FAL-' + (5001+i), patientname: names[i], scaleused: 'Morse', score: scores[i], precautions: 'Bed Rails Up', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/monitoring/pressure-ulcer', title: 'Pressure Ulcer Risk', desc: 'Skin assessments and Braden Scale for pressure ulcers.',
    cols: ['Eval ID', 'Patient Name', 'Braden Score', 'Skin Integrity', 'Intervention', 'Status'],
    stats: [{ label: 'High Risk Patients', val: '3', col: 'text-red-400' }, { label: 'Turning Schedule Active', val: '5', col: 'text-amber-400' }, { label: 'Intact Skin', val: '18', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const scores = ['12 (High)', '18 (Low)', '16 (Low)', '10 (Sev Risk)', '19 (No Risk)'];
      const statuses = ['Active', 'Normal', 'Normal', 'Critical', 'Normal'];
      return { evalid: 'PUC-' + (6001+i), patientname: names[i], bradenscore: scores[i], skinintegrity: 'Intact', intervention: 'Q2H Turns', status: statuses[i] };
    })`
  },

  // MEDICATION
  {
    path: 'nurse/medication/schedule', title: 'Medication Schedule', desc: 'Upcoming medication rounds and timings.',
    cols: ['Task ID', 'Time Due', 'Patient Name', 'Medication', 'Route', 'Status'],
    stats: [{ label: 'Meds Due Next Hour', val: '12', col: 'text-amber-400' }, { label: 'Administered Today', val: '84', col: 'text-emerald-400' }, { label: 'Overdue', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const meds = ['Amoxicillin', 'Paracetamol', 'IV Fluids', 'Insulin', 'Aspirin'];
      const statuses = ['Due', 'Administered', 'Due', 'Due', 'Administered'];
      return { taskid: 'MED-' + (7001+i), timedue: '14:00', patientname: names[i], medication: meds[i], route: 'Oral', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/medication/mar', title: 'MAR Sheet', desc: 'Medication Administration Record for detailed logging.',
    cols: ['MAR ID', 'Patient Name', 'Drug Name', 'Dose/Freq', 'Last Given', 'Status'],
    stats: [{ label: 'Active MARs', val: '24', col: 'text-blue-400' }, { label: 'PRN Meds Given', val: '4', col: 'text-amber-400' }, { label: 'Signatures Pending', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const statuses = ['Active', 'Active', 'Discontinued', 'Active', 'Sign Pending'];
      return { marid: 'MAR-' + (8001+i), patientname: names[i], drugname: 'Lisinopril', dosefreq: '10mg OD', lastgiven: '08:00 AM', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/medication/iv-fluids', title: 'IV Fluids Tracking', desc: 'Manage IV drips, flow rates, and volume infused.',
    cols: ['IV ID', 'Patient Name', 'Fluid Type', 'Rate (ml/hr)', 'Vol Infused', 'Status'],
    stats: [{ label: 'Active Drips', val: '8', col: 'text-blue-400' }, { label: 'Completing Soon', val: '2', col: 'text-amber-400' }, { label: 'Completed', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const statuses = ['Running', 'Completed', 'Running', 'Paused', 'Running'];
      return { ivid: 'IV-' + (9001+i), patientname: names[i], fluidtype: 'Normal Saline 0.9%', ratemlhr: '100', volinfused: '450/1000', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/medication/injections', title: 'Injection Log', desc: 'Track IM, SC, and specialized injections.',
    cols: ['Log ID', 'Patient Name', 'Injection Name', 'Site', 'Administered By', 'Status'],
    stats: [{ label: 'Injections Today', val: '32', col: 'text-blue-400' }, { label: 'Insulin', val: '12', col: 'text-amber-400' }, { label: 'Vaccines', val: '5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const statuses = ['Given', 'Given', 'Scheduled', 'Given', 'Given'];
      return { logid: 'INJ-' + (10001+i), patientname: names[i], injectionname: 'Insulin Aspart', site: 'Abdomen', administeredby: 'Nurse Joy', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/medication/blood', title: 'Blood Transfusions', desc: 'Specialized log for monitoring blood product transfusions.',
    cols: ['Transfusion ID', 'Patient Name', 'Product/Group', 'Start Time', 'Vitals Checked', 'Status'],
    stats: [{ label: 'Active Transfusions', val: '2', col: 'text-blue-400' }, { label: 'Reactions', val: '0', col: 'text-emerald-400' }, { label: 'Completed', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const statuses = ['Running', 'Completed', 'Awaiting Blood', 'Running', 'Completed'];
      return { transfusionid: 'BLD-' + (20001+i), patientname: names[i], productgroup: 'PRBC / O+', starttime: '12:00 PM', vitalschecked: 'Q15M', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/medication/history', title: 'Medication History', desc: 'Comprehensive record of all administered medications.',
    cols: ['Log ID', 'Patient Name', 'Medication', 'Dose Given', 'Time', 'Status'],
    stats: [{ label: 'Logs Today', val: '450', col: 'text-blue-400' }, { label: 'Dispense Errors', val: '0', col: 'text-emerald-400' }, { label: 'PRN Total', val: '24', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const statuses = ['Administered', 'Administered', 'Administered', 'Administered', 'Administered'];
      return { logid: 'MHX-' + (30001+i), patientname: names[i], medication: 'Paracetamol', dosegiven: '500mg', time: '08:00 AM', status: statuses[i] };
    })`
  },
  {
    path: 'nurse/medication/missed', title: 'Missed Medications', desc: 'Log and review medications missed or refused by patients.',
    cols: ['Log ID', 'Patient Name', 'Medication', 'Scheduled Time', 'Reason', 'Status'],
    stats: [{ label: 'Missed Today', val: '3', col: 'text-red-400' }, { label: 'Refused by Patient', val: '2', col: 'text-amber-400' }, { label: 'Doctor Notified', val: '3', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const reasons = ['Patient Refused', 'NPO Status', 'Patient Sleeping', 'Stock Unavailable', 'Patient Refused'];
      const statuses = ['Notified', 'Notified', 'Rescheduled', 'Pending Stock', 'Notified'];
      return { logid: 'MSD-' + (40001+i), patientname: names[i], medication: 'Vitamins', scheduledtime: '09:00 AM', reason: reasons[i], status: statuses[i] };
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
        const isGood = val === 'Completed' || val === 'Acknowledged' || val === 'Stable' || val === 'Allocated' || val === 'Cleared' || val === 'Normal' || val === 'Balanced' || val === 'Controlled' || val === '15 (Normal)' || val === 'Standard' || val === 'Administered' || val === 'Given' || val === 'Notified' || val === 'Recovered' || val === 'Signed' || val === 'Active';
        const isWarning = val === 'Pending Ack' || val === 'Observation' || val === 'Pending Transfer' || val === 'Awaiting Assessment' || val === 'Pending Meds' || val === 'Elevated' || val === 'Monitor closely' || val === 'Fluid Retention' || val === 'Intervening' || val === '12 (Mild)' || val === 'Monitor' || val === 'Monitor' || val === 'Due' || val === 'Sign Pending' || val === 'Running' || val === 'Awaiting Blood' || val === 'Pending Stock' || val === 'Rescheduled' || val === 'Scheduled';
        const isNeutral = val === 'Upcoming' || val === 'Off Duty' || val === 'Vacant' || val === 'Discharging' || val === 'In Transit' || val === 'Paused' || val === 'Discontinued' || val === 'In Progress';
        
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
