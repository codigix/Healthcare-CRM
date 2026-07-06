const fs = require('fs');
const path = require('path');

const config = [
  // Accounts Payable (AP)
  {
    path: 'finance/ap/bills', title: 'Vendor Bills', desc: 'Logging of all incoming vendor bills and non-PO invoices.',
    cols: ['Bill No', 'Vendor', 'Bill Date', 'Due Date', 'Total Amount', 'Status'],
    stats: [{ label: 'Total Bills Logged', val: '145', col: 'text-blue-400' }, { label: 'Pending Approval', val: '24', col: 'text-amber-400' }, { label: 'Value Pending', val: '$12,400', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Rejected', 'Approved'];
      return { billno: 'VBL-' + (1001+i), vendor: 'Vendor ' + (1+i), billdate: '0' + (1+i) + ' Jul 2026', duedate: (15+i) + ' Jul 2026', totalamount: '$' + (500+i*100), status: statuses[i] };
    })`
  },
  {
    path: 'finance/ap/invoices', title: 'Purchase Invoices', desc: 'Invoices directly linked to and matched with POs and GRNs.',
    cols: ['Invoice No', 'PO/GRN Ref', 'Vendor', 'Invoice Value', 'Matched Value', 'Status'],
    stats: [{ label: 'Invoices Matched', val: '85', col: 'text-emerald-400' }, { label: 'Variance Pending', val: '3', col: 'text-red-400' }, { label: 'Ready for Payment', val: '45', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Matched', 'Variance Detected', 'Matched', 'Matched', 'Pending GRN'];
      return { invoiceno: 'INV-' + (2001+i), pogrnref: 'PO-' + (9988+i), vendor: 'Supplier ' + (1+i), invoicevalue: '$' + (1000+i*500), matchedvalue: statuses==='Variance Detected'?'$950':'$'+(1000+i*500), status: statuses };
    })`
  },
  {
    path: 'finance/ap/approval', title: 'Payment Approval', desc: 'Management workflow for approving large vendor payments.',
    cols: ['Payment ID', 'Vendor', 'Amount', 'Requested By', 'Due Date', 'Status'],
    stats: [{ label: 'Pending Approval', val: '12', col: 'text-amber-400' }, { label: 'Value Pending', val: '$85,000', col: 'text-amber-400' }, { label: 'Approved Today', val: '5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Approved', 'Rejected'];
      return { paymentid: 'PMT-' + (3001+i), vendor: 'Vendor ' + (1+i), amount: '$' + (5000+i*2000), requestedby: 'Finance Mgr', duedate: 'Today', status: statuses[i] };
    })`
  },
  {
    path: 'finance/ap/payments', title: 'Vendor Payments', desc: 'Execution and recording of payments made to vendors.',
    cols: ['Transaction ID', 'Vendor', 'Date', 'Amount Paid', 'Payment Mode', 'Status'],
    stats: [{ label: 'Payments Today', val: '$14,500', col: 'text-emerald-400' }, { label: 'Transactions', val: '24', col: 'text-blue-400' }, { label: 'Failed Txns', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { transactionid: 'TXN-' + (4001+i), vendor: 'Vendor ' + (1+i), date: 'Today', amountpaid: '$' + (1000+i*500), paymentmode: 'Bank Transfer', status: 'Success' };
    })`
  },
  {
    path: 'finance/ap/outstanding', title: 'Outstanding Payables', desc: 'Aging analysis of all money owed to vendors and suppliers.',
    cols: ['Vendor', 'Total Owed', '0-30 Days', '31-60 Days', '> 60 Days', 'Status'],
    stats: [{ label: 'Total AP', val: '$450,000', col: 'text-red-400' }, { label: 'Overdue > 60D', val: '$45,000', col: 'text-amber-400' }, { label: 'Cleared (Mo)', val: '$120,000', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { vendor: 'Supplier ' + (1+i), totalowed: '$' + (10000+i*5000), '030days': '$' + (5000+i*2000), '3160days': '$' + (3000+i*2000), '60days': '$' + (2000+i*1000), status: 'Payment Scheduled' };
    })`
  },

  // Accounting
  {
    path: 'finance/accounting/journal', title: 'Journal Entries', desc: 'Manual double-entry accounting records for adjustments and non-standard transactions.',
    cols: ['Entry ID', 'Date', 'Description', 'Total Debit', 'Total Credit', 'Status'],
    stats: [{ label: 'Entries Today', val: '45', col: 'text-blue-400' }, { label: 'Pending Approval', val: '4', col: 'text-amber-400' }, { label: 'Imbalanced', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Posted', 'Pending Auth', 'Posted', 'Draft', 'Posted'];
      return { entryid: 'JRN-' + (1001+i), date: 'Today', description: 'Month End Adjustment', totaldebit: '$' + (500+i*100), totalcredit: '$' + (500+i*100), status: statuses[i] };
    })`
  },
  {
    path: 'finance/accounting/ledger', title: 'General Ledger', desc: 'Master record of all accounts and their respective balances.',
    cols: ['Account Code', 'Account Name', 'Type', 'Debit Balance', 'Credit Balance', 'Status'],
    stats: [{ label: 'Active Accounts', val: '340', col: 'text-blue-400' }, { label: 'Total Assets', val: '$4.5M', col: 'text-emerald-400' }, { label: 'Total Liabilities', val: '$1.2M', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
      return { accountcode: 'ACT-' + (100+i), accountname: 'Account ' + (1+i), type: types[i], debitbalance: i%2===0?('$'+(10000+i*2000)):'$0', creditbalance: i%2!==0?('$'+(10000+i*2000)):'$0', status: 'Active' };
    })`
  },
  {
    path: 'finance/accounting/coa', title: 'Chart of Accounts', desc: 'Hierarchical structure of all financial accounts used in the hospital.',
    cols: ['Account Code', 'Account Name', 'Group', 'Type', 'Parent Account', 'Status'],
    stats: [{ label: 'Total Accounts', val: '340', col: 'text-blue-400' }, { label: 'Recently Added', val: '5', col: 'text-gray-400' }, { label: 'Inactive', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { accountcode: 'COA-' + (100+i), accountname: 'Cash in Hand - ' + (1+i), group: 'Current Assets', type: 'Asset', parentaccount: 'Cash & Equivalents', status: 'Active' };
    })`
  },
  {
    path: 'finance/accounting/cost-centers', title: 'Cost Centers', desc: 'Financial tracking categorized by hospital departments or specific projects.',
    cols: ['Cost Center ID', 'Name', 'Head/Manager', 'Budget Allocated', 'Consumed (YTD)', 'Status'],
    stats: [{ label: 'Total Cost Centers', val: '24', col: 'text-blue-400' }, { label: 'Over Budget', val: '2', col: 'text-red-400' }, { label: 'Within Budget', val: '22', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const centers = ['OT Complex', 'ICU', 'Radiology', 'Laboratory', 'Pharmacy'];
      return { costcenterid: 'CC-' + (101+i), name: centers[i], headmanager: 'Dr. Head ' + (1+i), budgetallocated: '$' + (500000-i*50000), consumedytd: '$' + (450000-i*45000), status: i===0?'Over Budget':'Within Budget' };
    })`
  },
  {
    path: 'finance/accounting/trial-balance', title: 'Trial Balance', desc: 'Summary of all ledger balances to ensure debits equal credits.',
    cols: ['Account Code', 'Account Name', 'Debit Amount', 'Credit Amount', 'Net Balance', 'Status'],
    stats: [{ label: 'Total Debits', val: '$5.4M', col: 'text-blue-400' }, { label: 'Total Credits', val: '$5.4M', col: 'text-emerald-400' }, { label: 'Difference', val: '$0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { accountcode: 'ACT-' + (100+i), accountname: 'Account ' + (1+i), debitamount: i%2===0?('$'+(10000+i*2000)):'$0', creditamount: i%2!==0?('$'+(10000+i*2000)):'$0', netbalance: '$' + (10000+i*2000), status: 'Balanced' };
    })`
  },
  {
    path: 'finance/accounting/opening', title: 'Opening Balances', desc: 'Initial balances brought forward at the start of the financial year.',
    cols: ['Account Code', 'Account Name', 'Previous Year Close', 'Opening Debit', 'Opening Credit', 'Status'],
    stats: [{ label: 'FY 2026-27 Set', val: 'Yes', col: 'text-emerald-400' }, { label: 'Pending Reconciliations', val: '0', col: 'text-emerald-400' }, { label: 'Total Accounts Set', val: '340', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { accountcode: 'ACT-' + (100+i), accountname: 'Account ' + (1+i), previousyearclose: '$' + (10000+i*2000), openingdebit: i%2===0?('$'+(10000+i*2000)):'$0', openingcredit: i%2!==0?('$'+(10000+i*2000)):'$0', status: 'Finalized' };
    })`
  },

  // Banking
  {
    path: 'finance/banking/accounts', title: 'Bank Accounts', desc: 'Management of all hospital bank accounts and their current balances.',
    cols: ['Bank Name', 'Account No', 'Account Type', 'Current Balance', 'Last Reconciled', 'Status'],
    stats: [{ label: 'Total Bank Balance', val: '$1.4M', col: 'text-emerald-400' }, { label: 'Active Accounts', val: '6', col: 'text-blue-400' }, { label: 'Pending Recon', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Current', 'Current', 'Savings', 'Fixed Deposit', 'Current'];
      return { bankname: 'Bank ' + (1+i), accountno: 'XXXX-XXXX-' + (1000+i), accounttype: types[i], currentbalance: '$' + (250000-i*40000), lastreconciled: 'Yesterday', status: 'Active' };
    })`
  },
  {
    path: 'finance/banking/deposits', title: 'Bank Deposits', desc: 'Records of cash, cheque, and DD deposits made to the bank.',
    cols: ['Deposit ID', 'Date', 'Type', 'Amount', 'Bank', 'Status'],
    stats: [{ label: 'Deposited Today', val: '$45,000', col: 'text-emerald-400' }, { label: 'Pending Clearance', val: '$12,000', col: 'text-amber-400' }, { label: 'Bounced Cheques', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Cash', 'Cheque', 'Cheque', 'DD', 'Cash'];
      const statuses = ['Cleared', 'Pending Clearance', 'Cleared', 'Cleared', 'Cleared'];
      return { depositid: 'BDP-' + (1001+i), date: 'Today', type: types[i], amount: '$' + (5000+i*1000), bank: 'National Bank', status: statuses[i] };
    })`
  },
  {
    path: 'finance/banking/payments', title: 'Bank Payments', desc: 'Outward payments made via NEFT, RTGS, or Cheque.',
    cols: ['Payment ID', 'Date', 'Payee', 'Amount', 'Mode', 'Status'],
    stats: [{ label: 'Payments Today', val: '$14,500', col: 'text-emerald-400' }, { label: 'Failed Payments', val: '1', col: 'text-red-400' }, { label: 'Pending Approvals', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Success', 'Pending Auth', 'Success', 'Failed', 'Success'];
      return { paymentid: 'BPM-' + (2001+i), date: 'Today', payee: 'Vendor ' + (1+i), amount: '$' + (1000+i*500), mode: 'NEFT', status: statuses[i] };
    })`
  },
  {
    path: 'finance/banking/transfers', title: 'Bank Transfers', desc: 'Internal fund transfers between different hospital bank accounts.',
    cols: ['Transfer ID', 'Date', 'From Account', 'To Account', 'Amount', 'Status'],
    stats: [{ label: 'Transfers (Mo)', val: '12', col: 'text-blue-400' }, { label: 'Total Value', val: '$450,000', col: 'text-emerald-400' }, { label: 'Pending', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { transferid: 'BTR-' + (3001+i), date: '0' + (1+i) + ' Jul 2026', fromaccount: 'Bank 1', toaccount: 'Bank 2', amount: '$' + (50000+i*10000), status: 'Success' };
    })`
  },
  {
    path: 'finance/banking/reconciliation', title: 'Bank Reconciliation', desc: 'Matching system entries with actual bank statements (BRS).',
    cols: ['Recon ID', 'Bank Account', 'Statement Date', 'Sys Balance', 'Bank Balance', 'Status'],
    stats: [{ label: 'Pending Recons', val: '2', col: 'text-amber-400' }, { label: 'Completed (Mo)', val: '14', col: 'text-emerald-400' }, { label: 'Unreconciled Value', val: '$450', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Reconciled', 'Pending', 'Variance Found', 'Reconciled', 'Reconciled'];
      return { reconid: 'BRC-' + (4001+i), bankaccount: 'Bank ' + (1+i), statementdate: '30 Jun 2026', sysbalance: '$' + (100000+i*10000), bankbalance: statuses==='Variance Found'?'$'+(99000+i*10000):'$'+(100000+i*10000), status: statuses };
    })`
  },

  // Taxation
  {
    path: 'finance/taxation/gst', title: 'GST', desc: 'Tracking of Goods and Services Tax (Inward and Outward).',
    cols: ['Month', 'Total Sales (Taxable)', 'GST Collected', 'Total Purchases', 'Input Tax Credit (ITC)', 'Status'],
    stats: [{ label: 'GST Payable (Mo)', val: '$14,500', col: 'text-red-400' }, { label: 'ITC Available', val: '$8,200', col: 'text-emerald-400' }, { label: 'Net Payable', val: '$6,300', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      return { month: months[i] + ' 2026', totalsalestaxable: '$' + (100000+i*10000), gstcollected: '$' + (18000+i*1800), totalpurchases: '$' + (50000+i*5000), inputtaxcredititc: '$' + (9000+i*900), status: 'Filed' };
    })`
  },
  {
    path: 'finance/taxation/tds', title: 'TDS', desc: 'Tax Deducted at Source for professional fees (doctors) and contractors.',
    cols: ['Month', 'Vendor/Doctor', 'Payment Amount', 'TDS Rate', 'TDS Deducted', 'Status'],
    stats: [{ label: 'TDS Deducted (Mo)', val: '$24,000', col: 'text-amber-400' }, { label: 'Deposited to Govt', val: '$24,000', col: 'text-emerald-400' }, { label: 'Pending Returns', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { month: 'June 2026', vendordoctor: 'Dr. Smith', paymentamount: '$' + (10000+i*2000), tdsrate: '10%', tdsdeducted: '$' + (1000+i*200), status: 'Deposited' };
    })`
  },
  {
    path: 'finance/taxation/invoices', title: 'Tax Invoices', desc: 'Formal tax invoices generated for B2B and specific patient requests.',
    cols: ['Invoice No', 'Date', 'Billed To', 'Taxable Amount', 'Total Tax', 'Status'],
    stats: [{ label: 'Invoices Generated', val: '145', col: 'text-blue-400' }, { label: 'Total Tax Billed', val: '$18,400', col: 'text-emerald-400' }, { label: 'Cancelled', val: '2', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { invoiceno: 'TXI-' + (1001+i), date: 'Today', billedto: 'Corporate ' + (1+i), taxableamount: '$' + (5000+i*1000), totaltax: '$' + (900+i*180), status: 'Active' };
    })`
  },
  {
    path: 'finance/taxation/credit', title: 'Credit Notes', desc: 'Issued when a tax invoice needs to be reduced (e.g., refunds, discounts post-billing).',
    cols: ['CN No', 'Original Invoice', 'Date', 'Reason', 'Credit Amount', 'Status'],
    stats: [{ label: 'Credit Notes (Mo)', val: '12', col: 'text-blue-400' }, { label: 'Total Value', val: '$1,200', col: 'text-amber-400' }, { label: 'Pending Approval', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { cnno: 'CRN-' + (2001+i), originalinvoice: 'TXI-' + (1000+i), date: 'Today', reason: 'Service Cancelled', creditamount: '$' + (100+i*20), status: 'Issued' };
    })`
  },
  {
    path: 'finance/taxation/debit', title: 'Debit Notes', desc: 'Issued to vendors when goods are returned, reversing ITC.',
    cols: ['DN No', 'Vendor', 'Date', 'Reason', 'Debit Amount', 'Status'],
    stats: [{ label: 'Debit Notes (Mo)', val: '8', col: 'text-blue-400' }, { label: 'Total Value', val: '$850', col: 'text-emerald-400' }, { label: 'Pending Adjustments', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { dnno: 'DBN-' + (3001+i), vendor: 'Vendor ' + (1+i), date: 'Yesterday', reason: 'Damaged Goods Return', debitamount: '$' + (50+i*10), status: 'Issued' };
    })`
  },
  {
    path: 'finance/taxation/reports', title: 'Tax Reports', desc: 'Automated generation of statutory tax filing reports.',
    cols: ['Report Type', 'Period', 'Generated On', 'Total Liability', 'Filed Status', 'Status'],
    stats: [{ label: 'Upcoming Deadlines', val: '2', col: 'text-red-400' }, { label: 'Filed (YTD)', val: '12', col: 'text-emerald-400' }, { label: 'Late Filings', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['GSTR-1', 'GSTR-3B', 'TDS Return', 'GSTR-1', 'GSTR-3B'];
      const statuses = i===0?'Pending Filing':'Filed';
      return { reporttype: types[i], period: 'June 2026', generatedon: '05 Jul 2026', totalliability: '$' + (15000+i*1000), filedstatus: statuses, status: statuses==='Filed'?'Completed':'Action Required' };
    })`
  },

  // Fixed Assets
  {
    path: 'finance/assets/register', title: 'Asset Register', desc: 'Financial view of hospital capital assets, distinct from physical inventory.',
    cols: ['Asset ID', 'Asset Name', 'Purchase Value', 'Accumulated Dep.', 'Net Book Value', 'Status'],
    stats: [{ label: 'Total Asset Value', val: '$8.5M', col: 'text-blue-400' }, { label: 'Net Book Value', val: '$5.2M', col: 'text-emerald-400' }, { label: 'Assets Added (Mo)', val: '$120K', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { assetid: 'FA-' + (1001+i), assetname: 'MRI Machine ' + (1+i), purchasevalue: '$' + (1500000-i*100000), accumulateddep: '$' + (500000-i*50000), netbookvalue: '$' + (1000000-i*50000), status: 'Active' };
    })`
  },
  {
    path: 'finance/assets/depreciation', title: 'Asset Depreciation', desc: 'Calculation and posting of monthly/annual depreciation entries.',
    cols: ['Period', 'Asset Category', 'Depreciation Method', 'Depreciation Amount', 'Posted Status', 'Status'],
    stats: [{ label: 'Depreciation (YTD)', val: '$450K', col: 'text-red-400' }, { label: 'Entries Posted', val: '12/12', col: 'text-emerald-400' }, { label: 'Next Run', val: '31 Jul', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Medical Equipment', 'IT Equipment', 'Furniture', 'Vehicles', 'Buildings'];
      return { period: 'June 2026', assetcategory: cats[i], depreciationmethod: 'Straight Line', depreciationamount: '$' + (15000-i*2000), postedstatus: 'Posted', status: 'Completed' };
    })`
  },
  {
    path: 'finance/assets/capitalization', title: 'Asset Capitalization', desc: 'Converting project expenses (e.g., building a new ward) into fixed assets.',
    cols: ['Project ID', 'Project Name', 'Total Expenses', 'Capitalized Value', 'Date', 'Status'],
    stats: [{ label: 'Active WIP Projects', val: '3', col: 'text-blue-400' }, { label: 'Capitalized (YTD)', val: '$1.2M', col: 'text-emerald-400' }, { label: 'Pending Cap.', val: '$450K', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Capitalized', 'WIP', 'Capitalized', 'Capitalized', 'WIP'];
      return { projectid: 'PRJ-' + (101+i), projectname: 'New ICU Wing ' + (1+i), totalexpenses: '$' + (500000+i*100000), capitalizedvalue: statuses==='WIP'?'-':('$'+(500000+i*100000)), date: '15 Jun 2026', status: statuses[i] };
    })`
  },
  {
    path: 'finance/assets/disposal', title: 'Asset Disposal', desc: 'Financial accounting for scrapped, sold, or lost assets (gain/loss calculation).',
    cols: ['Disposal ID', 'Asset Name', 'Net Book Value', 'Sale/Scrap Value', 'Gain/Loss', 'Status'],
    stats: [{ label: 'Assets Disposed (Mo)', val: '5', col: 'text-gray-400' }, { label: 'Net Loss on Sale', val: '$2,400', col: 'text-red-400' }, { label: 'Value Recovered', val: '$15K', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { disposalid: 'DSP-' + (2001+i), assetname: 'Old Server ' + (1+i), netbookvalue: '$' + (5000-i*500), salescrapvalue: '$' + (1000-i*100), gainloss: '-$' + (4000-i*400), status: 'Posted' };
    })`
  },

  // Payroll Finance
  {
    path: 'finance/payroll/salary', title: 'Salary Posting', desc: 'Transferring processed HR payroll data into the financial ledger.',
    cols: ['Month', 'Department', 'Total Employees', 'Gross Salary', 'Net Payable', 'Status'],
    stats: [{ label: 'Total Payroll (Mo)', val: '$450,000', col: 'text-blue-400' }, { label: 'Disbursed', val: '$450,000', col: 'text-emerald-400' }, { label: 'Pending Clearance', val: '$0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Nursing', 'Doctors', 'Admin', 'Support Staff', 'IT'];
      return { month: 'June 2026', department: depts[i], totalemployees: (150-i*25).toString(), grosssalary: '$' + (120000-i*20000), netpayable: '$' + (100000-i*18000), status: 'Disbursed' };
    })`
  },
  {
    path: 'finance/payroll/journal', title: 'Payroll Journal', desc: 'Detailed accounting journal entries for salaries, taxes, and benefits.',
    cols: ['Entry ID', 'Date', 'Description', 'Debit (Expense)', 'Credit (Liability/Bank)', 'Status'],
    stats: [{ label: 'Entries (Mo)', val: '15', col: 'text-blue-400' }, { label: 'Total Debits', val: '$450K', col: 'text-emerald-400' }, { label: 'Pending Auth', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { entryid: 'PRJ-' + (1001+i), date: '30 Jun 2026', description: 'Salary Expense - ' + (1+i), debitexpense: '$' + (100000-i*10000), creditliabilitybank: '$' + (100000-i*10000), status: 'Posted' };
    })`
  },
  {
    path: 'finance/payroll/deductions', title: 'Statutory Deductions', desc: 'Management of TDS, Professional Tax, and other mandatory payroll deductions.',
    cols: ['Month', 'Deduction Type', 'Total Amount', 'No of Employees', 'Due Date', 'Status'],
    stats: [{ label: 'Total Deductions', val: '$85,000', col: 'text-red-400' }, { label: 'Deposited', val: '$85,000', col: 'text-emerald-400' }, { label: 'Pending Deposits', val: '$0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['TDS (Income Tax)', 'Professional Tax', 'Staff Loan EMI', 'TDS (Income Tax)', 'Professional Tax'];
      return { month: 'June 2026', deductiontype: types[i], totalamount: '$' + (40000-i*5000), noofemployees: (300-i*20).toString(), duedate: '15 Jul 2026', status: 'Deposited' };
    })`
  },
  {
    path: 'finance/payroll/pf-esi', title: 'PF / ESI Posting', desc: 'Provident Fund and State Insurance contributions (Employee + Employer).',
    cols: ['Month', 'Contribution Type', 'Employee Share', 'Employer Share', 'Total Deposit', 'Status'],
    stats: [{ label: 'PF/ESI Liability', val: '$45,000', col: 'text-amber-400' }, { label: 'Deposited', val: '$45,000', col: 'text-emerald-400' }, { label: 'ECR Filed', val: 'Yes', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Provident Fund (PF)', 'ESIC', 'Provident Fund (PF)', 'ESIC', 'Provident Fund (PF)'];
      return { month: 'June 2026', contributiontype: types[i], employeeshare: '$' + (15000-i*2000), employershare: '$' + (16000-i*2100), totaldeposit: '$' + (31000-i*4100), status: 'Deposited' };
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
        const isGood = val === 'Approved' || val === 'Success' || val === 'Matched' || val === 'Posted' || val === 'Active' || val === 'Within Budget' || val === 'Balanced' || val === 'Finalized' || val === 'Cleared' || val === 'Filed' || val === 'Deposited' || val === 'Completed' || val === 'Capitalized' || val === 'Disbursed';
        const isWarning = val === 'Pending Auth' || val === 'Pending GRN' || val === 'Payment Scheduled' || val === 'Draft' || val === 'Pending Clearance' || val === 'Pending Recon' || val === 'Pending Filing' || val === 'Action Required' || val === 'WIP';
        const isNeutral = val === 'Issued';
        const isDanger = val === 'Rejected' || val === 'Variance Detected' || val === 'Over Budget' || val === 'Variance Found' || val === 'Failed' || val === 'Written Off';
        
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
