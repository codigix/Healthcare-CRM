const fs = require('fs');
const path = require('path');

const config = [
  // QUALITY CONTROL
  {
    path: 'diagnostics/qc/internal', title: 'Internal Quality Control (IQC)', desc: 'Daily calibration logs, Levy-Jennings charts, and rule violations.',
    cols: ['Control ID', 'Analyzer', 'Test Parameter', 'Target Value', 'Actual Value', 'Status'],
    stats: [{ label: 'IQC Runs Today', val: '24', col: 'text-blue-400' }, { label: 'Pass Rate', val: '95%', col: 'text-emerald-400' }, { label: 'Westgard Rule Violations', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const analyzers = ['Cobas 6000', 'Sysmex XN', 'Architect', 'Cobas 6000', 'VITEK'];
      const statuses = ['Pass', 'Pass', 'Warning (1:2s)', 'Fail (1:3s)', 'Pass'];
      return { controlid: 'IQC-' + (1001+i), analyzer: analyzers[i], testparameter: 'Glucose', targetvalue: '100 mg/dL', actualvalue: (98 + i).toString() + ' mg/dL', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/qc/external', title: 'External Quality Assurance (EQAS)', desc: 'Proficiency testing results from external accredited agencies.',
    cols: ['EQAS ID', 'Agency', 'Month', 'Parameters Tested', 'Score', 'Status'],
    stats: [{ label: 'EQAS Cycle', val: 'July 2026', col: 'text-blue-400' }, { label: 'Overall Score', val: '98%', col: 'text-emerald-400' }, { label: 'Outliers', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const agencies = ['CAP', 'RIQAS', 'EQAS Bio-Rad', 'NABL', 'CAP'];
      const statuses = ['Passed', 'Passed', 'Pending Results', 'Passed', 'Passed'];
      return { eqasid: 'EQS-' + (2001+i), agency: agencies[i], month: 'July 2026', parameterstested: 'Biochemistry Panel', score: statuses[i] === 'Passed' ? '100%' : '-', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/qc/calibration', title: 'Equipment Calibration', desc: 'Record of routine machine calibration to ensure accurate results.',
    cols: ['Machine ID', 'Machine Name', 'Last Calibrated', 'Next Due Date', 'Performed By', 'Status'],
    stats: [{ label: 'Calibrations Due', val: '2', col: 'text-amber-400' }, { label: 'Completed (Month)', val: '15', col: 'text-emerald-400' }, { label: 'Overdue', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const machines = ['Cobas 6000', 'Sysmex XN', 'Architect', 'Centrifuge', 'Microscope'];
      const statuses = ['Valid', 'Valid', 'Due Soon', 'Valid', 'Valid'];
      return { machineid: 'EQ-' + (3001+i), machinename: machines[i], lastcalibrated: '01 Jul 2026', nextduedate: '31 Jul 2026', performedby: 'Tech John', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/qc/maintenance', title: 'Daily Machine Maintenance', desc: 'Daily, weekly, and monthly preventive maintenance logs.',
    cols: ['Task ID', 'Machine Name', 'Maintenance Type', 'Checklist', 'Technician', 'Status'],
    stats: [{ label: 'Daily Tasks', val: '24', col: 'text-blue-400' }, { label: 'Completed', val: '20', col: 'text-emerald-400' }, { label: 'Pending', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Daily Wash', 'Weekly Probe Clean', 'Monthly Filter Change', 'Daily Wash', 'Daily Startup'];
      const statuses = ['Completed', 'Completed', 'Pending', 'Completed', 'Completed'];
      return { taskid: 'MNT-' + (4001+i), machinename: 'Analyzer ' + (i+1), maintenancetype: types[i], checklist: '5/5', technician: 'Tech Lisa', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/qc/reagent', title: 'Reagent Management', desc: 'Tracking lot numbers, expiry dates, and new reagent validation.',
    cols: ['Reagent ID', 'Name', 'Lot Number', 'Expiry Date', 'Validation', 'Status'],
    stats: [{ label: 'Active Lots', val: '45', col: 'text-blue-400' }, { label: 'Expiring Soon', val: '3', col: 'text-amber-400' }, { label: 'Low Stock', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Validated', 'Validated', 'Pending Validation', 'Validated', 'Expiring Soon'];
      return { reagentid: 'RGT-' + (5001+i), name: 'Glucose Reagent R1', lotnumber: 'LOT-90' + i, expirydate: '31 Dec 2026', validation: 'Passed', status: statuses[i] };
    })`
  },

  // EQUIPMENT MANAGEMENT
  {
    path: 'diagnostics/equipment/machines', title: 'Diagnostic Machines', desc: 'Master list of all laboratory and radiology equipment.',
    cols: ['Machine ID', 'Name', 'Department', 'Model', 'Serial No', 'Status'],
    stats: [{ label: 'Total Machines', val: '35', col: 'text-blue-400' }, { label: 'Active/Online', val: '33', col: 'text-emerald-400' }, { label: 'Down/Offline', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Biochemistry', 'Hematology', 'Radiology', 'Radiology', 'Pathology'];
      const statuses = ['Online', 'Online', 'Offline - Repair', 'Online', 'Online'];
      return { machineid: 'MAC-' + (1001+i), name: 'Machine ' + (i+1), department: depts[i], model: 'Model X' + i, serialno: 'SN-00' + i, status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/equipment/maintenance', title: 'Service & Maintenance', desc: 'Annual Maintenance Contracts (AMC) and service history.',
    cols: ['Contract ID', 'Machine Name', 'Vendor', 'AMC Expiry', 'Last Service', 'Status'],
    stats: [{ label: 'Active Contracts', val: '30', col: 'text-blue-400' }, { label: 'Renewals Due', val: '2', col: 'text-amber-400' }, { label: 'Open Service Tickets', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Active', 'Active', 'Expiring Soon', 'Active', 'Active'];
      return { contractid: 'AMC-' + (2001+i), machinename: 'Machine ' + (i+1), vendor: 'Siemens Healthineers', amcexpiry: '31 Dec 2026', lastservice: '15 Jun 2026', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/equipment/calibration', title: 'Calibration Certificates', desc: 'Digital repository of NABL/ISO calibration certificates.',
    cols: ['Cert ID', 'Machine Name', 'Calibrated By', 'Date of Issue', 'Valid Till', 'Status'],
    stats: [{ label: 'Total Certificates', val: '35', col: 'text-blue-400' }, { label: 'Valid', val: '33', col: 'text-emerald-400' }, { label: 'Expired', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Valid', 'Valid', 'Valid', 'Expired', 'Valid'];
      return { certid: 'CRT-' + (3001+i), machinename: 'Pipette Set ' + (i+1), calibratedby: 'National Metrology', dateofissue: '01 Jan 2026', validtill: '31 Dec 2026', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/equipment/downtime', title: 'Downtime Log', desc: 'Record of machine breakdowns, TAT impact, and repair resolution.',
    cols: ['Log ID', 'Machine Name', 'Issue Reported', 'Downtime Start', 'Resolution Time', 'Status'],
    stats: [{ label: 'Current Breakdown', val: '1', col: 'text-red-400' }, { label: 'Avg Repair Time', val: '4 hours', col: 'text-amber-400' }, { label: 'Uptime (YTD)', val: '99.5%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Resolved', 'Resolved', 'Under Repair', 'Resolved', 'Resolved'];
      return { logid: 'DWN-' + (4001+i), machinename: 'Machine ' + (i+1), issuereported: 'Probe Error', downtimestart: '10:00 AM', resolutiontime: statuses[i] === 'Resolved' ? '2 hours' : '-', status: statuses[i] };
    })`
  },

  // RESULT MANAGEMENT
  {
    path: 'diagnostics/results/pending', title: 'Pending Results', desc: 'List of authorized results waiting for final dispatch/printing.',
    cols: ['Report ID', 'Patient Name', 'Test Panel', 'Authorized By', 'Auth Time', 'Status'],
    stats: [{ label: 'Ready to Print', val: '45', col: 'text-blue-400' }, { label: 'Pending SMS/Email', val: '12', col: 'text-amber-400' }, { label: 'STAT Reports', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Dispatch', 'Pending Dispatch', 'Sent to Portal', 'Pending Dispatch', 'Sent to Portal'];
      return { reportid: 'RPT-' + (1001+i), patientname: 'Patient ' + (i+1), testpanel: 'CBC', authorizedby: 'Dr. Pathologist', authtime: '14:30', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/results/verified', title: 'Verified Results', desc: 'Intermediate queue of results verified by technicians but waiting for doctor sign-off.',
    cols: ['Result ID', 'Patient Name', 'Test', 'Verified By', 'Abnormal Flags', 'Status'],
    stats: [{ label: 'Pending Sign-off', val: '28', col: 'text-amber-400' }, { label: 'Critical Findings', val: '2', col: 'text-red-400' }, { label: 'Signed Today', val: '150', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Sign-off', 'Pending Sign-off', 'Pending Sign-off', 'Signed', 'Pending Sign-off'];
      return { resultid: 'RES-' + (2001+i), patientname: 'Patient ' + (i+1), test: 'LFT', verifiedby: 'Tech Jane', abnormalflags: i%2===0?'Yes':'No', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/results/released', title: 'Released Reports', desc: 'Archive of all final reports delivered to patients and doctors.',
    cols: ['Report ID', 'Patient Name', 'Release Date', 'Delivered Via', 'View Count', 'Status'],
    stats: [{ label: 'Released Today', val: '210', col: 'text-blue-400' }, { label: 'App/Portal Views', val: '145', col: 'text-emerald-400' }, { label: 'Physical Prints', val: '65', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const methods = ['Email/Portal', 'Print', 'WhatsApp', 'Email/Portal', 'Print'];
      const statuses = ['Delivered', 'Delivered', 'Delivered', 'Delivered', 'Delivered'];
      return { reportid: 'REL-' + (3001+i), patientname: 'Patient ' + (i+1), releasedate: 'Today', deliveredvia: methods[i], viewcount: (1+i).toString(), status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/results/amended', title: 'Amended Reports', desc: 'Audit trail of reports that were modified after initial release.',
    cols: ['Report ID', 'Patient Name', 'Original Release', 'Amended Date', 'Reason for Change', 'Status'],
    stats: [{ label: 'Amendments (Month)', val: '3', col: 'text-amber-400' }, { label: 'Recall Notices Sent', val: '3', col: 'text-blue-400' }, { label: 'Pending Approval', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Amended', 'Amended', 'Amended', 'Amended', 'Amended'];
      return { reportid: 'AMD-' + (4001+i), patientname: 'Patient ' + (i+1), originalrelease: '10 Jul 2026', amendeddate: '11 Jul 2026', reasonforchange: 'Typo in Reference Range', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/results/signature', title: 'Digital Signatures', desc: 'Manage digital signature tokens for pathologists and radiologists.',
    cols: ['Doctor Name', 'Department', 'Certificate ID', 'Valid Till', 'Status'],
    stats: [{ label: 'Active Tokens', val: '12', col: 'text-blue-400' }, { label: 'Expiring Soon', val: '1', col: 'text-amber-400' }, { label: 'Revoked', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Active', 'Active', 'Active', 'Expiring', 'Active'];
      return { doctorname: 'Dr. Name ' + (i+1), department: 'Pathology', certificateid: 'SIG-' + (5001+i), validtill: '31 Dec 2026', status: statuses[i] };
    })`
  },

  // PATIENT REPORTS
  {
    path: 'diagnostics/patient-reports/laboratory', title: 'Patient Lab Reports', desc: 'Search and download patient biochemistry, hematology, and micro reports.',
    cols: ['Patient ID', 'Patient Name', 'Report Date', 'Test Category', 'Downloads', 'Status'],
    stats: [{ label: 'Total Records', val: '14,500', col: 'text-blue-400' }, { label: 'Recent (30 Days)', val: '1,200', col: 'text-emerald-400' }, { label: 'Search Queries', val: '450', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { patientid: 'PID-' + (1001+i), patientname: 'Patient ' + (i+1), reportdate: '15 Jul 2026', testcategory: 'Hematology', downloads: '2', status: 'Available' };
    })`
  },
  {
    path: 'diagnostics/patient-reports/radiology', title: 'Patient Radiology Reports', desc: 'Search and download X-Ray, USG, CT, and MRI reports.',
    cols: ['Patient ID', 'Patient Name', 'Report Date', 'Modality', 'PACS Link', 'Status'],
    stats: [{ label: 'Total Records', val: '8,200', col: 'text-blue-400' }, { label: 'Recent (30 Days)', val: '450', col: 'text-emerald-400' }, { label: 'Images Attached', val: '95%', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const modalities = ['X-Ray', 'CT Scan', 'MRI', 'USG', 'X-Ray'];
      return { patientid: 'PID-' + (2001+i), patientname: 'Patient ' + (i+1), reportdate: '14 Jul 2026', modality: modalities[i], pacslink: 'View Image', status: 'Available' };
    })`
  },
  {
    path: 'diagnostics/patient-reports/cardiology', title: 'Patient Cardiology Reports', desc: 'Access ECG tracings, Echo reports, and TMT summaries.',
    cols: ['Patient ID', 'Patient Name', 'Report Date', 'Study Type', 'Cardiologist', 'Status'],
    stats: [{ label: 'Total Records', val: '3,400', col: 'text-blue-400' }, { label: 'Recent (30 Days)', val: '210', col: 'text-emerald-400' }, { label: 'Abnormal findings', val: '12%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const studies = ['ECG', '2D Echo', 'TMT', 'Holter', 'ECG'];
      return { patientid: 'PID-' + (3001+i), patientname: 'Patient ' + (i+1), reportdate: '13 Jul 2026', studytype: studies[i], cardiologist: 'Dr. Heart', status: 'Available' };
    })`
  },
  {
    path: 'diagnostics/patient-reports/blood-bank', title: 'Blood Bank Reports', desc: 'Cross-match reports, transfusion history, and donor certificates.',
    cols: ['Patient/Donor ID', 'Name', 'Report Type', 'Blood Group', 'Date', 'Status'],
    stats: [{ label: 'Total Records', val: '1,500', col: 'text-blue-400' }, { label: 'Cross-matches', val: '800', col: 'text-emerald-400' }, { label: 'Donor Certs', val: '700', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Cross-match', 'Donor Certificate', 'Transfusion Reaction', 'Cross-match', 'Donor Certificate'];
      return { patientdonorid: 'ID-' + (4001+i), name: 'Person ' + (i+1), reporttype: types[i], bloodgroup: 'O+', date: '12 Jul 2026', status: 'Available' };
    })`
  },
  {
    path: 'diagnostics/patient-reports/download', title: 'Bulk Download & Print', desc: 'Batch printing or downloading of reports for IPD discharges.',
    cols: ['Batch ID', 'Ward', 'Patient Name', 'Total Reports', 'Print Queue', 'Status'],
    stats: [{ label: 'Batches Today', val: '15', col: 'text-blue-400' }, { label: 'Printed Successfully', val: '12', col: 'text-emerald-400' }, { label: 'Failed/Error', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Printed', 'Printing', 'Pending', 'Printed', 'Printed'];
      return { batchid: 'BCH-' + (5001+i), ward: 'ICU', patientname: 'Patient ' + (i+1), totalreports: (3+i).toString(), printqueue: 'Queue 1', status: statuses[i] };
    })`
  },

  // COMMUNICATION
  {
    path: 'diagnostics/communication/doctor', title: 'Doctor Notifications', desc: 'Automated and manual alerts sent to doctors regarding critical results.',
    cols: ['Alert ID', 'Doctor Name', 'Patient Name', 'Test', 'Delivery Status', 'Status'],
    stats: [{ label: 'Alerts Sent Today', val: '45', col: 'text-blue-400' }, { label: 'Read Receipts', val: '40', col: 'text-emerald-400' }, { label: 'Unread', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Read', 'Delivered', 'Failed', 'Read', 'Read'];
      return { alertid: 'ALT-' + (1001+i), doctorname: 'Dr. Smith', patientname: 'Patient ' + (i+1), test: 'Troponin-I', deliverystatus: statuses[i], status: statuses[i] === 'Failed' ? 'Retry Pending' : 'Completed' };
    })`
  },
  {
    path: 'diagnostics/communication/patient', title: 'Patient Notifications', desc: 'SMS/Email updates to patients (e.g., "Report Ready for Download").',
    cols: ['Msg ID', 'Patient Name', 'Mobile/Email', 'Message Type', 'Time Sent', 'Status'],
    stats: [{ label: 'Messages Sent', val: '350', col: 'text-blue-400' }, { label: 'Delivered', val: '345', col: 'text-emerald-400' }, { label: 'Failed', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Delivered', 'Delivered', 'Failed', 'Delivered', 'Delivered'];
      return { msgid: 'MSG-' + (2001+i), patientname: 'Patient ' + (i+1), mobileemail: '+123456789' + i, messagetype: 'Report Ready', timesent: '10:00 AM', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/communication/email', title: 'Email Reports', desc: 'Log of diagnostic reports directly emailed to patients or corporate clients.',
    cols: ['Email ID', 'Recipient', 'Subject', 'Attachments', 'Send Time', 'Status'],
    stats: [{ label: 'Emails Sent', val: '120', col: 'text-blue-400' }, { label: 'Opened', val: '85', col: 'text-emerald-400' }, { label: 'Bounced', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Delivered', 'Opened', 'Bounced', 'Delivered', 'Opened'];
      return { emailid: 'EML-' + (3001+i), recipient: 'patient' + i + '@example.com', subject: 'Your Lab Report', attachments: '1 PDF', sendtime: '11:00 AM', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/communication/whatsapp', title: 'WhatsApp Reports', desc: 'Log of reports delivered securely via WhatsApp Business API.',
    cols: ['Message ID', 'Phone Number', 'Patient Name', 'Report Link', 'Read Status', 'Status'],
    stats: [{ label: 'WhatsApp Sent', val: '200', col: 'text-blue-400' }, { label: 'Read (Blue Tick)', val: '180', col: 'text-emerald-400' }, { label: 'Opt-outs', val: '1', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Read', 'Delivered', 'Sent', 'Read', 'Read'];
      return { messageid: 'WA-' + (4001+i), phonenumber: '+198765432' + i, patientname: 'Patient ' + (i+1), reportlink: 'https://link.to/report', readstatus: statuses[i], status: 'Completed' };
    })`
  },
  {
    path: 'diagnostics/communication/sms', title: 'SMS Notifications', desc: 'Short SMS alerts for appointment reminders and sample collection updates.',
    cols: ['SMS ID', 'Phone Number', 'Message Preview', 'Gateway', 'Delivery', 'Status'],
    stats: [{ label: 'SMS Credits', val: '45,000', col: 'text-blue-400' }, { label: 'Sent Today', val: '450', col: 'text-emerald-400' }, { label: 'DND Blocks', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Delivered', 'Delivered', 'DND Failed', 'Delivered', 'Delivered'];
      return { smsid: 'SMS-' + (5001+i), phonenumber: '+123123123' + i, messagepreview: 'Dear Patient, your sample...', gateway: 'Twilio', delivery: statuses[i], status: statuses[i] === 'DND Failed' ? 'Failed' : 'Completed' };
    })`
  },

  // ANALYTICS & REPORTS
  {
    path: 'diagnostics/analytics/volume', title: 'Test Volume Report', desc: 'Analytics on the number of tests performed by category, machine, and day.',
    cols: ['Report Date', 'Category', 'Total Tests', 'IPD vs OPD', 'Revenue Gen', 'Status'],
    stats: [{ label: 'Avg Daily Tests', val: '1,200', col: 'text-blue-400' }, { label: 'Highest Vol Day', val: 'Monday', col: 'text-emerald-400' }, { label: 'Growth (MoM)', val: '+5%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Biochemistry', 'Hematology', 'Radiology', 'Microbiology', 'Pathology'];
      return { reportdate: (10+i) + ' Jul 2026', category: cats[i], totaltests: (300+i*50).toString(), ipdvsopd: '60/40', revenuegen: '$' + (3000+i*500), status: 'Generated' };
    })`
  },
  {
    path: 'diagnostics/analytics/performance', title: 'Department Performance', desc: 'KPIs for each diagnostic sub-department (Lab, Radiology, Blood Bank).',
    cols: ['Department', 'TAT Compliance', 'Error Rate', 'Equipment Uptime', 'Score', 'Status'],
    stats: [{ label: 'Top Department', val: 'Biochemistry', col: 'text-blue-400' }, { label: 'Overall TAT Met', val: '92%', col: 'text-emerald-400' }, { label: 'Overall Uptime', val: '99%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Biochemistry', 'Hematology', 'Radiology (CT)', 'Blood Bank', 'Microbiology'];
      return { department: depts[i], tatcompliance: (90+i) + '%', errorrate: '0.' + i + '%', equipmentuptime: '99%', score: (9.0 + i*0.1).toFixed(1) + '/10', status: 'Active' };
    })`
  },
  {
    path: 'diagnostics/analytics/technician', title: 'Technician Performance', desc: 'Metrics on individual staff throughput, errors, and processing time.',
    cols: ['Tech ID', 'Name', 'Samples Processed', 'Avg Processing Time', 'Error Count', 'Status'],
    stats: [{ label: 'Total Staff', val: '45', col: 'text-blue-400' }, { label: 'Avg Samples/Tech', val: '120/day', col: 'text-emerald-400' }, { label: 'Zero Errors (Month)', val: '38 Staff', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Excellent', 'Good', 'Average', 'Excellent', 'Good'];
      return { techid: 'TCH-' + (101+i), name: 'Tech ' + (i+1), samplesprocessed: (500 + i*50).toString(), avgprocessingtime: '12 mins', errorcount: i.toString(), status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/analytics/critical', title: 'Critical Result Analytics', desc: 'Analysis of life-threatening results, reporting times, and clinical impact.',
    cols: ['Month', 'Total Criticals', 'Avg Reporting Time', 'Doctor Notified <30m', 'Missed SLAs', 'Status'],
    stats: [{ label: 'Total Criticals (YTD)', val: '340', col: 'text-red-400' }, { label: 'SLA Compliance', val: '98%', col: 'text-emerald-400' }, { label: 'Avg Time to Notify', val: '12 mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      return { month: months[i] + ' 2026', totalcriticals: (45+i*5).toString(), avgreportingtime: '1' + i + ' mins', doctornotified30m: '100%', missedslas: '0', status: 'Generated' };
    })`
  },
  {
    path: 'diagnostics/analytics/tat', title: 'TAT Report (Turn Around Time)', desc: 'Detailed analysis of time taken from sample collection to report release.',
    cols: ['Test Group', 'Target TAT', 'Actual Avg TAT', 'Breaches', 'Compliance %', 'Status'],
    stats: [{ label: 'Overall Compliance', val: '94%', col: 'text-emerald-400' }, { label: 'Avg TAT', val: '2.5 hrs', col: 'text-blue-400' }, { label: 'Breaches (Today)', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const groups = ['Routine Chemistry', 'Routine Hematology', 'STAT Chem', 'Histopathology', 'Micro Culture'];
      const targets = ['4 hrs', '4 hrs', '1 hr', '72 hrs', '48 hrs'];
      const statuses = ['Met Target', 'Met Target', 'Met Target', 'Lagging', 'Met Target'];
      return { testgroup: groups[i], targettat: targets[i], actualavgtat: '3.5 hrs', breaches: i.toString(), compliance: (95-i) + '%', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/analytics/revenue', title: 'Revenue Report', desc: 'Financial analytics for the diagnostics department.',
    cols: ['Date', 'IPD Revenue', 'OPD Revenue', 'External Referrals', 'Total', 'Status'],
    stats: [{ label: 'Revenue (MTD)', val: '$145k', col: 'text-emerald-400' }, { label: 'Growth', val: '+8%', col: 'text-blue-400' }, { label: 'Pending Dues', val: '$5k', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: (10+i) + ' Jul 2026', ipdrevenue: '$' + (5000+i*100), opdrevenue: '$' + (8000+i*100), externalreferrals: '$' + (1000+i*50), total: '$' + (14000+i*250), status: 'Reconciled' };
    })`
  },
  {
    path: 'diagnostics/analytics/pending', title: 'Pending Test Report', desc: 'Daily overview of backlog and overdue tests.',
    cols: ['Department', 'Tests Ordered', 'Pending > 24hrs', 'Pending > 48hrs', 'Action Plan', 'Status'],
    stats: [{ label: 'Total Backlog', val: '12', col: 'text-amber-400' }, { label: 'Oldest Pending', val: '72 hrs (Culture)', col: 'text-red-400' }, { label: 'Cleared Today', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Microbiology', 'Histopathology', 'Biochemistry', 'Hematology', 'Serology'];
      const statuses = ['Backlog', 'Backlog', 'Clear', 'Clear', 'Clear'];
      return { department: depts[i], testsordered: '500', pending24hrs: (5-i).toString(), pending48hrs: (i===0)?'2':'0', actionplan: 'Follow-up needed', status: statuses[i] };
    })`
  },

  // SETTINGS
  {
    path: 'diagnostics/settings/master', title: 'Test Master Configuration', desc: 'Define new tests, pricing, sample requirements, and TAT targets.',
    cols: ['Test Code', 'Test Name', 'Department', 'Sample Type', 'Price', 'Status'],
    stats: [{ label: 'Active Tests', val: '1,250', col: 'text-blue-400' }, { label: 'Recently Added', val: '5', col: 'text-emerald-400' }, { label: 'Inactive', val: '12', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Active'];
      return { testcode: 'TST-' + (100+i), testname: 'Test Panel ' + (i+1), department: 'Biochemistry', sampletype: 'Serum', price: '$' + (20+i*10), status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/settings/templates', title: 'Report Templates', desc: 'Customize the PDF layout and formatting for patient reports.',
    cols: ['Template ID', 'Department', 'Layout Style', 'Last Updated', 'Updated By', 'Status'],
    stats: [{ label: 'Active Templates', val: '15', col: 'text-blue-400' }, { label: 'Drafts', val: '2', col: 'text-amber-400' }, { label: 'Default', val: 'Standard A4', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['General Lab', 'Radiology', 'Histopathology', 'Microbiology', 'Cardiology'];
      const statuses = ['Active', 'Active', 'Draft', 'Active', 'Active'];
      return { templateid: 'TPL-' + (201+i), department: depts[i], layoutstyle: 'Standard A4', lastupdated: '01 Jan 2026', updatedby: 'Admin', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/settings/integration', title: 'Machine Integration (LIS)', desc: 'HL7/ASTM interfacing configuration between analyzers and LIS.',
    cols: ['Interface ID', 'Machine Name', 'Protocol', 'Port/IP', 'Last Ping', 'Status'],
    stats: [{ label: 'Connected Machines', val: '24', col: 'text-blue-400' }, { label: 'Bi-Directional', val: '20', col: 'text-emerald-400' }, { label: 'Connection Errors', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Connected', 'Connected', 'Connected', 'Disconnected', 'Connected'];
      return { interfaceid: 'LIS-' + (301+i), machinename: 'Analyzer ' + (i+1), protocol: 'HL7', portip: '192.168.1.' + (50+i), lastping: 'Just Now', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/settings/reference', title: 'Reference Ranges', desc: 'Configure normal ranges based on age, gender, and methodology.',
    cols: ['Parameter', 'Gender', 'Age Range', 'Min Range', 'Max Range', 'Status'],
    stats: [{ label: 'Total Parameters', val: '3,500', col: 'text-blue-400' }, { label: 'Updated This Year', val: '150', col: 'text-emerald-400' }, { label: 'Pending Review', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const genders = ['Male', 'Female', 'Child', 'All', 'Male'];
      return { parameter: 'Hemoglobin', gender: genders[i], agerange: 'Adult', minrange: '13.0', maxrange: '17.0', status: 'Active' };
    })`
  },
  {
    path: 'diagnostics/settings/preferences', title: 'Diagnostic Preferences', desc: 'Department-wide settings for TAT alerts, critical thresholds, and printing defaults.',
    cols: ['Setting Name', 'Category', 'Current Value', 'Last Modified', 'Modified By', 'Status'],
    stats: [{ label: 'Auto-Authorization', val: 'Enabled', col: 'text-emerald-400' }, { label: 'Critical SMS Alerts', val: 'Enabled', col: 'text-emerald-400' }, { label: 'Barcode Format', val: 'Code128', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const settings = ['Auto-Authorize Normal Results', 'Critical Value SMS Alert', 'Default Print Size', 'Enable WhatsApp API', 'Delta Check Trigger (%)'];
      const values = ['True', 'True', 'A4', 'True', '20'];
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
        const isGood = val === 'Pass' || val === 'Passed' || val === 'Valid' || val === 'Completed' || val === 'Validated' || val === 'Online' || val === 'Active' || val === 'Resolved' || val === 'Sent to Portal' || val === 'Signed' || val === 'Delivered' || val === 'Amended' || val === 'Available' || val === 'Printed' || val === 'Read' || val === 'Opened' || val === 'Generated' || val === 'Clear' || val === 'Met Target' || val === 'Reconciled' || val === 'Excellent' || val === 'Good' || val === 'Connected';
        const isWarning = val === 'Warning (1:2s)' || val === 'Pending Results' || val === 'Due Soon' || val === 'Pending' || val === 'Pending Validation' || val === 'Expiring Soon' || val === 'Offline - Repair' || val === 'Under Repair' || val === 'Pending Dispatch' || val === 'Pending Sign-off' || val === 'Expiring' || val === 'Printing' || val === 'Sent' || val === 'Backlog' || val === 'Lagging' || val === 'Average' || val === 'Draft';
        const isNeutral = val === 'Archived' || val === 'Inactive' || val === 'Disconnected' || val === 'Retry Pending';
        const isDanger = val === 'Fail (1:3s)' || val === 'Expired' || val === 'Low Stock' || val === 'Critical Low' || val === 'Held for Review' || val === 'Failed' || val === 'Bounced' || val === 'DND Failed' || val === 'Revoked';
        
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
