const fs = require('fs');
const path = require('path');

const config = [
  // Facility Management
  {
    path: 'facilities/management/buildings', title: 'Buildings', desc: 'Manage hospital buildings, wings, and structural assets.',
    cols: ['Building Code', 'Name', 'Total Floors', 'Square Footage', 'Primary Use', 'Status'],
    stats: [{ label: 'Total Buildings', val: '4', col: 'text-blue-400' }, { label: 'Total Area (SqFt)', val: '120,000', col: 'text-emerald-400' }, { label: 'Buildings Under Maint.', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 4 }).map((_, i) => {
      const names = ['Main Hospital Block', 'OPD Wing', 'Admin Block', 'Research Center'];
      return { buildingcode: 'BLD-' + (100+i), name: names[i], totalfloors: (4+i).toString(), squarefootage: (30000+i*5000).toString(), primaryuse: i===0?'Clinical':'Support', status: 'Active' };
    })`
  },
  {
    path: 'facilities/management/floors', title: 'Floors', desc: 'Detailed floor plan mapping and department allocation per floor.',
    cols: ['Building', 'Floor Level', 'Total Wards', 'Key Departments', 'Fire Exits', 'Status'],
    stats: [{ label: 'Total Floors', val: '18', col: 'text-blue-400' }, { label: 'Occupancy Rate', val: '92%', col: 'text-emerald-400' }, { label: 'Restricted Zones', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { building: 'Main Block', floorlevel: 'Level ' + (1+i), totalwards: (2+i).toString(), keydepartments: i===0?'Emergency, Radiology':'Cardiology', fireexits: '4', status: 'Active' };
    })`
  },
  {
    path: 'facilities/management/wards', title: 'Wards', desc: 'Ward level facility tracking including beds, nursing stations, and washrooms.',
    cols: ['Ward ID', 'Ward Name', 'Floor', 'Bed Capacity', 'Current Occupancy', 'Status'],
    stats: [{ label: 'Total Wards', val: '24', col: 'text-blue-400' }, { label: 'Beds Available', val: '350', col: 'text-emerald-400' }, { label: 'Wards Full', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { wardid: 'WRD-' + (1001+i), wardname: 'General Ward ' + (1+i), floor: 'Level 2', bedcapacity: '20', currentoccupancy: (15+i).toString(), status: 'Active' };
    })`
  },
  {
    path: 'facilities/management/rooms', title: 'Rooms', desc: 'Individual room management (OPD Consults, Private IPD, OT).',
    cols: ['Room No', 'Type', 'Ward/Dept', 'Asset Count', 'Last Deep Clean', 'Status'],
    stats: [{ label: 'Total Rooms', val: '450', col: 'text-blue-400' }, { label: 'Rooms Under Maint', val: '12', col: 'text-red-400' }, { label: 'Clean Rooms Avail', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Consultation', 'Private IPD', 'OT', 'Store Room', 'Consultation'];
      return { roomno: 'RM-' + (201+i), type: types[i], warddept: 'OPD', assetcount: (5+i).toString(), lastdeepclean: 'Yesterday', status: i===1?'Under Maintenance':'Available' };
    })`
  },
  {
    path: 'facilities/management/requests', title: 'Facility Requests', desc: 'Requests for space allocation, furniture changes, or room modifications.',
    cols: ['Request ID', 'Department', 'Request Type', 'Priority', 'Requested Date', 'Status'],
    stats: [{ label: 'Pending Requests', val: '15', col: 'text-amber-400' }, { label: 'Approved (Mo)', val: '8', col: 'text-emerald-400' }, { label: 'High Priority', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { requestid: 'FR-' + (1001+i), department: 'Cardiology', requesttype: 'Furniture Move', priority: i===0?'High':'Medium', requesteddate: 'Today', status: i<2?'Pending Approval':'In Progress' };
    })`
  },
  {
    path: 'facilities/management/inspections', title: 'Facility Inspections', desc: 'Routine checklists for civil, electrical, and plumbing checks across buildings.',
    cols: ['Inspection ID', 'Area Checked', 'Inspector', 'Date', 'Issues Found', 'Status'],
    stats: [{ label: 'Inspections (Mo)', val: '45', col: 'text-blue-400' }, { label: 'Passed Checks', val: '38', col: 'text-emerald-400' }, { label: 'Open Issues', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { inspectionid: 'INSP-' + (2001+i), areachecked: 'Level 1 Washrooms', inspector: 'John Doe', date: 'Yesterday', issuesfound: i===0?'Leaking Tap':'None', status: i===0?'Action Required':'Pass' };
    })`
  },

  // Maintenance Management
  {
    path: 'facilities/maintenance/dashboard', title: 'Maintenance Dashboard', desc: 'Overview of all maintenance operations, open tickets, and engineer workload.',
    cols: ['Metric', 'Value', 'Target', 'Variance', 'Trend', 'Status'],
    stats: [{ label: 'Open Work Orders', val: '34', col: 'text-amber-400' }, { label: 'Avg Resolution Time', val: '4.5 Hrs', col: 'text-emerald-400' }, { label: 'SLA Breach', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['PM Completion Rate', 'Mean Time to Repair', 'Breakdown %', 'SLA Adherence', 'Cost vs Budget'];
      return { metric: metrics[i], value: '95%', target: '>90%', variance: '+5%', trend: 'Upward', status: 'On Track' };
    })`
  },
  {
    path: 'facilities/maintenance/work-orders', title: 'Work Orders', desc: 'Central ticketing system for all reactive and preventive maintenance tasks.',
    cols: ['WO Number', 'Asset/Location', 'Issue Type', 'Assigned To', 'Priority', 'Status'],
    stats: [{ label: 'Total Open WO', val: '45', col: 'text-blue-400' }, { label: 'Critical WO', val: '3', col: 'text-red-400' }, { label: 'Completed (Today)', val: '18', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { wonumber: 'WO-' + (1001+i), assetlocation: 'AC Unit - Room 10' + i, issuetype: 'Cooling Issue', assignedto: 'Tech Bob', priority: i===0?'Critical':'Normal', status: i===0?'Open':'In Progress' };
    })`
  },
  {
    path: 'facilities/maintenance/preventive', title: 'Preventive Maintenance', desc: 'Scheduled calendar for routine servicing of non-medical assets (HVAC, Lifts, DG Sets).',
    cols: ['Schedule ID', 'Asset Category', 'Location', 'Last Serviced', 'Next Due', 'Status'],
    stats: [{ label: 'PM Due This Week', val: '24', col: 'text-blue-400' }, { label: 'PM Completion %', val: '98%', col: 'text-emerald-400' }, { label: 'Overdue PM', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const assets = ['Lift 1', 'Main HVAC', 'DG Set 500kVA', 'Water Pump 1', 'Fire Panel'];
      return { scheduleid: 'PM-' + (2001+i), assetcategory: assets[i], location: 'Main Block', lastserviced: 'Last Month', nextdue: i===0?'Today':'Next Week', status: i===0?'Due Now':'Scheduled' };
    })`
  },
  {
    path: 'facilities/maintenance/corrective', title: 'Corrective Maintenance', desc: 'Tasks identified during preventive checks that require repair or part replacement.',
    cols: ['CM Number', 'Linked PM', 'Asset Name', 'Defect Found', 'Parts Required', 'Status'],
    stats: [{ label: 'Active CM Jobs', val: '12', col: 'text-amber-400' }, { label: 'Awaiting Parts', val: '4', col: 'text-red-400' }, { label: 'Completed (Mo)', val: '34', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { cmnumber: 'CM-' + (3001+i), linkedpm: 'PM-200' + i, assetname: 'Water Pump', defectfound: 'Bearing Noise', partsrequired: 'Bearing Kit', status: i===0?'Awaiting Spares':'In Progress' };
    })`
  },
  {
    path: 'facilities/maintenance/breakdown', title: 'Breakdown Requests', desc: 'Emergency requests for unexpected equipment or facility failures (e.g., pipe burst).',
    cols: ['Ticket ID', 'Reported By', 'Location', 'Issue Description', 'Reported Time', 'Status'],
    stats: [{ label: 'Active Breakdowns', val: '3', col: 'text-red-400' }, { label: 'MTTR', val: '1.2 Hrs', col: 'text-emerald-400' }, { label: 'Resolved Today', val: '5', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ticketid: 'BRK-' + (4001+i), reportedby: 'Nurse Alice', location: 'Ward B', issuedescription: 'Power trip', reportedtime: '15 mins ago', status: i===0?'New':'Assigned' };
    })`
  },
  {
    path: 'facilities/maintenance/amc', title: 'AMC Management', desc: 'Tracking Annual Maintenance Contracts for facility assets with external vendors.',
    cols: ['Contract ID', 'Asset/Service', 'Vendor', 'Start Date', 'Expiry Date', 'Status'],
    stats: [{ label: 'Active AMCs', val: '34', col: 'text-blue-400' }, { label: 'Expiring in 30D', val: '3', col: 'text-amber-400' }, { label: 'Total AMC Value', val: '$120K', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const assets = ['Lift Maintenance', 'HVAC Service', 'Pest Control', 'Fire Systems', 'DG Set Service'];
      return { contractid: 'AMC-' + (5001+i), assetservice: assets[i], vendor: 'Vendor ' + (1+i), startdate: '01 Jan 2026', expirydate: '31 Dec 2026', status: 'Active' };
    })`
  },
  {
    path: 'facilities/maintenance/history', title: 'Service History', desc: 'Historical log of all maintenance activities per asset for lifecycle costing.',
    cols: ['Asset ID', 'Asset Name', 'Date of Service', 'WO/Ticket ID', 'Cost Incurred', 'Status'],
    stats: [{ label: 'Total Records', val: '12,500', col: 'text-blue-400' }, { label: 'Maint. Cost YTD', val: '$45,000', col: 'text-amber-400' }, { label: 'Most Repaired Asset', val: 'Lift 3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { assetid: 'AST-L00' + (1+i), assetname: 'Lift ' + (1+i), dateofservice: '15 ' + ['Jun', 'Jul'][i%2] + ' 2026', woticketid: 'WO-100' + i, costincurred: '$' + (150+i*50), status: 'Completed' };
    })`
  },

  // Biomedical Engineering
  {
    path: 'facilities/biomedical/dashboard', title: 'Equipment Dashboard', desc: 'High-level view of medical equipment uptime, calibrations, and active breakdowns.',
    cols: ['Metric', 'Value', 'Target', 'Variance', 'Trend', 'Status'],
    stats: [{ label: 'Total Medical Assets', val: '1,240', col: 'text-blue-400' }, { label: 'Overall Uptime', val: '99.2%', col: 'text-emerald-400' }, { label: 'Critical Downs', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Equipment Uptime', 'Calibration Compliance', 'PM Adherence', 'Mean Time to Repair', 'Scrap %'];
      return { metric: metrics[i], value: '98%', target: '>99%', variance: '-1%', trend: 'Stable', status: i===1?'Attention Needed':'On Track' };
    })`
  },
  {
    path: 'facilities/biomedical/register', title: 'Equipment Register', desc: 'Master database of all medical devices (MRI, Monitors, Ventilators).',
    cols: ['Equipment ID', 'Name', 'Manufacturer', 'Serial No', 'Department', 'Status'],
    stats: [{ label: 'Total Value', val: '$12.5M', col: 'text-blue-400' }, { label: 'Active Equip.', val: '1,150', col: 'text-emerald-400' }, { label: 'Decommissioned', val: '90', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const equip = ['Patient Monitor', 'Ventilator', 'Defibrillator', 'Syringe Pump', 'ECG Machine'];
      return { equipmentid: 'BME-' + (1001+i), name: equip[i], manufacturer: 'MedTech Inc', serialno: 'SN987' + i, department: 'ICU', status: 'Functional' };
    })`
  },
  {
    path: 'facilities/biomedical/allocation', title: 'Equipment Allocation', desc: 'Tracking which equipment is deployed to which ward/bed and movement history.',
    cols: ['Equipment ID', 'Name', 'Current Location', 'Allocated Date', 'Moved By', 'Status'],
    stats: [{ label: 'Items in Transit', val: '5', col: 'text-amber-400' }, { label: 'Deployed Assets', val: '950', col: 'text-blue-400' }, { label: 'Store Reserve', val: '200', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { equipmentid: 'BME-' + (2001+i), name: 'Syringe Pump', currentlocation: 'Ward B Bed ' + (1+i), allocateddate: 'Yesterday', movedby: 'Nurse Staff', status: 'Deployed' };
    })`
  },
  {
    path: 'facilities/biomedical/calibration', title: 'Calibration', desc: 'Mandatory statutory calibration tracking for precision medical equipment.',
    cols: ['Equipment ID', 'Name', 'Last Calibration', 'Next Due', 'Agency', 'Status'],
    stats: [{ label: 'Calibrations Due (30D)', val: '45', col: 'text-amber-400' }, { label: 'Compliance', val: '100%', col: 'text-emerald-400' }, { label: 'Failed Calibration', val: '0', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { equipmentid: 'BME-' + (3001+i), name: 'Weighing Scale', lastcalibration: '01 Jan 2026', nextdue: i===0?'This Week':'01 Jan 2027', agency: 'NABL Lab', status: i===0?'Due Soon':'Compliant' };
    })`
  },
  {
    path: 'facilities/biomedical/preventive', title: 'Preventive Maintenance', desc: 'Scheduled servicing for medical devices as per manufacturer guidelines.',
    cols: ['PM ID', 'Equipment Name', 'Department', 'Scheduled Date', 'Assigned Tech', 'Status'],
    stats: [{ label: 'PMs Due', val: '34', col: 'text-blue-400' }, { label: 'Completed (Mo)', val: '120', col: 'text-emerald-400' }, { label: 'Overdue', val: '0', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { pmid: 'BPM-' + (4001+i), equipmentname: 'Patient Monitor', department: 'ICU', scheduleddate: 'Today', assignedtech: 'BioMed Eng ' + (1+i), status: 'Scheduled' };
    })`
  },
  {
    path: 'facilities/biomedical/breakdown', title: 'Breakdown Maintenance', desc: 'Emergency repair logs for medical equipment failures impacting patient care.',
    cols: ['Ticket ID', 'Equipment Name', 'Location', 'Fault Description', 'Downtime', 'Status'],
    stats: [{ label: 'Active Breakdowns', val: '2', col: 'text-red-400' }, { label: 'Avg Downtime', val: '4.5 Hrs', col: 'text-amber-400' }, { label: 'Resolved Today', val: '3', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ticketid: 'BDN-' + (5001+i), equipmentname: 'ECG Machine', location: 'ER', faultdescription: 'Display Error', downtime: (2+i) + ' Hrs', status: i<2?'Open':'In Progress' };
    })`
  },
  {
    path: 'facilities/biomedical/amc', title: 'AMC Contracts', desc: 'Comprehensive Maintenance Contracts (CMC) and AMCs with Original Equipment Manufacturers (OEMs).',
    cols: ['Contract ID', 'Equipment Class', 'OEM/Vendor', 'Type (AMC/CMC)', 'Expiry', 'Status'],
    stats: [{ label: 'Active Contracts', val: '85', col: 'text-blue-400' }, { label: 'CMC Value', val: '$450K', col: 'text-emerald-400' }, { label: 'Expiring Soon', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { contractid: 'CAMC-' + (6001+i), equipmentclass: 'Ventilators', oemvendor: 'MedTech Inc', typeamccmc: 'CMC', expiry: '31 Dec 2026', status: 'Active' };
    })`
  },
  {
    path: 'facilities/biomedical/reports', title: 'Service Reports', desc: 'Digital storage of service reports provided by vendors post-repair or PM.',
    cols: ['Report ID', 'Equipment', 'Service Type', 'Vendor Tech', 'Date', 'Status'],
    stats: [{ label: 'Reports Uploaded', val: '450', col: 'text-blue-400' }, { label: 'Missing Reports', val: '12', col: 'text-amber-400' }, { label: 'Audit Passing', val: '100%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportid: 'REP-' + (7001+i), equipment: 'MRI Scanner', servicetype: 'PM', vendortech: 'Tech Joe', date: 'Yesterday', status: 'Verified' };
    })`
  },

  // Housekeeping
  {
    path: 'facilities/housekeeping/schedule', title: 'Cleaning Schedule', desc: 'Roster and frequency (e.g., 2-hourly) planning for cleaning staff across zones.',
    cols: ['Zone/Area', 'Frequency', 'Shift', 'Assigned Staff', 'Supervisor', 'Status'],
    stats: [{ label: 'Active Shifts', val: '3', col: 'text-blue-400' }, { label: 'Total HK Staff', val: '120', col: 'text-emerald-400' }, { label: 'Absent Today', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { zonearea: 'Lobby Floor ' + (1+i), frequency: '2 Hourly', shift: 'Morning', assignedstaff: 'Staff ' + (1+i), supervisor: 'Supv Alice', status: 'Active' };
    })`
  },
  {
    path: 'facilities/housekeeping/room', title: 'Room Cleaning', desc: 'Tracking cleaning status of private rooms, especially post-discharge terminal cleaning.',
    cols: ['Room No', 'Patient Status', 'Cleaning Type', 'Requested Time', 'Completion Time', 'Status'],
    stats: [{ label: 'Rooms to Clean', val: '15', col: 'text-amber-400' }, { label: 'Avg Turnaround', val: '45 Mins', col: 'text-emerald-400' }, { label: 'Cleaned Today', val: '45', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { roomno: 'RM-20' + i, patientstatus: 'Discharged', cleaningtype: 'Terminal Clean', requestedtime: '10:00 AM', completiontime: i===0?'-':'10:45 AM', status: i===0?'Pending':'Cleaned' };
    })`
  },
  {
    path: 'facilities/housekeeping/ward', title: 'Ward Cleaning', desc: 'Routine mopping and sanitization logs for general wards.',
    cols: ['Ward Name', 'Last Cleaned', 'Next Due', 'Cleaning Standard', 'Checked By', 'Status'],
    stats: [{ label: 'Wards Cleaned', val: '24/24', col: 'text-emerald-400' }, { label: 'Missed Schedules', val: '0', col: 'text-red-400' }, { label: 'Infection Alerts', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { wardname: 'Ward ' + (1+i), lastcleaned: '2 Hrs Ago', nextdue: 'In 30 Mins', cleaningstandard: 'Standard', checkedby: 'Supv Alice', status: 'Compliant' };
    })`
  },
  {
    path: 'facilities/housekeeping/ot', title: 'OT Cleaning', desc: 'Highly regulated sterile cleaning protocols between surgeries and deep cleaning.',
    cols: ['OT Number', 'Surgery Type', 'Cleaning Phase', 'Carried Out By', 'Sterility Swap', 'Status'],
    stats: [{ label: 'OTs Ready', val: '5/8', col: 'text-emerald-400' }, { label: 'Under Cleaning', val: '2', col: 'text-amber-400' }, { label: 'Fumigation Due', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { otnumber: 'OT ' + (1+i), surgerytype: 'Ortho', cleaningphase: i===0?'Between Cases':'Terminal', carriedoutby: 'OT Tech', sterilityswap: 'Pending', status: i===0?'Cleaning in Progress':'Sterile' };
    })`
  },
  {
    path: 'facilities/housekeeping/icu', title: 'ICU Cleaning', desc: 'Critical care zone cleaning logs maintaining high hygiene standards.',
    cols: ['ICU Bed/Zone', 'Last Clean', 'Disinfectant Used', 'Staff ID', 'Supervisor Sign-off', 'Status'],
    stats: [{ label: 'ICU Compliance', val: '100%', col: 'text-emerald-400' }, { label: 'Deep Cleans Today', val: '3', col: 'text-blue-400' }, { label: 'Staff Trained', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { icubedzone: 'ICU Bed ' + (1+i), lastclean: '1 Hr Ago', disinfectantused: 'Sodium Hypochlorite', staffid: 'HK-10' + i, supervisorsignoff: 'Yes', status: 'Clean' };
    })`
  },
  {
    path: 'facilities/housekeeping/isolation', title: 'Isolation Room Cleaning', desc: 'Specialized cleaning for infection control rooms (e.g., Airborne precautions).',
    cols: ['Room No', 'Infection Type', 'PPE Level', 'Cleaning Type', 'Waste Protocol', 'Status'],
    stats: [{ label: 'Active Isolations', val: '4', col: 'text-amber-400' }, { label: 'Terminal Cleans', val: '1', col: 'text-blue-400' }, { label: 'Protocol Breaches', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { roomno: 'ISO-' + (1+i), infectiontype: 'Droplet', ppelevel: 'Level 3', cleaningtype: 'Routine', wasteprotocol: 'Yellow Bag', status: 'In Use' };
    })`
  },
  {
    path: 'facilities/housekeeping/requests', title: 'Housekeeping Requests', desc: 'Ad-hoc requests for spills, extra supplies, or immediate cleaning.',
    cols: ['Request ID', 'Location', 'Issue', 'Requested By', 'Time Taken', 'Status'],
    stats: [{ label: 'Open Requests', val: '5', col: 'text-amber-400' }, { label: 'Avg Response', val: '8 Mins', col: 'text-emerald-400' }, { label: 'Total Today', val: '45', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { requestid: 'HKR-' + (1001+i), location: 'Corridor A', issue: 'Spill', requestedby: 'Nurse Bob', timetaken: i===0?'-':'10 Mins', status: i===0?'New':'Resolved' };
    })`
  },
  {
    path: 'facilities/housekeeping/checklist', title: 'Cleaning Checklist', desc: 'Digital sign-offs replacing paper sheets in washrooms and pantries.',
    cols: ['Area', 'Checklist Item', 'Time Logged', 'Completed By', 'Image Proof', 'Status'],
    stats: [{ label: 'Checklists Completed', val: '450/480', col: 'text-emerald-400' }, { label: 'Missed Items', val: '5', col: 'text-red-400' }, { label: 'Audits Done', val: '12', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { area: 'Washroom 1A', checklistitem: 'Mirror & Sink', timelogged: '10:00 AM', completedby: 'Staff Bob', imageproof: 'Uploaded', status: 'Signed Off' };
    })`
  },

  // Laundry & Linen
  {
    path: 'facilities/laundry/inventory', title: 'Linen Inventory', desc: 'Tracking total hospital linen stock (Bed sheets, blankets, scrubs, gowns).',
    cols: ['Linen Type', 'Total Stock', 'In Use (Wards)', 'In Laundry', 'In Store', 'Status'],
    stats: [{ label: 'Total Pieces', val: '15,000', col: 'text-blue-400' }, { label: 'Shortage Alerts', val: '2', col: 'text-red-400' }, { label: 'Annual Loss %', val: '3%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Bed Sheet - White', 'Patient Gown', 'Doctor Scrubs', 'Pillow Cover', 'Blanket'];
      return { linentype: types[i], totalstock: (2000-i*200).toString(), inusewards: (1000-i*100).toString(), inlaundry: (500-i*50).toString(), instore: (500-i*50).toString(), status: 'Sufficient' };
    })`
  },
  {
    path: 'facilities/laundry/issue', title: 'Linen Issue', desc: 'Dispatching fresh linen from the central store to various wards and departments.',
    cols: ['Transaction ID', 'Department/Ward', 'Linen Type', 'Qty Issued', 'Issued By', 'Date'],
    stats: [{ label: 'Pieces Issued (Today)', val: '1,200', col: 'text-blue-400' }, { label: 'Requests Pending', val: '4', col: 'text-amber-400' }, { label: 'Top Requestor', val: 'ICU', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { transactionid: 'IS-' + (1001+i), departmentward: 'Ward ' + (1+i), linentype: 'Bed Sheets', qtyissued: (50-i*5).toString(), issuedby: 'Store Admin', date: 'Today 08:00' };
    })`
  },
  {
    path: 'facilities/laundry/return', title: 'Linen Return', desc: 'Receiving soiled or infected linen from wards for washing.',
    cols: ['Return ID', 'From Ward', 'Linen Type', 'Condition', 'Qty Received', 'Date'],
    stats: [{ label: 'Pieces Returned (Today)', val: '1,150', col: 'text-amber-400' }, { label: 'Infected Linen (Red Bag)', val: '45', col: 'text-red-400' }, { label: 'Count Mismatch', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { returnid: 'RT-' + (2001+i), fromward: 'Ward ' + (1+i), linentype: 'Mixed', condition: i===0?'Infected':'Soiled', qtyreceived: (45-i*5).toString(), date: 'Today 09:00' };
    })`
  },
  {
    path: 'facilities/laundry/processing', title: 'Laundry Processing', desc: 'Tracking internal washing cycles or dispatch/receipt from external laundry vendors.',
    cols: ['Batch ID', 'Vendor/Machine', 'Weight (Kg)', 'Sent Time', 'Expected Return', 'Status'],
    stats: [{ label: 'Current Wash Load', val: '450 Kg', col: 'text-blue-400' }, { label: 'Vendor Turnaround', val: '24 Hrs', col: 'text-emerald-400' }, { label: 'Delayed Batches', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { batchid: 'LDY-' + (3001+i), vendor: 'Vendor A', weightkg: (100-i*10).toString(), senttime: 'Yesterday 18:00', expectedreturn: 'Today 14:00', status: i<2?'Processing':'Returned' };
    })`
  },
  {
    path: 'facilities/laundry/damaged', title: 'Damaged Linen', desc: 'Logging torn or irreparably stained linen for condemnation and write-off.',
    cols: ['Report ID', 'Linen Type', 'Reported By', 'Damage Reason', 'Action', 'Status'],
    stats: [{ label: 'Damaged (Mo)', val: '45 Pieces', col: 'text-amber-400' }, { label: 'Write-off Value', val: '$250', col: 'text-red-400' }, { label: 'Sent for Repair', val: '12', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportid: 'DMG-' + (4001+i), linentype: 'Patient Gown', reportedby: 'Laundry Staff', damagereason: 'Torn', action: i===0?'Condemned':'Sent for Stitching', status: 'Logged' };
    })`
  },
  {
    path: 'facilities/laundry/reports', title: 'Laundry Reports', desc: 'Consumption, stock discrepancy, and cost per wash cycle reporting.',
    cols: ['Report Name', 'Period', 'Total Wash Weight', 'Cost Incurred', 'Discrepancy %', 'Status'],
    stats: [{ label: 'Laundry Cost (Mo)', val: '$4,500', col: 'text-blue-400' }, { label: 'Avg Cost/Kg', val: '$0.80', col: 'text-emerald-400' }, { label: 'Overall Shortage', val: '0.5%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportname: 'Monthly Consumption', period: 'June 2026', totalwashweight: '5,400 Kg', costincurred: '$4,320', discrepancy: '0.5%', status: 'Generated' };
    })`
  },

  // Security Management
  {
    path: 'facilities/security/dashboard', title: 'Security Dashboard', desc: 'Overview of security personnel deployment, incidents, and access control.',
    cols: ['Metric', 'Value', 'Target', 'Variance', 'Trend', 'Status'],
    stats: [{ label: 'Active Guards', val: '45', col: 'text-blue-400' }, { label: 'Current Visitors', val: '120', col: 'text-emerald-400' }, { label: 'Security Alerts', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Staff Attendance', 'Visitor Count', 'Vehicle Entries', 'Incident Reports', 'CCTV Uptime'];
      return { metric: metrics[i], value: '98%', target: '100%', variance: '-2%', trend: 'Stable', status: 'Normal' };
    })`
  },
  {
    path: 'facilities/security/staff', title: 'Security Staff', desc: 'Roster, shifts, and post deployment (e.g., Main Gate, ER Entrance) of security guards.',
    cols: ['Guard Name', 'ID', 'Agency', 'Current Post', 'Shift', 'Status'],
    stats: [{ label: 'Total Strength', val: '65', col: 'text-blue-400' }, { label: 'On Duty', val: '22', col: 'text-emerald-400' }, { label: 'Reliever Available', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const posts = ['Main Gate', 'ER Entrance', 'ICU Lobby', 'Parking', 'Patrol'];
      return { guardname: 'Guard ' + (1+i), id: 'SEC-' + (101+i), agency: 'SecureForce', currentpost: posts[i], shift: 'Morning', status: 'On Duty' };
    })`
  },
  {
    path: 'facilities/security/visitor', title: 'Visitor Verification', desc: 'Logging visitors, issuing passes, and enforcing visiting hour rules.',
    cols: ['Pass ID', 'Visitor Name', 'Patient Visited', 'Ward/Bed', 'In Time', 'Status'],
    stats: [{ label: 'Passes Issued (Today)', val: '340', col: 'text-blue-400' }, { label: 'Overstaying Visitors', val: '12', col: 'text-red-400' }, { label: 'Banned Persons', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { passid: 'VIS-' + (1001+i), visitorname: 'John Doe ' + i, patientvisited: 'Patient ' + i, wardbed: 'Ward A Bed ' + i, intime: '10:00 AM', status: i===0?'Overstaying':'Active' };
    })`
  },
  {
    path: 'facilities/security/gatepass', title: 'Gate Pass (Material)', desc: 'Returnable and non-returnable gate passes for material entering/leaving premises.',
    cols: ['Gate Pass No', 'Type', 'Vendor/Person', 'Items Description', 'Authorized By', 'Status'],
    stats: [{ label: 'Active Passes', val: '15', col: 'text-blue-400' }, { label: 'Pending Return', val: '3', col: 'text-amber-400' }, { label: 'Outward Movement', val: '45 (Today)', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { gatepassno: 'GP-' + (2001+i), type: i%2===0?'Returnable':'Non-Returnable', vendorperson: 'Vendor A', itemsdescription: 'IT Equipment Repair', authorizedby: 'IT Head', status: i===0?'Pending Return':'Closed' };
    })`
  },
  {
    path: 'facilities/security/incident', title: 'Incident Reports', desc: 'Logs of thefts, affrays, unauthorized access, or safety breaches.',
    cols: ['Incident ID', 'Category', 'Location', 'Reported By', 'Date/Time', 'Status'],
    stats: [{ label: 'Incidents (Mo)', val: '4', col: 'text-amber-400' }, { label: 'Police Cases (FIR)', val: '0', col: 'text-emerald-400' }, { label: 'Resolved', val: '3', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { incidentid: 'INC-' + (3001+i), category: i===0?'Theft':'Argument', location: 'OPD Waiting', reportedby: 'Guard Bob', datetime: 'Yesterday 14:00', status: i===0?'Under Investigation':'Resolved' };
    })`
  },
  {
    path: 'facilities/security/cctv', title: 'CCTV Monitoring', desc: 'Camera status, recording retention checks, and footage request logs.',
    cols: ['Camera ID', 'Location', 'Status', 'Recording retention', 'Last Checked', 'Status'],
    stats: [{ label: 'Total Cameras', val: '240', col: 'text-blue-400' }, { label: 'Offline Cameras', val: '2', col: 'text-red-400' }, { label: 'Footage Requests', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { cameraid: 'CAM-' + (401+i), location: 'Corridor ' + (1+i), status: i===0?'Offline':'Online', recordingretention: '30 Days', lastchecked: 'Today', status: i===0?'Faulty':'Functional' };
    })`
  },
  {
    path: 'facilities/security/lost', title: 'Lost & Found', desc: 'Security log of items found on premises and handover records.',
    cols: ['Item ID', 'Description', 'Found By', 'Location Found', 'Handed To', 'Status'],
    stats: [{ label: 'Items Found (Mo)', val: '18', col: 'text-blue-400' }, { label: 'Claimed', val: '12', col: 'text-emerald-400' }, { label: 'In Custody', val: '6', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemid: 'LF-' + (5001+i), description: 'Mobile Phone', foundby: 'HK Staff', locationfound: 'Washroom 2', handedto: i===0?'-':'Owner', status: i===0?'In Safe':'Returned' };
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
        const isGood = val === 'Active' || val === 'Available' || val === 'Pass' || val === 'On Track' || val === 'Completed' || val === 'Functional' || val === 'Deployed' || val === 'Compliant' || val === 'Clean' || val === 'Signed Off' || val === 'Sufficient' || val === 'On Duty' || val === 'Normal' || val === 'Resolved' || val === 'Returned' || val === 'Sterile';
        const isWarning = val === 'Under Maintenance' || val === 'Pending Approval' || val === 'In Progress' || val === 'Action Required' || val === 'Open' || val === 'Due Now' || val === 'Scheduled' || val === 'Awaiting Spares' || val === 'Assigned' || val === 'Due Soon' || val === 'Processing' || val === 'Overstaying' || val === 'Pending Return' || val === 'Under Investigation' || val === 'In Safe';
        const isNeutral = val === 'Pending' || val === 'Logged' || val === 'Verified' || val === 'Generated';
        const isDanger = val === 'Failed' || val === 'Faulty' || val === 'Offline' || val === 'Condemned';
        
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
