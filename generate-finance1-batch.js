const fs = require('fs');
const path = require('path');

const config = [
  // Patient Billing
  {
    path: 'finance/billing/opd', title: 'OPD Billing', desc: 'Outpatient consultation and service billing.',
    cols: ['Bill No', 'Patient Name', 'Consultant', 'Services', 'Total Amount', 'Payment Mode', 'Status'],
    stats: [{ label: 'OPD Revenue Today', val: '$12,450', col: 'text-emerald-400' }, { label: 'Bills Generated', val: '450', col: 'text-blue-400' }, { label: 'Pending Dues', val: '$300', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Paid', 'Pending', 'Paid', 'Paid', 'Paid'];
      return { billno: 'OPD-' + (1001+i), patientname: 'Patient ' + (i+1), consultant: 'Dr. Smith', services: 'Consultation', totalamount: '$' + (50+i*10), paymentmode: statuses[i]==='Paid'?'Card':'-', status: statuses[i] };
    })`
  },
  {
    path: 'finance/billing/ipd', title: 'IPD Billing', desc: 'Inpatient room, nursing, and medical procedure billing.',
    cols: ['IPD No', 'Patient Name', 'Ward/Bed', 'Admission Date', 'Current Bill', 'Advance Paid', 'Status'],
    stats: [{ label: 'IPD Revenue Today', val: '$45,000', col: 'text-emerald-400' }, { label: 'Active IPD Bills', val: '120', col: 'text-blue-400' }, { label: 'Discharges Pending Bill', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Active', 'Discharged (Unpaid)', 'Active', 'Settled', 'Active'];
      return { ipdno: 'IPD-' + (2001+i), patientname: 'Patient ' + (i+1), wardbed: 'Ward A / Bed ' + i, admissiondate: '0' + (1+i) + ' Jul 2026', currentbill: '$' + (1500+i*500), advancepaid: '$' + (500+i*100), status: statuses[i] };
    })`
  },
  {
    path: 'finance/billing/emergency', title: 'Emergency Billing', desc: 'ER triage, trauma, and emergency procedure billing.',
    cols: ['ER No', 'Patient Name', 'Triage Level', 'Time In', 'Bill Amount', 'Status'],
    stats: [{ label: 'ER Revenue Today', val: '$8,400', col: 'text-emerald-400' }, { label: 'ER Bills', val: '45', col: 'text-blue-400' }, { label: 'Unbilled ER Cases', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Paid', 'Pending Approval', 'Paid', 'Waived', 'Paid'];
      return { erno: 'ER-' + (3001+i), patientname: 'Patient ' + (i+1), triagelevel: 'Level ' + ((i%3)+1), timein: '10:' + (10+i) + ' AM', billamount: '$' + (200+i*50), status: statuses[i] };
    })`
  },
  {
    path: 'finance/billing/pharmacy', title: 'Pharmacy Billing', desc: 'Direct medicine sales to walk-ins and inpatients.',
    cols: ['Receipt No', 'Patient/Customer', 'Items', 'Amount', 'Payment Mode', 'Status'],
    stats: [{ label: 'Pharmacy Sales', val: '$15,400', col: 'text-emerald-400' }, { label: 'Transactions', val: '850', col: 'text-blue-400' }, { label: 'Refunds', val: '$120', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { receiptno: 'PHM-' + (4001+i), patientcustomer: 'Customer ' + (i+1), items: (3+i).toString(), amount: '$' + (40+i*15), paymentmode: i%2===0?'Cash':'Card', status: 'Paid' };
    })`
  },
  {
    path: 'finance/billing/laboratory', title: 'Laboratory Billing', desc: 'Billing for pathology, biochemistry, and microbiology tests.',
    cols: ['Lab Bill No', 'Patient Name', 'Tests Ordered', 'Referring Doctor', 'Amount', 'Status'],
    stats: [{ label: 'Lab Revenue', val: '$9,200', col: 'text-emerald-400' }, { label: 'Lab Bills', val: '320', col: 'text-blue-400' }, { label: 'Corporate Tie-ups', val: '$1,500', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { labbillno: 'LAB-' + (5001+i), patientname: 'Patient ' + (i+1), testsordered: (2+i).toString(), referringdoctor: 'Dr. Jones', amount: '$' + (80+i*20), status: 'Paid' };
    })`
  },
  {
    path: 'finance/billing/radiology', title: 'Radiology Billing', desc: 'Billing for X-rays, MRIs, CT Scans, and Ultrasounds.',
    cols: ['Rad Bill No', 'Patient Name', 'Scan Type', 'Scan Date', 'Amount', 'Status'],
    stats: [{ label: 'Radiology Revenue', val: '$18,500', col: 'text-emerald-400' }, { label: 'Scans Billed', val: '145', col: 'text-blue-400' }, { label: 'Insurance Auth Pending', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const scans = ['MRI Brain', 'CT Chest', 'X-Ray Knee', 'USG Abdomen', 'MRI Spine'];
      return { radbillno: 'RAD-' + (6001+i), patientname: 'Patient ' + (i+1), scantype: scans[i], scandate: 'Today', amount: '$' + (300-i*50), status: 'Paid' };
    })`
  },
  {
    path: 'finance/billing/procedure', title: 'Procedure Billing', desc: 'Billing for minor surgeries, endoscopies, and day-care procedures.',
    cols: ['Proc Bill No', 'Patient Name', 'Procedure', 'Surgeon', 'Amount', 'Status'],
    stats: [{ label: 'Procedure Revenue', val: '$24,000', col: 'text-emerald-400' }, { label: 'Procedures Billed', val: '45', col: 'text-blue-400' }, { label: 'Pending Bills', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { procbillno: 'PRC-' + (7001+i), patientname: 'Patient ' + (i+1), procedure: 'Endoscopy ' + i, surgeon: 'Dr. House', amount: '$' + (450+i*100), status: 'Paid' };
    })`
  },
  {
    path: 'finance/billing/package', title: 'Package Billing', desc: 'Fixed-cost packages (e.g., Maternity, Cardiac surgeries).',
    cols: ['Package Bill No', 'Patient Name', 'Package Name', 'Inclusions', 'Total Package Cost', 'Status'],
    stats: [{ label: 'Package Revenue', val: '$85,000', col: 'text-emerald-400' }, { label: 'Active Packages', val: '24', col: 'text-blue-400' }, { label: 'Exclusions Billed', val: '$4,500', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const packages = ['Normal Delivery', 'C-Section', 'CABG', 'Knee Replacement', 'Cataract'];
      return { packagebillno: 'PKG-' + (8001+i), patientname: 'Patient ' + (i+1), packagename: packages[i], inclusions: 'Room, OT, Surgeon', totalpackagecost: '$' + (2000+i*1000), status: 'Active' };
    })`
  },
  {
    path: 'finance/billing/corporate', title: 'Corporate Billing', desc: 'Consolidated invoices sent to corporate partners and organizations.',
    cols: ['Invoice No', 'Corporate Name', 'Employees Treated', 'Period', 'Total Invoice Amount', 'Status'],
    stats: [{ label: 'Corporate Revenue (Mo)', val: '$120,000', col: 'text-emerald-400' }, { label: 'Invoices Generated', val: '14', col: 'text-blue-400' }, { label: 'Overdue Payments', val: '$15,000', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Sent', 'Paid', 'Overdue', 'Paid', 'Draft'];
      return { invoiceno: 'CRP-' + (9001+i), corporatename: 'Company ' + (i+1), employeestreated: (45+i*10).toString(), period: 'June 2026', totalinvoiceamount: '$' + (15000+i*2500), status: statuses[i] };
    })`
  },

  // Cash & Receipts
  {
    path: 'finance/cash/collection', title: 'Cash Collection', desc: 'Dashboard tracking daily cash, card, and UPI collections across all counters.',
    cols: ['Counter', 'Cashier', 'Cash', 'Card', 'UPI/Digital', 'Total Collected', 'Status'],
    stats: [{ label: 'Total Collected Today', val: '$84,500', col: 'text-emerald-400' }, { label: 'Cash Component', val: '$24,000', col: 'text-blue-400' }, { label: 'Shortages', val: '$0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const counters = ['OPD Counter 1', 'OPD Counter 2', 'IPD Billing', 'Pharmacy', 'ER Counter'];
      return { counter: counters[i], cashier: 'Cashier ' + (1+i), cash: '$' + (2000+i*500), card: '$' + (5000+i*1000), upidigital: '$' + (3000+i*400), totalcollected: '$' + (10000+i*1900), status: 'Active' };
    })`
  },
  {
    path: 'finance/cash/receipt', title: 'Receipt Entry', desc: 'Manual generation of receipts for miscellaneous hospital income.',
    cols: ['Receipt No', 'Received From', 'Towards', 'Amount', 'Mode', 'Status'],
    stats: [{ label: 'Misc Receipts Today', val: '$1,200', col: 'text-blue-400' }, { label: 'Count', val: '15', col: 'text-gray-400' }, { label: 'Cancellations', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const towards = ['Cafeteria Lease', 'Scrap Sale', 'Medical Report Fee', 'Parking Contract', 'Ambulance Fee'];
      return { receiptno: 'REC-' + (1001+i), receivedfrom: 'Person/Vendor ' + (i+1), towards: towards[i], amount: '$' + (100+i*50), mode: 'Cash', status: 'Issued' };
    })`
  },
  {
    path: 'finance/cash/advance', title: 'Advance Collection', desc: 'Deposits taken prior to IPD admission or major procedures.',
    cols: ['Advance ID', 'Patient Name', 'IPD No / Ref', 'Amount', 'Date', 'Status'],
    stats: [{ label: 'Advances Today', val: '$24,000', col: 'text-emerald-400' }, { label: 'Count', val: '45', col: 'text-blue-400' }, { label: 'Refunds Pending', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Active', 'Adjusted', 'Active', 'Refunded', 'Active'];
      return { advanceid: 'ADV-' + (2001+i), patientname: 'Patient ' + (i+1), ipdnoref: 'IPD-' + (2001+i), amount: '$' + (500+i*100), date: 'Today', status: statuses[i] };
    })`
  },
  {
    path: 'finance/cash/refund', title: 'Refund Management', desc: 'Processing refunds for cancelled services or excess advance payments.',
    cols: ['Refund ID', 'Patient Name', 'Original Receipt', 'Refund Amount', 'Reason', 'Status'],
    stats: [{ label: 'Refunds Processed', val: '$1,200', col: 'text-blue-400' }, { label: 'Pending Approval', val: '4', col: 'text-amber-400' }, { label: 'Rejected', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Processed', 'Pending Auth', 'Processed', 'Rejected', 'Processed'];
      return { refundid: 'RFD-' + (3001+i), patientname: 'Patient ' + (i+1), originalreceipt: 'REC-' + (1000+i), refundamount: '$' + (50+i*20), reason: 'Excess Advance', status: statuses[i] };
    })`
  },
  {
    path: 'finance/cash/deposit', title: 'Bank Deposit Management', desc: 'Logging the handover of physical cash to the bank.',
    cols: ['Deposit ID', 'Date', 'Amount', 'Bank', 'Deposited By', 'Status'],
    stats: [{ label: 'Cash In Hand', val: '$14,500', col: 'text-amber-400' }, { label: 'Deposited Today', val: '$45,000', col: 'text-emerald-400' }, { label: 'Variances', val: '$0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Cleared', 'Pending Recon', 'Cleared', 'Cleared', 'Cleared'];
      return { depositid: 'DEP-' + (4001+i), date: '0' + (1+i) + ' Jul 2026', amount: '$' + (10000+i*2000), bank: 'National Bank', depositedby: 'Head Cashier', status: statuses[i] };
    })`
  },
  {
    path: 'finance/cash/shift', title: 'Shift Closing', desc: 'End-of-shift reconciliation for cashiers before handover.',
    cols: ['Shift ID', 'Cashier', 'System Total', 'Physical Cash', 'Variance', 'Status'],
    stats: [{ label: 'Active Shifts', val: '5', col: 'text-blue-400' }, { label: 'Closed Successfully', val: '12', col: 'text-emerald-400' }, { label: 'Unresolved Variances', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Closed', 'Closed', 'Variance Logged', 'Closed', 'Active'];
      return { shiftid: 'SHF-' + (5001+i), cashier: 'Cashier ' + (i+1), systemtotal: '$' + (5000+i*1000), physicalcash: statuses==='Variance Logged'?'$'+(4950+i*1000):'$'+(5000+i*1000), variance: statuses==='Variance Logged'?'-$50':'$0', status: statuses };
    })`
  },
  {
    path: 'finance/cash/book', title: 'Cash Book', desc: 'Ledger tracking all petty cash and cash drawer inflows and outflows.',
    cols: ['Date', 'Voucher No', 'Particulars', 'Cash In', 'Cash Out', 'Balance'],
    stats: [{ label: 'Opening Balance', val: '$2,500', col: 'text-blue-400' }, { label: 'Petty Cash Expenses', val: '$450', col: 'text-amber-400' }, { label: 'Closing Balance', val: '$2,050', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: 'Today', voucherno: 'VCH-' + (6001+i), particulars: i%2===0?'Stationery Purchase':'Misc Income', cashin: i%2!==0?'$100':'-', cashout: i%2===0?'$50':'-', balance: '$' + (2000+i*25) };
    })`
  },

  // Patient Payments
  {
    path: 'finance/payments/outstanding', title: 'Outstanding Payments', desc: 'List of patients with unpaid or partially paid bills.',
    cols: ['Patient ID', 'Patient Name', 'Last Visit', 'Total Billed', 'Outstanding Amount', 'Status'],
    stats: [{ label: 'Total Outstanding', val: '$124,000', col: 'text-red-400' }, { label: 'Patients in Debt', val: '320', col: 'text-amber-400' }, { label: 'Recovered Today', val: '$4,500', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { patientid: 'PAT-' + (1001+i), patientname: 'Patient ' + (i+1), lastvisit: '0' + (1+i) + ' Jun 2026', totalbilled: '$' + (2000+i*500), outstandingamount: '$' + (400+i*100), status: 'Payment Pending' };
    })`
  },
  {
    path: 'finance/payments/history', title: 'Payment History', desc: 'Complete historical log of all patient transactions.',
    cols: ['Transaction ID', 'Patient Name', 'Date', 'Amount', 'Payment Mode', 'Status'],
    stats: [{ label: 'Transactions (YTD)', val: '45,200', col: 'text-blue-400' }, { label: 'Revenue (YTD)', val: '$12.4M', col: 'text-emerald-400' }, { label: 'Failed Txns', val: '124', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { transactionid: 'TXN-' + (2001+i), patientname: 'Patient ' + (i+1), date: '0' + (1+i) + ' Jul 2026', amount: '$' + (150+i*50), paymentmode: i%2===0?'Card':'UPI', status: 'Success' };
    })`
  },
  {
    path: 'finance/payments/adjustments', title: 'Payment Adjustments', desc: 'Manual corrections for overcharges, missing discounts, or wrong billing.',
    cols: ['Adj ID', 'Original Bill', 'Patient Name', 'Adjustment Reason', 'Impact', 'Status'],
    stats: [{ label: 'Pending Adjustments', val: '8', col: 'text-amber-400' }, { label: 'Approved Today', val: '14', col: 'text-emerald-400' }, { label: 'Value Impact', val: '-$350', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Auth', 'Approved', 'Pending Auth', 'Rejected', 'Approved'];
      return { adjid: 'ADJ-' + (3001+i), originalbill: 'BIL-' + (1001+i), patientname: 'Patient ' + (i+1), adjustmentreason: 'Applied late discount', impact: '-$' + (20+i*5), status: statuses[i] };
    })`
  },
  {
    path: 'finance/payments/settlement', title: 'Credit Settlement', desc: 'Clearing of credit lines extended to staff or trusted patients.',
    cols: ['Settlement ID', 'Account Name', 'Total Due', 'Amount Settled', 'Balance', 'Status'],
    stats: [{ label: 'Total Credit Due', val: '$15,400', col: 'text-amber-400' }, { label: 'Settled Today', val: '$2,100', col: 'text-emerald-400' }, { label: 'Accounts Overdue', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Settled', 'Partial Settlement', 'Settled', 'Overdue', 'Settled'];
      return { settlementid: 'STL-' + (4001+i), accountname: 'Staff/VIP ' + (i+1), totaldue: '$' + (500+i*100), amountsettled: statuses==='Partial Settlement'?'$100':('$'+(500+i*100)), balance: statuses==='Partial Settlement'?'$'+(400+i*100):'$0', status: statuses[i] };
    })`
  },
  {
    path: 'finance/payments/plans', title: 'Payment Plans', desc: 'Installment plans for expensive treatments (e.g., IVF, Surgery).',
    cols: ['Plan ID', 'Patient Name', 'Total Cost', 'EMI Amount', 'Next Due Date', 'Status'],
    stats: [{ label: 'Active Plans', val: '45', col: 'text-blue-400' }, { label: 'Upcoming EMIs', val: '12', col: 'text-amber-400' }, { label: 'Defaulted', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['On Track', 'On Track', 'Defaulted', 'Completed', 'On Track'];
      return { planid: 'PLN-' + (5001+i), patientname: 'Patient ' + (i+1), totalcost: '$' + (5000+i*1000), emiamount: '$' + (500+i*100), nextduedate: '15 Jul 2026', status: statuses[i] };
    })`
  },

  // Insurance & TPA
  {
    path: 'finance/insurance/verification', title: 'Insurance Verification', desc: 'Verifying active policies and coverage limits for new patients.',
    cols: ['Req ID', 'Patient Name', 'Provider', 'Policy Number', 'Coverage Limit', 'Status'],
    stats: [{ label: 'Pending Verification', val: '15', col: 'text-amber-400' }, { label: 'Verified Today', val: '45', col: 'text-emerald-400' }, { label: 'Invalid Policies', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Verified', 'Pending', 'Verified', 'Invalid', 'Verified'];
      return { reqid: 'REQ-' + (1001+i), patientname: 'Patient ' + (i+1), provider: 'Cigna', policynumber: 'POL-' + (9876+i), coveragelimit: '$' + (50000+i*10000), status: statuses[i] };
    })`
  },
  {
    path: 'finance/insurance/preauth', title: 'Pre-Authorization', desc: 'Sending cost estimates to insurance companies for approval prior to treatment.',
    cols: ['Auth ID', 'Patient Name', 'Treatment', 'Est. Cost', 'Requested On', 'Status'],
    stats: [{ label: 'Awaiting Auth', val: '24', col: 'text-amber-400' }, { label: 'Approved (Today)', val: '12', col: 'text-emerald-400' }, { label: 'Denied', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Approved', 'Pending', 'Denied', 'Approved', 'Pending'];
      return { authid: 'AUTH-' + (2001+i), patientname: 'Patient ' + (i+1), treatment: 'Knee Surgery', estcost: '$' + (8000+i*1000), requestedon: 'Yesterday', status: statuses[i] };
    })`
  },
  {
    path: 'finance/insurance/approval', title: 'Cashless Approval', desc: 'Tracking fully approved cashless patients currently admitted.',
    cols: ['Patient ID', 'Name', 'Ward/Bed', 'Approved Amount', 'Current Bill', 'Status'],
    stats: [{ label: 'Active Cashless IPD', val: '45', col: 'text-blue-400' }, { label: 'Exceeding Limit Alert', val: '4', col: 'text-red-400' }, { label: 'Discharge Ready', val: '8', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const current = (4000+i*1200);
      const approved = (5000+i*1000);
      const statuses = current > approved ? 'Limit Exceeded' : 'Within Limit';
      return { patientid: 'PAT-' + (3001+i), name: 'Patient ' + (i+1), wardbed: 'Ward A / Bed ' + i, approvedamount: '$' + approved, currentbill: '$' + current, status: statuses };
    })`
  },
  {
    path: 'finance/insurance/submission', title: 'Claim Submission', desc: 'Generating and dispatching final bills to TPA/Insurance post-discharge.',
    cols: ['Claim ID', 'Patient Name', 'Discharge Date', 'Claim Amount', 'Provider', 'Status'],
    stats: [{ label: 'Ready to Submit', val: '18', col: 'text-amber-400' }, { label: 'Submitted (Week)', val: '85', col: 'text-emerald-400' }, { label: 'Pending Documents', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Submitted', 'Draft', 'Pending Docs', 'Submitted', 'Submitted'];
      return { claimid: 'CLM-' + (4001+i), patientname: 'Patient ' + (i+1), dischargedate: '0' + (1+i) + ' Jul 2026', claimamount: '$' + (6000+i*1000), provider: 'Allianz', status: statuses[i] };
    })`
  },
  {
    path: 'finance/insurance/tracking', title: 'Claim Tracking', desc: 'Monitoring the status of submitted claims with insurance providers.',
    cols: ['Claim ID', 'Provider', 'Submitted On', 'Days Pending', 'Claim Amount', 'Status'],
    stats: [{ label: 'Total Pending Claims', val: '120', col: 'text-amber-400' }, { label: 'Value Locked', val: '$850,000', col: 'text-red-400' }, { label: 'Overdue > 30 Days', val: '15', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Under Process', 'Query Raised', 'Under Process', 'Approved', 'Under Process'];
      return { claimid: 'CLM-' + (5001+i), provider: 'Aetna', submittedon: '01 Jun 2026', dayspending: (35-i*5).toString(), claimamount: '$' + (8000+i*500), status: statuses[i] };
    })`
  },
  {
    path: 'finance/insurance/settlement', title: 'Claim Settlement', desc: 'Reconciling bank payments received from insurance against original claims.',
    cols: ['Settlement ID', 'Claim ID', 'Claim Amount', 'Settled Amount', 'Deduction', 'Status'],
    stats: [{ label: 'Settled Today', val: '$45,000', col: 'text-emerald-400' }, { label: 'Avg Deduction', val: '4.5%', col: 'text-amber-400' }, { label: 'Pending Recon', val: '8', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { settlementid: 'STL-' + (6001+i), claimid: 'CLM-' + (4001+i), claimamount: '$' + (5000+i*1000), settledamount: '$' + (4800+i*950), deduction: '$' + (200+i*50), status: 'Reconciled' };
    })`
  },
  {
    path: 'finance/insurance/rejection', title: 'Claim Rejection', desc: 'Handling denied claims, appeals, and transferring dues to patient accounts.',
    cols: ['Claim ID', 'Patient Name', 'Provider', 'Claim Amount', 'Rejection Reason', 'Status'],
    stats: [{ label: 'Rejected (Mo)', val: '12', col: 'text-red-400' }, { label: 'Value Denied', val: '$24,000', col: 'text-red-400' }, { label: 'Appeals Won', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Under Appeal', 'Transferred to Patient', 'Under Appeal', 'Closed (Written Off)', 'Transferred to Patient'];
      return { claimid: 'CLM-' + (7001+i), patientname: 'Patient ' + (i+1), provider: 'Bupa', claimamount: '$' + (4000+i*500), rejectionreason: 'Not a covered benefit', status: statuses[i] };
    })`
  },
  {
    path: 'finance/insurance/tpa', title: 'TPA Management', desc: 'Managing contracts, rates, and contact details for Third Party Administrators.',
    cols: ['TPA Name', 'Active Contracts', 'Discount Rate', 'Total Business (YTD)', 'Settlement TAT', 'Status'],
    stats: [{ label: 'Active TPAs', val: '24', col: 'text-blue-400' }, { label: 'Top TPA', val: 'MediAssist', col: 'text-emerald-400' }, { label: 'Contract Renewals', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { tpaname: 'TPA Corp ' + (i+1), activecontracts: (3+i).toString(), discountrate: (10+i) + '%', totalbusinessytd: '$' + (250000-i*20000), settlementtat: (20+i) + ' Days', status: 'Active' };
    })`
  },

  // Government Schemes
  {
    path: 'finance/schemes/ayushman', title: 'Ayushman Bharat (PM-JAY)', desc: 'Billing and claim tracking specific to the Ayushman Bharat scheme.',
    cols: ['URN No', 'Patient Name', 'Package Blocked', 'Auth Amount', 'Status'],
    stats: [{ label: 'Active Patients', val: '45', col: 'text-blue-400' }, { label: 'Claims Submitted', val: '120', col: 'text-amber-400' }, { label: 'Settled (YTD)', val: '$450K', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Approved', 'Pending Auth', 'Treatment Ongoing', 'Discharged', 'Claim Submitted'];
      return { urnno: 'URN-PMJ-' + (1001+i), patientname: 'Patient ' + (i+1), packageblocked: 'General Medicine', authamount: '$' + (800+i*100), status: statuses[i] };
    })`
  },
  {
    path: 'finance/schemes/cghs', title: 'CGHS', desc: 'Central Government Health Scheme billing and receivables.',
    cols: ['CGHS ID', 'Beneficiary Name', 'Department', 'Bill Amount', 'Status'],
    stats: [{ label: 'Active Patients', val: '24', col: 'text-blue-400' }, { label: 'Pending Receivable', val: '$120K', col: 'text-amber-400' }, { label: 'Settled (YTD)', val: '$300K', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { cghsid: 'CGHS-' + (2001+i), beneficiaryname: 'Officer ' + (i+1), department: 'Cardiology', billamount: '$' + (1200+i*200), status: 'Claim Submitted' };
    })`
  },
  {
    path: 'finance/schemes/esic', title: 'ESIC', desc: 'Employees State Insurance Corporation billing and claims.',
    cols: ['ESIC No', 'Employee Name', 'Employer', 'Treatment', 'Bill Amount', 'Status'],
    stats: [{ label: 'Active Patients', val: '34', col: 'text-blue-400' }, { label: 'Pending Referrals', val: '5', col: 'text-amber-400' }, { label: 'Revenue (YTD)', val: '$200K', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { esicno: 'ESI-' + (3001+i), employeename: 'Worker ' + (i+1), employer: 'Factory ' + (i+1), treatment: 'Orthopedics', billamount: '$' + (900+i*150), status: 'Active' };
    })`
  },
  {
    path: 'finance/schemes/mjpjay', title: 'MJPJAY', desc: 'State specific scheme (Maharashtra) billing portal.',
    cols: ['Scheme ID', 'Patient Name', 'District', 'Package Name', 'Amount', 'Status'],
    stats: [{ label: 'Active Patients', val: '55', col: 'text-blue-400' }, { label: 'Pre-Auth Pending', val: '12', col: 'text-amber-400' }, { label: 'Settled', val: '$180K', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { schemeid: 'MJP-' + (4001+i), patientname: 'Patient ' + (i+1), district: 'Pune', packagename: 'Dialysis', amount: '$' + (300+i*50), status: 'Approved' };
    })`
  },
  {
    path: 'finance/schemes/state', title: 'State Health Schemes', desc: 'Other localized state government health scheme billing.',
    cols: ['State Scheme', 'Patient Name', 'ID Number', 'Treatment', 'Est Amount', 'Status'],
    stats: [{ label: 'Active Patients', val: '15', col: 'text-blue-400' }, { label: 'Total Receivables', val: '$45K', col: 'text-amber-400' }, { label: 'Settled', val: '$85K', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { statescheme: 'Arogyasri', patientname: 'Patient ' + (i+1), idnumber: 'ID-' + (5001+i), treatment: 'General Surgery', estamount: '$' + (1500+i*200), status: 'Treatment Ongoing' };
    })`
  },
  {
    path: 'finance/schemes/verification', title: 'Scheme Verification', desc: 'Portal to verify beneficiary eligibility via government APIs.',
    cols: ['Req ID', 'Patient Name', 'Scheme', 'Aadhar/ID', 'Eligibility', 'Status'],
    stats: [{ label: 'Verifications Today', val: '45', col: 'text-blue-400' }, { label: 'Eligible', val: '40', col: 'text-emerald-400' }, { label: 'Not Eligible', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Eligible', 'Eligible', 'Not Eligible', 'Pending KYC', 'Eligible'];
      return { reqid: 'VRF-' + (6001+i), patientname: 'Patient ' + (i+1), scheme: 'PM-JAY', aadharid: 'XXXX-XXXX-123' + i, eligibility: statuses[i], status: statuses[i]==='Eligible'?'Verified':'Action Required' };
    })`
  },
  {
    path: 'finance/schemes/approval', title: 'Package Approval', desc: 'Tracking government approval for specific medical packages before surgery.',
    cols: ['Auth ID', 'Patient Name', 'Scheme', 'Package Blocked', 'Requested Date', 'Status'],
    stats: [{ label: 'Pending Approvals', val: '18', col: 'text-amber-400' }, { label: 'Approved Today', val: '12', col: 'text-emerald-400' }, { label: 'Rejected', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Approved', 'Pending Auth', 'Query Raised', 'Approved', 'Rejected'];
      return { authid: 'AUTH-' + (7001+i), patientname: 'Patient ' + (i+1), scheme: 'CGHS', packageblocked: 'Cataract Surgery', requesteddate: 'Today', status: statuses[i] };
    })`
  },
  {
    path: 'finance/schemes/claims', title: 'Claim Management', desc: 'Central tracking for all government scheme claims and settlements.',
    cols: ['Claim ID', 'Scheme', 'Total Bills Submitted', 'Claim Amount', 'Settled Amount', 'Status'],
    stats: [{ label: 'Total Pending Govt.', val: '$1.2M', col: 'text-red-400' }, { label: 'Under Process', val: '450 Claims', col: 'text-amber-400' }, { label: 'Settled (Mo)', val: '$240K', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const schemes = ['PM-JAY', 'CGHS', 'ESIC', 'MJPJAY', 'PM-JAY'];
      return { claimid: 'CLM-' + (8001+i), scheme: schemes[i], totalbillssubmitted: (10+i*5).toString(), claimamount: '$' + (15000+i*2000), settledamount: i===0?'$14500':'-', status: i===0?'Settled':'Under Process' };
    })`
  },

  // Accounts Receivable (AR)
  {
    path: 'finance/ar/patient', title: 'Patient Receivables', desc: 'Unpaid dues directly owed by individual patients.',
    cols: ['Patient ID', 'Name', 'Total Debt', 'Oldest Due', 'Last Contacted', 'Status'],
    stats: [{ label: 'Total Patient AR', val: '$145,000', col: 'text-red-400' }, { label: 'Patients > 90 Days', val: '120', col: 'text-amber-400' }, { label: 'Recovered (Mo)', val: '$12,000', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { patientid: 'PAT-' + (1001+i), name: 'Patient ' + (i+1), totaldebt: '$' + (500+i*200), oldestdue: (30+i*15) + ' Days', lastcontacted: '1 Week Ago', status: 'Follow-up Needed' };
    })`
  },
  {
    path: 'finance/ar/insurance', title: 'Insurance Receivables', desc: 'Money owed by TPAs and Insurance companies for cashless treatments.',
    cols: ['Provider', 'Total Claims Pending', 'AR < 30 Days', 'AR > 90 Days', 'Total AR', 'Status'],
    stats: [{ label: 'Total Insurance AR', val: '$2.4M', col: 'text-red-400' }, { label: 'High Risk (>120D)', val: '$450K', col: 'text-amber-400' }, { label: 'Cleared (Mo)', val: '$800K', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const providers = ['Allianz', 'Cigna', 'Aetna', 'Bupa', 'MediAssist'];
      return { provider: providers[i], totalclaimspending: (150-i*20).toString(), ar30days: '$' + (50000-i*5000), ar90days: '$' + (10000+i*2000), totalar: '$' + (120000-i*10000), status: 'Active Follow-up' };
    })`
  },
  {
    path: 'finance/ar/corporate', title: 'Corporate Receivables', desc: 'Unpaid invoices from corporate tie-ups and partner organizations.',
    cols: ['Corporate Name', 'Total Invoices Pending', 'Oldest Invoice', 'Total AR', 'Account Manager', 'Status'],
    stats: [{ label: 'Total Corporate AR', val: '$850,000', col: 'text-red-400' }, { label: 'Overdue Companies', val: '12', col: 'text-amber-400' }, { label: 'Payments Expected', val: '$150K', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { corporatename: 'Company ' + (i+1), totalinvoicespending: (5+i).toString(), oldestinvoice: (45+i*10) + ' Days', totalar: '$' + (45000-i*5000), accountmanager: 'Sales Team', status: 'Payment Expected' };
    })`
  },
  {
    path: 'finance/ar/aging', title: 'Aging Analysis', desc: 'Categorizing all receivables by the length of time they have been outstanding.',
    cols: ['Account Type', '0-30 Days', '31-60 Days', '61-90 Days', '> 90 Days', 'Total'],
    stats: [{ label: 'Overall AR', val: '$3.4M', col: 'text-red-400' }, { label: 'Healthy (<30D)', val: '$1.8M', col: 'text-emerald-400' }, { label: 'Toxic (>90D)', val: '$650K', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 4 }).map((_, i) => {
      const types = ['Patient', 'Insurance', 'Corporate', 'Government'];
      return { accounttype: types[i], '030days': '$' + (100000+i*20000), '3160days': '$' + (50000+i*10000), '6190days': '$' + (20000+i*5000), '90days': '$' + (10000+i*10000), total: '$' + (180000+i*45000) };
    })`
  },
  {
    path: 'finance/ar/collection', title: 'Collection Follow-up', desc: 'Task management for finance staff to call and recover debts.',
    cols: ['Task ID', 'Debtor Name', 'Type', 'Amount Due', 'Last Note', 'Status'],
    stats: [{ label: 'Calls to Make', val: '45', col: 'text-amber-400' }, { label: 'Promises to Pay', val: '12', col: 'text-blue-400' }, { label: 'Recovered Today', val: '$8,400', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Call', 'Promised to Pay', 'Unreachable', 'Pending Call', 'Paid'];
      return { taskid: 'TSK-' + (1001+i), debtorname: 'Debtor ' + (i+1), type: i%2===0?'Patient':'Corporate', amountdue: '$' + (1000+i*500), lastnote: 'Will pay next week', status: statuses[i] };
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
        const isGood = val === 'Paid' || val === 'Settled' || val === 'Active' || val === 'Issued' || val === 'Cleared' || val === 'Closed' || val === 'Success' || val === 'On Track' || val === 'Completed' || val === 'Verified' || val === 'Approved' || val === 'Reconciled' || val === 'Eligible';
        const isWarning = val === 'Pending' || val === 'Pending Approval' || val === 'Payment Pending' || val === 'Pending Auth' || val === 'Draft' || val === 'Pending Recon' || val === 'Follow-up Needed' || val === 'Active Follow-up' || val === 'Pending Call' || val === 'Under Process' || val === 'Query Raised' || val === 'Treatment Ongoing' || val === 'Action Required' || val === 'Promised to Pay' || val === 'Payment Expected';
        const isNeutral = val === 'Waived' || val === 'Adjusted' || val === 'Refunded' || val === 'Sent' || val === 'Partial Settlement' || val === 'Transferred to Patient' || val === 'Claim Submitted' || val === 'Discharged';
        const isDanger = val === 'Discharged (Unpaid)' || val === 'Overdue' || val === 'Variance Logged' || val === 'Rejected' || val === 'Defaulted' || val === 'Invalid' || val === 'Limit Exceeded' || val === 'Denied' || val === 'Closed (Written Off)' || val === 'Unreachable' || val === 'Not Eligible';
        
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
