const fs = require('fs');
const path = require('path');

const config = [
  // Operational Analytics
  {
    path: 'executive/operations/appointments', title: 'Appointment Analytics', desc: 'Trends in OPD bookings, walk-ins, and online vs offline mix.',
    cols: ['Specialty', 'Total Booked', 'Walk-ins', 'Online %', 'No-Show Rate', 'Status'],
    stats: [{ label: 'Total Appointments', val: '4,500 (MTD)', col: 'text-blue-400' }, { label: 'Online Booking', val: '45%', col: 'text-emerald-400' }, { label: 'No-Show Rate', val: '12%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const specs = ['Cardiology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Gynecology'];
      return { specialty: specs[i], totalbooked: (800-i*100).toString(), walkins: (200-i*20).toString(), online: (30+i*5) + '%', noshowrate: (15-i) + '%', status: 'Normal' };
    })`
  },
  {
    path: 'executive/operations/waiting', title: 'Waiting Time', desc: 'Granular analysis of patient waiting times across different touchpoints.',
    cols: ['Touchpoint', 'Target Wait', 'Avg Wait (MTD)', 'Max Wait', 'Patient Satisfaction', 'Status'],
    stats: [{ label: 'Avg Global Wait', val: '24 Mins', col: 'text-blue-400' }, { label: 'Target Wait', val: '< 20 Mins', col: 'text-emerald-400' }, { label: 'Worst Touchpoint', val: 'Pharmacy', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { touchpoint: ['Registration', 'Doctor Consult', 'Billing', 'Diagnostics', 'Pharmacy'][i], targetwait: '15 Mins', avgwaitmtd: (10+i*5) + ' Mins', maxwait: (30+i*10) + ' Mins', patientsatisfaction: (90-i*2) + '%', status: i>2?'Requires Review':'Optimal' };
    })`
  },
  {
    path: 'executive/operations/queue', title: 'Queue Analysis', desc: 'Queue length tracking and staff allocation efficiency.',
    cols: ['Counter/Area', 'Current Queue', 'Avg Processing Time', 'Staff Deployed', 'Abandonment Rate', 'Status'],
    stats: [{ label: 'Longest Queue', val: 'OPD Billing', col: 'text-amber-400' }, { label: 'Avg Process Time', val: '4 Mins', col: 'text-emerald-400' }, { label: 'Staffing Level', val: 'Adequate', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { counterarea: ['OPD Billing', 'Pharmacy Dispense', 'Registration Desk', 'Sample Collection', 'IPD Admission'][i], currentqueue: (15-i*2).toString(), avgprocessingtime: (3+i) + ' Mins', staffdeployed: (4-i===0?1:i).toString(), abandonmentrate: '2%', status: i===0?'High Volume':'Normal' };
    })`
  },
  {
    path: 'executive/operations/ot', title: 'OT Utilization', desc: 'Operation theater efficiency, turnaround times, and scheduling gaps.',
    cols: ['OT Number', 'Scheduled Hours', 'Actual Utilization', 'Turnaround Time', 'First Case On-Time', 'Status'],
    stats: [{ label: 'Global OT Utilization', val: '78%', col: 'text-emerald-400' }, { label: 'Avg Turnaround', val: '35 Mins', col: 'text-blue-400' }, { label: 'Cancellations', val: '3%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { otnumber: 'OT - 0' + (1+i), scheduledhours: '12 Hrs', actualutilization: (85-i*5) + '%', turnaroundtime: (30+i*2) + ' Mins', firstcaseontime: (90-i*5) + '%', status: i===4?'Underutilized':'Optimal' };
    })`
  },
  {
    path: 'executive/operations/lab', title: 'Laboratory Performance', desc: 'Sample volume, Turnaround Time (TAT) compliance, and reagent wastage.',
    cols: ['Test Category', 'Volume (MTD)', 'Stat %', 'Avg TAT', 'TAT Compliance', 'Status'],
    stats: [{ label: 'Total Tests (MTD)', val: '45,000', col: 'text-blue-400' }, { label: 'Global TAT Met', val: '92%', col: 'text-emerald-400' }, { label: 'Stat TAT Missed', val: '4%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { testcategory: ['Biochemistry', 'Hematology', 'Microbiology', 'Pathology', 'Immunology'][i], volumemtd: (15000-i*2000).toString(), stat: (10+i) + '%', avgtat: (45+i*15) + ' Mins', tatcompliance: (95-i) + '%', status: 'Compliant' };
    })`
  },
  {
    path: 'executive/operations/radiology', title: 'Radiology Performance', desc: 'Imaging volumes, reporting turnaround times, and machine utilization.',
    cols: ['Modality', 'Scans Performed', 'Avg Scan Time', 'Reporting TAT', 'Machine Uptime', 'Status'],
    stats: [{ label: 'Total Scans (MTD)', val: '4,200', col: 'text-blue-400' }, { label: 'Reporting TAT', val: '2.5 Hrs', col: 'text-emerald-400' }, { label: 'Machine Downtime', val: '1.2%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { modality: ['MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'PET-CT'][i], scansperformed: (800-i*100).toString(), avgscantime: (20+i*10) + ' Mins', reportingtat: (2+i*0.5) + ' Hrs', machineuptime: '99%', status: 'Optimal' };
    })`
  },
  {
    path: 'executive/operations/pharmacy', title: 'Pharmacy Performance', desc: 'Prescription fill rates, wait times, and generic vs branded dispensing ratio.',
    cols: ['Pharmacy Unit', 'Prescriptions Filled', 'Avg Dispense Time', 'Generic Sub %', 'Stockouts', 'Status'],
    stats: [{ label: 'Total Prescriptions', val: '12,400', col: 'text-blue-400' }, { label: 'Avg Dispense Time', val: '8 Mins', col: 'text-emerald-400' }, { label: 'Inventory Turns', val: '12x', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { pharmacyunit: ['Main OPD', 'IPD Pharmacy', 'Emergency Rx', 'Oncology Rx', 'Discharge Rx'][i], prescriptionsfilled: (4000-i*500).toString(), avgdispensetime: (5+i) + ' Mins', genericsub: (30+i*2) + '%', stockouts: (10-i).toString(), status: 'Efficient' };
    })`
  },

  // Inventory Analytics
  {
    path: 'executive/inventory/valuation', title: 'Stock Valuation', desc: 'Current value of inventory held across central warehouse and sub-stores.',
    cols: ['Store/Department', 'Total SKUs', 'Current Value', 'MoM Change', 'Dead Stock Value', 'Status'],
    stats: [{ label: 'Total Inventory Value', val: '$2.4M', col: 'text-blue-400' }, { label: 'Dead Stock Estimate', val: '$120K', col: 'text-amber-400' }, { label: 'Near Expiry (90d)', val: '$45K', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { storedepartment: ['Main Warehouse', 'Pharmacy Store', 'OT Store', 'Lab Store', 'General Store'][i], totalskus: (4500-i*500).toString(), currentvalue: '$' + (800-i*100) + 'K', momchange: '+' + (2+i) + '%', deadstockvalue: '$' + (40-i*5) + 'K', status: 'Healthy' };
    })`
  },
  {
    path: 'executive/inventory/consumption', title: 'Stock Consumption', desc: 'Usage rates of high-value consumables and drugs.',
    cols: ['Category', 'Consumption Value', 'Variance from Budget', 'Top Consuming Dept', 'Turnover Ratio', 'Status'],
    stats: [{ label: 'Monthly Consumption', val: '$1.2M', col: 'text-blue-400' }, { label: 'Budget Variance', val: '-2%', col: 'text-emerald-400' }, { label: 'High-Value Usage', val: '$800K', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { category: ['Surgical Implants', 'Life-Saving Drugs', 'Reagents', 'IV Fluids', 'General Consumables'][i], consumptionvalue: '$' + (400-i*50) + 'K', variancefrombudget: (i%2===0?'+':'-') + '1.5%', topconsumingdept: i===0?'OT':i===2?'Lab':'ICU', turnoverratio: (8-i) + 'x', status: i===0?'Over Budget':'On Target' };
    })`
  },
  {
    path: 'executive/inventory/reorder', title: 'Reorder Status', desc: 'Insights into items hitting reorder levels and stockout risks.',
    cols: ['Item Class', 'Items < Reorder Level', 'Critical Stockouts', 'Avg Procure Time', 'Pending PO Value', 'Status'],
    stats: [{ label: 'Items Below Reorder', val: '145', col: 'text-amber-400' }, { label: 'Critical Stockouts', val: '2', col: 'text-red-400' }, { label: 'Total Pending POs', val: '$450K', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemclass: ['Class A (High Value)', 'Class B', 'Class C', 'Vital', 'Essential'][i], itemsreorderlevel: (15+i*5).toString(), criticalstockouts: i===3?'2':'0', avgprocuretime: (7+i*2) + ' Days', pendingpovalue: '$' + (150-i*20) + 'K', status: i===3?'Critical Risk':'Manageable' };
    })`
  },
  {
    path: 'executive/inventory/purchase', title: 'Purchase Analytics', desc: 'Analysis of procurement spend, bulk discounts, and buying patterns.',
    cols: ['Procurement Type', 'Spend (YTD)', 'Avg Discount', 'Contract Compliance', 'Spot Buys', 'Status'],
    stats: [{ label: 'Total Spend (YTD)', val: '$8.5M', col: 'text-blue-400' }, { label: 'Savings Realized', val: '$420K', col: 'text-emerald-400' }, { label: 'Spot Buy Ratio', val: '12%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { procurementtype: ['Rate Contracts', 'Tender/Bids', 'Spot Purchases', 'Consignment', 'Capital Equip'][i], spendytd: '$' + (3-i*0.5).toFixed(1) + 'M', avgdiscount: (15-i*2) + '%', contractcompliance: (95-i*5) + '%', spotbuys: (5+i*2) + '%', status: 'Optimal' };
    })`
  },
  {
    path: 'executive/inventory/vendors', title: 'Vendor Performance', desc: 'Evaluation of suppliers based on delivery timelines, quality, and pricing.',
    cols: ['Vendor Name', 'Total PO Value', 'On-Time Delivery', 'Quality Rejects', 'Overall Rating', 'Status'],
    stats: [{ label: 'Active Vendors', val: '240', col: 'text-blue-400' }, { label: 'Avg On-Time Del.', val: '92%', col: 'text-emerald-400' }, { label: 'Underperforming', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { vendorname: 'Pharma Dist. ' + (1+i), totalpovalue: '$' + (500-i*50) + 'K', ontimedelivery: (98-i*3) + '%', qualityrejects: (0.5+i*0.5) + '%', overallrating: (4.8-i*0.2).toFixed(1) + '/5', status: i===4?'Review Suggested':'Excellent' };
    })`
  },
  {
    path: 'executive/inventory/assets', title: 'Asset Utilization', desc: 'Tracking utilization and ROI of expensive medical equipment.',
    cols: ['Equipment Group', 'Total Assets', 'Avg Daily Usage', 'Maintenance Cost', 'Est. ROI Time', 'Status'],
    stats: [{ label: 'Capital Asset Value', val: '$24.5M', col: 'text-blue-400' }, { label: 'Overall Utilization', val: '68%', col: 'text-amber-400' }, { label: 'Assets Under Maint.', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { equipmentgroup: ['MRI / CT Scanners', 'OT Equipment', 'ICU Monitors', 'Dialysis Machines', 'Lab Analyzers'][i], totalassets: (5+i*5).toString(), avgdailyusage: (8+i) + ' Hrs', maintenancecost: '$' + (50-i*5) + 'K/Yr', estroitime: (24+i*6) + ' Months', status: i===0?'High ROI':'Normal' };
    })`
  },
  {
    path: 'executive/inventory/downtime', title: 'Equipment Downtime', desc: 'Impact of biomedical equipment breakdowns on operations.',
    cols: ['Department', 'Downtime Incidents', 'Total Lost Hours', 'Est. Revenue Loss', 'MTTR', 'Status'],
    stats: [{ label: 'Global Uptime', val: '98.5%', col: 'text-emerald-400' }, { label: 'Total Revenue Lost', val: '$45K (MTD)', col: 'text-red-400' }, { label: 'Avg Repair Time', val: '12 Hrs', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: ['Radiology', 'Operation Theater', 'Laboratory', 'ICU', 'Emergency'][i], downtimeincidents: (2+i).toString(), totallosthours: (15+i*5).toString(), estrevenueloss: '$' + (20-i*2) + 'K', mttr: (8+i*2) + ' Hrs', status: i===0?'High Impact':'Managed' };
    })`
  },

  // Human Resource Analytics
  {
    path: 'executive/hr/dashboard', title: 'Employee Dashboard', desc: 'High-level overview of hospital staffing, headcount, and diversity.',
    cols: ['Category', 'Headcount', 'New Hires (YTD)', 'Exits (YTD)', 'Gender Ratio (M/F)', 'Status'],
    stats: [{ label: 'Total Headcount', val: '1,250', col: 'text-blue-400' }, { label: 'Clinical vs Non', val: '60% / 40%', col: 'text-blue-400' }, { label: 'Open Positions', val: '45', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { category: ['Doctors', 'Nurses', 'Paramedical', 'Admin & Mgmt', 'Support Staff'][i], headcount: (200+i*50).toString(), newhiresytd: (20+i*5).toString(), exitsytd: (15+i*2).toString(), genderratio: '45/55', status: 'Stable' };
    })`
  },
  {
    path: 'executive/hr/attendance', title: 'Attendance Analytics', desc: 'Absenteeism trends, overtime hours, and shift adherence.',
    cols: ['Department', 'Absenteeism %', 'Avg Overtime/Emp', 'Late Arrivals', 'Shift Compliance', 'Status'],
    stats: [{ label: 'Global Absenteeism', val: '4.2%', col: 'text-emerald-400' }, { label: 'Total Overtime', val: '1,200 Hrs', col: 'text-amber-400' }, { label: 'Leave Liability', val: '$150K', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: ['Nursing', 'Housekeeping', 'Front Desk', 'Laboratory', 'Security'][i], absenteeism: (3+i*0.5) + '%', avgovertimeemp: (2+i) + ' Hrs', latearrivals: (15+i*2) + '%', shiftcompliance: (95-i) + '%', status: i===0?'High Overtime':'Normal' };
    })`
  },
  {
    path: 'executive/hr/payroll', title: 'Payroll Analytics', desc: 'Salary distributions, benefits costs, and HR budget vs actuals.',
    cols: ['Staff Level', 'Total Payroll (Mo)', 'Benefits %', 'Avg CTC', 'Budget Variance', 'Status'],
    stats: [{ label: 'Monthly Payroll', val: '$1.8M', col: 'text-blue-400' }, { label: 'Cost Per Bed', val: '$4,500', col: 'text-blue-400' }, { label: 'Budget Variance', val: '+1.5%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { stafflevel: ['Senior Consultants', 'Junior Doctors', 'Nursing Staff', 'Management', 'Support Staff'][i], totalpayrollmo: '$' + (500-i*50) + 'K', benefits: '15%', avgctc: '$' + (120-i*20) + 'K', budgetvariance: (i%2===0?'+':'-') + '1%', status: 'Within Limits' };
    })`
  },
  {
    path: 'executive/hr/productivity', title: 'Productivity Metrics', desc: 'Revenue per employee, patients per nurse, and clinical efficiency.',
    cols: ['Metric', 'Current Value', 'Industry Benchmark', 'Variance', 'Target', 'Status'],
    stats: [{ label: 'Revenue/Employee', val: '$85K', col: 'text-emerald-400' }, { label: 'Nurse-to-Patient', val: '1:6 (Ward)', col: 'text-blue-400' }, { label: 'Productivity Score', val: '88/100', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { metric: ['Revenue per FTE', 'Cost per Discharge', 'IPD Patients per Nurse', 'OPD Consults per Doc', 'Lab Tests per Tech'][i], currentvalue: i===0?'$85K':i===1?'$4.5K':i===2?'1:6':i===3?'40/Day':'120/Day', industrybenchmark: i===0?'$80K':'Varies', variance: '+5%', target: 'Top Quartile', status: 'Optimal' };
    })`
  },
  {
    path: 'executive/hr/utilization', title: 'Staff Utilization', desc: 'Identifying over-staffed or under-staffed departments based on patient volume.',
    cols: ['Department', 'Required FTEs', 'Actual FTEs', 'Utilization %', 'Fatigue Risk', 'Status'],
    stats: [{ label: 'Overall Utilization', val: '85%', col: 'text-blue-400' }, { label: 'Understaffed Depts', val: '2', col: 'text-amber-400' }, { label: 'Burnout Risk Cases', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: ['Emergency', 'ICU', 'General Ward', 'OPD', 'Pharmacy'][i], requiredftes: (50-i*5).toString(), actualftes: (45-i*4).toString(), utilization: (110-i*5) + '%', fatiguerisk: i<2?'High':'Low', status: i<2?'Understaffed':'Balanced' };
    })`
  },
  {
    path: 'executive/hr/recruitment', title: 'Recruitment Analytics', desc: 'Time-to-hire, cost-per-hire, and sourcing channel effectiveness.',
    cols: ['Role Category', 'Open Roles', 'Avg Time to Fill', 'Offer Accept Rate', 'Cost per Hire', 'Status'],
    stats: [{ label: 'Open Requisitions', val: '45', col: 'text-blue-400' }, { label: 'Global Time to Fill', val: '42 Days', col: 'text-amber-400' }, { label: 'Offer Accept %', val: '78%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { rolecategory: ['Specialist Doctors', 'Nursing Leads', 'IT/Admin', 'Technicians', 'Support Staff'][i], openroles: (5+i*2).toString(), avgtimetofill: (60-i*5) + ' Days', offeracceptrate: (70+i*5) + '%', costperhire: '$' + (5000-i*500), status: i===0?'Hard to Fill':'Sourcing' };
    })`
  },
  {
    path: 'executive/hr/attrition', title: 'Attrition Analysis', desc: 'Staff turnover rates, exit interview insights, and retention strategies.',
    cols: ['Department', 'Annual Attrition %', 'Regrettable Loss', 'Primary Exit Reason', 'Avg Tenure', 'Status'],
    stats: [{ label: 'Global Attrition', val: '18%', col: 'text-amber-400' }, { label: 'Clinical Attrition', val: '22%', col: 'text-red-400' }, { label: 'Retention Cost Target', val: '$200K', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: ['Nursing', 'Front Desk', 'Paramedical', 'Admin', 'Doctors'][i], annualattrition: (25-i*3) + '%', regrettableloss: (15-i) + '%', primaryexitreason: i===0?'Better Pay':i===1?'Career Growth':'Relocation', avgtenure: (2+i) + ' Years', status: i===0?'High Risk':'Stable' };
    })`
  },

  // Quality & Compliance
  {
    path: 'executive/quality/nabh', title: 'NABH Compliance', desc: 'Tracking compliance against National Accreditation Board for Hospitals standards.',
    cols: ['Chapter', 'Indicators Met', 'Non-Compliances', 'Last Audit Date', 'Compliance Score', 'Status'],
    stats: [{ label: 'Overall Compliance', val: '94%', col: 'text-emerald-400' }, { label: 'Major NCs', val: '0', col: 'text-green-500' }, { label: 'Next Assessment', val: 'Oct 2026', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { chapter: ['Patient Care (COP)', 'Facility Mgmt (FMS)', 'Infection Control (HIC)', 'Quality (CQI)', 'HR Mgmt (HRM)'][i], indicatorsmet: '45/48', noncompliances: i===2?'2 Minor':'0', lastauditdate: 'Jan 2026', compliancescore: (96-i) + '%', status: i===2?'Action Required':'Compliant' };
    })`
  },
  {
    path: 'executive/quality/audit', title: 'Clinical Audit', desc: 'Results of internal peer reviews, prescription audits, and record completeness.',
    cols: ['Audit Type', 'Records Sampled', 'Deficiency Rate', 'Critical Errors', 'Lead Auditor', 'Status'],
    stats: [{ label: 'Audits Conducted', val: '12 (MTD)', col: 'text-blue-400' }, { label: 'Avg Completeness', val: '92%', col: 'text-emerald-400' }, { label: 'Critical Findings', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { audittype: ['Prescription Audit', 'Surgical Safety Checklist', 'Discharge Summary Completeness', 'Consent Form Audit', 'Nursing Notes'][i], recordssampled: '100', deficiencyrate: (5+i) + '%', criticalerrors: i===0?'2':'0', leadauditor: 'Dr. Quality', status: 'Reviewed' };
    })`
  },
  {
    path: 'executive/quality/infection', title: 'Infection Control (HIC)', desc: 'Executive view of hospital-acquired infections and antibiotic stewardship.',
    cols: ['Metric', 'Current Rate', 'Benchmark', 'Cost Impact (Est)', 'Compliance', 'Status'],
    stats: [{ label: 'HAI Rate', val: '1.8%', col: 'text-emerald-400' }, { label: 'Hand Hygiene', val: '88%', col: 'text-amber-400' }, { label: 'Abx Resistance', val: 'Monitored', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { metric: ['CAUTI / 1000 Days', 'CLABSI / 1000 Days', 'SSI Rate', 'Hand Hygiene Compliance', 'Restricted Abx Usage'][i], currentrate: i<2?'1.2':i===3?'88%':'15%', benchmark: i<2?'<1.5':i===3?'>95%':'<10%', costimpact: '$' + (5000-i*1000), compliance: i===3?'Below Target':'Met', status: i===3?'Improvement Needed':'Optimal' };
    })`
  },
  {
    path: 'executive/quality/incidents', title: 'Incident Reports', desc: 'Medication errors, patient falls, and near-misses reporting trends.',
    cols: ['Category', 'Incidents Reported', 'Sentinel Events', 'Root Cause Defined', 'CAPA Closed', 'Status'],
    stats: [{ label: 'Total Incidents (YTD)', val: '145', col: 'text-blue-400' }, { label: 'Sentinel Events', val: '0', col: 'text-green-500' }, { label: 'Reporting Culture', val: 'Improving', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { category: ['Medication Error', 'Patient Fall', 'Needlestick Injury', 'Identification Error', 'Equipment Failure'][i], incidentsreported: (20-i*3).toString(), sentinelevents: '0', rootcausedefined: '100%', capaclosed: '90%', status: 'Monitored' };
    })`
  },
  {
    path: 'executive/quality/capa', title: 'CAPA Tracking', desc: 'Corrective and Preventive Actions closure rates across all departments.',
    cols: ['Source', 'Open CAPAs', 'Overdue', 'Avg Time to Close', 'Verification Status', 'Status'],
    stats: [{ label: 'Open CAPAs', val: '24', col: 'text-amber-400' }, { label: 'Overdue >30d', val: '5', col: 'text-red-400' }, { label: 'Closure Rate', val: '85%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { source: ['Internal Audit', 'Incident Report', 'Patient Complaint', 'External Audit', 'Mock Drill'][i], opencapas: (8-i).toString(), overdue: i===0?'2':'0', avgtimetoclose: '15 Days', verificationstatus: 'Pending', status: i===0?'Overdue Follow-up':'On Track' };
    })`
  },
  {
    path: 'executive/quality/safety', title: 'Patient Safety Indicators', desc: 'Standardized AHRQ or WHO patient safety metrics.',
    cols: ['Indicator (PSI)', 'Observed Rate', 'Expected Rate', 'O/E Ratio', 'Trend', 'Status'],
    stats: [{ label: 'Composite Safety Score', val: '96/100', col: 'text-emerald-400' }, { label: 'Adverse Events', val: 'Decreasing', col: 'text-emerald-400' }, { label: 'Safety Walkrounds', val: 'Completed', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { indicatorpsi: ['PSI-90 Composite', 'Post-op Sepsis', 'Post-op DVT', 'Pressure Ulcers', 'Iatrogenic Pneumo'][i], observedrate: (1.5-i*0.2).toFixed(2), expectedrate: '2.0', oeratio: '< 1.0', trend: 'Decreasing', status: 'Better than Expected' };
    })`
  },

  // Patient Experience
  {
    path: 'executive/experience/satisfaction', title: 'Patient Satisfaction', desc: 'CSAT scores broken down by department, doctor, and facility touchpoints.',
    cols: ['Touchpoint', 'CSAT Score (Out of 5)', 'Surveys Sent', 'Response Rate', 'Top Complaint', 'Status'],
    stats: [{ label: 'Global CSAT', val: '4.2/5', col: 'text-emerald-400' }, { label: 'Response Rate', val: '22%', col: 'text-blue-400' }, { label: 'Surveys Collected', val: '1,240', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { touchpoint: ['Doctor Care', 'Nursing Care', 'Cleanliness', 'Food Quality', 'Billing Process'][i], csatscoreoutof5: (4.6-i*0.2).toFixed(1), surveyssent: '500', responserate: '25%', topcomplaint: i===4?'Long Wait Time':'None', status: i===4?'Needs Improvement':'Excellent' };
    })`
  },
  {
    path: 'executive/experience/nps', title: 'NPS Score', desc: 'Net Promoter Score tracking: "How likely are you to recommend this hospital?"',
    cols: ['Department', 'NPS Score', 'Promoters', 'Passives', 'Detractors', 'Status'],
    stats: [{ label: 'Hospital NPS', val: '68', col: 'text-emerald-400' }, { label: 'Promoters', val: '75%', col: 'text-emerald-400' }, { label: 'Detractors', val: '7%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: ['Maternity', 'Cardiology', 'Orthopedics', 'Emergency', 'General Med'][i], npsscore: (75-i*5).toString(), promoters: (80-i*5) + '%', passives: '15%', detractors: (5+i*5) + '%', status: i===3?'Monitor Detractors':'Excellent' };
    })`
  },
  {
    path: 'executive/experience/feedback', title: 'Feedback Analysis', desc: 'AI-driven sentiment analysis of open-text patient feedback.',
    cols: ['Topic Category', 'Mentions', 'Positive Sentiment', 'Negative Sentiment', 'Key Keyword', 'Status'],
    stats: [{ label: 'Total Reviews Analyzed', val: '850', col: 'text-blue-400' }, { label: 'Overall Sentiment', val: 'Positive (72%)', col: 'text-emerald-400' }, { label: 'Brand Reputation', val: 'Strong', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { topiccategory: ['Staff Behavior', 'Wait Times', 'Facility Cleanliness', 'Cost/Billing', 'Treatment Efficacy'][i], mentions: (200-i*20).toString(), positivesentiment: (80-i*10) + '%', negativesentiment: (20+i*10) + '%', keykeyword: i===1?'"Delayed"':i===3?'"Expensive"':'"Caring"', status: i===1?'Negative Trend':'Positive Trend' };
    })`
  },
  {
    path: 'executive/experience/complaints', title: 'Complaint Analysis', desc: 'Grievance redressal tracking, resolution times, and escalations.',
    cols: ['Complaint Category', 'Total Received', 'Resolved < 24h', 'Escalated', 'Avg Resolution Time', 'Status'],
    stats: [{ label: 'Total Complaints (MTD)', val: '45', col: 'text-amber-400' }, { label: 'Resolution Rate', val: '92%', col: 'text-emerald-400' }, { label: 'Avg Resolution', val: '48 Hrs', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { complaintcategory: ['Billing Disputes', 'Rude Staff', 'Delayed Treatment', 'Food Quality', 'Facility Issue'][i], totalreceived: (15-i*2).toString(), resolved24h: '60%', escalated: i===0?'2':'0', avgresolutiontime: (24+i*12) + ' Hrs', status: i===0?'High Volume':'Resolved' };
    })`
  },
  {
    path: 'executive/experience/crm', title: 'CRM Performance', desc: 'Effectiveness of patient engagement, outreach, and loyalty programs.',
    cols: ['Campaign / Program', 'Reach', 'Engagement Rate', 'Conversion/Follow-up', 'ROI Est.', 'Status'],
    stats: [{ label: 'Active Patients in CRM', val: '125K', col: 'text-blue-400' }, { label: 'Follow-up Success', val: '45%', col: 'text-emerald-400' }, { label: 'Health Check Conversions', val: '320', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { campaignprogram: ['Post-Discharge Call', 'Annual Checkup Promo', 'Chronic Care Follow-up', 'Camp Outreach', 'Loyalty Points Usage'][i], reach: (5000-i*500).toString(), engagementrate: (25+i*5) + '%', conversionfollowup: (10+i) + '%', roiest: '$' + (25000-i*2000), status: 'Active' };
    })`
  },
  {
    path: 'executive/experience/telemedicine', title: 'Telemedicine Analytics', desc: 'Adoption rates, platform reliability, and patient satisfaction with virtual consults.',
    cols: ['Specialty', 'Virtual Consults', 'Growth (MoM)', 'Avg Duration', 'Tech Drop-offs', 'Status'],
    stats: [{ label: 'Total Tele-consults', val: '850 (MTD)', col: 'text-blue-400' }, { label: 'Tele-consult Rev', val: '$42K', col: 'text-emerald-400' }, { label: 'Platform Uptime', val: '99.9%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { specialty: ['Psychiatry', 'Dermatology', 'Endocrinology', 'General Med', 'Pediatrics'][i], virtualconsults: (200-i*20).toString(), growthmom: '+' + (15-i) + '%', avgduration: '15 Mins', techdropoffs: '2%', status: 'Growing' };
    })`
  }
];

const template = (page, componentName) => {
  let columnsGen = "";
  page.cols.forEach(col => {
    const accessorKey = col.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (col === 'Status' || col === 'Action') {
      columnsGen += `
    { 
      header: '${col}', 
      accessor: (row: any) => {
        const val = row.${accessorKey};
        const isGood = val === 'On Target' || val === 'Positive' || val === 'Positive Trend' || val === 'Stable' || val === 'Optimal' || val === 'Normal' || val === 'Growing' || val === 'Efficient' || val === 'Strong' || val === 'Excellent' || val === 'Within Limits' || val === 'Compliant' || val === 'Better than Expected' || val === 'Reconciled' || val === 'Profitable' || val === 'Paid' || val === 'Healthy' || val === 'Active' || val === 'Resolved' || val === 'Reviewed';
        const isWarning = val === 'Needs Attention' || val === 'Needs Improvement' || val === 'At Risk' || val === 'High Utilization' || val === 'Requires Review' || val === 'Review Required' || val === 'Review Suggested' || val === 'Near Capacity' || val === 'High Variance' || val === 'Payment Delayed' || val === 'Action Required' || val === 'Monitor Detractors' || val === 'High Overtime' || val === 'Over Budget' || val === 'Improvement Needed' || val === 'Overdue Follow-up' || val === 'Sourcing' || val === 'Monitored';
        const isNeutral = val === 'Acknowledged' || val === 'Manageable';
        const isDanger = val === 'Action Needed' || val === 'Negative Trend' || val === 'Critical' || val === 'Critical Monitored' || val === 'Critical Risk' || val === 'High Impact' || val === 'Inefficient' || val === 'Loss Making' || val === 'High Disallowance' || val === 'High Risk' || val === 'Underutilized' || val === 'Understaffed' || val === 'Hard to Fill';
        
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
            <Activity className="text-blue-500" size={24} />
            ${page.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">${page.desc}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
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
