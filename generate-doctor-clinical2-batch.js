const fs = require('fs');
const path = require('path');

const config = [
  // CONSULTATION
  {
    path: 'doctor/consultation/differential', title: 'Differential Diagnosis', desc: 'Manage and rule out potential diagnoses for complex cases.',
    cols: ['Case ID', 'Patient Name', 'Presenting Symptoms', 'Differential Dx', 'Confidence', 'Status'],
    stats: [{ label: 'Active Cases', val: '12', col: 'text-blue-400' }, { label: 'Resolved Today', val: '4', col: 'text-emerald-400' }, { label: 'High Complexity', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Lex Luthor', 'Joker', 'Riddler', 'Penguin', 'Two-Face'];
      const symps = ['Severe Chest Pain', 'Chronic Migraine', 'Fever, Joint Pain', 'Abdominal Pain', 'Shortness of Breath'];
      const diffs = ['MI vs Angina vs GERD', 'Migraine vs Cluster', 'Dengue vs Malaria', 'Appendicitis vs UTI', 'Asthma vs COPD'];
      const confs = ['Low', 'Medium', 'High', 'Medium', 'Low'];
      const statuses = ['Investigating', 'Investigating', 'Confirmed', 'Investigating', 'Ruled Out'];
      return { caseid: 'DDX-' + (1001+i), patientname: names[i], presentingsymptoms: symps[i], differentialdx: diffs[i], confidence: confs[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/consultation/templates', title: 'Consultation Templates', desc: 'Pre-defined templates for quick SOAP/Clinical note entry.',
    cols: ['Template ID', 'Template Name', 'Category', 'Created By', 'Usage Count', 'Status'],
    stats: [{ label: 'Total Templates', val: '45', col: 'text-blue-400' }, { label: 'Most Used', val: 'General OPD', col: 'text-emerald-400' }, { label: 'My Templates', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const tmpls = ['General OPD Initial', 'Post-Op Follow Up', 'Pediatric Fever', 'Hypertension Review', 'Telemed Basic'];
      const cats = ['General', 'Surgical', 'Pediatrics', 'Cardiology', 'Telemedicine'];
      const counts = ['1,240', '450', '320', '850', '210'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Archived'];
      return { templateid: 'TPL-' + (2001+i), templatename: tmpls[i], category: cats[i], createdby: 'Dr. Jenkins', usagecount: counts[i], status: statuses[i] };
    })`
  },

  // VITALS
  {
    path: 'doctor/vitals/patient', title: 'Patient Vitals', desc: 'Record and track routine patient vital signs.',
    cols: ['Record ID', 'Patient Name', 'BP (mmHg)', 'Heart Rate', 'Temp (F)', 'Status'],
    stats: [{ label: 'Vitals Logged Today', val: '84', col: 'text-blue-400' }, { label: 'Abnormal Vitals', val: '6', col: 'text-red-400' }, { label: 'Pending Checks', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const bps = ['120/80', '110/70', '145/95', '115/75', '160/100'];
      const hrs = ['72 bpm', '65 bpm', '98 bpm', '70 bpm', '110 bpm'];
      const temps = ['98.6', '98.4', '99.2', '98.5', '101.4'];
      const statuses = ['Normal', 'Normal', 'Elevated', 'Normal', 'Critical'];
      return { recordid: 'VIT-' + (3001+i), patientname: names[i], bpmmhg: bps[i], heartrate: hrs[i], tempf: temps[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/vitals/assessment', title: 'Nursing Assessments', desc: 'Detailed physical and systemic assessments by nursing staff.',
    cols: ['Assessment ID', 'Patient Name', 'Assessed By', 'Primary System', 'Findings', 'Status'],
    stats: [{ label: 'Assessments Today', val: '45', col: 'text-blue-400' }, { label: 'Awaiting Doctor Review', val: '8', col: 'text-amber-400' }, { label: 'Critical Findings', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const systems = ['Respiratory', 'Cardiovascular', 'Neurological', 'Gastrointestinal', 'Musculoskeletal'];
      const findings = ['Clear bilaterally', 'Regular Rhythm', 'A&O x3', 'Mild tenderness', 'Normal ROM'];
      const statuses = ['Reviewed', 'Pending Review', 'Reviewed', 'Pending Review', 'Reviewed'];
      return { assessmentid: 'ASM-' + (4001+i), patientname: names[i], assessedby: 'Nurse Joy', primarysystem: systems[i], findings: findings[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/vitals/pain', title: 'Pain Assessments', desc: 'Pain scale ratings and management tracking.',
    cols: ['Record ID', 'Patient Name', 'Pain Scale (0-10)', 'Location', 'Intervention', 'Status'],
    stats: [{ label: 'High Pain (>7)', val: '4', col: 'text-red-400' }, { label: 'Moderate (4-6)', val: '12', col: 'text-amber-400' }, { label: 'Mild/None', val: '68', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const scales = ['2/10', '8/10', '5/10', '0/10', '9/10'];
      const locs = ['Left Arm', 'Lower Back', 'Chest', 'N/A', 'Head'];
      const inters = ['Ice Pack', 'IV Analgesic', 'Oral Meds', 'None', 'IV Analgesic'];
      const statuses = ['Controlled', 'Intervening', 'Monitoring', 'Controlled', 'Critical'];
      return { recordid: 'PAN-' + (5001+i), patientname: names[i], painscale010: scales[i], location: locs[i], intervention: inters[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/vitals/risk', title: 'Risk Assessments', desc: 'Fall risk, pressure ulcer, and DVT risk evaluations.',
    cols: ['Eval ID', 'Patient Name', 'Risk Type', 'Score', 'Precautions Taken', 'Status'],
    stats: [{ label: 'High Fall Risk', val: '6', col: 'text-red-400' }, { label: 'High DVT Risk', val: '2', col: 'text-red-400' }, { label: 'Standard Care', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const types = ['Fall Risk (Morse)', 'Ulcer (Braden)', 'DVT Risk', 'Fall Risk (Morse)', 'Ulcer (Braden)'];
      const scores = ['45 (High)', '18 (Low)', 'High', '10 (Low)', '12 (High)'];
      const precs = ['Bed Alarm', 'Routine Turn', 'Compression Socks', 'Standard', 'Air Mattress'];
      const statuses = ['Active', 'Active', 'Active', 'Standard Care', 'Active'];
      return { evalid: 'RSK-' + (6001+i), patientname: names[i], risktype: types[i], score: scores[i], precautionstaken: precs[i], status: statuses[i] };
    })`
  },

  // DIAGNOSIS
  {
    path: 'doctor/diagnosis/entry', title: 'Diagnosis Entry', desc: 'Input and finalize diagnoses for current encounters.',
    cols: ['Encounter ID', 'Patient Name', 'Primary Dx', 'Secondary Dx', 'Entered By', 'Status'],
    stats: [{ label: 'Diagnoses Entered', val: '45', col: 'text-blue-400' }, { label: 'Pending Coding', val: '12', col: 'text-amber-400' }, { label: 'Finalized', val: '33', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson', 'Maggie Simpson'];
      const pris = ['Acute Bronchitis', 'Migraine', 'Fractured Radius', 'Myopia', 'Gastroenteritis'];
      const secs = ['None', 'Anxiety', 'None', 'None', 'Mild Dehydration'];
      const statuses = ['Finalized', 'Draft', 'Finalized', 'Finalized', 'Draft'];
      return { encounterid: 'ENC-' + (7001+i), patientname: names[i], primarydx: pris[i], secondarydx: secs[i], enteredby: 'Dr. House', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/diagnosis/icd', title: 'ICD-10 Dictionary', desc: 'Search and reference ICD-10 diagnosis codes.',
    cols: ['ICD-10 Code', 'Description', 'Category', 'Billable', 'Last Updated', 'Status'],
    stats: [{ label: 'Total Codes', val: '72,184', col: 'text-blue-400' }, { label: 'Frequently Used', val: '150', col: 'text-emerald-400' }, { label: 'Recent Updates', val: '14', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const codes = ['J01.90', 'I10', 'E11.9', 'M54.5', 'R51'];
      const descs = ['Acute sinusitis, unspecified', 'Essential (primary) hypertension', 'Type 2 diabetes mellitus', 'Low back pain', 'Headache'];
      const cats = ['Respiratory', 'Circulatory', 'Endocrine', 'Musculoskeletal', 'Symptoms/Signs'];
      const bills = ['Yes', 'Yes', 'Yes', 'Yes', 'Yes'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
      return { icd10code: codes[i], description: descs[i], category: cats[i], billable: bills[i], lastupdated: '01 Jan 2026', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/diagnosis/chronic', title: 'Chronic Conditions', desc: 'Track long-term and chronic conditions for regular patients.',
    cols: ['Record ID', 'Patient Name', 'Condition', 'Diagnosed On', 'Severity', 'Status'],
    stats: [{ label: 'Patients w/ Chronic', val: '450', col: 'text-blue-400' }, { label: 'High Severity', val: '84', col: 'text-red-400' }, { label: 'Stable', val: '312', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Griffin', 'Lois Griffin', 'Meg Griffin', 'Chris Griffin', 'Stewie Griffin'];
      const conds = ['Type 2 Diabetes', 'Hypothyroidism', 'Asthma', 'Obesity', 'None'];
      const dates = ['12 May 2018', '04 Aug 2020', '15 Jan 2015', '10 Nov 2021', 'N/A'];
      const sevs = ['Moderate', 'Mild', 'Severe', 'Moderate', 'N/A'];
      const statuses = ['Monitoring', 'Stable', 'Critical', 'Monitoring', 'N/A'];
      return { recordid: 'CHR-' + (8001+i), patientname: names[i], condition: conds[i], diagnosedon: dates[i], severity: sevs[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/diagnosis/history', title: 'Patient Medical History', desc: "Complete historical view of a patient's past diagnoses.",
    cols: ['History ID', 'Patient Name', 'Past Diagnosis', 'Resolution Date', 'Treated By', 'Status'],
    stats: [{ label: 'History Records', val: '12,450', col: 'text-blue-400' }, { label: 'Updated Today', val: '24', col: 'text-emerald-400' }, { label: 'Flagged Info', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const dxs = ['Fractured Rib', 'Appendicitis', 'Concussion', 'Ankle Sprain', 'Food Poisoning'];
      const dates = ['12 Jun 2024', '15 Aug 2020', '10 Jan 2025', '01 Mar 2026', '14 Feb 2026'];
      const docs = ['Dr. Wayne', 'Dr. Smith', 'Dr. Jenkins', 'Dr. Sloan', 'Dr. Grey'];
      const statuses = ['Resolved', 'Resolved', 'Resolved', 'Resolved', 'Resolved'];
      return { historyid: 'MHX-' + (9001+i), patientname: names[i], pastdiagnosis: dxs[i], resolutiondate: dates[i], treatedby: docs[i], status: statuses[i] };
    })`
  },

  // PRESCRIPTION
  {
    path: 'doctor/prescription/new', title: 'New Prescription', desc: 'Create and issue a new medication prescription.',
    cols: ['Rx ID', 'Patient Name', 'Medications Count', 'Duration', 'Pharmacy Route', 'Status'],
    stats: [{ label: 'Rx Issued Today', val: '142', col: 'text-blue-400' }, { label: 'e-Rx Sent', val: '130', col: 'text-emerald-400' }, { label: 'Printed', val: '12', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const counts = ['2 Meds', '1 Med', '3 Meds', '4 Meds', '1 Med'];
      const durs = ['7 Days', '30 Days', '5 Days', '14 Days', 'As Needed'];
      const routes = ['In-house Pharmacy', 'External', 'In-house Pharmacy', 'External', 'In-house Pharmacy'];
      const statuses = ['Issued', 'Draft', 'Issued', 'Issued', 'Issued'];
      return { rxid: 'RX-' + (1001+i), patientname: names[i], medicationscount: counts[i], duration: durs[i], pharmacyroute: routes[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/prescription/history', title: 'Prescription History', desc: 'Log of all past prescriptions issued to patients.',
    cols: ['Rx ID', 'Patient Name', 'Date Issued', 'Primary Med', 'Dispensed', 'Status'],
    stats: [{ label: 'Total Rx Logged', val: '45,120', col: 'text-blue-400' }, { label: 'Dispensed', val: '98%', col: 'text-emerald-400' }, { label: 'Expired', val: '2%', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const dates = ['12 Jun 2026', '10 Jun 2026', '01 Jun 2026', '15 May 2026', '10 May 2026'];
      const meds = ['Amoxicillin', 'Lisinopril', 'Paracetamol', 'Metformin', 'Ibuprofen'];
      const disps = ['Yes', 'Yes', 'Yes', 'No', 'Yes'];
      const statuses = ['Dispensed', 'Dispensed', 'Dispensed', 'Expired', 'Dispensed'];
      return { rxid: 'RXH-' + (2001+i), patientname: names[i], dateissued: dates[i], primarymed: meds[i], dispensed: disps[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/prescription/repeat', title: 'Repeat Prescriptions', desc: 'Manage refill and repeat requests for chronic medications.',
    cols: ['Request ID', 'Patient Name', 'Medication', 'Requested On', 'Refills Left', 'Status'],
    stats: [{ label: 'Pending Requests', val: '14', col: 'text-amber-400' }, { label: 'Approved Today', val: '45', col: 'text-emerald-400' }, { label: 'Requires Consult', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const meds = ['Amlodipine 5mg', 'Atorvastatin 20mg', 'Levothyroxine 50mcg', 'Metformin 500mg', 'Salbutamol Inhaler'];
      const reqs = ['Today', 'Yesterday', 'Today', 'Today', '2 Days Ago'];
      const lefts = ['2', '0', '3', '1', '0'];
      const statuses = ['Pending Approval', 'Requires Consult', 'Approved', 'Approved', 'Requires Consult'];
      return { requestid: 'REF-' + (3001+i), patientname: names[i], medication: meds[i], requestedon: reqs[i], refillsleft: lefts[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/prescription/e-prescription', title: 'e-Prescription Portal', desc: 'Direct electronic routing to partnered pharmacies.',
    cols: ['Transmission ID', 'Patient Name', 'Destination Pharmacy', 'Sent Time', 'Ack Status', 'Status'],
    stats: [{ label: 'e-Rx Sent Today', val: '112', col: 'text-blue-400' }, { label: 'Successful', val: '110', col: 'text-emerald-400' }, { label: 'Failed/Retry', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const pharms = ['CVS Pharmacy #12', 'Walgreens #45', 'In-house Pharmacy', 'RiteAid #02', 'CVS Pharmacy #12'];
      const times = ['09:15 AM', '10:00 AM', '10:30 AM', '11:45 AM', '01:20 PM'];
      const acks = ['ACK_RCVD', 'ACK_RCVD', 'PENDING', 'ERR_500', 'ACK_RCVD'];
      const statuses = ['Delivered', 'Delivered', 'Transmitting', 'Failed', 'Delivered'];
      return { transmissionid: 'ERX-' + (4001+i), patientname: names[i], destinationpharmacy: pharms[i], senttime: times[i], ackstatus: acks[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/prescription/templates', title: 'Rx Templates', desc: 'Quick prescription templates for common ailments.',
    cols: ['Template ID', 'Condition', 'Medications', 'Created By', 'Usage Count', 'Status'],
    stats: [{ label: 'Total Templates', val: '24', col: 'text-blue-400' }, { label: 'Most Used', val: 'Viral Fever', col: 'text-emerald-400' }, { label: 'My Templates', val: '8', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const conds = ['Viral Fever', 'Acute Gastroenteritis', 'Migraine (Acute)', 'UTI (Uncomplicated)', 'Allergic Rhinitis'];
      const meds = ['Paracetamol + ORS', 'Ciprofloxacin + ORS', 'Sumatriptan 50mg', 'Nitrofurantoin 100mg', 'Cetirizine 10mg'];
      const counts = ['1,450', '850', '320', '410', '950'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
      return { templateid: 'RXT-' + (5001+i), condition: conds[i], medications: meds[i], createdby: 'Dr. Jenkins', usagecount: counts[i], status: statuses[i] };
    })`
  },

  // ORDERS
  {
    path: 'doctor/orders/laboratory', title: 'Laboratory Orders', desc: 'Order blood work, panels, and pathology tests.',
    cols: ['Order ID', 'Patient Name', 'Test Name', 'Priority', 'Sample Status', 'Status'],
    stats: [{ label: 'Orders Today', val: '142', col: 'text-blue-400' }, { label: 'Results Ready', val: '45', col: 'text-emerald-400' }, { label: 'Stat/Urgent', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const tests = ['Complete Blood Count (CBC)', 'Lipid Profile', 'Liver Function (LFT)', 'HbA1c', 'Thyroid Panel'];
      const pris = ['Routine', 'Routine', 'Urgent', 'Routine', 'Routine'];
      const samples = ['Collected', 'Pending', 'Collected', 'Collected', 'Pending'];
      const statuses = ['In Process', 'Pending Collection', 'Results Ready', 'In Process', 'Pending Collection'];
      return { orderid: 'LAB-' + (1001+i), patientname: names[i], testname: tests[i], priority: pris[i], samplestatus: samples[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/orders/radiology', title: 'Radiology Orders', desc: 'Order X-Rays, MRIs, CT scans, and ultrasounds.',
    cols: ['Order ID', 'Patient Name', 'Scan Type', 'Body Part', 'Priority', 'Status'],
    stats: [{ label: 'Orders Today', val: '45', col: 'text-blue-400' }, { label: 'Scans Completed', val: '24', col: 'text-emerald-400' }, { label: 'Pending Read', val: '8', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const scans = ['X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'X-Ray'];
      const parts = ['Chest', 'Brain', 'Abdomen', 'Pelvis', 'Left Ankle'];
      const pris = ['Routine', 'Urgent', 'Routine', 'Routine', 'Routine'];
      const statuses = ['Scheduled', 'Pending Read', 'Completed', 'Scheduled', 'Completed'];
      return { orderid: 'RAD-' + (2001+i), patientname: names[i], scantype: scans[i], bodypart: parts[i], priority: pris[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/orders/procedure', title: 'Procedure Orders', desc: 'Order minor clinical procedures or interventions.',
    cols: ['Order ID', 'Patient Name', 'Procedure Name', 'Requested Date', 'Assigned To', 'Status'],
    stats: [{ label: 'Pending Procedures', val: '12', col: 'text-amber-400' }, { label: 'Completed Today', val: '34', col: 'text-emerald-400' }, { label: 'Cancelled', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Lex Luthor', 'Joker', 'Riddler', 'Penguin', 'Two-Face'];
      const procs = ['ECG/EKG', 'Nebulization', 'Wound Debridement', 'Catheterization', 'Spirometry'];
      const dates = ['Today', 'Today', 'Tomorrow', 'Today', '15 Jul'];
      const assigns = ['Nursing Station 1', 'RT Dept', 'Surgical OPD', 'Nursing Station 2', 'Pulmonology'];
      const statuses = ['Pending', 'Completed', 'Scheduled', 'In Progress', 'Scheduled'];
      return { orderid: 'PRC-' + (3001+i), patientname: names[i], procedurename: procs[i], requesteddate: dates[i], assignedto: assigns[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/orders/surgery', title: 'Surgical Orders', desc: 'Request and schedule major surgeries and OR time.',
    cols: ['Order ID', 'Patient Name', 'Surgery Name', 'Surgeon', 'Requested Date', 'Status'],
    stats: [{ label: 'Pending Scheduling', val: '4', col: 'text-amber-400' }, { label: 'Scheduled', val: '12', col: 'text-blue-400' }, { label: 'In OR Now', val: '2', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson', 'Maggie Simpson'];
      const surgs = ['Appendectomy', 'Cholecystectomy', 'ACL Reconstruction', 'Tonsillectomy', 'Hernia Repair'];
      const docs = ['Dr. Shepherd', 'Dr. Grey', 'Dr. Sloan', 'Dr. Yang', 'Dr. Shepherd'];
      const dates = ['14 Jul', '15 Jul', '20 Jul', '12 Jul', '18 Jul'];
      const statuses = ['Scheduled', 'Pending Schedule', 'Scheduled', 'In OR', 'Scheduled'];
      return { orderid: 'SUR-' + (4001+i), patientname: names[i], surgeryname: surgs[i], surgeon: docs[i], requesteddate: dates[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/orders/blood', title: 'Blood Bank Orders', desc: 'Request blood products and transfusions from the blood bank.',
    cols: ['Order ID', 'Patient Name', 'Blood Group', 'Product Type', 'Units Requested', 'Status'],
    stats: [{ label: 'Active Requests', val: '8', col: 'text-blue-400' }, { label: 'Units Reserved', val: '14', col: 'text-emerald-400' }, { label: 'Critical Shortage', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const grps = ['O+', 'A-', 'B+', 'AB+', 'O-'];
      const types = ['Packed RBC', 'Whole Blood', 'Platelets', 'Fresh Frozen Plasma', 'Packed RBC'];
      const units = ['2 Units', '1 Unit', '4 Units', '2 Units', '3 Units'];
      const statuses = ['Reserved', 'Pending Crossmatch', 'Issued', 'Reserved', 'Urgent Request'];
      return { orderid: 'BLD-' + (5001+i), patientname: names[i], bloodgroup: grps[i], producttype: types[i], unitsrequested: units[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/orders/physiotherapy', title: 'Physiotherapy Orders', desc: 'Refer patients for physical therapy and rehabilitation.',
    cols: ['Referral ID', 'Patient Name', 'Therapy Type', 'Sessions Ordered', 'Physiotherapist', 'Status'],
    stats: [{ label: 'Referrals Today', val: '12', col: 'text-blue-400' }, { label: 'Active Sessions', val: '45', col: 'text-emerald-400' }, { label: 'Completed Tx', val: '8', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const types = ['Post-Op Rehab', 'Sports Injury', 'Stroke Rehab', 'Back Pain Mgmt', 'Post-Op Rehab'];
      const sess = ['10 Sessions', '5 Sessions', '20 Sessions', '8 Sessions', '12 Sessions'];
      const phys = ['Dr. Pym', 'Dr. Pym', 'Dr. Foster', 'Dr. Pym', 'Dr. Foster'];
      const statuses = ['Scheduled', 'In Progress', 'In Progress', 'Completed', 'Pending Auth'];
      return { referralid: 'PT-' + (6001+i), patientname: names[i], therapytype: types[i], sessionsordered: sess[i], physiotherapist: phys[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/orders/diet', title: 'Dietary Orders', desc: 'Order specific nutritional plans and diets for inpatients.',
    cols: ['Order ID', 'Patient Name', 'Diet Type', 'Allergies', 'Assigned Dietitian', 'Status'],
    stats: [{ label: 'Active Diet Plans', val: '124', col: 'text-blue-400' }, { label: 'Special Diets', val: '45', col: 'text-amber-400' }, { label: 'NPO Orders', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const diets = ['Regular', 'Diabetic (Low Sugar)', 'NPO (Fasting)', 'Cardiac (Low Sodium)', 'Liquid Diet'];
      const alls = ['None', 'Peanuts', 'None', 'None', 'Dairy'];
      const diers = ['Sarah D.', 'Sarah D.', 'N/A', 'John M.', 'John M.'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
      return { orderid: 'DIT-' + (7001+i), patientname: names[i], diettype: diets[i], allergies: alls[i], assigneddietitian: diers[i], status: statuses[i] };
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
        const isGood = val === 'Confirmed' || val === 'Active' || val === 'Normal' || val === 'Reviewed' || val === 'Controlled' || val === 'Standard Care' || val === 'Finalized' || val === 'Resolved' || val === 'Issued' || val === 'Dispensed' || val === 'Approved' || val === 'Delivered' || val === 'Results Ready' || val === 'Completed' || val === 'Reserved';
        const isWarning = val === 'Investigating' || val === 'Elevated' || val === 'Critical' || val === 'Pending Review' || val === 'Intervening' || val === 'Draft' || val === 'Provisional' || val === 'Requires Consult' || val === 'Failed' || val === 'Pending Collection' || val === 'Pending Read' || val === 'Pending' || val === 'Pending Schedule' || val === 'Urgent Request' || val === 'Pending Auth' || val === 'In Progress';
        const isNeutral = val === 'Ruled Out' || val === 'Archived' || val === 'Monitoring' || val === 'N/A' || val === 'Expired' || val === 'Transmitting' || val === 'In Process' || val === 'Scheduled' || val === 'Pending Crossmatch';
        
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
        <div className="my-3 flex justify-between items-center my-3">
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
