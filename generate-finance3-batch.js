const fs = require('fs');
const path = require('path');

const config = [
  // Revenue Management
  {
    path: 'finance/revenue/department', title: 'Department Revenue', desc: 'Income generated breakdown by each clinical and non-clinical department.',
    cols: ['Department', 'OPD Revenue', 'IPD Revenue', 'Total Revenue', 'Growth (MoM)', 'Status'],
    stats: [{ label: 'Total Revenue (Mo)', val: '$4.2M', col: 'text-emerald-400' }, { label: 'Top Department', val: 'Cardiology', col: 'text-blue-400' }, { label: 'Lowest Growth', val: 'Dietetics', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Pediatrics'];
      return { department: depts[i], opdrevenue: '$' + (150000-i*10000), ipdrevenue: '$' + (400000-i*50000), totalrevenue: '$' + (550000-i*60000), growthmom: i===4?'-2%':'+' + (5+i) + '%', status: 'Analyzed' };
    })`
  },
  {
    path: 'finance/revenue/doctor', title: 'Doctor Revenue', desc: 'Revenue generated per consultant and their corresponding payout shares.',
    cols: ['Doctor Name', 'Department', 'Consultation Rev', 'Procedure Rev', 'Total Share', 'Status'],
    stats: [{ label: 'Top Earner', val: 'Dr. Smith', col: 'text-emerald-400' }, { label: 'Total Payouts (Mo)', val: '$850K', col: 'text-blue-400' }, { label: 'Pending Disbursal', val: '$0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { doctorname: 'Dr. ' + (1+i), department: 'Cardiology', consultationrev: '$' + (20000-i*2000), procedurerev: '$' + (80000-i*10000), totalshare: '$' + (40000-i*5000), status: 'Settled' };
    })`
  },
  {
    path: 'finance/revenue/package', title: 'Package Revenue', desc: 'Profitability analysis of fixed-cost surgical and maternity packages.',
    cols: ['Package Name', 'Count (Mo)', 'Total Revenue', 'Total Actual Cost', 'Margin', 'Status'],
    stats: [{ label: 'Most Profitable', val: 'Cataract', col: 'text-emerald-400' }, { label: 'Loss Making', val: '1 Package', col: 'text-red-400' }, { label: 'Total Margin', val: '24%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const packages = ['Normal Delivery', 'CABG', 'Knee Replacement', 'Cataract', 'Appendectomy'];
      const margins = ['15%', '22%', '18%', '45%', '-2%'];
      const statuses = i===4?'Loss Warning':'Profitable';
      return { packagename: packages[i], countmo: (50-i*5).toString(), totalrevenue: '$' + (100000-i*10000), totalactualcost: '$' + (85000-i*8000), margin: margins[i], status: statuses };
    })`
  },
  {
    path: 'finance/revenue/daily', title: 'Daily Revenue', desc: 'Day-end snapshot of all billed services versus actual collections.',
    cols: ['Date', 'Total Billed', 'Discounts Given', 'Net Revenue', 'Actual Collected', 'Status'],
    stats: [{ label: 'Avg Daily Rev', val: '$145K', col: 'text-blue-400' }, { label: 'Collection Ratio', val: '92%', col: 'text-emerald-400' }, { label: 'Avg Daily Discount', val: '$4.5K', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: '0' + (1+i) + ' Jul 2026', totalbilled: '$' + (150000-i*5000), discountsgiven: '$' + (5000-i*500), netrevenue: '$' + (145000-i*4500), actualcollected: '$' + (130000-i*4000), status: 'Reconciled' };
    })`
  },
  {
    path: 'finance/revenue/monthly', title: 'Monthly Revenue', desc: 'Month-on-Month comparison for board reporting and trend analysis.',
    cols: ['Month', 'OPD %', 'IPD %', 'Total Revenue', 'Target Achieved', 'Status'],
    stats: [{ label: 'YTD Revenue', val: '$24.5M', col: 'text-emerald-400' }, { label: 'Target Achievement', val: '105%', col: 'text-blue-400' }, { label: 'Highest Month', val: 'May', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const targets = ['102%', '98%', '105%', '110%', '95%'];
      return { month: months[i] + ' 2026', opd: '30%', ipd: '70%', totalrevenue: '$' + (4000000+i*100000), targetachieved: targets[i], status: 'Closed' };
    })`
  },
  {
    path: 'finance/revenue/analytics', title: 'Revenue Analytics', desc: 'AI-driven insights into pricing optimization and revenue leakage.',
    cols: ['Insight Area', 'Observation', 'Impact Est', 'Suggested Action', 'Status'],
    stats: [{ label: 'Leakages Identified', val: '4', col: 'text-red-400' }, { label: 'Optimization Opps', val: '12', col: 'text-amber-400' }, { label: 'Potential Uplift', val: '$1.2M', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const areas = ['Pharmacy Discounting', 'Unbilled Consumables (OT)', 'Package Pricing', 'Underutilized Assets', 'Corporate Tariffs'];
      const statuses = i===1?'Urgent':'Review Needed';
      return { insightarea: areas[i], observation: 'Consistent 15% discount given off-policy', impactest: '$45K/mo', suggestedaction: 'Enforce system limits', status: statuses };
    })`
  },

  // Financial Reports
  {
    path: 'finance/reports/collection', title: 'Daily Collection', desc: 'End of day summary of all cash, card, and UPI transactions.',
    cols: ['Date', 'Cashier', 'Cash Total', 'Card Total', 'UPI Total', 'Status'],
    stats: [{ label: 'Reports Generated', val: '145', col: 'text-blue-400' }, { label: 'Variances Noted', val: '2', col: 'text-amber-400' }, { label: 'Total Collected (Mo)', val: '$4.2M', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: 'Today', cashier: 'All Counters', cashtotal: '$' + (15000+i*1000), cardtotal: '$' + (45000+i*2000), upitotal: '$' + (25000+i*1500), status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/revenue', title: 'Revenue Report', desc: 'Detailed breakdown of income by service type (Consultation, Bed, Surgery, etc).',
    cols: ['Service Group', 'Transactions', 'Gross Revenue', 'Discounts', 'Net Revenue', 'Status'],
    stats: [{ label: 'Top Service', val: 'Room Rent', col: 'text-blue-400' }, { label: 'Total Discount %', val: '4.2%', col: 'text-amber-400' }, { label: 'Net Rev (Mo)', val: '$4.2M', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const groups = ['Room Rent', 'Consultations', 'Surgeries', 'Pharmacy', 'Investigations'];
      return { servicegroup: groups[i], transactions: (1500-i*200).toString(), grossrevenue: '$' + (500000-i*50000), discounts: '$' + (20000-i*2000), netrevenue: '$' + (480000-i*48000), status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/pl', title: 'Income Statement (P&L)', desc: 'Profit and Loss statement showing hospital profitability over a period.',
    cols: ['Category', 'Type', 'Amount (Current)', 'Amount (Previous)', '% Change', 'Status'],
    stats: [{ label: 'Net Profit Margin', val: '18.4%', col: 'text-emerald-400' }, { label: 'Total Revenue', val: '$4.2M', col: 'text-blue-400' }, { label: 'Total Expenses', val: '$3.4M', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Operating Revenue', 'COGS (Pharmacy/Consumables)', 'Payroll Expenses', 'Admin Expenses', 'Net Profit'];
      const types = ['Revenue', 'Expense', 'Expense', 'Expense', 'Profit'];
      return { category: cats[i], type: types[i], amountcurrent: '$' + (1000000-i*150000), amountprevious: '$' + (950000-i*140000), change: '+5.2%', status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/balance-sheet', title: 'Balance Sheet', desc: 'Snapshot of hospital assets, liabilities, and equity at a specific point in time.',
    cols: ['Group', 'Sub-Group', 'Amount (Current)', 'Amount (Previous)', 'Variance', 'Status'],
    stats: [{ label: 'Total Assets', val: '$24.5M', col: 'text-blue-400' }, { label: 'Total Liabilities', val: '$12.4M', col: 'text-amber-400' }, { label: 'Current Ratio', val: '1.8', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const groups = ['Assets', 'Assets', 'Liabilities', 'Liabilities', 'Equity'];
      const subgroups = ['Current Assets', 'Fixed Assets', 'Current Liabilities', 'Long-term Debt', 'Retained Earnings'];
      return { group: groups[i], subgroup: subgroups[i], amountcurrent: '$' + (5000000-i*500000), amountprevious: '$' + (4800000-i*480000), variance: '+$200K', status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/cash-flow', title: 'Cash Flow', desc: 'Analysis of cash inflows and outflows (Operating, Investing, Financing).',
    cols: ['Activity Type', 'Description', 'Inflow', 'Outflow', 'Net Cash', 'Status'],
    stats: [{ label: 'Operating Cash Flow', val: '$850K', col: 'text-emerald-400' }, { label: 'Free Cash Flow', val: '$450K', col: 'text-blue-400' }, { label: 'Cash at End', val: '$1.4M', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 4 }).map((_, i) => {
      const activities = ['Operating', 'Investing', 'Financing', 'Net Increase'];
      return { activitytype: activities[i], description: 'Cash from ' + activities[i], inflow: '$' + (2000000-i*500000), outflow: '$' + (1500000-i*400000), netcash: '$' + (500000-i*100000), status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/trial-balance', title: 'Trial Balance Report', desc: 'Detailed printout of the trial balance for audit purposes.',
    cols: ['Account Code', 'Account Name', 'Debit Balance', 'Credit Balance', 'Status'],
    stats: [{ label: 'Total Accounts', val: '340', col: 'text-blue-400' }, { label: 'Total Debits', val: '$5.4M', col: 'text-emerald-400' }, { label: 'Total Credits', val: '$5.4M', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { accountcode: 'ACT-' + (100+i), accountname: 'Account ' + (1+i), debitbalance: i%2===0?('$'+(10000+i*2000)):'$0', creditbalance: i%2!==0?('$'+(10000+i*2000)):'$0', status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/gl', title: 'General Ledger Report', desc: 'Transaction level detail for every account in the chart of accounts.',
    cols: ['Date', 'Voucher', 'Description', 'Debit', 'Credit', 'Running Balance', 'Status'],
    stats: [{ label: 'Transactions (Mo)', val: '14,500', col: 'text-blue-400' }, { label: 'Pages', val: '450', col: 'text-gray-400' }, { label: 'Report Size', val: '12 MB', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: 'Today', voucher: 'VCH-' + (1001+i), description: 'Patient Bill Settlement', debit: i%2===0?'$500':'-', credit: i%2!==0?'$500':'-', runningbalance: '$' + (10000+i*500), status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/gst', title: 'GST Report', desc: 'Itemized list of B2B and B2C sales for GST portal upload.',
    cols: ['Invoice No', 'GSTIN', 'Taxable Value', 'CGST', 'SGST', 'Status'],
    stats: [{ label: 'B2B Invoices', val: '145', col: 'text-blue-400' }, { label: 'B2C Invoices', val: '14,500', col: 'text-emerald-400' }, { label: 'Total Tax', val: '$14,500', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { invoiceno: 'TXI-' + (1001+i), gstin: i===0?'27AADCB2230M1Z2':'Unregistered', taxablevalue: '$' + (5000+i*1000), cgst: '$' + (450+i*90), sgst: '$' + (450+i*90), status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/insurance', title: 'Insurance Report', desc: 'Summary of claims sent, settled, and rejected per TPA/Provider.',
    cols: ['Provider', 'Claims Sent', 'Claimed Value', 'Settled Value', 'Deduction %', 'Status'],
    stats: [{ label: 'Overall Deduction %', val: '4.5%', col: 'text-emerald-400' }, { label: 'Total Settled (Mo)', val: '$850K', col: 'text-blue-400' }, { label: 'Highest Reject Rate', val: 'Bupa', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const providers = ['Allianz', 'Cigna', 'Aetna', 'Bupa', 'MediAssist'];
      return { provider: providers[i], claimssent: (150-i*20).toString(), claimedvalue: '$' + (500000-i*50000), settledvalue: '$' + (480000-i*48000), deduction: (4+i) + '%', status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/scheme', title: 'Government Scheme Report', desc: 'Specialized reporting formats required by government health departments.',
    cols: ['Scheme', 'Patients Treated', 'Claims Submitted', 'Settled Amount', 'Pending Auth', 'Status'],
    stats: [{ label: 'Govt Revenue (YTD)', val: '$1.2M', col: 'text-emerald-400' }, { label: 'Total Patients', val: '850', col: 'text-blue-400' }, { label: 'Avg TAT', val: '45 Days', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const schemes = ['PM-JAY', 'CGHS', 'ESIC', 'MJPJAY', 'State Scheme'];
      return { scheme: schemes[i], patientstreated: (200-i*20).toString(), claimssubmitted: (180-i*15).toString(), settledamount: '$' + (150000-i*15000), pendingauth: (10+i).toString(), status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/outstanding', title: 'Outstanding Report', desc: 'Consolidated view of all AR (Patient + Corporate + Insurance).',
    cols: ['Debtor Name', 'Type', '0-30 Days', '31-90 Days', '> 90 Days', 'Status'],
    stats: [{ label: 'Total Outstanding', val: '$3.4M', col: 'text-red-400' }, { label: 'Corporate %', val: '45%', col: 'text-amber-400' }, { label: 'Insurance %', val: '50%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { debtorname: 'Corporate ' + (1+i), type: 'B2B', '030days': '$' + (50000+i*10000), '3190days': '$' + (20000+i*5000), '90days': '$' + (5000+i*1000), status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/refund', title: 'Refund Report', desc: 'Audit log of all money returned to patients or vendors.',
    cols: ['Refund ID', 'Date', 'Beneficiary', 'Amount', 'Reason', 'Status'],
    stats: [{ label: 'Total Refunds (Mo)', val: '$12,400', col: 'text-amber-400' }, { label: 'Refund Count', val: '45', col: 'text-blue-400' }, { label: 'Avg Refund TAT', val: '2 Days', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { refundid: 'RFD-' + (1001+i), date: 'Today', beneficiary: 'Patient ' + (1+i), amount: '$' + (200+i*50), reason: 'Excess Advance', status: 'Generated' };
    })`
  },
  {
    path: 'finance/reports/department', title: 'Department Revenue Report', desc: 'Performance sheet of all departments compared against budgets.',
    cols: ['Department', 'Budgeted Rev', 'Actual Rev', 'Variance', 'Direct Expenses', 'Status'],
    stats: [{ label: 'Total Revenue Variance', val: '+5.2%', col: 'text-emerald-400' }, { label: 'Top Performer', val: 'Cardiology', col: 'text-blue-400' }, { label: 'Underperforming', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Pediatrics'];
      return { department: depts[i], budgetedrev: '$' + (500000-i*50000), actualrev: '$' + (550000-i*60000), variance: i===4?'-2%':'+' + (5+i) + '%', directexpenses: '$' + (200000-i*20000), status: 'Generated' };
    })`
  },

  // Audit & Compliance
  {
    path: 'finance/audit/financial', title: 'Financial Audit', desc: 'Tools for internal auditors to sample and verify financial statements.',
    cols: ['Audit ID', 'Period', 'Area Audited', 'Findings Logged', 'Auditor', 'Status'],
    stats: [{ label: 'Open Audits', val: '2', col: 'text-amber-400' }, { label: 'Completed (YTD)', val: '4', col: 'text-emerald-400' }, { label: 'Major Non-Compliances', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const areas = ['Q1 Revenue', 'Pharmacy Inventory', 'Payroll', 'Fixed Assets', 'Cash Handling'];
      const statuses = ['In Progress', 'Completed', 'Completed', 'Completed', 'Completed'];
      return { auditid: 'AUD-' + (1001+i), period: 'Q1 2026', areaaudited: areas[i], findingslogged: (i).toString(), auditor: 'Internal Team', status: statuses[i] };
    })`
  },
  {
    path: 'finance/audit/transaction', title: 'Transaction Audit', desc: 'Flagging anomalous transactions (e.g., deleted bills, unusually high discounts).',
    cols: ['Txn ID', 'Type', 'Amount', 'Flag Reason', 'User', 'Status'],
    stats: [{ label: 'Anomalies Flagged', val: '12', col: 'text-red-400' }, { label: 'Reviewed', val: '8', col: 'text-emerald-400' }, { label: 'Pending Review', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const reasons = ['High Discount', 'Bill Deleted', 'Backdated Entry', 'High Refund', 'Duplicate Entry'];
      const statuses = ['Pending Review', 'Cleared', 'Pending Review', 'Cleared', 'Cleared'];
      return { txnid: 'TXN-' + (9900+i), type: 'Invoice', amount: '$' + (1500+i*500), flagreason: reasons[i], user: 'User ' + (1+i), status: statuses[i] };
    })`
  },
  {
    path: 'finance/audit/logs', title: 'Audit Logs', desc: 'Immutable ledger of every single financial action performed in the system.',
    cols: ['Timestamp', 'User', 'Action', 'Module', 'Record ID', 'Status'],
    stats: [{ label: 'Logs (Today)', val: '14,500', col: 'text-blue-400' }, { label: 'Critical Actions', val: '45', col: 'text-amber-400' }, { label: 'Failed Logins', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timestamp: 'Today 10:' + (10+i) + ' AM', user: 'Admin', action: 'Update Record', module: 'Billing', recordid: 'BIL-100' + i, status: 'Logged' };
    })`
  },
  {
    path: 'finance/audit/approval', title: 'Approval History', desc: 'Traceability of who approved large payments, discounts, or credit limits.',
    cols: ['Req ID', 'Request Type', 'Requested By', 'Approved By', 'Timestamp', 'Status'],
    stats: [{ label: 'Approvals (Today)', val: '45', col: 'text-blue-400' }, { label: 'Avg Approval Time', val: '4.5 Hrs', col: 'text-emerald-400' }, { label: 'Rejections', val: '4', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Vendor Payment', 'High Discount', 'Credit Limit', 'Asset Disposal', 'Refund'];
      return { reqid: 'REQ-' + (5001+i), requesttype: types[i], requestedby: 'User A', approvedby: 'Finance Head', timestamp: 'Yesterday', status: 'Approved' };
    })`
  },

  // Analytics
  {
    path: 'finance/analytics/revenue', title: 'Revenue Dashboard', desc: 'Executive BI dashboard visualizing revenue streams and growth.',
    cols: ['Metric', 'Current Period', 'Target', 'Variance', 'Status'],
    stats: [{ label: 'Gross Revenue (YTD)', val: '$24.5M', col: 'text-emerald-400' }, { label: 'Growth YoY', val: '+12.4%', col: 'text-emerald-400' }, { label: 'EBITDA Margin', val: '22%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Total Gross Revenue', 'Net Revenue', 'OPD Contribution', 'IPD Contribution', 'Avg Revenue Per Bed'];
      const currents = ['$4.5M', '$4.2M', '32%', '68%', '$450/day'];
      const targets = ['$4.2M', '$4.0M', '30%', '70%', '$400/day'];
      return { metric: metrics[i], currentperiod: currents[i], target: targets[i], variance: 'Positive', status: 'On Track' };
    })`
  },
  {
    path: 'finance/analytics/collection', title: 'Collection Analytics', desc: 'Deep dive into payment modes, counter efficiency, and AR recovery rates.',
    cols: ['Counter/Mode', 'Collection Volume', 'Collection %', 'Avg Transaction', 'Status'],
    stats: [{ label: 'Digital Payments %', val: '65%', col: 'text-emerald-400' }, { label: 'Cash Handling Risk', val: 'Low', col: 'text-emerald-400' }, { label: 'Total Collections (Mo)', val: '$4.1M', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 4 }).map((_, i) => {
      const modes = ['Credit/Debit Card', 'UPI/Wallets', 'Cash', 'Bank Transfer (B2B)'];
      const percentages = ['45%', '20%', '15%', '20%'];
      return { countermode: modes[i], collectionvolume: '$' + (1800000-i*400000), collection: percentages[i], avgtransaction: '$' + (150+i*50), status: 'Analyzed' };
    })`
  },
  {
    path: 'finance/analytics/profitability', title: 'Profitability Analysis', desc: 'Identifying margins at the department, service, and doctor levels.',
    cols: ['Analysis Entity', 'Gross Margin', 'Net Margin', 'Contribution %', 'Status'],
    stats: [{ label: 'Most Profitable Dept', val: 'Cardiology (35%)', col: 'text-emerald-400' }, { label: 'Hospital Net Margin', val: '18.4%', col: 'text-blue-400' }, { label: 'Loss Making Units', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const entities = ['Cardiology Dept', 'Orthopedics Dept', 'Pharmacy', 'Laboratory', 'Radiology'];
      const nets = ['35%', '28%', '45%', '55%', '65%'];
      return { analysisentity: entities[i], grossmargin: (40+i*5) + '%', netmargin: nets[i], contribution: (20-i*2) + '%', status: 'Highly Profitable' };
    })`
  },
  {
    path: 'finance/analytics/insurance', title: 'Insurance Analytics', desc: 'Evaluating TPA performance, rejection rates, and payment TATs.',
    cols: ['Provider', 'Total Claims', 'Approval Rate', 'Rejection Rate', 'Avg Payment TAT', 'Status'],
    stats: [{ label: 'Avg Approval Rate', val: '94%', col: 'text-emerald-400' }, { label: 'Fastest Payer', val: 'Allianz (15D)', col: 'text-blue-400' }, { label: 'Highest Rejections', val: 'Bupa (8%)', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const providers = ['Allianz', 'Cigna', 'Aetna', 'Bupa', 'MediAssist'];
      const approvals = ['98%', '95%', '92%', '85%', '94%'];
      const tats = ['15 Days', '22 Days', '30 Days', '45 Days', '20 Days'];
      return { provider: providers[i], totalclaims: (1500-i*200).toString(), approvalrate: approvals[i], rejectionrate: (2+i) + '%', avgpaymenttat: tats[i], status: 'Analyzed' };
    })`
  },
  {
    path: 'finance/analytics/kpis', title: 'Financial KPIs', desc: 'Core metric tracking: EBITDA, Current Ratio, Days in AR, Debt to Equity.',
    cols: ['KPI Name', 'Current Value', 'Industry Benchmark', 'Health Status', 'Status'],
    stats: [{ label: 'Days in AR', val: '42 Days', col: 'text-emerald-400' }, { label: 'EBITDA Margin', val: '22%', col: 'text-blue-400' }, { label: 'Operating Margin', val: '15%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const kpis = ['Days in Accounts Receivable', 'Current Ratio', 'Debt-to-Equity Ratio', 'Operating Profit Margin', 'Return on Assets (ROA)'];
      const values = ['42 Days', '1.8', '0.5', '15%', '8%'];
      const benchmarks = ['< 50 Days', '> 1.5', '< 1.0', '> 10%', '> 5%'];
      return { kpiname: kpis[i], currentvalue: values[i], industrybenchmark: benchmarks[i], healthstatus: 'Strong', status: 'On Track' };
    })`
  },

  // Settings
  {
    path: 'finance/settings/charge-master', title: 'Charge Master', desc: 'Central repository defining the prices of every service, test, and bed in the hospital.',
    cols: ['Service Code', 'Service Name', 'Department', 'Standard Rate', 'Corporate Rate', 'Status'],
    stats: [{ label: 'Total Services Defined', val: '4,500', col: 'text-blue-400' }, { label: 'Recent Updates', val: '12 (This Week)', col: 'text-amber-400' }, { label: 'Unpriced Services', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const services = ['OPD Consultation - Sr.', 'General Ward Bed / Day', 'CBC Test', 'Chest X-Ray', 'ECG'];
      return { servicecode: 'SRV-' + (1001+i), servicename: services[i], department: 'Various', standardrate: '$' + (50+i*20), corporaterate: '$' + (45+i*18), status: 'Active' };
    })`
  },
  {
    path: 'finance/settings/billing-rules', title: 'Billing Rules', desc: 'Logic for automatic tax application, night charges, or emergency surcharges.',
    cols: ['Rule Name', 'Condition', 'Action/Modifier', 'Priority', 'Status'],
    stats: [{ label: 'Active Rules', val: '18', col: 'text-blue-400' }, { label: 'Emergency Surcharge', val: '1.5x', col: 'text-amber-400' }, { label: 'Night Surcharge', val: '+20%', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const rules = ['Night Consultation Surcharge', 'Emergency OT Surcharge', 'Senior Citizen Discount', 'Staff Discount', 'Package Exclusion Auto-Bill'];
      const modifiers = ['+20% on consult', '+50% on surgeon fee', '-10% on bed charges', '-25% overall', 'Bill at actuals'];
      return { rulename: rules[i], condition: 'Time > 10PM', actionmodifier: modifiers[i], priority: (1+i).toString(), status: 'Active' };
    })`
  },
  {
    path: 'finance/settings/payment-modes', title: 'Payment Modes', desc: 'Configuring payment gateways, card machines, and accepted currencies.',
    cols: ['Mode Name', 'Type', 'Gateway/Provider', 'MDR Charge %', 'Status'],
    stats: [{ label: 'Active Modes', val: '8', col: 'text-blue-400' }, { label: 'Default Gateway', val: 'Stripe', col: 'text-emerald-400' }, { label: 'Avg MDR', val: '1.2%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const modes = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];
      const gateways = ['-', 'Stripe', 'Stripe', 'Razorpay', 'HDFC Bank'];
      return { modename: modes[i], type: modes[i], gatewayprovider: gateways[i], mdrcharge: i===0?'-':'1.5%', status: 'Active' };
    })`
  },
  {
    path: 'finance/settings/discount-rules', title: 'Discount Rules', desc: 'Setting maximum permissible discount limits for various user roles.',
    cols: ['Role/Designation', 'Max Discount %', 'Max Absolute Discount', 'Requires OTP', 'Status'],
    stats: [{ label: 'Roles Configured', val: '12', col: 'text-blue-400' }, { label: 'Cashier Limit', val: '5%', col: 'text-amber-400' }, { label: 'Admin Limit', val: '100%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const roles = ['Cashier', 'Billing Executive', 'Finance Manager', 'Medical Director', 'Hospital Admin'];
      const limits = ['5%', '10%', '25%', '50%', '100%'];
      return { roledesignation: roles[i], maxdiscount: limits[i], maxabsolutediscount: '$' + (50+i*500), requiresotp: i>1?'Yes':'No', status: 'Active' };
    })`
  },
  {
    path: 'finance/settings/financial-year', title: 'Financial Year', desc: 'Setting the active financial period and locking closed accounting periods.',
    cols: ['FY Name', 'Start Date', 'End Date', 'Books Status', 'Status'],
    stats: [{ label: 'Current FY', val: 'FY 2026-27', col: 'text-emerald-400' }, { label: 'Previous FY Status', val: 'Closed & Audited', col: 'text-blue-400' }, { label: 'Months Locked', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 3 }).map((_, i) => {
      const fys = ['FY 2026-27', 'FY 2025-26', 'FY 2024-25'];
      const statuses = i===0?'Open':'Closed';
      return { fyname: fys[i], startdate: '01 Apr ' + (2026-i), enddate: '31 Mar ' + (2027-i), booksstatus: statuses, status: statuses==='Open'?'Active':'Archived' };
    })`
  },
  {
    path: 'finance/settings/number-series', title: 'Number Series', desc: 'Defining the prefix and numbering format for all financial documents (Bills, Receipts).',
    cols: ['Document Type', 'Prefix', 'Current Number', 'Suffix', 'Reset Rule', 'Status'],
    stats: [{ label: 'Active Series', val: '15', col: 'text-blue-400' }, { label: 'Format', val: 'PRE-YYYY-XXXX', col: 'text-gray-400' }, { label: 'Conflicts', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const docs = ['OPD Bill', 'IPD Bill', 'Receipt', 'Tax Invoice', 'Journal Voucher'];
      const prefixes = ['OPD-', 'IPD-', 'REC-', 'TXI-', 'JRN-'];
      return { documenttype: docs[i], prefix: prefixes[i], currentnumber: (1500+i*500).toString(), suffix: '-26', resetrule: 'Yearly', status: 'Active' };
    })`
  },
  {
    path: 'finance/settings/approval-matrix', title: 'Approval Matrix', desc: 'Configuring multi-level approvals for refunds, AP payments, and journal entries.',
    cols: ['Process Name', 'Condition', 'Level 1 Approver', 'Level 2 Approver', 'Status'],
    stats: [{ label: 'Active Workflows', val: '8', col: 'text-blue-400' }, { label: 'Avg TAT', val: '4.5 Hrs', col: 'text-emerald-400' }, { label: 'Escalations Enabled', val: 'Yes', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const processes = ['Vendor Payment', 'Patient Refund', 'High Discount', 'Asset Disposal', 'Journal Entry'];
      const conditions = ['Amount > $5000', 'Amount > $1000', 'Discount > 20%', 'Any', 'Any'];
      return { processname: processes[i], condition: conditions[i], level1approver: 'Finance Mgr', level2approver: i===0?'CFO':'-', status: 'Active' };
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
        const isGood = val === 'Analyzed' || val === 'Settled' || val === 'Profitable' || val === 'Reconciled' || val === 'Closed' || val === 'Generated' || val === 'Completed' || val === 'Logged' || val === 'Approved' || val === 'On Track' || val === 'Highly Profitable' || val === 'Active';
        const isWarning = val === 'Review Needed' || val === 'Pending Review' || val === 'Action Required' || val === 'Loss Warning';
        const isNeutral = val === 'Issued';
        const isDanger = val === 'Urgent' || val === 'Archived';
        
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
