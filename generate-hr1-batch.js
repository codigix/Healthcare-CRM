const fs = require('fs');
const path = require('path');

const config = [
  // Employee Management
  {
    path: 'hr/employees/list', title: 'Employee Directory', desc: 'Central list of all active and inactive hospital staff.',
    cols: ['Emp ID', 'Name', 'Designation', 'Department', 'Date of Joining', 'Status'],
    stats: [{ label: 'Total Employees', val: '850', col: 'text-blue-400' }, { label: 'Active Staff', val: '824', col: 'text-emerald-400' }, { label: 'On Leave', val: '15', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Active', 'On Leave', 'Active', 'Suspended', 'Active'];
      const depts = ['Cardiology', 'Nursing', 'Administration', 'IT', 'Pharmacy'];
      return { empid: 'EMP-' + (1001+i), name: 'Staff Member ' + (i+1), designation: 'Designation ' + (i+1), department: depts[i], dateofjoining: '01 Jan 20' + (20+i), status: statuses[i] };
    })`
  },
  {
    path: 'hr/employees/profile', title: 'Employee Profile', desc: 'Detailed view of an individual employee\'s personal and professional data.',
    cols: ['Profile Field', 'Details', 'Last Updated', 'Verified By', 'Status'],
    stats: [{ label: 'Profile Completeness', val: '98%', col: 'text-emerald-400' }, { label: 'Pending KYC', val: '12', col: 'text-amber-400' }, { label: 'Updates (Week)', val: '45', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const fields = ['Personal Details', 'Bank Information', 'Emergency Contact', 'Medical History', 'Academic Records'];
      return { profilefield: fields[i], details: 'Data encrypted', lastupdated: 'Today', verifiedby: 'HR Admin', status: 'Verified' };
    })`
  },
  {
    path: 'hr/employees/documents', title: 'Employee Documents', desc: 'Digital repository of KYC, educational, and professional certificates.',
    cols: ['Document Name', 'Document Type', 'Upload Date', 'Expiry Date', 'Verification', 'Status'],
    stats: [{ label: 'Documents Uploaded', val: '4,200', col: 'text-blue-400' }, { label: 'Pending Verification', val: '45', col: 'text-amber-400' }, { label: 'Expired Documents', val: '8', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Aadhar Card', 'Medical License', 'Degree Certificate', 'Relieving Letter', 'PAN Card'];
      const statuses = i===1?'Pending Verification':(i===2?'Expired':'Verified');
      return { documentname: types[i], documenttype: 'KYC/Compliance', uploaddate: '01 Jan 2026', expirydate: i===2?'01 Jan 2026':'-', verification: statuses==='Verified'?'Approved':'Pending', status: statuses };
    })`
  },
  {
    path: 'hr/employees/id-cards', title: 'Employee ID Cards', desc: 'Generation, tracking, and issuance of physical/digital ID cards.',
    cols: ['Emp ID', 'Name', 'Card Type', 'Issue Date', 'Validity', 'Status'],
    stats: [{ label: 'Active Cards', val: '824', col: 'text-emerald-400' }, { label: 'Pending Print', val: '15', col: 'text-amber-400' }, { label: 'Lost/Reissued', val: '5', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Active', 'Pending Print', 'Active', 'Blocked', 'Active'];
      return { empid: 'EMP-' + (2001+i), name: 'Employee ' + (1+i), cardtype: 'RFID Smart Card', issuedate: 'Today', validity: '31 Dec 2027', status: statuses[i] };
    })`
  },
  {
    path: 'hr/employees/transfer', title: 'Employee Transfer', desc: 'Internal movement of staff between departments or hospital branches.',
    cols: ['Transfer ID', 'Emp Name', 'From Dept', 'To Dept', 'Effective Date', 'Status'],
    stats: [{ label: 'Transfers (YTD)', val: '34', col: 'text-blue-400' }, { label: 'Pending Approval', val: '4', col: 'text-amber-400' }, { label: 'Completed', val: '30', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'Pending Approval', 'Completed', 'Rejected', 'Completed'];
      return { transferid: 'TRF-' + (3001+i), empname: 'Staff ' + (1+i), fromdept: 'Ward A', todept: 'ICU', effectivedate: '15 Jul 2026', status: statuses[i] };
    })`
  },
  {
    path: 'hr/employees/exit', title: 'Employee Exit', desc: 'Offboarding process, clearances, and full & final settlement tracking.',
    cols: ['Exit ID', 'Emp Name', 'Resignation Date', 'Notice Period', 'Last Working Day', 'Status'],
    stats: [{ label: 'Active Exits', val: '12', col: 'text-amber-400' }, { label: 'Clearances Pending', val: '5', col: 'text-red-400' }, { label: 'Alumni', val: '150', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Serving Notice', 'Clearance Pending', 'Serving Notice', 'Completed', 'Serving Notice'];
      return { exitid: 'EXT-' + (4001+i), empname: 'Employee ' + (1+i), resignationdate: '01 Jun 2026', noticeperiod: '30 Days', lastworkingday: '30 Jun 2026', status: statuses[i] };
    })`
  },

  // Recruitment
  {
    path: 'hr/recruitment/openings', title: 'Job Openings', desc: 'Current vacancies and requisition requests from departments.',
    cols: ['Job ID', 'Title', 'Department', 'Vacancies', 'Applicants', 'Status'],
    stats: [{ label: 'Active Openings', val: '18', col: 'text-blue-400' }, { label: 'Total Vacancies', val: '24', col: 'text-amber-400' }, { label: 'Positions Filled (YTD)', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const titles = ['Senior Nurse', 'Cardiologist', 'IT Support', 'Billing Executive', 'Pharmacist'];
      return { jobid: 'JOB-' + (101+i), title: titles[i], department: 'Various', vacancies: (1+i).toString(), applicants: (10+i*5).toString(), status: i===4?'Closed':'Active' };
    })`
  },
  {
    path: 'hr/recruitment/candidates', title: 'Candidates', desc: 'Pool of applicants applied for various open positions.',
    cols: ['Candidate ID', 'Name', 'Applied For', 'Experience', 'Source', 'Status'],
    stats: [{ label: 'Total Candidates', val: '350', col: 'text-blue-400' }, { label: 'Shortlisted', val: '45', col: 'text-emerald-400' }, { label: 'Rejected', val: '120', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Shortlisted', 'Screening', 'Rejected', 'Interview Scheduled', 'Shortlisted'];
      return { candidateid: 'CAN-' + (1001+i), name: 'Candidate ' + (1+i), appliedfor: 'Nursing Staff', experience: (2+i) + ' Years', source: 'LinkedIn', status: statuses[i] };
    })`
  },
  {
    path: 'hr/recruitment/schedule', title: 'Interview Schedule', desc: 'Calendar and roster for upcoming candidate interviews.',
    cols: ['Interview ID', 'Candidate', 'Position', 'Interviewer', 'Date & Time', 'Status'],
    stats: [{ label: 'Interviews Today', val: '8', col: 'text-blue-400' }, { label: 'Upcoming (Week)', val: '24', col: 'text-amber-400' }, { label: 'No Shows', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Scheduled', 'Completed', 'Scheduled', 'No Show', 'Scheduled'];
      return { interviewid: 'INT-' + (2001+i), candidate: 'Candidate ' + (1+i), position: 'IT Exec', interviewer: 'IT Head', datetime: 'Today 14:00', status: statuses[i] };
    })`
  },
  {
    path: 'hr/recruitment/feedback', title: 'Interview Feedback', desc: 'Evaluations and ratings submitted by technical and HR interviewers.',
    cols: ['Candidate', 'Position', 'Round', 'Interviewer', 'Rating', 'Status'],
    stats: [{ label: 'Feedback Pending', val: '5', col: 'text-amber-400' }, { label: 'Submitted Today', val: '12', col: 'text-emerald-400' }, { label: 'Avg Rating', val: '3.8/5', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Selected', 'Pending Feedback', 'Selected', 'Rejected', 'Selected'];
      return { candidate: 'Candidate ' + (1+i), position: 'Nurse', round: 'Technical', interviewer: 'Nursing Supt.', rating: statuses==='Selected'?'4.5/5':'-', status: statuses };
    })`
  },
  {
    path: 'hr/recruitment/offers', title: 'Offer Letters', desc: 'Generation, dispatch, and tracking of employment offers.',
    cols: ['Offer ID', 'Candidate Name', 'Designation', 'Offered CTC', 'Expiry Date', 'Status'],
    stats: [{ label: 'Offers Rolled (Mo)', val: '15', col: 'text-blue-400' }, { label: 'Accepted', val: '12', col: 'text-emerald-400' }, { label: 'Declined', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Accepted', 'Pending Response', 'Accepted', 'Declined', 'Accepted'];
      return { offerid: 'OFF-' + (3001+i), candidatename: 'Candidate ' + (1+i), designation: 'Executive', offeredctc: '$' + (30000+i*5000), expirydate: '15 Jul 2026', status: statuses[i] };
    })`
  },
  {
    path: 'hr/recruitment/joining', title: 'Joining Process', desc: 'Tracking candidates who have accepted offers until their day 1.',
    cols: ['Candidate', 'Designation', 'Department', 'Expected DOJ', 'Welcome Kit', 'Status'],
    stats: [{ label: 'Joining This Week', val: '5', col: 'text-emerald-400' }, { label: 'Joining Next Week', val: '8', col: 'text-blue-400' }, { label: 'Dropouts', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { candidate: 'Candidate ' + (1+i), designation: 'Staff Nurse', department: 'ICU', expecteddoj: '15 Jul 2026', welcomekit: 'Prepared', status: 'Pre-Onboarding' };
    })`
  },

  // Onboarding
  {
    path: 'hr/onboarding/process', title: 'Employee Onboarding', desc: 'Workflow tracking for new hires on their first week.',
    cols: ['Emp ID', 'Name', 'DOJ', 'Documents Check', 'Asset Allocation', 'Status'],
    stats: [{ label: 'Active Onboardings', val: '8', col: 'text-blue-400' }, { label: 'Completed (Mo)', val: '15', col: 'text-emerald-400' }, { label: 'Delayed Steps', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In Progress', 'Completed', 'In Progress', 'Delayed', 'In Progress'];
      return { empid: 'EMP-' + (5001+i), name: 'New Hire ' + (1+i), doj: 'Today', documentscheck: '75%', assetallocation: 'Pending IT', status: statuses[i] };
    })`
  },
  {
    path: 'hr/onboarding/department', title: 'Department Allocation', desc: 'Assigning new hires to their specific wards or units.',
    cols: ['Emp ID', 'Name', 'Allocated Dept', 'Reporting Manager', 'Shift Default', 'Status'],
    stats: [{ label: 'Allocated Today', val: '4', col: 'text-emerald-400' }, { label: 'Pending Allocation', val: '1', col: 'text-amber-400' }, { label: 'Total Managers', val: '45', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empid: 'EMP-' + (5001+i), name: 'New Hire ' + (1+i), allocateddept: 'ICU', reportingmanager: 'Dr. Head', shiftdefault: 'Morning', status: 'Allocated' };
    })`
  },
  {
    path: 'hr/onboarding/role', title: 'Role Assignment', desc: 'Defining job roles, clinical privileges, and functional designations.',
    cols: ['Emp ID', 'Name', 'Primary Role', 'Clinical Privileges', 'Job Description', 'Status'],
    stats: [{ label: 'Roles Assigned', val: '8', col: 'text-emerald-400' }, { label: 'Pending Privileges', val: '2', col: 'text-amber-400' }, { label: 'JD Acknowledged', val: '5', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empid: 'EMP-' + (5001+i), name: 'New Hire ' + (1+i), primaryrole: 'Registered Nurse', clinicalprivileges: i===0?'Pending':'Granted', jobdescription: 'Signed', status: 'Assigned' };
    })`
  },
  {
    path: 'hr/onboarding/access', title: 'System Access', desc: 'Provisioning ERP credentials, email IDs, and biometric access.',
    cols: ['Emp ID', 'Name', 'ERP Login', 'Email Created', 'Biometric Enrolled', 'Status'],
    stats: [{ label: 'IT Provisioning', val: '95%', col: 'text-emerald-400' }, { label: 'Pending Biometric', val: '3', col: 'text-amber-400' }, { label: 'Email Issues', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empid: 'EMP-' + (5001+i), name: 'New Hire ' + (1+i), erplogin: 'Created', emailcreated: 'Yes', biometricenrolled: i===2?'Pending':'Done', status: i===2?'In Progress':'Completed' };
    })`
  },
  {
    path: 'hr/onboarding/orientation', title: 'Orientation Checklist', desc: 'Tracking completion of mandatory hospital induction programs.',
    cols: ['Emp ID', 'Name', 'HR Induction', 'Safety Training', 'Dept Tour', 'Status'],
    stats: [{ label: 'Inductions This Week', val: '2', col: 'text-blue-400' }, { label: 'Checklist Compliance', val: '98%', col: 'text-emerald-400' }, { label: 'Pending Sign-offs', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empid: 'EMP-' + (5001+i), name: 'New Hire ' + (1+i), hrinduction: 'Done', safetytraining: i===1?'Pending':'Done', depttour: 'Done', status: i===1?'In Progress':'Completed' };
    })`
  },
  {
    path: 'hr/onboarding/probation', title: 'Probation Management', desc: 'Monitoring employees under probation and their confirmation schedules.',
    cols: ['Emp ID', 'Name', 'Probation End Date', 'Manager Review', 'HR Review', 'Status'],
    stats: [{ label: 'Staff on Probation', val: '45', col: 'text-amber-400' }, { label: 'Confirmations Due (Mo)', val: '12', col: 'text-blue-400' }, { label: 'Confirmed (YTD)', val: '85', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===0?'Review Pending':(i===2?'Extended':'On Track');
      return { empid: 'EMP-' + (6001+i), name: 'Probationer ' + (1+i), probationenddate: '15 Aug 2026', managerreview: statuses==='Review Pending'?'Due':'Done', hrreview: 'Pending', status: statuses };
    })`
  },

  // Attendance
  {
    path: 'hr/attendance/daily', title: 'Daily Attendance', desc: 'Real-time dashboard of who is present, absent, or on leave today.',
    cols: ['Emp ID', 'Name', 'Department', 'In Time', 'Out Time', 'Status'],
    stats: [{ label: 'Present Today', val: '780', col: 'text-emerald-400' }, { label: 'Absent', val: '15', col: 'text-red-400' }, { label: 'On Leave', val: '29', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Present', 'Late In', 'Absent', 'Present', 'Half Day'];
      return { empid: 'EMP-' + (1001+i), name: 'Staff ' + (1+i), department: 'Nursing', intime: statuses==='Absent'?'-':'08:'+(i*5), outtime: '-', status: statuses[i] };
    })`
  },
  {
    path: 'hr/attendance/biometric', title: 'Biometric Attendance', desc: 'Raw data logs fetched from biometric/RFID machines.',
    cols: ['Log ID', 'Emp ID', 'Device Location', 'Punch Time', 'Punch Type', 'Status'],
    stats: [{ label: 'Total Punches Today', val: '1,560', col: 'text-blue-400' }, { label: 'Sync Status', val: 'Online', col: 'text-emerald-400' }, { label: 'Failed Scans', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { logid: 'LOG-' + (9001+i), empid: 'EMP-' + (1001+i), devicelocation: 'Main Gate', punchtime: '08:' + (10+i), punchtype: 'In', status: 'Synced' };
    })`
  },
  {
    path: 'hr/attendance/corrections', title: 'Attendance Corrections', desc: 'Requests from staff to fix missed punches or erroneous data.',
    cols: ['Req ID', 'Emp Name', 'Date', 'Original Time', 'Requested Time', 'Status'],
    stats: [{ label: 'Pending Approvals', val: '18', col: 'text-amber-400' }, { label: 'Approved Today', val: '45', col: 'text-emerald-400' }, { label: 'Rejected', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Rejected', 'Approved'];
      return { reqid: 'COR-' + (1001+i), empname: 'Staff ' + (1+i), date: 'Yesterday', originaltime: 'Missed', requestedtime: '17:30', status: statuses[i] };
    })`
  },
  {
    path: 'hr/attendance/regularization', title: 'Regularization', desc: 'Manager approvals for on-duty travel or client visits treated as present.',
    cols: ['Reg ID', 'Emp Name', 'Date', 'Reason', 'Manager', 'Status'],
    stats: [{ label: 'Pending Regularization', val: '12', col: 'text-amber-400' }, { label: 'Approved (Week)', val: '85', col: 'text-emerald-400' }, { label: 'Avg TAT', val: '24 Hrs', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { regid: 'REG-' + (2001+i), empname: 'Staff ' + (1+i), date: '01 Jul 2026', reason: 'Camp Duty', manager: 'Dr. Head', status: 'Approved' };
    })`
  },
  {
    path: 'hr/attendance/shift', title: 'Shift Attendance', desc: 'Attendance view filtered specifically for mapping against assigned shifts.',
    cols: ['Emp ID', 'Name', 'Assigned Shift', 'Actual In', 'Late By', 'Status'],
    stats: [{ label: 'Shift Compliance', val: '96%', col: 'text-emerald-400' }, { label: 'Late Comers', val: '32', col: 'text-amber-400' }, { label: 'Shift Mismatches', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===1?'Late In':(i===3?'Shift Mismatch':'On Time');
      return { empid: 'EMP-' + (1001+i), name: 'Staff ' + (1+i), assignedshift: 'Morning (08:00)', actualin: statuses==='Late In'?'08:45':'07:55', lateby: statuses==='Late In'?'45 Mins':'-', status: statuses };
    })`
  },

  // Shift Management
  {
    path: 'hr/shift/master', title: 'Shift Master', desc: 'Defining hospital shifts (Morning, Evening, Night, General).',
    cols: ['Shift Code', 'Shift Name', 'Start Time', 'End Time', 'Grace Period', 'Status'],
    stats: [{ label: 'Active Shifts', val: '6', col: 'text-blue-400' }, { label: 'Employees Mapped', val: '824', col: 'text-emerald-400' }, { label: '24/7 Coverage', val: 'Active', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const shifts = ['Morning', 'Evening', 'Night', 'General', 'Emergency Reliever'];
      const times = ['08:00 - 16:00', '16:00 - 00:00', '00:00 - 08:00', '09:00 - 18:00', 'Flexi'];
      return { shiftcode: 'SHF-' + (1+i), shiftname: shifts[i], starttime: times[i].split(' - ')[0], endtime: times[i].split(' - ')[1] || 'Flexi', graceperiod: '15 Mins', status: 'Active' };
    })`
  },
  {
    path: 'hr/shift/roster', title: 'Duty Roster', desc: 'Monthly or weekly scheduling of staff across different shifts.',
    cols: ['Department', 'Week', 'Published By', 'Published Date', 'Conflicts', 'Status'],
    stats: [{ label: 'Rosters Published', val: '12/15', col: 'text-blue-400' }, { label: 'Draft Rosters', val: '3', col: 'text-amber-400' }, { label: 'Coverage Gaps', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['ICU Nursing', 'ER Staff', 'Security', 'Pharmacy', 'Housekeeping'];
      const statuses = i===1?'Draft':'Published';
      return { department: depts[i], week: 'W2 July 2026', publishedby: 'Dept Head', publisheddate: statuses==='Published'?'Today':'-', conflicts: '0', status: statuses };
    })`
  },
  {
    path: 'hr/shift/allocation', title: 'Shift Allocation', desc: 'Individual employee view of their assigned shifts.',
    cols: ['Emp ID', 'Name', 'Current Shift', 'Next Shift', 'Allocation Date', 'Status'],
    stats: [{ label: 'Unassigned Staff', val: '4', col: 'text-red-400' }, { label: 'Allocations Active', val: '820', col: 'text-emerald-400' }, { label: 'Changes Requested', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empid: 'EMP-' + (1001+i), name: 'Staff ' + (1+i), currentshift: 'Morning', nextshift: 'Evening', allocationdate: '01 Jul 2026', status: 'Active' };
    })`
  },
  {
    path: 'hr/shift/swap', title: 'Shift Swap', desc: 'Requests by employees to exchange shifts with colleagues.',
    cols: ['Req ID', 'Initiator', 'Requested Staff', 'Date', 'Shift Exchanged', 'Status'],
    stats: [{ label: 'Pending Swaps', val: '8', col: 'text-amber-400' }, { label: 'Approved (Week)', val: '34', col: 'text-emerald-400' }, { label: 'Rejected', val: '5', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Manager', 'Approved', 'Pending Peer', 'Rejected', 'Approved'];
      return { reqid: 'SWP-' + (1001+i), initiator: 'Staff A', requestedstaff: 'Staff B', date: 'Tomorrow', shiftexchanged: 'Morning <-> Evening', status: statuses[i] };
    })`
  },
  {
    path: 'hr/shift/overtime', title: 'Overtime Management', desc: 'Tracking and approval of extra hours worked beyond the shift.',
    cols: ['OT ID', 'Emp Name', 'Date', 'Extra Hours', 'Reason', 'Status'],
    stats: [{ label: 'Total OT Hours (Mo)', val: '345 Hrs', col: 'text-blue-400' }, { label: 'Pending Approvals', val: '24', col: 'text-amber-400' }, { label: 'Approved Value', val: '$4,200', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { otid: 'OT-' + (2001+i), empname: 'Staff ' + (1+i), date: 'Yesterday', extrahours: (1.5+i*0.5) + ' Hrs', reason: 'Staff Shortage', status: i===0?'Pending Auth':'Approved' };
    })`
  },
  {
    path: 'hr/shift/night', title: 'Night Shift', desc: 'Specific tracking for night shift allowances and regulatory compliance.',
    cols: ['Emp ID', 'Name', 'Nights This Month', 'Consecutive Nights', 'Allowance', 'Status'],
    stats: [{ label: 'Staff on Night Duty', val: '145', col: 'text-blue-400' }, { label: 'Regulatory Breaches', val: '0', col: 'text-emerald-400' }, { label: 'Total Allowance', val: '$2,400', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const breaches = (3+i) > 4 ? 'Policy Breach Warning' : 'Compliant';
      return { empid: 'EMP-' + (3001+i), name: 'Staff ' + (1+i), nightsthismonth: (4+i*2).toString(), consecutivenights: (1+i).toString(), allowance: '$' + (100+i*50), status: breaches };
    })`
  },

  // Leave Management
  {
    path: 'hr/leave/requests', title: 'Leave Requests', desc: 'Incoming applications from staff for vacation, sick, or casual leave.',
    cols: ['Req ID', 'Emp Name', 'Leave Type', 'From Date', 'To Date', 'Status'],
    stats: [{ label: 'Pending Requests', val: '45', col: 'text-amber-400' }, { label: 'Approved Today', val: '18', col: 'text-emerald-400' }, { label: 'Staff on Leave', val: '29', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Rejected', 'Approved'];
      const types = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Comp Off', 'Sick Leave'];
      return { reqid: 'LEV-' + (1001+i), empname: 'Staff ' + (1+i), leavetype: types[i], fromdate: '10 Jul 2026', todate: '12 Jul 2026', status: statuses[i] };
    })`
  },
  {
    path: 'hr/leave/approval', title: 'Leave Approval', desc: 'Manager dashboard for approving or rejecting leave based on roster impact.',
    cols: ['Req ID', 'Emp Name', 'Dept', 'Days Requested', 'Coverage Plan', 'Status'],
    stats: [{ label: 'Leaves to Approve', val: '12', col: 'text-amber-400' }, { label: 'Roster Conflicts', val: '2', col: 'text-red-400' }, { label: 'Avg TAT', val: '1.5 Days', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reqid: 'LEV-' + (2001+i), empname: 'Staff ' + (1+i), dept: 'Nursing', daysrequested: (2+i).toString(), coverageplan: 'Staff B substituting', status: 'Pending Review' };
    })`
  },
  {
    path: 'hr/leave/calendar', title: 'Leave Calendar', desc: 'Visual calendar showing all approved leaves across the hospital.',
    cols: ['Date', 'Department', 'Staff on Leave', 'Critical Shortages', 'Manager', 'Status'],
    stats: [{ label: 'Peak Leave Period', val: 'December', col: 'text-blue-400' }, { label: 'Shortage Alerts', val: '0', col: 'text-emerald-400' }, { label: 'Max Allowed/Day', val: '10%', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: (10+i) + ' Jul 2026', department: 'ICU', staffonleave: (2+i).toString(), criticalshortages: 'None', manager: 'Dr. Head', status: 'Optimal Coverage' };
    })`
  },
  {
    path: 'hr/leave/balance', title: 'Leave Balance', desc: 'Tracking accrued, consumed, and remaining leave quotas per employee.',
    cols: ['Emp ID', 'Name', 'Annual', 'Sick', 'Casual', 'Status'],
    stats: [{ label: 'Total Liability (Days)', val: '4,500', col: 'text-amber-400' }, { label: 'Encashment Due', val: '$12,000', col: 'text-blue-400' }, { label: 'Negative Balances', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empid: 'EMP-' + (1001+i), name: 'Staff ' + (1+i), annual: (10-i).toString(), sick: (5-i).toString(), casual: (3-i).toString(), status: 'Active' };
    })`
  },
  {
    path: 'hr/leave/holidays', title: 'Holiday Calendar', desc: 'Hospital-wide list of public holidays and mandatory working days.',
    cols: ['Date', 'Holiday Name', 'Type', 'Applicable To', 'OT Rule', 'Status'],
    stats: [{ label: 'Upcoming Holiday', val: 'Independence Day', col: 'text-blue-400' }, { label: 'Total Holidays (Yr)', val: '12', col: 'text-emerald-400' }, { label: 'Restricted Holidays', val: '2', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Republic Day', 'Holi', 'Good Friday', 'Independence Day', 'Diwali'];
      return { date: '2026', holidayname: names[i], type: 'National', applicableto: 'All Staff', otrule: 'Double Pay for Clinical', status: i>2?'Upcoming':'Passed' };
    })`
  },

  // Payroll
  {
    path: 'hr/payroll/structure', title: 'Salary Structure', desc: 'Defining CTC breakdowns: Basic, HRA, Allowances for different bands.',
    cols: ['Band/Grade', 'Basic %', 'HRA %', 'Special Allowance', 'PF Rule', 'Status'],
    stats: [{ label: 'Total Bands', val: '15', col: 'text-blue-400' }, { label: 'Structures Defined', val: '100%', col: 'text-emerald-400' }, { label: 'Pending Updates', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { bandgrade: 'Grade ' + String.fromCharCode(65+i), basic: '40%', hra: '20%', specialallowance: 'Balance', pfrule: 'On Basic', status: 'Active' };
    })`
  },
  {
    path: 'hr/payroll/processing', title: 'Payroll Processing', desc: 'Monthly calculation engine factoring attendance, OT, leaves, and deductions.',
    cols: ['Month', 'Processed By', 'Total Emp Processed', 'Total Payout', 'Verification', 'Status'],
    stats: [{ label: 'Current Month', val: 'June 2026', col: 'text-blue-400' }, { label: 'Processing Status', val: 'Completed', col: 'text-emerald-400' }, { label: 'Errors Flagged', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===0?'In Progress':'Processed';
      return { month: 'June 2026', processedby: 'HR Payroll', totalempprocessed: i===0?'500/824':'824', totalpayout: i===0?'-':'$450,000', verification: i===0?'Pending':'Done', status: statuses };
    })`
  },
  {
    path: 'hr/payroll/slips', title: 'Salary Slips', desc: 'Generated payslips for employees, available for view and download.',
    cols: ['Emp ID', 'Name', 'Month', 'Net Pay', 'Generated On', 'Status'],
    stats: [{ label: 'Slips Generated', val: '824', col: 'text-emerald-400' }, { label: 'Downloads (Mo)', val: '1,200', col: 'text-blue-400' }, { label: 'Discrepancies Raised', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empid: 'EMP-' + (1001+i), name: 'Staff ' + (1+i), month: 'May 2026', netpay: '$' + (3000+i*500), generatedon: '01 Jun 2026', status: 'Published' };
    })`
  },
  {
    path: 'hr/payroll/bonus', title: 'Bonus', desc: 'Calculation and disbursement of annual or performance bonuses.',
    cols: ['Bonus Type', 'Applicable FY', 'Eligible Staff', 'Total Payout', 'Disbursement Date', 'Status'],
    stats: [{ label: 'Upcoming Bonus', val: 'Diwali Bonus', col: 'text-blue-400' }, { label: 'Total Liability', val: '$120,000', col: 'text-amber-400' }, { label: 'Disbursed (YTD)', val: '$50,000', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Annual Performance', 'Festival Bonus', 'Retention Bonus', 'Referral Bonus', 'Special Award'];
      return { bonustype: types[i], applicablefy: '2025-26', eligiblestaff: (100+i*50).toString(), totalpayout: '$' + (20000+i*10000), disbursementdate: '31 Oct 2026', status: i>1?'Disbursed':'Pending Calc' };
    })`
  },
  {
    path: 'hr/payroll/incentives', title: 'Incentives', desc: 'Variable pay for doctors, sales, or collections teams based on targets.',
    cols: ['Emp Name', 'Target Metric', 'Achieved', 'Incentive Amount', 'Month', 'Status'],
    stats: [{ label: 'Total Incentives (Mo)', val: '$45,000', col: 'text-blue-400' }, { label: 'Top Earner', val: 'Dr. Smith', col: 'text-emerald-400' }, { label: 'Pending Approval', val: '15', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empname: 'Staff ' + (1+i), targetmetric: 'OPD Consults', achieved: (120+i*20).toString(), incentiveamount: '$' + (500+i*100), month: 'June 2026', status: 'Approved' };
    })`
  },
  {
    path: 'hr/payroll/deductions', title: 'Deductions', desc: 'Logs of salary cuts for LWOP (Leave Without Pay), fines, or loan EMIs.',
    cols: ['Emp Name', 'Deduction Type', 'Amount', 'Month', 'Remarks', 'Status'],
    stats: [{ label: 'Total Deductions (Mo)', val: '$12,400', col: 'text-amber-400' }, { label: 'LWOP Days', val: '45', col: 'text-red-400' }, { label: 'Loan Recoveries', val: '$4,500', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['LWOP', 'Staff Loan EMI', 'Canteen Dues', 'Uniform Recovery', 'Damage Fine'];
      return { empname: 'Staff ' + (1+i), deductiontype: types[i], amount: '$' + (50+i*20), month: 'June 2026', remarks: 'As per policy', status: 'Processed' };
    })`
  },
  {
    path: 'hr/payroll/reimbursements', title: 'Reimbursements', desc: 'Payout of approved employee expenses along with the salary.',
    cols: ['Claim ID', 'Emp Name', 'Claim Type', 'Approved Amount', 'Payout Month', 'Status'],
    stats: [{ label: 'Pending Payout', val: '$8,500', col: 'text-amber-400' }, { label: 'Paid (Mo)', val: '$12,000', col: 'text-emerald-400' }, { label: 'Avg Claim TAT', val: '5 Days', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { claimid: 'CLM-' + (1001+i), empname: 'Staff ' + (1+i), claimtype: 'Travel', approvedamount: '$' + (150+i*50), payoutmonth: 'June 2026', status: 'Paid' };
    })`
  },
  {
    path: 'hr/payroll/fnf', title: 'Full & Final Settlement', desc: 'Final financial clearance calculation for departing employees.',
    cols: ['Exit ID', 'Emp Name', 'Last Working Day', 'FnF Amount', 'Clearance', 'Status'],
    stats: [{ label: 'Pending FnF', val: '8', col: 'text-amber-400' }, { label: 'Settled (YTD)', val: '45', col: 'text-emerald-400' }, { label: 'Avg Settlement Time', val: '28 Days', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Calc', 'Approved', 'Hold (Assets)', 'Settled', 'Settled'];
      return { exitid: 'EXT-' + (4001+i), empname: 'Employee ' + (1+i), lastworkingday: '31 May 2026', fnfamount: statuses==='Hold (Assets)'?'-':('$'+(2000+i*500)), clearance: statuses==='Hold (Assets)'?'IT Pending':'Done', status: statuses };
    })`
  },

  // Performance Management
  {
    path: 'hr/performance/kpi', title: 'KPI Management', desc: 'Setting Key Performance Indicators for various departments and roles.',
    cols: ['Role/Dept', 'KPI Name', 'Target', 'Weightage', 'Measurement Freq', 'Status'],
    stats: [{ label: 'Total KPIs Set', val: '145', col: 'text-blue-400' }, { label: 'Roles Covered', val: '95%', col: 'text-emerald-400' }, { label: 'Needs Update', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const kpis = ['Patient Satisfaction', 'Infection Rate', 'Billing Accuracy', 'OT Turnaround', 'Bed Turnaround'];
      return { roledept: 'Nursing', kpiname: kpis[i], target: '> 90%', weightage: '20%', measurementfreq: 'Monthly', status: 'Active' };
    })`
  },
  {
    path: 'hr/performance/review', title: 'Performance Review', desc: 'Periodic check-ins and scoring between employees and managers.',
    cols: ['Review ID', 'Emp Name', 'Manager', 'Period', 'Self Score', 'Mgr Score', 'Status'],
    stats: [{ label: 'Current Cycle', val: 'Mid-Year 2026', col: 'text-blue-400' }, { label: 'Reviews Completed', val: '75%', col: 'text-emerald-400' }, { label: 'Pending Manager', val: '45', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'Pending Manager', 'Pending Self', 'Completed', 'Completed'];
      return { reviewid: 'REV-' + (1001+i), empname: 'Staff ' + (1+i), manager: 'Dr. Head', period: 'H1 2026', selfscore: statuses==='Pending Self'?'-':'4.2/5', mgrscore: statuses==='Completed'?'4.0/5':'-', status: statuses[i] };
    })`
  },
  {
    path: 'hr/performance/appraisals', title: 'Appraisals', desc: 'Annual rating finalization leading to increments or promotions.',
    cols: ['Appraisal ID', 'Emp Name', 'Final Rating', 'Recommendation', 'HR Action', 'Status'],
    stats: [{ label: 'Appraisal Cycle', val: 'Closed', col: 'text-emerald-400' }, { label: 'Avg Rating', val: '3.8/5', col: 'text-blue-400' }, { label: 'Top Performers', val: '12%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { appraisalid: 'APR-' + (2001+i), empname: 'Staff ' + (1+i), finalrating: (3.5+i*0.3).toFixed(1) + '/5', recommendation: i===4?'Promotion':'Standard Increment', hraction: 'Processed', status: 'Finalized' };
    })`
  },
  {
    path: 'hr/performance/promotions', title: 'Promotions', desc: 'Tracking staff elevation to higher bands or designations.',
    cols: ['Emp Name', 'Old Designation', 'New Designation', 'Effective Date', 'Approver', 'Status'],
    stats: [{ label: 'Promotions (YTD)', val: '34', col: 'text-blue-400' }, { label: 'Pending Final Auth', val: '5', col: 'text-amber-400' }, { label: 'Fast Track', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empname: 'Staff ' + (1+i), olddesignation: 'Junior Nurse', newdesignation: 'Senior Nurse', effectivedate: '01 Apr 2026', approver: 'Management Board', status: 'Approved' };
    })`
  },
  {
    path: 'hr/performance/increment', title: 'Increment History', desc: 'Historical log of salary hikes across the organization.',
    cols: ['Emp Name', 'Year', 'Previous CTC', 'Hike %', 'New CTC', 'Status'],
    stats: [{ label: 'Avg Hike (2026)', val: '8.5%', col: 'text-blue-400' }, { label: 'Highest Hike', val: '18%', col: 'text-emerald-400' }, { label: 'Zero Increments', val: '5%', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { empname: 'Staff ' + (1+i), year: '2026', previousctc: '$' + (30000+i*5000), hike: (5+i) + '%', newctc: '$' + ((30000+i*5000) * (1 + (5+i)/100)).toFixed(0), status: 'Applied' };
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
        const isGood = val === 'Active' || val === 'Verified' || val === 'Completed' || val === 'Approved' || val === 'Selected' || val === 'Accepted' || val === 'Done' || val === 'On Track' || val === 'Present' || val === 'Synced' || val === 'On Time' || val === 'Published' || val === 'Optimal Coverage' || val === 'Processed' || val === 'Disbursed' || val === 'Paid' || val === 'Settled' || val === 'Finalized' || val === 'Applied' || val === 'Compliant';
        const isWarning = val === 'On Leave' || val === 'Pending' || val === 'Pending Verification' || val === 'Pending Print' || val === 'Pending Approval' || val === 'Serving Notice' || val === 'Clearance Pending' || val === 'Screening' || val === 'Interview Scheduled' || val === 'Scheduled' || val === 'Pending Feedback' || val === 'Pending Response' || val === 'Pre-Onboarding' || val === 'In Progress' || val === 'Delayed' || val === 'Review Pending' || val === 'Late In' || val === 'Half Day' || val === 'Pending Auth' || val === 'Draft' || val === 'Pending Manager' || val === 'Pending Peer' || val === 'Pending Review' || val === 'Pending Calc' || val === 'Pending Self';
        const isNeutral = val === 'Allocated' || val === 'Assigned';
        const isDanger = val === 'Suspended' || val === 'Expired' || val === 'Blocked' || val === 'Rejected' || val === 'Closed' || val === 'No Show' || val === 'Declined' || val === 'Absent' || val === 'Shift Mismatch' || val === 'Policy Breach Warning' || val === 'Hold (Assets)';
        
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
