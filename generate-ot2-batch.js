const fs = require('fs');
const path = require('path');

const config = [
  // Doctor Orders
  {
    path: 'ot/orders/pending', title: 'Pending Orders', desc: 'New orders placed by intensivists and surgeons that require nursing action.',
    cols: ['Order ID', 'Bed/OT', 'Patient Name', 'Order Type', 'Doctor', 'Status'],
    stats: [{ label: 'Pending Orders', val: '12', col: 'text-amber-400' }, { label: 'STAT Orders', val: '3', col: 'text-red-400' }, { label: 'Completed Today', val: '85', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Medication', 'Lab Test', 'Imaging', 'Procedure', 'Diet'];
      const statuses = ['Pending', 'Processing', 'Pending', 'STAT Pending', 'Processing'];
      return { orderid: 'ORD-' + (1001+i), bedot: 'ICU ' + (1+i), patientname: 'Patient ' + (i+1), ordertype: types[i], doctor: 'Dr. House', status: statuses[i] };
    })`
  },
  {
    path: 'ot/orders/laboratory', title: 'Laboratory Orders', desc: 'Tracking ABGs, cultures, and routine bloods sent from OT and ICU.',
    cols: ['Order ID', 'Patient Name', 'Test Name', 'Sample Sent Time', 'Turnaround Target', 'Status'],
    stats: [{ label: 'Active Lab Orders', val: '24', col: 'text-blue-400' }, { label: 'Results Ready', val: '18', col: 'text-emerald-400' }, { label: 'Delayed', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const tests = ['ABG Panel', 'Blood Culture', 'CBC', 'Electrolytes', 'Coagulation Profile'];
      const statuses = ['Sent to Lab', 'Processing', 'Results Ready', 'Sent to Lab', 'Results Ready'];
      return { orderid: 'LAB-' + (2001+i), patientname: 'Patient ' + (i+1), testname: tests[i], samplesenttime: '10:00 AM', turnaroundtarget: tests[i].includes('ABG')?'15 mins':'1 Hour', status: statuses[i] };
    })`
  },
  {
    path: 'ot/orders/radiology', title: 'Radiology Orders', desc: 'Portable X-Rays and Ultrasound orders for critical patients.',
    cols: ['Order ID', 'Bed ID', 'Patient Name', 'Modality', 'Radiologist Notes', 'Status'],
    stats: [{ label: 'Pending Scans', val: '5', col: 'text-amber-400' }, { label: 'Completed', val: '10', col: 'text-emerald-400' }, { label: 'Portable Requested', val: '4', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const modalities = ['Portable X-Ray Chest', 'Portable USG Abdomen', 'Echo Bedside', 'Portable X-Ray Chest', 'Doppler'];
      const statuses = ['Scheduled', 'In Progress', 'Reported', 'Scheduled', 'Reported'];
      return { orderid: 'RAD-' + (3001+i), bedid: 'ICU-' + (1+i), patientname: 'Patient ' + (i+1), modality: modalities[i], radiologistnotes: statuses[i]==='Reported'?'Pleural Effusion seen':'-', status: statuses[i] };
    })`
  },
  {
    path: 'ot/orders/blood', title: 'Blood Bank Orders', desc: 'Requisitions for PRBC, FFP, and Platelets from the OT/ICU.',
    cols: ['Req ID', 'Patient Name', 'Blood Group', 'Component', 'Units Requested', 'Status'],
    stats: [{ label: 'Pending Requests', val: '3', col: 'text-amber-400' }, { label: 'Reserved/Cross-matched', val: '5', col: 'text-blue-400' }, { label: 'Issued Today', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const components = ['PRBC', 'FFP', 'Platelets', 'PRBC', 'Cryoprecipitate'];
      const statuses = ['Pending Blood Bank', 'Reserved', 'Issued', 'Pending Blood Bank', 'Issued'];
      return { reqid: 'BLD-' + (4001+i), patientname: 'Patient ' + (i+1), bloodgroup: 'O+', component: components[i], unitsrequested: (1+i).toString(), status: statuses[i] };
    })`
  },
  {
    path: 'ot/orders/procedure', title: 'Bedside Procedure Orders', desc: 'Orders for central line insertion, intubation, tracheostomy, etc.',
    cols: ['Procedure ID', 'Patient Name', 'Procedure Name', 'Requested By', 'Consent Status', 'Status'],
    stats: [{ label: 'Pending Procedures', val: '4', col: 'text-amber-400' }, { label: 'Completed Today', val: '6', col: 'text-emerald-400' }, { label: 'Delayed', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const procedures = ['CVC Insertion', 'Endotracheal Intubation', 'Chest Tube', 'Lumbar Puncture', 'Dialysis Catheter'];
      const statuses = ['Scheduled', 'Completed', 'In Progress', 'Scheduled', 'Completed'];
      return { procedureid: 'PRC-' + (5001+i), patientname: 'Patient ' + (i+1), procedurename: procedures[i], requestedby: 'Dr. ICU', consentstatus: 'Signed', status: statuses[i] };
    })`
  },

  // Blood & Transfusion
  {
    path: 'ot/blood/requests', title: 'Blood Requests Tracking', desc: 'Monitor the status of blood requests made to the blood bank.',
    cols: ['Req ID', 'Patient Name', 'Component', 'Urgency', 'Time Requested', 'Status'],
    stats: [{ label: 'Active Requests', val: '8', col: 'text-blue-400' }, { label: 'STAT/Emergency', val: '2', col: 'text-red-400' }, { label: 'Fulfilled', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const urgencies = ['Routine', 'STAT', 'Routine', 'Urgent', 'Routine'];
      const statuses = ['Processing', 'Processing', 'Reserved', 'Issued', 'Processing'];
      return { reqid: 'REQ-' + (1001+i), patientname: 'Patient ' + (i+1), component: 'PRBC', urgency: urgencies[i], timerequested: '10:00 AM', status: statuses[i] };
    })`
  },
  {
    path: 'ot/blood/cross-match', title: 'Cross Match Status', desc: 'Live view of cross-matching progress for reserved units.',
    cols: ['Patient ID', 'Patient Name', 'Blood Group', 'Sample Status', 'Cross-match Result', 'Status'],
    stats: [{ label: 'Samples in Lab', val: '4', col: 'text-amber-400' }, { label: 'Matches Found', val: '6', col: 'text-emerald-400' }, { label: 'Antibody Screen Pos', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In Progress', 'Compatible', 'Compatible', 'In Progress', 'Compatible'];
      return { patientid: 'PAT-' + (2001+i), patientname: 'Patient ' + (i+1), bloodgroup: 'A+', samplestatus: 'Received', crossmatchresult: statuses[i]==='Compatible'?'Match Found':'Pending', status: statuses[i] };
    })`
  },
  {
    path: 'ot/blood/issue', title: 'Blood Issue Log', desc: 'Units received in the OT/ICU fridge and ready for transfusion.',
    cols: ['Unit ID', 'Patient Name', 'Component', 'Received By', 'Expiry Date', 'Status'],
    stats: [{ label: 'Units in Fridge', val: '10', col: 'text-blue-400' }, { label: 'Used Today', val: '12', col: 'text-emerald-400' }, { label: 'Returned to BB', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In Fridge', 'Transfusing', 'Transfused', 'In Fridge', 'Transfused'];
      return { unitid: 'UNT-' + (3001+i), patientname: 'Patient ' + (i+1), component: 'PRBC', receivedby: 'Nurse Lisa', expirydate: '31 Jul 2026', status: statuses[i] };
    })`
  },
  {
    path: 'ot/blood/transfusion', title: 'Transfusion Monitoring', desc: 'Logging of transfusion vitals, double checks, and adverse reactions.',
    cols: ['Transfusion ID', 'Patient Name', 'Unit ID', 'Start Time', '15-min Check', 'Status'],
    stats: [{ label: 'Active Transfusions', val: '3', col: 'text-amber-400' }, { label: 'Completed', val: '8', col: 'text-emerald-400' }, { label: 'Reactions', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In Progress', 'Completed', 'In Progress', 'Completed', 'Completed'];
      return { transfusionid: 'TRN-' + (4001+i), patientname: 'Patient ' + (i+1), unitid: 'UNT-' + (3001+i), starttime: '11:00 AM', '15mincheck': 'Stable (BP 120/80)', status: statuses[i] };
    })`
  },

  // CSSD
  {
    path: 'ot/cssd/sterilization', title: 'Instrument Sterilization', desc: 'Central Sterile Services Department (CSSD) processing and decontamination.',
    cols: ['Batch ID', 'Instrument Set', 'Received From', 'Cleaning Method', 'Technician', 'Status'],
    stats: [{ label: 'Sets in Process', val: '14', col: 'text-amber-400' }, { label: 'Sterilized Today', val: '45', col: 'text-emerald-400' }, { label: 'Rejected/Damaged', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Washing', 'Ultrasonic Cleaning', 'Packing', 'Washing', 'Packing'];
      return { batchid: 'CSSD-' + (1001+i), instrumentset: 'General Surgery Tray', receivedfrom: 'OT ' + (1+i), cleaningmethod: 'Automated Washer', technician: 'Tech Mark', status: statuses[i] };
    })`
  },
  {
    path: 'ot/cssd/inventory', title: 'Instrument Inventory', desc: 'Master inventory of surgical instruments and their condition.',
    cols: ['Instrument ID', 'Name', 'Category', 'Quantity', 'Condition', 'Status'],
    stats: [{ label: 'Total Instruments', val: '2,500', col: 'text-blue-400' }, { label: 'Sent for Repair', val: '15', col: 'text-amber-400' }, { label: 'Condemned', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Available', 'In Use', 'In CSSD', 'Repair', 'Available'];
      return { instrumentid: 'INS-' + (2001+i), name: 'Scalpel Handle #3', category: 'General', quantity: '50', condition: statuses[i]==='Repair'?'Blunt/Damaged':'Good', status: statuses[i] };
    })`
  },
  {
    path: 'ot/cssd/packs', title: 'Sterile Packs Management', desc: 'Assembly and tracking of sterile trays and linen packs.',
    cols: ['Pack ID', 'Pack Type', 'Assembly Date', 'Expiry Date', 'Location', 'Status'],
    stats: [{ label: 'Sterile Packs Ready', val: '120', col: 'text-emerald-400' }, { label: 'Expiring Soon', val: '10', col: 'text-amber-400' }, { label: 'Expired', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['C-Section Tray', 'Orthopedic Tray', 'Linen Pack (Large)', 'Basic Dressing Pack', 'Craniotomy Set'];
      const statuses = ['Available (Sterile)', 'Available (Sterile)', 'Expiring Soon', 'In Use', 'Available (Sterile)'];
      return { packid: 'PCK-' + (3001+i), packtype: types[i], assemblydate: '01 Jul 2026', expirydate: '30 Jul 2026', location: 'CSSD Store', status: statuses[i] };
    })`
  },
  {
    path: 'ot/cssd/autoclave', title: 'Autoclave Cycle Log', desc: 'Validation logs (Bowie-Dick, Biological indicators) for sterilizers.',
    cols: ['Cycle ID', 'Machine', 'Load Type', 'Temp/Pressure', 'Validation Test', 'Status'],
    stats: [{ label: 'Cycles Today', val: '8', col: 'text-blue-400' }, { label: 'Passed', val: '8', col: 'text-emerald-400' }, { label: 'Failed/Aborted', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed (Passed)', 'Running', 'Completed (Passed)', 'Completed (Passed)', 'Running'];
      return { cycleid: 'CYC-' + (4001+i), machine: 'Autoclave ' + (i%2+1), loadtype: 'Mixed Instruments', temppressure: '134°C / 2.1 bar', validationtest: 'Bowie-Dick Pass', status: statuses[i] };
    })`
  },
  {
    path: 'ot/cssd/tracking', title: 'OT Instrument Tracking', desc: 'Barcode/RFID tracking of instruments from CSSD to OT and back.',
    cols: ['Set ID', 'Set Name', 'Checked Out To', 'Time Out', 'Time In', 'Status'],
    stats: [{ label: 'Sets in OT', val: '12', col: 'text-amber-400' }, { label: 'Returned to CSSD', val: '18', col: 'text-blue-400' }, { label: 'Missing Items', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In OT', 'Returned', 'In OT', 'Returned', 'Returned'];
      return { setid: 'SET-' + (5001+i), setname: 'CABG Tray', checkedoutto: 'OT ' + (1+i), timeout: '08:00 AM', timein: statuses[i]==='Returned'?'14:00 PM':'-', status: statuses[i] };
    })`
  },

  // Transfers
  {
    path: 'ot/transfers/icu-admission', title: 'ICU Admissions', desc: 'Incoming patients from ER, Wards, or other hospitals to ICU.',
    cols: ['Admission ID', 'Patient Name', 'Source', 'Diagnosis', 'Assigned Bed', 'Status'],
    stats: [{ label: 'Admissions Today', val: '5', col: 'text-blue-400' }, { label: 'Pending Bed Allocation', val: '1', col: 'text-amber-400' }, { label: 'Expected Arrivals', val: '2', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const sources = ['ER', 'Surgical Ward', 'External Hospital', 'ER', 'OT'];
      const statuses = ['Admitted', 'Pending Bed', 'Expected', 'Admitted', 'Admitted'];
      return { admissionid: 'ADM-' + (1001+i), patientname: 'Patient ' + (i+1), source: sources[i], diagnosis: 'Sepsis', assignedbed: statuses[i]==='Pending Bed'?'-':'ICU-' + (i+1), status: statuses[i] };
    })`
  },
  {
    path: 'ot/transfers/icu-transfer', title: 'ICU to ICU Transfers', desc: 'Moving patients between critical care units (e.g., SICU to Step-down).',
    cols: ['Transfer ID', 'Patient Name', 'From Unit', 'To Unit', 'Reason', 'Status'],
    stats: [{ label: 'Transfers Today', val: '3', col: 'text-blue-400' }, { label: 'Completed', val: '2', col: 'text-emerald-400' }, { label: 'In Progress', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'In Progress', 'Scheduled', 'Completed', 'Completed'];
      return { transferid: 'TRF-' + (2001+i), patientname: 'Patient ' + (i+1), fromunit: 'SICU', tounit: 'HDU', reason: 'Improving (Step-down)', status: statuses[i] };
    })`
  },
  {
    path: 'ot/transfers/ot-transfer', title: 'OT to ICU Transfers', desc: 'Direct handovers from Operation Theatre to Critical Care.',
    cols: ['Transfer ID', 'Patient Name', 'Surgery', 'Anesthetist', 'Receiving ICU', 'Status'],
    stats: [{ label: 'OT to ICU Today', val: '4', col: 'text-blue-400' }, { label: 'Pending Handovers', val: '1', col: 'text-amber-400' }, { label: 'Delayed', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Transferred', 'En Route', 'Pending Handover', 'Transferred', 'Transferred'];
      return { transferid: 'OTI-' + (3001+i), patientname: 'Patient ' + (i+1), surgery: 'CABG', anesthetist: 'Dr. Sleep', receivingicu: 'CTVS ICU', status: statuses[i] };
    })`
  },
  {
    path: 'ot/transfers/ward-transfer', title: 'ICU to Ward Transfers', desc: 'Discharging stabilized patients from ICU to general wards.',
    cols: ['Transfer ID', 'Patient Name', 'From ICU', 'To Ward', 'Ward Nurse Notified', 'Status'],
    stats: [{ label: 'Step-downs Today', val: '6', col: 'text-blue-400' }, { label: 'Pending Ward Beds', val: '2', col: 'text-amber-400' }, { label: 'Completed', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'Waiting for Bed', 'In Progress', 'Completed', 'Completed'];
      return { transferid: 'I2W-' + (4001+i), patientname: 'Patient ' + (i+1), fromicu: 'MICU', toward: 'Medical Ward B', wardnursenotified: 'Yes', status: statuses[i] };
    })`
  },
  {
    path: 'ot/transfers/bed-transfer', title: 'Internal Bed Transfers', desc: 'Reallocating beds within the same critical care unit.',
    cols: ['Transfer ID', 'Patient Name', 'Unit', 'From Bed', 'To Bed', 'Status'],
    stats: [{ label: 'Bed Swaps Today', val: '2', col: 'text-blue-400' }, { label: 'Completed', val: '2', col: 'text-emerald-400' }, { label: 'Pending Cleaning', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'Completed', 'Pending Cleaning', 'Scheduled', 'Completed'];
      return { transferid: 'IBT-' + (5001+i), patientname: 'Patient ' + (i+1), unit: 'ICU', frombed: 'Bed ' + (1+i), tobed: 'Bed ' + (5+i), status: statuses[i] };
    })`
  },

  // Discharge
  {
    path: 'ot/discharge/icu', title: 'ICU Discharge', desc: 'Medical clearance and final summaries for leaving the intensive care unit.',
    cols: ['Discharge ID', 'Patient Name', 'LOS (Days)', 'Discharging Doctor', 'Destination', 'Status'],
    stats: [{ label: 'Discharges Today', val: '5', col: 'text-blue-400' }, { label: 'Pending Summaries', val: '2', col: 'text-amber-400' }, { label: 'Mortality (Month)', val: '2', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const destinations = ['General Ward', 'Home', 'Rehab Facility', 'General Ward', 'Expired'];
      const statuses = ['Discharged', 'Summary Pending', 'Discharged', 'Discharged', 'Closed'];
      return { dischargeid: 'ICD-' + (1001+i), patientname: 'Patient ' + (i+1), losdays: (4+i).toString(), dischargingdoctor: 'Dr. House', destination: destinations[i], status: statuses[i] };
    })`
  },
  {
    path: 'ot/discharge/ot', title: 'Day Care Surgery Discharge', desc: 'Discharge summaries for ambulatory/day care surgical patients.',
    cols: ['Discharge ID', 'Patient Name', 'Procedure', 'Recovery Score', 'Companion Verified', 'Status'],
    stats: [{ label: 'Day Care Surgeries', val: '12', col: 'text-blue-400' }, { label: 'Discharged', val: '10', col: 'text-emerald-400' }, { label: 'Admitted (Complication)', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Discharged', 'Pending Vitals', 'Discharged', 'Discharged', 'Pending Companion'];
      return { dischargeid: 'OTD-' + (2001+i), patientname: 'Patient ' + (i+1), procedure: 'Cataract Surgery', recoveryscore: '9/10', companionverified: 'Yes (Spouse)', status: statuses[i] };
    })`
  },
  {
    path: 'ot/discharge/critical', title: 'Critical Care Summary', desc: 'Comprehensive medical summary detailing ICU stay, interventions, and outcomes.',
    cols: ['Summary ID', 'Patient Name', 'Admission Date', 'Discharge Date', 'Author', 'Status'],
    stats: [{ label: 'Summaries Generated', val: '45', col: 'text-blue-400' }, { label: 'Pending Sign-off', val: '4', col: 'text-amber-400' }, { label: 'Sent to Records', val: '41', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Signed & Sent', 'Draft', 'Signed & Sent', 'Pending Sign-off', 'Signed & Sent'];
      return { summaryid: 'CCS-' + (3001+i), patientname: 'Patient ' + (i+1), admissiondate: '01 Jul 2026', dischargedate: '05 Jul 2026', author: 'Dr. Resident', status: statuses[i] };
    })`
  },
  {
    path: 'ot/discharge/instructions', title: 'Follow-up Instructions', desc: 'Post-op wound care, medications, and follow-up appointment schedules.',
    cols: ['Patient Name', 'Procedure/ICU', 'Medications Prescribed', 'Follow-up Date', 'Dietary Advice', 'Status'],
    stats: [{ label: 'Instructions Issued', val: '15', col: 'text-blue-400' }, { label: 'Appointments Booked', val: '15', col: 'text-emerald-400' }, { label: 'Translations Used', val: '2', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { patientname: 'Patient ' + (i+1), procedureicu: 'Appendectomy', medicationsprescribed: 'Antibiotics, Analgesics', followupdate: '15 Jul 2026', dietaryadvice: 'Soft Diet', status: 'Issued' };
    })`
  },

  // Reports
  {
    path: 'ot/reports/utilization', title: 'OT Utilization Report', desc: 'Metrics on theater usage, turnaround times, and delays.',
    cols: ['OT Room', 'Total Surgeries', 'Utilization %', 'Avg Turnaround Time', 'Delay Hours', 'Status'],
    stats: [{ label: 'Overall Utilization', val: '78%', col: 'text-blue-400' }, { label: 'Avg Turnaround', val: '28 mins', col: 'text-emerald-400' }, { label: 'Total Delay (Month)', val: '14 hrs', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { otroom: 'OT ' + (1+i), totalsurgeries: (20+i*5).toString(), utilization: (70+i*5) + '%', avgturnaroundtime: (25+i) + ' mins', delayhours: (1+i).toString() + ' hrs', status: 'Generated' };
    })`
  },
  {
    path: 'ot/reports/surgery', title: 'Surgery Statistics', desc: 'Breakdown of surgeries by specialty, surgeon, and complexity.',
    cols: ['Specialty', 'Total Surgeries', 'Major Surgeries', 'Minor Surgeries', 'Complication Rate', 'Status'],
    stats: [{ label: 'Total Surgeries (MTD)', val: '345', col: 'text-blue-400' }, { label: 'Major Cases', val: '120', col: 'text-amber-400' }, { label: 'Overall Success Rate', val: '99.1%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const specialties = ['General Surgery', 'Orthopedics', 'Cardiothoracic', 'Neurosurgery', 'Gynecology'];
      return { specialty: specialties[i], totalsurgeries: (50+i*10).toString(), majorsurgeries: (20+i*5).toString(), minorsurgeries: (30+i*5).toString(), complicationrate: '0.' + i + '%', status: 'Generated' };
    })`
  },
  {
    path: 'ot/reports/occupancy', title: 'ICU Occupancy Report', desc: 'Bed occupancy rates, average length of stay (ALOS), and admission trends.',
    cols: ['Unit', 'Total Beds', 'Occupancy Rate', 'ALOS (Days)', 'Admissions', 'Status'],
    stats: [{ label: 'Overall ICU Occupancy', val: '85%', col: 'text-amber-400' }, { label: 'Avg LOS', val: '4.2 Days', col: 'text-blue-400' }, { label: 'Bed Turnovers', val: '145', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const units = ['General ICU', 'SICU', 'MICU', 'CCU', 'NICU'];
      return { unit: units[i], totalbeds: (10+i*2).toString(), occupancyrate: (80+i*2) + '%', alosdays: (3+i*0.5).toFixed(1), admissions: (30+i*5).toString(), status: 'Generated' };
    })`
  },
  {
    path: 'ot/reports/ventilator', title: 'Ventilator Usage Report', desc: 'Statistics on mechanical ventilation days and VAP (Ventilator-Associated Pneumonia) rates.',
    cols: ['Month', 'Ventilator Days', 'Total Patients', 'Avg Vent Days/Patient', 'VAP Cases', 'Status'],
    stats: [{ label: 'Total Vent Days (YTD)', val: '850', col: 'text-blue-400' }, { label: 'VAP Rate (per 1000 days)', val: '1.2', col: 'text-emerald-400' }, { label: 'Successful Weans', val: '92%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      return { month: months[i] + ' 2026', ventilatordays: (120+i*10).toString(), totalpatients: (40+i*2).toString(), avgventdayspatient: '3.' + i, vapcases: (i===0)?'1':'0', status: 'Generated' };
    })`
  },
  {
    path: 'ot/reports/mortality', title: 'Mortality & Morbidity (M&M)', desc: 'Confidential reporting for M&M conferences and clinical governance.',
    cols: ['Report ID', 'Case Type', 'Date of Event', 'Primary Cause', 'Reviewed By', 'Status'],
    stats: [{ label: 'Mortality Rate (ICU)', val: '4.5%', col: 'text-blue-400' }, { label: 'M&M Meetings Held', val: '2 (Month)', col: 'text-gray-400' }, { label: 'Action Items Open', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Surgical Complication', 'ICU Mortality', 'ICU Mortality', 'Surgical Complication', 'Unexpected Arrest'];
      const statuses = ['Reviewed', 'Pending Review', 'Reviewed', 'Reviewed', 'Under Investigation'];
      return { reportid: 'MM-' + (1001+i), casetype: types[i], dateofevent: '0' + (1+i) + ' Jul 2026', primarycause: 'Septic Shock', reviewedby: 'M&M Committee', status: statuses[i] };
    })`
  },
  {
    path: 'ot/reports/infection', title: 'Infection Control Report', desc: 'Tracking Surgical Site Infections (SSI), CLABSI, and CAUTI in critical care.',
    cols: ['Month', 'SSI Rate', 'CLABSI Rate', 'CAUTI Rate', 'Hand Hygiene Compliance', 'Status'],
    stats: [{ label: 'SSI Rate', val: '0.8%', col: 'text-emerald-400' }, { label: 'CLABSI (per 1k days)', val: '0.5', col: 'text-emerald-400' }, { label: 'Hand Hygiene', val: '95%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      return { month: months[i] + ' 2026', ssirate: '0.' + (5+i) + '%', clabsirate: '0.' + i, cautirate: '1.' + i, handhygienecompliance: (92+i) + '%', status: 'Generated' };
    })`
  },
  {
    path: 'ot/reports/critical', title: 'Critical Care Metrics (APACHE/SOFA)', desc: 'Analysis of patient severity scores and predicted vs actual outcomes.',
    cols: ['Month', 'Avg APACHE II', 'Avg SOFA', 'Predicted Mortality', 'Actual Mortality', 'Status'],
    stats: [{ label: 'Avg APACHE II', val: '18', col: 'text-amber-400' }, { label: 'SMR (Standardized Mortality Ratio)', val: '0.85', col: 'text-emerald-400' }, { label: 'Data Completeness', val: '99%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      return { month: months[i] + ' 2026', avgapacheii: (16+i).toString(), avgsofa: (6+i*0.5).toString(), predictedmortality: (15+i) + '%', actualmortality: (12+i) + '%', status: 'Generated' };
    })`
  },

  // Analytics
  {
    path: 'ot/analytics/performance', title: 'OT Performance Analytics', desc: 'Dashboards showing on-time starts, cancellations, and turnaround efficiency.',
    cols: ['Metric', 'Current Month', 'Previous Month', 'Trend', 'Target', 'Status'],
    stats: [{ label: 'On-Time First Case', val: '82%', col: 'text-amber-400' }, { label: 'Cancellation Rate', val: '3%', col: 'text-emerald-400' }, { label: 'Avg Turnaround', val: '25m', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['On-Time Starts', 'Cancellation Rate', 'Avg Turnaround Time', 'Overtime Hours', 'Case Duration Accuracy'];
      const currents = ['82%', '3%', '25 mins', '45 hrs', '88%'];
      const targets = ['> 90%', '< 5%', '< 30 mins', '< 40 hrs', '> 85%'];
      const statuses = ['Lagging', 'Met Target', 'Met Target', 'Lagging', 'Met Target'];
      return { metric: metrics[i], currentmonth: currents[i], previousmonth: 'N/A', trend: 'Improving', target: targets[i], status: statuses[i] };
    })`
  },
  {
    path: 'ot/analytics/surgeon', title: 'Surgeon Performance', desc: 'Analytics on individual surgeon volume, average duration, and outcomes.',
    cols: ['Surgeon Name', 'Total Cases', 'Avg Duration vs Expected', 'Complications', 'SSI Rate', 'Status'],
    stats: [{ label: 'Top Volume Surgeon', val: 'Dr. Grey', col: 'text-blue-400' }, { label: 'Avg Duration Variance', val: '+5 mins', col: 'text-amber-400' }, { label: 'Overall SSI Rate', val: '0.8%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { surgeonname: 'Dr. Surgeon ' + (i+1), totalcases: (40-i*5).toString(), avgdurationvsexpected: (i%2===0?'+5%':'-2%'), complications: i.toString(), ssirate: '0.' + i + '%', status: 'Active' };
    })`
  },
  {
    path: 'ot/analytics/duration', title: 'Surgery Duration Analysis', desc: 'Comparison of scheduled vs actual surgery times to optimize booking.',
    cols: ['Procedure Type', 'Samples', 'Avg Scheduled Time', 'Avg Actual Time', 'Variance', 'Status'],
    stats: [{ label: 'Avg Underestimation', val: '12 mins', col: 'text-amber-400' }, { label: 'Highly Variable Proc', val: 'Laparotomy', col: 'text-red-400' }, { label: 'Scheduling Accuracy', val: '85%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const procedures = ['Appendectomy', 'Cholecystectomy', 'CABG', 'Hernia Repair', 'Craniotomy'];
      const variances = ['+10 mins', '+5 mins', '+30 mins', '-5 mins', '+45 mins'];
      const statuses = ['Acceptable', 'Acceptable', 'High Variance', 'Excellent', 'High Variance'];
      return { proceduretype: procedures[i], samples: '150', avgscheduledtime: '2 hrs', avgactualtime: '2 hrs 10 mins', variance: variances[i], status: statuses[i] };
    })`
  },
  {
    path: 'ot/analytics/kpis', title: 'ICU KPIs', desc: 'Key Performance Indicators for Intensive Care Units.',
    cols: ['KPI Name', 'Current Value', 'Target', 'Variance', 'Benchmark', 'Status'],
    stats: [{ label: 'Ventilator Days/Patient', val: '3.2', col: 'text-blue-400' }, { label: 'Readmission Rate (48h)', val: '2.1%', col: 'text-emerald-400' }, { label: 'Central Line Days', val: '4.5', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const kpis = ['Mortality Rate', 'Readmission < 48hrs', 'ALOS', 'VAP Rate', 'CLABSI Rate'];
      const currents = ['4.5%', '2.1%', '4.2 Days', '1.2', '0.5'];
      const targets = ['< 5%', '< 3%', '< 4 Days', '< 1.5', '< 1.0'];
      const statuses = ['Met Target', 'Met Target', 'Lagging', 'Met Target', 'Met Target'];
      return { kpiname: kpis[i], currentvalue: currents[i], target: targets[i], variance: 'N/A', benchmark: 'National Avg', status: statuses[i] };
    })`
  },
  {
    path: 'ot/analytics/bed-utilization', title: 'Bed Utilization Analytics', desc: 'Detailed heatmaps and trends of ICU bed occupancy and bottlenecks.',
    cols: ['Unit', 'Peak Occupancy Time', 'Turnaway Rate', 'Avg Vacant Time', 'Throughput', 'Status'],
    stats: [{ label: 'Peak Hour', val: '14:00 - 18:00', col: 'text-blue-400' }, { label: 'Turnaway (No Bed)', val: '1/month', col: 'text-emerald-400' }, { label: 'Bed Cleaning TAT', val: '45 mins', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const units = ['SICU', 'MICU', 'CCU', 'NICU', 'PICU'];
      return { unit: units[i], peakoccupancytime: '16:00', turnawayrate: '0.' + i + '%', avgvacanttime: '2.' + i + ' hrs', throughput: (50+i*5) + ' / month', status: 'Optimal' };
    })`
  },
  {
    path: 'ot/analytics/equipment-utilization', title: 'Equipment Utilization', desc: 'Tracking usage rates for ventilators, ECMO, IABP, and dialysis machines.',
    cols: ['Equipment Category', 'Total Assets', 'In Use', 'Utilization %', 'Maintenance Down', 'Status'],
    stats: [{ label: 'Ventilator Utilization', val: '65%', col: 'text-emerald-400' }, { label: 'ECMO Active', val: '1', col: 'text-blue-400' }, { label: 'Equipment Shortage Alerts', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const categories = ['Ventilators', 'Syringe Pumps', 'CRRT Machines', 'IABP', 'ECMO'];
      const totals = [20, 150, 5, 3, 2];
      const inuse = [13, 120, 2, 1, 1];
      const statuses = ['Adequate Stock', 'Adequate Stock', 'Adequate Stock', 'Adequate Stock', 'Low Stock'];
      return { equipmentcategory: categories[i], totalassets: totals[i].toString(), inuse: inuse[i].toString(), utilization: Math.round((inuse[i]/totals[i])*100) + '%', maintenancedown: i===0?'1':'0', status: statuses[i] };
    })`
  },

  // Settings
  {
    path: 'ot/settings/surgery-types', title: 'Surgery Types & Codes', desc: 'Master list of surgical procedures, CPT codes, and standard durations.',
    cols: ['Surgery Code', 'Description', 'Specialty', 'Standard Duration', 'Base Price', 'Status'],
    stats: [{ label: 'Total Procedures', val: '850', col: 'text-blue-400' }, { label: 'Recently Added', val: '12', col: 'text-emerald-400' }, { label: 'Inactive Codes', val: '5', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { surgerycode: 'CPT-' + (10001+i), description: 'Laparoscopic Cholecystectomy', specialty: 'General Surgery', standardduration: '90 mins', baseprice: '$' + (1500+i*100), status: 'Active' };
    })`
  },
  {
    path: 'ot/settings/rooms', title: 'OT Rooms Configuration', desc: 'Configure theater capabilities, positive pressure, and specialized equipment.',
    cols: ['Room Name', 'Type', 'Positive Pressure', 'Specialized For', 'Max Capacity', 'Status'],
    stats: [{ label: 'Total OTs', val: '8', col: 'text-blue-400' }, { label: 'Modular OTs', val: '4', col: 'text-emerald-400' }, { label: 'Cath Lab', val: '1', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Modular OT', 'Standard OT', 'Cardiac OT', 'Neuro OT', 'Ortho OT'];
      const statuses = ['Active', 'Active', 'Active', 'Maintenance', 'Active'];
      return { roomname: 'OT ' + (1+i), type: types[i], positivepressure: 'Yes', specializedfor: types[i].split(' ')[0], maxcapacity: '1 Patient', status: statuses[i] };
    })`
  },
  {
    path: 'ot/settings/templates', title: 'Procedure Templates', desc: 'Pre-defined templates for standard surgical notes and anesthesia plans.',
    cols: ['Template ID', 'Template Name', 'Specialty', 'Author', 'Last Updated', 'Status'],
    stats: [{ label: 'Active Templates', val: '45', col: 'text-blue-400' }, { label: 'Most Used', val: 'General Anesthesia', col: 'text-emerald-400' }, { label: 'Drafts', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Active', 'Active', 'Draft', 'Active', 'Active'];
      return { templateid: 'TPL-' + (101+i), templatename: 'Standard Appendectomy Note', specialty: 'General Surgery', author: 'Dr. Chief', lastupdated: '01 Jan 2026', status: statuses[i] };
    })`
  },
  {
    path: 'ot/settings/preferences', title: 'OT Preferences', desc: 'Global settings for booking lead times, overtime rules, and alerts.',
    cols: ['Setting Name', 'Category', 'Current Value', 'Last Modified', 'Modified By', 'Status'],
    stats: [{ label: 'Auto-Cancellation', val: 'Enabled', col: 'text-amber-400' }, { label: 'SMS Alerts', val: 'Enabled', col: 'text-emerald-400' }, { label: 'Booking Lead Time', val: '24 hrs', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const settings = ['Min Booking Lead Time', 'Auto-Cancel Unconfirmed', 'Surgeon Delay SMS Alert', 'Enable PAC Mandate', 'Overtime Approval Reqd'];
      const values = ['24 Hours', 'Yes', 'Yes', 'Yes', 'Yes'];
      return { settingname: settings[i], category: 'Workflow', currentvalue: values[i], lastmodified: '15 Jun 2026', modifiedby: 'System Admin', status: 'Active' };
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
        const isGood = val === 'Completed' || val === 'Results Ready' || val === 'Reported' || val === 'Issued' || val === 'Compatible' || val === 'Transfused' || val === 'Completed (Passed)' || val === 'Returned' || val === 'Admitted' || val === 'Transferred' || val === 'Discharged' || val === 'Signed & Sent' || val === 'Generated' || val === 'Met Target' || val === 'Acceptable' || val === 'Excellent' || val === 'Optimal' || val === 'Adequate Stock' || val === 'Active';
        const isWarning = val === 'Pending' || val === 'STAT Pending' || val === 'Processing' || val === 'Scheduled' || val === 'Pending Blood Bank' || val === 'Reserved' || val === 'In Progress' || val === 'Transfusing' || val === 'Washing' || val === 'Ultrasonic Cleaning' || val === 'Packing' || val === 'Repair' || val === 'Expiring Soon' || val === 'Running' || val === 'In OT' || val === 'Pending Bed' || val === 'Expected' || val === 'En Route' || val === 'Pending Handover' || val === 'Waiting for Bed' || val === 'Pending Cleaning' || val === 'Summary Pending' || val === 'Pending Vitals' || val === 'Pending Companion' || val === 'Pending Sign-off' || val === 'Lagging' || val === 'High Variance' || val === 'Low Stock' || val === 'Maintenance' || val === 'Draft';
        const isNeutral = val === 'Sent to Lab' || val === 'Received' || val === 'In Fridge' || val === 'Available' || val === 'In Use' || val === 'Available (Sterile)';
        const isDanger = val === 'Closed' || val === 'Under Investigation';
        
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
      <div className="flex justify-between items-center">
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

      <div className="bg-dark-secondary rounded-xl border border-gray-800 overflow-hidden">
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
