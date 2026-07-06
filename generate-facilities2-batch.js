const fs = require('fs');
const path = require('path');

const config = [
  // Ambulance Management
  {
    path: 'facilities/ambulance/dashboard', title: 'Ambulance Dashboard', desc: 'Live map view and metric summary of fleet location and status.',
    cols: ['Metric', 'Value', 'Target', 'Variance', 'Trend', 'Status'],
    stats: [{ label: 'Total Ambulances', val: '12', col: 'text-blue-400' }, { label: 'Currently Active', val: '5', col: 'text-emerald-400' }, { label: 'Under Maintenance', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Avg Response Time', 'Fleet Utilization', 'Trips Today', 'Fuel Efficiency', 'Patient Safely Dropped'];
      return { metric: metrics[i], value: '15 Mins', target: '< 20 Mins', variance: '-5 Mins', trend: 'Improving', status: 'On Track' };
    })`
  },
  {
    path: 'facilities/ambulance/booking', title: 'Ambulance Booking', desc: 'Logging requests for patient pickup or discharge drops.',
    cols: ['Booking ID', 'Patient/Caller', 'Pickup Location', 'Drop Location', 'Requested Time', 'Status'],
    stats: [{ label: 'Bookings Today', val: '24', col: 'text-blue-400' }, { label: 'Pending Dispatch', val: '2', col: 'text-amber-400' }, { label: 'Completed Trips', val: '18', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { bookingid: 'AMB-' + (1001+i), patientcaller: 'Caller ' + (1+i), pickuplocation: i===0?'Home (Sector 4)':'Hospital', droplocation: i===0?'Hospital':'Home', requestedtime: 'Today 10:00', status: i===0?'Pending Dispatch':'Completed' };
    })`
  },
  {
    path: 'facilities/ambulance/dispatch', title: 'Emergency Dispatch', desc: 'Assigning the nearest available ambulance and EMT crew to a booking.',
    cols: ['Dispatch ID', 'Ambulance Reg No', 'Driver Assigned', 'EMT Assigned', 'Dispatched At', 'Status'],
    stats: [{ label: 'Active Dispatches', val: '5', col: 'text-emerald-400' }, { label: 'Avg Dispatch Time', val: '2 Mins', col: 'text-blue-400' }, { label: 'Crews Available', val: '3', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { dispatchid: 'DSP-' + (2001+i), ambulanceregno: 'MH12 AB ' + (1000+i), driverassigned: 'Driver Bob', emtassigned: 'EMT Alice', dispatchedat: '10 Mins Ago', status: i===0?'En Route to Patient':'Available' };
    })`
  },
  {
    path: 'facilities/ambulance/driver', title: 'Driver Management', desc: 'Managing driver rosters, license renewals, and shift timings.',
    cols: ['Driver Name', 'License No', 'Expiry Date', 'Current Shift', 'Trips Today', 'Status'],
    stats: [{ label: 'Total Drivers', val: '24', col: 'text-blue-400' }, { label: 'On Duty', val: '10', col: 'text-emerald-400' }, { label: 'License Expiring', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { drivername: 'Driver ' + (1+i), licenseno: 'DL' + (9876543210+i), expirydate: i===0?'Next Month':'31 Dec 2028', currentshift: 'Morning', tripstoday: (2+i).toString(), status: i===0?'Action Required':'Active' };
    })`
  },
  {
    path: 'facilities/ambulance/tracking', title: 'Vehicle Tracking (GPS)', desc: 'GPS integration for live location tracking of the ambulance fleet.',
    cols: ['Vehicle No', 'Type (ALS/BLS)', 'Current Location', 'Speed', 'Ignition Status', 'Status'],
    stats: [{ label: 'GPS Active', val: '12/12', col: 'text-emerald-400' }, { label: 'Idle Vehicles', val: '7', col: 'text-blue-400' }, { label: 'Speeding Alerts', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { vehicleno: 'MH12 AB ' + (1000+i), typealsbls: i%2===0?'ALS':'BLS', currentlocation: i===0?'Highway 4':'Hospital Parking', speed: i===0?'45 km/h':'0 km/h', ignitionstatus: i===0?'ON':'OFF', status: i===0?'Moving':'Parked' };
    })`
  },
  {
    path: 'facilities/ambulance/history', title: 'Trip History', desc: 'Log book of all completed ambulance trips for auditing and maintenance scheduling.',
    cols: ['Trip ID', 'Vehicle', 'Start Km', 'End Km', 'Total Distance', 'Status'],
    stats: [{ label: 'Total Distance (Mo)', val: '4,500 Km', col: 'text-blue-400' }, { label: 'Avg Distance/Trip', val: '12 Km', col: 'text-emerald-400' }, { label: 'Fuel Logged', val: '450 Ltrs', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { tripid: 'TRP-' + (3001+i), vehicle: 'MH12 AB ' + (1000+i), startkm: (45000+i*20).toString(), endkm: (45015+i*20).toString(), totaldistance: '15 Km', status: 'Logged' };
    })`
  },
  {
    path: 'facilities/ambulance/billing', title: 'Ambulance Billing', desc: 'Integration with HIS for charging patients based on distance or zones.',
    cols: ['Billing ID', 'Linked Trip', 'Patient', 'Distance', 'Amount Charged', 'Status'],
    stats: [{ label: 'Revenue (Mo)', val: '$12,500', col: 'text-blue-400' }, { label: 'Free Trips (Camps)', val: '5', col: 'text-amber-400' }, { label: 'Pending Billing', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { billingid: 'ABL-' + (4001+i), linkedtrip: 'TRP-' + (3001+i), patient: 'Patient ' + (1+i), distance: '15 Km', amountcharged: '$' + (50+i*10), status: i===0?'Pending':'Billed' };
    })`
  },

  // Transport Management
  {
    path: 'facilities/transport/vehicle', title: 'Vehicle Management', desc: 'Managing non-ambulance fleet (Staff buses, supply vans, VIP cars).',
    cols: ['Vehicle Reg', 'Type', 'Capacity', 'Allocated To', 'Next Servicing', 'Status'],
    stats: [{ label: 'Total Vehicles', val: '8', col: 'text-blue-400' }, { label: 'Active on Route', val: '4', col: 'text-emerald-400' }, { label: 'Due for Service', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Staff Bus', 'Supply Van', 'Pharmacy Van', 'VIP Car', 'Staff Bus'];
      return { vehiclereg: 'MH12 XY ' + (2000+i), type: types[i], capacity: types[i]==='Staff Bus'?'40':'2', allocatedto: 'HR / Admin', nextservicing: i===1?'Next Week':'In 3 Months', status: i===1?'Maintenance Due':'Active' };
    })`
  },
  {
    path: 'facilities/transport/driver', title: 'Driver Management', desc: 'Roster and compliance tracking for transport drivers.',
    cols: ['Driver Name', 'License Type', 'Assigned Vehicle', 'Shift', 'Overtime Hrs', 'Status'],
    stats: [{ label: 'Total Drivers', val: '12', col: 'text-blue-400' }, { label: 'On Leave', val: '1', col: 'text-amber-400' }, { label: 'Accident Free Days', val: '340', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { drivername: 'Driver ' + (1+i), licensetype: 'Heavy Vehicle', assignedvehicle: 'Staff Bus 1', shift: 'Night Shift', overtimehrs: (2+i).toString(), status: 'Active' };
    })`
  },
  {
    path: 'facilities/transport/fuel', title: 'Fuel Log', desc: 'Tracking fuel consumption, issuing fuel cards, and checking mileage efficiency.',
    cols: ['Date', 'Vehicle', 'Driver', 'Fuel Added (Ltrs)', 'Cost', 'Status'],
    stats: [{ label: 'Fuel Cost (Mo)', val: '$3,400', col: 'text-blue-400' }, { label: 'Avg Mileage', val: '8 km/l', col: 'text-emerald-400' }, { label: 'Anomalies Detected', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: 'Yesterday', vehicle: 'Supply Van', driver: 'Driver Bob', fueladdedltrs: '45', cost: '$40', status: 'Verified' };
    })`
  },
  {
    path: 'facilities/transport/maintenance', title: 'Vehicle Maintenance', desc: 'Tracking periodic servicing, tire replacements, and PUC renewals.',
    cols: ['Vehicle', 'Maintenance Type', 'Workshop', 'Cost', 'Next Due Date', 'Status'],
    stats: [{ label: 'Maintenance Cost YTD', val: '$8,500', col: 'text-amber-400' }, { label: 'PUC Compliance', val: '100%', col: 'text-emerald-400' }, { label: 'Insurance Renewals', val: '2 (This Month)', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { vehicle: 'Staff Bus 2', maintenancetype: 'Oil Change', workshop: 'Authorized Center', cost: '$150', nextduedate: 'Oct 2026', status: 'Completed' };
    })`
  },
  {
    path: 'facilities/transport/requests', title: 'Transport Requests', desc: 'Internal requests for transport (e.g., dropping samples to a lab, picking up a visiting doctor).',
    cols: ['Request ID', 'Department', 'Purpose', 'Date/Time', 'Assigned Vehicle', 'Status'],
    stats: [{ label: 'Pending Requests', val: '3', col: 'text-amber-400' }, { label: 'Completed Today', val: '12', col: 'text-emerald-400' }, { label: 'Rejected', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { requestid: 'TREQ-' + (1001+i), department: 'Pathology', purpose: 'Sample Drop', datetime: 'Today 14:00', assignedvehicle: i===0?'-':'Supply Van', status: i===0?'Pending Approval':'Approved' };
    })`
  },

  // Mortuary Management
  {
    path: 'facilities/mortuary/register', title: 'Mortuary Register', desc: 'Digital log book of all bodies kept in the mortuary.',
    cols: ['Entry ID', 'Deceased Name', 'Date of Death', 'Brought By', 'Cabinet No', 'Status'],
    stats: [{ label: 'Current Bodies', val: '4', col: 'text-blue-400' }, { label: 'Capacity Total', val: '12', col: 'text-emerald-400' }, { label: 'Unidentified', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { entryid: 'MRT-' + (1001+i), deceasedname: i===0?'Unknown Male':'Patient ' + (1+i), dateofdeath: 'Yesterday', broughtby: 'Ward / Police', cabinetno: 'C-' + (1+i), status: i===4?'Released':'Stored' };
    })`
  },
  {
    path: 'facilities/mortuary/admission', title: 'Body Admission', desc: 'Intake process, tagging, and assigning a cold storage unit.',
    cols: ['Admission ID', 'UHID (if IPD)', 'Cause of Death', 'Tagged By', 'Handover Form', 'Status'],
    stats: [{ label: 'Admissions (Today)', val: '2', col: 'text-blue-400' }, { label: 'From IPD', val: '1', col: 'text-emerald-400' }, { label: 'Brought Dead (MLC)', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { admissionid: 'ADM-' + (2001+i), uhidifipd: i%2===0?'UHID-'+(10+i):'N/A', causeofdeath: 'Cardiac Arrest', taggedby: 'Nurse Alice', handoverform: 'Signed', status: 'Admitted' };
    })`
  },
  {
    path: 'facilities/mortuary/release', title: 'Body Release', desc: 'Formal handover process to relatives or police with necessary documentation.',
    cols: ['Release ID', 'Deceased Name', 'Released To', 'Relation', 'ID Proof', 'Status'],
    stats: [{ label: 'Releases (Today)', val: '3', col: 'text-emerald-400' }, { label: 'Pending NOC', val: '1', col: 'text-amber-400' }, { label: 'Avg Storage Time', val: '24 Hrs', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { releaseid: 'REL-' + (3001+i), deceasedname: 'Patient ' + (1+i), releasedto: 'John Doe', relation: 'Son', idproof: 'Verified', status: i===0?'Pending Police Clearance':'Released' };
    })`
  },
  {
    path: 'facilities/mortuary/postmortem', title: 'Postmortem Register', desc: 'Tracking bodies requiring autopsy and coordination with forensic doctors.',
    cols: ['PM ID', 'Deceased Name', 'Police Station', 'Assigned Doctor', 'Date/Time', 'Status'],
    stats: [{ label: 'Pending PMs', val: '1', col: 'text-red-400' }, { label: 'Completed (Mo)', val: '12', col: 'text-blue-400' }, { label: 'Reports Dispatched', val: '10', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { pmid: 'PM-' + (4001+i), deceasedname: 'Patient ' + (1+i), policestation: 'City Center PS', assigneddoctor: 'Dr. Forensic', datetime: i===0?'Today 14:00':'Yesterday', status: i===0?'Scheduled':'Completed' };
    })`
  },
  {
    path: 'facilities/mortuary/storage', title: 'Cold Storage Monitoring', desc: 'Monitoring temperature and maintenance of the mortuary cabinets.',
    cols: ['Cabinet No', 'Current Temp', 'Set Temp', 'Alarm Status', 'Last Defrost', 'Status'],
    stats: [{ label: 'Total Cabinets', val: '12', col: 'text-blue-400' }, { label: 'Functional', val: '11', col: 'text-emerald-400' }, { label: 'Under Maintenance', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { cabinetno: 'C-' + (1+i), currenttemp: i===4?'8°C':'3°C', settemp: '3°C', alarmstatus: i===4?'Triggered':'Normal', lastdefrost: 'Last Week', status: i===4?'Faulty':'Optimal' };
    })`
  },
  {
    path: 'facilities/mortuary/reports', title: 'Mortuary Reports', desc: 'Monthly summaries of admissions, medico-legal cases, and storage utility.',
    cols: ['Report Type', 'Month', 'Total Admissions', 'Total Releases', 'MLC Count', 'Status'],
    stats: [{ label: 'Total Handled (YTD)', val: '145', col: 'text-blue-400' }, { label: 'MLC %', val: '30%', col: 'text-amber-400' }, { label: 'Audit Status', val: 'Pass', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reporttype: 'Monthly Summary', month: ['June', 'May', 'April', 'March', 'Feb'][i] + ' 2026', totaladmissions: (20+i).toString(), totalreleases: (19+i).toString(), mlccount: (5+i).toString(), status: 'Generated' };
    })`
  },

  // Waste Management
  {
    path: 'facilities/waste/biomedical', title: 'Biomedical Waste', desc: 'Tracking the generation and weighing of biomedical waste (Red, Yellow, Blue bins).',
    cols: ['Log ID', 'Department', 'Waste Category', 'Weight (Kg)', 'Date/Time', 'Status'],
    stats: [{ label: 'Waste Gen Today', val: '450 Kg', col: 'text-blue-400' }, { label: 'Yellow Bag Weight', val: '200 Kg', col: 'text-amber-400' }, { label: 'Red Bag Weight', val: '150 Kg', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Yellow (Infected)', 'Red (Plastics)', 'Blue (Glass)', 'White (Sharps)', 'Yellow (Infected)'];
      return { logid: 'BMW-' + (1001+i), department: 'ICU', wastecategory: cats[i], weightkg: (10+i*2).toString(), datetime: 'Today 10:00', status: 'Logged' };
    })`
  },
  {
    path: 'facilities/waste/collection', title: 'Waste Collection', desc: 'Logging the internal collection route by housekeeping from wards to central storage.',
    cols: ['Route ID', 'Floor/Wing', 'Collected By', 'Bags Count', 'Time', 'Status'],
    stats: [{ label: 'Routes Completed', val: '12/12', col: 'text-emerald-400' }, { label: 'Pending Routes', val: '0', col: 'text-green-500' }, { label: 'Total Bags', val: '85', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { routeid: 'WC-' + (2001+i), floorwing: 'Level ' + (1+i), collectedby: 'HK Staff ' + i, bagscount: (15+i).toString(), time: '09:00 AM', status: 'Completed' };
    })`
  },
  {
    path: 'facilities/waste/segregation', title: 'Waste Segregation', desc: 'Auditing and reporting any improper mixing of waste at the source (e.g., plastics in yellow bin).',
    cols: ['Audit ID', 'Department', 'Violation Found', 'Penalty/Warning', 'Auditor', 'Status'],
    stats: [{ label: 'Segregation Compliance', val: '95%', col: 'text-emerald-400' }, { label: 'Violations (Mo)', val: '4', col: 'text-red-400' }, { label: 'Staff Retrained', val: '8', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { auditid: 'AUD-' + (3001+i), department: 'Ward B', violationfound: i===0?'Sharps in Red Bin':'None', penaltywarning: i===0?'Warning Issued':'N/A', auditor: 'Infection Control', status: i===0?'Action Required':'Pass' };
    })`
  },
  {
    path: 'facilities/waste/disposal', title: 'Waste Disposal', desc: 'Final manifest and tracking of waste handed over to the external authorized vendor.',
    cols: ['Manifest No', 'Vehicle Reg', 'Total Weight (Kg)', 'Authorized Sign', 'Date', 'Status'],
    stats: [{ label: 'Vendor Pickups (Mo)', val: '30', col: 'text-blue-400' }, { label: 'Total Disposed', val: '14,500 Kg', col: 'text-amber-400' }, { label: 'Disposal Cost', val: '$2,400', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { manifestno: 'MF-' + (4001+i), vehiclereg: 'MH12 XX 9876', totalweightkg: (400+i*10).toString(), authorizedsign: 'Admin Head', date: 'Yesterday', status: 'Dispatched' };
    })`
  },
  {
    path: 'facilities/waste/vendor', title: 'Vendor Collection', desc: 'Contract details, pricing, and compliance certificates for the waste disposal vendor.',
    cols: ['Vendor Name', 'License No', 'Expiry Date', 'Contract Valid Till', 'Rate/Kg', 'Status'],
    stats: [{ label: 'Active Vendor', val: 'EcoWaste Solutions', col: 'text-blue-400' }, { label: 'License Status', val: 'Valid', col: 'text-emerald-400' }, { label: 'Next Renewal', val: '6 Months', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { vendorname: 'EcoWaste Solutions', licenseno: 'PCB-12345', expirydate: '31 Dec 2027', contractvalidtill: '31 Dec 2026', ratekg: '$0.50', status: 'Active' };
    })`
  },
  {
    path: 'facilities/waste/compliance', title: 'Compliance Reports', desc: 'Statutory reports required by Pollution Control Boards regarding waste generation.',
    cols: ['Report Type', 'Filing Period', 'Generated By', 'Filing Date', 'Acknowledgement No', 'Status'],
    stats: [{ label: 'Regulatory Compliance', val: '100%', col: 'text-emerald-400' }, { label: 'Last Filed', val: 'June 2026', col: 'text-blue-400' }, { label: 'Next Due', val: '15 Aug 2026', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reporttype: 'Annual BMW Return', filingperiod: 'FY 25-26', generatedby: 'Facility Head', filingdate: '10 Apr 2026', acknowledgementno: 'ACK-9876' + i, status: 'Filed' };
    })`
  },

  // Utilities Management
  {
    path: 'facilities/utilities/electricity', title: 'Electricity Monitoring', desc: 'Tracking main grid consumption, power factor, and department sub-metering.',
    cols: ['Meter Location', 'Current Reading', 'Consumption (kWh)', 'Power Factor', 'Cost Estimated', 'Status'],
    stats: [{ label: 'Total Power (Today)', val: '12,400 kWh', col: 'text-blue-400' }, { label: 'Est. Cost', val: '$1,240', col: 'text-amber-400' }, { label: 'Power Factor', val: '0.98', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { meterlocation: 'Main Incomer', currentreading: (150000+i*1000).toString(), consumptionkwh: (1200+i*50).toString(), powerfactor: '0.98', costestimated: '$120', status: 'Normal' };
    })`
  },
  {
    path: 'facilities/utilities/water', title: 'Water Monitoring', desc: 'Tracking municipal intake, borewell usage, and STP (Sewage Treatment Plant) output.',
    cols: ['Source/Meter', 'Intake (Ltrs)', 'Level (%)', 'Quality Check (pH)', 'Pump Status', 'Status'],
    stats: [{ label: 'Total Storage', val: '50,000 L', col: 'text-blue-400' }, { label: 'Current Level', val: '85%', col: 'text-emerald-400' }, { label: 'STP Operational', val: 'Yes', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const sources = ['Main Overhead Tank', 'Underground Sump', 'Borewell 1', 'STP Output', 'RO Plant'];
      return { sourcemeter: sources[i], intakeltrs: (5000+i*1000).toString(), level: (80+i*2) + '%', qualitycheckph: '7.2', pumpstatus: 'Auto', status: 'Normal' };
    })`
  },
  {
    path: 'facilities/utilities/oxygen', title: 'Oxygen Supply (LMO)', desc: 'Critical monitoring of Liquid Medical Oxygen tank levels and manifold pressure.',
    cols: ['Tank/Manifold', 'Capacity', 'Current Level', 'Pressure (Bar)', 'Est. Run Time', 'Status'],
    stats: [{ label: 'LMO Level', val: '65%', col: 'text-blue-400' }, { label: 'Days Remaining', val: '4 Days', col: 'text-amber-400' }, { label: 'Cylinder Backup', val: '100% Full', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { tankmanifold: i===0?'Main LMO Tank':'Backup Manifold', capacity: i===0?'10KL':'20 Cylinders', currentlevel: i===0?'65%':'100%', pressurebar: '4.5 Bar', estruntime: i===0?'4 Days':'-', status: 'Normal' };
    })`
  },
  {
    path: 'facilities/utilities/gas', title: 'Medical Gas Pipeline', desc: 'Monitoring vacuum (suction), nitrous oxide, and compressed air pipelines across wards.',
    cols: ['Gas Type', 'Manifold Location', 'Line Pressure', 'Alarm Status', 'Last Leak Check', 'Status'],
    stats: [{ label: 'All Lines Pressure', val: 'Nominal', col: 'text-emerald-400' }, { label: 'Vacuum Pumps', val: 'Active', col: 'text-blue-400' }, { label: 'Leak Alerts', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const gases = ['Oxygen', 'Nitrous Oxide', 'Medical Air', 'Vacuum', 'Instrument Air'];
      return { gastype: gases[i], manifoldlocation: 'Plant Room 1', linepressure: '4.2 Bar', alarmstatus: 'Normal', lastleakcheck: 'Yesterday', status: 'Operational' };
    })`
  },
  {
    path: 'facilities/utilities/generator', title: 'Generator Monitoring', desc: 'Diesel Generator (DG) set health, fuel levels, and auto-start logs during power failures.',
    cols: ['DG Set ID', 'Capacity', 'Fuel Level', 'Running Hrs', 'Battery Health', 'Status'],
    stats: [{ label: 'Total DG Capacity', val: '1500 kVA', col: 'text-blue-400' }, { label: 'Fuel Stock', val: '1200 Ltrs', col: 'text-emerald-400' }, { label: 'Last Auto-Sync', val: 'Success', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { dgsetid: 'DG-' + (1+i), capacity: '500 kVA', fuellevel: (85-i*5) + '%', runninghrs: (120+i*10).toString(), batteryhealth: 'Good', status: 'Standby' };
    })`
  },
  {
    path: 'facilities/utilities/hvac', title: 'HVAC Monitoring', desc: 'Central air conditioning control, OT temperature/humidity monitoring, and chiller plant status.',
    cols: ['Chiller/AHU Unit', 'Location Served', 'Set Temp', 'Actual Temp', 'Humidity', 'Status'],
    stats: [{ label: 'Chiller Load', val: '65%', col: 'text-blue-400' }, { label: 'OT Compliance (Temp)', val: '100%', col: 'text-emerald-400' }, { label: 'Filter Cleaning Due', val: '2 AHUs', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { chillerahuunit: 'AHU ' + (1+i), locationserved: i===0?'Main OT':'ICU', settemp: '20°C', actualtemp: '20.5°C', humidity: '55%', status: 'Running' };
    })`
  },

  // Inventory Requests (Facilities)
  {
    path: 'facilities/inventory/department', title: 'Department Requests', desc: 'Wards requesting non-medical items (Furniture, IT hardware, dustbins).',
    cols: ['Request ID', 'Department', 'Item Requested', 'Quantity', 'Justification', 'Status'],
    stats: [{ label: 'Pending Requests', val: '12', col: 'text-amber-400' }, { label: 'Approved Today', val: '5', col: 'text-emerald-400' }, { label: 'Rejected', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { requestid: 'REQ-' + (1001+i), department: 'OPD', itemrequested: 'Waiting Chairs', quantity: '10', justification: 'Expansion', status: i===0?'Pending Approval':'Approved' };
    })`
  },
  {
    path: 'facilities/inventory/consumable', title: 'Consumable Requests', desc: 'Requests for cleaning chemicals, mops, tissues, and stationery.',
    cols: ['Request ID', 'Requested By', 'Category', 'Items Count', 'Total Value', 'Status'],
    stats: [{ label: 'Monthly Budget', val: '$5,000', col: 'text-blue-400' }, { label: 'Utilized YTD', val: '$2,400', col: 'text-emerald-400' }, { label: 'Low Stock Alerts', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { requestid: 'CON-' + (2001+i), requestedby: 'Housekeeping', category: 'Cleaning Supplies', itemscount: '15', totalvalue: '$120', status: 'Issued' };
    })`
  },
  {
    path: 'facilities/inventory/maintenance', title: 'Maintenance Materials', desc: 'Spares requested by engineers (Bulbs, wires, plumbing fittings) to close work orders.',
    cols: ['Indent ID', 'Linked WO', 'Engineer', 'Spares Required', 'Store Availability', 'Status'],
    stats: [{ label: 'Open Indents', val: '8', col: 'text-amber-400' }, { label: 'Out of Stock items', val: '2', col: 'text-red-400' }, { label: 'Value Issued', val: '$450 (Today)', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { indentid: 'IND-' + (3001+i), linkedwo: 'WO-100' + i, engineer: 'Tech Bob', sparesrequired: 'LED Bulbs x 5', storeavailability: i===0?'Out of Stock':'Available', status: i===0?'Awaiting Purchase':'Issued' };
    })`
  },
  {
    path: 'facilities/inventory/approval', title: 'Approval Queue', desc: 'Workflow for Facility Head or Admin to approve high-value inventory requests.',
    cols: ['Request ID', 'Department', 'Value', 'Requested Date', 'Budget Available', 'Status'],
    stats: [{ label: 'Items to Approve', val: '5', col: 'text-amber-400' }, { label: 'Total Value Pending', val: '$2,400', col: 'text-blue-400' }, { label: 'Avg Approval Time', val: '4 Hrs', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { requestid: 'REQ-' + (4001+i), department: 'Radiology', value: '$' + (500+i*100), requesteddate: 'Yesterday', budgetavailable: 'Yes', status: i<2?'Pending Approval':'Approved' };
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
        const isGood = val === 'Active' || val === 'Available' || val === 'Completed' || val === 'Functional' || val === 'Optimal' || val === 'On Track' || val === 'Moving' || val === 'Logged' || val === 'Billed' || val === 'Normal' || val === 'Operational' || val === 'Standby' || val === 'Running' || val === 'Approved' || val === 'Issued' || val === 'Dispatched' || val === 'Filed' || val === 'Released';
        const isWarning = val === 'Pending Dispatch' || val === 'En Route to Patient' || val === 'Action Required' || val === 'Maintenance Due' || val === 'Pending' || val === 'Pending Approval' || val === 'Pending Police Clearance' || val === 'Scheduled' || val === 'Awaiting Purchase';
        const isNeutral = val === 'Stored' || val === 'Admitted' || val === 'Generated';
        const isDanger = val === 'Faulty' || val === 'Failed' || val === 'Rejected';
        
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
