const fs = require('fs');
const path = require('path');

const config = [
  // Facility Analytics
  {
    path: 'executive/facility/housekeeping', title: 'Housekeeping KPIs', desc: 'Cleanliness scores, turnaround times, and infection control compliance.',
    cols: ['Area/Ward', 'Avg Cleaning Time', 'Inspection Score', 'Patient Complaints', 'Staff Deployed', 'Status'],
    stats: [{ label: 'Avg Turnaround', val: '24 Mins', col: 'text-blue-400' }, { label: 'Cleanliness Score', val: '9.2/10', col: 'text-emerald-400' }, { label: 'Complaints Today', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { areaward: ['ICU', 'Operation Theater', 'General Ward', 'OPD Wait Area', 'Washrooms'][i], avgcleaningtime: (15+i*5) + ' Mins', inspectionscore: (9.5-i*0.2).toFixed(1) + '/10', patientcomplaints: i===4?'2':'0', staffdeployed: (12-i*2).toString(), status: i===4?'Monitor':'Clean' };
    })`
  },
  {
    path: 'executive/facility/maintenance', title: 'Maintenance KPIs', desc: 'HVAC downtime, plumbing issues, and preventive maintenance adherence.',
    cols: ['System', 'Open Tickets', 'Avg Repair Time', 'PM Adherence', 'Cost Impact', 'Status'],
    stats: [{ label: 'Total Open Tickets', val: '24', col: 'text-amber-400' }, { label: 'PM Compliance', val: '98%', col: 'text-emerald-400' }, { label: 'Critical Failures', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { system: ['HVAC (AC)', 'Plumbing', 'Electrical / UPS', 'Elevators', 'Medical Gas'][i], opentickets: (5-i).toString(), avgrepairtime: (2+i) + ' Hrs', pmadherence: (100-i) + '%', costimpact: '$' + (500+i*100), status: i===0?'High Volume':'Normal' };
    })`
  },
  {
    path: 'executive/facility/ambulance', title: 'Ambulance Utilization', desc: 'Fleet tracking, response times, and revenue generation from transport services.',
    cols: ['Vehicle Type', 'Total Trips', 'Avg Response Time', 'Fuel Cost/Km', 'Revenue Gen.', 'Status'],
    stats: [{ label: 'Total Trips (MTD)', val: '450', col: 'text-blue-400' }, { label: 'Avg Response', val: '12 Mins', col: 'text-emerald-400' }, { label: 'Fleet Uptime', val: '95%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { vehicletype: ['ALS Ambulance', 'BLS Ambulance', 'Patient Transport', 'Mobile Clinic', 'Hearse'][i], totaltrips: (150-i*25).toString(), avgresponsetime: (10+i*2) + ' Mins', fuelcostkm: '$0.' + (8+i), revenuegen: '$' + (12000-i*2000), status: 'Active' };
    })`
  },
  {
    path: 'executive/facility/biomedical', title: 'Biomedical Equipment', desc: 'Uptime of critical life-saving devices (Ventilators, Defibrillators).',
    cols: ['Equipment Class', 'Total Units', 'Units Under Repair', 'Uptime %', 'AMC Status', 'Status'],
    stats: [{ label: 'Critical Uptime', val: '99.5%', col: 'text-emerald-400' }, { label: 'Total Breakdown', val: '4', col: 'text-amber-400' }, { label: 'AMC Renewals Due', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { equipmentclass: ['Ventilators', 'Defibrillators', 'Syringe Pumps', 'Patient Monitors', 'Anesthesia Workstations'][i], totalunits: (25+i*10).toString(), unitsunderrepair: i===0?'1':'0', uptime: '99%', amcstatus: i===0?'Expiring Soon':'Valid', status: i===0?'Service Due':'Operational' };
    })`
  },
  {
    path: 'executive/facility/utilities', title: 'Utility Consumption', desc: 'Water, electricity, and medical gas consumption vs budget.',
    cols: ['Utility Type', 'Monthly Usage', 'Budget Variance', 'Cost/Unit', 'Green Initiative', 'Status'],
    stats: [{ label: 'Total Utility Bill', val: '$45K', col: 'text-blue-400' }, { label: 'Power Savings', val: '12%', col: 'text-emerald-400' }, { label: 'Water Consumption', val: 'High', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { utilitytype: ['Electricity', 'Water', 'Medical Oxygen', 'Diesel (Generator)', 'Nitrous Oxide'][i], monthlyusage: i===0?'120,000 kWh':i===1?'450 kL':'1,200 Cylinders', budgetvariance: (i%2===0?'+':'-') + '2%', costunit: i===0?'$0.12/kWh':i===1?'$2/kL':'$15/Cyl', greeninitiative: i===0?'Solar Active':'N/A', status: i===1?'Over Budget':'Normal' };
    })`
  },

  // Strategic Planning
  {
    path: 'executive/strategy/budget', title: 'Budget Planning', desc: 'Annual budget vs actual tracking across departments.',
    cols: ['Department/Cost Center', 'Annual Budget', 'YTD Spend', 'Variance', 'Forecast End-Year', 'Status'],
    stats: [{ label: 'Total Hospital Budget', val: '$120M', col: 'text-blue-400' }, { label: 'Overall Variance', val: '-1.5%', col: 'text-emerald-400' }, { label: 'Capex Utilized', val: '65%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { departmentcostcenter: ['Clinical Operations', 'IT & Systems', 'Facility & Admin', 'Marketing', 'Human Resources'][i], annualbudget: '$' + (40-i*5) + 'M', ytdspend: '$' + (20-i*2) + 'M', variance: (i===1?'+':'-') + '2%', forecastendyear: '$' + (41-i*5) + 'M', status: i===1?'Over Budget':'On Track' };
    })`
  },
  {
    path: 'executive/strategy/forecasting', title: 'Forecasting', desc: 'Predictive models for patient volume and revenue for the next 12 months.',
    cols: ['Forecast Metric', 'Current Month', 'Next Month (Est)', 'Quarter End', 'Confidence Score', 'Status'],
    stats: [{ label: 'Revenue Q3 Forecast', val: '$35M', col: 'text-emerald-400' }, { label: 'IPD Growth Est', val: '+5%', col: 'text-blue-400' }, { label: 'Model Accuracy', val: '92%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { forecastmetric: ['Total Revenue', 'IPD Admissions', 'OPD Footfall', 'Surgery Volume', 'Operational Cost'][i], currentmonth: i===0?'$12M':i===1?'1,200':'15,000', nextmonthest: i===0?'$12.5M':i===1?'1,250':'15,500', quarterend: i===0?'$38M':i===1?'3,800':'46,000', confidencescore: 'High (85%+)', status: 'Growing' };
    })`
  },
  {
    path: 'executive/strategy/capacity', title: 'Capacity Planning', desc: 'Decisions on adding new beds, expanding ICUs, or opening new modular OTs.',
    cols: ['Expansion Area', 'Current Utilization', 'Projected Limit Date', 'Proposed Addition', 'Est. CAPEX', 'Status'],
    stats: [{ label: 'Current Bed Capacity', val: '85%', col: 'text-amber-400' }, { label: 'Expansion Budget', val: '$5.5M', col: 'text-blue-400' }, { label: 'Pending Approvals', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { expansionarea: ['Medical ICU Beds', 'NICU Expansion', 'New Modular OT', 'Dialysis Chairs', 'Oncology Day Care'][i], currentutilization: (95-i*5) + '%', projectedlimitdate: 'Q3 2026', proposedaddition: i===0?'10 Beds':'1 Unit', estcapex: '$' + (1.2-i*0.2).toFixed(1) + 'M', status: i===0?'Approval Pending':'Planning Phase' };
    })`
  },
  {
    path: 'executive/strategy/growth', title: 'Growth Analysis', desc: 'Analyzing new service lines (e.g., Robotics) vs existing cash cows.',
    cols: ['Service Line', 'Market Share (Est)', 'YoY Growth', 'Margin Contribution', 'Strategic Value', 'Status'],
    stats: [{ label: 'Highest Growth Area', val: 'Robotic Surgery', col: 'text-emerald-400' }, { label: 'Market Share Focus', val: 'Oncology', col: 'text-blue-400' }, { label: 'Stagnant Service', val: 'General Med', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { serviceline: ['Robotic Surgery', 'Comprehensive Oncology', 'IVF Center', 'Bariatric Center', 'Sports Medicine'][i], marketshareest: (15+i*2) + '%', yoygrowth: '+' + (25-i*3) + '%', margincontribution: (40-i*2) + '%', strategicvalue: i<2?'High':'Medium', status: 'Expanding' };
    })`
  },
  {
    path: 'executive/strategy/branch', title: 'Branch Comparison', desc: 'If a group hospital, comparing KPIs across different geographical branches.',
    cols: ['Branch Location', 'Revenue Target Met', 'Quality Score', 'Patient Sat.', 'Profit Margin', 'Status'],
    stats: [{ label: 'Top Performing Branch', val: 'City Center', col: 'text-emerald-400' }, { label: 'Underperforming', val: 'North Wing', col: 'text-red-400' }, { label: 'Total Branches', val: '4', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 4 }).map((_, i) => {
      return { branchlocation: ['City Center (HQ)', 'North Wing Clinic', 'South Hub Hospital', 'East Side Daycare'][i], revenuetargetmet: (110-i*15) + '%', qualityscore: (95-i*2) + '%', patientsat: (4.8-i*0.3).toFixed(1) + '/5', profitmargin: (18-i*3) + '%', status: i===1?'Underperforming':'Excellent' };
    })`
  },
  {
    path: 'executive/strategy/benchmarking', title: 'Department Benchmarking', desc: 'Comparing internal departments against national or industry standards.',
    cols: ['Metric / Department', 'Internal Score', 'Industry Benchmark', 'Variance', 'Percentile', 'Status'],
    stats: [{ label: 'Top Quartile Metrics', val: '12', col: 'text-emerald-400' }, { label: 'Below Average', val: '2', col: 'text-amber-400' }, { label: 'Global Rank Est.', val: 'Top 10%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { metricdepartment: ['ICU Mortality Rate', 'OT Turnaround Time', 'ED Wait Time', 'Staff Cost %', 'C-Section Rate'][i], internalscore: i===0?'1.2%':i===1?'35 Mins':i===2?'45 Mins':i===3?'42%':'28%', industrybenchmark: i===0?'1.5%':i===1?'40 Mins':i===2?'30 Mins':i===3?'45%':'30%', variance: i===2?'Higher':'Better', percentile: i===2?'60th':'90th', status: i===2?'Needs Improvement':'Leader' };
    })`
  },

  // AI Insights
  {
    path: 'executive/ai/revenue', title: 'Revenue Prediction', desc: 'Machine Learning models predicting cash flow based on seasonality and billing trends.',
    cols: ['Prediction Window', 'Forecasted Revenue', 'Confidence Interval', 'Key Driver', 'AI Suggestion', 'Status'],
    stats: [{ label: 'Next Month Forecast', val: '$12.8M', col: 'text-emerald-400' }, { label: 'Model Confidence', val: '94%', col: 'text-blue-400' }, { label: 'Seasonal Trend', val: 'Upward (Winter)', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { predictionwindow: ['Next 7 Days', 'Next 30 Days', 'Q3 End', 'Q4 End', 'Year End'][i], forecastedrevenue: '$' + (3+i*10) + 'M', confidenceinterval: '±' + (2+i) + '%', keydriver: i===0?'Pending Ins. Payouts':'Flu Season Spike', aisuggestion: 'Expedite TPA Desk', status: 'Analyzed' };
    })`
  },
  {
    path: 'executive/ai/patients', title: 'Patient Volume Forecast', desc: 'Predicting OPD footfall and IPD admissions to optimize doctor scheduling.',
    cols: ['Specialty', 'Predicted Volume (Next 7d)', 'Historical Avg', 'Surge Probability', 'Action Req.', 'Status'],
    stats: [{ label: 'Expected Surge', val: 'Pulmonology', col: 'text-amber-400' }, { label: 'Total Volume Est.', val: '4,800', col: 'text-blue-400' }, { label: 'Staff Adequacy', val: '85%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { specialty: ['Pulmonology', 'Pediatrics', 'Orthopedics', 'Cardiology', 'General Med'][i], predictedvolumenext7d: (450-i*50).toString(), historicalavg: (380-i*40).toString(), surgeprobability: (85-i*10) + '%', actionreq: i===0?'Add 2 Doctors':'None', status: i===0?'Surge Alert':'Normal' };
    })`
  },
  {
    path: 'executive/ai/disease', title: 'Disease Trends', desc: 'Epidemiological trends identifying outbreaks (e.g., Dengue spike in August).',
    cols: ['Disease / Condition', 'Current Cases', 'Expected vs Baseline', 'Geographic Hotspot', 'Severity Index', 'Status'],
    stats: [{ label: 'Active Outbreaks', val: '1 (Dengue)', col: 'text-red-400' }, { label: 'Bed Impact', val: '+15%', col: 'text-amber-400' }, { label: 'Inventory Alert', val: 'IV Fluids, Platelets', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { diseasecondition: ['Dengue Fever', 'Viral Pneumonia', 'Gastroenteritis', 'Typhoid', 'Malaria'][i], currentcases: (120-i*20).toString(), expectedvsbaseline: '+' + (40-i*5) + '%', geographichotspot: 'North District', severityindex: i===0?'High':'Medium', status: i===0?'Epidemic Alert':'Monitored' };
    })`
  },
  {
    path: 'executive/ai/resources', title: 'Resource Forecast', desc: 'Predicting shortages in beds, OTs, or ventilators before they happen.',
    cols: ['Critical Resource', 'Current Availability', 'Predicted Exhaustion', 'Alternative Options', 'Confidence', 'Status'],
    stats: [{ label: 'ICU Bed Risk', val: 'High (Next 48h)', col: 'text-red-400' }, { label: 'Ventilator Buffer', val: '3 Units', col: 'text-amber-400' }, { label: 'OT Slots Open', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { criticalresource: ['MICU Beds', 'Ventilators', 'O-Negative Blood', 'Modular OT-1', 'Dialysis Machines'][i], currentavailability: i===0?'2 Beds':'Adequate', predictedexhaustion: i===0?'48 Hours':'> 7 Days', alternativeoptions: i===0?'Step-down Unit':'Supplier Call', confidence: '88%', status: i===0?'Critical Risk':'Stable' };
    })`
  },
  {
    path: 'executive/ai/staffing', title: 'Staffing Prediction', desc: 'AI-driven roster suggestions based on historical absenteeism and patient loads.',
    cols: ['Department', 'Recommended Staffing', 'Scheduled Staff', 'Shortfall Risk', 'Cost of Overtime', 'Status'],
    stats: [{ label: 'Predicted Shortfalls', val: '2 Depts', col: 'text-amber-400' }, { label: 'Overtime Est.', val: '$12K', col: 'text-amber-400' }, { label: 'Roster Efficiency', val: '92%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: ['Emergency Nursing', 'OPD Front Desk', 'ICU Docs', 'Ward Boys', 'Pharmacy'][i], recommendedstaffing: '24', scheduledstaff: i===0?'20':'24', shortfallrisk: i===0?'High':'Low', costofovertime: i===0?'$2,500':'$0', status: i===0?'Understaffed':'Optimal' };
    })`
  },
  {
    path: 'executive/ai/inventory', title: 'Inventory Forecast', desc: 'Predicting stockouts for vital drugs based on disease trends (e.g., stocking up on inhalers during winter).',
    cols: ['Item Category', 'Current Stock (Days)', 'Predicted Usage', 'Suggested Order Qty', 'Supplier SLA', 'Status'],
    stats: [{ label: 'Critical Low Stock', val: '5 SKUs', col: 'text-red-400' }, { label: 'AI Saved Cost', val: '$45K (Reduced Expiry)', col: 'text-emerald-400' }, { label: 'Order Acc.', val: '96%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemcategory: ['Antipyretics (IV)', 'Bronchodilators', 'Broad-spec Abx', 'Surgical Gloves', 'Saline (RL)'][i], currentstockdays: i===0?'5 Days':'30 Days', predictedusage: 'Spike Expected', suggestedorderqty: '1,200 Vials', suppliersla: '48 Hrs', status: i===0?'Order Immediately':'Sufficient' };
    })`
  },
  {
    path: 'executive/ai/risk', title: 'Risk Analysis', desc: 'Holistic risk scoring: Financial (bad debt), Clinical (lawsuits), and Operational (downtime).',
    cols: ['Risk Category', 'Identified Risk', 'Probability', 'Impact Est ($)', 'Mitigation Plan', 'Status'],
    stats: [{ label: 'Overall Risk Score', val: 'Low-Medium', col: 'text-emerald-400' }, { label: 'Top Risk', val: 'Insurance Delays', col: 'text-amber-400' }, { label: 'Unmitigated', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { riskcategory: ['Financial', 'Clinical', 'Operational', 'Compliance', 'Reputational'][i], identifiedrisk: i===0?'TPA Payment Delay':'HAI Lawsuit', probability: i===0?'High':'Low', impactest: i===0?'$1.2M':'$500K', mitigationplan: 'Escalate to TPA Head', status: i===0?'Action Required':'Monitored' };
    })`
  },
  {
    path: 'executive/ai/recommendations', title: 'Executive Recommendations', desc: 'A consolidated list of Top 5 actionable insights generated by the AI engine daily.',
    cols: ['Insight ID', 'Domain', 'AI Recommendation', 'Est. Value/Savings', 'Effort Level', 'Status'],
    stats: [{ label: 'Insights Gen. Today', val: '5', col: 'text-blue-400' }, { label: 'Potential Savings', val: '$125K', col: 'text-emerald-400' }, { label: 'Implemented', val: '45 (YTD)', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { insightid: 'AI-REC-' + (101+i), domain: ['Operations', 'Finance', 'HR', 'Inventory', 'Clinical'][i], airecommendation: i===0?'Shift 2 OPD nurses to ER between 6PM-10PM':'Renegotiate Rate Contract', estvaluesavings: '$' + (25-i*2) + 'K', effortlevel: 'Low', status: 'New Insight' };
    })`
  },

  // Approvals
  {
    path: 'executive/approvals/financial', title: 'Financial Approvals', desc: 'Board-level approvals for CapEx, major vendor contracts, or budget overrides.',
    cols: ['Request ID', 'Department', 'Amount', 'Purpose', 'Requested Date', 'Action'],
    stats: [{ label: 'Pending Approvals', val: '4', col: 'text-amber-400' }, { label: 'Total Value Pending', val: '$1.2M', col: 'text-blue-400' }, { label: 'Approved Today', val: '2', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { requestid: 'FIN-' + (1001+i), department: 'Radiology', amount: '$450,000', purpose: 'New Ultrasound Machine', requesteddate: 'Yesterday', action: 'Review' };
    })`
  },
  {
    path: 'executive/approvals/purchase', title: 'Purchase Approvals', desc: 'Purchase Orders (POs) exceeding standard departmental limits requiring CEO/CFO sign-off.',
    cols: ['PO Number', 'Vendor', 'Total Value', 'Items', 'Budget Status', 'Action'],
    stats: [{ label: 'POs Pending', val: '12', col: 'text-amber-400' }, { label: 'Avg Approval Time', val: '1.2 Days', col: 'text-blue-400' }, { label: 'Rejected (MTD)', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ponumber: 'PO-2026-' + (801+i), vendor: 'MedTech Supplies Inc', totalvalue: '$25,000', items: 'Bulk Consumables', budgetstatus: 'Within Budget', action: 'Approve' };
    })`
  },
  {
    path: 'executive/approvals/hr', title: 'HR Approvals', desc: 'Hiring of senior consultants, HODs, or out-of-band salary increments.',
    cols: ['Candidate/Emp', 'Position', 'Proposed CTC', 'Variance from Band', 'Requested By', 'Action'],
    stats: [{ label: 'Hires Pending Approval', val: '3', col: 'text-amber-400' }, { label: 'Increment Requests', val: '5', col: 'text-blue-400' }, { label: 'HOD Approvals', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { candidateemp: 'Dr. John Doe', position: 'Head of Oncology', proposedctc: '$250,000', variancefromband: '+10%', requestedby: 'Medical Director', action: 'Review' };
    })`
  },
  {
    path: 'executive/approvals/leave', title: 'Leave Approvals', desc: 'Leave requests for Department Heads or key clinical leadership.',
    cols: ['Employee Name', 'Role', 'Leave Dates', 'Duration', 'Coverage Plan', 'Action'],
    stats: [{ label: 'Leadership on Leave', val: '2', col: 'text-blue-400' }, { label: 'Pending Requests', val: '1', col: 'text-amber-400' }, { label: 'Coverage Issues', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { employeename: 'Dr. Sarah Smith', role: 'Head of Surgery', leavedates: '15-20 Aug', duration: '5 Days', coverageplan: 'Dr. Adams (Deputy)', action: 'Approve' };
    })`
  },
  {
    path: 'executive/approvals/discount', title: 'Discount Approvals', desc: 'Special VIP discounts or charity waivers on patient bills exceeding standard limits.',
    cols: ['Patient Name', 'Total Bill', 'Requested Discount', 'Reason', 'Requested By', 'Action'],
    stats: [{ label: 'Discount Requests', val: '8', col: 'text-amber-400' }, { label: 'Total Value', val: '$12,500', col: 'text-blue-400' }, { label: 'Charity Quota', val: '45% Used', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { patientname: 'Jane Doe', totalbill: '$45,000', requesteddiscount: '15% ($6,750)', reason: 'Financial Hardship', requestedby: 'Billing Head', action: 'Review' };
    })`
  },
  {
    path: 'executive/approvals/claims', title: 'High Value Claims', desc: 'Insurance claims or legal settlements above a critical threshold.',
    cols: ['Claim ID', 'Patient/Entity', 'Claim Value', 'Legal Counsel Adv.', 'Risk Level', 'Action'],
    stats: [{ label: 'Pending Claims', val: '2', col: 'text-red-400' }, { label: 'Legal Reserve', val: '$2M', col: 'text-blue-400' }, { label: 'Cleared (MTD)', val: '1', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { claimid: 'CLM-' + (5001+i), patiententity: 'Med Malpractice Case', claimvalue: '$500,000', legalcounseladv: 'Settle Out of Court', risklevel: 'High', action: 'Review' };
    })`
  },
  {
    path: 'executive/approvals/policy', title: 'Policy Approvals', desc: 'Sign-off on new hospital-wide SOPs, HR policies, or clinical protocols.',
    cols: ['Policy Document', 'Category', 'Version', 'Prepared By', 'Effective Date', 'Action'],
    stats: [{ label: 'Policies in Review', val: '4', col: 'text-amber-400' }, { label: 'Approved (YTD)', val: '12', col: 'text-emerald-400' }, { label: 'Overdue Reviews', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { policydocument: 'Revised Data Privacy Policy', category: 'IT/Compliance', version: 'v3.0', preparedby: 'Legal Head', effectivedate: '01 Jan 2027', action: 'Approve' };
    })`
  },

  // Reports
  {
    path: 'executive/reports/executive', title: 'Executive Reports', desc: 'Summarized 1-pagers for the CEO/COO.',
    cols: ['Report Title', 'Period', 'Generated On', 'Key Focus Area', 'Format', 'Action'],
    stats: [{ label: 'Reports Generated', val: '12', col: 'text-blue-400' }, { label: 'Automated', val: '10', col: 'text-emerald-400' }, { label: 'Read Rate', val: '100%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reporttitle: 'CEO Daily Brief', period: 'Yesterday', generatedon: 'Today 06:00 AM', keyfocusarea: 'Operations & Cash', format: 'PDF', action: 'Download' };
    })`
  },
  {
    path: 'executive/reports/board', title: 'Board Reports', desc: 'Extensive presentations and financials prepared for the Board of Directors.',
    cols: ['Meeting Date', 'Report Package', 'Prepared By', 'Financial Audit', 'Status', 'Action'],
    stats: [{ label: 'Next Board Meeting', val: '15 Aug 2026', col: 'text-amber-400' }, { label: 'Prep Status', val: 'In Progress', col: 'text-blue-400' }, { label: 'Past Reports', val: '12 Archived', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { meetingdate: 'Q2 Board Meeting', reportpackage: 'Financials & Quality', preparedby: 'CFO Desk', financialaudit: 'Signed Off', status: 'Ready', action: 'View Deck' };
    })`
  },
  {
    path: 'executive/reports/daily', title: 'Daily MIS', desc: 'Management Information System daily aggregates (Admissions, Cash, OT count).',
    cols: ['Date', 'Total Revenue', 'Admissions', 'Surgeries', 'Status', 'Action'],
    stats: [{ label: 'Avg Daily Rev', val: '$42K', col: 'text-blue-400' }, { label: 'Avg Admissions', val: '45', col: 'text-emerald-400' }, { label: 'MIS Variance', val: '< 0.1%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: 'Today - ' + (1+i) + ' Days', totalrevenue: '$43,500', admissions: '44', surgeries: '12', status: 'Reconciled', action: 'View Details' };
    })`
  },
  {
    path: 'executive/reports/weekly', title: 'Weekly MIS', desc: 'Week-over-Week comparisons of hospital performance.',
    cols: ['Week', 'Revenue YoY', 'Volume YoY', 'Key Highlight', 'Status', 'Action'],
    stats: [{ label: 'Current Week Rev', val: '$310K', col: 'text-blue-400' }, { label: 'Week-on-Week', val: '+2%', col: 'text-emerald-400' }, { label: 'Target Achieved', val: 'Yes', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { week: 'Week ' + (25-i) + ' (2026)', revenueyoy: '+5%', volumeyoy: '+2%', keyhighlight: 'High ER Footfall', status: 'Finalized', action: 'Download' };
    })`
  },
  {
    path: 'executive/reports/monthly', title: 'Monthly MIS', desc: 'Comprehensive month-end closing reports, P&L, and balance sheets.',
    cols: ['Month', 'Net Profit Margin', 'EBITDA', 'Significant Event', 'Status', 'Action'],
    stats: [{ label: 'YTD Margin', val: '14%', col: 'text-emerald-400' }, { label: 'Best Month', val: 'March ($1.2M Profit)', col: 'text-blue-400' }, { label: 'Pending Closure', val: 'None', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { month: ['June', 'May', 'April', 'March', 'Feb'][i] + ' 2026', netprofitmargin: '14.2%', ebitda: '$2.5M', significantevent: i===0?'JCI Audit Prep':'Normal Operations', status: 'Closed', action: 'View Report' };
    })`
  },
  {
    path: 'executive/reports/quarterly', title: 'Quarterly MIS', desc: 'Quarterly strategic reviews and market share analysis.',
    cols: ['Quarter', 'Revenue Achieved', 'Target', 'Variance', 'Status', 'Action'],
    stats: [{ label: 'Q1 Performance', val: '105% of Target', col: 'text-emerald-400' }, { label: 'Q2 Projected', val: 'On Track', col: 'text-blue-400' }, { label: 'Strategic Goals Met', val: '4/5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 4 }).map((_, i) => {
      return { quarter: 'Q' + (4-i) + ' 2025/26', revenueachieved: '$35M', target: '$33.5M', variance: '+4.5%', status: 'Published', action: 'Download' };
    })`
  },
  {
    path: 'executive/reports/annual', title: 'Annual MIS', desc: 'Year-end financial audits, annual growth reports, and shareholder letters.',
    cols: ['Financial Year', 'Audited Revenue', 'Net Income', 'Auditor Sign-off', 'Status', 'Action'],
    stats: [{ label: 'FY 25-26 Rev Est', val: '$140M', col: 'text-blue-400' }, { label: 'YoY Growth', val: '+12%', col: 'text-emerald-400' }, { label: 'Audit Status', val: 'Clear', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 4 }).map((_, i) => {
      return { financialyear: 'FY ' + (2025-i) + '-' + (26-i), auditedrevenue: '$125M', netincome: '$15M', auditorsignoff: 'KPMG', status: 'Audited', action: 'View Annual Report' };
    })`
  },
  {
    path: 'executive/reports/custom', title: 'Custom Reports', desc: 'Ad-hoc reporting tool for querying specific data combinations (e.g., Cardiac Revenue by specific Doctor).',
    cols: ['Saved Query Name', 'Created By', 'Last Run', 'Data Source', 'Schedule', 'Action'],
    stats: [{ label: 'Saved Queries', val: '34', col: 'text-blue-400' }, { label: 'Scheduled Dispatches', val: '12', col: 'text-emerald-400' }, { label: 'Data Warehouse Latency', val: '< 5 Mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { savedqueryname: 'Dr. Smith Cardiac MTD', createdby: 'CEO Office', lastrun: 'Today', datasource: 'Data Lake (Snowflake)', schedule: 'Weekly', action: 'Run Now' };
    })`
  },

  // Analytics Center
  {
    path: 'executive/analytics-center/dashboards', title: 'Interactive Dashboards', desc: 'Tableau/PowerBI embedded interactive visual dashboards.',
    cols: ['Dashboard Name', 'Category', 'Views (30d)', 'Owner', 'Data Refresh', 'Action'],
    stats: [{ label: 'Active Dashboards', val: '15', col: 'text-blue-400' }, { label: 'Most Viewed', val: 'Daily Revenue', col: 'text-emerald-400' }, { label: 'Data Freshness', val: 'Live', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { dashboardname: ['Exec Revenue Live', 'OT Utilization Heatmap', 'Doctor Scorecard', 'Inventory Spend Analysis', 'Patient Geo-Mapping'][i], category: i===0?'Financial':'Operations', views30d: (450-i*50).toString(), owner: 'BI Team', datarefresh: 'Live / 15m', action: 'Open Dashboard' };
    })`
  },
  {
    path: 'executive/analytics-center/kpi', title: 'KPI Builder', desc: 'Tool to define custom KPIs and set target thresholds.',
    cols: ['KPI Name', 'Formula/Metric', 'Target Value', 'Alert Threshold', 'Status', 'Action'],
    stats: [{ label: 'Custom KPIs', val: '45', col: 'text-blue-400' }, { label: 'Alerts Triggered', val: '2', col: 'text-amber-400' }, { label: 'Data Sync Errors', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { kpiname: 'Net Promoter Score (Premium)', formulametric: '%Promoter - %Detractor', targetvalue: '> 80', alertthreshold: '< 70', status: 'Active', action: 'Edit' };
    })`
  },
  {
    path: 'executive/analytics-center/reports', title: 'Report Builder', desc: 'Drag-and-drop interface for building tabular reports.',
    cols: ['Report Draft Name', 'Base Table', 'Columns Selected', 'Created Date', 'Status', 'Action'],
    stats: [{ label: 'Draft Reports', val: '8', col: 'text-blue-400' }, { label: 'Published', val: '24', col: 'text-emerald-400' }, { label: 'Avg Build Time', val: '5 Mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportdraftname: 'Insurance Denials Q2', basetable: 'Claims_Master', columnsselected: '12 Columns', createddate: 'Yesterday', status: 'Draft', action: 'Edit' };
    })`
  },
  {
    path: 'executive/analytics-center/warehouse', title: 'Data Warehouse', desc: 'Status of ETL pipelines syncing HIS, LIS, RIS data into the central warehouse.',
    cols: ['Data Source', 'Sync Frequency', 'Last Sync', 'Rows Updated', 'Errors', 'Status'],
    stats: [{ label: 'Total Storage', val: '12 TB', col: 'text-blue-400' }, { label: 'Pipelines Healthy', val: '100%', col: 'text-emerald-400' }, { label: 'Daily Data Processed', val: '45 GB', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { datasource: ['HIS (Postgres)', 'LIS (SQL Server)', 'ERP (Oracle)', 'HRMS', 'CRM (Salesforce)'][i], syncfrequency: 'Near Real-time (CDC)', lastsync: 'Just Now', rowsupdated: (15000-i*1000).toString(), errors: '0', status: 'Syncing' };
    })`
  },
  {
    path: 'executive/analytics-center/bi', title: 'Business Intelligence', desc: 'Advanced BI models, OLAP cubes, and semantic layers.',
    cols: ['Model/Cube Name', 'Business Domain', 'Query Latency', 'Used By', 'Last Rebuild', 'Status'],
    stats: [{ label: 'BI Cubes Active', val: '8', col: 'text-blue-400' }, { label: 'Avg Query Time', val: '1.2s', col: 'text-emerald-400' }, { label: 'Daily Users', val: '45 Execs', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { modelcubename: ['Financial_Cube', 'Patient_Journey_Cube', 'Clinical_Outcomes', 'Supply_Chain_Model', 'HR_Analytics'][i], businessdomain: i===0?'Finance':'Various', querylatency: '0.8s', usedby: 'Tableau Dashboards', lastrebuild: '02:00 AM Today', status: 'Optimal' };
    })`
  },

  // Settings
  {
    path: 'executive/settings/preferences', title: 'Dashboard Preferences', desc: 'Customizing default views, widgets, and themes for the executive dashboard.',
    cols: ['Setting', 'Current Configuration', 'Scope', 'Last Modified', 'Action'],
    stats: [{ label: 'Default Widgets', val: '6 Enabled', col: 'text-blue-400' }, { label: 'Theme', val: 'Dark Mode', col: 'text-emerald-400' }, { label: 'Auto-Refresh', val: '5 Mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 4 }).map((_, i) => {
      return { setting: ['Landing Page', 'Default Date Range', 'Currency Display', 'Chart Colors'][i], currentconfiguration: i===0?'Hospital KPIs':i===1?'MTD':'USD ($)','Brand Colors', scope: 'Global / Exec', lastmodified: 'Jan 2026', action: 'Edit' };
    })`
  },
  {
    path: 'executive/settings/kpi', title: 'KPI Configuration', desc: 'Defining hospital-wide benchmark targets (e.g., ALOS target = 4 days).',
    cols: ['KPI Name', 'Current Target', 'Previous Target', 'Effective Date', 'Action'],
    stats: [{ label: 'Total Targets Set', val: '124', col: 'text-blue-400' }, { label: 'Revised This Year', val: '15', col: 'text-amber-400' }, { label: 'Compliance', val: '85% Met', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { kpiname: 'Emergency Door-to-Doc Time', currenttarget: '< 10 Mins', previoustarget: '< 15 Mins', effectivedate: '01 Jan 2026', action: 'Update' };
    })`
  },
  {
    path: 'executive/settings/scheduling', title: 'Report Scheduling', desc: 'Automated email dispatch of MIS and PDF reports to the board/management.',
    cols: ['Report Name', 'Recipients', 'Frequency', 'Format', 'Next Run', 'Status'],
    stats: [{ label: 'Scheduled Reports', val: '24', col: 'text-blue-400' }, { label: 'Recipients', val: '15 Execs', col: 'text-emerald-400' }, { label: 'Failed Dispatches', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportname: 'Daily Revenue Summary', recipients: 'CEO, CFO', frequency: 'Daily 07:00 AM', format: 'PDF + Excel', nextrun: 'Tmrw 07:00 AM', status: 'Active' };
    })`
  },
  {
    path: 'executive/settings/notifications', title: 'Notification Settings', desc: 'SMS/Email alert thresholds for critical executive warnings.',
    cols: ['Alert Event', 'Trigger Condition', 'Notify Via', 'Escalation', 'Status'],
    stats: [{ label: 'Active Alerts', val: '12', col: 'text-blue-400' }, { label: 'Critical Triggers', val: '5', col: 'text-red-400' }, { label: 'SMS Enabled', val: 'Yes', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { alertevent: 'Mass Casualty / High ER Volume', triggercondition: '> 20 ER Pts in 1 Hr', notifyvia: 'SMS & App Push', escalation: 'CEO Direct', status: 'Active' };
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
        const isGood = val === 'On Target' || val === 'Positive' || val === 'Positive Trend' || val === 'Stable' || val === 'Optimal' || val === 'Normal' || val === 'Growing' || val === 'Efficient' || val === 'Strong' || val === 'Excellent' || val === 'Within Limits' || val === 'Compliant' || val === 'Better than Expected' || val === 'Reconciled' || val === 'Profitable' || val === 'Paid' || val === 'Healthy' || val === 'Active' || val === 'Resolved' || val === 'Reviewed' || val === 'Clean' || val === 'Operational' || val === 'Expanding' || val === 'Leader' || val === 'Ready' || val === 'Finalized' || val === 'Closed' || val === 'Published' || val === 'Audited' || val === 'Syncing' || val === 'Analyzed';
        const isWarning = val === 'Needs Attention' || val === 'Needs Improvement' || val === 'At Risk' || val === 'High Utilization' || val === 'Requires Review' || val === 'Review Required' || val === 'Review Suggested' || val === 'Near Capacity' || val === 'High Variance' || val === 'Payment Delayed' || val === 'Action Required' || val === 'Monitor Detractors' || val === 'High Overtime' || val === 'Over Budget' || val === 'Improvement Needed' || val === 'Overdue Follow-up' || val === 'Sourcing' || val === 'Monitored' || val === 'Monitor' || val === 'High Volume' || val === 'Expiring Soon' || val === 'Service Due' || val === 'Approval Pending' || val === 'Planning Phase' || val === 'Surge Alert' || val === 'Epidemic Alert' || val === 'Draft' || val === 'New Insight';
        const isNeutral = val === 'Acknowledged' || val === 'Manageable' || val === 'Review' || val === 'Approve' || val === 'Download' || val === 'View Deck' || val === 'View Details' || val === 'View Report' || val === 'View Annual Report' || val === 'Run Now' || val === 'Open Dashboard' || val === 'Edit' || val === 'Update';
        const isDanger = val === 'Action Needed' || val === 'Negative Trend' || val === 'Critical' || val === 'Critical Monitored' || val === 'Critical Risk' || val === 'High Impact' || val === 'Inefficient' || val === 'Loss Making' || val === 'High Disallowance' || val === 'High Risk' || val === 'Underutilized' || val === 'Understaffed' || val === 'Hard to Fill' || val === 'Underperforming' || val === 'Order Immediately';
        
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
