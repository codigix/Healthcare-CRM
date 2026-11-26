import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/facilities/ambulance/billing": {
    ui: 5,
    title: "Ambulance Billing", description: "Integration with HIS for charging patients based on distance or zones.",
    stats: [{ label: "Revenue (Mo)", color: "text-blue-400", value: "$12,500" }, { label: "Free Trips (Camps)", color: "text-amber-400", value: "5" }, { label: "Pending Billing", color: "text-red-400", value: "2" }],
    columns: [["Billing ID", "billingid"], ["Linked Trip", "linkedtrip"], ["Patient", "patient"], ["Distance", "distance"], ["Amount Charged", "amountcharged"]],
    badge: ["Status", "status", {"Pending":"amber","Billed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { billingid: 'ABL-' + (4001 + i), linkedtrip: 'TRP-' + (3001 + i), patient: 'Patient ' + (1 + i), distance: '15 Km', amountcharged: '$' + (50 + i * 10), status: i === 0 ? 'Pending' : 'Billed' };
      }),
  },
  "/facilities/ambulance/booking": {
    ui: 5,
    title: "Ambulance Booking", description: "Logging requests for patient pickup or discharge drops.",
    stats: [{ label: "Bookings Today", color: "text-blue-400", value: "24" }, { label: "Pending Dispatch", color: "text-amber-400", value: "2" }, { label: "Completed Trips", color: "text-emerald-400", value: "18" }],
    columns: [["Booking ID", "bookingid"], ["Patient/Caller", "patientcaller"], ["Pickup Location", "pickuplocation"], ["Drop Location", "droplocation"], ["Requested Time", "requestedtime"]],
    badge: ["Status", "status", {"Pending Dispatch":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { bookingid: 'AMB-' + (1001 + i), patientcaller: 'Caller ' + (1 + i), pickuplocation: i === 0 ? 'Home (Sector 4)' : 'Hospital', droplocation: i === 0 ? 'Hospital' : 'Home', requestedtime: 'Today 10:00', status: i === 0 ? 'Pending Dispatch' : 'Completed' };
      }),
  },
  "/facilities/ambulance/dashboard": {
    ui: 5,
    title: "Ambulance Dashboard", description: "Live map view and metric summary of fleet location and status.",
    stats: [{ label: "Total Ambulances", color: "text-blue-400", value: "12" }, { label: "Currently Active", color: "text-emerald-400", value: "5" }, { label: "Under Maintenance", color: "text-amber-400", value: "1" }],
    columns: [["Metric", "metric"], ["Value", "value"], ["Target", "target"], ["Variance", "variance"], ["Trend", "trend"]],
    badge: ["Status", "status", {"On Track":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['Avg Response Time', 'Fleet Utilization', 'Trips Today', 'Fuel Efficiency', 'Patient Safely Dropped'];
        return { metric: metrics[i], value: '15 Mins', target: '< 20 Mins', variance: '-5 Mins', trend: 'Improving', status: 'On Track' };
      }),
  },
  "/facilities/ambulance/dispatch": {
    ui: 5,
    title: "Emergency Dispatch", description: "Assigning the nearest available ambulance and EMT crew to a booking.",
    stats: [{ label: "Active Dispatches", color: "text-emerald-400", value: "5" }, { label: "Avg Dispatch Time", color: "text-blue-400", value: "2 Mins" }, { label: "Crews Available", color: "text-emerald-400", value: "3" }],
    columns: [["Dispatch ID", "dispatchid"], ["Ambulance Reg No", "ambulanceregno"], ["Driver Assigned", "driverassigned"], ["EMT Assigned", "emtassigned"], ["Dispatched At", "dispatchedat"]],
    badge: ["Status", "status", {"En Route to Patient":"amber","Available":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { dispatchid: 'DSP-' + (2001 + i), ambulanceregno: 'MH12 AB ' + (1000 + i), driverassigned: 'Driver Bob', emtassigned: 'EMT Alice', dispatchedat: '10 Mins Ago', status: i === 0 ? 'En Route to Patient' : 'Available' };
      }),
  },
  "/facilities/ambulance/driver": {
    ui: 5,
    title: "Driver Management", description: "Managing driver rosters, license renewals, and shift timings.",
    stats: [{ label: "Total Drivers", color: "text-blue-400", value: "24" }, { label: "On Duty", color: "text-emerald-400", value: "10" }, { label: "License Expiring", color: "text-red-400", value: "1" }],
    columns: [["Driver Name", "drivername"], ["License No", "licenseno"], ["Expiry Date", "expirydate"], ["Current Shift", "currentshift"], ["Trips Today", "tripstoday"]],
    badge: ["Status", "status", {"Action Required":"amber","Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { drivername: 'Driver ' + (1 + i), licenseno: 'DL' + (9876543210 + i), expirydate: i === 0 ? 'Next Month' : '31 Dec 2028', currentshift: 'Morning', tripstoday: (2 + i).toString(), status: i === 0 ? 'Action Required' : 'Active' };
      }),
  },
  "/facilities/ambulance/history": {
    ui: 5,
    title: "Trip History", description: "Log book of all completed ambulance trips for auditing and maintenance scheduling.",
    stats: [{ label: "Total Distance (Mo)", color: "text-blue-400", value: "4,500 Km" }, { label: "Avg Distance/Trip", color: "text-emerald-400", value: "12 Km" }, { label: "Fuel Logged", color: "text-amber-400", value: "450 Ltrs" }],
    columns: [["Trip ID", "tripid"], ["Vehicle", "vehicle"], ["Start Km", "startkm"], ["End Km", "endkm"], ["Total Distance", "totaldistance"]],
    badge: ["Status", "status", {"Logged":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { tripid: 'TRP-' + (3001 + i), vehicle: 'MH12 AB ' + (1000 + i), startkm: (45000 + i * 20).toString(), endkm: (45015 + i * 20).toString(), totaldistance: '15 Km', status: 'Logged' };
      }),
  },
  "/facilities/ambulance/tracking": {
    ui: 5,
    title: "Vehicle Tracking (GPS)", description: "GPS integration for live location tracking of the ambulance fleet.",
    stats: [{ label: "GPS Active", color: "text-emerald-400", value: "12/12" }, { label: "Idle Vehicles", color: "text-blue-400", value: "7" }, { label: "Speeding Alerts", color: "text-green-500", value: "0" }],
    columns: [["Vehicle No", "vehicleno"], ["Type (ALS/BLS)", "typealsbls"], ["Current Location", "currentlocation"], ["Speed", "speed"], ["Ignition Status", "ignitionstatus"]],
    badge: ["Status", "status", {"Moving":"emerald","Parked":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { vehicleno: 'MH12 AB ' + (1000 + i), typealsbls: i % 2 === 0 ? 'ALS' : 'BLS', currentlocation: i === 0 ? 'Highway 4' : 'Hospital Parking', speed: i === 0 ? '45 km/h' : '0 km/h', ignitionstatus: i === 0 ? 'ON' : 'OFF', status: i === 0 ? 'Moving' : 'Parked' };
      }),
  },
  "/facilities/analytics/cost": {
    ui: 5,
    title: "Cost Analysis", description: "Total cost of ownership (TCO) analysis for facility operations.",
    stats: [{ label: "Total Facility Spend", color: "text-blue-400", value: "$125,000" }, { label: "Overall Variance", color: "text-emerald-400", value: "-$2,500" }, { label: "Highest Spend", color: "text-amber-400", value: "Utilities (35%)" }],
    columns: [["Cost Center", "costcenter"], ["Budget (Mo)", "budgetmo"], ["Actual Spend", "actualspend"], ["Variance", "variance"], ["Cost Drivers", "costdrivers"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const centers = ['Utilities', 'Housekeeping', 'Maintenance', 'Security', 'Laundry'];
        return { costcenter: centers[i], budgetmo: '$' + (40000 - i * 5000), actualspend: '$' + (39000 - i * 4500), variance: '-$1,000', costdrivers: 'Tariff Hike', status: 'Analyzed' };
      }),
  },
  "/facilities/analytics/dashboard": {
    ui: 5,
    title: "Facility Dashboard", description: "High-level executive overview of all facility operations and costs.",
    stats: [{ label: "Facility Cost/SqFt", color: "text-blue-400", value: "$4.50" }, { label: "Overall Compliance", color: "text-emerald-400", value: "98%" }, { label: "Critical Risks", color: "text-green-500", value: "0" }],
    columns: [["Domain", "domain"], ["Total Cost", "totalcost"], ["Key Metric", "keymetric"], ["Performance vs Target", "performancevstarget"], ["Risk Level", "risklevel"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const domains = ['Maintenance', 'Housekeeping', 'Security', 'Utilities', 'Biomedical'];
        return { domain: domains[i], totalcost: '$' + (40000 - i * 5000), keymetric: 'SLA Met: 95%', performancevstarget: '+2%', risklevel: 'Low', status: 'Analyzed' };
      }),
  },
  "/facilities/analytics/downtime": {
    ui: 5,
    title: "Equipment Downtime", description: "Financial and operational impact analysis of medical equipment being out of order.",
    stats: [{ label: "Lost Revenue (YTD)", color: "text-red-400", value: "$45,000" }, { label: "Total Downtime", color: "text-amber-400", value: "120 Hrs" }, { label: "Uptime", color: "text-emerald-400", value: "99.1%" }],
    columns: [["Equipment", "equipment"], ["Total Downtime", "totaldowntime"], ["Lost Revenue Impact", "lostrevenueimpact"], ["Patients Affected", "patientsaffected"], ["Mitigation", "mitigation"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { equipment: 'MRI Scanner', totaldowntime: (24 - i * 4) + ' Hrs', lostrevenueimpact: '$' + (15000 - i * 2000), patientsaffected: (30 - i * 5).toString(), mitigation: 'Backup Used', status: 'Analyzed' };
      }),
  },
  "/facilities/analytics/maintenance": {
    ui: 5,
    title: "Maintenance Analytics", description: "Deep dive into recurring breakdowns and root cause analysis of failures.",
    stats: [{ label: "Overall MTTR", color: "text-emerald-400", value: "3.5 Hrs" }, { label: "Overall MTBF", color: "text-blue-400", value: "45 Days" }, { label: "Worst Asset", color: "text-red-400", value: "Lift 2" }],
    columns: [["Asset Class", "assetclass"], ["Breakdown Freq", "breakdownfreq"], ["MTTR", "mttr"], ["MTBF", "mtbf"], ["Top Root Cause", "toprootcause"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { assetclass: 'HVAC Units', breakdownfreq: (15 - i * 2) + '/Mo', mttr: (4 - i * 0.5).toFixed(1) + ' Hrs', mtbf: (30 + i * 5) + ' Days', toprootcause: 'Bearing Failure', status: 'Analyzed' };
      }),
  },
  "/facilities/analytics/utility": {
    ui: 5,
    title: "Utility Consumption", description: "Heatmaps and trends identifying energy or water wastage.",
    stats: [{ label: "Energy Intensity", color: "text-blue-400", value: "145 kWh/m2" }, { label: "Peak Load", color: "text-amber-400", value: "850 kW" }, { label: "Savings from LED", color: "text-emerald-400", value: "$1,200" }],
    columns: [["Area/Department", "areadepartment"], ["Energy Usage", "energyusage"], ["Water Usage", "waterusage"], ["Cost/SqFt", "costsqft"], ["Efficiency Score", "efficiencyscore"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { areadepartment: 'Main OT Block', energyusage: '45,000 kWh', waterusage: '12,000 L', costsqft: '$5.20', efficiencyscore: '88/100', status: 'Analyzed' };
      }),
  },
  "/facilities/analytics/vendor": {
    ui: 5,
    title: "Vendor Performance", description: "Ranking vendors based on response time, cost-effectiveness, and quality.",
    stats: [{ label: "Top Performing", color: "text-emerald-400", value: "CleanCo (98%)" }, { label: "Underperforming", color: "text-red-400", value: "1" }, { label: "Avg Satisfaction", color: "text-blue-400", value: "4.2/5" }],
    columns: [["Vendor", "vendor"], ["Category", "category"], ["SLA Score", "slascore"], ["Cost Competitiveness", "costcompetitiveness"], ["Quality Rating", "qualityrating"]],
    badge: ["Status", "status", {"Optimal":"emerald","Review Suggested":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { vendor: 'Vendor ' + (1 + i), category: 'Housekeeping', slascore: (95 - i) + '%', costcompetitiveness: 'High', qualityrating: (4.5 - i * 0.2).toFixed(1) + '/5', status: i === 4 ? 'Review Suggested' : 'Optimal' };
      }),
  },
  "/facilities/biomedical/allocation": {
    ui: 5,
    title: "Equipment Allocation", description: "Tracking which equipment is deployed to which ward/bed and movement history.",
    stats: [{ label: "Items in Transit", color: "text-amber-400", value: "5" }, { label: "Deployed Assets", color: "text-blue-400", value: "950" }, { label: "Store Reserve", color: "text-emerald-400", value: "200" }],
    columns: [["Equipment ID", "equipmentid"], ["Name", "name"], ["Current Location", "currentlocation"], ["Allocated Date", "allocateddate"], ["Moved By", "movedby"]],
    badge: ["Status", "status", {"Deployed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { equipmentid: 'BME-' + (2001 + i), name: 'Syringe Pump', currentlocation: 'Ward B Bed ' + (1 + i), allocateddate: 'Yesterday', movedby: 'Nurse Staff', status: 'Deployed' };
      }),
  },
  "/facilities/biomedical/amc": {
    ui: 5,
    title: "AMC Contracts", description: "Comprehensive Maintenance Contracts (CMC) and AMCs with Original Equipment Manufacturers (OEMs).",
    stats: [{ label: "Active Contracts", color: "text-blue-400", value: "85" }, { label: "CMC Value", color: "text-emerald-400", value: "$450K" }, { label: "Expiring Soon", color: "text-amber-400", value: "5" }],
    columns: [["Contract ID", "contractid"], ["Equipment Class", "equipmentclass"], ["OEM/Vendor", "oemvendor"], ["Type (AMC/CMC)", "typeamccmc"], ["Expiry", "expiry"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { contractid: 'CAMC-' + (6001 + i), equipmentclass: 'Ventilators', oemvendor: 'MedTech Inc', typeamccmc: 'CMC', expiry: '31 Dec 2026', status: 'Active' };
      }),
  },
  "/facilities/biomedical/breakdown": {
    ui: 5,
    title: "Breakdown Maintenance", description: "Emergency repair logs for medical equipment failures impacting patient care.",
    stats: [{ label: "Active Breakdowns", color: "text-red-400", value: "2" }, { label: "Avg Downtime", color: "text-amber-400", value: "4.5 Hrs" }, { label: "Resolved Today", color: "text-emerald-400", value: "3" }],
    columns: [["Ticket ID", "ticketid"], ["Equipment Name", "equipmentname"], ["Location", "location"], ["Fault Description", "faultdescription"], ["Downtime", "downtime"]],
    badge: ["Status", "status", {"Open":"amber","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { ticketid: 'BDN-' + (5001 + i), equipmentname: 'ECG Machine', location: 'ER', faultdescription: 'Display Error', downtime: (2 + i) + ' Hrs', status: i < 2 ? 'Open' : 'In Progress' };
      }),
  },
  "/facilities/biomedical/calibration": {
    ui: 5,
    title: "Calibration", description: "Mandatory statutory calibration tracking for precision medical equipment.",
    stats: [{ label: "Calibrations Due (30D)", color: "text-amber-400", value: "45" }, { label: "Compliance", color: "text-emerald-400", value: "100%" }, { label: "Failed Calibration", color: "text-red-400", value: "0" }],
    columns: [["Equipment ID", "equipmentid"], ["Name", "name"], ["Last Calibration", "lastcalibration"], ["Next Due", "nextdue"], ["Agency", "agency"]],
    badge: ["Status", "status", {"Due Soon":"amber","Compliant":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { equipmentid: 'BME-' + (3001 + i), name: 'Weighing Scale', lastcalibration: '01 Jan 2026', nextdue: i === 0 ? 'This Week' : '01 Jan 2027', agency: 'NABL Lab', status: i === 0 ? 'Due Soon' : 'Compliant' };
      }),
  },
  "/facilities/biomedical/dashboard": {
    ui: 5,
    title: "Equipment Dashboard", description: "High-level view of medical equipment uptime, calibrations, and active breakdowns.",
    stats: [{ label: "Total Medical Assets", color: "text-blue-400", value: "1,240" }, { label: "Overall Uptime", color: "text-emerald-400", value: "99.2%" }, { label: "Critical Downs", color: "text-red-400", value: "1" }],
    columns: [["Metric", "metric"], ["Value", "value"], ["Target", "target"], ["Variance", "variance"], ["Trend", "trend"]],
    badge: ["Status", "status", {"On Track":"emerald","Attention Needed":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['Equipment Uptime', 'Calibration Compliance', 'PM Adherence', 'Mean Time to Repair', 'Scrap %'];
        return { metric: metrics[i], value: '98%', target: '>99%', variance: '-1%', trend: 'Stable', status: i === 1 ? 'Attention Needed' : 'On Track' };
      }),
  },
  "/facilities/biomedical/preventive": {
    ui: 5,
    title: "Preventive Maintenance", description: "Scheduled servicing for medical devices as per manufacturer guidelines.",
    stats: [{ label: "PMs Due", color: "text-blue-400", value: "34" }, { label: "Completed (Mo)", color: "text-emerald-400", value: "120" }, { label: "Overdue", color: "text-red-400", value: "0" }],
    columns: [["PM ID", "pmid"], ["Equipment Name", "equipmentname"], ["Department", "department"], ["Scheduled Date", "scheduleddate"], ["Assigned Tech", "assignedtech"]],
    badge: ["Status", "status", {"Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { pmid: 'BPM-' + (4001 + i), equipmentname: 'Patient Monitor', department: 'ICU', scheduleddate: 'Today', assignedtech: 'BioMed Eng ' + (1 + i), status: 'Scheduled' };
      }),
  },
  "/facilities/biomedical/register": {
    ui: 5,
    title: "Equipment Register", description: "Master database of all medical devices (MRI, Monitors, Ventilators).",
    stats: [{ label: "Total Value", color: "text-blue-400", value: "$12.5M" }, { label: "Active Equip.", color: "text-emerald-400", value: "1,150" }, { label: "Decommissioned", color: "text-gray-400", value: "90" }],
    columns: [["Equipment ID", "equipmentid"], ["Name", "name"], ["Manufacturer", "manufacturer"], ["Serial No", "serialno"], ["Department", "department"]],
    badge: ["Status", "status", {"Functional":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const equip = ['Patient Monitor', 'Ventilator', 'Defibrillator', 'Syringe Pump', 'ECG Machine'];
        return { equipmentid: 'BME-' + (1001 + i), name: equip[i], manufacturer: 'MedTech Inc', serialno: 'SN987' + i, department: 'ICU', status: 'Functional' };
      }),
  },
  "/facilities/biomedical/reports": {
    ui: 5,
    title: "Service Reports", description: "Digital storage of service reports provided by vendors post-repair or PM.",
    stats: [{ label: "Reports Uploaded", color: "text-blue-400", value: "450" }, { label: "Missing Reports", color: "text-amber-400", value: "12" }, { label: "Audit Passing", color: "text-emerald-400", value: "100%" }],
    columns: [["Report ID", "reportid"], ["Equipment", "equipment"], ["Service Type", "servicetype"], ["Vendor Tech", "vendortech"], ["Date", "date"]],
    badge: ["Status", "status", {"Verified":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportid: 'REP-' + (7001 + i), equipment: 'MRI Scanner', servicetype: 'PM', vendortech: 'Tech Joe', date: 'Yesterday', status: 'Verified' };
      }),
  },
  "/facilities/compliance/audit": {
    ui: 5,
    title: "Compliance Audit", description: "Internal audits for building codes, elevator licenses, and boiler certifications.",
    stats: [{ label: "Statutory Licenses", color: "text-emerald-400", value: "18/18 Valid" }, { label: "Upcoming Renewals", color: "text-amber-400", value: "2" }, { label: "Penalty Paid", color: "text-green-500", value: "$0" }],
    columns: [["Audit Type", "audittype"], ["Certifying Body", "certifyingbody"], ["Valid Till", "validtill"], ["Findings", "findings"], ["Compliance %", "compliance"]],
    badge: ["Status", "status", {"Renewal Due":"amber","Compliant":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const audits = ['Elevator License', 'Fire NOC', 'Boiler Cert', 'DG Set Consent', 'Water Test'];
        return { audittype: audits[i], certifyingbody: 'Govt Dept', validtill: i === 0 ? 'Next Month' : 'Dec 2026', findings: 'Minor wear', compliance: '98%', status: i === 0 ? 'Renewal Due' : 'Compliant' };
      }),
  },
  "/facilities/compliance/disaster": {
    ui: 5,
    title: "Disaster Management", description: "Emergency protocols, stock of disaster kits, and contact trees.",
    stats: [{ label: "Disaster Kits Ready", color: "text-emerald-400", value: "10/10" }, { label: "Protocols Updated", color: "text-blue-400", value: "100%" }, { label: "Staff Trained", color: "text-amber-400", value: "85%" }],
    columns: [["Resource/Protocol", "resourceprotocol"], ["Category", "category"], ["Last Updated", "lastupdated"], ["Stock Level", "stocklevel"], ["Audited By", "auditedby"]],
    badge: ["Status", "status", {"Ready":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { resourceprotocol: 'Mass Casualty Kit ' + (1 + i), category: 'Medical Supplies', lastupdated: 'Jan 2026', stocklevel: '100%', auditedby: 'ER Head', status: 'Ready' };
      }),
  },
  "/facilities/compliance/drills": {
    ui: 5,
    title: "Emergency Drills", description: "Logging mock drills for fire, code blue, and mass casualty incidents.",
    stats: [{ label: "Drills Conducted (YTD)", color: "text-blue-400", value: "4" }, { label: "Avg Evac Time", color: "text-emerald-400", value: "4m 30s" }, { label: "Next Drill Due", color: "text-amber-400", value: "October" }],
    columns: [["Drill Date", "drilldate"], ["Scenario", "scenario"], ["Participants", "participants"], ["Evacuation Time", "evacuationtime"], ["Observer Notes", "observernotes"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { drilldate: '15 ' + ['Jun', 'Mar', 'Jan', 'Oct', 'Aug'][i] + ' 2026', scenario: 'Fire in ICU', participants: (50 - i * 5).toString(), evacuationtime: '4m 15s', observernotes: 'Good coordination', status: 'Completed' };
      }),
  },
  "/facilities/compliance/fire": {
    ui: 5,
    title: "Fire Safety", description: "Extinguisher expiry tracking, alarm testing, and fire exit clearance audits.",
    stats: [{ label: "Extinguishers Active", color: "text-blue-400", value: "450" }, { label: "Due for Refill", color: "text-amber-400", value: "15" }, { label: "Alarms Functional", color: "text-emerald-400", value: "100%" }],
    columns: [["Asset/Area", "assetarea"], ["Type", "type"], ["Last Tested", "lasttested"], ["Next Due", "nextdue"], ["Inspector", "inspector"]],
    badge: ["Status", "status", {"Due Soon":"amber","Pass":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { assetarea: 'Exting-10' + i, type: 'CO2', lasttested: 'Jan 2026', nextdue: i === 0 ? 'Next Week' : 'Jan 2027', inspector: 'Fire Safety Officer', status: i === 0 ? 'Due Soon' : 'Pass' };
      }),
  },
  "/facilities/compliance/inspection": {
    ui: 5,
    title: "Safety Inspection", description: "Monthly OSHA/NABH facility safety rounds documenting hazards.",
    stats: [{ label: "Inspections (Mo)", color: "text-blue-400", value: "12" }, { label: "High Risk Hazards", color: "text-red-400", value: "1" }, { label: "Closed Findings", color: "text-emerald-400", value: "24" }],
    columns: [["Inspection ID", "inspectionid"], ["Zone", "zone"], ["Hazards Found", "hazardsfound"], ["Risk Level", "risklevel"], ["Action Taken", "actiontaken"]],
    badge: ["Status", "status", {"Open":"amber","Resolved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { inspectionid: 'SAF-' + (1001 + i), zone: 'Basement Parking', hazardsfound: i === 0 ? 'Loose Wiring' : 'None', risklevel: i === 0 ? 'High' : 'Low', actiontaken: i === 0 ? 'WO Created' : 'N/A', status: i === 0 ? 'Open' : 'Resolved' };
      }),
  },
  "/facilities/housekeeping/checklist": {
    ui: 5,
    title: "Cleaning Checklist", description: "Digital sign-offs replacing paper sheets in washrooms and pantries.",
    stats: [{ label: "Checklists Completed", color: "text-emerald-400", value: "450/480" }, { label: "Missed Items", color: "text-red-400", value: "5" }, { label: "Audits Done", color: "text-blue-400", value: "12" }],
    columns: [["Area", "area"], ["Checklist Item", "checklistitem"], ["Time Logged", "timelogged"], ["Completed By", "completedby"], ["Image Proof", "imageproof"]],
    badge: ["Status", "status", {"Signed Off":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { area: 'Washroom 1A', checklistitem: 'Mirror & Sink', timelogged: '10:00 AM', completedby: 'Staff Bob', imageproof: 'Uploaded', status: 'Signed Off' };
      }),
  },
  "/facilities/housekeeping/icu": {
    ui: 5,
    title: "ICU Cleaning", description: "Critical care zone cleaning logs maintaining high hygiene standards.",
    stats: [{ label: "ICU Compliance", color: "text-emerald-400", value: "100%" }, { label: "Deep Cleans Today", color: "text-blue-400", value: "3" }, { label: "Staff Trained", color: "text-emerald-400", value: "15" }],
    columns: [["ICU Bed/Zone", "icubedzone"], ["Last Clean", "lastclean"], ["Disinfectant Used", "disinfectantused"], ["Staff ID", "staffid"], ["Supervisor Sign-off", "supervisorsignoff"]],
    badge: ["Status", "status", {"Clean":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { icubedzone: 'ICU Bed ' + (1 + i), lastclean: '1 Hr Ago', disinfectantused: 'Sodium Hypochlorite', staffid: 'HK-10' + i, supervisorsignoff: 'Yes', status: 'Clean' };
      }),
  },
  "/facilities/housekeeping/isolation": {
    ui: 5,
    title: "Isolation Room Cleaning", description: "Specialized cleaning for infection control rooms (e.g., Airborne precautions).",
    stats: [{ label: "Active Isolations", color: "text-amber-400", value: "4" }, { label: "Terminal Cleans", color: "text-blue-400", value: "1" }, { label: "Protocol Breaches", color: "text-emerald-400", value: "0" }],
    columns: [["Room No", "roomno"], ["Infection Type", "infectiontype"], ["PPE Level", "ppelevel"], ["Cleaning Type", "cleaningtype"], ["Waste Protocol", "wasteprotocol"]],
    badge: ["Status", "status", {"In Use":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { roomno: 'ISO-' + (1 + i), infectiontype: 'Droplet', ppelevel: 'Level 3', cleaningtype: 'Routine', wasteprotocol: 'Yellow Bag', status: 'In Use' };
      }),
  },
  "/facilities/housekeeping/ot": {
    ui: 5,
    title: "OT Cleaning", description: "Highly regulated sterile cleaning protocols between surgeries and deep cleaning.",
    stats: [{ label: "OTs Ready", color: "text-emerald-400", value: "5/8" }, { label: "Under Cleaning", color: "text-amber-400", value: "2" }, { label: "Fumigation Due", color: "text-red-400", value: "1" }],
    columns: [["OT Number", "otnumber"], ["Surgery Type", "surgerytype"], ["Cleaning Phase", "cleaningphase"], ["Carried Out By", "carriedoutby"], ["Sterility Swap", "sterilityswap"]],
    badge: ["Status", "status", {"Cleaning in Progress":"gray","Sterile":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { otnumber: 'OT ' + (1 + i), surgerytype: 'Ortho', cleaningphase: i === 0 ? 'Between Cases' : 'Terminal', carriedoutby: 'OT Tech', sterilityswap: 'Pending', status: i === 0 ? 'Cleaning in Progress' : 'Sterile' };
      }),
  },
  "/facilities/housekeeping/requests": {
    ui: 5,
    title: "Housekeeping Requests", description: "Ad-hoc requests for spills, extra supplies, or immediate cleaning.",
    stats: [{ label: "Open Requests", color: "text-amber-400", value: "5" }, { label: "Avg Response", color: "text-emerald-400", value: "8 Mins" }, { label: "Total Today", color: "text-blue-400", value: "45" }],
    columns: [["Request ID", "requestid"], ["Location", "location"], ["Issue", "issue"], ["Requested By", "requestedby"], ["Time Taken", "timetaken"]],
    badge: ["Status", "status", {"New":"gray","Resolved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { requestid: 'HKR-' + (1001 + i), location: 'Corridor A', issue: 'Spill', requestedby: 'Nurse Bob', timetaken: i === 0 ? '-' : '10 Mins', status: i === 0 ? 'New' : 'Resolved' };
      }),
  },
  "/facilities/housekeeping/room": {
    ui: 5,
    title: "Room Cleaning", description: "Tracking cleaning status of private rooms, especially post-discharge terminal cleaning.",
    stats: [{ label: "Rooms to Clean", color: "text-amber-400", value: "15" }, { label: "Avg Turnaround", color: "text-emerald-400", value: "45 Mins" }, { label: "Cleaned Today", color: "text-blue-400", value: "45" }],
    columns: [["Room No", "roomno"], ["Patient Status", "patientstatus"], ["Cleaning Type", "cleaningtype"], ["Requested Time", "requestedtime"], ["Completion Time", "completiontime"]],
    badge: ["Status", "status", {"Pending":"blue","Cleaned":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { roomno: 'RM-20' + i, patientstatus: 'Discharged', cleaningtype: 'Terminal Clean', requestedtime: '10:00 AM', completiontime: i === 0 ? '-' : '10:45 AM', status: i === 0 ? 'Pending' : 'Cleaned' };
      }),
  },
  "/facilities/housekeeping/schedule": {
    ui: 5,
    title: "Cleaning Schedule", description: "Roster and frequency (e.g., 2-hourly) planning for cleaning staff across zones.",
    stats: [{ label: "Active Shifts", color: "text-blue-400", value: "3" }, { label: "Total HK Staff", color: "text-emerald-400", value: "120" }, { label: "Absent Today", color: "text-red-400", value: "5" }],
    columns: [["Zone/Area", "zonearea"], ["Frequency", "frequency"], ["Shift", "shift"], ["Assigned Staff", "assignedstaff"], ["Supervisor", "supervisor"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { zonearea: 'Lobby Floor ' + (1 + i), frequency: '2 Hourly', shift: 'Morning', assignedstaff: 'Staff ' + (1 + i), supervisor: 'Supv Alice', status: 'Active' };
      }),
  },
  "/facilities/housekeeping/ward": {
    ui: 5,
    title: "Ward Cleaning", description: "Routine mopping and sanitization logs for general wards.",
    stats: [{ label: "Wards Cleaned", color: "text-emerald-400", value: "24/24" }, { label: "Missed Schedules", color: "text-red-400", value: "0" }, { label: "Infection Alerts", color: "text-green-500", value: "0" }],
    columns: [["Ward Name", "wardname"], ["Last Cleaned", "lastcleaned"], ["Next Due", "nextdue"], ["Cleaning Standard", "cleaningstandard"], ["Checked By", "checkedby"]],
    badge: ["Status", "status", {"Compliant":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { wardname: 'Ward ' + (1 + i), lastcleaned: '2 Hrs Ago', nextdue: 'In 30 Mins', cleaningstandard: 'Standard', checkedby: 'Supv Alice', status: 'Compliant' };
      }),
  },
  "/facilities/inventory/approval": {
    ui: 5,
    title: "Approval Queue", description: "Workflow for Facility Head or Admin to approve high-value inventory requests.",
    stats: [{ label: "Items to Approve", color: "text-amber-400", value: "5" }, { label: "Total Value Pending", color: "text-blue-400", value: "$2,400" }, { label: "Avg Approval Time", color: "text-emerald-400", value: "4 Hrs" }],
    columns: [["Request ID", "requestid"], ["Department", "department"], ["Value", "value"], ["Requested Date", "requesteddate"], ["Budget Available", "budgetavailable"]],
    badge: ["Status", "status", {"Pending Approval":"amber","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { requestid: 'REQ-' + (4001 + i), department: 'Radiology', value: '$' + (500 + i * 100), requesteddate: 'Yesterday', budgetavailable: 'Yes', status: i < 2 ? 'Pending Approval' : 'Approved' };
      }),
  },
  "/facilities/inventory/consumable": {
    ui: 5,
    title: "Consumable Requests", description: "Requests for cleaning chemicals, mops, tissues, and stationery.",
    stats: [{ label: "Monthly Budget", color: "text-blue-400", value: "$5,000" }, { label: "Utilized YTD", color: "text-emerald-400", value: "$2,400" }, { label: "Low Stock Alerts", color: "text-amber-400", value: "3" }],
    columns: [["Request ID", "requestid"], ["Requested By", "requestedby"], ["Category", "category"], ["Items Count", "itemscount"], ["Total Value", "totalvalue"]],
    badge: ["Status", "status", {"Issued":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { requestid: 'CON-' + (2001 + i), requestedby: 'Housekeeping', category: 'Cleaning Supplies', itemscount: '15', totalvalue: '$120', status: 'Issued' };
      }),
  },
  "/facilities/inventory/department": {
    ui: 5,
    title: "Department Requests", description: "Wards requesting non-medical items (Furniture, IT hardware, dustbins).",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "12" }, { label: "Approved Today", color: "text-emerald-400", value: "5" }, { label: "Rejected", color: "text-red-400", value: "1" }],
    columns: [["Request ID", "requestid"], ["Department", "department"], ["Item Requested", "itemrequested"], ["Quantity", "quantity"], ["Justification", "justification"]],
    badge: ["Status", "status", {"Pending Approval":"amber","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { requestid: 'REQ-' + (1001 + i), department: 'OPD', itemrequested: 'Waiting Chairs', quantity: '10', justification: 'Expansion', status: i === 0 ? 'Pending Approval' : 'Approved' };
      }),
  },
  "/facilities/inventory/maintenance": {
    ui: 5,
    title: "Maintenance Materials", description: "Spares requested by engineers (Bulbs, wires, plumbing fittings) to close work orders.",
    stats: [{ label: "Open Indents", color: "text-amber-400", value: "8" }, { label: "Out of Stock items", color: "text-red-400", value: "2" }, { label: "Value Issued", color: "text-blue-400", value: "$450 (Today)" }],
    columns: [["Indent ID", "indentid"], ["Linked WO", "linkedwo"], ["Engineer", "engineer"], ["Spares Required", "sparesrequired"], ["Store Availability", "storeavailability"]],
    badge: ["Status", "status", {"Awaiting Purchase":"amber","Issued":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { indentid: 'IND-' + (3001 + i), linkedwo: 'WO-100' + i, engineer: 'Tech Bob', sparesrequired: 'LED Bulbs x 5', storeavailability: i === 0 ? 'Out of Stock' : 'Available', status: i === 0 ? 'Awaiting Purchase' : 'Issued' };
      }),
  },
  "/facilities/laundry/damaged": {
    ui: 5,
    title: "Damaged Linen", description: "Logging torn or irreparably stained linen for condemnation and write-off.",
    stats: [{ label: "Damaged (Mo)", color: "text-amber-400", value: "45 Pieces" }, { label: "Write-off Value", color: "text-red-400", value: "$250" }, { label: "Sent for Repair", color: "text-blue-400", value: "12" }],
    columns: [["Report ID", "reportid"], ["Linen Type", "linentype"], ["Reported By", "reportedby"], ["Damage Reason", "damagereason"], ["Action", "action"]],
    badge: ["Status", "status", {"Logged":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportid: 'DMG-' + (4001 + i), linentype: 'Patient Gown', reportedby: 'Laundry Staff', damagereason: 'Torn', action: i === 0 ? 'Condemned' : 'Sent for Stitching', status: 'Logged' };
      }),
  },
  "/facilities/laundry/inventory": {
    ui: 5,
    title: "Linen Inventory", description: "Tracking total hospital linen stock (Bed sheets, blankets, scrubs, gowns).",
    stats: [{ label: "Total Pieces", color: "text-blue-400", value: "15,000" }, { label: "Shortage Alerts", color: "text-red-400", value: "2" }, { label: "Annual Loss %", color: "text-amber-400", value: "3%" }],
    columns: [["Linen Type", "linentype"], ["Total Stock", "totalstock"], ["In Use (Wards)", "inusewards"], ["In Laundry", "inlaundry"], ["In Store", "instore"]],
    badge: ["Status", "status", {"Sufficient":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Bed Sheet - White', 'Patient Gown', 'Doctor Scrubs', 'Pillow Cover', 'Blanket'];
        return { linentype: types[i], totalstock: (2000 - i * 200).toString(), inusewards: (1000 - i * 100).toString(), inlaundry: (500 - i * 50).toString(), instore: (500 - i * 50).toString(), status: 'Sufficient' };
      }),
  },
  "/facilities/laundry/issue": {
    ui: 5,
    title: "Linen Issue", description: "Dispatching fresh linen from the central store to various wards and departments.",
    stats: [{ label: "Pieces Issued (Today)", color: "text-blue-400", value: "1,200" }, { label: "Requests Pending", color: "text-amber-400", value: "4" }, { label: "Top Requestor", color: "text-emerald-400", value: "ICU" }],
    columns: [["Transaction ID", "transactionid"], ["Department/Ward", "departmentward"], ["Linen Type", "linentype"], ["Qty Issued", "qtyissued"], ["Issued By", "issuedby"], ["Date", "date"]],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { transactionid: 'IS-' + (1001 + i), departmentward: 'Ward ' + (1 + i), linentype: 'Bed Sheets', qtyissued: (50 - i * 5).toString(), issuedby: 'Store Admin', date: 'Today 08:00' };
      }),
  },
  "/facilities/laundry/processing": {
    ui: 5,
    title: "Laundry Processing", description: "Tracking internal washing cycles or dispatch/receipt from external laundry vendors.",
    stats: [{ label: "Current Wash Load", color: "text-blue-400", value: "450 Kg" }, { label: "Vendor Turnaround", color: "text-emerald-400", value: "24 Hrs" }, { label: "Delayed Batches", color: "text-emerald-400", value: "0" }],
    columns: [["Batch ID", "batchid"], ["Vendor/Machine", "vendormachine"], ["Weight (Kg)", "weightkg"], ["Sent Time", "senttime"], ["Expected Return", "expectedreturn"]],
    badge: ["Status", "status", {"Processing":"amber","Returned":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { batchid: 'LDY-' + (3001 + i), vendor: 'Vendor A', weightkg: (100 - i * 10).toString(), senttime: 'Yesterday 18:00', expectedreturn: 'Today 14:00', status: i < 2 ? 'Processing' : 'Returned' };
      }),
  },
  "/facilities/laundry/reports": {
    ui: 5,
    title: "Laundry Reports", description: "Consumption, stock discrepancy, and cost per wash cycle reporting.",
    stats: [{ label: "Laundry Cost (Mo)", color: "text-blue-400", value: "$4,500" }, { label: "Avg Cost/Kg", color: "text-emerald-400", value: "$0.80" }, { label: "Overall Shortage", color: "text-emerald-400", value: "0.5%" }],
    columns: [["Report Name", "reportname"], ["Period", "period"], ["Total Wash Weight", "totalwashweight"], ["Cost Incurred", "costincurred"], ["Discrepancy %", "discrepancy"]],
    badge: ["Status", "status", {"Generated":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportname: 'Monthly Consumption', period: 'June 2026', totalwashweight: '5,400 Kg', costincurred: '$4,320', discrepancy: '0.5%', status: 'Generated' };
      }),
  },
  "/facilities/laundry/return": {
    ui: 5,
    title: "Linen Return", description: "Receiving soiled or infected linen from wards for washing.",
    stats: [{ label: "Pieces Returned (Today)", color: "text-amber-400", value: "1,150" }, { label: "Infected Linen (Red Bag)", color: "text-red-400", value: "45" }, { label: "Count Mismatch", color: "text-red-400", value: "2" }],
    columns: [["Return ID", "returnid"], ["From Ward", "fromward"], ["Linen Type", "linentype"], ["Condition", "condition"], ["Qty Received", "qtyreceived"], ["Date", "date"]],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { returnid: 'RT-' + (2001 + i), fromward: 'Ward ' + (1 + i), linentype: 'Mixed', condition: i === 0 ? 'Infected' : 'Soiled', qtyreceived: (45 - i * 5).toString(), date: 'Today 09:00' };
      }),
  },
  "/facilities/maintenance/amc": {
    ui: 5,
    title: "AMC Management", description: "Tracking Annual Maintenance Contracts for facility assets with external vendors.",
    stats: [{ label: "Active AMCs", color: "text-blue-400", value: "34" }, { label: "Expiring in 30D", color: "text-amber-400", value: "3" }, { label: "Total AMC Value", color: "text-emerald-400", value: "$120K" }],
    columns: [["Contract ID", "contractid"], ["Asset/Service", "assetservice"], ["Vendor", "vendor"], ["Start Date", "startdate"], ["Expiry Date", "expirydate"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const assets = ['Lift Maintenance', 'HVAC Service', 'Pest Control', 'Fire Systems', 'DG Set Service'];
        return { contractid: 'AMC-' + (5001 + i), assetservice: assets[i], vendor: 'Vendor ' + (1 + i), startdate: '01 Jan 2026', expirydate: '31 Dec 2026', status: 'Active' };
      }),
  },
  "/facilities/maintenance/breakdown": {
    ui: 5,
    title: "Breakdown Requests", description: "Emergency requests for unexpected equipment or facility failures (e.g., pipe burst).",
    stats: [{ label: "Active Breakdowns", color: "text-red-400", value: "3" }, { label: "MTTR", color: "text-emerald-400", value: "1.2 Hrs" }, { label: "Resolved Today", color: "text-blue-400", value: "5" }],
    columns: [["Ticket ID", "ticketid"], ["Reported By", "reportedby"], ["Location", "location"], ["Issue Description", "issuedescription"], ["Reported Time", "reportedtime"]],
    badge: ["Status", "status", {"New":"gray","Assigned":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { ticketid: 'BRK-' + (4001 + i), reportedby: 'Nurse Alice', location: 'Ward B', issuedescription: 'Power trip', reportedtime: '15 mins ago', status: i === 0 ? 'New' : 'Assigned' };
      }),
  },
  "/facilities/maintenance/corrective": {
    ui: 5,
    title: "Corrective Maintenance", description: "Tasks identified during preventive checks that require repair or part replacement.",
    stats: [{ label: "Active CM Jobs", color: "text-amber-400", value: "12" }, { label: "Awaiting Parts", color: "text-red-400", value: "4" }, { label: "Completed (Mo)", color: "text-emerald-400", value: "34" }],
    columns: [["CM Number", "cmnumber"], ["Linked PM", "linkedpm"], ["Asset Name", "assetname"], ["Defect Found", "defectfound"], ["Parts Required", "partsrequired"]],
    badge: ["Status", "status", {"Awaiting Spares":"amber","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { cmnumber: 'CM-' + (3001 + i), linkedpm: 'PM-200' + i, assetname: 'Water Pump', defectfound: 'Bearing Noise', partsrequired: 'Bearing Kit', status: i === 0 ? 'Awaiting Spares' : 'In Progress' };
      }),
  },
  "/facilities/maintenance/dashboard": {
    ui: 5,
    title: "Maintenance Dashboard", description: "Overview of all maintenance operations, open tickets, and engineer workload.",
    stats: [{ label: "Open Work Orders", color: "text-amber-400", value: "34" }, { label: "Avg Resolution Time", color: "text-emerald-400", value: "4.5 Hrs" }, { label: "SLA Breach", color: "text-red-400", value: "2" }],
    columns: [["Metric", "metric"], ["Value", "value"], ["Target", "target"], ["Variance", "variance"], ["Trend", "trend"]],
    badge: ["Status", "status", {"On Track":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['PM Completion Rate', 'Mean Time to Repair', 'Breakdown %', 'SLA Adherence', 'Cost vs Budget'];
        return { metric: metrics[i], value: '95%', target: '>90%', variance: '+5%', trend: 'Upward', status: 'On Track' };
      }),
  },
  "/facilities/maintenance/history": {
    ui: 5,
    title: "Service History", description: "Historical log of all maintenance activities per asset for lifecycle costing.",
    stats: [{ label: "Total Records", color: "text-blue-400", value: "12,500" }, { label: "Maint. Cost YTD", color: "text-amber-400", value: "$45,000" }, { label: "Most Repaired Asset", color: "text-red-400", value: "Lift 3" }],
    columns: [["Asset ID", "assetid"], ["Asset Name", "assetname"], ["Date of Service", "dateofservice"], ["WO/Ticket ID", "woticketid"], ["Cost Incurred", "costincurred"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { assetid: 'AST-L00' + (1 + i), assetname: 'Lift ' + (1 + i), dateofservice: '15 ' + ['Jun', 'Jul'][i % 2] + ' 2026', woticketid: 'WO-100' + i, costincurred: '$' + (150 + i * 50), status: 'Completed' };
      }),
  },
  "/facilities/maintenance/preventive": {
    ui: 5,
    title: "Preventive Maintenance", description: "Scheduled calendar for routine servicing of non-medical assets (HVAC, Lifts, DG Sets).",
    stats: [{ label: "PM Due This Week", color: "text-blue-400", value: "24" }, { label: "PM Completion %", color: "text-emerald-400", value: "98%" }, { label: "Overdue PM", color: "text-red-400", value: "2" }],
    columns: [["Schedule ID", "scheduleid"], ["Asset Category", "assetcategory"], ["Location", "location"], ["Last Serviced", "lastserviced"], ["Next Due", "nextdue"]],
    badge: ["Status", "status", {"Due Now":"amber","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const assets = ['Lift 1', 'Main HVAC', 'DG Set 500kVA', 'Water Pump 1', 'Fire Panel'];
        return { scheduleid: 'PM-' + (2001 + i), assetcategory: assets[i], location: 'Main Block', lastserviced: 'Last Month', nextdue: i === 0 ? 'Today' : 'Next Week', status: i === 0 ? 'Due Now' : 'Scheduled' };
      }),
  },
  "/facilities/maintenance/work-orders": {
    ui: 5,
    title: "Work Orders", description: "Central ticketing system for all reactive and preventive maintenance tasks.",
    stats: [{ label: "Total Open WO", color: "text-blue-400", value: "45" }, { label: "Critical WO", color: "text-red-400", value: "3" }, { label: "Completed (Today)", color: "text-emerald-400", value: "18" }],
    columns: [["WO Number", "wonumber"], ["Asset/Location", "assetlocation"], ["Issue Type", "issuetype"], ["Assigned To", "assignedto"], ["Priority", "priority"]],
    badge: ["Status", "status", {"Open":"amber","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { wonumber: 'WO-' + (1001 + i), assetlocation: 'AC Unit - Room 10' + i, issuetype: 'Cooling Issue', assignedto: 'Tech Bob', priority: i === 0 ? 'Critical' : 'Normal', status: i === 0 ? 'Open' : 'In Progress' };
      }),
  },
  "/facilities/management/buildings": {
    ui: 5,
    title: "Buildings", description: "Manage hospital buildings, wings, and structural assets.",
    stats: [{ label: "Total Buildings", color: "text-blue-400", value: "4" }, { label: "Total Area (SqFt)", color: "text-emerald-400", value: "120,000" }, { label: "Buildings Under Maint.", color: "text-amber-400", value: "1" }],
    columns: [["Building Code", "buildingcode"], ["Name", "name"], ["Total Floors", "totalfloors"], ["Square Footage", "squarefootage"], ["Primary Use", "primaryuse"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 4 }).map((_, i) => {
        const names = ['Main Hospital Block', 'OPD Wing', 'Admin Block', 'Research Center'];
        return { buildingcode: 'BLD-' + (100 + i), name: names[i], totalfloors: (4 + i).toString(), squarefootage: (30000 + i * 5000).toString(), primaryuse: i === 0 ? 'Clinical' : 'Support', status: 'Active' };
      }),
  },
  "/facilities/management/floors": {
    ui: 5,
    title: "Floors", description: "Detailed floor plan mapping and department allocation per floor.",
    stats: [{ label: "Total Floors", color: "text-blue-400", value: "18" }, { label: "Occupancy Rate", color: "text-emerald-400", value: "92%" }, { label: "Restricted Zones", color: "text-red-400", value: "4" }],
    columns: [["Building", "building"], ["Floor Level", "floorlevel"], ["Total Wards", "totalwards"], ["Key Departments", "keydepartments"], ["Fire Exits", "fireexits"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { building: 'Main Block', floorlevel: 'Level ' + (1 + i), totalwards: (2 + i).toString(), keydepartments: i === 0 ? 'Emergency, Radiology' : 'Cardiology', fireexits: '4', status: 'Active' };
      }),
  },
  "/facilities/management/inspections": {
    ui: 5,
    title: "Facility Inspections", description: "Routine checklists for civil, electrical, and plumbing checks across buildings.",
    stats: [{ label: "Inspections (Mo)", color: "text-blue-400", value: "45" }, { label: "Passed Checks", color: "text-emerald-400", value: "38" }, { label: "Open Issues", color: "text-red-400", value: "12" }],
    columns: [["Inspection ID", "inspectionid"], ["Area Checked", "areachecked"], ["Inspector", "inspector"], ["Date", "date"], ["Issues Found", "issuesfound"]],
    badge: ["Status", "status", {"Action Required":"amber","Pass":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { inspectionid: 'INSP-' + (2001 + i), areachecked: 'Level 1 Washrooms', inspector: 'John Doe', date: 'Yesterday', issuesfound: i === 0 ? 'Leaking Tap' : 'None', status: i === 0 ? 'Action Required' : 'Pass' };
      }),
  },
  "/facilities/management/requests": {
    ui: 5,
    title: "Facility Requests", description: "Requests for space allocation, furniture changes, or room modifications.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "15" }, { label: "Approved (Mo)", color: "text-emerald-400", value: "8" }, { label: "High Priority", color: "text-red-400", value: "2" }],
    columns: [["Request ID", "requestid"], ["Department", "department"], ["Request Type", "requesttype"], ["Priority", "priority"], ["Requested Date", "requesteddate"]],
    badge: ["Status", "status", {"Pending Approval":"amber","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { requestid: 'FR-' + (1001 + i), department: 'Cardiology', requesttype: 'Furniture Move', priority: i === 0 ? 'High' : 'Medium', requesteddate: 'Today', status: i < 2 ? 'Pending Approval' : 'In Progress' };
      }),
  },
  "/facilities/management/rooms": {
    ui: 5,
    title: "Rooms", description: "Individual room management (OPD Consults, Private IPD, OT).",
    stats: [{ label: "Total Rooms", color: "text-blue-400", value: "450" }, { label: "Rooms Under Maint", color: "text-red-400", value: "12" }, { label: "Clean Rooms Avail", color: "text-emerald-400", value: "45" }],
    columns: [["Room No", "roomno"], ["Type", "type"], ["Ward/Dept", "warddept"], ["Asset Count", "assetcount"], ["Last Deep Clean", "lastdeepclean"]],
    badge: ["Status", "status", {"Available":"emerald","Under Maintenance":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Consultation', 'Private IPD', 'OT', 'Store Room', 'Consultation'];
        return { roomno: 'RM-' + (201 + i), type: types[i], warddept: 'OPD', assetcount: (5 + i).toString(), lastdeepclean: 'Yesterday', status: i === 1 ? 'Under Maintenance' : 'Available' };
      }),
  },
  "/facilities/management/wards": {
    ui: 5,
    title: "Wards", description: "Ward level facility tracking including beds, nursing stations, and washrooms.",
    stats: [{ label: "Total Wards", color: "text-blue-400", value: "24" }, { label: "Beds Available", color: "text-emerald-400", value: "350" }, { label: "Wards Full", color: "text-amber-400", value: "3" }],
    columns: [["Ward ID", "wardid"], ["Ward Name", "wardname"], ["Floor", "floor"], ["Bed Capacity", "bedcapacity"], ["Current Occupancy", "currentoccupancy"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { wardid: 'WRD-' + (1001 + i), wardname: 'General Ward ' + (1 + i), floor: 'Level 2', bedcapacity: '20', currentoccupancy: (15 + i).toString(), status: 'Active' };
      }),
  },
  "/facilities/mortuary/admission": {
    ui: 5,
    title: "Body Admission", description: "Intake process, tagging, and assigning a cold storage unit.",
    stats: [{ label: "Admissions (Today)", color: "text-blue-400", value: "2" }, { label: "From IPD", color: "text-emerald-400", value: "1" }, { label: "Brought Dead (MLC)", color: "text-amber-400", value: "1" }],
    columns: [["Admission ID", "admissionid"], ["UHID (if IPD)", "uhidifipd"], ["Cause of Death", "causeofdeath"], ["Tagged By", "taggedby"], ["Handover Form", "handoverform"]],
    badge: ["Status", "status", {"Admitted":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { admissionid: 'ADM-' + (2001 + i), uhidifipd: i % 2 === 0 ? 'UHID-' + (10 + i) : 'N/A', causeofdeath: 'Cardiac Arrest', taggedby: 'Nurse Alice', handoverform: 'Signed', status: 'Admitted' };
      }),
  },
  "/facilities/mortuary/postmortem": {
    ui: 5,
    title: "Postmortem Register", description: "Tracking bodies requiring autopsy and coordination with forensic doctors.",
    stats: [{ label: "Pending PMs", color: "text-red-400", value: "1" }, { label: "Completed (Mo)", color: "text-blue-400", value: "12" }, { label: "Reports Dispatched", color: "text-emerald-400", value: "10" }],
    columns: [["PM ID", "pmid"], ["Deceased Name", "deceasedname"], ["Police Station", "policestation"], ["Assigned Doctor", "assigneddoctor"], ["Date/Time", "datetime"]],
    badge: ["Status", "status", {"Scheduled":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { pmid: 'PM-' + (4001 + i), deceasedname: 'Patient ' + (1 + i), policestation: 'City Center PS', assigneddoctor: 'Dr. Forensic', datetime: i === 0 ? 'Today 14:00' : 'Yesterday', status: i === 0 ? 'Scheduled' : 'Completed' };
      }),
  },
  "/facilities/mortuary/register": {
    ui: 5,
    title: "Mortuary Register", description: "Digital log book of all bodies kept in the mortuary.",
    stats: [{ label: "Current Bodies", color: "text-blue-400", value: "4" }, { label: "Capacity Total", color: "text-emerald-400", value: "12" }, { label: "Unidentified", color: "text-red-400", value: "1" }],
    columns: [["Entry ID", "entryid"], ["Deceased Name", "deceasedname"], ["Date of Death", "dateofdeath"], ["Brought By", "broughtby"], ["Cabinet No", "cabinetno"]],
    badge: ["Status", "status", {"Stored":"blue","Released":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { entryid: 'MRT-' + (1001 + i), deceasedname: i === 0 ? 'Unknown Male' : 'Patient ' + (1 + i), dateofdeath: 'Yesterday', broughtby: 'Ward / Police', cabinetno: 'C-' + (1 + i), status: i === 4 ? 'Released' : 'Stored' };
      }),
  },
  "/facilities/mortuary/release": {
    ui: 5,
    title: "Body Release", description: "Formal handover process to relatives or police with necessary documentation.",
    stats: [{ label: "Releases (Today)", color: "text-emerald-400", value: "3" }, { label: "Pending NOC", color: "text-amber-400", value: "1" }, { label: "Avg Storage Time", color: "text-blue-400", value: "24 Hrs" }],
    columns: [["Release ID", "releaseid"], ["Deceased Name", "deceasedname"], ["Released To", "releasedto"], ["Relation", "relation"], ["ID Proof", "idproof"]],
    badge: ["Status", "status", {"Pending Police Clearance":"amber","Released":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { releaseid: 'REL-' + (3001 + i), deceasedname: 'Patient ' + (1 + i), releasedto: 'John Doe', relation: 'Son', idproof: 'Verified', status: i === 0 ? 'Pending Police Clearance' : 'Released' };
      }),
  },
  "/facilities/mortuary/reports": {
    ui: 5,
    title: "Mortuary Reports", description: "Monthly summaries of admissions, medico-legal cases, and storage utility.",
    stats: [{ label: "Total Handled (YTD)", color: "text-blue-400", value: "145" }, { label: "MLC %", color: "text-amber-400", value: "30%" }, { label: "Audit Status", color: "text-emerald-400", value: "Pass" }],
    columns: [["Report Type", "reporttype"], ["Month", "month"], ["Total Admissions", "totaladmissions"], ["Total Releases", "totalreleases"], ["MLC Count", "mlccount"]],
    badge: ["Status", "status", {"Generated":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reporttype: 'Monthly Summary', month: ['June', 'May', 'April', 'March', 'Feb'][i] + ' 2026', totaladmissions: (20 + i).toString(), totalreleases: (19 + i).toString(), mlccount: (5 + i).toString(), status: 'Generated' };
      }),
  },
  "/facilities/mortuary/storage": {
    ui: 5,
    title: "Cold Storage Monitoring", description: "Monitoring temperature and maintenance of the mortuary cabinets.",
    stats: [{ label: "Total Cabinets", color: "text-blue-400", value: "12" }, { label: "Functional", color: "text-emerald-400", value: "11" }, { label: "Under Maintenance", color: "text-red-400", value: "1" }],
    columns: [["Cabinet No", "cabinetno"], ["Current Temp", "currenttemp"], ["Set Temp", "settemp"], ["Alarm Status", "alarmstatus"], ["Last Defrost", "lastdefrost"]],
    badge: ["Status", "status", {"Optimal":"emerald","Faulty":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { cabinetno: 'C-' + (1 + i), currenttemp: i === 4 ? '8°C' : '3°C', settemp: '3°C', alarmstatus: i === 4 ? 'Triggered' : 'Normal', lastdefrost: 'Last Week', status: i === 4 ? 'Faulty' : 'Optimal' };
      }),
  },
  "/facilities/reports/ambulance": {
    ui: 5,
    title: "Ambulance Report", description: "Trip distances, fuel efficiency, and revenue generated vs maintenance costs.",
    stats: [{ label: "Fleet Revenue (Mo)", color: "text-emerald-400", value: "$24,000" }, { label: "Running Cost", color: "text-red-400", value: "$8,500" }, { label: "Avg Response", color: "text-blue-400", value: "14 Mins" }],
    columns: [["Vehicle No", "vehicleno"], ["Trips", "trips"], ["Total Distance (Km)", "totaldistancekm"], ["Fuel Efficiency", "fuelefficiency"], ["Net Revenue", "netrevenue"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { vehicleno: 'MH12 AB ' + (1000 + i), trips: (45 - i * 5).toString(), totaldistancekm: (800 - i * 50).toString(), fuelefficiency: '9 km/l', netrevenue: '$' + (3000 - i * 200), status: 'Generated' };
      }),
  },
  "/facilities/reports/amc": {
    ui: 5,
    title: "AMC Report", description: "Upcoming renewals, vendor SLA adherence, and contract value summaries.",
    stats: [{ label: "Total AMC Spend", color: "text-blue-400", value: "$450,000" }, { label: "Avg SLA Score", color: "text-emerald-400", value: "92%" }, { label: "To Renew (Next 30D)", color: "text-amber-400", value: "4" }],
    columns: [["Vendor", "vendor"], ["Service", "service"], ["Contract Value", "contractvalue"], ["SLA Score", "slascore"], ["Renewal Recommendation", "renewalrecommendation"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { vendor: 'Vendor ' + (1 + i), service: 'HVAC', contractvalue: '$' + (15000 - i * 1000), slascore: (95 - i) + '%', renewalrecommendation: i === 0 ? 'Review Required' : 'Renew', status: 'Generated' };
      }),
  },
  "/facilities/reports/housekeeping": {
    ui: 5,
    title: "Housekeeping Report", description: "Cleaning compliance, consumable usage, and infection control correlations.",
    stats: [{ label: "Overall Compliance", color: "text-emerald-400", value: "98%" }, { label: "Chemicals Cost", color: "text-blue-400", value: "$2,400" }, { label: "Staff Absenteeism", color: "text-amber-400", value: "4%" }],
    columns: [["Zone", "zone"], ["Schedules Met", "schedulesmet"], ["Missed", "missed"], ["Consumables Cost", "consumablescost"], ["Infection Incidents", "infectionincidents"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { zone: 'ICU Block', schedulesmet: '120', missed: i === 0 ? '2' : '0', consumablescost: '$450', infectionincidents: '0', status: 'Generated' };
      }),
  },
  "/facilities/reports/laundry": {
    ui: 5,
    title: "Laundry Report", description: "Linen loss percentages, wash cycles per item, and vendor billing.",
    stats: [{ label: "Total Wash (Mo)", color: "text-blue-400", value: "14,500 Kg" }, { label: "Overall Loss Rate", color: "text-emerald-400", value: "1.2%" }, { label: "Vendor Payout", color: "text-amber-400", value: "$12,500" }],
    columns: [["Linen Type", "linentype"], ["Total Washed (Kg)", "totalwashedkg"], ["Torn/Condemned", "torncondemned"], ["Loss %", "loss"], ["Vendor Bill", "vendorbill"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { linentype: 'Bed Sheets', totalwashedkg: '4,500', torncondemned: (20 - i).toString(), loss: '1.5%', vendorbill: '$3,400', status: 'Generated' };
      }),
  },
  "/facilities/reports/maintenance": {
    ui: 5,
    title: "Maintenance Report", description: "MTTR, PM completion rates, and breakdown frequency analysis.",
    stats: [{ label: "Total Cost YTD", color: "text-blue-400", value: "$45,000" }, { label: "SLA Adherence", color: "text-emerald-400", value: "92%" }, { label: "Backlog WOs", color: "text-amber-400", value: "15" }],
    columns: [["Report Type", "reporttype"], ["Period", "period"], ["Total WOs", "totalwos"], ["Avg Resolution Time", "avgresolutiontime"], ["Cost Incurred", "costincurred"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reporttype: 'Monthly Summary', period: 'June 2026', totalwos: (300 - i * 20).toString(), avgresolutiontime: '4.5 Hrs', costincurred: '$' + (5000 - i * 500), status: 'Generated' };
      }),
  },
  "/facilities/reports/mortuary": {
    ui: 5,
    title: "Mortuary Report", description: "Utilization of cold cabinets, autopsy counts, and average storage durations.",
    stats: [{ label: "Utilization %", color: "text-blue-400", value: "45%" }, { label: "Total Handled", color: "text-emerald-400", value: "120" }, { label: "Longest Stored", color: "text-amber-400", value: "14 Days" }],
    columns: [["Month", "month"], ["Admissions", "admissions"], ["Releases", "releases"], ["MLC Cases", "mlccases"], ["Avg Storage Time", "avgstoragetime"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { month: ['June', 'May', 'April', 'March', 'Feb'][i] + ' 2026', admissions: (20 - i).toString(), releases: (19 - i).toString(), mlccases: (5 - i).toString(), avgstoragetime: '24 Hrs', status: 'Generated' };
      }),
  },
  "/facilities/reports/security": {
    ui: 5,
    title: "Security Report", description: "Incident summaries, visitor volumes, and guard attendance metrics.",
    stats: [{ label: "Total Visitors (Mo)", color: "text-blue-400", value: "12,450" }, { label: "Security Incidents", color: "text-emerald-400", value: "4" }, { label: "Guard Shortage", color: "text-amber-400", value: "2 Shifts" }],
    columns: [["Metric", "metric"], ["Total Count", "totalcount"], ["Daily Average", "dailyaverage"], ["Exceptions/Breaches", "exceptionsbreaches"], ["Action Taken", "actiontaken"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { metric: 'Visitor Passes Issued', totalcount: '12,450', dailyaverage: '415', exceptionsbreaches: '12 Overstays', actiontaken: 'Warnings Issued', status: 'Generated' };
      }),
  },
  "/facilities/reports/utility": {
    ui: 5,
    title: "Utility Report", description: "Electricity and water consumption trends vs budget.",
    stats: [{ label: "Power Cost (Mo)", color: "text-red-400", value: "$34,000" }, { label: "Water Cost (Mo)", color: "text-blue-400", value: "$4,500" }, { label: "Green Energy %", color: "text-emerald-400", value: "15%" }],
    columns: [["Utility Type", "utilitytype"], ["Consumption", "consumption"], ["Peak Usage Time", "peakusagetime"], ["Cost", "cost"], ["Variance vs Budget", "variancevsbudget"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { utilitytype: i === 0 ? 'Electricity' : 'Water', consumption: i === 0 ? '350,000 kWh' : '1.5M Ltrs', peakusagetime: '14:00 - 16:00', cost: i === 0 ? '$34,000' : '$4,500', variancevsbudget: '+2%', status: 'Generated' };
      }),
  },
  "/facilities/reports/waste": {
    ui: 5,
    title: "Waste Report", description: "Biomedical waste generation per department and disposal compliance.",
    stats: [{ label: "Total Bio-Waste", color: "text-blue-400", value: "4,500 Kg" }, { label: "Disposal Cost", color: "text-amber-400", value: "$2,800" }, { label: "Segregation Errors", color: "text-red-400", value: "5" }],
    columns: [["Department", "department"], ["Yellow (Kg)", "yellowkg"], ["Red (Kg)", "redkg"], ["Blue/White (Kg)", "bluewhitekg"], ["Compliance Score", "compliancescore"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { department: 'OT Block', yellowkg: '450', redkg: '300', bluewhitekg: '50', compliancescore: '98%', status: 'Generated' };
      }),
  },
  "/facilities/security/dashboard": {
    ui: 5,
    title: "Security Dashboard", description: "Overview of security personnel deployment, incidents, and access control.",
    stats: [{ label: "Active Guards", color: "text-blue-400", value: "45" }, { label: "Current Visitors", color: "text-emerald-400", value: "120" }, { label: "Security Alerts", color: "text-green-500", value: "0" }],
    columns: [["Metric", "metric"], ["Value", "value"], ["Target", "target"], ["Variance", "variance"], ["Trend", "trend"]],
    badge: ["Status", "status", {"Normal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['Staff Attendance', 'Visitor Count', 'Vehicle Entries', 'Incident Reports', 'CCTV Uptime'];
        return { metric: metrics[i], value: '98%', target: '100%', variance: '-2%', trend: 'Stable', status: 'Normal' };
      }),
  },
  "/facilities/security/gatepass": {
    ui: 5,
    title: "Gate Pass (Material)", description: "Returnable and non-returnable gate passes for material entering/leaving premises.",
    stats: [{ label: "Active Passes", color: "text-blue-400", value: "15" }, { label: "Pending Return", color: "text-amber-400", value: "3" }, { label: "Outward Movement", color: "text-emerald-400", value: "45 (Today)" }],
    columns: [["Gate Pass No", "gatepassno"], ["Type", "type"], ["Vendor/Person", "vendorperson"], ["Items Description", "itemsdescription"], ["Authorized By", "authorizedby"]],
    badge: ["Status", "status", {"Pending Return":"amber","Closed":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { gatepassno: 'GP-' + (2001 + i), type: i % 2 === 0 ? 'Returnable' : 'Non-Returnable', vendorperson: 'Vendor A', itemsdescription: 'IT Equipment Repair', authorizedby: 'IT Head', status: i === 0 ? 'Pending Return' : 'Closed' };
      }),
  },
  "/facilities/security/incident": {
    ui: 5,
    title: "Incident Reports", description: "Logs of thefts, affrays, unauthorized access, or safety breaches.",
    stats: [{ label: "Incidents (Mo)", color: "text-amber-400", value: "4" }, { label: "Police Cases (FIR)", color: "text-emerald-400", value: "0" }, { label: "Resolved", color: "text-blue-400", value: "3" }],
    columns: [["Incident ID", "incidentid"], ["Category", "category"], ["Location", "location"], ["Reported By", "reportedby"], ["Date/Time", "datetime"]],
    badge: ["Status", "status", {"Under Investigation":"amber","Resolved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { incidentid: 'INC-' + (3001 + i), category: i === 0 ? 'Theft' : 'Argument', location: 'OPD Waiting', reportedby: 'Guard Bob', datetime: 'Yesterday 14:00', status: i === 0 ? 'Under Investigation' : 'Resolved' };
      }),
  },
  "/facilities/security/lost": {
    ui: 5,
    title: "Lost & Found", description: "Security log of items found on premises and handover records.",
    stats: [{ label: "Items Found (Mo)", color: "text-blue-400", value: "18" }, { label: "Claimed", color: "text-emerald-400", value: "12" }, { label: "In Custody", color: "text-amber-400", value: "6" }],
    columns: [["Item ID", "itemid"], ["Description", "description"], ["Found By", "foundby"], ["Location Found", "locationfound"], ["Handed To", "handedto"]],
    badge: ["Status", "status", {"In Safe":"amber","Returned":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemid: 'LF-' + (5001 + i), description: 'Mobile Phone', foundby: 'HK Staff', locationfound: 'Washroom 2', handedto: i === 0 ? '-' : 'Owner', status: i === 0 ? 'In Safe' : 'Returned' };
      }),
  },
  "/facilities/security/staff": {
    ui: 5,
    title: "Security Staff", description: "Roster, shifts, and post deployment (e.g., Main Gate, ER Entrance) of security guards.",
    stats: [{ label: "Total Strength", color: "text-blue-400", value: "65" }, { label: "On Duty", color: "text-emerald-400", value: "22" }, { label: "Reliever Available", color: "text-emerald-400", value: "4" }],
    columns: [["Guard Name", "guardname"], ["ID", "id"], ["Agency", "agency"], ["Current Post", "currentpost"], ["Shift", "shift"]],
    badge: ["Status", "status", {"On Duty":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const posts = ['Main Gate', 'ER Entrance', 'ICU Lobby', 'Parking', 'Patrol'];
        return { guardname: 'Guard ' + (1 + i), id: 'SEC-' + (101 + i), agency: 'SecureForce', currentpost: posts[i], shift: 'Morning', status: 'On Duty' };
      }),
  },
  "/facilities/security/visitor": {
    ui: 5,
    title: "Visitor Verification", description: "Logging visitors, issuing passes, and enforcing visiting hour rules.",
    stats: [{ label: "Passes Issued (Today)", color: "text-blue-400", value: "340" }, { label: "Overstaying Visitors", color: "text-red-400", value: "12" }, { label: "Banned Persons", color: "text-amber-400", value: "5" }],
    columns: [["Pass ID", "passid"], ["Visitor Name", "visitorname"], ["Patient Visited", "patientvisited"], ["Ward/Bed", "wardbed"], ["In Time", "intime"]],
    badge: ["Status", "status", {"Overstaying":"amber","Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { passid: 'VIS-' + (1001 + i), visitorname: 'John Doe ' + i, patientvisited: 'Patient ' + i, wardbed: 'Ward A Bed ' + i, intime: '10:00 AM', status: i === 0 ? 'Overstaying' : 'Active' };
      }),
  },
  "/facilities/settings/amc": {
    ui: 5,
    title: "AMC Settings", description: "Alert configurations (30/60/90 days) for contract renewals and vendor blacklisting rules.",
    stats: [{ label: "Active Rules", color: "text-blue-400", value: "8" }, { label: "Alerts Triggered", color: "text-amber-400", value: "15 (Mo)" }, { label: "Vendor Portal", color: "text-emerald-400", value: "Enabled" }],
    columns: [["Rule Name", "rulename"], ["Trigger Condition", "triggercondition"], ["Action", "action"], ["Notified Roles", "notifiedroles"], ["Escalation", "escalation"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { rulename: 'Expiry Alert', triggercondition: '30 Days to Expiry', action: 'Send Email', notifiedroles: 'Facility Head', escalation: 'Admin Dir (15D)', status: 'Active' };
      }),
  },
  "/facilities/settings/categories": {
    ui: 5,
    title: "Maintenance Categories", description: "Defining asset classes (e.g., Electrical, HVAC, Plumbing) for ticketing routing.",
    stats: [{ label: "Total Categories", color: "text-blue-400", value: "12" }, { label: "Active Routes", color: "text-emerald-400", value: "45" }, { label: "SLA Definitions", color: "text-emerald-400", value: "100%" }],
    columns: [["Category Name", "categoryname"], ["Sub-categories", "subcategories"], ["Default SLA", "defaultsla"], ["Assigned Supervisor", "assignedsupervisor"], ["Auto-Escalation", "autoescalation"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['Electrical', 'Plumbing', 'HVAC', 'Carpentry', 'Civil'];
        return { categoryname: cats[i], subcategories: (5 + i).toString(), defaultsla: '4 Hrs', assignedsupervisor: 'Eng Bob', autoescalation: 'Yes (12 Hrs)', status: 'Active' };
      }),
  },
  "/facilities/settings/facility": {
    ui: 5,
    title: "Facility Settings", description: "Configuration of hospital locations, buildings, and master spatial data.",
    stats: [{ label: "Total Locations", color: "text-blue-400", value: "2" }, { label: "Mapped Areas", color: "text-emerald-400", value: "100%" }, { label: "Pending Approval", color: "text-green-500", value: "0" }],
    columns: [["Configuration Item", "configurationitem"], ["Value", "value"], ["Last Updated By", "lastupdatedby"], ["Date", "date"], ["Impact Area", "impactarea"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { configurationitem: 'Add New Wing', value: 'North Wing', lastupdatedby: 'Admin Bob', date: 'Yesterday', impactarea: 'Space Allocation', status: 'Active' };
      }),
  },
  "/facilities/settings/preferences": {
    ui: 5,
    title: "Preferences", description: "General settings for shifts, automated report generation, and dashboard defaults.",
    stats: [{ label: "Global Settings", color: "text-blue-400", value: "24" }, { label: "Custom Dashboards", color: "text-emerald-400", value: "5" }, { label: "Notification Channels", color: "text-blue-400", value: "Email, SMS, App" }],
    columns: [["Preference Name", "preferencename"], ["Setting Value", "settingvalue"], ["Scope", "scope"], ["Last Modified", "lastmodified"], ["Modified By", "modifiedby"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { preferencename: 'Default Shift Time', settingvalue: '08:00 to 16:00', scope: 'Housekeeping', lastmodified: 'Jan 2026', modifiedby: 'System Admin', status: 'Active' };
      }),
  },
  "/facilities/transport/driver": {
    ui: 5,
    title: "Driver Management", description: "Roster and compliance tracking for transport drivers.",
    stats: [{ label: "Total Drivers", color: "text-blue-400", value: "12" }, { label: "On Leave", color: "text-amber-400", value: "1" }, { label: "Accident Free Days", color: "text-emerald-400", value: "340" }],
    columns: [["Driver Name", "drivername"], ["License Type", "licensetype"], ["Assigned Vehicle", "assignedvehicle"], ["Shift", "shift"], ["Overtime Hrs", "overtimehrs"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { drivername: 'Driver ' + (1 + i), licensetype: 'Heavy Vehicle', assignedvehicle: 'Staff Bus 1', shift: 'Night Shift', overtimehrs: (2 + i).toString(), status: 'Active' };
      }),
  },
  "/facilities/transport/fuel": {
    ui: 5,
    title: "Fuel Log", description: "Tracking fuel consumption, issuing fuel cards, and checking mileage efficiency.",
    stats: [{ label: "Fuel Cost (Mo)", color: "text-blue-400", value: "$3,400" }, { label: "Avg Mileage", color: "text-emerald-400", value: "8 km/l" }, { label: "Anomalies Detected", color: "text-green-500", value: "0" }],
    columns: [["Date", "date"], ["Vehicle", "vehicle"], ["Driver", "driver"], ["Fuel Added (Ltrs)", "fueladdedltrs"], ["Cost", "cost"]],
    badge: ["Status", "status", {"Verified":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { date: 'Yesterday', vehicle: 'Supply Van', driver: 'Driver Bob', fueladdedltrs: '45', cost: '$40', status: 'Verified' };
      }),
  },
  "/facilities/transport/maintenance": {
    ui: 5,
    title: "Vehicle Maintenance", description: "Tracking periodic servicing, tire replacements, and PUC renewals.",
    stats: [{ label: "Maintenance Cost YTD", color: "text-amber-400", value: "$8,500" }, { label: "PUC Compliance", color: "text-emerald-400", value: "100%" }, { label: "Insurance Renewals", color: "text-blue-400", value: "2 (This Month)" }],
    columns: [["Vehicle", "vehicle"], ["Maintenance Type", "maintenancetype"], ["Workshop", "workshop"], ["Cost", "cost"], ["Next Due Date", "nextduedate"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { vehicle: 'Staff Bus 2', maintenancetype: 'Oil Change', workshop: 'Authorized Center', cost: '$150', nextduedate: 'Oct 2026', status: 'Completed' };
      }),
  },
  "/facilities/transport/requests": {
    ui: 5,
    title: "Transport Requests", description: "Internal requests for transport (e.g., dropping samples to a lab, picking up a visiting doctor).",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "3" }, { label: "Completed Today", color: "text-emerald-400", value: "12" }, { label: "Rejected", color: "text-red-400", value: "1" }],
    columns: [["Request ID", "requestid"], ["Department", "department"], ["Purpose", "purpose"], ["Date/Time", "datetime"], ["Assigned Vehicle", "assignedvehicle"]],
    badge: ["Status", "status", {"Pending Approval":"amber","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { requestid: 'TREQ-' + (1001 + i), department: 'Pathology', purpose: 'Sample Drop', datetime: 'Today 14:00', assignedvehicle: i === 0 ? '-' : 'Supply Van', status: i === 0 ? 'Pending Approval' : 'Approved' };
      }),
  },
  "/facilities/transport/vehicle": {
    ui: 5,
    title: "Vehicle Management", description: "Managing non-ambulance fleet (Staff buses, supply vans, VIP cars).",
    stats: [{ label: "Total Vehicles", color: "text-blue-400", value: "8" }, { label: "Active on Route", color: "text-emerald-400", value: "4" }, { label: "Due for Service", color: "text-amber-400", value: "1" }],
    columns: [["Vehicle Reg", "vehiclereg"], ["Type", "type"], ["Capacity", "capacity"], ["Allocated To", "allocatedto"], ["Next Servicing", "nextservicing"]],
    badge: ["Status", "status", {"Active":"emerald","Maintenance Due":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Staff Bus', 'Supply Van', 'Pharmacy Van', 'VIP Car', 'Staff Bus'];
        return { vehiclereg: 'MH12 XY ' + (2000 + i), type: types[i], capacity: types[i] === 'Staff Bus' ? '40' : '2', allocatedto: 'HR / Admin', nextservicing: i === 1 ? 'Next Week' : 'In 3 Months', status: i === 1 ? 'Maintenance Due' : 'Active' };
      }),
  },
  "/facilities/utilities/electricity": {
    ui: 5,
    title: "Electricity Monitoring", description: "Tracking main grid consumption, power factor, and department sub-metering.",
    stats: [{ label: "Total Power (Today)", color: "text-blue-400", value: "12,400 kWh" }, { label: "Est. Cost", color: "text-amber-400", value: "$1,240" }, { label: "Power Factor", color: "text-emerald-400", value: "0.98" }],
    columns: [["Meter Location", "meterlocation"], ["Current Reading", "currentreading"], ["Consumption (kWh)", "consumptionkwh"], ["Power Factor", "powerfactor"], ["Cost Estimated", "costestimated"]],
    badge: ["Status", "status", {"Normal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { meterlocation: 'Main Incomer', currentreading: (150000 + i * 1000).toString(), consumptionkwh: (1200 + i * 50).toString(), powerfactor: '0.98', costestimated: '$120', status: 'Normal' };
      }),
  },
  "/facilities/utilities/gas": {
    ui: 5,
    title: "Medical Gas Pipeline", description: "Monitoring vacuum (suction), nitrous oxide, and compressed air pipelines across wards.",
    stats: [{ label: "All Lines Pressure", color: "text-emerald-400", value: "Nominal" }, { label: "Vacuum Pumps", color: "text-blue-400", value: "Active" }, { label: "Leak Alerts", color: "text-green-500", value: "0" }],
    columns: [["Gas Type", "gastype"], ["Manifold Location", "manifoldlocation"], ["Line Pressure", "linepressure"], ["Alarm Status", "alarmstatus"], ["Last Leak Check", "lastleakcheck"]],
    badge: ["Status", "status", {"Operational":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const gases = ['Oxygen', 'Nitrous Oxide', 'Medical Air', 'Vacuum', 'Instrument Air'];
        return { gastype: gases[i], manifoldlocation: 'Plant Room 1', linepressure: '4.2 Bar', alarmstatus: 'Normal', lastleakcheck: 'Yesterday', status: 'Operational' };
      }),
  },
  "/facilities/utilities/generator": {
    ui: 5,
    title: "Generator Monitoring", description: "Diesel Generator (DG) set health, fuel levels, and auto-start logs during power failures.",
    stats: [{ label: "Total DG Capacity", color: "text-blue-400", value: "1500 kVA" }, { label: "Fuel Stock", color: "text-emerald-400", value: "1200 Ltrs" }, { label: "Last Auto-Sync", color: "text-emerald-400", value: "Success" }],
    columns: [["DG Set ID", "dgsetid"], ["Capacity", "capacity"], ["Fuel Level", "fuellevel"], ["Running Hrs", "runninghrs"], ["Battery Health", "batteryhealth"]],
    badge: ["Status", "status", {"Standby":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { dgsetid: 'DG-' + (1 + i), capacity: '500 kVA', fuellevel: (85 - i * 5) + '%', runninghrs: (120 + i * 10).toString(), batteryhealth: 'Good', status: 'Standby' };
      }),
  },
  "/facilities/utilities/hvac": {
    ui: 5,
    title: "HVAC Monitoring", description: "Central air conditioning control, OT temperature/humidity monitoring, and chiller plant status.",
    stats: [{ label: "Chiller Load", color: "text-blue-400", value: "65%" }, { label: "OT Compliance (Temp)", color: "text-emerald-400", value: "100%" }, { label: "Filter Cleaning Due", color: "text-amber-400", value: "2 AHUs" }],
    columns: [["Chiller/AHU Unit", "chillerahuunit"], ["Location Served", "locationserved"], ["Set Temp", "settemp"], ["Actual Temp", "actualtemp"], ["Humidity", "humidity"]],
    badge: ["Status", "status", {"Running":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { chillerahuunit: 'AHU ' + (1 + i), locationserved: i === 0 ? 'Main OT' : 'ICU', settemp: '20°C', actualtemp: '20.5°C', humidity: '55%', status: 'Running' };
      }),
  },
  "/facilities/utilities/oxygen": {
    ui: 5,
    title: "Oxygen Supply (LMO)", description: "Critical monitoring of Liquid Medical Oxygen tank levels and manifold pressure.",
    stats: [{ label: "LMO Level", color: "text-blue-400", value: "65%" }, { label: "Days Remaining", color: "text-amber-400", value: "4 Days" }, { label: "Cylinder Backup", color: "text-emerald-400", value: "100% Full" }],
    columns: [["Tank/Manifold", "tankmanifold"], ["Capacity", "capacity"], ["Current Level", "currentlevel"], ["Pressure (Bar)", "pressurebar"], ["Est. Run Time", "estruntime"]],
    badge: ["Status", "status", {"Normal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { tankmanifold: i === 0 ? 'Main LMO Tank' : 'Backup Manifold', capacity: i === 0 ? '10KL' : '20 Cylinders', currentlevel: i === 0 ? '65%' : '100%', pressurebar: '4.5 Bar', estruntime: i === 0 ? '4 Days' : '-', status: 'Normal' };
      }),
  },
  "/facilities/utilities/water": {
    ui: 5,
    title: "Water Monitoring", description: "Tracking municipal intake, borewell usage, and STP (Sewage Treatment Plant) output.",
    stats: [{ label: "Total Storage", color: "text-blue-400", value: "50,000 L" }, { label: "Current Level", color: "text-emerald-400", value: "85%" }, { label: "STP Operational", color: "text-emerald-400", value: "Yes" }],
    columns: [["Source/Meter", "sourcemeter"], ["Intake (Ltrs)", "intakeltrs"], ["Level (%)", "level"], ["Quality Check (pH)", "qualitycheckph"], ["Pump Status", "pumpstatus"]],
    badge: ["Status", "status", {"Normal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const sources = ['Main Overhead Tank', 'Underground Sump', 'Borewell 1', 'STP Output', 'RO Plant'];
        return { sourcemeter: sources[i], intakeltrs: (5000 + i * 1000).toString(), level: (80 + i * 2) + '%', qualitycheckph: '7.2', pumpstatus: 'Auto', status: 'Normal' };
      }),
  },
  "/facilities/vendors/directory": {
    ui: 5,
    title: "Vendor Directory", description: "Central registry of all facility and maintenance vendors.",
    stats: [{ label: "Total Vendors", color: "text-blue-400", value: "45" }, { label: "Active Contracts", color: "text-emerald-400", value: "32" }, { label: "Blacklisted", color: "text-red-400", value: "2" }],
    columns: [["Vendor ID", "vendorid"], ["Company Name", "companyname"], ["Service Category", "servicecategory"], ["Contact Person", "contactperson"], ["Rating", "rating"]],
    badge: ["Status", "status", {"Active":"emerald","Blacklisted":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['HVAC Maintenance', 'Bio-waste Disposal', 'Laundry Services', 'Security Agency', 'Elevator AMC'];
        return { vendorid: 'VEN-' + (1001 + i), companyname: 'Company ' + (1 + i), servicecategory: cats[i], contactperson: 'John Doe', rating: (4.5 - i * 0.2).toFixed(1) + '/5', status: i === 4 ? 'Blacklisted' : 'Active' };
      }),
  },
  "/facilities/vendors/performance": {
    ui: 5,
    title: "Vendor Performance", description: "SLA tracking and penalty calculation for underperforming vendors.",
    stats: [{ label: "Avg SLA Compliance", color: "text-emerald-400", value: "92%" }, { label: "Penalties (YTD)", color: "text-red-400", value: "$4,500" }, { label: "Top Vendor", color: "text-blue-400", value: "SecureForce" }],
    columns: [["Vendor", "vendor"], ["Service", "service"], ["SLA Target", "slatarget"], ["Actual Performance", "actualperformance"], ["Penalties Levied", "penaltieslevied"]],
    badge: ["Status", "status", {"Warning Issued":"amber","Compliant":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { vendor: 'Vendor ' + (1 + i), service: 'Security', slatarget: '99%', actualperformance: (98 - i) + '%', penaltieslevied: i === 0 ? '$500' : '-', status: i === 0 ? 'Warning Issued' : 'Compliant' };
      }),
  },
  "/facilities/vendors/providers": {
    ui: 5,
    title: "Service Providers", description: "On-call or rate-contract providers for ad-hoc civil or electrical work.",
    stats: [{ label: "Active Providers", color: "text-blue-400", value: "15" }, { label: "Jobs Assigned", color: "text-emerald-400", value: "45 (Mo)" }, { label: "Avg Response", color: "text-emerald-400", value: "4 Hrs" }],
    columns: [["Provider Name", "providername"], ["Trade/Skill", "tradeskill"], ["Rate Card", "ratecard"], ["Jobs Done (YTD)", "jobsdoneytd"], ["Quality Score", "qualityscore"]],
    badge: ["Status", "status", {"Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { providername: 'Plumbing Pros ' + i, tradeskill: 'Plumbing', ratecard: 'Standard', jobsdoneytd: (20 - i * 2).toString(), qualityscore: '95%', status: 'Approved' };
      }),
  },
  "/facilities/vendors/renewal": {
    ui: 5,
    title: "Contract Renewal", description: "Workflow for evaluating vendor performance before renewing annual contracts.",
    stats: [{ label: "Pending Renewals", color: "text-amber-400", value: "5" }, { label: "Avg Increment", color: "text-blue-400", value: "5%" }, { label: "Rejected Renewals", color: "text-red-400", value: "1" }],
    columns: [["Contract ID", "contractid"], ["Vendor", "vendor"], ["Current Value", "currentvalue"], ["Proposed Value", "proposedvalue"], ["HOD Approval", "hodapproval"]],
    badge: ["Status", "status", {"Under Review":"amber","Renewed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { contractid: 'CTR-' + (3001 + i), vendor: 'Vendor ' + (1 + i), currentvalue: '$10,000', proposedvalue: '$10,500', hodapproval: i === 0 ? 'Pending' : 'Approved', status: i === 0 ? 'Under Review' : 'Renewed' };
      }),
  },
  "/facilities/waste/biomedical": {
    ui: 5,
    title: "Biomedical Waste", description: "Tracking the generation and weighing of biomedical waste (Red, Yellow, Blue bins).",
    stats: [{ label: "Waste Gen Today", color: "text-blue-400", value: "450 Kg" }, { label: "Yellow Bag Weight", color: "text-amber-400", value: "200 Kg" }, { label: "Red Bag Weight", color: "text-red-400", value: "150 Kg" }],
    columns: [["Log ID", "logid"], ["Department", "department"], ["Waste Category", "wastecategory"], ["Weight (Kg)", "weightkg"], ["Date/Time", "datetime"]],
    badge: ["Status", "status", {"Logged":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['Yellow (Infected)', 'Red (Plastics)', 'Blue (Glass)', 'White (Sharps)', 'Yellow (Infected)'];
        return { logid: 'BMW-' + (1001 + i), department: 'ICU', wastecategory: cats[i], weightkg: (10 + i * 2).toString(), datetime: 'Today 10:00', status: 'Logged' };
      }),
  },
  "/facilities/waste/collection": {
    ui: 5,
    title: "Waste Collection", description: "Logging the internal collection route by housekeeping from wards to central storage.",
    stats: [{ label: "Routes Completed", color: "text-emerald-400", value: "12/12" }, { label: "Pending Routes", color: "text-green-500", value: "0" }, { label: "Total Bags", color: "text-blue-400", value: "85" }],
    columns: [["Route ID", "routeid"], ["Floor/Wing", "floorwing"], ["Collected By", "collectedby"], ["Bags Count", "bagscount"], ["Time", "time"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { routeid: 'WC-' + (2001 + i), floorwing: 'Level ' + (1 + i), collectedby: 'HK Staff ' + i, bagscount: (15 + i).toString(), time: '09:00 AM', status: 'Completed' };
      }),
  },
  "/facilities/waste/compliance": {
    ui: 5,
    title: "Compliance Reports", description: "Statutory reports required by Pollution Control Boards regarding waste generation.",
    stats: [{ label: "Regulatory Compliance", color: "text-emerald-400", value: "100%" }, { label: "Last Filed", color: "text-blue-400", value: "June 2026" }, { label: "Next Due", color: "text-amber-400", value: "15 Aug 2026" }],
    columns: [["Report Type", "reporttype"], ["Filing Period", "filingperiod"], ["Generated By", "generatedby"], ["Filing Date", "filingdate"], ["Acknowledgement No", "acknowledgementno"]],
    badge: ["Status", "status", {"Filed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reporttype: 'Annual BMW Return', filingperiod: 'FY 25-26', generatedby: 'Facility Head', filingdate: '10 Apr 2026', acknowledgementno: 'ACK-9876' + i, status: 'Filed' };
      }),
  },
  "/facilities/waste/disposal": {
    ui: 5,
    title: "Waste Disposal", description: "Final manifest and tracking of waste handed over to the external authorized vendor.",
    stats: [{ label: "Vendor Pickups (Mo)", color: "text-blue-400", value: "30" }, { label: "Total Disposed", color: "text-amber-400", value: "14,500 Kg" }, { label: "Disposal Cost", color: "text-red-400", value: "$2,400" }],
    columns: [["Manifest No", "manifestno"], ["Vehicle Reg", "vehiclereg"], ["Total Weight (Kg)", "totalweightkg"], ["Authorized Sign", "authorizedsign"], ["Date", "date"]],
    badge: ["Status", "status", {"Dispatched":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { manifestno: 'MF-' + (4001 + i), vehiclereg: 'MH12 XX 9876', totalweightkg: (400 + i * 10).toString(), authorizedsign: 'Admin Head', date: 'Yesterday', status: 'Dispatched' };
      }),
  },
  "/facilities/waste/segregation": {
    ui: 5,
    title: "Waste Segregation", description: "Auditing and reporting any improper mixing of waste at the source (e.g., plastics in yellow bin).",
    stats: [{ label: "Segregation Compliance", color: "text-emerald-400", value: "95%" }, { label: "Violations (Mo)", color: "text-red-400", value: "4" }, { label: "Staff Retrained", color: "text-amber-400", value: "8" }],
    columns: [["Audit ID", "auditid"], ["Department", "department"], ["Violation Found", "violationfound"], ["Penalty/Warning", "penaltywarning"], ["Auditor", "auditor"]],
    badge: ["Status", "status", {"Action Required":"amber","Pass":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { auditid: 'AUD-' + (3001 + i), department: 'Ward B', violationfound: i === 0 ? 'Sharps in Red Bin' : 'None', penaltywarning: i === 0 ? 'Warning Issued' : 'N/A', auditor: 'Infection Control', status: i === 0 ? 'Action Required' : 'Pass' };
      }),
  },
  "/facilities/waste/vendor": {
    ui: 5,
    title: "Vendor Collection", description: "Contract details, pricing, and compliance certificates for the waste disposal vendor.",
    stats: [{ label: "Active Vendor", color: "text-blue-400", value: "EcoWaste Solutions" }, { label: "License Status", color: "text-emerald-400", value: "Valid" }, { label: "Next Renewal", color: "text-amber-400", value: "6 Months" }],
    columns: [["Vendor Name", "vendorname"], ["License No", "licenseno"], ["Expiry Date", "expirydate"], ["Contract Valid Till", "contractvalidtill"], ["Rate/Kg", "ratekg"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { vendorname: 'EcoWaste Solutions', licenseno: 'PCB-12345', expirydate: '31 Dec 2027', contractvalidtill: '31 Dec 2026', ratekg: '$0.50', status: 'Active' };
      }),
  },
};

export default pages;
