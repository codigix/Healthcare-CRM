const fs = require('fs');
const path = require('path');

const config = [
  // Training & Development
  {
    path: 'hr/training/calendar', title: 'Training Calendar', desc: 'Schedules for all upcoming induction, compliance, and clinical training sessions.',
    cols: ['Training Date', 'Program Name', 'Trainer', 'Target Audience', 'Location/Link', 'Status'],
    stats: [{ label: 'Upcoming Trainings', val: '8', col: 'text-blue-400' }, { label: 'Staff Enrolled', val: '145', col: 'text-amber-400' }, { label: 'Trainings (YTD)', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const programs = ['Fire Safety Drill', 'BLS Refresher', 'Infection Control', 'NABH Protocols', 'Communication Skills'];
      return { trainingdate: '10 Jul 2026', programname: programs[i], trainer: 'Safety Officer', targetaudience: 'All Staff', locationlink: 'Auditorium 1', status: 'Scheduled' };
    })`
  },
  {
    path: 'hr/training/programs', title: 'Training Programs', desc: 'Master list of all internal and external training modules available.',
    cols: ['Program Code', 'Program Name', 'Category', 'Duration', 'Mandatory', 'Status'],
    stats: [{ label: 'Total Modules', val: '34', col: 'text-blue-400' }, { label: 'Mandatory', val: '12', col: 'text-red-400' }, { label: 'Clinical', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const categories = ['Compliance', 'Clinical', 'Soft Skills', 'Leadership', 'IT'];
      return { programcode: 'TRN-' + (101+i), programname: 'Module ' + (1+i), category: categories[i], duration: (2+i) + ' Hrs', mandatory: i<2?'Yes':'No', status: 'Active' };
    })`
  },
  {
    path: 'hr/training/certifications', title: 'Certifications', desc: 'Tracking internal certifications and their validity periods.',
    cols: ['Emp Name', 'Certificate Name', 'Issue Date', 'Expiry Date', 'Issuer', 'Status'],
    stats: [{ label: 'Expiring (30D)', val: '15', col: 'text-red-400' }, { label: 'Active Certs', val: '450', col: 'text-emerald-400' }, { label: 'Renewals Due', val: '24', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===0?'Expiring Soon':(i===1?'Expired':'Valid');
      return { empname: 'Staff ' + (1+i), certificatename: 'BLS Certification', issuedate: '01 Jan 2025', expirydate: statuses==='Expiring Soon'?'15 Jul 2026':'01 Jan 2027', issuer: 'AHA', status: statuses };
    })`
  },
  {
    path: 'hr/training/cme', title: 'CME Programs', desc: 'Continuing Medical Education tracking for doctors to maintain licenses.',
    cols: ['Doctor Name', 'Event/Course', 'Credit Hours', 'Date', 'Proof Document', 'Status'],
    stats: [{ label: 'Total CME Hours', val: '1,240', col: 'text-blue-400' }, { label: 'Doctors Compliant', val: '85%', col: 'text-emerald-400' }, { label: 'Pending Verification', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { doctorname: 'Dr. ' + (1+i), eventcourse: 'Cardio Summit 2026', credithours: (4+i).toString(), date: '01 Jun 2026', proofdocument: 'Uploaded', status: i===0?'Pending Verification':'Verified' };
    })`
  },
  {
    path: 'hr/training/assessment', title: 'Skill Assessment', desc: 'Post-training quizzes or practical assessments to verify competency.',
    cols: ['Assessment ID', 'Emp Name', 'Program Name', 'Score', 'Pass/Fail', 'Status'],
    stats: [{ label: 'Assessments Taken', val: '145', col: 'text-blue-400' }, { label: 'Pass Rate', val: '92%', col: 'text-emerald-400' }, { label: 'Retakes Required', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const scores = ['95%', '45%', '85%', '90%', '88%'];
      const pass = i===1?'Fail':'Pass';
      return { assessmentid: 'ASM-' + (1001+i), empname: 'Staff ' + (1+i), programname: 'Fire Safety Drill', score: scores[i], passfail: pass, status: 'Completed' };
    })`
  },

  // Compliance
  {
    path: 'hr/compliance/documents', title: 'Compliance Documents', desc: 'Hospital-level HR compliances like labor law registrations and PF/ESI challans.',
    cols: ['Document Type', 'Period/Year', 'Filing Date', 'Next Due Date', 'Authority', 'Status'],
    stats: [{ label: 'Upcoming Filings', val: '2', col: 'text-amber-400' }, { label: 'Compliant', val: '100%', col: 'text-emerald-400' }, { label: 'Overdue', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['PF Return', 'ESI Return', 'PT Return', 'Labor License Renewal', 'Bonus Act Filing'];
      return { documenttype: types[i], periodyear: 'May 2026', filingdate: '10 Jun 2026', nextduedate: '15 Jul 2026', authority: 'Govt Portal', status: i===4?'Action Required':'Filed' };
    })`
  },
  {
    path: 'hr/compliance/license', title: 'License Verification', desc: 'Primary Source Verification (PSV) of nursing and medical licenses.',
    cols: ['Emp Name', 'License Type', 'License No', 'Council', 'Verification Date', 'Status'],
    stats: [{ label: 'Verified Licenses', val: '450', col: 'text-emerald-400' }, { label: 'Pending PSV', val: '12', col: 'text-amber-400' }, { label: 'Flagged/Fake', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empname: 'Staff ' + (1+i), licensetype: 'Nursing Registration', licenseno: 'NUR-100' + i, council: 'State Nursing Council', verificationdate: '01 Jan 2026', status: 'Verified' };
    })`
  },
  {
    path: 'hr/compliance/registration', title: 'Medical Registration', desc: 'Tracking doctor registrations with national/state medical councils.',
    cols: ['Doctor Name', 'Registration No', 'Council Name', 'Valid Till', 'State', 'Status'],
    stats: [{ label: 'Doctors Registered', val: '120', col: 'text-blue-400' }, { label: 'Expiring (90D)', val: '5', col: 'text-amber-400' }, { label: 'Non-Compliant', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { doctorname: 'Dr. ' + (1+i), registrationno: 'MCI-500' + i, councilname: 'Medical Council', validtill: '31 Dec 2028', state: 'Active State', status: 'Active' };
    })`
  },
  {
    path: 'hr/compliance/nabh', title: 'NABH HR Compliance', desc: 'Specific tracker for NABH Chapter 6 (HRM) requirements.',
    cols: ['Standard', 'Description', 'Compliance %', 'Last Audit', 'Findings', 'Status'],
    stats: [{ label: 'Overall HRM Score', val: '92%', col: 'text-emerald-400' }, { label: 'Open NCs', val: '2', col: 'text-red-400' }, { label: 'Audits Scheduled', val: '1', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const standards = ['HRM 1', 'HRM 2', 'HRM 3', 'HRM 4', 'HRM 5'];
      return { standard: standards[i], description: 'Staff planning & onboarding', compliance: (85+i*2) + '%', lastaudit: '15 Jan 2026', findings: i===0?'1 Minor NC':'Nil', status: i===0?'Action Required':'Compliant' };
    })`
  },
  {
    path: 'hr/compliance/vaccination', title: 'Staff Vaccination', desc: 'Mandatory tracking of Hep-B, COVID, and Flu shots for clinical staff.',
    cols: ['Emp Name', 'Department', 'Hep-B Status', 'COVID Status', 'Next Dose Due', 'Status'],
    stats: [{ label: 'Fully Vaccinated', val: '95%', col: 'text-emerald-400' }, { label: 'Pending Hep-B', val: '24', col: 'text-red-400' }, { label: 'Doses Scheduled', val: '15', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const hepb = i===2?'Dose 2 Pending':'Completed';
      return { empname: 'Staff ' + (1+i), department: 'ICU', hepbstatus: hepb, covidstatus: 'Completed', nextdosedue: hepb==='Completed'?'-':'15 Jul 2026', status: hepb==='Completed'?'Compliant':'Incomplete' };
    })`
  },
  {
    path: 'hr/compliance/training', title: 'Mandatory Trainings', desc: 'Tracking completion of statutorily required trainings (e.g., POSH, Fire Safety).',
    cols: ['Emp Name', 'POSH Training', 'Fire Safety', 'Bio-Medical Waste', 'Info Security', 'Status'],
    stats: [{ label: 'Overall Compliance', val: '88%', col: 'text-emerald-400' }, { label: 'POSH Pending', val: '45', col: 'text-red-400' }, { label: 'BMW Pending', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empname: 'Staff ' + (1+i), poshtraining: i===1?'Pending':'Completed', firesafety: 'Completed', biomedicalwaste: 'Completed', infosecurity: 'Completed', status: i===1?'Non-Compliant':'Compliant' };
    })`
  },

  // Employee Health
  {
    path: 'hr/health/checkups', title: 'Health Checkups', desc: 'Annual or pre-employment health screening records for staff.',
    cols: ['Emp Name', 'Checkup Type', 'Date', 'Fitness Status', 'Reviewing Doctor', 'Status'],
    stats: [{ label: 'Checkups Done (YTD)', val: '450', col: 'text-blue-400' }, { label: 'Pending Annual', val: '120', col: 'text-amber-400' }, { label: 'Unfit/Review', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empname: 'Staff ' + (1+i), checkuptype: 'Annual Health Check', date: '01 Jun 2026', fitnessstatus: i===3?'Requires Review':'Fit', reviewingdoctor: 'Dr. Physician', status: 'Completed' };
    })`
  },
  {
    path: 'hr/health/vaccination', title: 'Vaccination History', desc: 'Detailed log of all vaccines administered to an employee by the hospital.',
    cols: ['Emp Name', 'Vaccine', 'Dose No', 'Date Administered', 'Batch No', 'Status'],
    stats: [{ label: 'Vaccines Administered', val: '1,240', col: 'text-blue-400' }, { label: 'Adverse Reactions', val: '0', col: 'text-emerald-400' }, { label: 'Stock Availability', val: 'Adequate', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empname: 'Staff ' + (1+i), vaccine: 'Hepatitis B', doseno: 'Dose ' + ((i%3)+1), dateadministered: '01 Jan 2026', batchno: 'VAX-' + (100+i), status: 'Recorded' };
    })`
  },
  {
    path: 'hr/health/occupational', title: 'Occupational Health', desc: 'Tracking exposure risks, radiation monitoring (TLD badges), and chemical hazards.',
    cols: ['Emp Name', 'Department', 'Risk Category', 'TLD Badge Status', 'Last Review', 'Status'],
    stats: [{ label: 'High Risk Staff', val: '45', col: 'text-red-400' }, { label: 'TLD Renewals Due', val: '12', col: 'text-amber-400' }, { label: 'Monitoring Active', val: '100%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empname: 'Radiology Tech ' + (1+i), department: 'Radiology', riskcategory: 'Radiation - High', tldbadgestatus: i===0?'Due for Reading':'Active', lastreview: '01 Jun 2026', status: 'Monitored' };
    })`
  },
  {
    path: 'hr/health/injury', title: 'Injury & Incident Reports', desc: 'Logging needle stick injuries, slips, falls, or workplace accidents.',
    cols: ['Incident ID', 'Emp Name', 'Incident Type', 'Date & Time', 'Action Taken', 'Status'],
    stats: [{ label: 'Incidents (YTD)', val: '12', col: 'text-red-400' }, { label: 'Needle Stick (YTD)', val: '4', col: 'text-red-400' }, { label: 'Open Investigations', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Needle Stick Injury', 'Slip & Fall', 'Needle Stick Injury', 'Chemical Exposure', 'Equipment Injury'];
      return { incidentid: 'INC-' + (1001+i), empname: 'Staff ' + (1+i), incidenttype: types[i], datetime: '10 May 2026', actiontaken: 'PEP Administered', status: i===0?'Under Investigation':'Closed' };
    })`
  },
  {
    path: 'hr/health/fitness', title: 'Fitness Certificates', desc: 'Return-to-work clearances after prolonged illness or maternity leave.',
    cols: ['Emp Name', 'Leave Type', 'Leave Duration', 'Fitness Date', 'Cleared By', 'Status'],
    stats: [{ label: 'Pending Clearances', val: '3', col: 'text-amber-400' }, { label: 'Cleared (Mo)', val: '8', col: 'text-emerald-400' }, { label: 'Maternity Returns', val: '2', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empname: 'Staff ' + (1+i), leavetype: i===1?'Maternity Leave':'Medical Leave', leaveduration: i===1?'180 Days':'15 Days', fitnessdate: 'Today', clearedby: 'CMO', status: i===0?'Pending Auth':'Cleared' };
    })`
  },

  // Claims & Reimbursements
  {
    path: 'hr/claims/travel', title: 'Travel Claims', desc: 'Reimbursement for official travel, conferences, or camp duties.',
    cols: ['Claim ID', 'Emp Name', 'Travel Purpose', 'Amount Claimed', 'Date', 'Status'],
    stats: [{ label: 'Pending Claims', val: '15', col: 'text-amber-400' }, { label: 'Claim Value', val: '$4,500', col: 'text-amber-400' }, { label: 'Approved (Mo)', val: '$12,000', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Rejected', 'Approved'];
      return { claimid: 'TRV-' + (1001+i), empname: 'Staff ' + (1+i), travelpurpose: 'Medical Conference', amountclaimed: '$' + (500+i*100), date: '01 Jul 2026', status: statuses[i] };
    })`
  },
  {
    path: 'hr/claims/medical', title: 'Medical Reimbursements', desc: 'OPD/IPD expense claims for staff and dependents under hospital policy.',
    cols: ['Claim ID', 'Emp Name', 'Patient', 'Hospital/Clinic', 'Claim Amount', 'Status'],
    stats: [{ label: 'Pending Approvals', val: '24', col: 'text-amber-400' }, { label: 'Total Liability', val: '$18,500', col: 'text-amber-400' }, { label: 'Processed (YTD)', val: '$145,000', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { claimid: 'MED-' + (2001+i), empname: 'Staff ' + (1+i), patient: 'Spouse', hospitalclinic: 'Internal', claimamount: '$' + (200+i*50), status: i<2?'Pending Auth':'Processed' };
    })`
  },
  {
    path: 'hr/claims/expense', title: 'General Expense Claims', desc: 'Reimbursement for mobile bills, internet, or petty departmental purchases.',
    cols: ['Claim ID', 'Emp Name', 'Expense Category', 'Amount Claimed', 'Date', 'Status'],
    stats: [{ label: 'Pending Claims', val: '8', col: 'text-amber-400' }, { label: 'Approved (Week)', val: '45', col: 'text-blue-400' }, { label: 'Rejected', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Mobile/Internet', 'Team Lunch', 'Stationery', 'Mobile/Internet', 'Relocation'];
      return { claimid: 'EXP-' + (3001+i), empname: 'Staff ' + (1+i), expensecategory: cats[i], amountclaimed: '$' + (50+i*20), date: 'Yesterday', status: 'Approved' };
    })`
  },
  {
    path: 'hr/claims/workflow', title: 'Approval Workflow', desc: 'Manager/HOD view to approve, reject, or request more info on team claims.',
    cols: ['Claim ID', 'Emp Name', 'Claim Type', 'Amount', 'Policy Limit', 'Status'],
    stats: [{ label: 'My Approvals Due', val: '12', col: 'text-amber-400' }, { label: 'Total Value', val: '$3,200', col: 'text-amber-400' }, { label: 'Escalated', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { claimid: 'CLM-' + (4001+i), empname: 'Team Member ' + (1+i), claimtype: 'Travel', amount: '$' + (150+i*50), policylimit: '$500', status: 'Pending Review' };
    })`
  },

  // Communication
  {
    path: 'hr/communication/announcements', title: 'HR Announcements', desc: 'Broadcast messages for events, policy changes, or hospital news.',
    cols: ['Announcement Title', 'Date Posted', 'Target Audience', 'Read Count', 'Posted By', 'Status'],
    stats: [{ label: 'Active Announcements', val: '4', col: 'text-blue-400' }, { label: 'Avg Read Rate', val: '78%', col: 'text-emerald-400' }, { label: 'Drafts', val: '2', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { announcementtitle: 'Updated Leave Policy ' + (2026-i), dateposted: '01 Jan 2026', targetaudience: 'All Staff', readcount: '650/824', postedby: 'HR Admin', status: 'Active' };
    })`
  },
  {
    path: 'hr/communication/messages', title: 'Internal Messages', desc: 'Direct secure messaging between HR and individual employees.',
    cols: ['Message Subject', 'To/From', 'Date & Time', 'Category', 'Attachments', 'Status'],
    stats: [{ label: 'Unread Messages', val: '15', col: 'text-amber-400' }, { label: 'Total Sent (Mo)', val: '450', col: 'text-blue-400' }, { label: 'Avg Response Time', val: '4 Hrs', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i<2?'Unread':'Read';
      return { messagesubject: 'Query regarding payslip', tofrom: 'From: Staff ' + (1+i), datetime: 'Today 10:00', category: 'Payroll', attachments: '1 File', status: statuses };
    })`
  },
  {
    path: 'hr/communication/circulars', title: 'Circulars & Memos', desc: 'Formal, mandated communications requiring digital signatures or acknowledgments.',
    cols: ['Circular ID', 'Subject', 'Issue Date', 'Mandatory Ack.', 'Ack. Count', 'Status'],
    stats: [{ label: 'Active Circulars', val: '2', col: 'text-blue-400' }, { label: 'Pending Acknowledgments', val: '124', col: 'text-amber-400' }, { label: 'Compliance', val: '85%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { circularid: 'CIR-' + (2026001+i), subject: 'Infection Control Protocol Update', issuedate: '01 Jun 2026', mandatoryack: 'Yes', ackcount: '700/824', status: 'Published' };
    })`
  },
  {
    path: 'hr/communication/notices', title: 'Employee Notices', desc: 'Formal disciplinary notices, warnings, or show-cause letters.',
    cols: ['Notice ID', 'Emp Name', 'Notice Type', 'Issue Date', 'Response Due', 'Status'],
    stats: [{ label: 'Open Notices', val: '3', col: 'text-red-400' }, { label: 'Responses Overdue', val: '1', col: 'text-red-400' }, { label: 'Closed (YTD)', val: '15', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Warning Letter', 'Show Cause', 'Warning Letter', 'Termination Notice', 'Show Cause'];
      return { noticeid: 'NOT-' + (101+i), empname: 'Staff ' + (1+i), noticetype: types[i], issuedate: '10 Jun 2026', responsedue: '17 Jun 2026', status: i===0?'Response Pending':'Closed' };
    })`
  },

  // Reports
  {
    path: 'hr/reports/employee', title: 'Employee Master Report', desc: 'Downloadable dump of all employee demographics and professional details.',
    cols: ['Report Type', 'Format', 'Generated On', 'Generated By', 'Size', 'Status'],
    stats: [{ label: 'Reports Generated (Mo)', val: '24', col: 'text-blue-400' }, { label: 'Last Export', val: 'Today', col: 'text-emerald-400' }, { label: 'Scheduled Reports', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reporttype: 'Full Master Data', format: 'Excel (XLSX)', generatedon: 'Today 09:00', generatedby: 'Admin', size: '2.4 MB', status: 'Ready' };
    })`
  },
  {
    path: 'hr/reports/attendance', title: 'Attendance Report', desc: 'Aggregated attendance data for payroll or compliance audits.',
    cols: ['Report Month', 'Department', 'Total Working Days', 'Avg Presence %', 'Exported On', 'Status'],
    stats: [{ label: 'Avg Hospital Presence', val: '94%', col: 'text-emerald-400' }, { label: 'Highest Absenteeism', val: 'Housekeeping', col: 'text-red-400' }, { label: 'Automated Sync', val: 'Active', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportmonth: 'June 2026', department: 'All Departments', totalworkingdays: '26', avgpresence: (90+i) + '%', exportedon: '01 Jul 2026', status: 'Generated' };
    })`
  },
  {
    path: 'hr/reports/leave', title: 'Leave Summary Report', desc: 'Trends on leave consumption and remaining organizational liability.',
    cols: ['Department', 'Leaves Taken (YTD)', 'Average/Emp', 'Liability Value', 'Trend', 'Status'],
    stats: [{ label: 'Total Leaves Taken', val: '2,450', col: 'text-blue-400' }, { label: 'Highest Leave Dept', val: 'Nursing', col: 'text-amber-400' }, { label: 'Unplanned Leave %', val: '15%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Nursing', 'Doctors', 'Admin', 'IT', 'Pharmacy'];
      return { department: depts[i], leavestaken: (500-i*50).toString(), averageemp: (8-i).toString(), liabilityvalue: '$' + (15000-i*2000), trend: i===0?'Up 5%':'Stable', status: 'Generated' };
    })`
  },
  {
    path: 'hr/reports/payroll', title: 'Payroll Register', desc: 'Financial audit report of all salaries, taxes, and net payouts.',
    cols: ['Month', 'Gross Payroll', 'Total Deductions', 'Net Payout', 'Employer PF/ESI', 'Status'],
    stats: [{ label: 'Total Payout (YTD)', val: '$2.4M', col: 'text-blue-400' }, { label: 'Tax Deducted (YTD)', val: '$450K', col: 'text-emerald-400' }, { label: 'Variance (MoM)', val: '+2.4%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { month: 'May 2026', grosspayroll: '$' + (450000-i*5000), totaldeductions: '$' + (50000-i*1000), netpayout: '$' + (400000-i*4000), employerpfesi: '$' + (20000-i*500), status: 'Generated' };
    })`
  },
  {
    path: 'hr/reports/recruitment', title: 'Recruitment Funnel', desc: 'Metrics on time-to-hire, source effectiveness, and conversion rates.',
    cols: ['Position', 'Total Applied', 'Shortlisted', 'Offered', 'Joined', 'Status'],
    stats: [{ label: 'Avg Time to Hire', val: '24 Days', col: 'text-emerald-400' }, { label: 'Offer Acceptance', val: '85%', col: 'text-emerald-400' }, { label: 'Cost Per Hire', val: '$450', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { position: 'Staff Nurse', totalapplied: (150-i*10).toString(), shortlisted: (30-i*2).toString(), offered: (10-i).toString(), joined: (8-i).toString(), status: 'Generated' };
    })`
  },
  {
    path: 'hr/reports/training', title: 'Training ROI Report', desc: 'Data on training hours delivered, costs, and post-training assessment scores.',
    cols: ['Program', 'Batches', 'Staff Trained', 'Total Hours', 'Avg Score', 'Status'],
    stats: [{ label: 'Total Training Hrs', val: '4,500', col: 'text-blue-400' }, { label: 'Staff Covered', val: '85%', col: 'text-emerald-400' }, { label: 'Training Budget', val: '65% Used', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { program: 'Fire Safety ' + (1+i), batches: (4-i).toString(), stafftrained: (120-i*10).toString(), totalhours: (480-i*40).toString(), avgscore: (90-i) + '%', status: 'Generated' };
    })`
  },
  {
    path: 'hr/reports/performance', title: 'Performance Bell Curve', desc: 'Distribution of performance ratings across the organization to ensure normalization.',
    cols: ['Department', 'Rating 1 (Poor)', 'Rating 2', 'Rating 3 (Avg)', 'Rating 4', 'Rating 5 (Top)'],
    stats: [{ label: 'Top Performers', val: '15%', col: 'text-emerald-400' }, { label: 'Needs Improvement', val: '5%', col: 'text-red-400' }, { label: 'Avg Performers', val: '60%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Nursing', 'Administration', 'IT', 'Pharmacy', 'Support Staff'];
      return { department: depts[i], rating1poor: '5%', rating2: '15%', rating3avg: '60%', rating4: '15%', rating5top: '5%' };
    })`
  },
  {
    path: 'hr/reports/compliance', title: 'Compliance Status Report', desc: 'Consolidated view of all statutory and accreditation HR compliances.',
    cols: ['Compliance Area', 'Total Requirements', 'Compliant', 'Non-Compliant', 'Risk Level', 'Status'],
    stats: [{ label: 'Overall Compliance', val: '98%', col: 'text-emerald-400' }, { label: 'Critical Risks', val: '0', col: 'text-emerald-400' }, { label: 'Upcoming Audits', val: '1', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const areas = ['Labor Laws', 'Medical Council', 'NABH (HRM)', 'Bio-Medical', 'Fire Safety'];
      return { compliancearea: areas[i], totalrequirements: '24', compliant: '24', noncompliant: '0', risklevel: 'Low', status: 'Generated' };
    })`
  },
  {
    path: 'hr/reports/attrition', title: 'Attrition Analysis', desc: 'Exit interview data, turnover rates, and retention metrics.',
    cols: ['Month', 'Headcount', 'Voluntary Exits', 'Involuntary', 'Attrition Rate', 'Status'],
    stats: [{ label: 'Annualized Attrition', val: '14.5%', col: 'text-amber-400' }, { label: 'Highest Exit Dept', val: 'Nursing', col: 'text-red-400' }, { label: 'Avg Tenure', val: '4.2 Yrs', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { month: 'May 2026', headcount: '824', voluntaryexits: (4+i).toString(), involuntary: (1).toString(), attritionrate: (1.5+i*0.2).toFixed(1) + '%', status: 'Generated' };
    })`
  },

  // Analytics
  {
    path: 'hr/analytics/workforce', title: 'Workforce Dashboard', desc: 'High-level executive dashboard showing diversity, age, and tenure demographics.',
    cols: ['Metric', 'Current Value', 'Previous Period', 'Variance', 'Status'],
    stats: [{ label: 'Gender Ratio (M:F)', val: '45:55', col: 'text-blue-400' }, { label: 'Avg Age', val: '34 Yrs', col: 'text-emerald-400' }, { label: 'Contract vs Permanent', val: '20:80', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Total Headcount', 'Full-Time Equivalents (FTE)', 'Diversity Index', 'Avg Tenure', 'New Hire Retention (90D)'];
      return { metric: metrics[i], currentvalue: 'Data Point ' + i, previousperiod: 'Data Point ' + i, variance: '+2%', status: 'Stable' };
    })`
  },
  {
    path: 'hr/analytics/department', title: 'Department Analytics', desc: 'Comparing HR metrics (cost, attrition, performance) across different departments.',
    cols: ['Department', 'Headcount', 'Salary Cost %', 'Attrition %', 'Avg Performance', 'Status'],
    stats: [{ label: 'Largest Dept', val: 'Nursing (45%)', col: 'text-blue-400' }, { label: 'Highest Cost', val: 'Doctors (40%)', col: 'text-amber-400' }, { label: 'Best Retention', val: 'Administration', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Nursing', 'Doctors', 'Administration', 'Support Staff', 'IT'];
      return { department: depts[i], headcount: (300-i*50).toString(), salarycost: (30-i*3) + '%', attrition: (15-i) + '%', avgperformance: '3.' + (8+i) + '/5', status: 'Analyzed' };
    })`
  },
  {
    path: 'hr/analytics/attendance', title: 'Attendance Analytics', desc: 'Identifying chronic absenteeism, frequent latecomers, and OT patterns.',
    cols: ['Pattern Identified', 'Affected Staff', 'Impact', 'Suggested Action', 'Status'],
    stats: [{ label: 'Chronic Absentees', val: '8', col: 'text-red-400' }, { label: 'Habitual Latecomers', val: '24', col: 'text-amber-400' }, { label: 'OT Dependency', val: 'High in ER', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const patterns = ['Monday Absenteeism', 'Late after night shift', 'Excessive OT in Ward B', 'Unplanned Leaves (Weekends)', 'Short hours worked'];
      return { patternidentified: patterns[i], affectedstaff: (10+i*2).toString(), impact: 'High', suggestedaction: 'Review Rosters', status: 'Action Needed' };
    })`
  },
  {
    path: 'hr/analytics/payroll', title: 'Payroll Analytics', desc: 'Tracking compensation costs, benefits utilization, and overtime budget variance.',
    cols: ['Cost Center', 'Budgeted Payroll', 'Actual Payroll', 'Variance', 'OT % of Cost', 'Status'],
    stats: [{ label: 'Total HR Cost', val: '$5.4M (YTD)', col: 'text-blue-400' }, { label: 'OT Overrun', val: '$45,000', col: 'text-red-400' }, { label: 'Cost Per Bed', val: '$1,200', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const centers = ['Clinical', 'Nursing', 'Admin', 'Support', 'IT'];
      return { costcenter: centers[i], budgetedpayroll: '$' + (100000-i*10000), actualpayroll: '$' + (105000-i*10000), variance: '+5%', otcost: (2+i) + '%', status: 'Over Budget' };
    })`
  },
  {
    path: 'hr/analytics/recruitment', title: 'Recruitment Analytics', desc: 'AI-driven insights on which sourcing channels yield the best long-term employees.',
    cols: ['Source Channel', 'Hires (YTD)', 'Cost/Hire', 'Avg Tenure', 'Performance Avg', 'Status'],
    stats: [{ label: 'Best Source', val: 'Referrals', col: 'text-emerald-400' }, { label: 'Highest Cost', val: 'Agencies', col: 'text-red-400' }, { label: 'Fastest Source', val: 'Job Portals', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const sources = ['Employee Referral', 'LinkedIn', 'Agency/Consultant', 'Direct Apply', 'Campus'];
      return { sourcechannel: sources[i], hiresytd: (20-i*2).toString(), costhire: '$' + (100+i*100), avgtenure: (3-i*0.5) + ' Yrs', performanceavg: '4.' + (2-i) + '/5', status: 'Analyzed' };
    })`
  },
  {
    path: 'hr/analytics/attrition', title: 'Predictive Attrition', desc: 'Machine learning model highlighting flight risks based on commute, pay, and leaves.',
    cols: ['Emp Name', 'Department', 'Flight Risk', 'Key Driver', 'Intervention', 'Status'],
    stats: [{ label: 'High Flight Risk', val: '12 Staff', col: 'text-red-400' }, { label: 'Top Driver', val: 'Stagnant Pay', col: 'text-amber-400' }, { label: 'Retention Success', val: '65%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const risks = ['High', 'Medium', 'High', 'Low', 'Medium'];
      const drivers = ['Commute Distance', 'No Promotion in 3 Yrs', 'Low Manager Rating', '-', 'Salary below market'];
      return { empname: 'Staff ' + (1+i), department: 'Nursing', flightrisk: risks[i], keydriver: drivers[i], intervention: 'Schedule 1:1', status: risks[i]==='High'?'Intervention Needed':'Monitored' };
    })`
  },

  // Settings
  {
    path: 'hr/settings/departments', title: 'Departments', desc: 'Master configuration of hospital departments, sub-departments, and cost centers.',
    cols: ['Dept Code', 'Dept Name', 'Parent Dept', 'Head of Dept', 'Cost Center', 'Status'],
    stats: [{ label: 'Total Departments', val: '24', col: 'text-blue-400' }, { label: 'Sub-Departments', val: '45', col: 'text-emerald-400' }, { label: 'Unassigned Heads', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Cardiology', 'Nursing', 'Human Resources', 'Information Tech', 'Pharmacy'];
      return { deptcode: 'DPT-' + (101+i), deptname: depts[i], parentdept: 'Clinical/Non-Clinical', headofdept: 'Dr./Mr. ' + (1+i), costcenter: 'CC-' + (101+i), status: 'Active' };
    })`
  },
  {
    path: 'hr/settings/designations', title: 'Designations', desc: 'Hierarchy, reporting structures, and job titles across the organization.',
    cols: ['Designation', 'Grade/Band', 'Department', 'Reports To', 'Notice Period', 'Status'],
    stats: [{ label: 'Active Designations', val: '120', col: 'text-blue-400' }, { label: 'Grades Defined', val: '15', col: 'text-emerald-400' }, { label: 'Orphan Roles', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { designation: 'Senior Staff Nurse ' + (1+i), gradeband: 'Band C', department: 'Nursing', reportsto: 'Nursing Supt.', noticeperiod: '30 Days', status: 'Active' };
    })`
  },
  {
    path: 'hr/settings/employment', title: 'Employment Types', desc: 'Rules for Full-Time, Part-Time, Consultants, Locums, and Contract staff.',
    cols: ['Type Name', 'PF/ESI Applicability', 'Leave Accrual', 'Notice Req.', 'Max Tenure', 'Status'],
    stats: [{ label: 'Emp Types Defined', val: '6', col: 'text-blue-400' }, { label: 'Contract Staff %', val: '20%', col: 'text-amber-400' }, { label: 'Locum Doctors', val: '15', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Full-Time Regular', 'Contractual', 'Retainer/Consultant', 'Locum', 'Trainee/Intern'];
      return { typename: types[i], pfesiapplicability: i<2?'Yes':'No', leaveaccrual: i<2?'Full':'Prorated/Nil', noticereq: i===3?'No':'Yes', maxtenure: i===4?'6 Months':'Unlimited', status: 'Active' };
    })`
  },
  {
    path: 'hr/settings/salary', title: 'Salary Components', desc: 'Creating specific earning (HRA, DA) and deduction (PF, TDS) heads.',
    cols: ['Component Name', 'Type', 'Taxable', 'Calculation Rule', 'Appears in Payslip', 'Status'],
    stats: [{ label: 'Earning Heads', val: '12', col: 'text-emerald-400' }, { label: 'Deduction Heads', val: '8', col: 'text-amber-400' }, { label: 'Formula Configs', val: '15', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const comps = ['Basic Pay', 'House Rent Allowance', 'Special Allowance', 'Provident Fund', 'Professional Tax'];
      const types = i<3?'Earning':'Deduction';
      return { componentname: comps[i], type: types, taxable: i!==3?'Yes':'No', calculationrule: i===0?'Fixed':'Formula based', appearsinpayslip: 'Yes', status: 'Active' };
    })`
  },
  {
    path: 'hr/settings/leave', title: 'Leave Types', desc: 'Configuring Annual, Sick, Casual, Maternity, and Comp-Off rules.',
    cols: ['Leave Name', 'Accrual Rate', 'Max Carry Forward', 'Encashable', 'Document Req.', 'Status'],
    stats: [{ label: 'Active Leave Types', val: '8', col: 'text-blue-400' }, { label: 'Total Quota (Avg)', val: '21 Days/Yr', col: 'text-emerald-400' }, { label: 'Encashment Policy', val: 'Active', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const leaves = ['Annual Leave (AL)', 'Sick Leave (SL)', 'Casual Leave (CL)', 'Maternity Leave', 'Compensatory Off'];
      return { leavename: leaves[i], accrualrate: i===0?'1.5/Month':'Lump sum', maxcarryforward: i===0?'45 Days':'Nil', encashable: i===0?'Yes':'No', documentreq: i===1?'If > 2 days':'No', status: 'Active' };
    })`
  },
  {
    path: 'hr/settings/shift', title: 'Shift Rules', desc: 'Global rules for grace periods, half-day deductions, and auto-shift mapping.',
    cols: ['Rule Name', 'Condition', 'Action Triggered', 'Applies To', 'Priority', 'Status'],
    stats: [{ label: 'Active Rules', val: '15', col: 'text-blue-400' }, { label: 'Late Grace Min', val: '15 Mins', col: 'text-amber-400' }, { label: 'Auto-Deduction', val: 'Enabled', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const rules = ['Late In Deduction', 'Half Day Marking', 'Early Out Deduction', 'Night Shift Allowance', 'Overtime Eligibility'];
      return { rulename: rules[i], condition: 'Late > 15 mins', actiontriggered: 'Deduct 0.5 Day Leave', appliesto: 'All Staff', priority: (1+i).toString(), status: 'Active' };
    })`
  },
  {
    path: 'hr/settings/approval', title: 'Approval Matrix', desc: 'Workflow definitions for leaves, appraisals, and expense reimbursements.',
    cols: ['Workflow Name', 'Module', 'Level 1 Approver', 'Level 2 Approver', 'Auto-Escalation', 'Status'],
    stats: [{ label: 'Active Workflows', val: '12', col: 'text-blue-400' }, { label: 'Escalations Active', val: 'Yes (48H)', col: 'text-emerald-400' }, { label: 'Bypassed Approvals', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const workflows = ['Leave Request', 'Expense Claim', 'Performance Review', 'Shift Swap', 'Resignation'];
      return { workflowname: workflows[i], module: 'HR', level1approver: 'Reporting Manager', level2approver: i===1?'Dept Head':(i===4?'HR Head':'-'), autoescalation: 'Yes (48 Hrs)', status: 'Active' };
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
        const isGood = val === 'Active' || val === 'Verified' || val === 'Completed' || val === 'Approved' || val === 'Filed' || val === 'Compliant' || val === 'Recorded' || val === 'Monitored' || val === 'Cleared' || val === 'Read' || val === 'Published' || val === 'Ready' || val === 'Generated' || val === 'Stable' || val === 'Analyzed' || val === 'Valid';
        const isWarning = val === 'Scheduled' || val === 'Expiring Soon' || val === 'Pending Verification' || val === 'Action Required' || val === 'Incomplete' || val === 'Requires Review' || val === 'Due for Reading' || val === 'Under Investigation' || val === 'Pending Auth' || val === 'Pending Review' || val === 'Unread' || val === 'Response Pending' || val === 'Action Needed' || val === 'Over Budget' || val === 'Monitored';
        const isNeutral = val === 'Intervention Needed';
        const isDanger = val === 'Expired' || val === 'Non-Compliant' || val === 'Fail' || val === 'Closed' || val === 'Rejected';
        
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
