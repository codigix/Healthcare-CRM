const fs = require('fs');
const path = require('path');

const config = [
  // Vendor & AMC
  {
    path: 'facilities/vendors/directory', title: 'Vendor Directory', desc: 'Central registry of all facility and maintenance vendors.',
    cols: ['Vendor ID', 'Company Name', 'Service Category', 'Contact Person', 'Rating', 'Status'],
    stats: [{ label: 'Total Vendors', val: '45', col: 'text-blue-400' }, { label: 'Active Contracts', val: '32', col: 'text-emerald-400' }, { label: 'Blacklisted', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['HVAC Maintenance', 'Bio-waste Disposal', 'Laundry Services', 'Security Agency', 'Elevator AMC'];
      return { vendorid: 'VEN-' + (1001+i), companyname: 'Company ' + (1+i), servicecategory: cats[i], contactperson: 'John Doe', rating: (4.5-i*0.2).toFixed(1) + '/5', status: i===4?'Blacklisted':'Active' };
    })`
  },
  {
    path: 'facilities/vendors/contracts', title: 'AMC Contracts', desc: 'Detailed terms, SLAs, and payment schedules for vendor contracts.',
    cols: ['Contract ID', 'Vendor', 'Service', 'Annual Value', 'Expiry Date', 'Status'],
    stats: [{ label: 'Total AMC Value', val: '$450K', col: 'text-blue-400' }, { label: 'Expiring < 30 Days', val: '3', col: 'text-amber-400' }, { label: 'Renewed (YTD)', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { contractid: 'CTR-' + (2001+i), vendor: 'Vendor ' + (1+i), service: 'Pest Control', annualvalue: '$' + (5000+i*1000), expirydate: i===0?'Next Week':'31 Dec 2026', status: i===0?'Expiring Soon':'Active' };
    })`
  },
  {
    path: 'facilities/vendors/providers', title: 'Service Providers', desc: 'On-call or rate-contract providers for ad-hoc civil or electrical work.',
    cols: ['Provider Name', 'Trade/Skill', 'Rate Card', 'Jobs Done (YTD)', 'Quality Score', 'Status'],
    stats: [{ label: 'Active Providers', val: '15', col: 'text-blue-400' }, { label: 'Jobs Assigned', val: '45 (Mo)', col: 'text-emerald-400' }, { label: 'Avg Response', val: '4 Hrs', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { providername: 'Plumbing Pros ' + i, tradeskill: 'Plumbing', ratecard: 'Standard', jobsdoneytd: (20-i*2).toString(), qualityscore: '95%', status: 'Approved' };
    })`
  },
  {
    path: 'facilities/vendors/renewal', title: 'Contract Renewal', desc: 'Workflow for evaluating vendor performance before renewing annual contracts.',
    cols: ['Contract ID', 'Vendor', 'Current Value', 'Proposed Value', 'HOD Approval', 'Status'],
    stats: [{ label: 'Pending Renewals', val: '5', col: 'text-amber-400' }, { label: 'Avg Increment', val: '5%', col: 'text-blue-400' }, { label: 'Rejected Renewals', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { contractid: 'CTR-' + (3001+i), vendor: 'Vendor ' + (1+i), currentvalue: '$10,000', proposedvalue: '$10,500', hodapproval: i===0?'Pending':'Approved', status: i===0?'Under Review':'Renewed' };
    })`
  },
  {
    path: 'facilities/vendors/performance', title: 'Vendor Performance', desc: 'SLA tracking and penalty calculation for underperforming vendors.',
    cols: ['Vendor', 'Service', 'SLA Target', 'Actual Performance', 'Penalties Levied', 'Status'],
    stats: [{ label: 'Avg SLA Compliance', val: '92%', col: 'text-emerald-400' }, { label: 'Penalties (YTD)', val: '$4,500', col: 'text-red-400' }, { label: 'Top Vendor', val: 'SecureForce', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { vendor: 'Vendor ' + (1+i), service: 'Security', slatarget: '99%', actualperformance: (98-i) + '%', penaltieslevied: i===0?'$500':'-', status: i===0?'Warning Issued':'Compliant' };
    })`
  },

  // Compliance & Safety
  {
    path: 'facilities/compliance/fire', title: 'Fire Safety', desc: 'Extinguisher expiry tracking, alarm testing, and fire exit clearance audits.',
    cols: ['Asset/Area', 'Type', 'Last Tested', 'Next Due', 'Inspector', 'Status'],
    stats: [{ label: 'Extinguishers Active', val: '450', col: 'text-blue-400' }, { label: 'Due for Refill', val: '15', col: 'text-amber-400' }, { label: 'Alarms Functional', val: '100%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { assetarea: 'Exting-10' + i, type: 'CO2', lasttested: 'Jan 2026', nextdue: i===0?'Next Week':'Jan 2027', inspector: 'Fire Safety Officer', status: i===0?'Due Soon':'Pass' };
    })`
  },
  {
    path: 'facilities/compliance/inspection', title: 'Safety Inspection', desc: 'Monthly OSHA/NABH facility safety rounds documenting hazards.',
    cols: ['Inspection ID', 'Zone', 'Hazards Found', 'Risk Level', 'Action Taken', 'Status'],
    stats: [{ label: 'Inspections (Mo)', val: '12', col: 'text-blue-400' }, { label: 'High Risk Hazards', val: '1', col: 'text-red-400' }, { label: 'Closed Findings', val: '24', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { inspectionid: 'SAF-' + (1001+i), zone: 'Basement Parking', hazardsfound: i===0?'Loose Wiring':'None', risklevel: i===0?'High':'Low', actiontaken: i===0?'WO Created':'N/A', status: i===0?'Open':'Resolved' };
    })`
  },
  {
    path: 'facilities/compliance/drills', title: 'Emergency Drills', desc: 'Logging mock drills for fire, code blue, and mass casualty incidents.',
    cols: ['Drill Date', 'Scenario', 'Participants', 'Evacuation Time', 'Observer Notes', 'Status'],
    stats: [{ label: 'Drills Conducted (YTD)', val: '4', col: 'text-blue-400' }, { label: 'Avg Evac Time', val: '4m 30s', col: 'text-emerald-400' }, { label: 'Next Drill Due', val: 'October', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { drilldate: '15 ' + ['Jun', 'Mar', 'Jan', 'Oct', 'Aug'][i] + ' 2026', scenario: 'Fire in ICU', participants: (50-i*5).toString(), evacuationtime: '4m 15s', observernotes: 'Good coordination', status: 'Completed' };
    })`
  },
  {
    path: 'facilities/compliance/disaster', title: 'Disaster Management', desc: 'Emergency protocols, stock of disaster kits, and contact trees.',
    cols: ['Resource/Protocol', 'Category', 'Last Updated', 'Stock Level', 'Audited By', 'Status'],
    stats: [{ label: 'Disaster Kits Ready', val: '10/10', col: 'text-emerald-400' }, { label: 'Protocols Updated', val: '100%', col: 'text-blue-400' }, { label: 'Staff Trained', val: '85%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { resourceprotocol: 'Mass Casualty Kit ' + (1+i), category: 'Medical Supplies', lastupdated: 'Jan 2026', stocklevel: '100%', auditedby: 'ER Head', status: 'Ready' };
    })`
  },
  {
    path: 'facilities/compliance/audit', title: 'Compliance Audit', desc: 'Internal audits for building codes, elevator licenses, and boiler certifications.',
    cols: ['Audit Type', 'Certifying Body', 'Valid Till', 'Findings', 'Compliance %', 'Status'],
    stats: [{ label: 'Statutory Licenses', val: '18/18 Valid', col: 'text-emerald-400' }, { label: 'Upcoming Renewals', val: '2', col: 'text-amber-400' }, { label: 'Penalty Paid', val: '$0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const audits = ['Elevator License', 'Fire NOC', 'Boiler Cert', 'DG Set Consent', 'Water Test'];
      return { audittype: audits[i], certifyingbody: 'Govt Dept', validtill: i===0?'Next Month':'Dec 2026', findings: 'Minor wear', compliance: '98%', status: i===0?'Renewal Due':'Compliant' };
    })`
  },

  // Reports
  {
    path: 'facilities/reports/maintenance', title: 'Maintenance Report', desc: 'MTTR, PM completion rates, and breakdown frequency analysis.',
    cols: ['Report Type', 'Period', 'Total WOs', 'Avg Resolution Time', 'Cost Incurred', 'Status'],
    stats: [{ label: 'Total Cost YTD', val: '$45,000', col: 'text-blue-400' }, { label: 'SLA Adherence', val: '92%', col: 'text-emerald-400' }, { label: 'Backlog WOs', val: '15', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reporttype: 'Monthly Summary', period: 'June 2026', totalwos: (300-i*20).toString(), avgresolutiontime: '4.5 Hrs', costincurred: '$' + (5000-i*500), status: 'Generated' };
    })`
  },
  {
    path: 'facilities/reports/housekeeping', title: 'Housekeeping Report', desc: 'Cleaning compliance, consumable usage, and infection control correlations.',
    cols: ['Zone', 'Schedules Met', 'Missed', 'Consumables Cost', 'Infection Incidents', 'Status'],
    stats: [{ label: 'Overall Compliance', val: '98%', col: 'text-emerald-400' }, { label: 'Chemicals Cost', val: '$2,400', col: 'text-blue-400' }, { label: 'Staff Absenteeism', val: '4%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { zone: 'ICU Block', schedulesmet: '120', missed: i===0?'2':'0', consumablescost: '$450', infectionincidents: '0', status: 'Generated' };
    })`
  },
  {
    path: 'facilities/reports/laundry', title: 'Laundry Report', desc: 'Linen loss percentages, wash cycles per item, and vendor billing.',
    cols: ['Linen Type', 'Total Washed (Kg)', 'Torn/Condemned', 'Loss %', 'Vendor Bill', 'Status'],
    stats: [{ label: 'Total Wash (Mo)', val: '14,500 Kg', col: 'text-blue-400' }, { label: 'Overall Loss Rate', val: '1.2%', col: 'text-emerald-400' }, { label: 'Vendor Payout', val: '$12,500', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { linentype: 'Bed Sheets', totalwashedkg: '4,500', torncondemned: (20-i).toString(), loss: '1.5%', vendorbill: '$3,400', status: 'Generated' };
    })`
  },
  {
    path: 'facilities/reports/security', title: 'Security Report', desc: 'Incident summaries, visitor volumes, and guard attendance metrics.',
    cols: ['Metric', 'Total Count', 'Daily Average', 'Exceptions/Breaches', 'Action Taken', 'Status'],
    stats: [{ label: 'Total Visitors (Mo)', val: '12,450', col: 'text-blue-400' }, { label: 'Security Incidents', val: '4', col: 'text-emerald-400' }, { label: 'Guard Shortage', val: '2 Shifts', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { metric: 'Visitor Passes Issued', totalcount: '12,450', dailyaverage: '415', exceptionsbreaches: '12 Overstays', actiontaken: 'Warnings Issued', status: 'Generated' };
    })`
  },
  {
    path: 'facilities/reports/ambulance', title: 'Ambulance Report', desc: 'Trip distances, fuel efficiency, and revenue generated vs maintenance costs.',
    cols: ['Vehicle No', 'Trips', 'Total Distance (Km)', 'Fuel Efficiency', 'Net Revenue', 'Status'],
    stats: [{ label: 'Fleet Revenue (Mo)', val: '$24,000', col: 'text-emerald-400' }, { label: 'Running Cost', val: '$8,500', col: 'text-red-400' }, { label: 'Avg Response', val: '14 Mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { vehicleno: 'MH12 AB ' + (1000+i), trips: (45-i*5).toString(), totaldistancekm: (800-i*50).toString(), fuelefficiency: '9 km/l', netrevenue: '$' + (3000-i*200), status: 'Generated' };
    })`
  },
  {
    path: 'facilities/reports/mortuary', title: 'Mortuary Report', desc: 'Utilization of cold cabinets, autopsy counts, and average storage durations.',
    cols: ['Month', 'Admissions', 'Releases', 'MLC Cases', 'Avg Storage Time', 'Status'],
    stats: [{ label: 'Utilization %', val: '45%', col: 'text-blue-400' }, { label: 'Total Handled', val: '120', col: 'text-emerald-400' }, { label: 'Longest Stored', val: '14 Days', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { month: ['June', 'May', 'April', 'March', 'Feb'][i] + ' 2026', admissions: (20-i).toString(), releases: (19-i).toString(), mlccases: (5-i).toString(), avgstoragetime: '24 Hrs', status: 'Generated' };
    })`
  },
  {
    path: 'facilities/reports/waste', title: 'Waste Report', desc: 'Biomedical waste generation per department and disposal compliance.',
    cols: ['Department', 'Yellow (Kg)', 'Red (Kg)', 'Blue/White (Kg)', 'Compliance Score', 'Status'],
    stats: [{ label: 'Total Bio-Waste', val: '4,500 Kg', col: 'text-blue-400' }, { label: 'Disposal Cost', val: '$2,800', col: 'text-amber-400' }, { label: 'Segregation Errors', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: 'OT Block', yellowkg: '450', redkg: '300', bluewhitekg: '50', compliancescore: '98%', status: 'Generated' };
    })`
  },
  {
    path: 'facilities/reports/utility', title: 'Utility Report', desc: 'Electricity and water consumption trends vs budget.',
    cols: ['Utility Type', 'Consumption', 'Peak Usage Time', 'Cost', 'Variance vs Budget', 'Status'],
    stats: [{ label: 'Power Cost (Mo)', val: '$34,000', col: 'text-red-400' }, { label: 'Water Cost (Mo)', val: '$4,500', col: 'text-blue-400' }, { label: 'Green Energy %', val: '15%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { utilitytype: i===0?'Electricity':'Water', consumption: i===0?'350,000 kWh':'1.5M Ltrs', peakusagetime: '14:00 - 16:00', cost: i===0?'$34,000':'$4,500', variancevsbudget: '+2%', status: 'Generated' };
    })`
  },
  {
    path: 'facilities/reports/amc', title: 'AMC Report', desc: 'Upcoming renewals, vendor SLA adherence, and contract value summaries.',
    cols: ['Vendor', 'Service', 'Contract Value', 'SLA Score', 'Renewal Recommendation', 'Status'],
    stats: [{ label: 'Total AMC Spend', val: '$450,000', col: 'text-blue-400' }, { label: 'Avg SLA Score', val: '92%', col: 'text-emerald-400' }, { label: 'To Renew (Next 30D)', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { vendor: 'Vendor ' + (1+i), service: 'HVAC', contractvalue: '$' + (15000-i*1000), slascore: (95-i) + '%', renewalrecommendation: i===0?'Review Required':'Renew', status: 'Generated' };
    })`
  },

  // Analytics
  {
    path: 'facilities/analytics/dashboard', title: 'Facility Dashboard', desc: 'High-level executive overview of all facility operations and costs.',
    cols: ['Domain', 'Total Cost', 'Key Metric', 'Performance vs Target', 'Risk Level', 'Status'],
    stats: [{ label: 'Facility Cost/SqFt', val: '$4.50', col: 'text-blue-400' }, { label: 'Overall Compliance', val: '98%', col: 'text-emerald-400' }, { label: 'Critical Risks', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const domains = ['Maintenance', 'Housekeeping', 'Security', 'Utilities', 'Biomedical'];
      return { domain: domains[i], totalcost: '$' + (40000-i*5000), keymetric: 'SLA Met: 95%', performancevstarget: '+2%', risklevel: 'Low', status: 'Analyzed' };
    })`
  },
  {
    path: 'facilities/analytics/maintenance', title: 'Maintenance Analytics', desc: 'Deep dive into recurring breakdowns and root cause analysis of failures.',
    cols: ['Asset Class', 'Breakdown Freq', 'MTTR', 'MTBF', 'Top Root Cause', 'Status'],
    stats: [{ label: 'Overall MTTR', val: '3.5 Hrs', col: 'text-emerald-400' }, { label: 'Overall MTBF', val: '45 Days', col: 'text-blue-400' }, { label: 'Worst Asset', val: 'Lift 2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { assetclass: 'HVAC Units', breakdownfreq: (15-i*2) + '/Mo', mttr: (4-i*0.5).toFixed(1) + ' Hrs', mtbf: (30+i*5) + ' Days', toprootcause: 'Bearing Failure', status: 'Analyzed' };
    })`
  },
  {
    path: 'facilities/analytics/downtime', title: 'Equipment Downtime', desc: 'Financial and operational impact analysis of medical equipment being out of order.',
    cols: ['Equipment', 'Total Downtime', 'Lost Revenue Impact', 'Patients Affected', 'Mitigation', 'Status'],
    stats: [{ label: 'Lost Revenue (YTD)', val: '$45,000', col: 'text-red-400' }, { label: 'Total Downtime', val: '120 Hrs', col: 'text-amber-400' }, { label: 'Uptime', val: '99.1%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { equipment: 'MRI Scanner', totaldowntime: (24-i*4) + ' Hrs', lostrevenueimpact: '$' + (15000-i*2000), patientsaffected: (30-i*5).toString(), mitigation: 'Backup Used', status: 'Analyzed' };
    })`
  },
  {
    path: 'facilities/analytics/utility', title: 'Utility Consumption', desc: 'Heatmaps and trends identifying energy or water wastage.',
    cols: ['Area/Department', 'Energy Usage', 'Water Usage', 'Cost/SqFt', 'Efficiency Score', 'Status'],
    stats: [{ label: 'Energy Intensity', val: '145 kWh/m2', col: 'text-blue-400' }, { label: 'Peak Load', val: '850 kW', col: 'text-amber-400' }, { label: 'Savings from LED', val: '$1,200', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { areadepartment: 'Main OT Block', energyusage: '45,000 kWh', waterusage: '12,000 L', costsqft: '$5.20', efficiencyscore: '88/100', status: 'Analyzed' };
    })`
  },
  {
    path: 'facilities/analytics/vendor', title: 'Vendor Performance', desc: 'Ranking vendors based on response time, cost-effectiveness, and quality.',
    cols: ['Vendor', 'Category', 'SLA Score', 'Cost Competitiveness', 'Quality Rating', 'Status'],
    stats: [{ label: 'Top Performing', val: 'CleanCo (98%)', col: 'text-emerald-400' }, { label: 'Underperforming', val: '1', col: 'text-red-400' }, { label: 'Avg Satisfaction', val: '4.2/5', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { vendor: 'Vendor ' + (1+i), category: 'Housekeeping', slascore: (95-i) + '%', costcompetitiveness: 'High', qualityrating: (4.5-i*0.2).toFixed(1) + '/5', status: i===4?'Review Suggested':'Optimal' };
    })`
  },
  {
    path: 'facilities/analytics/cost', title: 'Cost Analysis', desc: 'Total cost of ownership (TCO) analysis for facility operations.',
    cols: ['Cost Center', 'Budget (Mo)', 'Actual Spend', 'Variance', 'Cost Drivers', 'Status'],
    stats: [{ label: 'Total Facility Spend', val: '$125,000', col: 'text-blue-400' }, { label: 'Overall Variance', val: '-$2,500', col: 'text-emerald-400' }, { label: 'Highest Spend', val: 'Utilities (35%)', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const centers = ['Utilities', 'Housekeeping', 'Maintenance', 'Security', 'Laundry'];
      return { costcenter: centers[i], budgetmo: '$' + (40000-i*5000), actualspend: '$' + (39000-i*4500), variance: '-$1,000', costdrivers: 'Tariff Hike', status: 'Analyzed' };
    })`
  },

  // Settings
  {
    path: 'facilities/settings/facility', title: 'Facility Settings', desc: 'Configuration of hospital locations, buildings, and master spatial data.',
    cols: ['Configuration Item', 'Value', 'Last Updated By', 'Date', 'Impact Area', 'Status'],
    stats: [{ label: 'Total Locations', val: '2', col: 'text-blue-400' }, { label: 'Mapped Areas', val: '100%', col: 'text-emerald-400' }, { label: 'Pending Approval', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { configurationitem: 'Add New Wing', value: 'North Wing', lastupdatedby: 'Admin Bob', date: 'Yesterday', impactarea: 'Space Allocation', status: 'Active' };
    })`
  },
  {
    path: 'facilities/settings/categories', title: 'Maintenance Categories', desc: 'Defining asset classes (e.g., Electrical, HVAC, Plumbing) for ticketing routing.',
    cols: ['Category Name', 'Sub-categories', 'Default SLA', 'Assigned Supervisor', 'Auto-Escalation', 'Status'],
    stats: [{ label: 'Total Categories', val: '12', col: 'text-blue-400' }, { label: 'Active Routes', val: '45', col: 'text-emerald-400' }, { label: 'SLA Definitions', val: '100%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Electrical', 'Plumbing', 'HVAC', 'Carpentry', 'Civil'];
      return { categoryname: cats[i], subcategories: (5+i).toString(), defaultsla: '4 Hrs', assignedsupervisor: 'Eng Bob', autoescalation: 'Yes (12 Hrs)', status: 'Active' };
    })`
  },
  {
    path: 'facilities/settings/work-orders', title: 'Work Order Types', desc: 'Configuring WO workflows (Preventive, Breakdown, Modification) and approvals.',
    cols: ['WO Type', 'Approval Required', 'Mandatory Fields', 'Closure Auth', 'Priority Matrix', 'Status'],
    stats: [{ label: 'Active Workflows', val: '5', col: 'text-blue-400' }, { label: 'Auto-Approved', val: 'PMs (<$50)', col: 'text-emerald-400' }, { label: 'Custom Fields', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { wotype: i===0?'Breakdown':'Preventive', approvalrequired: i===0?'No':'Yes (>$100)', mandatoryfields: 'Asset ID, Issue', closureauth: 'Supervisor', prioritymatrix: 'Configured', status: 'Active' };
    })`
  },
  {
    path: 'facilities/settings/amc', title: 'AMC Settings', desc: 'Alert configurations (30/60/90 days) for contract renewals and vendor blacklisting rules.',
    cols: ['Rule Name', 'Trigger Condition', 'Action', 'Notified Roles', 'Escalation', 'Status'],
    stats: [{ label: 'Active Rules', val: '8', col: 'text-blue-400' }, { label: 'Alerts Triggered', val: '15 (Mo)', col: 'text-amber-400' }, { label: 'Vendor Portal', val: 'Enabled', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { rulename: 'Expiry Alert', triggercondition: '30 Days to Expiry', action: 'Send Email', notifiedroles: 'Facility Head', escalation: 'Admin Dir (15D)', status: 'Active' };
    })`
  },
  {
    path: 'facilities/settings/preferences', title: 'Preferences', desc: 'General settings for shifts, automated report generation, and dashboard defaults.',
    cols: ['Preference Name', 'Setting Value', 'Scope', 'Last Modified', 'Modified By', 'Status'],
    stats: [{ label: 'Global Settings', val: '24', col: 'text-blue-400' }, { label: 'Custom Dashboards', val: '5', col: 'text-emerald-400' }, { label: 'Notification Channels', val: 'Email, SMS, App', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { preferencename: 'Default Shift Time', settingvalue: '08:00 to 16:00', scope: 'Housekeeping', lastmodified: 'Jan 2026', modifiedby: 'System Admin', status: 'Active' };
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
        const isGood = val === 'Active' || val === 'Approved' || val === 'Compliant' || val === 'Pass' || val === 'Resolved' || val === 'Completed' || val === 'Ready' || val === 'Generated' || val === 'Analyzed' || val === 'Optimal' || val === 'Renewed';
        const isWarning = val === 'Expiring Soon' || val === 'Under Review' || val === 'Warning Issued' || val === 'Due Soon' || val === 'Open' || val === 'Renewal Due' || val === 'Review Suggested' || val === 'Pending';
        const isNeutral = val === 'Generated' || val === 'Analyzed';
        const isDanger = val === 'Blacklisted' || val === 'Failed' || val === 'Rejected';
        
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
