import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/diagnostics/analytics/critical": {
    ui: 3,
    title: "Critical Result Analytics", description: "Analysis of life-threatening results, reporting times, and clinical impact.",
    stats: [{ label: "Total Criticals (YTD)", color: "text-red-400", value: "340" }, { label: "SLA Compliance", color: "text-emerald-400", value: "98%" }, { label: "Avg Time to Notify", color: "text-blue-400", value: "12 mins" }],
    columns: [["Month", "month"], ["Total Criticals", "totalcriticals"], ["Avg Reporting Time", "avgreportingtime"], ["Doctor Notified <30m", "doctornotified30m"], ["Missed SLAs", "missedslas"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        return { month: months[i] + ' 2026', totalcriticals: (45 + i * 5).toString(), avgreportingtime: '1' + i + ' mins', doctornotified30m: '100%', missedslas: '0', status: 'Generated' };
      }),
  },
  "/diagnostics/analytics/pending": {
    ui: 3,
    title: "Pending Test Report", description: "Daily overview of backlog and overdue tests.",
    stats: [{ label: "Total Backlog", color: "text-amber-400", value: "12" }, { label: "Oldest Pending", color: "text-red-400", value: "72 hrs (Culture)" }, { label: "Cleared Today", color: "text-emerald-400", value: "45" }],
    columns: [["Department", "department"], ["Tests Ordered", "testsordered"], ["Pending > 24hrs", "pending24hrs"], ["Pending > 48hrs", "pending48hrs"], ["Action Plan", "actionplan"]],
    badge: ["Status", "status", {"Backlog":"amber","Clear":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Microbiology', 'Histopathology', 'Biochemistry', 'Hematology', 'Serology'];
        const statuses = ['Backlog', 'Backlog', 'Clear', 'Clear', 'Clear'];
        return { department: depts[i], testsordered: '500', pending24hrs: (5 - i).toString(), pending48hrs: (i === 0) ? '2' : '0', actionplan: 'Follow-up needed', status: statuses[i] };
      }),
  },
  "/diagnostics/analytics/performance": {
    ui: 3,
    title: "Department Performance", description: "KPIs for each diagnostic sub-department (Lab, Radiology, Blood Bank).",
    stats: [{ label: "Top Department", color: "text-blue-400", value: "Biochemistry" }, { label: "Overall TAT Met", color: "text-emerald-400", value: "92%" }, { label: "Overall Uptime", color: "text-emerald-400", value: "99%" }],
    columns: [["Department", "department"], ["TAT Compliance", "tatcompliance"], ["Error Rate", "errorrate"], ["Equipment Uptime", "equipmentuptime"], ["Score", "score"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Biochemistry', 'Hematology', 'Radiology (CT)', 'Blood Bank', 'Microbiology'];
        return { department: depts[i], tatcompliance: (90 + i) + '%', errorrate: '0.' + i + '%', equipmentuptime: '99%', score: (9.0 + i * 0.1).toFixed(1) + '/10', status: 'Active' };
      }),
  },
  "/diagnostics/analytics/revenue": {
    ui: 3,
    title: "Revenue Report", description: "Financial analytics for the diagnostics department.",
    stats: [{ label: "Revenue (MTD)", color: "text-emerald-400", value: "$145k" }, { label: "Growth", color: "text-blue-400", value: "+8%" }, { label: "Pending Dues", color: "text-amber-400", value: "$5k" }],
    columns: [["Date", "date"], ["IPD Revenue", "ipdrevenue"], ["OPD Revenue", "opdrevenue"], ["External Referrals", "externalreferrals"], ["Total", "total"]],
    badge: ["Status", "status", {"Reconciled":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { date: (10 + i) + ' Jul 2026', ipdrevenue: '$' + (5000 + i * 100), opdrevenue: '$' + (8000 + i * 100), externalreferrals: '$' + (1000 + i * 50), total: '$' + (14000 + i * 250), status: 'Reconciled' };
      }),
  },
  "/diagnostics/analytics/tat": {
    ui: 3,
    title: "TAT Report (Turn Around Time)", description: "Detailed analysis of time taken from sample collection to report release.",
    stats: [{ label: "Overall Compliance", color: "text-emerald-400", value: "94%" }, { label: "Avg TAT", color: "text-blue-400", value: "2.5 hrs" }, { label: "Breaches (Today)", color: "text-amber-400", value: "12" }],
    columns: [["Test Group", "testgroup"], ["Target TAT", "targettat"], ["Actual Avg TAT", "actualavgtat"], ["Breaches", "breaches"], ["Compliance %", "compliance"]],
    badge: ["Status", "status", {"Met Target":"emerald","Lagging":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const groups = ['Routine Chemistry', 'Routine Hematology', 'STAT Chem', 'Histopathology', 'Micro Culture'];
        const targets = ['4 hrs', '4 hrs', '1 hr', '72 hrs', '48 hrs'];
        const statuses = ['Met Target', 'Met Target', 'Met Target', 'Lagging', 'Met Target'];
        return { testgroup: groups[i], targettat: targets[i], actualavgtat: '3.5 hrs', breaches: i.toString(), compliance: (95 - i) + '%', status: statuses[i] };
      }),
  },
  "/diagnostics/analytics/technician": {
    ui: 3,
    title: "Technician Performance", description: "Metrics on individual staff throughput, errors, and processing time.",
    stats: [{ label: "Total Staff", color: "text-blue-400", value: "45" }, { label: "Avg Samples/Tech", color: "text-emerald-400", value: "120/day" }, { label: "Zero Errors (Month)", color: "text-emerald-400", value: "38 Staff" }],
    columns: [["Tech ID", "techid"], ["Name", "name"], ["Samples Processed", "samplesprocessed"], ["Avg Processing Time", "avgprocessingtime"], ["Error Count", "errorcount"]],
    badge: ["Status", "status", {"Excellent":"emerald","Good":"emerald","Average":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Excellent', 'Good', 'Average', 'Excellent', 'Good'];
        return { techid: 'TCH-' + (101 + i), name: 'Tech ' + (i + 1), samplesprocessed: (500 + i * 50).toString(), avgprocessingtime: '12 mins', errorcount: i.toString(), status: statuses[i] };
      }),
  },
  "/diagnostics/analytics/volume": {
    ui: 3,
    title: "Test Volume Report", description: "Analytics on the number of tests performed by category, machine, and day.",
    stats: [{ label: "Avg Daily Tests", color: "text-blue-400", value: "1,200" }, { label: "Highest Vol Day", color: "text-emerald-400", value: "Monday" }, { label: "Growth (MoM)", color: "text-emerald-400", value: "+5%" }],
    columns: [["Report Date", "reportdate"], ["Category", "category"], ["Total Tests", "totaltests"], ["IPD vs OPD", "ipdvsopd"], ["Revenue Gen", "revenuegen"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['Biochemistry', 'Hematology', 'Radiology', 'Microbiology', 'Pathology'];
        return { reportdate: (10 + i) + ' Jul 2026', category: cats[i], totaltests: (300 + i * 50).toString(), ipdvsopd: '60/40', revenuegen: '$' + (3000 + i * 500), status: 'Generated' };
      }),
  },
  "/diagnostics/blood-bank/components": {
    ui: 3,
    title: "Component Separation", description: "Preparation of PRBC, FFP, and Platelets from Whole Blood.",
    stats: [{ label: "Units to Separate", color: "text-amber-400", value: "10" }, { label: "Separated Today", color: "text-emerald-400", value: "25" }, { label: "Discarded", color: "text-red-400", value: "1" }],
    columns: [["Whole Blood Unit", "wholebloodunit"], ["Collection Time", "collectiontime"], ["Separation Time", "separationtime"], ["Components Produced", "componentsproduced"], ["Technician", "technician"]],
    badge: ["Status", "status", {"Separated":"emerald","Separating":"amber","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Separated', 'Separating', 'Pending', 'Separated', 'Separated'];
        return { wholebloodunit: 'UNIT-' + (8001 + i), collectiontime: '08:00 AM', separationtime: '12:00 PM', componentsproduced: 'PRBC, FFP, PLT', technician: 'Tech Lisa', status: statuses[i] };
      }),
  },
  "/diagnostics/blood-bank/cross-matching": {
    ui: 3,
    title: "Cross Matching", description: "Compatibility testing between donor units and patient samples.",
    stats: [{ label: "Matches Today", color: "text-blue-400", value: "24" }, { label: "Compatible", color: "text-emerald-400", value: "22" }, { label: "Incompatible", color: "text-red-400", value: "2" }],
    columns: [["Match ID", "matchid"], ["Patient Sample ID", "patientsampleid"], ["Donor Unit No", "donorunitno"], ["Technician", "technician"], ["Result", "result"]],
    badge: ["Status", "status", {"Reserved":"emerald","Rejected":"red","Processing":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const results = ['Compatible', 'Compatible', 'Incompatible', 'Compatible', 'Pending'];
        const statuses = ['Reserved', 'Reserved', 'Rejected', 'Reserved', 'Processing'];
        return { matchid: 'XMAT-' + (2001 + i), patientsampleid: 'SAMP-' + (900 + i), donorunitno: 'UNIT-' + (5000 + i), technician: 'Tech Lisa', result: results[i], status: statuses[i] };
      }),
  },
  "/diagnostics/blood-bank/donation": {
    ui: 3,
    title: "Blood Donation", description: "Donor registration, screening, and phlebotomy records.",
    stats: [{ label: "Donors Today", color: "text-blue-400", value: "12" }, { label: "Accepted", color: "text-emerald-400", value: "10" }, { label: "Deferred", color: "text-red-400", value: "2" }],
    columns: [["Donor ID", "donorid"], ["Donor Name", "donorname"], ["Blood Group", "bloodgroup"], ["Screening", "screening"], ["Bag Type", "bagtype"]],
    badge: ["Status", "status", {"Completed":"emerald","Deferred":"red","Bleeding":"blue","Screening":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const screenings = ['Fit', 'Deferred (Low Hb)', 'Fit', 'Fit', 'Pending'];
        const statuses = ['Completed', 'Deferred', 'Completed', 'Bleeding', 'Screening'];
        return { donorid: 'DON-' + (4001 + i), donorname: 'Volunteer ' + (i + 1), bloodgroup: 'O+', screening: screenings[i], bagtype: '450ml Quadruple', status: statuses[i] };
      }),
  },
  "/diagnostics/blood-bank/inventory": {
    ui: 3,
    title: "Blood Inventory", description: "Current stock of Whole Blood, PRBC, FFP, Platelets, and Cryo.",
    stats: [{ label: "Total Units", color: "text-blue-400", value: "150" }, { label: "Low Stock Groups", color: "text-red-400", value: "O-, B-" }, { label: "Expiring Soon", color: "text-amber-400", value: "12" }],
    columns: [["Component", "component"], ["Blood Group", "bloodgroup"], ["Units Available", "unitsavailable"], ["Expiring < 7 Days", "expiring7days"], ["Min Reorder Level", "minreorderlevel"]],
    badge: ["Status", "status", {"Adequate":"emerald","Low Stock":"amber","Critical Low":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const comps = ['PRBC', 'FFP', 'Platelets', 'PRBC', 'Whole Blood'];
        const groups = ['A+', 'O+', 'B-', 'O-', 'AB+'];
        const statuses = ['Adequate', 'Adequate', 'Low Stock', 'Critical Low', 'Adequate'];
        return { component: comps[i], bloodgroup: groups[i], unitsavailable: (10 + i * 5).toString(), expiring7days: i.toString(), minreorderlevel: '10', status: statuses[i] };
      }),
  },
  "/diagnostics/blood-bank/issue": {
    ui: 3,
    title: "Blood Issue", description: "Final release of reserved blood components to the requesting ward.",
    stats: [{ label: "Units Issued Today", color: "text-blue-400", value: "18" }, { label: "Pending Issue", color: "text-amber-400", value: "4" }, { label: "Transfusion Reactions", color: "text-emerald-400", value: "0" }],
    columns: [["Issue ID", "issueid"], ["Patient Name", "patientname"], ["Unit No", "unitno"], ["Issued To", "issuedto"], ["Issue Time", "issuetime"]],
    badge: ["Status", "status", {"Issued":"emerald","Pending Issue":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Issued', 'Pending Issue', 'Issued', 'Issued', 'Issued'];
        return { issueid: 'ISS-' + (3001 + i), patientname: 'Patient ' + (i + 1), unitno: 'UNIT-' + (6000 + i), issuedto: 'OT Nurse (John)', issuetime: '10:30 AM', status: statuses[i] };
      }),
  },
  "/diagnostics/blood-bank/requests": {
    ui: 3,
    title: "Blood Requests", description: "Requisitions from wards and OT for blood components.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "8" }, { label: "STAT/Emergency", color: "text-red-400", value: "2" }, { label: "Reserved", color: "text-emerald-400", value: "6" }],
    columns: [["Req ID", "reqid"], ["Patient Name", "patientname"], ["Blood Group", "bloodgroup"], ["Component Requested", "componentrequested"], ["Urgency", "urgency"]],
    badge: ["Status", "status", {"Pending Crossmatch":"amber","Reserved":"emerald","Issued":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const urgencies = ['Routine', 'STAT', 'Routine', 'Urgent', 'Routine'];
        const statuses = ['Pending Crossmatch', 'Reserved', 'Pending Crossmatch', 'Reserved', 'Issued'];
        return { reqid: 'BREQ-' + (1001 + i), patientname: 'Patient ' + (i + 1), bloodgroup: 'A+', componentrequested: 'PRBC (2 Units)', urgency: urgencies[i], status: statuses[i] };
      }),
  },
  "/diagnostics/blood-bank/transfusion": {
    ui: 3,
    title: "Transfusion Monitoring", description: "Post-issue tracking of transfusion start, end, and adverse reactions.",
    stats: [{ label: "Active Transfusions", color: "text-blue-400", value: "6" }, { label: "Completed", color: "text-emerald-400", value: "12" }, { label: "Adverse Reactions", color: "text-emerald-400", value: "0" }],
    columns: [["Issue ID", "issueid"], ["Patient Name", "patientname"], ["Unit No", "unitno"], ["Start Time", "starttime"], ["End Time", "endtime"], ["Reaction", "reaction"]],
    badge: ["Status", "status", {"In Progress":"blue","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In Progress', 'Completed', 'In Progress', 'Completed', 'Completed'];
        return { issueid: 'ISS-' + (5001 + i), patientname: 'Patient ' + (i + 1), unitno: 'UNIT-' + (7000 + i), starttime: '11:00 AM', endtime: statuses[i] === 'Completed' ? '01:00 PM' : '-', reaction: 'None', status: statuses[i] };
      }),
  },
  "/diagnostics/cardiology/ecg": {
    ui: 3,
    title: "ECG / EKG", description: "Electrocardiogram testing and digital tracing storage.",
    stats: [{ label: "ECGs Today", color: "text-blue-400", value: "45" }, { label: "Abnormal", color: "text-amber-400", value: "5" }, { label: "Completed", color: "text-emerald-400", value: "45" }],
    columns: [["Test ID", "testid"], ["Patient Name", "patientname"], ["Indication", "indication"], ["Technician", "technician"], ["Machine Interpretation", "machineinterpretation"]],
    badge: ["Status", "status", {"Completed":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'Completed', 'Completed', 'Pending', 'Completed'];
        return { testid: 'ECG-' + (1001 + i), patientname: 'Patient ' + (i + 1), indication: 'Chest Pain', technician: 'Tech Alex', machineinterpretation: 'Sinus Rhythm', status: statuses[i] };
      }),
  },
  "/diagnostics/cardiology/echo": {
    ui: 3,
    title: "Echocardiography", description: "2D/3D Echo studies, EF calculation, and reporting.",
    stats: [{ label: "Echos Today", color: "text-blue-400", value: "15" }, { label: "Waiting", color: "text-amber-400", value: "3" }, { label: "Completed", color: "text-emerald-400", value: "12" }],
    columns: [["Test ID", "testid"], ["Patient Name", "patientname"], ["Study Type", "studytype"], ["Cardiologist", "cardiologist"], ["Ejection Fraction", "ejectionfraction"]],
    badge: ["Status", "status", {"Waiting":"amber","In Progress":"blue","Reported":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Waiting', 'In Progress', 'Reported', 'Reported', 'Waiting'];
        return { testid: 'ECO-' + (2001 + i), patientname: 'Patient ' + (i + 1), studytype: '2D Echo Adult', cardiologist: 'Dr. Heart', ejectionfraction: (55 + i) + '%', status: statuses[i] };
      }),
  },
  "/diagnostics/cardiology/holter": {
    ui: 3,
    title: "Holter Monitoring", description: "24/48 hour ambulatory ECG monitor assignment and analysis.",
    stats: [{ label: "Devices Attached", color: "text-amber-400", value: "4" }, { label: "Devices Available", color: "text-emerald-400", value: "2" }, { label: "Pending Analysis", color: "text-blue-400", value: "1" }],
    columns: [["Test ID", "testid"], ["Patient Name", "patientname"], ["Duration", "duration"], ["Hook-up Time", "hookuptime"], ["Analyzer Report", "analyzerreport"]],
    badge: ["Status", "status", {"Attached":"blue","Pending Analysis":"gray","Reported":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Attached', 'Pending Analysis', 'Reported', 'Attached', 'Attached'];
        return { testid: 'HLT-' + (4001 + i), patientname: 'Patient ' + (i + 1), duration: '24 Hours', hookuptime: '09:00 AM', analyzerreport: 'Pending', status: statuses[i] };
      }),
  },
  "/diagnostics/cardiology/reports": {
    ui: 3,
    title: "Cardiology Reports", description: "Review, authorize, and print comprehensive cardiology diagnostic reports.",
    stats: [{ label: "Pending Auth", color: "text-amber-400", value: "12" }, { label: "Authorized Today", color: "text-emerald-400", value: "40" }, { label: "Printed", color: "text-blue-400", value: "35" }],
    columns: [["Report ID", "reportid"], ["Patient Name", "patientname"], ["Modality", "modality"], ["Cardiologist", "cardiologist"], ["Dictation", "dictation"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Authorized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const modalities = ['ECG', 'Echo', 'TMT', 'Holter', 'ECG'];
        const statuses = ['Pending Auth', 'Authorized', 'Authorized', 'Pending Auth', 'Authorized'];
        return { reportid: 'REP-CAR-' + (6001 + i), patientname: 'Patient ' + (i + 1), modality: modalities[i], cardiologist: 'Dr. Heart', dictation: 'Completed', status: statuses[i] };
      }),
  },
  "/diagnostics/cardiology/stress": {
    ui: 3,
    title: "Dobutamine Stress Echo", description: "Pharmacological stress testing monitoring and results.",
    stats: [{ label: "Scheduled", color: "text-blue-400", value: "2" }, { label: "Completed", color: "text-emerald-400", value: "2" }, { label: "Adverse Events", color: "text-gray-400", value: "0" }],
    columns: [["Test ID", "testid"], ["Patient Name", "patientname"], ["Drug/Dose", "drugdose"], ["Cardiologist", "cardiologist"], ["Wall Motion", "wallmotion"]],
    badge: ["Status", "status", {"Scheduled":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Scheduled', 'Completed', 'Completed', 'Scheduled', 'Scheduled'];
        return { testid: 'DSE-' + (5001 + i), patientname: 'Patient ' + (i + 1), drugdose: 'Dobutamine', cardiologist: 'Dr. Heart', wallmotion: 'Normal', status: statuses[i] };
      }),
  },
  "/diagnostics/cardiology/tmt": {
    ui: 3,
    title: "TMT (Stress Test)", description: "Treadmill Test monitoring, protocols, and stress ECG.",
    stats: [{ label: "Scheduled", color: "text-blue-400", value: "8" }, { label: "Completed", color: "text-emerald-400", value: "6" }, { label: "Positive for Ischemia", color: "text-red-400", value: "1" }],
    columns: [["Test ID", "testid"], ["Patient Name", "patientname"], ["Protocol", "protocol"], ["Max Target HR", "maxtargethr"], ["Result", "result"]],
    badge: ["Status", "status", {"Completed":"emerald","Scheduled":"amber","In Progress":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'Completed', 'Scheduled', 'In Progress', 'Completed'];
        return { testid: 'TMT-' + (3001 + i), patientname: 'Patient ' + (i + 1), protocol: 'Bruce', maxtargethr: '150 bpm', result: 'Negative', status: statuses[i] };
      }),
  },
  "/diagnostics/communication/doctor": {
    ui: 3,
    title: "Doctor Notifications", description: "Automated and manual alerts sent to doctors regarding critical results.",
    stats: [{ label: "Alerts Sent Today", color: "text-blue-400", value: "45" }, { label: "Read Receipts", color: "text-emerald-400", value: "40" }, { label: "Unread", color: "text-amber-400", value: "5" }],
    columns: [["Alert ID", "alertid"], ["Doctor Name", "doctorname"], ["Patient Name", "patientname"], ["Test", "test"], ["Delivery Status", "deliverystatus"]],
    badge: ["Status", "status", {"Completed":"emerald","Retry Pending":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Read', 'Delivered', 'Failed', 'Read', 'Read'];
        return { alertid: 'ALT-' + (1001 + i), doctorname: 'Dr. Smith', patientname: 'Patient ' + (i + 1), test: 'Troponin-I', deliverystatus: statuses[i], status: statuses[i] === 'Failed' ? 'Retry Pending' : 'Completed' };
      }),
  },
  "/diagnostics/communication/email": {
    ui: 3,
    title: "Email Reports", description: "Log of diagnostic reports directly emailed to patients or corporate clients.",
    stats: [{ label: "Emails Sent", color: "text-blue-400", value: "120" }, { label: "Opened", color: "text-emerald-400", value: "85" }, { label: "Bounced", color: "text-red-400", value: "2" }],
    columns: [["Email ID", "emailid"], ["Recipient", "recipient"], ["Subject", "subject"], ["Attachments", "attachments"], ["Send Time", "sendtime"]],
    badge: ["Status", "status", {"Delivered":"emerald","Opened":"emerald","Bounced":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Delivered', 'Opened', 'Bounced', 'Delivered', 'Opened'];
        return { emailid: 'EML-' + (3001 + i), recipient: 'patient' + i + '@example.com', subject: 'Your Lab Report', attachments: '1 PDF', sendtime: '11:00 AM', status: statuses[i] };
      }),
  },
  "/diagnostics/communication/patient": {
    ui: 3,
    title: "Patient Notifications", description: "SMS/Email updates to patients (e.g., \"Report Ready for Download\").",
    stats: [{ label: "Messages Sent", color: "text-blue-400", value: "350" }, { label: "Delivered", color: "text-emerald-400", value: "345" }, { label: "Failed", color: "text-red-400", value: "5" }],
    columns: [["Msg ID", "msgid"], ["Patient Name", "patientname"], ["Mobile/Email", "mobileemail"], ["Message Type", "messagetype"], ["Time Sent", "timesent"]],
    badge: ["Status", "status", {"Delivered":"emerald","Failed":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Delivered', 'Delivered', 'Failed', 'Delivered', 'Delivered'];
        return { msgid: 'MSG-' + (2001 + i), patientname: 'Patient ' + (i + 1), mobileemail: '+123456789' + i, messagetype: 'Report Ready', timesent: '10:00 AM', status: statuses[i] };
      }),
  },
  "/diagnostics/communication/sms": {
    ui: 3,
    title: "SMS Notifications", description: "Short SMS alerts for appointment reminders and sample collection updates.",
    stats: [{ label: "SMS Credits", color: "text-blue-400", value: "45,000" }, { label: "Sent Today", color: "text-emerald-400", value: "450" }, { label: "DND Blocks", color: "text-amber-400", value: "12" }],
    columns: [["SMS ID", "smsid"], ["Phone Number", "phonenumber"], ["Message Preview", "messagepreview"], ["Gateway", "gateway"], ["Delivery", "delivery"]],
    badge: ["Status", "status", {"Completed":"emerald","Failed":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Delivered', 'Delivered', 'DND Failed', 'Delivered', 'Delivered'];
        return { smsid: 'SMS-' + (5001 + i), phonenumber: '+123123123' + i, messagepreview: 'Dear Patient, your sample...', gateway: 'Twilio', delivery: statuses[i], status: statuses[i] === 'DND Failed' ? 'Failed' : 'Completed' };
      }),
  },
  "/diagnostics/communication/whatsapp": {
    ui: 3,
    title: "WhatsApp Reports", description: "Log of reports delivered securely via WhatsApp Business API.",
    stats: [{ label: "WhatsApp Sent", color: "text-blue-400", value: "200" }, { label: "Read (Blue Tick)", color: "text-emerald-400", value: "180" }, { label: "Opt-outs", color: "text-gray-400", value: "1" }],
    columns: [["Message ID", "messageid"], ["Phone Number", "phonenumber"], ["Patient Name", "patientname"], ["Report Link", "reportlink"], ["Read Status", "readstatus"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Read', 'Delivered', 'Sent', 'Read', 'Read'];
        return { messageid: 'WA-' + (4001 + i), phonenumber: '+198765432' + i, patientname: 'Patient ' + (i + 1), reportlink: 'https://link.to/report', readstatus: statuses[i], status: 'Completed' };
      }),
  },
  "/diagnostics/equipment/calibration": {
    ui: 3,
    title: "Calibration Certificates", description: "Digital repository of NABL/ISO calibration certificates.",
    stats: [{ label: "Total Certificates", color: "text-blue-400", value: "35" }, { label: "Valid", color: "text-emerald-400", value: "33" }, { label: "Expired", color: "text-red-400", value: "2" }],
    columns: [["Cert ID", "certid"], ["Machine Name", "machinename"], ["Calibrated By", "calibratedby"], ["Date of Issue", "dateofissue"], ["Valid Till", "validtill"]],
    badge: ["Status", "status", {"Valid":"emerald","Expired":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Valid', 'Valid', 'Valid', 'Expired', 'Valid'];
        return { certid: 'CRT-' + (3001 + i), machinename: 'Pipette Set ' + (i + 1), calibratedby: 'National Metrology', dateofissue: '01 Jan 2026', validtill: '31 Dec 2026', status: statuses[i] };
      }),
  },
  "/diagnostics/equipment/downtime": {
    ui: 3,
    title: "Downtime Log", description: "Record of machine breakdowns, TAT impact, and repair resolution.",
    stats: [{ label: "Current Breakdown", color: "text-red-400", value: "1" }, { label: "Avg Repair Time", color: "text-amber-400", value: "4 hours" }, { label: "Uptime (YTD)", color: "text-emerald-400", value: "99.5%" }],
    columns: [["Log ID", "logid"], ["Machine Name", "machinename"], ["Issue Reported", "issuereported"], ["Downtime Start", "downtimestart"], ["Resolution Time", "resolutiontime"]],
    badge: ["Status", "status", {"Resolved":"emerald","Under Repair":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Resolved', 'Resolved', 'Under Repair', 'Resolved', 'Resolved'];
        return { logid: 'DWN-' + (4001 + i), machinename: 'Machine ' + (i + 1), issuereported: 'Probe Error', downtimestart: '10:00 AM', resolutiontime: statuses[i] === 'Resolved' ? '2 hours' : '-', status: statuses[i] };
      }),
  },
  "/diagnostics/equipment/machines": {
    ui: 3,
    title: "Diagnostic Machines", description: "Master list of all laboratory and radiology equipment.",
    stats: [{ label: "Total Machines", color: "text-blue-400", value: "35" }, { label: "Active/Online", color: "text-emerald-400", value: "33" }, { label: "Down/Offline", color: "text-red-400", value: "2" }],
    columns: [["Machine ID", "machineid"], ["Name", "name"], ["Department", "department"], ["Model", "model"], ["Serial No", "serialno"]],
    badge: ["Status", "status", {"Online":"emerald","Offline - Repair":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Biochemistry', 'Hematology', 'Radiology', 'Radiology', 'Pathology'];
        const statuses = ['Online', 'Online', 'Offline - Repair', 'Online', 'Online'];
        return { machineid: 'MAC-' + (1001 + i), name: 'Machine ' + (i + 1), department: depts[i], model: 'Model X' + i, serialno: 'SN-00' + i, status: statuses[i] };
      }),
  },
  "/diagnostics/equipment/maintenance": {
    ui: 3,
    title: "Service & Maintenance", description: "Annual Maintenance Contracts (AMC) and service history.",
    stats: [{ label: "Active Contracts", color: "text-blue-400", value: "30" }, { label: "Renewals Due", color: "text-amber-400", value: "2" }, { label: "Open Service Tickets", color: "text-red-400", value: "1" }],
    columns: [["Contract ID", "contractid"], ["Machine Name", "machinename"], ["Vendor", "vendor"], ["AMC Expiry", "amcexpiry"], ["Last Service", "lastservice"]],
    badge: ["Status", "status", {"Active":"emerald","Expiring Soon":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active', 'Active', 'Expiring Soon', 'Active', 'Active'];
        return { contractid: 'AMC-' + (2001 + i), machinename: 'Machine ' + (i + 1), vendor: 'Siemens Healthineers', amcexpiry: '31 Dec 2026', lastservice: '15 Jun 2026', status: statuses[i] };
      }),
  },
  "/diagnostics/laboratory/authorization": {
    ui: 3,
    title: "Result Authorization", description: "Pathologist/Doctor authorization before releasing reports to patients.",
    stats: [{ label: "Pending Authorization", color: "text-amber-400", value: "15" }, { label: "Authorized Today", color: "text-emerald-400", value: "150" }, { label: "Held Back", color: "text-red-400", value: "2" }],
    columns: [["Report ID", "reportid"], ["Patient Name", "patientname"], ["Department", "department"], ["Verified By", "verifiedby"], ["Abnormalities", "abnormalities"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Authorized":"emerald","Held for Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Biochemistry', 'Hematology', 'Microbiology', 'Immunology', 'Pathology'];
        const statuses = ['Pending Auth', 'Authorized', 'Pending Auth', 'Authorized', 'Held for Review'];
        return { reportid: 'REP-' + (5001 + i), patientname: 'Patient ' + (i + 1), department: depts[i], verifiedby: 'Tech Mark', abnormalities: 'Yes', status: statuses[i] };
      }),
  },
  "/diagnostics/laboratory/critical": {
    ui: 3,
    title: "Critical Values Log", description: "Log of life-threatening test results and mandatory doctor notifications.",
    stats: [{ label: "Criticals Today", color: "text-red-400", value: "4" }, { label: "Doctors Notified", color: "text-blue-400", value: "3" }, { label: "Pending Notification", color: "text-amber-400", value: "1" }],
    columns: [["Result ID", "resultid"], ["Patient Name", "patientname"], ["Test", "test"], ["Critical Value", "criticalvalue"], ["Notified Doctor", "notifieddoctor"]],
    badge: ["Status", "status", {"Notified":"emerald","Pending Notification":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const tests = ['Potassium', 'Hemoglobin', 'Troponin-I', 'Platelets', 'Glucose'];
        const vals = ['6.5 mEq/L (H)', '5.2 g/dL (L)', '2.5 ng/mL (H)', '15,000 /uL (L)', '40 mg/dL (L)'];
        const statuses = ['Notified', 'Pending Notification', 'Notified', 'Notified', 'Notified'];
        return { resultid: 'CRT-' + (6001 + i), patientname: 'Patient ' + (i + 1), test: tests[i], criticalvalue: vals[i], notifieddoctor: 'Dr. Smith', status: statuses[i] };
      }),
  },
  "/diagnostics/laboratory/entry": {
    ui: 3,
    title: "Manual Test Entry", description: "Interface for entering results for rapid tests, microscopy, and manual assays.",
    stats: [{ label: "Pending Entry", color: "text-amber-400", value: "12" }, { label: "Entered Today", color: "text-emerald-400", value: "55" }, { label: "Draft", color: "text-blue-400", value: "3" }],
    columns: [["Barcode ID", "barcodeid"], ["Patient Name", "patientname"], ["Test Name", "testname"], ["Technician", "technician"], ["Entry Time", "entrytime"]],
    badge: ["Status", "status", {"Pending Entry":"amber","Draft":"amber","Entered":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const tests = ['Urine Routine', 'Malaria Smear', 'Rapid Flu A/B', 'Stool Occult Blood', 'Urine Pregnancy'];
        const statuses = ['Pending Entry', 'Draft', 'Entered', 'Entered', 'Pending Entry'];
        return { barcodeid: 'BC-' + (3001 + i), patientname: 'Patient ' + (i + 1), testname: tests[i], technician: 'Tech Mark', entrytime: '11:00 AM', status: statuses[i] };
      }),
  },
  "/diagnostics/laboratory/processing": {
    ui: 3,
    title: "Sample Processing", description: "Samples currently loaded in analyzers and being tested.",
    stats: [{ label: "Active Runs", color: "text-blue-400", value: "8" }, { label: "Machine Alerts", color: "text-emerald-400", value: "0" }, { label: "Pending Load", color: "text-amber-400", value: "2" }],
    columns: [["Run ID", "runid"], ["Analyzer Machine", "analyzermachine"], ["Test Panel", "testpanel"], ["Samples Loaded", "samplesloaded"], ["Est. Completion", "estcompletion"]],
    badge: ["Status", "status", {"Running":"gray","Completed":"emerald","Initializing":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const machines = ['Cobas 6000', 'Sysmex XN-1000', 'Architect i1000', 'VITEK 2', 'Cobas 6000'];
        const statuses = ['Running', 'Running', 'Completed', 'Running', 'Initializing'];
        return { runid: 'RUN-' + (2001 + i), analyzermachine: machines[i], testpanel: 'Routine Chem', samplesloaded: '40/50', estcompletion: '15 mins', status: statuses[i] };
      }),
  },
  "/diagnostics/laboratory/queue": {
    ui: 3,
    title: "Test Queue", description: "Samples received in the lab waiting to be processed.",
    stats: [{ label: "In Queue", color: "text-amber-400", value: "45" }, { label: "Processing", color: "text-blue-400", value: "30" }, { label: "Completed Today", color: "text-emerald-400", value: "210" }],
    columns: [["Barcode ID", "barcodeid"], ["Patient Name", "patientname"], ["Test Panel", "testpanel"], ["Department", "department"], ["TAT Target", "tattarget"]],
    badge: ["Status", "status", {"In Queue":"amber","Processing":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Biochemistry', 'Hematology', 'Microbiology', 'Immunology', 'Pathology'];
        const statuses = ['In Queue', 'Processing', 'In Queue', 'Processing', 'In Queue'];
        return { barcodeid: 'BC-' + (10001 + i), patientname: 'Patient ' + (i + 1), testpanel: 'Liver Function Test', department: depts[i], tattarget: '2 hours', status: statuses[i] };
      }),
  },
  "/diagnostics/laboratory/reports": {
    ui: 3,
    title: "Laboratory Metrics", description: "Statistical reports on lab performance, volumes, and TAT.",
    stats: [{ label: "Total Volume", color: "text-blue-400", value: "1240" }, { label: "Overall TAT Met", color: "text-emerald-400", value: "94%" }, { label: "Revenue", color: "text-gray-400", value: "$14,500" }],
    columns: [["Metric ID", "metricid"], ["Department", "department"], ["Total Tests", "totaltests"], ["Avg TAT", "avgtat"], ["Criticals", "criticals"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Biochemistry', 'Hematology', 'Microbiology', 'Immunology', 'Clinical Pathology'];
        return { metricid: 'MET-' + (7001 + i), department: depts[i], totaltests: (200 * (i + 1)).toString(), avgtat: '1.5 hrs', criticals: (i + 1).toString(), status: 'Generated' };
      }),
  },
  "/diagnostics/laboratory/verification": {
    ui: 3,
    title: "Result Verification", description: "Technician verification of automated analyzer results and flags.",
    stats: [{ label: "Awaiting Verification", color: "text-amber-400", value: "24" }, { label: "Flagged Results", color: "text-red-400", value: "5" }, { label: "Verified", color: "text-emerald-400", value: "180" }],
    columns: [["Result ID", "resultid"], ["Patient Name", "patientname"], ["Test Panel", "testpanel"], ["Flags", "flags"], ["Machine TAT", "machinetat"]],
    badge: ["Status", "status", {"Pending Verify":"amber","Verified":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const flags = ['None', 'High (H)', 'Low (L), Critical (C)', 'None', 'Delta (D)'];
        const statuses = ['Pending Verify', 'Verified', 'Pending Verify', 'Verified', 'Pending Verify'];
        return { resultid: 'RES-' + (4001 + i), patientname: 'Patient ' + (i + 1), testpanel: 'CBC', flags: flags[i], machinetat: '45 mins', status: statuses[i] };
      }),
  },
  "/diagnostics/orders/emergency": {
    ui: 3,
    title: "Emergency Orders", description: "Orders originating from the ER or marked as life-threatening.",
    stats: [{ label: "Active ER Orders", color: "text-red-400", value: "8" }, { label: "Breached TAT", color: "text-emerald-400", value: "0" }, { label: "Completed (Today)", color: "text-blue-400", value: "15" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Test/Procedure", "testprocedure"], ["Origin", "origin"], ["TAT Target", "tattarget"]],
    badge: ["Status", "status", {"Processing":"amber","Collected":"emerald","Report Ready":"emerald","Pending Collection":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Processing', 'Collected', 'Processing', 'Report Ready', 'Pending Collection'];
        return { orderid: 'ER-' + (3001 + i), patientname: 'ER Patient ' + (i + 1), testprocedure: 'Troponin-I', origin: 'ER Bed 3', tattarget: '30 mins', status: statuses[i] };
      }),
  },
  "/diagnostics/orders/pending": {
    ui: 3,
    title: "Pending Orders", description: "Lab and imaging orders awaiting sample collection or scheduling.",
    stats: [{ label: "Total Pending", color: "text-amber-400", value: "45" }, { label: "STAT Orders", color: "text-red-400", value: "5" }, { label: "Routine", color: "text-blue-400", value: "40" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Test/Procedure", "testprocedure"], ["Doctor", "doctor"], ["Priority", "priority"]],
    badge: ["Status", "status", {"Pending Collection":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const tests = ['CBC', 'MRI Brain', 'Lipid Panel', 'X-Ray Chest', 'ECG'];
        const priorities = ['Routine', 'STAT', 'Routine', 'Urgent', 'Routine'];
        return { orderid: 'ORD-' + (1001 + i), patientname: names[i], testprocedure: tests[i], doctor: 'Dr. House', priority: priorities[i], status: 'Pending Collection' };
      }),
  },
  "/diagnostics/orders/referral": {
    ui: 3,
    title: "Referral Orders", description: "Samples or orders sent to external reference laboratories.",
    stats: [{ label: "Pending Referrals", color: "text-amber-400", value: "5" }, { label: "Dispatched", color: "text-blue-400", value: "10" }, { label: "Results Received", color: "text-emerald-400", value: "8" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Test/Procedure", "testprocedure"], ["External Lab", "externallab"], ["Dispatch Time", "dispatchtime"]],
    badge: ["Status", "status", {"Dispatched":"blue","Results Received":"emerald","Pending Dispatch":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Dispatched', 'Results Received', 'Pending Dispatch', 'Dispatched', 'Dispatched'];
        return { orderid: 'REF-' + (5001 + i), patientname: 'Patient ' + (i + 1), testprocedure: 'Genetic Panel', externallab: 'Quest Diagnostics', dispatchtime: '09:00 AM', status: statuses[i] };
      }),
  },
  "/diagnostics/orders/stat": {
    ui: 3,
    title: "STAT Orders", description: "High-priority orders requiring immediate processing across all departments.",
    stats: [{ label: "Active STAT", color: "text-amber-400", value: "12" }, { label: "Avg TAT", color: "text-emerald-400", value: "45 mins" }, { label: "Completed", color: "text-blue-400", value: "22" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Test/Procedure", "testprocedure"], ["Doctor", "doctor"], ["Time Ordered", "timeordered"]],
    badge: ["Status", "status", {"Processing":"amber","Collected":"emerald","Report Ready":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Processing', 'Processing', 'Collected', 'Report Ready', 'Processing'];
        return { orderid: 'STAT-' + (4001 + i), patientname: 'IPD Patient ' + (i + 1), testprocedure: 'ABG Analysis', doctor: 'Dr. Strange', timeordered: '10:15 AM', status: statuses[i] };
      }),
  },
  "/diagnostics/orders/today": {
    ui: 3,
    title: "Today's Orders", description: "All diagnostic orders generated for the current day.",
    stats: [{ label: "Orders Today", color: "text-blue-400", value: "120" }, { label: "Completed", color: "text-emerald-400", value: "80" }, { label: "In Progress", color: "text-amber-400", value: "40" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Test/Procedure", "testprocedure"], ["Time Ordered", "timeordered"], ["Department", "department"]],
    badge: ["Status", "status", {"Collected":"emerald","Processing":"amber","Report Ready":"emerald","Pending Collection":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Collected', 'Processing', 'Report Ready', 'Pending Collection', 'Processing'];
        return { orderid: 'ORD-' + (2001 + i), patientname: 'Patient ' + (i + 1), testprocedure: 'Blood Glucose', timeordered: '08:00 AM', department: 'Laboratory', status: statuses[i] };
      }),
  },
  "/diagnostics/patient-reports/blood-bank": {
    ui: 3,
    title: "Blood Bank Reports", description: "Cross-match reports, transfusion history, and donor certificates.",
    stats: [{ label: "Total Records", color: "text-blue-400", value: "1,500" }, { label: "Cross-matches", color: "text-emerald-400", value: "800" }, { label: "Donor Certs", color: "text-amber-400", value: "700" }],
    columns: [["Patient/Donor ID", "patientdonorid"], ["Name", "name"], ["Report Type", "reporttype"], ["Blood Group", "bloodgroup"], ["Date", "date"]],
    badge: ["Status", "status", {"Available":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Cross-match', 'Donor Certificate', 'Transfusion Reaction', 'Cross-match', 'Donor Certificate'];
        return { patientdonorid: 'ID-' + (4001 + i), name: 'Person ' + (i + 1), reporttype: types[i], bloodgroup: 'O+', date: '12 Jul 2026', status: 'Available' };
      }),
  },
  "/diagnostics/patient-reports/cardiology": {
    ui: 3,
    title: "Patient Cardiology Reports", description: "Access ECG tracings, Echo reports, and TMT summaries.",
    stats: [{ label: "Total Records", color: "text-blue-400", value: "3,400" }, { label: "Recent (30 Days)", color: "text-emerald-400", value: "210" }, { label: "Abnormal findings", color: "text-amber-400", value: "12%" }],
    columns: [["Patient ID", "patientid"], ["Patient Name", "patientname"], ["Report Date", "reportdate"], ["Study Type", "studytype"], ["Cardiologist", "cardiologist"]],
    badge: ["Status", "status", {"Available":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const studies = ['ECG', '2D Echo', 'TMT', 'Holter', 'ECG'];
        return { patientid: 'PID-' + (3001 + i), patientname: 'Patient ' + (i + 1), reportdate: '13 Jul 2026', studytype: studies[i], cardiologist: 'Dr. Heart', status: 'Available' };
      }),
  },
  "/diagnostics/patient-reports/download": {
    ui: 3,
    title: "Bulk Download & Print", description: "Batch printing or downloading of reports for IPD discharges.",
    stats: [{ label: "Batches Today", color: "text-blue-400", value: "15" }, { label: "Printed Successfully", color: "text-emerald-400", value: "12" }, { label: "Failed/Error", color: "text-gray-400", value: "0" }],
    columns: [["Batch ID", "batchid"], ["Ward", "ward"], ["Patient Name", "patientname"], ["Total Reports", "totalreports"], ["Print Queue", "printqueue"]],
    badge: ["Status", "status", {"Printed":"emerald","Printing":"amber","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Printed', 'Printing', 'Pending', 'Printed', 'Printed'];
        return { batchid: 'BCH-' + (5001 + i), ward: 'ICU', patientname: 'Patient ' + (i + 1), totalreports: (3 + i).toString(), printqueue: 'Queue 1', status: statuses[i] };
      }),
  },
  "/diagnostics/patient-reports/laboratory": {
    ui: 3,
    title: "Patient Lab Reports", description: "Search and download patient biochemistry, hematology, and micro reports.",
    stats: [{ label: "Total Records", color: "text-blue-400", value: "14,500" }, { label: "Recent (30 Days)", color: "text-emerald-400", value: "1,200" }, { label: "Search Queries", color: "text-gray-400", value: "450" }],
    columns: [["Patient ID", "patientid"], ["Patient Name", "patientname"], ["Report Date", "reportdate"], ["Test Category", "testcategory"], ["Downloads", "downloads"]],
    badge: ["Status", "status", {"Available":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { patientid: 'PID-' + (1001 + i), patientname: 'Patient ' + (i + 1), reportdate: '15 Jul 2026', testcategory: 'Hematology', downloads: '2', status: 'Available' };
      }),
  },
  "/diagnostics/patient-reports/radiology": {
    ui: 3,
    title: "Patient Radiology Reports", description: "Search and download X-Ray, USG, CT, and MRI reports.",
    stats: [{ label: "Total Records", color: "text-blue-400", value: "8,200" }, { label: "Recent (30 Days)", color: "text-emerald-400", value: "450" }, { label: "Images Attached", color: "text-gray-400", value: "95%" }],
    columns: [["Patient ID", "patientid"], ["Patient Name", "patientname"], ["Report Date", "reportdate"], ["Modality", "modality"], ["PACS Link", "pacslink"]],
    badge: ["Status", "status", {"Available":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const modalities = ['X-Ray', 'CT Scan', 'MRI', 'USG', 'X-Ray'];
        return { patientid: 'PID-' + (2001 + i), patientname: 'Patient ' + (i + 1), reportdate: '14 Jul 2026', modality: modalities[i], pacslink: 'View Image', status: 'Available' };
      }),
  },
  "/diagnostics/qc/calibration": {
    ui: 3,
    title: "Equipment Calibration", description: "Record of routine machine calibration to ensure accurate results.",
    stats: [{ label: "Calibrations Due", color: "text-amber-400", value: "2" }, { label: "Completed (Month)", color: "text-emerald-400", value: "15" }, { label: "Overdue", color: "text-emerald-400", value: "0" }],
    columns: [["Machine ID", "machineid"], ["Machine Name", "machinename"], ["Last Calibrated", "lastcalibrated"], ["Next Due Date", "nextduedate"], ["Performed By", "performedby"]],
    badge: ["Status", "status", {"Valid":"emerald","Due Soon":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const machines = ['Cobas 6000', 'Sysmex XN', 'Architect', 'Centrifuge', 'Microscope'];
        const statuses = ['Valid', 'Valid', 'Due Soon', 'Valid', 'Valid'];
        return { machineid: 'EQ-' + (3001 + i), machinename: machines[i], lastcalibrated: '01 Jul 2026', nextduedate: '31 Jul 2026', performedby: 'Tech John', status: statuses[i] };
      }),
  },
  "/diagnostics/qc/external": {
    ui: 3,
    title: "External Quality Assurance (EQAS)", description: "Proficiency testing results from external accredited agencies.",
    stats: [{ label: "EQAS Cycle", color: "text-blue-400", value: "July 2026" }, { label: "Overall Score", color: "text-emerald-400", value: "98%" }, { label: "Outliers", color: "text-emerald-400", value: "0" }],
    columns: [["EQAS ID", "eqasid"], ["Agency", "agency"], ["Month", "month"], ["Parameters Tested", "parameterstested"], ["Score", "score"]],
    badge: ["Status", "status", {"Passed":"emerald","Pending Results":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const agencies = ['CAP', 'RIQAS', 'EQAS Bio-Rad', 'NABL', 'CAP'];
        const statuses = ['Passed', 'Passed', 'Pending Results', 'Passed', 'Passed'];
        return { eqasid: 'EQS-' + (2001 + i), agency: agencies[i], month: 'July 2026', parameterstested: 'Biochemistry Panel', score: statuses[i] === 'Passed' ? '100%' : '-', status: statuses[i] };
      }),
  },
  "/diagnostics/qc/internal": {
    ui: 3,
    title: "Internal Quality Control (IQC)", description: "Daily calibration logs, Levy-Jennings charts, and rule violations.",
    stats: [{ label: "IQC Runs Today", color: "text-blue-400", value: "24" }, { label: "Pass Rate", color: "text-emerald-400", value: "95%" }, { label: "Westgard Rule Violations", color: "text-red-400", value: "1" }],
    columns: [["Control ID", "controlid"], ["Analyzer", "analyzer"], ["Test Parameter", "testparameter"], ["Target Value", "targetvalue"], ["Actual Value", "actualvalue"]],
    badge: ["Status", "status", {"Pass":"emerald","Warning (1:2s)":"amber","Fail (1:3s)":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const analyzers = ['Cobas 6000', 'Sysmex XN', 'Architect', 'Cobas 6000', 'VITEK'];
        const statuses = ['Pass', 'Pass', 'Warning (1:2s)', 'Fail (1:3s)', 'Pass'];
        return { controlid: 'IQC-' + (1001 + i), analyzer: analyzers[i], testparameter: 'Glucose', targetvalue: '100 mg/dL', actualvalue: (98 + i).toString() + ' mg/dL', status: statuses[i] };
      }),
  },
  "/diagnostics/qc/maintenance": {
    ui: 3,
    title: "Daily Machine Maintenance", description: "Daily, weekly, and monthly preventive maintenance logs.",
    stats: [{ label: "Daily Tasks", color: "text-blue-400", value: "24" }, { label: "Completed", color: "text-emerald-400", value: "20" }, { label: "Pending", color: "text-amber-400", value: "4" }],
    columns: [["Task ID", "taskid"], ["Machine Name", "machinename"], ["Maintenance Type", "maintenancetype"], ["Checklist", "checklist"], ["Technician", "technician"]],
    badge: ["Status", "status", {"Completed":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Daily Wash', 'Weekly Probe Clean', 'Monthly Filter Change', 'Daily Wash', 'Daily Startup'];
        const statuses = ['Completed', 'Completed', 'Pending', 'Completed', 'Completed'];
        return { taskid: 'MNT-' + (4001 + i), machinename: 'Analyzer ' + (i + 1), maintenancetype: types[i], checklist: '5/5', technician: 'Tech Lisa', status: statuses[i] };
      }),
  },
  "/diagnostics/qc/reagent": {
    ui: 3,
    title: "Reagent Management", description: "Tracking lot numbers, expiry dates, and new reagent validation.",
    stats: [{ label: "Active Lots", color: "text-blue-400", value: "45" }, { label: "Expiring Soon", color: "text-amber-400", value: "3" }, { label: "Low Stock", color: "text-red-400", value: "1" }],
    columns: [["Reagent ID", "reagentid"], ["Name", "name"], ["Lot Number", "lotnumber"], ["Expiry Date", "expirydate"], ["Validation", "validation"]],
    badge: ["Status", "status", {"Validated":"emerald","Pending Validation":"amber","Expiring Soon":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Validated', 'Validated', 'Pending Validation', 'Validated', 'Expiring Soon'];
        return { reagentid: 'RGT-' + (5001 + i), name: 'Glucose Reagent R1', lotnumber: 'LOT-90' + i, expirydate: '31 Dec 2026', validation: 'Passed', status: statuses[i] };
      }),
  },
  "/diagnostics/radiology/ctscan": {
    ui: 3,
    title: "CT Scan", description: "Computed Tomography (CT) scheduling, contrast consents, and studies.",
    stats: [{ label: "Scheduled CTs", color: "text-blue-400", value: "6" }, { label: "Completed", color: "text-emerald-400", value: "14" }, { label: "Contrast Prep", color: "text-amber-400", value: "2" }],
    columns: [["Accession No", "accessionno"], ["Patient Name", "patientname"], ["Study Type", "studytype"], ["Contrast Used", "contrastused"], ["Creatinine Level", "creatininelevel"]],
    badge: ["Status", "status", {"Waiting":"amber","Prep":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const studies = ['CT Brain Plain', 'CECT Abdomen', 'HRCT Chest', 'CT KUB', 'CT Angiography'];
        const contrasts = ['No', 'Yes', 'No', 'No', 'Yes'];
        const statuses = ['Waiting', 'Prep', 'Completed', 'Waiting', 'Completed'];
        return { accessionno: 'CT-' + (3001 + i), patientname: 'Patient ' + (i + 1), studytype: studies[i], contrastused: contrasts[i], creatininelevel: '0.9 mg/dL', status: statuses[i] };
      }),
  },
  "/diagnostics/radiology/dexa": {
    ui: 3,
    title: "DEXA Scan", description: "Bone Densitometry scans and osteoporosis screening reports.",
    stats: [{ label: "Scans Today", color: "text-blue-400", value: "5" }, { label: "Completed", color: "text-emerald-400", value: "5" }, { label: "Osteoporosis Detected", color: "text-amber-400", value: "2" }],
    columns: [["Accession No", "accessionno"], ["Patient Name", "patientname"], ["Sites Scanned", "sitesscanned"], ["T-Score (Lowest)", "tscorelowest"], ["Interpretation", "interpretation"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Completed'];
        return { accessionno: 'DXA-' + (6001 + i), patientname: 'Patient ' + (i + 1), sitesscanned: 'Spine, Hip', tscorelowest: '-2.' + i, interpretation: 'Osteopenia', status: statuses[i] };
      }),
  },
  "/diagnostics/radiology/fluoroscopy": {
    ui: 3,
    title: "Fluoroscopy", description: "Dynamic X-ray studies like Barium Swallows, HSG, etc.",
    stats: [{ label: "Scheduled", color: "text-blue-400", value: "4" }, { label: "Completed", color: "text-emerald-400", value: "3" }, { label: "Prep Incomplete", color: "text-gray-400", value: "0" }],
    columns: [["Accession No", "accessionno"], ["Patient Name", "patientname"], ["Study Type", "studytype"], ["Contrast/Barium", "contrastbarium"], ["Radiologist", "radiologist"]],
    badge: ["Status", "status", {"Completed":"emerald","In Progress":"blue","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const studies = ['Barium Swallow', 'Barium Meal', 'Barium Enema', 'HSG', 'MCU'];
        const statuses = ['Completed', 'Completed', 'In Progress', 'Scheduled', 'Scheduled'];
        return { accessionno: 'FLR-' + (7001 + i), patientname: 'Patient ' + (i + 1), studytype: studies[i], contrastbarium: 'Administered', radiologist: 'Dr. Evans', status: statuses[i] };
      }),
  },
  "/diagnostics/radiology/mammography": {
    ui: 3,
    title: "Mammography", description: "Breast imaging studies, BI-RADS tracking, and screenings.",
    stats: [{ label: "Screenings Today", color: "text-blue-400", value: "12" }, { label: "Completed", color: "text-emerald-400", value: "8" }, { label: "Abnormal (Recall)", color: "text-red-400", value: "1" }],
    columns: [["Accession No", "accessionno"], ["Patient Name", "patientname"], ["Study Type", "studytype"], ["Indication", "indication"], ["BI-RADS Category", "biradscategory"]],
    badge: ["Status", "status", {"Reported":"emerald","Waiting":"amber","In Progress":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const studies = ['Screening Bilateral', 'Diagnostic Unilateral', 'Screening Bilateral', 'Diagnostic Bilateral', 'Screening Bilateral'];
        const statuses = ['Reported', 'Waiting', 'Reported', 'In Progress', 'Reported'];
        return { accessionno: 'MAM-' + (5001 + i), patientname: 'Patient ' + (i + 1), studytype: studies[i], indication: 'Routine', biradscategory: (i % 2 === 0) ? 'BI-RADS 1' : 'Pending', status: statuses[i] };
      }),
  },
  "/diagnostics/radiology/mri": {
    ui: 3,
    title: "MRI", description: "Magnetic Resonance Imaging schedules, screening forms, and studies.",
    stats: [{ label: "Scheduled MRIs", color: "text-blue-400", value: "8" }, { label: "Completed", color: "text-emerald-400", value: "10" }, { label: "Wait Time", color: "text-amber-400", value: "45 mins" }],
    columns: [["Accession No", "accessionno"], ["Patient Name", "patientname"], ["Study Type", "studytype"], ["Safety Screening", "safetyscreening"], ["Anesthesia", "anesthesia"]],
    badge: ["Status", "status", {"Waiting":"amber","In Progress":"blue","Completed":"emerald","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const studies = ['MRI Brain', 'MRI Spine C-Cervical', 'MRI Knee', 'MRCP', 'MRI Brain w/ Contrast'];
        const statuses = ['Waiting', 'In Progress', 'Completed', 'Scheduled', 'Completed'];
        return { accessionno: 'MRI-' + (4001 + i), patientname: 'Patient ' + (i + 1), studytype: studies[i], safetyscreening: 'Passed', anesthesia: 'None', status: statuses[i] };
      }),
  },
  "/diagnostics/radiology/reports": {
    ui: 3,
    title: "Radiology Reporting (RIS/PACS)", description: "Radiologist workspace for viewing PACS images, dictating, and authorizing reports.",
    stats: [{ label: "Pending Dictation", color: "text-amber-400", value: "18" }, { label: "Pending Auth", color: "text-blue-400", value: "10" }, { label: "Authorized Today", color: "text-emerald-400", value: "65" }],
    columns: [["Report ID", "reportid"], ["Accession No", "accessionno"], ["Patient Name", "patientname"], ["Modality", "modality"], ["Dictation", "dictation"]],
    badge: ["Status", "status", {"Pending Dictation":"amber","Transcribed":"emerald","Authorized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const modalities = ['CR', 'US', 'CT', 'MR', 'CR'];
        const statuses = ['Pending Dictation', 'Transcribed', 'Authorized', 'Pending Dictation', 'Authorized'];
        return { reportid: 'REP-RAD-' + (8001 + i), accessionno: 'XR/CT-' + (i + 1), patientname: 'Patient ' + (i + 1), modality: modalities[i], dictation: 'Required', status: statuses[i] };
      }),
  },
  "/diagnostics/radiology/ultrasound": {
    ui: 3,
    title: "Ultrasound / Sonography", description: "USG scheduling, patient queue, and study tracking.",
    stats: [{ label: "Pending USG", color: "text-amber-400", value: "8" }, { label: "Completed", color: "text-emerald-400", value: "22" }, { label: "Avg Scan Time", color: "text-blue-400", value: "20 mins" }],
    columns: [["Accession No", "accessionno"], ["Patient Name", "patientname"], ["Study Type", "studytype"], ["Radiologist", "radiologist"], ["Images Sent to PACS", "imagessenttopacs"]],
    badge: ["Status", "status", {"Waiting":"amber","In Progress":"blue","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const studies = ['Whole Abdomen', 'KUB', 'Pelvis', 'TVS', 'Neck/Thyroid'];
        const statuses = ['Waiting', 'In Progress', 'Completed', 'Waiting', 'Completed'];
        return { accessionno: 'US-' + (2001 + i), patientname: 'Patient ' + (i + 1), studytype: studies[i], radiologist: 'Dr. Brown', imagessenttopacs: 'Yes', status: statuses[i] };
      }),
  },
  "/diagnostics/radiology/xray": {
    ui: 3,
    title: "X-Ray Department", description: "Digital Radiography (DR) and Computed Radiography (CR) queue.",
    stats: [{ label: "Pending X-Rays", color: "text-amber-400", value: "12" }, { label: "Completed", color: "text-emerald-400", value: "45" }, { label: "Wait Time", color: "text-blue-400", value: "15 mins" }],
    columns: [["Accession No", "accessionno"], ["Patient Name", "patientname"], ["Body Part", "bodypart"], ["Technician", "technician"], ["Images", "images"]],
    badge: ["Status", "status", {"Waiting":"amber","Completed":"emerald","In Progress":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const parts = ['Chest PA', 'Knee AP/LAT', 'Spine L/S', 'Abdomen Erect', 'Chest AP'];
        const statuses = ['Waiting', 'Completed', 'In Progress', 'Waiting', 'Completed'];
        return { accessionno: 'XR-' + (1001 + i), patientname: 'Patient ' + (i + 1), bodypart: parts[i], technician: 'Tech Jane', images: '2', status: statuses[i] };
      }),
  },
  "/diagnostics/results/amended": {
    ui: 3,
    title: "Amended Reports", description: "Audit trail of reports that were modified after initial release.",
    stats: [{ label: "Amendments (Month)", color: "text-amber-400", value: "3" }, { label: "Recall Notices Sent", color: "text-blue-400", value: "3" }, { label: "Pending Approval", color: "text-emerald-400", value: "0" }],
    columns: [["Report ID", "reportid"], ["Patient Name", "patientname"], ["Original Release", "originalrelease"], ["Amended Date", "amendeddate"], ["Reason for Change", "reasonforchange"]],
    badge: ["Status", "status", {"Amended":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Amended', 'Amended', 'Amended', 'Amended', 'Amended'];
        return { reportid: 'AMD-' + (4001 + i), patientname: 'Patient ' + (i + 1), originalrelease: '10 Jul 2026', amendeddate: '11 Jul 2026', reasonforchange: 'Typo in Reference Range', status: statuses[i] };
      }),
  },
  "/diagnostics/results/pending": {
    ui: 3,
    title: "Pending Results", description: "List of authorized results waiting for final dispatch/printing.",
    stats: [{ label: "Ready to Print", color: "text-blue-400", value: "45" }, { label: "Pending SMS/Email", color: "text-amber-400", value: "12" }, { label: "STAT Reports", color: "text-red-400", value: "3" }],
    columns: [["Report ID", "reportid"], ["Patient Name", "patientname"], ["Test Panel", "testpanel"], ["Authorized By", "authorizedby"], ["Auth Time", "authtime"]],
    badge: ["Status", "status", {"Pending Dispatch":"amber","Sent to Portal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Dispatch', 'Pending Dispatch', 'Sent to Portal', 'Pending Dispatch', 'Sent to Portal'];
        return { reportid: 'RPT-' + (1001 + i), patientname: 'Patient ' + (i + 1), testpanel: 'CBC', authorizedby: 'Dr. Pathologist', authtime: '14:30', status: statuses[i] };
      }),
  },
  "/diagnostics/results/released": {
    ui: 3,
    title: "Released Reports", description: "Archive of all final reports delivered to patients and doctors.",
    stats: [{ label: "Released Today", color: "text-blue-400", value: "210" }, { label: "App/Portal Views", color: "text-emerald-400", value: "145" }, { label: "Physical Prints", color: "text-gray-400", value: "65" }],
    columns: [["Report ID", "reportid"], ["Patient Name", "patientname"], ["Release Date", "releasedate"], ["Delivered Via", "deliveredvia"], ["View Count", "viewcount"]],
    badge: ["Status", "status", {"Delivered":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const methods = ['Email/Portal', 'Print', 'WhatsApp', 'Email/Portal', 'Print'];
        const statuses = ['Delivered', 'Delivered', 'Delivered', 'Delivered', 'Delivered'];
        return { reportid: 'REL-' + (3001 + i), patientname: 'Patient ' + (i + 1), releasedate: 'Today', deliveredvia: methods[i], viewcount: (1 + i).toString(), status: statuses[i] };
      }),
  },
  "/diagnostics/results/signature": {
    ui: 3,
    title: "Digital Signatures", description: "Manage digital signature tokens for pathologists and radiologists.",
    stats: [{ label: "Active Tokens", color: "text-blue-400", value: "12" }, { label: "Expiring Soon", color: "text-amber-400", value: "1" }, { label: "Revoked", color: "text-gray-400", value: "0" }],
    columns: [["Doctor Name", "doctorname"], ["Department", "department"], ["Certificate ID", "certificateid"], ["Valid Till", "validtill"]],
    badge: ["Status", "status", {"Active":"emerald","Expiring":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active', 'Active', 'Active', 'Expiring', 'Active'];
        return { doctorname: 'Dr. Name ' + (i + 1), department: 'Pathology', certificateid: 'SIG-' + (5001 + i), validtill: '31 Dec 2026', status: statuses[i] };
      }),
  },
  "/diagnostics/results/verified": {
    ui: 3,
    title: "Verified Results", description: "Intermediate queue of results verified by technicians but waiting for doctor sign-off.",
    stats: [{ label: "Pending Sign-off", color: "text-amber-400", value: "28" }, { label: "Critical Findings", color: "text-red-400", value: "2" }, { label: "Signed Today", color: "text-emerald-400", value: "150" }],
    columns: [["Result ID", "resultid"], ["Patient Name", "patientname"], ["Test", "test"], ["Verified By", "verifiedby"], ["Abnormal Flags", "abnormalflags"]],
    badge: ["Status", "status", {"Pending Sign-off":"amber","Signed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Sign-off', 'Pending Sign-off', 'Pending Sign-off', 'Signed', 'Pending Sign-off'];
        return { resultid: 'RES-' + (2001 + i), patientname: 'Patient ' + (i + 1), test: 'LFT', verifiedby: 'Tech Jane', abnormalflags: i % 2 === 0 ? 'Yes' : 'No', status: statuses[i] };
      }),
  },
  "/diagnostics/sample/barcode": {
    ui: 3,
    title: "Barcode Printing", description: "Generate and print barcode labels for specimen tubes.",
    stats: [{ label: "Pending Print", color: "text-amber-400", value: "15" }, { label: "Printed Today", color: "text-emerald-400", value: "180" }, { label: "Printer Errors", color: "text-gray-400", value: "0" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Test Code", "testcode"], ["Container Type", "containertype"], ["Barcode Status", "barcodestatus"]],
    badge: ["Status", "status", {"Printed":"emerald","Pending Print":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Printed', 'Pending Print', 'Printed', 'Printed', 'Pending Print'];
        return { orderid: 'ORD-' + (7001 + i), patientname: 'Patient ' + (i + 1), testcode: 'LIP-01', containertype: 'SST', barcodestatus: 'Generated', status: statuses[i] };
      }),
  },
  "/diagnostics/sample/collection": {
    ui: 3,
    title: "Sample Collection", description: "Phlebotomy dashboard for collecting blood and other specimens.",
    stats: [{ label: "Awaiting Collection", color: "text-amber-400", value: "35" }, { label: "Collected Today", color: "text-emerald-400", value: "142" }, { label: "Missed/Refused", color: "text-red-400", value: "2" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Tests", "tests"], ["Container Type", "containertype"], ["Fasting", "fasting"]],
    badge: ["Status", "status", {"Pending":"amber","Collected":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const containers = ['EDTA (Purple)', 'SST (Yellow)', 'Sodium Citrate (Blue)', 'Urine Container', 'Fluoride (Grey)'];
        const statuses = ['Pending', 'Collected', 'Pending', 'Pending', 'Collected'];
        return { orderid: 'ORD-' + (6001 + i), patientname: 'Patient ' + (i + 1), tests: 'CBC, HbA1c', containertype: containers[i], fasting: 'Yes (12h)', status: statuses[i] };
      }),
  },
  "/diagnostics/sample/history": {
    ui: 3,
    title: "Collection History", description: "Historical log of all sample collections and phlebotomy activity.",
    stats: [{ label: "Avg Daily Collections", color: "text-blue-400", value: "150" }, { label: "Success Rate", color: "text-emerald-400", value: "98%" }, { label: "Patient Satisfaction", color: "text-emerald-400", value: "4.8/5" }],
    columns: [["Collection ID", "collectionid"], ["Date", "date"], ["Total Samples", "totalsamples"], ["Successful Collections", "successfulcollections"], ["Rejections", "rejections"]],
    badge: ["Status", "status", {"Archived":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { collectionid: 'LOG-' + (20260701 + i), date: '0' + (i + 1) + ' Jul 2026', totalsamples: '145', successfulcollections: '142', rejections: '3', status: 'Archived' };
      }),
  },
  "/diagnostics/sample/home": {
    ui: 3,
    title: "Home Collection", description: "Manage home visit schedules for phlebotomists.",
    stats: [{ label: "Total Visits", color: "text-blue-400", value: "18" }, { label: "Completed", color: "text-emerald-400", value: "10" }, { label: "In Route", color: "text-amber-400", value: "2" }],
    columns: [["Visit ID", "visitid"], ["Patient Name", "patientname"], ["Address", "address"], ["Time Slot", "timeslot"], ["Phlebotomist", "phlebotomist"]],
    badge: ["Status", "status", {"Completed":"emerald","In Route":"gray","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'In Route', 'Scheduled', 'Scheduled', 'Completed'];
        return { visitid: 'HV-' + (1001 + i), patientname: 'Patient ' + (i + 1), address: '123 Main St, Apt ' + i, timeslot: '08:00 AM - 10:00 AM', phlebotomist: 'John Doe', status: statuses[i] };
      }),
  },
  "/diagnostics/sample/rejection": {
    ui: 3,
    title: "Sample Rejection", description: "Log of rejected samples due to hemolysis, clotting, or insufficient quantity.",
    stats: [{ label: "Rejected Today", color: "text-red-400", value: "3" }, { label: "Rejection Rate", color: "text-amber-400", value: "1.5%" }, { label: "Recollected", color: "text-emerald-400", value: "2" }],
    columns: [["Barcode ID", "barcodeid"], ["Patient Name", "patientname"], ["Test", "test"], ["Rejection Reason", "rejectionreason"], ["Rejected By", "rejectedby"]],
    badge: ["Status", "status", {"Recollection Pending":"amber","Recollected":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const reasons = ['Hemolyzed', 'Clotted', 'Insufficient Quantity', 'Wrong Container', 'Unlabeled'];
        const statuses = ['Recollection Pending', 'Recollected', 'Recollection Pending', 'Recollected', 'Recollection Pending'];
        return { barcodeid: 'BC-' + (9001 + i), patientname: 'Patient ' + (i + 1), test: 'K+', rejectionreason: reasons[i], rejectedby: 'Lab Tech Sarah', status: statuses[i] };
      }),
  },
  "/diagnostics/sample/tracking": {
    ui: 3,
    title: "Sample Tracking", description: "Track the movement of samples from collection to the laboratory.",
    stats: [{ label: "In Transit", color: "text-blue-400", value: "24" }, { label: "Received in Lab", color: "text-emerald-400", value: "120" }, { label: "Delayed", color: "text-red-400", value: "1" }],
    columns: [["Barcode ID", "barcodeid"], ["Patient Name", "patientname"], ["Collected By", "collectedby"], ["Location", "location"], ["Time Since Collection", "timesincecollection"]],
    badge: ["Status", "status", {"In Transit":"amber","Received":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const locs = ['Phlebotomy Room 1', 'Pneumatic Tube', 'Lab Reception', 'Centrifuge', 'Pneumatic Tube'];
        const statuses = ['In Transit', 'Received', 'In Transit', 'In Transit', 'Received'];
        return { barcodeid: 'BC-' + (8001 + i), patientname: 'Patient ' + (i + 1), collectedby: 'Tech John', location: locs[i], timesincecollection: '15 mins', status: statuses[i] };
      }),
  },
  "/diagnostics/settings/integration": {
    ui: 3,
    title: "Machine Integration (LIS)", description: "HL7/ASTM interfacing configuration between analyzers and LIS.",
    stats: [{ label: "Connected Machines", color: "text-blue-400", value: "24" }, { label: "Bi-Directional", color: "text-emerald-400", value: "20" }, { label: "Connection Errors", color: "text-gray-400", value: "0" }],
    columns: [["Interface ID", "interfaceid"], ["Machine Name", "machinename"], ["Protocol", "protocol"], ["Port/IP", "portip"], ["Last Ping", "lastping"]],
    badge: ["Status", "status", {"Connected":"emerald","Disconnected":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Connected', 'Connected', 'Connected', 'Disconnected', 'Connected'];
        return { interfaceid: 'LIS-' + (301 + i), machinename: 'Analyzer ' + (i + 1), protocol: 'HL7', portip: '192.168.1.' + (50 + i), lastping: 'Just Now', status: statuses[i] };
      }),
  },
  "/diagnostics/settings/master": {
    ui: 3,
    title: "Test Master Configuration", description: "Define new tests, pricing, sample requirements, and TAT targets.",
    stats: [{ label: "Active Tests", color: "text-blue-400", value: "1,250" }, { label: "Recently Added", color: "text-emerald-400", value: "5" }, { label: "Inactive", color: "text-gray-400", value: "12" }],
    columns: [["Test Code", "testcode"], ["Test Name", "testname"], ["Department", "department"], ["Sample Type", "sampletype"], ["Price", "price"]],
    badge: ["Status", "status", {"Active":"emerald","Inactive":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Active'];
        return { testcode: 'TST-' + (100 + i), testname: 'Test Panel ' + (i + 1), department: 'Biochemistry', sampletype: 'Serum', price: '$' + (20 + i * 10), status: statuses[i] };
      }),
  },
  "/diagnostics/settings/preferences": {
    ui: 3,
    title: "Diagnostic Preferences", description: "Department-wide settings for TAT alerts, critical thresholds, and printing defaults.",
    stats: [{ label: "Auto-Authorization", color: "text-emerald-400", value: "Enabled" }, { label: "Critical SMS Alerts", color: "text-emerald-400", value: "Enabled" }, { label: "Barcode Format", color: "text-blue-400", value: "Code128" }],
    columns: [["Setting Name", "settingname"], ["Category", "category"], ["Current Value", "currentvalue"], ["Last Modified", "lastmodified"], ["Modified By", "modifiedby"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const settings = ['Auto-Authorize Normal Results', 'Critical Value SMS Alert', 'Default Print Size', 'Enable WhatsApp API', 'Delta Check Trigger (%)'];
        const values = ['True', 'True', 'A4', 'True', '20'];
        return { settingname: settings[i], category: 'Workflow', currentvalue: values[i], lastmodified: '15 Jun 2026', modifiedby: 'System Admin', status: 'Active' };
      }),
  },
  "/diagnostics/settings/reference": {
    ui: 3,
    title: "Reference Ranges", description: "Configure normal ranges based on age, gender, and methodology.",
    stats: [{ label: "Total Parameters", color: "text-blue-400", value: "3,500" }, { label: "Updated This Year", color: "text-emerald-400", value: "150" }, { label: "Pending Review", color: "text-gray-400", value: "0" }],
    columns: [["Parameter", "parameter"], ["Gender", "gender"], ["Age Range", "agerange"], ["Min Range", "minrange"], ["Max Range", "maxrange"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const genders = ['Male', 'Female', 'Child', 'All', 'Male'];
        return { parameter: 'Hemoglobin', gender: genders[i], agerange: 'Adult', minrange: '13.0', maxrange: '17.0', status: 'Active' };
      }),
  },
  "/diagnostics/settings/templates": {
    ui: 3,
    title: "Report Templates", description: "Customize the PDF layout and formatting for patient reports.",
    stats: [{ label: "Active Templates", color: "text-blue-400", value: "15" }, { label: "Drafts", color: "text-amber-400", value: "2" }, { label: "Default", color: "text-gray-400", value: "Standard A4" }],
    columns: [["Template ID", "templateid"], ["Department", "department"], ["Layout Style", "layoutstyle"], ["Last Updated", "lastupdated"], ["Updated By", "updatedby"]],
    badge: ["Status", "status", {"Active":"emerald","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['General Lab', 'Radiology', 'Histopathology', 'Microbiology', 'Cardiology'];
        const statuses = ['Active', 'Active', 'Draft', 'Active', 'Active'];
        return { templateid: 'TPL-' + (201 + i), department: depts[i], layoutstyle: 'Standard A4', lastupdated: '01 Jan 2026', updatedby: 'Admin', status: statuses[i] };
      }),
  },
};

export default pages;
