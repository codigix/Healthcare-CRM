const fs = require('fs');
const path = require('path');

const config = [
  // Medical Records
  {
    path: 'records/medical/patient', title: 'Patient Medical Records', desc: 'Central repository of all longitudinal patient health records (EMR).',
    cols: ['UHID', 'Patient Name', 'Last Visit', 'Primary Doctor', 'Record Status', 'Status'],
    stats: [{ label: 'Total Active Records', val: '124,500', col: 'text-blue-400' }, { label: 'Updated Today', val: '450', col: 'text-emerald-400' }, { label: 'Missing Data', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Complete', 'Pending Updates', 'Complete', 'Archived', 'Complete'];
      return { uhid: 'UHID-' + (10001+i), patientname: 'Patient ' + (i+1), lastvisit: '01 Jul 2026', primarydoctor: 'Dr. Smith', recordstatus: statuses[i], status: statuses[i]==='Complete'?'Active':'Review' };
    })`
  },
  {
    path: 'records/medical/opd', title: 'OPD Records', desc: 'Outpatient consultation notes, prescriptions, and follow-up data.',
    cols: ['Visit ID', 'UHID', 'Patient', 'Consulting Dept', 'Date', 'Status'],
    stats: [{ label: 'OPD Visits (Mo)', val: '4,500', col: 'text-blue-400' }, { label: 'Prescriptions Gen', val: '4,200', col: 'text-emerald-400' }, { label: 'Follow-ups Due', val: '150', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { visitid: 'OPD-' + (2001+i), uhid: 'UHID-' + (10001+i), patient: 'Patient ' + (1+i), consultingdept: 'Cardiology', date: 'Today', status: 'Completed' };
    })`
  },
  {
    path: 'records/medical/ipd', title: 'IPD Records', desc: 'Comprehensive inpatient case sheets from admission to discharge.',
    cols: ['IPD No', 'Patient', 'Ward/Bed', 'Admission Date', 'Discharge Date', 'Status'],
    stats: [{ label: 'Active IPD Cases', val: '340', col: 'text-blue-400' }, { label: 'Discharged (Mo)', val: '850', col: 'text-emerald-400' }, { label: 'Files Pending Closure', val: '45', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===1?'Discharged (File Open)':'Admitted';
      return { ipdno: 'IPD-' + (3001+i), patient: 'Patient ' + (1+i), wardbed: 'Ward A / Bed ' + (10+i), admissiondate: '01 Jul 2026', dischargedate: statuses==='Admitted'?'-':'05 Jul 2026', status: statuses };
    })`
  },
  {
    path: 'records/medical/emergency', title: 'Emergency Records', desc: 'Rapid documentation and triage logs for emergency department cases.',
    cols: ['ER No', 'Patient', 'Triage Level', 'Arrival Time', 'Disposition', 'Status'],
    stats: [{ label: 'ER Cases (24H)', val: '85', col: 'text-red-400' }, { label: 'Admitted from ER', val: '24', col: 'text-amber-400' }, { label: 'MLC Cases', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const levels = ['Red (Resuscitation)', 'Yellow (Emergent)', 'Green (Urgent)', 'Yellow', 'Green'];
      const dispositions = ['Admitted to ICU', 'Under Observation', 'Discharged', 'Admitted to Ward', 'Discharged'];
      return { erno: 'ER-' + (4001+i), patient: 'Patient ' + (1+i), triagelevel: levels[i], arrivaltime: 'Today 10:' + (10+i*5), disposition: dispositions[i], status: 'Stabilized' };
    })`
  },
  {
    path: 'records/medical/archived', title: 'Archived Records', desc: 'Historical patient files securely stored as per statutory retention policies.',
    cols: ['Archive ID', 'UHID', 'Patient', 'Archived Date', 'Retention Till', 'Status'],
    stats: [{ label: 'Total Archived', val: '45,200', col: 'text-blue-400' }, { label: 'Due for Destruction', val: '120', col: 'text-amber-400' }, { label: 'Digitized %', val: '85%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { archiveid: 'ARC-' + (5001+i), uhid: 'UHID-' + (500+i), patient: 'Patient ' + (1+i), archivedate: '01 Jan 2020', retentiontill: '01 Jan 2030', status: 'Securely Archived' };
    })`
  },
  {
    path: 'records/medical/requests', title: 'Record Requests', desc: 'Internal requests from doctors or departments for physical file retrieval.',
    cols: ['Req ID', 'Requested By', 'UHID', 'Purpose', 'Date', 'Status'],
    stats: [{ label: 'Pending Requests', val: '12', col: 'text-amber-400' }, { label: 'Fulfilled Today', val: '34', col: 'text-emerald-400' }, { label: 'Avg TAT', val: '15 Mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Auth', 'Dispatched', 'Pending Auth', 'Returned', 'Dispatched'];
      return { reqid: 'REQ-' + (6001+i), requestedby: 'Dr. Jones', uhid: 'UHID-' + (100+i), purpose: 'Surgical Planning', date: 'Today', status: statuses[i] };
    })`
  },
  {
    path: 'records/medical/tracking', title: 'Record Tracking', desc: 'Barcode/RFID tracking system for movement of physical medical files.',
    cols: ['File No', 'UHID', 'Current Location', 'Issued To', 'Issued On', 'Status'],
    stats: [{ label: 'Files in Circulation', val: '145', col: 'text-blue-400' }, { label: 'Overdue Returns', val: '8', col: 'text-red-400' }, { label: 'Lost Files', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===1?'Overdue':(i===3?'In Transit':'Checked Out');
      return { fileno: 'FIL-' + (7001+i), uhid: 'UHID-' + (200+i), currentlocation: i===3?'Transport Staff':'Ward A', issuedto: 'Nurse Mary', issuedon: 'Yesterday', status: statuses };
    })`
  },

  // Clinical Documentation
  {
    path: 'records/clinical/progress', title: 'Progress Notes', desc: 'Daily chronological records of patient status, written by the care team.',
    cols: ['Note ID', 'Patient', 'Author', 'Designation', 'Date & Time', 'Status'],
    stats: [{ label: 'Notes Logged (24H)', val: '1,240', col: 'text-blue-400' }, { label: 'Unsigned Notes', val: '45', col: 'text-amber-400' }, { label: 'Late Entries', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { noteid: 'PRG-' + (1001+i), patient: 'Patient ' + (1+i), author: 'Dr. Smith', designation: 'Resident', datetime: 'Today 09:00', status: i===0?'Draft':'Signed' };
    })`
  },
  {
    path: 'records/clinical/doctor', title: 'Doctor Notes', desc: 'Detailed clinical evaluations, differential diagnosis, and treatment plans.',
    cols: ['Visit/IPD No', 'Patient', 'Consultant', 'Note Type', 'Last Updated', 'Status'],
    stats: [{ label: 'Consult Notes (Today)', val: '340', col: 'text-blue-400' }, { label: 'Pending Addendums', val: '8', col: 'text-amber-400' }, { label: 'Peer Reviewed', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Initial Eval', 'Follow-up', 'Consultation', 'Follow-up', 'Initial Eval'];
      return { visitipdno: 'OPD-' + (2001+i), patient: 'Patient ' + (1+i), consultant: 'Dr. Chief', notetype: types[i], lastupdated: 'Today', status: 'Finalized' };
    })`
  },
  {
    path: 'records/clinical/nursing', title: 'Nursing Notes', desc: 'Nursing assessments, care plans, vital signs monitoring, and handover notes.',
    cols: ['Patient', 'Ward/Bed', 'Nurse on Duty', 'Shift', 'Entry Type', 'Status'],
    stats: [{ label: 'Handover Compliance', val: '98%', col: 'text-emerald-400' }, { label: 'Missed Vitals', val: '4', col: 'text-red-400' }, { label: 'Care Plans Active', val: '340', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Shift Handover', 'Vitals Charting', 'Medication Admin', 'Wound Care', 'Shift Handover'];
      return { patient: 'Patient ' + (1+i), wardbed: 'ICU / Bed ' + (1+i), nurseonduty: 'Nurse Alice', shift: 'Morning', entrytype: types[i], status: 'Logged' };
    })`
  },
  {
    path: 'records/clinical/operative', title: 'Operative Notes', desc: 'Detailed surgical procedures documented by the primary surgeon.',
    cols: ['Surgery ID', 'Patient', 'Primary Surgeon', 'Procedure', 'Date', 'Status'],
    stats: [{ label: 'Surgeries Today', val: '24', col: 'text-blue-400' }, { label: 'Notes Pending', val: '2', col: 'text-amber-400' }, { label: 'Anesthesia Notes', val: '24/24', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { surgeryid: 'SUR-' + (3001+i), patient: 'Patient ' + (1+i), primarysurgeon: 'Dr. Cutter', procedure: 'CABG', date: 'Today', status: i===0?'Dictation Pending':'Signed' };
    })`
  },
  {
    path: 'records/clinical/procedure', title: 'Procedure Notes', desc: 'Documentation for minor procedures (endoscopy, cath lab, dialysis).',
    cols: ['Proc ID', 'Patient', 'Performing Doctor', 'Procedure Type', 'Date', 'Status'],
    stats: [{ label: 'Procedures (Today)', val: '85', col: 'text-blue-400' }, { label: 'Complications Logged', val: '0', col: 'text-emerald-400' }, { label: 'Pending Notes', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Endoscopy', 'Dialysis', 'Angiography', 'Dialysis', 'Biopsy'];
      return { procid: 'PRC-' + (4001+i), patient: 'Patient ' + (1+i), performingdoctor: 'Dr. Specialist', proceduretype: types[i], date: 'Yesterday', status: 'Finalized' };
    })`
  },
  {
    path: 'records/clinical/consultation', title: 'Consultation Notes', desc: 'Cross-departmental referral notes and specialist opinions.',
    cols: ['Ref ID', 'Patient', 'Referring Dept', 'Consulting Dept', 'Opinion Status', 'Status'],
    stats: [{ label: 'Active Referrals', val: '45', col: 'text-blue-400' }, { label: 'Avg Response Time', val: '2.5 Hrs', col: 'text-emerald-400' }, { label: 'Overdue Consults', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { refid: 'REF-' + (5001+i), patient: 'Patient ' + (1+i), referringdept: 'Ortho', consultingdept: 'Cardio', opinionstatus: i===1?'Pending Eval':'Opinion Provided', status: i===1?'In Progress':'Completed' };
    })`
  },
  {
    path: 'records/clinical/discharge', title: 'Discharge Summary', desc: 'Comprehensive summary generated at the time of patient discharge.',
    cols: ['IPD No', 'Patient', 'Discharge Date', 'Primary Consultant', 'Summary Draft', 'Status'],
    stats: [{ label: 'Discharges (Today)', val: '34', col: 'text-blue-400' }, { label: 'Summaries Pending', val: '4', col: 'text-amber-400' }, { label: 'Avg TAT to Patient', val: '45 Mins', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===0?'Draft':'Finalized';
      return { ipdno: 'IPD-' + (6001+i), patient: 'Patient ' + (1+i), dischargedate: 'Today', primaryconsultant: 'Dr. House', summarydraft: statuses, status: statuses==='Draft'?'Action Required':'Handed Over' };
    })`
  },
  {
    path: 'records/clinical/death', title: 'Death Summary', desc: 'Detailed clinical summary and cause of death documentation.',
    cols: ['IPD No', 'Patient', 'Date of Death', 'Consultant', 'Cause Declared', 'Status'],
    stats: [{ label: 'Mortality (Mo)', val: '8', col: 'text-gray-400' }, { label: 'Summaries Pending', val: '0', col: 'text-emerald-400' }, { label: 'MLC Conversions', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ipdno: 'IPD-' + (7001+i), patient: 'Patient ' + (1+i), dateofdeath: '01 Jun 2026', consultant: 'Dr. Smith', causedeclared: 'Cardiac Arrest', status: 'Finalized' };
    })`
  },

  // Health Information Management
  {
    path: 'records/him/indexing', title: 'Record Indexing', desc: 'Categorization and tagging of medical records for easy search and retrieval.',
    cols: ['Record ID', 'Patient', 'Document Type', 'Indexed By', 'Tags', 'Status'],
    stats: [{ label: 'Backlog to Index', val: '145', col: 'text-amber-400' }, { label: 'Indexed Today', val: '850', col: 'text-blue-400' }, { label: 'Accuracy Rate', val: '99.5%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { recordid: 'REC-' + (1001+i), patient: 'Patient ' + (1+i), documenttype: 'Lab Report', indexedby: 'HIM Clerk', tags: 'Blood, Pathology', status: 'Indexed' };
    })`
  },
  {
    path: 'records/him/completion', title: 'Record Completion', desc: 'Ensuring all discharged patient files have required signatures and notes.',
    cols: ['IPD No', 'Patient', 'Discharge Date', 'Missing Elements', 'Assigned Doctor', 'Status'],
    stats: [{ label: 'Files for Review', val: '45', col: 'text-blue-400' }, { label: 'Completed (YTD)', val: '95%', col: 'text-emerald-400' }, { label: 'Overdue (>30D)', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ipdno: 'IPD-' + (2001+i), patient: 'Patient ' + (1+i), dischargedate: '01 Jul 2026', missingelements: i===0?'Surgeon Signature':'None', assigneddoctor: 'Dr. Smith', status: i===0?'Deficient':'Complete' };
    })`
  },
  {
    path: 'records/him/missing', title: 'Missing Documents', desc: 'Tracking specific documents (e.g., consents, reports) absent from the master file.',
    cols: ['UHID', 'Patient', 'Encounter', 'Missing Document', 'Responsible Dept', 'Status'],
    stats: [{ label: 'Total Deficiencies', val: '34', col: 'text-red-400' }, { label: 'Resolved Today', val: '12', col: 'text-emerald-400' }, { label: 'Escalated', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const docs = ['Anesthesia Consent', 'ECG Report', 'Transfer Note', 'Blood Transfusion Form', 'Discharge Summary Copy'];
      return { uhid: 'UHID-' + (3001+i), patient: 'Patient ' + (1+i), encounter: 'IPD-' + (100+i), missingdocument: docs[i], responsibledept: 'Ward A', status: 'Action Required' };
    })`
  },
  {
    path: 'records/him/incomplete', title: 'Incomplete Records', desc: 'Dashboard of partially filled forms or notes lacking critical clinical data.',
    cols: ['Doc ID', 'Document Name', 'Author', 'Deficiency Details', 'Date Flagged', 'Status'],
    stats: [{ label: 'Incomplete Forms', val: '28', col: 'text-amber-400' }, { label: 'Doctors Notified', val: '15', col: 'text-blue-400' }, { label: 'Average Age', val: '4 Days', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { docid: 'DOC-' + (4001+i), documentname: 'Admission Assessment', author: 'Dr. Junior', deficiencydetails: 'Allergies not filled', dateflagged: 'Yesterday', status: 'Pending Doctor' };
    })`
  },
  {
    path: 'records/him/duplicate', title: 'Duplicate Record Check', desc: 'Identifying and merging duplicate patient UHIDs to maintain data integrity.',
    cols: ['Potential Duplicates', 'Match Score', 'Name 1 (UHID 1)', 'Name 2 (UHID 2)', 'Action', 'Status'],
    stats: [{ label: 'Suspected Duplicates', val: '18', col: 'text-amber-400' }, { label: 'Merged (YTD)', val: '145', col: 'text-emerald-400' }, { label: 'False Positives', val: '12', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { potentialduplicates: '2 Records', matchscore: (90+i) + '%', name1: 'John D (U-101)', name2: 'J. Doe (U-504)', action: 'Merge Pending', status: 'Review Needed' };
    })`
  },
  {
    path: 'records/him/scanning', title: 'Document Scanning', desc: 'Queue management for digitization of old physical files or external reports.',
    cols: ['Batch ID', 'Source Dept', 'Document Count', 'Scanned By', 'QA Check', 'Status'],
    stats: [{ label: 'Pages Scanned (Mo)', val: '14,500', col: 'text-blue-400' }, { label: 'Pending Queue', val: '850', col: 'text-amber-400' }, { label: 'QA Rejects', val: '2%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending QA', 'Digitized', 'Pending QA', 'Rejected', 'Digitized'];
      return { batchid: 'BCH-' + (5001+i), sourcedept: 'OPD', documentcount: (50+i*10).toString(), scannedby: 'Operator 1', qacheck: statuses==='Digitized'?'Passed':(statuses==='Rejected'?'Failed':'Pending'), status: statuses[i] };
    })`
  },
  {
    path: 'records/him/archive', title: 'Digital Archive', desc: 'Secure, long-term storage vault for all finalized electronic health records.',
    cols: ['File ID', 'Patient', 'Size', 'Encryption Level', 'Archive Date', 'Status'],
    stats: [{ label: 'Archive Size', val: '4.5 TB', col: 'text-blue-400' }, { label: 'Files Secured', val: '1.2M', col: 'text-emerald-400' }, { label: 'Backup Status', val: 'Synced', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { fileid: 'ARC-' + (6001+i), patient: 'Patient ' + (1+i), size: (12+i) + ' MB', encryptionlevel: 'AES-256', archivedate: '01 Jan 2026', status: 'Secured' };
    })`
  },

  // Medical Coding
  {
    path: 'records/coding/icd10', title: 'ICD-10 Coding', desc: 'Assigning International Classification of Diseases (10th Rev) codes to diagnoses.',
    cols: ['Encounter ID', 'Patient', 'Primary Diagnosis', 'ICD-10 Code', 'Coder', 'Status'],
    stats: [{ label: 'Files Coded (Today)', val: '145', col: 'text-blue-400' }, { label: 'Pending Coding', val: '34', col: 'text-amber-400' }, { label: 'Auto-Coded %', val: '45%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const diags = ['Essential Hypertension', 'Type 2 Diabetes', 'Acute Appendicitis', 'Pneumonia', 'Migraine'];
      const codes = ['I10', 'E11.9', 'K35.80', 'J18.9', 'G43.909'];
      return { encounterid: 'ENC-' + (1001+i), patient: 'Patient ' + (1+i), primarydiagnosis: diags[i], icd10code: codes[i], coder: i===0?'System':'Coder A', status: 'Coded' };
    })`
  },
  {
    path: 'records/coding/icd11', title: 'ICD-11 Coding', desc: 'Transition and mapping to the latest ICD-11 coding standards.',
    cols: ['Encounter ID', 'Patient', 'ICD-10 Code', 'ICD-11 Mapping', 'Verification', 'Status'],
    stats: [{ label: 'Transition Progress', val: '85%', col: 'text-blue-400' }, { label: 'Mapping Errors', val: '12', col: 'text-red-400' }, { label: 'Verified Codes', val: '1,240', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { encounterid: 'ENC-' + (2001+i), patient: 'Patient ' + (1+i), icd10code: 'I10', icd11mapping: 'BA00', verification: i===1?'Pending':'Verified', status: i===1?'Review Needed':'Active' };
    })`
  },
  {
    path: 'records/coding/cpt', title: 'CPT Coding', desc: 'Current Procedural Terminology coding for outpatient and surgical procedures.',
    cols: ['Procedure ID', 'Patient', 'Procedure Name', 'CPT Code', 'Modifier', 'Status'],
    stats: [{ label: 'Procedures Coded', val: '85', col: 'text-blue-400' }, { label: 'Pending CPT', val: '12', col: 'text-amber-400' }, { label: 'Claim Ready %', val: '95%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { procedureid: 'PRC-' + (3001+i), patient: 'Patient ' + (1+i), procedurename: 'Colonoscopy', cptcode: '45378', modifier: '-', status: 'Coded' };
    })`
  },
  {
    path: 'records/coding/procedure', title: 'Procedure Coding (Internal)', desc: 'Hospital-specific tariff/procedure codes mapping to standard CPT/ICD.',
    cols: ['Internal Code', 'Service Name', 'Standard Mapping', 'Charge Head', 'Status'],
    stats: [{ label: 'Total Internal Codes', val: '4,500', col: 'text-blue-400' }, { label: 'Unmapped Codes', val: '24', col: 'text-red-400' }, { label: 'Recent Updates', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { internalcode: 'HOSP-' + (1001+i), servicename: 'Specialist Consult ' + (1+i), standardmapping: '99214', chargehead: 'Consultation', status: 'Mapped' };
    })`
  },
  {
    path: 'records/coding/drg', title: 'DRG Coding', desc: 'Diagnosis-Related Group assignments for inpatient insurance billing and case mix analysis.',
    cols: ['IPD No', 'Patient', 'Primary ICD', 'Secondary ICDs', 'Assigned DRG', 'Status'],
    stats: [{ label: 'DRG Assigned (Mo)', val: '850', col: 'text-blue-400' }, { label: 'Case Mix Index', val: '1.45', col: 'text-emerald-400' }, { label: 'DRG Denials', val: '2%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ipdno: 'IPD-' + (4001+i), patient: 'Patient ' + (1+i), primaryicd: 'I10', secondaryicds: '2 Codes', assigneddrg: 'DRG-' + (100+i), status: 'Assigned' };
    })`
  },
  {
    path: 'records/coding/audit', title: 'Coding Audit', desc: 'Quality checks on assigned codes to prevent upcoding, downcoding, or rejections.',
    cols: ['Audit ID', 'Encounter', 'Original Coder', 'Auditor', 'Variance Found', 'Status'],
    stats: [{ label: 'Files Audited (Mo)', val: '350', col: 'text-blue-400' }, { label: 'Accuracy Rate', val: '94%', col: 'text-emerald-400' }, { label: 'Major Errors', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const variances = i===1?'Upcoding Detected':(i===3?'Modifier Missing':'None');
      return { auditid: 'AUD-' + (5001+i), encounter: 'IPD-' + (101+i), originalcoder: 'Coder A', auditor: 'Lead Coder', variancefound: variances, status: variances==='None'?'Passed QA':'Failed QA' };
    })`
  },

  // Clinical Audit
  {
    path: 'records/audit/documentation', title: 'Documentation Audit', desc: 'Reviewing clinical notes for legibility, timeliness, and completeness.',
    cols: ['Audit ID', 'Department', 'Records Sampled', 'Compliance Score', 'Major Deficiencies', 'Status'],
    stats: [{ label: 'Avg Dept Score', val: '88%', col: 'text-blue-400' }, { label: 'Top Dept (Docs)', val: 'ICU', col: 'text-emerald-400' }, { label: 'Open NCs', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['ICU', 'Cardiology', 'Orthopedics', 'Emergency', 'Pediatrics'];
      return { auditid: 'DAUD-' + (101+i), department: depts[i], recordssampled: '50', compliancescore: (85+i*2) + '%', majordeficiencies: i===3?'Delayed Notes':'None', status: i===3?'Action Needed':'Compliant' };
    })`
  },
  {
    path: 'records/audit/case-sheet', title: 'Case Sheet Audit', desc: 'In-depth peer review of inpatient files to ensure adherence to clinical pathways.',
    cols: ['IPD No', 'Patient', 'Primary Doctor', 'Auditor', 'Pathway Adherence', 'Status'],
    stats: [{ label: 'Files Audited', val: '120', col: 'text-blue-400' }, { label: 'Protocol Deviations', val: '5', col: 'text-amber-400' }, { label: 'Clinical Excellence', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ipdno: 'IPD-' + (2001+i), patient: 'Patient ' + (1+i), primarydoctor: 'Dr. Surgeon', auditor: 'Dr. Peer', pathwayadherence: i===2?'Minor Deviation':'100%', status: 'Audited' };
    })`
  },
  {
    path: 'records/audit/prescription', title: 'Prescription Audit', desc: 'Auditing prescriptions for legibility, generic names, allergies, and interactions.',
    cols: ['Rx ID', 'Prescriber', 'No of Drugs', 'Generics %', 'Errors Found', 'Status'],
    stats: [{ label: 'Generic Prescribing', val: '92%', col: 'text-emerald-400' }, { label: 'DDI Alerts Overridden', val: '18', col: 'text-amber-400' }, { label: 'Illegible Rx', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { rxid: 'RX-' + (3001+i), prescriber: 'Dr. ' + (1+i), noofdrugs: (3+i).toString(), generics: '100%', errorsfound: i===1?'Dose omission':'None', status: i===1?'Feedback Sent':'Passed QA' };
    })`
  },
  {
    path: 'records/audit/mortality', title: 'Mortality Audit', desc: 'Clinical review of all hospital deaths to identify preventable causes.',
    cols: ['Death Record', 'Date of Death', 'Department', 'Review Committee', 'Preventability', 'Status'],
    stats: [{ label: 'Total Reviews', val: '8', col: 'text-blue-400' }, { label: 'Pending Reviews', val: '2', col: 'text-amber-400' }, { label: 'Preventable (YTD)', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { deathrecord: 'DTH-' + (4001+i), dateofdeath: '01 Jun 2026', department: 'ICU', reviewcommittee: 'Mortality Board', preventability: 'Non-preventable', status: i===0?'Under Review':'Closed' };
    })`
  },
  {
    path: 'records/audit/readmission', title: 'Readmission Audit', desc: 'Tracking patients readmitted within 30 days for the same diagnosis.',
    cols: ['UHID', 'Patient', 'Previous Discharge', 'Readmission Date', 'Root Cause', 'Status'],
    stats: [{ label: '30-Day Readmit Rate', val: '2.4%', col: 'text-emerald-400' }, { label: 'High Risk Dept', val: 'Pulmonology', col: 'text-amber-400' }, { label: 'Cases Analyzed', val: '15', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { uhid: 'UHID-' + (5001+i), patient: 'Patient ' + (1+i), previousdischarge: '15 May 2026', readmissiondate: '02 Jun 2026', rootcause: 'Non-compliance to Rx', status: 'Analyzed' };
    })`
  },
  {
    path: 'records/audit/surgical', title: 'Surgical Audit', desc: 'Review of surgical outcomes, prolonged OT times, and post-op complications.',
    cols: ['Surgery ID', 'Procedure', 'Surgeon', 'Est. Time', 'Actual Time', 'Complication', 'Status'],
    stats: [{ label: 'Avg OT Utilization', val: '85%', col: 'text-emerald-400' }, { label: 'Surgical Site Infections', val: '0', col: 'text-emerald-400' }, { label: 'Re-explorations', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { surgeryid: 'SUR-' + (6001+i), procedure: 'Appendectomy', surgeon: 'Dr. Surgeon', esttime: '60 Mins', actualtime: (55+i*10) + ' Mins', complication: i===4?'Prolonged Time':'None', status: 'Audited' };
    })`
  },

  // Quality Management
  {
    path: 'records/quality/indicators', title: 'Quality Indicators', desc: 'Hospital-wide clinical and managerial quality metrics (NABH/JCI based).',
    cols: ['Indicator ID', 'Domain', 'Indicator Name', 'Target', 'Current Value', 'Status'],
    stats: [{ label: 'Total Indicators', val: '64', col: 'text-blue-400' }, { label: 'Meeting Targets', val: '58', col: 'text-emerald-400' }, { label: 'Falling Short', val: '6', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Time to Initial Assessment', 'Medication Error Rate', 'Return to ICU < 48h', 'Patient Satisfaction Score', 'Bed Occupancy Rate'];
      const targets = ['< 15 Mins', '0%', '< 2%', '> 90%', '75-85%'];
      const currents = ['12 Mins', '0.1%', '1.5%', '92%', '82%'];
      return { indicatorid: 'QI-' + (101+i), domain: 'Clinical', indicatorname: names[i], target: targets[i], currentvalue: currents[i], status: 'Monitored' };
    })`
  },
  {
    path: 'records/quality/patient-safety', title: 'Patient Safety', desc: 'Specific indicators tracking falls, bedsores, and medication safety.',
    cols: ['Safety Area', 'Metric', 'Occurrences (Mo)', 'Severity Level', 'Trend', 'Status'],
    stats: [{ label: 'Patient Falls (Mo)', val: '2', col: 'text-amber-400' }, { label: 'HAPU (Bedsores)', val: '0', col: 'text-emerald-400' }, { label: 'Safety Score', val: '98/100', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const areas = ['Patient Falls', 'Pressure Ulcers', 'Medication Errors', 'Patient Identification', 'Surgical Safety'];
      return { safetyarea: areas[i], metric: 'Incidents/1000 Patient Days', occurrences: i===0?'2':'0', severitylevel: i===0?'Low':'None', trend: 'Stable', status: 'Compliant' };
    })`
  },
  {
    path: 'records/quality/kpi', title: 'Quality KPI Dashboard', desc: 'Executive dashboard visualizing performance across all quality parameters.',
    cols: ['Department', 'KPI Metric', 'Target', 'Achieved', 'Variance', 'Status'],
    stats: [{ label: 'Hospital Quality Score', val: '94%', col: 'text-blue-400' }, { label: 'Top Quality Dept', val: 'ICU', col: 'text-emerald-400' }, { label: 'Requires Action', val: '2 Depts', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: 'Dept ' + (1+i), kpimetric: 'Overall Compliance', target: '95%', achieved: (90+i) + '%', variance: (i-5) + '%', status: i<2?'Action Needed':'On Track' };
    })`
  },
  {
    path: 'records/quality/sentinel', title: 'Sentinel Events', desc: 'Logging and immediate investigation of severe, unexpected patient harm events.',
    cols: ['Event ID', 'Date & Time', 'Event Description', 'Location', 'Immediate Action', 'Status'],
    stats: [{ label: 'Sentinel Events (YTD)', val: '1', col: 'text-red-400' }, { label: 'Open Investigations', val: '0', col: 'text-emerald-400' }, { label: 'Days Since Last Event', val: '214', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 2 }).map((_, i) => {
      return { eventid: 'SNT-' + (1001+i), datetime: '15 Nov 2025', eventdescription: 'Wrong site surgery (near miss)', location: 'OT 2', immediateaction: 'Procedure Halted', status: 'Closed' };
    })`
  },
  {
    path: 'records/quality/near-miss', title: 'Near Miss Events', desc: 'Reporting of errors caught just before they reached the patient (Good Catches).',
    cols: ['Report ID', 'Date', 'Reported By', 'Event Description', 'Harm Prevented', 'Status'],
    stats: [{ label: 'Good Catches (Mo)', val: '12', col: 'text-blue-400' }, { label: 'Top Reporting Dept', val: 'Pharmacy', col: 'text-emerald-400' }, { label: 'Reward Points Distributed', val: '120', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportid: 'NMR-' + (2001+i), date: 'Today', reportedby: 'Nurse Alice', eventdescription: 'Look-alike drug dispensed', harmprevented: 'Adverse Drug Event', status: 'Acknowledged' };
    })`
  },
  {
    path: 'records/quality/rca', title: 'Root Cause Analysis (RCA)', desc: 'Structured problem-solving (Fishbone/5 Whys) for identified quality failures.',
    cols: ['RCA ID', 'Linked Event', 'Methodology', 'Lead Investigator', 'Target Date', 'Status'],
    stats: [{ label: 'Open RCAs', val: '3', col: 'text-amber-400' }, { label: 'Avg Completion Time', val: '14 Days', col: 'text-blue-400' }, { label: 'Corrective Actions Formed', val: '18', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { rcaid: 'RCA-' + (3001+i), linkedevent: 'INC-' + (100+i), methodology: '5 Whys', leadinvestigator: 'Quality Head', targetdate: '15 Jul 2026', status: i===0?'In Progress':'Completed' };
    })`
  },
  {
    path: 'records/quality/capa', title: 'CAPA', desc: 'Corrective and Preventive Actions tracking arising from audits or RCAs.',
    cols: ['CAPA ID', 'Source', 'Action Description', 'Assigned To', 'Deadline', 'Status'],
    stats: [{ label: 'Total Open CAPAs', val: '15', col: 'text-amber-400' }, { label: 'Overdue Actions', val: '2', col: 'text-red-400' }, { label: 'Closed (Mo)', val: '8', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===0?'Overdue':(i===1?'In Progress':'Closed');
      return { capaid: 'CAPA-' + (4001+i), source: 'Internal Audit', actiondescription: 'Update hand hygiene SOP', assignedto: 'Infection Control Officer', deadline: '30 Jun 2026', status: statuses };
    })`
  },

  // NABH / Accreditation
  {
    path: 'records/accreditation/nabh', title: 'NABH Standards', desc: 'Mapping of hospital practices against specific chapters and objective elements of NABH.',
    cols: ['Chapter', 'Standard', 'Objective Element', 'Compliance %', 'Evidence Attached', 'Status'],
    stats: [{ label: 'Overall NABH Score', val: '92%', col: 'text-emerald-400' }, { label: 'Chapters 100%', val: '4/10', col: 'text-blue-400' }, { label: 'Major Gaps', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const chapters = ['AAC', 'COP', 'MOM', 'PRE', 'HIC'];
      return { chapter: chapters[i], standard: chapters[i] + '.1', objectiveelement: 'a, b, c', compliance: (85+i*3) + '%', evidenceattached: '3 Files', status: 'Compliant' };
    })`
  },
  {
    path: 'records/accreditation/jci', title: 'JCI Standards', desc: 'Tracking requirements for Joint Commission International (if applicable/aspiring).',
    cols: ['Chapter', 'Measurable Element', 'Current Practice', 'Gap Identified', 'Action Plan', 'Status'],
    stats: [{ label: 'JCI Readiness', val: '75%', col: 'text-amber-400' }, { label: 'Target Assessment', val: 'Dec 2026', col: 'text-blue-400' }, { label: 'Open Gaps', val: '45', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { chapter: 'IPSG', measurableelement: 'ME ' + (1+i), currentpractice: 'Partially Implemented', gapidentified: 'Documentation lack', actionplan: 'Training scheduled', status: 'In Progress' };
    })`
  },
  {
    path: 'records/accreditation/checklists', title: 'Department Checklists', desc: 'Daily/Weekly self-assessment checklists for wards and departments.',
    cols: ['Checklist Type', 'Department', 'Frequency', 'Last Submitted', 'Score', 'Status'],
    stats: [{ label: 'Daily Submissions', val: '24/24', col: 'text-emerald-400' }, { label: 'Avg Score', val: '96%', col: 'text-blue-400' }, { label: 'Missed Checklists', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { checklisttype: 'Facility Round', department: 'Ward ' + String.fromCharCode(65+i), frequency: 'Daily', lastsubmitted: 'Today 08:00', score: (95+i) + '%', status: 'Submitted' };
    })`
  },
  {
    path: 'records/accreditation/policy', title: 'Policy Management', desc: 'Centralized control for all hospital policies required by accrediting bodies.',
    cols: ['Policy ID', 'Policy Name', 'Chapter Reference', 'Last Updated', 'Next Review', 'Status'],
    stats: [{ label: 'Total Policies', val: '124', col: 'text-blue-400' }, { label: 'Up to Date', val: '120', col: 'text-emerald-400' }, { label: 'Reviews Due', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { policyid: 'POL-' + (101+i), policyname: 'Patient Rights & Education', chapterreference: 'PRE', lastupdated: '01 Jan 2026', nextreview: '01 Jan 2027', status: 'Active' };
    })`
  },
  {
    path: 'records/accreditation/sop', title: 'SOP Management', desc: 'Standard Operating Procedures library with version control and department access.',
    cols: ['SOP ID', 'SOP Name', 'Department', 'Version', 'Approved By', 'Status'],
    stats: [{ label: 'Total SOPs', val: '345', col: 'text-blue-400' }, { label: 'Recent Updates', val: '12', col: 'text-emerald-400' }, { label: 'Draft SOPs', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { sopid: 'SOP-' + (501+i), sopname: 'Biomedical Waste Segregation', department: 'Housekeeping', version: 'v2.1', approvedby: 'Medical Director', status: 'Published' };
    })`
  },
  {
    path: 'records/accreditation/audit', title: 'Accreditation Audit', desc: 'Internal mock audits simulating external assessor visits.',
    cols: ['Audit Date', 'Auditor/Assessor', 'Chapters Covered', 'Score Achieved', 'NCs Raised', 'Status'],
    stats: [{ label: 'Mock Audits (YTD)', val: '4', col: 'text-blue-400' }, { label: 'Avg Score', val: '88%', col: 'text-emerald-400' }, { label: 'Total Open NCs', val: '15', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { auditdate: '01 Jun 2026', auditorassessor: 'Internal Quality Team', chapterscovered: 'HIC, CQI', scoreachieved: (85+i*2) + '%', ncsraised: (2+i).toString(), status: i===0?'Report Drafting':'Closed' };
    })`
  },
  {
    path: 'records/accreditation/compliance', title: 'Compliance Tracking', desc: 'Real-time dashboard showing the hospital\'s readiness for unannounced inspections.',
    cols: ['Regulatory Body', 'License/Certificate', 'Issue Date', 'Validity', 'Days to Expire', 'Status'],
    stats: [{ label: 'Statutory Licenses', val: '34/34', col: 'text-emerald-400' }, { label: 'Expiring < 90 Days', val: '2', col: 'text-amber-400' }, { label: 'Expired', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const bodies = ['Fire Dept', 'Pollution Control', 'Atomic Energy', 'Municipal Corp', 'Health Dept'];
      const licenses = ['Fire NOC', 'BMW Authorization', 'AERB Certification', 'Trade License', 'Clinical Establishment'];
      return { regulatorybody: bodies[i], licensecertificate: licenses[i], issuedate: '01 Jan 2025', validity: '31 Dec 2026', daystoexpire: '178', status: 'Compliant' };
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
        const isGood = val === 'Active' || val === 'Completed' || val === 'Stabilized' || val === 'Securely Archived' || val === 'Dispatched' || val === 'Signed' || val === 'Finalized' || val === 'Handed Over' || val === 'Indexed' || val === 'Complete' || val === 'Merged' || val === 'Digitized' || val === 'Secured' || val === 'Coded' || val === 'Mapped' || val === 'Assigned' || val === 'Passed QA' || val === 'Compliant' || val === 'Audited' || val === 'Monitored' || val === 'Closed' || val === 'Acknowledged' || val === 'Submitted' || val === 'Published';
        const isWarning = val === 'Review' || val === 'Review Needed' || val === 'Action Required' || val === 'In Progress' || val === 'Pending Auth' || val === 'Dictation Pending' || val === 'Pending Eval' || val === 'Deficient' || val === 'Pending Doctor' || val === 'Merge Pending' || val === 'Pending QA' || val === 'Pending Coding' || val === 'Feedback Sent' || val === 'Under Review' || val === 'Action Needed' || val === 'Report Drafting';
        const isNeutral = val === 'Draft' || val === 'Checked Out' || val === 'In Transit' || val === 'Returned';
        const isDanger = val === 'Archived' || val === 'Overdue' || val === 'Failed QA' || val === 'Failed' || val === 'Rejected' || val === 'Missing Document';
        
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
