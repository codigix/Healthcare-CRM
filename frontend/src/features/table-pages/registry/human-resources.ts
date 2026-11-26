import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/hr/analytics/attendance": {
    ui: 5,
    title: "Attendance Analytics", description: "Identifying chronic absenteeism, frequent latecomers, and OT patterns.",
    stats: [{ label: "Chronic Absentees", color: "text-red-400", value: "8" }, { label: "Habitual Latecomers", color: "text-amber-400", value: "24" }, { label: "OT Dependency", color: "text-amber-400", value: "High in ER" }],
    columns: [["Pattern Identified", "patternidentified"], ["Affected Staff", "affectedstaff"], ["Impact", "impact"], ["Suggested Action", "suggestedaction"]],
    badge: ["Status", "status", {"Action Needed":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const patterns = ['Monday Absenteeism', 'Late after night shift', 'Excessive OT in Ward B', 'Unplanned Leaves (Weekends)', 'Short hours worked'];
        return { patternidentified: patterns[i], affectedstaff: (10 + i * 2).toString(), impact: 'High', suggestedaction: 'Review Rosters', status: 'Action Needed' };
      }),
  },
  "/hr/analytics/attrition": {
    ui: 5,
    title: "Predictive Attrition", description: "Machine learning model highlighting flight risks based on commute, pay, and leaves.",
    stats: [{ label: "High Flight Risk", color: "text-red-400", value: "12 Staff" }, { label: "Top Driver", color: "text-amber-400", value: "Stagnant Pay" }, { label: "Retention Success", color: "text-emerald-400", value: "65%" }],
    columns: [["Emp Name", "empname"], ["Department", "department"], ["Flight Risk", "flightrisk"], ["Key Driver", "keydriver"], ["Intervention", "intervention"]],
    badge: ["Status", "status", {"Intervention Needed":"blue","Monitored":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const risks = ['High', 'Medium', 'High', 'Low', 'Medium'];
        const drivers = ['Commute Distance', 'No Promotion in 3 Yrs', 'Low Manager Rating', '-', 'Salary below market'];
        return { empname: 'Staff ' + (1 + i), department: 'Nursing', flightrisk: risks[i], keydriver: drivers[i], intervention: 'Schedule 1:1', status: risks[i] === 'High' ? 'Intervention Needed' : 'Monitored' };
      }),
  },
  "/hr/analytics/department": {
    ui: 5,
    title: "Department Analytics", description: "Comparing HR metrics (cost, attrition, performance) across different departments.",
    stats: [{ label: "Largest Dept", color: "text-blue-400", value: "Nursing (45%)" }, { label: "Highest Cost", color: "text-amber-400", value: "Doctors (40%)" }, { label: "Best Retention", color: "text-emerald-400", value: "Administration" }],
    columns: [["Department", "department"], ["Headcount", "headcount"], ["Salary Cost %", "salarycost"], ["Attrition %", "attrition"], ["Avg Performance", "avgperformance"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Nursing', 'Doctors', 'Administration', 'Support Staff', 'IT'];
        return { department: depts[i], headcount: (300 - i * 50).toString(), salarycost: (30 - i * 3) + '%', attrition: (15 - i) + '%', avgperformance: '3.' + (8 + i) + '/5', status: 'Analyzed' };
      }),
  },
  "/hr/analytics/payroll": {
    ui: 5,
    title: "Payroll Analytics", description: "Tracking compensation costs, benefits utilization, and overtime budget variance.",
    stats: [{ label: "Total HR Cost", color: "text-blue-400", value: "$5.4M (YTD)" }, { label: "OT Overrun", color: "text-red-400", value: "$45,000" }, { label: "Cost Per Bed", color: "text-emerald-400", value: "$1,200" }],
    columns: [["Cost Center", "costcenter"], ["Budgeted Payroll", "budgetedpayroll"], ["Actual Payroll", "actualpayroll"], ["Variance", "variance"], ["OT % of Cost", "otofcost"]],
    badge: ["Status", "status", {"Over Budget":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const centers = ['Clinical', 'Nursing', 'Admin', 'Support', 'IT'];
        return { costcenter: centers[i], budgetedpayroll: '$' + (100000 - i * 10000), actualpayroll: '$' + (105000 - i * 10000), variance: '+5%', otcost: (2 + i) + '%', status: 'Over Budget' };
      }),
  },
  "/hr/analytics/recruitment": {
    ui: 5,
    title: "Recruitment Analytics", description: "AI-driven insights on which sourcing channels yield the best long-term employees.",
    stats: [{ label: "Best Source", color: "text-emerald-400", value: "Referrals" }, { label: "Highest Cost", color: "text-red-400", value: "Agencies" }, { label: "Fastest Source", color: "text-blue-400", value: "Job Portals" }],
    columns: [["Source Channel", "sourcechannel"], ["Hires (YTD)", "hiresytd"], ["Cost/Hire", "costhire"], ["Avg Tenure", "avgtenure"], ["Performance Avg", "performanceavg"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const sources = ['Employee Referral', 'LinkedIn', 'Agency/Consultant', 'Direct Apply', 'Campus'];
        return { sourcechannel: sources[i], hiresytd: (20 - i * 2).toString(), costhire: '$' + (100 + i * 100), avgtenure: (3 - i * 0.5) + ' Yrs', performanceavg: '4.' + (2 - i) + '/5', status: 'Analyzed' };
      }),
  },
  "/hr/analytics/workforce": {
    ui: 5,
    title: "Workforce Dashboard", description: "High-level executive dashboard showing diversity, age, and tenure demographics.",
    stats: [{ label: "Gender Ratio (M:F)", color: "text-blue-400", value: "45:55" }, { label: "Avg Age", color: "text-emerald-400", value: "34 Yrs" }, { label: "Contract vs Permanent", color: "text-amber-400", value: "20:80" }],
    columns: [["Metric", "metric"], ["Current Value", "currentvalue"], ["Previous Period", "previousperiod"], ["Variance", "variance"]],
    badge: ["Status", "status", {"Stable":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['Total Headcount', 'Full-Time Equivalents (FTE)', 'Diversity Index', 'Avg Tenure', 'New Hire Retention (90D)'];
        return { metric: metrics[i], currentvalue: 'Data Point ' + i, previousperiod: 'Data Point ' + i, variance: '+2%', status: 'Stable' };
      }),
  },
  "/hr/attendance/biometric": {
    ui: 5,
    title: "Biometric Attendance", description: "Raw data logs fetched from biometric/RFID machines.",
    stats: [{ label: "Total Punches Today", color: "text-blue-400", value: "1,560" }, { label: "Sync Status", color: "text-emerald-400", value: "Online" }, { label: "Failed Scans", color: "text-red-400", value: "12" }],
    columns: [["Log ID", "logid"], ["Emp ID", "empid"], ["Device Location", "devicelocation"], ["Punch Time", "punchtime"], ["Punch Type", "punchtype"]],
    badge: ["Status", "status", {"Synced":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { logid: 'LOG-' + (9001 + i), empid: 'EMP-' + (1001 + i), devicelocation: 'Main Gate', punchtime: '08:' + (10 + i), punchtype: 'In', status: 'Synced' };
      }),
  },
  "/hr/attendance/corrections": {
    ui: 5,
    title: "Attendance Corrections", description: "Requests from staff to fix missed punches or erroneous data.",
    stats: [{ label: "Pending Approvals", color: "text-amber-400", value: "18" }, { label: "Approved Today", color: "text-emerald-400", value: "45" }, { label: "Rejected", color: "text-red-400", value: "2" }],
    columns: [["Req ID", "reqid"], ["Emp Name", "empname"], ["Date", "date"], ["Original Time", "originaltime"], ["Requested Time", "requestedtime"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Approved":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Rejected', 'Approved'];
        return { reqid: 'COR-' + (1001 + i), empname: 'Staff ' + (1 + i), date: 'Yesterday', originaltime: 'Missed', requestedtime: '17:30', status: statuses[i] };
      }),
  },
  "/hr/attendance/daily": {
    ui: 5,
    title: "Daily Attendance", description: "Real-time dashboard of who is present, absent, or on leave today.",
    stats: [{ label: "Present Today", color: "text-emerald-400", value: "780" }, { label: "Absent", color: "text-red-400", value: "15" }, { label: "On Leave", color: "text-amber-400", value: "29" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["Department", "department"], ["In Time", "intime"], ["Out Time", "outtime"]],
    badge: ["Status", "status", {"Present":"emerald","Late In":"amber","Absent":"red","Half Day":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Present', 'Late In', 'Absent', 'Present', 'Half Day'];
        return { empid: 'EMP-' + (1001 + i), name: 'Staff ' + (1 + i), department: 'Nursing', intime: statuses[i] === 'Absent' ? '-' : '08:' + (i * 5), outtime: '-', status: statuses[i] };
      }),
  },
  "/hr/attendance/regularization": {
    ui: 5,
    title: "Regularization", description: "Manager approvals for on-duty travel or client visits treated as present.",
    stats: [{ label: "Pending Regularization", color: "text-amber-400", value: "12" }, { label: "Approved (Week)", color: "text-emerald-400", value: "85" }, { label: "Avg TAT", color: "text-blue-400", value: "24 Hrs" }],
    columns: [["Reg ID", "regid"], ["Emp Name", "empname"], ["Date", "date"], ["Reason", "reason"], ["Manager", "manager"]],
    badge: ["Status", "status", {"Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { regid: 'REG-' + (2001 + i), empname: 'Staff ' + (1 + i), date: '01 Jul 2026', reason: 'Camp Duty', manager: 'Dr. Head', status: 'Approved' };
      }),
  },
  "/hr/attendance/shift": {
    ui: 5,
    title: "Shift Attendance", description: "Attendance view filtered specifically for mapping against assigned shifts.",
    stats: [{ label: "Shift Compliance", color: "text-emerald-400", value: "96%" }, { label: "Late Comers", color: "text-amber-400", value: "32" }, { label: "Shift Mismatches", color: "text-red-400", value: "4" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["Assigned Shift", "assignedshift"], ["Actual In", "actualin"], ["Late By", "lateby"]],
    badge: ["Status", "status", {"On Time":"emerald","Late In":"amber","Shift Mismatch":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i === 1 ? 'Late In' : (i === 3 ? 'Shift Mismatch' : 'On Time');
        return { empid: 'EMP-' + (1001 + i), name: 'Staff ' + (1 + i), assignedshift: 'Morning (08:00)', actualin: statuses === 'Late In' ? '08:45' : '07:55', lateby: statuses === 'Late In' ? '45 Mins' : '-', status: statuses };
      }),
  },
  "/hr/claims/expense": {
    ui: 5,
    title: "General Expense Claims", description: "Reimbursement for mobile bills, internet, or petty departmental purchases.",
    stats: [{ label: "Pending Claims", color: "text-amber-400", value: "8" }, { label: "Approved (Week)", color: "text-blue-400", value: "45" }, { label: "Rejected", color: "text-red-400", value: "2" }],
    columns: [["Claim ID", "claimid"], ["Emp Name", "empname"], ["Expense Category", "expensecategory"], ["Amount Claimed", "amountclaimed"], ["Date", "date"]],
    badge: ["Status", "status", {"Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['Mobile/Internet', 'Team Lunch', 'Stationery', 'Mobile/Internet', 'Relocation'];
        return { claimid: 'EXP-' + (3001 + i), empname: 'Staff ' + (1 + i), expensecategory: cats[i], amountclaimed: '$' + (50 + i * 20), date: 'Yesterday', status: 'Approved' };
      }),
  },
  "/hr/claims/medical": {
    ui: 5,
    title: "Medical Reimbursements", description: "OPD/IPD expense claims for staff and dependents under hospital policy.",
    stats: [{ label: "Pending Approvals", color: "text-amber-400", value: "24" }, { label: "Total Liability", color: "text-amber-400", value: "$18,500" }, { label: "Processed (YTD)", color: "text-emerald-400", value: "$145,000" }],
    columns: [["Claim ID", "claimid"], ["Emp Name", "empname"], ["Patient", "patient"], ["Hospital/Clinic", "hospitalclinic"], ["Claim Amount", "claimamount"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Processed":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { claimid: 'MED-' + (2001 + i), empname: 'Staff ' + (1 + i), patient: 'Spouse', hospitalclinic: 'Internal', claimamount: '$' + (200 + i * 50), status: i < 2 ? 'Pending Auth' : 'Processed' };
      }),
  },
  "/hr/claims/travel": {
    ui: 5,
    title: "Travel Claims", description: "Reimbursement for official travel, conferences, or camp duties.",
    stats: [{ label: "Pending Claims", color: "text-amber-400", value: "15" }, { label: "Claim Value", color: "text-amber-400", value: "$4,500" }, { label: "Approved (Mo)", color: "text-emerald-400", value: "$12,000" }],
    columns: [["Claim ID", "claimid"], ["Emp Name", "empname"], ["Travel Purpose", "travelpurpose"], ["Amount Claimed", "amountclaimed"], ["Date", "date"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Approved":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Rejected', 'Approved'];
        return { claimid: 'TRV-' + (1001 + i), empname: 'Staff ' + (1 + i), travelpurpose: 'Medical Conference', amountclaimed: '$' + (500 + i * 100), date: '01 Jul 2026', status: statuses[i] };
      }),
  },
  "/hr/claims/workflow": {
    ui: 5,
    title: "Approval Workflow", description: "Manager/HOD view to approve, reject, or request more info on team claims.",
    stats: [{ label: "My Approvals Due", color: "text-amber-400", value: "12" }, { label: "Total Value", color: "text-amber-400", value: "$3,200" }, { label: "Escalated", color: "text-red-400", value: "1" }],
    columns: [["Claim ID", "claimid"], ["Emp Name", "empname"], ["Claim Type", "claimtype"], ["Amount", "amount"], ["Policy Limit", "policylimit"]],
    badge: ["Status", "status", {"Pending Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { claimid: 'CLM-' + (4001 + i), empname: 'Team Member ' + (1 + i), claimtype: 'Travel', amount: '$' + (150 + i * 50), policylimit: '$500', status: 'Pending Review' };
      }),
  },
  "/hr/communication/announcements": {
    ui: 5,
    title: "HR Announcements", description: "Broadcast messages for events, policy changes, or hospital news.",
    stats: [{ label: "Active Announcements", color: "text-blue-400", value: "4" }, { label: "Avg Read Rate", color: "text-emerald-400", value: "78%" }, { label: "Drafts", color: "text-gray-400", value: "2" }],
    columns: [["Announcement Title", "announcementtitle"], ["Date Posted", "dateposted"], ["Target Audience", "targetaudience"], ["Read Count", "readcount"], ["Posted By", "postedby"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { announcementtitle: 'Updated Leave Policy ' + (2026 - i), dateposted: '01 Jan 2026', targetaudience: 'All Staff', readcount: '650/824', postedby: 'HR Admin', status: 'Active' };
      }),
  },
  "/hr/communication/circulars": {
    ui: 5,
    title: "Circulars & Memos", description: "Formal, mandated communications requiring digital signatures or acknowledgments.",
    stats: [{ label: "Active Circulars", color: "text-blue-400", value: "2" }, { label: "Pending Acknowledgments", color: "text-amber-400", value: "124" }, { label: "Compliance", color: "text-emerald-400", value: "85%" }],
    columns: [["Circular ID", "circularid"], ["Subject", "subject"], ["Issue Date", "issuedate"], ["Mandatory Ack.", "mandatoryack"], ["Ack. Count", "ackcount"]],
    badge: ["Status", "status", {"Published":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { circularid: 'CIR-' + (2026001 + i), subject: 'Infection Control Protocol Update', issuedate: '01 Jun 2026', mandatoryack: 'Yes', ackcount: '700/824', status: 'Published' };
      }),
  },
  "/hr/communication/messages": {
    ui: 5,
    title: "Internal Messages", description: "Direct secure messaging between HR and individual employees.",
    stats: [{ label: "Unread Messages", color: "text-amber-400", value: "15" }, { label: "Total Sent (Mo)", color: "text-blue-400", value: "450" }, { label: "Avg Response Time", color: "text-emerald-400", value: "4 Hrs" }],
    columns: [["Message Subject", "messagesubject"], ["To/From", "tofrom"], ["Date & Time", "datetime"], ["Category", "category"], ["Attachments", "attachments"]],
    badge: ["Status", "status", {"Unread":"amber","Read":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i < 2 ? 'Unread' : 'Read';
        return { messagesubject: 'Query regarding payslip', tofrom: 'From: Staff ' + (1 + i), datetime: 'Today 10:00', category: 'Payroll', attachments: '1 File', status: statuses };
      }),
  },
  "/hr/communication/notices": {
    ui: 5,
    title: "Employee Notices", description: "Formal disciplinary notices, warnings, or show-cause letters.",
    stats: [{ label: "Open Notices", color: "text-red-400", value: "3" }, { label: "Responses Overdue", color: "text-red-400", value: "1" }, { label: "Closed (YTD)", color: "text-gray-400", value: "15" }],
    columns: [["Notice ID", "noticeid"], ["Emp Name", "empname"], ["Notice Type", "noticetype"], ["Issue Date", "issuedate"], ["Response Due", "responsedue"]],
    badge: ["Status", "status", {"Response Pending":"amber","Closed":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Warning Letter', 'Show Cause', 'Warning Letter', 'Termination Notice', 'Show Cause'];
        return { noticeid: 'NOT-' + (101 + i), empname: 'Staff ' + (1 + i), noticetype: types[i], issuedate: '10 Jun 2026', responsedue: '17 Jun 2026', status: i === 0 ? 'Response Pending' : 'Closed' };
      }),
  },
  "/hr/compliance/documents": {
    ui: 5,
    title: "Compliance Documents", description: "Hospital-level HR compliances like labor law registrations and PF/ESI challans.",
    stats: [{ label: "Upcoming Filings", color: "text-amber-400", value: "2" }, { label: "Compliant", color: "text-emerald-400", value: "100%" }, { label: "Overdue", color: "text-emerald-400", value: "0" }],
    columns: [["Document Type", "documenttype"], ["Period/Year", "periodyear"], ["Filing Date", "filingdate"], ["Next Due Date", "nextduedate"], ["Authority", "authority"]],
    badge: ["Status", "status", {"Filed":"emerald","Action Required":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['PF Return', 'ESI Return', 'PT Return', 'Labor License Renewal', 'Bonus Act Filing'];
        return { documenttype: types[i], periodyear: 'May 2026', filingdate: '10 Jun 2026', nextduedate: '15 Jul 2026', authority: 'Govt Portal', status: i === 4 ? 'Action Required' : 'Filed' };
      }),
  },
  "/hr/compliance/license": {
    ui: 5,
    title: "License Verification", description: "Primary Source Verification (PSV) of nursing and medical licenses.",
    stats: [{ label: "Verified Licenses", color: "text-emerald-400", value: "450" }, { label: "Pending PSV", color: "text-amber-400", value: "12" }, { label: "Flagged/Fake", color: "text-emerald-400", value: "0" }],
    columns: [["Emp Name", "empname"], ["License Type", "licensetype"], ["License No", "licenseno"], ["Council", "council"], ["Verification Date", "verificationdate"]],
    badge: ["Status", "status", {"Verified":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empname: 'Staff ' + (1 + i), licensetype: 'Nursing Registration', licenseno: 'NUR-100' + i, council: 'State Nursing Council', verificationdate: '01 Jan 2026', status: 'Verified' };
      }),
  },
  "/hr/compliance/nabh": {
    ui: 5,
    title: "NABH HR Compliance", description: "Specific tracker for NABH Chapter 6 (HRM) requirements.",
    stats: [{ label: "Overall HRM Score", color: "text-emerald-400", value: "92%" }, { label: "Open NCs", color: "text-red-400", value: "2" }, { label: "Audits Scheduled", color: "text-blue-400", value: "1" }],
    columns: [["Standard", "standard"], ["Description", "description"], ["Compliance %", "compliance"], ["Last Audit", "lastaudit"], ["Findings", "findings"]],
    badge: ["Status", "status", {"Action Required":"amber","Compliant":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const standards = ['HRM 1', 'HRM 2', 'HRM 3', 'HRM 4', 'HRM 5'];
        return { standard: standards[i], description: 'Staff planning & onboarding', compliance: (85 + i * 2) + '%', lastaudit: '15 Jan 2026', findings: i === 0 ? '1 Minor NC' : 'Nil', status: i === 0 ? 'Action Required' : 'Compliant' };
      }),
  },
  "/hr/compliance/registration": {
    ui: 5,
    title: "Medical Registration", description: "Tracking doctor registrations with national/state medical councils.",
    stats: [{ label: "Doctors Registered", color: "text-blue-400", value: "120" }, { label: "Expiring (90D)", color: "text-amber-400", value: "5" }, { label: "Non-Compliant", color: "text-emerald-400", value: "0" }],
    columns: [["Doctor Name", "doctorname"], ["Registration No", "registrationno"], ["Council Name", "councilname"], ["Valid Till", "validtill"], ["State", "state"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { doctorname: 'Dr. ' + (1 + i), registrationno: 'MCI-500' + i, councilname: 'Medical Council', validtill: '31 Dec 2028', state: 'Active State', status: 'Active' };
      }),
  },
  "/hr/compliance/training": {
    ui: 5,
    title: "Mandatory Trainings", description: "Tracking completion of statutorily required trainings (e.g., POSH, Fire Safety).",
    stats: [{ label: "Overall Compliance", color: "text-emerald-400", value: "88%" }, { label: "POSH Pending", color: "text-red-400", value: "45" }, { label: "BMW Pending", color: "text-red-400", value: "12" }],
    columns: [["Emp Name", "empname"], ["POSH Training", "poshtraining"], ["Fire Safety", "firesafety"], ["Bio-Medical Waste", "biomedicalwaste"], ["Info Security", "infosecurity"]],
    badge: ["Status", "status", {"Compliant":"emerald","Non-Compliant":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empname: 'Staff ' + (1 + i), poshtraining: i === 1 ? 'Pending' : 'Completed', firesafety: 'Completed', biomedicalwaste: 'Completed', infosecurity: 'Completed', status: i === 1 ? 'Non-Compliant' : 'Compliant' };
      }),
  },
  "/hr/compliance/vaccination": {
    ui: 5,
    title: "Staff Vaccination", description: "Mandatory tracking of Hep-B, COVID, and Flu shots for clinical staff.",
    stats: [{ label: "Fully Vaccinated", color: "text-emerald-400", value: "95%" }, { label: "Pending Hep-B", color: "text-red-400", value: "24" }, { label: "Doses Scheduled", color: "text-amber-400", value: "15" }],
    columns: [["Emp Name", "empname"], ["Department", "department"], ["Hep-B Status", "hepbstatus"], ["COVID Status", "covidstatus"], ["Next Dose Due", "nextdosedue"]],
    badge: ["Status", "status", {"Compliant":"emerald","Incomplete":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const hepb = i === 2 ? 'Dose 2 Pending' : 'Completed';
        return { empname: 'Staff ' + (1 + i), department: 'ICU', hepbstatus: hepb, covidstatus: 'Completed', nextdosedue: hepb === 'Completed' ? '-' : '15 Jul 2026', status: hepb === 'Completed' ? 'Compliant' : 'Incomplete' };
      }),
  },
  "/hr/employees/documents": {
    ui: 5,
    title: "Employee Documents", description: "Digital repository of KYC, educational, and professional certificates.",
    stats: [{ label: "Documents Uploaded", color: "text-blue-400", value: "4,200" }, { label: "Pending Verification", color: "text-amber-400", value: "45" }, { label: "Expired Documents", color: "text-red-400", value: "8" }],
    columns: [["Document Name", "documentname"], ["Document Type", "documenttype"], ["Upload Date", "uploaddate"], ["Expiry Date", "expirydate"], ["Verification", "verification"]],
    badge: ["Status", "status", {"Verified":"emerald","Pending Verification":"amber","Expired":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Aadhar Card', 'Medical License', 'Degree Certificate', 'Relieving Letter', 'PAN Card'];
        const statuses = i === 1 ? 'Pending Verification' : (i === 2 ? 'Expired' : 'Verified');
        return { documentname: types[i], documenttype: 'KYC/Compliance', uploaddate: '01 Jan 2026', expirydate: i === 2 ? '01 Jan 2026' : '-', verification: statuses === 'Verified' ? 'Approved' : 'Pending', status: statuses };
      }),
  },
  "/hr/employees/exit": {
    ui: 5,
    title: "Employee Exit", description: "Offboarding process, clearances, and full & final settlement tracking.",
    stats: [{ label: "Active Exits", color: "text-amber-400", value: "12" }, { label: "Clearances Pending", color: "text-red-400", value: "5" }, { label: "Alumni", color: "text-gray-400", value: "150" }],
    columns: [["Exit ID", "exitid"], ["Emp Name", "empname"], ["Resignation Date", "resignationdate"], ["Notice Period", "noticeperiod"], ["Last Working Day", "lastworkingday"]],
    badge: ["Status", "status", {"Serving Notice":"amber","Clearance Pending":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Serving Notice', 'Clearance Pending', 'Serving Notice', 'Completed', 'Serving Notice'];
        return { exitid: 'EXT-' + (4001 + i), empname: 'Employee ' + (1 + i), resignationdate: '01 Jun 2026', noticeperiod: '30 Days', lastworkingday: '30 Jun 2026', status: statuses[i] };
      }),
  },
  "/hr/employees/id-cards": {
    ui: 5,
    title: "Employee ID Cards", description: "Generation, tracking, and issuance of physical/digital ID cards.",
    stats: [{ label: "Active Cards", color: "text-emerald-400", value: "824" }, { label: "Pending Print", color: "text-amber-400", value: "15" }, { label: "Lost/Reissued", color: "text-gray-400", value: "5" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["Card Type", "cardtype"], ["Issue Date", "issuedate"], ["Validity", "validity"]],
    badge: ["Status", "status", {"Active":"emerald","Pending Print":"amber","Blocked":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active', 'Pending Print', 'Active', 'Blocked', 'Active'];
        return { empid: 'EMP-' + (2001 + i), name: 'Employee ' + (1 + i), cardtype: 'RFID Smart Card', issuedate: 'Today', validity: '31 Dec 2027', status: statuses[i] };
      }),
  },
  "/hr/employees/list": {
    ui: 5,
    title: "Employee Directory", description: "Central list of all active and inactive hospital staff.",
    stats: [{ label: "Total Employees", color: "text-blue-400", value: "850" }, { label: "Active Staff", color: "text-emerald-400", value: "824" }, { label: "On Leave", color: "text-amber-400", value: "15" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["Designation", "designation"], ["Department", "department"], ["Date of Joining", "dateofjoining"]],
    badge: ["Status", "status", {"Active":"emerald","On Leave":"amber","Suspended":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active', 'On Leave', 'Active', 'Suspended', 'Active'];
        const depts = ['Cardiology', 'Nursing', 'Administration', 'IT', 'Pharmacy'];
        return { empid: 'EMP-' + (1001 + i), name: 'Staff Member ' + (i + 1), designation: 'Designation ' + (i + 1), department: depts[i], dateofjoining: '01 Jan 20' + (20 + i), status: statuses[i] };
      }),
  },
  "/hr/employees/profile": {
    ui: 5,
    title: "Employee Profile", description: "Detailed view of an individual employee's personal and professional data.",
    stats: [{ label: "Profile Completeness", color: "text-emerald-400", value: "98%" }, { label: "Pending KYC", color: "text-amber-400", value: "12" }, { label: "Updates (Week)", color: "text-blue-400", value: "45" }],
    columns: [["Profile Field", "profilefield"], ["Details", "details"], ["Last Updated", "lastupdated"], ["Verified By", "verifiedby"]],
    badge: ["Status", "status", {"Verified":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const fields = ['Personal Details', 'Bank Information', 'Emergency Contact', 'Medical History', 'Academic Records'];
        return { profilefield: fields[i], details: 'Data encrypted', lastupdated: 'Today', verifiedby: 'HR Admin', status: 'Verified' };
      }),
  },
  "/hr/employees/transfer": {
    ui: 5,
    title: "Employee Transfer", description: "Internal movement of staff between departments or hospital branches.",
    stats: [{ label: "Transfers (YTD)", color: "text-blue-400", value: "34" }, { label: "Pending Approval", color: "text-amber-400", value: "4" }, { label: "Completed", color: "text-emerald-400", value: "30" }],
    columns: [["Transfer ID", "transferid"], ["Emp Name", "empname"], ["From Dept", "fromdept"], ["To Dept", "todept"], ["Effective Date", "effectivedate"]],
    badge: ["Status", "status", {"Completed":"emerald","Pending Approval":"amber","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'Pending Approval', 'Completed', 'Rejected', 'Completed'];
        return { transferid: 'TRF-' + (3001 + i), empname: 'Staff ' + (1 + i), fromdept: 'Ward A', todept: 'ICU', effectivedate: '15 Jul 2026', status: statuses[i] };
      }),
  },
  "/hr/health/checkups": {
    ui: 5,
    title: "Health Checkups", description: "Annual or pre-employment health screening records for staff.",
    stats: [{ label: "Checkups Done (YTD)", color: "text-blue-400", value: "450" }, { label: "Pending Annual", color: "text-amber-400", value: "120" }, { label: "Unfit/Review", color: "text-red-400", value: "5" }],
    columns: [["Emp Name", "empname"], ["Checkup Type", "checkuptype"], ["Date", "date"], ["Fitness Status", "fitnessstatus"], ["Reviewing Doctor", "reviewingdoctor"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empname: 'Staff ' + (1 + i), checkuptype: 'Annual Health Check', date: '01 Jun 2026', fitnessstatus: i === 3 ? 'Requires Review' : 'Fit', reviewingdoctor: 'Dr. Physician', status: 'Completed' };
      }),
  },
  "/hr/health/fitness": {
    ui: 5,
    title: "Fitness Certificates", description: "Return-to-work clearances after prolonged illness or maternity leave.",
    stats: [{ label: "Pending Clearances", color: "text-amber-400", value: "3" }, { label: "Cleared (Mo)", color: "text-emerald-400", value: "8" }, { label: "Maternity Returns", color: "text-blue-400", value: "2" }],
    columns: [["Emp Name", "empname"], ["Leave Type", "leavetype"], ["Leave Duration", "leaveduration"], ["Fitness Date", "fitnessdate"], ["Cleared By", "clearedby"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Cleared":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empname: 'Staff ' + (1 + i), leavetype: i === 1 ? 'Maternity Leave' : 'Medical Leave', leaveduration: i === 1 ? '180 Days' : '15 Days', fitnessdate: 'Today', clearedby: 'CMO', status: i === 0 ? 'Pending Auth' : 'Cleared' };
      }),
  },
  "/hr/health/injury": {
    ui: 5,
    title: "Injury & Incident Reports", description: "Logging needle stick injuries, slips, falls, or workplace accidents.",
    stats: [{ label: "Incidents (YTD)", color: "text-red-400", value: "12" }, { label: "Needle Stick (YTD)", color: "text-red-400", value: "4" }, { label: "Open Investigations", color: "text-amber-400", value: "1" }],
    columns: [["Incident ID", "incidentid"], ["Emp Name", "empname"], ["Incident Type", "incidenttype"], ["Date & Time", "datetime"], ["Action Taken", "actiontaken"]],
    badge: ["Status", "status", {"Under Investigation":"amber","Closed":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Needle Stick Injury', 'Slip & Fall', 'Needle Stick Injury', 'Chemical Exposure', 'Equipment Injury'];
        return { incidentid: 'INC-' + (1001 + i), empname: 'Staff ' + (1 + i), incidenttype: types[i], datetime: '10 May 2026', actiontaken: 'PEP Administered', status: i === 0 ? 'Under Investigation' : 'Closed' };
      }),
  },
  "/hr/health/occupational": {
    ui: 5,
    title: "Occupational Health", description: "Tracking exposure risks, radiation monitoring (TLD badges), and chemical hazards.",
    stats: [{ label: "High Risk Staff", color: "text-red-400", value: "45" }, { label: "TLD Renewals Due", color: "text-amber-400", value: "12" }, { label: "Monitoring Active", color: "text-emerald-400", value: "100%" }],
    columns: [["Emp Name", "empname"], ["Department", "department"], ["Risk Category", "riskcategory"], ["TLD Badge Status", "tldbadgestatus"], ["Last Review", "lastreview"]],
    badge: ["Status", "status", {"Monitored":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empname: 'Radiology Tech ' + (1 + i), department: 'Radiology', riskcategory: 'Radiation - High', tldbadgestatus: i === 0 ? 'Due for Reading' : 'Active', lastreview: '01 Jun 2026', status: 'Monitored' };
      }),
  },
  "/hr/health/vaccination": {
    ui: 5,
    title: "Vaccination History", description: "Detailed log of all vaccines administered to an employee by the hospital.",
    stats: [{ label: "Vaccines Administered", color: "text-blue-400", value: "1,240" }, { label: "Adverse Reactions", color: "text-emerald-400", value: "0" }, { label: "Stock Availability", color: "text-emerald-400", value: "Adequate" }],
    columns: [["Emp Name", "empname"], ["Vaccine", "vaccine"], ["Dose No", "doseno"], ["Date Administered", "dateadministered"], ["Batch No", "batchno"]],
    badge: ["Status", "status", {"Recorded":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empname: 'Staff ' + (1 + i), vaccine: 'Hepatitis B', doseno: 'Dose ' + ((i % 3) + 1), dateadministered: '01 Jan 2026', batchno: 'VAX-' + (100 + i), status: 'Recorded' };
      }),
  },
  "/hr/leave/approval": {
    ui: 5,
    title: "Leave Approval", description: "Manager dashboard for approving or rejecting leave based on roster impact.",
    stats: [{ label: "Leaves to Approve", color: "text-amber-400", value: "12" }, { label: "Roster Conflicts", color: "text-red-400", value: "2" }, { label: "Avg TAT", color: "text-emerald-400", value: "1.5 Days" }],
    columns: [["Req ID", "reqid"], ["Emp Name", "empname"], ["Dept", "dept"], ["Days Requested", "daysrequested"], ["Coverage Plan", "coverageplan"]],
    badge: ["Status", "status", {"Pending Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reqid: 'LEV-' + (2001 + i), empname: 'Staff ' + (1 + i), dept: 'Nursing', daysrequested: (2 + i).toString(), coverageplan: 'Staff B substituting', status: 'Pending Review' };
      }),
  },
  "/hr/leave/balance": {
    ui: 5,
    title: "Leave Balance", description: "Tracking accrued, consumed, and remaining leave quotas per employee.",
    stats: [{ label: "Total Liability (Days)", color: "text-amber-400", value: "4,500" }, { label: "Encashment Due", color: "text-blue-400", value: "$12,000" }, { label: "Negative Balances", color: "text-emerald-400", value: "0" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["Annual", "annual"], ["Sick", "sick"], ["Casual", "casual"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empid: 'EMP-' + (1001 + i), name: 'Staff ' + (1 + i), annual: (10 - i).toString(), sick: (5 - i).toString(), casual: (3 - i).toString(), status: 'Active' };
      }),
  },
  "/hr/leave/calendar": {
    ui: 5,
    title: "Leave Calendar", description: "Visual calendar showing all approved leaves across the hospital.",
    stats: [{ label: "Peak Leave Period", color: "text-blue-400", value: "December" }, { label: "Shortage Alerts", color: "text-emerald-400", value: "0" }, { label: "Max Allowed/Day", color: "text-gray-400", value: "10%" }],
    columns: [["Date", "date"], ["Department", "department"], ["Staff on Leave", "staffonleave"], ["Critical Shortages", "criticalshortages"], ["Manager", "manager"]],
    badge: ["Status", "status", {"Optimal Coverage":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { date: (10 + i) + ' Jul 2026', department: 'ICU', staffonleave: (2 + i).toString(), criticalshortages: 'None', manager: 'Dr. Head', status: 'Optimal Coverage' };
      }),
  },
  "/hr/leave/holidays": {
    ui: 5,
    title: "Holiday Calendar", description: "Hospital-wide list of public holidays and mandatory working days.",
    stats: [{ label: "Upcoming Holiday", color: "text-blue-400", value: "Independence Day" }, { label: "Total Holidays (Yr)", color: "text-emerald-400", value: "12" }, { label: "Restricted Holidays", color: "text-gray-400", value: "2" }],
    columns: [["Date", "date"], ["Holiday Name", "holidayname"], ["Type", "type"], ["Applicable To", "applicableto"], ["OT Rule", "otrule"]],
    badge: ["Status", "status", {"Passed":"gray","Upcoming":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Republic Day', 'Holi', 'Good Friday', 'Independence Day', 'Diwali'];
        return { date: '2026', holidayname: names[i], type: 'National', applicableto: 'All Staff', otrule: 'Double Pay for Clinical', status: i > 2 ? 'Upcoming' : 'Passed' };
      }),
  },
  "/hr/leave/requests": {
    ui: 5,
    title: "Leave Requests", description: "Incoming applications from staff for vacation, sick, or casual leave.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "45" }, { label: "Approved Today", color: "text-emerald-400", value: "18" }, { label: "Staff on Leave", color: "text-blue-400", value: "29" }],
    columns: [["Req ID", "reqid"], ["Emp Name", "empname"], ["Leave Type", "leavetype"], ["From Date", "fromdate"], ["To Date", "todate"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Approved":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Rejected', 'Approved'];
        const types = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Comp Off', 'Sick Leave'];
        return { reqid: 'LEV-' + (1001 + i), empname: 'Staff ' + (1 + i), leavetype: types[i], fromdate: '10 Jul 2026', todate: '12 Jul 2026', status: statuses[i] };
      }),
  },
  "/hr/onboarding/access": {
    ui: 5,
    title: "System Access", description: "Provisioning ERP credentials, email IDs, and biometric access.",
    stats: [{ label: "IT Provisioning", color: "text-emerald-400", value: "95%" }, { label: "Pending Biometric", color: "text-amber-400", value: "3" }, { label: "Email Issues", color: "text-emerald-400", value: "0" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["ERP Login", "erplogin"], ["Email Created", "emailcreated"], ["Biometric Enrolled", "biometricenrolled"]],
    badge: ["Status", "status", {"Completed":"emerald","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empid: 'EMP-' + (5001 + i), name: 'New Hire ' + (1 + i), erplogin: 'Created', emailcreated: 'Yes', biometricenrolled: i === 2 ? 'Pending' : 'Done', status: i === 2 ? 'In Progress' : 'Completed' };
      }),
  },
  "/hr/onboarding/department": {
    ui: 5,
    title: "Department Allocation", description: "Assigning new hires to their specific wards or units.",
    stats: [{ label: "Allocated Today", color: "text-emerald-400", value: "4" }, { label: "Pending Allocation", color: "text-amber-400", value: "1" }, { label: "Total Managers", color: "text-blue-400", value: "45" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["Allocated Dept", "allocateddept"], ["Reporting Manager", "reportingmanager"], ["Shift Default", "shiftdefault"]],
    badge: ["Status", "status", {"Allocated":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empid: 'EMP-' + (5001 + i), name: 'New Hire ' + (1 + i), allocateddept: 'ICU', reportingmanager: 'Dr. Head', shiftdefault: 'Morning', status: 'Allocated' };
      }),
  },
  "/hr/onboarding/orientation": {
    ui: 5,
    title: "Orientation Checklist", description: "Tracking completion of mandatory hospital induction programs.",
    stats: [{ label: "Inductions This Week", color: "text-blue-400", value: "2" }, { label: "Checklist Compliance", color: "text-emerald-400", value: "98%" }, { label: "Pending Sign-offs", color: "text-amber-400", value: "4" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["HR Induction", "hrinduction"], ["Safety Training", "safetytraining"], ["Dept Tour", "depttour"]],
    badge: ["Status", "status", {"Completed":"emerald","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empid: 'EMP-' + (5001 + i), name: 'New Hire ' + (1 + i), hrinduction: 'Done', safetytraining: i === 1 ? 'Pending' : 'Done', depttour: 'Done', status: i === 1 ? 'In Progress' : 'Completed' };
      }),
  },
  "/hr/onboarding/probation": {
    ui: 5,
    title: "Probation Management", description: "Monitoring employees under probation and their confirmation schedules.",
    stats: [{ label: "Staff on Probation", color: "text-amber-400", value: "45" }, { label: "Confirmations Due (Mo)", color: "text-blue-400", value: "12" }, { label: "Confirmed (YTD)", color: "text-emerald-400", value: "85" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["Probation End Date", "probationenddate"], ["Manager Review", "managerreview"], ["HR Review", "hrreview"]],
    badge: ["Status", "status", {"Review Pending":"amber","On Track":"emerald","Extended":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i === 0 ? 'Review Pending' : (i === 2 ? 'Extended' : 'On Track');
        return { empid: 'EMP-' + (6001 + i), name: 'Probationer ' + (1 + i), probationenddate: '15 Aug 2026', managerreview: statuses === 'Review Pending' ? 'Due' : 'Done', hrreview: 'Pending', status: statuses };
      }),
  },
  "/hr/onboarding/process": {
    ui: 5,
    title: "Employee Onboarding", description: "Workflow tracking for new hires on their first week.",
    stats: [{ label: "Active Onboardings", color: "text-blue-400", value: "8" }, { label: "Completed (Mo)", color: "text-emerald-400", value: "15" }, { label: "Delayed Steps", color: "text-amber-400", value: "2" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["DOJ", "doj"], ["Documents Check", "documentscheck"], ["Asset Allocation", "assetallocation"]],
    badge: ["Status", "status", {"In Progress":"amber","Completed":"emerald","Delayed":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In Progress', 'Completed', 'In Progress', 'Delayed', 'In Progress'];
        return { empid: 'EMP-' + (5001 + i), name: 'New Hire ' + (1 + i), doj: 'Today', documentscheck: '75%', assetallocation: 'Pending IT', status: statuses[i] };
      }),
  },
  "/hr/onboarding/role": {
    ui: 5,
    title: "Role Assignment", description: "Defining job roles, clinical privileges, and functional designations.",
    stats: [{ label: "Roles Assigned", color: "text-emerald-400", value: "8" }, { label: "Pending Privileges", color: "text-amber-400", value: "2" }, { label: "JD Acknowledged", color: "text-blue-400", value: "5" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["Primary Role", "primaryrole"], ["Clinical Privileges", "clinicalprivileges"], ["Job Description", "jobdescription"]],
    badge: ["Status", "status", {"Assigned":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empid: 'EMP-' + (5001 + i), name: 'New Hire ' + (1 + i), primaryrole: 'Registered Nurse', clinicalprivileges: i === 0 ? 'Pending' : 'Granted', jobdescription: 'Signed', status: 'Assigned' };
      }),
  },
  "/hr/payroll/bonus": {
    ui: 5,
    title: "Bonus", description: "Calculation and disbursement of annual or performance bonuses.",
    stats: [{ label: "Upcoming Bonus", color: "text-blue-400", value: "Diwali Bonus" }, { label: "Total Liability", color: "text-amber-400", value: "$120,000" }, { label: "Disbursed (YTD)", color: "text-emerald-400", value: "$50,000" }],
    columns: [["Bonus Type", "bonustype"], ["Applicable FY", "applicablefy"], ["Eligible Staff", "eligiblestaff"], ["Total Payout", "totalpayout"], ["Disbursement Date", "disbursementdate"]],
    badge: ["Status", "status", {"Pending Calc":"amber","Disbursed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Annual Performance', 'Festival Bonus', 'Retention Bonus', 'Referral Bonus', 'Special Award'];
        return { bonustype: types[i], applicablefy: '2025-26', eligiblestaff: (100 + i * 50).toString(), totalpayout: '$' + (20000 + i * 10000), disbursementdate: '31 Oct 2026', status: i > 1 ? 'Disbursed' : 'Pending Calc' };
      }),
  },
  "/hr/payroll/deductions": {
    ui: 5,
    title: "Deductions", description: "Logs of salary cuts for LWOP (Leave Without Pay), fines, or loan EMIs.",
    stats: [{ label: "Total Deductions (Mo)", color: "text-amber-400", value: "$12,400" }, { label: "LWOP Days", color: "text-red-400", value: "45" }, { label: "Loan Recoveries", color: "text-blue-400", value: "$4,500" }],
    columns: [["Emp Name", "empname"], ["Deduction Type", "deductiontype"], ["Amount", "amount"], ["Month", "month"], ["Remarks", "remarks"]],
    badge: ["Status", "status", {"Processed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['LWOP', 'Staff Loan EMI', 'Canteen Dues', 'Uniform Recovery', 'Damage Fine'];
        return { empname: 'Staff ' + (1 + i), deductiontype: types[i], amount: '$' + (50 + i * 20), month: 'June 2026', remarks: 'As per policy', status: 'Processed' };
      }),
  },
  "/hr/payroll/fnf": {
    ui: 5,
    title: "Full & Final Settlement", description: "Final financial clearance calculation for departing employees.",
    stats: [{ label: "Pending FnF", color: "text-amber-400", value: "8" }, { label: "Settled (YTD)", color: "text-emerald-400", value: "45" }, { label: "Avg Settlement Time", color: "text-blue-400", value: "28 Days" }],
    columns: [["Exit ID", "exitid"], ["Emp Name", "empname"], ["Last Working Day", "lastworkingday"], ["FnF Amount", "fnfamount"], ["Clearance", "clearance"]],
    badge: ["Status", "status", {"Pending Calc":"amber","Approved":"emerald","Hold (Assets)":"red","Settled":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Calc', 'Approved', 'Hold (Assets)', 'Settled', 'Settled'];
        return { exitid: 'EXT-' + (4001 + i), empname: 'Employee ' + (1 + i), lastworkingday: '31 May 2026', fnfamount: statuses[i] === 'Hold (Assets)' ? '-' : ('$' + (2000 + i * 500)), clearance: statuses[i] === 'Hold (Assets)' ? 'IT Pending' : 'Done', status: statuses[i] };
      }),
  },
  "/hr/payroll/incentives": {
    ui: 5,
    title: "Incentives", description: "Variable pay for doctors, sales, or collections teams based on targets.",
    stats: [{ label: "Total Incentives (Mo)", color: "text-blue-400", value: "$45,000" }, { label: "Top Earner", color: "text-emerald-400", value: "Dr. Smith" }, { label: "Pending Approval", color: "text-amber-400", value: "15" }],
    columns: [["Emp Name", "empname"], ["Target Metric", "targetmetric"], ["Achieved", "achieved"], ["Incentive Amount", "incentiveamount"], ["Month", "month"]],
    badge: ["Status", "status", {"Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empname: 'Staff ' + (1 + i), targetmetric: 'OPD Consults', achieved: (120 + i * 20).toString(), incentiveamount: '$' + (500 + i * 100), month: 'June 2026', status: 'Approved' };
      }),
  },
  "/hr/payroll/processing": {
    ui: 5,
    title: "Payroll Processing", description: "Monthly calculation engine factoring attendance, OT, leaves, and deductions.",
    stats: [{ label: "Current Month", color: "text-blue-400", value: "June 2026" }, { label: "Processing Status", color: "text-emerald-400", value: "Completed" }, { label: "Errors Flagged", color: "text-emerald-400", value: "0" }],
    columns: [["Month", "month"], ["Processed By", "processedby"], ["Total Emp Processed", "totalempprocessed"], ["Total Payout", "totalpayout"], ["Verification", "verification"]],
    badge: ["Status", "status", {"In Progress":"amber","Processed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i === 0 ? 'In Progress' : 'Processed';
        return { month: 'June 2026', processedby: 'HR Payroll', totalempprocessed: i === 0 ? '500/824' : '824', totalpayout: i === 0 ? '-' : '$450,000', verification: i === 0 ? 'Pending' : 'Done', status: statuses };
      }),
  },
  "/hr/payroll/reimbursements": {
    ui: 5,
    title: "Reimbursements", description: "Payout of approved employee expenses along with the salary.",
    stats: [{ label: "Pending Payout", color: "text-amber-400", value: "$8,500" }, { label: "Paid (Mo)", color: "text-emerald-400", value: "$12,000" }, { label: "Avg Claim TAT", color: "text-blue-400", value: "5 Days" }],
    columns: [["Claim ID", "claimid"], ["Emp Name", "empname"], ["Claim Type", "claimtype"], ["Approved Amount", "approvedamount"], ["Payout Month", "payoutmonth"]],
    badge: ["Status", "status", {"Paid":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { claimid: 'CLM-' + (1001 + i), empname: 'Staff ' + (1 + i), claimtype: 'Travel', approvedamount: '$' + (150 + i * 50), payoutmonth: 'June 2026', status: 'Paid' };
      }),
  },
  "/hr/payroll/slips": {
    ui: 5,
    title: "Salary Slips", description: "Generated payslips for employees, available for view and download.",
    stats: [{ label: "Slips Generated", color: "text-emerald-400", value: "824" }, { label: "Downloads (Mo)", color: "text-blue-400", value: "1,200" }, { label: "Discrepancies Raised", color: "text-amber-400", value: "2" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["Month", "month"], ["Net Pay", "netpay"], ["Generated On", "generatedon"]],
    badge: ["Status", "status", {"Published":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empid: 'EMP-' + (1001 + i), name: 'Staff ' + (1 + i), month: 'May 2026', netpay: '$' + (3000 + i * 500), generatedon: '01 Jun 2026', status: 'Published' };
      }),
  },
  "/hr/payroll/structure": {
    ui: 5,
    title: "Salary Structure", description: "Defining CTC breakdowns: Basic, HRA, Allowances for different bands.",
    stats: [{ label: "Total Bands", color: "text-blue-400", value: "15" }, { label: "Structures Defined", color: "text-emerald-400", value: "100%" }, { label: "Pending Updates", color: "text-emerald-400", value: "0" }],
    columns: [["Band/Grade", "bandgrade"], ["Basic %", "basic"], ["HRA %", "hra"], ["Special Allowance", "specialallowance"], ["PF Rule", "pfrule"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { bandgrade: 'Grade ' + String.fromCharCode(65 + i), basic: '40%', hra: '20%', specialallowance: 'Balance', pfrule: 'On Basic', status: 'Active' };
      }),
  },
  "/hr/performance/appraisals": {
    ui: 5,
    title: "Appraisals", description: "Annual rating finalization leading to increments or promotions.",
    stats: [{ label: "Appraisal Cycle", color: "text-emerald-400", value: "Closed" }, { label: "Avg Rating", color: "text-blue-400", value: "3.8/5" }, { label: "Top Performers", color: "text-emerald-400", value: "12%" }],
    columns: [["Appraisal ID", "appraisalid"], ["Emp Name", "empname"], ["Final Rating", "finalrating"], ["Recommendation", "recommendation"], ["HR Action", "hraction"]],
    badge: ["Status", "status", {"Finalized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { appraisalid: 'APR-' + (2001 + i), empname: 'Staff ' + (1 + i), finalrating: (3.5 + i * 0.3).toFixed(1) + '/5', recommendation: i === 4 ? 'Promotion' : 'Standard Increment', hraction: 'Processed', status: 'Finalized' };
      }),
  },
  "/hr/performance/increment": {
    ui: 5,
    title: "Increment History", description: "Historical log of salary hikes across the organization.",
    stats: [{ label: "Avg Hike (2026)", color: "text-blue-400", value: "8.5%" }, { label: "Highest Hike", color: "text-emerald-400", value: "18%" }, { label: "Zero Increments", color: "text-gray-400", value: "5%" }],
    columns: [["Emp Name", "empname"], ["Year", "year"], ["Previous CTC", "previousctc"], ["Hike %", "hike"], ["New CTC", "newctc"]],
    badge: ["Status", "status", {"Applied":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empname: 'Staff ' + (1 + i), year: '2026', previousctc: '$' + (30000 + i * 5000), hike: (5 + i) + '%', newctc: '$' + ((30000 + i * 5000) * (1 + (5 + i) / 100)).toFixed(0), status: 'Applied' };
      }),
  },
  "/hr/performance/kpi": {
    ui: 5,
    title: "KPI Management", description: "Setting Key Performance Indicators for various departments and roles.",
    stats: [{ label: "Total KPIs Set", color: "text-blue-400", value: "145" }, { label: "Roles Covered", color: "text-emerald-400", value: "95%" }, { label: "Needs Update", color: "text-amber-400", value: "4" }],
    columns: [["Role/Dept", "roledept"], ["KPI Name", "kpiname"], ["Target", "target"], ["Weightage", "weightage"], ["Measurement Freq", "measurementfreq"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const kpis = ['Patient Satisfaction', 'Infection Rate', 'Billing Accuracy', 'OT Turnaround', 'Bed Turnaround'];
        return { roledept: 'Nursing', kpiname: kpis[i], target: '> 90%', weightage: '20%', measurementfreq: 'Monthly', status: 'Active' };
      }),
  },
  "/hr/performance/promotions": {
    ui: 5,
    title: "Promotions", description: "Tracking staff elevation to higher bands or designations.",
    stats: [{ label: "Promotions (YTD)", color: "text-blue-400", value: "34" }, { label: "Pending Final Auth", color: "text-amber-400", value: "5" }, { label: "Fast Track", color: "text-emerald-400", value: "4" }],
    columns: [["Emp Name", "empname"], ["Old Designation", "olddesignation"], ["New Designation", "newdesignation"], ["Effective Date", "effectivedate"], ["Approver", "approver"]],
    badge: ["Status", "status", {"Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empname: 'Staff ' + (1 + i), olddesignation: 'Junior Nurse', newdesignation: 'Senior Nurse', effectivedate: '01 Apr 2026', approver: 'Management Board', status: 'Approved' };
      }),
  },
  "/hr/performance/review": {
    ui: 5,
    title: "Performance Review", description: "Periodic check-ins and scoring between employees and managers.",
    stats: [{ label: "Current Cycle", color: "text-blue-400", value: "Mid-Year 2026" }, { label: "Reviews Completed", color: "text-emerald-400", value: "75%" }, { label: "Pending Manager", color: "text-amber-400", value: "45" }],
    columns: [["Review ID", "reviewid"], ["Emp Name", "empname"], ["Manager", "manager"], ["Period", "period"], ["Self Score", "selfscore"], ["Mgr Score", "mgrscore"]],
    badge: ["Status", "status", {"Completed":"emerald","Pending Manager":"amber","Pending Self":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'Pending Manager', 'Pending Self', 'Completed', 'Completed'];
        return { reviewid: 'REV-' + (1001 + i), empname: 'Staff ' + (1 + i), manager: 'Dr. Head', period: 'H1 2026', selfscore: statuses[i] === 'Pending Self' ? '-' : '4.2/5', mgrscore: statuses[i] === 'Completed' ? '4.0/5' : '-', status: statuses[i] };
      }),
  },
  "/hr/recruitment/candidates": {
    ui: 5,
    title: "Candidates", description: "Pool of applicants applied for various open positions.",
    stats: [{ label: "Total Candidates", color: "text-blue-400", value: "350" }, { label: "Shortlisted", color: "text-emerald-400", value: "45" }, { label: "Rejected", color: "text-gray-400", value: "120" }],
    columns: [["Candidate ID", "candidateid"], ["Name", "name"], ["Applied For", "appliedfor"], ["Experience", "experience"], ["Source", "source"]],
    badge: ["Status", "status", {"Shortlisted":"gray","Screening":"amber","Rejected":"red","Interview Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Shortlisted', 'Screening', 'Rejected', 'Interview Scheduled', 'Shortlisted'];
        return { candidateid: 'CAN-' + (1001 + i), name: 'Candidate ' + (1 + i), appliedfor: 'Nursing Staff', experience: (2 + i) + ' Years', source: 'LinkedIn', status: statuses[i] };
      }),
  },
  "/hr/recruitment/feedback": {
    ui: 5,
    title: "Interview Feedback", description: "Evaluations and ratings submitted by technical and HR interviewers.",
    stats: [{ label: "Feedback Pending", color: "text-amber-400", value: "5" }, { label: "Submitted Today", color: "text-emerald-400", value: "12" }, { label: "Avg Rating", color: "text-blue-400", value: "3.8/5" }],
    columns: [["Candidate", "candidate"], ["Position", "position"], ["Round", "round"], ["Interviewer", "interviewer"], ["Rating", "rating"]],
    badge: ["Status", "status", {"Selected":"emerald","Pending Feedback":"amber","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Selected', 'Pending Feedback', 'Selected', 'Rejected', 'Selected'];
        return { candidate: 'Candidate ' + (1 + i), position: 'Nurse', round: 'Technical', interviewer: 'Nursing Supt.', rating: statuses[i] === 'Selected' ? '4.5/5' : '-', status: statuses[i] };
      }),
  },
  "/hr/recruitment/joining": {
    ui: 5,
    title: "Joining Process", description: "Tracking candidates who have accepted offers until their day 1.",
    stats: [{ label: "Joining This Week", color: "text-emerald-400", value: "5" }, { label: "Joining Next Week", color: "text-blue-400", value: "8" }, { label: "Dropouts", color: "text-red-400", value: "1" }],
    columns: [["Candidate", "candidate"], ["Designation", "designation"], ["Department", "department"], ["Expected DOJ", "expecteddoj"], ["Welcome Kit", "welcomekit"]],
    badge: ["Status", "status", {"Pre-Onboarding":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { candidate: 'Candidate ' + (1 + i), designation: 'Staff Nurse', department: 'ICU', expecteddoj: '15 Jul 2026', welcomekit: 'Prepared', status: 'Pre-Onboarding' };
      }),
  },
  "/hr/recruitment/offers": {
    ui: 5,
    title: "Offer Letters", description: "Generation, dispatch, and tracking of employment offers.",
    stats: [{ label: "Offers Rolled (Mo)", color: "text-blue-400", value: "15" }, { label: "Accepted", color: "text-emerald-400", value: "12" }, { label: "Declined", color: "text-red-400", value: "1" }],
    columns: [["Offer ID", "offerid"], ["Candidate Name", "candidatename"], ["Designation", "designation"], ["Offered CTC", "offeredctc"], ["Expiry Date", "expirydate"]],
    badge: ["Status", "status", {"Accepted":"emerald","Pending Response":"amber","Declined":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Accepted', 'Pending Response', 'Accepted', 'Declined', 'Accepted'];
        return { offerid: 'OFF-' + (3001 + i), candidatename: 'Candidate ' + (1 + i), designation: 'Executive', offeredctc: '$' + (30000 + i * 5000), expirydate: '15 Jul 2026', status: statuses[i] };
      }),
  },
  "/hr/recruitment/openings": {
    ui: 5,
    title: "Job Openings", description: "Current vacancies and requisition requests from departments.",
    stats: [{ label: "Active Openings", color: "text-blue-400", value: "18" }, { label: "Total Vacancies", color: "text-amber-400", value: "24" }, { label: "Positions Filled (YTD)", color: "text-emerald-400", value: "45" }],
    columns: [["Job ID", "jobid"], ["Title", "title"], ["Department", "department"], ["Vacancies", "vacancies"], ["Applicants", "applicants"]],
    badge: ["Status", "status", {"Active":"emerald","Closed":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const titles = ['Senior Nurse', 'Cardiologist', 'IT Support', 'Billing Executive', 'Pharmacist'];
        return { jobid: 'JOB-' + (101 + i), title: titles[i], department: 'Various', vacancies: (1 + i).toString(), applicants: (10 + i * 5).toString(), status: i === 4 ? 'Closed' : 'Active' };
      }),
  },
  "/hr/recruitment/schedule": {
    ui: 5,
    title: "Interview Schedule", description: "Calendar and roster for upcoming candidate interviews.",
    stats: [{ label: "Interviews Today", color: "text-blue-400", value: "8" }, { label: "Upcoming (Week)", color: "text-amber-400", value: "24" }, { label: "No Shows", color: "text-red-400", value: "2" }],
    columns: [["Interview ID", "interviewid"], ["Candidate", "candidate"], ["Position", "position"], ["Interviewer", "interviewer"], ["Date & Time", "datetime"]],
    badge: ["Status", "status", {"Scheduled":"amber","Completed":"emerald","No Show":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Scheduled', 'Completed', 'Scheduled', 'No Show', 'Scheduled'];
        return { interviewid: 'INT-' + (2001 + i), candidate: 'Candidate ' + (1 + i), position: 'IT Exec', interviewer: 'IT Head', datetime: 'Today 14:00', status: statuses[i] };
      }),
  },
  "/hr/reports/attendance": {
    ui: 5,
    title: "Attendance Report", description: "Aggregated attendance data for payroll or compliance audits.",
    stats: [{ label: "Avg Hospital Presence", color: "text-emerald-400", value: "94%" }, { label: "Highest Absenteeism", color: "text-red-400", value: "Housekeeping" }, { label: "Automated Sync", color: "text-blue-400", value: "Active" }],
    columns: [["Report Month", "reportmonth"], ["Department", "department"], ["Total Working Days", "totalworkingdays"], ["Avg Presence %", "avgpresence"], ["Exported On", "exportedon"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportmonth: 'June 2026', department: 'All Departments', totalworkingdays: '26', avgpresence: (90 + i) + '%', exportedon: '01 Jul 2026', status: 'Generated' };
      }),
  },
  "/hr/reports/attrition": {
    ui: 5,
    title: "Attrition Analysis", description: "Exit interview data, turnover rates, and retention metrics.",
    stats: [{ label: "Annualized Attrition", color: "text-amber-400", value: "14.5%" }, { label: "Highest Exit Dept", color: "text-red-400", value: "Nursing" }, { label: "Avg Tenure", color: "text-emerald-400", value: "4.2 Yrs" }],
    columns: [["Month", "month"], ["Headcount", "headcount"], ["Voluntary Exits", "voluntaryexits"], ["Involuntary", "involuntary"], ["Attrition Rate", "attritionrate"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { month: 'May 2026', headcount: '824', voluntaryexits: (4 + i).toString(), involuntary: (1).toString(), attritionrate: (1.5 + i * 0.2).toFixed(1) + '%', status: 'Generated' };
      }),
  },
  "/hr/reports/compliance": {
    ui: 5,
    title: "Compliance Status Report", description: "Consolidated view of all statutory and accreditation HR compliances.",
    stats: [{ label: "Overall Compliance", color: "text-emerald-400", value: "98%" }, { label: "Critical Risks", color: "text-emerald-400", value: "0" }, { label: "Upcoming Audits", color: "text-blue-400", value: "1" }],
    columns: [["Compliance Area", "compliancearea"], ["Total Requirements", "totalrequirements"], ["Compliant", "compliant"], ["Non-Compliant", "noncompliant"], ["Risk Level", "risklevel"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const areas = ['Labor Laws', 'Medical Council', 'NABH (HRM)', 'Bio-Medical', 'Fire Safety'];
        return { compliancearea: areas[i], totalrequirements: '24', compliant: '24', noncompliant: '0', risklevel: 'Low', status: 'Generated' };
      }),
  },
  "/hr/reports/employee": {
    ui: 5,
    title: "Employee Master Report", description: "Downloadable dump of all employee demographics and professional details.",
    stats: [{ label: "Reports Generated (Mo)", color: "text-blue-400", value: "24" }, { label: "Last Export", color: "text-emerald-400", value: "Today" }, { label: "Scheduled Reports", color: "text-amber-400", value: "2" }],
    columns: [["Report Type", "reporttype"], ["Format", "format"], ["Generated On", "generatedon"], ["Generated By", "generatedby"], ["Size", "size"]],
    badge: ["Status", "status", {"Ready":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reporttype: 'Full Master Data', format: 'Excel (XLSX)', generatedon: 'Today 09:00', generatedby: 'Admin', size: '2.4 MB', status: 'Ready' };
      }),
  },
  "/hr/reports/leave": {
    ui: 5,
    title: "Leave Summary Report", description: "Trends on leave consumption and remaining organizational liability.",
    stats: [{ label: "Total Leaves Taken", color: "text-blue-400", value: "2,450" }, { label: "Highest Leave Dept", color: "text-amber-400", value: "Nursing" }, { label: "Unplanned Leave %", color: "text-red-400", value: "15%" }],
    columns: [["Department", "department"], ["Leaves Taken (YTD)", "leavestakenytd"], ["Average/Emp", "averageemp"], ["Liability Value", "liabilityvalue"], ["Trend", "trend"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Nursing', 'Doctors', 'Admin', 'IT', 'Pharmacy'];
        return { department: depts[i], leavestaken: (500 - i * 50).toString(), averageemp: (8 - i).toString(), liabilityvalue: '$' + (15000 - i * 2000), trend: i === 0 ? 'Up 5%' : 'Stable', status: 'Generated' };
      }),
  },
  "/hr/reports/payroll": {
    ui: 5,
    title: "Payroll Register", description: "Financial audit report of all salaries, taxes, and net payouts.",
    stats: [{ label: "Total Payout (YTD)", color: "text-blue-400", value: "$2.4M" }, { label: "Tax Deducted (YTD)", color: "text-emerald-400", value: "$450K" }, { label: "Variance (MoM)", color: "text-amber-400", value: "+2.4%" }],
    columns: [["Month", "month"], ["Gross Payroll", "grosspayroll"], ["Total Deductions", "totaldeductions"], ["Net Payout", "netpayout"], ["Employer PF/ESI", "employerpfesi"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { month: 'May 2026', grosspayroll: '$' + (450000 - i * 5000), totaldeductions: '$' + (50000 - i * 1000), netpayout: '$' + (400000 - i * 4000), employerpfesi: '$' + (20000 - i * 500), status: 'Generated' };
      }),
  },
  "/hr/reports/performance": {
    ui: 5,
    title: "Performance Bell Curve", description: "Distribution of performance ratings across the organization to ensure normalization.",
    stats: [{ label: "Top Performers", color: "text-emerald-400", value: "15%" }, { label: "Needs Improvement", color: "text-red-400", value: "5%" }, { label: "Avg Performers", color: "text-blue-400", value: "60%" }],
    columns: [["Department", "department"], ["Rating 1 (Poor)", "rating1poor"], ["Rating 2", "rating2"], ["Rating 3 (Avg)", "rating3avg"], ["Rating 4", "rating4"], ["Rating 5 (Top)", "rating5top"]],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Nursing', 'Administration', 'IT', 'Pharmacy', 'Support Staff'];
        return { department: depts[i], rating1poor: '5%', rating2: '15%', rating3avg: '60%', rating4: '15%', rating5top: '5%' };
      }),
  },
  "/hr/reports/recruitment": {
    ui: 5,
    title: "Recruitment Funnel", description: "Metrics on time-to-hire, source effectiveness, and conversion rates.",
    stats: [{ label: "Avg Time to Hire", color: "text-emerald-400", value: "24 Days" }, { label: "Offer Acceptance", color: "text-emerald-400", value: "85%" }, { label: "Cost Per Hire", color: "text-blue-400", value: "$450" }],
    columns: [["Position", "position"], ["Total Applied", "totalapplied"], ["Shortlisted", "shortlisted"], ["Offered", "offered"], ["Joined", "joined"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { position: 'Staff Nurse', totalapplied: (150 - i * 10).toString(), shortlisted: (30 - i * 2).toString(), offered: (10 - i).toString(), joined: (8 - i).toString(), status: 'Generated' };
      }),
  },
  "/hr/reports/training": {
    ui: 5,
    title: "Training ROI Report", description: "Data on training hours delivered, costs, and post-training assessment scores.",
    stats: [{ label: "Total Training Hrs", color: "text-blue-400", value: "4,500" }, { label: "Staff Covered", color: "text-emerald-400", value: "85%" }, { label: "Training Budget", color: "text-amber-400", value: "65% Used" }],
    columns: [["Program", "program"], ["Batches", "batches"], ["Staff Trained", "stafftrained"], ["Total Hours", "totalhours"], ["Avg Score", "avgscore"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { program: 'Fire Safety ' + (1 + i), batches: (4 - i).toString(), stafftrained: (120 - i * 10).toString(), totalhours: (480 - i * 40).toString(), avgscore: (90 - i) + '%', status: 'Generated' };
      }),
  },
  "/hr/settings/approval": {
    ui: 5,
    title: "Approval Matrix", description: "Workflow definitions for leaves, appraisals, and expense reimbursements.",
    stats: [{ label: "Active Workflows", color: "text-blue-400", value: "12" }, { label: "Escalations Active", color: "text-emerald-400", value: "Yes (48H)" }, { label: "Bypassed Approvals", color: "text-emerald-400", value: "0" }],
    columns: [["Workflow Name", "workflowname"], ["Module", "module"], ["Level 1 Approver", "level1approver"], ["Level 2 Approver", "level2approver"], ["Auto-Escalation", "autoescalation"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const workflows = ['Leave Request', 'Expense Claim', 'Performance Review', 'Shift Swap', 'Resignation'];
        return { workflowname: workflows[i], module: 'HR', level1approver: 'Reporting Manager', level2approver: i === 1 ? 'Dept Head' : (i === 4 ? 'HR Head' : '-'), autoescalation: 'Yes (48 Hrs)', status: 'Active' };
      }),
  },
  "/hr/settings/departments": {
    ui: 5,
    title: "Departments", description: "Master configuration of hospital departments, sub-departments, and cost centers.",
    stats: [{ label: "Total Departments", color: "text-blue-400", value: "24" }, { label: "Sub-Departments", color: "text-emerald-400", value: "45" }, { label: "Unassigned Heads", color: "text-emerald-400", value: "0" }],
    columns: [["Dept Code", "deptcode"], ["Dept Name", "deptname"], ["Parent Dept", "parentdept"], ["Head of Dept", "headofdept"], ["Cost Center", "costcenter"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Cardiology', 'Nursing', 'Human Resources', 'Information Tech', 'Pharmacy'];
        return { deptcode: 'DPT-' + (101 + i), deptname: depts[i], parentdept: 'Clinical/Non-Clinical', headofdept: 'Dr./Mr. ' + (1 + i), costcenter: 'CC-' + (101 + i), status: 'Active' };
      }),
  },
  "/hr/settings/designations": {
    ui: 5,
    title: "Designations", description: "Hierarchy, reporting structures, and job titles across the organization.",
    stats: [{ label: "Active Designations", color: "text-blue-400", value: "120" }, { label: "Grades Defined", color: "text-emerald-400", value: "15" }, { label: "Orphan Roles", color: "text-emerald-400", value: "0" }],
    columns: [["Designation", "designation"], ["Grade/Band", "gradeband"], ["Department", "department"], ["Reports To", "reportsto"], ["Notice Period", "noticeperiod"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { designation: 'Senior Staff Nurse ' + (1 + i), gradeband: 'Band C', department: 'Nursing', reportsto: 'Nursing Supt.', noticeperiod: '30 Days', status: 'Active' };
      }),
  },
  "/hr/settings/employment": {
    ui: 5,
    title: "Employment Types", description: "Rules for Full-Time, Part-Time, Consultants, Locums, and Contract staff.",
    stats: [{ label: "Emp Types Defined", color: "text-blue-400", value: "6" }, { label: "Contract Staff %", color: "text-amber-400", value: "20%" }, { label: "Locum Doctors", color: "text-gray-400", value: "15" }],
    columns: [["Type Name", "typename"], ["PF/ESI Applicability", "pfesiapplicability"], ["Leave Accrual", "leaveaccrual"], ["Notice Req.", "noticereq"], ["Max Tenure", "maxtenure"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Full-Time Regular', 'Contractual', 'Retainer/Consultant', 'Locum', 'Trainee/Intern'];
        return { typename: types[i], pfesiapplicability: i < 2 ? 'Yes' : 'No', leaveaccrual: i < 2 ? 'Full' : 'Prorated/Nil', noticereq: i === 3 ? 'No' : 'Yes', maxtenure: i === 4 ? '6 Months' : 'Unlimited', status: 'Active' };
      }),
  },
  "/hr/settings/leave": {
    ui: 5,
    title: "Leave Types", description: "Configuring Annual, Sick, Casual, Maternity, and Comp-Off rules.",
    stats: [{ label: "Active Leave Types", color: "text-blue-400", value: "8" }, { label: "Total Quota (Avg)", color: "text-emerald-400", value: "21 Days/Yr" }, { label: "Encashment Policy", color: "text-emerald-400", value: "Active" }],
    columns: [["Leave Name", "leavename"], ["Accrual Rate", "accrualrate"], ["Max Carry Forward", "maxcarryforward"], ["Encashable", "encashable"], ["Document Req.", "documentreq"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const leaves = ['Annual Leave (AL)', 'Sick Leave (SL)', 'Casual Leave (CL)', 'Maternity Leave', 'Compensatory Off'];
        return { leavename: leaves[i], accrualrate: i === 0 ? '1.5/Month' : 'Lump sum', maxcarryforward: i === 0 ? '45 Days' : 'Nil', encashable: i === 0 ? 'Yes' : 'No', documentreq: i === 1 ? 'If > 2 days' : 'No', status: 'Active' };
      }),
  },
  "/hr/settings/salary": {
    ui: 5,
    title: "Salary Components", description: "Creating specific earning (HRA, DA) and deduction (PF, TDS) heads.",
    stats: [{ label: "Earning Heads", color: "text-emerald-400", value: "12" }, { label: "Deduction Heads", color: "text-amber-400", value: "8" }, { label: "Formula Configs", color: "text-blue-400", value: "15" }],
    columns: [["Component Name", "componentname"], ["Type", "type"], ["Taxable", "taxable"], ["Calculation Rule", "calculationrule"], ["Appears in Payslip", "appearsinpayslip"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const comps = ['Basic Pay', 'House Rent Allowance', 'Special Allowance', 'Provident Fund', 'Professional Tax'];
        const types = i < 3 ? 'Earning' : 'Deduction';
        return { componentname: comps[i], type: types, taxable: i !== 3 ? 'Yes' : 'No', calculationrule: i === 0 ? 'Fixed' : 'Formula based', appearsinpayslip: 'Yes', status: 'Active' };
      }),
  },
  "/hr/settings/shift": {
    ui: 5,
    title: "Shift Rules", description: "Global rules for grace periods, half-day deductions, and auto-shift mapping.",
    stats: [{ label: "Active Rules", color: "text-blue-400", value: "15" }, { label: "Late Grace Min", color: "text-amber-400", value: "15 Mins" }, { label: "Auto-Deduction", color: "text-red-400", value: "Enabled" }],
    columns: [["Rule Name", "rulename"], ["Condition", "condition"], ["Action Triggered", "actiontriggered"], ["Applies To", "appliesto"], ["Priority", "priority"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const rules = ['Late In Deduction', 'Half Day Marking', 'Early Out Deduction', 'Night Shift Allowance', 'Overtime Eligibility'];
        return { rulename: rules[i], condition: 'Late > 15 mins', actiontriggered: 'Deduct 0.5 Day Leave', appliesto: 'All Staff', priority: (1 + i).toString(), status: 'Active' };
      }),
  },
  "/hr/shift/allocation": {
    ui: 5,
    title: "Shift Allocation", description: "Individual employee view of their assigned shifts.",
    stats: [{ label: "Unassigned Staff", color: "text-red-400", value: "4" }, { label: "Allocations Active", color: "text-emerald-400", value: "820" }, { label: "Changes Requested", color: "text-amber-400", value: "12" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["Current Shift", "currentshift"], ["Next Shift", "nextshift"], ["Allocation Date", "allocationdate"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { empid: 'EMP-' + (1001 + i), name: 'Staff ' + (1 + i), currentshift: 'Morning', nextshift: 'Evening', allocationdate: '01 Jul 2026', status: 'Active' };
      }),
  },
  "/hr/shift/master": {
    ui: 5,
    title: "Shift Master", description: "Defining hospital shifts (Morning, Evening, Night, General).",
    stats: [{ label: "Active Shifts", color: "text-blue-400", value: "6" }, { label: "Employees Mapped", color: "text-emerald-400", value: "824" }, { label: "24/7 Coverage", color: "text-emerald-400", value: "Active" }],
    columns: [["Shift Code", "shiftcode"], ["Shift Name", "shiftname"], ["Start Time", "starttime"], ["End Time", "endtime"], ["Grace Period", "graceperiod"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const shifts = ['Morning', 'Evening', 'Night', 'General', 'Emergency Reliever'];
        const times = ['08:00 - 16:00', '16:00 - 00:00', '00:00 - 08:00', '09:00 - 18:00', 'Flexi'];
        return { shiftcode: 'SHF-' + (1 + i), shiftname: shifts[i], starttime: times[i].split(' - ')[0], endtime: times[i].split(' - ')[1] || 'Flexi', graceperiod: '15 Mins', status: 'Active' };
      }),
  },
  "/hr/shift/night": {
    ui: 5,
    title: "Night Shift", description: "Specific tracking for night shift allowances and regulatory compliance.",
    stats: [{ label: "Staff on Night Duty", color: "text-blue-400", value: "145" }, { label: "Regulatory Breaches", color: "text-emerald-400", value: "0" }, { label: "Total Allowance", color: "text-amber-400", value: "$2,400" }],
    columns: [["Emp ID", "empid"], ["Name", "name"], ["Nights This Month", "nightsthismonth"], ["Consecutive Nights", "consecutivenights"], ["Allowance", "allowance"]],
    badge: ["Status", "status", {"Compliant":"emerald","Policy Breach Warning":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const breaches = (3 + i) > 4 ? 'Policy Breach Warning' : 'Compliant';
        return { empid: 'EMP-' + (3001 + i), name: 'Staff ' + (1 + i), nightsthismonth: (4 + i * 2).toString(), consecutivenights: (1 + i).toString(), allowance: '$' + (100 + i * 50), status: breaches };
      }),
  },
  "/hr/shift/overtime": {
    ui: 5,
    title: "Overtime Management", description: "Tracking and approval of extra hours worked beyond the shift.",
    stats: [{ label: "Total OT Hours (Mo)", color: "text-blue-400", value: "345 Hrs" }, { label: "Pending Approvals", color: "text-amber-400", value: "24" }, { label: "Approved Value", color: "text-emerald-400", value: "$4,200" }],
    columns: [["OT ID", "otid"], ["Emp Name", "empname"], ["Date", "date"], ["Extra Hours", "extrahours"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { otid: 'OT-' + (2001 + i), empname: 'Staff ' + (1 + i), date: 'Yesterday', extrahours: (1.5 + i * 0.5) + ' Hrs', reason: 'Staff Shortage', status: i === 0 ? 'Pending Auth' : 'Approved' };
      }),
  },
  "/hr/shift/roster": {
    ui: 5,
    title: "Duty Roster", description: "Monthly or weekly scheduling of staff across different shifts.",
    stats: [{ label: "Rosters Published", color: "text-blue-400", value: "12/15" }, { label: "Draft Rosters", color: "text-amber-400", value: "3" }, { label: "Coverage Gaps", color: "text-emerald-400", value: "0" }],
    columns: [["Department", "department"], ["Week", "week"], ["Published By", "publishedby"], ["Published Date", "publisheddate"], ["Conflicts", "conflicts"]],
    badge: ["Status", "status", {"Published":"emerald","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['ICU Nursing', 'ER Staff', 'Security', 'Pharmacy', 'Housekeeping'];
        const statuses = i === 1 ? 'Draft' : 'Published';
        return { department: depts[i], week: 'W2 July 2026', publishedby: 'Dept Head', publisheddate: statuses === 'Published' ? 'Today' : '-', conflicts: '0', status: statuses };
      }),
  },
  "/hr/shift/swap": {
    ui: 5,
    title: "Shift Swap", description: "Requests by employees to exchange shifts with colleagues.",
    stats: [{ label: "Pending Swaps", color: "text-amber-400", value: "8" }, { label: "Approved (Week)", color: "text-emerald-400", value: "34" }, { label: "Rejected", color: "text-gray-400", value: "5" }],
    columns: [["Req ID", "reqid"], ["Initiator", "initiator"], ["Requested Staff", "requestedstaff"], ["Date", "date"], ["Shift Exchanged", "shiftexchanged"]],
    badge: ["Status", "status", {"Pending Manager":"amber","Approved":"emerald","Pending Peer":"amber","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Manager', 'Approved', 'Pending Peer', 'Rejected', 'Approved'];
        return { reqid: 'SWP-' + (1001 + i), initiator: 'Staff A', requestedstaff: 'Staff B', date: 'Tomorrow', shiftexchanged: 'Morning <-> Evening', status: statuses[i] };
      }),
  },
  "/hr/training/assessment": {
    ui: 5,
    title: "Skill Assessment", description: "Post-training quizzes or practical assessments to verify competency.",
    stats: [{ label: "Assessments Taken", color: "text-blue-400", value: "145" }, { label: "Pass Rate", color: "text-emerald-400", value: "92%" }, { label: "Retakes Required", color: "text-red-400", value: "12" }],
    columns: [["Assessment ID", "assessmentid"], ["Emp Name", "empname"], ["Program Name", "programname"], ["Score", "score"], ["Pass/Fail", "passfail"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const scores = ['95%', '45%', '85%', '90%', '88%'];
        const pass = i === 1 ? 'Fail' : 'Pass';
        return { assessmentid: 'ASM-' + (1001 + i), empname: 'Staff ' + (1 + i), programname: 'Fire Safety Drill', score: scores[i], passfail: pass, status: 'Completed' };
      }),
  },
  "/hr/training/calendar": {
    ui: 5,
    title: "Training Calendar", description: "Schedules for all upcoming induction, compliance, and clinical training sessions.",
    stats: [{ label: "Upcoming Trainings", color: "text-blue-400", value: "8" }, { label: "Staff Enrolled", color: "text-amber-400", value: "145" }, { label: "Trainings (YTD)", color: "text-emerald-400", value: "45" }],
    columns: [["Training Date", "trainingdate"], ["Program Name", "programname"], ["Trainer", "trainer"], ["Target Audience", "targetaudience"], ["Location/Link", "locationlink"]],
    badge: ["Status", "status", {"Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const programs = ['Fire Safety Drill', 'BLS Refresher', 'Infection Control', 'NABH Protocols', 'Communication Skills'];
        return { trainingdate: '10 Jul 2026', programname: programs[i], trainer: 'Safety Officer', targetaudience: 'All Staff', locationlink: 'Auditorium 1', status: 'Scheduled' };
      }),
  },
  "/hr/training/certifications": {
    ui: 5,
    title: "Certifications", description: "Tracking internal certifications and their validity periods.",
    stats: [{ label: "Expiring (30D)", color: "text-red-400", value: "15" }, { label: "Active Certs", color: "text-emerald-400", value: "450" }, { label: "Renewals Due", color: "text-amber-400", value: "24" }],
    columns: [["Emp Name", "empname"], ["Certificate Name", "certificatename"], ["Issue Date", "issuedate"], ["Expiry Date", "expirydate"], ["Issuer", "issuer"]],
    badge: ["Status", "status", {"Expiring Soon":"amber","Expired":"red","Valid":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i === 0 ? 'Expiring Soon' : (i === 1 ? 'Expired' : 'Valid');
        return { empname: 'Staff ' + (1 + i), certificatename: 'BLS Certification', issuedate: '01 Jan 2025', expirydate: statuses === 'Expiring Soon' ? '15 Jul 2026' : '01 Jan 2027', issuer: 'AHA', status: statuses };
      }),
  },
  "/hr/training/cme": {
    ui: 5,
    title: "CME Programs", description: "Continuing Medical Education tracking for doctors to maintain licenses.",
    stats: [{ label: "Total CME Hours", color: "text-blue-400", value: "1,240" }, { label: "Doctors Compliant", color: "text-emerald-400", value: "85%" }, { label: "Pending Verification", color: "text-amber-400", value: "12" }],
    columns: [["Doctor Name", "doctorname"], ["Event/Course", "eventcourse"], ["Credit Hours", "credithours"], ["Date", "date"], ["Proof Document", "proofdocument"]],
    badge: ["Status", "status", {"Pending Verification":"amber","Verified":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { doctorname: 'Dr. ' + (1 + i), eventcourse: 'Cardio Summit 2026', credithours: (4 + i).toString(), date: '01 Jun 2026', proofdocument: 'Uploaded', status: i === 0 ? 'Pending Verification' : 'Verified' };
      }),
  },
  "/hr/training/programs": {
    ui: 5,
    title: "Training Programs", description: "Master list of all internal and external training modules available.",
    stats: [{ label: "Total Modules", color: "text-blue-400", value: "34" }, { label: "Mandatory", color: "text-red-400", value: "12" }, { label: "Clinical", color: "text-emerald-400", value: "15" }],
    columns: [["Program Code", "programcode"], ["Program Name", "programname"], ["Category", "category"], ["Duration", "duration"], ["Mandatory", "mandatory"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const categories = ['Compliance', 'Clinical', 'Soft Skills', 'Leadership', 'IT'];
        return { programcode: 'TRN-' + (101 + i), programname: 'Module ' + (1 + i), category: categories[i], duration: (2 + i) + ' Hrs', mandatory: i < 2 ? 'Yes' : 'No', status: 'Active' };
      }),
  },
};

export default pages;
