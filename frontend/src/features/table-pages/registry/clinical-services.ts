import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/doctor/consultation/clinical-notes": {
    ui: 0,
    title: "Clinical Notes", description: "General unstructured clinical observations and history.",
    stats: [{ label: "Total Notes", color: "text-blue-400", value: "14,520" }, { label: "Added Today", color: "text-emerald-400", value: "45" }, { label: "Archived", color: "text-gray-400", value: "1,200" }],
    columns: [["Note ID", "noteid"], ["Patient Name", "patientname"], ["Category", "category"], ["Author", "author"], ["Timestamp", "timestamp"]],
    badge: ["Status", "status", {"Active":"emerald","Archived":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const cats = ['History of Illness', 'Allergy Update', 'Family History', 'Surgical Hx', 'General Observation'];
        const statuses = ['Active', 'Active', 'Active', 'Active', 'Archived'];
        return { noteid: 'CLN-' + (2001 + i), patientname: names[i], category: cats[i], author: 'Dr. House', timestamp: '12 Jun 2026', status: statuses[i] };
      }),
  },
  "/doctor/consultation/diagnosis": {
    ui: 0,
    title: "Diagnosis List", description: "ICD-10 coded diagnosis tracker for patient encounters.",
    stats: [{ label: "Primary Dx", color: "text-blue-400", value: "45" }, { label: "Secondary Dx", color: "text-emerald-400", value: "120" }, { label: "Unconfirmed", color: "text-amber-400", value: "12" }],
    columns: [["Dx ID", "dxid"], ["Patient Name", "patientname"], ["ICD-10 Code", "icd10code"], ["Diagnosis Description", "diagnosisdescription"], ["Type", "type"]],
    badge: ["Status", "status", {"Confirmed":"emerald","Provisional":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const icds = ['I10', 'E11.9', 'J45.909', 'R51', 'M54.5'];
        const descs = ['Essential Hypertension', 'Type 2 Diabetes', 'Asthma, Unspecified', 'Headache', 'Low Back Pain'];
        const types = ['Primary', 'Secondary', 'Primary', 'Primary', 'Primary'];
        const statuses = ['Confirmed', 'Confirmed', 'Provisional', 'Confirmed', 'Provisional'];
        return { dxid: 'DIAG-' + (3001 + i), patientname: names[i], icd10code: icds[i], diagnosisdescription: descs[i], type: types[i], status: statuses[i] };
      }),
  },
  "/doctor/consultation/differential": {
    ui: 2,
    title: "Differential Diagnosis", description: "Manage and rule out potential diagnoses for complex cases.",
    stats: [{ label: "Active Cases", color: "text-blue-400", value: "12" }, { label: "Resolved Today", color: "text-emerald-400", value: "4" }, { label: "High Complexity", color: "text-amber-400", value: "2" }],
    columns: [["Case ID", "caseid"], ["Patient Name", "patientname"], ["Presenting Symptoms", "presentingsymptoms"], ["Differential Dx", "differentialdx"], ["Confidence", "confidence"]],
    badge: ["Status", "status", {"Investigating":"amber","Confirmed":"emerald","Ruled Out":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Lex Luthor', 'Joker', 'Riddler', 'Penguin', 'Two-Face'];
        const symps = ['Severe Chest Pain', 'Chronic Migraine', 'Fever, Joint Pain', 'Abdominal Pain', 'Shortness of Breath'];
        const diffs = ['MI vs Angina vs GERD', 'Migraine vs Cluster', 'Dengue vs Malaria', 'Appendicitis vs UTI', 'Asthma vs COPD'];
        const confs = ['Low', 'Medium', 'High', 'Medium', 'Low'];
        const statuses = ['Investigating', 'Investigating', 'Confirmed', 'Investigating', 'Ruled Out'];
        return { caseid: 'DDX-' + (1001 + i), patientname: names[i], presentingsymptoms: symps[i], differentialdx: diffs[i], confidence: confs[i], status: statuses[i] };
      }),
  },
  "/doctor/consultation/soap-notes": {
    ui: 0,
    title: "SOAP Notes", description: "Subjective, Objective, Assessment, and Plan notes.",
    stats: [{ label: "Draft Notes", color: "text-amber-400", value: "8" }, { label: "Signed Today", color: "text-emerald-400", value: "24" }, { label: "Missing Notes", color: "text-emerald-400", value: "0" }],
    columns: [["Note ID", "noteid"], ["Patient Name", "patientname"], ["Consult Type", "consulttype"], ["Last Edited", "lastedited"], ["Primary Dx", "primarydx"]],
    badge: ["Status", "status", {"Signed":"emerald","Draft":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const types = ['OPD Initial', 'OPD Follow-Up', 'Telemedicine', 'IPD Round', 'OPD Initial'];
        const dxs = ['Hypertension', 'Migraine', 'Anemia', 'Asthma', 'Diabetes Type 2'];
        const statuses = ['Signed', 'Draft', 'Signed', 'Signed', 'Draft'];
        return { noteid: 'SOP-' + (1001 + i), patientname: names[i], consulttype: types[i], lastedited: 'Today', primarydx: dxs[i], status: statuses[i] };
      }),
  },
  "/doctor/consultation/templates": {
    ui: 2,
    title: "Consultation Templates", description: "Pre-defined templates for quick SOAP/Clinical note entry.",
    stats: [{ label: "Total Templates", color: "text-blue-400", value: "45" }, { label: "Most Used", color: "text-emerald-400", value: "General OPD" }, { label: "My Templates", color: "text-amber-400", value: "12" }],
    columns: [["Template ID", "templateid"], ["Template Name", "templatename"], ["Category", "category"], ["Created By", "createdby"], ["Usage Count", "usagecount"]],
    badge: ["Status", "status", {"Active":"emerald","Archived":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const tmpls = ['General OPD Initial', 'Post-Op Follow Up', 'Pediatric Fever', 'Hypertension Review', 'Telemed Basic'];
        const cats = ['General', 'Surgical', 'Pediatrics', 'Cardiology', 'Telemedicine'];
        const counts = ['1,240', '450', '320', '850', '210'];
        const statuses = ['Active', 'Active', 'Active', 'Active', 'Archived'];
        return { templateid: 'TPL-' + (2001 + i), templatename: tmpls[i], category: cats[i], createdby: 'Dr. Jenkins', usagecount: counts[i], status: statuses[i] };
      }),
  },
  "/doctor/diagnosis/chronic": {
    ui: 2,
    title: "Chronic Conditions", description: "Track long-term and chronic conditions for regular patients.",
    stats: [{ label: "Patients w/ Chronic", color: "text-blue-400", value: "450" }, { label: "High Severity", color: "text-red-400", value: "84" }, { label: "Stable", color: "text-emerald-400", value: "312" }],
    columns: [["Record ID", "recordid"], ["Patient Name", "patientname"], ["Condition", "condition"], ["Diagnosed On", "diagnosedon"], ["Severity", "severity"]],
    badge: ["Status", "status", {"Monitoring":"gray","Stable":"red","Critical":"amber","N/A":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Griffin', 'Lois Griffin', 'Meg Griffin', 'Chris Griffin', 'Stewie Griffin'];
        const conds = ['Type 2 Diabetes', 'Hypothyroidism', 'Asthma', 'Obesity', 'None'];
        const dates = ['12 May 2018', '04 Aug 2020', '15 Jan 2015', '10 Nov 2021', 'N/A'];
        const sevs = ['Moderate', 'Mild', 'Severe', 'Moderate', 'N/A'];
        const statuses = ['Monitoring', 'Stable', 'Critical', 'Monitoring', 'N/A'];
        return { recordid: 'CHR-' + (8001 + i), patientname: names[i], condition: conds[i], diagnosedon: dates[i], severity: sevs[i], status: statuses[i] };
      }),
  },
  "/doctor/diagnosis/entry": {
    ui: 2,
    title: "Diagnosis Entry", description: "Input and finalize diagnoses for current encounters.",
    stats: [{ label: "Diagnoses Entered", color: "text-blue-400", value: "45" }, { label: "Pending Coding", color: "text-amber-400", value: "12" }, { label: "Finalized", color: "text-emerald-400", value: "33" }],
    columns: [["Encounter ID", "encounterid"], ["Patient Name", "patientname"], ["Primary Dx", "primarydx"], ["Secondary Dx", "secondarydx"], ["Entered By", "enteredby"]],
    badge: ["Status", "status", {"Finalized":"emerald","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson', 'Maggie Simpson'];
        const pris = ['Acute Bronchitis', 'Migraine', 'Fractured Radius', 'Myopia', 'Gastroenteritis'];
        const secs = ['None', 'Anxiety', 'None', 'None', 'Mild Dehydration'];
        const statuses = ['Finalized', 'Draft', 'Finalized', 'Finalized', 'Draft'];
        return { encounterid: 'ENC-' + (7001 + i), patientname: names[i], primarydx: pris[i], secondarydx: secs[i], enteredby: 'Dr. House', status: statuses[i] };
      }),
  },
  "/doctor/diagnosis/history": {
    ui: 2,
    title: "Patient Medical History", description: "Complete historical view of a patient's past diagnoses.",
    stats: [{ label: "History Records", color: "text-blue-400", value: "12,450" }, { label: "Updated Today", color: "text-emerald-400", value: "24" }, { label: "Flagged Info", color: "text-amber-400", value: "5" }],
    columns: [["History ID", "historyid"], ["Patient Name", "patientname"], ["Past Diagnosis", "pastdiagnosis"], ["Resolution Date", "resolutiondate"], ["Treated By", "treatedby"]],
    badge: ["Status", "status", {"Resolved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const dxs = ['Fractured Rib', 'Appendicitis', 'Concussion', 'Ankle Sprain', 'Food Poisoning'];
        const dates = ['12 Jun 2024', '15 Aug 2020', '10 Jan 2025', '01 Mar 2026', '14 Feb 2026'];
        const docs = ['Dr. Wayne', 'Dr. Smith', 'Dr. Jenkins', 'Dr. Sloan', 'Dr. Grey'];
        const statuses = ['Resolved', 'Resolved', 'Resolved', 'Resolved', 'Resolved'];
        return { historyid: 'MHX-' + (9001 + i), patientname: names[i], pastdiagnosis: dxs[i], resolutiondate: dates[i], treatedby: docs[i], status: statuses[i] };
      }),
  },
  "/doctor/diagnosis/icd": {
    ui: 2,
    title: "ICD-10 Dictionary", description: "Search and reference ICD-10 diagnosis codes.",
    stats: [{ label: "Total Codes", color: "text-blue-400", value: "72,184" }, { label: "Frequently Used", color: "text-emerald-400", value: "150" }, { label: "Recent Updates", color: "text-amber-400", value: "14" }],
    columns: [["ICD-10 Code", "icd10code"], ["Description", "description"], ["Category", "category"], ["Billable", "billable"], ["Last Updated", "lastupdated"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const codes = ['J01.90', 'I10', 'E11.9', 'M54.5', 'R51'];
        const descs = ['Acute sinusitis, unspecified', 'Essential (primary) hypertension', 'Type 2 diabetes mellitus', 'Low back pain', 'Headache'];
        const cats = ['Respiratory', 'Circulatory', 'Endocrine', 'Musculoskeletal', 'Symptoms/Signs'];
        const bills = ['Yes', 'Yes', 'Yes', 'Yes', 'Yes'];
        const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
        return { icd10code: codes[i], description: descs[i], category: cats[i], billable: bills[i], lastupdated: '01 Jan 2026', status: statuses[i] };
      }),
  },
  "/doctor/discharge/advice": {
    ui: 3,
    title: "Discharge Advice", description: "Prepare medical advice and prescriptions for discharging patients.",
    stats: [{ label: "Discharges Today", color: "text-blue-400", value: "12" }, { label: "Advice Ready", color: "text-emerald-400", value: "8" }, { label: "Pending", color: "text-amber-400", value: "4" }],
    columns: [["Discharge ID", "dischargeid"], ["Patient Name", "patientname"], ["Ward", "ward"], ["Diagnosis", "diagnosis"], ["Advice Drafted", "advicedrafted"]],
    badge: ["Status", "status", {"Drafted":"red","Pending":"amber","Signed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const statuses = ['Drafted', 'Pending', 'Signed', 'Signed', 'Pending'];
        return { dischargeid: 'DIS-' + (1001 + i), patientname: names[i], ward: 'General', diagnosis: 'Pneumonia', advicedrafted: 'Yes', status: statuses[i] };
      }),
  },
  "/doctor/discharge/instructions": {
    ui: 3,
    title: "Home Care Instructions", description: "Specific nursing and lifestyle instructions for home care.",
    stats: [{ label: "Instructions Issued", color: "text-blue-400", value: "45" }, { label: "Acknowledged", color: "text-emerald-400", value: "40" }, { label: "Pending Review", color: "text-amber-400", value: "5" }],
    columns: [["Instruction ID", "instructionid"], ["Patient Name", "patientname"], ["Category", "category"], ["Provided By", "providedby"], ["Acknowledged", "acknowledged"]],
    badge: ["Status", "status", {"Acknowledged":"emerald","Pending Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const statuses = ['Acknowledged', 'Pending Review', 'Acknowledged', 'Acknowledged', 'Pending Review'];
        return { instructionid: 'INS-' + (2001 + i), patientname: names[i], category: 'Wound Care', providedby: 'Nurse Joy', acknowledged: 'Yes', status: statuses[i] };
      }),
  },
  "/doctor/documentation/certificates": {
    ui: 3,
    title: "Medical Certificates", description: "Issue sick leaves and fitness certificates.",
    stats: [{ label: "Issued Today", color: "text-blue-400", value: "45" }, { label: "Sick Leaves", color: "text-amber-400", value: "30" }, { label: "Fitness", color: "text-emerald-400", value: "15" }],
    columns: [["Cert ID", "certid"], ["Patient Name", "patientname"], ["Type", "type"], ["Valid From", "validfrom"], ["Valid To", "validto"]],
    badge: ["Status", "status", {"Active":"emerald","Expired":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const types = ['Sick Leave', 'Fitness Cert', 'Sick Leave', 'Maternity', 'Fitness Cert'];
        const statuses = ['Active', 'Active', 'Expired', 'Active', 'Active'];
        return { certid: 'CRT-' + (5001 + i), patientname: names[i], type: types[i], validfrom: '10 Jun', validto: '15 Jun', status: statuses[i] };
      }),
  },
  "/doctor/documentation/consultation": {
    ui: 3,
    title: "Consultation Notes", description: "Detailed documentation for outpatient visits.",
    stats: [{ label: "OPD Notes", color: "text-blue-400", value: "84" }, { label: "Drafts", color: "text-amber-400", value: "12" }, { label: "Finalized", color: "text-emerald-400", value: "72" }],
    columns: [["Note ID", "noteid"], ["Patient Name", "patientname"], ["Visit Type", "visittype"], ["Diagnosis", "diagnosis"], ["Authored By", "authoredby"]],
    badge: ["Status", "status", {"Finalized":"emerald","Draft":"amber","Pending Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const statuses = ['Finalized', 'Draft', 'Finalized', 'Finalized', 'Pending Review'];
        return { noteid: 'CNS-' + (2001 + i), patientname: names[i], visittype: 'Follow-up', diagnosis: 'Hypertension', authoredby: 'Dr. Smith', status: statuses[i] };
      }),
  },
  "/doctor/documentation/operative": {
    ui: 3,
    title: "Operative Reports", description: "Formal reports generated post-surgery.",
    stats: [{ label: "Pending Dictation", color: "text-amber-400", value: "4" }, { label: "Transcribed", color: "text-blue-400", value: "18" }, { label: "Signed", color: "text-emerald-400", value: "15" }],
    columns: [["Report ID", "reportid"], ["Patient Name", "patientname"], ["Surgery", "surgery"], ["Date", "date"], ["Dictated By", "dictatedby"]],
    badge: ["Status", "status", {"Signed":"emerald","Pending Dictation":"amber","Transcribed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Griffin', 'Lois Griffin', 'Meg Griffin', 'Chris Griffin', 'Stewie Griffin'];
        const statuses = ['Signed', 'Pending Dictation', 'Transcribed', 'Signed', 'Transcribed'];
        return { reportid: 'OPR-' + (3001 + i), patientname: names[i], surgery: 'Appendectomy', date: 'Today', dictatedby: 'Dr. Shepherd', status: statuses[i] };
      }),
  },
  "/doctor/documentation/progress": {
    ui: 3,
    title: "Progress Notes", description: "Daily progress documentation for admitted patients.",
    stats: [{ label: "Notes Today", color: "text-blue-400", value: "142" }, { label: "Missing Notes", color: "text-red-400", value: "3" }, { label: "Reviewed", color: "text-emerald-400", value: "120" }],
    columns: [["Note ID", "noteid"], ["Patient Name", "patientname"], ["Ward", "ward"], ["Note Type", "notetype"], ["Authored By", "authoredby"]],
    badge: ["Status", "status", {"Draft":"amber","Signed":"emerald","Pending Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson', 'Maggie Simpson'];
        const statuses = ['Draft', 'Signed', 'Signed', 'Pending Review', 'Signed'];
        return { noteid: 'PRG-' + (1001 + i), patientname: names[i], ward: 'General', notetype: 'Daily Round', authoredby: 'Dr. Jenkins', status: statuses[i] };
      }),
  },
  "/doctor/documentation/referral": {
    ui: 4,
    title: "Referral Letters", description: "Generate and manage outward referral letters.",
    stats: [{ label: "Letters Sent", color: "text-blue-400", value: "12" }, { label: "Urgent", color: "text-red-400", value: "2" }, { label: "Pending", color: "text-amber-400", value: "4" }],
    columns: [["Letter ID", "letterid"], ["Patient Name", "patientname"], ["Referred To", "referredto"], ["Specialty", "specialty"], ["Urgency", "urgency"]],
    badge: ["Status", "status", {"Sent":"emerald","Draft":"amber","Pending Auth":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const statuses = ['Sent', 'Draft', 'Sent', 'Draft', 'Pending Auth'];
        return { letterid: 'RFL-' + (4001 + i), patientname: names[i], referredto: 'Dr. Strange', specialty: 'Neurology', urgency: 'Routine', status: statuses[i] };
      }),
  },
  "/doctor/emergency/critical": {
    ui: 0,
    title: "Critical Care (Resus)", description: "Monitor and log interventions for Level 1 & 2 critical patients.",
    stats: [{ label: "Active Resus", color: "text-red-500", value: "2" }, { label: "Transferred to ICU", color: "text-blue-400", value: "4" }, { label: "Stabilized", color: "text-emerald-400", value: "3" }],
    columns: [["Resus ID", "resusid"], ["Patient", "patient"], ["Primary Dx", "primarydx"], ["Interventions", "interventions"], ["Time in Resus", "timeinresus"]],
    badge: ["Status", "status", {"Active Code":"amber","Stabilizing":"red","Transfer ICU":"red","Stabilized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Brown', 'Emily Davis'];
        const dxs = ['Cardiac Arrest', 'Massive Hemorrhage', 'Stroke', 'Resp Failure', 'Septic Shock'];
        const inters = ['CPR, Defib', 'Blood Transfusion', 'TPA Given', 'Intubated', 'IV Antibiotics'];
        const statuses = ['Active Code', 'Stabilizing', 'Transfer ICU', 'Transfer ICU', 'Stabilized'];
        return { resusid: 'RSC-' + (2001 + i), patient: names[i], primarydx: dxs[i], interventions: inters[i], timeinresus: (20 + i * 15) + ' mins', status: statuses[i] };
      }),
  },
  "/doctor/emergency/dashboard": {
    ui: 0,
    title: "ER Dashboard", description: "Live metrics and status of the Emergency Department.",
    stats: [{ label: "Active Cases", color: "text-blue-400", value: "14" }, { label: "Critical (Red)", color: "text-red-500", value: "2" }, { label: "Avg Turnaround", color: "text-emerald-400", value: "2h 15m" }],
    columns: [["Bed/Zone", "bedzone"], ["Patient Name", "patientname"], ["Triage Level", "triagelevel"], ["Time in ER", "timeiner"], ["Primary Physician", "primaryphysician"]],
    badge: ["Status", "status", {"Critical":"amber","Stabilizing":"red","Waiting Lab":"gray","Ready to Disch":"red","Observation":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const beds = ['Resus-1', 'Trauma-2', 'Triage-A', 'Bed-5', 'Bed-6'];
        const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Brown', 'Emily Davis'];
        const triages = ['Level 1 (Resus)', 'Level 2 (Emergent)', 'Level 3 (Urgent)', 'Level 4 (Less Urgent)', 'Level 5 (Non-Urgent)'];
        const times = ['45 mins', '1h 20m', '30 mins', '2h 10m', '1h 0m'];
        const statuses = ['Critical', 'Stabilizing', 'Waiting Lab', 'Ready to Disch', 'Observation'];
        return { bedzone: beds[i], patientname: names[i], triagelevel: triages[i], timeiner: times[i], primaryphysician: 'Dr. House', status: statuses[i] };
      }),
  },
  "/doctor/emergency/procedures": {
    ui: 0,
    title: "ER Procedures", description: "Log minor surgical procedures performed in the ER.",
    stats: [{ label: "Procedures Today", color: "text-blue-400", value: "24" }, { label: "Sutures/Staples", color: "text-emerald-400", value: "12" }, { label: "Splints/Casts", color: "text-emerald-400", value: "8" }],
    columns: [["Procedure ID", "procedureid"], ["Patient Name", "patientname"], ["Procedure", "procedure"], ["Performed By", "performedby"], ["Time Taken", "timetaken"]],
    badge: ["Status", "status", {"Completed":"emerald","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const procs = ['Suturing (Forehead)', 'Splint (Wrist)', 'Chest Tube', 'Central Line', 'Joint Reduction'];
        const docs = ['Dr. Grey', 'Dr. Yang', 'Dr. Shepherd', 'Dr. Sloan', 'Dr. Grey'];
        const statuses = ['Completed', 'Completed', 'Completed', 'In Progress', 'Completed'];
        return { procedureid: 'ERP-' + (4001 + i), patientname: names[i], procedure: procs[i], performedby: docs[i], timetaken: (15 + i * 5) + ' mins', status: statuses[i] };
      }),
  },
  "/doctor/emergency/trauma": {
    ui: 0,
    title: "Trauma Cases", description: "Specific log for trauma and surgical emergency cases.",
    stats: [{ label: "Trauma Cases Today", color: "text-blue-400", value: "8" }, { label: "In OR", color: "text-amber-400", value: "2" }, { label: "Cleared", color: "text-emerald-400", value: "4" }],
    columns: [["Trauma ID", "traumaid"], ["Patient Name", "patientname"], ["Mechanism of Injury", "mechanismofinjury"], ["Trauma Surgeon", "traumasurgeon"], ["Imaging", "imaging"]],
    badge: ["Status", "status", {"In OR":"red","Cleared":"emerald","Observation":"gray","Awaiting Scan":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const mechs = ['MVA', 'Fall from height', 'Assault', 'MVA', 'Sports Injury'];
        const surgs = ['Dr. Shepherd', 'Dr. Shepherd', 'Dr. Sloan', 'Dr. Shepherd', 'Dr. Sloan'];
        const imgs = ['CT Whole Body', 'X-Ray Cervical', 'CT Head', 'Pending', 'X-Ray Knee'];
        const statuses = ['In OR', 'Cleared', 'Observation', 'Awaiting Scan', 'Cleared'];
        return { traumaid: 'TRM-' + (3001 + i), patientname: names[i], mechanismofinjury: mechs[i], traumasurgeon: surgs[i], imaging: imgs[i], status: statuses[i] };
      }),
  },
  "/doctor/emergency/triage": {
    ui: 0,
    title: "ER Triage", description: "Assess and prioritize incoming emergency patients.",
    stats: [{ label: "Waiting Triage", color: "text-amber-400", value: "5" }, { label: "Triaged Today", color: "text-blue-400", value: "42" }, { label: "Avg Triage Time", color: "text-emerald-400", value: "4 mins" }],
    columns: [["Triage ID", "triageid"], ["Patient/Demo", "patientdemo"], ["Chief Complaint", "chiefcomplaint"], ["Vitals", "vitals"], ["Assigned Priority", "assignedpriority"]],
    badge: ["Status", "status", {"Immediate":"amber","Urgent":"amber","Standard":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Unknown Male, ~40', 'Sarah Connor', 'Peter Parker', 'Mary Jane', 'Tony Stark'];
        const comps = ['Unconscious', 'Chest Pain', 'Laceration', 'Fever', 'Minor Burn'];
        const vitals = ['BP 80/50, HR 120', 'BP 160/90, HR 95', 'Stable', 'Temp 102F', 'Stable'];
        const pris = ['Level 1 (Red)', 'Level 2 (Orange)', 'Level 3 (Yellow)', 'Level 4 (Green)', 'Level 5 (Blue)'];
        const statuses = ['Immediate', 'Urgent', 'Standard', 'Standard', 'Standard'];
        return { triageid: 'TRG-' + (1001 + i), patientdemo: names[i], chiefcomplaint: comps[i], vitals: vitals[i], assignedpriority: pris[i], status: statuses[i] };
      }),
  },
  "/doctor/follow-up/missed": {
    ui: 3,
    title: "Missed Follow-ups", description: "Track patients who missed their scheduled follow-up visits.",
    stats: [{ label: "Missed This Week", color: "text-red-400", value: "15" }, { label: "Rescheduled", color: "text-emerald-400", value: "8" }, { label: "Lost to Follow-up", color: "text-gray-400", value: "2" }],
    columns: [["Follow-up ID", "followupid"], ["Patient Name", "patientname"], ["Missed Date", "misseddate"], ["Contact Attempts", "contactattempts"], ["Last Contact", "lastcontact"]],
    badge: ["Status", "status", {"Rescheduled":"emerald","Pending Contact":"amber","Lost to Follow-up":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const statuses = ['Rescheduled', 'Pending Contact', 'Lost to Follow-up', 'Rescheduled', 'Pending Contact'];
        return { followupid: 'FUP-' + (3001 + i), patientname: names[i], misseddate: '10 Jun 2026', contactattempts: '2', lastcontact: 'Yesterday', status: statuses[i] };
      }),
  },
  "/doctor/follow-up/patients": {
    ui: 3,
    title: "Follow-up Patients List", description: "Directory of patients requiring long-term follow-ups.",
    stats: [{ label: "Active Roster", color: "text-blue-400", value: "450" }, { label: "Due This Week", color: "text-emerald-400", value: "84" }, { label: "Overdue", color: "text-red-400", value: "12" }],
    columns: [["Patient ID", "patientid"], ["Patient Name", "patientname"], ["Condition", "condition"], ["Frequency", "frequency"], ["Next Due", "nextdue"]],
    badge: ["Status", "status", {"On Track":"emerald","Overdue":"amber","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson', 'Maggie Simpson'];
        const statuses = ['On Track', 'Overdue', 'On Track', 'Scheduled', 'On Track'];
        return { patientid: 'PAT-' + (2001 + i), patientname: names[i], condition: 'Diabetes Type 2', frequency: 'Monthly', nextdue: '15 Jul 2026', status: statuses[i] };
      }),
  },
  "/doctor/follow-up/schedule": {
    ui: 3,
    title: "Follow-up Schedule", description: "Calendar and list of upcoming patient follow-ups.",
    stats: [{ label: "Follow-ups Today", color: "text-blue-400", value: "32" }, { label: "Confirmed", color: "text-emerald-400", value: "28" }, { label: "Pending Confirm", color: "text-amber-400", value: "4" }],
    columns: [["Follow-up ID", "followupid"], ["Patient Name", "patientname"], ["Original Visit", "originalvisit"], ["Scheduled Date", "scheduleddate"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Confirmed":"emerald","Pending":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const statuses = ['Confirmed', 'Pending', 'Confirmed', 'Completed', 'Confirmed'];
        return { followupid: 'FUP-' + (1001 + i), patientname: names[i], originalvisit: '15 May 2026', scheduleddate: 'Today', reason: 'Post-Op Check', status: statuses[i] };
      }),
  },
  "/doctor/ipd/admitted": {
    ui: 0,
    title: "Admitted Patients (IPD)", description: "List of all inpatients currently under your primary care.",
    stats: [{ label: "My IPD Patients", color: "text-blue-400", value: "18" }, { label: "Critical Condition", color: "text-red-400", value: "2" }, { label: "Ready for Discharge", color: "text-emerald-400", value: "4" }],
    columns: [["IPD No", "ipdno"], ["Patient Name", "patientname"], ["Ward/Bed", "wardbed"], ["Diagnosis", "diagnosis"], ["Admitted On", "admittedon"]],
    badge: ["Status", "status", {"Critical":"amber","Stable":"emerald","Ready for Discharge":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const beds = ['ICU-01', 'General-12', 'General-14', 'Private-02', 'ICU-03'];
        const diags = ['Blunt Trauma', 'Exhaustion', 'Fracture', 'Burns', 'Concussion'];
        const dates = ['12 Jun', '14 Jun', '15 Jun', '10 Jun', '16 Jun'];
        const statuses = ['Critical', 'Stable', 'Stable', 'Stable', 'Ready for Discharge'];
        return { ipdno: 'IPD-' + (1001 + i), patientname: names[i], wardbed: beds[i], diagnosis: diags[i], admittedon: dates[i], status: statuses[i] };
      }),
  },
  "/doctor/ipd/discharge-planning": {
    ui: 0,
    title: "Discharge Planning", description: "Prepare discharge summaries, prescriptions, and follow-ups.",
    stats: [{ label: "Discharges Today", color: "text-blue-400", value: "8" }, { label: "Summaries Pending", color: "text-red-400", value: "3" }, { label: "Cleared to Leave", color: "text-emerald-400", value: "5" }],
    columns: [["Discharge ID", "dischargeid"], ["Patient Name", "patientname"], ["Admit Date", "admitdate"], ["Planned Discharge", "planneddischarge"], ["Summary Status", "summarystatus"]],
    badge: ["Status", "status", {"In Progress":"amber","Scheduled":"gray","Cleared":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const admits = ['10 Jun', '12 Jun', '14 Jun', '15 Jun', '16 Jun'];
        const plans = ['Today', 'Tomorrow', 'Today', '18 Jun', 'Today'];
        const sums = ['Drafted', 'Pending', 'Signed', 'Pending', 'Signed'];
        const statuses = ['In Progress', 'Scheduled', 'Cleared', 'Scheduled', 'Cleared'];
        return { dischargeid: 'DIS-' + (6001 + i), patientname: names[i], admitdate: admits[i], planneddischarge: plans[i], summarystatus: sums[i], status: statuses[i] };
      }),
  },
  "/doctor/ipd/progress-notes": {
    ui: 0,
    title: "Progress Notes", description: "Daily clinical progress notes for admitted patients.",
    stats: [{ label: "Notes Logged Today", color: "text-blue-400", value: "24" }, { label: "Pending Reviews", color: "text-amber-400", value: "3" }, { label: "Co-signed", color: "text-emerald-400", value: "15" }],
    columns: [["Note ID", "noteid"], ["Patient Name", "patientname"], ["Recorded By", "recordedby"], ["Note Summary", "notesummary"], ["Timestamp", "timestamp"]],
    badge: ["Status", "status", {"Draft":"gray","Signed":"emerald","Pending Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const summaries = ['Patient stable. Vitals normal.', 'Complains of mild pain.', 'Fever reduced.', 'Awaiting lab results.', 'Ready for discharge.'];
        const times = ['09:15 AM', '10:30 AM', '11:45 AM', '01:20 PM', '02:00 PM'];
        const statuses = ['Draft', 'Signed', 'Signed', 'Pending Review', 'Signed'];
        return { noteid: 'PRG-' + (3001 + i), patientname: names[i], recordedby: 'Dr. Jenkins', notesummary: summaries[i], timestamp: times[i], status: statuses[i] };
      }),
  },
  "/doctor/ipd/rounds": {
    ui: 0,
    title: "Ward Rounds List", description: "Schedule and log daily ward rounds for IPD patients.",
    stats: [{ label: "Rounds Pending", color: "text-amber-400", value: "12" }, { label: "Completed Today", color: "text-emerald-400", value: "8" }, { label: "Missed Rounds", color: "text-emerald-400", value: "0" }],
    columns: [["Round ID", "roundid"], ["Patient Name", "patientname"], ["Ward/Bed", "wardbed"], ["Last Checked", "lastchecked"], ["Next Round Due", "nextrounddue"]],
    badge: ["Status", "status", {"Pending":"gray","Overdue":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Lex Luthor', 'Joker', 'Riddler', 'Penguin', 'Two-Face'];
        const beds = ['ICU-01', 'General-12', 'General-14', 'Private-02', 'ICU-03'];
        const last = ['08:00 AM', '09:30 AM', 'Yesterday', '07:00 AM', '10:00 AM'];
        const next = ['14:00 PM', '15:30 PM', '09:00 AM', '13:00 PM', '16:00 PM'];
        const statuses = ['Pending', 'Pending', 'Overdue', 'Completed', 'Completed'];
        return { roundid: 'RND-' + (2001 + i), patientname: names[i], wardbed: beds[i], lastchecked: last[i], nextrounddue: next[i], status: statuses[i] };
      }),
  },
  "/doctor/ipd/transfer-requests": {
    ui: 0,
    title: "Transfer Requests", description: "Manage patient transfers between ICU, wards, and other facilities.",
    stats: [{ label: "Pending Outbound", color: "text-amber-400", value: "2" }, { label: "Pending Inbound", color: "text-amber-400", value: "1" }, { label: "Completed Today", color: "text-emerald-400", value: "5" }],
    columns: [["Transfer ID", "transferid"], ["Patient Name", "patientname"], ["Current Ward", "currentward"], ["Target Ward", "targetward"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Pending Transfer":"gray","Completed":"emerald","Awaiting Bed":"gray","Declined":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const currents = ['ICU', 'ER', 'General Med', 'Surgery', 'VIP Suite'];
        const targets = ['General Med', 'ICU', 'Cardiology', 'Discharge Lounge', 'ICU'];
        const reasons = ['Condition Stable', 'Critical Vitals', 'Specialist Care', 'Post-Op Recovery', 'Requested Upgrade'];
        const statuses = ['Pending Transfer', 'Completed', 'Awaiting Bed', 'Completed', 'Declined'];
        return { transferid: 'TRF-' + (5001 + i), patientname: names[i], currentward: currents[i], targetward: targets[i], reason: reasons[i], status: statuses[i] };
      }),
  },
  "/doctor/ipd/treatment-plan": {
    ui: 0,
    title: "Treatment Plans", description: "Active treatment plans, medications, and diet orders.",
    stats: [{ label: "Active Plans", color: "text-blue-400", value: "18" }, { label: "Updates Needed", color: "text-amber-400", value: "2" }, { label: "Completed Plans", color: "text-emerald-400", value: "45" }],
    columns: [["Plan ID", "planid"], ["Patient Name", "patientname"], ["Primary Dx", "primarydx"], ["Plan Type", "plantype"], ["Last Updated", "lastupdated"]],
    badge: ["Status", "status", {"Active":"emerald","Update Required":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const dxs = ['Fracture', 'Asthma', 'Pneumonia', 'Anemia', 'Appendicitis'];
        const types = ['Surgical + Meds', 'Medication Only', 'IV Fluids + Meds', 'Dietary + Meds', 'Post-Op Care'];
        const statuses = ['Active', 'Active', 'Update Required', 'Active', 'Completed'];
        return { planid: 'TPL-' + (4001 + i), patientname: names[i], primarydx: dxs[i], plantype: types[i], lastupdated: 'Today', status: statuses[i] };
      }),
  },
  "/doctor/opd/consultation": {
    ui: 0,
    title: "OPD Consultations", description: "Detailed log of ongoing and completed OPD sessions.",
    stats: [{ label: "Completed Today", color: "text-blue-400", value: "24" }, { label: "Pending Notes", color: "text-amber-400", value: "3" }, { label: "Referred Out", color: "text-gray-400", value: "1" }],
    columns: [["Consult ID", "consultid"], ["Patient Name", "patientname"], ["Chief Complaint", "chiefcomplaint"], ["Diagnosis Notes", "diagnosisnotes"], ["Prescription", "prescription"]],
    badge: ["Status", "status", {"Completed":"emerald","Notes Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Gwen Stacy', 'Miles Morales', 'Miguel O\'Hara', 'Jessica Drew', 'Peni Parker'];
        const comps = ['Headache', 'Cough', 'Back Pain', 'Fever', 'Rash'];
        const diags = ['Tension Headache', 'Viral URI', 'Muscle Spasm', 'Influenza', 'Contact Dermatitis'];
        const pres = ['Issued', 'Issued', 'Pending', 'Issued', 'Issued'];
        const statuses = ['Completed', 'Completed', 'Notes Pending', 'Completed', 'Completed'];
        return { consultid: 'OPD-' + (6000 + i), patientname: names[i], chiefcomplaint: comps[i], diagnosisnotes: diags[i], prescription: pres[i], status: statuses[i] };
      }),
  },
  "/doctor/opd/follow-up": {
    ui: 0,
    title: "OPD Follow-Ups", description: "Track and plan return visits from OPD patients.",
    stats: [{ label: "Due This Week", color: "text-blue-400", value: "45" }, { label: "Booked", color: "text-emerald-400", value: "32" }, { label: "No Shows", color: "text-red-400", value: "4" }],
    columns: [["Patient Name", "patientname"], ["Initial Visit", "initialvisit"], ["Diagnosis", "diagnosis"], ["Recommended Date", "recommendeddate"], ["Reminders", "reminders"]],
    badge: ["Status", "status", {"Booked":"emerald","Pending Reply":"amber","Overdue":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson', 'Maggie Simpson'];
        const initials = ['12 Jun', '15 Jun', '20 Jun', '01 Jul', '10 Jul'];
        const diags = ['Hypertension', 'Anemia', 'Asthma', 'Myopia', 'Immunization'];
        const recs = ['12 Jul', '15 Jul', '20 Jul', '01 Aug', '10 Aug'];
        const statuses = ['Booked', 'Pending Reply', 'Overdue', 'Booked', 'Booked'];
        return { patientname: names[i], initialvisit: initials[i], diagnosis: diags[i], recommendeddate: recs[i], reminders: 'Sent (2)', status: statuses[i] };
      }),
  },
  "/doctor/opd/procedures": {
    ui: 0,
    title: "Minor Procedures", description: "Log minor surgical or diagnostic procedures performed in OPD.",
    stats: [{ label: "Procedures Today", color: "text-blue-400", value: "8" }, { label: "Billed Value", color: "text-emerald-400", value: "$1,240" }, { label: "Complications", color: "text-emerald-400", value: "0" }],
    columns: [["Procedure ID", "procedureid"], ["Patient Name", "patientname"], ["Procedure Type", "proceduretype"], ["Duration", "duration"], ["Consumables Used", "consumablesused"]],
    badge: ["Status", "status", {"Completed":"emerald","Scheduled":"amber","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Griffin', 'Lois Griffin', 'Meg Griffin', 'Chris Griffin', 'Stewie Griffin'];
        const procs = ['Stitch Removal', 'Wound Dressing', 'Mole Excision', 'Cast Application', 'Vaccination'];
        const durs = ['10 mins', '15 mins', '30 mins', '45 mins', '5 mins'];
        const statuses = ['Completed', 'Completed', 'Scheduled', 'In Progress', 'Completed'];
        return { procedureid: 'PRC-' + (7000 + i), patientname: names[i], proceduretype: procs[i], duration: durs[i], consumablesused: 'Logged', status: statuses[i] };
      }),
  },
  "/doctor/orders/blood": {
    ui: 2,
    title: "Blood Bank Orders", description: "Request blood products and transfusions from the blood bank.",
    stats: [{ label: "Active Requests", color: "text-blue-400", value: "8" }, { label: "Units Reserved", color: "text-emerald-400", value: "14" }, { label: "Critical Shortage", color: "text-emerald-400", value: "0" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Blood Group", "bloodgroup"], ["Product Type", "producttype"], ["Units Requested", "unitsrequested"]],
    badge: ["Status", "status", {"Reserved":"emerald","Pending Crossmatch":"gray","Issued":"emerald","Urgent Request":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const grps = ['O+', 'A-', 'B+', 'AB+', 'O-'];
        const types = ['Packed RBC', 'Whole Blood', 'Platelets', 'Fresh Frozen Plasma', 'Packed RBC'];
        const units = ['2 Units', '1 Unit', '4 Units', '2 Units', '3 Units'];
        const statuses = ['Reserved', 'Pending Crossmatch', 'Issued', 'Reserved', 'Urgent Request'];
        return { orderid: 'BLD-' + (5001 + i), patientname: names[i], bloodgroup: grps[i], producttype: types[i], unitsrequested: units[i], status: statuses[i] };
      }),
  },
  "/doctor/orders/diet": {
    ui: 2,
    title: "Dietary Orders", description: "Order specific nutritional plans and diets for inpatients.",
    stats: [{ label: "Active Diet Plans", color: "text-blue-400", value: "124" }, { label: "Special Diets", color: "text-amber-400", value: "45" }, { label: "NPO Orders", color: "text-red-400", value: "12" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Diet Type", "diettype"], ["Allergies", "allergies"], ["Assigned Dietitian", "assigneddietitian"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const diets = ['Regular', 'Diabetic (Low Sugar)', 'NPO (Fasting)', 'Cardiac (Low Sodium)', 'Liquid Diet'];
        const alls = ['None', 'Peanuts', 'None', 'None', 'Dairy'];
        const diers = ['Sarah D.', 'Sarah D.', 'N/A', 'John M.', 'John M.'];
        const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
        return { orderid: 'DIT-' + (7001 + i), patientname: names[i], diettype: diets[i], allergies: alls[i], assigneddietitian: diers[i], status: statuses[i] };
      }),
  },
  "/doctor/orders/laboratory": {
    ui: 2,
    title: "Laboratory Orders", description: "Order blood work, panels, and pathology tests.",
    stats: [{ label: "Orders Today", color: "text-blue-400", value: "142" }, { label: "Results Ready", color: "text-emerald-400", value: "45" }, { label: "Stat/Urgent", color: "text-red-400", value: "12" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Test Name", "testname"], ["Priority", "priority"], ["Sample Status", "samplestatus"]],
    badge: ["Status", "status", {"In Process":"gray","Pending Collection":"amber","Results Ready":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const tests = ['Complete Blood Count (CBC)', 'Lipid Profile', 'Liver Function (LFT)', 'HbA1c', 'Thyroid Panel'];
        const pris = ['Routine', 'Routine', 'Urgent', 'Routine', 'Routine'];
        const samples = ['Collected', 'Pending', 'Collected', 'Collected', 'Pending'];
        const statuses = ['In Process', 'Pending Collection', 'Results Ready', 'In Process', 'Pending Collection'];
        return { orderid: 'LAB-' + (1001 + i), patientname: names[i], testname: tests[i], priority: pris[i], samplestatus: samples[i], status: statuses[i] };
      }),
  },
  "/doctor/orders/physiotherapy": {
    ui: 2,
    title: "Physiotherapy Orders", description: "Refer patients for physical therapy and rehabilitation.",
    stats: [{ label: "Referrals Today", color: "text-blue-400", value: "12" }, { label: "Active Sessions", color: "text-emerald-400", value: "45" }, { label: "Completed Tx", color: "text-gray-400", value: "8" }],
    columns: [["Referral ID", "referralid"], ["Patient Name", "patientname"], ["Therapy Type", "therapytype"], ["Sessions Ordered", "sessionsordered"], ["Physiotherapist", "physiotherapist"]],
    badge: ["Status", "status", {"Scheduled":"gray","In Progress":"amber","Completed":"emerald","Pending Auth":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const types = ['Post-Op Rehab', 'Sports Injury', 'Stroke Rehab', 'Back Pain Mgmt', 'Post-Op Rehab'];
        const sess = ['10 Sessions', '5 Sessions', '20 Sessions', '8 Sessions', '12 Sessions'];
        const phys = ['Dr. Pym', 'Dr. Pym', 'Dr. Foster', 'Dr. Pym', 'Dr. Foster'];
        const statuses = ['Scheduled', 'In Progress', 'In Progress', 'Completed', 'Pending Auth'];
        return { referralid: 'PT-' + (6001 + i), patientname: names[i], therapytype: types[i], sessionsordered: sess[i], physiotherapist: phys[i], status: statuses[i] };
      }),
  },
  "/doctor/orders/procedure": {
    ui: 2,
    title: "Procedure Orders", description: "Order minor clinical procedures or interventions.",
    stats: [{ label: "Pending Procedures", color: "text-amber-400", value: "12" }, { label: "Completed Today", color: "text-emerald-400", value: "34" }, { label: "Cancelled", color: "text-red-400", value: "1" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Procedure Name", "procedurename"], ["Requested Date", "requesteddate"], ["Assigned To", "assignedto"]],
    badge: ["Status", "status", {"Pending":"amber","Completed":"emerald","Scheduled":"gray","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Lex Luthor', 'Joker', 'Riddler', 'Penguin', 'Two-Face'];
        const procs = ['ECG/EKG', 'Nebulization', 'Wound Debridement', 'Catheterization', 'Spirometry'];
        const dates = ['Today', 'Today', 'Tomorrow', 'Today', '15 Jul'];
        const assigns = ['Nursing Station 1', 'RT Dept', 'Surgical OPD', 'Nursing Station 2', 'Pulmonology'];
        const statuses = ['Pending', 'Completed', 'Scheduled', 'In Progress', 'Scheduled'];
        return { orderid: 'PRC-' + (3001 + i), patientname: names[i], procedurename: procs[i], requesteddate: dates[i], assignedto: assigns[i], status: statuses[i] };
      }),
  },
  "/doctor/orders/radiology": {
    ui: 2,
    title: "Radiology Orders", description: "Order X-Rays, MRIs, CT scans, and ultrasounds.",
    stats: [{ label: "Orders Today", color: "text-blue-400", value: "45" }, { label: "Scans Completed", color: "text-emerald-400", value: "24" }, { label: "Pending Read", color: "text-amber-400", value: "8" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Scan Type", "scantype"], ["Body Part", "bodypart"], ["Priority", "priority"]],
    badge: ["Status", "status", {"Scheduled":"gray","Pending Read":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const scans = ['X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'X-Ray'];
        const parts = ['Chest', 'Brain', 'Abdomen', 'Pelvis', 'Left Ankle'];
        const pris = ['Routine', 'Urgent', 'Routine', 'Routine', 'Routine'];
        const statuses = ['Scheduled', 'Pending Read', 'Completed', 'Scheduled', 'Completed'];
        return { orderid: 'RAD-' + (2001 + i), patientname: names[i], scantype: scans[i], bodypart: parts[i], priority: pris[i], status: statuses[i] };
      }),
  },
  "/doctor/orders/surgery": {
    ui: 2,
    title: "Surgical Orders", description: "Request and schedule major surgeries and OR time.",
    stats: [{ label: "Pending Scheduling", color: "text-amber-400", value: "4" }, { label: "Scheduled", color: "text-blue-400", value: "12" }, { label: "In OR Now", color: "text-emerald-400", value: "2" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Surgery Name", "surgeryname"], ["Surgeon", "surgeon"], ["Requested Date", "requesteddate"]],
    badge: ["Status", "status", {"Scheduled":"gray","Pending Schedule":"amber","In OR":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson', 'Maggie Simpson'];
        const surgs = ['Appendectomy', 'Cholecystectomy', 'ACL Reconstruction', 'Tonsillectomy', 'Hernia Repair'];
        const docs = ['Dr. Shepherd', 'Dr. Grey', 'Dr. Sloan', 'Dr. Yang', 'Dr. Shepherd'];
        const dates = ['14 Jul', '15 Jul', '20 Jul', '12 Jul', '18 Jul'];
        const statuses = ['Scheduled', 'Pending Schedule', 'Scheduled', 'In OR', 'Scheduled'];
        return { orderid: 'SUR-' + (4001 + i), patientname: names[i], surgeryname: surgs[i], surgeon: docs[i], requesteddate: dates[i], status: statuses[i] };
      }),
  },
  "/doctor/performance/consultation": {
    ui: 3,
    title: "Consultation Performance", description: "Metrics on OPD efficiency, wait times, and patient volume.",
    stats: [{ label: "Avg Consult Time", color: "text-blue-400", value: "12m 30s" }, { label: "Target", color: "text-emerald-400", value: "15m 00s" }, { label: "Satisfaction", color: "text-emerald-400", value: "4.8/5" }],
    columns: [["Metric ID", "metricid"], ["Doctor", "doctor"], ["Avg Consult Time", "avgconsulttime"], ["Patients/Day", "patientsday"], ["Patient Satisfaction", "patientsatisfaction"]],
    badge: ["Status", "status", {"Excellent":"emerald","Good":"emerald","Average":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Excellent', 'Good', 'Average', 'Excellent', 'Good'];
        return { metricid: 'PER-C-' + (1001 + i), doctor: 'Dr. Smith', avgconsulttime: '12m', patientsday: '45', patientsatisfaction: '4.9', status: statuses[i] };
      }),
  },
  "/doctor/performance/feedback": {
    ui: 3,
    title: "Patient Feedback", description: "Reviews and feedback collected from patients post-visit.",
    stats: [{ label: "Total Reviews", color: "text-blue-400", value: "4,520" }, { label: "Avg Rating", color: "text-emerald-400", value: "4.7/5" }, { label: "Complaints", color: "text-red-400", value: "12" }],
    columns: [["Feedback ID", "feedbackid"], ["Patient Name", "patientname"], ["Doctor", "doctor"], ["Rating", "rating"], ["Comments", "comments"]],
    badge: ["Status", "status", {"Reviewed":"emerald","Pending":"amber","Addressed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Reviewed', 'Pending', 'Reviewed', 'Reviewed', 'Addressed'];
        return { feedbackid: 'FBK-' + (3001 + i), patientname: 'Anonymous', doctor: 'Dr. Grey', rating: '5/5', comments: 'Great experience', status: statuses[i] };
      }),
  },
  "/doctor/performance/kpis": {
    ui: 3,
    title: "Key Performance Indicators", description: "Overall scorecard for departmental and individual KPIs.",
    stats: [{ label: "KPIs Met", color: "text-emerald-400", value: "18/20" }, { label: "Needs Attention", color: "text-amber-400", value: "2" }, { label: "Overall Score", color: "text-blue-400", value: "92%" }],
    columns: [["KPI ID", "kpiid"], ["Metric Name", "metricname"], ["Current Value", "currentvalue"], ["Target", "target"], ["Variance", "variance"]],
    badge: ["Status", "status", {"On Track":"emerald","Lagging":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['On Track', 'On Track', 'Lagging', 'On Track', 'On Track'];
        return { kpiid: 'KPI-' + (4001 + i), metricname: 'Patient Wait Time', currentvalue: '18 mins', target: '15 mins', variance: '+3 mins', status: statuses[i] };
      }),
  },
  "/doctor/performance/procedure": {
    ui: 3,
    title: "Procedural Performance", description: "Metrics on surgical success rates, complications, and OR time.",
    stats: [{ label: "Total Procedures", color: "text-blue-400", value: "342" }, { label: "Avg Success", color: "text-emerald-400", value: "99%" }, { label: "Target OR Util.", color: "text-emerald-400", value: "85%" }],
    columns: [["Metric ID", "metricid"], ["Surgeon", "surgeon"], ["Procedures Done", "proceduresdone"], ["Success Rate", "successrate"], ["Avg OR Time", "avgortime"]],
    badge: ["Status", "status", {"Excellent":"emerald","Good":"emerald","Average":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Excellent', 'Good', 'Average', 'Excellent', 'Good'];
        return { metricid: 'PER-P-' + (2001 + i), surgeon: 'Dr. Shepherd', proceduresdone: '120', successrate: '99.5%', avgortime: '1h 45m', status: statuses[i] };
      }),
  },
  "/doctor/prescription/e-prescription": {
    ui: 2,
    title: "e-Prescription Portal", description: "Direct electronic routing to partnered pharmacies.",
    stats: [{ label: "e-Rx Sent Today", color: "text-blue-400", value: "112" }, { label: "Successful", color: "text-emerald-400", value: "110" }, { label: "Failed/Retry", color: "text-red-400", value: "2" }],
    columns: [["Transmission ID", "transmissionid"], ["Patient Name", "patientname"], ["Destination Pharmacy", "destinationpharmacy"], ["Sent Time", "senttime"], ["Ack Status", "ackstatus"]],
    badge: ["Status", "status", {"Delivered":"emerald","Transmitting":"gray","Failed":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const pharms = ['CVS Pharmacy #12', 'Walgreens #45', 'In-house Pharmacy', 'RiteAid #02', 'CVS Pharmacy #12'];
        const times = ['09:15 AM', '10:00 AM', '10:30 AM', '11:45 AM', '01:20 PM'];
        const acks = ['ACK_RCVD', 'ACK_RCVD', 'PENDING', 'ERR_500', 'ACK_RCVD'];
        const statuses = ['Delivered', 'Delivered', 'Transmitting', 'Failed', 'Delivered'];
        return { transmissionid: 'ERX-' + (4001 + i), patientname: names[i], destinationpharmacy: pharms[i], senttime: times[i], ackstatus: acks[i], status: statuses[i] };
      }),
  },
  "/doctor/prescription/history": {
    ui: 2,
    title: "Prescription History", description: "Log of all past prescriptions issued to patients.",
    stats: [{ label: "Total Rx Logged", color: "text-blue-400", value: "45,120" }, { label: "Dispensed", color: "text-emerald-400", value: "98%" }, { label: "Expired", color: "text-gray-400", value: "2%" }],
    columns: [["Rx ID", "rxid"], ["Patient Name", "patientname"], ["Date Issued", "dateissued"], ["Primary Med", "primarymed"], ["Dispensed", "dispensed"]],
    badge: ["Status", "status", {"Dispensed":"emerald","Expired":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const dates = ['12 Jun 2026', '10 Jun 2026', '01 Jun 2026', '15 May 2026', '10 May 2026'];
        const meds = ['Amoxicillin', 'Lisinopril', 'Paracetamol', 'Metformin', 'Ibuprofen'];
        const disps = ['Yes', 'Yes', 'Yes', 'No', 'Yes'];
        const statuses = ['Dispensed', 'Dispensed', 'Dispensed', 'Expired', 'Dispensed'];
        return { rxid: 'RXH-' + (2001 + i), patientname: names[i], dateissued: dates[i], primarymed: meds[i], dispensed: disps[i], status: statuses[i] };
      }),
  },
  "/doctor/prescription/new": {
    ui: 2,
    title: "New Prescription", description: "Create and issue a new medication prescription.",
    stats: [{ label: "Rx Issued Today", color: "text-blue-400", value: "142" }, { label: "e-Rx Sent", color: "text-emerald-400", value: "130" }, { label: "Printed", color: "text-gray-400", value: "12" }],
    columns: [["Rx ID", "rxid"], ["Patient Name", "patientname"], ["Medications Count", "medicationscount"], ["Duration", "duration"], ["Pharmacy Route", "pharmacyroute"]],
    badge: ["Status", "status", {"Issued":"emerald","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const counts = ['2 Meds', '1 Med', '3 Meds', '4 Meds', '1 Med'];
        const durs = ['7 Days', '30 Days', '5 Days', '14 Days', 'As Needed'];
        const routes = ['In-house Pharmacy', 'External', 'In-house Pharmacy', 'External', 'In-house Pharmacy'];
        const statuses = ['Issued', 'Draft', 'Issued', 'Issued', 'Issued'];
        return { rxid: 'RX-' + (1001 + i), patientname: names[i], medicationscount: counts[i], duration: durs[i], pharmacyroute: routes[i], status: statuses[i] };
      }),
  },
  "/doctor/prescription/repeat": {
    ui: 2,
    title: "Repeat Prescriptions", description: "Manage refill and repeat requests for chronic medications.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "14" }, { label: "Approved Today", color: "text-emerald-400", value: "45" }, { label: "Requires Consult", color: "text-red-400", value: "3" }],
    columns: [["Request ID", "requestid"], ["Patient Name", "patientname"], ["Medication", "medication"], ["Requested On", "requestedon"], ["Refills Left", "refillsleft"]],
    badge: ["Status", "status", {"Pending Approval":"red","Requires Consult":"amber","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const meds = ['Amlodipine 5mg', 'Atorvastatin 20mg', 'Levothyroxine 50mcg', 'Metformin 500mg', 'Salbutamol Inhaler'];
        const reqs = ['Today', 'Yesterday', 'Today', 'Today', '2 Days Ago'];
        const lefts = ['2', '0', '3', '1', '0'];
        const statuses = ['Pending Approval', 'Requires Consult', 'Approved', 'Approved', 'Requires Consult'];
        return { requestid: 'REF-' + (3001 + i), patientname: names[i], medication: meds[i], requestedon: reqs[i], refillsleft: lefts[i], status: statuses[i] };
      }),
  },
  "/doctor/prescription/templates": {
    ui: 2,
    title: "Rx Templates", description: "Quick prescription templates for common ailments.",
    stats: [{ label: "Total Templates", color: "text-blue-400", value: "24" }, { label: "Most Used", color: "text-emerald-400", value: "Viral Fever" }, { label: "My Templates", color: "text-amber-400", value: "8" }],
    columns: [["Template ID", "templateid"], ["Condition", "condition"], ["Medications", "medications"], ["Created By", "createdby"], ["Usage Count", "usagecount"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const conds = ['Viral Fever', 'Acute Gastroenteritis', 'Migraine (Acute)', 'UTI (Uncomplicated)', 'Allergic Rhinitis'];
        const meds = ['Paracetamol + ORS', 'Ciprofloxacin + ORS', 'Sumatriptan 50mg', 'Nitrofurantoin 100mg', 'Cetirizine 10mg'];
        const counts = ['1,450', '850', '320', '410', '950'];
        const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
        return { templateid: 'RXT-' + (5001 + i), condition: conds[i], medications: meds[i], createdby: 'Dr. Jenkins', usagecount: counts[i], status: statuses[i] };
      }),
  },
  "/doctor/procedures/history": {
    ui: 3,
    title: "Procedure History", description: "Comprehensive log of all past patient procedures.",
    stats: [{ label: "Total Procedures", color: "text-blue-400", value: "12,450" }, { label: "This Month", color: "text-emerald-400", value: "340" }, { label: "Success Rate", color: "text-emerald-400", value: "98%" }],
    columns: [["Record ID", "recordid"], ["Patient Name", "patientname"], ["Procedure", "procedure"], ["Date Performed", "dateperformed"], ["Surgeon", "surgeon"]],
    badge: ["Status", "status", {"Recovered":"emerald","In Rehab":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const procs = ['Tonsillectomy', 'Hernia Repair', 'Cataract Surgery', 'Knee Arthroscopy', 'Gallbladder Removal'];
        const statuses = ['Recovered', 'Recovered', 'Recovered', 'In Rehab', 'Recovered'];
        return { recordid: 'PHX-' + (4001 + i), patientname: names[i], procedure: procs[i], dateperformed: '10 Jan 2026', surgeon: 'Dr. Grey', status: statuses[i] };
      }),
  },
  "/doctor/procedures/major": {
    ui: 3,
    title: "Major Procedures", description: "Schedule and manage major surgical operations.",
    stats: [{ label: "Scheduled Surgeries", color: "text-blue-400", value: "8" }, { label: "In Progress", color: "text-amber-400", value: "2" }, { label: "Completed", color: "text-emerald-400", value: "4" }],
    columns: [["Surgery ID", "surgeryid"], ["Patient Name", "patientname"], ["Surgery Name", "surgeryname"], ["OR Room", "orroom"], ["Scheduled Time", "scheduledtime"]],
    badge: ["Status", "status", {"Scheduled":"amber","In Progress":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const surgs = ['Appendectomy', 'CABG', 'Hip Replacement', 'Craniotomy', 'Spinal Fusion'];
        const statuses = ['Scheduled', 'In Progress', 'Completed', 'Completed', 'Scheduled'];
        return { surgeryid: 'MAJ-' + (2001 + i), patientname: names[i], surgeryname: surgs[i], orroom: 'OR-' + (1 + i), scheduledtime: '08:00 AM', status: statuses[i] };
      }),
  },
  "/doctor/procedures/minor": {
    ui: 3,
    title: "Minor Procedures", description: "Log and track minor clinical procedures.",
    stats: [{ label: "Procedures Today", color: "text-blue-400", value: "24" }, { label: "Successful", color: "text-emerald-400", value: "23" }, { label: "Complications", color: "text-amber-400", value: "1" }],
    columns: [["Procedure ID", "procedureid"], ["Patient Name", "patientname"], ["Procedure Type", "proceduretype"], ["Duration", "duration"], ["Complications", "complications"]],
    badge: ["Status", "status", {"Completed":"emerald","In Progress":"amber","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const procs = ['Suturing', 'Incision & Drainage', 'Mole Removal', 'Splinting', 'Wound Debridement'];
        const statuses = ['Completed', 'Completed', 'In Progress', 'Completed', 'Scheduled'];
        return { procedureid: 'MIN-' + (1001 + i), patientname: names[i], proceduretype: procs[i], duration: '15 mins', complications: 'None', status: statuses[i] };
      }),
  },
  "/doctor/procedures/notes": {
    ui: 3,
    title: "Procedure Notes", description: "Detailed operative notes and surgical records.",
    stats: [{ label: "Pending Notes", color: "text-amber-400", value: "5" }, { label: "Signed Today", color: "text-emerald-400", value: "18" }, { label: "Co-signed", color: "text-blue-400", value: "12" }],
    columns: [["Note ID", "noteid"], ["Procedure ID", "procedureid"], ["Patient Name", "patientname"], ["Surgeon", "surgeon"], ["Note Summary", "notesummary"]],
    badge: ["Status", "status", {"Signed":"emerald","Draft":"amber","Pending Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const statuses = ['Signed', 'Draft', 'Signed', 'Draft', 'Pending Review'];
        return { noteid: 'PNT-' + (3001 + i), procedureid: 'MAJ-' + (100 + i), patientname: names[i], surgeon: 'Dr. House', notesummary: 'Procedure went smoothly...', status: statuses[i] };
      }),
  },
  "/doctor/queue/checked-in": {
    ui: 0,
    title: "Checked-In Patients", description: "Patients who have completed front desk registration.",
    stats: [{ label: "Checked In", color: "text-blue-400", value: "24" }, { label: "Vitals Pending", color: "text-amber-400", value: "5" }, { label: "Ready for Doctor", color: "text-emerald-400", value: "15" }],
    columns: [["Appt ID", "apptid"], ["Patient Name", "patientname"], ["Vitals Recorded", "vitalsrecorded"], ["Payment Status", "paymentstatus"], ["Arrival Time", "arrivaltime"]],
    badge: ["Status", "status", {"Ready":"emerald","Triage Needed":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const vitals = ['Yes (BP/HR/Temp)', 'Yes (BP/HR)', 'Pending', 'Yes (Full)', 'Pending'];
        const pays = ['Cleared', 'Insurance', 'Co-Pay Pending', 'Cleared', 'Cleared'];
        const statuses = ['Ready', 'Ready', 'Triage Needed', 'Ready', 'Triage Needed'];
        return { apptid: 'APT-' + (3000 + i), patientname: names[i], vitalsrecorded: vitals[i], paymentstatus: pays[i], arrivaltime: '09:' + (10 + i) + ' AM', status: statuses[i] };
      }),
  },
  "/doctor/queue/emergency": {
    ui: 0,
    title: "Emergency Queue", description: "High-priority urgent cases bypassing the standard queue.",
    stats: [{ label: "Active ER Cases", color: "text-red-400", value: "3" }, { label: "Critical", color: "text-red-500", value: "1" }, { label: "Stabilized", color: "text-emerald-400", value: "2" }],
    columns: [["ER ID", "erid"], ["Patient Name", "patientname"], ["Severity/Triage", "severitytriage"], ["Arrival Time", "arrivaltime"], ["Primary Complaint", "primarycomplaint"]],
    badge: ["Status", "status", {"Resuscitation":"amber","Stabilized":"emerald","Discharged":"emerald","Observation":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Unknown (Trauma)', 'Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince'];
        const sevs = ['Red (Immediate)', 'Yellow (Delayed)', 'Green (Minor)', 'Yellow (Delayed)', 'Green (Minor)'];
        const comps = ['MVA Trauma', 'Laceration', 'Sprain', 'Fever', 'Allergic Reaction'];
        const statuses = ['Resuscitation', 'Stabilized', 'Discharged', 'Observation', 'Discharged'];
        return { erid: 'ER-' + (500 + i), patientname: names[i], severitytriage: sevs[i], arrivaltime: '14:' + (10 + i), primarycomplaint: comps[i], status: statuses[i] };
      }),
  },
  "/doctor/queue/follow-up": {
    ui: 0,
    title: "Follow-Up Queue", description: "Patients returning for review or post-operative checks.",
    stats: [{ label: "Follow-ups Today", color: "text-blue-400", value: "18" }, { label: "Post-Op", color: "text-amber-400", value: "4" }, { label: "Routine", color: "text-emerald-400", value: "14" }],
    columns: [["Appt ID", "apptid"], ["Patient Name", "patientname"], ["Previous Visit", "previousvisit"], ["Reason", "reason"], ["Progress", "progress"]],
    badge: ["Status", "status", {"Checked In":"red","Scheduled":"amber","Waiting":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Peter Parker', 'Mary Jane', 'Harry Osborn'];
        const prevs = ['12 Jun, 2026', '15 Jun, 2026', '20 Jun, 2026', '01 Jul, 2026', '10 Jul, 2026'];
        const reasons = ['Incision Check', 'Stitch Removal', 'Medication Review', 'Lab Results', 'Routine Check'];
        const progs = ['Healing Well', 'Normal', 'Improved', 'Pending Review', 'Stable'];
        const statuses = ['Checked In', 'Scheduled', 'Waiting', 'Completed', 'Scheduled'];
        return { apptid: 'FLW-' + (4000 + i), patientname: names[i], previousvisit: prevs[i], reason: reasons[i], progress: progs[i], status: statuses[i] };
      }),
  },
  "/doctor/queue/telemedicine": {
    ui: 0,
    title: "Telemedicine Queue", description: "Virtual waiting room for online consultations.",
    stats: [{ label: "Virtual Appts", color: "text-blue-400", value: "8" }, { label: "Active Calls", color: "text-emerald-400", value: "1" }, { label: "Waiting Online", color: "text-amber-400", value: "2" }],
    columns: [["Session ID", "sessionid"], ["Patient Name", "patientname"], ["Platform", "platform"], ["Scheduled For", "scheduledfor"], ["Connection", "connection"]],
    badge: ["Status", "status", {"Completed":"emerald","Active Call":"emerald","Waiting":"amber","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Lex Luthor', 'Joker', 'Riddler', 'Penguin', 'Two-Face'];
        const plats = ['Zoom', 'In-house Video', 'In-house Video', 'Phone Call', 'Zoom'];
        const scheds = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM'];
        const conns = ['Excellent', 'Good', 'Pending Join', 'N/A', 'Pending Join'];
        const statuses = ['Completed', 'Active Call', 'Waiting', 'Scheduled', 'Scheduled'];
        return { sessionid: 'TEL-' + (5000 + i), patientname: names[i], platform: plats[i], scheduledfor: scheds[i], connection: conns[i], status: statuses[i] };
      }),
  },
  "/doctor/queue/today": {
    ui: 0,
    title: "Today's Queue", description: "Comprehensive list of all patients queued for today.",
    stats: [{ label: "Total Queued", color: "text-blue-400", value: "32" }, { label: "Seen", color: "text-emerald-400", value: "14" }, { label: "Waiting", color: "text-amber-400", value: "18" }],
    columns: [["Token", "token"], ["Patient Name", "patientname"], ["Visit Type", "visittype"], ["Scheduled Time", "scheduledtime"], ["Check-In Time", "checkintime"]],
    badge: ["Status", "status", {"Completed":"emerald","Consulting":"gray","Scheduled":"amber","Waiting":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const types = ['First Visit', 'Follow-Up', 'Routine', 'First Visit', 'Post-Op'];
        const times = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'];
        const checks = ['08:50 AM', '09:20 AM', '-', '10:15 AM', '-'];
        const statuses = ['Completed', 'Consulting', 'Scheduled', 'Waiting', 'Scheduled'];
        return { token: 'TKN-' + (10 + i), patientname: names[i], visittype: types[i], scheduledtime: times[i], checkintime: checks[i], status: statuses[i] };
      }),
  },
  "/doctor/queue/waiting": {
    ui: 0,
    title: "Waiting Room", description: "Live list of patients physically present and waiting.",
    stats: [{ label: "Currently Waiting", color: "text-amber-400", value: "12" }, { label: "Avg Wait", color: "text-blue-400", value: "18 mins" }, { label: "Next Turn", color: "text-emerald-400", value: "TKN-15" }],
    columns: [["Wait No", "waitno"], ["Patient Name", "patientname"], ["Condition", "condition"], ["Wait Duration", "waitduration"], ["Assigned Nurse", "assignednurse"]],
    badge: ["Status", "status", {"Next":"red","Waiting":"amber","Triage":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const conds = ['Fever', 'Routine Check', 'Mild Pain', 'BP Check', 'Dressing'];
        const waits = ['25 mins', '15 mins', '10 mins', '5 mins', 'Just Arrived'];
        const statuses = ['Next', 'Waiting', 'Waiting', 'Waiting', 'Triage'];
        return { waitno: 'WT-' + (1 + i), patientname: names[i], condition: conds[i], waitduration: waits[i], assignednurse: 'Nurse Joy', status: statuses[i] };
      }),
  },
  "/doctor/referrals/external": {
    ui: 3,
    title: "External Referrals", description: "Referrals sent to outside hospitals or clinics.",
    stats: [{ label: "Outbound Referrals", color: "text-blue-400", value: "12" }, { label: "Acknowledged", color: "text-emerald-400", value: "8" }, { label: "Pending", color: "text-amber-400", value: "4" }],
    columns: [["Ref ID", "refid"], ["Patient Name", "patientname"], ["Destination", "destination"], ["Specialty", "specialty"], ["Sent Date", "sentdate"]],
    badge: ["Status", "status", {"Acknowledged":"emerald","Sent":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const statuses = ['Acknowledged', 'Sent', 'Acknowledged', 'Pending', 'Sent'];
        return { refid: 'ERF-' + (2001 + i), patientname: names[i], destination: 'City Hospital', specialty: 'Oncology', sentdate: 'Today', status: statuses[i] };
      }),
  },
  "/doctor/referrals/internal": {
    ui: 3,
    title: "Internal Referrals", description: "Referrals made to other departments within the hospital.",
    stats: [{ label: "Active Referrals", color: "text-blue-400", value: "24" }, { label: "Accepted", color: "text-emerald-400", value: "18" }, { label: "Pending", color: "text-amber-400", value: "6" }],
    columns: [["Ref ID", "refid"], ["Patient Name", "patientname"], ["From Dept", "fromdept"], ["To Dept", "todept"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Accepted":"emerald","Pending":"amber","Rejected":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const statuses = ['Accepted', 'Pending', 'Accepted', 'Rejected', 'Accepted'];
        return { refid: 'IRF-' + (1001 + i), patientname: names[i], fromdept: 'General Med', todept: 'Cardiology', reason: 'ECG Abnormal', status: statuses[i] };
      }),
  },
  "/doctor/referrals/specialist": {
    ui: 3,
    title: "Specialist Referrals", description: "Incoming referrals from general practitioners.",
    stats: [{ label: "Incoming Today", color: "text-blue-400", value: "15" }, { label: "Reviewed", color: "text-emerald-400", value: "10" }, { label: "Urgent", color: "text-red-400", value: "3" }],
    columns: [["Ref ID", "refid"], ["Patient Name", "patientname"], ["Referring Dr", "referringdr"], ["Condition", "condition"], ["Priority", "priority"]],
    badge: ["Status", "status", {"Reviewed":"emerald","Pending":"amber","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const statuses = ['Reviewed', 'Pending', 'Scheduled', 'Reviewed', 'Scheduled'];
        return { refid: 'SRF-' + (3001 + i), patientname: names[i], referringdr: 'Dr. GP', condition: 'Arrhythmia', priority: 'High', status: statuses[i] };
      }),
  },
  "/doctor/reports/diagnosis": {
    ui: 3,
    title: "Diagnosis Analytics", description: "Trends and frequency reports of patient diagnoses.",
    stats: [{ label: "Top Diagnosis", color: "text-blue-400", value: "Hypertension" }, { label: "Seasonal Spike", color: "text-amber-400", value: "Influenza" }, { label: "Rare Cases", color: "text-gray-400", value: "12" }],
    columns: [["Report ID", "reportid"], ["ICD-10 Category", "icd10category"], ["Total Cases", "totalcases"], ["Most Affected Demo", "mostaffecteddemo"], ["Trend", "trend"]],
    badge: ["Status", "status", {"Reviewed":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Reviewed', 'Reviewed', 'Pending', 'Reviewed', 'Reviewed'];
        return { reportid: 'RPT-D-' + (3001 + i), icd10category: 'Circulatory', totalcases: '450', mostaffecteddemo: 'Males 40-60', trend: '+5%', status: statuses[i] };
      }),
  },
  "/doctor/reports/ipd": {
    ui: 3,
    title: "IPD Reports", description: "Analytics and summaries of Inpatient Department metrics.",
    stats: [{ label: "Admissions This Month", color: "text-blue-400", value: "340" }, { label: "Avg Stay", color: "text-emerald-400", value: "4.2 Days" }, { label: "Mortality Rate", color: "text-gray-400", value: "0.1%" }],
    columns: [["Report ID", "reportid"], ["Date Range", "daterange"], ["Admissions", "admissions"], ["Discharges", "discharges"], ["Avg Length of Stay", "avglengthofstay"]],
    badge: ["Status", "status", {"Generated":"emerald","Processing":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Generated', 'Generated', 'Processing', 'Generated', 'Generated'];
        return { reportid: 'RPT-I-' + (2001 + i), daterange: 'May 2026', admissions: '320', discharges: '310', avglengthofstay: '4.5 Days', status: statuses[i] };
      }),
  },
  "/doctor/reports/opd": {
    ui: 3,
    title: "OPD Reports", description: "Analytics and summaries of Outpatient Department metrics.",
    stats: [{ label: "Consults This Month", color: "text-blue-400", value: "1,240" }, { label: "Avg Daily", color: "text-emerald-400", value: "45" }, { label: "Growth", color: "text-emerald-400", value: "+12%" }],
    columns: [["Report ID", "reportid"], ["Date Range", "daterange"], ["Total Consults", "totalconsults"], ["New Patients", "newpatients"], ["Revenue Generated", "revenuegenerated"]],
    badge: ["Status", "status", {"Generated":"emerald","Processing":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Generated', 'Generated', 'Processing', 'Generated', 'Generated'];
        return { reportid: 'RPT-O-' + (1001 + i), daterange: 'May 2026', totalconsults: '1,200', newpatients: '450', revenuegenerated: '$120,000', status: statuses[i] };
      }),
  },
  "/doctor/reports/outcome": {
    ui: 3,
    title: "Clinical Outcomes", description: "Reports measuring patient recovery rates and clinical success.",
    stats: [{ label: "Overall Success", color: "text-emerald-400", value: "94%" }, { label: "Readmissions (30d)", color: "text-amber-400", value: "2.1%" }, { label: "Mortality", color: "text-gray-400", value: "0.1%" }],
    columns: [["Report ID", "reportid"], ["Condition", "condition"], ["Cases Tracked", "casestracked"], ["Positive Outcome", "positiveoutcome"], ["Readmission Rate", "readmissionrate"]],
    badge: ["Status", "status", {"Published":"emerald","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Published', 'Published', 'Draft', 'Published', 'Published'];
        return { reportid: 'RPT-C-' + (7001 + i), condition: 'Post-Op Infection', casestracked: '1,200', positiveoutcome: '98%', readmissionrate: '1.5%', status: statuses[i] };
      }),
  },
  "/doctor/reports/prescription": {
    ui: 3,
    title: "Prescription Analytics", description: "Reports on medication usage, trends, and pharmacy data.",
    stats: [{ label: "Most Prescribed", color: "text-blue-400", value: "Antibiotics" }, { label: "e-Rx Adoption", color: "text-emerald-400", value: "98%" }, { label: "Alerts", color: "text-amber-400", value: "2" }],
    columns: [["Report ID", "reportid"], ["Medication Class", "medicationclass"], ["Total Prescribed", "totalprescribed"], ["Top Prescriber", "topprescriber"], ["Trend", "trend"]],
    badge: ["Status", "status", {"Reviewed":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Reviewed', 'Reviewed', 'Pending', 'Reviewed', 'Reviewed'];
        return { reportid: 'RPT-P-' + (4001 + i), medicationclass: 'Antibiotics', totalprescribed: '1,200 Units', topprescriber: 'Dr. Smith', trend: '-2%', status: statuses[i] };
      }),
  },
  "/doctor/reports/procedure": {
    ui: 3,
    title: "Procedure Analytics", description: "Reports on surgical and minor procedure volumes and outcomes.",
    stats: [{ label: "Total Procedures", color: "text-blue-400", value: "840" }, { label: "Success Rate", color: "text-emerald-400", value: "99.1%" }, { label: "Complications", color: "text-red-400", value: "0.9%" }],
    columns: [["Report ID", "reportid"], ["Procedure Category", "procedurecategory"], ["Total Performed", "totalperformed"], ["Success Rate", "successrate"], ["Avg Duration", "avgduration"]],
    badge: ["Status", "status", {"Reviewed":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Reviewed', 'Reviewed', 'Pending', 'Reviewed', 'Reviewed'];
        return { reportid: 'RPT-S-' + (5001 + i), procedurecategory: 'General Surgery', totalperformed: '120', successrate: '99%', avgduration: '45 mins', status: statuses[i] };
      }),
  },
  "/doctor/reports/referral": {
    ui: 3,
    title: "Referral Analytics", description: "Track inbound and outbound referral patterns and conversions.",
    stats: [{ label: "Total Inbound", color: "text-blue-400", value: "450" }, { label: "Conversion", color: "text-emerald-400", value: "85%" }, { label: "Total Outbound", color: "text-amber-400", value: "120" }],
    columns: [["Report ID", "reportid"], ["Referral Source", "referralsource"], ["Total Received", "totalreceived"], ["Converted", "converted"], ["Conversion Rate", "conversionrate"]],
    badge: ["Status", "status", {"Reviewed":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Reviewed', 'Reviewed', 'Pending', 'Reviewed', 'Reviewed'];
        return { reportid: 'RPT-R-' + (6001 + i), referralsource: 'City Clinic', totalreceived: '45', converted: '40', conversionrate: '88%', status: statuses[i] };
      }),
  },
  "/doctor/schedule/availability": {
    ui: 0,
    title: "Doctor Availability Matrix", description: "Configure and monitor shifts, leaves, and time slots.",
    stats: [{ label: "Doctors On Shift", color: "text-blue-400", value: "45" }, { label: "On Leave Today", color: "text-amber-400", value: "12" }, { label: "Total Open Slots", color: "text-emerald-400", value: "124" }],
    columns: [["Doctor", "doctor"], ["Specialty", "specialty"], ["Current Shift", "currentshift"], ["Available Slots", "availableslots"], ["Next Leave", "nextleave"]],
    badge: ["Status", "status", {"Available":"emerald","Fully Booked":"amber","On Leave":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Derek Shepherd', 'Dr. Meredith Grey', 'Dr. Cristina Yang'];
        const specs = ['Cardiology', 'Plastic Surgery', 'Neurosurgery', 'General Surgery', 'Cardiothoracic'];
        const shifts = ['Morning (08-16)', 'Evening (16-00)', 'Morning (08-16)', 'Off Duty', 'Morning (08-16)'];
        const slots = ['4 Slots Open', '12 Slots Open', '0 Slots (Full)', '0 Slots', '2 Slots Open'];
        const leaves = ['15 Aug, 2026', 'None Scheduled', '22 Jul, 2026', 'Today', 'None Scheduled'];
        const statuses = ['Available', 'Available', 'Fully Booked', 'On Leave', 'Available'];
        return { doctor: docs[i], specialty: specs[i], currentshift: shifts[i], availableslots: slots[i], nextleave: leaves[i], status: statuses[i] };
      }),
  },
  "/doctor/schedule/calendar": {
    ui: 0,
    title: "Schedule Calendar", description: "Monthly/Weekly view of appointments, procedures, and blocks.",
    stats: [{ label: "Events This Week", color: "text-blue-400", value: "42" }, { label: "Appts Today", color: "text-emerald-400", value: "12" }, { label: "Conflicts", color: "text-emerald-400", value: "0" }],
    columns: [["Event ID", "eventid"], ["Date & Time", "datetime"], ["Event Type", "eventtype"], ["Patient/Details", "patientdetails"], ["Location", "location"]],
    badge: ["Status", "status", {"Upcoming":"amber","Confirmed":"emerald","Scheduled":"amber","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const dates = ['Today 09:00 AM', 'Today 10:30 AM', 'Tomorrow 14:00 PM', '15 Jul, 2026', '16 Jul, 2026'];
        const types = ['Consultation', 'Surgery Block', 'Telemedicine', 'OPD Duty', 'Seminar'];
        const details = ['John Doe', 'Appendectomy', 'Jane Smith', 'General OPD', 'Medical Conference'];
        const locs = ['Room 101', 'OR-3', 'Virtual Link', 'OPD Wing A', 'Auditorium'];
        const statuses = ['Upcoming', 'Confirmed', 'Scheduled', 'Scheduled', 'Approved'];
        return { eventid: 'EVT-' + (1001 + i), datetime: dates[i], eventtype: types[i], patientdetails: details[i], location: locs[i], status: statuses[i] };
      }),
  },
  "/doctor/schedule/leave": {
    ui: 0,
    title: "Leave Management", description: "Apply for leaves, track balances, and manage absences.",
    stats: [{ label: "Annual Leave Balance", color: "text-blue-400", value: "14 Days" }, { label: "Sick Leave", color: "text-amber-400", value: "5 Days" }, { label: "Pending Requests", color: "text-emerald-400", value: "1" }],
    columns: [["Leave ID", "leaveid"], ["Leave Type", "leavetype"], ["Start Date", "startdate"], ["End Date", "enddate"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Pending Approval":"amber","Approved":"emerald","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Annual Leave', 'Sick Leave', 'Conference', 'Annual Leave', 'Unpaid Leave'];
        const starts = ['15 Aug, 2026', '12 Mar, 2026', '01 Sep, 2026', '20 Dec, 2025', '10 Nov, 2025'];
        const ends = ['30 Aug, 2026', '14 Mar, 2026', '05 Sep, 2026', '02 Jan, 2026', '12 Nov, 2025'];
        const statuses = ['Pending Approval', 'Approved', 'Approved', 'Completed', 'Completed'];
        return { leaveid: 'LVE-' + (2001 + i), leavetype: types[i], startdate: starts[i], enddate: ends[i], reason: 'Personal', status: statuses[i] };
      }),
  },
  "/doctor/schedule/today": {
    ui: 0,
    title: "Today's Schedule", description: "Live overview of all doctor appointments scheduled for today.",
    stats: [{ label: "Total Appts Today", color: "text-blue-400", value: "312" }, { label: "Completed", color: "text-emerald-400", value: "145" }, { label: "Cancellations", color: "text-red-400", value: "8" }],
    columns: [["Appt ID", "apptid"], ["Doctor", "doctor"], ["Patient Name", "patientname"], ["Time Slot", "timeslot"], ["Room/Ward", "roomward"]],
    badge: ["Status", "status", {"Completed":"emerald","Checked In":"emerald","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Derek Shepherd', 'Dr. Meredith Grey', 'Dr. Cristina Yang'];
        const pats = ['Alice Cooper', 'Bob Marley', 'Elvis Presley', 'John Lennon', 'Jimi Hendrix'];
        const times = ['09:00 AM - 09:30 AM', '10:00 AM - 10:15 AM', '11:00 AM - 12:00 PM', '01:00 PM - 01:30 PM', '02:00 PM - 02:45 PM'];
        const rooms = ['Room 101', 'Room 102', 'OR-1', 'Room 105', 'ICU-B'];
        const statuses = ['Completed', 'Checked In', 'Scheduled', 'Scheduled', 'Scheduled'];
        return { apptid: 'APT-T' + (4001 + i), doctor: docs[i], patientname: pats[i], timeslot: times[i], roomward: rooms[i], status: statuses[i] };
      }),
  },
  "/doctor/settings/profile": {
    ui: 0,
    title: "Doctor Profiles", description: "Directory of clinical staff profiles, credentials, and settings.",
    stats: [{ label: "Total Doctors", color: "text-blue-400", value: "124" }, { label: "Active/On-Duty", color: "text-emerald-400", value: "85" }, { label: "Licenses Expiring", color: "text-red-400", value: "2" }],
    columns: [["Doctor ID", "doctorid"], ["Name", "name"], ["Specialty", "specialty"], ["License No", "licenseno"], ["Consultation Fee", "consultationfee"]],
    badge: ["Status", "status", {"Active":"emerald","Expiring Soon":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Derek Shepherd', 'Dr. Meredith Grey', 'Dr. Cristina Yang'];
        const specs = ['Cardiology', 'Plastic Surgery', 'Neurosurgery', 'General Surgery', 'Cardiothoracic'];
        const lics = ['MED-109283', 'MED-293847', 'MED-948273', 'MED-102938', 'MED-584739'];
        const fees = ['$150', '$200', '$250', '$150', '$300'];
        const statuses = ['Active', 'Active', 'Active', 'Active', 'Expiring Soon'];
        return { doctorid: 'DOC-' + (3001 + i), name: docs[i], specialty: specs[i], licenseno: lics[i], consultationfee: fees[i], status: statuses[i] };
      }),
  },
  "/doctor/telemedicine/chat": {
    ui: 3,
    title: "Patient Chat", description: "Secure text messaging with patients for minor queries.",
    stats: [{ label: "Active Chats", color: "text-blue-400", value: "45" }, { label: "Unread Messages", color: "text-amber-400", value: "12" }, { label: "Resolved Today", color: "text-emerald-400", value: "24" }],
    columns: [["Chat ID", "chatid"], ["Patient Name", "patientname"], ["Last Message", "lastmessage"], ["Unread", "unread"], ["Last Active", "lastactive"]],
    badge: ["Status", "status", {"Active":"emerald","Unread":"gray","Resolved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const statuses = ['Active', 'Unread', 'Resolved', 'Active', 'Unread'];
        return { chatid: 'CHT-' + (2001 + i), patientname: names[i], lastmessage: 'Thanks doctor!', unread: '0', lastactive: '10 mins ago', status: statuses[i] };
      }),
  },
  "/doctor/telemedicine/history": {
    ui: 3,
    title: "Telemedicine History", description: "Log of all past virtual consultations and chats.",
    stats: [{ label: "Total Sessions", color: "text-blue-400", value: "1,240" }, { label: "Total Revenue", color: "text-emerald-400", value: "$45,200" }, { label: "Avg Rating", color: "text-emerald-400", value: "4.8/5" }],
    columns: [["Session ID", "sessionid"], ["Patient Name", "patientname"], ["Type", "type"], ["Date", "date"], ["Billed Amount", "billedamount"]],
    badge: ["Status", "status", {"Billed":"emerald","Pending Payment":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const statuses = ['Billed', 'Billed', 'Billed', 'Pending Payment', 'Billed'];
        return { sessionid: 'TMH-' + (3001 + i), patientname: names[i], type: 'Video', date: '01 Jun 2026', billedamount: '$50.00', status: statuses[i] };
      }),
  },
  "/doctor/telemedicine/video": {
    ui: 3,
    title: "Video Consultations", description: "Active and scheduled video calls for remote patients.",
    stats: [{ label: "Calls Today", color: "text-blue-400", value: "14" }, { label: "Completed", color: "text-emerald-400", value: "8" }, { label: "Missed Calls", color: "text-red-400", value: "1" }],
    columns: [["Session ID", "sessionid"], ["Patient Name", "patientname"], ["Platform", "platform"], ["Scheduled Time", "scheduledtime"], ["Duration", "duration"]],
    badge: ["Status", "status", {"Completed":"emerald","Active":"emerald","Waiting":"gray","Scheduled":"amber","Missed":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Griffin', 'Lois Griffin', 'Meg Griffin', 'Chris Griffin', 'Stewie Griffin'];
        const statuses = ['Completed', 'Active', 'Waiting', 'Scheduled', 'Missed'];
        return { sessionid: 'VID-' + (1001 + i), patientname: names[i], platform: 'In-House Portal', scheduledtime: '10:00 AM', duration: '15 mins', status: statuses[i] };
      }),
  },
  "/doctor/vitals/assessment": {
    ui: 2,
    title: "Nursing Assessments", description: "Detailed physical and systemic assessments by nursing staff.",
    stats: [{ label: "Assessments Today", color: "text-blue-400", value: "45" }, { label: "Awaiting Doctor Review", color: "text-amber-400", value: "8" }, { label: "Critical Findings", color: "text-red-400", value: "2" }],
    columns: [["Assessment ID", "assessmentid"], ["Patient Name", "patientname"], ["Assessed By", "assessedby"], ["Primary System", "primarysystem"], ["Findings", "findings"]],
    badge: ["Status", "status", {"Reviewed":"emerald","Pending Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const systems = ['Respiratory', 'Cardiovascular', 'Neurological', 'Gastrointestinal', 'Musculoskeletal'];
        const findings = ['Clear bilaterally', 'Regular Rhythm', 'A&O x3', 'Mild tenderness', 'Normal ROM'];
        const statuses = ['Reviewed', 'Pending Review', 'Reviewed', 'Pending Review', 'Reviewed'];
        return { assessmentid: 'ASM-' + (4001 + i), patientname: names[i], assessedby: 'Nurse Joy', primarysystem: systems[i], findings: findings[i], status: statuses[i] };
      }),
  },
  "/doctor/vitals/patient": {
    ui: 2,
    title: "Patient Vitals", description: "Record and track routine patient vital signs.",
    stats: [{ label: "Vitals Logged Today", color: "text-blue-400", value: "84" }, { label: "Abnormal Vitals", color: "text-red-400", value: "6" }, { label: "Pending Checks", color: "text-amber-400", value: "12" }],
    columns: [["Record ID", "recordid"], ["Patient Name", "patientname"], ["BP (mmHg)", "bpmmhg"], ["Heart Rate", "heartrate"], ["Temp (F)", "tempf"]],
    badge: ["Status", "status", {"Normal":"emerald","Elevated":"amber","Critical":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const bps = ['120/80', '110/70', '145/95', '115/75', '160/100'];
        const hrs = ['72 bpm', '65 bpm', '98 bpm', '70 bpm', '110 bpm'];
        const temps = ['98.6', '98.4', '99.2', '98.5', '101.4'];
        const statuses = ['Normal', 'Normal', 'Elevated', 'Normal', 'Critical'];
        return { recordid: 'VIT-' + (3001 + i), patientname: names[i], bpmmhg: bps[i], heartrate: hrs[i], tempf: temps[i], status: statuses[i] };
      }),
  },
  "/doctor/vitals/risk": {
    ui: 2,
    title: "Risk Assessments", description: "Fall risk, pressure ulcer, and DVT risk evaluations.",
    stats: [{ label: "High Fall Risk", color: "text-red-400", value: "6" }, { label: "High DVT Risk", color: "text-red-400", value: "2" }, { label: "Standard Care", color: "text-emerald-400", value: "45" }],
    columns: [["Eval ID", "evalid"], ["Patient Name", "patientname"], ["Risk Type", "risktype"], ["Score", "score"], ["Precautions Taken", "precautionstaken"]],
    badge: ["Status", "status", {"Active":"emerald","Standard Care":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const types = ['Fall Risk (Morse)', 'Ulcer (Braden)', 'DVT Risk', 'Fall Risk (Morse)', 'Ulcer (Braden)'];
        const scores = ['45 (High)', '18 (Low)', 'High', '10 (Low)', '12 (High)'];
        const precs = ['Bed Alarm', 'Routine Turn', 'Compression Socks', 'Standard', 'Air Mattress'];
        const statuses = ['Active', 'Active', 'Active', 'Standard Care', 'Active'];
        return { evalid: 'RSK-' + (6001 + i), patientname: names[i], risktype: types[i], score: scores[i], precautionstaken: precs[i], status: statuses[i] };
      }),
  },
};

export default pages;
