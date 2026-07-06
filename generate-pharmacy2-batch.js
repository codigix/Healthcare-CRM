const fs = require('fs');
const path = require('path');

const config = [
  // Billing
  {
    path: 'pharmacy/billing/pharmacy', title: 'Direct Pharmacy Billing', desc: 'Point of sale billing for cash/card paying OPD and walk-in patients.',
    cols: ['Bill ID', 'Patient Name', 'Items', 'Total Amount', 'Payment Mode', 'Status'],
    stats: [{ label: 'Bills Today', val: '450', col: 'text-blue-400' }, { label: 'Total Revenue', val: '$12,450', col: 'text-emerald-400' }, { label: 'Pending Payment', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Paid', 'Paid', 'Pending', 'Paid', 'Paid'];
      return { billid: 'BIL-' + (1001+i), patientname: 'Patient ' + (i+1), items: (2+i).toString(), totalamount: '$' + (40+i*15), paymentmode: statuses[i]==='Paid'?'Card':'-', status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/billing/insurance', title: 'Insurance Pharmacy Billing', desc: 'Processing claims, co-pays, and pre-authorizations for insured patients.',
    cols: ['Claim ID', 'Patient Name', 'Insurance Provider', 'Claim Amount', 'Co-Pay', 'Status'],
    stats: [{ label: 'Pending Claims', val: '24', col: 'text-amber-400' }, { label: 'Approved Today', val: '85', col: 'text-emerald-400' }, { label: 'Rejected', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const providers = ['Allianz', 'Cigna', 'Bupa', 'Aetna', 'Allianz'];
      const statuses = ['Approved', 'Pending Auth', 'Rejected (Not Covered)', 'Approved', 'Pending Auth'];
      return { claimid: 'CLM-' + (2001+i), patientname: 'Patient ' + (i+1), insuranceprovider: providers[i], claimamount: '$' + (150+i*50), copay: '$' + (20+i*5), status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/billing/corporate', title: 'Corporate Pharmacy Billing', desc: 'Managing credit bills and consolidated invoices for corporate tie-ups.',
    cols: ['Invoice ID', 'Corporate Partner', 'Total Bills', 'Invoice Amount', 'Due Date', 'Status'],
    stats: [{ label: 'Unbilled Amount', val: '$45,000', col: 'text-amber-400' }, { label: 'Invoices Sent', val: '12', col: 'text-blue-400' }, { label: 'Payments Received', val: '$30,000', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Unpaid', 'Paid', 'Partially Paid', 'Unpaid', 'Paid'];
      return { invoiceid: 'CORP-' + (3001+i), corporatepartner: 'Company ' + (i+1), totalbills: (45+i*10).toString(), invoiceamount: '$' + (4500+i*1000), duedate: '15 Aug 2026', status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/billing/scheme', title: 'Govt. Scheme Billing', desc: 'Special billing for subsidized or free medicines under government health schemes.',
    cols: ['Scheme ID', 'Patient Name', 'Scheme Name', 'Subsidized Amount', 'Patient Share', 'Status'],
    stats: [{ label: 'Scheme Patients', val: '120', col: 'text-blue-400' }, { label: 'Govt. Receivable', val: '$15,200', col: 'text-amber-400' }, { label: 'Dispensed', val: '115', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const schemes = ['National Health Scheme', 'Senior Citizen Care', 'Maternity Benefit', 'National Health Scheme', 'Veterans Aid'];
      return { schemeid: 'SCH-' + (4001+i), patientname: 'Patient ' + (i+1), schemename: schemes[i], subsidizedamount: '$' + (100+i*20), patientshare: '$' + (10+i*5), status: 'Claim Submitted' };
    })`
  },
  {
    path: 'pharmacy/billing/refunds', title: 'Pharmacy Refunds', desc: 'Processing cash/card refunds for returned medicines against original bills.',
    cols: ['Refund ID', 'Original Bill', 'Patient Name', 'Refund Amount', 'Reason', 'Status'],
    stats: [{ label: 'Pending Refunds', val: '8', col: 'text-amber-400' }, { label: 'Refunded Today', val: '15', col: 'text-emerald-400' }, { label: 'Total Value', val: '$450', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Processed', 'Pending Approval', 'Processed', 'Rejected', 'Processed'];
      return { refundid: 'RFD-' + (5001+i), originalbill: 'BIL-' + (1000+i), patientname: 'Patient ' + (i+1), refundamount: '$' + (15+i*10), reason: 'Allergy / Returned', status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/billing/credit', title: 'Credit Management', desc: 'Monitoring partial payments, pending dues, and staff credit limits.',
    cols: ['Patient/Staff Name', 'Category', 'Credit Limit', 'Outstanding Dues', 'Last Paid Date', 'Status'],
    stats: [{ label: 'Total Outstanding', val: '$8,500', col: 'text-red-400' }, { label: 'Staff Credit', val: '$2,400', col: 'text-blue-400' }, { label: 'Recovered Today', val: '$850', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const categories = ['Hospital Staff', 'Long-term IPD', 'Hospital Staff', 'VIP Patient', 'Hospital Staff'];
      const statuses = ['Within Limit', 'Exceeded Limit', 'Within Limit', 'Within Limit', 'Clear'];
      return { patientstaffname: 'Person ' + (i+1), category: categories[i], creditlimit: '$1000', outstandingdues: '$' + (200+i*250), lastpaiddate: '01 Jul 2026', status: statuses[i] };
    })`
  },

  // Patient Services
  {
    path: 'pharmacy/services/history', title: 'Patient Medication History', desc: 'Complete longitudinal record of all medicines dispensed to a patient.',
    cols: ['Date', 'Prescription ID', 'Doctor', 'Medicines Dispensed', 'Refills Left', 'Status'],
    stats: [{ label: 'Records Accessed', val: '450', col: 'text-blue-400' }, { label: 'Active Therapies', val: '4', col: 'text-emerald-400' }, { label: 'Compliance Alerts', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: '0' + (1+i) + ' Jul 2026', prescriptionid: 'RX-' + (1000+i), doctor: 'Dr. House', medicinesdispensed: 'Metformin, Lisinopril', refillsleft: (2-i%2).toString(), status: 'Active' };
    })`
  },
  {
    path: 'pharmacy/services/refill', title: 'Refill Management', desc: 'Tracking and processing refill requests for chronic medication users.',
    cols: ['Refill ID', 'Patient Name', 'Medicine', 'Next Due Date', 'Patient Contacted', 'Status'],
    stats: [{ label: 'Refills Due Today', val: '45', col: 'text-amber-400' }, { label: 'Refills Processed', val: '38', col: 'text-emerald-400' }, { label: 'Missed Refills', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Collection', 'Processed', 'Overdue', 'Processed', 'Patient Refused'];
      return { refillid: 'RFL-' + (2001+i), patientname: 'Patient ' + (i+1), medicine: 'Amlodipine 5mg', nextduedate: 'Today', patientcontacted: statuses[i]==='Overdue'?'No':'Yes', status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/services/counseling', title: 'Patient Counseling', desc: 'Log of pharmacist counseling sessions for new therapies or complex regimens.',
    cols: ['Session ID', 'Patient Name', 'Topic', 'Pharmacist', 'Duration', 'Status'],
    stats: [{ label: 'Sessions Today', val: '24', col: 'text-blue-400' }, { label: 'Inhaler Techniques', val: '8', col: 'text-emerald-400' }, { label: 'Pending Sessions', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const topics = ['Insulin Pen Technique', 'Inhaler Usage', 'Warfarin Diet Interactions', 'Chemo Side Effects', 'New Antibiotic'];
      const statuses = ['Completed', 'Completed', 'Scheduled', 'Completed', 'Completed'];
      return { sessionid: 'CNS-' + (3001+i), patientname: 'Patient ' + (i+1), topic: topics[i], pharmacist: 'Pharm. David', duration: statuses[i]==='Completed'?'15 mins':'-', status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/services/delivery', title: 'Home Delivery Tracking', desc: 'Management of medication dispatch and delivery to patient homes.',
    cols: ['Delivery ID', 'Patient Name', 'Address', 'Driver Assigned', 'Expected Delivery', 'Status'],
    stats: [{ label: 'Deliveries Today', val: '45', col: 'text-blue-400' }, { label: 'Delivered', val: '30', col: 'text-emerald-400' }, { label: 'Out for Delivery', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Out for Delivery', 'Delivered', 'Pending Dispatch', 'Delivered', 'Out for Delivery'];
      return { deliveryid: 'DEL-' + (4001+i), patientname: 'Patient ' + (i+1), address: '123 Main St, Apt ' + i, driverassigned: statuses[i]==='Pending Dispatch'?'-':'Driver Mike', expecteddelivery: 'By 5:00 PM', status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/services/reminders', title: 'Medication Reminders', desc: 'Automated SMS/Email reminders for pill schedules and refill dates.',
    cols: ['Patient Name', 'Message Type', 'Drug Name', 'Sent Time', 'Patient Response', 'Status'],
    stats: [{ label: 'Reminders Sent Today', val: '450', col: 'text-blue-400' }, { label: 'Delivery Rate', val: '99%', col: 'text-emerald-400' }, { label: 'Failed SMS', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Refill Reminder', 'Dose Reminder', 'Dose Reminder', 'Refill Reminder', 'Pickup Reminder'];
      const statuses = ['Sent', 'Sent', 'Failed', 'Sent', 'Sent'];
      return { patientname: 'Patient ' + (i+1), messagetype: types[i], drugname: 'Thyroxine', senttime: '08:00 AM', patientresponse: 'None', status: statuses[i] };
    })`
  },

  // Inventory Operations
  {
    path: 'pharmacy/operations/transfer', title: 'Inter-store Transfers', desc: 'Moving stock from the main pharmacy store to sub-stores or ward stocks.',
    cols: ['Transfer ID', 'From Store', 'To Store', 'Total Items', 'Requested By', 'Status'],
    stats: [{ label: 'Pending Transfers', val: '12', col: 'text-amber-400' }, { label: 'Completed Today', val: '45', col: 'text-emerald-400' }, { label: 'Transit Discrepancy', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Dispatched', 'Received', 'Pending', 'Received', 'Dispatched'];
      return { transferid: 'TRF-' + (1001+i), fromstore: 'Main Store', tostore: 'ER Pharmacy', totalitems: (5+i*2).toString(), requestedby: 'Pharm. ER', status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/operations/issue', title: 'Department Issue', desc: 'Issuing bulk consumables and floor stock directly to hospital departments.',
    cols: ['Issue ID', 'Department', 'Items Issued', 'Total Value', 'Received By', 'Status'],
    stats: [{ label: 'Issues Today', val: '24', col: 'text-blue-400' }, { label: 'Total Value Issued', val: '$8,450', col: 'text-amber-400' }, { label: 'Pending Requests', val: '4', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['ICU', 'General Ward A', 'OT 1', 'ER', 'Labor Room'];
      const statuses = ['Issued', 'Pending Authorization', 'Issued', 'Issued', 'Draft'];
      return { issueid: 'DPI-' + (2001+i), department: depts[i], itemsissued: (10+i*5).toString(), totalvalue: '$' + (500+i*100), receivedby: statuses[i]==='Issued'?'Nurse Head':'-', status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/operations/return', title: 'Department Returns', desc: 'Receiving excess or near-expiry floor stock back from departments.',
    cols: ['Return ID', 'Department', 'Items Returned', 'Reason', 'Restocked Value', 'Status'],
    stats: [{ label: 'Returns Processing', val: '3', col: 'text-amber-400' }, { label: 'Value Recovered', val: '$1,200', col: 'text-emerald-400' }, { label: 'Discarded', val: '$50', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Restocked', 'Pending QA', 'Discarded', 'Restocked', 'Restocked'];
      return { returnid: 'DPR-' + (3001+i), department: 'Ward ' + (i+1), itemsreturned: (5+i).toString(), reason: 'Excess Stock', restockedvalue: '$' + (100+i*20), status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/operations/audit', title: 'Pharmacy Audits', desc: 'Formal periodic audits of physical stock against system records.',
    cols: ['Audit ID', 'Category Audited', 'Total Items', 'Discrepancies Found', 'Auditor', 'Status'],
    stats: [{ label: 'Scheduled Audits', val: '2', col: 'text-blue-400' }, { label: 'Discrepancy Value', val: '-$15', col: 'text-emerald-400' }, { label: 'Completed (Month)', val: '8', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In Progress', 'Completed', 'Completed', 'Scheduled', 'Completed'];
      return { auditid: 'ADT-' + (4001+i), categoryaudited: 'Antibiotics Rack ' + (i+1), totalitems: '150', discrepanciesfound: statuses[i]==='Completed'?'2':'-', auditor: 'Lead Pharmacist', status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/operations/cycle-count', title: 'Daily Cycle Counts', desc: 'Continuous partial stocktakes (ABC analysis) to maintain inventory accuracy.',
    cols: ['Count ID', 'Location/Bin', 'Expected Qty', 'Counted Qty', 'Variance', 'Status'],
    stats: [{ label: 'Bins Counted Today', val: '45', col: 'text-blue-400' }, { label: 'Accuracy Rate', val: '98.5%', col: 'text-emerald-400' }, { label: 'Variances Pending Auth', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const counted = (100 - i%2);
      const statuses = counted === 100 ? 'Matched' : 'Variance Logged';
      return { countid: 'CYC-' + (5001+i), locationbin: 'Aisle 2, Bin ' + i, expectedqty: '100', countedqty: counted.toString(), variance: counted===100?'0':'-1', status: statuses };
    })`
  },

  // Quality & Compliance
  {
    path: 'pharmacy/quality/expired', title: 'Expired Drugs Disposal', desc: 'Regulatory tracking and documentation of the destruction of expired medicines.',
    cols: ['Disposal ID', 'Date', 'Total Items', 'Total Value', 'Witnessed By', 'Status'],
    stats: [{ label: 'Pending Disposal', val: '120 Items', col: 'text-amber-400' }, { label: 'Disposed (YTD)', val: '$4,500', col: 'text-gray-400' }, { label: 'Compliance Logs', val: 'Up to Date', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Destroyed', 'Pending Agency', 'Destroyed', 'Destroyed', 'Pending Approval'];
      return { disposalid: 'DSP-' + (1001+i), date: '30 Jun 2026', totalitems: (15+i*5).toString(), totalvalue: '$' + (300+i*50), witnessedby: statuses[i]==='Destroyed'?'Dr. Admin':'-', status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/quality/recall', title: 'Drug Recall Management', desc: 'Managing manufacturer alerts and pulling affected batches from all locations.',
    cols: ['Recall ID', 'Medicine Name', 'Batch No', 'Affected Qty Located', 'Vendor Notified', 'Status'],
    stats: [{ label: 'Active Recalls', val: '1', col: 'text-red-400' }, { label: 'Quarantined Qty', val: '450', col: 'text-amber-400' }, { label: 'Returned to Vendor', val: '3', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Quarantined', 'Returned to Vendor', 'Returned to Vendor', 'Quarantined', 'Closed'];
      return { recallid: 'RCL-' + (2001+i), medicinename: 'Ranitidine 150mg', batchno: 'BTH-REC' + i, affectedqtylocated: (100+i*50).toString(), vendornotified: 'Yes', status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/quality/temperature', title: 'Temperature Logging', desc: 'Digital logs for pharmacy refrigerators and ambient room temperatures.',
    cols: ['Log Time', 'Equipment', 'Current Temp', 'Min/Max (24h)', 'Alerts Triggered', 'Status'],
    stats: [{ label: 'Monitored Fridges', val: '12', col: 'text-blue-400' }, { label: 'Current Alarms', val: '0', col: 'text-emerald-400' }, { label: 'Excursions (Month)', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { logtime: '14:' + (10+i), equipment: 'Vaccine Fridge ' + (1+i), currenttemp: (4 + i*0.2).toFixed(1) + ' °C', minmax24h: '3.5 / 5.2 °C', alertstriggered: 'None', status: 'Optimal' };
    })`
  },
  {
    path: 'pharmacy/quality/cold-chain', title: 'Cold Chain Management', desc: 'Tracking temperature-sensitive drugs (vaccines, insulin) from receipt to dispensing.',
    cols: ['Item Name', 'Batch No', 'Received Temp', 'Current Storage', 'Time Out of Fridge', 'Status'],
    stats: [{ label: 'Cold Chain Items', val: '340', col: 'text-blue-400' }, { label: 'Breaches', val: '0', col: 'text-emerald-400' }, { label: 'Deliveries In Transit', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Insulin Glargine', batchno: 'BTH-CC' + i, receivedtemp: '4.5 °C', currentstorage: 'Fridge A', timeoutoffridge: '0 mins', status: 'Maintained' };
    })`
  },
  {
    path: 'pharmacy/quality/compliance', title: 'Regulatory Compliance', desc: 'Tracking pharmacy licenses, pharmacist registrations, and regulatory filings.',
    cols: ['Document Name', 'Issuing Authority', 'Valid From', 'Expiry Date', 'Days to Expire', 'Status'],
    stats: [{ label: 'Active Licenses', val: '8', col: 'text-blue-400' }, { label: 'Renewals Due', val: '1', col: 'text-amber-400' }, { label: 'Inspections Passed', val: '100%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const docs = ['State Pharmacy License', 'Narcotics Handling Permit', 'Trade License', 'Fire Safety Certificate', 'Pharmacist Reg (Jane)'];
      const statuses = i === 1 ? 'Expiring Soon' : 'Valid';
      return { documentname: docs[i], issuingauthority: 'State Govt.', validfrom: '01 Jan 2024', expirydate: '31 Dec 2026', daystoexpire: i===1?'45':'180', status: statuses };
    })`
  },

  // Reports
  {
    path: 'pharmacy/reports/sales', title: 'Sales Report', desc: 'Daily, weekly, and monthly revenue analysis across all billing counters.',
    cols: ['Date', 'Total Bills', 'OPD Revenue', 'IPD Revenue', 'Total Revenue', 'Status'],
    stats: [{ label: 'Revenue (MTD)', val: '$345,000', col: 'text-blue-400' }, { label: 'Growth vs Last Mo', val: '+5.2%', col: 'text-emerald-400' }, { label: 'Avg Bill Value', val: '$45', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: '0' + (1+i) + ' Jul 2026', totalbills: (400+i*20).toString(), opdrevenue: '$' + (8000+i*500), ipdrevenue: '$' + (4000+i*200), totalrevenue: '$' + (12000+i*700), status: 'Generated' };
    })`
  },
  {
    path: 'pharmacy/reports/medicine-sales', title: 'Medicine Sales Report', desc: 'Detailed report showing exact quantities and revenue generated per medicine.',
    cols: ['Medicine Name', 'Category', 'Qty Sold', 'Revenue', 'Profit Margin', 'Status'],
    stats: [{ label: 'Top Selling Item', val: 'Paracetamol 500mg', col: 'text-emerald-400' }, { label: 'Highest Revenue', val: 'Meropenem 1g', col: 'text-blue-400' }, { label: 'Low Margin Items', val: '45', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { medicinename: 'Medicine ' + (i+1), category: 'Antibiotics', qtysold: (1000-i*150).toString(), revenue: '$' + (5000-i*500), profitmargin: (25+i) + '%', status: 'Generated' };
    })`
  },
  {
    path: 'pharmacy/reports/stock', title: 'Stock Valuation Report', desc: 'Financial valuation of current inventory based on purchase price and MRP.',
    cols: ['Category', 'Total Items', 'Current Qty', 'Purchase Value', 'MRP Value', 'Status'],
    stats: [{ label: 'Total Purchase Value', val: '$450,000', col: 'text-blue-400' }, { label: 'Total MRP Value', val: '$680,000', col: 'text-emerald-400' }, { label: 'Projected Profit', val: '$230,000', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const categories = ['Antibiotics', 'Cardiovascular', 'Analgesics', 'Surgical Consumables', 'Vitamins'];
      return { category: categories[i], totalitems: (150+i*20).toString(), currentqty: (5000+i*1000).toString(), purchasevalue: '$' + (80000-i*10000), mrpvalue: '$' + (120000-i*15000), status: 'Generated' };
    })`
  },
  {
    path: 'pharmacy/reports/expiry', title: 'Expiry Analysis Report', desc: 'Financial impact analysis of medicines expired and nearing expiry.',
    cols: ['Month', 'Expired Value', 'Returned for Credit', 'Net Loss', 'Alerts Triggered', 'Status'],
    stats: [{ label: 'YTD Net Loss', val: '$1,200', col: 'text-red-400' }, { label: 'Successfully Returned', val: '$5,400', col: 'text-emerald-400' }, { label: 'Expiry Rate', val: '0.8%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      return { month: months[i] + ' 2026', expiredvalue: '$' + (500+i*50), returnedforcredit: '$' + (400+i*40), netloss: '$' + (100+i*10), alertstriggered: (15+i).toString(), status: 'Generated' };
    })`
  },
  {
    path: 'pharmacy/reports/purchase', title: 'Purchase & Vendor Report', desc: 'Summary of all purchases made, vendor performance, and outstanding payables.',
    cols: ['Vendor Name', 'POs Raised', 'Total Purchase Value', 'GRN Value', 'Pending Payments', 'Status'],
    stats: [{ label: 'Total Purchases (MTD)', val: '$120,000', col: 'text-blue-400' }, { label: 'Outstanding Payables', val: '$45,000', col: 'text-amber-400' }, { label: 'Vendor Returns', val: '$2,100', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { vendorname: 'Pharma Dist ' + (i+1), posraised: (10+i).toString(), totalpurchasevalue: '$' + (25000-i*2000), grnvalue: '$' + (24000-i*2000), pendingpayments: '$' + (5000+i*500), status: 'Generated' };
    })`
  },
  {
    path: 'pharmacy/reports/dispensing', title: 'Dispensing Efficiency Report', desc: 'Metrics on prescription wait times, pharmacist workload, and dispensing errors.',
    cols: ['Pharmacist', 'Prescriptions Dispensed', 'Avg Turnaround', 'Errors Caught', 'Patient Rating', 'Status'],
    stats: [{ label: 'Avg Dispense Time', val: '6.5 mins', col: 'text-emerald-400' }, { label: 'Total Prescriptions', val: '12,450', col: 'text-blue-400' }, { label: 'Near-miss Errors', val: '14', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { pharmacist: 'Pharm. Staff ' + (i+1), prescriptionsdispensed: (2500-i*200).toString(), avgturnaround: (5+i) + ' mins', errorscaught: (10-i).toString(), patientrating: (4.8 - i*0.1).toFixed(1) + '/5', status: 'Generated' };
    })`
  },
  {
    path: 'pharmacy/reports/controlled', title: 'Controlled Drugs Usage Report', desc: 'Regulatory compliance report detailing the movement of all narcotics.',
    cols: ['Drug Name', 'Opening Qty', 'Received', 'Dispensed to Patients', 'Issued to Wards', 'Status'],
    stats: [{ label: 'Narcotic Scripts', val: '340', col: 'text-blue-400' }, { label: 'Audits Passed', val: '100%', col: 'text-emerald-400' }, { label: 'Unaccounted', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const drugs = ['Morphine 10mg', 'Fentanyl 50mcg', 'Midazolam 5mg', 'Ketamine', 'Tramadol 50mg'];
      return { drugname: drugs[i], openingqty: '500', received: '200', dispensedtopatients: '150', issuedtowards: '100', status: 'Balanced' };
    })`
  },
  {
    path: 'pharmacy/reports/pl', title: 'Pharmacy P&L Statement', desc: 'Overall Profit and Loss statement for the pharmacy department.',
    cols: ['Month', 'Gross Revenue', 'Cost of Goods Sold (COGS)', 'Operating Expenses', 'Net Profit', 'Status'],
    stats: [{ label: 'Net Profit Margin', val: '28.4%', col: 'text-emerald-400' }, { label: 'Revenue Growth', val: '+4.2%', col: 'text-blue-400' }, { label: 'OpEx Ratio', val: '12%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      return { month: months[i] + ' 2026', grossrevenue: '$' + (150000+i*5000), costofgoodssoldcogs: '$' + (90000+i*3000), operatingexpenses: '$' + (18000+i*500), netprofit: '$' + (42000+i*1500), status: 'Generated' };
    })`
  },
  {
    path: 'pharmacy/reports/valuation', title: 'Inventory Valuation', desc: 'Detailed breakdown of inventory asset value by category and location.',
    cols: ['Location/Store', 'Antibiotics Value', 'Chronic Meds Value', 'Consumables Value', 'Total Value', 'Status'],
    stats: [{ label: 'Total Asset Value', val: '$680,500', col: 'text-blue-400' }, { label: 'Main Store %', val: '75%', col: 'text-gray-400' }, { label: 'Ward Stocks', val: '$45,000', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const locations = ['Main Pharmacy', 'OPD Pharmacy', 'ER Pharmacy', 'ICU Stock', 'Ward A Stock'];
      return { locationstore: locations[i], antibioticsvalue: '$' + (50000-i*10000), chronicmedsvalue: '$' + (80000-i*15000), consumablesvalue: '$' + (20000-i*3000), totalvalue: '$' + (150000-i*28000), status: 'Generated' };
    })`
  },

  // Analytics
  {
    path: 'pharmacy/analytics/fast-moving', title: 'Fast Moving Goods', desc: 'Analysis of high-turnover medicines to optimize reorder levels and prevent stockouts.',
    cols: ['Medicine Name', 'Daily Avg Consumption', 'Current Stock', 'Days of Stock Left', 'Reorder Suggestion', 'Status'],
    stats: [{ label: 'Fast Moving Items', val: '145', col: 'text-blue-400' }, { label: 'Stockouts Averted', val: '12', col: 'text-emerald-400' }, { label: 'Urgent Reorders', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Optimal Stock', 'Optimal Stock', 'Reorder Now', 'Optimal Stock', 'Reorder Now'];
      return { medicinename: 'Popular Drug ' + (i+1), dailyavgconsumption: (100-i*10).toString(), currentstock: statuses[i]==='Reorder Now'?'150':'800', daysofstockleft: statuses[i]==='Reorder Now'?'1.5 Days':'8 Days', reordersuggestion: 'Order ' + (1000-i*100), status: statuses[i] };
    })`
  },
  {
    path: 'pharmacy/analytics/slow-moving', title: 'Slow Moving Goods', desc: 'Identifying low-turnover stock to prevent expiration and free up capital.',
    cols: ['Medicine Name', 'Last Sold Date', 'Current Stock', 'Value Locked', 'Suggested Action', 'Status'],
    stats: [{ label: 'Slow Moving Items', val: '320', col: 'text-amber-400' }, { label: 'Capital Locked', val: '$15,400', col: 'text-red-400' }, { label: 'Liquidated (Mo)', val: '$2,100', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const actions = ['Return to Vendor', 'Discount Offer', 'Transfer to Ward', 'Return to Vendor', 'Hold'];
      return { medicinename: 'Rare Drug ' + (i+1), lastsolddate: '01 Jan 2026', currentstock: (50-i*5).toString(), valuelocked: '$' + (1500-i*100), suggestedaction: actions[i], status: 'Action Required' };
    })`
  },
  {
    path: 'pharmacy/analytics/abc', title: 'ABC Analysis', desc: 'Categorizing inventory by consumption value (A=High, B=Medium, C=Low Value).',
    cols: ['Category', 'Item Count', '% of Total Items', 'Consumption Value', '% of Total Value', 'Status'],
    stats: [{ label: 'A-Class Items', val: '15%', col: 'text-blue-400' }, { label: 'A-Class Value', val: '70%', col: 'text-emerald-400' }, { label: 'C-Class Items', val: '55%', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 3 }).map((_, i) => {
      const cats = ['A (High Value, Tight Control)', 'B (Medium Value, Normal Control)', 'C (Low Value, Loose Control)'];
      const items = ['15%', '30%', '55%'];
      const values = ['70%', '20%', '10%'];
      return { category: cats[i], itemcount: (1500+i*2000).toString(), oftotalitems: items[i], consumptionvalue: '$' + (450000/(i+1)).toFixed(0), oftotalvalue: values[i], status: 'Analyzed' };
    })`
  },
  {
    path: 'pharmacy/analytics/xyz', title: 'XYZ Analysis', desc: 'Categorizing inventory by predictability of demand (X=Steady, Y=Variable, Z=Erratic).',
    cols: ['Category', 'Item Count', 'Demand Predictability', 'Buffer Stock Policy', 'Stockout Risk', 'Status'],
    stats: [{ label: 'X-Class (Steady)', val: '45%', col: 'text-emerald-400' }, { label: 'Z-Class (Erratic)', val: '15%', col: 'text-amber-400' }, { label: 'Optimization Opportunities', val: '120 Items', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 3 }).map((_, i) => {
      const cats = ['X (Steady/Predictable)', 'Y (Variable/Seasonal)', 'Z (Erratic/Unpredictable)'];
      const risks = ['Low', 'Medium', 'High'];
      return { category: cats[i], itemcount: (4500-i*1500).toString(), demandpredictability: cats[i].split('(')[1].replace(')',''), bufferstockpolicy: i===0?'Minimal':'High', stockoutrisk: risks[i], status: 'Analyzed' };
    })`
  },
  {
    path: 'pharmacy/analytics/consumption', title: 'Consumption Trends', desc: 'Department-wise and doctor-wise medicine prescribing and consumption patterns.',
    cols: ['Department', 'Top Prescribed Drug', 'Avg Cost per Rx', 'Generic Prescribing %', 'Trend (vs Last Mo)', 'Status'],
    stats: [{ label: 'Overall Generic %', val: '68%', col: 'text-emerald-400' }, { label: 'Costliest Dept', val: 'Oncology', col: 'text-amber-400' }, { label: 'Avg Rx Cost', val: '$28', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Oncology'];
      return { department: depts[i], topprescribeddrug: 'Drug ' + (i+1), avgcostperrx: '$' + (15+i*20), genericprescribing: (80-i*10) + '%', trendvslastmo: i%2===0?'+5%':'-2%', status: 'Active' };
    })`
  },
  {
    path: 'pharmacy/analytics/performance', title: 'Pharmacy Performance', desc: 'Executive dashboard tracking revenue, profit margins, and operational KPIs.',
    cols: ['Metric', 'Current Month', 'Target', 'Variance', 'YTD Average', 'Status'],
    stats: [{ label: 'Overall Score', val: '92/100', col: 'text-emerald-400' }, { label: 'Revenue Target', val: 'Achieved', col: 'text-emerald-400' }, { label: 'Inventory Turnover', val: '12x', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Gross Revenue', 'Net Profit Margin', 'Inventory Turnover Ratio', 'Stockout Rate', 'Prescription Error Rate'];
      const currents = ['$450,000', '28.4%', '12', '1.2%', '0.05%'];
      const targets = ['$420,000', '25.0%', '10', '< 2.0%', '< 0.1%'];
      return { metric: metrics[i], currentmonth: currents[i], target: targets[i], variance: 'Positive', ytdaverage: targets[i], status: 'Met Target' };
    })`
  },

  // Settings
  {
    path: 'pharmacy/settings/profile', title: 'Pharmacy Profile', desc: 'Basic pharmacy details, license numbers, and operating hours.',
    cols: ['Setting', 'Description', 'Current Value', 'Last Updated', 'Updated By', 'Status'],
    stats: [{ label: 'Profile Status', val: 'Complete', col: 'text-emerald-400' }, { label: 'Licenses', val: 'Validated', col: 'text-blue-400' }, { label: 'Next Renewal', val: '31 Dec', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const settings = ['Pharmacy Name', 'License Number', 'Operating Hours', 'Emergency Contact', 'Chief Pharmacist'];
      const values = ['MedixPro Main Pharmacy', 'DL-2026-98765', '24x7', '+1 800 123 4567', 'Jane Doe, Pharm.D'];
      return { setting: settings[i], description: 'System config', currentvalue: values[i], lastupdated: '01 Jan 2026', updatedby: 'Admin', status: 'Active' };
    })`
  },
  {
    path: 'pharmacy/settings/categories', title: 'Medicine Categories', desc: 'Configure and manage therapeutic and operational drug categories.',
    cols: ['Category ID', 'Category Name', 'Sub-categories', 'Items Mapped', 'Storage Rule', 'Status'],
    stats: [{ label: 'Total Categories', val: '45', col: 'text-blue-400' }, { label: 'Cold Chain Categories', val: '3', col: 'text-amber-400' }, { label: 'Narcotic Categories', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Antibiotics', 'Vaccines (Cold Chain)', 'Narcotics (Sch X)', 'IV Fluids', 'Surgical Consumables'];
      return { categoryid: 'CAT-' + (1001+i), categoryname: cats[i], subcategories: (5+i).toString(), itemsmapped: (200+i*50).toString(), storagerule: cats[i].includes('Cold')?'2-8 °C':'Ambient', status: 'Active' };
    })`
  },
  {
    path: 'pharmacy/settings/units', title: 'Units of Measurement', desc: 'Define pack sizes, strips, vials, and base dispensing units.',
    cols: ['Unit ID', 'Unit Name', 'Abbreviation', 'Base Unit Conversion', 'Used In', 'Status'],
    stats: [{ label: 'Total Units Defined', val: '24', col: 'text-blue-400' }, { label: 'Most Used Unit', val: 'Strip (10 Tab)', col: 'text-emerald-400' }, { label: 'Custom Packs', val: '5', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const units = ['Tablet', 'Strip (10s)', 'Box (10 Strips)', 'Vial', 'Bottle (100ml)'];
      const bases = ['1 Tab', '10 Tabs', '100 Tabs', '1 Vial', '1 Bottle'];
      return { unitid: 'UOM-' + (2001+i), unitname: units[i], abbreviation: units[i].split(' ')[0], baseunitconversion: bases[i], usedin: 'Dispensing/Purchase', status: 'Active' };
    })`
  },
  {
    path: 'pharmacy/settings/tax', title: 'Tax Configurations', desc: 'GST/VAT slabs mapping for different categories of medicines and consumables.',
    cols: ['Tax Code', 'Tax Name', 'Percentage (%)', 'Applied Categories', 'Exemptions', 'Status'],
    stats: [{ label: 'Tax Slabs', val: '4', col: 'text-blue-400' }, { label: 'Exempt Items', val: '340', col: 'text-emerald-400' }, { label: 'Max Tax Bracket', val: '18%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 4 }).map((_, i) => {
      const percentages = ['0%', '5%', '12%', '18%'];
      return { taxcode: 'TAX-' + i, taxname: 'GST ' + percentages[i], percentage: percentages[i], appliedcategories: (10+i) + ' Categories', exemptions: i===0?'Life-saving Drugs':'None', status: 'Active' };
    })`
  },
  {
    path: 'pharmacy/settings/discount', title: 'Discount Rules', desc: 'Configure automatic discounts for staff, senior citizens, or specific item categories.',
    cols: ['Rule ID', 'Rule Name', 'Target Audience', 'Discount %', 'Max Limit', 'Status'],
    stats: [{ label: 'Active Rules', val: '8', col: 'text-blue-400' }, { label: 'Avg Discount Given', val: '4.5%', col: 'text-amber-400' }, { label: 'Total Discount (MTD)', val: '$4,200', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const rules = ['Staff Discount', 'Senior Citizen', 'Chronic Care Plan', 'OPD Campaign', 'Clearance (Near Expiry)'];
      const discounts = ['20%', '10%', '15%', '5%', '50%'];
      return { ruleid: 'DSC-' + (3001+i), rulename: rules[i], targetaudience: rules[i].split(' ')[0], discount: discounts[i], maxlimit: '$100 per bill', status: 'Active' };
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
        const isGood = val === 'Paid' || val === 'Approved' || val === 'Processed' || val === 'Clear' || val === 'Active' || val === 'Delivered' || val === 'Sent' || val === 'Received' || val === 'Issued' || val === 'Completed' || val === 'Matched' || val === 'Destroyed' || val === 'Closed' || val === 'Optimal' || val === 'Maintained' || val === 'Valid' || val === 'Generated' || val === 'Analyzed' || val === 'Met Target' || val === 'Within Limit' || val === 'Claim Submitted';
        const isWarning = val === 'Pending' || val === 'Pending Auth' || val === 'Partially Paid' || val === 'Pending Approval' || val === 'Pending Collection' || val === 'Overdue' || val === 'Scheduled' || val === 'Pending Dispatch' || val === 'Out for Delivery' || val === 'Pending QA' || val === 'Variance Logged' || val === 'Pending Agency' || val === 'Quarantined' || val === 'Expiring Soon' || val === 'Reorder Now' || val === 'Action Required' || val === 'Draft';
        const isNeutral = val === 'Unpaid' || val === 'Restocked' || val === 'Dispatched' || val === 'Returned to Vendor';
        const isDanger = val === 'Rejected' || val === 'Rejected (Not Covered)' || val === 'Exceeded Limit' || val === 'Patient Refused' || val === 'Failed' || val === 'Discarded';
        
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
