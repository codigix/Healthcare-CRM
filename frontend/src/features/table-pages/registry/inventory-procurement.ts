import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/inventory/analytics/cost": {
    ui: 5,
    title: "Inventory Cost Analysis", description: "Breakdown of holding costs, ordering costs, and shortage costs.",
    stats: [{ label: "Total Holding Cost", color: "text-amber-400", value: "$45,000" }, { label: "Cost per Order", color: "text-emerald-400", value: "$12" }, { label: "Shrinkage Cost", color: "text-blue-400", value: "$1,200" }],
    columns: [["Cost Component", "costcomponent"], ["Current Month", "currentmonth"], ["Previous Month", "previousmonth"], ["% Change", "change"], ["Industry Benchmark", "industrybenchmark"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const components = ['Storage / Space Cost', 'Capital Opportunity Cost', 'Insurance & Taxes', 'Obsolescence / Shrinkage', 'Ordering Cost (Admin)'];
        return { costcomponent: components[i], currentmonth: '$' + (15000 - i * 2000), previousmonth: '$' + (14500 - i * 1800), change: '+3.4%', industrybenchmark: 'Optimal', status: 'Analyzed' };
      }),
  },
  "/inventory/analytics/dashboard": {
    ui: 5,
    title: "Inventory Dashboard", description: "High-level executive overview of inventory KPIs and alerts.",
    stats: [{ label: "Inventory Turnover", color: "text-emerald-400", value: "12.4" }, { label: "Stockout Rate", color: "text-emerald-400", value: "1.2%" }, { label: "Holding Cost", color: "text-amber-400", value: "$45K" }],
    columns: [["Metric", "metric"], ["Current Month", "currentmonth"], ["Target", "target"], ["Variance", "variance"]],
    badge: ["Status", "status", {"Optimal":"emerald","Needs Attention":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['Inventory Turnover Ratio', 'Stockout Rate', 'Order Fill Rate', 'Shrinkage Rate', 'Holding Cost'];
        const currents = ['12.4', '1.2%', '98.5%', '0.8%', '$45,000'];
        const targets = ['10.0', '< 2.0%', '> 95%', '< 1.0%', '$40,000'];
        return { metric: metrics[i], currentmonth: currents[i], target: targets[i], variance: i === 4 ? '+12.5%' : 'Positive', status: i === 4 ? 'Needs Attention' : 'Optimal' };
      }),
  },
  "/inventory/analytics/department": {
    ui: 5,
    title: "Department Analytics", description: "Visual insights into which departments are consuming the most budget.",
    stats: [{ label: "Highest Consumer", color: "text-blue-400", value: "OT" }, { label: "Overall Budget Variance", color: "text-emerald-400", value: "-2.4%" }, { label: "Critical Depts", color: "text-amber-400", value: "1" }],
    columns: [["Department", "department"], ["Budget Allocated", "budgetallocated"], ["Consumed (YTD)", "consumedytd"], ["Variance", "variance"], ["Trend", "trend"]],
    badge: ["Status", "status", {"Within Budget":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['OT', 'ICU', 'Ward', 'Lab', 'Radiology'];
        return { department: depts[i], budgetallocated: '$' + (500000 - i * 80000), consumedytd: '$' + (480000 - i * 75000), variance: '-4%', trend: 'Stable', status: 'Within Budget' };
      }),
  },
  "/inventory/analytics/reorder": {
    ui: 5,
    title: "Reorder Analysis", description: "AI/Statistical analysis to optimize reorder points and safety stock levels.",
    stats: [{ label: "Optimization Opps", color: "text-blue-400", value: "450 Items" }, { label: "Capital Savings Est.", color: "text-emerald-400", value: "$24,000" }, { label: "Stockout Risks Addressed", color: "text-emerald-400", value: "12" }],
    columns: [["Item Name", "itemname"], ["Current ROL", "currentrol"], ["Suggested ROL", "suggestedrol"], ["Current Safety Stock", "currentsafetystock"], ["Suggested Safety Stock", "suggestedsafetystock"]],
    badge: ["Status", "status", {"Suggestion Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemname: 'Item ' + (1 + i), currentrol: '100', suggestedrol: '80', currentsafetystock: '50', suggestedsafetystock: '30', status: 'Suggestion Pending' };
      }),
  },
  "/inventory/analytics/trends": {
    ui: 5,
    title: "Monthly Trends", description: "Visualizing seasonality and long-term consumption trends for forecasting.",
    stats: [{ label: "Avg Forecast Accuracy", color: "text-emerald-400", value: "92%" }, { label: "Peak Consumption Month", color: "text-blue-400", value: "August" }, { label: "Inventory Growth (YTD)", color: "text-amber-400", value: "+4.5%" }],
    columns: [["Month", "month"], ["Total Receipts Value", "totalreceiptsvalue"], ["Total Issues Value", "totalissuesvalue"], ["Net Inventory Growth", "netinventorygrowth"], ["Forecast Accuracy", "forecastaccuracy"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        return { month: months[i] + ' 2026', totalreceiptsvalue: '$' + (120000 + i * 5000), totalissuesvalue: '$' + (115000 + i * 4000), netinventorygrowth: '+$' + (5000 + i * 1000), forecastaccuracy: (90 + i) + '%', status: 'Analyzed' };
      }),
  },
  "/inventory/analytics/turnover": {
    ui: 5,
    title: "Stock Turnover", description: "Analysis of how many times inventory is sold/used and replaced over a year.",
    stats: [{ label: "Hospital Avg Ratio", color: "text-emerald-400", value: "12.4x" }, { label: "Best Category", color: "text-blue-400", value: "Surgicals (24x)" }, { label: "Slowest", color: "text-amber-400", value: "Spares (2x)" }],
    columns: [["Category", "category"], ["Avg Inventory Value", "avginventoryvalue"], ["COGS", "cogs"], ["Turnover Ratio", "turnoverratio"], ["Days Sales of Inventory", "dayssalesofinventory"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['Surgicals', 'Medical Gases', 'Consumables', 'Stationery', 'Spares'];
        const ratios = ['24.0', '18.5', '12.4', '8.0', '2.0'];
        return { category: cats[i], avginventoryvalue: '$' + (50000 - i * 5000), cogs: '$' + (1200000 - i * 100000), turnoverratio: ratios[i], dayssalesofinventory: (365 / parseFloat(ratios[i])).toFixed(0) + ' Days', status: 'Analyzed' };
      }),
  },
  "/inventory/batch/expired": {
    ui: 5,
    title: "Expired Items", description: "Log of fully expired items awaiting write-off or destruction.",
    stats: [{ label: "Pending Write-off", color: "text-amber-400", value: "15" }, { label: "Value Pending", color: "text-red-400", value: "$350" }, { label: "Destroyed (YTD)", color: "text-emerald-400", value: "$1,200" }],
    columns: [["Item Name", "itemname"], ["Batch No", "batchno"], ["Expired On", "expiredon"], ["Qty", "qty"], ["Total Value", "totalvalue"]],
    badge: ["Status", "status", {"Pending Write-off":"amber","Written Off":"blue","Destroyed":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Write-off', 'Written Off', 'Pending Write-off', 'Destroyed', 'Destroyed'];
        return { itemname: 'Item ' + (1 + i), batchno: 'BTH-EX-' + i, expiredon: '30 Jun 2026', qty: (5 + i).toString(), totalvalue: '$' + (50 + i * 10), status: statuses[i] };
      }),
  },
  "/inventory/batch/expiry": {
    ui: 5,
    title: "Expiry Monitoring", description: "Dashboard tracking items approaching expiration dates across all stores.",
    stats: [{ label: "Expired (Total)", color: "text-red-400", value: "15 Items" }, { label: "Value of Expired", color: "text-red-400", value: "$350" }, { label: "Action Required", color: "text-amber-400", value: "24" }],
    columns: [["Item Name", "itemname"], ["Batch No", "batchno"], ["Location", "location"], ["Expiry Date", "expirydate"], ["Qty Left", "qtyleft"]],
    badge: ["Status", "status", {"Expired":"red","Expiring Soon":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i < 2 ? 'Expired' : 'Expiring Soon';
        const dates = ['15 Jun 2026', '30 Jun 2026', '31 Jul 2026', '15 Aug 2026', '30 Aug 2026'];
        return { itemname: 'Item ' + (1 + i), batchno: 'BTH-' + i, location: 'Main Store', expirydate: dates[i], qtyleft: (10 + i * 2).toString(), status: statuses };
      }),
  },
  "/inventory/batch/management": {
    ui: 5,
    title: "Batch Management", description: "Tracking multiple batches of items, particularly sterile consumables.",
    stats: [{ label: "Active Batches", color: "text-blue-400", value: "4,500" }, { label: "Quarantined", color: "text-red-400", value: "8" }, { label: "Consumed", color: "text-gray-400", value: "120 (Mo)" }],
    columns: [["Item Name", "itemname"], ["Batch No", "batchno"], ["Mfg Date", "mfgdate"], ["Expiry Date", "expirydate"], ["Qty in Batch", "qtyinbatch"]],
    badge: ["Status", "status", {"Active":"emerald","Quarantined":"amber","Consumed":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active', 'Active', 'Quarantined', 'Consumed', 'Active'];
        return { itemname: 'Sterile Glove', batchno: 'BTH-GLV-' + i, mfgdate: '01 Jan 2026', expirydate: '31 Dec 2027', qtyinbatch: (500 - i * 50).toString(), status: statuses[i] };
      }),
  },
  "/inventory/batch/near-expiry": {
    ui: 5,
    title: "Near Expiry Items", description: "Actionable list of items expiring in the next 3 to 6 months.",
    stats: [{ label: "Near Expiry Alerts", color: "text-amber-400", value: "45" }, { label: "Returned to Vendor", color: "text-emerald-400", value: "12" }, { label: "Pushed to Wards", color: "text-blue-400", value: "20" }],
    columns: [["Item Name", "itemname"], ["Batch No", "batchno"], ["Months to Expiry", "monthstoexpiry"], ["Current Qty", "currentqty"], ["Action Taken", "actiontaken"]],
    badge: ["Status", "status", {"Monitoring":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const actions = ['Return to Vendor', 'Use First', 'Discount', 'Use First', 'None'];
        return { itemname: 'Item ' + (1 + i), batchno: 'BTH-NX-' + i, monthstoexpiry: (2 + i).toString(), currentqty: (50 + i * 10).toString(), actiontaken: actions[i], status: 'Monitoring' };
      }),
  },
  "/inventory/batch/recall": {
    ui: 5,
    title: "Recall Management", description: "Managing manufacturer recalls for specific batches of consumables.",
    stats: [{ label: "Active Recalls", color: "text-red-400", value: "2" }, { label: "Quarantined Qty", color: "text-amber-400", value: "150" }, { label: "Resolved", color: "text-emerald-400", value: "4" }],
    columns: [["Recall ID", "recallid"], ["Item Name", "itemname"], ["Batch No", "batchno"], ["Affected Qty Located", "affectedqtylocated"], ["Vendor Notified", "vendornotified"]],
    badge: ["Status", "status", {"Active Investigation":"amber","Quarantined":"amber","Returned to Vendor":"blue","Closed":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active Investigation', 'Quarantined', 'Returned to Vendor', 'Closed', 'Closed'];
        return { recallid: 'RCL-' + (1001 + i), itemname: 'Recall Item ' + (1 + i), batchno: 'BTH-REC-' + i, affectedqtylocated: (20 + i * 10).toString(), vendornotified: 'Yes', status: statuses[i] };
      }),
  },
  "/inventory/biomedical/allocation": {
    ui: 5,
    title: "Equipment Allocation", description: "Real-time location of mobile biomedical equipment (e.g., portable X-ray).",
    stats: [{ label: "In Use", color: "text-blue-400", value: "45" }, { label: "Available", color: "text-emerald-400", value: "12" }, { label: "Overdue Return", color: "text-red-400", value: "3" }],
    columns: [["Equip ID", "equipid"], ["Equipment Name", "equipmentname"], ["Current Location", "currentlocation"], ["Allocated Date", "allocateddate"], ["Return Due", "returndue"]],
    badge: ["Status", "status", {"In Use":"gray","Available":"gray","Overdue":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In Use', 'Available', 'Overdue', 'In Use', 'In Use'];
        return { equipid: 'BIO-' + (2001 + i), equipmentname: 'Portable USG ' + (1 + i), currentlocation: statuses[i] === 'Available' ? 'Bio-Med Store' : 'Ward ' + (1 + i), allocateddate: 'Today', returndue: 'Today 5PM', status: statuses[i] };
      }),
  },
  "/inventory/biomedical/breakdown": {
    ui: 5,
    title: "Breakdown History", description: "Ticketing and repair logs for sudden equipment failures.",
    stats: [{ label: "Active Tickets", color: "text-amber-400", value: "8" }, { label: "Avg Repair Time", color: "text-blue-400", value: "4.5 Hrs" }, { label: "Repaired Today", color: "text-emerald-400", value: "3" }],
    columns: [["Ticket ID", "ticketid"], ["Equipment Name", "equipmentname"], ["Reported Date", "reporteddate"], ["Issue Description", "issuedescription"], ["Downtime", "downtime"]],
    badge: ["Status", "status", {"Open":"amber","In Repair":"amber","Resolved":"emerald","Awaiting Parts":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Open', 'In Repair', 'Resolved', 'Awaiting Parts', 'Resolved'];
        return { ticketid: 'TKT-' + (5001 + i), equipmentname: 'Syringe Pump ' + (1 + i), reporteddate: 'Today', issuedescription: 'Power Failure', downtime: statuses[i] === 'Resolved' ? '3 Hrs' : 'Ongoing', status: statuses[i] };
      }),
  },
  "/inventory/biomedical/calibration": {
    ui: 5,
    title: "Calibration", description: "Scheduling and logging mandatory clinical calibration tests.",
    stats: [{ label: "Calibration Due", color: "text-amber-400", value: "15" }, { label: "Passed (MTD)", color: "text-emerald-400", value: "45" }, { label: "Failed Calibration", color: "text-red-400", value: "2" }],
    columns: [["Equip ID", "equipid"], ["Equipment Name", "equipmentname"], ["Last Calibrated", "lastcalibrated"], ["Next Due Date", "nextduedate"], ["Agency", "agency"]],
    badge: ["Status", "status", {"Valid":"emerald","Due Soon":"amber","Overdue":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i === 1 ? 'Due Soon' : (i === 3 ? 'Overdue' : 'Valid');
        return { equipid: 'BIO-' + (3001 + i), equipmentname: 'Patient Monitor ' + (1 + i), lastcalibrated: '01 Jan 2026', nextduedate: statuses === 'Due Soon' ? '15 Jul 2026' : '01 Jan 2027', agency: 'MedCalib Inc', status: statuses };
      }),
  },
  "/inventory/biomedical/maintenance": {
    ui: 5,
    title: "Preventive Maintenance", description: "Planned Preventive Maintenance (PPM) schedules for all medical devices.",
    stats: [{ label: "PPM Scheduled", color: "text-blue-400", value: "34" }, { label: "Completed (Mo)", color: "text-emerald-400", value: "120" }, { label: "Overdue PPM", color: "text-red-400", value: "5" }],
    columns: [["PPM ID", "ppmid"], ["Equipment Name", "equipmentname"], ["Schedule Date", "scheduledate"], ["Completed Date", "completeddate"], ["Engineer", "engineer"]],
    badge: ["Status", "status", {"Completed":"emerald","Scheduled":"amber","Overdue":"red","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Completed', 'Scheduled', 'Overdue', 'In Progress', 'Completed'];
        return { ppmid: 'PPM-' + (4001 + i), equipmentname: 'Defibrillator ' + (1 + i), scheduledate: '10 Jul 2026', completeddate: statuses[i] === 'Completed' ? '10 Jul 2026' : '-', engineer: 'Eng. Smith', status: statuses[i] };
      }),
  },
  "/inventory/biomedical/register": {
    ui: 5,
    title: "Equipment Register", description: "Specific register for medical devices requiring clinical calibration.",
    stats: [{ label: "Total Equipment", color: "text-blue-400", value: "850" }, { label: "High Risk", color: "text-red-400", value: "120" }, { label: "Active", color: "text-emerald-400", value: "810" }],
    columns: [["Equip ID", "equipid"], ["Equipment Name", "equipmentname"], ["Manufacturer", "manufacturer"], ["Department", "department"], ["Risk Level", "risklevel"]],
    badge: ["Status", "status", {"Active":"emerald","In Repair":"amber","Down":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const risks = ['High', 'Medium', 'Low', 'High', 'Medium'];
        const statuses = ['Active', 'In Repair', 'Active', 'Active', 'Down'];
        return { equipid: 'BIO-' + (1001 + i), equipmentname: 'Ventilator ' + (1 + i), manufacturer: 'MedTech Corp', department: 'ICU', risklevel: risks[i], status: statuses[i] };
      }),
  },
  "/inventory/consumables/icu": {
    ui: 5,
    title: "ICU Consumables", description: "Critical care lines, catheters, and emergency kits.",
    stats: [{ label: "Total Value Stocked", color: "text-blue-400", value: "$24,500" }, { label: "Critical Items", color: "text-amber-400", value: "45" }, { label: "Breaches", color: "text-emerald-400", value: "0" }],
    columns: [["Item Name", "itemname"], ["Category", "category"], ["Min Level", "minlevel"], ["Current Stock", "currentstock"], ["Last Reordered", "lastreordered"]],
    badge: ["Status", "status", {"Optimal":"emerald","Low Stock":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const current = (150 - i * 20);
        const statuses = current < 100 ? 'Low Stock' : 'Optimal';
        return { itemname: 'CVC Kit ' + (1 + i), category: 'Critical Care', minlevel: '100', currentstock: current.toString(), lastreordered: '15 Jun 2026', status: statuses };
      }),
  },
  "/inventory/consumables/laboratory": {
    ui: 5,
    title: "Laboratory Consumables", description: "Reagents, vacutainers, slides, and testing chemicals.",
    stats: [{ label: "Reagent Stock Value", color: "text-blue-400", value: "$8,400" }, { label: "Near Expiry", color: "text-amber-400", value: "2 Lots" }, { label: "Stockouts", color: "text-emerald-400", value: "0" }],
    columns: [["Item Name", "itemname"], ["Lot No", "lotno"], ["Tests Remaining (Est)", "testsremainingest"], ["Current Stock", "currentstock"], ["Expiry Date", "expirydate"]],
    badge: ["Status", "status", {"Valid":"emerald","Near Expiry":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i === 3 ? 'Near Expiry' : 'Valid';
        return { itemname: 'Reagent ' + (1 + i), lotno: 'LOT-LB-' + i, testsremainingest: (2000 - i * 200).toString(), currentstock: (50 + i * 5) + ' Vials', expirydate: statuses === 'Near Expiry' ? '15 Aug 2026' : '31 Dec 2027', status: statuses };
      }),
  },
  "/inventory/consumables/ot": {
    ui: 5,
    title: "OT Consumables", description: "Specialized tracking for surgical sutures, drapes, and single-use tools.",
    stats: [{ label: "Value (MTD)", color: "text-emerald-400", value: "$12,400" }, { label: "Stockouts", color: "text-emerald-400", value: "0" }, { label: "Pending Restock", color: "text-amber-400", value: "12" }],
    columns: [["Item Name", "itemname"], ["Category", "category"], ["Sterility Required", "sterilityrequired"], ["Current Stock", "currentstock"], ["Avg Per Surgery", "avgpersurgery"]],
    badge: ["Status", "status", {"Adequate":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemname: 'Suture Type ' + (1 + i), category: 'Surgical', sterilityrequired: 'Yes', currentstock: (800 - i * 100).toString(), avgpersurgery: (2 + i).toString(), status: 'Adequate' };
      }),
  },
  "/inventory/consumables/radiology": {
    ui: 5,
    title: "Radiology Consumables", description: "Films, contrast media, and protective gear.",
    stats: [{ label: "Total Consumed", color: "text-blue-400", value: "450 Units" }, { label: "Contrast Stock", color: "text-emerald-400", value: "Adequate" }, { label: "Pending Orders", color: "text-amber-400", value: "3" }],
    columns: [["Item Name", "itemname"], ["Category", "category"], ["Usage (MTD)", "usagemtd"], ["Current Stock", "currentstock"], ["Reorder Level", "reorderlevel"]],
    badge: ["Status", "status", {"Adequate":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemname: 'Contrast Media ' + (1 + i), category: 'Injections', usagemtd: (120 - i * 10).toString(), currentstock: (300 - i * 20).toString(), reorderlevel: '100', status: 'Adequate' };
      }),
  },
  "/inventory/consumables/ward": {
    ui: 5,
    title: "Ward Consumables", description: "Usage tracking for cotton, syringes, IV sets in general wards.",
    stats: [{ label: "Top Item", color: "text-blue-400", value: "10ml Syringe" }, { label: "Value Consumed", color: "text-emerald-400", value: "$4,500" }, { label: "Low Stock Alerts", color: "text-amber-400", value: "8" }],
    columns: [["Item Name", "itemname"], ["Total Issued (MTD)", "totalissuedmtd"], ["Avg Daily Use", "avgdailyuse"], ["Current Stock", "currentstock"], ["Stockout Risk", "stockoutrisk"]],
    badge: ["Status", "status", {"Adequate":"emerald","Low Stock":"amber","Reorder Suggested":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Adequate', 'Low Stock', 'Adequate', 'Adequate', 'Reorder Suggested'];
        return { itemname: 'Consumable ' + (1 + i), totalissuedmtd: (5000 - i * 500).toString(), avgdailyuse: (200 - i * 20).toString(), currentstock: statuses[i] === 'Low Stock' ? '300' : '1500', stockoutrisk: statuses[i] === 'Adequate' ? 'Low' : 'High', status: statuses[i] };
      }),
  },
  "/inventory/grn/history": {
    ui: 5,
    title: "GRN History", description: "Historical archive of all processed and finalized Goods Receipt Notes.",
    stats: [{ label: "Total GRNs (YTD)", color: "text-blue-400", value: "1,450" }, { label: "Sent to Accounts", color: "text-emerald-400", value: "1,440" }, { label: "Pending Invoices", color: "text-amber-400", value: "10" }],
    columns: [["GRN No", "grnno"], ["PO No", "pono"], ["Vendor", "vendor"], ["Received Date", "receiveddate"], ["Invoice No", "invoiceno"]],
    badge: ["Status", "status", {"Finalized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { grnno: 'GRN-' + (1001 + i), pono: 'PO-' + (7001 + i), vendor: 'Supplier ' + (1 + i), receiveddate: '15 Jun 2026', invoiceno: 'INV-' + (9988 + i), status: 'Finalized' };
      }),
  },
  "/inventory/grn/note": {
    ui: 5,
    title: "Goods Receipt Note (GRN)", description: "Creation of GRNs against Purchase Orders upon receiving vendor deliveries.",
    stats: [{ label: "GRNs Created Today", color: "text-blue-400", value: "18" }, { label: "Total Value", color: "text-emerald-400", value: "$45,000" }, { label: "Short Deliveries", color: "text-amber-400", value: "2" }],
    columns: [["GRN No", "grnno"], ["PO No", "pono"], ["Vendor", "vendor"], ["Received Date", "receiveddate"], ["Total Value", "totalvalue"]],
    badge: ["Status", "status", {"Draft":"amber","Pending QA":"amber","Stock Updated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Draft', 'Pending QA', 'Stock Updated', 'Stock Updated', 'Draft'];
        return { grnno: 'GRN-' + (2001 + i), pono: 'PO-' + (8001 + i), vendor: 'Supplier ' + (1 + i), receiveddate: 'Today', totalvalue: '$' + (1500 + i * 500), status: statuses[i] };
      }),
  },
  "/inventory/grn/pending": {
    ui: 5,
    title: "Pending GRN", description: "Deliveries that arrived but lack PO matching or are awaiting QA checks.",
    stats: [{ label: "Pending at Gate", color: "text-amber-400", value: "4" }, { label: "PO Mismatch", color: "text-red-400", value: "1" }, { label: "Cleared Today", color: "text-emerald-400", value: "15" }],
    columns: [["Delivery ID", "deliveryid"], ["Carrier/Vendor", "carriervendor"], ["Gate Entry Date", "gateentrydate"], ["Packages", "packages"], ["Reason Pending", "reasonpending"]],
    badge: ["Status", "status", {"Pending Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const reasons = ['Awaiting QA', 'No PO Reference', 'Awaiting QA', 'System Down', 'Awaiting QA'];
        return { deliveryid: 'DEL-' + (3001 + i), carriervendor: 'Carrier ' + (1 + i), gateentrydate: 'Today', packages: (5 + i).toString(), reasonpending: reasons[i], status: 'Pending Review' };
      }),
  },
  "/inventory/grn/verification": {
    ui: 5,
    title: "GRN Verification", description: "Quality assurance and quantity verification for received goods.",
    stats: [{ label: "Pending Verification", color: "text-amber-400", value: "6" }, { label: "Verified Today", color: "text-emerald-400", value: "12" }, { label: "Rejected Lots", color: "text-red-400", value: "1" }],
    columns: [["GRN No", "grnno"], ["Vendor", "vendor"], ["Items Checked", "itemschecked"], ["Discrepancies", "discrepancies"], ["Verified By", "verifiedby"]],
    badge: ["Status", "status", {"Verified":"emerald","Pending Verification":"amber","Rejected (Damage)":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Verified', 'Pending Verification', 'Rejected (Damage)', 'Verified', 'Verified'];
        return { grnno: 'GRN-' + (2001 + i), vendor: 'Supplier ' + (1 + i), itemschecked: (10 + i * 2).toString(), discrepancies: statuses[i].includes('Rejected') ? '1 Box Damaged' : 'None', verifiedby: statuses[i].includes('Pending') ? '-' : 'QA Team', status: statuses[i] };
      }),
  },
  "/inventory/issue/approved": {
    ui: 5,
    title: "Approved Issues", description: "Requisitions approved and ready for warehouse picking and dispatch.",
    stats: [{ label: "Ready to Pick", color: "text-blue-400", value: "12" }, { label: "Picking Active", color: "text-amber-400", value: "5" }, { label: "Ready for Dispatch", color: "text-emerald-400", value: "8" }],
    columns: [["Req No", "reqno"], ["Department", "department"], ["Approved By", "approvedby"], ["Pick Slip No", "pickslipno"], ["Assigned Picker", "assignedpicker"]],
    badge: ["Status", "status", {"Ready to Pick":"amber","Picking":"amber","Ready for Dispatch":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Ready to Pick', 'Picking', 'Ready to Pick', 'Ready for Dispatch', 'Picking'];
        return { reqno: 'REQ-' + (2001 + i), department: 'Ward ' + (1 + i), approvedby: 'Dr. Admin', pickslipno: 'PS-' + (101 + i), assignedpicker: statuses[i] !== 'Ready to Pick' ? 'Staff ' + (1 + i) : '-', status: statuses[i] };
      }),
  },
  "/inventory/issue/history": {
    ui: 5,
    title: "Issue History", description: "Complete historical log of all items issued to departments.",
    stats: [{ label: "Total Slips (YTD)", color: "text-blue-400", value: "4,500" }, { label: "Most Frequent Dept", color: "text-gray-400", value: "General Ward" }, { label: "Total Value (YTD)", color: "text-emerald-400", value: "$450K" }],
    columns: [["Slip No", "slipno"], ["Date", "date"], ["Department", "department"], ["Items Issued", "itemsissued"], ["Total Value", "totalvalue"]],
    badge: ["Status", "status", {"Finalized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { slipno: 'SLP-' + (1001 + i), date: '0' + (1 + i) + ' Jul 2026', department: 'Dept ' + (1 + i), itemsissued: (15 + i * 2).toString(), totalvalue: '$' + (300 + i * 100), status: 'Finalized' };
      }),
  },
  "/inventory/issue/pending": {
    ui: 5,
    title: "Pending Requests", description: "Requisitions awaiting approval or stock fulfillment.",
    stats: [{ label: "Pending Fulfillment", color: "text-amber-400", value: "15" }, { label: "Partial Stock", color: "text-red-400", value: "4" }, { label: "Awaiting Auth", color: "text-blue-400", value: "5" }],
    columns: [["Req No", "reqno"], ["Department", "department"], ["Items Pending", "itemspending"], ["Oldest Request", "oldestrequest"], ["Bottleneck", "bottleneck"]],
    badge: ["Status", "status", {"Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const bottlenecks = ['Awaiting Stock', 'Pending HOD Auth', 'Awaiting Stock', 'Picking in Progress', 'Pending HOD Auth'];
        return { reqno: 'REQ-' + (1001 + i), department: 'Dept ' + (1 + i), itemspending: (5 + i).toString(), oldestrequest: '2 Days Ago', bottleneck: bottlenecks[i], status: 'Pending' };
      }),
  },
  "/inventory/issue/request": {
    ui: 5,
    title: "Issue Request", description: "Material requisitions placed by wards, OT, and departments.",
    stats: [{ label: "New Requests", color: "text-blue-400", value: "24" }, { label: "Urgent", color: "text-red-400", value: "3" }, { label: "Processed Today", color: "text-emerald-400", value: "45" }],
    columns: [["Req No", "reqno"], ["Department", "department"], ["Requested Date", "requesteddate"], ["Total Items", "totalitems"], ["Priority", "priority"]],
    badge: ["Status", "status", {"Pending":"amber","Approved":"emerald","Processing":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending', 'Approved', 'Pending', 'Processing', 'Approved'];
        return { reqno: 'REQ-' + (1001 + i), department: 'Ward ' + (1 + i), requesteddate: 'Today', totalitems: (10 + i * 2).toString(), priority: i === 0 ? 'Urgent' : 'Routine', status: statuses[i] };
      }),
  },
  "/inventory/issue/slip": {
    ui: 5,
    title: "Issue Slip", description: "Final document generated upon handover of items to the requesting department.",
    stats: [{ label: "Slips Generated Today", color: "text-blue-400", value: "42" }, { label: "Total Value Issued", color: "text-emerald-400", value: "$12,400" }, { label: "Pending Signatures", color: "text-amber-400", value: "2" }],
    columns: [["Slip No", "slipno"], ["Req No", "reqno"], ["Department", "department"], ["Total Value Issued", "totalvalueissued"], ["Handed Over To", "handedoverto"]],
    badge: ["Status", "status", {"Issued":"emerald","Pending Signature":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Issued', 'Issued', 'Pending Signature', 'Issued', 'Issued'];
        return { slipno: 'SLP-' + (3001 + i), reqno: 'REQ-' + (1501 + i), department: 'ICU ' + (1 + i), totalvalueissued: '$' + (200 + i * 50), handedoverto: 'Nurse ' + (1 + i), status: statuses[i] };
      }),
  },
  "/inventory/master/barcode": {
    ui: 5,
    title: "Barcode / QR Code", description: "Generation and management of inventory tracking barcodes.",
    stats: [{ label: "Barcodes Generated", color: "text-blue-400", value: "14,500" }, { label: "QR Codes", color: "text-emerald-400", value: "3,200" }, { label: "Missing Barcodes", color: "text-amber-400", value: "12" }],
    columns: [["Item Code", "itemcode"], ["Item Name", "itemname"], ["Barcode ID", "barcodeid"], ["Format", "format"], ["Last Printed", "lastprinted"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemcode: 'ITM-' + (1001 + i), itemname: 'Item ' + (i + 1), barcodeid: 'BC-' + (8001 + i), format: 'Code 128', lastprinted: '01 Jul 2026', status: 'Active' };
      }),
  },
  "/inventory/master/brands": {
    ui: 5,
    title: "Brands", description: "Approved brands and manufacturers for inventory items.",
    stats: [{ label: "Approved Brands", color: "text-blue-400", value: "450" }, { label: "Blacklisted", color: "text-red-400", value: "12" }, { label: "Pending Review", color: "text-amber-400", value: "8" }],
    columns: [["Brand ID", "brandid"], ["Brand Name", "brandname"], ["Manufacturer", "manufacturer"], ["Items Supplied", "itemssupplied"], ["Avg Rating", "avgrating"]],
    badge: ["Status", "status", {"Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { brandid: 'BRD-' + (5001 + i), brandname: 'BrandX ' + (i + 1), manufacturer: 'Global Corp', itemssupplied: (15 + i * 5).toString(), avgrating: (4.5 - i * 0.1).toFixed(1) + '/5', status: 'Approved' };
      }),
  },
  "/inventory/master/categories": {
    ui: 5,
    title: "Categories", description: "Hierarchical categorization of inventory items.",
    stats: [{ label: "Total Categories", color: "text-blue-400", value: "45" }, { label: "Sub-Categories", color: "text-blue-400", value: "120" }, { label: "Highest Value", color: "text-emerald-400", value: "Surgicals" }],
    columns: [["Category ID", "categoryid"], ["Category Name", "categoryname"], ["Parent Category", "parentcategory"], ["Items Linked", "itemslinked"], ["Inventory Value", "inventoryvalue"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['Surgical Consumables', 'Medical Gases', 'Stationery', 'Housekeeping', 'Linen'];
        return { categoryid: 'CAT-' + (2001 + i), categoryname: cats[i], parentcategory: 'General Inventory', itemslinked: (500 + i * 100).toString(), inventoryvalue: '$' + (50000 - i * 5000), status: 'Active' };
      }),
  },
  "/inventory/master/items": {
    ui: 5,
    title: "Item Master", description: "Central catalog of all inventory items across the hospital.",
    stats: [{ label: "Total Items", color: "text-blue-400", value: "15,400" }, { label: "Active Items", color: "text-emerald-400", value: "14,200" }, { label: "Pending Approval", color: "text-amber-400", value: "15" }],
    columns: [["Item Code", "itemcode"], ["Item Name", "itemname"], ["Category", "category"], ["Unit", "unit"], ["Base Price", "baseprice"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const categories = ['Surgical Consumables', 'Medical Equipment', 'Stationery', 'Housekeeping', 'Linen'];
        return { itemcode: 'ITM-' + (1001 + i), itemname: 'Inventory Item ' + (i + 1), category: categories[i], unit: 'Pieces', baseprice: '$' + (10 + i * 5), status: 'Active' };
      }),
  },
  "/inventory/master/manufacturers": {
    ui: 5,
    title: "Manufacturers", description: "Database of all OEMs and producers supplying to the hospital.",
    stats: [{ label: "Total Manufacturers", color: "text-blue-400", value: "120" }, { label: "Domestic", color: "text-emerald-400", value: "85" }, { label: "International", color: "text-amber-400", value: "35" }],
    columns: [["Mfg ID", "mfgid"], ["Company Name", "companyname"], ["Country", "country"], ["Brands Owned", "brandsowned"], ["Contracts Active", "contractsactive"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { mfgid: 'MFG-' + (6001 + i), companyname: 'MegaCorp ' + (i + 1), country: i % 2 === 0 ? 'Domestic' : 'International', brandsowned: (2 + i).toString(), contractsactive: 'Yes', status: 'Active' };
      }),
  },
  "/inventory/master/mapping": {
    ui: 5,
    title: "Item Mapping", description: "Linking inventory items to specific departments, suppliers, or billing codes.",
    stats: [{ label: "Unmapped Items", color: "text-amber-400", value: "45" }, { label: "Fully Mapped", color: "text-emerald-400", value: "15,355" }, { label: "Supplier Conflicts", color: "text-red-400", value: "2" }],
    columns: [["Mapping ID", "mappingid"], ["Item Name", "itemname"], ["Mapped Department", "mappeddepartment"], ["Preferred Supplier", "preferredsupplier"], ["Billing Code", "billingcode"]],
    badge: ["Status", "status", {"Mapped":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['ICU', 'OT', 'General Ward', 'Laboratory', 'Radiology'];
        return { mappingid: 'MAP-' + (7001 + i), itemname: 'Inventory Item ' + (i + 1), mappeddepartment: depts[i], preferredsupplier: 'Supplier ' + (i + 1), billingcode: 'BIL-' + (990 + i), status: 'Mapped' };
      }),
  },
  "/inventory/master/subcategories": {
    ui: 5,
    title: "Sub Categories", description: "Detailed sub-classifications under main inventory categories.",
    stats: [{ label: "Total Sub-categories", color: "text-blue-400", value: "120" }, { label: "Newly Added", color: "text-emerald-400", value: "4" }, { label: "Empty Categories", color: "text-emerald-400", value: "0" }],
    columns: [["Sub ID", "subid"], ["Sub Category Name", "subcategoryname"], ["Parent Category", "parentcategory"], ["Items Linked", "itemslinked"], ["Manager", "manager"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const subs = ['Syringes', 'Oxygen Cylinders', 'Printer Paper', 'Cleaning Liquids', 'Bed Sheets'];
        const parents = ['Surgical Consumables', 'Medical Gases', 'Stationery', 'Housekeeping', 'Linen'];
        return { subid: 'SUB-' + (3001 + i), subcategoryname: subs[i], parentcategory: parents[i], itemslinked: (50 + i * 10).toString(), manager: 'Admin', status: 'Active' };
      }),
  },
  "/inventory/master/units": {
    ui: 5,
    title: "Units of Measure", description: "Base units and conversion mapping (e.g., Box to Pieces).",
    stats: [{ label: "Total Units", color: "text-blue-400", value: "35" }, { label: "Conversion Rules", color: "text-emerald-400", value: "85" }, { label: "Pending Sync", color: "text-emerald-400", value: "0" }],
    columns: [["Unit Code", "unitcode"], ["Unit Name", "unitname"], ["Base Unit", "baseunit"], ["Conversion Rate", "conversionrate"], ["Used For", "usedfor"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const units = ['Box (100)', 'Pack (50)', 'Dozen', 'Kilogram', 'Liter'];
        const bases = ['Piece', 'Piece', 'Piece', 'Gram', 'Milliliter'];
        const rates = ['1 Box = 100 Pcs', '1 Pack = 50 Pcs', '1 Doz = 12 Pcs', '1 Kg = 1000 g', '1 L = 1000 ml'];
        return { unitcode: 'UOM-' + (4001 + i), unitname: units[i], baseunit: bases[i], conversionrate: rates[i], usedfor: 'Purchasing', status: 'Active' };
      }),
  },
  "/inventory/reports/abc": {
    ui: 5,
    title: "ABC Analysis", description: "Categorizing inventory by value (A=70% value, B=20%, C=10%).",
    stats: [{ label: "A-Class Items", color: "text-blue-400", value: "15%" }, { label: "A-Class Value", color: "text-emerald-400", value: "70%" }, { label: "C-Class Items", color: "text-gray-400", value: "55%" }],
    columns: [["Category", "category"], ["Item Count", "itemcount"], ["% of Total Items", "oftotalitems"], ["Value Locked", "valuelocked"], ["% of Total Value", "oftotalvalue"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 3 }).map((_, i) => {
        const cats = ['A (High Value)', 'B (Medium Value)', 'C (Low Value)'];
        const items = ['15%', '30%', '55%'];
        const values = ['70%', '20%', '10%'];
        return { category: cats[i], itemcount: (1500 + i * 2000).toString(), oftotalitems: items[i], valuelocked: '$' + (700000 / (i + 1)).toFixed(0), oftotalvalue: values[i], status: 'Generated' };
      }),
  },
  "/inventory/reports/batch": {
    ui: 5,
    title: "Batch Report", description: "Traceability report for specific batches (useful for recalls).",
    stats: [{ label: "Active Batches", color: "text-blue-400", value: "4,500" }, { label: "Recalled Batches", color: "text-red-400", value: "1" }, { label: "Fully Consumed", color: "text-emerald-400", value: "120 (Mo)" }],
    columns: [["Batch No", "batchno"], ["Item Name", "itemname"], ["Supplier", "supplier"], ["Received Date", "receiveddate"], ["Qty Remaining", "qtyremaining"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { batchno: 'BTH-' + (1000 + i), itemname: 'Item ' + (1 + i), supplier: 'Vendor ' + (1 + i), receiveddate: '01 Jan 2026', qtyremaining: (150 - i * 20).toString(), status: 'Generated' };
      }),
  },
  "/inventory/reports/consumption": {
    ui: 5,
    title: "Item Consumption", description: "Detailed view of which items are being consumed at what rate.",
    stats: [{ label: "Consumption Growth", color: "text-amber-400", value: "+5.2%" }, { label: "Highest Volume", color: "text-blue-400", value: "Syringes" }, { label: "Cost Impact", color: "text-red-400", value: "$45K" }],
    columns: [["Item Name", "itemname"], ["Category", "category"], ["Avg Daily Use", "avgdailyuse"], ["Total (MTD)", "totalmtd"], ["Projected (EoM)", "projectedeom"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemname: 'Consumable ' + (1 + i), category: 'General', avgdailyuse: (200 - i * 20).toString(), totalmtd: (3000 - i * 300).toString(), projectedeom: (6000 - i * 600).toString(), status: 'Generated' };
      }),
  },
  "/inventory/reports/dead-stock": {
    ui: 5,
    title: "Dead Stock Report", description: "Items with zero movement over the last 6 to 12 months.",
    stats: [{ label: "Dead Stock Value", color: "text-red-400", value: "$15,400" }, { label: "Total Items", color: "text-amber-400", value: "320" }, { label: "Liquidated (YTD)", color: "text-emerald-400", value: "$4,500" }],
    columns: [["Item Name", "itemname"], ["Last Moved Date", "lastmoveddate"], ["Current Qty", "currentqty"], ["Capital Locked", "capitallocked"], ["Suggested Action", "suggestedaction"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemname: 'Rare Item ' + (1 + i), lastmoveddate: '01 Jan 2025', currentqty: '50', capitallocked: '$' + (1000 - i * 100), suggestedaction: 'Return to Vendor / Write-off', status: 'Generated' };
      }),
  },
  "/inventory/reports/department": {
    ui: 5,
    title: "Department Consumption", description: "Breakdown of inventory usage and costs by requesting department.",
    stats: [{ label: "Costliest Dept", color: "text-red-400", value: "OT" }, { label: "Within Budget", color: "text-emerald-400", value: "15 Depts" }, { label: "Over Budget", color: "text-amber-400", value: "2 Depts" }],
    columns: [["Department", "department"], ["Total Requisitions", "totalrequisitions"], ["Items Issued", "itemsissued"], ["Total Cost", "totalcost"], ["Budget Variance", "budgetvariance"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['OT', 'ICU', 'General Ward', 'Lab', 'Radiology'];
        return { department: depts[i], totalrequisitions: (150 - i * 20).toString(), itemsissued: (5000 - i * 800).toString(), totalcost: '$' + (45000 - i * 5000), budgetvariance: i === 0 ? '+5% (Over)' : 'Under Budget', status: 'Generated' };
      }),
  },
  "/inventory/reports/fast-moving": {
    ui: 5,
    title: "Fast Moving Items", description: "High turnover items requiring frequent reordering and tight monitoring.",
    stats: [{ label: "Fast Moving Items", color: "text-emerald-400", value: "145" }, { label: "Stockouts Averted", color: "text-blue-400", value: "12" }, { label: "Urgent Orders", color: "text-red-400", value: "4" }],
    columns: [["Item Name", "itemname"], ["Daily Consumption", "dailyconsumption"], ["Current Stock", "currentstock"], ["Days of Stock", "daysofstock"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemname: 'Item ' + (1 + i), dailyconsumption: '500', currentstock: '1500', daysofstock: '3 Days', status: 'Generated' };
      }),
  },
  "/inventory/reports/fsn": {
    ui: 5,
    title: "FSN Analysis", description: "Categorizing by issue rate (F=Fast, S=Slow, N=Non-moving).",
    stats: [{ label: "Fast Moving", color: "text-emerald-400", value: "20%" }, { label: "Non-moving", color: "text-red-400", value: "5%" }, { label: "Warehouse Space Freed", color: "text-blue-400", value: "450 SqFt" }],
    columns: [["Category", "category"], ["Item Count", "itemcount"], ["Avg Turnover Time", "avgturnovertime"], ["Space Utilization", "spaceutilization"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 3 }).map((_, i) => {
        const cats = ['Fast Moving (F)', 'Slow Moving (S)', 'Non-Moving (N)'];
        return { category: cats[i], itemcount: (3000 - i * 1000).toString(), avgturnovertime: i === 0 ? '< 30 Days' : (i === 1 ? '1-6 Months' : '> 6 Months'), spaceutilization: (60 - i * 20) + '%', status: 'Generated' };
      }),
  },
  "/inventory/reports/movement": {
    ui: 5,
    title: "Stock Movement", description: "Analysis of inward and outward flow of goods over a specific period.",
    stats: [{ label: "Fastest Moving", color: "text-blue-400", value: "Gloves" }, { label: "Total Issues", color: "text-emerald-400", value: "12,400" }, { label: "Total Receipts", color: "text-amber-400", value: "15,000" }],
    columns: [["Item Name", "itemname"], ["Opening Qty", "openingqty"], ["Qty Received", "qtyreceived"], ["Qty Issued", "qtyissued"], ["Closing Qty", "closingqty"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemname: 'Item ' + (1 + i), openingqty: '500', qtyreceived: '1000', qtyissued: '1200', closingqty: '300', status: 'Generated' };
      }),
  },
  "/inventory/reports/slow-moving": {
    ui: 5,
    title: "Slow Moving Items", description: "Items with very low turnover, tying up warehouse space and capital.",
    stats: [{ label: "Slow Moving Value", color: "text-amber-400", value: "$45,000" }, { label: "Total Items", color: "text-blue-400", value: "850" }, { label: "Optimized", color: "text-emerald-400", value: "12%" }],
    columns: [["Item Name", "itemname"], ["Avg Monthly Use", "avgmonthlyuse"], ["Current Stock", "currentstock"], ["Months of Stock", "monthsofstock"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemname: 'Item ' + (1 + i), avgmonthlyuse: '5', currentstock: '150', monthsofstock: '30 Months', status: 'Generated' };
      }),
  },
  "/inventory/reports/stock": {
    ui: 5,
    title: "Stock Report", description: "Comprehensive snapshot of all current inventory levels.",
    stats: [{ label: "Total Items Tracked", color: "text-blue-400", value: "15,400" }, { label: "Availability", color: "text-emerald-400", value: "94%" }, { label: "Reports Run", color: "text-gray-400", value: "45 (Today)" }],
    columns: [["Category", "category"], ["Total Items", "totalitems"], ["In Stock", "instock"], ["Low Stock", "lowstock"], ["Out of Stock", "outofstock"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['Surgicals', 'Medical Gases', 'Consumables', 'Stationery', 'Linen'];
        return { category: cats[i], totalitems: (5000 - i * 1000).toString(), instock: (4800 - i * 950).toString(), lowstock: (150 - i * 30).toString(), outofstock: (50 - i * 20).toString(), status: 'Generated' };
      }),
  },
  "/inventory/reports/valuation": {
    ui: 5,
    title: "Stock Valuation", description: "Financial worth of the inventory based on FIFO, LIFO, or Weighted Average.",
    stats: [{ label: "Total Asset Value", color: "text-emerald-400", value: "$1.2M" }, { label: "Main Store %", color: "text-blue-400", value: "65%" }, { label: "Valuation Method", color: "text-gray-400", value: "Weighted Avg" }],
    columns: [["Warehouse", "warehouse"], ["Surgicals Value", "surgicalsvalue"], ["Consumables Value", "consumablesvalue"], ["Assets Value", "assetsvalue"], ["Total Value", "totalvalue"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { warehouse: 'Store ' + (1 + i), surgicalsvalue: '$' + (200000 - i * 20000), consumablesvalue: '$' + (50000 - i * 5000), assetsvalue: '$' + (100000 - i * 10000), totalvalue: '$' + (350000 - i * 35000), status: 'Generated' };
      }),
  },
  "/inventory/reports/xyz": {
    ui: 5,
    title: "XYZ Analysis", description: "Categorizing inventory by demand predictability (X=Steady, Y=Variable, Z=Erratic).",
    stats: [{ label: "X-Class (Steady)", color: "text-emerald-400", value: "45%" }, { label: "Z-Class (Erratic)", color: "text-amber-400", value: "15%" }, { label: "Optimization Ops", color: "text-blue-400", value: "120" }],
    columns: [["Category", "category"], ["Item Count", "itemcount"], ["Predictability", "predictability"], ["Suggested Buffer", "suggestedbuffer"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 3 }).map((_, i) => {
        const cats = ['X (Steady)', 'Y (Variable)', 'Z (Erratic)'];
        const buffers = ['Low', 'Medium', 'High'];
        return { category: cats[i], itemcount: (4500 - i * 1500).toString(), predictability: cats[i].split('(')[1].replace(')', ''), suggestedbuffer: buffers[i], status: 'Generated' };
      }),
  },
  "/inventory/returns/approval": {
    ui: 5,
    title: "Return Approval", description: "Inventory manager authorization for department returns and stock crediting.",
    stats: [{ label: "Awaiting Auth", color: "text-amber-400", value: "5" }, { label: "QA Pending", color: "text-blue-400", value: "2" }, { label: "Stock Credited", color: "text-emerald-400", value: "15" }],
    columns: [["Return Req No", "returnreqno"], ["Department", "department"], ["Items", "items"], ["Est. Value", "estvalue"], ["QA Required", "qarequired"]],
    badge: ["Status", "status", {"Awaiting Auth":"amber","Pending QA":"amber","Stock Credited":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Awaiting Auth', 'Pending QA', 'Stock Credited', 'Awaiting Auth', 'Stock Credited'];
        return { returnreqno: 'RTR-' + (1001 + i), department: 'OT ' + (1 + i), items: (2 + i).toString(), estvalue: '$' + (50 + i * 20), qarequired: i % 2 === 0 ? 'Yes' : 'No', status: statuses[i] };
      }),
  },
  "/inventory/returns/damaged": {
    ui: 5,
    title: "Damaged Returns", description: "Specific handling for items returned by departments due to breakage or faults.",
    stats: [{ label: "Damaged Items (Mo)", color: "text-red-400", value: "18" }, { label: "Pending Inspection", color: "text-amber-400", value: "4" }, { label: "Written Off", color: "text-gray-400", value: "12" }],
    columns: [["Return ID", "returnid"], ["Department", "department"], ["Item Name", "itemname"], ["Fault Description", "faultdescription"], ["Action Taken", "actiontaken"]],
    badge: ["Status", "status", {"Under Review":"amber","Resolved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const actions = ['Pending Inspection', 'Written Off', 'Sent for Repair', 'Written Off', 'Pending Inspection'];
        return { returnid: 'DRT-' + (3001 + i), department: 'Lab', itemname: 'Thermometer', faultdescription: 'Broken Glass', actiontaken: actions[i], status: actions[i].includes('Pending') ? 'Under Review' : 'Resolved' };
      }),
  },
  "/inventory/returns/history": {
    ui: 5,
    title: "Return History", description: "Historical log of all accepted department returns.",
    stats: [{ label: "Total Returns (YTD)", color: "text-blue-400", value: "320" }, { label: "Total Value Credited", color: "text-emerald-400", value: "$12,400" }, { label: "Top Returning Dept", color: "text-gray-400", value: "OT" }],
    columns: [["Return ID", "returnid"], ["Date", "date"], ["Department", "department"], ["Reason", "reason"], ["Credited Value", "creditedvalue"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { returnid: 'RET-' + (2001 + i), date: '0' + (1 + i) + ' Jul 2026', department: 'Dept ' + (1 + i), reason: 'Excess', creditedvalue: '$' + (100 + i * 50), status: 'Completed' };
      }),
  },
  "/inventory/returns/request": {
    ui: 5,
    title: "Return Requests", description: "Requests from departments to return excess or wrong items to the main store.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "8" }, { label: "Approved Today", color: "text-emerald-400", value: "12" }, { label: "Rejected", color: "text-red-400", value: "1" }],
    columns: [["Return Req No", "returnreqno"], ["Department", "department"], ["Reason", "reason"], ["Total Items", "totalitems"], ["Initiated By", "initiatedby"]],
    badge: ["Status", "status", {"Pending Review":"amber","Approved":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const reasons = ['Excess Stock', 'Wrong Item Ordered', 'Near Expiry', 'Excess Stock', 'Wrong Item Ordered'];
        const statuses = ['Pending Review', 'Approved', 'Pending Review', 'Approved', 'Rejected'];
        return { returnreqno: 'RTR-' + (1001 + i), department: 'Ward ' + (1 + i), reason: reasons[i], totalitems: (5 + i).toString(), initiatedby: 'Nurse ' + (1 + i), status: statuses[i] };
      }),
  },
  "/inventory/settings/approval": {
    ui: 5,
    title: "Approval Rules", description: "Workflow routing for stock issues, adjustments, and returns based on value.",
    stats: [{ label: "Active Workflows", color: "text-blue-400", value: "8" }, { label: "Avg Approval Time", color: "text-emerald-400", value: "4.5 Hrs" }, { label: "Bottlenecks", color: "text-emerald-400", value: "0" }],
    columns: [["Rule Name", "rulename"], ["Trigger Condition", "triggercondition"], ["Approver 1", "approver1"], ["Approver 2", "approver2"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const rules = ['High Value Issue', 'Stock Adjustment', 'Asset Transfer', 'Write-off Approval', 'Routine Issue'];
        const conditions = ['Value > $1000', 'Qty Variance > 5%', 'Any', 'Value > $100', 'Any'];
        return { rulename: rules[i], triggercondition: conditions[i], approver1: 'Store Manager', approver2: i === 4 ? '-' : 'Finance Head', status: 'Active' };
      }),
  },
  "/inventory/settings/barcode": {
    ui: 5,
    title: "Barcode Settings", description: "Configure barcode formats, label sizes, and printer integrations.",
    stats: [{ label: "Default Format", color: "text-blue-400", value: "Code 128" }, { label: "Printers Online", color: "text-emerald-400", value: "4/4" }, { label: "Labels Printed", color: "text-gray-400", value: "1.2M" }],
    columns: [["Setting Name", "settingname"], ["Configuration", "configuration"], ["Format", "format"], ["Printer Mapped", "printermapped"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const settings = ['Primary Barcode Format', 'Label Size (Main Store)', 'QR Code Enabled', 'Auto-print on GRN', 'Shelf Label Format'];
        const configs = ['Code 128', '50x25mm', 'Yes', 'Yes', '100x50mm'];
        return { settingname: settings[i], configuration: configs[i], format: 'System Config', printermapped: 'Zebra ZD420', status: 'Active' };
      }),
  },
  "/inventory/settings/general": {
    ui: 5,
    title: "Inventory Settings", description: "Global configurations like valuation method (FIFO/LIFO) and currency.",
    stats: [{ label: "Valuation Method", color: "text-blue-400", value: "Weighted Avg" }, { label: "Base Currency", color: "text-emerald-400", value: "USD ($)" }, { label: "Auto-Reorder", color: "text-emerald-400", value: "Enabled" }],
    columns: [["Setting", "setting"], ["Description", "description"], ["Current Value", "currentvalue"], ["Last Updated", "lastupdated"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const settings = ['Valuation Method', 'Base Currency', 'Negative Stock Allowed', 'Auto-Reorder Generation', 'Default Warehouse'];
        const values = ['Weighted Average', 'USD ($)', 'No', 'Yes', 'Main Central Store'];
        return { setting: settings[i], description: 'System global setting', currentvalue: values[i], lastupdated: '01 Jan 2026', status: 'Active' };
      }),
  },
  "/inventory/settings/number-series": {
    ui: 5,
    title: "Number Series", description: "Define auto-generated formats for GRNs, POs, and Transfer slips.",
    stats: [{ label: "Active Series", color: "text-blue-400", value: "12" }, { label: "Documents Generated", color: "text-emerald-400", value: "14,500" }, { label: "Conflicts", color: "text-emerald-400", value: "0" }],
    columns: [["Document Type", "documenttype"], ["Prefix", "prefix"], ["Starting Number", "startingnumber"], ["Current Number", "currentnumber"], ["Suffix", "suffix"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const docs = ['Goods Receipt (GRN)', 'Purchase Order (PO)', 'Issue Request', 'Transfer Slip', 'Stock Adjustment'];
        const prefixes = ['GRN-', 'PO-', 'REQ-', 'TRF-', 'ADJ-'];
        return { documenttype: docs[i], prefix: prefixes[i], startingnumber: '1000', currentnumber: (2500 + i * 500).toString(), suffix: '-26', status: 'Active' };
      }),
  },
  "/inventory/stock/adjustment": {
    ui: 5,
    title: "Stock Adjustment", description: "Manual adjustments to align system records with physical counts.",
    stats: [{ label: "Pending Approval", color: "text-amber-400", value: "8" }, { label: "Adjustments (Mo)", color: "text-blue-400", value: "45" }, { label: "Net Impact", color: "text-red-400", value: "-$450" }],
    columns: [["Adj ID", "adjid"], ["Item Name", "itemname"], ["Reason", "reason"], ["System Qty", "systemqty"], ["Adjusted Qty", "adjustedqty"]],
    badge: ["Status", "status", {"Approved":"emerald","Pending Approval":"amber","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Approved', 'Pending Approval', 'Approved', 'Rejected', 'Pending Approval'];
        return { adjid: 'ADJ-' + (1001 + i), itemname: 'Item ' + (i + 1), reason: 'Damage / Breakage', systemqty: '100', adjustedqty: '98', status: statuses[i] };
      }),
  },
  "/inventory/stock/availability": {
    ui: 5,
    title: "Stock Availability Search", description: "Quick search tool to check item availability across multiple warehouses.",
    stats: [{ label: "Searches Today", color: "text-blue-400", value: "1,200" }, { label: "Available Rate", color: "text-emerald-400", value: "94%" }, { label: "Not Found", color: "text-amber-400", value: "6%" }],
    columns: [["Item Name", "itemname"], ["Main Store", "mainstore"], ["OT Store", "otstore"], ["ICU Store", "icustore"], ["Ward Store", "wardstore"]],
    badge: ["Status", "status", {"Available":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemname: 'Item ' + (i + 1), mainstore: (50 + i * 10).toString(), otstore: (10 + i).toString(), icustore: (5 + i).toString(), wardstore: '0', status: 'Available' };
      }),
  },
  "/inventory/stock/closing": {
    ui: 5,
    title: "Closing Stock", description: "Final stock balances and valuations at the end of a financial period.",
    stats: [{ label: "Previous FY Closing", color: "text-emerald-400", value: "$1.05M" }, { label: "Draft Reports", color: "text-amber-400", value: "2" }, { label: "Finalized", color: "text-blue-400", value: "4" }],
    columns: [["Period", "period"], ["Warehouse", "warehouse"], ["Total Items", "totalitems"], ["Total Value", "totalvalue"], ["Depreciation", "depreciation"]],
    badge: ["Status", "status", {"Draft":"amber","Finalized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Draft', 'Finalized', 'Finalized', 'Draft', 'Finalized'];
        return { period: 'FY 2025-26', warehouse: 'Store ' + (1 + i), totalitems: (1100 + i * 100).toString(), totalvalue: '$' + (190000 + i * 10000), depreciation: '$' + (5000 + i * 500), status: statuses[i] };
      }),
  },
  "/inventory/stock/current": {
    ui: 5,
    title: "Current Stock", description: "Real-time overview of inventory levels across all items and stores.",
    stats: [{ label: "Total Stock Value", color: "text-emerald-400", value: "$1.2M" }, { label: "Low Stock Items", color: "text-amber-400", value: "45" }, { label: "Out of Stock", color: "text-red-400", value: "12" }],
    columns: [["Item Name", "itemname"], ["Warehouse", "warehouse"], ["Current Qty", "currentqty"], ["Unit", "unit"], ["Total Value", "totalvalue"]],
    badge: ["Status", "status", {"In Stock":"emerald","Low Stock":"amber","Out of Stock":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const qty = (100 - i * 25);
        const statuses = qty <= 0 ? 'Out of Stock' : (qty < 30 ? 'Low Stock' : 'In Stock');
        return { itemname: 'Inventory Item ' + (i + 1), warehouse: 'Main Central Store', currentqty: qty.toString(), unit: 'Pcs', totalvalue: '$' + (qty * 10), status: statuses };
      }),
  },
  "/inventory/stock/ledger": {
    ui: 5,
    title: "Stock Ledger", description: "Detailed transaction history (in/out) for every inventory item.",
    stats: [{ label: "Transactions Today", color: "text-blue-400", value: "450" }, { label: "Goods Received", color: "text-emerald-400", value: "120" }, { label: "Issues", color: "text-amber-400", value: "330" }],
    columns: [["Date", "date"], ["Item Name", "itemname"], ["Transaction Type", "transactiontype"], ["Qty In", "qtyin"], ["Qty Out", "qtyout"], ["Balance", "balance"]],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['GRN Receipt', 'Dept Issue', 'Stock Transfer', 'Dept Issue', 'Adjustment'];
        const inqty = types[i] === 'GRN Receipt' ? '100' : '-';
        const outqty = types[i].includes('Issue') ? '20' : '-';
        return { date: 'Today', itemname: 'Surgical Mask', transactiontype: types[i], qtyin: inqty, qtyout: outqty, balance: (500 - i * 20).toString() };
      }),
  },
  "/inventory/stock/min-max": {
    ui: 5,
    title: "Minimum & Maximum Stock", description: "Tracking inventory limits to prevent stockouts or overstocking.",
    stats: [{ label: "Overstocked Items", color: "text-amber-400", value: "12" }, { label: "Understocked (Critical)", color: "text-red-400", value: "5" }, { label: "Optimal", color: "text-emerald-400", value: "95%" }],
    columns: [["Item Name", "itemname"], ["Min Level", "minlevel"], ["Max Level", "maxlevel"], ["Current Stock", "currentstock"], ["Variance", "variance"]],
    badge: ["Status", "status", {"Overstocked":"red","Optimal":"emerald","Critical Low":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const current = (50 - i * 15);
        const statuses = current < 10 ? 'Critical Low' : (current > 40 ? 'Overstocked' : 'Optimal');
        return { itemname: 'Item ' + (1 + i), minlevel: '10', maxlevel: '40', currentstock: current.toString(), variance: statuses === 'Optimal' ? '0' : (current - 25).toString(), status: statuses };
      }),
  },
  "/inventory/stock/opening": {
    ui: 5,
    title: "Opening Stock", description: "Initial stock balances recorded at the start of a financial period.",
    stats: [{ label: "FY Opening Value", color: "text-emerald-400", value: "$1.1M" }, { label: "Stores Finalized", color: "text-blue-400", value: "6/6" }, { label: "Variances Pending", color: "text-emerald-400", value: "0" }],
    columns: [["Period", "period"], ["Warehouse", "warehouse"], ["Total Items", "totalitems"], ["Total Value", "totalvalue"], ["Verified By", "verifiedby"]],
    badge: ["Status", "status", {"Finalized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { period: 'FY 2026-27', warehouse: 'Store ' + (1 + i), totalitems: (1200 + i * 100).toString(), totalvalue: '$' + (200000 + i * 10000), verifiedby: 'Auditor', status: 'Finalized' };
      }),
  },
  "/inventory/stock/reorder": {
    ui: 5,
    title: "Reorder Level Monitoring", description: "Monitoring items that have fallen below their defined reorder points.",
    stats: [{ label: "Items Below ROL", color: "text-red-400", value: "85" }, { label: "POs Generated", color: "text-emerald-400", value: "40" }, { label: "Pending Action", color: "text-amber-400", value: "45" }],
    columns: [["Item Name", "itemname"], ["Current Stock", "currentstock"], ["Reorder Level", "reorderlevel"], ["Suggested Order", "suggestedorder"], ["Vendor", "vendor"]],
    badge: ["Status", "status", {"Pending PR":"amber","PR Raised":"amber","PO Generated":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending PR', 'PR Raised', 'PO Generated', 'Pending PR', 'PO Generated'];
        return { itemname: 'Item ' + (1 + i), currentstock: (10 + i * 2).toString(), reorderlevel: '20', suggestedorder: '100', vendor: 'Supplier X', status: statuses[i] };
      }),
  },
  "/inventory/transfers/asset": {
    ui: 5,
    title: "Asset Transfer", description: "Logging the physical movement of capital assets between departments.",
    stats: [{ label: "Movements Pending", color: "text-amber-400", value: "4" }, { label: "Moved Today", color: "text-emerald-400", value: "6" }, { label: "Total Asset Moves", color: "text-blue-400", value: "45 (YTD)" }],
    columns: [["Transfer ID", "transferid"], ["Asset Name", "assetname"], ["From Dept", "fromdept"], ["To Dept", "todept"], ["Authorized By", "authorizedby"]],
    badge: ["Status", "status", {"Moved":"blue","Pending Auth":"amber","In Transit":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Moved', 'Pending Auth', 'Moved', 'In Transit', 'Moved'];
        return { transferid: 'ATR-' + (7001 + i), assetname: 'ECG Machine ' + (1 + i), fromdept: 'Ward A', todept: 'ER', authorizedby: 'Admin', status: statuses[i] };
      }),
  },
  "/inventory/transfers/icu": {
    ui: 5,
    title: "ICU Transfer", description: "Transferring critical care consumables to ICU sub-stores.",
    stats: [{ label: "Transfers Today", color: "text-blue-400", value: "15" }, { label: "Awaiting Auth", color: "text-amber-400", value: "1" }, { label: "Completed", color: "text-emerald-400", value: "14" }],
    columns: [["Transfer ID", "transferid"], ["ICU Unit", "icuunit"], ["Category", "category"], ["Total Items", "totalitems"], ["Requested By", "requestedby"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { transferid: 'ITR-' + (6001 + i), icuunit: 'Medical ICU ' + (1 + i), category: 'Critical Meds', totalitems: (30 + i * 5).toString(), requestedby: 'Dr. ICU Head', status: 'Completed' };
      }),
  },
  "/inventory/transfers/laboratory": {
    ui: 5,
    title: "Laboratory Transfer", description: "Issuing reagents and lab consumables to pathology.",
    stats: [{ label: "Lab Requests", color: "text-blue-400", value: "8" }, { label: "Fulfilled", color: "text-emerald-400", value: "6" }, { label: "Pending Auth", color: "text-amber-400", value: "2" }],
    columns: [["Transfer ID", "transferid"], ["Lab Section", "labsection"], ["Reagents Issued", "reagentsissued"], ["Batch/Lot No", "batchlotno"], ["Expiry Checked", "expirychecked"]],
    badge: ["Status", "status", {"Fulfilled":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const sections = ['Biochemistry', 'Hematology', 'Microbiology', 'Biochemistry', 'Pathology'];
        return { transferid: 'LTR-' + (4001 + i), labsection: sections[i], reagentsissued: (10 + i).toString(), batchlotno: 'LOT-' + (500 + i), expirychecked: 'Yes', status: 'Fulfilled' };
      }),
  },
  "/inventory/transfers/ot": {
    ui: 5,
    title: "OT Transfer", description: "Critical supply lines to Operating Theaters for surgical kits and implants.",
    stats: [{ label: "Urgent Transfers", color: "text-red-400", value: "2" }, { label: "OT Fulfilled", color: "text-emerald-400", value: "12" }, { label: "Missing Items", color: "text-emerald-400", value: "0" }],
    columns: [["Transfer ID", "transferid"], ["OT Number", "otnumber"], ["Kit Type", "kittype"], ["Total Value", "totalvalue"], ["Priority", "priority"]],
    badge: ["Status", "status", {"Delivered":"emerald","In Transit":"amber","Pending Prep":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Delivered', 'Delivered', 'In Transit', 'Delivered', 'Pending Prep'];
        return { transferid: 'OTR-' + (5001 + i), otnumber: 'OT ' + (1 + i), kittype: 'Ortho Implant Kit', totalvalue: '$' + (1200 + i * 300), priority: i === 2 ? 'High' : 'Routine', status: statuses[i] };
      }),
  },
  "/inventory/transfers/pharmacy": {
    ui: 5,
    title: "Pharmacy Transfer", description: "Transferring drugs and surgicals to the pharmacy stock.",
    stats: [{ label: "Pending Dispatches", color: "text-amber-400", value: "2" }, { label: "Completed Today", color: "text-emerald-400", value: "14" }, { label: "Total Value", color: "text-blue-400", value: "$5,400" }],
    columns: [["Transfer ID", "transferid"], ["Pharmacy Branch", "pharmacybranch"], ["Drugs Transferred", "drugstransferred"], ["Total Value", "totalvalue"], ["Dispatched By", "dispatchedby"]],
    badge: ["Status", "status", {"Received":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { transferid: 'PTR-' + (3001 + i), pharmacybranch: i % 2 === 0 ? 'OPD Pharmacy' : 'ER Pharmacy', drugstransferred: (100 + i * 50).toString(), totalvalue: '$' + (800 + i * 200), dispatchedby: 'Store Keeper', status: 'Received' };
      }),
  },
  "/inventory/transfers/store": {
    ui: 5,
    title: "Store Transfer", description: "Transfer of bulk stock between the main central store and sub-stores.",
    stats: [{ label: "Transfers Today", color: "text-blue-400", value: "24" }, { label: "Pending Receipts", color: "text-amber-400", value: "5" }, { label: "Completed", color: "text-emerald-400", value: "19" }],
    columns: [["Transfer ID", "transferid"], ["From Store", "fromstore"], ["To Store", "tostore"], ["Total Items", "totalitems"], ["Initiated By", "initiatedby"]],
    badge: ["Status", "status", {"In Transit":"amber","Received":"emerald","Draft":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In Transit', 'Received', 'In Transit', 'Received', 'Draft'];
        return { transferid: 'TRF-' + (1001 + i), fromstore: 'Main Store', tostore: 'Sub-store ' + (1 + i), totalitems: (50 + i * 10).toString(), initiatedby: 'Admin', status: statuses[i] };
      }),
  },
  "/inventory/transfers/ward": {
    ui: 5,
    title: "Ward Transfer", description: "Moving general stock and consumables to inpatient wards.",
    stats: [{ label: "Issues to Wards", color: "text-blue-400", value: "45" }, { label: "Stock Value", color: "text-emerald-400", value: "$1,200" }, { label: "Awaiting Ack", color: "text-amber-400", value: "3" }],
    columns: [["Transfer ID", "transferid"], ["Ward Name", "wardname"], ["Category", "category"], ["Total Items", "totalitems"], ["Received By", "receivedby"]],
    badge: ["Status", "status", {"Received":"emerald","Awaiting Ack":"amber","Dispatched":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Received', 'Awaiting Ack', 'Received', 'Received', 'Dispatched'];
        return { transferid: 'WTR-' + (2001 + i), wardname: 'Ward ' + (1 + i), category: 'Consumables', totalitems: (20 + i * 5).toString(), receivedby: statuses[i] === 'Received' ? 'Nurse Head' : '-', status: statuses[i] };
      }),
  },
  "/inventory/verification/count": {
    ui: 5,
    title: "Physical Stock Count", description: "Data entry sheets for periodic manual counting of warehouse items.",
    stats: [{ label: "Active Audits", color: "text-amber-400", value: "2" }, { label: "Completed (YTD)", color: "text-emerald-400", value: "12" }, { label: "Overall Accuracy", color: "text-blue-400", value: "98.5%" }],
    columns: [["Count ID", "countid"], ["Warehouse", "warehouse"], ["Category Audited", "categoryaudited"], ["Total Items", "totalitems"], ["Progress", "progress"]],
    badge: ["Status", "status", {"In Progress":"amber","Completed":"emerald","Pending Start":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 4 }).map((_, i) => {
        const statuses = ['In Progress', 'Completed', 'Pending Start', 'Completed'];
        return { countid: 'CNT-' + (1001 + i), warehouse: 'Store ' + (1 + i), categoryaudited: 'All', totalitems: '1500', progress: statuses[i] === 'Completed' ? '100%' : (i * 25) + '%', status: statuses[i] };
      }),
  },
  "/inventory/verification/cycle": {
    ui: 5,
    title: "Cycle Count", description: "Daily partial counts (ABC analysis based) to maintain continuous accuracy.",
    stats: [{ label: "Counts Today", color: "text-blue-400", value: "45" }, { label: "Accuracy (Week)", color: "text-emerald-400", value: "99.1%" }, { label: "Discrepancies", color: "text-amber-400", value: "3" }],
    columns: [["Cycle ID", "cycleid"], ["Date", "date"], ["Aisle/Rack", "aislerack"], ["Items Counted", "itemscounted"], ["Variances Found", "variancesfound"]],
    badge: ["Status", "status", {"Matched":"gray","Variance Logged":"blue","Pending Auth":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Matched', 'Variance Logged', 'Matched', 'Matched', 'Pending Auth'];
        return { cycleid: 'CYC-' + (2001 + i), date: 'Today', aislerack: 'Aisle ' + (1 + i), itemscounted: '100', variancesfound: statuses[i] === 'Matched' ? '0' : '2', status: statuses[i] };
      }),
  },
  "/inventory/verification/reconciliation": {
    ui: 5,
    title: "Stock Reconciliation", description: "Approving adjustments to sync system stock with physically verified counts.",
    stats: [{ label: "Pending Approvals", color: "text-amber-400", value: "4" }, { label: "Reconciled (Mo)", color: "text-blue-400", value: "18" }, { label: "Value Written Off", color: "text-red-400", value: "$450" }],
    columns: [["Recon ID", "reconid"], ["Count Ref", "countref"], ["Total Variances", "totalvariances"], ["Net Value Impact", "netvalueimpact"], ["Approver", "approver"]],
    badge: ["Status", "status", {"Pending":"amber","Approved":"gray","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending', 'Approved', 'Pending', 'Rejected', 'Approved'];
        return { reconid: 'REC-' + (3001 + i), countref: 'CYC-' + (2000 + i), totalvariances: (2 + i).toString(), netvalueimpact: '-$' + (50 + i * 10), approver: statuses[i] === 'Pending' ? '-' : 'Finance Head', status: statuses[i] };
      }),
  },
  "/inventory/verification/variance": {
    ui: 5,
    title: "Variance Report", description: "Analytical report highlighting frequently mismatched items or stores.",
    stats: [{ label: "Highest Variance Item", color: "text-red-400", value: "Syringes" }, { label: "Best Store Accuracy", color: "text-emerald-400", value: "OT Store" }, { label: "Total Shrinkage", color: "text-amber-400", value: "1.2%" }],
    columns: [["Item Name", "itemname"], ["Warehouse", "warehouse"], ["System Qty", "systemqty"], ["Physical Qty", "physicalqty"], ["Variance %", "variance"]],
    badge: ["Status", "status", {"Flagged":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemname: 'Item ' + (1 + i), warehouse: 'Main Store', systemqty: '100', physicalqty: '98', variance: '-2%', status: 'Flagged' };
      }),
  },
  "/inventory/warehouse/bins": {
    ui: 5,
    title: "Bin Management", description: "Granular tracking of specific bins/boxes on racks for fast picking.",
    stats: [{ label: "Total Bins", color: "text-blue-400", value: "2,400" }, { label: "Empty Bins", color: "text-amber-400", value: "145" }, { label: "Overfilled Bins", color: "text-red-400", value: "4" }],
    columns: [["Bin ID", "binid"], ["Rack ID", "rackid"], ["Assigned Item", "assigneditem"], ["Current Qty", "currentqty"], ["Bin Capacity", "bincapacity"]],
    badge: ["Status", "status", {"In Use":"gray","Empty":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i === 3 ? 'Empty' : 'In Use';
        return { binid: 'BIN-' + (4001 + i), rackid: 'RCK-301', assigneditem: statuses === 'Empty' ? '-' : 'Item ' + (1 + i), currentqty: statuses === 'Empty' ? '0' : '45', bincapacity: '50', status: statuses };
      }),
  },
  "/inventory/warehouse/list": {
    ui: 5,
    title: "Warehouses", description: "List of all main stores, sub-stores, and off-site warehouses.",
    stats: [{ label: "Total Facilities", color: "text-blue-400", value: "6" }, { label: "Avg Utilization", color: "text-emerald-400", value: "78%" }, { label: "At Capacity", color: "text-red-400", value: "1" }],
    columns: [["Warehouse ID", "warehouseid"], ["Name", "name"], ["Location", "location"], ["Total Racks", "totalracks"], ["Capacity Utilized", "capacityutilized"]],
    badge: ["Status", "status", {"Active":"emerald","At Capacity":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const stores = ['Main Central Store', 'OT Sub-store', 'ICU Consumables', 'Lab Store', 'General Ward Store'];
        const utilizations = ['85%', '92%', '60%', '75%', '98%'];
        const statuses = utilizations[i] === '98%' ? 'At Capacity' : 'Active';
        return { warehouseid: 'WH-' + (101 + i), name: stores[i], location: 'Block ' + String.fromCharCode(65 + i), totalracks: (10 + i * 5).toString(), capacityutilized: utilizations[i], status: statuses };
      }),
  },
  "/inventory/warehouse/locations": {
    ui: 5,
    title: "Store Locations", description: "Detailed mapping of aisles and zones within a warehouse.",
    stats: [{ label: "Total Zones", color: "text-blue-400", value: "45" }, { label: "Cold Storage Zones", color: "text-emerald-400", value: "4" }, { label: "Audit Required", color: "text-amber-400", value: "2" }],
    columns: [["Location ID", "locationid"], ["Warehouse", "warehouse"], ["Zone/Aisle", "zoneaisle"], ["Category Restricted", "categoryrestricted"], ["Current Items", "currentitems"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { locationid: 'LOC-' + (201 + i), warehouse: 'Main Central Store', zoneaisle: 'Aisle ' + (1 + i), categoryrestricted: i === 0 ? 'Flammables' : 'None', currentitems: (500 + i * 100).toString(), status: 'Active' };
      }),
  },
  "/inventory/warehouse/racks": {
    ui: 5,
    title: "Rack Management", description: "Configuration and capacity tracking of physical storage racks.",
    stats: [{ label: "Total Racks", color: "text-blue-400", value: "320" }, { label: "Overloaded", color: "text-emerald-400", value: "0" }, { label: "Maintenance", color: "text-amber-400", value: "2" }],
    columns: [["Rack ID", "rackid"], ["Location", "location"], ["Rack Type", "racktype"], ["Max Weight", "maxweight"], ["Utilization", "utilization"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Heavy Duty', 'Standard Shelving', 'Cold Rack', 'Heavy Duty', 'Standard Shelving'];
        return { rackid: 'RCK-' + (301 + i), location: 'Aisle 1', racktype: types[i], maxweight: '500 kg', utilization: (60 + i * 5) + '%', status: 'Active' };
      }),
  },
};

export default pages;
