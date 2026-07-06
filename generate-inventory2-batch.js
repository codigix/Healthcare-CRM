const fs = require('fs');
const path = require('path');

const config = [
  // Internal Transfers
  {
    path: 'inventory/transfers/store', title: 'Store Transfer', desc: 'Transfer of bulk stock between the main central store and sub-stores.',
    cols: ['Transfer ID', 'From Store', 'To Store', 'Total Items', 'Initiated By', 'Status'],
    stats: [{ label: 'Transfers Today', val: '24', col: 'text-blue-400' }, { label: 'Pending Receipts', val: '5', col: 'text-amber-400' }, { label: 'Completed', val: '19', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In Transit', 'Received', 'In Transit', 'Received', 'Draft'];
      return { transferid: 'TRF-' + (1001+i), fromstore: 'Main Store', tostore: 'Sub-store ' + (1+i), totalitems: (50+i*10).toString(), initiatedby: 'Admin', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/transfers/ward', title: 'Ward Transfer', desc: 'Moving general stock and consumables to inpatient wards.',
    cols: ['Transfer ID', 'Ward Name', 'Category', 'Total Items', 'Received By', 'Status'],
    stats: [{ label: 'Issues to Wards', val: '45', col: 'text-blue-400' }, { label: 'Stock Value', val: '$1,200', col: 'text-emerald-400' }, { label: 'Awaiting Ack', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Received', 'Awaiting Ack', 'Received', 'Received', 'Dispatched'];
      return { transferid: 'WTR-' + (2001+i), wardname: 'Ward ' + (1+i), category: 'Consumables', totalitems: (20+i*5).toString(), receivedby: statuses[i]==='Received'?'Nurse Head':'-', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/transfers/pharmacy', title: 'Pharmacy Transfer', desc: 'Transferring drugs and surgicals to the pharmacy stock.',
    cols: ['Transfer ID', 'Pharmacy Branch', 'Drugs Transferred', 'Total Value', 'Dispatched By', 'Status'],
    stats: [{ label: 'Pending Dispatches', val: '2', col: 'text-amber-400' }, { label: 'Completed Today', val: '14', col: 'text-emerald-400' }, { label: 'Total Value', val: '$5,400', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { transferid: 'PTR-' + (3001+i), pharmacybranch: i%2===0?'OPD Pharmacy':'ER Pharmacy', drugstransferred: (100+i*50).toString(), totalvalue: '$' + (800+i*200), dispatchedby: 'Store Keeper', status: 'Received' };
    })`
  },
  {
    path: 'inventory/transfers/laboratory', title: 'Laboratory Transfer', desc: 'Issuing reagents and lab consumables to pathology.',
    cols: ['Transfer ID', 'Lab Section', 'Reagents Issued', 'Batch/Lot No', 'Expiry Checked', 'Status'],
    stats: [{ label: 'Lab Requests', val: '8', col: 'text-blue-400' }, { label: 'Fulfilled', val: '6', col: 'text-emerald-400' }, { label: 'Pending Auth', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const sections = ['Biochemistry', 'Hematology', 'Microbiology', 'Biochemistry', 'Pathology'];
      return { transferid: 'LTR-' + (4001+i), labsection: sections[i], reagentsissued: (10+i).toString(), batchlotno: 'LOT-' + (500+i), expirychecked: 'Yes', status: 'Fulfilled' };
    })`
  },
  {
    path: 'inventory/transfers/ot', title: 'OT Transfer', desc: 'Critical supply lines to Operating Theaters for surgical kits and implants.',
    cols: ['Transfer ID', 'OT Number', 'Kit Type', 'Total Value', 'Priority', 'Status'],
    stats: [{ label: 'Urgent Transfers', val: '2', col: 'text-red-400' }, { label: 'OT Fulfilled', val: '12', col: 'text-emerald-400' }, { label: 'Missing Items', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Delivered', 'Delivered', 'In Transit', 'Delivered', 'Pending Prep'];
      return { transferid: 'OTR-' + (5001+i), otnumber: 'OT ' + (1+i), kittype: 'Ortho Implant Kit', totalvalue: '$' + (1200+i*300), priority: i===2?'High':'Routine', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/transfers/icu', title: 'ICU Transfer', desc: 'Transferring critical care consumables to ICU sub-stores.',
    cols: ['Transfer ID', 'ICU Unit', 'Category', 'Total Items', 'Requested By', 'Status'],
    stats: [{ label: 'Transfers Today', val: '15', col: 'text-blue-400' }, { label: 'Awaiting Auth', val: '1', col: 'text-amber-400' }, { label: 'Completed', val: '14', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { transferid: 'ITR-' + (6001+i), icuunit: 'Medical ICU ' + (1+i), category: 'Critical Meds', totalitems: (30+i*5).toString(), requestedby: 'Dr. ICU Head', status: 'Completed' };
    })`
  },
  {
    path: 'inventory/transfers/asset', title: 'Asset Transfer', desc: 'Logging the physical movement of capital assets between departments.',
    cols: ['Transfer ID', 'Asset Name', 'From Dept', 'To Dept', 'Authorized By', 'Status'],
    stats: [{ label: 'Movements Pending', val: '4', col: 'text-amber-400' }, { label: 'Moved Today', val: '6', col: 'text-emerald-400' }, { label: 'Total Asset Moves', val: '45 (YTD)', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Moved', 'Pending Auth', 'Moved', 'In Transit', 'Moved'];
      return { transferid: 'ATR-' + (7001+i), assetname: 'ECG Machine ' + (1+i), fromdept: 'Ward A', todept: 'ER', authorizedby: 'Admin', status: statuses[i] };
    })`
  },

  // Consumables
  {
    path: 'inventory/consumables/ward', title: 'Ward Consumables', desc: 'Usage tracking for cotton, syringes, IV sets in general wards.',
    cols: ['Item Name', 'Total Issued (MTD)', 'Avg Daily Use', 'Current Stock', 'Stockout Risk', 'Status'],
    stats: [{ label: 'Top Item', val: '10ml Syringe', col: 'text-blue-400' }, { label: 'Value Consumed', val: '$4,500', col: 'text-emerald-400' }, { label: 'Low Stock Alerts', val: '8', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Adequate', 'Low Stock', 'Adequate', 'Adequate', 'Reorder Suggested'];
      return { itemname: 'Consumable ' + (1+i), totalissuedmtd: (5000-i*500).toString(), avgdailyuse: (200-i*20).toString(), currentstock: statuses[i]==='Low Stock'?'300':'1500', stockoutrisk: statuses[i]==='Adequate'?'Low':'High', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/consumables/ot', title: 'OT Consumables', desc: 'Specialized tracking for surgical sutures, drapes, and single-use tools.',
    cols: ['Item Name', 'Category', 'Sterility Required', 'Current Stock', 'Avg Per Surgery', 'Status'],
    stats: [{ label: 'Value (MTD)', val: '$12,400', col: 'text-emerald-400' }, { label: 'Stockouts', val: '0', col: 'text-emerald-400' }, { label: 'Pending Restock', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Suture Type ' + (1+i), category: 'Surgical', sterilityrequired: 'Yes', currentstock: (800-i*100).toString(), avgpersurgery: (2+i).toString(), status: 'Adequate' };
    })`
  },
  {
    path: 'inventory/consumables/icu', title: 'ICU Consumables', desc: 'Critical care lines, catheters, and emergency kits.',
    cols: ['Item Name', 'Category', 'Min Level', 'Current Stock', 'Last Reordered', 'Status'],
    stats: [{ label: 'Total Value Stocked', val: '$24,500', col: 'text-blue-400' }, { label: 'Critical Items', val: '45', col: 'text-amber-400' }, { label: 'Breaches', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const current = (150 - i*20);
      const statuses = current < 100 ? 'Low Stock' : 'Optimal';
      return { itemname: 'CVC Kit ' + (1+i), category: 'Critical Care', minlevel: '100', currentstock: current.toString(), lastreordered: '15 Jun 2026', status: statuses };
    })`
  },
  {
    path: 'inventory/consumables/laboratory', title: 'Laboratory Consumables', desc: 'Reagents, vacutainers, slides, and testing chemicals.',
    cols: ['Item Name', 'Lot No', 'Tests Remaining (Est)', 'Current Stock', 'Expiry Date', 'Status'],
    stats: [{ label: 'Reagent Stock Value', val: '$8,400', col: 'text-blue-400' }, { label: 'Near Expiry', val: '2 Lots', col: 'text-amber-400' }, { label: 'Stockouts', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===3?'Near Expiry':'Valid';
      return { itemname: 'Reagent ' + (1+i), lotno: 'LOT-LB-' + i, testsremainingest: (2000-i*200).toString(), currentstock: (50+i*5) + ' Vials', expirydate: statuses==='Near Expiry'?'15 Aug 2026':'31 Dec 2027', status: statuses };
    })`
  },
  {
    path: 'inventory/consumables/radiology', title: 'Radiology Consumables', desc: 'Films, contrast media, and protective gear.',
    cols: ['Item Name', 'Category', 'Usage (MTD)', 'Current Stock', 'Reorder Level', 'Status'],
    stats: [{ label: 'Total Consumed', val: '450 Units', col: 'text-blue-400' }, { label: 'Contrast Stock', val: 'Adequate', col: 'text-emerald-400' }, { label: 'Pending Orders', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Contrast Media ' + (1+i), category: 'Injections', usagemtd: (120-i*10).toString(), currentstock: (300-i*20).toString(), reorderlevel: '100', status: 'Adequate' };
    })`
  },

  // Assets
  {
    path: 'inventory/assets/register', title: 'Asset Register', desc: 'Master ledger of all hospital capital equipment and furniture.',
    cols: ['Asset ID', 'Asset Name', 'Category', 'Purchase Date', 'Current Value', 'Status'],
    stats: [{ label: 'Total Assets', val: '4,500', col: 'text-blue-400' }, { label: 'Active Assets', val: '4,320', col: 'text-emerald-400' }, { label: 'Under Maintenance', val: '45', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Active', 'In Repair', 'Active', 'Written Off', 'Active'];
      return { assetid: 'AST-' + (10001+i), assetname: 'Hospital Bed ' + (1+i), category: 'Furniture', purchasedate: '01 Jan 2020', currentvalue: '$' + (500-i*50), status: statuses[i] };
    })`
  },
  {
    path: 'inventory/assets/allocation', title: 'Asset Allocation', desc: 'Tracking which department or staff member currently holds an asset.',
    cols: ['Asset ID', 'Asset Name', 'Allocated To', 'Department', 'Allocation Date', 'Status'],
    stats: [{ label: 'Allocated Assets', val: '4,320', col: 'text-blue-400' }, { label: 'Unassigned', val: '120', col: 'text-amber-400' }, { label: 'Recently Moved', val: '15', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['ICU', 'General Ward', 'Admin', 'OT', 'Lab'];
      return { assetid: 'AST-' + (20001+i), assetname: 'Desktop PC ' + (1+i), allocatedto: 'Staff ' + (1+i), department: depts[i], allocationdate: '15 Mar 2023', status: 'Allocated' };
    })`
  },
  {
    path: 'inventory/assets/movement', title: 'Asset Movement', desc: 'Log of physical relocations for tracking and auditing.',
    cols: ['Movement ID', 'Asset Name', 'From Location', 'To Location', 'Date', 'Status'],
    stats: [{ label: 'Moves This Month', val: '45', col: 'text-blue-400' }, { label: 'Pending Approval', val: '4', col: 'text-amber-400' }, { label: 'Disputed', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { movementid: 'MOV-' + (3001+i), assetname: 'Patient Monitor ' + (1+i), fromlocation: 'Ward A', tolocation: 'ICU', date: '0' + (1+i) + ' Jul 2026', status: 'Completed' };
    })`
  },
  {
    path: 'inventory/assets/verification', title: 'Asset Verification', desc: 'Annual physical audits to reconcile the asset register.',
    cols: ['Audit ID', 'Department', 'Assets Found', 'Assets Missing', 'Auditor', 'Status'],
    stats: [{ label: 'Departments Audited', val: '14/20', col: 'text-blue-400' }, { label: 'Missing Assets', val: '3', col: 'text-red-400' }, { label: 'Verification Rate', val: '99.5%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'Completed', 'In Progress', 'Scheduled', 'Completed'];
      return { auditid: 'AUD-' + (4001+i), department: 'Dept ' + (1+i), assetsfound: (150-i*10).toString(), assetsmissing: statuses[i]==='Completed'?'0':'-', auditor: 'Finance Team', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/assets/disposal', title: 'Asset Disposal', desc: 'Formally writing off and auctioning/destroying obsolete assets.',
    cols: ['Disposal ID', 'Asset Name', 'Reason', 'Depreciated Value', 'Recovery Amount', 'Status'],
    stats: [{ label: 'Pending Disposal', val: '45', col: 'text-amber-400' }, { label: 'Disposed (YTD)', val: '120', col: 'text-gray-400' }, { label: 'Value Recovered', val: '$4,500', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Approval', 'Auctioned', 'Scrapped', 'Pending Approval', 'Auctioned'];
      return { disposalid: 'DSP-' + (5001+i), assetname: 'Old Server ' + (1+i), reason: 'Obsolete', depreciatedvalue: '$0', recoveryamount: statuses[i]==='Auctioned'?'$'+(100+i*50):'$0', status: statuses[i] };
    })`
  },

  // Biomedical Equipment
  {
    path: 'inventory/biomedical/register', title: 'Equipment Register', desc: 'Specific register for medical devices requiring clinical calibration.',
    cols: ['Equip ID', 'Equipment Name', 'Manufacturer', 'Department', 'Risk Level', 'Status'],
    stats: [{ label: 'Total Equipment', val: '850', col: 'text-blue-400' }, { label: 'High Risk', val: '120', col: 'text-red-400' }, { label: 'Active', val: '810', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const risks = ['High', 'Medium', 'Low', 'High', 'Medium'];
      const statuses = ['Active', 'In Repair', 'Active', 'Active', 'Down'];
      return { equipid: 'BIO-' + (1001+i), equipmentname: 'Ventilator ' + (1+i), manufacturer: 'MedTech Corp', department: 'ICU', risklevel: risks[i], status: statuses[i] };
    })`
  },
  {
    path: 'inventory/biomedical/allocation', title: 'Equipment Allocation', desc: 'Real-time location of mobile biomedical equipment (e.g., portable X-ray).',
    cols: ['Equip ID', 'Equipment Name', 'Current Location', 'Allocated Date', 'Return Due', 'Status'],
    stats: [{ label: 'In Use', val: '45', col: 'text-blue-400' }, { label: 'Available', val: '12', col: 'text-emerald-400' }, { label: 'Overdue Return', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In Use', 'Available', 'Overdue', 'In Use', 'In Use'];
      return { equipid: 'BIO-' + (2001+i), equipmentname: 'Portable USG ' + (1+i), currentlocation: statuses[i]==='Available'?'Bio-Med Store':'Ward ' + (1+i), allocateddate: 'Today', returndue: 'Today 5PM', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/biomedical/calibration', title: 'Calibration', desc: 'Scheduling and logging mandatory clinical calibration tests.',
    cols: ['Equip ID', 'Equipment Name', 'Last Calibrated', 'Next Due Date', 'Agency', 'Status'],
    stats: [{ label: 'Calibration Due', val: '15', col: 'text-amber-400' }, { label: 'Passed (MTD)', val: '45', col: 'text-emerald-400' }, { label: 'Failed Calibration', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===1?'Due Soon':(i===3?'Overdue':'Valid');
      return { equipid: 'BIO-' + (3001+i), equipmentname: 'Patient Monitor ' + (1+i), lastcalibrated: '01 Jan 2026', nextduedate: statuses==='Due Soon'?'15 Jul 2026':'01 Jan 2027', agency: 'MedCalib Inc', status: statuses };
    })`
  },
  {
    path: 'inventory/biomedical/maintenance', title: 'Preventive Maintenance', desc: 'Planned Preventive Maintenance (PPM) schedules for all medical devices.',
    cols: ['PPM ID', 'Equipment Name', 'Schedule Date', 'Completed Date', 'Engineer', 'Status'],
    stats: [{ label: 'PPM Scheduled', val: '34', col: 'text-blue-400' }, { label: 'Completed (Mo)', val: '120', col: 'text-emerald-400' }, { label: 'Overdue PPM', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'Scheduled', 'Overdue', 'In Progress', 'Completed'];
      return { ppmid: 'PPM-' + (4001+i), equipmentname: 'Defibrillator ' + (1+i), scheduledate: '10 Jul 2026', completeddate: statuses[i]==='Completed'?'10 Jul 2026':'-', engineer: 'Eng. Smith', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/biomedical/breakdown', title: 'Breakdown History', desc: 'Ticketing and repair logs for sudden equipment failures.',
    cols: ['Ticket ID', 'Equipment Name', 'Reported Date', 'Issue Description', 'Downtime', 'Status'],
    stats: [{ label: 'Active Tickets', val: '8', col: 'text-amber-400' }, { label: 'Avg Repair Time', val: '4.5 Hrs', col: 'text-blue-400' }, { label: 'Repaired Today', val: '3', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Open', 'In Repair', 'Resolved', 'Awaiting Parts', 'Resolved'];
      return { ticketid: 'TKT-' + (5001+i), equipmentname: 'Syringe Pump ' + (1+i), reporteddate: 'Today', issuedescription: 'Power Failure', downtime: statuses[i]==='Resolved'?'3 Hrs':'Ongoing', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/biomedical/amc', title: 'AMC Tracking', desc: 'Management of Annual Maintenance Contracts and warranty expirations.',
    cols: ['Contract ID', 'Vendor', 'Equipment Covered', 'Valid From', 'Valid Till', 'Status'],
    stats: [{ label: 'Active Contracts', val: '45', col: 'text-blue-400' }, { label: 'Expiring < 30D', val: '3', col: 'text-amber-400' }, { label: 'Total AMC Value', val: '$120K', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===1?'Expiring Soon':'Active';
      return { contractid: 'AMC-' + (6001+i), vendor: 'Vendor ' + (1+i), equipmentcovered: (10+i*5).toString(), validfrom: '01 Jan 2026', validtill: statuses==='Expiring Soon'?'15 Aug 2026':'31 Dec 2026', status: statuses };
    })`
  },

  // Physical Verification
  {
    path: 'inventory/verification/count', title: 'Physical Stock Count', desc: 'Data entry sheets for periodic manual counting of warehouse items.',
    cols: ['Count ID', 'Warehouse', 'Category Audited', 'Total Items', 'Progress', 'Status'],
    stats: [{ label: 'Active Audits', val: '2', col: 'text-amber-400' }, { label: 'Completed (YTD)', val: '12', col: 'text-emerald-400' }, { label: 'Overall Accuracy', val: '98.5%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 4 }).map((_, i) => {
      const statuses = ['In Progress', 'Completed', 'Pending Start', 'Completed'];
      return { countid: 'CNT-' + (1001+i), warehouse: 'Store ' + (1+i), categoryaudited: 'All', totalitems: '1500', progress: statuses[i]==='Completed'?'100%':(i*25)+'%', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/verification/cycle', title: 'Cycle Count', desc: 'Daily partial counts (ABC analysis based) to maintain continuous accuracy.',
    cols: ['Cycle ID', 'Date', 'Aisle/Rack', 'Items Counted', 'Variances Found', 'Status'],
    stats: [{ label: 'Counts Today', val: '45', col: 'text-blue-400' }, { label: 'Accuracy (Week)', val: '99.1%', col: 'text-emerald-400' }, { label: 'Discrepancies', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Matched', 'Variance Logged', 'Matched', 'Matched', 'Pending Auth'];
      return { cycleid: 'CYC-' + (2001+i), date: 'Today', aislerack: 'Aisle ' + (1+i), itemscounted: '100', variancesfound: statuses[i]==='Matched'?'0':'2', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/verification/reconciliation', title: 'Stock Reconciliation', desc: 'Approving adjustments to sync system stock with physically verified counts.',
    cols: ['Recon ID', 'Count Ref', 'Total Variances', 'Net Value Impact', 'Approver', 'Status'],
    stats: [{ label: 'Pending Approvals', val: '4', col: 'text-amber-400' }, { label: 'Reconciled (Mo)', val: '18', col: 'text-blue-400' }, { label: 'Value Written Off', val: '$450', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending', 'Approved', 'Pending', 'Rejected', 'Approved'];
      return { reconid: 'REC-' + (3001+i), countref: 'CYC-' + (2000+i), totalvariances: (2+i).toString(), netvalueimpact: '-$' + (50+i*10), approver: statuses[i]==='Pending'?'-':'Finance Head', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/verification/variance', title: 'Variance Report', desc: 'Analytical report highlighting frequently mismatched items or stores.',
    cols: ['Item Name', 'Warehouse', 'System Qty', 'Physical Qty', 'Variance %', 'Status'],
    stats: [{ label: 'Highest Variance Item', val: 'Syringes', col: 'text-red-400' }, { label: 'Best Store Accuracy', val: 'OT Store', col: 'text-emerald-400' }, { label: 'Total Shrinkage', val: '1.2%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Item ' + (1+i), warehouse: 'Main Store', systemqty: '100', physicalqty: '98', variance: '-2%', status: 'Flagged' };
    })`
  },

  // Inventory Reports
  {
    path: 'inventory/reports/stock', title: 'Stock Report', desc: 'Comprehensive snapshot of all current inventory levels.',
    cols: ['Category', 'Total Items', 'In Stock', 'Low Stock', 'Out of Stock', 'Status'],
    stats: [{ label: 'Total Items Tracked', val: '15,400', col: 'text-blue-400' }, { label: 'Availability', val: '94%', col: 'text-emerald-400' }, { label: 'Reports Run', val: '45 (Today)', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Surgicals', 'Medical Gases', 'Consumables', 'Stationery', 'Linen'];
      return { category: cats[i], totalitems: (5000-i*1000).toString(), instock: (4800-i*950).toString(), lowstock: (150-i*30).toString(), outofstock: (50-i*20).toString(), status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/valuation', title: 'Stock Valuation', desc: 'Financial worth of the inventory based on FIFO, LIFO, or Weighted Average.',
    cols: ['Warehouse', 'Surgicals Value', 'Consumables Value', 'Assets Value', 'Total Value', 'Status'],
    stats: [{ label: 'Total Asset Value', val: '$1.2M', col: 'text-emerald-400' }, { label: 'Main Store %', val: '65%', col: 'text-blue-400' }, { label: 'Valuation Method', val: 'Weighted Avg', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { warehouse: 'Store ' + (1+i), surgicalsvalue: '$' + (200000-i*20000), consumablesvalue: '$' + (50000-i*5000), assetsvalue: '$' + (100000-i*10000), totalvalue: '$' + (350000-i*35000), status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/movement', title: 'Stock Movement', desc: 'Analysis of inward and outward flow of goods over a specific period.',
    cols: ['Item Name', 'Opening Qty', 'Qty Received', 'Qty Issued', 'Closing Qty', 'Status'],
    stats: [{ label: 'Fastest Moving', val: 'Gloves', col: 'text-blue-400' }, { label: 'Total Issues', val: '12,400', col: 'text-emerald-400' }, { label: 'Total Receipts', val: '15,000', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Item ' + (1+i), openingqty: '500', qtyreceived: '1000', qtyissued: '1200', closingqty: '300', status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/consumption', title: 'Item Consumption', desc: 'Detailed view of which items are being consumed at what rate.',
    cols: ['Item Name', 'Category', 'Avg Daily Use', 'Total (MTD)', 'Projected (EoM)', 'Status'],
    stats: [{ label: 'Consumption Growth', val: '+5.2%', col: 'text-amber-400' }, { label: 'Highest Volume', val: 'Syringes', col: 'text-blue-400' }, { label: 'Cost Impact', val: '$45K', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Consumable ' + (1+i), category: 'General', avgdailyuse: (200-i*20).toString(), totalmtd: (3000-i*300).toString(), projectedeom: (6000-i*600).toString(), status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/department', title: 'Department Consumption', desc: 'Breakdown of inventory usage and costs by requesting department.',
    cols: ['Department', 'Total Requisitions', 'Items Issued', 'Total Cost', 'Budget Variance', 'Status'],
    stats: [{ label: 'Costliest Dept', val: 'OT', col: 'text-red-400' }, { label: 'Within Budget', val: '15 Depts', col: 'text-emerald-400' }, { label: 'Over Budget', val: '2 Depts', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['OT', 'ICU', 'General Ward', 'Lab', 'Radiology'];
      return { department: depts[i], totalrequisitions: (150-i*20).toString(), itemsissued: (5000-i*800).toString(), totalcost: '$' + (45000-i*5000), budgetvariance: i===0?'+5% (Over)':'Under Budget', status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/expiry', title: 'Expiry Report', desc: 'Financial risk analysis based on items nearing expiration.',
    cols: ['Item Name', 'Batch', 'Expiry Date', 'Qty', 'Value at Risk', 'Status'],
    stats: [{ label: 'Value at Risk', val: '$4,200', col: 'text-red-400' }, { label: 'Items < 3 Mo', val: '45', col: 'text-amber-400' }, { label: 'Expired Written Off', val: '$350', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Item ' + (1+i), batch: 'BTH-' + i, expirydate: '15 Aug 2026', qty: '50', valueatrisk: '$' + (500-i*50), status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/batch', title: 'Batch Report', desc: 'Traceability report for specific batches (useful for recalls).',
    cols: ['Batch No', 'Item Name', 'Supplier', 'Received Date', 'Qty Remaining', 'Status'],
    stats: [{ label: 'Active Batches', val: '4,500', col: 'text-blue-400' }, { label: 'Recalled Batches', val: '1', col: 'text-red-400' }, { label: 'Fully Consumed', val: '120 (Mo)', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { batchno: 'BTH-' + (1000+i), itemname: 'Item ' + (1+i), supplier: 'Vendor ' + (1+i), receiveddate: '01 Jan 2026', qtyremaining: (150-i*20).toString(), status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/dead-stock', title: 'Dead Stock Report', desc: 'Items with zero movement over the last 6 to 12 months.',
    cols: ['Item Name', 'Last Moved Date', 'Current Qty', 'Capital Locked', 'Suggested Action', 'Status'],
    stats: [{ label: 'Dead Stock Value', val: '$15,400', col: 'text-red-400' }, { label: 'Total Items', val: '320', col: 'text-amber-400' }, { label: 'Liquidated (YTD)', val: '$4,500', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Rare Item ' + (1+i), lastmoveddate: '01 Jan 2025', currentqty: '50', capitallocked: '$' + (1000-i*100), suggestedaction: 'Return to Vendor / Write-off', status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/slow-moving', title: 'Slow Moving Items', desc: 'Items with very low turnover, tying up warehouse space and capital.',
    cols: ['Item Name', 'Avg Monthly Use', 'Current Stock', 'Months of Stock', 'Status'],
    stats: [{ label: 'Slow Moving Value', val: '$45,000', col: 'text-amber-400' }, { label: 'Total Items', val: '850', col: 'text-blue-400' }, { label: 'Optimized', val: '12%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Item ' + (1+i), avgmonthlyuse: '5', currentstock: '150', monthsofstock: '30 Months', status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/fast-moving', title: 'Fast Moving Items', desc: 'High turnover items requiring frequent reordering and tight monitoring.',
    cols: ['Item Name', 'Daily Consumption', 'Current Stock', 'Days of Stock', 'Status'],
    stats: [{ label: 'Fast Moving Items', val: '145', col: 'text-emerald-400' }, { label: 'Stockouts Averted', val: '12', col: 'text-blue-400' }, { label: 'Urgent Orders', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Item ' + (1+i), dailyconsumption: '500', currentstock: '1500', daysofstock: '3 Days', status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/abc', title: 'ABC Analysis', desc: 'Categorizing inventory by value (A=70% value, B=20%, C=10%).',
    cols: ['Category', 'Item Count', '% of Total Items', 'Value Locked', '% of Total Value', 'Status'],
    stats: [{ label: 'A-Class Items', val: '15%', col: 'text-blue-400' }, { label: 'A-Class Value', val: '70%', col: 'text-emerald-400' }, { label: 'C-Class Items', val: '55%', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 3 }).map((_, i) => {
      const cats = ['A (High Value)', 'B (Medium Value)', 'C (Low Value)'];
      const items = ['15%', '30%', '55%'];
      const values = ['70%', '20%', '10%'];
      return { category: cats[i], itemcount: (1500+i*2000).toString(), oftotalitems: items[i], valuelocked: '$' + (700000/(i+1)).toFixed(0), oftotalvalue: values[i], status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/xyz', title: 'XYZ Analysis', desc: 'Categorizing inventory by demand predictability (X=Steady, Y=Variable, Z=Erratic).',
    cols: ['Category', 'Item Count', 'Predictability', 'Suggested Buffer', 'Status'],
    stats: [{ label: 'X-Class (Steady)', val: '45%', col: 'text-emerald-400' }, { label: 'Z-Class (Erratic)', val: '15%', col: 'text-amber-400' }, { label: 'Optimization Ops', val: '120', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 3 }).map((_, i) => {
      const cats = ['X (Steady)', 'Y (Variable)', 'Z (Erratic)'];
      const buffers = ['Low', 'Medium', 'High'];
      return { category: cats[i], itemcount: (4500-i*1500).toString(), predictability: cats[i].split('(')[1].replace(')',''), suggestedbuffer: buffers[i], status: 'Generated' };
    })`
  },
  {
    path: 'inventory/reports/fsn', title: 'FSN Analysis', desc: 'Categorizing by issue rate (F=Fast, S=Slow, N=Non-moving).',
    cols: ['Category', 'Item Count', 'Avg Turnover Time', 'Space Utilization', 'Status'],
    stats: [{ label: 'Fast Moving', val: '20%', col: 'text-emerald-400' }, { label: 'Non-moving', val: '5%', col: 'text-red-400' }, { label: 'Warehouse Space Freed', val: '450 SqFt', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 3 }).map((_, i) => {
      const cats = ['Fast Moving (F)', 'Slow Moving (S)', 'Non-Moving (N)'];
      return { category: cats[i], itemcount: (3000-i*1000).toString(), avgturnovertime: i===0?'< 30 Days':(i===1?'1-6 Months':'> 6 Months'), spaceutilization: (60-i*20) + '%', status: 'Generated' };
    })`
  },

  // Analytics
  {
    path: 'inventory/analytics/dashboard', title: 'Inventory Dashboard', desc: 'High-level executive overview of inventory KPIs and alerts.',
    cols: ['Metric', 'Current Month', 'Target', 'Variance', 'Status'],
    stats: [{ label: 'Inventory Turnover', val: '12.4', col: 'text-emerald-400' }, { label: 'Stockout Rate', val: '1.2%', col: 'text-emerald-400' }, { label: 'Holding Cost', val: '$45K', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Inventory Turnover Ratio', 'Stockout Rate', 'Order Fill Rate', 'Shrinkage Rate', 'Holding Cost'];
      const currents = ['12.4', '1.2%', '98.5%', '0.8%', '$45,000'];
      const targets = ['10.0', '< 2.0%', '> 95%', '< 1.0%', '$40,000'];
      return { metric: metrics[i], currentmonth: currents[i], target: targets[i], variance: i===4?'+12.5%':'Positive', status: i===4?'Needs Attention':'Optimal' };
    })`
  },
  {
    path: 'inventory/analytics/department', title: 'Department Analytics', desc: 'Visual insights into which departments are consuming the most budget.',
    cols: ['Department', 'Budget Allocated', 'Consumed (YTD)', 'Variance', 'Trend', 'Status'],
    stats: [{ label: 'Highest Consumer', val: 'OT', col: 'text-blue-400' }, { label: 'Overall Budget Variance', val: '-2.4%', col: 'text-emerald-400' }, { label: 'Critical Depts', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['OT', 'ICU', 'Ward', 'Lab', 'Radiology'];
      return { department: depts[i], budgetallocated: '$' + (500000-i*80000), consumedytd: '$' + (480000-i*75000), variance: '-4%', trend: 'Stable', status: 'Within Budget' };
    })`
  },
  {
    path: 'inventory/analytics/turnover', title: 'Stock Turnover', desc: 'Analysis of how many times inventory is sold/used and replaced over a year.',
    cols: ['Category', 'Avg Inventory Value', 'COGS', 'Turnover Ratio', 'Days Sales of Inventory', 'Status'],
    stats: [{ label: 'Hospital Avg Ratio', val: '12.4x', col: 'text-emerald-400' }, { label: 'Best Category', val: 'Surgicals (24x)', col: 'text-blue-400' }, { label: 'Slowest', val: 'Spares (2x)', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Surgicals', 'Medical Gases', 'Consumables', 'Stationery', 'Spares'];
      const ratios = ['24.0', '18.5', '12.4', '8.0', '2.0'];
      return { category: cats[i], avginventoryvalue: '$' + (50000-i*5000), cogs: '$' + (1200000-i*100000), turnoverratio: ratios[i], dayssalesofinventory: (365/parseFloat(ratios[i])).toFixed(0) + ' Days', status: 'Analyzed' };
    })`
  },
  {
    path: 'inventory/analytics/cost', title: 'Inventory Cost Analysis', desc: 'Breakdown of holding costs, ordering costs, and shortage costs.',
    cols: ['Cost Component', 'Current Month', 'Previous Month', '% Change', 'Industry Benchmark', 'Status'],
    stats: [{ label: 'Total Holding Cost', val: '$45,000', col: 'text-amber-400' }, { label: 'Cost per Order', val: '$12', col: 'text-emerald-400' }, { label: 'Shrinkage Cost', val: '$1,200', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const components = ['Storage / Space Cost', 'Capital Opportunity Cost', 'Insurance & Taxes', 'Obsolescence / Shrinkage', 'Ordering Cost (Admin)'];
      return { costcomponent: components[i], currentmonth: '$' + (15000-i*2000), previousmonth: '$' + (14500-i*1800), change: '+3.4%', industrybenchmark: 'Optimal', status: 'Analyzed' };
    })`
  },
  {
    path: 'inventory/analytics/reorder', title: 'Reorder Analysis', desc: 'AI/Statistical analysis to optimize reorder points and safety stock levels.',
    cols: ['Item Name', 'Current ROL', 'Suggested ROL', 'Current Safety Stock', 'Suggested Safety Stock', 'Status'],
    stats: [{ label: 'Optimization Opps', val: '450 Items', col: 'text-blue-400' }, { label: 'Capital Savings Est.', val: '$24,000', col: 'text-emerald-400' }, { label: 'Stockout Risks Addressed', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Item ' + (1+i), currentrol: '100', suggestedrol: '80', currentsafetystock: '50', suggestedsafetystock: '30', status: 'Suggestion Pending' };
    })`
  },
  {
    path: 'inventory/analytics/trends', title: 'Monthly Trends', desc: 'Visualizing seasonality and long-term consumption trends for forecasting.',
    cols: ['Month', 'Total Receipts Value', 'Total Issues Value', 'Net Inventory Growth', 'Forecast Accuracy', 'Status'],
    stats: [{ label: 'Avg Forecast Accuracy', val: '92%', col: 'text-emerald-400' }, { label: 'Peak Consumption Month', val: 'August', col: 'text-blue-400' }, { label: 'Inventory Growth (YTD)', val: '+4.5%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      return { month: months[i] + ' 2026', totalreceiptsvalue: '$' + (120000+i*5000), totalissuesvalue: '$' + (115000+i*4000), netinventorygrowth: '+$' + (5000+i*1000), forecastaccuracy: (90+i) + '%', status: 'Analyzed' };
    })`
  },

  // Settings
  {
    path: 'inventory/settings/general', title: 'Inventory Settings', desc: 'Global configurations like valuation method (FIFO/LIFO) and currency.',
    cols: ['Setting', 'Description', 'Current Value', 'Last Updated', 'Status'],
    stats: [{ label: 'Valuation Method', val: 'Weighted Avg', col: 'text-blue-400' }, { label: 'Base Currency', val: 'USD ($)', col: 'text-emerald-400' }, { label: 'Auto-Reorder', val: 'Enabled', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const settings = ['Valuation Method', 'Base Currency', 'Negative Stock Allowed', 'Auto-Reorder Generation', 'Default Warehouse'];
      const values = ['Weighted Average', 'USD ($)', 'No', 'Yes', 'Main Central Store'];
      return { setting: settings[i], description: 'System global setting', currentvalue: values[i], lastupdated: '01 Jan 2026', status: 'Active' };
    })`
  },
  {
    path: 'inventory/settings/number-series', title: 'Number Series', desc: 'Define auto-generated formats for GRNs, POs, and Transfer slips.',
    cols: ['Document Type', 'Prefix', 'Starting Number', 'Current Number', 'Suffix', 'Status'],
    stats: [{ label: 'Active Series', val: '12', col: 'text-blue-400' }, { label: 'Documents Generated', val: '14,500', col: 'text-emerald-400' }, { label: 'Conflicts', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const docs = ['Goods Receipt (GRN)', 'Purchase Order (PO)', 'Issue Request', 'Transfer Slip', 'Stock Adjustment'];
      const prefixes = ['GRN-', 'PO-', 'REQ-', 'TRF-', 'ADJ-'];
      return { documenttype: docs[i], prefix: prefixes[i], startingnumber: '1000', currentnumber: (2500+i*500).toString(), suffix: '-26', status: 'Active' };
    })`
  },
  {
    path: 'inventory/settings/barcode', title: 'Barcode Settings', desc: 'Configure barcode formats, label sizes, and printer integrations.',
    cols: ['Setting Name', 'Configuration', 'Format', 'Printer Mapped', 'Status'],
    stats: [{ label: 'Default Format', val: 'Code 128', col: 'text-blue-400' }, { label: 'Printers Online', val: '4/4', col: 'text-emerald-400' }, { label: 'Labels Printed', val: '1.2M', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const settings = ['Primary Barcode Format', 'Label Size (Main Store)', 'QR Code Enabled', 'Auto-print on GRN', 'Shelf Label Format'];
      const configs = ['Code 128', '50x25mm', 'Yes', 'Yes', '100x50mm'];
      return { settingname: settings[i], configuration: configs[i], format: 'System Config', printermapped: 'Zebra ZD420', status: 'Active' };
    })`
  },
  {
    path: 'inventory/settings/approval', title: 'Approval Rules', desc: 'Workflow routing for stock issues, adjustments, and returns based on value.',
    cols: ['Rule Name', 'Trigger Condition', 'Approver 1', 'Approver 2', 'Status'],
    stats: [{ label: 'Active Workflows', val: '8', col: 'text-blue-400' }, { label: 'Avg Approval Time', val: '4.5 Hrs', col: 'text-emerald-400' }, { label: 'Bottlenecks', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const rules = ['High Value Issue', 'Stock Adjustment', 'Asset Transfer', 'Write-off Approval', 'Routine Issue'];
      const conditions = ['Value > $1000', 'Qty Variance > 5%', 'Any', 'Value > $100', 'Any'];
      return { rulename: rules[i], triggercondition: conditions[i], approver1: 'Store Manager', approver2: i===4?'-':'Finance Head', status: 'Active' };
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
        const isGood = val === 'Active' || val === 'Received' || val === 'Completed' || val === 'Fulfilled' || val === 'Delivered' || val === 'Adequate' || val === 'Optimal' || val === 'Valid' || val === 'Resolved' || val === 'Generated' || val === 'Analyzed' || val === 'Within Budget';
        const isWarning = val === 'In Transit' || val === 'Awaiting Ack' || val === 'Pending Prep' || val === 'Pending Auth' || val === 'Low Stock' || val === 'Reorder Suggested' || val === 'Near Expiry' || val === 'In Repair' || val === 'Scheduled' || val === 'Pending Approval' || val === 'Due Soon' || val === 'In Progress' || val === 'Open' || val === 'Awaiting Parts' || val === 'Pending Start' || val === 'Pending' || val === 'Suggestion Pending' || val === 'Needs Attention';
        const isNeutral = val === 'Draft' || val === 'Dispatched' || val === 'Allocated' || val === 'Moved' || val === 'Auctioned' || val === 'Scrapped' || val === 'Variance Logged' || val === 'Flagged';
        const isDanger = val === 'Written Off' || val === 'Down' || val === 'Overdue' || val === 'Failed' || val === 'Rejected';
        
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
