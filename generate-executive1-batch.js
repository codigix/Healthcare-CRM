const fs = require('fs');
const path = require('path');

const config = [
  // Executive Overview
  {
    path: 'executive/overview/kpis', title: 'Hospital KPIs', desc: 'High-level Key Performance Indicators for the entire hospital.',
    cols: ['KPI Category', 'Metric', 'Current Value', 'Target', 'Variance', 'Status'],
    stats: [{ label: 'Overall Hospital Score', val: '92/100', col: 'text-blue-400' }, { label: 'Revenue YTD', val: '$12.5M', col: 'text-emerald-400' }, { label: 'NPS Score', val: '75', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Bed Occupancy Rate', 'Avg Length of Stay', 'Patient Satisfaction', 'Operating Margin', 'Staff Turnover'];
      return { kpicategory: i<2?'Operations':i===2?'Quality':i===3?'Financial':'HR', metric: metrics[i], currentvalue: i===0?'85%':i===1?'4.2 Days':i===2?'92%':i===3?'18%':'5%', target: i===0?'80%':i===1?'<4 Days':i===2?'>90%':i===3?'>15%':'<8%', variance: i===1?'+0.2':'+2%', status: i===1?'Needs Attention':'On Target' };
    })`
  },
  {
    path: 'executive/overview/summary', title: "Today's Summary", desc: "A quick snapshot of today's operational and financial performance.",
    cols: ['Metric Area', 'Value', 'Yesterday', 'Week Avg', 'Trend', 'Status'],
    stats: [{ label: 'Total Admissions', val: '124', col: 'text-blue-400' }, { label: 'Daily Revenue', val: '$45K', col: 'text-emerald-400' }, { label: 'Emergency Cases', val: '22', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const areas = ['OPD Visits', 'IPD Admissions', 'Surgeries Performed', 'Total Discharges', 'Total Collections'];
      return { metricarea: areas[i], value: i===0?'450':i===1?'45':i===2?'12':i===3?'40':'$45,000', yesterday: i===0?'420':i===1?'40':i===2?'10':i===3?'38':'$42,000', weekavg: i===0?'430':i===1?'42':i===2?'11':i===3?'39':'$43,500', trend: '+5%', status: 'Positive' };
    })`
  },
  {
    path: 'executive/overview/live', title: 'Live Dashboard', desc: 'Real-time telemetry of critical hospital operations.',
    cols: ['Department', 'Current Status', 'Active Patients', 'Staff on Duty', 'Wait Time', 'Status'],
    stats: [{ label: 'Live Patients', val: '850', col: 'text-blue-400' }, { label: 'Active Staff', val: '320', col: 'text-emerald-400' }, { label: 'Avg Wait Time', val: '15 Mins', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Emergency', 'OPD', 'ICU', 'Operation Theater', 'Pharmacy'];
      return { department: depts[i], currentstatus: i===0?'High Volume':'Normal', activepatients: (50-i*10).toString(), staffonduty: (20-i*3).toString(), waittime: i===0?'45 Mins':'10 Mins', status: i===0?'Critical':'Stable' };
    })`
  },
  {
    path: 'executive/overview/scorecard', title: 'Hospital Scorecard', desc: 'Balanced scorecard evaluating Financial, Customer, Internal Process, and Learning & Growth perspectives.',
    cols: ['Perspective', 'Objective', 'Measure', 'Current Performance', 'Target', 'Status'],
    stats: [{ label: 'Overall Grade', val: 'A-', col: 'text-emerald-400' }, { label: 'Objectives Met', val: '18/24', col: 'text-blue-400' }, { label: 'Needs Improvement', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { perspective: i===0?'Financial':'Customer', objective: i===0?'Increase Revenue':'Improve Sat.', measure: i===0?'Rev. Growth %':'NPS', currentperformance: i===0?'12%':'75', target: i===0?'15%':'80', status: 'At Risk' };
    })`
  },
  {
    path: 'executive/overview/alerts', title: 'Executive Alerts', desc: 'Critical alerts requiring immediate C-level attention or intervention.',
    cols: ['Alert ID', 'Category', 'Description', 'Severity', 'Trigger Time', 'Status'],
    stats: [{ label: 'Critical Alerts', val: '1', col: 'text-red-400' }, { label: 'Warnings', val: '4', col: 'text-amber-400' }, { label: 'Resolved Today', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { alertid: 'ALT-' + (1001+i), category: i===0?'Clinical Risk':'Financial', description: i===0?'High mortality rate in ICU today':'Cash flow below threshold', severity: i===0?'High':'Medium', triggertime: '2 Hrs Ago', status: i===0?'Action Needed':'Acknowledged' };
    })`
  },

  // Patient Analytics
  {
    path: 'executive/patients/opd', title: 'OPD Analytics', desc: 'Trends, demographics, and patterns of Outpatient Department visits.',
    cols: ['Specialty', 'Total Visits', 'New vs Review', 'Avg Wait Time', 'Conversion to IPD', 'Status'],
    stats: [{ label: 'Total OPD (MTD)', val: '12,500', col: 'text-blue-400' }, { label: 'New Patients', val: '3,200', col: 'text-emerald-400' }, { label: 'Avg Conversion', val: '8%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const specs = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Internal Med', 'Gynecology'];
      return { specialty: specs[i], totalvisits: (1500-i*200).toString(), newvsreview: '30% / 70%', avgwaittime: (20+i*5) + ' Mins', conversiontoipd: (10-i) + '%', status: 'Optimal' };
    })`
  },
  {
    path: 'executive/patients/ipd', title: 'IPD Analytics', desc: 'Inpatient metrics, length of stay, and bed utilization insights.',
    cols: ['Ward Type', 'Admissions', 'Discharges', 'Current Occupancy', 'Avg ALOS', 'Status'],
    stats: [{ label: 'Total IPD (MTD)', val: '1,450', col: 'text-blue-400' }, { label: 'Avg Occupancy', val: '82%', col: 'text-emerald-400' }, { label: 'Global ALOS', val: '4.2 Days', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const wards = ['General Ward', 'Semi-Private', 'Private', 'Suite', 'ICU Step-down'];
      return { wardtype: wards[i], admissions: (200-i*30).toString(), discharges: (180-i*30).toString(), currentoccupancy: (90-i*5) + '%', avgalos: (3+i) + ' Days', status: i===0?'High Utilization':'Normal' };
    })`
  },
  {
    path: 'executive/patients/emergency', title: 'Emergency Analytics', desc: 'Analysis of ER footfall, triage categories, and critical case conversions.',
    cols: ['Triage Level', 'Patient Count', 'Avg Time to Doctor', 'Admitted to ICU', 'Mortality Rate', 'Status'],
    stats: [{ label: 'ER Visits (MTD)', val: '3,200', col: 'text-red-400' }, { label: 'Avg Triage Time', val: '4 Mins', col: 'text-blue-400' }, { label: 'Admission Rate', val: '45%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { triagelevel: 'Level ' + (1+i), patientcount: (1000-i*200).toString(), avgtimetodoctor: (2+i*3) + ' Mins', admittedtoicu: (20-i*4) + '%', mortalityrate: (i===0?'5%':'<1%'), status: i===0?'Critical Monitored':'Stable' };
    })`
  },
  {
    path: 'executive/patients/admissions', title: 'Admission Trends', desc: 'Historical trends and forecasts for hospital admissions.',
    cols: ['Month/Period', 'Total Admissions', 'Elective', 'Emergency', 'Growth Trend', 'Status'],
    stats: [{ label: 'YTD Admissions', val: '14,500', col: 'text-blue-400' }, { label: 'Elective Rate', val: '65%', col: 'text-emerald-400' }, { label: 'YoY Growth', val: '+12%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { monthperiod: ['June', 'May', 'April', 'March', 'Feb'][i] + ' 2026', totaladmissions: (1200-i*50).toString(), elective: '800', emergency: '400', growthtrend: '+2%', status: 'Growing' };
    })`
  },
  {
    path: 'executive/patients/discharges', title: 'Discharge Analytics', desc: 'Analysis of discharge process efficiency and destination outcomes.',
    cols: ['Discharge Type', 'Total Count', 'Avg Discharge Time', 'Against Med Advice', 'Readmit Risk', 'Status'],
    stats: [{ label: 'Discharges (MTD)', val: '1,350', col: 'text-blue-400' }, { label: 'Avg Process Time', val: '3.5 Hrs', col: 'text-amber-400' }, { label: 'LAMA %', val: '2.1%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { dischargetype: i===0?'Routine':i===1?'Transfer':i===2?'LAMA':i===3?'Absconded':'Deceased', totalcount: i===0?'1200':i===1?'50':'25', avgdischargetime: '3 Hrs', againstmedadvice: i===2?'Yes':'No', readmitrisk: i===2?'High':'Low', status: i===2?'Requires Review':'Normal' };
    })`
  },
  {
    path: 'executive/patients/readmissions', title: 'Readmission Rates', desc: 'Tracking 30-day readmissions to assess quality of care and identify high-risk cohorts.',
    cols: ['Specialty', '30-Day Readmits', 'Readmit Rate', 'Primary Cause', 'Cost Impact', 'Status'],
    stats: [{ label: 'Global Readmit Rate', val: '4.5%', col: 'text-blue-400' }, { label: 'Target Rate', val: '< 5%', col: 'text-emerald-400' }, { label: 'Preventable Est.', val: '40%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { specialty: ['Cardiology', 'Pulmonology', 'Orthopedics', 'General Surg', 'Neurology'][i], '30dayreadmits': (25-i*4).toString(), readmitrate: (5-i*0.5) + '%', primarycause: 'Infection / Relapse', costimpact: '$' + (50000-i*10000), status: i===0?'Review Required':'On Target' };
    })`
  },
  {
    path: 'executive/patients/flow', title: 'Patient Flow Metrics', desc: 'Bottleneck analysis of patient journey from admission to discharge.',
    cols: ['Flow Stage', 'Volume', 'Avg Duration', 'Bottleneck Risk', 'Resource Utilized', 'Status'],
    stats: [{ label: 'Avg Total Journey', val: '5.2 Days', col: 'text-blue-400' }, { label: 'Major Bottleneck', val: 'Discharge Billing', col: 'text-amber-400' }, { label: 'Flow Score', val: '78/100', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { flowstage: ['ER to Ward', 'Ward to OT', 'OT to ICU', 'ICU to Ward', 'Ward to Discharge'][i], volume: '450', avgduration: i===4?'4 Hrs':'1 Hr', bottleneckrisk: i===4?'High':'Low', resourceutilized: 'Porters, Nurses', status: i===4?'Inefficient':'Optimal' };
    })`
  },
  {
    path: 'executive/patients/occupancy', title: 'Bed Occupancy', desc: 'Detailed occupancy rates across all wards and intensive care units.',
    cols: ['Unit Name', 'Total Beds', 'Occupied', 'Occupancy Rate', 'Turnover Interval', 'Status'],
    stats: [{ label: 'Global Occupancy', val: '82%', col: 'text-blue-400' }, { label: 'ICU Occupancy', val: '95%', col: 'text-red-400' }, { label: 'Available Beds', val: '124', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { unitname: ['Medical ICU', 'Surgical ICU', 'General Ward A', 'Maternity', 'Pediatrics'][i], totalbeds: '50', occupied: i<2?'48':'40', occupancyrate: i<2?'96%':'80%', turnoverinterval: '1.2 Days', status: i<2?'Near Capacity':'Optimal' };
    })`
  },
  {
    path: 'executive/patients/alos', title: 'Avg Length of Stay', desc: 'ALOS metrics broken down by specialty and doctor to manage bed turnover.',
    cols: ['Specialty / Doctor', 'Total Cases', 'Current ALOS', 'Benchmark ALOS', 'Variance', 'Status'],
    stats: [{ label: 'Hospital ALOS', val: '4.2 Days', col: 'text-blue-400' }, { label: 'Industry Benchmark', val: '4.5 Days', col: 'text-emerald-400' }, { label: 'Outliers (>10d)', val: '24 Cases', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { specialtydoctor: 'Dr. Smith (Gen Surg)', totalcases: '145', currentalos: (4+i) + ' Days', benchmarkalos: '4.5 Days', variance: i===4?'+3.5 Days':'-0.5 Days', status: i===4?'High Variance':'Efficient' };
    })`
  },

  // Clinical Analytics
  {
    path: 'executive/clinical/departments', title: 'Department Performance', desc: 'Comparative analysis of clinical departments on quality and volume metrics.',
    cols: ['Department', 'Patient Volume', 'Clinical Errors', 'Patient Sat.', 'Revenue Contrib.', 'Status'],
    stats: [{ label: 'Top Volume Dept', val: 'Internal Med', col: 'text-blue-400' }, { label: 'Top Revenue Dept', val: 'Cardiology', col: 'text-emerald-400' }, { label: 'Lowest Sat. Dept', val: 'Emergency', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Pediatrics'][i], patientvolume: (5000-i*500).toString(), clinicalerrors: i.toString(), patientsat: (95-i) + '%', revenuecontrib: (25-i*2) + '%', status: 'Strong' };
    })`
  },
  {
    path: 'executive/clinical/doctors', title: 'Doctor Performance', desc: 'KPIs for individual consultants: volume, revenue, and clinical outcomes.',
    cols: ['Doctor Name', 'Cases Handled', 'Revenue Gen.', 'Complication Rate', 'ALOS', 'Status'],
    stats: [{ label: 'Total Consultants', val: '145', col: 'text-blue-400' }, { label: 'Avg Revenue/Doc', val: '$120K/Mo', col: 'text-emerald-400' }, { label: 'Avg Complication', val: '1.2%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { doctorname: 'Dr. Consultant ' + (1+i), caseshandled: '85', revenuegen: '$' + (150-i*10) + 'K', complicationrate: '1%', alos: '3.5 Days', status: 'Excellent' };
    })`
  },
  {
    path: 'executive/clinical/surgery', title: 'Surgery Analytics', desc: 'Operation theater metrics: volumes, utilization, and post-op outcomes.',
    cols: ['Surgery Category', 'Total Volume', 'Avg OT Time', 'Cancel Rate', 'Infection Rate', 'Status'],
    stats: [{ label: 'Surgeries (MTD)', val: '850', col: 'text-blue-400' }, { label: 'OT Utilization', val: '78%', col: 'text-emerald-400' }, { label: 'Cancel Rate', val: '3%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { surgerycategory: ['Cardiac', 'Ortho', 'Neuro', 'General', 'Gyne'][i], totalvolume: (150-i*20).toString(), avgottime: '3 Hrs', cancelrate: '2%', infectionrate: '0.5%', status: 'Optimal' };
    })`
  },
  {
    path: 'executive/clinical/icu', title: 'ICU Analytics', desc: 'Intensive care outcomes, survival rates, and resource utilization.',
    cols: ['ICU Unit', 'Admissions', 'Avg APACHE Score', 'Survival Rate', 'VAP Rate', 'Status'],
    stats: [{ label: 'ICU Survival Rate', val: '92%', col: 'text-emerald-400' }, { label: 'Avg Stay', val: '5.5 Days', col: 'text-blue-400' }, { label: 'Bed Turnaround', val: '4 Hrs', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { icuunit: ['MICU', 'SICU', 'NICU', 'PICU', 'CCU'][i], admissions: '120', avgapachescore: '15', survivalrate: (90+i) + '%', vaprate: '1.2/1000', status: 'Excellent' };
    })`
  },
  {
    path: 'executive/clinical/mortality', title: 'Mortality Analysis', desc: 'Tracking and analyzing hospital-wide mortality rates by department and cause.',
    cols: ['Department', 'Total Deaths', 'Gross Mortality', 'Net Mortality (>48h)', 'Expected Range', 'Status'],
    stats: [{ label: 'Gross Mortality', val: '1.8%', col: 'text-blue-400' }, { label: 'Net Mortality', val: '1.2%', col: 'text-emerald-400' }, { label: 'M&M Reviews Pending', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: ['Emergency', 'ICU', 'Oncology', 'Cardiology', 'Neurology'][i], totaldeaths: (10-i).toString(), grossmortality: '2.1%', netmortality48h: '1.5%', expectedrange: '1% - 3%', status: 'Within Limits' };
    })`
  },
  {
    path: 'executive/clinical/infection', title: 'Infection Analytics', desc: 'Hospital-Acquired Infection (HAI) rates, including CAUTI, CLABSI, and SSI.',
    cols: ['Infection Type', 'Incidents (MTD)', 'Rate / 1000 Days', 'Benchmark', 'Cost Impact', 'Status'],
    stats: [{ label: 'Overall HAI Rate', val: '2.4%', col: 'text-emerald-400' }, { label: 'Zero Infection Days', val: '12', col: 'text-blue-400' }, { label: 'Antibiotic Usage', val: 'High', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { infectiontype: ['CAUTI', 'CLABSI', 'SSI', 'VAP', 'MRSA'][i], incidentsmtd: (5-i).toString(), rate1000days: '1.' + i, benchmark: '< 2.0', costimpact: '$' + (10000-i*1000), status: i===0?'Needs Attention':'Compliant' };
    })`
  },
  {
    path: 'executive/clinical/outcomes', title: 'Clinical Outcomes', desc: 'Patient Reported Outcome Measures (PROMs) and clinical success rates.',
    cols: ['Condition / Pathway', 'Total Treated', 'Success Rate', 'Complication Rate', 'PROM Score', 'Status'],
    stats: [{ label: 'Avg PROM Score', val: '8.5/10', col: 'text-emerald-400' }, { label: 'Pathways Tracked', val: '45', col: 'text-blue-400' }, { label: 'Data Completeness', val: '92%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { conditionpathway: ['Total Knee Replace', 'CABG', 'Cataract', 'Hernia Repair', 'Stroke Protocol'][i], totaltreated: '145', successrate: '98%', complicationrate: '2%', promscore: '8.8', status: 'Excellent' };
    })`
  },
  {
    path: 'executive/clinical/quality', title: 'Quality Indicators', desc: 'Aggregate dashboard for clinical quality indicators and patient safety metrics.',
    cols: ['Indicator', 'Target', 'Current Score', 'Variance', 'Responsible Dept', 'Status'],
    stats: [{ label: 'Indicators Met', val: '28/32', col: 'text-emerald-400' }, { label: 'Indicators At Risk', val: '4', col: 'text-amber-400' }, { label: 'Overall Quality', val: '94%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { indicator: ['Medication Errors', 'Fall Rate', 'Hand Hygiene Compl.', 'Time to Abx (Sepsis)', 'VTE Prophylaxis'][i], target: i===0?'0':'95%', currentscore: i===0?'2':'92%', variance: i===0?'+2':'-3%', responsibledept: 'Nursing', status: i===0?'Action Required':'Near Target' };
    })`
  },

  // Financial Analytics
  {
    path: 'executive/financial/revenue', title: 'Revenue Dashboard', desc: 'High-level revenue trends, breakdowns by source, and forecasting.',
    cols: ['Revenue Stream', 'YTD Revenue', 'YoY Growth', 'Margin %', 'Contribution', 'Status'],
    stats: [{ label: 'Total Revenue (YTD)', val: '$45.2M', col: 'text-blue-400' }, { label: 'Overall Margin', val: '18%', col: 'text-emerald-400' }, { label: 'Revenue vs Target', val: '+5%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { revenuestream: ['IPD Services', 'OPD Consults', 'Pharmacy', 'Diagnostics', 'Surgery'][i], ytdrevenue: '$' + (15-i*2) + 'M', yoygrowth: '+' + (10-i) + '%', margin: (20+i) + '%', contribution: (35-i*5) + '%', status: 'Growing' };
    })`
  },
  {
    path: 'executive/financial/collections', title: 'Daily Collections', desc: 'Cash flow tracking, mode of payment analysis, and daily banking reconciliations.',
    cols: ['Date', 'Total Collected', 'Cash', 'Credit/Debit', 'Insurance Transfers', 'Status'],
    stats: [{ label: 'Collections Today', val: '$125K', col: 'text-blue-400' }, { label: 'Deficit vs Billed', val: '3%', col: 'text-amber-400' }, { label: 'Bank Reconciled', val: 'Yes', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: 'Today - ' + i + ' Days', totalcollected: '$120,000', cash: '$20,000', creditdebit: '$60,000', insurancetransfers: '$40,000', status: 'Reconciled' };
    })`
  },
  {
    path: 'executive/financial/departments', title: 'Department Revenue', desc: 'P&L analysis at the individual clinical department level.',
    cols: ['Department', 'Gross Revenue', 'Direct Costs', 'Allocated Overhead', 'Net Margin', 'Status'],
    stats: [{ label: 'Profitable Depts', val: '18/22', col: 'text-emerald-400' }, { label: 'Loss-Making Depts', val: '4', col: 'text-red-400' }, { label: 'Highest Margin', val: 'Radiology (45%)', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: ['Radiology', 'Laboratory', 'Cardiology', 'Emergency', 'Pediatrics'][i], grossrevenue: '$' + (5-i) + 'M', directcosts: '$' + (2-i*0.2).toFixed(1) + 'M', allocatedoverhead: '$500K', netmargin: (40-i*5) + '%', status: i===3?'Loss Making':'Profitable' };
    })`
  },
  {
    path: 'executive/financial/doctors', title: 'Doctor Revenue', desc: 'Consultant fee generation, share calculations, and revenue contribution.',
    cols: ['Doctor Name', 'Total Billed', 'Hospital Share', 'Doctor Share', 'Effective Margin', 'Status'],
    stats: [{ label: 'Total Doctor Payouts', val: '$4.5M (MTD)', col: 'text-blue-400' }, { label: 'Avg Hosp Margin', val: '40%', col: 'text-emerald-400' }, { label: 'Top Earner', val: 'Dr. Smith', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { doctorname: 'Dr. Consultant ' + i, totalbilled: '$150,000', hospitalshare: '$60,000', doctorshare: '$90,000', effectivemargin: '40%', status: 'Paid' };
    })`
  },
  {
    path: 'executive/financial/insurance', title: 'Insurance Revenue', desc: 'TPA claim realization, disallowance rates, and aging of insurance receivables.',
    cols: ['Insurance TPA', 'Total Claims', 'Approved Amount', 'Disallowance %', 'Avg Payment Time', 'Status'],
    stats: [{ label: 'Insurance Billed', val: '$8.5M (YTD)', col: 'text-blue-400' }, { label: 'Avg Disallowance', val: '6.5%', col: 'text-amber-400' }, { label: 'Avg Realization Time', val: '45 Days', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { insurancetpa: ['Star Health', 'HDFC Ergo', 'ICICI Lombard', 'Care Health', 'Bajaj Allianz'][i], totalclaims: (500-i*50).toString(), approvedamount: '$' + (1.2-i*0.2).toFixed(1) + 'M', disallowance: (5+i) + '%', avgpaymenttime: (30+i*5) + ' Days', status: i===4?'High Disallowance':'Healthy' };
    })`
  },
  {
    path: 'executive/financial/schemes', title: 'Government Scheme Revenue', desc: 'Revenue analytics for subsidized government health schemes (e.g., Ayushman Bharat).',
    cols: ['Scheme Name', 'Patients Treated', 'Claimed Value', 'Realized Value', 'Pending Grants', 'Status'],
    stats: [{ label: 'Govt Revenue Share', val: '12%', col: 'text-blue-400' }, { label: 'Realization Rate', val: '85%', col: 'text-emerald-400' }, { label: 'Grants Delayed > 90d', val: '$450K', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { schemename: 'Ayushman Bharat', patientstreated: '1,200', claimedvalue: '$500,000', realizedvalue: '$420,000', pendinggrants: '$80,000', status: 'Payment Delayed' };
    })`
  },
  {
    path: 'executive/financial/pnl', title: 'Profit & Loss', desc: 'Comprehensive P&L statement, EBITDA tracking, and operating margin analytics.',
    cols: ['P&L Line Item', 'Current Period', 'Previous Period', 'Budgeted', 'Variance', 'Status'],
    stats: [{ label: 'YTD EBITDA', val: '22%', col: 'text-emerald-400' }, { label: 'Net Profit Margin', val: '14%', col: 'text-emerald-400' }, { label: 'Revenue vs Budget', val: '+4%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { pnllineitem: ['Gross Revenue', 'Direct Costs', 'Gross Profit', 'Operating Expenses', 'EBITDA'][i], currentperiod: '$' + (10-i) + 'M', previousperiod: '$' + (9-i) + 'M', budgeted: '$' + (9.5-i) + 'M', variance: '+5%', status: 'On Target' };
    })`
  },
  {
    path: 'executive/financial/cashflow', title: 'Cash Flow', desc: 'Liquidity analysis, cash reserves, operating cash flow, and capital expenditures.',
    cols: ['Cash Category', 'Inflow', 'Outflow', 'Net Change', 'Cash Reserve', 'Status'],
    stats: [{ label: 'Operating Cash Flow', val: '$2.5M (MTD)', col: 'text-emerald-400' }, { label: 'Days Cash on Hand', val: '65 Days', col: 'text-blue-400' }, { label: 'Capex Spend', val: '$1.2M', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { cashcategory: ['Operating Activities', 'Investing Activities', 'Financing Activities', 'Net Cash Flow', 'Beginning Balance'][i], inflow: '$' + (5-i) + 'M', outflow: '$' + (3-i) + 'M', netchange: '+$' + (2-i) + 'M', cashreserve: '$12M', status: 'Healthy' };
    })`
  },
  {
    path: 'executive/financial/receivables', title: 'Outstanding Receivables', desc: 'Account Receivables (AR) aging analysis (Corporate, TPA, Patients).',
    cols: ['Debtor Category', '0-30 Days', '31-60 Days', '61-90 Days', '> 90 Days', 'Status'],
    stats: [{ label: 'Total AR', val: '$4.2M', col: 'text-amber-400' }, { label: 'AR > 90 Days', val: '$850K', col: 'text-red-400' }, { label: 'Bad Debt Prov.', val: '$120K', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { debtorcategory: ['TPAs', 'Corporate Clients', 'Govt Schemes', 'Self-Pay Patients', 'Others'][i], '030days': '$500K', '3160days': '$300K', '6190days': '$150K', '90days': i===2?'$400K':'$50K', status: i===2?'High Risk':'Normal' };
    })`
  },
  {
    path: 'executive/financial/kpis', title: 'Financial KPIs', desc: 'Deep dive into financial ratios: ALOS cost impact, Rev per Bed, etc.',
    cols: ['Financial Metric', 'Current Value', 'Industry Avg', 'Target', 'Trend', 'Status'],
    stats: [{ label: 'Rev Per Occ Bed', val: '$1,200/Day', col: 'text-blue-400' }, { label: 'Cost Per Discharge', val: '$4,500', col: 'text-amber-400' }, { label: 'Operating Margin', val: '18%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { financialmetric: ['Rev Per Available Bed', 'Rev Per Occupied Bed', 'Cost Per Discharge', 'Staff Cost % of Rev', 'Supply Cost % of Rev'][i], currentvalue: i===0?'$950':i===1?'$1,200':'35%', industryavg: i===0?'$900':'$1,100', target: 'Top Quartile', trend: 'Improving', status: 'Optimal' };
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
        const isGood = val === 'On Target' || val === 'Positive' || val === 'Stable' || val === 'Optimal' || val === 'Normal' || val === 'Growing' || val === 'Efficient' || val === 'Strong' || val === 'Excellent' || val === 'Within Limits' || val === 'Compliant' || val === 'Reconciled' || val === 'Profitable' || val === 'Paid' || val === 'Healthy';
        const isWarning = val === 'Needs Attention' || val === 'At Risk' || val === 'High Utilization' || val === 'Requires Review' || val === 'Review Required' || val === 'Near Capacity' || val === 'High Variance' || val === 'Payment Delayed' || val === 'Action Required';
        const isNeutral = val === 'Acknowledged';
        const isDanger = val === 'Action Needed' || val === 'Critical' || val === 'Critical Monitored' || val === 'Inefficient' || val === 'Loss Making' || val === 'High Disallowance' || val === 'High Risk';
        
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
