import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/finance/accounting/coa": {
    ui: 5,
    title: "Chart of Accounts", description: "Hierarchical structure of all financial accounts used in the hospital.",
    stats: [{ label: "Total Accounts", color: "text-blue-400", value: "340" }, { label: "Recently Added", color: "text-gray-400", value: "5" }, { label: "Inactive", color: "text-red-400", value: "12" }],
    columns: [["Account Code", "accountcode"], ["Account Name", "accountname"], ["Group", "group"], ["Type", "type"], ["Parent Account", "parentaccount"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { accountcode: 'COA-' + (100 + i), accountname: 'Cash in Hand - ' + (1 + i), group: 'Current Assets', type: 'Asset', parentaccount: 'Cash & Equivalents', status: 'Active' };
      }),
  },
  "/finance/accounting/cost-centers": {
    ui: 5,
    title: "Cost Centers", description: "Financial tracking categorized by hospital departments or specific projects.",
    stats: [{ label: "Total Cost Centers", color: "text-blue-400", value: "24" }, { label: "Over Budget", color: "text-red-400", value: "2" }, { label: "Within Budget", color: "text-emerald-400", value: "22" }],
    columns: [["Cost Center ID", "costcenterid"], ["Name", "name"], ["Head/Manager", "headmanager"], ["Budget Allocated", "budgetallocated"], ["Consumed (YTD)", "consumedytd"]],
    badge: ["Status", "status", {"Over Budget":"red","Within Budget":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const centers = ['OT Complex', 'ICU', 'Radiology', 'Laboratory', 'Pharmacy'];
        return { costcenterid: 'CC-' + (101 + i), name: centers[i], headmanager: 'Dr. Head ' + (1 + i), budgetallocated: '$' + (500000 - i * 50000), consumedytd: '$' + (450000 - i * 45000), status: i === 0 ? 'Over Budget' : 'Within Budget' };
      }),
  },
  "/finance/accounting/journal": {
    ui: 5,
    title: "Journal Entries", description: "Manual double-entry accounting records for adjustments and non-standard transactions.",
    stats: [{ label: "Entries Today", color: "text-blue-400", value: "45" }, { label: "Pending Approval", color: "text-amber-400", value: "4" }, { label: "Imbalanced", color: "text-emerald-400", value: "0" }],
    columns: [["Entry ID", "entryid"], ["Date", "date"], ["Description", "description"], ["Total Debit", "totaldebit"], ["Total Credit", "totalcredit"]],
    badge: ["Status", "status", {"Posted":"emerald","Pending Auth":"amber","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Posted', 'Pending Auth', 'Posted', 'Draft', 'Posted'];
        return { entryid: 'JRN-' + (1001 + i), date: 'Today', description: 'Month End Adjustment', totaldebit: '$' + (500 + i * 100), totalcredit: '$' + (500 + i * 100), status: statuses[i] };
      }),
  },
  "/finance/accounting/ledger": {
    ui: 5,
    title: "General Ledger", description: "Master record of all accounts and their respective balances.",
    stats: [{ label: "Active Accounts", color: "text-blue-400", value: "340" }, { label: "Total Assets", color: "text-emerald-400", value: "$4.5M" }, { label: "Total Liabilities", color: "text-amber-400", value: "$1.2M" }],
    columns: [["Account Code", "accountcode"], ["Account Name", "accountname"], ["Type", "type"], ["Debit Balance", "debitbalance"], ["Credit Balance", "creditbalance"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
        return { accountcode: 'ACT-' + (100 + i), accountname: 'Account ' + (1 + i), type: types[i], debitbalance: i % 2 === 0 ? ('$' + (10000 + i * 2000)) : '$0', creditbalance: i % 2 !== 0 ? ('$' + (10000 + i * 2000)) : '$0', status: 'Active' };
      }),
  },
  "/finance/accounting/opening": {
    ui: 5,
    title: "Opening Balances", description: "Initial balances brought forward at the start of the financial year.",
    stats: [{ label: "FY 2026-27 Set", color: "text-emerald-400", value: "Yes" }, { label: "Pending Reconciliations", color: "text-emerald-400", value: "0" }, { label: "Total Accounts Set", color: "text-blue-400", value: "340" }],
    columns: [["Account Code", "accountcode"], ["Account Name", "accountname"], ["Previous Year Close", "previousyearclose"], ["Opening Debit", "openingdebit"], ["Opening Credit", "openingcredit"]],
    badge: ["Status", "status", {"Finalized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { accountcode: 'ACT-' + (100 + i), accountname: 'Account ' + (1 + i), previousyearclose: '$' + (10000 + i * 2000), openingdebit: i % 2 === 0 ? ('$' + (10000 + i * 2000)) : '$0', openingcredit: i % 2 !== 0 ? ('$' + (10000 + i * 2000)) : '$0', status: 'Finalized' };
      }),
  },
  "/finance/accounting/trial-balance": {
    ui: 5,
    title: "Trial Balance", description: "Summary of all ledger balances to ensure debits equal credits.",
    stats: [{ label: "Total Debits", color: "text-blue-400", value: "$5.4M" }, { label: "Total Credits", color: "text-emerald-400", value: "$5.4M" }, { label: "Difference", color: "text-emerald-400", value: "$0" }],
    columns: [["Account Code", "accountcode"], ["Account Name", "accountname"], ["Debit Amount", "debitamount"], ["Credit Amount", "creditamount"], ["Net Balance", "netbalance"]],
    badge: ["Status", "status", {"Balanced":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { accountcode: 'ACT-' + (100 + i), accountname: 'Account ' + (1 + i), debitamount: i % 2 === 0 ? ('$' + (10000 + i * 2000)) : '$0', creditamount: i % 2 !== 0 ? ('$' + (10000 + i * 2000)) : '$0', netbalance: '$' + (10000 + i * 2000), status: 'Balanced' };
      }),
  },
  "/finance/analytics/collection": {
    ui: 5,
    title: "Collection Analytics", description: "Deep dive into payment modes, counter efficiency, and AR recovery rates.",
    stats: [{ label: "Digital Payments %", color: "text-emerald-400", value: "65%" }, { label: "Cash Handling Risk", color: "text-emerald-400", value: "Low" }, { label: "Total Collections (Mo)", color: "text-blue-400", value: "$4.1M" }],
    columns: [["Counter/Mode", "countermode"], ["Collection Volume", "collectionvolume"], ["Collection %", "collection"], ["Avg Transaction", "avgtransaction"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 4 }).map((_, i) => {
        const modes = ['Credit/Debit Card', 'UPI/Wallets', 'Cash', 'Bank Transfer (B2B)'];
        const percentages = ['45%', '20%', '15%', '20%'];
        return { countermode: modes[i], collectionvolume: '$' + (1800000 - i * 400000), collection: percentages[i], avgtransaction: '$' + (150 + i * 50), status: 'Analyzed' };
      }),
  },
  "/finance/analytics/insurance": {
    ui: 5,
    title: "Insurance Analytics", description: "Evaluating TPA performance, rejection rates, and payment TATs.",
    stats: [{ label: "Avg Approval Rate", color: "text-emerald-400", value: "94%" }, { label: "Fastest Payer", color: "text-blue-400", value: "Allianz (15D)" }, { label: "Highest Rejections", color: "text-red-400", value: "Bupa (8%)" }],
    columns: [["Provider", "provider"], ["Total Claims", "totalclaims"], ["Approval Rate", "approvalrate"], ["Rejection Rate", "rejectionrate"], ["Avg Payment TAT", "avgpaymenttat"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const providers = ['Allianz', 'Cigna', 'Aetna', 'Bupa', 'MediAssist'];
        const approvals = ['98%', '95%', '92%', '85%', '94%'];
        const tats = ['15 Days', '22 Days', '30 Days', '45 Days', '20 Days'];
        return { provider: providers[i], totalclaims: (1500 - i * 200).toString(), approvalrate: approvals[i], rejectionrate: (2 + i) + '%', avgpaymenttat: tats[i], status: 'Analyzed' };
      }),
  },
  "/finance/analytics/kpis": {
    ui: 5,
    title: "Financial KPIs", description: "Core metric tracking: EBITDA, Current Ratio, Days in AR, Debt to Equity.",
    stats: [{ label: "Days in AR", color: "text-emerald-400", value: "42 Days" }, { label: "EBITDA Margin", color: "text-blue-400", value: "22%" }, { label: "Operating Margin", color: "text-emerald-400", value: "15%" }],
    columns: [["KPI Name", "kpiname"], ["Current Value", "currentvalue"], ["Industry Benchmark", "industrybenchmark"], ["Health Status", "healthstatus"]],
    badge: ["Status", "status", {"On Track":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const kpis = ['Days in Accounts Receivable', 'Current Ratio', 'Debt-to-Equity Ratio', 'Operating Profit Margin', 'Return on Assets (ROA)'];
        const values = ['42 Days', '1.8', '0.5', '15%', '8%'];
        const benchmarks = ['< 50 Days', '> 1.5', '< 1.0', '> 10%', '> 5%'];
        return { kpiname: kpis[i], currentvalue: values[i], industrybenchmark: benchmarks[i], healthstatus: 'Strong', status: 'On Track' };
      }),
  },
  "/finance/analytics/profitability": {
    ui: 5,
    title: "Profitability Analysis", description: "Identifying margins at the department, service, and doctor levels.",
    stats: [{ label: "Most Profitable Dept", color: "text-emerald-400", value: "Cardiology (35%)" }, { label: "Hospital Net Margin", color: "text-blue-400", value: "18.4%" }, { label: "Loss Making Units", color: "text-emerald-400", value: "0" }],
    columns: [["Analysis Entity", "analysisentity"], ["Gross Margin", "grossmargin"], ["Net Margin", "netmargin"], ["Contribution %", "contribution"]],
    badge: ["Status", "status", {"Highly Profitable":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const entities = ['Cardiology Dept', 'Orthopedics Dept', 'Pharmacy', 'Laboratory', 'Radiology'];
        const nets = ['35%', '28%', '45%', '55%', '65%'];
        return { analysisentity: entities[i], grossmargin: (40 + i * 5) + '%', netmargin: nets[i], contribution: (20 - i * 2) + '%', status: 'Highly Profitable' };
      }),
  },
  "/finance/analytics/revenue": {
    ui: 5,
    title: "Revenue Dashboard", description: "Executive BI dashboard visualizing revenue streams and growth.",
    stats: [{ label: "Gross Revenue (YTD)", color: "text-emerald-400", value: "$24.5M" }, { label: "Growth YoY", color: "text-emerald-400", value: "+12.4%" }, { label: "EBITDA Margin", color: "text-blue-400", value: "22%" }],
    columns: [["Metric", "metric"], ["Current Period", "currentperiod"], ["Target", "target"], ["Variance", "variance"]],
    badge: ["Status", "status", {"On Track":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['Total Gross Revenue', 'Net Revenue', 'OPD Contribution', 'IPD Contribution', 'Avg Revenue Per Bed'];
        const currents = ['$4.5M', '$4.2M', '32%', '68%', '$450/day'];
        const targets = ['$4.2M', '$4.0M', '30%', '70%', '$400/day'];
        return { metric: metrics[i], currentperiod: currents[i], target: targets[i], variance: 'Positive', status: 'On Track' };
      }),
  },
  "/finance/ap/approval": {
    ui: 5,
    title: "Payment Approval", description: "Management workflow for approving large vendor payments.",
    stats: [{ label: "Pending Approval", color: "text-amber-400", value: "12" }, { label: "Value Pending", color: "text-amber-400", value: "$85,000" }, { label: "Approved Today", color: "text-emerald-400", value: "5" }],
    columns: [["Payment ID", "paymentid"], ["Vendor", "vendor"], ["Amount", "amount"], ["Requested By", "requestedby"], ["Due Date", "duedate"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Approved":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Approved', 'Rejected'];
        return { paymentid: 'PMT-' + (3001 + i), vendor: 'Vendor ' + (1 + i), amount: '$' + (5000 + i * 2000), requestedby: 'Finance Mgr', duedate: 'Today', status: statuses[i] };
      }),
  },
  "/finance/ap/bills": {
    ui: 5,
    title: "Vendor Bills", description: "Logging of all incoming vendor bills and non-PO invoices.",
    stats: [{ label: "Total Bills Logged", color: "text-blue-400", value: "145" }, { label: "Pending Approval", color: "text-amber-400", value: "24" }, { label: "Value Pending", color: "text-amber-400", value: "$12,400" }],
    columns: [["Bill No", "billno"], ["Vendor", "vendor"], ["Bill Date", "billdate"], ["Due Date", "duedate"], ["Total Amount", "totalamount"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Approved":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Rejected', 'Approved'];
        return { billno: 'VBL-' + (1001 + i), vendor: 'Vendor ' + (1 + i), billdate: '0' + (1 + i) + ' Jul 2026', duedate: (15 + i) + ' Jul 2026', totalamount: '$' + (500 + i * 100), status: statuses[i] };
      }),
  },
  "/finance/ap/invoices": {
    ui: 5,
    title: "Purchase Invoices", description: "Invoices directly linked to and matched with POs and GRNs.",
    stats: [{ label: "Invoices Matched", color: "text-emerald-400", value: "85" }, { label: "Variance Pending", color: "text-red-400", value: "3" }, { label: "Ready for Payment", color: "text-blue-400", value: "45" }],
    columns: [["Invoice No", "invoiceno"], ["PO/GRN Ref", "pogrnref"], ["Vendor", "vendor"], ["Invoice Value", "invoicevalue"], ["Matched Value", "matchedvalue"]],
    badge: ["Status", "status", {"Matched":"emerald","Variance Detected":"red","Pending GRN":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Matched', 'Variance Detected', 'Matched', 'Matched', 'Pending GRN'];
        return { invoiceno: 'INV-' + (2001 + i), pogrnref: 'PO-' + (9988 + i), vendor: 'Supplier ' + (1 + i), invoicevalue: '$' + (1000 + i * 500), matchedvalue: statuses[i] === 'Variance Detected' ? '$950' : '$' + (1000 + i * 500), status: statuses[i] };
      }),
  },
  "/finance/ap/payments": {
    ui: 5,
    title: "Vendor Payments", description: "Execution and recording of payments made to vendors.",
    stats: [{ label: "Payments Today", color: "text-emerald-400", value: "$14,500" }, { label: "Transactions", color: "text-blue-400", value: "24" }, { label: "Failed Txns", color: "text-emerald-400", value: "0" }],
    columns: [["Transaction ID", "transactionid"], ["Vendor", "vendor"], ["Date", "date"], ["Amount Paid", "amountpaid"], ["Payment Mode", "paymentmode"]],
    badge: ["Status", "status", {"Success":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { transactionid: 'TXN-' + (4001 + i), vendor: 'Vendor ' + (1 + i), date: 'Today', amountpaid: '$' + (1000 + i * 500), paymentmode: 'Bank Transfer', status: 'Success' };
      }),
  },
  "/finance/ar/collection": {
    ui: 5,
    title: "Collection Follow-up", description: "Task management for finance staff to call and recover debts.",
    stats: [{ label: "Calls to Make", color: "text-amber-400", value: "45" }, { label: "Promises to Pay", color: "text-blue-400", value: "12" }, { label: "Recovered Today", color: "text-emerald-400", value: "$8,400" }],
    columns: [["Task ID", "taskid"], ["Debtor Name", "debtorname"], ["Type", "type"], ["Amount Due", "amountdue"], ["Last Note", "lastnote"]],
    badge: ["Status", "status", {"Pending Call":"amber","Promised to Pay":"amber","Unreachable":"red","Paid":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Call', 'Promised to Pay', 'Unreachable', 'Pending Call', 'Paid'];
        return { taskid: 'TSK-' + (1001 + i), debtorname: 'Debtor ' + (i + 1), type: i % 2 === 0 ? 'Patient' : 'Corporate', amountdue: '$' + (1000 + i * 500), lastnote: 'Will pay next week', status: statuses[i] };
      }),
  },
  "/finance/ar/corporate": {
    ui: 5,
    title: "Corporate Receivables", description: "Unpaid invoices from corporate tie-ups and partner organizations.",
    stats: [{ label: "Total Corporate AR", color: "text-red-400", value: "$850,000" }, { label: "Overdue Companies", color: "text-amber-400", value: "12" }, { label: "Payments Expected", color: "text-blue-400", value: "$150K" }],
    columns: [["Corporate Name", "corporatename"], ["Total Invoices Pending", "totalinvoicespending"], ["Oldest Invoice", "oldestinvoice"], ["Total AR", "totalar"], ["Account Manager", "accountmanager"]],
    badge: ["Status", "status", {"Payment Expected":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { corporatename: 'Company ' + (i + 1), totalinvoicespending: (5 + i).toString(), oldestinvoice: (45 + i * 10) + ' Days', totalar: '$' + (45000 - i * 5000), accountmanager: 'Sales Team', status: 'Payment Expected' };
      }),
  },
  "/finance/assets/capitalization": {
    ui: 5,
    title: "Asset Capitalization", description: "Converting project expenses (e.g., building a new ward) into fixed assets.",
    stats: [{ label: "Active WIP Projects", color: "text-blue-400", value: "3" }, { label: "Capitalized (YTD)", color: "text-emerald-400", value: "$1.2M" }, { label: "Pending Cap.", color: "text-amber-400", value: "$450K" }],
    columns: [["Project ID", "projectid"], ["Project Name", "projectname"], ["Total Expenses", "totalexpenses"], ["Capitalized Value", "capitalizedvalue"], ["Date", "date"]],
    badge: ["Status", "status", {"Capitalized":"emerald","WIP":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Capitalized', 'WIP', 'Capitalized', 'Capitalized', 'WIP'];
        return { projectid: 'PRJ-' + (101 + i), projectname: 'New ICU Wing ' + (1 + i), totalexpenses: '$' + (500000 + i * 100000), capitalizedvalue: statuses[i] === 'WIP' ? '-' : ('$' + (500000 + i * 100000)), date: '15 Jun 2026', status: statuses[i] };
      }),
  },
  "/finance/assets/depreciation": {
    ui: 5,
    title: "Asset Depreciation", description: "Calculation and posting of monthly/annual depreciation entries.",
    stats: [{ label: "Depreciation (YTD)", color: "text-red-400", value: "$450K" }, { label: "Entries Posted", color: "text-emerald-400", value: "12/12" }, { label: "Next Run", color: "text-gray-400", value: "31 Jul" }],
    columns: [["Period", "period"], ["Asset Category", "assetcategory"], ["Depreciation Method", "depreciationmethod"], ["Depreciation Amount", "depreciationamount"], ["Posted Status", "postedstatus"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['Medical Equipment', 'IT Equipment', 'Furniture', 'Vehicles', 'Buildings'];
        return { period: 'June 2026', assetcategory: cats[i], depreciationmethod: 'Straight Line', depreciationamount: '$' + (15000 - i * 2000), postedstatus: 'Posted', status: 'Completed' };
      }),
  },
  "/finance/assets/disposal": {
    ui: 5,
    title: "Asset Disposal", description: "Financial accounting for scrapped, sold, or lost assets (gain/loss calculation).",
    stats: [{ label: "Assets Disposed (Mo)", color: "text-gray-400", value: "5" }, { label: "Net Loss on Sale", color: "text-red-400", value: "$2,400" }, { label: "Value Recovered", color: "text-emerald-400", value: "$15K" }],
    columns: [["Disposal ID", "disposalid"], ["Asset Name", "assetname"], ["Net Book Value", "netbookvalue"], ["Sale/Scrap Value", "salescrapvalue"], ["Gain/Loss", "gainloss"]],
    badge: ["Status", "status", {"Posted":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { disposalid: 'DSP-' + (2001 + i), assetname: 'Old Server ' + (1 + i), netbookvalue: '$' + (5000 - i * 500), salescrapvalue: '$' + (1000 - i * 100), gainloss: '-$' + (4000 - i * 400), status: 'Posted' };
      }),
  },
  "/finance/assets/register": {
    ui: 5,
    title: "Asset Register", description: "Financial view of hospital capital assets, distinct from physical inventory.",
    stats: [{ label: "Total Asset Value", color: "text-blue-400", value: "$8.5M" }, { label: "Net Book Value", color: "text-emerald-400", value: "$5.2M" }, { label: "Assets Added (Mo)", color: "text-amber-400", value: "$120K" }],
    columns: [["Asset ID", "assetid"], ["Asset Name", "assetname"], ["Purchase Value", "purchasevalue"], ["Accumulated Dep.", "accumulateddep"], ["Net Book Value", "netbookvalue"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { assetid: 'FA-' + (1001 + i), assetname: 'MRI Machine ' + (1 + i), purchasevalue: '$' + (1500000 - i * 100000), accumulateddep: '$' + (500000 - i * 50000), netbookvalue: '$' + (1000000 - i * 50000), status: 'Active' };
      }),
  },
  "/finance/audit/approval": {
    ui: 5,
    title: "Approval History", description: "Traceability of who approved large payments, discounts, or credit limits.",
    stats: [{ label: "Approvals (Today)", color: "text-blue-400", value: "45" }, { label: "Avg Approval Time", color: "text-emerald-400", value: "4.5 Hrs" }, { label: "Rejections", color: "text-gray-400", value: "4" }],
    columns: [["Req ID", "reqid"], ["Request Type", "requesttype"], ["Requested By", "requestedby"], ["Approved By", "approvedby"], ["Timestamp", "timestamp"]],
    badge: ["Status", "status", {"Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Vendor Payment', 'High Discount', 'Credit Limit', 'Asset Disposal', 'Refund'];
        return { reqid: 'REQ-' + (5001 + i), requesttype: types[i], requestedby: 'User A', approvedby: 'Finance Head', timestamp: 'Yesterday', status: 'Approved' };
      }),
  },
  "/finance/audit/financial": {
    ui: 5,
    title: "Financial Audit", description: "Tools for internal auditors to sample and verify financial statements.",
    stats: [{ label: "Open Audits", color: "text-amber-400", value: "2" }, { label: "Completed (YTD)", color: "text-emerald-400", value: "4" }, { label: "Major Non-Compliances", color: "text-emerald-400", value: "0" }],
    columns: [["Audit ID", "auditid"], ["Period", "period"], ["Area Audited", "areaaudited"], ["Findings Logged", "findingslogged"], ["Auditor", "auditor"]],
    badge: ["Status", "status", {"In Progress":"gray","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const areas = ['Q1 Revenue', 'Pharmacy Inventory', 'Payroll', 'Fixed Assets', 'Cash Handling'];
        const statuses = ['In Progress', 'Completed', 'Completed', 'Completed', 'Completed'];
        return { auditid: 'AUD-' + (1001 + i), period: 'Q1 2026', areaaudited: areas[i], findingslogged: (i).toString(), auditor: 'Internal Team', status: statuses[i] };
      }),
  },
  "/finance/audit/logs": {
    ui: 5,
    title: "Audit Logs", description: "Immutable ledger of every single financial action performed in the system.",
    stats: [{ label: "Logs (Today)", color: "text-blue-400", value: "14,500" }, { label: "Critical Actions", color: "text-amber-400", value: "45" }, { label: "Failed Logins", color: "text-red-400", value: "2" }],
    columns: [["Timestamp", "timestamp"], ["User", "user"], ["Action", "action"], ["Module", "module"], ["Record ID", "recordid"]],
    badge: ["Status", "status", {"Logged":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { timestamp: 'Today 10:' + (10 + i) + ' AM', user: 'Admin', action: 'Update Record', module: 'Billing', recordid: 'BIL-100' + i, status: 'Logged' };
      }),
  },
  "/finance/audit/transaction": {
    ui: 5,
    title: "Transaction Audit", description: "Flagging anomalous transactions (e.g., deleted bills, unusually high discounts).",
    stats: [{ label: "Anomalies Flagged", color: "text-red-400", value: "12" }, { label: "Reviewed", color: "text-emerald-400", value: "8" }, { label: "Pending Review", color: "text-amber-400", value: "4" }],
    columns: [["Txn ID", "txnid"], ["Type", "type"], ["Amount", "amount"], ["Flag Reason", "flagreason"], ["User", "user"]],
    badge: ["Status", "status", {"Pending Review":"amber","Cleared":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const reasons = ['High Discount', 'Bill Deleted', 'Backdated Entry', 'High Refund', 'Duplicate Entry'];
        const statuses = ['Pending Review', 'Cleared', 'Pending Review', 'Cleared', 'Cleared'];
        return { txnid: 'TXN-' + (9900 + i), type: 'Invoice', amount: '$' + (1500 + i * 500), flagreason: reasons[i], user: 'User ' + (1 + i), status: statuses[i] };
      }),
  },
  "/finance/banking/accounts": {
    ui: 5,
    title: "Bank Accounts", description: "Management of all hospital bank accounts and their current balances.",
    stats: [{ label: "Total Bank Balance", color: "text-emerald-400", value: "$1.4M" }, { label: "Active Accounts", color: "text-blue-400", value: "6" }, { label: "Pending Recon", color: "text-amber-400", value: "1" }],
    columns: [["Bank Name", "bankname"], ["Account No", "accountno"], ["Account Type", "accounttype"], ["Current Balance", "currentbalance"], ["Last Reconciled", "lastreconciled"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Current', 'Current', 'Savings', 'Fixed Deposit', 'Current'];
        return { bankname: 'Bank ' + (1 + i), accountno: 'XXXX-XXXX-' + (1000 + i), accounttype: types[i], currentbalance: '$' + (250000 - i * 40000), lastreconciled: 'Yesterday', status: 'Active' };
      }),
  },
  "/finance/banking/deposits": {
    ui: 5,
    title: "Bank Deposits", description: "Records of cash, cheque, and DD deposits made to the bank.",
    stats: [{ label: "Deposited Today", color: "text-emerald-400", value: "$45,000" }, { label: "Pending Clearance", color: "text-amber-400", value: "$12,000" }, { label: "Bounced Cheques", color: "text-emerald-400", value: "0" }],
    columns: [["Deposit ID", "depositid"], ["Date", "date"], ["Type", "type"], ["Amount", "amount"], ["Bank", "bank"]],
    badge: ["Status", "status", {"Cleared":"emerald","Pending Clearance":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Cash', 'Cheque', 'Cheque', 'DD', 'Cash'];
        const statuses = ['Cleared', 'Pending Clearance', 'Cleared', 'Cleared', 'Cleared'];
        return { depositid: 'BDP-' + (1001 + i), date: 'Today', type: types[i], amount: '$' + (5000 + i * 1000), bank: 'National Bank', status: statuses[i] };
      }),
  },
  "/finance/banking/payments": {
    ui: 5,
    title: "Bank Payments", description: "Outward payments made via NEFT, RTGS, or Cheque.",
    stats: [{ label: "Payments Today", color: "text-emerald-400", value: "$14,500" }, { label: "Failed Payments", color: "text-red-400", value: "1" }, { label: "Pending Approvals", color: "text-amber-400", value: "4" }],
    columns: [["Payment ID", "paymentid"], ["Date", "date"], ["Payee", "payee"], ["Amount", "amount"], ["Mode", "mode"]],
    badge: ["Status", "status", {"Success":"emerald","Pending Auth":"amber","Failed":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Success', 'Pending Auth', 'Success', 'Failed', 'Success'];
        return { paymentid: 'BPM-' + (2001 + i), date: 'Today', payee: 'Vendor ' + (1 + i), amount: '$' + (1000 + i * 500), mode: 'NEFT', status: statuses[i] };
      }),
  },
  "/finance/banking/reconciliation": {
    ui: 5,
    title: "Bank Reconciliation", description: "Matching system entries with actual bank statements (BRS).",
    stats: [{ label: "Pending Recons", color: "text-amber-400", value: "2" }, { label: "Completed (Mo)", color: "text-emerald-400", value: "14" }, { label: "Unreconciled Value", color: "text-red-400", value: "$450" }],
    columns: [["Recon ID", "reconid"], ["Bank Account", "bankaccount"], ["Statement Date", "statementdate"], ["Sys Balance", "sysbalance"], ["Bank Balance", "bankbalance"]],
    badge: ["Status", "status", {"Reconciled":"gray","Pending":"gray","Variance Found":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Reconciled', 'Pending', 'Variance Found', 'Reconciled', 'Reconciled'];
        return { reconid: 'BRC-' + (4001 + i), bankaccount: 'Bank ' + (1 + i), statementdate: '30 Jun 2026', sysbalance: '$' + (100000 + i * 10000), bankbalance: statuses[i] === 'Variance Found' ? '$' + (99000 + i * 10000) : '$' + (100000 + i * 10000), status: statuses[i] };
      }),
  },
  "/finance/banking/transfers": {
    ui: 5,
    title: "Bank Transfers", description: "Internal fund transfers between different hospital bank accounts.",
    stats: [{ label: "Transfers (Mo)", color: "text-blue-400", value: "12" }, { label: "Total Value", color: "text-emerald-400", value: "$450,000" }, { label: "Pending", color: "text-emerald-400", value: "0" }],
    columns: [["Transfer ID", "transferid"], ["Date", "date"], ["From Account", "fromaccount"], ["To Account", "toaccount"], ["Amount", "amount"]],
    badge: ["Status", "status", {"Success":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { transferid: 'BTR-' + (3001 + i), date: '0' + (1 + i) + ' Jul 2026', fromaccount: 'Bank 1', toaccount: 'Bank 2', amount: '$' + (50000 + i * 10000), status: 'Success' };
      }),
  },
  "/finance/billing/corporate": {
    ui: 5,
    title: "Corporate Billing", description: "Consolidated invoices sent to corporate partners and organizations.",
    stats: [{ label: "Corporate Revenue (Mo)", color: "text-emerald-400", value: "$120,000" }, { label: "Invoices Generated", color: "text-blue-400", value: "14" }, { label: "Overdue Payments", color: "text-red-400", value: "$15,000" }],
    columns: [["Invoice No", "invoiceno"], ["Corporate Name", "corporatename"], ["Employees Treated", "employeestreated"], ["Period", "period"], ["Total Invoice Amount", "totalinvoiceamount"]],
    badge: ["Status", "status", {"Sent":"blue","Paid":"emerald","Overdue":"red","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Sent', 'Paid', 'Overdue', 'Paid', 'Draft'];
        return { invoiceno: 'CRP-' + (9001 + i), corporatename: 'Company ' + (i + 1), employeestreated: (45 + i * 10).toString(), period: 'June 2026', totalinvoiceamount: '$' + (15000 + i * 2500), status: statuses[i] };
      }),
  },
  "/finance/billing/emergency": {
    ui: 5,
    title: "Emergency Billing", description: "ER triage, trauma, and emergency procedure billing.",
    stats: [{ label: "ER Revenue Today", color: "text-emerald-400", value: "$8,400" }, { label: "ER Bills", color: "text-blue-400", value: "45" }, { label: "Unbilled ER Cases", color: "text-amber-400", value: "4" }],
    columns: [["ER No", "erno"], ["Patient Name", "patientname"], ["Triage Level", "triagelevel"], ["Time In", "timein"], ["Bill Amount", "billamount"]],
    badge: ["Status", "status", {"Paid":"emerald","Pending Approval":"amber","Waived":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Paid', 'Pending Approval', 'Paid', 'Waived', 'Paid'];
        return { erno: 'ER-' + (3001 + i), patientname: 'Patient ' + (i + 1), triagelevel: 'Level ' + ((i % 3) + 1), timein: '10:' + (10 + i) + ' AM', billamount: '$' + (200 + i * 50), status: statuses[i] };
      }),
  },
  "/finance/billing/ipd": {
    ui: 5,
    title: "IPD Billing", description: "Inpatient room, nursing, and medical procedure billing.",
    stats: [{ label: "IPD Revenue Today", color: "text-emerald-400", value: "$45,000" }, { label: "Active IPD Bills", color: "text-blue-400", value: "120" }, { label: "Discharges Pending Bill", color: "text-red-400", value: "5" }],
    columns: [["IPD No", "ipdno"], ["Patient Name", "patientname"], ["Ward/Bed", "wardbed"], ["Admission Date", "admissiondate"], ["Current Bill", "currentbill"], ["Advance Paid", "advancepaid"]],
    badge: ["Status", "status", {"Active":"emerald","Discharged (Unpaid)":"red","Settled":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active', 'Discharged (Unpaid)', 'Active', 'Settled', 'Active'];
        return { ipdno: 'IPD-' + (2001 + i), patientname: 'Patient ' + (i + 1), wardbed: 'Ward A / Bed ' + i, admissiondate: '0' + (1 + i) + ' Jul 2026', currentbill: '$' + (1500 + i * 500), advancepaid: '$' + (500 + i * 100), status: statuses[i] };
      }),
  },
  "/finance/billing/laboratory": {
    ui: 5,
    title: "Laboratory Billing", description: "Billing for pathology, biochemistry, and microbiology tests.",
    stats: [{ label: "Lab Revenue", color: "text-emerald-400", value: "$9,200" }, { label: "Lab Bills", color: "text-blue-400", value: "320" }, { label: "Corporate Tie-ups", color: "text-gray-400", value: "$1,500" }],
    columns: [["Lab Bill No", "labbillno"], ["Patient Name", "patientname"], ["Tests Ordered", "testsordered"], ["Referring Doctor", "referringdoctor"], ["Amount", "amount"]],
    badge: ["Status", "status", {"Paid":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { labbillno: 'LAB-' + (5001 + i), patientname: 'Patient ' + (i + 1), testsordered: (2 + i).toString(), referringdoctor: 'Dr. Jones', amount: '$' + (80 + i * 20), status: 'Paid' };
      }),
  },
  "/finance/billing/opd": {
    ui: 5,
    title: "OPD Billing", description: "Outpatient consultation and service billing.",
    stats: [{ label: "OPD Revenue Today", color: "text-emerald-400", value: "$12,450" }, { label: "Bills Generated", color: "text-blue-400", value: "450" }, { label: "Pending Dues", color: "text-amber-400", value: "$300" }],
    columns: [["Bill No", "billno"], ["Patient Name", "patientname"], ["Consultant", "consultant"], ["Services", "services"], ["Total Amount", "totalamount"], ["Payment Mode", "paymentmode"]],
    badge: ["Status", "status", {"Paid":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Paid', 'Pending', 'Paid', 'Paid', 'Paid'];
        return { billno: 'OPD-' + (1001 + i), patientname: 'Patient ' + (i + 1), consultant: 'Dr. Smith', services: 'Consultation', totalamount: '$' + (50 + i * 10), paymentmode: statuses[i] === 'Paid' ? 'Card' : '-', status: statuses[i] };
      }),
  },
  "/finance/billing/package": {
    ui: 5,
    title: "Package Billing", description: "Fixed-cost packages (e.g., Maternity, Cardiac surgeries).",
    stats: [{ label: "Package Revenue", color: "text-emerald-400", value: "$85,000" }, { label: "Active Packages", color: "text-blue-400", value: "24" }, { label: "Exclusions Billed", color: "text-amber-400", value: "$4,500" }],
    columns: [["Package Bill No", "packagebillno"], ["Patient Name", "patientname"], ["Package Name", "packagename"], ["Inclusions", "inclusions"], ["Total Package Cost", "totalpackagecost"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const packages = ['Normal Delivery', 'C-Section', 'CABG', 'Knee Replacement', 'Cataract'];
        return { packagebillno: 'PKG-' + (8001 + i), patientname: 'Patient ' + (i + 1), packagename: packages[i], inclusions: 'Room, OT, Surgeon', totalpackagecost: '$' + (2000 + i * 1000), status: 'Active' };
      }),
  },
  "/finance/billing/pharmacy": {
    ui: 5,
    title: "Pharmacy Billing", description: "Direct medicine sales to walk-ins and inpatients.",
    stats: [{ label: "Pharmacy Sales", color: "text-emerald-400", value: "$15,400" }, { label: "Transactions", color: "text-blue-400", value: "850" }, { label: "Refunds", color: "text-red-400", value: "$120" }],
    columns: [["Receipt No", "receiptno"], ["Patient/Customer", "patientcustomer"], ["Items", "items"], ["Amount", "amount"], ["Payment Mode", "paymentmode"]],
    badge: ["Status", "status", {"Paid":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { receiptno: 'PHM-' + (4001 + i), patientcustomer: 'Customer ' + (i + 1), items: (3 + i).toString(), amount: '$' + (40 + i * 15), paymentmode: i % 2 === 0 ? 'Cash' : 'Card', status: 'Paid' };
      }),
  },
  "/finance/billing/procedure": {
    ui: 5,
    title: "Procedure Billing", description: "Billing for minor surgeries, endoscopies, and day-care procedures.",
    stats: [{ label: "Procedure Revenue", color: "text-emerald-400", value: "$24,000" }, { label: "Procedures Billed", color: "text-blue-400", value: "45" }, { label: "Pending Bills", color: "text-amber-400", value: "2" }],
    columns: [["Proc Bill No", "procbillno"], ["Patient Name", "patientname"], ["Procedure", "procedure"], ["Surgeon", "surgeon"], ["Amount", "amount"]],
    badge: ["Status", "status", {"Paid":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { procbillno: 'PRC-' + (7001 + i), patientname: 'Patient ' + (i + 1), procedure: 'Endoscopy ' + i, surgeon: 'Dr. House', amount: '$' + (450 + i * 100), status: 'Paid' };
      }),
  },
  "/finance/billing/radiology": {
    ui: 5,
    title: "Radiology Billing", description: "Billing for X-rays, MRIs, CT Scans, and Ultrasounds.",
    stats: [{ label: "Radiology Revenue", color: "text-emerald-400", value: "$18,500" }, { label: "Scans Billed", color: "text-blue-400", value: "145" }, { label: "Insurance Auth Pending", color: "text-amber-400", value: "4" }],
    columns: [["Rad Bill No", "radbillno"], ["Patient Name", "patientname"], ["Scan Type", "scantype"], ["Scan Date", "scandate"], ["Amount", "amount"]],
    badge: ["Status", "status", {"Paid":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const scans = ['MRI Brain', 'CT Chest', 'X-Ray Knee', 'USG Abdomen', 'MRI Spine'];
        return { radbillno: 'RAD-' + (6001 + i), patientname: 'Patient ' + (i + 1), scantype: scans[i], scandate: 'Today', amount: '$' + (300 - i * 50), status: 'Paid' };
      }),
  },
  "/finance/cash/advance": {
    ui: 5,
    title: "Advance Collection", description: "Deposits taken prior to IPD admission or major procedures.",
    stats: [{ label: "Advances Today", color: "text-emerald-400", value: "$24,000" }, { label: "Count", color: "text-blue-400", value: "45" }, { label: "Refunds Pending", color: "text-amber-400", value: "3" }],
    columns: [["Advance ID", "advanceid"], ["Patient Name", "patientname"], ["IPD No / Ref", "ipdnoref"], ["Amount", "amount"], ["Date", "date"]],
    badge: ["Status", "status", {"Active":"emerald","Adjusted":"blue","Refunded":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active', 'Adjusted', 'Active', 'Refunded', 'Active'];
        return { advanceid: 'ADV-' + (2001 + i), patientname: 'Patient ' + (i + 1), ipdnoref: 'IPD-' + (2001 + i), amount: '$' + (500 + i * 100), date: 'Today', status: statuses[i] };
      }),
  },
  "/finance/cash/book": {
    ui: 5,
    title: "Cash Book", description: "Ledger tracking all petty cash and cash drawer inflows and outflows.",
    stats: [{ label: "Opening Balance", color: "text-blue-400", value: "$2,500" }, { label: "Petty Cash Expenses", color: "text-amber-400", value: "$450" }, { label: "Closing Balance", color: "text-emerald-400", value: "$2,050" }],
    columns: [["Date", "date"], ["Voucher No", "voucherno"], ["Particulars", "particulars"], ["Cash In", "cashin"], ["Cash Out", "cashout"], ["Balance", "balance"]],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { date: 'Today', voucherno: 'VCH-' + (6001 + i), particulars: i % 2 === 0 ? 'Stationery Purchase' : 'Misc Income', cashin: i % 2 !== 0 ? '$100' : '-', cashout: i % 2 === 0 ? '$50' : '-', balance: '$' + (2000 + i * 25) };
      }),
  },
  "/finance/cash/collection": {
    ui: 5,
    title: "Cash Collection", description: "Dashboard tracking daily cash, card, and UPI collections across all counters.",
    stats: [{ label: "Total Collected Today", color: "text-emerald-400", value: "$84,500" }, { label: "Cash Component", color: "text-blue-400", value: "$24,000" }, { label: "Shortages", color: "text-emerald-400", value: "$0" }],
    columns: [["Counter", "counter"], ["Cashier", "cashier"], ["Cash", "cash"], ["Card", "card"], ["UPI/Digital", "upidigital"], ["Total Collected", "totalcollected"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const counters = ['OPD Counter 1', 'OPD Counter 2', 'IPD Billing', 'Pharmacy', 'ER Counter'];
        return { counter: counters[i], cashier: 'Cashier ' + (1 + i), cash: '$' + (2000 + i * 500), card: '$' + (5000 + i * 1000), upidigital: '$' + (3000 + i * 400), totalcollected: '$' + (10000 + i * 1900), status: 'Active' };
      }),
  },
  "/finance/cash/deposit": {
    ui: 5,
    title: "Bank Deposit Management", description: "Logging the handover of physical cash to the bank.",
    stats: [{ label: "Cash In Hand", color: "text-amber-400", value: "$14,500" }, { label: "Deposited Today", color: "text-emerald-400", value: "$45,000" }, { label: "Variances", color: "text-emerald-400", value: "$0" }],
    columns: [["Deposit ID", "depositid"], ["Date", "date"], ["Amount", "amount"], ["Bank", "bank"], ["Deposited By", "depositedby"]],
    badge: ["Status", "status", {"Cleared":"emerald","Pending Recon":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Cleared', 'Pending Recon', 'Cleared', 'Cleared', 'Cleared'];
        return { depositid: 'DEP-' + (4001 + i), date: '0' + (1 + i) + ' Jul 2026', amount: '$' + (10000 + i * 2000), bank: 'National Bank', depositedby: 'Head Cashier', status: statuses[i] };
      }),
  },
  "/finance/cash/receipt": {
    ui: 5,
    title: "Receipt Entry", description: "Manual generation of receipts for miscellaneous hospital income.",
    stats: [{ label: "Misc Receipts Today", color: "text-blue-400", value: "$1,200" }, { label: "Count", color: "text-gray-400", value: "15" }, { label: "Cancellations", color: "text-emerald-400", value: "0" }],
    columns: [["Receipt No", "receiptno"], ["Received From", "receivedfrom"], ["Towards", "towards"], ["Amount", "amount"], ["Mode", "mode"]],
    badge: ["Status", "status", {"Issued":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const towards = ['Cafeteria Lease', 'Scrap Sale', 'Medical Report Fee', 'Parking Contract', 'Ambulance Fee'];
        return { receiptno: 'REC-' + (1001 + i), receivedfrom: 'Person/Vendor ' + (i + 1), towards: towards[i], amount: '$' + (100 + i * 50), mode: 'Cash', status: 'Issued' };
      }),
  },
  "/finance/cash/refund": {
    ui: 5,
    title: "Refund Management", description: "Processing refunds for cancelled services or excess advance payments.",
    stats: [{ label: "Refunds Processed", color: "text-blue-400", value: "$1,200" }, { label: "Pending Approval", color: "text-amber-400", value: "4" }, { label: "Rejected", color: "text-red-400", value: "1" }],
    columns: [["Refund ID", "refundid"], ["Patient Name", "patientname"], ["Original Receipt", "originalreceipt"], ["Refund Amount", "refundamount"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Processed":"gray","Pending Auth":"amber","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Processed', 'Pending Auth', 'Processed', 'Rejected', 'Processed'];
        return { refundid: 'RFD-' + (3001 + i), patientname: 'Patient ' + (i + 1), originalreceipt: 'REC-' + (1000 + i), refundamount: '$' + (50 + i * 20), reason: 'Excess Advance', status: statuses[i] };
      }),
  },
  "/finance/cash/shift": {
    ui: 5,
    title: "Shift Closing", description: "End-of-shift reconciliation for cashiers before handover.",
    stats: [{ label: "Active Shifts", color: "text-blue-400", value: "5" }, { label: "Closed Successfully", color: "text-emerald-400", value: "12" }, { label: "Unresolved Variances", color: "text-red-400", value: "1" }],
    columns: [["Shift ID", "shiftid"], ["Cashier", "cashier"], ["System Total", "systemtotal"], ["Physical Cash", "physicalcash"], ["Variance", "variance"]],
    badge: ["Status", "status", {"Closed":"emerald","Variance Logged":"red","Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Closed', 'Closed', 'Variance Logged', 'Closed', 'Active'];
        return { shiftid: 'SHF-' + (5001 + i), cashier: 'Cashier ' + (i + 1), systemtotal: '$' + (5000 + i * 1000), physicalcash: statuses[i] === 'Variance Logged' ? '$' + (4950 + i * 1000) : '$' + (5000 + i * 1000), variance: statuses[i] === 'Variance Logged' ? '-$50' : '$0', status: statuses[i] };
      }),
  },
  "/finance/insurance/approval": {
    ui: 5,
    title: "Cashless Approval", description: "Tracking fully approved cashless patients currently admitted.",
    stats: [{ label: "Active Cashless IPD", color: "text-blue-400", value: "45" }, { label: "Exceeding Limit Alert", color: "text-red-400", value: "4" }, { label: "Discharge Ready", color: "text-emerald-400", value: "8" }],
    columns: [["Patient ID", "patientid"], ["Name", "name"], ["Ward/Bed", "wardbed"], ["Approved Amount", "approvedamount"], ["Current Bill", "currentbill"]],
    badge: ["Status", "status", {"Within Limit":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const current = (4000 + i * 1200);
        const approved = (5000 + i * 1000);
        const statuses = current > approved ? 'Limit Exceeded' : 'Within Limit';
        return { patientid: 'PAT-' + (3001 + i), name: 'Patient ' + (i + 1), wardbed: 'Ward A / Bed ' + i, approvedamount: '$' + approved, currentbill: '$' + current, status: statuses };
      }),
  },
  "/finance/insurance/preauth": {
    ui: 5,
    title: "Pre-Authorization", description: "Sending cost estimates to insurance companies for approval prior to treatment.",
    stats: [{ label: "Awaiting Auth", color: "text-amber-400", value: "24" }, { label: "Approved (Today)", color: "text-emerald-400", value: "12" }, { label: "Denied", color: "text-red-400", value: "3" }],
    columns: [["Auth ID", "authid"], ["Patient Name", "patientname"], ["Treatment", "treatment"], ["Est. Cost", "estcost"], ["Requested On", "requestedon"]],
    badge: ["Status", "status", {"Approved":"emerald","Pending":"amber","Denied":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Approved', 'Pending', 'Denied', 'Approved', 'Pending'];
        return { authid: 'AUTH-' + (2001 + i), patientname: 'Patient ' + (i + 1), treatment: 'Knee Surgery', estcost: '$' + (8000 + i * 1000), requestedon: 'Yesterday', status: statuses[i] };
      }),
  },
  "/finance/insurance/rejection": {
    ui: 5,
    title: "Claim Rejection", description: "Handling denied claims, appeals, and transferring dues to patient accounts.",
    stats: [{ label: "Rejected (Mo)", color: "text-red-400", value: "12" }, { label: "Value Denied", color: "text-red-400", value: "$24,000" }, { label: "Appeals Won", color: "text-emerald-400", value: "4" }],
    columns: [["Claim ID", "claimid"], ["Patient Name", "patientname"], ["Provider", "provider"], ["Claim Amount", "claimamount"], ["Rejection Reason", "rejectionreason"]],
    badge: ["Status", "status", {"Under Appeal":"gray","Transferred to Patient":"blue","Closed (Written Off)":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Under Appeal', 'Transferred to Patient', 'Under Appeal', 'Closed (Written Off)', 'Transferred to Patient'];
        return { claimid: 'CLM-' + (7001 + i), patientname: 'Patient ' + (i + 1), provider: 'Bupa', claimamount: '$' + (4000 + i * 500), rejectionreason: 'Not a covered benefit', status: statuses[i] };
      }),
  },
  "/finance/insurance/settlement": {
    ui: 5,
    title: "Claim Settlement", description: "Reconciling bank payments received from insurance against original claims.",
    stats: [{ label: "Settled Today", color: "text-emerald-400", value: "$45,000" }, { label: "Avg Deduction", color: "text-amber-400", value: "4.5%" }, { label: "Pending Recon", color: "text-blue-400", value: "8" }],
    columns: [["Settlement ID", "settlementid"], ["Claim ID", "claimid"], ["Claim Amount", "claimamount"], ["Settled Amount", "settledamount"], ["Deduction", "deduction"]],
    badge: ["Status", "status", {"Reconciled":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { settlementid: 'STL-' + (6001 + i), claimid: 'CLM-' + (4001 + i), claimamount: '$' + (5000 + i * 1000), settledamount: '$' + (4800 + i * 950), deduction: '$' + (200 + i * 50), status: 'Reconciled' };
      }),
  },
  "/finance/insurance/submission": {
    ui: 5,
    title: "Claim Submission", description: "Generating and dispatching final bills to TPA/Insurance post-discharge.",
    stats: [{ label: "Ready to Submit", color: "text-amber-400", value: "18" }, { label: "Submitted (Week)", color: "text-emerald-400", value: "85" }, { label: "Pending Documents", color: "text-red-400", value: "5" }],
    columns: [["Claim ID", "claimid"], ["Patient Name", "patientname"], ["Discharge Date", "dischargedate"], ["Claim Amount", "claimamount"], ["Provider", "provider"]],
    badge: ["Status", "status", {"Submitted":"gray","Draft":"amber","Pending Docs":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Submitted', 'Draft', 'Pending Docs', 'Submitted', 'Submitted'];
        return { claimid: 'CLM-' + (4001 + i), patientname: 'Patient ' + (i + 1), dischargedate: '0' + (1 + i) + ' Jul 2026', claimamount: '$' + (6000 + i * 1000), provider: 'Allianz', status: statuses[i] };
      }),
  },
  "/finance/insurance/tpa": {
    ui: 5,
    title: "TPA Management", description: "Managing contracts, rates, and contact details for Third Party Administrators.",
    stats: [{ label: "Active TPAs", color: "text-blue-400", value: "24" }, { label: "Top TPA", color: "text-emerald-400", value: "MediAssist" }, { label: "Contract Renewals", color: "text-amber-400", value: "2" }],
    columns: [["TPA Name", "tpaname"], ["Active Contracts", "activecontracts"], ["Discount Rate", "discountrate"], ["Total Business (YTD)", "totalbusinessytd"], ["Settlement TAT", "settlementtat"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { tpaname: 'TPA Corp ' + (i + 1), activecontracts: (3 + i).toString(), discountrate: (10 + i) + '%', totalbusinessytd: '$' + (250000 - i * 20000), settlementtat: (20 + i) + ' Days', status: 'Active' };
      }),
  },
  "/finance/insurance/verification": {
    ui: 5,
    title: "Insurance Verification", description: "Verifying active policies and coverage limits for new patients.",
    stats: [{ label: "Pending Verification", color: "text-amber-400", value: "15" }, { label: "Verified Today", color: "text-emerald-400", value: "45" }, { label: "Invalid Policies", color: "text-red-400", value: "2" }],
    columns: [["Req ID", "reqid"], ["Patient Name", "patientname"], ["Provider", "provider"], ["Policy Number", "policynumber"], ["Coverage Limit", "coveragelimit"]],
    badge: ["Status", "status", {"Verified":"emerald","Pending":"amber","Invalid":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Verified', 'Pending', 'Verified', 'Invalid', 'Verified'];
        return { reqid: 'REQ-' + (1001 + i), patientname: 'Patient ' + (i + 1), provider: 'Cigna', policynumber: 'POL-' + (9876 + i), coveragelimit: '$' + (50000 + i * 10000), status: statuses[i] };
      }),
  },
  "/finance/payments/adjustments": {
    ui: 5,
    title: "Payment Adjustments", description: "Manual corrections for overcharges, missing discounts, or wrong billing.",
    stats: [{ label: "Pending Adjustments", color: "text-amber-400", value: "8" }, { label: "Approved Today", color: "text-emerald-400", value: "14" }, { label: "Value Impact", color: "text-red-400", value: "-$350" }],
    columns: [["Adj ID", "adjid"], ["Original Bill", "originalbill"], ["Patient Name", "patientname"], ["Adjustment Reason", "adjustmentreason"], ["Impact", "impact"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Approved":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Rejected', 'Approved'];
        return { adjid: 'ADJ-' + (3001 + i), originalbill: 'BIL-' + (1001 + i), patientname: 'Patient ' + (i + 1), adjustmentreason: 'Applied late discount', impact: '-$' + (20 + i * 5), status: statuses[i] };
      }),
  },
  "/finance/payments/history": {
    ui: 5,
    title: "Payment History", description: "Complete historical log of all patient transactions.",
    stats: [{ label: "Transactions (YTD)", color: "text-blue-400", value: "45,200" }, { label: "Revenue (YTD)", color: "text-emerald-400", value: "$12.4M" }, { label: "Failed Txns", color: "text-red-400", value: "124" }],
    columns: [["Transaction ID", "transactionid"], ["Patient Name", "patientname"], ["Date", "date"], ["Amount", "amount"], ["Payment Mode", "paymentmode"]],
    badge: ["Status", "status", {"Success":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { transactionid: 'TXN-' + (2001 + i), patientname: 'Patient ' + (i + 1), date: '0' + (1 + i) + ' Jul 2026', amount: '$' + (150 + i * 50), paymentmode: i % 2 === 0 ? 'Card' : 'UPI', status: 'Success' };
      }),
  },
  "/finance/payments/outstanding": {
    ui: 5,
    title: "Outstanding Payments", description: "List of patients with unpaid or partially paid bills.",
    stats: [{ label: "Total Outstanding", color: "text-red-400", value: "$124,000" }, { label: "Patients in Debt", color: "text-amber-400", value: "320" }, { label: "Recovered Today", color: "text-emerald-400", value: "$4,500" }],
    columns: [["Patient ID", "patientid"], ["Patient Name", "patientname"], ["Last Visit", "lastvisit"], ["Total Billed", "totalbilled"], ["Outstanding Amount", "outstandingamount"]],
    badge: ["Status", "status", {"Payment Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { patientid: 'PAT-' + (1001 + i), patientname: 'Patient ' + (i + 1), lastvisit: '0' + (1 + i) + ' Jun 2026', totalbilled: '$' + (2000 + i * 500), outstandingamount: '$' + (400 + i * 100), status: 'Payment Pending' };
      }),
  },
  "/finance/payments/plans": {
    ui: 5,
    title: "Payment Plans", description: "Installment plans for expensive treatments (e.g., IVF, Surgery).",
    stats: [{ label: "Active Plans", color: "text-blue-400", value: "45" }, { label: "Upcoming EMIs", color: "text-amber-400", value: "12" }, { label: "Defaulted", color: "text-red-400", value: "2" }],
    columns: [["Plan ID", "planid"], ["Patient Name", "patientname"], ["Total Cost", "totalcost"], ["EMI Amount", "emiamount"], ["Next Due Date", "nextduedate"]],
    badge: ["Status", "status", {"On Track":"emerald","Defaulted":"red","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['On Track', 'On Track', 'Defaulted', 'Completed', 'On Track'];
        return { planid: 'PLN-' + (5001 + i), patientname: 'Patient ' + (i + 1), totalcost: '$' + (5000 + i * 1000), emiamount: '$' + (500 + i * 100), nextduedate: '15 Jul 2026', status: statuses[i] };
      }),
  },
  "/finance/payments/settlement": {
    ui: 5,
    title: "Credit Settlement", description: "Clearing of credit lines extended to staff or trusted patients.",
    stats: [{ label: "Total Credit Due", color: "text-amber-400", value: "$15,400" }, { label: "Settled Today", color: "text-emerald-400", value: "$2,100" }, { label: "Accounts Overdue", color: "text-red-400", value: "5" }],
    columns: [["Settlement ID", "settlementid"], ["Account Name", "accountname"], ["Total Due", "totaldue"], ["Amount Settled", "amountsettled"], ["Balance", "balance"]],
    badge: ["Status", "status", {"Settled":"emerald","Partial Settlement":"blue","Overdue":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Settled', 'Partial Settlement', 'Settled', 'Overdue', 'Settled'];
        return { settlementid: 'STL-' + (4001 + i), accountname: 'Staff/VIP ' + (i + 1), totaldue: '$' + (500 + i * 100), amountsettled: statuses[i] === 'Partial Settlement' ? '$100' : ('$' + (500 + i * 100)), balance: statuses[i] === 'Partial Settlement' ? '$' + (400 + i * 100) : '$0', status: statuses[i] };
      }),
  },
  "/finance/payroll/deductions": {
    ui: 5,
    title: "Statutory Deductions", description: "Management of TDS, Professional Tax, and other mandatory payroll deductions.",
    stats: [{ label: "Total Deductions", color: "text-red-400", value: "$85,000" }, { label: "Deposited", color: "text-emerald-400", value: "$85,000" }, { label: "Pending Deposits", color: "text-emerald-400", value: "$0" }],
    columns: [["Month", "month"], ["Deduction Type", "deductiontype"], ["Total Amount", "totalamount"], ["No of Employees", "noofemployees"], ["Due Date", "duedate"]],
    badge: ["Status", "status", {"Deposited":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['TDS (Income Tax)', 'Professional Tax', 'Staff Loan EMI', 'TDS (Income Tax)', 'Professional Tax'];
        return { month: 'June 2026', deductiontype: types[i], totalamount: '$' + (40000 - i * 5000), noofemployees: (300 - i * 20).toString(), duedate: '15 Jul 2026', status: 'Deposited' };
      }),
  },
  "/finance/payroll/journal": {
    ui: 5,
    title: "Payroll Journal", description: "Detailed accounting journal entries for salaries, taxes, and benefits.",
    stats: [{ label: "Entries (Mo)", color: "text-blue-400", value: "15" }, { label: "Total Debits", color: "text-emerald-400", value: "$450K" }, { label: "Pending Auth", color: "text-emerald-400", value: "0" }],
    columns: [["Entry ID", "entryid"], ["Date", "date"], ["Description", "description"], ["Debit (Expense)", "debitexpense"], ["Credit (Liability/Bank)", "creditliabilitybank"]],
    badge: ["Status", "status", {"Posted":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { entryid: 'PRJ-' + (1001 + i), date: '30 Jun 2026', description: 'Salary Expense - ' + (1 + i), debitexpense: '$' + (100000 - i * 10000), creditliabilitybank: '$' + (100000 - i * 10000), status: 'Posted' };
      }),
  },
  "/finance/payroll/pf-esi": {
    ui: 5,
    title: "PF / ESI Posting", description: "Provident Fund and State Insurance contributions (Employee + Employer).",
    stats: [{ label: "PF/ESI Liability", color: "text-amber-400", value: "$45,000" }, { label: "Deposited", color: "text-emerald-400", value: "$45,000" }, { label: "ECR Filed", color: "text-blue-400", value: "Yes" }],
    columns: [["Month", "month"], ["Contribution Type", "contributiontype"], ["Employee Share", "employeeshare"], ["Employer Share", "employershare"], ["Total Deposit", "totaldeposit"]],
    badge: ["Status", "status", {"Deposited":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Provident Fund (PF)', 'ESIC', 'Provident Fund (PF)', 'ESIC', 'Provident Fund (PF)'];
        return { month: 'June 2026', contributiontype: types[i], employeeshare: '$' + (15000 - i * 2000), employershare: '$' + (16000 - i * 2100), totaldeposit: '$' + (31000 - i * 4100), status: 'Deposited' };
      }),
  },
  "/finance/payroll/salary": {
    ui: 5,
    title: "Salary Posting", description: "Transferring processed HR payroll data into the financial ledger.",
    stats: [{ label: "Total Payroll (Mo)", color: "text-blue-400", value: "$450,000" }, { label: "Disbursed", color: "text-emerald-400", value: "$450,000" }, { label: "Pending Clearance", color: "text-emerald-400", value: "$0" }],
    columns: [["Month", "month"], ["Department", "department"], ["Total Employees", "totalemployees"], ["Gross Salary", "grosssalary"], ["Net Payable", "netpayable"]],
    badge: ["Status", "status", {"Disbursed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Nursing', 'Doctors', 'Admin', 'Support Staff', 'IT'];
        return { month: 'June 2026', department: depts[i], totalemployees: (150 - i * 25).toString(), grosssalary: '$' + (120000 - i * 20000), netpayable: '$' + (100000 - i * 18000), status: 'Disbursed' };
      }),
  },
  "/finance/reports/balance-sheet": {
    ui: 5,
    title: "Balance Sheet", description: "Snapshot of hospital assets, liabilities, and equity at a specific point in time.",
    stats: [{ label: "Total Assets", color: "text-blue-400", value: "$24.5M" }, { label: "Total Liabilities", color: "text-amber-400", value: "$12.4M" }, { label: "Current Ratio", color: "text-emerald-400", value: "1.8" }],
    columns: [["Group", "group"], ["Sub-Group", "subgroup"], ["Amount (Current)", "amountcurrent"], ["Amount (Previous)", "amountprevious"], ["Variance", "variance"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const groups = ['Assets', 'Assets', 'Liabilities', 'Liabilities', 'Equity'];
        const subgroups = ['Current Assets', 'Fixed Assets', 'Current Liabilities', 'Long-term Debt', 'Retained Earnings'];
        return { group: groups[i], subgroup: subgroups[i], amountcurrent: '$' + (5000000 - i * 500000), amountprevious: '$' + (4800000 - i * 480000), variance: '+$200K', status: 'Generated' };
      }),
  },
  "/finance/reports/cash-flow": {
    ui: 5,
    title: "Cash Flow", description: "Analysis of cash inflows and outflows (Operating, Investing, Financing).",
    stats: [{ label: "Operating Cash Flow", color: "text-emerald-400", value: "$850K" }, { label: "Free Cash Flow", color: "text-blue-400", value: "$450K" }, { label: "Cash at End", color: "text-emerald-400", value: "$1.4M" }],
    columns: [["Activity Type", "activitytype"], ["Description", "description"], ["Inflow", "inflow"], ["Outflow", "outflow"], ["Net Cash", "netcash"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 4 }).map((_, i) => {
        const activities = ['Operating', 'Investing', 'Financing', 'Net Increase'];
        return { activitytype: activities[i], description: 'Cash from ' + activities[i], inflow: '$' + (2000000 - i * 500000), outflow: '$' + (1500000 - i * 400000), netcash: '$' + (500000 - i * 100000), status: 'Generated' };
      }),
  },
  "/finance/reports/collection": {
    ui: 5,
    title: "Daily Collection", description: "End of day summary of all cash, card, and UPI transactions.",
    stats: [{ label: "Reports Generated", color: "text-blue-400", value: "145" }, { label: "Variances Noted", color: "text-amber-400", value: "2" }, { label: "Total Collected (Mo)", color: "text-emerald-400", value: "$4.2M" }],
    columns: [["Date", "date"], ["Cashier", "cashier"], ["Cash Total", "cashtotal"], ["Card Total", "cardtotal"], ["UPI Total", "upitotal"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { date: 'Today', cashier: 'All Counters', cashtotal: '$' + (15000 + i * 1000), cardtotal: '$' + (45000 + i * 2000), upitotal: '$' + (25000 + i * 1500), status: 'Generated' };
      }),
  },
  "/finance/reports/department": {
    ui: 5,
    title: "Department Revenue Report", description: "Performance sheet of all departments compared against budgets.",
    stats: [{ label: "Total Revenue Variance", color: "text-emerald-400", value: "+5.2%" }, { label: "Top Performer", color: "text-blue-400", value: "Cardiology" }, { label: "Underperforming", color: "text-red-400", value: "1" }],
    columns: [["Department", "department"], ["Budgeted Rev", "budgetedrev"], ["Actual Rev", "actualrev"], ["Variance", "variance"], ["Direct Expenses", "directexpenses"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Pediatrics'];
        return { department: depts[i], budgetedrev: '$' + (500000 - i * 50000), actualrev: '$' + (550000 - i * 60000), variance: i === 4 ? '-2%' : '+' + (5 + i) + '%', directexpenses: '$' + (200000 - i * 20000), status: 'Generated' };
      }),
  },
  "/finance/reports/gl": {
    ui: 5,
    title: "General Ledger Report", description: "Transaction level detail for every account in the chart of accounts.",
    stats: [{ label: "Transactions (Mo)", color: "text-blue-400", value: "14,500" }, { label: "Pages", color: "text-gray-400", value: "450" }, { label: "Report Size", color: "text-gray-400", value: "12 MB" }],
    columns: [["Date", "date"], ["Voucher", "voucher"], ["Description", "description"], ["Debit", "debit"], ["Credit", "credit"], ["Running Balance", "runningbalance"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { date: 'Today', voucher: 'VCH-' + (1001 + i), description: 'Patient Bill Settlement', debit: i % 2 === 0 ? '$500' : '-', credit: i % 2 !== 0 ? '$500' : '-', runningbalance: '$' + (10000 + i * 500), status: 'Generated' };
      }),
  },
  "/finance/reports/gst": {
    ui: 5,
    title: "GST Report", description: "Itemized list of B2B and B2C sales for GST portal upload.",
    stats: [{ label: "B2B Invoices", color: "text-blue-400", value: "145" }, { label: "B2C Invoices", color: "text-emerald-400", value: "14,500" }, { label: "Total Tax", color: "text-amber-400", value: "$14,500" }],
    columns: [["Invoice No", "invoiceno"], ["GSTIN", "gstin"], ["Taxable Value", "taxablevalue"], ["CGST", "cgst"], ["SGST", "sgst"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { invoiceno: 'TXI-' + (1001 + i), gstin: i === 0 ? '27AADCB2230M1Z2' : 'Unregistered', taxablevalue: '$' + (5000 + i * 1000), cgst: '$' + (450 + i * 90), sgst: '$' + (450 + i * 90), status: 'Generated' };
      }),
  },
  "/finance/reports/insurance": {
    ui: 5,
    title: "Insurance Report", description: "Summary of claims sent, settled, and rejected per TPA/Provider.",
    stats: [{ label: "Overall Deduction %", color: "text-emerald-400", value: "4.5%" }, { label: "Total Settled (Mo)", color: "text-blue-400", value: "$850K" }, { label: "Highest Reject Rate", color: "text-red-400", value: "Bupa" }],
    columns: [["Provider", "provider"], ["Claims Sent", "claimssent"], ["Claimed Value", "claimedvalue"], ["Settled Value", "settledvalue"], ["Deduction %", "deduction"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const providers = ['Allianz', 'Cigna', 'Aetna', 'Bupa', 'MediAssist'];
        return { provider: providers[i], claimssent: (150 - i * 20).toString(), claimedvalue: '$' + (500000 - i * 50000), settledvalue: '$' + (480000 - i * 48000), deduction: (4 + i) + '%', status: 'Generated' };
      }),
  },
  "/finance/reports/outstanding": {
    ui: 5,
    title: "Outstanding Report", description: "Consolidated view of all AR (Patient + Corporate + Insurance).",
    stats: [{ label: "Total Outstanding", color: "text-red-400", value: "$3.4M" }, { label: "Corporate %", color: "text-amber-400", value: "45%" }, { label: "Insurance %", color: "text-blue-400", value: "50%" }],
    columns: [["Debtor Name", "debtorname"], ["Type", "type"], ["0-30 Days", "030days"], ["31-90 Days", "3190days"], ["> 90 Days", "90days"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { debtorname: 'Corporate ' + (1 + i), type: 'B2B', '030days': '$' + (50000 + i * 10000), '3190days': '$' + (20000 + i * 5000), '90days': '$' + (5000 + i * 1000), status: 'Generated' };
      }),
  },
  "/finance/reports/pl": {
    ui: 5,
    title: "Income Statement (P&L)", description: "Profit and Loss statement showing hospital profitability over a period.",
    stats: [{ label: "Net Profit Margin", color: "text-emerald-400", value: "18.4%" }, { label: "Total Revenue", color: "text-blue-400", value: "$4.2M" }, { label: "Total Expenses", color: "text-amber-400", value: "$3.4M" }],
    columns: [["Category", "category"], ["Type", "type"], ["Amount (Current)", "amountcurrent"], ["Amount (Previous)", "amountprevious"], ["% Change", "change"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['Operating Revenue', 'COGS (Pharmacy/Consumables)', 'Payroll Expenses', 'Admin Expenses', 'Net Profit'];
        const types = ['Revenue', 'Expense', 'Expense', 'Expense', 'Profit'];
        return { category: cats[i], type: types[i], amountcurrent: '$' + (1000000 - i * 150000), amountprevious: '$' + (950000 - i * 140000), change: '+5.2%', status: 'Generated' };
      }),
  },
  "/finance/reports/refund": {
    ui: 5,
    title: "Refund Report", description: "Audit log of all money returned to patients or vendors.",
    stats: [{ label: "Total Refunds (Mo)", color: "text-amber-400", value: "$12,400" }, { label: "Refund Count", color: "text-blue-400", value: "45" }, { label: "Avg Refund TAT", color: "text-emerald-400", value: "2 Days" }],
    columns: [["Refund ID", "refundid"], ["Date", "date"], ["Beneficiary", "beneficiary"], ["Amount", "amount"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { refundid: 'RFD-' + (1001 + i), date: 'Today', beneficiary: 'Patient ' + (1 + i), amount: '$' + (200 + i * 50), reason: 'Excess Advance', status: 'Generated' };
      }),
  },
  "/finance/reports/revenue": {
    ui: 5,
    title: "Revenue Report", description: "Detailed breakdown of income by service type (Consultation, Bed, Surgery, etc).",
    stats: [{ label: "Top Service", color: "text-blue-400", value: "Room Rent" }, { label: "Total Discount %", color: "text-amber-400", value: "4.2%" }, { label: "Net Rev (Mo)", color: "text-emerald-400", value: "$4.2M" }],
    columns: [["Service Group", "servicegroup"], ["Transactions", "transactions"], ["Gross Revenue", "grossrevenue"], ["Discounts", "discounts"], ["Net Revenue", "netrevenue"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const groups = ['Room Rent', 'Consultations', 'Surgeries', 'Pharmacy', 'Investigations'];
        return { servicegroup: groups[i], transactions: (1500 - i * 200).toString(), grossrevenue: '$' + (500000 - i * 50000), discounts: '$' + (20000 - i * 2000), netrevenue: '$' + (480000 - i * 48000), status: 'Generated' };
      }),
  },
  "/finance/reports/scheme": {
    ui: 5,
    title: "Government Scheme Report", description: "Specialized reporting formats required by government health departments.",
    stats: [{ label: "Govt Revenue (YTD)", color: "text-emerald-400", value: "$1.2M" }, { label: "Total Patients", color: "text-blue-400", value: "850" }, { label: "Avg TAT", color: "text-amber-400", value: "45 Days" }],
    columns: [["Scheme", "scheme"], ["Patients Treated", "patientstreated"], ["Claims Submitted", "claimssubmitted"], ["Settled Amount", "settledamount"], ["Pending Auth", "pendingauth"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const schemes = ['PM-JAY', 'CGHS', 'ESIC', 'MJPJAY', 'State Scheme'];
        return { scheme: schemes[i], patientstreated: (200 - i * 20).toString(), claimssubmitted: (180 - i * 15).toString(), settledamount: '$' + (150000 - i * 15000), pendingauth: (10 + i).toString(), status: 'Generated' };
      }),
  },
  "/finance/reports/trial-balance": {
    ui: 5,
    title: "Trial Balance Report", description: "Detailed printout of the trial balance for audit purposes.",
    stats: [{ label: "Total Accounts", color: "text-blue-400", value: "340" }, { label: "Total Debits", color: "text-emerald-400", value: "$5.4M" }, { label: "Total Credits", color: "text-emerald-400", value: "$5.4M" }],
    columns: [["Account Code", "accountcode"], ["Account Name", "accountname"], ["Debit Balance", "debitbalance"], ["Credit Balance", "creditbalance"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { accountcode: 'ACT-' + (100 + i), accountname: 'Account ' + (1 + i), debitbalance: i % 2 === 0 ? ('$' + (10000 + i * 2000)) : '$0', creditbalance: i % 2 !== 0 ? ('$' + (10000 + i * 2000)) : '$0', status: 'Generated' };
      }),
  },
  "/finance/revenue/analytics": {
    ui: 5,
    title: "Revenue Analytics", description: "AI-driven insights into pricing optimization and revenue leakage.",
    stats: [{ label: "Leakages Identified", color: "text-red-400", value: "4" }, { label: "Optimization Opps", color: "text-amber-400", value: "12" }, { label: "Potential Uplift", color: "text-emerald-400", value: "$1.2M" }],
    columns: [["Insight Area", "insightarea"], ["Observation", "observation"], ["Impact Est", "impactest"], ["Suggested Action", "suggestedaction"]],
    badge: ["Status", "status", {"Review Needed":"amber","Urgent":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const areas = ['Pharmacy Discounting', 'Unbilled Consumables (OT)', 'Package Pricing', 'Underutilized Assets', 'Corporate Tariffs'];
        const statuses = i === 1 ? 'Urgent' : 'Review Needed';
        return { insightarea: areas[i], observation: 'Consistent 15% discount given off-policy', impactest: '$45K/mo', suggestedaction: 'Enforce system limits', status: statuses };
      }),
  },
  "/finance/revenue/daily": {
    ui: 5,
    title: "Daily Revenue", description: "Day-end snapshot of all billed services versus actual collections.",
    stats: [{ label: "Avg Daily Rev", color: "text-blue-400", value: "$145K" }, { label: "Collection Ratio", color: "text-emerald-400", value: "92%" }, { label: "Avg Daily Discount", color: "text-amber-400", value: "$4.5K" }],
    columns: [["Date", "date"], ["Total Billed", "totalbilled"], ["Discounts Given", "discountsgiven"], ["Net Revenue", "netrevenue"], ["Actual Collected", "actualcollected"]],
    badge: ["Status", "status", {"Reconciled":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { date: '0' + (1 + i) + ' Jul 2026', totalbilled: '$' + (150000 - i * 5000), discountsgiven: '$' + (5000 - i * 500), netrevenue: '$' + (145000 - i * 4500), actualcollected: '$' + (130000 - i * 4000), status: 'Reconciled' };
      }),
  },
  "/finance/revenue/department": {
    ui: 5,
    title: "Department Revenue", description: "Income generated breakdown by each clinical and non-clinical department.",
    stats: [{ label: "Total Revenue (Mo)", color: "text-emerald-400", value: "$4.2M" }, { label: "Top Department", color: "text-blue-400", value: "Cardiology" }, { label: "Lowest Growth", color: "text-amber-400", value: "Dietetics" }],
    columns: [["Department", "department"], ["OPD Revenue", "opdrevenue"], ["IPD Revenue", "ipdrevenue"], ["Total Revenue", "totalrevenue"], ["Growth (MoM)", "growthmom"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Pediatrics'];
        return { department: depts[i], opdrevenue: '$' + (150000 - i * 10000), ipdrevenue: '$' + (400000 - i * 50000), totalrevenue: '$' + (550000 - i * 60000), growthmom: i === 4 ? '-2%' : '+' + (5 + i) + '%', status: 'Analyzed' };
      }),
  },
  "/finance/revenue/doctor": {
    ui: 5,
    title: "Doctor Revenue", description: "Revenue generated per consultant and their corresponding payout shares.",
    stats: [{ label: "Top Earner", color: "text-emerald-400", value: "Dr. Smith" }, { label: "Total Payouts (Mo)", color: "text-blue-400", value: "$850K" }, { label: "Pending Disbursal", color: "text-emerald-400", value: "$0" }],
    columns: [["Doctor Name", "doctorname"], ["Department", "department"], ["Consultation Rev", "consultationrev"], ["Procedure Rev", "procedurerev"], ["Total Share", "totalshare"]],
    badge: ["Status", "status", {"Settled":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { doctorname: 'Dr. ' + (1 + i), department: 'Cardiology', consultationrev: '$' + (20000 - i * 2000), procedurerev: '$' + (80000 - i * 10000), totalshare: '$' + (40000 - i * 5000), status: 'Settled' };
      }),
  },
  "/finance/revenue/monthly": {
    ui: 5,
    title: "Monthly Revenue", description: "Month-on-Month comparison for board reporting and trend analysis.",
    stats: [{ label: "YTD Revenue", color: "text-emerald-400", value: "$24.5M" }, { label: "Target Achievement", color: "text-blue-400", value: "105%" }, { label: "Highest Month", color: "text-gray-400", value: "May" }],
    columns: [["Month", "month"], ["OPD %", "opd"], ["IPD %", "ipd"], ["Total Revenue", "totalrevenue"], ["Target Achieved", "targetachieved"]],
    badge: ["Status", "status", {"Closed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        const targets = ['102%', '98%', '105%', '110%', '95%'];
        return { month: months[i] + ' 2026', opd: '30%', ipd: '70%', totalrevenue: '$' + (4000000 + i * 100000), targetachieved: targets[i], status: 'Closed' };
      }),
  },
  "/finance/revenue/package": {
    ui: 5,
    title: "Package Revenue", description: "Profitability analysis of fixed-cost surgical and maternity packages.",
    stats: [{ label: "Most Profitable", color: "text-emerald-400", value: "Cataract" }, { label: "Loss Making", color: "text-red-400", value: "1 Package" }, { label: "Total Margin", color: "text-blue-400", value: "24%" }],
    columns: [["Package Name", "packagename"], ["Count (Mo)", "countmo"], ["Total Revenue", "totalrevenue"], ["Total Actual Cost", "totalactualcost"], ["Margin", "margin"]],
    badge: ["Status", "status", {"Profitable":"emerald","Loss Warning":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const packages = ['Normal Delivery', 'CABG', 'Knee Replacement', 'Cataract', 'Appendectomy'];
        const margins = ['15%', '22%', '18%', '45%', '-2%'];
        const statuses = i === 4 ? 'Loss Warning' : 'Profitable';
        return { packagename: packages[i], countmo: (50 - i * 5).toString(), totalrevenue: '$' + (100000 - i * 10000), totalactualcost: '$' + (85000 - i * 8000), margin: margins[i], status: statuses };
      }),
  },
  "/finance/schemes/approval": {
    ui: 5,
    title: "Package Approval", description: "Tracking government approval for specific medical packages before surgery.",
    stats: [{ label: "Pending Approvals", color: "text-amber-400", value: "18" }, { label: "Approved Today", color: "text-emerald-400", value: "12" }, { label: "Rejected", color: "text-red-400", value: "2" }],
    columns: [["Auth ID", "authid"], ["Patient Name", "patientname"], ["Scheme", "scheme"], ["Package Blocked", "packageblocked"], ["Requested Date", "requesteddate"]],
    badge: ["Status", "status", {"Approved":"emerald","Pending Auth":"amber","Query Raised":"amber","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Approved', 'Pending Auth', 'Query Raised', 'Approved', 'Rejected'];
        return { authid: 'AUTH-' + (7001 + i), patientname: 'Patient ' + (i + 1), scheme: 'CGHS', packageblocked: 'Cataract Surgery', requesteddate: 'Today', status: statuses[i] };
      }),
  },
  "/finance/schemes/ayushman": {
    ui: 5,
    title: "Ayushman Bharat (PM-JAY)", description: "Billing and claim tracking specific to the Ayushman Bharat scheme.",
    stats: [{ label: "Active Patients", color: "text-blue-400", value: "45" }, { label: "Claims Submitted", color: "text-amber-400", value: "120" }, { label: "Settled (YTD)", color: "text-emerald-400", value: "$450K" }],
    columns: [["URN No", "urnno"], ["Patient Name", "patientname"], ["Package Blocked", "packageblocked"], ["Auth Amount", "authamount"]],
    badge: ["Status", "status", {"Approved":"emerald","Pending Auth":"amber","Treatment Ongoing":"amber","Discharged":"blue","Claim Submitted":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Approved', 'Pending Auth', 'Treatment Ongoing', 'Discharged', 'Claim Submitted'];
        return { urnno: 'URN-PMJ-' + (1001 + i), patientname: 'Patient ' + (i + 1), packageblocked: 'General Medicine', authamount: '$' + (800 + i * 100), status: statuses[i] };
      }),
  },
  "/finance/schemes/cghs": {
    ui: 5,
    title: "CGHS", description: "Central Government Health Scheme billing and receivables.",
    stats: [{ label: "Active Patients", color: "text-blue-400", value: "24" }, { label: "Pending Receivable", color: "text-amber-400", value: "$120K" }, { label: "Settled (YTD)", color: "text-emerald-400", value: "$300K" }],
    columns: [["CGHS ID", "cghsid"], ["Beneficiary Name", "beneficiaryname"], ["Department", "department"], ["Bill Amount", "billamount"]],
    badge: ["Status", "status", {"Claim Submitted":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { cghsid: 'CGHS-' + (2001 + i), beneficiaryname: 'Officer ' + (i + 1), department: 'Cardiology', billamount: '$' + (1200 + i * 200), status: 'Claim Submitted' };
      }),
  },
  "/finance/schemes/claims": {
    ui: 5,
    title: "Claim Management", description: "Central tracking for all government scheme claims and settlements.",
    stats: [{ label: "Total Pending Govt.", color: "text-red-400", value: "$1.2M" }, { label: "Under Process", color: "text-amber-400", value: "450 Claims" }, { label: "Settled (Mo)", color: "text-emerald-400", value: "$240K" }],
    columns: [["Claim ID", "claimid"], ["Scheme", "scheme"], ["Total Bills Submitted", "totalbillssubmitted"], ["Claim Amount", "claimamount"], ["Settled Amount", "settledamount"]],
    badge: ["Status", "status", {"Settled":"emerald","Under Process":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const schemes = ['PM-JAY', 'CGHS', 'ESIC', 'MJPJAY', 'PM-JAY'];
        return { claimid: 'CLM-' + (8001 + i), scheme: schemes[i], totalbillssubmitted: (10 + i * 5).toString(), claimamount: '$' + (15000 + i * 2000), settledamount: i === 0 ? '$14500' : '-', status: i === 0 ? 'Settled' : 'Under Process' };
      }),
  },
  "/finance/schemes/esic": {
    ui: 5,
    title: "ESIC", description: "Employees State Insurance Corporation billing and claims.",
    stats: [{ label: "Active Patients", color: "text-blue-400", value: "34" }, { label: "Pending Referrals", color: "text-amber-400", value: "5" }, { label: "Revenue (YTD)", color: "text-emerald-400", value: "$200K" }],
    columns: [["ESIC No", "esicno"], ["Employee Name", "employeename"], ["Employer", "employer"], ["Treatment", "treatment"], ["Bill Amount", "billamount"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { esicno: 'ESI-' + (3001 + i), employeename: 'Worker ' + (i + 1), employer: 'Factory ' + (i + 1), treatment: 'Orthopedics', billamount: '$' + (900 + i * 150), status: 'Active' };
      }),
  },
  "/finance/schemes/mjpjay": {
    ui: 5,
    title: "MJPJAY", description: "State specific scheme (Maharashtra) billing portal.",
    stats: [{ label: "Active Patients", color: "text-blue-400", value: "55" }, { label: "Pre-Auth Pending", color: "text-amber-400", value: "12" }, { label: "Settled", color: "text-emerald-400", value: "$180K" }],
    columns: [["Scheme ID", "schemeid"], ["Patient Name", "patientname"], ["District", "district"], ["Package Name", "packagename"], ["Amount", "amount"]],
    badge: ["Status", "status", {"Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { schemeid: 'MJP-' + (4001 + i), patientname: 'Patient ' + (i + 1), district: 'Pune', packagename: 'Dialysis', amount: '$' + (300 + i * 50), status: 'Approved' };
      }),
  },
  "/finance/schemes/state": {
    ui: 5,
    title: "State Health Schemes", description: "Other localized state government health scheme billing.",
    stats: [{ label: "Active Patients", color: "text-blue-400", value: "15" }, { label: "Total Receivables", color: "text-amber-400", value: "$45K" }, { label: "Settled", color: "text-emerald-400", value: "$85K" }],
    columns: [["State Scheme", "statescheme"], ["Patient Name", "patientname"], ["ID Number", "idnumber"], ["Treatment", "treatment"], ["Est Amount", "estamount"]],
    badge: ["Status", "status", {"Treatment Ongoing":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { statescheme: 'Arogyasri', patientname: 'Patient ' + (i + 1), idnumber: 'ID-' + (5001 + i), treatment: 'General Surgery', estamount: '$' + (1500 + i * 200), status: 'Treatment Ongoing' };
      }),
  },
  "/finance/schemes/verification": {
    ui: 5,
    title: "Scheme Verification", description: "Portal to verify beneficiary eligibility via government APIs.",
    stats: [{ label: "Verifications Today", color: "text-blue-400", value: "45" }, { label: "Eligible", color: "text-emerald-400", value: "40" }, { label: "Not Eligible", color: "text-red-400", value: "5" }],
    columns: [["Req ID", "reqid"], ["Patient Name", "patientname"], ["Scheme", "scheme"], ["Aadhar/ID", "aadharid"], ["Eligibility", "eligibility"]],
    badge: ["Status", "status", {"Verified":"emerald","Action Required":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Eligible', 'Eligible', 'Not Eligible', 'Pending KYC', 'Eligible'];
        return { reqid: 'VRF-' + (6001 + i), patientname: 'Patient ' + (i + 1), scheme: 'PM-JAY', aadharid: 'XXXX-XXXX-123' + i, eligibility: statuses[i], status: statuses[i] === 'Eligible' ? 'Verified' : 'Action Required' };
      }),
  },
  "/finance/settings/approval-matrix": {
    ui: 5,
    title: "Approval Matrix", description: "Configuring multi-level approvals for refunds, AP payments, and journal entries.",
    stats: [{ label: "Active Workflows", color: "text-blue-400", value: "8" }, { label: "Avg TAT", color: "text-emerald-400", value: "4.5 Hrs" }, { label: "Escalations Enabled", color: "text-gray-400", value: "Yes" }],
    columns: [["Process Name", "processname"], ["Condition", "condition"], ["Level 1 Approver", "level1approver"], ["Level 2 Approver", "level2approver"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const processes = ['Vendor Payment', 'Patient Refund', 'High Discount', 'Asset Disposal', 'Journal Entry'];
        const conditions = ['Amount > $5000', 'Amount > $1000', 'Discount > 20%', 'Any', 'Any'];
        return { processname: processes[i], condition: conditions[i], level1approver: 'Finance Mgr', level2approver: i === 0 ? 'CFO' : '-', status: 'Active' };
      }),
  },
  "/finance/settings/billing-rules": {
    ui: 5,
    title: "Billing Rules", description: "Logic for automatic tax application, night charges, or emergency surcharges.",
    stats: [{ label: "Active Rules", color: "text-blue-400", value: "18" }, { label: "Emergency Surcharge", color: "text-amber-400", value: "1.5x" }, { label: "Night Surcharge", color: "text-gray-400", value: "+20%" }],
    columns: [["Rule Name", "rulename"], ["Condition", "condition"], ["Action/Modifier", "actionmodifier"], ["Priority", "priority"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const rules = ['Night Consultation Surcharge', 'Emergency OT Surcharge', 'Senior Citizen Discount', 'Staff Discount', 'Package Exclusion Auto-Bill'];
        const modifiers = ['+20% on consult', '+50% on surgeon fee', '-10% on bed charges', '-25% overall', 'Bill at actuals'];
        return { rulename: rules[i], condition: 'Time > 10PM', actionmodifier: modifiers[i], priority: (1 + i).toString(), status: 'Active' };
      }),
  },
  "/finance/settings/charge-master": {
    ui: 5,
    title: "Charge Master", description: "Central repository defining the prices of every service, test, and bed in the hospital.",
    stats: [{ label: "Total Services Defined", color: "text-blue-400", value: "4,500" }, { label: "Recent Updates", color: "text-amber-400", value: "12 (This Week)" }, { label: "Unpriced Services", color: "text-emerald-400", value: "0" }],
    columns: [["Service Code", "servicecode"], ["Service Name", "servicename"], ["Department", "department"], ["Standard Rate", "standardrate"], ["Corporate Rate", "corporaterate"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const services = ['OPD Consultation - Sr.', 'General Ward Bed / Day', 'CBC Test', 'Chest X-Ray', 'ECG'];
        return { servicecode: 'SRV-' + (1001 + i), servicename: services[i], department: 'Various', standardrate: '$' + (50 + i * 20), corporaterate: '$' + (45 + i * 18), status: 'Active' };
      }),
  },
  "/finance/settings/discount-rules": {
    ui: 5,
    title: "Discount Rules", description: "Setting maximum permissible discount limits for various user roles.",
    stats: [{ label: "Roles Configured", color: "text-blue-400", value: "12" }, { label: "Cashier Limit", color: "text-amber-400", value: "5%" }, { label: "Admin Limit", color: "text-red-400", value: "100%" }],
    columns: [["Role/Designation", "roledesignation"], ["Max Discount %", "maxdiscount"], ["Max Absolute Discount", "maxabsolutediscount"], ["Requires OTP", "requiresotp"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const roles = ['Cashier', 'Billing Executive', 'Finance Manager', 'Medical Director', 'Hospital Admin'];
        const limits = ['5%', '10%', '25%', '50%', '100%'];
        return { roledesignation: roles[i], maxdiscount: limits[i], maxabsolutediscount: '$' + (50 + i * 500), requiresotp: i > 1 ? 'Yes' : 'No', status: 'Active' };
      }),
  },
  "/finance/settings/financial-year": {
    ui: 5,
    title: "Financial Year", description: "Setting the active financial period and locking closed accounting periods.",
    stats: [{ label: "Current FY", color: "text-emerald-400", value: "FY 2026-27" }, { label: "Previous FY Status", color: "text-blue-400", value: "Closed & Audited" }, { label: "Months Locked", color: "text-amber-400", value: "3" }],
    columns: [["FY Name", "fyname"], ["Start Date", "startdate"], ["End Date", "enddate"], ["Books Status", "booksstatus"]],
    badge: ["Status", "status", {"Active":"emerald","Archived":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 3 }).map((_, i) => {
        const fys = ['FY 2026-27', 'FY 2025-26', 'FY 2024-25'];
        const statuses = i === 0 ? 'Open' : 'Closed';
        return { fyname: fys[i], startdate: '01 Apr ' + (2026 - i), enddate: '31 Mar ' + (2027 - i), booksstatus: statuses, status: statuses === 'Open' ? 'Active' : 'Archived' };
      }),
  },
  "/finance/settings/number-series": {
    ui: 5,
    title: "Number Series", description: "Defining the prefix and numbering format for all financial documents (Bills, Receipts).",
    stats: [{ label: "Active Series", color: "text-blue-400", value: "15" }, { label: "Format", color: "text-gray-400", value: "PRE-YYYY-XXXX" }, { label: "Conflicts", color: "text-emerald-400", value: "0" }],
    columns: [["Document Type", "documenttype"], ["Prefix", "prefix"], ["Current Number", "currentnumber"], ["Suffix", "suffix"], ["Reset Rule", "resetrule"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const docs = ['OPD Bill', 'IPD Bill', 'Receipt', 'Tax Invoice', 'Journal Voucher'];
        const prefixes = ['OPD-', 'IPD-', 'REC-', 'TXI-', 'JRN-'];
        return { documenttype: docs[i], prefix: prefixes[i], currentnumber: (1500 + i * 500).toString(), suffix: '-26', resetrule: 'Yearly', status: 'Active' };
      }),
  },
  "/finance/settings/payment-modes": {
    ui: 5,
    title: "Payment Modes", description: "Configuring payment gateways, card machines, and accepted currencies.",
    stats: [{ label: "Active Modes", color: "text-blue-400", value: "8" }, { label: "Default Gateway", color: "text-emerald-400", value: "Stripe" }, { label: "Avg MDR", color: "text-amber-400", value: "1.2%" }],
    columns: [["Mode Name", "modename"], ["Type", "type"], ["Gateway/Provider", "gatewayprovider"], ["MDR Charge %", "mdrcharge"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const modes = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];
        const gateways = ['-', 'Stripe', 'Stripe', 'Razorpay', 'HDFC Bank'];
        return { modename: modes[i], type: modes[i], gatewayprovider: gateways[i], mdrcharge: i === 0 ? '-' : '1.5%', status: 'Active' };
      }),
  },
  "/finance/taxation/credit": {
    ui: 5,
    title: "Credit Notes", description: "Issued when a tax invoice needs to be reduced (e.g., refunds, discounts post-billing).",
    stats: [{ label: "Credit Notes (Mo)", color: "text-blue-400", value: "12" }, { label: "Total Value", color: "text-amber-400", value: "$1,200" }, { label: "Pending Approval", color: "text-amber-400", value: "2" }],
    columns: [["CN No", "cnno"], ["Original Invoice", "originalinvoice"], ["Date", "date"], ["Reason", "reason"], ["Credit Amount", "creditamount"]],
    badge: ["Status", "status", {"Issued":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { cnno: 'CRN-' + (2001 + i), originalinvoice: 'TXI-' + (1000 + i), date: 'Today', reason: 'Service Cancelled', creditamount: '$' + (100 + i * 20), status: 'Issued' };
      }),
  },
  "/finance/taxation/debit": {
    ui: 5,
    title: "Debit Notes", description: "Issued to vendors when goods are returned, reversing ITC.",
    stats: [{ label: "Debit Notes (Mo)", color: "text-blue-400", value: "8" }, { label: "Total Value", color: "text-emerald-400", value: "$850" }, { label: "Pending Adjustments", color: "text-emerald-400", value: "0" }],
    columns: [["DN No", "dnno"], ["Vendor", "vendor"], ["Date", "date"], ["Reason", "reason"], ["Debit Amount", "debitamount"]],
    badge: ["Status", "status", {"Issued":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { dnno: 'DBN-' + (3001 + i), vendor: 'Vendor ' + (1 + i), date: 'Yesterday', reason: 'Damaged Goods Return', debitamount: '$' + (50 + i * 10), status: 'Issued' };
      }),
  },
  "/finance/taxation/gst": {
    ui: 5,
    title: "GST", description: "Tracking of Goods and Services Tax (Inward and Outward).",
    stats: [{ label: "GST Payable (Mo)", color: "text-red-400", value: "$14,500" }, { label: "ITC Available", color: "text-emerald-400", value: "$8,200" }, { label: "Net Payable", color: "text-amber-400", value: "$6,300" }],
    columns: [["Month", "month"], ["Total Sales (Taxable)", "totalsalestaxable"], ["GST Collected", "gstcollected"], ["Total Purchases", "totalpurchases"], ["Input Tax Credit (ITC)", "inputtaxcredititc"]],
    badge: ["Status", "status", {"Filed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        return { month: months[i] + ' 2026', totalsalestaxable: '$' + (100000 + i * 10000), gstcollected: '$' + (18000 + i * 1800), totalpurchases: '$' + (50000 + i * 5000), inputtaxcredititc: '$' + (9000 + i * 900), status: 'Filed' };
      }),
  },
  "/finance/taxation/invoices": {
    ui: 5,
    title: "Tax Invoices", description: "Formal tax invoices generated for B2B and specific patient requests.",
    stats: [{ label: "Invoices Generated", color: "text-blue-400", value: "145" }, { label: "Total Tax Billed", color: "text-emerald-400", value: "$18,400" }, { label: "Cancelled", color: "text-gray-400", value: "2" }],
    columns: [["Invoice No", "invoiceno"], ["Date", "date"], ["Billed To", "billedto"], ["Taxable Amount", "taxableamount"], ["Total Tax", "totaltax"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { invoiceno: 'TXI-' + (1001 + i), date: 'Today', billedto: 'Corporate ' + (1 + i), taxableamount: '$' + (5000 + i * 1000), totaltax: '$' + (900 + i * 180), status: 'Active' };
      }),
  },
  "/finance/taxation/reports": {
    ui: 5,
    title: "Tax Reports", description: "Automated generation of statutory tax filing reports.",
    stats: [{ label: "Upcoming Deadlines", color: "text-red-400", value: "2" }, { label: "Filed (YTD)", color: "text-emerald-400", value: "12" }, { label: "Late Filings", color: "text-emerald-400", value: "0" }],
    columns: [["Report Type", "reporttype"], ["Period", "period"], ["Generated On", "generatedon"], ["Total Liability", "totalliability"], ["Filed Status", "filedstatus"]],
    badge: ["Status", "status", {"Action Required":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['GSTR-1', 'GSTR-3B', 'TDS Return', 'GSTR-1', 'GSTR-3B'];
        const statuses = i === 0 ? 'Pending Filing' : 'Filed';
        return { reporttype: types[i], period: 'June 2026', generatedon: '05 Jul 2026', totalliability: '$' + (15000 + i * 1000), filedstatus: statuses, status: statuses === 'Filed' ? 'Completed' : 'Action Required' };
      }),
  },
  "/finance/taxation/tds": {
    ui: 5,
    title: "TDS", description: "Tax Deducted at Source for professional fees (doctors) and contractors.",
    stats: [{ label: "TDS Deducted (Mo)", color: "text-amber-400", value: "$24,000" }, { label: "Deposited to Govt", color: "text-emerald-400", value: "$24,000" }, { label: "Pending Returns", color: "text-emerald-400", value: "0" }],
    columns: [["Month", "month"], ["Vendor/Doctor", "vendordoctor"], ["Payment Amount", "paymentamount"], ["TDS Rate", "tdsrate"], ["TDS Deducted", "tdsdeducted"]],
    badge: ["Status", "status", {"Deposited":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { month: 'June 2026', vendordoctor: 'Dr. Smith', paymentamount: '$' + (10000 + i * 2000), tdsrate: '10%', tdsdeducted: '$' + (1000 + i * 200), status: 'Deposited' };
      }),
  },
};

export default pages;
