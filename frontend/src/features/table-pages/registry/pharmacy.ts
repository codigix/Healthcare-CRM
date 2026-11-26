import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/pharmacy/analytics/abc": {
    ui: 5,
    title: "ABC Analysis", description: "Categorizing inventory by consumption value (A=High, B=Medium, C=Low Value).",
    stats: [{ label: "A-Class Items", color: "text-blue-400", value: "15%" }, { label: "A-Class Value", color: "text-emerald-400", value: "70%" }, { label: "C-Class Items", color: "text-gray-400", value: "55%" }],
    columns: [["Category", "category"], ["Item Count", "itemcount"], ["% of Total Items", "oftotalitems"], ["Consumption Value", "consumptionvalue"], ["% of Total Value", "oftotalvalue"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 3 }).map((_, i) => {
        const cats = ['A (High Value, Tight Control)', 'B (Medium Value, Normal Control)', 'C (Low Value, Loose Control)'];
        const items = ['15%', '30%', '55%'];
        const values = ['70%', '20%', '10%'];
        return { category: cats[i], itemcount: (1500 + i * 2000).toString(), oftotalitems: items[i], consumptionvalue: '$' + (450000 / (i + 1)).toFixed(0), oftotalvalue: values[i], status: 'Analyzed' };
      }),
  },
  "/pharmacy/analytics/consumption": {
    ui: 5,
    title: "Consumption Trends", description: "Department-wise and doctor-wise medicine prescribing and consumption patterns.",
    stats: [{ label: "Overall Generic %", color: "text-emerald-400", value: "68%" }, { label: "Costliest Dept", color: "text-amber-400", value: "Oncology" }, { label: "Avg Rx Cost", color: "text-blue-400", value: "$28" }],
    columns: [["Department", "department"], ["Top Prescribed Drug", "topprescribeddrug"], ["Avg Cost per Rx", "avgcostperrx"], ["Generic Prescribing %", "genericprescribing"], ["Trend (vs Last Mo)", "trendvslastmo"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Oncology'];
        return { department: depts[i], topprescribeddrug: 'Drug ' + (i + 1), avgcostperrx: '$' + (15 + i * 20), genericprescribing: (80 - i * 10) + '%', trendvslastmo: i % 2 === 0 ? '+5%' : '-2%', status: 'Active' };
      }),
  },
  "/pharmacy/analytics/fast-moving": {
    ui: 5,
    title: "Fast Moving Goods", description: "Analysis of high-turnover medicines to optimize reorder levels and prevent stockouts.",
    stats: [{ label: "Fast Moving Items", color: "text-blue-400", value: "145" }, { label: "Stockouts Averted", color: "text-emerald-400", value: "12" }, { label: "Urgent Reorders", color: "text-red-400", value: "3" }],
    columns: [["Medicine Name", "medicinename"], ["Daily Avg Consumption", "dailyavgconsumption"], ["Current Stock", "currentstock"], ["Days of Stock Left", "daysofstockleft"], ["Reorder Suggestion", "reordersuggestion"]],
    badge: ["Status", "status", {"Optimal Stock":"gray","Reorder Now":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Optimal Stock', 'Optimal Stock', 'Reorder Now', 'Optimal Stock', 'Reorder Now'];
        return { medicinename: 'Popular Drug ' + (i + 1), dailyavgconsumption: (100 - i * 10).toString(), currentstock: statuses[i] === 'Reorder Now' ? '150' : '800', daysofstockleft: statuses[i] === 'Reorder Now' ? '1.5 Days' : '8 Days', reordersuggestion: 'Order ' + (1000 - i * 100), status: statuses[i] };
      }),
  },
  "/pharmacy/analytics/performance": {
    ui: 5,
    title: "Pharmacy Performance", description: "Executive dashboard tracking revenue, profit margins, and operational KPIs.",
    stats: [{ label: "Overall Score", color: "text-emerald-400", value: "92/100" }, { label: "Revenue Target", color: "text-emerald-400", value: "Achieved" }, { label: "Inventory Turnover", color: "text-blue-400", value: "12x" }],
    columns: [["Metric", "metric"], ["Current Month", "currentmonth"], ["Target", "target"], ["Variance", "variance"], ["YTD Average", "ytdaverage"]],
    badge: ["Status", "status", {"Met Target":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['Gross Revenue', 'Net Profit Margin', 'Inventory Turnover Ratio', 'Stockout Rate', 'Prescription Error Rate'];
        const currents = ['$450,000', '28.4%', '12', '1.2%', '0.05%'];
        const targets = ['$420,000', '25.0%', '10', '< 2.0%', '< 0.1%'];
        return { metric: metrics[i], currentmonth: currents[i], target: targets[i], variance: 'Positive', ytdaverage: targets[i], status: 'Met Target' };
      }),
  },
  "/pharmacy/analytics/slow-moving": {
    ui: 5,
    title: "Slow Moving Goods", description: "Identifying low-turnover stock to prevent expiration and free up capital.",
    stats: [{ label: "Slow Moving Items", color: "text-amber-400", value: "320" }, { label: "Capital Locked", color: "text-red-400", value: "$15,400" }, { label: "Liquidated (Mo)", color: "text-emerald-400", value: "$2,100" }],
    columns: [["Medicine Name", "medicinename"], ["Last Sold Date", "lastsolddate"], ["Current Stock", "currentstock"], ["Value Locked", "valuelocked"], ["Suggested Action", "suggestedaction"]],
    badge: ["Status", "status", {"Action Required":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const actions = ['Return to Vendor', 'Discount Offer', 'Transfer to Ward', 'Return to Vendor', 'Hold'];
        return { medicinename: 'Rare Drug ' + (i + 1), lastsolddate: '01 Jan 2026', currentstock: (50 - i * 5).toString(), valuelocked: '$' + (1500 - i * 100), suggestedaction: actions[i], status: 'Action Required' };
      }),
  },
  "/pharmacy/analytics/xyz": {
    ui: 5,
    title: "XYZ Analysis", description: "Categorizing inventory by predictability of demand (X=Steady, Y=Variable, Z=Erratic).",
    stats: [{ label: "X-Class (Steady)", color: "text-emerald-400", value: "45%" }, { label: "Z-Class (Erratic)", color: "text-amber-400", value: "15%" }, { label: "Optimization Opportunities", color: "text-blue-400", value: "120 Items" }],
    columns: [["Category", "category"], ["Item Count", "itemcount"], ["Demand Predictability", "demandpredictability"], ["Buffer Stock Policy", "bufferstockpolicy"], ["Stockout Risk", "stockoutrisk"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 3 }).map((_, i) => {
        const cats = ['X (Steady/Predictable)', 'Y (Variable/Seasonal)', 'Z (Erratic/Unpredictable)'];
        const risks = ['Low', 'Medium', 'High'];
        return { category: cats[i], itemcount: (4500 - i * 1500).toString(), demandpredictability: cats[i].split('(')[1].replace(')', ''), bufferstockpolicy: i === 0 ? 'Minimal' : 'High', stockoutrisk: risks[i], status: 'Analyzed' };
      }),
  },
  "/pharmacy/billing/corporate": {
    ui: 5,
    title: "Corporate Pharmacy Billing", description: "Managing credit bills and consolidated invoices for corporate tie-ups.",
    stats: [{ label: "Unbilled Amount", color: "text-amber-400", value: "$45,000" }, { label: "Invoices Sent", color: "text-blue-400", value: "12" }, { label: "Payments Received", color: "text-emerald-400", value: "$30,000" }],
    columns: [["Invoice ID", "invoiceid"], ["Corporate Partner", "corporatepartner"], ["Total Bills", "totalbills"], ["Invoice Amount", "invoiceamount"], ["Due Date", "duedate"]],
    badge: ["Status", "status", {"Unpaid":"blue","Paid":"emerald","Partially Paid":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Unpaid', 'Paid', 'Partially Paid', 'Unpaid', 'Paid'];
        return { invoiceid: 'CORP-' + (3001 + i), corporatepartner: 'Company ' + (i + 1), totalbills: (45 + i * 10).toString(), invoiceamount: '$' + (4500 + i * 1000), duedate: '15 Aug 2026', status: statuses[i] };
      }),
  },
  "/pharmacy/billing/credit": {
    ui: 5,
    title: "Credit Management", description: "Monitoring partial payments, pending dues, and staff credit limits.",
    stats: [{ label: "Total Outstanding", color: "text-red-400", value: "$8,500" }, { label: "Staff Credit", color: "text-blue-400", value: "$2,400" }, { label: "Recovered Today", color: "text-emerald-400", value: "$850" }],
    columns: [["Patient/Staff Name", "patientstaffname"], ["Category", "category"], ["Credit Limit", "creditlimit"], ["Outstanding Dues", "outstandingdues"], ["Last Paid Date", "lastpaiddate"]],
    badge: ["Status", "status", {"Within Limit":"emerald","Exceeded Limit":"red","Clear":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const categories = ['Hospital Staff', 'Long-term IPD', 'Hospital Staff', 'VIP Patient', 'Hospital Staff'];
        const statuses = ['Within Limit', 'Exceeded Limit', 'Within Limit', 'Within Limit', 'Clear'];
        return { patientstaffname: 'Person ' + (i + 1), category: categories[i], creditlimit: '$1000', outstandingdues: '$' + (200 + i * 250), lastpaiddate: '01 Jul 2026', status: statuses[i] };
      }),
  },
  "/pharmacy/billing/insurance": {
    ui: 5,
    title: "Insurance Pharmacy Billing", description: "Processing claims, co-pays, and pre-authorizations for insured patients.",
    stats: [{ label: "Pending Claims", color: "text-amber-400", value: "24" }, { label: "Approved Today", color: "text-emerald-400", value: "85" }, { label: "Rejected", color: "text-red-400", value: "2" }],
    columns: [["Claim ID", "claimid"], ["Patient Name", "patientname"], ["Insurance Provider", "insuranceprovider"], ["Claim Amount", "claimamount"], ["Co-Pay", "copay"]],
    badge: ["Status", "status", {"Approved":"emerald","Pending Auth":"amber","Rejected (Not Covered)":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const providers = ['Allianz', 'Cigna', 'Bupa', 'Aetna', 'Allianz'];
        const statuses = ['Approved', 'Pending Auth', 'Rejected (Not Covered)', 'Approved', 'Pending Auth'];
        return { claimid: 'CLM-' + (2001 + i), patientname: 'Patient ' + (i + 1), insuranceprovider: providers[i], claimamount: '$' + (150 + i * 50), copay: '$' + (20 + i * 5), status: statuses[i] };
      }),
  },
  "/pharmacy/billing/pharmacy": {
    ui: 5,
    title: "Direct Pharmacy Billing", description: "Point of sale billing for cash/card paying OPD and walk-in patients.",
    stats: [{ label: "Bills Today", color: "text-blue-400", value: "450" }, { label: "Total Revenue", color: "text-emerald-400", value: "$12,450" }, { label: "Pending Payment", color: "text-amber-400", value: "5" }],
    columns: [["Bill ID", "billid"], ["Patient Name", "patientname"], ["Items", "items"], ["Total Amount", "totalamount"], ["Payment Mode", "paymentmode"]],
    badge: ["Status", "status", {"Paid":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Paid', 'Paid', 'Pending', 'Paid', 'Paid'];
        return { billid: 'BIL-' + (1001 + i), patientname: 'Patient ' + (i + 1), items: (2 + i).toString(), totalamount: '$' + (40 + i * 15), paymentmode: statuses[i] === 'Paid' ? 'Card' : '-', status: statuses[i] };
      }),
  },
  "/pharmacy/billing/refunds": {
    ui: 5,
    title: "Pharmacy Refunds", description: "Processing cash/card refunds for returned medicines against original bills.",
    stats: [{ label: "Pending Refunds", color: "text-amber-400", value: "8" }, { label: "Refunded Today", color: "text-emerald-400", value: "15" }, { label: "Total Value", color: "text-blue-400", value: "$450" }],
    columns: [["Refund ID", "refundid"], ["Original Bill", "originalbill"], ["Patient Name", "patientname"], ["Refund Amount", "refundamount"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Processed":"emerald","Pending Approval":"amber","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Processed', 'Pending Approval', 'Processed', 'Rejected', 'Processed'];
        return { refundid: 'RFD-' + (5001 + i), originalbill: 'BIL-' + (1000 + i), patientname: 'Patient ' + (i + 1), refundamount: '$' + (15 + i * 10), reason: 'Allergy / Returned', status: statuses[i] };
      }),
  },
  "/pharmacy/billing/scheme": {
    ui: 5,
    title: "Govt. Scheme Billing", description: "Special billing for subsidized or free medicines under government health schemes.",
    stats: [{ label: "Scheme Patients", color: "text-blue-400", value: "120" }, { label: "Govt. Receivable", color: "text-amber-400", value: "$15,200" }, { label: "Dispensed", color: "text-emerald-400", value: "115" }],
    columns: [["Scheme ID", "schemeid"], ["Patient Name", "patientname"], ["Scheme Name", "schemename"], ["Subsidized Amount", "subsidizedamount"], ["Patient Share", "patientshare"]],
    badge: ["Status", "status", {"Claim Submitted":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const schemes = ['National Health Scheme', 'Senior Citizen Care', 'Maternity Benefit', 'National Health Scheme', 'Veterans Aid'];
        return { schemeid: 'SCH-' + (4001 + i), patientname: 'Patient ' + (i + 1), schemename: schemes[i], subsidizedamount: '$' + (100 + i * 20), patientshare: '$' + (10 + i * 5), status: 'Claim Submitted' };
      }),
  },
  "/pharmacy/clinical/allergy": {
    ui: 5,
    title: "Allergy Alerts", description: "Alerts when a prescribed drug conflicts with a patient's known allergies.",
    stats: [{ label: "Allergy Alerts (Month)", color: "text-red-400", value: "45" }, { label: "Prescriptions Stopped", color: "text-emerald-400", value: "40" }, { label: "Anaphylaxis Risk", color: "text-red-400", value: "5" }],
    columns: [["Alert ID", "alertid"], ["Patient Name", "patientname"], ["Allergen", "allergen"], ["Prescribed Drug", "prescribeddrug"], ["Reaction Type", "reactiontype"]],
    badge: ["Status", "status", {"Alternative Prescribed":"emerald","Pending Clarification":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Alternative Prescribed', 'Alternative Prescribed', 'Pending Clarification', 'Alternative Prescribed', 'Alternative Prescribed'];
        return { alertid: 'ALG-' + (2001 + i), patientname: 'Patient ' + (i + 1), allergen: 'Penicillin', prescribeddrug: 'Amoxicillin', reactiontype: 'Hives/Rash', status: statuses[i] };
      }),
  },
  "/pharmacy/clinical/antibiotic": {
    ui: 5,
    title: "Antibiotic Stewardship", description: "Monitoring restricted antibiotics, culture sensitivities, and de-escalation.",
    stats: [{ label: "Patients on Reserve Abx", color: "text-amber-400", value: "18" }, { label: "De-escalated Today", color: "text-emerald-400", value: "4" }, { label: "Pending Culture", color: "text-gray-400", value: "6" }],
    columns: [["Patient Name", "patientname"], ["Department", "department"], ["Restricted Antibiotic", "restrictedantibiotic"], ["Days on Drug", "daysondrug"], ["Culture Result", "cultureresult"]],
    badge: ["Status", "status", {"Pending Culture":"amber","Sensitive (Continue)":"emerald","Resistant (Change)":"red","De-escalated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const drugs = ['Meropenem', 'Colistin', 'Linezolid', 'Tigecycline', 'Polymyxin B'];
        const statuses = ['Pending Culture', 'Sensitive (Continue)', 'Resistant (Change)', 'De-escalated', 'Pending Culture'];
        return { patientname: 'Patient ' + (i + 1), department: 'ICU', restrictedantibiotic: drugs[i], daysondrug: (2 + i).toString(), cultureresult: statuses[i].includes('Pending') ? 'Pending' : statuses[i], status: statuses[i] };
      }),
  },
  "/pharmacy/clinical/duplicate": {
    ui: 5,
    title: "Duplicate Therapy", description: "Warnings for multiple drugs prescribed from the same therapeutic class.",
    stats: [{ label: "Duplicates Detected", color: "text-amber-400", value: "15" }, { label: "Polypharmacy Cases", color: "text-red-400", value: "4" }, { label: "Resolved", color: "text-emerald-400", value: "12" }],
    columns: [["Alert ID", "alertid"], ["Patient Name", "patientname"], ["Therapeutic Class", "therapeuticclass"], ["Drug 1", "drug1"], ["Drug 2", "drug2"]],
    badge: ["Status", "status", {"Dose Adjusted":"emerald","Drug Stopped":"emerald","Pending Clarification":"amber","Intentional (Overridden)":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Dose Adjusted', 'Drug Stopped', 'Pending Clarification', 'Intentional (Overridden)', 'Drug Stopped'];
        return { alertid: 'DUP-' + (3001 + i), patientname: 'Patient ' + (i + 1), therapeuticclass: 'NSAIDs', drug1: 'Ibuprofen', drug2: 'Diclofenac', status: statuses[i] };
      }),
  },
  "/pharmacy/clinical/high-risk": {
    ui: 5,
    title: "High Risk Medicines", description: "Special monitoring for narrow therapeutic index drugs (e.g., Digoxin, Insulin).",
    stats: [{ label: "Patients on High-Risk", color: "text-blue-400", value: "32" }, { label: "Toxicity Risk", color: "text-red-400", value: "2" }, { label: "Dose Optimized", color: "text-emerald-400", value: "28" }],
    columns: [["Patient Name", "patientname"], ["Ward", "ward"], ["High Risk Drug", "highriskdrug"], ["Latest Lab Value", "latestlabvalue"], ["Pharmacist Review", "pharmacistreview"]],
    badge: ["Status", "status", {"Safe":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const drugs = ['Insulin Infusion', 'Digoxin', 'Vancomycin', 'Heparin', 'Warfarin'];
        const labs = ['Glucose: 150', 'Dig level: 1.2', 'Trough: 15', 'APTT: 55', 'INR: 2.5'];
        return { patientname: 'Patient ' + (i + 1), ward: 'ICU ' + (1 + i), highriskdrug: drugs[i], latestlabvalue: labs[i], pharmacistreview: 'Reviewed today', status: 'Safe' };
      }),
  },
  "/pharmacy/clinical/interaction": {
    ui: 5,
    title: "Drug Interaction Check", description: "Automated warnings for drug-drug interactions in patient prescriptions.",
    stats: [{ label: "Alerts Today", color: "text-amber-400", value: "24" }, { label: "Severe (Red)", color: "text-red-400", value: "3" }, { label: "Overridden", color: "text-emerald-400", value: "18" }],
    columns: [["Alert ID", "alertid"], ["Patient Name", "patientname"], ["Drug A", "druga"], ["Drug B", "drugb"], ["Severity", "severity"]],
    badge: ["Status", "status", {"Overridden by Dr":"emerald","Prescription Modified":"emerald","Acknowledged":"emerald","Pending Clarification":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const severities = ['Moderate', 'Severe', 'Minor', 'Moderate', 'Severe'];
        const statuses = ['Overridden by Dr', 'Prescription Modified', 'Acknowledged', 'Overridden by Dr', 'Pending Clarification'];
        return { alertid: 'INT-' + (1001 + i), patientname: 'Patient ' + (i + 1), druga: 'Warfarin', drugb: 'Amiodarone', severity: severities[i], status: statuses[i] };
      }),
  },
  "/pharmacy/controlled/audit": {
    ui: 5,
    title: "Controlled Drug Audit", description: "Daily/Weekly physical count and audit logs for controlled substances.",
    stats: [{ label: "Audits This Month", color: "text-blue-400", value: "4" }, { label: "Passed", color: "text-emerald-400", value: "4" }, { label: "Regulatory Reports", color: "text-gray-400", value: "1" }],
    columns: [["Audit ID", "auditid"], ["Date", "date"], ["Audited By", "auditedby"], ["Items Checked", "itemschecked"], ["Discrepancies", "discrepancies"]],
    badge: ["Status", "status", {"Audit Passed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { auditid: 'AUD-' + (3001 + i), date: '0' + (1 + i) + ' Jul 2026', auditedby: 'Chief Pharmacist', itemschecked: '24', discrepancies: 'None', status: 'Audit Passed' };
      }),
  },
  "/pharmacy/controlled/issue": {
    ui: 5,
    title: "Controlled Drug Issue", description: "Logging the issuance of narcotics to OT and ICU against specific prescriptions.",
    stats: [{ label: "Issues Today", color: "text-amber-400", value: "18" }, { label: "Doctor Auth Pending", color: "text-emerald-400", value: "0" }, { label: "Empty Ampoules Rtd", color: "text-blue-400", value: "15" }],
    columns: [["Issue ID", "issueid"], ["Drug Name", "drugname"], ["Qty Issued", "qtyissued"], ["Issued To (Staff)", "issuedtostaff"], ["Patient/OT", "patientot"]],
    badge: ["Status", "status", {"Issued & Logged":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { issueid: 'CDI-' + (1001 + i), drugname: 'Fentanyl 50mcg', qtyissued: '2 Ampoules', issuedtostaff: 'Nurse Joy', patientot: 'OT 1 / Pat ' + (1 + i), status: 'Issued & Logged' };
      }),
  },
  "/pharmacy/controlled/narcotic": {
    ui: 5,
    title: "Narcotic Register", description: "Strict inventory ledger for Schedule X, H1, and narcotic drugs.",
    stats: [{ label: "Narcotic Items", color: "text-blue-400", value: "24" }, { label: "Total Value", color: "text-emerald-400", value: "$12,500" }, { label: "Discrepancies", color: "text-emerald-400", value: "0" }],
    columns: [["Drug Name", "drugname"], ["Opening Balance", "openingbalance"], ["Received", "received"], ["Issued", "issued"], ["Closing Balance", "closingbalance"]],
    badge: ["Status", "status", {"Balanced":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const drugs = ['Fentanyl Injection', 'Morphine 10mg', 'Ketamine', 'Midazolam', 'Tramadol'];
        return { drugname: drugs[i], openingbalance: '100', received: '0', issued: (5 + i).toString(), closingbalance: (95 - i).toString(), status: 'Balanced' };
      }),
  },
  "/pharmacy/controlled/returns": {
    ui: 5,
    title: "Controlled Drug Returns", description: "Logging empty ampoules or unused partial doses returned from wards.",
    stats: [{ label: "Returns Pending Verification", color: "text-amber-400", value: "3" }, { label: "Verified & Destroyed", color: "text-emerald-400", value: "12" }, { label: "Missing Ampoules", color: "text-emerald-400", value: "0" }],
    columns: [["Return ID", "returnid"], ["Drug Name", "drugname"], ["Empty Ampoules", "emptyampoules"], ["Unused Qty", "unusedqty"], ["Returned By", "returnedby"]],
    badge: ["Status", "status", {"Verified":"emerald","Pending Verification":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Verified', 'Pending Verification', 'Verified', 'Verified', 'Pending Verification'];
        return { returnid: 'CDR-' + (2001 + i), drugname: 'Morphine', emptyampoules: '2', unusedqty: '0.5 ml', returnedby: 'Nurse Lisa', status: statuses[i] };
      }),
  },
  "/pharmacy/dispensing/discharge": {
    ui: 5,
    title: "Discharge Medicines", description: "Bulk dispensing of take-home medications for patients leaving the hospital.",
    stats: [{ label: "Pending Discharges", color: "text-amber-400", value: "8" }, { label: "Ready for Pickup", color: "text-blue-400", value: "5" }, { label: "Completed", color: "text-emerald-400", value: "15" }],
    columns: [["Discharge ID", "dischargeid"], ["Patient Name", "patientname"], ["Ward", "ward"], ["Items", "items"], ["Counseling Done", "counselingdone"]],
    badge: ["Status", "status", {"Ready":"blue","Dispensing":"amber","Pending":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Ready', 'Dispensing', 'Pending', 'Completed', 'Completed'];
        return { dischargeid: 'DCG-' + (4001 + i), patientname: 'Patient ' + (i + 1), ward: 'Surgical Ward', items: (5 + i).toString(), counselingdone: statuses[i] === 'Completed' ? 'Yes' : 'No', status: statuses[i] };
      }),
  },
  "/pharmacy/dispensing/emergency": {
    ui: 5,
    title: "Emergency Dispensing", description: "Zero-delay dispensing for ER / Trauma / Code Blue requirements.",
    stats: [{ label: "ER Requests Today", color: "text-red-400", value: "24" }, { label: "Avg Dispatch TAT", color: "text-emerald-400", value: "2 mins" }, { label: "Stock Replaced", color: "text-blue-400", value: "20" }],
    columns: [["Emergency ID", "emergencyid"], ["Location", "location"], ["Requested Meds", "requestedmeds"], ["Time Requested", "timerequested"], ["Dispatch Time", "dispatchtime"]],
    badge: ["Status", "status", {"Dispatched":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const locs = ['ER Bay 1', 'Trauma OT', 'ICU Bed 4', 'ER Bay 2', 'Cath Lab'];
        const statuses = ['Dispatched', 'Dispatched', 'Pending', 'Dispatched', 'Dispatched'];
        return { emergencyid: 'EMG-' + (3001 + i), location: locs[i], requestedmeds: 'Epinephrine, Atropine', timerequested: '14:' + (10 + i), dispatchtime: statuses[i] === 'Dispatched' ? '14:' + (12 + i) : '-', status: statuses[i] };
      }),
  },
  "/pharmacy/dispensing/ipd": {
    ui: 5,
    title: "IPD Dispensing", description: "Ward orders, stat doses, and daily medication cart fills for admitted patients.",
    stats: [{ label: "Pending Indents", color: "text-amber-400", value: "18" }, { label: "STAT Orders", color: "text-red-400", value: "2" }, { label: "Dispatched", color: "text-emerald-400", value: "45" }],
    columns: [["Ward/Bed", "wardbed"], ["Patient Name", "patientname"], ["Order Type", "ordertype"], ["Indent ID", "indentid"], ["Requested By", "requestedby"]],
    badge: ["Status", "status", {"Processing":"amber","Dispatched":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Routine Fill', 'STAT Dose', 'PRN', 'Routine Fill', 'Discharge Meds'];
        const statuses = ['Processing', 'Dispatched', 'Pending', 'Dispatched', 'Processing'];
        return { wardbed: 'ICU-' + (1 + i), patientname: 'IPD Patient ' + (i + 1), ordertype: types[i], indentid: 'IND-' + (2001 + i), requestedby: 'Nurse Joy', status: statuses[i] };
      }),
  },
  "/pharmacy/dispensing/opd": {
    ui: 5,
    title: "OPD Dispensing", description: "Fast-track dispensing for outpatients and walk-in pharmacy customers.",
    stats: [{ label: "OPD Patients Today", color: "text-blue-400", value: "210" }, { label: "Avg Service Time", color: "text-emerald-400", value: "4 mins" }, { label: "Waiting", color: "text-amber-400", value: "12" }],
    columns: [["Token No", "tokenno"], ["Patient Name", "patientname"], ["Prescription ID", "prescriptionid"], ["Items Dispensed", "itemsdispensed"], ["Billed Amount", "billedamount"]],
    badge: ["Status", "status", {"Waiting":"amber","Dispensing":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Waiting', 'Dispensing', 'Completed', 'Completed', 'Waiting'];
        return { tokenno: 'TKN-' + (101 + i), patientname: 'OPD Patient ' + (i + 1), prescriptionid: 'RX-' + (1001 + i), itemsdispensed: (2 + i).toString(), billedamount: '$' + (20 + i * 10), status: statuses[i] };
      }),
  },
  "/pharmacy/dispensing/partial": {
    ui: 5,
    title: "Partial Dispensing", description: "Tracking prescriptions that were partially filled due to stock unavailability.",
    stats: [{ label: "Pending Fills", color: "text-amber-400", value: "12" }, { label: "Restocked Today", color: "text-emerald-400", value: "4" }, { label: "Patients Notified", color: "text-blue-400", value: "4" }],
    columns: [["Prescription ID", "prescriptionid"], ["Patient Name", "patientname"], ["Pending Items", "pendingitems"], ["Expected Restock", "expectedrestock"], ["Contact No", "contactno"]],
    badge: ["Status", "status", {"Awaiting Stock":"amber","Stock Arrived":"emerald","Notified":"emerald","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Awaiting Stock', 'Stock Arrived', 'Awaiting Stock', 'Notified', 'Completed'];
        return { prescriptionid: 'RX-' + (5001 + i), patientname: 'Patient ' + (i + 1), pendingitems: 'Insulin Glargine', expectedrestock: 'Tomorrow', contactno: '+12345678' + i, status: statuses[i] };
      }),
  },
  "/pharmacy/dispensing/return": {
    ui: 5,
    title: "Medicine Returns", description: "Processing returned medicines from wards (unused) or patients (allergies).",
    stats: [{ label: "Returns Today", color: "text-amber-400", value: "8" }, { label: "Restocked", color: "text-emerald-400", value: "6" }, { label: "Discarded", color: "text-red-400", value: "2" }],
    columns: [["Return ID", "returnid"], ["Source", "source"], ["Patient/Ward", "patientward"], ["Items Returned", "itemsreturned"], ["Refund Amount", "refundamount"]],
    badge: ["Status", "status", {"Restocked":"emerald","Pending QA":"amber","Discarded":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const sources = ['IPD Ward', 'OPD Patient', 'IPD Ward', 'ER', 'OPD Patient'];
        const statuses = ['Restocked', 'Pending QA', 'Discarded', 'Restocked', 'Restocked'];
        return { returnid: 'RET-' + (6001 + i), source: sources[i], patientward: 'John / Ward A', itemsreturned: (1 + i).toString(), refundamount: '$' + (15 + i * 5), status: statuses[i] };
      }),
  },
  "/pharmacy/inventory/adjustment": {
    ui: 5,
    title: "Stock Adjustments", description: "Manual corrections for physical vs system stock discrepancies.",
    stats: [{ label: "Adjustments (Month)", color: "text-amber-400", value: "24" }, { label: "Net Value Change", color: "text-red-400", value: "-$150" }, { label: "Approved", color: "text-emerald-400", value: "20" }],
    columns: [["Adj ID", "adjid"], ["Medicine Name", "medicinename"], ["System Qty", "systemqty"], ["Physical Qty", "physicalqty"], ["Difference", "difference"]],
    badge: ["Status", "status", {"Approved":"emerald","Pending Auth":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const diff = i % 2 === 0 ? -2 : 1;
        const statuses = ['Approved', 'Pending Auth', 'Approved', 'Approved', 'Pending Auth'];
        return { adjid: 'ADJ-' + (2001 + i), medicinename: 'Medicine ' + (i + 1), systemqty: '100', physicalqty: (100 + diff).toString(), difference: (diff > 0 ? '+' : '') + diff, status: statuses[i] };
      }),
  },
  "/pharmacy/inventory/availability": {
    ui: 5,
    title: "Stock Availability Search", description: "Quick tool for doctors/nurses to check if a specific drug/brand is available.",
    stats: [{ label: "Searches Today", color: "text-blue-400", value: "145" }, { label: "Found Rates", color: "text-emerald-400", value: "92%" }, { label: "Alt Substituted", color: "text-amber-400", value: "18" }],
    columns: [["Medicine Name", "medicinename"], ["Generic Name", "genericname"], ["Strength", "strength"], ["Available Qty", "availableqty"], ["Alternate Brands", "alternatebrands"]],
    badge: ["Status", "status", {"Available":"emerald","Out of Stock":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const avail = i === 2 ? '0' : (50 + i * 10).toString();
        const statuses = avail === '0' ? 'Out of Stock' : 'Available';
        return { medicinename: 'Brand Name ' + (i + 1), genericname: 'Paracetamol', strength: '500mg', availableqty: avail, alternatebrands: '2 Available', status: statuses };
      }),
  },
  "/pharmacy/inventory/batch": {
    ui: 5,
    title: "Batch Management", description: "Tracking multiple batches of the same medicine with different expiry/MRP.",
    stats: [{ label: "Active Batches", color: "text-blue-400", value: "8,200" }, { label: "Quarantined Batches", color: "text-red-400", value: "5" }, { label: "Newly Added", color: "text-emerald-400", value: "120" }],
    columns: [["Medicine Name", "medicinename"], ["Batch No", "batchno"], ["Received Date", "receiveddate"], ["Expiry Date", "expirydate"], ["Qty in Batch", "qtyinbatch"]],
    badge: ["Status", "status", {"Active":"emerald","Quarantined":"red","Consumed":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active', 'Active', 'Quarantined', 'Active', 'Consumed'];
        return { medicinename: 'Amoxicillin 500mg', batchno: 'BTH-90' + i, receiveddate: '01 Jan 2026', expirydate: '31 Dec 2027', qtyinbatch: (500 - i * 50).toString(), status: statuses[i] };
      }),
  },
  "/pharmacy/inventory/current": {
    ui: 5,
    title: "Current Stock", description: "Real-time master view of all medicines available in the main pharmacy.",
    stats: [{ label: "Total Items", color: "text-blue-400", value: "4,500" }, { label: "Value of Stock", color: "text-emerald-400", value: "$145,000" }, { label: "Out of Stock", color: "text-red-400", value: "24" }],
    columns: [["Item Code", "itemcode"], ["Medicine Name", "medicinename"], ["Category", "category"], ["Stock Qty", "stockqty"], ["Unit Location", "unitlocation"]],
    badge: ["Status", "status", {"In Stock":"emerald","Low Stock":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const categories = ['Antibiotics', 'Analgesics', 'Cardiovascular', 'Antidiabetic', 'Vitamins'];
        const qty = (100 - i * 20);
        const statuses = qty > 20 ? 'In Stock' : 'Low Stock';
        return { itemcode: 'MED-' + (1001 + i), medicinename: 'Medicine ' + (i + 1), category: categories[i], stockqty: qty.toString(), unitlocation: 'Rack A' + i, status: statuses };
      }),
  },
  "/pharmacy/inventory/damaged": {
    ui: 5,
    title: "Damaged & Breakage", description: "Log of vials broken, strips damaged, or cold-chain breaches.",
    stats: [{ label: "Damaged Items (Mo)", color: "text-red-400", value: "18" }, { label: "Value Lost", color: "text-amber-400", value: "$320" }, { label: "Written Off", color: "text-gray-400", value: "15" }],
    columns: [["Log ID", "logid"], ["Medicine Name", "medicinename"], ["Reason", "reason"], ["Qty Damaged", "qtydamaged"], ["Reported By", "reportedby"]],
    badge: ["Status", "status", {"Pending Approval":"amber","Written Off":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const reasons = ['Dropped Vial', 'Water Damage', 'Fridge Failure', 'Torn Packaging', 'Dropped Vial'];
        const statuses = ['Pending Approval', 'Written Off', 'Written Off', 'Pending Approval', 'Written Off'];
        return { logid: 'DMG-' + (1001 + i), medicinename: 'Insulin Vial', reason: reasons[i], qtydamaged: (1 + i).toString(), reportedby: 'Staff ' + (i + 1), status: statuses[i] };
      }),
  },
  "/pharmacy/inventory/expiry": {
    ui: 5,
    title: "Expiry Management", description: "Dashboard tracking medicines approaching expiration for return or discount.",
    stats: [{ label: "Expired (Total)", color: "text-red-400", value: "12 Items" }, { label: "Value of Expired", color: "text-red-400", value: "$450" }, { label: "Returned to Vendor", color: "text-emerald-400", value: "$1,200" }],
    columns: [["Item Code", "itemcode"], ["Medicine Name", "medicinename"], ["Batch No", "batchno"], ["Expiry Date", "expirydate"], ["Qty Left", "qtyleft"]],
    badge: ["Status", "status", {"Expired":"red","Expiring Soon":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const dates = ['Passed (30 Jun)', 'Passed (15 Jul)', '31 Jul 2026', '15 Aug 2026', '31 Aug 2026'];
        const statuses = i < 2 ? 'Expired' : 'Expiring Soon';
        return { itemcode: 'MED-' + (2001 + i), medicinename: 'Medicine ' + (i + 1), batchno: 'BTH-' + i, expirydate: dates[i], qtyleft: (10 + i * 5).toString(), status: statuses };
      }),
  },
  "/pharmacy/inventory/near-expiry": {
    ui: 5,
    title: "Near Expiry Alerts", description: "Medicines expiring in the next 3 to 6 months requiring fast-tracking.",
    stats: [{ label: "Alerts Active", color: "text-amber-400", value: "45" }, { label: "Push to Wards", color: "text-blue-400", value: "20" }, { label: "Return Eligible", color: "text-emerald-400", value: "15" }],
    columns: [["Medicine Name", "medicinename"], ["Batch No", "batchno"], ["Months to Expiry", "monthstoexpiry"], ["Current Stock", "currentstock"], ["Action Plan", "actionplan"]],
    badge: ["Status", "status", {"Pending Action":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const actions = ['Return to Vendor', 'Transfer to ER', 'Discounted Sale', 'Return to Vendor', 'Transfer to Ward'];
        return { medicinename: 'Medicine ' + (i + 1), batchno: 'BTH-80' + i, monthstoexpiry: (3 + i).toString() + ' Months', currentstock: '150', actionplan: actions[i], status: 'Pending Action' };
      }),
  },
  "/pharmacy/master/brand": {
    ui: 5,
    title: "Brand Medicines", description: "Mapping of commercial brand names to their generic constituents.",
    stats: [{ label: "Brands Listed", color: "text-blue-400", value: "9,200" }, { label: "Multi-Salt Brands", color: "text-emerald-400", value: "3,400" }, { label: "Top Selling Brand", color: "text-amber-400", value: "Augmentin" }],
    columns: [["Brand ID", "brandid"], ["Brand Name", "brandname"], ["Manufacturer", "manufacturer"], ["Primary Generic", "primarygeneric"], ["Substitutes", "substitutes"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { brandid: 'BRD-' + (3001 + i), brandname: 'BrandX ' + (i + 1), manufacturer: 'PharmaCorp', primarygeneric: 'Amoxicillin', substitutes: (4 - i) + ' Available', status: 'Active' };
      }),
  },
  "/pharmacy/master/catalog": {
    ui: 5,
    title: "Medicine Catalog", description: "Master database of all drugs, consumables, and surgical items.",
    stats: [{ label: "Total Items", color: "text-blue-400", value: "12,500" }, { label: "Active Items", color: "text-emerald-400", value: "11,800" }, { label: "Inactive", color: "text-gray-400", value: "700" }],
    columns: [["Item Code", "itemcode"], ["Name", "name"], ["Generic Group", "genericgroup"], ["Formulation", "formulation"], ["MRP", "mrp"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const formulations = ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment'];
        return { itemcode: 'MED-' + (1001 + i), name: 'BrandName ' + (i + 1), genericgroup: 'Generic ' + (i + 1), formulation: formulations[i], mrp: '$' + (5 + i * 2), status: 'Active' };
      }),
  },
  "/pharmacy/master/classification": {
    ui: 5,
    title: "Drug Classification", description: "Hierarchy of pharmacological classes (e.g., NSAIDs, Beta-blockers).",
    stats: [{ label: "Total Classes", color: "text-blue-400", value: "85" }, { label: "Sub-classes", color: "text-blue-400", value: "340" }, { label: "Most Populated", color: "text-emerald-400", value: "Antibiotics" }],
    columns: [["Class ID", "classid"], ["Class Name", "classname"], ["Parent Class", "parentclass"], ["Total Generics", "totalgenerics"], ["Total Brands", "totalbrands"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const classes = ['NSAIDs', 'Beta Blockers', 'Cephalosporins', 'Statins', 'PPIs'];
        const parents = ['Analgesics', 'Cardiovascular', 'Antibiotics', 'Cardiovascular', 'Gastrointestinal'];
        return { classid: 'CLS-' + (4001 + i), classname: classes[i], parentclass: parents[i], totalgenerics: (15 + i * 5).toString(), totalbrands: (150 + i * 20).toString(), status: 'Active' };
      }),
  },
  "/pharmacy/master/generic": {
    ui: 5,
    title: "Generic Medicines", description: "Directory of active pharmaceutical ingredients (APIs) and salts.",
    stats: [{ label: "Total Generics", color: "text-blue-400", value: "1,450" }, { label: "Schedule H1", color: "text-red-400", value: "120" }, { label: "OTC Generics", color: "text-emerald-400", value: "300" }],
    columns: [["Generic ID", "genericid"], ["Salt Name", "saltname"], ["Therapeutic Class", "therapeuticclass"], ["Pregnancy Category", "pregnancycategory"], ["Schedule", "schedule"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const classes = ['Analgesic', 'Antibiotic', 'Antihypertensive', 'Antidiabetic', 'Antacid'];
        return { genericid: 'GEN-' + (2001 + i), saltname: 'Paracetamol + ' + (i + 1), therapeuticclass: classes[i], pregnancycategory: 'Category B', schedule: i === 1 ? 'Schedule H1' : 'OTC', status: 'Active' };
      }),
  },
  "/pharmacy/master/manufacturers": {
    ui: 5,
    title: "Manufacturers", description: "Directory of pharmaceutical companies and their specific products.",
    stats: [{ label: "Manufacturers", color: "text-blue-400", value: "320" }, { label: "Domestic", color: "text-emerald-400", value: "250" }, { label: "International", color: "text-amber-400", value: "70" }],
    columns: [["Mfg ID", "mfgid"], ["Company Name", "companyname"], ["Origin", "origin"], ["Products Supplied", "productssupplied"], ["Quality Rating", "qualityrating"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { mfgid: 'MFG-' + (6001 + i), companyname: 'PharmaGiant ' + (i + 1), origin: i % 2 === 0 ? 'Domestic' : 'International', productssupplied: (120 + i * 30).toString(), qualityrating: 'A Grade', status: 'Active' };
      }),
  },
  "/pharmacy/master/strength": {
    ui: 5,
    title: "Strength & Dosage Forms", description: "Standardized values for drug dosages (mg, ml, mcg) and routes.",
    stats: [{ label: "Dosage Forms", color: "text-blue-400", value: "45" }, { label: "Routes", color: "text-emerald-400", value: "12" }, { label: "Units (UOM)", color: "text-gray-400", value: "18" }],
    columns: [["Form ID", "formid"], ["Formulation", "formulation"], ["Route of Admin", "routeofadmin"], ["Unit of Measure", "unitofmeasure"], ["Items Mapped", "itemsmapped"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const forms = ['Tablet', 'IV Injection', 'Syrup', 'Ointment', 'Inhaler'];
        const routes = ['Oral', 'Intravenous', 'Oral', 'Topical', 'Inhalation'];
        return { formid: 'FRM-' + (5001 + i), formulation: forms[i], routeofadmin: routes[i], unitofmeasure: i === 1 ? 'ml' : 'mg', itemsmapped: (500 + i * 100).toString(), status: 'Active' };
      }),
  },
  "/pharmacy/operations/audit": {
    ui: 5,
    title: "Pharmacy Audits", description: "Formal periodic audits of physical stock against system records.",
    stats: [{ label: "Scheduled Audits", color: "text-blue-400", value: "2" }, { label: "Discrepancy Value", color: "text-emerald-400", value: "-$15" }, { label: "Completed (Month)", color: "text-emerald-400", value: "8" }],
    columns: [["Audit ID", "auditid"], ["Category Audited", "categoryaudited"], ["Total Items", "totalitems"], ["Discrepancies Found", "discrepanciesfound"], ["Auditor", "auditor"]],
    badge: ["Status", "status", {"In Progress":"gray","Completed":"emerald","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['In Progress', 'Completed', 'Completed', 'Scheduled', 'Completed'];
        return { auditid: 'ADT-' + (4001 + i), categoryaudited: 'Antibiotics Rack ' + (i + 1), totalitems: '150', discrepanciesfound: statuses[i] === 'Completed' ? '2' : '-', auditor: 'Lead Pharmacist', status: statuses[i] };
      }),
  },
  "/pharmacy/operations/cycle-count": {
    ui: 5,
    title: "Daily Cycle Counts", description: "Continuous partial stocktakes (ABC analysis) to maintain inventory accuracy.",
    stats: [{ label: "Bins Counted Today", color: "text-blue-400", value: "45" }, { label: "Accuracy Rate", color: "text-emerald-400", value: "98.5%" }, { label: "Variances Pending Auth", color: "text-amber-400", value: "3" }],
    columns: [["Count ID", "countid"], ["Location/Bin", "locationbin"], ["Expected Qty", "expectedqty"], ["Counted Qty", "countedqty"], ["Variance", "variance"]],
    badge: ["Status", "status", {"Matched":"emerald","Variance Logged":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const counted = (100 - i % 2);
        const statuses = counted === 100 ? 'Matched' : 'Variance Logged';
        return { countid: 'CYC-' + (5001 + i), locationbin: 'Aisle 2, Bin ' + i, expectedqty: '100', countedqty: counted.toString(), variance: counted === 100 ? '0' : '-1', status: statuses };
      }),
  },
  "/pharmacy/operations/issue": {
    ui: 5,
    title: "Department Issue", description: "Issuing bulk consumables and floor stock directly to hospital departments.",
    stats: [{ label: "Issues Today", color: "text-blue-400", value: "24" }, { label: "Total Value Issued", color: "text-amber-400", value: "$8,450" }, { label: "Pending Requests", color: "text-gray-400", value: "4" }],
    columns: [["Issue ID", "issueid"], ["Department", "department"], ["Items Issued", "itemsissued"], ["Total Value", "totalvalue"], ["Received By", "receivedby"]],
    badge: ["Status", "status", {"Issued":"emerald","Pending Authorization":"gray","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['ICU', 'General Ward A', 'OT 1', 'ER', 'Labor Room'];
        const statuses = ['Issued', 'Pending Authorization', 'Issued', 'Issued', 'Draft'];
        return { issueid: 'DPI-' + (2001 + i), department: depts[i], itemsissued: (10 + i * 5).toString(), totalvalue: '$' + (500 + i * 100), receivedby: statuses[i] === 'Issued' ? 'Nurse Head' : '-', status: statuses[i] };
      }),
  },
  "/pharmacy/operations/return": {
    ui: 5,
    title: "Department Returns", description: "Receiving excess or near-expiry floor stock back from departments.",
    stats: [{ label: "Returns Processing", color: "text-amber-400", value: "3" }, { label: "Value Recovered", color: "text-emerald-400", value: "$1,200" }, { label: "Discarded", color: "text-red-400", value: "$50" }],
    columns: [["Return ID", "returnid"], ["Department", "department"], ["Items Returned", "itemsreturned"], ["Reason", "reason"], ["Restocked Value", "restockedvalue"]],
    badge: ["Status", "status", {"Restocked":"blue","Pending QA":"amber","Discarded":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Restocked', 'Pending QA', 'Discarded', 'Restocked', 'Restocked'];
        return { returnid: 'DPR-' + (3001 + i), department: 'Ward ' + (i + 1), itemsreturned: (5 + i).toString(), reason: 'Excess Stock', restockedvalue: '$' + (100 + i * 20), status: statuses[i] };
      }),
  },
  "/pharmacy/operations/transfer": {
    ui: 5,
    title: "Inter-store Transfers", description: "Moving stock from the main pharmacy store to sub-stores or ward stocks.",
    stats: [{ label: "Pending Transfers", color: "text-amber-400", value: "12" }, { label: "Completed Today", color: "text-emerald-400", value: "45" }, { label: "Transit Discrepancy", color: "text-emerald-400", value: "0" }],
    columns: [["Transfer ID", "transferid"], ["From Store", "fromstore"], ["To Store", "tostore"], ["Total Items", "totalitems"], ["Requested By", "requestedby"]],
    badge: ["Status", "status", {"Dispatched":"blue","Received":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Dispatched', 'Received', 'Pending', 'Received', 'Dispatched'];
        return { transferid: 'TRF-' + (1001 + i), fromstore: 'Main Store', tostore: 'ER Pharmacy', totalitems: (5 + i * 2).toString(), requestedby: 'Pharm. ER', status: statuses[i] };
      }),
  },
  "/pharmacy/prescriptions/dispensing": {
    ui: 5,
    title: "Dispensing Queue", description: "Queue of verified prescriptions ready to be packed and handed to patients.",
    stats: [{ label: "Ready to Dispense", color: "text-blue-400", value: "24" }, { label: "Dispensed Today", color: "text-emerald-400", value: "280" }, { label: "Uncollected", color: "text-amber-400", value: "5" }],
    columns: [["Prescription ID", "prescriptionid"], ["Patient Name", "patientname"], ["Items", "items"], ["Total Cost", "totalcost"], ["Payment Status", "paymentstatus"]],
    badge: ["Status", "status", {"Ready":"blue","Dispensed":"emerald","Packing":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Ready', 'Dispensed', 'Packing', 'Ready', 'Dispensed'];
        return { prescriptionid: 'RX-' + (4001 + i), patientname: 'Patient ' + (i + 1), items: (3 + i).toString(), totalcost: '$' + (45 + i * 15), paymentstatus: 'Paid', status: statuses[i] };
      }),
  },
  "/pharmacy/prescriptions/e-prescriptions": {
    ui: 5,
    title: "E-Prescriptions Archive", description: "Searchable repository of all digital prescriptions generated by doctors.",
    stats: [{ label: "Total E-Rx (Month)", color: "text-blue-400", value: "4,500" }, { label: "Fulfilled", color: "text-emerald-400", value: "4,200" }, { label: "Expired/Unused", color: "text-gray-400", value: "300" }],
    columns: [["Prescription ID", "prescriptionid"], ["Date", "date"], ["Patient Name", "patientname"], ["Doctor", "doctor"], ["Valid Until", "validuntil"]],
    badge: ["Status", "status", {"Fulfilled":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { prescriptionid: 'ERX-' + (5001 + i), date: '10 Jul 2026', patientname: 'Patient ' + (i + 1), doctor: 'Dr. House', validuntil: '10 Aug 2026', status: 'Fulfilled' };
      }),
  },
  "/pharmacy/prescriptions/new": {
    ui: 5,
    title: "New Prescription Entry", description: "Manual entry for physical (paper) prescriptions brought by patients.",
    stats: [{ label: "Manual Entries Today", color: "text-blue-400", value: "42" }, { label: "Drafts", color: "text-amber-400", value: "3" }, { label: "Verified", color: "text-emerald-400", value: "39" }],
    columns: [["Entry ID", "entryid"], ["Patient Name", "patientname"], ["Doctor/Clinic", "doctorclinic"], ["Date", "date"], ["Items Entered", "itemsentered"]],
    badge: ["Status", "status", {"Verified":"emerald","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Verified', 'Draft', 'Verified', 'Verified', 'Draft'];
        return { entryid: 'MN-' + (2001 + i), patientname: 'Patient ' + (i + 1), doctorclinic: 'External Clinic', date: 'Today', itemsentered: (2 + i).toString(), status: statuses[i] };
      }),
  },
  "/pharmacy/prescriptions/queue": {
    ui: 5,
    title: "Prescription Queue", description: "Central queue of all electronic prescriptions sent from OPD and IPD.",
    stats: [{ label: "Pending Prescriptions", color: "text-amber-400", value: "45" }, { label: "Processed Today", color: "text-emerald-400", value: "320" }, { label: "Wait Time", color: "text-blue-400", value: "8 mins" }],
    columns: [["Prescription ID", "prescriptionid"], ["Patient Name", "patientname"], ["Doctor", "doctor"], ["Department", "department"], ["Time Received", "timereceived"]],
    badge: ["Status", "status", {"Pending":"amber","Processing":"amber","Ready":"blue","Dispensed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending', 'Processing', 'Ready', 'Pending', 'Dispensed'];
        return { prescriptionid: 'RX-' + (10001 + i), patientname: 'Patient ' + (i + 1), doctor: 'Dr. Smith', department: 'General Medicine', timereceived: '10:00 AM', status: statuses[i] };
      }),
  },
  "/pharmacy/prescriptions/verification": {
    ui: 5,
    title: "Prescription Verification", description: "Pharmacist review for dosage, interactions, and contraindications.",
    stats: [{ label: "Awaiting Verification", color: "text-amber-400", value: "15" }, { label: "Interventions Made", color: "text-red-400", value: "4" }, { label: "Verified", color: "text-emerald-400", value: "150" }],
    columns: [["Prescription ID", "prescriptionid"], ["Patient Name", "patientname"], ["Allergies", "allergies"], ["Flags", "flags"], ["Pharmacist", "pharmacist"]],
    badge: ["Status", "status", {"Verified":"emerald","Pending Clarification":"amber","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const flags = ['None', 'Drug Interaction', 'Dose Too High', 'None', 'Allergy Alert'];
        const statuses = ['Verified', 'Pending Clarification', 'Pending Clarification', 'Verified', 'Rejected'];
        return { prescriptionid: 'RX-' + (3001 + i), patientname: 'Patient ' + (i + 1), allergies: flags[i] === 'Allergy Alert' ? 'Penicillin' : 'None', flags: flags[i], pharmacist: 'Pharm. Jane', status: statuses[i] };
      }),
  },
  "/pharmacy/purchase/grn": {
    ui: 5,
    title: "Goods Receipt Note (GRN)", description: "Inwarding of received stock, batch verification, and QA checks.",
    stats: [{ label: "Pending QA", color: "text-amber-400", value: "4" }, { label: "Stocked Today", color: "text-emerald-400", value: "12" }, { label: "Discrepancies", color: "text-red-400", value: "1" }],
    columns: [["GRN ID", "grnid"], ["PO Number", "ponumber"], ["Vendor", "vendor"], ["Invoice No", "invoiceno"], ["Items Received", "itemsreceived"]],
    badge: ["Status", "status", {"Stock Updated":"emerald","Pending QA":"amber","Shortage Noted":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Stock Updated', 'Pending QA', 'Stock Updated', 'Shortage Noted', 'Stock Updated'];
        return { grnid: 'GRN-' + (3001 + i), ponumber: 'PO-' + (2026000 + i), vendor: 'Vendor ' + (i + 1), invoiceno: 'INV-' + (9876 + i), itemsreceived: (10 + i * 2).toString(), status: statuses[i] };
      }),
  },
  "/pharmacy/purchase/invoice": {
    ui: 5,
    title: "Invoice Verification", description: "Reconciling received goods (GRN) with vendor invoices before payment.",
    stats: [{ label: "Pending Verification", color: "text-amber-400", value: "14" }, { label: "Verified & Sent to Acc", color: "text-emerald-400", value: "45" }, { label: "Price Mismatch", color: "text-red-400", value: "2" }],
    columns: [["Invoice No", "invoiceno"], ["Vendor", "vendor"], ["GRN ID", "grnid"], ["Invoice Amount", "invoiceamount"], ["Due Date", "duedate"]],
    badge: ["Status", "status", {"Verified":"emerald","Pending Verification":"amber","Price Mismatch":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Verified', 'Pending Verification', 'Price Mismatch', 'Verified', 'Verified'];
        return { invoiceno: 'INV-' + (8001 + i), vendor: 'Vendor ' + (i + 1), grnid: 'GRN-' + (3001 + i), invoiceamount: '$' + (4000 + i * 500), duedate: '30 Jul 2026', status: statuses[i] };
      }),
  },
  "/pharmacy/purchase/orders": {
    ui: 5,
    title: "Purchase Orders (PO)", description: "Official orders sent to pharmaceutical distributors and manufacturers.",
    stats: [{ label: "Active POs", color: "text-blue-400", value: "18" }, { label: "Overdue Delivery", color: "text-red-400", value: "2" }, { label: "Completed (Month)", color: "text-emerald-400", value: "45" }],
    columns: [["PO Number", "ponumber"], ["Vendor Name", "vendorname"], ["Order Date", "orderdate"], ["Total Value", "totalvalue"], ["Expected Delivery", "expecteddelivery"]],
    badge: ["Status", "status", {"Sent to Vendor":"amber","Partially Received":"amber","Completed":"emerald","Delayed":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Sent to Vendor', 'Partially Received', 'Completed', 'Delayed', 'Sent to Vendor'];
        return { ponumber: 'PO-' + (2026001 + i), vendorname: 'Pharma Dist. ' + (i + 1), orderdate: '01 Jul 2026', totalvalue: '$' + (5000 + i * 1000), expecteddelivery: '10 Jul 2026', status: statuses[i] };
      }),
  },
  "/pharmacy/purchase/requisition": {
    ui: 5,
    title: "Purchase Requisition", description: "Internal requests generated based on reorder levels or special demands.",
    stats: [{ label: "Pending PRs", color: "text-amber-400", value: "35" }, { label: "Urgent", color: "text-red-400", value: "5" }, { label: "Converted to PO", color: "text-emerald-400", value: "120" }],
    columns: [["PR ID", "prid"], ["Item Name", "itemname"], ["Requested Qty", "requestedqty"], ["Urgency", "urgency"], ["Generated By", "generatedby"]],
    badge: ["Status", "status", {"Pending Approval":"amber","Approved":"emerald","PO Created":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Approval', 'Approved', 'PO Created', 'Pending Approval', 'Approved'];
        return { prid: 'PR-' + (1001 + i), itemname: 'Medicine ' + (i + 1), requestedqty: (500 + i * 100).toString(), urgency: i === 0 ? 'Urgent' : 'Routine', generatedby: 'Auto-Reorder', status: statuses[i] };
      }),
  },
  "/pharmacy/purchase/returns": {
    ui: 5,
    title: "Purchase Returns (PRTM)", description: "Returning expired or damaged goods back to the supplier for credit notes.",
    stats: [{ label: "Pending Returns", color: "text-amber-400", value: "5" }, { label: "Value Awaiting", color: "text-blue-400", value: "$1,200" }, { label: "Credit Received", color: "text-emerald-400", value: "$4,500" }],
    columns: [["Return ID", "returnid"], ["Vendor", "vendor"], ["Reason", "reason"], ["Total Value", "totalvalue"], ["Credit Note No", "creditnoteno"]],
    badge: ["Status", "status", {"Dispatched":"emerald","Credit Received":"emerald","Pending Dispatch":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Dispatched', 'Credit Received', 'Dispatched', 'Pending Dispatch', 'Credit Received'];
        return { returnid: 'PRT-' + (5001 + i), vendor: 'Vendor ' + (i + 1), reason: i % 2 === 0 ? 'Expired' : 'Damaged', totalvalue: '$' + (200 + i * 50), creditnoteno: statuses[i] === 'Credit Received' ? 'CN-99' + i : '-', status: statuses[i] };
      }),
  },
  "/pharmacy/purchase/vendor": {
    ui: 5,
    title: "Vendor Management", description: "List of authorized suppliers, their performance ratings, and contracts.",
    stats: [{ label: "Active Vendors", color: "text-blue-400", value: "45" }, { label: "Avg Delivery Time", color: "text-emerald-400", value: "3 Days" }, { label: "Blacklisted", color: "text-red-400", value: "2" }],
    columns: [["Vendor ID", "vendorid"], ["Company Name", "companyname"], ["Contact Person", "contactperson"], ["Credit Period", "creditperiod"], ["Rating", "rating"]],
    badge: ["Status", "status", {"Active":"emerald","Warning":"amber","Blacklisted":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Active', 'Active', 'Warning', 'Blacklisted', 'Active'];
        return { vendorid: 'VEN-' + (4001 + i), companyname: 'Pharma Supplier ' + (i + 1), contactperson: 'John Doe', creditperiod: '30 Days', rating: (4.5 - i * 0.5).toFixed(1) + '/5', status: statuses[i] };
      }),
  },
  "/pharmacy/quality/cold-chain": {
    ui: 5,
    title: "Cold Chain Management", description: "Tracking temperature-sensitive drugs (vaccines, insulin) from receipt to dispensing.",
    stats: [{ label: "Cold Chain Items", color: "text-blue-400", value: "340" }, { label: "Breaches", color: "text-emerald-400", value: "0" }, { label: "Deliveries In Transit", color: "text-amber-400", value: "3" }],
    columns: [["Item Name", "itemname"], ["Batch No", "batchno"], ["Received Temp", "receivedtemp"], ["Current Storage", "currentstorage"], ["Time Out of Fridge", "timeoutoffridge"]],
    badge: ["Status", "status", {"Maintained":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { itemname: 'Insulin Glargine', batchno: 'BTH-CC' + i, receivedtemp: '4.5 °C', currentstorage: 'Fridge A', timeoutoffridge: '0 mins', status: 'Maintained' };
      }),
  },
  "/pharmacy/quality/compliance": {
    ui: 5,
    title: "Regulatory Compliance", description: "Tracking pharmacy licenses, pharmacist registrations, and regulatory filings.",
    stats: [{ label: "Active Licenses", color: "text-blue-400", value: "8" }, { label: "Renewals Due", color: "text-amber-400", value: "1" }, { label: "Inspections Passed", color: "text-emerald-400", value: "100%" }],
    columns: [["Document Name", "documentname"], ["Issuing Authority", "issuingauthority"], ["Valid From", "validfrom"], ["Expiry Date", "expirydate"], ["Days to Expire", "daystoexpire"]],
    badge: ["Status", "status", {"Valid":"emerald","Expiring Soon":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const docs = ['State Pharmacy License', 'Narcotics Handling Permit', 'Trade License', 'Fire Safety Certificate', 'Pharmacist Reg (Jane)'];
        const statuses = i === 1 ? 'Expiring Soon' : 'Valid';
        return { documentname: docs[i], issuingauthority: 'State Govt.', validfrom: '01 Jan 2024', expirydate: '31 Dec 2026', daystoexpire: i === 1 ? '45' : '180', status: statuses };
      }),
  },
  "/pharmacy/quality/expired": {
    ui: 5,
    title: "Expired Drugs Disposal", description: "Regulatory tracking and documentation of the destruction of expired medicines.",
    stats: [{ label: "Pending Disposal", color: "text-amber-400", value: "120 Items" }, { label: "Disposed (YTD)", color: "text-gray-400", value: "$4,500" }, { label: "Compliance Logs", color: "text-emerald-400", value: "Up to Date" }],
    columns: [["Disposal ID", "disposalid"], ["Date", "date"], ["Total Items", "totalitems"], ["Total Value", "totalvalue"], ["Witnessed By", "witnessedby"]],
    badge: ["Status", "status", {"Destroyed":"emerald","Pending Agency":"amber","Pending Approval":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Destroyed', 'Pending Agency', 'Destroyed', 'Destroyed', 'Pending Approval'];
        return { disposalid: 'DSP-' + (1001 + i), date: '30 Jun 2026', totalitems: (15 + i * 5).toString(), totalvalue: '$' + (300 + i * 50), witnessedby: statuses[i] === 'Destroyed' ? 'Dr. Admin' : '-', status: statuses[i] };
      }),
  },
  "/pharmacy/quality/recall": {
    ui: 5,
    title: "Drug Recall Management", description: "Managing manufacturer alerts and pulling affected batches from all locations.",
    stats: [{ label: "Active Recalls", color: "text-red-400", value: "1" }, { label: "Quarantined Qty", color: "text-amber-400", value: "450" }, { label: "Returned to Vendor", color: "text-emerald-400", value: "3" }],
    columns: [["Recall ID", "recallid"], ["Medicine Name", "medicinename"], ["Batch No", "batchno"], ["Affected Qty Located", "affectedqtylocated"], ["Vendor Notified", "vendornotified"]],
    badge: ["Status", "status", {"Quarantined":"amber","Returned to Vendor":"blue","Closed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Quarantined', 'Returned to Vendor', 'Returned to Vendor', 'Quarantined', 'Closed'];
        return { recallid: 'RCL-' + (2001 + i), medicinename: 'Ranitidine 150mg', batchno: 'BTH-REC' + i, affectedqtylocated: (100 + i * 50).toString(), vendornotified: 'Yes', status: statuses[i] };
      }),
  },
  "/pharmacy/quality/temperature": {
    ui: 5,
    title: "Temperature Logging", description: "Digital logs for pharmacy refrigerators and ambient room temperatures.",
    stats: [{ label: "Monitored Fridges", color: "text-blue-400", value: "12" }, { label: "Current Alarms", color: "text-emerald-400", value: "0" }, { label: "Excursions (Month)", color: "text-amber-400", value: "1" }],
    columns: [["Log Time", "logtime"], ["Equipment", "equipment"], ["Current Temp", "currenttemp"], ["Min/Max (24h)", "minmax24h"], ["Alerts Triggered", "alertstriggered"]],
    badge: ["Status", "status", {"Optimal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { logtime: '14:' + (10 + i), equipment: 'Vaccine Fridge ' + (1 + i), currenttemp: (4 + i * 0.2).toFixed(1) + ' °C', minmax24h: '3.5 / 5.2 °C', alertstriggered: 'None', status: 'Optimal' };
      }),
  },
  "/pharmacy/reports/controlled": {
    ui: 5,
    title: "Controlled Drugs Usage Report", description: "Regulatory compliance report detailing the movement of all narcotics.",
    stats: [{ label: "Narcotic Scripts", color: "text-blue-400", value: "340" }, { label: "Audits Passed", color: "text-emerald-400", value: "100%" }, { label: "Unaccounted", color: "text-emerald-400", value: "0" }],
    columns: [["Drug Name", "drugname"], ["Opening Qty", "openingqty"], ["Received", "received"], ["Dispensed to Patients", "dispensedtopatients"], ["Issued to Wards", "issuedtowards"]],
    badge: ["Status", "status", {"Balanced":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const drugs = ['Morphine 10mg', 'Fentanyl 50mcg', 'Midazolam 5mg', 'Ketamine', 'Tramadol 50mg'];
        return { drugname: drugs[i], openingqty: '500', received: '200', dispensedtopatients: '150', issuedtowards: '100', status: 'Balanced' };
      }),
  },
  "/pharmacy/reports/dispensing": {
    ui: 5,
    title: "Dispensing Efficiency Report", description: "Metrics on prescription wait times, pharmacist workload, and dispensing errors.",
    stats: [{ label: "Avg Dispense Time", color: "text-emerald-400", value: "6.5 mins" }, { label: "Total Prescriptions", color: "text-blue-400", value: "12,450" }, { label: "Near-miss Errors", color: "text-amber-400", value: "14" }],
    columns: [["Pharmacist", "pharmacist"], ["Prescriptions Dispensed", "prescriptionsdispensed"], ["Avg Turnaround", "avgturnaround"], ["Errors Caught", "errorscaught"], ["Patient Rating", "patientrating"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { pharmacist: 'Pharm. Staff ' + (i + 1), prescriptionsdispensed: (2500 - i * 200).toString(), avgturnaround: (5 + i) + ' mins', errorscaught: (10 - i).toString(), patientrating: (4.8 - i * 0.1).toFixed(1) + '/5', status: 'Generated' };
      }),
  },
  "/pharmacy/reports/expiry": {
    ui: 5,
    title: "Expiry Analysis Report", description: "Financial impact analysis of medicines expired and nearing expiry.",
    stats: [{ label: "YTD Net Loss", color: "text-red-400", value: "$1,200" }, { label: "Successfully Returned", color: "text-emerald-400", value: "$5,400" }, { label: "Expiry Rate", color: "text-blue-400", value: "0.8%" }],
    columns: [["Month", "month"], ["Expired Value", "expiredvalue"], ["Returned for Credit", "returnedforcredit"], ["Net Loss", "netloss"], ["Alerts Triggered", "alertstriggered"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        return { month: months[i] + ' 2026', expiredvalue: '$' + (500 + i * 50), returnedforcredit: '$' + (400 + i * 40), netloss: '$' + (100 + i * 10), alertstriggered: (15 + i).toString(), status: 'Generated' };
      }),
  },
  "/pharmacy/reports/medicine-sales": {
    ui: 5,
    title: "Medicine Sales Report", description: "Detailed report showing exact quantities and revenue generated per medicine.",
    stats: [{ label: "Top Selling Item", color: "text-emerald-400", value: "Paracetamol 500mg" }, { label: "Highest Revenue", color: "text-blue-400", value: "Meropenem 1g" }, { label: "Low Margin Items", color: "text-red-400", value: "45" }],
    columns: [["Medicine Name", "medicinename"], ["Category", "category"], ["Qty Sold", "qtysold"], ["Revenue", "revenue"], ["Profit Margin", "profitmargin"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { medicinename: 'Medicine ' + (i + 1), category: 'Antibiotics', qtysold: (1000 - i * 150).toString(), revenue: '$' + (5000 - i * 500), profitmargin: (25 + i) + '%', status: 'Generated' };
      }),
  },
  "/pharmacy/reports/pl": {
    ui: 5,
    title: "Pharmacy P&L Statement", description: "Overall Profit and Loss statement for the pharmacy department.",
    stats: [{ label: "Net Profit Margin", color: "text-emerald-400", value: "28.4%" }, { label: "Revenue Growth", color: "text-blue-400", value: "+4.2%" }, { label: "OpEx Ratio", color: "text-amber-400", value: "12%" }],
    columns: [["Month", "month"], ["Gross Revenue", "grossrevenue"], ["Cost of Goods Sold (COGS)", "costofgoodssoldcogs"], ["Operating Expenses", "operatingexpenses"], ["Net Profit", "netprofit"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        return { month: months[i] + ' 2026', grossrevenue: '$' + (150000 + i * 5000), costofgoodssoldcogs: '$' + (90000 + i * 3000), operatingexpenses: '$' + (18000 + i * 500), netprofit: '$' + (42000 + i * 1500), status: 'Generated' };
      }),
  },
  "/pharmacy/reports/purchase": {
    ui: 5,
    title: "Purchase & Vendor Report", description: "Summary of all purchases made, vendor performance, and outstanding payables.",
    stats: [{ label: "Total Purchases (MTD)", color: "text-blue-400", value: "$120,000" }, { label: "Outstanding Payables", color: "text-amber-400", value: "$45,000" }, { label: "Vendor Returns", color: "text-emerald-400", value: "$2,100" }],
    columns: [["Vendor Name", "vendorname"], ["POs Raised", "posraised"], ["Total Purchase Value", "totalpurchasevalue"], ["GRN Value", "grnvalue"], ["Pending Payments", "pendingpayments"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { vendorname: 'Pharma Dist ' + (i + 1), posraised: (10 + i).toString(), totalpurchasevalue: '$' + (25000 - i * 2000), grnvalue: '$' + (24000 - i * 2000), pendingpayments: '$' + (5000 + i * 500), status: 'Generated' };
      }),
  },
  "/pharmacy/reports/sales": {
    ui: 5,
    title: "Sales Report", description: "Daily, weekly, and monthly revenue analysis across all billing counters.",
    stats: [{ label: "Revenue (MTD)", color: "text-blue-400", value: "$345,000" }, { label: "Growth vs Last Mo", color: "text-emerald-400", value: "+5.2%" }, { label: "Avg Bill Value", color: "text-amber-400", value: "$45" }],
    columns: [["Date", "date"], ["Total Bills", "totalbills"], ["OPD Revenue", "opdrevenue"], ["IPD Revenue", "ipdrevenue"], ["Total Revenue", "totalrevenue"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { date: '0' + (1 + i) + ' Jul 2026', totalbills: (400 + i * 20).toString(), opdrevenue: '$' + (8000 + i * 500), ipdrevenue: '$' + (4000 + i * 200), totalrevenue: '$' + (12000 + i * 700), status: 'Generated' };
      }),
  },
  "/pharmacy/reports/stock": {
    ui: 5,
    title: "Stock Valuation Report", description: "Financial valuation of current inventory based on purchase price and MRP.",
    stats: [{ label: "Total Purchase Value", color: "text-blue-400", value: "$450,000" }, { label: "Total MRP Value", color: "text-emerald-400", value: "$680,000" }, { label: "Projected Profit", color: "text-amber-400", value: "$230,000" }],
    columns: [["Category", "category"], ["Total Items", "totalitems"], ["Current Qty", "currentqty"], ["Purchase Value", "purchasevalue"], ["MRP Value", "mrpvalue"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const categories = ['Antibiotics', 'Cardiovascular', 'Analgesics', 'Surgical Consumables', 'Vitamins'];
        return { category: categories[i], totalitems: (150 + i * 20).toString(), currentqty: (5000 + i * 1000).toString(), purchasevalue: '$' + (80000 - i * 10000), mrpvalue: '$' + (120000 - i * 15000), status: 'Generated' };
      }),
  },
  "/pharmacy/reports/valuation": {
    ui: 5,
    title: "Inventory Valuation", description: "Detailed breakdown of inventory asset value by category and location.",
    stats: [{ label: "Total Asset Value", color: "text-blue-400", value: "$680,500" }, { label: "Main Store %", color: "text-gray-400", value: "75%" }, { label: "Ward Stocks", color: "text-emerald-400", value: "$45,000" }],
    columns: [["Location/Store", "locationstore"], ["Antibiotics Value", "antibioticsvalue"], ["Chronic Meds Value", "chronicmedsvalue"], ["Consumables Value", "consumablesvalue"], ["Total Value", "totalvalue"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const locations = ['Main Pharmacy', 'OPD Pharmacy', 'ER Pharmacy', 'ICU Stock', 'Ward A Stock'];
        return { locationstore: locations[i], antibioticsvalue: '$' + (50000 - i * 10000), chronicmedsvalue: '$' + (80000 - i * 15000), consumablesvalue: '$' + (20000 - i * 3000), totalvalue: '$' + (150000 - i * 28000), status: 'Generated' };
      }),
  },
  "/pharmacy/services/counseling": {
    ui: 5,
    title: "Patient Counseling", description: "Log of pharmacist counseling sessions for new therapies or complex regimens.",
    stats: [{ label: "Sessions Today", color: "text-blue-400", value: "24" }, { label: "Inhaler Techniques", color: "text-emerald-400", value: "8" }, { label: "Pending Sessions", color: "text-amber-400", value: "3" }],
    columns: [["Session ID", "sessionid"], ["Patient Name", "patientname"], ["Topic", "topic"], ["Pharmacist", "pharmacist"], ["Duration", "duration"]],
    badge: ["Status", "status", {"Completed":"emerald","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const topics = ['Insulin Pen Technique', 'Inhaler Usage', 'Warfarin Diet Interactions', 'Chemo Side Effects', 'New Antibiotic'];
        const statuses = ['Completed', 'Completed', 'Scheduled', 'Completed', 'Completed'];
        return { sessionid: 'CNS-' + (3001 + i), patientname: 'Patient ' + (i + 1), topic: topics[i], pharmacist: 'Pharm. David', duration: statuses[i] === 'Completed' ? '15 mins' : '-', status: statuses[i] };
      }),
  },
  "/pharmacy/services/delivery": {
    ui: 5,
    title: "Home Delivery Tracking", description: "Management of medication dispatch and delivery to patient homes.",
    stats: [{ label: "Deliveries Today", color: "text-blue-400", value: "45" }, { label: "Delivered", color: "text-emerald-400", value: "30" }, { label: "Out for Delivery", color: "text-amber-400", value: "12" }],
    columns: [["Delivery ID", "deliveryid"], ["Patient Name", "patientname"], ["Address", "address"], ["Driver Assigned", "driverassigned"], ["Expected Delivery", "expecteddelivery"]],
    badge: ["Status", "status", {"Out for Delivery":"amber","Delivered":"emerald","Pending Dispatch":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Out for Delivery', 'Delivered', 'Pending Dispatch', 'Delivered', 'Out for Delivery'];
        return { deliveryid: 'DEL-' + (4001 + i), patientname: 'Patient ' + (i + 1), address: '123 Main St, Apt ' + i, driverassigned: statuses[i] === 'Pending Dispatch' ? '-' : 'Driver Mike', expecteddelivery: 'By 5:00 PM', status: statuses[i] };
      }),
  },
  "/pharmacy/services/history": {
    ui: 5,
    title: "Patient Medication History", description: "Complete longitudinal record of all medicines dispensed to a patient.",
    stats: [{ label: "Records Accessed", color: "text-blue-400", value: "450" }, { label: "Active Therapies", color: "text-emerald-400", value: "4" }, { label: "Compliance Alerts", color: "text-amber-400", value: "2" }],
    columns: [["Date", "date"], ["Prescription ID", "prescriptionid"], ["Doctor", "doctor"], ["Medicines Dispensed", "medicinesdispensed"], ["Refills Left", "refillsleft"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { date: '0' + (1 + i) + ' Jul 2026', prescriptionid: 'RX-' + (1000 + i), doctor: 'Dr. House', medicinesdispensed: 'Metformin, Lisinopril', refillsleft: (2 - i % 2).toString(), status: 'Active' };
      }),
  },
  "/pharmacy/services/refill": {
    ui: 5,
    title: "Refill Management", description: "Tracking and processing refill requests for chronic medication users.",
    stats: [{ label: "Refills Due Today", color: "text-amber-400", value: "45" }, { label: "Refills Processed", color: "text-emerald-400", value: "38" }, { label: "Missed Refills", color: "text-red-400", value: "5" }],
    columns: [["Refill ID", "refillid"], ["Patient Name", "patientname"], ["Medicine", "medicine"], ["Next Due Date", "nextduedate"], ["Patient Contacted", "patientcontacted"]],
    badge: ["Status", "status", {"Pending Collection":"amber","Processed":"emerald","Overdue":"amber","Patient Refused":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Collection', 'Processed', 'Overdue', 'Processed', 'Patient Refused'];
        return { refillid: 'RFL-' + (2001 + i), patientname: 'Patient ' + (i + 1), medicine: 'Amlodipine 5mg', nextduedate: 'Today', patientcontacted: statuses[i] === 'Overdue' ? 'No' : 'Yes', status: statuses[i] };
      }),
  },
  "/pharmacy/services/reminders": {
    ui: 5,
    title: "Medication Reminders", description: "Automated SMS/Email reminders for pill schedules and refill dates.",
    stats: [{ label: "Reminders Sent Today", color: "text-blue-400", value: "450" }, { label: "Delivery Rate", color: "text-emerald-400", value: "99%" }, { label: "Failed SMS", color: "text-red-400", value: "4" }],
    columns: [["Patient Name", "patientname"], ["Message Type", "messagetype"], ["Drug Name", "drugname"], ["Sent Time", "senttime"], ["Patient Response", "patientresponse"]],
    badge: ["Status", "status", {"Sent":"emerald","Failed":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Refill Reminder', 'Dose Reminder', 'Dose Reminder', 'Refill Reminder', 'Pickup Reminder'];
        const statuses = ['Sent', 'Sent', 'Failed', 'Sent', 'Sent'];
        return { patientname: 'Patient ' + (i + 1), messagetype: types[i], drugname: 'Thyroxine', senttime: '08:00 AM', patientresponse: 'None', status: statuses[i] };
      }),
  },
  "/pharmacy/settings/categories": {
    ui: 5,
    title: "Medicine Categories", description: "Configure and manage therapeutic and operational drug categories.",
    stats: [{ label: "Total Categories", color: "text-blue-400", value: "45" }, { label: "Cold Chain Categories", color: "text-amber-400", value: "3" }, { label: "Narcotic Categories", color: "text-red-400", value: "2" }],
    columns: [["Category ID", "categoryid"], ["Category Name", "categoryname"], ["Sub-categories", "subcategories"], ["Items Mapped", "itemsmapped"], ["Storage Rule", "storagerule"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const cats = ['Antibiotics', 'Vaccines (Cold Chain)', 'Narcotics (Sch X)', 'IV Fluids', 'Surgical Consumables'];
        return { categoryid: 'CAT-' + (1001 + i), categoryname: cats[i], subcategories: (5 + i).toString(), itemsmapped: (200 + i * 50).toString(), storagerule: cats[i].includes('Cold') ? '2-8 °C' : 'Ambient', status: 'Active' };
      }),
  },
  "/pharmacy/settings/discount": {
    ui: 5,
    title: "Discount Rules", description: "Configure automatic discounts for staff, senior citizens, or specific item categories.",
    stats: [{ label: "Active Rules", color: "text-blue-400", value: "8" }, { label: "Avg Discount Given", color: "text-amber-400", value: "4.5%" }, { label: "Total Discount (MTD)", color: "text-emerald-400", value: "$4,200" }],
    columns: [["Rule ID", "ruleid"], ["Rule Name", "rulename"], ["Target Audience", "targetaudience"], ["Discount %", "discount"], ["Max Limit", "maxlimit"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const rules = ['Staff Discount', 'Senior Citizen', 'Chronic Care Plan', 'OPD Campaign', 'Clearance (Near Expiry)'];
        const discounts = ['20%', '10%', '15%', '5%', '50%'];
        return { ruleid: 'DSC-' + (3001 + i), rulename: rules[i], targetaudience: rules[i].split(' ')[0], discount: discounts[i], maxlimit: '$100 per bill', status: 'Active' };
      }),
  },
  "/pharmacy/settings/profile": {
    ui: 5,
    title: "Pharmacy Profile", description: "Basic pharmacy details, license numbers, and operating hours.",
    stats: [{ label: "Profile Status", color: "text-emerald-400", value: "Complete" }, { label: "Licenses", color: "text-blue-400", value: "Validated" }, { label: "Next Renewal", color: "text-amber-400", value: "31 Dec" }],
    columns: [["Setting", "setting"], ["Description", "description"], ["Current Value", "currentvalue"], ["Last Updated", "lastupdated"], ["Updated By", "updatedby"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const settings = ['Pharmacy Name', 'License Number', 'Operating Hours', 'Emergency Contact', 'Chief Pharmacist'];
        const values = ['MedixPro Main Pharmacy', 'DL-2026-98765', '24x7', '+1 800 123 4567', 'Jane Doe, Pharm.D'];
        return { setting: settings[i], description: 'System config', currentvalue: values[i], lastupdated: '01 Jan 2026', updatedby: 'Admin', status: 'Active' };
      }),
  },
  "/pharmacy/settings/tax": {
    ui: 5,
    title: "Tax Configurations", description: "GST/VAT slabs mapping for different categories of medicines and consumables.",
    stats: [{ label: "Tax Slabs", color: "text-blue-400", value: "4" }, { label: "Exempt Items", color: "text-emerald-400", value: "340" }, { label: "Max Tax Bracket", color: "text-amber-400", value: "18%" }],
    columns: [["Tax Code", "taxcode"], ["Tax Name", "taxname"], ["Percentage (%)", "percentage"], ["Applied Categories", "appliedcategories"], ["Exemptions", "exemptions"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 4 }).map((_, i) => {
        const percentages = ['0%', '5%', '12%', '18%'];
        return { taxcode: 'TAX-' + i, taxname: 'GST ' + percentages[i], percentage: percentages[i], appliedcategories: (10 + i) + ' Categories', exemptions: i === 0 ? 'Life-saving Drugs' : 'None', status: 'Active' };
      }),
  },
  "/pharmacy/settings/units": {
    ui: 5,
    title: "Units of Measurement", description: "Define pack sizes, strips, vials, and base dispensing units.",
    stats: [{ label: "Total Units Defined", color: "text-blue-400", value: "24" }, { label: "Most Used Unit", color: "text-emerald-400", value: "Strip (10 Tab)" }, { label: "Custom Packs", color: "text-gray-400", value: "5" }],
    columns: [["Unit ID", "unitid"], ["Unit Name", "unitname"], ["Abbreviation", "abbreviation"], ["Base Unit Conversion", "baseunitconversion"], ["Used In", "usedin"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const units = ['Tablet', 'Strip (10s)', 'Box (10 Strips)', 'Vial', 'Bottle (100ml)'];
        const bases = ['1 Tab', '10 Tabs', '100 Tabs', '1 Vial', '1 Bottle'];
        return { unitid: 'UOM-' + (2001 + i), unitname: units[i], abbreviation: units[i].split(' ')[0], baseunitconversion: bases[i], usedin: 'Dispensing/Purchase', status: 'Active' };
      }),
  },
};

export default pages;
