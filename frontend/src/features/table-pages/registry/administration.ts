import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/admin/analytics/capacity": {
    ui: 0,
    title: "Capacity Forecasting", description: "Predictive models for future hospital capacity.",
    stats: [{ label: "7-Day Forecast", color: "text-amber-400", value: "+12% Volume" }, { label: "Model Accuracy", color: "text-emerald-400", value: "94.2%" }, { label: "Risk Level", color: "text-amber-400", value: "Moderate" }],
    columns: [["Forecast Period", "forecastperiod"], ["Predicted Admits", "predictedadmits"], ["Bed Requirement", "bedrequirement"], ["Staff Required", "staffrequired"], ["Confidence", "confidence"]],
    badge: ["Status", "status", {"Normal":"emerald","High Alert":"amber","Critical Surge":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const periods = ['Next 24 Hours', 'Next 7 Days', 'Next 30 Days', 'Q4 2026', 'Q1 2027'];
        const admits = ['150 - 180', '1,200 - 1,400', '5,000 - 5,500', '16,000+', '15,000+'];
        const beds = ['85%', '92%', '88%', '95%', '90%'];
        const staff = ['Standard', 'Surge +10%', 'Standard', 'Surge +15%', 'Standard'];
        const confs = ['98%', '92%', '85%', '78%', '70%'];
        const statuses = ['Normal', 'High Alert', 'Normal', 'Critical Surge', 'Normal'];
        return { forecastperiod: periods[i], predictedadmits: admits[i], bedrequirement: beds[i], staffrequired: staff[i], confidence: confs[i], status: statuses[i] };
      }),
  },
  "/admin/analytics/comparison": {
    ui: 0,
    title: "Benchmarking & Comparison", description: "Compare departments and branches.",
    stats: [{ label: "Top Percentile", color: "text-emerald-400", value: "3 Depts" }, { label: "Below Avg", color: "text-gray-400", value: "0" }, { label: "Industry Rank", color: "text-blue-400", value: "#12" }],
    columns: [["Entity", "entity"], ["Comparison Metric", "comparisonmetric"], ["Score", "score"], ["Industry Avg", "industryavg"], ["Percentile", "percentile"]],
    badge: ["Status", "status", {"Leading":"emerald","Above Avg":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const entities = ['Cardiology Dept', 'Neurology Dept', 'North Branch', 'South Branch', 'ER Dept'];
        const metrics = ['Infection Rate', 'Recovery Time', 'Patient Satisfaction', 'Patient Satisfaction', 'Wait Time'];
        const scores = ['0.5%', '4.2 Days', '4.9/5', '4.6/5', '12 mins'];
        const ind = ['1.2%', '5.1 Days', '4.2/5', '4.2/5', '25 mins'];
        const percs = ['95th', '88th', '99th', '85th', '92nd'];
        const statuses = ['Leading', 'Above Avg', 'Leading', 'Above Avg', 'Leading'];
        return { entity: entities[i], comparisonmetric: metrics[i], score: scores[i], industryavg: ind[i], percentile: percs[i], status: statuses[i] };
      }),
  },
  "/admin/analytics/dashboard": {
    ui: 0,
    title: "Analytics Dashboard", description: "High-level predictive analytics and insights.",
    stats: [{ label: "Overall Growth", color: "text-emerald-400", value: "+12.4%" }, { label: "Data Freshness", color: "text-blue-400", value: "Real-time" }, { label: "Anomalies", color: "text-gray-400", value: "0" }],
    columns: [["Insight ID", "insightid"], ["Metric Group", "metricgroup"], ["Current Value", "currentvalue"], ["Target", "target"], ["Variance", "variance"]],
    badge: ["Status", "status", {"Exceeding":"emerald","On Track":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const groups = ['Patient Inflow', 'Avg Treatment Cost', 'Bed Turnover (Days)', 'Outpatient Revenue', 'Surgery Success Rate'];
        const vals = ['4,250', '$4,100', '3.2', '$1.2M', '99.1%'];
        const tgts = ['4,000', '$4,500', '3.5', '$1.0M', '98.5%'];
        const vars = ['+6.2%', '-8.8%', '-8.5%', '+20.0%', '+0.6%'];
        const statuses = ['Exceeding', 'On Track', 'Exceeding', 'Exceeding', 'On Track'];
        return { insightid: 'ANL-' + (1001 + i), metricgroup: groups[i], currentvalue: vals[i], target: tgts[i], variance: vars[i], status: statuses[i] };
      }),
  },
  "/admin/analytics/kpis": {
    ui: 0,
    title: "Key Performance Indicators", description: "Track and manage vital hospital KPIs.",
    stats: [{ label: "Active KPIs", color: "text-blue-400", value: "24" }, { label: "Improving", color: "text-emerald-400", value: "18" }, { label: "Declining", color: "text-red-400", value: "2" }],
    columns: [["KPI Name", "kpiname"], ["Category", "category"], ["Current Score", "currentscore"], ["Last Month", "lastmonth"], ["Trend", "trend"]],
    badge: ["Status", "status", {"Excellent":"emerald","Improving":"emerald","Stable":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Patient Satisfaction', 'Readmission Rate', 'Avg Wait Time', 'Staff Retention', 'Cost per Patient'];
        const cats = ['Quality', 'Clinical', 'Operational', 'HR', 'Financial'];
        const scores = ['4.8/5.0', '12%', '14 mins', '92%', '$1,240'];
        const last = ['4.5/5.0', '14%', '18 mins', '90%', '$1,300'];
        const trends = ['Up', 'Down', 'Down', 'Up', 'Down'];
        const statuses = ['Excellent', 'Improving', 'Improving', 'Stable', 'Improving'];
        return { kpiname: names[i], category: cats[i], currentscore: scores[i], lastmonth: last[i], trend: trends[i], status: statuses[i] };
      }),
  },
  "/admin/analytics/utilization": {
    ui: 0,
    title: "Resource Utilization", description: "Analytics on equipment and room usage.",
    stats: [{ label: "Avg Utilization", color: "text-emerald-400", value: "78%" }, { label: "Underutilized", color: "text-amber-400", value: "12%" }, { label: "Critical Load", color: "text-red-400", value: "4%" }],
    columns: [["Resource Type", "resourcetype"], ["Total Units", "totalunits"], ["Active Usage", "activeusage"], ["Downtime", "downtime"], ["Utilization Rate", "utilizationrate"]],
    badge: ["Status", "status", {"Max Load":"red","Optimal":"emerald","Underutilized":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['MRI Scanners', 'CT Scanners', 'Ventilators', 'Operation Theatres', 'Ambulances'];
        const units = ['4', '6', '120', '15', '12'];
        const active = ['4', '5', '95', '12', '8'];
        const downtime = ['0%', '15%', '5%', '8%', '20%'];
        const rates = ['100%', '85%', '80%', '80%', '65%'];
        const statuses = ['Max Load', 'Optimal', 'Optimal', 'Optimal', 'Underutilized'];
        return { resourcetype: types[i], totalunits: units[i], activeusage: active[i], downtime: downtime[i], utilizationrate: rates[i], status: statuses[i] };
      }),
  },
  "/admin/approvals/admission": {
    ui: 0,
    title: "Admission Approvals", description: "Review and approve pending admissions.",
    stats: [{ label: "Pending", color: "text-amber-400", value: "14" }, { label: "Approved Today", color: "text-emerald-400", value: "45" }, { label: "Rejected", color: "text-red-400", value: "2" }],
    columns: [["Req ID", "reqid"], ["Patient", "patient"], ["Requested Dept", "requesteddept"], ["Priority", "priority"], ["Requested By", "requestedby"]],
    badge: ["Status", "status", {"Pending":"amber","Approved":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const pats = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'Robert Wilson'];
        const depts = ['Cardiology', 'Neurology', 'Oncology', 'Surgery', 'General Med'];
        const pris = ['High', 'Normal', 'Urgent', 'Normal', 'Low'];
        const statuses = ['Pending', 'Approved', 'Pending', 'Rejected', 'Approved'];
        return { reqid: `ADM-${1001 + i}`, patient: pats[i], requesteddept: depts[i], priority: pris[i], requestedby: 'Dr. Jenkins', status: statuses[i] };
      }),
  },
  "/admin/approvals/asset": {
    ui: 0,
    title: "Asset Approvals", description: "Approve asset requisitions and write-offs.",
    stats: [{ label: "Pending Requisitions", color: "text-amber-400", value: "8" }, { label: "Pending Write-offs", color: "text-red-400", value: "3" }, { label: "Approved", color: "text-emerald-400", value: "15" }],
    columns: [["Request ID", "requestid"], ["Asset Category", "assetcategory"], ["Requested By", "requestedby"], ["Action", "action"], ["Value Impact", "valueimpact"]],
    badge: ["Status", "status", {"Pending":"amber","Under Review":"amber","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['IT Equipment', 'Medical Device', 'Furniture', 'Vehicle', 'IT Equipment'];
        const actions = ['New Request', 'Write-off', 'Repair', 'New Request', 'Upgrade'];
        const impacts = ['$1,200', '-$4,500', '$800', '$45,000', '$2,400'];
        const statuses = ['Pending', 'Under Review', 'Approved', 'Pending', 'Approved'];
        return { requestid: `REQ-${8001 + i}`, assetcategory: cats[i], requestedby: 'Dept Head', action: actions[i], valueimpact: impacts[i], status: statuses[i] };
      }),
  },
  "/admin/approvals/discharge": {
    ui: 0,
    title: "Discharge Approvals", description: "Final review and sign-off for discharges.",
    stats: [{ label: "Pending Clearances", color: "text-amber-400", value: "12" }, { label: "Ready for Exit", color: "text-emerald-400", value: "8" }, { label: "Total Today", color: "text-blue-400", value: "98" }],
    columns: [["Discharge ID", "dischargeid"], ["Patient", "patient"], ["Attending Dr", "attendingdr"], ["Clearance", "clearance"], ["Billing Status", "billingstatus"]],
    badge: ["Status", "status", {"Approved":"emerald","Pending":"amber","Action Required":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const pats = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const clears = ['Med & Bill', 'Med Only', 'None', 'Med & Bill', 'Bill Only'];
        const bills = ['Cleared', 'Pending', 'Pending', 'Cleared', 'Pending'];
        const statuses = ['Approved', 'Pending', 'Action Required', 'Approved', 'Pending'];
        return { dischargeid: `DIS-${3001 + i}`, patient: pats[i], attendingdr: 'Dr. House', clearance: clears[i], billingstatus: bills[i], status: statuses[i] };
      }),
  },
  "/admin/approvals/discount": {
    ui: 0,
    title: "Discount Approvals", description: "Approve billing discounts and waivers.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "5" }, { label: "Approved Amount", color: "text-emerald-400", value: "$12,450" }, { label: "Rejected", color: "text-red-400", value: "2" }],
    columns: [["Discount ID", "discountid"], ["Patient/Invoice", "patientinvoice"], ["Bill Amount", "billamount"], ["Requested %", "requested"], ["Requested By", "requestedby"]],
    badge: ["Status", "status", {"Pending":"amber","Approved":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const invoices = ['INV-1092', 'INV-1094', 'INV-1098', 'INV-1102', 'INV-1105'];
        const bills = ['$4,500', '$12,000', '$850', '$24,000', '$1,200'];
        const reqs = ['10%', '25% (Staff)', '15%', '50% (Charity)', '10%'];
        const statuses = ['Pending', 'Approved', 'Approved', 'Pending', 'Rejected'];
        return { discountid: `DSC-${4001 + i}`, patientinvoice: invoices[i], billamount: bills[i], requested: reqs[i], requestedby: 'Billing Dept', status: statuses[i] };
      }),
  },
  "/admin/approvals/leave": {
    ui: 0,
    title: "Leave Approvals", description: "Approve staff and doctor leave requests.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "24" }, { label: "Approved", color: "text-emerald-400", value: "18" }, { label: "Critical Shortage", color: "text-gray-400", value: "0" }],
    columns: [["Leave ID", "leaveid"], ["Employee", "employee"], ["Department", "department"], ["Leave Type", "leavetype"], ["Duration", "duration"]],
    badge: ["Status", "status", {"Pending":"amber","Approved":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const emps = ['Nurse Jackie', 'Dr. Strange', 'Dr. Banner', 'Peter Parker', 'Tony Stark'];
        const types = ['Annual Leave', 'Sick Leave', 'Conference', 'Annual Leave', 'Personal'];
        const durs = ['5 Days', '2 Days', '3 Days', '1 Day', '14 Days'];
        const statuses = ['Pending', 'Approved', 'Approved', 'Pending', 'Rejected'];
        return { leaveid: `LVE-${7001 + i}`, employee: emps[i], department: 'Clinical', leavetype: types[i], duration: durs[i], status: statuses[i] };
      }),
  },
  "/admin/approvals/purchase": {
    ui: 1,
    title: "Purchase Approvals", description: "Approve purchase orders for inventory and assets.",
    stats: [{ label: "Pending POs", color: "text-amber-400", value: "12" }, { label: "Value Pending", color: "text-blue-400", value: "$145,000" }, { label: "Approved Today", color: "text-emerald-400", value: "6" }],
    columns: [["PO Number", "ponumber"], ["Department", "department"], ["Vendor", "vendor"], ["Total Value", "totalvalue"], ["Priority", "priority"]],
    badge: ["Status", "status", {"Pending":"amber","Approved":"emerald","Under Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Pharmacy', 'IT', 'Surgery', 'Facilities', 'Radiology'];
        const vendors = ['PharmaCorp', 'Dell EMC', 'MedSurg Inc', 'CleanCo', 'Siemens'];
        const vals = ['$45,000', '$12,500', '$85,000', '$2,400', '$250,000'];
        const statuses = ['Pending', 'Approved', 'Pending', 'Approved', 'Under Review'];
        return { ponumber: `PO-${6001 + i}`, department: depts[i], vendor: vendors[i], totalvalue: vals[i], priority: 'High', status: statuses[i] };
      }),
  },
  "/admin/approvals/refund": {
    ui: 0,
    title: "Refund Approvals", description: "Approve refund requests for patients.",
    stats: [{ label: "Pending Refunds", color: "text-amber-400", value: "4" }, { label: "Processed Today", color: "text-emerald-400", value: "$3,200" }, { label: "Avg Processing", color: "text-blue-400", value: "1.2 Days" }],
    columns: [["Refund ID", "refundid"], ["Patient", "patient"], ["Original Amount", "originalamount"], ["Refund Amount", "refundamount"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Pending":"amber","Approved":"emerald","Processed":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const pats = ['John Doe', 'Jane Smith', 'Bob Vance', 'Phyllis Lapin', 'Stanley Hudson'];
        const orig = ['$5,000', '$2,500', '$1,000', '$4,500', '$800'];
        const ref = ['$500', '$2,500', '$100', '$450', '$800'];
        const statuses = ['Pending', 'Approved', 'Processed', 'Pending', 'Rejected'];
        return { refundid: `REF-${5001 + i}`, patient: pats[i], originalamount: orig[i], refundamount: ref[i], reason: 'Overpayment', status: statuses[i] };
      }),
  },
  "/admin/approvals/transfer": {
    ui: 0,
    title: "Transfer Approvals", description: "Approve inter-departmental transfers.",
    stats: [{ label: "Pending Transfers", color: "text-amber-400", value: "8" }, { label: "Completed", color: "text-emerald-400", value: "22" }, { label: "On Hold", color: "text-gray-400", value: "1" }],
    columns: [["Transfer ID", "transferid"], ["Patient", "patient"], ["From Ward", "fromward"], ["To Ward", "toward"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Approved":"emerald","Pending":"amber","On Hold":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const pats = ['Alex Morgan', 'David Clark', 'Sarah Lee', 'James Bond', 'Tony Stark'];
        const froms = ['ER', 'ICU', 'General Med', 'Surgery', 'ER'];
        const tos = ['ICU', 'General Med', 'Cardiology', 'Discharge', 'VIP Suite'];
        const statuses = ['Approved', 'Pending', 'On Hold', 'Approved', 'Approved'];
        return { transferid: `TRF-${2001 + i}`, patient: pats[i], fromward: froms[i], toward: tos[i], reason: 'Condition Change', status: statuses[i] };
      }),
  },
  "/admin/compliance/fire": {
    ui: 0,
    title: "Fire Safety Compliance", description: "Monitor fire safety drills, equipment checks, and audits.",
    stats: [{ label: "Overall Safety", color: "text-emerald-400", value: "98%" }, { label: "Pending Fixes", color: "text-amber-400", value: "2" }, { label: "Overdue Audits", color: "text-blue-400", value: "0" }],
    columns: [["Audit ID", "auditid"], ["Zone/Building", "zonebuilding"], ["Last Audit", "lastaudit"], ["Next Due", "nextdue"], ["Inspector", "inspector"]],
    badge: ["Status", "status", {"Compliant":"emerald","Action Required":"amber","Warning":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const zones = ['Main Building A', 'Outpatient Wing', 'ER Block', 'Admin Block', 'Parking Garage'];
        const last = ['15 Jun, 2026', '12 Jun, 2026', '10 Jun, 2026', '05 Jun, 2026', '01 Jun, 2026'];
        const next = ['15 Dec, 2026', '12 Dec, 2026', '10 Dec, 2026', '05 Dec, 2026', '01 Dec, 2026'];
        const statuses = ['Compliant', 'Action Required', 'Compliant', 'Compliant', 'Warning'];
        return { auditid: 'FSA-' + (1001 + i), zonebuilding: zones[i], lastaudit: last[i], nextdue: next[i], inspector: 'Capt. Rogers', status: statuses[i] };
      }),
  },
  "/admin/compliance/waste": {
    ui: 0,
    title: "Waste Management", description: "Track biomedical and hazardous waste disposal compliance.",
    stats: [{ label: "Total Generated", color: "text-blue-400", value: "1,240 kg" }, { label: "Properly Disposed", color: "text-emerald-400", value: "1,240 kg" }, { label: "Violations", color: "text-gray-400", value: "0" }],
    columns: [["Log ID", "logid"], ["Waste Category", "wastecategory"], ["Weight (kg)", "weightkg"], ["Collection Date", "collectiondate"], ["Disposal Vendor", "disposalvendor"]],
    badge: ["Status", "status", {"Processed":"emerald","Pending Pickup":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['Bio-hazardous (Red)', 'Sharps (White)', 'Chemical', 'General (Black)', 'Bio-hazardous (Red)'];
        const weights = ['45.2', '12.4', '5.1', '120.5', '38.0'];
        const vendors = ['SafeDisposal Inc', 'SafeDisposal Inc', 'ChemClear', 'City Waste Dept', 'SafeDisposal Inc'];
        const statuses = ['Processed', 'Processed', 'Pending Pickup', 'Processed', 'Processed'];
        return { logid: 'WST-' + (2001 + i), wastecategory: cats[i], weightkg: weights[i], collectiondate: 'Today', disposalvendor: vendors[i], status: statuses[i] };
      }),
  },
  "/admin/operations/census": {
    ui: 0,
    title: "Hospital Census", description: "Live patient population and demographic tracking.",
    stats: [{ label: "Total Census", color: "text-blue-400", value: "842" }, { label: "Net Change", color: "text-emerald-400", value: "+12" }, { label: "Capacity", color: "text-amber-400", value: "85%" }],
    columns: [["Ward/Zone", "wardzone"], ["Admitted", "admitted"], ["Discharges", "discharges"], ["Transfers In", "transfersin"], ["Transfers Out", "transfersout"]],
    badge: ["Status", "status", {"High Volume":"amber","Normal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const zones = ['ICU Level 1', 'General Med A', 'General Surg B', 'Pediatrics', 'Maternity'];
        const adms = ['4', '15', '8', '6', '12'];
        const dis = ['2', '10', '9', '4', '14'];
        const statuses = ['High Volume', 'Normal', 'Normal', 'Normal', 'High Volume'];
        return { wardzone: zones[i], admitted: adms[i], discharges: dis[i], transfersin: '2', transfersout: '1', status: statuses[i] };
      }),
  },
  "/admin/operations/daily": {
    ui: 0,
    title: "Daily Operations", description: "Day-to-day operational overview and checklists.",
    stats: [{ label: "Tasks Today", color: "text-blue-400", value: "145" }, { label: "Completed", color: "text-emerald-400", value: "92" }, { label: "Overdue", color: "text-red-400", value: "4" }],
    columns: [["Task Name", "taskname"], ["Assigned Dept", "assigneddept"], ["Check Time", "checktime"], ["Completion", "completion"], ["Supervisor", "supervisor"]],
    badge: ["Status", "status", {"Completed":"emerald","Pending":"amber","Scheduled":"red","Overdue":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const tasks = ['Morning Ward Rounds', 'Equipment Calibration', 'Cafeteria Inspection', 'Night Shift Handover', 'Pharmacy Stock Check'];
        const depts = ['Clinical', 'Biomedical', 'Facilities', 'Nursing', 'Pharmacy'];
        const times = ['08:00 AM', '09:00 AM', '11:00 AM', '08:00 PM', '06:00 AM'];
        const statuses = ['Completed', 'Completed', 'Pending', 'Scheduled', 'Overdue'];
        return { taskname: tasks[i], assigneddept: depts[i], checktime: times[i], completion: '100%', supervisor: 'Admin', status: statuses[i] };
      }),
  },
  "/admin/operations/flow": {
    ui: 0,
    title: "Patient Flow", description: "Track patient movement from ER to Discharge.",
    stats: [{ label: "Avg ER Wait", color: "text-emerald-400", value: "14m" }, { label: "Avg LOS", color: "text-blue-400", value: "4.2 Days" }, { label: "Severe Bottlenecks", color: "text-red-400", value: "1" }],
    columns: [["Patient Route", "patientroute"], ["Avg ER Time", "avgertime"], ["Avg Wait Time", "avgwaittime"], ["Avg Length of Stay", "avglengthofstay"], ["Bottlenecks", "bottlenecks"]],
    badge: ["Status", "status", {"Delayed":"amber","Optimal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const routes = ['ER -> ICU', 'OPD -> Ward', 'Direct Admit -> VIP', 'ER -> Surgery', 'Ward -> Discharge'];
        const ers = ['45 mins', 'N/A', 'N/A', '30 mins', 'N/A'];
        const los = ['6.5 Days', '3.2 Days', '4.0 Days', '8.5 Days', '2.1 Days'];
        const statuses = ['Delayed', 'Optimal', 'Optimal', 'Delayed', 'Optimal'];
        return { patientroute: routes[i], avgertime: ers[i], avgwaittime: '20 mins', avglengthofstay: los[i], bottlenecks: 'Bed Availability', status: statuses[i] };
      }),
  },
  "/admin/operations/occupancy": {
    ui: 0,
    title: "Bed Occupancy", description: "Detailed occupancy tracking.",
    stats: [{ label: "Total Beds", color: "text-blue-400", value: "1,250" }, { label: "Occupied", color: "text-amber-400", value: "842" }, { label: "Available", color: "text-emerald-400", value: "380" }],
    columns: [["Zone", "zone"], ["Total Beds", "totalbeds"], ["Occupied", "occupied"], ["Available", "available"], ["Cleaning", "cleaning"]],
    badge: ["Status", "status", {"Critical":"red","Normal":"emerald","High":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const zones = ['ICU Level 1', 'General Med A', 'General Surg B', 'Pediatrics', 'Maternity'];
        const totals = ['50', '200', '150', '100', '120'];
        const occs = ['48', '150', '110', '85', '115'];
        const statuses = ['Critical', 'Normal', 'Normal', 'High', 'Critical'];
        return { zone: zones[i], totalbeds: totals[i], occupied: occs[i], available: '10', cleaning: '5', status: statuses[i] };
      }),
  },
  "/admin/operations/resources": {
    ui: 0,
    title: "Operations Resources", description: "Manage operational assets like stretchers and wheelchairs.",
    stats: [{ label: "Total Assets", color: "text-blue-400", value: "450" }, { label: "Available", color: "text-emerald-400", value: "120" }, { label: "In Maintenance", color: "text-amber-400", value: "14" }],
    columns: [["Resource", "resource"], ["Total Count", "totalcount"], ["In Use", "inuse"], ["Available", "available"], ["Maintenance", "maintenance"]],
    badge: ["Status", "status", {"Normal":"emerald","High Demand":"red","Critical":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const res = ['Wheelchairs', 'Stretchers', 'IV Stands', 'Mobile Monitors', 'Oxygen Cylinders'];
        const tot = ['150', '80', '200', '45', '300'];
        const use = ['120', '65', '180', '40', '210'];
        const statuses = ['Normal', 'Normal', 'High Demand', 'Critical', 'Normal'];
        return { resource: res[i], totalcount: tot[i], inuse: use[i], available: '20', maintenance: '5', status: statuses[i] };
      }),
  },
  "/admin/policy/control": {
    ui: 0,
    title: "Document Control", description: "Manage document revisions and approvals.",
    stats: [{ label: "Pending Reviews", color: "text-amber-400", value: "8" }, { label: "Approved This Week", color: "text-emerald-400", value: "14" }, { label: "Archived", color: "text-gray-400", value: "450" }],
    columns: [["Control ID", "controlid"], ["Document Name", "documentname"], ["Author", "author"], ["Changes Made", "changesmade"], ["Reviewer", "reviewer"]],
    badge: ["Status", "status", {"Pending Review":"amber","Approved":"emerald","Archived":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const docs = ['HR Manual 2027', 'Surgical Checklist', 'Visitor Policy', 'COVID Protocol', 'Discharge Summary Tpl'];
        const changes = ['Annual Update', 'Added Item 4', 'Revised Hours', 'Archiving', 'Formatting'];
        const statuses = ['Pending Review', 'Approved', 'Pending Review', 'Archived', 'Approved'];
        return { controlid: `CTRL-${3001 + i}`, documentname: docs[i], author: 'Admin', changesmade: changes[i], reviewer: 'Compliance Comm', status: statuses[i] };
      }),
  },
  "/admin/policy/departments": {
    ui: 0,
    title: "Department Policies", description: "Policies specific to individual departments.",
    stats: [{ label: "Department Docs", color: "text-blue-400", value: "350" }, { label: "Avg Compliance", color: "text-emerald-400", value: "94%" }, { label: "Non-Compliant", color: "text-red-400", value: "2 Depts" }],
    columns: [["Doc ID", "docid"], ["Title", "title"], ["Department", "department"], ["Mandatory For", "mandatoryfor"], ["Compliance", "compliance"]],
    badge: ["Status", "status", {"Active":"emerald","Action Required":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const titles = ['Radiation Safety', 'ICU Sterilization', 'Pharmacy Dispensing', 'ER Triage Guidelines', 'Server Access Control'];
        const depts = ['Radiology', 'ICU', 'Pharmacy', 'Emergency', 'IT Services'];
        const comps = ['100%', '98%', '100%', '92%', '100%'];
        const statuses = ['Active', 'Active', 'Active', 'Action Required', 'Active'];
        return { docid: `DPOL-${2001 + i}`, title: titles[i], department: depts[i], mandatoryfor: 'All Dept Staff', compliance: comps[i], status: statuses[i] };
      }),
  },
  "/admin/policy/library": {
    ui: 0,
    title: "Policy Library", description: "Central repository for all hospital policies.",
    stats: [{ label: "Total Policies", color: "text-blue-400", value: "142" }, { label: "Recently Updated", color: "text-emerald-400", value: "12" }, { label: "Review Needed", color: "text-amber-400", value: "5" }],
    columns: [["Policy ID", "policyid"], ["Policy Title", "policytitle"], ["Category", "category"], ["Version", "version"], ["Last Updated", "lastupdated"]],
    badge: ["Status", "status", {"Active":"emerald","Review Needed":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const titles = ['Hand Hygiene Protocol', 'Data Privacy (HIPAA)', 'Fire Evacuation', 'Code Blue Response', 'Waste Management'];
        const cats = ['Clinical', 'Admin & IT', 'Safety', 'Clinical', 'Facilities'];
        const vers = ['v2.4', 'v3.1', 'v1.8', 'v4.0', 'v2.1'];
        const statuses = ['Active', 'Active', 'Review Needed', 'Active', 'Active'];
        return { policyid: `POL-${1001 + i}`, policytitle: titles[i], category: cats[i], version: vers[i], lastupdated: '12 Aug, 2026', status: statuses[i] };
      }),
  },
  "/admin/reports/administrative": {
    ui: 0,
    title: "Administrative Reports", description: "Overview of administrative activities and audits.",
    stats: [{ label: "Total Reports", color: "text-blue-400", value: "450" }, { label: "Critical Flags", color: "text-red-400", value: "12" }, { label: "Resolved", color: "text-emerald-400", value: "8" }],
    columns: [["Report ID", "reportid"], ["Report Type", "reporttype"], ["Generated By", "generatedby"], ["Date", "date"], ["Flagged Issues", "flaggedissues"]],
    badge: ["Status", "status", {"Reviewed":"emerald","Approved":"emerald","Action Required":"amber","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Monthly Compliance', 'Inventory Audit', 'Staff Attendance', 'Fire Safety Review', 'Budget Variance'];
        const users = ['Admin User', 'Inventory Mgr', 'HR Dept', 'Safety Officer', 'Finance Team'];
        const flags = ['2', '0', '14', '1', '5'];
        const statuses = ['Reviewed', 'Approved', 'Action Required', 'Reviewed', 'Pending'];
        return { reportid: 'ADM-REP-' + (1001 + i), reporttype: types[i], generatedby: users[i], date: 'Today', flaggedissues: flags[i], status: statuses[i] };
      }),
  },
  "/admin/reports/occupancy": {
    ui: 0,
    title: "Bed Occupancy Report", description: "Granular bed occupancy and turnover metrics.",
    stats: [{ label: "Avg Occupancy", color: "text-blue-400", value: "86%" }, { label: "High Demand", color: "text-amber-400", value: "ICU" }, { label: "Available Beds", color: "text-emerald-400", value: "124" }],
    columns: [["Ward", "ward"], ["Total Beds", "totalbeds"], ["Occupied", "occupied"], ["Available", "available"], ["Turnover Rate", "turnoverrate"]],
    badge: ["Status", "status", {"Critical":"red","Normal":"emerald","High":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const wards = ['Cardiac ICU', 'General Ward A', 'Maternity Wing', 'Pediatric Unit', 'Neurology ICU'];
        const total = [45, 120, 80, 60, 30];
        const occ = [42, 90, 75, 45, 29];
        const avail = [3, 30, 5, 15, 1];
        const rates = ['92%', '75%', '85%', '80%', '95%'];
        const statuses = ['Critical', 'Normal', 'High', 'Normal', 'Critical'];
        return { ward: wards[i], totalbeds: total[i], occupied: occ[i], available: avail[i], turnoverrate: rates[i], status: statuses[i] };
      }),
  },
  "/admin/resource/room": {
    ui: 0,
    title: "Room Allocation", description: "Manage meeting rooms, conference halls, and multi-purpose rooms.",
    stats: [{ label: "Total Rooms", color: "text-blue-400", value: "24" }, { label: "Available Now", color: "text-emerald-400", value: "15" }, { label: "Booked Today", color: "text-amber-400", value: "8" }],
    columns: [["Room Name", "roomname"], ["Capacity", "capacity"], ["Type", "type"], ["Current Booking", "currentbooking"], ["Next Booking", "nextbooking"]],
    badge: ["Status", "status", {"In Use":"amber","Available":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const rooms = ['Conference Hall A', 'Meeting Room 1', 'Meeting Room 2', 'Board Room', 'Auditorium'];
        const caps = ['150', '10', '10', '25', '300'];
        const types = ['Conference', 'Meeting', 'Meeting', 'Executive', 'Event'];
        const curr = ['Nursing Seminar', 'None', 'IT Sync', 'Board Meeting', 'None'];
        const next = ['None', 'HR Interviews', 'None', 'None', 'Annual General Meeting'];
        const statuses = ['In Use', 'Available', 'In Use', 'In Use', 'Available'];
        return { roomname: rooms[i], capacity: caps[i], type: types[i], currentbooking: curr[i], nextbooking: next[i], status: statuses[i] };
      }),
  },
  "/admin/resource/vehicle": {
    ui: 0,
    title: "Vehicle & Fleet Management", description: "Monitor hospital ambulances and transport vehicles.",
    stats: [{ label: "Total Fleet", color: "text-blue-400", value: "18" }, { label: "Active/On-trip", color: "text-amber-400", value: "5" }, { label: "Available", color: "text-emerald-400", value: "12" }],
    columns: [["Vehicle No", "vehicleno"], ["Type", "type"], ["Driver Assigned", "driverassigned"], ["Current Location", "currentlocation"], ["Last Service", "lastservice"]],
    badge: ["Status", "status", {"Active":"emerald","Available":"emerald","Maintenance":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const vehs = ['AMB-01 (ICU)', 'AMB-02 (BLS)', 'AMB-03 (BLS)', 'VAN-01 (Staff)', 'VAN-02 (Staff)'];
        const types = ['Advanced Life Support', 'Basic Life Support', 'Basic Life Support', 'Staff Transport', 'Staff Transport'];
        const drivers = ['John D.', 'Mike S.', 'Unassigned', 'Sarah T.', 'Unassigned'];
        const locs = ['En route (North St)', 'Base Station', 'Base Station', 'City Center Drop', 'Maintenance Bay'];
        const statuses = ['Active', 'Available', 'Available', 'Active', 'Maintenance'];
        return { vehicleno: vehs[i], type: types[i], driverassigned: drivers[i], currentlocation: locs[i], lastservice: '12 May, 2026', status: statuses[i] };
      }),
  },
  "/admin/settings/hospital": {
    ui: 0,
    title: "Hospital Settings", description: "Global configurations for the hospital.",
    stats: [{ label: "Global Configs", color: "text-blue-400", value: "124" }, { label: "Require Restart", color: "text-emerald-400", value: "0" }, { label: "Sync Status", color: "text-blue-400", value: "Synced" }],
    columns: [["Setting Key", "settingkey"], ["Category", "category"], ["Current Value", "currentvalue"], ["Last Updated", "lastupdated"], ["Modified By", "modifiedby"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const keys = ['HOSPITAL_NAME', 'PRIMARY_CURRENCY', 'DEFAULT_LANGUAGE', 'TIMEZONE', 'MAX_BED_CAPACITY'];
        const vals = ['MedixPro Health', 'USD ($)', 'English (US)', 'America/New_York', '1500'];
        const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
        return { settingkey: keys[i], category: 'General', currentvalue: vals[i], lastupdated: 'Today', modifiedby: 'SuperAdmin', status: statuses[i] };
      }),
  },
  "/admin/settings/hours": {
    ui: 0,
    title: "Working Hours", description: "Configure operational hours and shifts.",
    stats: [{ label: "Total Shifts", color: "text-blue-400", value: "8" }, { label: "24/7 Depts", color: "text-emerald-400", value: "4" }, { label: "Overnight Shifts", color: "text-indigo-400", value: "4" }],
    columns: [["Shift Name", "shiftname"], ["Department", "department"], ["Start Time", "starttime"], ["End Time", "endtime"], ["Grace Period", "graceperiod"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const shifts = ['Morning OPD', 'Evening OPD', 'Night Shift ICU', 'ER Rotating', 'Admin Normal'];
        const depts = ['Outpatient', 'Outpatient', 'ICU', 'Emergency', 'Administration'];
        const starts = ['08:00 AM', '04:00 PM', '08:00 PM', '12:00 AM', '09:00 AM'];
        const ends = ['04:00 PM', '10:00 PM', '08:00 AM', '08:00 AM', '05:00 PM'];
        return { shiftname: shifts[i], department: depts[i], starttime: starts[i], endtime: ends[i], graceperiod: '15 mins', status: 'Active' };
      }),
  },
  "/admin/settings/notifications": {
    ui: 0,
    title: "Notification Preferences", description: "Configure global email and SMS alerts.",
    stats: [{ label: "Email Alerts", color: "text-emerald-400", value: "Enabled" }, { label: "SMS Gateway", color: "text-emerald-400", value: "Connected" }, { label: "Push Service", color: "text-emerald-400", value: "Active" }],
    columns: [["Notification Type", "notificationtype"], ["Channel", "channel"], ["Recipients", "recipients"], ["Template", "template"], ["Frequency", "frequency"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Appointment Reminder', 'Lab Result Ready', 'Payment Receipt', 'Shift Reminder', 'System Outage'];
        const channels = ['SMS', 'SMS & Email', 'Email', 'Push', 'All Channels'];
        const freqs = ['24h Before', 'Immediate', 'Immediate', '2h Before', 'Immediate'];
        return { notificationtype: types[i], channel: channels[i], recipients: 'Patients', template: 'TPL-0' + (i + 1), frequency: freqs[i], status: 'Active' };
      }),
  },
  "/admin/settings/series": {
    ui: 0,
    title: "ID Series & Prefixes", description: "Configure prefixes for auto-generated IDs.",
    stats: [{ label: "Custom Series", color: "text-blue-400", value: "24" }, { label: "Active Sequences", color: "text-emerald-400", value: "24" }, { label: "Conflicts", color: "text-gray-400", value: "0" }],
    columns: [["Entity", "entity"], ["Prefix", "prefix"], ["Padding", "padding"], ["Current Sequence", "currentsequence"], ["Example", "example"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const entities = ['Patient', 'Employee', 'Invoice', 'Prescription', 'Appointment'];
        const prefixes = ['PAT-', 'EMP-', 'INV-', 'RX-', 'APT-'];
        const seq = ['10425', '1102', '55291', '9921', '40212'];
        const ex = ['PAT-010425', 'EMP-001102', 'INV-055291', 'RX-009921', 'APT-040212'];
        return { entity: entities[i], prefix: prefixes[i], padding: '6 Digits', currentsequence: seq[i], example: ex[i], status: 'Active' };
      }),
  },
  "/admin/settings/workflow": {
    ui: 0,
    title: "Workflow Automation", description: "Configure automated approval and task workflows.",
    stats: [{ label: "Active Rules", color: "text-blue-400", value: "18" }, { label: "Automations Today", color: "text-emerald-400", value: "1.2k" }, { label: "Failed Executions", color: "text-gray-400", value: "0" }],
    columns: [["Workflow Rule", "workflowrule"], ["Trigger", "trigger"], ["Action", "action"], ["Target Group", "targetgroup"], ["Executions", "executions"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const rules = ['Auto-approve basic leave', 'High-value purchase alert', 'Critical lab result SMS', 'VIP Admission notify', 'Bed empty cleaning task'];
        const triggers = ['Leave < 2 Days', 'PO > $10,000', 'Lab = Abnormal', 'Admit = VIP', 'Discharge = Complete'];
        const actions = ['Approve Leave', 'Email CFO', 'SMS Doctor', 'Notify Admin Head', 'Task to Housekeeping'];
        const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
        return { workflowrule: rules[i], trigger: triggers[i], action: actions[i], targetgroup: 'System', executions: '452', status: statuses[i] };
      }),
  },
  "/admin/vendor/amc": {
    ui: 0,
    title: "AMC Contracts", description: "Annual Maintenance Contracts for equipment and facilities.",
    stats: [{ label: "Active Contracts", color: "text-blue-400", value: "45" }, { label: "Expiring Soon", color: "text-amber-400", value: "4" }, { label: "Expired", color: "text-emerald-400", value: "0" }],
    columns: [["Contract ID", "contractid"], ["Vendor", "vendor"], ["Equipment/System", "equipmentsystem"], ["Start Date", "startdate"], ["End Date", "enddate"]],
    badge: ["Status", "status", {"Active":"emerald","Expiring Soon":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const vendors = ['Siemens Health', 'GE Medical', 'Johnson Controls', 'Elevator Co', 'IT Infra Services'];
        const systems = ['MRI Scanner', 'CT Scanner', 'HVAC System', 'Lifts 1-4', 'Server Racks'];
        const starts = ['01 Jan, 2026', '15 Mar, 2026', '01 Jun, 2025', '12 Aug, 2025', '01 Nov, 2025'];
        const ends = ['31 Dec, 2027', '14 Mar, 2028', '31 May, 2026', '11 Aug, 2026', '31 Oct, 2026'];
        const statuses = ['Active', 'Active', 'Expiring Soon', 'Active', 'Active'];
        return { contractid: 'AMC-' + (1001 + i), vendor: vendors[i], equipmentsystem: systems[i], startdate: starts[i], enddate: ends[i], status: statuses[i] };
      }),
  },
  "/settings/preferences": {
    ui: 0,
    title: "System Preferences", description: "Global configurations and user preference settings.",
    stats: [{ label: "Total Settings", color: "text-blue-400", value: "145" }, { label: "System Overrides", color: "text-amber-400", value: "12" }, { label: "Default Status", color: "text-emerald-400", value: "92%" }],
    columns: [["Setting ID", "settingid"], ["Configuration Name", "configurationname"], ["Category", "category"], ["Current Value", "currentvalue"], ["Last Modified", "lastmodified"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const configs = ['Default Timezone', 'Date Format', 'Theme (Global)', 'Session Timeout', 'Notification Sound'];
        const cats = ['Localization', 'Localization', 'UI/UX', 'Security', 'Alerts'];
        const vals = ['UTC-05:00', 'DD/MM/YYYY', 'Dark Mode', '30 Minutes', 'Chime 1'];
        const mods = ['By System', 'By John Admin', 'By System', 'By System', 'By John Admin'];
        const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
        return { settingid: 'CFG-' + (2001 + i), configurationname: configs[i], category: cats[i], currentvalue: vals[i], lastmodified: mods[i], status: statuses[i] };
      }),
  },
  "/settings/profile": {
    ui: 0,
    title: "User Profiles", description: "Manage basic user profiles and directory information.",
    stats: [{ label: "Total Profiles", color: "text-blue-400", value: "840" }, { label: "Active Users", color: "text-emerald-400", value: "795" }, { label: "Locked Accounts", color: "text-red-400", value: "4" }],
    columns: [["User ID", "userid"], ["Full Name", "fullname"], ["Role", "role"], ["Department", "department"], ["Last Login", "lastlogin"]],
    badge: ["Status", "status", {"Active":"emerald","Locked":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['John Admin', 'Sarah Reception', 'Peter HR', 'Mary Manager', 'Tony IT'];
        const roles = ['Super Admin', 'Receptionist', 'HR Executive', 'Operations Manager', 'IT Support'];
        const depts = ['Administration', 'Front Desk', 'Human Resources', 'Operations', 'IT'];
        const logins = ['2 mins ago', '1 hour ago', 'Yesterday', 'Just now', '3 days ago'];
        const statuses = ['Active', 'Active', 'Active', 'Active', 'Locked'];
        return { userid: 'USR-' + (1001 + i), fullname: names[i], role: roles[i], department: depts[i], lastlogin: logins[i], status: statuses[i] };
      }),
  },
};

export default pages;
