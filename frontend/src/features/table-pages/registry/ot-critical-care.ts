import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/ot/analytics/bed-utilization": {
    ui: 5,
    title: "Bed Utilization Analytics", description: "Detailed heatmaps and trends of ICU bed occupancy and bottlenecks.",
    stats: [{ label: "Peak Hour", color: "text-blue-400", value: "14:00 - 18:00" }, { label: "Turnaway (No Bed)", color: "text-emerald-400", value: "1/month" }, { label: "Bed Cleaning TAT", color: "text-amber-400", value: "45 mins" }],
    columns: [["Unit", "unit"], ["Peak Occupancy Time", "peakoccupancytime"], ["Turnaway Rate", "turnawayrate"], ["Avg Vacant Time", "avgvacanttime"], ["Throughput", "throughput"]],
    badge: ["Status", "status", {"Optimal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const units = ['SICU', 'MICU', 'CCU', 'NICU', 'PICU'];
        return { unit: units[i], peakoccupancytime: '16:00', turnawayrate: '0.' + i + '%', avgvacanttime: '2.' + i + ' hrs', throughput: (50 + i * 5) + ' / month', status: 'Optimal' };
      }),
  },
  "/ot/analytics/duration": {
    ui: 5,
    title: "Surgery Duration Analysis", description: "Comparison of scheduled vs actual surgery times to optimize booking.",
    stats: [{ label: "Avg Underestimation", color: "text-amber-400", value: "12 mins" }, { label: "Highly Variable Proc", color: "text-red-400", value: "Laparotomy" }, { label: "Scheduling Accuracy", color: "text-blue-400", value: "85%" }],
    columns: [["Procedure Type", "proceduretype"], ["Samples", "samples"], ["Avg Scheduled Time", "avgscheduledtime"], ["Avg Actual Time", "avgactualtime"], ["Variance", "variance"]],
    badge: ["Status", "status", {"Acceptable":"emerald","High Variance":"amber","Excellent":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const procedures = ['Appendectomy', 'Cholecystectomy', 'CABG', 'Hernia Repair', 'Craniotomy'];
        const variances = ['+10 mins', '+5 mins', '+30 mins', '-5 mins', '+45 mins'];
        const statuses = ['Acceptable', 'Acceptable', 'High Variance', 'Excellent', 'High Variance'];
        return { proceduretype: procedures[i], samples: '150', avgscheduledtime: '2 hrs', avgactualtime: '2 hrs 10 mins', variance: variances[i], status: statuses[i] };
      }),
  },
  "/ot/analytics/equipment-utilization": {
    ui: 5,
    title: "Equipment Utilization", description: "Tracking usage rates for ventilators, ECMO, IABP, and dialysis machines.",
    stats: [{ label: "Ventilator Utilization", color: "text-emerald-400", value: "65%" }, { label: "ECMO Active", color: "text-blue-400", value: "1" }, { label: "Equipment Shortage Alerts", color: "text-emerald-400", value: "0" }],
    columns: [["Equipment Category", "equipmentcategory"], ["Total Assets", "totalassets"], ["In Use", "inuse"], ["Utilization %", "utilization"], ["Maintenance Down", "maintenancedown"]],
    badge: ["Status", "status", {"Adequate Stock":"emerald","Low Stock":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const categories = ['Ventilators', 'Syringe Pumps', 'CRRT Machines', 'IABP', 'ECMO'];
        const totals = [20, 150, 5, 3, 2];
        const inuse = [13, 120, 2, 1, 1];
        const statuses = ['Adequate Stock', 'Adequate Stock', 'Adequate Stock', 'Adequate Stock', 'Low Stock'];
        return { equipmentcategory: categories[i], totalassets: totals[i].toString(), inuse: inuse[i].toString(), utilization: Math.round((inuse[i] / totals[i]) * 100) + '%', maintenancedown: i === 0 ? '1' : '0', status: statuses[i] };
      }),
  },
  "/ot/analytics/kpis": {
    ui: 5,
    title: "ICU KPIs", description: "Key Performance Indicators for Intensive Care Units.",
    stats: [{ label: "Ventilator Days/Patient", color: "text-blue-400", value: "3.2" }, { label: "Readmission Rate (48h)", color: "text-emerald-400", value: "2.1%" }, { label: "Central Line Days", color: "text-gray-400", value: "4.5" }],
    columns: [["KPI Name", "kpiname"], ["Current Value", "currentvalue"], ["Target", "target"], ["Variance", "variance"], ["Benchmark", "benchmark"]],
    badge: ["Status", "status", {"Met Target":"emerald","Lagging":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const kpis = ['Mortality Rate', 'Readmission < 48hrs', 'ALOS', 'VAP Rate', 'CLABSI Rate'];
        const currents = ['4.5%', '2.1%', '4.2 Days', '1.2', '0.5'];
        const targets = ['< 5%', '< 3%', '< 4 Days', '< 1.5', '< 1.0'];
        const statuses = ['Met Target', 'Met Target', 'Lagging', 'Met Target', 'Met Target'];
        return { kpiname: kpis[i], currentvalue: currents[i], target: targets[i], variance: 'N/A', benchmark: 'National Avg', status: statuses[i] };
      }),
  },
  "/ot/analytics/performance": {
    ui: 5,
    title: "OT Performance Analytics", description: "Dashboards showing on-time starts, cancellations, and turnaround efficiency.",
    stats: [{ label: "On-Time First Case", color: "text-amber-400", value: "82%" }, { label: "Cancellation Rate", color: "text-emerald-400", value: "3%" }, { label: "Avg Turnaround", color: "text-emerald-400", value: "25m" }],
    columns: [["Metric", "metric"], ["Current Month", "currentmonth"], ["Previous Month", "previousmonth"], ["Trend", "trend"], ["Target", "target"]],
    badge: ["Status", "status", {"Lagging":"amber","Met Target":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['On-Time Starts', 'Cancellation Rate', 'Avg Turnaround Time', 'Overtime Hours', 'Case Duration Accuracy'];
        const currents = ['82%', '3%', '25 mins', '45 hrs', '88%'];
        const targets = ['> 90%', '< 5%', '< 30 mins', '< 40 hrs', '> 85%'];
        const statuses = ['Lagging', 'Met Target', 'Met Target', 'Lagging', 'Met Target'];
        return { metric: metrics[i], currentmonth: currents[i], previousmonth: 'N/A', trend: 'Improving', target: targets[i], status: statuses[i] };
      }),
  },
  "/ot/analytics/surgeon": {
    ui: 5,
    title: "Surgeon Performance", description: "Analytics on individual surgeon volume, average duration, and outcomes.",
    stats: [{ label: "Top Volume Surgeon", color: "text-blue-400", value: "Dr. Grey" }, { label: "Avg Duration Variance", color: "text-amber-400", value: "+5 mins" }, { label: "Overall SSI Rate", color: "text-emerald-400", value: "0.8%" }],
    columns: [["Surgeon Name", "surgeonname"], ["Total Cases", "totalcases"], ["Avg Duration vs Expected", "avgdurationvsexpected"], ["Complications", "complications"], ["SSI Rate", "ssirate"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { surgeonname: 'Dr. Surgeon ' + (i + 1), totalcases: (40 - i * 5).toString(), avgdurationvsexpected: (i % 2 === 0 ? '+5%' : '-2%'), complications: i.toString(), ssirate: '0.' + i + '%', status: 'Active' };
      }),
  },
  "/ot/anesthesia/assessment": {
    ui: 5,
    title: "Intra-Op Anesthesia Assessment", description: "Continuous logging of patient condition and depth of anesthesia.",
    stats: [{ label: "General Anesthesia", color: "text-blue-400", value: "12" }, { label: "Regional/Spinal", color: "text-emerald-400", value: "4" }, { label: "MAC/Sedation", color: "text-amber-400", value: "2" }],
    columns: [["Log ID", "logid"], ["Surgery ID", "surgeryid"], ["Anesthesia Type", "anesthesiatype"], ["Airway Device", "airwaydevice"], ["BIS Index", "bisindex"]],
    badge: ["Status", "status", {"Active":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['General (GA)', 'Spinal', 'Epidural', 'GA', 'MAC'];
        const statuses = ['Active', 'Completed', 'Active', 'Completed', 'Active'];
        return { logid: 'ANE-' + (1001 + i), surgeryid: 'SUR-' + (1000 + i), anesthesiatype: types[i], airwaydevice: 'Endotracheal Tube', bisindex: '45-60', status: statuses[i] };
      }),
  },
  "/ot/anesthesia/medication": {
    ui: 5,
    title: "Anesthesia Medication Log", description: "Exact timestamps and dosages of anesthetics and emergency drugs given.",
    stats: [{ label: "Total Drugs Logged", color: "text-blue-400", value: "145" }, { label: "Narcotics Checked", color: "text-emerald-400", value: "100%" }, { label: "Emergency Drugs Used", color: "text-red-400", value: "1" }],
    columns: [["Med Log ID", "medlogid"], ["Surgery ID", "surgeryid"], ["Drug Name", "drugname"], ["Dose", "dose"], ["Time Administered", "timeadministered"]],
    badge: ["Status", "status", {"Administered":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const drugs = ['Propofol', 'Rocuronium', 'Fentanyl', 'Ephedrine', 'Neostigmine'];
        return { medlogid: 'AML-' + (3001 + i), surgeryid: 'SUR-1001', drugname: drugs[i], dose: (10 * (i + 1)) + ' mg', timeadministered: '08:' + (15 + i * 10) + ' AM', status: 'Administered' };
      }),
  },
  "/ot/anesthesia/monitoring": {
    ui: 5,
    title: "Intraoperative Monitoring", description: "Automated vitals data capture (HR, BP, SpO2, EtCO2) from monitors.",
    stats: [{ label: "Connected Monitors", color: "text-emerald-400", value: "8/8" }, { label: "Alarms Triggered", color: "text-red-400", value: "2" }, { label: "Data Integrity", color: "text-blue-400", value: "99.9%" }],
    columns: [["Monitor ID", "monitorid"], ["OT Room", "otroom"], ["Avg HR", "avghr"], ["Avg MAP", "avgmap"], ["EtCO2 Range", "etco2range"]],
    badge: ["Status", "status", {"Stable":"emerald","Alarm (BP Drop)":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Stable', 'Stable', 'Alarm (BP Drop)', 'Stable', 'Stable'];
        return { monitorid: 'MON-' + (4001 + i), otroom: 'OT ' + (1 + i), avghr: '75 bpm', avgmap: '85 mmHg', etco2range: '35-40 mmHg', status: statuses[i] };
      }),
  },
  "/ot/anesthesia/plan": {
    ui: 5,
    title: "Anesthesia Plan", description: "Pre-defined protocols for drug administration and pain management.",
    stats: [{ label: "Plans Created", color: "text-blue-400", value: "18" }, { label: "Approved", color: "text-emerald-400", value: "18" }, { label: "Deviations", color: "text-emerald-400", value: "0" }],
    columns: [["Plan ID", "planid"], ["Patient Name", "patientname"], ["Induction Agents", "inductionagents"], ["Maintenance", "maintenance"], ["Analgesia Plan", "analgesiaplan"]],
    badge: ["Status", "status", {"Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { planid: 'APL-' + (2001 + i), patientname: 'Patient ' + (i + 1), inductionagents: 'Propofol, Fentanyl', maintenance: 'Desflurane', analgesiaplan: 'IV Paracetamol, Morphine', status: 'Approved' };
      }),
  },
  "/ot/anesthesia/recovery": {
    ui: 5,
    title: "Extubation & Handover", description: "Reversal of anesthesia, extubation notes, and handover to PACU.",
    stats: [{ label: "Handovers Today", color: "text-blue-400", value: "10" }, { label: "Delayed Emergence", color: "text-emerald-400", value: "0" }, { label: "Re-intubations", color: "text-emerald-400", value: "0" }],
    columns: [["Handover ID", "handoverid"], ["Patient Name", "patientname"], ["Extubation Time", "extubationtime"], ["Aldrete Score", "aldretescore"], ["Handover To", "handoverto"]],
    badge: ["Status", "status", {"Completed":"emerald","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'Completed', 'In Progress', 'Completed', 'Completed'];
        return { handoverid: 'HND-' + (5001 + i), patientname: 'Patient ' + (i + 1), extubationtime: '12:30 PM', aldretescore: '8/10', handoverto: 'PACU Nurse', status: statuses[i] };
      }),
  },
  "/ot/blood/cross-match": {
    ui: 5,
    title: "Cross Match Status", description: "Live view of cross-matching progress for reserved units.",
    stats: [{ label: "Samples in Lab", color: "text-amber-400", value: "4" }, { label: "Matches Found", color: "text-emerald-400", value: "6" }, { label: "Antibody Screen Pos", color: "text-emerald-400", value: "0" }],
    columns: [["Patient ID", "patientid"], ["Patient Name", "patientname"], ["Blood Group", "bloodgroup"], ["Sample Status", "samplestatus"], ["Cross-match Result", "crossmatchresult"]],
    badge: ["Status", "status", {"In Progress":"amber","Compatible":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In Progress', 'Compatible', 'Compatible', 'In Progress', 'Compatible'];
        return { patientid: 'PAT-' + (2001 + i), patientname: 'Patient ' + (i + 1), bloodgroup: 'A+', samplestatus: 'Received', crossmatchresult: statuses[i] === 'Compatible' ? 'Match Found' : 'Pending', status: statuses[i] };
      }),
  },
  "/ot/blood/issue": {
    ui: 5,
    title: "Blood Issue Log", description: "Units received in the OT/ICU fridge and ready for transfusion.",
    stats: [{ label: "Units in Fridge", color: "text-blue-400", value: "10" }, { label: "Used Today", color: "text-emerald-400", value: "12" }, { label: "Returned to BB", color: "text-amber-400", value: "1" }],
    columns: [["Unit ID", "unitid"], ["Patient Name", "patientname"], ["Component", "component"], ["Received By", "receivedby"], ["Expiry Date", "expirydate"]],
    badge: ["Status", "status", {"In Fridge":"blue","Transfusing":"amber","Transfused":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In Fridge', 'Transfusing', 'Transfused', 'In Fridge', 'Transfused'];
        return { unitid: 'UNT-' + (3001 + i), patientname: 'Patient ' + (i + 1), component: 'PRBC', receivedby: 'Nurse Lisa', expirydate: '31 Jul 2026', status: statuses[i] };
      }),
  },
  "/ot/blood/requests": {
    ui: 5,
    title: "Blood Requests Tracking", description: "Monitor the status of blood requests made to the blood bank.",
    stats: [{ label: "Active Requests", color: "text-blue-400", value: "8" }, { label: "STAT/Emergency", color: "text-red-400", value: "2" }, { label: "Fulfilled", color: "text-emerald-400", value: "15" }],
    columns: [["Req ID", "reqid"], ["Patient Name", "patientname"], ["Component", "component"], ["Urgency", "urgency"], ["Time Requested", "timerequested"]],
    badge: ["Status", "status", {"Processing":"amber","Reserved":"amber","Issued":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const urgencies = ['Routine', 'STAT', 'Routine', 'Urgent', 'Routine'];
        const statuses = ['Processing', 'Processing', 'Reserved', 'Issued', 'Processing'];
        return { reqid: 'REQ-' + (1001 + i), patientname: 'Patient ' + (i + 1), component: 'PRBC', urgency: urgencies[i], timerequested: '10:00 AM', status: statuses[i] };
      }),
  },
  "/ot/blood/transfusion": {
    ui: 5,
    title: "Transfusion Monitoring", description: "Logging of transfusion vitals, double checks, and adverse reactions.",
    stats: [{ label: "Active Transfusions", color: "text-amber-400", value: "3" }, { label: "Completed", color: "text-emerald-400", value: "8" }, { label: "Reactions", color: "text-emerald-400", value: "0" }],
    columns: [["Transfusion ID", "transfusionid"], ["Patient Name", "patientname"], ["Unit ID", "unitid"], ["Start Time", "starttime"], ["15-min Check", "15mincheck"]],
    badge: ["Status", "status", {"In Progress":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In Progress', 'Completed', 'In Progress', 'Completed', 'Completed'];
        return { transfusionid: 'TRN-' + (4001 + i), patientname: 'Patient ' + (i + 1), unitid: 'UNT-' + (3001 + i), starttime: '11:00 AM', '15mincheck': 'Stable (BP 120/80)', status: statuses[i] };
      }),
  },
  "/ot/cssd/autoclave": {
    ui: 5,
    title: "Autoclave Cycle Log", description: "Validation logs (Bowie-Dick, Biological indicators) for sterilizers.",
    stats: [{ label: "Cycles Today", color: "text-blue-400", value: "8" }, { label: "Passed", color: "text-emerald-400", value: "8" }, { label: "Failed/Aborted", color: "text-emerald-400", value: "0" }],
    columns: [["Cycle ID", "cycleid"], ["Machine", "machine"], ["Load Type", "loadtype"], ["Temp/Pressure", "temppressure"], ["Validation Test", "validationtest"]],
    badge: ["Status", "status", {"Completed (Passed)":"emerald","Running":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed (Passed)', 'Running', 'Completed (Passed)', 'Completed (Passed)', 'Running'];
        return { cycleid: 'CYC-' + (4001 + i), machine: 'Autoclave ' + (i % 2 + 1), loadtype: 'Mixed Instruments', temppressure: '134°C / 2.1 bar', validationtest: 'Bowie-Dick Pass', status: statuses[i] };
      }),
  },
  "/ot/cssd/inventory": {
    ui: 5,
    title: "Instrument Inventory", description: "Master inventory of surgical instruments and their condition.",
    stats: [{ label: "Total Instruments", color: "text-blue-400", value: "2,500" }, { label: "Sent for Repair", color: "text-amber-400", value: "15" }, { label: "Condemned", color: "text-red-400", value: "5" }],
    columns: [["Instrument ID", "instrumentid"], ["Name", "name"], ["Category", "category"], ["Quantity", "quantity"], ["Condition", "condition"]],
    badge: ["Status", "status", {"Available":"blue","In Use":"blue","In CSSD":"gray","Repair":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Available', 'In Use', 'In CSSD', 'Repair', 'Available'];
        return { instrumentid: 'INS-' + (2001 + i), name: 'Scalpel Handle #3', category: 'General', quantity: '50', condition: statuses[i] === 'Repair' ? 'Blunt/Damaged' : 'Good', status: statuses[i] };
      }),
  },
  "/ot/cssd/packs": {
    ui: 5,
    title: "Sterile Packs Management", description: "Assembly and tracking of sterile trays and linen packs.",
    stats: [{ label: "Sterile Packs Ready", color: "text-emerald-400", value: "120" }, { label: "Expiring Soon", color: "text-amber-400", value: "10" }, { label: "Expired", color: "text-emerald-400", value: "0" }],
    columns: [["Pack ID", "packid"], ["Pack Type", "packtype"], ["Assembly Date", "assemblydate"], ["Expiry Date", "expirydate"], ["Location", "location"]],
    badge: ["Status", "status", {"Available (Sterile)":"blue","Expiring Soon":"amber","In Use":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['C-Section Tray', 'Orthopedic Tray', 'Linen Pack (Large)', 'Basic Dressing Pack', 'Craniotomy Set'];
        const statuses = ['Available (Sterile)', 'Available (Sterile)', 'Expiring Soon', 'In Use', 'Available (Sterile)'];
        return { packid: 'PCK-' + (3001 + i), packtype: types[i], assemblydate: '01 Jul 2026', expirydate: '30 Jul 2026', location: 'CSSD Store', status: statuses[i] };
      }),
  },
  "/ot/cssd/sterilization": {
    ui: 5,
    title: "Instrument Sterilization", description: "Central Sterile Services Department (CSSD) processing and decontamination.",
    stats: [{ label: "Sets in Process", color: "text-amber-400", value: "14" }, { label: "Sterilized Today", color: "text-emerald-400", value: "45" }, { label: "Rejected/Damaged", color: "text-red-400", value: "1" }],
    columns: [["Batch ID", "batchid"], ["Instrument Set", "instrumentset"], ["Received From", "receivedfrom"], ["Cleaning Method", "cleaningmethod"], ["Technician", "technician"]],
    badge: ["Status", "status", {"Washing":"amber","Ultrasonic Cleaning":"amber","Packing":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Washing', 'Ultrasonic Cleaning', 'Packing', 'Washing', 'Packing'];
        return { batchid: 'CSSD-' + (1001 + i), instrumentset: 'General Surgery Tray', receivedfrom: 'OT ' + (1 + i), cleaningmethod: 'Automated Washer', technician: 'Tech Mark', status: statuses[i] };
      }),
  },
  "/ot/cssd/tracking": {
    ui: 5,
    title: "OT Instrument Tracking", description: "Barcode/RFID tracking of instruments from CSSD to OT and back.",
    stats: [{ label: "Sets in OT", color: "text-amber-400", value: "12" }, { label: "Returned to CSSD", color: "text-blue-400", value: "18" }, { label: "Missing Items", color: "text-emerald-400", value: "0" }],
    columns: [["Set ID", "setid"], ["Set Name", "setname"], ["Checked Out To", "checkedoutto"], ["Time Out", "timeout"], ["Time In", "timein"]],
    badge: ["Status", "status", {"In OT":"amber","Returned":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In OT', 'Returned', 'In OT', 'Returned', 'Returned'];
        return { setid: 'SET-' + (5001 + i), setname: 'CABG Tray', checkedoutto: 'OT ' + (1 + i), timeout: '08:00 AM', timein: statuses[i] === 'Returned' ? '14:00 PM' : '-', status: statuses[i] };
      }),
  },
  "/ot/discharge/critical": {
    ui: 5,
    title: "Critical Care Summary", description: "Comprehensive medical summary detailing ICU stay, interventions, and outcomes.",
    stats: [{ label: "Summaries Generated", color: "text-blue-400", value: "45" }, { label: "Pending Sign-off", color: "text-amber-400", value: "4" }, { label: "Sent to Records", color: "text-emerald-400", value: "41" }],
    columns: [["Summary ID", "summaryid"], ["Patient Name", "patientname"], ["Admission Date", "admissiondate"], ["Discharge Date", "dischargedate"], ["Author", "author"]],
    badge: ["Status", "status", {"Signed & Sent":"emerald","Draft":"amber","Pending Sign-off":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Signed & Sent', 'Draft', 'Signed & Sent', 'Pending Sign-off', 'Signed & Sent'];
        return { summaryid: 'CCS-' + (3001 + i), patientname: 'Patient ' + (i + 1), admissiondate: '01 Jul 2026', dischargedate: '05 Jul 2026', author: 'Dr. Resident', status: statuses[i] };
      }),
  },
  "/ot/discharge/icu": {
    ui: 5,
    title: "ICU Discharge", description: "Medical clearance and final summaries for leaving the intensive care unit.",
    stats: [{ label: "Discharges Today", color: "text-blue-400", value: "5" }, { label: "Pending Summaries", color: "text-amber-400", value: "2" }, { label: "Mortality (Month)", color: "text-gray-400", value: "2" }],
    columns: [["Discharge ID", "dischargeid"], ["Patient Name", "patientname"], ["LOS (Days)", "losdays"], ["Discharging Doctor", "dischargingdoctor"], ["Destination", "destination"]],
    badge: ["Status", "status", {"Discharged":"emerald","Summary Pending":"amber","Closed":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const destinations = ['General Ward', 'Home', 'Rehab Facility', 'General Ward', 'Expired'];
        const statuses = ['Discharged', 'Summary Pending', 'Discharged', 'Discharged', 'Closed'];
        return { dischargeid: 'ICD-' + (1001 + i), patientname: 'Patient ' + (i + 1), losdays: (4 + i).toString(), dischargingdoctor: 'Dr. House', destination: destinations[i], status: statuses[i] };
      }),
  },
  "/ot/discharge/instructions": {
    ui: 5,
    title: "Follow-up Instructions", description: "Post-op wound care, medications, and follow-up appointment schedules.",
    stats: [{ label: "Instructions Issued", color: "text-blue-400", value: "15" }, { label: "Appointments Booked", color: "text-emerald-400", value: "15" }, { label: "Translations Used", color: "text-gray-400", value: "2" }],
    columns: [["Patient Name", "patientname"], ["Procedure/ICU", "procedureicu"], ["Medications Prescribed", "medicationsprescribed"], ["Follow-up Date", "followupdate"], ["Dietary Advice", "dietaryadvice"]],
    badge: ["Status", "status", {"Issued":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { patientname: 'Patient ' + (i + 1), procedureicu: 'Appendectomy', medicationsprescribed: 'Antibiotics, Analgesics', followupdate: '15 Jul 2026', dietaryadvice: 'Soft Diet', status: 'Issued' };
      }),
  },
  "/ot/discharge/ot": {
    ui: 5,
    title: "Day Care Surgery Discharge", description: "Discharge summaries for ambulatory/day care surgical patients.",
    stats: [{ label: "Day Care Surgeries", color: "text-blue-400", value: "12" }, { label: "Discharged", color: "text-emerald-400", value: "10" }, { label: "Admitted (Complication)", color: "text-emerald-400", value: "0" }],
    columns: [["Discharge ID", "dischargeid"], ["Patient Name", "patientname"], ["Procedure", "procedure"], ["Recovery Score", "recoveryscore"], ["Companion Verified", "companionverified"]],
    badge: ["Status", "status", {"Discharged":"emerald","Pending Vitals":"amber","Pending Companion":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Discharged', 'Pending Vitals', 'Discharged', 'Discharged', 'Pending Companion'];
        return { dischargeid: 'OTD-' + (2001 + i), patientname: 'Patient ' + (i + 1), procedure: 'Cataract Surgery', recoveryscore: '9/10', companionverified: 'Yes (Spouse)', status: statuses[i] };
      }),
  },
  "/ot/icu/ccu-patients": {
    ui: 5,
    title: "Coronary Care Unit (CCU)", description: "Dashboard for cardiac emergencies, MIs, and post-CABG patients.",
    stats: [{ label: "Occupied Beds", color: "text-amber-400", value: "8/10" }, { label: "Cath Lab Transfers", color: "text-blue-400", value: "2" }, { label: "Arrhythmia Alerts", color: "text-red-400", value: "1" }],
    columns: [["Bed ID", "bedid"], ["Patient Name", "patientname"], ["Cardiac Event", "cardiacevent"], ["Intervention", "intervention"], ["Rhythm", "rhythm"]],
    badge: ["Status", "status", {"Critical":"red","Stable":"emerald","Improving":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const events = ['STEMI', 'NSTEMI', 'Post-CABG', 'Heart Failure', 'Arrhythmia'];
        const statuses = ['Critical', 'Stable', 'Stable', 'Critical', 'Improving'];
        return { bedid: 'CCU-' + (1 + i), patientname: 'Patient ' + (10 + i), cardiacevent: events[i], intervention: 'PCI to LAD', rhythm: 'Sinus Tachycardia', status: statuses[i] };
      }),
  },
  "/ot/icu/hdu-patients": {
    ui: 5,
    title: "High Dependency Unit (HDU)", description: "Step-down unit for patients requiring close monitoring but not ICU level care.",
    stats: [{ label: "Occupied Beds", color: "text-blue-400", value: "10/12" }, { label: "Ready for Ward", color: "text-emerald-400", value: "5" }, { label: "Deteriorating", color: "text-emerald-400", value: "0" }],
    columns: [["Bed ID", "bedid"], ["Patient Name", "patientname"], ["Transferred From", "transferredfrom"], ["Monitoring Level", "monitoringlevel"], ["Expected Ward Transfer", "expectedwardtransfer"]],
    badge: ["Status", "status", {"Ready for Ward":"emerald","Monitoring":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Ready for Ward', 'Monitoring', 'Monitoring', 'Ready for Ward', 'Monitoring'];
        return { bedid: 'HDU-' + (1 + i), patientname: 'Patient ' + (40 + i), transferredfrom: 'ICU', monitoringlevel: 'Continuous Vitals', expectedwardtransfer: 'Today', status: statuses[i] };
      }),
  },
  "/ot/icu/icu-patients": {
    ui: 5,
    title: "Intensive Care Unit (ICU)", description: "Central dashboard for general adult intensive care patients.",
    stats: [{ label: "Total Beds", color: "text-blue-400", value: "20" }, { label: "Occupied", color: "text-amber-400", value: "18" }, { label: "Critical", color: "text-red-400", value: "5" }],
    columns: [["Bed ID", "bedid"], ["Patient Name", "patientname"], ["Admission Diagnosis", "admissiondiagnosis"], ["Acuity Level", "acuitylevel"], ["Days in ICU", "daysinicu"]],
    badge: ["Status", "status", {"Stable":"emerald","Critical":"red","Improving":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Stable', 'Critical', 'Improving', 'Stable', 'Critical'];
        return { bedid: 'ICU-' + (1 + i), patientname: 'Patient ' + (i + 1), admissiondiagnosis: 'Sepsis', acuitylevel: 'Level 3', daysinicu: (2 + i).toString(), status: statuses[i] };
      }),
  },
  "/ot/icu/micu-patients": {
    ui: 5,
    title: "Medical ICU (MICU)", description: "Dashboard for severe medical conditions (sepsis, ARDS, DKA).",
    stats: [{ label: "Occupied Beds", color: "text-red-400", value: "14/15" }, { label: "Septic Shock", color: "text-red-400", value: "4" }, { label: "Improving", color: "text-emerald-400", value: "6" }],
    columns: [["Bed ID", "bedid"], ["Patient Name", "patientname"], ["Primary System", "primarysystem"], ["SOFA Score", "sofascore"], ["Inotropes", "inotropes"]],
    badge: ["Status", "status", {"Critical":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const systems = ['Respiratory', 'Renal', 'Neurological', 'Cardiovascular', 'Hepatic'];
        return { bedid: 'MICU-' + (1 + i), patientname: 'Patient ' + (30 + i), primarysystem: systems[i], sofascore: (4 + i).toString(), inotropes: i % 2 === 0 ? 'Noradrenaline' : 'None', status: 'Critical' };
      }),
  },
  "/ot/icu/nicu-patients": {
    ui: 5,
    title: "Neonatal ICU (NICU)", description: "Monitoring for premature and critically ill newborns.",
    stats: [{ label: "Neonates", color: "text-blue-400", value: "12" }, { label: "On Ventilator", color: "text-amber-400", value: "4" }, { label: "Ready to Step-down", color: "text-emerald-400", value: "2" }],
    columns: [["Incubator ID", "incubatorid"], ["Neonate Name", "neonatename"], ["Gestational Age", "gestationalage"], ["Birth Weight", "birthweight"], ["Respiratory Support", "respiratorysupport"]],
    badge: ["Status", "status", {"Stable":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const supports = ['CPAP', 'Mechanical Vent', 'Room Air', 'High Flow O2', 'CPAP'];
        return { incubatorid: 'NICU-' + (1 + i), neonatename: 'Baby of Smith', gestationalage: '32 Weeks', birthweight: '1.5 kg', respiratorysupport: supports[i], status: 'Stable' };
      }),
  },
  "/ot/icu/picu-patients": {
    ui: 5,
    title: "Pediatric ICU (PICU)", description: "Intensive care dashboard for critically ill children.",
    stats: [{ label: "Occupied Beds", color: "text-amber-400", value: "6/8" }, { label: "High PEWS Alerts", color: "text-red-400", value: "1" }, { label: "Stable", color: "text-emerald-400", value: "5" }],
    columns: [["Bed ID", "bedid"], ["Patient Name", "patientname"], ["Age", "age"], ["Diagnosis", "diagnosis"], ["PEWS Score", "pewsscore"]],
    badge: ["Status", "status", {"Stable":"emerald","Deteriorating":"red","Improving":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Stable', 'Stable', 'Deteriorating', 'Improving', 'Stable'];
        return { bedid: 'PICU-' + (1 + i), patientname: 'Child ' + (i + 1), age: (2 + i) + ' Years', diagnosis: 'Pneumonia', pewsscore: statuses[i] === 'Deteriorating' ? '6' : '2', status: statuses[i] };
      }),
  },
  "/ot/icu/sicu-patients": {
    ui: 5,
    title: "Surgical ICU (SICU)", description: "Post-operative critical care and trauma recovery monitoring.",
    stats: [{ label: "Occupied Beds", color: "text-blue-400", value: "10/12" }, { label: "Ventilated", color: "text-amber-400", value: "3" }, { label: "Discharge Planned", color: "text-emerald-400", value: "4" }],
    columns: [["Bed ID", "bedid"], ["Patient Name", "patientname"], ["Surgical Procedure", "surgicalprocedure"], ["Post-Op Day", "postopday"], ["Drain Output", "drainoutput"]],
    badge: ["Status", "status", {"Stable":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { bedid: 'SICU-' + (1 + i), patientname: 'Patient ' + (20 + i), surgicalprocedure: 'Whipple Procedure', postopday: 'POD ' + (1 + i), drainoutput: (50 + i * 20) + ' ml', status: 'Stable' };
      }),
  },
  "/ot/monitoring/central-line": {
    ui: 5,
    title: "Central Line & Invasive Monitoring", description: "Tracking CVP, Arterial Lines, PICC lines, and CLABSI bundles.",
    stats: [{ label: "Active Central Lines", color: "text-blue-400", value: "32" }, { label: "Arterial Lines", color: "text-amber-400", value: "18" }, { label: "Dressing Due", color: "text-gray-400", value: "5" }],
    columns: [["Line ID", "lineid"], ["Bed ID", "bedid"], ["Line Type", "linetype"], ["Insertion Date", "insertiondate"], ["CVP Reading", "cvpreading"]],
    badge: ["Status", "status", {"Functional":"emerald","Dressing Due":"amber","Remove Today":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['CVC (Right IJV)', 'Arterial Line (Radial)', 'PICC', 'CVC (Subclavian)', 'Arterial Line (Femoral)'];
        const statuses = ['Functional', 'Functional', 'Dressing Due', 'Functional', 'Remove Today'];
        return { lineid: 'LIN-' + (2001 + i), bedid: 'ICU-' + (1 + i), linetype: types[i], insertiondate: '01 Jul 2026', cvpreading: types[i].includes('CVC') ? '8 mmHg' : '-', status: statuses[i] };
      }),
  },
  "/ot/monitoring/dialysis": {
    ui: 5,
    title: "CRRT & Dialysis", description: "Continuous Renal Replacement Therapy and bedside hemodialysis monitoring.",
    stats: [{ label: "Active CRRT", color: "text-red-400", value: "3" }, { label: "Bedside HD Today", color: "text-blue-400", value: "5" }, { label: "Filter Clot Alarms", color: "text-emerald-400", value: "0" }],
    columns: [["Session ID", "sessionid"], ["Bed ID", "bedid"], ["Modality", "modality"], ["Blood Flow (Qb)", "bloodflowqb"], ["Fluid Removal Rate", "fluidremovalrate"]],
    badge: ["Status", "status", {"Running":"gray","Completed":"emerald","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const modalities = ['CVVHDF', 'SLED', 'CVVHDF', 'Hemodialysis', 'CVVH'];
        const statuses = ['Running', 'Running', 'Completed', 'Scheduled', 'Running'];
        return { sessionid: 'DYL-' + (3001 + i), bedid: 'ICU-' + (1 + i), modality: modalities[i], bloodflowqb: '150 ml/min', fluidremovalrate: '50 ml/hr', status: statuses[i] };
      }),
  },
  "/ot/monitoring/infusion": {
    ui: 5,
    title: "Infusion Pumps", description: "Centralized tracking of syringe pumps, IV fluids, and vasoactive drugs.",
    stats: [{ label: "Active Pumps", color: "text-blue-400", value: "120" }, { label: "Inotropes/Vasopressors", color: "text-red-400", value: "15" }, { label: "Near Empty Alarms", color: "text-amber-400", value: "4" }],
    columns: [["Pump ID", "pumpid"], ["Bed ID", "bedid"], ["Medication", "medication"], ["Dose Rate", "doserate"], ["Time Remaining", "timeremaining"]],
    badge: ["Status", "status", {"Running":"gray","Near Empty":"amber","Paused":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Running', 'Near Empty', 'Running', 'Running', 'Paused'];
        return { pumpid: 'PMP-' + (1001 + i), bedid: 'ICU-' + (1 + i), medication: 'Noradrenaline', doserate: '0.05 mcg/kg/min', timeremaining: statuses[i] === 'Near Empty' ? '10 mins' : '4 hrs', status: statuses[i] };
      }),
  },
  "/ot/monitoring/oxygen": {
    ui: 5,
    title: "Oxygen Therapy", description: "Monitoring oxygen delivery devices, flow rates, and cylinder statuses.",
    stats: [{ label: "O2 Therapy Patients", color: "text-blue-400", value: "45" }, { label: "High Flow (HFNC)", color: "text-amber-400", value: "8" }, { label: "Central O2 Pressure", color: "text-emerald-400", value: "Normal" }],
    columns: [["Bed ID", "bedid"], ["Patient Name", "patientname"], ["Delivery Device", "deliverydevice"], ["Flow Rate", "flowrate"], ["Target SpO2", "targetspo2"]],
    badge: ["Status", "status", {"Maintaining Target":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const devices = ['Nasal Cannula', 'NRBM', 'HFNC', 'Venturi Mask', 'Simple Mask'];
        return { bedid: 'HDU-' + (1 + i), patientname: 'Patient ' + (i + 1), deliverydevice: devices[i], flowrate: (2 + i * 2) + ' L/min', targetspo2: '> 94%', status: 'Maintaining Target' };
      }),
  },
  "/ot/monitoring/ventilator": {
    ui: 5,
    title: "Ventilator Monitoring", description: "Tracking ventilator modes, settings, ABGs, and weaning progress.",
    stats: [{ label: "Patients Ventilated", color: "text-blue-400", value: "15" }, { label: "Weaning Trials", color: "text-amber-400", value: "4" }, { label: "Extubated Today", color: "text-emerald-400", value: "2" }],
    columns: [["Bed ID", "bedid"], ["Patient Name", "patientname"], ["Vent Mode", "ventmode"], ["FiO2 / PEEP", "fio2peep"], ["Latest ABG (PaO2)", "latestabgpao2"]],
    badge: ["Status", "status", {"Ventilated":"gray","Weaning":"amber","NIV":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const modes = ['PRVC', 'SIMV', 'CPAP/PS', 'BiPAP', 'PRVC'];
        const statuses = ['Ventilated', 'Ventilated', 'Weaning', 'NIV', 'Ventilated'];
        return { bedid: 'ICU-' + (1 + i), patientname: 'Patient ' + (i + 1), ventmode: modes[i], fio2peep: '40% / 5', latestabgpao2: '85 mmHg', status: statuses[i] };
      }),
  },
  "/ot/monitoring/vitals": {
    ui: 5,
    title: "Live Vitals Board", description: "Centralized live feed of patient monitors across all critical care units.",
    stats: [{ label: "Monitors Online", color: "text-emerald-400", value: "64/64" }, { label: "Active Alarms", color: "text-red-400", value: "3" }, { label: "Arrhythmias Detected", color: "text-amber-400", value: "1" }],
    columns: [["Unit/Bed", "unitbed"], ["Patient Name", "patientname"], ["Heart Rate", "heartrate"], ["Blood Pressure", "bloodpressure"], ["SpO2 / Resp Rate", "spo2resprate"]],
    badge: ["Status", "status", {"Normal":"emerald","Alarm (Low BP)":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Normal', 'Normal', 'Alarm (Low BP)', 'Normal', 'Normal'];
        return { unitbed: 'ICU-' + (1 + i), patientname: 'Patient ' + (i + 1), heartrate: '85 bpm', bloodpressure: statuses[i] === 'Alarm (Low BP)' ? '80/50 mmHg' : '120/80 mmHg', spo2resprate: '98% / 16', status: statuses[i] };
      }),
  },
  "/ot/operation-theatre/active": {
    ui: 5,
    title: "Active Surgeries Dashboard", description: "Real-time monitoring of currently ongoing operations and their phases.",
    stats: [{ label: "Active Rooms", color: "text-blue-400", value: "5/8" }, { label: "Overtime Surgeries", color: "text-red-400", value: "1" }, { label: "Closing Phase", color: "text-emerald-400", value: "2" }],
    columns: [["OT Room", "otroom"], ["Surgery Phase", "surgeryphase"], ["Time Elapsed", "timeelapsed"], ["Surgeon", "surgeon"], ["Anesthetist", "anesthetist"]],
    badge: ["Status", "status", {"Ongoing":"amber","Prolonged":"red","Finishing":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const phases = ['Induction', 'Incision', 'Main Procedure', 'Closure', 'Extubation'];
        const statuses = ['Ongoing', 'Ongoing', 'Prolonged', 'Ongoing', 'Finishing'];
        return { otroom: 'OT ' + (1 + i), surgeryphase: phases[i], timeelapsed: (30 + i * 45) + ' mins', surgeon: 'Dr. Grey', anesthetist: 'Dr. Sleep', status: statuses[i] };
      }),
  },
  "/ot/operation-theatre/allocation": {
    ui: 5,
    title: "OT Allocation & Staffing", description: "Assignment of nurses, scrub techs, and support staff to specific rooms.",
    stats: [{ label: "Staff on Duty", color: "text-blue-400", value: "24" }, { label: "Rooms Fully Staffed", color: "text-emerald-400", value: "8/8" }, { label: "Relief Needed", color: "text-amber-400", value: "2" }],
    columns: [["OT Room", "otroom"], ["Scrub Nurse", "scrubnurse"], ["Circulating Nurse", "circulatingnurse"], ["Technician", "technician"], ["Shift", "shift"]],
    badge: ["Status", "status", {"Assigned":"emerald","Relief Req":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Assigned', 'Assigned', 'Relief Req', 'Assigned', 'Assigned'];
        return { otroom: 'OT ' + (1 + i), scrubnurse: 'Nurse ' + (i + 1), circulatingnurse: 'Nurse ' + (i + 6), technician: 'Tech ' + (i + 1), shift: 'Morning', status: statuses[i] };
      }),
  },
  "/ot/operation-theatre/checklist": {
    ui: 5,
    title: "WHO Surgical Safety Checklist", description: "Sign In, Time Out, and Sign Out verification logs.",
    stats: [{ label: "Compliance Rate", color: "text-emerald-400", value: "100%" }, { label: "Pending Time Out", color: "text-amber-400", value: "1" }, { label: "Completed Today", color: "text-blue-400", value: "10" }],
    columns: [["Surgery ID", "surgeryid"], ["Patient Name", "patientname"], ["Sign In", "signin"], ["Time Out", "timeout"], ["Sign Out", "signout"]],
    badge: ["Status", "status", {"Complete":"emerald","Time Out Done":"amber","Sign In Done":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Complete', 'Time Out Done', 'Sign In Done', 'Complete', 'Complete'];
        return { surgeryid: 'SUR-' + (1001 + i), patientname: 'Patient ' + (i + 1), signin: 'Verified', timeout: statuses[i] !== 'Sign In Done' ? 'Verified' : '-', signout: statuses[i] === 'Complete' ? 'Verified' : '-', status: statuses[i] };
      }),
  },
  "/ot/operation-theatre/implants": {
    ui: 5,
    title: "Implants & Consumables", description: "Tracking of surgical implants, meshes, and high-value consumables used.",
    stats: [{ label: "Implants Used", color: "text-blue-400", value: "4" }, { label: "Cost Tracked", color: "text-emerald-400", value: "$12,500" }, { label: "Wastage", color: "text-emerald-400", value: "0" }],
    columns: [["Log ID", "logid"], ["Surgery ID", "surgeryid"], ["Item Name", "itemname"], ["Lot/Serial No", "lotserialno"], ["Quantity Used", "quantityused"]],
    badge: ["Status", "status", {"Logged":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const items = ['Knee Prosthesis (Titanium)', 'Prolene Mesh 15x15', 'Bone Screws (x4)', 'Surgical Stapler', 'Pacemaker Lead'];
        const statuses = ['Logged', 'Logged', 'Logged', 'Logged', 'Logged'];
        return { logid: 'IMP-' + (2001 + i), surgeryid: 'SUR-' + (1000 + i), itemname: items[i], lotserialno: 'LOT-' + (9876 + i), quantityused: '1', status: statuses[i] };
      }),
  },
  "/ot/operation-theatre/notes": {
    ui: 5,
    title: "Intraoperative Notes", description: "Circulating nurse documentation of events, tourniquet times, and counts.",
    stats: [{ label: "Count Discrepancies", color: "text-emerald-400", value: "0" }, { label: "Notes Finalized", color: "text-blue-400", value: "8" }, { label: "Draft Notes", color: "text-amber-400", value: "3" }],
    columns: [["Note ID", "noteid"], ["Surgery ID", "surgeryid"], ["Sponge Count", "spongecount"], ["Sharp Count", "sharpcount"], ["Tourniquet Time", "tourniquettime"]],
    badge: ["Status", "status", {"Finalized":"emerald","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Finalized', 'Finalized', 'Draft', 'Finalized', 'Draft'];
        return { noteid: 'NOT-' + (3001 + i), surgeryid: 'SUR-' + (1000 + i), spongecount: 'Correct (30/30)', sharpcount: 'Correct (15/15)', tourniquettime: '45 mins', status: statuses[i] };
      }),
  },
  "/ot/operation-theatre/team": {
    ui: 5,
    title: "Surgical Team Logs", description: "Check-in and scrub times for the surgical and anesthesia teams.",
    stats: [{ label: "Active Surgeons", color: "text-blue-400", value: "6" }, { label: "Active Anesthetists", color: "text-emerald-400", value: "5" }, { label: "Total Team Hours", color: "text-gray-400", value: "142 hrs" }],
    columns: [["Team Member", "teammember"], ["Role", "role"], ["OT Room", "otroom"], ["Scrub In Time", "scrubintime"], ["Scrub Out Time", "scrubouttime"]],
    badge: ["Status", "status", {"Scrubbed In":"blue","Scrubbed Out":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const roles = ['Lead Surgeon', 'Assistant Surgeon', 'Anesthetist', 'Scrub Nurse', 'Perfusionist'];
        const statuses = ['Scrubbed In', 'Scrubbed In', 'Scrubbed Out', 'Scrubbed In', 'Scrubbed In'];
        return { teammember: 'Dr. Person ' + (i + 1), role: roles[i], otroom: 'OT 1', scrubintime: '08:15 AM', scrubouttime: statuses[i] === 'Scrubbed Out' ? '12:00 PM' : '-', status: statuses[i] };
      }),
  },
  "/ot/operation-theatre/today": {
    ui: 5,
    title: "Today's Surgeries", description: "Live view of all surgeries scheduled, ongoing, and completed today.",
    stats: [{ label: "Total Surgeries", color: "text-blue-400", value: "18" }, { label: "Completed", color: "text-emerald-400", value: "10" }, { label: "Ongoing", color: "text-amber-400", value: "5" }],
    columns: [["OT Room", "otroom"], ["Patient Name", "patientname"], ["Procedure", "procedure"], ["Surgeon", "surgeon"], ["Start Time", "starttime"]],
    badge: ["Status", "status", {"In Progress":"amber","Completed":"emerald","Next Up":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In Progress', 'Completed', 'Next Up', 'In Progress', 'Completed'];
        return { otroom: 'OT ' + (1 + i), patientname: 'Patient ' + (i + 1), procedure: 'Craniotomy', surgeon: 'Dr. Shepherd', starttime: '08:00 AM', status: statuses[i] };
      }),
  },
  "/ot/orders/blood": {
    ui: 5,
    title: "Blood Bank Orders", description: "Requisitions for PRBC, FFP, and Platelets from the OT/ICU.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "3" }, { label: "Reserved/Cross-matched", color: "text-blue-400", value: "5" }, { label: "Issued Today", color: "text-emerald-400", value: "12" }],
    columns: [["Req ID", "reqid"], ["Patient Name", "patientname"], ["Blood Group", "bloodgroup"], ["Component", "component"], ["Units Requested", "unitsrequested"]],
    badge: ["Status", "status", {"Pending Blood Bank":"amber","Reserved":"amber","Issued":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const components = ['PRBC', 'FFP', 'Platelets', 'PRBC', 'Cryoprecipitate'];
        const statuses = ['Pending Blood Bank', 'Reserved', 'Issued', 'Pending Blood Bank', 'Issued'];
        return { reqid: 'BLD-' + (4001 + i), patientname: 'Patient ' + (i + 1), bloodgroup: 'O+', component: components[i], unitsrequested: (1 + i).toString(), status: statuses[i] };
      }),
  },
  "/ot/orders/laboratory": {
    ui: 5,
    title: "Laboratory Orders", description: "Tracking ABGs, cultures, and routine bloods sent from OT and ICU.",
    stats: [{ label: "Active Lab Orders", color: "text-blue-400", value: "24" }, { label: "Results Ready", color: "text-emerald-400", value: "18" }, { label: "Delayed", color: "text-amber-400", value: "1" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Test Name", "testname"], ["Sample Sent Time", "samplesenttime"], ["Turnaround Target", "turnaroundtarget"]],
    badge: ["Status", "status", {"Sent to Lab":"blue","Processing":"amber","Results Ready":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const tests = ['ABG Panel', 'Blood Culture', 'CBC', 'Electrolytes', 'Coagulation Profile'];
        const statuses = ['Sent to Lab', 'Processing', 'Results Ready', 'Sent to Lab', 'Results Ready'];
        return { orderid: 'LAB-' + (2001 + i), patientname: 'Patient ' + (i + 1), testname: tests[i], samplesenttime: '10:00 AM', turnaroundtarget: tests[i].includes('ABG') ? '15 mins' : '1 Hour', status: statuses[i] };
      }),
  },
  "/ot/orders/pending": {
    ui: 5,
    title: "Pending Orders", description: "New orders placed by intensivists and surgeons that require nursing action.",
    stats: [{ label: "Pending Orders", color: "text-amber-400", value: "12" }, { label: "STAT Orders", color: "text-red-400", value: "3" }, { label: "Completed Today", color: "text-emerald-400", value: "85" }],
    columns: [["Order ID", "orderid"], ["Bed/OT", "bedot"], ["Patient Name", "patientname"], ["Order Type", "ordertype"], ["Doctor", "doctor"]],
    badge: ["Status", "status", {"Pending":"amber","Processing":"amber","STAT Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Medication', 'Lab Test', 'Imaging', 'Procedure', 'Diet'];
        const statuses = ['Pending', 'Processing', 'Pending', 'STAT Pending', 'Processing'];
        return { orderid: 'ORD-' + (1001 + i), bedot: 'ICU ' + (1 + i), patientname: 'Patient ' + (i + 1), ordertype: types[i], doctor: 'Dr. House', status: statuses[i] };
      }),
  },
  "/ot/orders/procedure": {
    ui: 5,
    title: "Bedside Procedure Orders", description: "Orders for central line insertion, intubation, tracheostomy, etc.",
    stats: [{ label: "Pending Procedures", color: "text-amber-400", value: "4" }, { label: "Completed Today", color: "text-emerald-400", value: "6" }, { label: "Delayed", color: "text-gray-400", value: "0" }],
    columns: [["Procedure ID", "procedureid"], ["Patient Name", "patientname"], ["Procedure Name", "procedurename"], ["Requested By", "requestedby"], ["Consent Status", "consentstatus"]],
    badge: ["Status", "status", {"Scheduled":"amber","Completed":"emerald","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const procedures = ['CVC Insertion', 'Endotracheal Intubation', 'Chest Tube', 'Lumbar Puncture', 'Dialysis Catheter'];
        const statuses = ['Scheduled', 'Completed', 'In Progress', 'Scheduled', 'Completed'];
        return { procedureid: 'PRC-' + (5001 + i), patientname: 'Patient ' + (i + 1), procedurename: procedures[i], requestedby: 'Dr. ICU', consentstatus: 'Signed', status: statuses[i] };
      }),
  },
  "/ot/orders/radiology": {
    ui: 5,
    title: "Radiology Orders", description: "Portable X-Rays and Ultrasound orders for critical patients.",
    stats: [{ label: "Pending Scans", color: "text-amber-400", value: "5" }, { label: "Completed", color: "text-emerald-400", value: "10" }, { label: "Portable Requested", color: "text-blue-400", value: "4" }],
    columns: [["Order ID", "orderid"], ["Bed ID", "bedid"], ["Patient Name", "patientname"], ["Modality", "modality"], ["Radiologist Notes", "radiologistnotes"]],
    badge: ["Status", "status", {"Scheduled":"amber","In Progress":"amber","Reported":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const modalities = ['Portable X-Ray Chest', 'Portable USG Abdomen', 'Echo Bedside', 'Portable X-Ray Chest', 'Doppler'];
        const statuses = ['Scheduled', 'In Progress', 'Reported', 'Scheduled', 'Reported'];
        return { orderid: 'RAD-' + (3001 + i), bedid: 'ICU-' + (1 + i), patientname: 'Patient ' + (i + 1), modality: modalities[i], radiologistnotes: statuses[i] === 'Reported' ? 'Pleural Effusion seen' : '-', status: statuses[i] };
      }),
  },
  "/ot/patient-care/fluid": {
    ui: 5,
    title: "Fluid & Electrolyte Balance", description: "Integration of lab electrolytes (Na, K, ABG) with fluid management plans.",
    stats: [{ label: "Electrolyte Derangements", color: "text-red-400", value: "4" }, { label: "Corrective Boluses Active", color: "text-amber-400", value: "2" }, { label: "Stable", color: "text-emerald-400", value: "14" }],
    columns: [["Patient Name", "patientname"], ["Bed ID", "bedid"], ["Target Fluid Balance", "targetfluidbalance"], ["Latest K+", "latestk"], ["Latest Na+", "latestna"]],
    badge: ["Status", "status", {"Stable":"emerald","Correction Active":"amber","Critical Low K+":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Stable', 'Correction Active', 'Stable', 'Critical Low K+', 'Stable'];
        return { patientname: 'Patient ' + (i + 1), bedid: 'ICU-' + (1 + i), targetfluidbalance: 'Even', latestk: statuses[i].includes('Critical') ? '2.8 mEq/L' : '4.2 mEq/L', latestna: '140 mEq/L', status: statuses[i] };
      }),
  },
  "/ot/patient-care/medication": {
    ui: 5,
    title: "Intensive Medication Chart", description: "Administration record for routine meds, PRNs, and stat doses in ICU.",
    stats: [{ label: "Doses Given (Shift)", color: "text-blue-400", value: "240" }, { label: "Missed Doses", color: "text-emerald-400", value: "0" }, { label: "Pharmacy Delays", color: "text-amber-400", value: "1" }],
    columns: [["Chart ID", "chartid"], ["Bed ID", "bedid"], ["Medication", "medication"], ["Dose", "dose"], ["Administered By", "administeredby"]],
    badge: ["Status", "status", {"Administered":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Administered', 'Administered', 'Pending', 'Administered', 'Administered'];
        return { chartid: 'MED-' + (4001 + i), bedid: 'ICU-' + (1 + i), medication: 'Meropenem', dose: '1g IV', administeredby: statuses[i] === 'Administered' ? 'Nurse Jane' : '-', status: statuses[i] };
      }),
  },
  "/ot/patient-care/nursing": {
    ui: 5,
    title: "Nursing Care Notes", description: "Hourly nursing assessments, interventions, and GCS charting.",
    stats: [{ label: "Hourly Notes Compliance", color: "text-emerald-400", value: "98%" }, { label: "Overdue Notes", color: "text-amber-400", value: "2" }, { label: "Total Entries", color: "text-blue-400", value: "480" }],
    columns: [["Entry ID", "entryid"], ["Bed ID", "bedid"], ["Nurse", "nurse"], ["GCS Score", "gcsscore"], ["Pain Score", "painscore"]],
    badge: ["Status", "status", {"Recorded":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { entryid: 'NRS-' + (3001 + i), bedid: 'ICU-' + (1 + i), nurse: 'Nurse Joy', gcsscore: '14/15', painscore: '2/10', status: 'Recorded' };
      }),
  },
  "/ot/patient-care/progress": {
    ui: 5,
    title: "Doctor Progress Notes", description: "Detailed clinical progress notes, SOAP format, for critical patients.",
    stats: [{ label: "Notes Authored Today", color: "text-blue-400", value: "45" }, { label: "Missing Daily Note", color: "text-red-400", value: "1" }, { label: "Signed", color: "text-emerald-400", value: "40" }],
    columns: [["Note ID", "noteid"], ["Bed ID", "bedid"], ["Patient Name", "patientname"], ["Author", "author"], ["Primary System Focus", "primarysystemfocus"]],
    badge: ["Status", "status", {"Signed":"gray","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Signed', 'Draft', 'Signed', 'Signed', 'Draft'];
        return { noteid: 'PRG-' + (2001 + i), bedid: 'ICU-' + (1 + i), patientname: 'Patient ' + (i + 1), author: 'Dr. Resident', primarysystemfocus: 'Respiratory', status: statuses[i] };
      }),
  },
  "/ot/patient-care/rounds": {
    ui: 5,
    title: "Daily ICU Rounds", description: "Multidisciplinary team round notes, FASTHUG checklists, and goals of care.",
    stats: [{ label: "Rounds Completed", color: "text-emerald-400", value: "18/20" }, { label: "Pending", color: "text-amber-400", value: "2" }, { label: "Family Updates Done", color: "text-blue-400", value: "15" }],
    columns: [["Round ID", "roundid"], ["Bed ID", "bedid"], ["Lead Intensivist", "leadintensivist"], ["FASTHUG Status", "fasthugstatus"], ["Goals Documented", "goalsdocumented"]],
    badge: ["Status", "status", {"Completed":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'Completed', 'Pending', 'Completed', 'Completed'];
        return { roundid: 'RND-' + (1001 + i), bedid: 'ICU-' + (1 + i), leadintensivist: 'Dr. House', fasthugstatus: 'Reviewed', goalsdocumented: 'Yes', status: statuses[i] };
      }),
  },
  "/ot/pre-operative/assessment": {
    ui: 5,
    title: "Surgery Assessment", description: "Pre-admission screening and surgical risk assessments.",
    stats: [{ label: "Pending Assessments", color: "text-amber-400", value: "14" }, { label: "Cleared for Surgery", color: "text-emerald-400", value: "30" }, { label: "High Risk Cases", color: "text-red-400", value: "5" }],
    columns: [["Assessment ID", "assessmentid"], ["Patient Name", "patientname"], ["Procedure", "procedure"], ["ASA Grade", "asagrade"], ["Assessed By", "assessedby"]],
    badge: ["Status", "status", {"Cleared":"emerald","Pending":"amber","High Risk":"red","Pending Labs":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Cleared', 'Pending', 'High Risk', 'Cleared', 'Pending Labs'];
        return { assessmentid: 'PRE-' + (1001 + i), patientname: 'Patient ' + (i + 1), procedure: 'Cholecystectomy', asagrade: 'ASA II', assessedby: 'Dr. Smith', status: statuses[i] };
      }),
  },
  "/ot/pre-operative/checklist": {
    ui: 5,
    title: "Pre-Op Ward Checklist", description: "Ward nurse checklist before transferring patient to the OT (NPO status, site marking, etc).",
    stats: [{ label: "Transfers Today", color: "text-blue-400", value: "12" }, { label: "Ready to Transfer", color: "text-emerald-400", value: "3" }, { label: "Incomplete Prep", color: "text-amber-400", value: "2" }],
    columns: [["Checklist ID", "checklistid"], ["Patient Name", "patientname"], ["Ward", "ward"], ["NPO Confirmed", "npoconfirmed"], ["Site Marked", "sitemarked"]],
    badge: ["Status", "status", {"Ready":"emerald","Incomplete":"amber","Transferred":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Ready', 'Ready', 'Incomplete', 'Transferred', 'Incomplete'];
        return { checklistid: 'CHK-' + (4001 + i), patientname: 'Patient ' + (i + 1), ward: 'Surgical Ward A', npoconfirmed: 'Yes (>8h)', sitemarked: 'Yes', status: statuses[i] };
      }),
  },
  "/ot/pre-operative/consent": {
    ui: 5,
    title: "Consent Verification", description: "Digital tracking of informed consents for surgery and anesthesia.",
    stats: [{ label: "Consents Pending", color: "text-amber-400", value: "5" }, { label: "Fully Executed", color: "text-emerald-400", value: "40" }, { label: "Refusals", color: "text-gray-400", value: "0" }],
    columns: [["Form ID", "formid"], ["Patient Name", "patientname"], ["Procedure", "procedure"], ["Patient Signed", "patientsigned"], ["Doctor Signed", "doctorsigned"]],
    badge: ["Status", "status", {"Complete":"emerald","Pending Patient":"amber","Pending Doctor":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Complete', 'Complete', 'Pending Patient', 'Complete', 'Pending Doctor'];
        return { formid: 'CON-' + (3001 + i), patientname: 'Patient ' + (i + 1), procedure: 'Knee Replacement', patientsigned: 'Yes', doctorsigned: statuses[i] === 'Complete' ? 'Yes' : '-', status: statuses[i] };
      }),
  },
  "/ot/pre-operative/pac": {
    ui: 5,
    title: "Pre-Anesthesia Checkup (PAC)", description: "Anesthesiologist clearance and airway assessment records.",
    stats: [{ label: "PACs Today", color: "text-blue-400", value: "22" }, { label: "Cleared", color: "text-emerald-400", value: "18" }, { label: "Unfit for Anesthesia", color: "text-red-400", value: "1" }],
    columns: [["PAC ID", "pacid"], ["Patient Name", "patientname"], ["Airway Class (Mallampati)", "airwayclassmallampati"], ["Allergies", "allergies"], ["Anesthetist", "anesthetist"]],
    badge: ["Status", "status", {"Fit":"gray","Pending":"amber","Unfit (Cardio consult)":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Fit', 'Fit', 'Pending', 'Unfit (Cardio consult)', 'Fit'];
        return { pacid: 'PAC-' + (2001 + i), patientname: 'Patient ' + (i + 1), airwayclassmallampati: 'Class II', allergies: 'Penicillin', anesthetist: 'Dr. Sleep', status: statuses[i] };
      }),
  },
  "/ot/pre-operative/preparation": {
    ui: 5,
    title: "Patient Preparation", description: "Holding area notes, IV line insertion, and pre-medication tracking.",
    stats: [{ label: "Patients in Holding", color: "text-blue-400", value: "4" }, { label: "Fully Prepped", color: "text-emerald-400", value: "2" }, { label: "Delayed", color: "text-gray-400", value: "0" }],
    columns: [["Prep ID", "prepid"], ["Patient Name", "patientname"], ["Holding Bay", "holdingbay"], ["IV Access", "ivaccess"], ["Pre-Meds Given", "premedsgiven"]],
    badge: ["Status", "status", {"Prepped":"emerald","Prepping":"amber","Waiting":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Prepped', 'Prepping', 'Waiting', 'Prepped', 'Prepping'];
        return { prepid: 'PRP-' + (5001 + i), patientname: 'Patient ' + (i + 1), holdingbay: 'Bay ' + (1 + i), ivaccess: '18G Right Hand', premedsgiven: 'Midazolam 2mg', status: statuses[i] };
      }),
  },
  "/ot/recovery/discharge": {
    ui: 5,
    title: "Discharge from PACU", description: "Final clearance criteria evaluation before transferring to Ward or ICU.",
    stats: [{ label: "Discharged Today", color: "text-blue-400", value: "8" }, { label: "Pending Clearance", color: "text-amber-400", value: "4" }, { label: "Transferred to ICU", color: "text-emerald-400", value: "2" }],
    columns: [["Patient Name", "patientname"], ["Discharge Criteria Met", "dischargecriteriamet"], ["Destination", "destination"], ["Cleared By", "clearedby"], ["Time", "time"]],
    badge: ["Status", "status", {"Cleared":"emerald","Pending":"amber","Pending Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Cleared', 'Pending', 'Cleared', 'Cleared', 'Pending Review'];
        return { patientname: 'Patient ' + (i + 1), dischargecriteriamet: statuses[i] === 'Cleared' ? 'Yes (Score 10/10)' : 'No', destination: 'Surgical Ward', clearedby: 'Dr. Anesthesiologist', time: '14:00', status: statuses[i] };
      }),
  },
  "/ot/recovery/monitoring": {
    ui: 5,
    title: "PACU Monitoring Dashboard", description: "Post-Anesthesia Care Unit patient tracking and vitals monitoring.",
    stats: [{ label: "Occupied Beds", color: "text-amber-400", value: "6/10" }, { label: "Ready for Ward", color: "text-emerald-400", value: "3" }, { label: "Critical (Keep in PACU)", color: "text-red-400", value: "1" }],
    columns: [["Bed ID", "bedid"], ["Patient Name", "patientname"], ["Surgery Type", "surgerytype"], ["Time in PACU", "timeinpacu"], ["Aldrete Score", "aldretescore"]],
    badge: ["Status", "status", {"Recovering":"emerald","Ready for Ward":"emerald","Extended Observation":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Recovering', 'Ready for Ward', 'Recovering', 'Ready for Ward', 'Extended Observation'];
        return { bedid: 'PACU-' + (1 + i), patientname: 'Patient ' + (i + 1), surgerytype: 'General', timeinpacu: (45 + i * 15) + ' mins', aldretescore: (7 + i % 3) + '/10', status: statuses[i] };
      }),
  },
  "/ot/recovery/notes": {
    ui: 5,
    title: "PACU Nursing Notes", description: "Documentation of patient awakening, airway patency, and hemodynamic stability.",
    stats: [{ label: "Notes Logged", color: "text-blue-400", value: "24" }, { label: "Airway Interventions", color: "text-emerald-400", value: "0" }, { label: "Pending Notes", color: "text-amber-400", value: "2" }],
    columns: [["Note ID", "noteid"], ["Patient Name", "patientname"], ["Airway Status", "airwaystatus"], ["Consciousness Level", "consciousnesslevel"], ["Nurse", "nurse"]],
    badge: ["Status", "status", {"Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { noteid: 'PACN-' + (1001 + i), patientname: 'Patient ' + (i + 1), airwaystatus: 'Maintaining own airway', consciousnesslevel: 'Arousable to voice', nurse: 'Nurse Jane', status: 'Draft' };
      }),
  },
  "/ot/reports/critical": {
    ui: 5,
    title: "Critical Care Metrics (APACHE/SOFA)", description: "Analysis of patient severity scores and predicted vs actual outcomes.",
    stats: [{ label: "Avg APACHE II", color: "text-amber-400", value: "18" }, { label: "SMR (Standardized Mortality Ratio)", color: "text-emerald-400", value: "0.85" }, { label: "Data Completeness", color: "text-blue-400", value: "99%" }],
    columns: [["Month", "month"], ["Avg APACHE II", "avgapacheii"], ["Avg SOFA", "avgsofa"], ["Predicted Mortality", "predictedmortality"], ["Actual Mortality", "actualmortality"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        return { month: months[i] + ' 2026', avgapacheii: (16 + i).toString(), avgsofa: (6 + i * 0.5).toString(), predictedmortality: (15 + i) + '%', actualmortality: (12 + i) + '%', status: 'Generated' };
      }),
  },
  "/ot/reports/infection": {
    ui: 5,
    title: "Infection Control Report", description: "Tracking Surgical Site Infections (SSI), CLABSI, and CAUTI in critical care.",
    stats: [{ label: "SSI Rate", color: "text-emerald-400", value: "0.8%" }, { label: "CLABSI (per 1k days)", color: "text-emerald-400", value: "0.5" }, { label: "Hand Hygiene", color: "text-emerald-400", value: "95%" }],
    columns: [["Month", "month"], ["SSI Rate", "ssirate"], ["CLABSI Rate", "clabsirate"], ["CAUTI Rate", "cautirate"], ["Hand Hygiene Compliance", "handhygienecompliance"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        return { month: months[i] + ' 2026', ssirate: '0.' + (5 + i) + '%', clabsirate: '0.' + i, cautirate: '1.' + i, handhygienecompliance: (92 + i) + '%', status: 'Generated' };
      }),
  },
  "/ot/reports/mortality": {
    ui: 5,
    title: "Mortality & Morbidity (M&M)", description: "Confidential reporting for M&M conferences and clinical governance.",
    stats: [{ label: "Mortality Rate (ICU)", color: "text-blue-400", value: "4.5%" }, { label: "M&M Meetings Held", color: "text-gray-400", value: "2 (Month)" }, { label: "Action Items Open", color: "text-amber-400", value: "1" }],
    columns: [["Report ID", "reportid"], ["Case Type", "casetype"], ["Date of Event", "dateofevent"], ["Primary Cause", "primarycause"], ["Reviewed By", "reviewedby"]],
    badge: ["Status", "status", {"Reviewed":"gray","Pending Review":"gray","Under Investigation":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Surgical Complication', 'ICU Mortality', 'ICU Mortality', 'Surgical Complication', 'Unexpected Arrest'];
        const statuses = ['Reviewed', 'Pending Review', 'Reviewed', 'Reviewed', 'Under Investigation'];
        return { reportid: 'MM-' + (1001 + i), casetype: types[i], dateofevent: '0' + (1 + i) + ' Jul 2026', primarycause: 'Septic Shock', reviewedby: 'M&M Committee', status: statuses[i] };
      }),
  },
  "/ot/reports/occupancy": {
    ui: 5,
    title: "ICU Occupancy Report", description: "Bed occupancy rates, average length of stay (ALOS), and admission trends.",
    stats: [{ label: "Overall ICU Occupancy", color: "text-amber-400", value: "85%" }, { label: "Avg LOS", color: "text-blue-400", value: "4.2 Days" }, { label: "Bed Turnovers", color: "text-emerald-400", value: "145" }],
    columns: [["Unit", "unit"], ["Total Beds", "totalbeds"], ["Occupancy Rate", "occupancyrate"], ["ALOS (Days)", "alosdays"], ["Admissions", "admissions"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const units = ['General ICU', 'SICU', 'MICU', 'CCU', 'NICU'];
        return { unit: units[i], totalbeds: (10 + i * 2).toString(), occupancyrate: (80 + i * 2) + '%', alosdays: (3 + i * 0.5).toFixed(1), admissions: (30 + i * 5).toString(), status: 'Generated' };
      }),
  },
  "/ot/reports/surgery": {
    ui: 5,
    title: "Surgery Statistics", description: "Breakdown of surgeries by specialty, surgeon, and complexity.",
    stats: [{ label: "Total Surgeries (MTD)", color: "text-blue-400", value: "345" }, { label: "Major Cases", color: "text-amber-400", value: "120" }, { label: "Overall Success Rate", color: "text-emerald-400", value: "99.1%" }],
    columns: [["Specialty", "specialty"], ["Total Surgeries", "totalsurgeries"], ["Major Surgeries", "majorsurgeries"], ["Minor Surgeries", "minorsurgeries"], ["Complication Rate", "complicationrate"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const specialties = ['General Surgery', 'Orthopedics', 'Cardiothoracic', 'Neurosurgery', 'Gynecology'];
        return { specialty: specialties[i], totalsurgeries: (50 + i * 10).toString(), majorsurgeries: (20 + i * 5).toString(), minorsurgeries: (30 + i * 5).toString(), complicationrate: '0.' + i + '%', status: 'Generated' };
      }),
  },
  "/ot/reports/utilization": {
    ui: 5,
    title: "OT Utilization Report", description: "Metrics on theater usage, turnaround times, and delays.",
    stats: [{ label: "Overall Utilization", color: "text-blue-400", value: "78%" }, { label: "Avg Turnaround", color: "text-emerald-400", value: "28 mins" }, { label: "Total Delay (Month)", color: "text-amber-400", value: "14 hrs" }],
    columns: [["OT Room", "otroom"], ["Total Surgeries", "totalsurgeries"], ["Utilization %", "utilization"], ["Avg Turnaround Time", "avgturnaroundtime"], ["Delay Hours", "delayhours"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { otroom: 'OT ' + (1 + i), totalsurgeries: (20 + i * 5).toString(), utilization: (70 + i * 5) + '%', avgturnaroundtime: (25 + i) + ' mins', delayhours: (1 + i).toString() + ' hrs', status: 'Generated' };
      }),
  },
  "/ot/reports/ventilator": {
    ui: 5,
    title: "Ventilator Usage Report", description: "Statistics on mechanical ventilation days and VAP (Ventilator-Associated Pneumonia) rates.",
    stats: [{ label: "Total Vent Days (YTD)", color: "text-blue-400", value: "850" }, { label: "VAP Rate (per 1000 days)", color: "text-emerald-400", value: "1.2" }, { label: "Successful Weans", color: "text-emerald-400", value: "92%" }],
    columns: [["Month", "month"], ["Ventilator Days", "ventilatordays"], ["Total Patients", "totalpatients"], ["Avg Vent Days/Patient", "avgventdayspatient"], ["VAP Cases", "vapcases"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        return { month: months[i] + ' 2026', ventilatordays: (120 + i * 10).toString(), totalpatients: (40 + i * 2).toString(), avgventdayspatient: '3.' + i, vapcases: (i === 0) ? '1' : '0', status: 'Generated' };
      }),
  },
  "/ot/scheduling/availability": {
    ui: 5,
    title: "OT Availability", description: "Real-time dashboard showing occupied and available operation theaters.",
    stats: [{ label: "Total OTs", color: "text-blue-400", value: "8" }, { label: "Currently Active", color: "text-emerald-400", value: "5" }, { label: "Under Maintenance", color: "text-red-400", value: "1" }],
    columns: [["OT Room", "otroom"], ["Current Status", "currentstatus"], ["Current Surgery", "currentsurgery"], ["Next Scheduled", "nextscheduled"], ["Turnaround Time", "turnaroundtime"]],
    badge: ["Status", "status", {"In Use":"red","Available":"emerald","Cleaning":"amber","Maintenance":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In Use', 'Available', 'Cleaning', 'In Use', 'Maintenance'];
        return { otroom: 'OT ' + (1 + i), currentstatus: statuses[i], currentsurgery: statuses[i] === 'In Use' ? 'CABG' : '-', nextscheduled: '2:00 PM', turnaroundtime: '45 mins', status: statuses[i] };
      }),
  },
  "/ot/scheduling/booking": {
    ui: 5,
    title: "OT Booking", description: "Interface for surgeons to request and book operation theater slots.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "8" }, { label: "Approved Today", color: "text-emerald-400", value: "15" }, { label: "Declined/Rescheduled", color: "text-gray-400", value: "1" }],
    columns: [["Booking ID", "bookingid"], ["Patient Name", "patientname"], ["Procedure", "procedure"], ["Requested Date", "requesteddate"], ["Duration", "duration"]],
    badge: ["Status", "status", {"Pending":"amber","Approved":"emerald","Rescheduled":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending', 'Approved', 'Approved', 'Pending', 'Rescheduled'];
        return { bookingid: 'BKG-' + (1001 + i), patientname: 'Patient ' + (i + 1), procedure: 'Appendectomy', requesteddate: 'Next Week', duration: '2 Hours', status: statuses[i] };
      }),
  },
  "/ot/scheduling/calendar": {
    ui: 5,
    title: "Surgery Calendar", description: "Interactive calendar view of all scheduled surgeries across theaters.",
    stats: [{ label: "Surgeries Today", color: "text-blue-400", value: "12" }, { label: "Available Slots", color: "text-emerald-400", value: "4" }, { label: "Emergency Add-ons", color: "text-red-400", value: "2" }],
    columns: [["Surgery Date", "surgerydate"], ["Time Slot", "timeslot"], ["OT Room", "otroom"], ["Patient Name", "patientname"], ["Surgeon", "surgeon"]],
    badge: ["Status", "status", {"Confirmed":"emerald","Tentative":"amber","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Confirmed', 'Confirmed', 'Tentative', 'Confirmed', 'In Progress'];
        return { surgerydate: 'Today', timeslot: (8 + i) + ':00 AM', otroom: 'OT ' + (1 + i), patientname: 'Patient ' + (i + 1), surgeon: 'Dr. Grey', status: statuses[i] };
      }),
  },
  "/ot/scheduling/emergency": {
    ui: 5,
    title: "Emergency OT", description: "Rapid booking and mobilization for life-saving emergency surgeries.",
    stats: [{ label: "Active Trauma Cases", color: "text-red-400", value: "2" }, { label: "Avg Time to Knife", color: "text-emerald-400", value: "18 mins" }, { label: "Standby Teams", color: "text-blue-400", value: "1" }],
    columns: [["Case ID", "caseid"], ["Patient Name", "patientname"], ["Emergency Type", "emergencytype"], ["Triage Level", "triagelevel"], ["Time to Knife", "timetoknife"]],
    badge: ["Status", "status", {"In OT":"red","Prep":"red","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In OT', 'Prep', 'Completed', 'In OT', 'Completed'];
        return { caseid: 'EMG-' + (2001 + i), patientname: 'Patient ' + (i + 1), emergencytype: 'Polytrauma', triagelevel: 'Level 1 (Red)', timetoknife: '15 mins', status: statuses[i] };
      }),
  },
  "/ot/scheduling/queue": {
    ui: 5,
    title: "Surgery Queue", description: "Waitlist and queue management for elective and semi-urgent procedures.",
    stats: [{ label: "Total in Queue", color: "text-blue-400", value: "45" }, { label: "High Priority", color: "text-red-400", value: "12" }, { label: "Cleared This Week", color: "text-emerald-400", value: "20" }],
    columns: [["Queue ID", "queueid"], ["Patient Name", "patientname"], ["Procedure", "procedure"], ["Wait Time (Days)", "waittimedays"], ["Priority", "priority"]],
    badge: ["Status", "status", {"Waiting":"amber","Scheduled":"amber","Deferred":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Waiting', 'Scheduled', 'Waiting', 'Deferred', 'Scheduled'];
        return { queueid: 'Q-' + (3001 + i), patientname: 'Patient ' + (i + 1), procedure: 'Hernia Repair', waittimedays: (5 + i).toString(), priority: i % 2 === 0 ? 'High' : 'Normal', status: statuses[i] };
      }),
  },
  "/ot/settings/preferences": {
    ui: 5,
    title: "OT Preferences", description: "Global settings for booking lead times, overtime rules, and alerts.",
    stats: [{ label: "Auto-Cancellation", color: "text-amber-400", value: "Enabled" }, { label: "SMS Alerts", color: "text-emerald-400", value: "Enabled" }, { label: "Booking Lead Time", color: "text-blue-400", value: "24 hrs" }],
    columns: [["Setting Name", "settingname"], ["Category", "category"], ["Current Value", "currentvalue"], ["Last Modified", "lastmodified"], ["Modified By", "modifiedby"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const settings = ['Min Booking Lead Time', 'Auto-Cancel Unconfirmed', 'Surgeon Delay SMS Alert', 'Enable PAC Mandate', 'Overtime Approval Reqd'];
        const values = ['24 Hours', 'Yes', 'Yes', 'Yes', 'Yes'];
        return { settingname: settings[i], category: 'Workflow', currentvalue: values[i], lastmodified: '15 Jun 2026', modifiedby: 'System Admin', status: 'Active' };
      }),
  },
  "/ot/settings/rooms": {
    ui: 5,
    title: "OT Rooms Configuration", description: "Configure theater capabilities, positive pressure, and specialized equipment.",
    stats: [{ label: "Total OTs", color: "text-blue-400", value: "8" }, { label: "Modular OTs", color: "text-emerald-400", value: "4" }, { label: "Cath Lab", color: "text-blue-400", value: "1" }],
    columns: [["Room Name", "roomname"], ["Type", "type"], ["Positive Pressure", "positivepressure"], ["Specialized For", "specializedfor"], ["Max Capacity", "maxcapacity"]],
    badge: ["Status", "status", {"Active":"emerald","Maintenance":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Modular OT', 'Standard OT', 'Cardiac OT', 'Neuro OT', 'Ortho OT'];
        const statuses = ['Active', 'Active', 'Active', 'Maintenance', 'Active'];
        return { roomname: 'OT ' + (1 + i), type: types[i], positivepressure: 'Yes', specializedfor: types[i].split(' ')[0], maxcapacity: '1 Patient', status: statuses[i] };
      }),
  },
  "/ot/settings/surgery-types": {
    ui: 5,
    title: "Surgery Types & Codes", description: "Master list of surgical procedures, CPT codes, and standard durations.",
    stats: [{ label: "Total Procedures", color: "text-blue-400", value: "850" }, { label: "Recently Added", color: "text-emerald-400", value: "12" }, { label: "Inactive Codes", color: "text-gray-400", value: "5" }],
    columns: [["Surgery Code", "surgerycode"], ["Description", "description"], ["Specialty", "specialty"], ["Standard Duration", "standardduration"], ["Base Price", "baseprice"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { surgerycode: 'CPT-' + (10001 + i), description: 'Laparoscopic Cholecystectomy', specialty: 'General Surgery', standardduration: '90 mins', baseprice: '$' + (1500 + i * 100), status: 'Active' };
      }),
  },
  "/ot/settings/templates": {
    ui: 5,
    title: "Procedure Templates", description: "Pre-defined templates for standard surgical notes and anesthesia plans.",
    stats: [{ label: "Active Templates", color: "text-blue-400", value: "45" }, { label: "Most Used", color: "text-emerald-400", value: "General Anesthesia" }, { label: "Drafts", color: "text-amber-400", value: "3" }],
    columns: [["Template ID", "templateid"], ["Template Name", "templatename"], ["Specialty", "specialty"], ["Author", "author"], ["Last Updated", "lastupdated"]],
    badge: ["Status", "status", {"Active":"emerald","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active', 'Active', 'Draft', 'Active', 'Active'];
        return { templateid: 'TPL-' + (101 + i), templatename: 'Standard Appendectomy Note', specialty: 'General Surgery', author: 'Dr. Chief', lastupdated: '01 Jan 2026', status: statuses[i] };
      }),
  },
  "/ot/transfers/bed-transfer": {
    ui: 5,
    title: "Internal Bed Transfers", description: "Reallocating beds within the same critical care unit.",
    stats: [{ label: "Bed Swaps Today", color: "text-blue-400", value: "2" }, { label: "Completed", color: "text-emerald-400", value: "2" }, { label: "Pending Cleaning", color: "text-gray-400", value: "0" }],
    columns: [["Transfer ID", "transferid"], ["Patient Name", "patientname"], ["Unit", "unit"], ["From Bed", "frombed"], ["To Bed", "tobed"]],
    badge: ["Status", "status", {"Completed":"emerald","Pending Cleaning":"amber","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'Completed', 'Pending Cleaning', 'Scheduled', 'Completed'];
        return { transferid: 'IBT-' + (5001 + i), patientname: 'Patient ' + (i + 1), unit: 'ICU', frombed: 'Bed ' + (1 + i), tobed: 'Bed ' + (5 + i), status: statuses[i] };
      }),
  },
  "/ot/transfers/icu-admission": {
    ui: 5,
    title: "ICU Admissions", description: "Incoming patients from ER, Wards, or other hospitals to ICU.",
    stats: [{ label: "Admissions Today", color: "text-blue-400", value: "5" }, { label: "Pending Bed Allocation", color: "text-amber-400", value: "1" }, { label: "Expected Arrivals", color: "text-gray-400", value: "2" }],
    columns: [["Admission ID", "admissionid"], ["Patient Name", "patientname"], ["Source", "source"], ["Diagnosis", "diagnosis"], ["Assigned Bed", "assignedbed"]],
    badge: ["Status", "status", {"Admitted":"emerald","Pending Bed":"amber","Expected":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const sources = ['ER', 'Surgical Ward', 'External Hospital', 'ER', 'OT'];
        const statuses = ['Admitted', 'Pending Bed', 'Expected', 'Admitted', 'Admitted'];
        return { admissionid: 'ADM-' + (1001 + i), patientname: 'Patient ' + (i + 1), source: sources[i], diagnosis: 'Sepsis', assignedbed: statuses[i] === 'Pending Bed' ? '-' : 'ICU-' + (i + 1), status: statuses[i] };
      }),
  },
  "/ot/transfers/icu-transfer": {
    ui: 5,
    title: "ICU to ICU Transfers", description: "Moving patients between critical care units (e.g., SICU to Step-down).",
    stats: [{ label: "Transfers Today", color: "text-blue-400", value: "3" }, { label: "Completed", color: "text-emerald-400", value: "2" }, { label: "In Progress", color: "text-amber-400", value: "1" }],
    columns: [["Transfer ID", "transferid"], ["Patient Name", "patientname"], ["From Unit", "fromunit"], ["To Unit", "tounit"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Completed":"emerald","In Progress":"amber","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'In Progress', 'Scheduled', 'Completed', 'Completed'];
        return { transferid: 'TRF-' + (2001 + i), patientname: 'Patient ' + (i + 1), fromunit: 'SICU', tounit: 'HDU', reason: 'Improving (Step-down)', status: statuses[i] };
      }),
  },
  "/ot/transfers/ot-transfer": {
    ui: 5,
    title: "OT to ICU Transfers", description: "Direct handovers from Operation Theatre to Critical Care.",
    stats: [{ label: "OT to ICU Today", color: "text-blue-400", value: "4" }, { label: "Pending Handovers", color: "text-amber-400", value: "1" }, { label: "Delayed", color: "text-emerald-400", value: "0" }],
    columns: [["Transfer ID", "transferid"], ["Patient Name", "patientname"], ["Surgery", "surgery"], ["Anesthetist", "anesthetist"], ["Receiving ICU", "receivingicu"]],
    badge: ["Status", "status", {"Transferred":"emerald","En Route":"amber","Pending Handover":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Transferred', 'En Route', 'Pending Handover', 'Transferred', 'Transferred'];
        return { transferid: 'OTI-' + (3001 + i), patientname: 'Patient ' + (i + 1), surgery: 'CABG', anesthetist: 'Dr. Sleep', receivingicu: 'CTVS ICU', status: statuses[i] };
      }),
  },
  "/ot/transfers/ward-transfer": {
    ui: 5,
    title: "ICU to Ward Transfers", description: "Discharging stabilized patients from ICU to general wards.",
    stats: [{ label: "Step-downs Today", color: "text-blue-400", value: "6" }, { label: "Pending Ward Beds", color: "text-amber-400", value: "2" }, { label: "Completed", color: "text-emerald-400", value: "4" }],
    columns: [["Transfer ID", "transferid"], ["Patient Name", "patientname"], ["From ICU", "fromicu"], ["To Ward", "toward"], ["Ward Nurse Notified", "wardnursenotified"]],
    badge: ["Status", "status", {"Completed":"emerald","Waiting for Bed":"amber","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'Waiting for Bed', 'In Progress', 'Completed', 'Completed'];
        return { transferid: 'I2W-' + (4001 + i), patientname: 'Patient ' + (i + 1), fromicu: 'MICU', toward: 'Medical Ward B', wardnursenotified: 'Yes', status: statuses[i] };
      }),
  },
};

export default pages;
