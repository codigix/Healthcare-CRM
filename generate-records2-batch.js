const fs = require('fs');
const path = require('path');

const config = [
  // Infection Control
  {
    path: 'records/infection/hai', title: 'HAI Surveillance', desc: 'Hospital-Acquired Infection tracking (VAP, CAUTI, CLABSI, SSI).',
    cols: ['HAI ID', 'Patient', 'Infection Type', 'Onset Date', 'Location', 'Status'],
    stats: [{ label: 'Total HAI (Mo)', val: '12', col: 'text-amber-400' }, { label: 'SSI Rate', val: '0.5%', col: 'text-emerald-400' }, { label: 'Device Days', val: '1,240', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['VAP', 'CAUTI', 'CLABSI', 'SSI', 'VAP'];
      return { haiid: 'HAI-' + (1001+i), patient: 'Patient ' + (1+i), infectiontype: types[i], onsetdate: '01 Jul 2026', location: 'ICU', status: 'Monitored' };
    })`
  },
  {
    path: 'records/infection/reporting', title: 'Infection Reporting', desc: 'Mandatory reporting of notifiable diseases (e.g., TB, COVID, Dengue) to authorities.',
    cols: ['Report ID', 'Disease Name', 'Patient', 'Reported To', 'Date', 'Status'],
    stats: [{ label: 'Notifiable Diseases (YTD)', val: '45', col: 'text-amber-400' }, { label: 'Reports Filed', val: '45/45', col: 'text-emerald-400' }, { label: 'Pending Dispatches', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportid: 'NTR-' + (2001+i), diseasename: 'Tuberculosis', patient: 'Patient ' + (1+i), reportedto: 'Local Health Authority', date: 'Yesterday', status: 'Reported' };
    })`
  },
  {
    path: 'records/infection/antibiotic', title: 'Antibiotic Stewardship', desc: 'Tracking usage of restricted antibiotics and adherence to hospital formulary.',
    cols: ['Patient', 'Restricted Drug', 'Prescriber', 'Days on Drug', 'Approval Code', 'Status'],
    stats: [{ label: 'Restricted Rx (Today)', val: '24', col: 'text-amber-400' }, { label: 'Unapproved Uses', val: '2', col: 'text-red-400' }, { label: 'Stewardship Compliance', val: '92%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { patient: 'Patient ' + (1+i), restricteddrug: 'Meropenem', prescriber: 'Dr. Critical', daysondrug: (2+i).toString(), approvalcode: 'AUTH-' + (500+i), status: i===0?'Pending Auth':'Approved' };
    })`
  },
  {
    path: 'records/infection/isolation', title: 'Isolation Monitoring', desc: 'Log of patients placed in contact, droplet, or airborne isolation.',
    cols: ['Patient', 'Isolation Type', 'Ward/Room', 'Start Date', 'End Date', 'Status'],
    stats: [{ label: 'Active Isolations', val: '8', col: 'text-amber-400' }, { label: 'Negative Pressure Rooms', val: '4/5 Full', col: 'text-blue-400' }, { label: 'Isolation Breaches', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Contact', 'Airborne', 'Droplet', 'Contact', 'Airborne'];
      return { patient: 'Patient ' + (1+i), isolationtype: types[i], wardroom: 'Iso Ward ' + (1+i), startdate: '01 Jul 2026', enddate: i<2?'-':'05 Jul 2026', status: i<2?'Active':'Cleared' };
    })`
  },
  {
    path: 'records/infection/audit', title: 'Infection Audit', desc: 'Hand hygiene compliance and environmental cleaning audits.',
    cols: ['Audit Area', 'Audit Type', 'Auditor', 'Score', 'Deficiencies', 'Status'],
    stats: [{ label: 'Hand Hygiene Score', val: '88%', col: 'text-amber-400' }, { label: 'OT Swab Cultures', val: '100% Sterile', col: 'text-emerald-400' }, { label: 'Audits (Mo)', val: '45', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { auditarea: 'ICU', audittype: 'Hand Hygiene', auditor: 'ICN Alice', score: (80+i*2) + '%', deficiencies: i===0?'Jewelry Worn':'None', status: 'Audited' };
    })`
  },
  {
    path: 'records/infection/trends', title: 'Infection Trends', desc: 'Antibiogram data showing local antibiotic resistance patterns.',
    cols: ['Organism', 'Sample Source', 'Resistant Drug 1', 'Resistant Drug 2', 'Sensitivity Trend', 'Status'],
    stats: [{ label: 'Total Cultures Done', val: '850', col: 'text-blue-400' }, { label: 'MDR Organisms', val: '12%', col: 'text-red-400' }, { label: 'Data Updated', val: 'Last Month', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const organisms = ['K. pneumoniae', 'MRSA', 'E. coli', 'Acinetobacter', 'P. aeruginosa'];
      return { organism: organisms[i], samplesource: 'Blood/Urine', resistantdrug1: 'Ceftriaxone', resistantdrug2: 'Ciprofloxacin', sensitivitytrend: 'Decreasing', status: 'Analyzed' };
    })`
  },

  // Consent & Legal
  {
    path: 'records/legal/consent', title: 'Consent Management', desc: 'Centralized repository of all signed informed consents (Surgical, Anesthesia, High-Risk).',
    cols: ['Consent ID', 'Patient', 'Consent Type', 'Procedure', 'Signed By', 'Status'],
    stats: [{ label: 'Consents Signed (24H)', val: '124', col: 'text-blue-400' }, { label: 'Missing Consents', val: '0', col: 'text-emerald-400' }, { label: 'Digital Consents', val: '85%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { consentid: 'CON-' + (1001+i), patient: 'Patient ' + (1+i), consenttype: 'Surgical Consent', procedure: 'Appendectomy', signedby: 'Patient & Witness', status: 'Valid' };
    })`
  },
  {
    path: 'records/legal/mlc', title: 'Medico-Legal Cases (MLC)', desc: 'Specialized registry for accidents, assaults, or poisonings requiring police intimation.',
    cols: ['MLC No', 'Patient', 'Incident Type', 'Intimation Sent', 'Police Station', 'Status'],
    stats: [{ label: 'Active MLCs', val: '15', col: 'text-red-400' }, { label: 'Intimations Pending', val: '1', col: 'text-amber-400' }, { label: 'Closed MLCs', val: '145', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { mlcno: 'MLC-' + (2026001+i), patient: 'Patient ' + (1+i), incidenttype: 'RTA', intimationsent: i===0?'No':'Yes', policestation: 'City Center PS', status: i===0?'Action Required':'Intimated' };
    })`
  },
  {
    path: 'records/legal/requests', title: 'Legal Requests', desc: 'Managing subpoenas and formal requests from lawyers or courts for patient records.',
    cols: ['Req ID', 'Requestor', 'Patient', 'Deadline', 'Lawyer Assigned', 'Status'],
    stats: [{ label: 'Open Subpoenas', val: '4', col: 'text-amber-400' }, { label: 'Records Sent (YTD)', val: '24', col: 'text-blue-400' }, { label: 'Overdue Replies', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reqid: 'LGL-' + (3001+i), requestor: 'Advocate Smith', patient: 'Patient ' + (1+i), deadline: '15 Jul 2026', lawyerassigned: 'Hospital Counsel', status: i===0?'Pending Preparation':'Dispatched' };
    })`
  },
  {
    path: 'records/legal/court', title: 'Court Cases', desc: 'Tracking ongoing litigation, hearings, and required hospital representations.',
    cols: ['Case No', 'Court Name', 'Hearing Date', 'Hospital Rep.', 'Case Type', 'Status'],
    stats: [{ label: 'Active Litigation', val: '3', col: 'text-red-400' }, { label: 'Upcoming Hearings', val: '1', col: 'text-amber-400' }, { label: 'Favorable Judgments', val: '5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { caseno: 'CC-' + (2025001+i), courtname: 'District Court', hearingdate: '20 Jul 2026', hospitalrep: 'Dr. Medical Supt', casetype: 'Consumer Forum', status: 'Ongoing' };
    })`
  },
  {
    path: 'records/legal/police', title: 'Police Requests', desc: 'Responses to police inquiries, requisition of clinical notes or CCTV footage.',
    cols: ['Req ID', 'Police Station', 'IO Name', 'Information Requested', 'Date Received', 'Status'],
    stats: [{ label: 'Pending Inquiries', val: '2', col: 'text-amber-400' }, { label: 'Replies Sent', val: '45', col: 'text-blue-400' }, { label: 'Avg Response Time', val: '48 Hrs', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reqid: 'POL-' + (4001+i), policestation: 'North PS', ioname: 'Inspector John', informationrequested: 'Treatment Dates', datereceived: 'Yesterday', status: i===0?'Drafting Reply':'Sent' };
    })`
  },
  {
    path: 'records/legal/release', title: 'Record Release Approval', desc: 'Final Medical Superintendent/Legal approval before handing any record to a third party.',
    cols: ['Approval ID', 'Patient', 'Requesting Party', 'Documents Included', 'Approver', 'Status'],
    stats: [{ label: 'Pending Approvals', val: '5', col: 'text-amber-400' }, { label: 'Approved (Today)', val: '12', col: 'text-emerald-400' }, { label: 'Rejected', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { approvalid: 'REL-' + (5001+i), patient: 'Patient ' + (1+i), requestingparty: 'Insurance TPA', documentsincluded: 'Discharge, Labs', approver: 'MS Office', status: i<2?'Pending Auth':'Approved' };
    })`
  },

  // Document Management
  {
    path: 'records/documents/patient', title: 'Patient Documents', desc: 'General uploaded documents like ID proofs, external lab reports, and old records.',
    cols: ['Doc ID', 'Patient', 'Document Category', 'Uploaded By', 'Upload Date', 'Status'],
    stats: [{ label: 'Total Uploads', val: '1.4M', col: 'text-blue-400' }, { label: 'Storage Used', val: '2.4 TB', col: 'text-amber-400' }, { label: 'Uncategorized', val: '45', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { docid: 'DOC-' + (1001+i), patient: 'Patient ' + (1+i), documentcategory: 'Govt ID Proof', uploadedby: 'Front Desk', uploaddate: 'Today', status: 'Verified' };
    })`
  },
  {
    path: 'records/documents/consent', title: 'Consent Forms (Templates)', desc: 'Library of blank consent forms in multiple languages.',
    cols: ['Template ID', 'Procedure Name', 'Language', 'Version', 'Last Updated', 'Status'],
    stats: [{ label: 'Active Templates', val: '450', col: 'text-blue-400' }, { label: 'Languages Supported', val: '6', col: 'text-emerald-400' }, { label: 'Pending Updates', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { templateid: 'TPL-' + (2001+i), procedurename: 'Angioplasty', language: 'English/Hindi', version: 'v1.4', lastupdated: '01 Jan 2026', status: 'Active' };
    })`
  },
  {
    path: 'records/documents/scanned', title: 'Scanned Documents', desc: 'Raw scanned image files waiting to be tagged and assigned to a patient.',
    cols: ['Batch ID', 'Source Machine', 'Page Count', 'Scan Quality', 'Date', 'Status'],
    stats: [{ label: 'Unassigned Scans', val: '124', col: 'text-amber-400' }, { label: 'Processed (Today)', val: '850', col: 'text-emerald-400' }, { label: 'OCR Accuracy', val: '88%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { batchid: 'SCN-' + (3001+i), sourcemachine: 'Scanner 1', pagecount: '15 Pages', scanquality: '300 DPI', date: 'Today', status: i<2?'Pending Tagging':'Processed' };
    })`
  },
  {
    path: 'records/documents/signatures', title: 'Digital Signatures', desc: 'Managing e-signatures, DSC tokens, and biometric validations for doctors.',
    cols: ['Sign ID', 'Doctor/Staff Name', 'Auth Method', 'Signature Image', 'Valid Till', 'Status'],
    stats: [{ label: 'Active DSCs', val: '120', col: 'text-blue-400' }, { label: 'Expiring (30D)', val: '5', col: 'text-amber-400' }, { label: 'PIN Resets Req', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { signid: 'SIG-' + (4001+i), doctorstaffname: 'Dr. ' + (1+i), authmethod: 'Biometric + PIN', signatureimage: 'On File', validtill: '31 Dec 2026', status: 'Active' };
    })`
  },
  {
    path: 'records/documents/templates', title: 'Document Templates', desc: 'Standardized letterheads, medical certificate formats, and discharge summary layouts.',
    cols: ['Template Name', 'Department', 'Format Type', 'Created By', 'Last Used', 'Status'],
    stats: [{ label: 'Total Templates', val: '85', col: 'text-blue-400' }, { label: 'Most Used', val: 'Fitness Cert.', col: 'text-emerald-400' }, { label: 'Draft Templates', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { templatename: 'Medical Leave Certificate', department: 'General', formattype: 'PDF/Word', createdby: 'Admin', lastused: 'Today', status: 'Active' };
    })`
  },
  {
    path: 'records/documents/version', title: 'Version Control', desc: 'Audit trail of edits made to clinical notes or consent forms after initial saving.',
    cols: ['Document ID', 'Patient', 'Edit Timestamp', 'Edited By', 'Previous Version', 'Status'],
    stats: [{ label: 'Edits Tracked (Today)', val: '45', col: 'text-blue-400' }, { label: 'Major Revisions', val: '5', col: 'text-amber-400' }, { label: 'Locked Documents', val: '45,000', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { documentid: 'DOC-' + (5001+i), patient: 'Patient ' + (1+i), edittimestamp: 'Today 10:00', editedby: 'Dr. Smith', previousversion: 'v1.0 (Archived)', status: 'Logged' };
    })`
  },

  // Release of Information (ROI)
  {
    path: 'records/roi/patient', title: 'Patient Requests', desc: 'Requests directly from patients for copies of their own medical records.',
    cols: ['Request ID', 'Patient', 'Purpose', 'Date Received', 'Expected TAT', 'Status'],
    stats: [{ label: 'Pending Requests', val: '12', col: 'text-amber-400' }, { label: 'Fulfilled (YTD)', val: '1,240', col: 'text-blue-400' }, { label: 'Avg Processing Time', val: '24 Hrs', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { requestid: 'ROI-' + (1001+i), patient: 'Patient ' + (1+i), purpose: 'Personal Keep', datereceived: 'Yesterday', expectedtat: '48 Hrs', status: i===0?'Processing':'Dispatched' };
    })`
  },
  {
    path: 'records/roi/insurance', title: 'Insurance Requests', desc: 'Requests from TPA/Insurance companies for claims verification.',
    cols: ['Req ID', 'TPA Name', 'Patient (Claim ID)', 'Requested Docs', 'Due Date', 'Status'],
    stats: [{ label: 'Open Queries', val: '34', col: 'text-amber-400' }, { label: 'Sent (Today)', val: '45', col: 'text-emerald-400' }, { label: 'Denials due to Docs', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reqid: 'TPA-' + (2001+i), tpaname: 'Star Health', patient: 'Patient ' + (1+i), requesteddocs: 'Indoor Case Papers', duedate: 'Tomorrow', status: 'Pending Upload' };
    })`
  },
  {
    path: 'records/roi/corporate', title: 'Corporate Requests', desc: 'Pre-employment or annual health check reports sent to corporate HR partners.',
    cols: ['Batch ID', 'Corporate Name', 'Employee Count', 'Assessment Type', 'Sent Date', 'Status'],
    stats: [{ label: 'Pending Dispatches', val: '2', col: 'text-amber-400' }, { label: 'Batches Sent (Mo)', val: '15', col: 'text-blue-400' }, { label: 'Total Emp Covered', val: '850', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { batchid: 'CORP-' + (3001+i), corporatename: 'Tech Corp Ltd', employeecount: '45', assessmenttype: 'Pre-Employment', sentdate: i===0?'-':'01 Jul 2026', status: i===0?'Compiling':'Sent' };
    })`
  },
  {
    path: 'records/roi/government', title: 'Government Requests', desc: 'Requests from health ministries or municipal bodies (e.g., birth/death stats).',
    cols: ['Req ID', 'Govt Department', 'Data Requested', 'Filing Frequency', 'Deadline', 'Status'],
    stats: [{ label: 'Statutory Reports', val: '4 Due', col: 'text-amber-400' }, { label: 'Compliance', val: '100%', col: 'text-emerald-400' }, { label: 'Last Submitted', val: 'Today', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reqid: 'GOV-' + (4001+i), govtdepartment: 'Municipal Corp', datarequested: 'Birth Register (June)', filingfrequency: 'Monthly', deadline: '05 Jul 2026', status: 'Compiled' };
    })`
  },
  {
    path: 'records/roi/legal', title: 'Legal Requests', desc: 'Subpoenas and court orders for medical records (overlaps with Legal but focused on fulfillment).',
    cols: ['Req ID', 'Requestor', 'Patient', 'Documents Prepared', 'Verification', 'Status'],
    stats: [{ label: 'Pending Prep', val: '3', col: 'text-red-400' }, { label: 'Awaiting Auth', val: '1', col: 'text-amber-400' }, { label: 'Dispatched (YTD)', val: '24', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reqid: 'LGL-ROI-' + (5001+i), requestor: 'City Court', patient: 'Patient ' + (1+i), documentsprepared: 'Yes', verification: 'Legal Head Signed', status: 'Ready for Dispatch' };
    })`
  },
  {
    path: 'records/roi/workflow', title: 'Approval Workflow', desc: 'Internal queue for Medical Records Dept head to authorize outgoing information.',
    cols: ['Auth ID', 'Request Source', 'Patient', 'Information Type', 'Fee Collected', 'Status'],
    stats: [{ label: 'Pending My Auth', val: '18', col: 'text-amber-400' }, { label: 'Approved (Today)', val: '45', col: 'text-emerald-400' }, { label: 'Revenue from ROI', val: '$450', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { authid: 'AUTH-' + (6001+i), requestsource: 'Patient', patient: 'Patient ' + (1+i), informationtype: 'Full Medical Record', feecollected: 'Paid ($10)', status: 'Pending Auth' };
    })`
  },

  // Reports
  {
    path: 'records/reports/medical', title: 'Medical Record Reports', desc: 'Statistics on records created, accessed, and archived.',
    cols: ['Report Type', 'Date Range', 'Generated On', 'Generated By', 'Format', 'Status'],
    stats: [{ label: 'Reports Generated (Mo)', val: '45', col: 'text-blue-400' }, { label: 'Auto-Scheduled', val: '8', col: 'text-emerald-400' }, { label: 'Avg Generation Time', val: '4s', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reporttype: 'New IPD Files Summary', daterange: 'Last 7 Days', generatedon: 'Today', generatedby: 'System', format: 'PDF', status: 'Ready' };
    })`
  },
  {
    path: 'records/reports/coding', title: 'Coding Reports', desc: 'Summary of ICD/CPT codes assigned and frequency of specific diseases.',
    cols: ['Report Name', 'Department', 'Top Diagnosis', 'Case Count', 'Exported On', 'Status'],
    stats: [{ label: 'Top ICD-10 Code', val: 'I10 (Hypertension)', col: 'text-blue-400' }, { label: 'Uncoded Cases', val: '24', col: 'text-amber-400' }, { label: 'Coding TAT', val: '24 Hrs', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportname: 'Morbidity Profile', department: 'Medicine', topdiagnosis: 'Essential Hypertension', casecount: '450', exportedon: '01 Jul 2026', status: 'Generated' };
    })`
  },
  {
    path: 'records/reports/audit', title: 'Audit Reports', desc: 'Output of clinical and documentation audits for department heads.',
    cols: ['Audit Topic', 'Department', 'Audit Period', 'Overall Score', 'Auditor', 'Status'],
    stats: [{ label: 'Audits Completed (YTD)', val: '124', col: 'text-blue-400' }, { label: 'Action Items Open', val: '15', col: 'text-red-400' }, { label: 'Continuous Improv.', val: '+4%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { audittopic: 'Prescription Quality', department: 'Cardiology', auditperiod: 'Q2 2026', overallscore: (88+i) + '%', auditor: 'Clinical Pharmacy', status: 'Published' };
    })`
  },
  {
    path: 'records/reports/nabh', title: 'NABH Reports', desc: 'Structured reports formatted exactly as required for NABH submission.',
    cols: ['Report Title', 'NABH Chapter', 'Reporting Month', 'Data Points', 'Validation', 'Status'],
    stats: [{ label: 'Mandatory Reports', val: '24', col: 'text-blue-400' }, { label: 'Data Completeness', val: '100%', col: 'text-emerald-400' }, { label: 'Pending Sign-off', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reporttitle: 'Quality Indicators CQI', nabhchapter: 'CQI', reportingmonth: 'June 2026', datapoints: '64 KPIs', validation: 'Pending MS Sign-off', status: 'Drafting' };
    })`
  },
  {
    path: 'records/reports/infection', title: 'Infection Reports', desc: 'Epidemiological data, HAI rates, and antibiograms for the Infection Control Committee.',
    cols: ['Report Focus', 'Date Range', 'Key Finding', 'Reported To', 'Format', 'Status'],
    stats: [{ label: 'HAI Rate (Overall)', val: '1.2%', col: 'text-emerald-400' }, { label: 'SSI Rate (Surgeries)', val: '0.4%', col: 'text-emerald-400' }, { label: 'Committee Meetings', val: 'Monthly', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportfocus: 'ICU Device Days & VAP', daterange: 'Last Month', keyfinding: 'No VAP reported', reportedto: 'ICC Board', format: 'Excel/PDF', status: 'Generated' };
    })`
  },
  {
    path: 'records/reports/compliance', title: 'Compliance Reports', desc: 'Summary of statutory reporting (MLCs, Births, Deaths, Notifiable diseases).',
    cols: ['Compliance Area', 'Report Frequency', 'Last Submitted', 'Authority', 'Filing Ref', 'Status'],
    stats: [{ label: 'Filings Due This Week', val: '2', col: 'text-amber-400' }, { label: 'Late Filings', val: '0', col: 'text-emerald-400' }, { label: 'Total Compliance', val: '100%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const areas = ['Birth Register', 'Death Register', 'MLC Register', 'Biomedical Waste', 'Notifiable Diseases'];
      return { compliancearea: areas[i], reportfrequency: 'Monthly', lastsubmitted: '01 Jul 2026', authority: 'Municipal Corp', filingref: 'REF-2026-' + (10+i), status: 'Filed' };
    })`
  },
  {
    path: 'records/reports/completion', title: 'Record Completion Reports', desc: 'Tracking which doctors have the highest number of incomplete patient files.',
    cols: ['Doctor Name', 'Department', 'Incomplete Files', 'Avg Delay', 'Action Taken', 'Status'],
    stats: [{ label: 'Total Deficient Files', val: '45', col: 'text-amber-400' }, { label: 'Avg Delay', val: '3 Days', col: 'text-blue-400' }, { label: 'Privileges Suspended', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { doctorname: 'Dr. ' + (1+i), department: 'Surgery', incompletefiles: (5-i).toString(), avgdelay: (4-i) + ' Days', actiontaken: i===0?'Warning Sent':'Reminded', status: 'Action Required' };
    })`
  },

  // Analytics
  {
    path: 'records/analytics/documentation', title: 'Documentation Analytics', desc: 'Insights into EMR usage, charting time, and documentation quality.',
    cols: ['Metric', 'Current Value', 'Previous Period', 'Variance', 'Status'],
    stats: [{ label: 'Avg Charting Time', val: '12 Mins/Encounter', col: 'text-amber-400' }, { label: 'Note Completion Rate', val: '98%', col: 'text-emerald-400' }, { label: 'Copy-Paste Rate', val: '15%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Notes created in real-time', 'Files closed within 24h', 'Use of Templates', 'Voice dictation usage', 'Addendums made'];
      return { metric: metrics[i], currentvalue: (80+i*2) + '%', previousperiod: (78+i*2) + '%', variance: '+2%', status: 'Stable' };
    })`
  },
  {
    path: 'records/analytics/quality', title: 'Quality Analytics', desc: 'Trending analysis of quality indicators to predict potential safety risks.',
    cols: ['Quality Domain', 'Trend Direction', 'Risk Level', 'Key Driver', 'Mitigation', 'Status'],
    stats: [{ label: 'Overall Quality Index', val: '9.2/10', col: 'text-emerald-400' }, { label: 'Predictive Risks', val: '1', col: 'text-amber-400' }, { label: 'Patient Satisfaction', val: '4.6/5', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const domains = ['Medication Safety', 'Surgical Outcomes', 'Patient Falls', 'Discharge Delays', 'Wait Times'];
      return { qualitydomain: domains[i], trenddirection: 'Improving', risklevel: 'Low', keydriver: 'New SOP implemented', mitigation: 'Continue monitoring', status: 'Analyzed' };
    })`
  },
  {
    path: 'records/analytics/infection', title: 'Infection Analytics', desc: 'Heatmaps and predictive modeling of infection outbreaks within wards.',
    cols: ['Ward/ICU', 'Infection Rate', 'Predominant Bug', 'Outbreak Risk', 'Action Required', 'Status'],
    stats: [{ label: 'High Risk Zones', val: '0', col: 'text-emerald-400' }, { label: 'Outbreak Alerts', val: 'None', col: 'text-emerald-400' }, { label: 'Antibiotic Usage', val: 'Optimized', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { wardicu: 'ICU ' + (1+i), infectionrate: (0.5+i*0.1) + '%', predominantbug: 'K. pneumoniae', outbreakrisk: 'Low', actionrequired: 'Standard Precautions', status: 'Monitored' };
    })`
  },
  {
    path: 'records/analytics/coding', title: 'Coding Analytics', desc: 'Revenue impact analysis based on coding accuracy and case mix index.',
    cols: ['Specialty', 'Case Mix Index', 'Coding Denials', 'Revenue Impact', 'Avg DRG Weight', 'Status'],
    stats: [{ label: 'Overall CMI', val: '1.45', col: 'text-emerald-400' }, { label: 'Denials due to Coding', val: '1.5%', col: 'text-amber-400' }, { label: 'Revenue Recovered', val: '$12,500', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { specialty: 'Cardiology', casemixindex: (1.8+i*0.1).toFixed(2), codingdenials: '2%', revenueimpact: 'Minimal', avgdrgweight: (1.2+i*0.2).toFixed(2), status: 'Analyzed' };
    })`
  },
  {
    path: 'records/analytics/audit', title: 'Audit Analytics', desc: 'Identifying departments or doctors with recurrent non-compliances.',
    cols: ['Department', 'Audit Failure Rate', 'Recurrent NC Area', 'Root Cause', 'Improvement Plan', 'Status'],
    stats: [{ label: 'Most Improved Dept', val: 'Emergency', col: 'text-emerald-400' }, { label: 'Highest NC Dept', val: 'Orthopedics', col: 'text-red-400' }, { label: 'Avg Audit Score', val: '91%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: 'Dept ' + (1+i), auditfailurerate: (2+i) + '%', recurrentncarea: 'Consent Signatures', rootcause: 'Time constraints', improvementplan: 'Digital Consents', status: 'Action Needed' };
    })`
  },
  {
    path: 'records/analytics/compliance', title: 'Compliance Dashboard', desc: 'Executive view of all statutory, legal, and accreditation risks.',
    cols: ['Compliance Category', 'Readiness Score', 'Critical Gaps', 'Upcoming Deadlines', 'Owner', 'Status'],
    stats: [{ label: 'Hospital Risk Profile', val: 'Low Risk', col: 'text-emerald-400' }, { label: 'Critical Gaps', val: '0', col: 'text-emerald-400' }, { label: 'Licensing Status', val: '100% Valid', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const categories = ['NABH Readiness', 'Statutory Licenses', 'Bio-Medical Waste', 'Fire Safety', 'Radiation (AERB)'];
      return { compliancecategory: categories[i], readinessscore: (95-i) + '%', criticalgaps: 'None', upcomingdeadlines: i===1?'30 Days':'None', owner: 'Quality Head', status: 'Compliant' };
    })`
  },

  // Settings
  {
    path: 'records/settings/icd', title: 'ICD Master', desc: 'Configuration and mapping of the International Classification of Diseases database.',
    cols: ['ICD Code', 'Description', 'Category', 'Mapped CPT', 'Active Status', 'Status'],
    stats: [{ label: 'Total ICD-10 Codes', val: '72,184', col: 'text-blue-400' }, { label: 'Custom Mappings', val: '4,500', col: 'text-emerald-400' }, { label: 'Last DB Update', val: 'Jan 2026', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { icdcode: 'A0' + i + '.0', description: 'Infectious disease type ' + i, category: 'Infectious', mappedcpt: 'Multiple', activestatus: 'Yes', status: 'Active' };
    })`
  },
  {
    path: 'records/settings/templates', title: 'Document Templates Settings', desc: 'Builder interface for creating dynamic clinical forms and discharge summaries.',
    cols: ['Template Name', 'Target Entity', 'Fields Count', 'Last Edited By', 'Version', 'Status'],
    stats: [{ label: 'Dynamic Forms', val: '124', col: 'text-blue-400' }, { label: 'Print Templates', val: '45', col: 'text-emerald-400' }, { label: 'Drafts', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { templatename: 'Cardio Assessment Form', targetentity: 'OPD Encounter', fieldscount: (20+i*5).toString(), lasteditedby: 'Admin', version: 'v1.' + i, status: 'Active' };
    })`
  },
  {
    path: 'records/settings/audit', title: 'Audit Templates', desc: 'Creating custom checklists and scoring logic for internal clinical audits.',
    cols: ['Audit Name', 'Questions', 'Scoring Type', 'Applicable Depts', 'Frequency', 'Status'],
    stats: [{ label: 'Configured Audits', val: '24', col: 'text-blue-400' }, { label: 'Automated Scoring', val: 'Enabled', col: 'text-emerald-400' }, { label: 'Scheduled Audits', val: '8/Month', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { auditname: 'Nursing Handover Audit', questions: '15', scoringtype: 'Percentage (0-100)', applicabledepts: 'All IPD', frequency: 'Weekly', status: 'Active' };
    })`
  },
  {
    path: 'records/settings/quality', title: 'Quality Indicators Settings', desc: 'Defining formulas, data sources, and benchmarks for all KPIs.',
    cols: ['Indicator', 'Numerator', 'Denominator', 'Target/Benchmark', 'Source Dept', 'Status'],
    stats: [{ label: 'Active Indicators', val: '64', col: 'text-blue-400' }, { label: 'Automated Data Collection', val: '48', col: 'text-emerald-400' }, { label: 'Manual Entry', val: '16', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { indicator: 'Medication Errors', numerator: 'No of Errors', denominator: 'Total Patient Days', targetbenchmark: '0', sourcedept: 'Pharmacy/Nursing', status: 'Active' };
    })`
  },
  {
    path: 'records/settings/compliance', title: 'Compliance Rules', desc: 'Setting up automated alerts and escalation matrices for missing signatures or documents.',
    cols: ['Rule Name', 'Trigger Condition', 'Alert Timing', 'Escalation To', 'Auto-Locking', 'Status'],
    stats: [{ label: 'Active Rules', val: '15', col: 'text-blue-400' }, { label: 'Auto-escalations (YTD)', val: '145', col: 'text-amber-400' }, { label: 'System Locks', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { rulename: 'Discharge Summary Sign', triggercondition: 'Missing > 24H', alerttiming: '24H post discharge', escalationto: 'Dept Head', autolocking: 'At 48H', status: 'Active' };
    })`
  },
  {
    path: 'records/settings/retention', title: 'Record Retention Policy', desc: 'Configuring statutory timeframes for archiving and purging physical/digital records.',
    cols: ['Record Type', 'Retention Period (Adult)', 'Retention Period (Minor)', 'Action Post Retention', 'Legal Hold', 'Status'],
    stats: [{ label: 'Retention Policies', val: '12', col: 'text-blue-400' }, { label: 'Files on Legal Hold', val: '45', col: 'text-red-400' }, { label: 'Next Purge Cycle', val: 'Dec 2026', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['OPD Records', 'IPD Records', 'MLC Records', 'Birth/Death Records', 'Consents'];
      return { recordtype: types[i], retentionperiodadult: i===2?'Lifetime':'5 Years', retentionperiodminor: 'Till age 21', actionpostretention: 'Secure Destruction', legalhold: 'No', status: 'Active' };
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
        const isGood = val === 'Active' || val === 'Reported' || val === 'Approved' || val === 'Cleared' || val === 'Valid' || val === 'Dispatched' || val === 'Sent' || val === 'Verified' || val === 'Processed' || val === 'Filed' || val === 'Stable' || val === 'Analyzed' || val === 'Compliant' || val === 'Ready' || val === 'Generated' || val === 'Published' || val === 'Audited' || val === 'Closed' || val === 'Acknowledged';
        const isWarning = val === 'Monitored' || val === 'Pending Auth' || val === 'Action Required' || val === 'Drafting Reply' || val === 'Pending Tagging' || val === 'Processing' || val === 'Pending Upload' || val === 'Compiling' || val === 'Pending Prep' || val === 'Ready for Dispatch' || val === 'Action Needed' || val === 'Drafting';
        const isNeutral = val === 'Intimated' || val === 'Ongoing' || val === 'Compiled';
        const isDanger = val === 'Failed' || val === 'Rejected';
        
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
