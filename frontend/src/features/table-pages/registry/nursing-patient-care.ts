import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/nurse/care/catheter": {
    ui: 4,
    title: "Catheter Care", description: "Log insertion, removal, and maintenance of urinary/IV catheters.",
    stats: [{ label: "Active Catheters", color: "text-blue-400", value: "22" }, { label: "Due for Change", color: "text-amber-400", value: "4" }, { label: "Removed Today", color: "text-emerald-400", value: "5" }],
    columns: [["Log ID", "logid"], ["Patient Name", "patientname"], ["Catheter Type", "cathetertype"], ["Inserted On", "insertedon"], ["Days In Situ", "daysinsitu"]],
    badge: ["Status", "status", {"Active":"gray","Change Required":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const types = ['Foley Catheter', 'Peripheral IV', 'Central Line (CVC)', 'Peripheral IV', 'Foley Catheter'];
        const days = ['3 Days', '1 Day', '5 Days', '4 Days (Change Due)', '2 Days'];
        const statuses = ['Active', 'Active', 'Active', 'Change Required', 'Active'];
        return { logid: 'CATH-' + (10001 + i), patientname: names[i], cathertype: types[i], insertedon: '12 Jul', daysinsitu: days[i], status: statuses[i] };
      }),
  },
  "/nurse/care/drain": {
    ui: 4,
    title: "Drain Management", description: "Track output volumes and maintenance of surgical drains.",
    stats: [{ label: "Active Drains", color: "text-blue-400", value: "8" }, { label: "Ready for Removal", color: "text-emerald-400", value: "2" }, { label: "High Output", color: "text-amber-400", value: "1" }],
    columns: [["Drain ID", "drainid"], ["Patient Name", "patientname"], ["Drain Type/Loc", "draintypeloc"], ["Output (ml)", "outputml"], ["Fluid Color", "fluidcolor"]],
    badge: ["Status", "status", {"Active":"gray","High Output":"amber","Ready to Remove":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const types = ['JP Drain (Abd)', 'Hemovac (Knee)', 'Chest Tube (L)', 'JP Drain (Neck)', 'Penrose (Abd)'];
        const outs = ['45', '20', '150', '10', '5'];
        const colors = ['Serosanguinous', 'Serous', 'Sanguinous', 'Serous', 'Serous'];
        const statuses = ['Active', 'Active', 'High Output', 'Ready to Remove', 'Ready to Remove'];
        return { drainid: 'DRN-' + (12001 + i), patientname: names[i], draintypeloc: types[i], outputml: outs[i], fluidcolor: colors[i], status: statuses[i] };
      }),
  },
  "/nurse/care/dressing": {
    ui: 4,
    title: "Dressing Changes", description: "Schedule and log surgical and wound dressing changes.",
    stats: [{ label: "Changes Today", color: "text-blue-400", value: "18" }, { label: "Completed", color: "text-emerald-400", value: "14" }, { label: "Overdue", color: "text-red-400", value: "1" }],
    columns: [["Task ID", "taskid"], ["Patient Name", "patientname"], ["Wound Location", "woundlocation"], ["Dressing Type", "dressingtype"], ["Next Due", "nextdue"]],
    badge: ["Status", "status", {"Pending":"gray","Completed":"emerald","Overdue":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const locs = ['Abdomen (Surgical)', 'Left Knee', 'Sacrum', 'Right Forearm', 'Chest'];
        const types = ['Gauze & Tape', 'Hydrocolloid', 'Foam Dressing', 'Transparent Film', 'Gauze & Tape'];
        const statuses = ['Pending', 'Completed', 'Overdue', 'Completed', 'Pending'];
        return { taskid: 'DRS-' + (9001 + i), patientname: names[i], woundlocation: locs[i], dressingtype: types[i], nextdue: '14:00 PM', status: statuses[i] };
      }),
  },
  "/nurse/care/notes": {
    ui: 4,
    title: "Nursing Care Notes", description: "Routine shift notes and general patient observations.",
    stats: [{ label: "Notes Logged", color: "text-blue-400", value: "56" }, { label: "Drafts", color: "text-amber-400", value: "4" }, { label: "Signed", color: "text-emerald-400", value: "52" }],
    columns: [["Note ID", "noteid"], ["Patient Name", "patientname"], ["Note Category", "notecategory"], ["Authored By", "authoredby"], ["Time", "time"]],
    badge: ["Status", "status", {"Signed":"emerald","Draft":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const cats = ['Shift Summary', 'Behavioral', 'Dietary Intake', 'General Obs', 'Shift Summary'];
        const statuses = ['Signed', 'Signed', 'Draft', 'Signed', 'Draft'];
        return { noteid: 'NTE-' + (6001 + i), patientname: names[i], notecategory: cats[i], authoredby: 'Nurse Joy', time: '14:30', status: statuses[i] };
      }),
  },
  "/nurse/care/plan": {
    ui: 4,
    title: "Nursing Care Plans", description: "Structured, individualized plans of care and nursing diagnoses.",
    stats: [{ label: "Active Plans", color: "text-blue-400", value: "24" }, { label: "Due for Review", color: "text-amber-400", value: "3" }, { label: "Goals Met", color: "text-emerald-400", value: "12" }],
    columns: [["Plan ID", "planid"], ["Patient Name", "patientname"], ["Nursing Diagnosis", "nursingdiagnosis"], ["Interventions", "interventions"], ["Last Reviewed", "lastreviewed"]],
    badge: ["Status", "status", {"Active":"gray","Review Due":"amber","Goal Met":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const diags = ['Impaired Skin Integrity', 'Acute Pain', 'Risk for Fall', 'Ineffective Airway', 'Fluid Imbalance'];
        const inters = ['Q2H Turning', 'Analgesics PRN', 'Bed Alarm', 'Suctioning PRN', 'Strict I/O'];
        const statuses = ['Active', 'Active', 'Review Due', 'Active', 'Goal Met'];
        return { planid: 'NCP-' + (7001 + i), patientname: names[i], nursingdiagnosis: diags[i], interventions: inters[i], lastreviewed: 'Yesterday', status: statuses[i] };
      }),
  },
  "/nurse/care/progress": {
    ui: 4,
    title: "Care Progress", description: "Track patient progression against established nursing goals.",
    stats: [{ label: "Goals Tracked", color: "text-blue-400", value: "32" }, { label: "Improving", color: "text-emerald-400", value: "28" }, { label: "No Change/Declining", color: "text-amber-400", value: "4" }],
    columns: [["Record ID", "recordid"], ["Patient Name", "patientname"], ["Care Goal", "caregoal"], ["Current Progress", "currentprogress"], ["Evaluated By", "evaluatedby"]],
    badge: ["Status", "status", {"Goal Met":"emerald","Improving":"emerald","No Change":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const goals = ['Pain < 3/10', 'Ambulates 50ft', 'Clear Lung Sounds', 'Tolerates Oral Diet', 'Wound Healing'];
        const progs = ['Currently 2/10', 'Ambulates 20ft', 'Rhonchi present', 'Tolerating liquids', 'Granulation present'];
        const statuses = ['Goal Met', 'Improving', 'No Change', 'Improving', 'Improving'];
        return { recordid: 'PRG-' + (8001 + i), patientname: names[i], caregoal: goals[i], currentprogress: progs[i], evaluatedby: 'Nurse Smith', status: statuses[i] };
      }),
  },
  "/nurse/care/wound": {
    ui: 4,
    title: "Wound Care", description: "Detailed assessments of wound healing, drainage, and tissue type.",
    stats: [{ label: "Active Wounds", color: "text-blue-400", value: "15" }, { label: "Healing/Granulating", color: "text-emerald-400", value: "12" }, { label: "Infected/Slough", color: "text-red-400", value: "3" }],
    columns: [["Assessment ID", "assessmentid"], ["Patient Name", "patientname"], ["Wound Type", "woundtype"], ["Size (cm)", "sizecm"], ["Tissue Type", "tissuetype"]],
    badge: ["Status", "status", {"Healing":"gray","Needs Review":"amber","Infected":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const types = ['Surgical Incision', 'Pressure Ulcer (Stg 2)', 'Laceration', 'Diabetic Foot Ulcer', 'Surgical Incision'];
        const tissues = ['Granulation', 'Slough', 'Granulation', 'Necrotic', 'Epithelializing'];
        const statuses = ['Healing', 'Needs Review', 'Healing', 'Infected', 'Healing'];
        return { assessmentid: 'WND-' + (11001 + i), patientname: names[i], woundtype: types[i], sizecm: (2 + i) + 'x' + (1 + i), tissuetype: tissues[i], status: statuses[i] };
      }),
  },
  "/nurse/checklists/admission": {
    ui: 4,
    title: "Admission Checklist", description: "Standardized checks for incoming patient admissions.",
    stats: [{ label: "Admissions Today", color: "text-blue-400", value: "8" }, { label: "Checklists Pending", color: "text-amber-400", value: "3" }, { label: "Completed", color: "text-emerald-400", value: "5" }],
    columns: [["Checklist ID", "checklistid"], ["Patient Name", "patientname"], ["Ward", "ward"], ["Items Complete", "itemscomplete"], ["Missing Docs", "missingdocs"]],
    badge: ["Status", "status", {"Completed":"emerald","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const statuses = ['Completed', 'In Progress', 'Completed', 'In Progress', 'Completed'];
        return { checklistid: 'CHK-A-' + (1001 + i), patientname: names[i], ward: 'General', itemscomplete: '10/12', missingdocs: 'Consent Form', status: statuses[i] };
      }),
  },
  "/nurse/checklists/discharge": {
    ui: 4,
    title: "Discharge Checklist", description: "Verification of meds, belongings, and follow-up plans.",
    stats: [{ label: "Discharges Today", color: "text-blue-400", value: "12" }, { label: "Cleared", color: "text-emerald-400", value: "10" }, { label: "Pending Pharmacy", color: "text-amber-400", value: "2" }],
    columns: [["Checklist ID", "checklistid"], ["Patient Name", "patientname"], ["Cannula Out", "cannulaout"], ["Meds Given", "medsgiven"], ["Belongings Returned", "belongingsreturned"]],
    badge: ["Status", "status", {"Cleared":"emerald","Pending Meds":"amber","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const statuses = ['Cleared', 'Cleared', 'Pending Meds', 'Cleared', 'In Progress'];
        return { checklistid: 'CHK-D-' + (5001 + i), patientname: names[i], cannulaout: 'Yes', medsgiven: 'Yes', belongingsreturned: 'Yes', status: statuses[i] };
      }),
  },
  "/nurse/checklists/icu": {
    ui: 4,
    title: "ICU Transfer Checklist", description: "Critical care transfer protocols and equipment readiness.",
    stats: [{ label: "Transfers Pending", color: "text-amber-400", value: "2" }, { label: "Completed", color: "text-emerald-400", value: "3" }, { label: "Equipment Issues", color: "text-emerald-400", value: "0" }],
    columns: [["Checklist ID", "checklistid"], ["Patient Name", "patientname"], ["From Ward", "fromward"], ["Bed Prepared", "bedprepared"], ["Ventilator Ready", "ventilatorready"]],
    badge: ["Status", "status", {"Ready":"emerald","Preparing":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const statuses = ['Ready', 'Ready', 'Preparing', 'Ready', 'Preparing'];
        return { checklistid: 'CHK-I-' + (4001 + i), patientname: names[i], fromward: 'Ward A', bedprepared: 'Yes', ventilatorready: 'Yes', status: statuses[i] };
      }),
  },
  "/nurse/checklists/infection": {
    ui: 4,
    title: "Infection Control Checks", description: "Isolation protocols, hygiene audits, and PPE compliance.",
    stats: [{ label: "Isolation Rooms", color: "text-amber-400", value: "4" }, { label: "Audits Passed", color: "text-emerald-400", value: "4/4" }, { label: "Violations", color: "text-emerald-400", value: "0" }],
    columns: [["Audit ID", "auditid"], ["Ward/Room", "wardroom"], ["Isolation Type", "isolationtype"], ["Signage Posted", "signageposted"], ["PPE Available", "ppeavailable"]],
    badge: ["Status", "status", {"Compliant":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const rooms = ['Iso-1', 'Iso-2', 'Iso-3', 'Ward-A (Gen)', 'Ward-B (Gen)'];
        const types = ['Contact', 'Airborne', 'Droplet', 'Standard', 'Standard'];
        const statuses = ['Compliant', 'Compliant', 'Compliant', 'Compliant', 'Compliant'];
        return { auditid: 'INF-' + (6001 + i), wardroom: rooms[i], isolationtype: types[i], signageposted: 'Yes', ppeavailable: 'Adequate', status: statuses[i] };
      }),
  },
  "/nurse/checklists/ot": {
    ui: 4,
    title: "Pre-Op / OT Checklist", description: "Preparation checklist before transferring patient to the OR.",
    stats: [{ label: "Surgeries Today", color: "text-blue-400", value: "6" }, { label: "Cleared for OT", color: "text-emerald-400", value: "4" }, { label: "Prep Pending", color: "text-amber-400", value: "2" }],
    columns: [["Checklist ID", "checklistid"], ["Patient Name", "patientname"], ["Surgery", "surgery"], ["Consent Signed", "consentsigned"], ["NPO Status", "npostatus"]],
    badge: ["Status", "status", {"Cleared":"emerald","Prep Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const statuses = ['Cleared', 'Prep Pending', 'Cleared', 'Cleared', 'Prep Pending'];
        return { checklistid: 'CHK-O-' + (3001 + i), patientname: names[i], surgery: 'Appendectomy', consentsigned: 'Yes', npostatus: 'Confirmed >8h', status: statuses[i] };
      }),
  },
  "/nurse/checklists/shift": {
    ui: 4,
    title: "Shift Checklist", description: "Start/End of shift responsibilities and equipment checks.",
    stats: [{ label: "Shift Checks Done", color: "text-emerald-400", value: "22" }, { label: "Pending", color: "text-amber-400", value: "2" }, { label: "Discrepancies", color: "text-gray-400", value: "0" }],
    columns: [["Checklist ID", "checklistid"], ["Nurse Name", "nursename"], ["Shift", "shift"], ["Crash Cart Checked", "crashcartchecked"], ["Narcotics Counted", "narcoticscounted"]],
    badge: ["Status", "status", {"Verified":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Verified', 'Verified', 'Pending', 'Verified', 'Verified'];
        return { checklistid: 'CHK-S-' + (2001 + i), nursename: 'Nurse Joy', shift: 'Morning', crashcartchecked: 'Yes', narcoticscounted: 'Match', status: statuses[i] };
      }),
  },
  "/nurse/communication/doctor": {
    ui: 4,
    title: "Doctor Comm Log", description: "Tracking calls and pages made to physicians.",
    stats: [{ label: "Calls Made", color: "text-blue-400", value: "15" }, { label: "Avg Response", color: "text-emerald-400", value: "8 mins" }, { label: "Awaiting Call Back", color: "text-amber-400", value: "2" }],
    columns: [["Comm ID", "commid"], ["Doctor Name", "doctorname"], ["Regarding Patient", "regardingpatient"], ["Reason for Call", "reasonforcall"], ["Response Time", "responsetime"]],
    badge: ["Status", "status", {"Resolved":"emerald","Awaiting Callback":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const docs = ['Dr. Grey', 'Dr. Shepherd', 'Dr. Sloan', 'Dr. Jenkins', 'Dr. House'];
        const statuses = ['Resolved', 'Resolved', 'Awaiting Callback', 'Resolved', 'Resolved'];
        return { commid: 'CAL-' + (1001 + i), doctorname: docs[i], regardingpatient: 'Ward Bed ' + (1 + i), reasonforcall: 'Abnormal Labs', responsetime: '5 mins', status: statuses[i] };
      }),
  },
  "/nurse/communication/handover": {
    ui: 4,
    title: "Inter-Department Comm", description: "Communication logs between nursing and pharmacy, lab, etc.",
    stats: [{ label: "Inter-Dept Comms", color: "text-blue-400", value: "12" }, { label: "Pharmacy Issues", color: "text-amber-400", value: "3" }, { label: "Resolved", color: "text-emerald-400", value: "10" }],
    columns: [["Comm ID", "commid"], ["Department", "department"], ["Contact Person", "contactperson"], ["Reason", "reason"], ["Resolution", "resolution"]],
    badge: ["Status", "status", {"Resolved":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Pharmacy', 'Laboratory', 'Radiology', 'Dietary', 'Pharmacy'];
        const statuses = ['Resolved', 'Resolved', 'Pending', 'Resolved', 'Pending'];
        return { commid: 'IDC-' + (3001 + i), department: depts[i], contactperson: 'Pharmacist Desk', reason: 'Missing Meds', resolution: 'Dispensed', status: statuses[i] };
      }),
  },
  "/nurse/communication/messages": {
    ui: 4,
    title: "Internal Messages", description: "Secure text and broadcast messages with other ward staff.",
    stats: [{ label: "Unread Messages", color: "text-amber-400", value: "4" }, { label: "Sent Today", color: "text-blue-400", value: "24" }, { label: "Broadcasts", color: "text-gray-400", value: "1" }],
    columns: [["Msg ID", "msgid"], ["From", "from"], ["To/Group", "togroup"], ["Subject", "subject"], ["Time", "time"]],
    badge: ["Status", "status", {"Unread":"amber","Read":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Unread', 'Read', 'Read', 'Unread', 'Read'];
        return { msgid: 'MSG-' + (2001 + i), from: 'Charge Nurse', togroup: 'All Ward Nurses', subject: 'Bed Availability Update', time: '10:00 AM', status: statuses[i] };
      }),
  },
  "/nurse/documentation/assessment": {
    ui: 4,
    title: "Nursing Assessments", description: "Comprehensive admission and shift-based patient assessments.",
    stats: [{ label: "Assessments Logged", color: "text-blue-400", value: "34" }, { label: "Pending Review", color: "text-amber-400", value: "4" }, { label: "Signed", color: "text-emerald-400", value: "30" }],
    columns: [["Doc ID", "docid"], ["Patient Name", "patientname"], ["Assessment Type", "assessmenttype"], ["System Reviewed", "systemreviewed"], ["Authored By", "authoredby"]],
    badge: ["Status", "status", {"Signed":"emerald","Draft":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const statuses = ['Signed', 'Signed', 'Draft', 'Signed', 'Signed'];
        return { docid: 'DOC-A-' + (1001 + i), patientname: names[i], assessmenttype: 'Initial Shift', systemreviewed: 'Neurological', authoredby: 'Nurse Joy', status: statuses[i] };
      }),
  },
  "/nurse/documentation/care-plan": {
    ui: 4,
    title: "Care Plan Updates", description: "Documentation of revisions to nursing care plans.",
    stats: [{ label: "Plans Updated", color: "text-blue-400", value: "12" }, { label: "Approved", color: "text-emerald-400", value: "10" }, { label: "Pending Approval", color: "text-amber-400", value: "2" }],
    columns: [["Update ID", "updateid"], ["Patient Name", "patientname"], ["Plan ID", "planid"], ["Change Reason", "changereason"], ["Updated By", "updatedby"]],
    badge: ["Status", "status", {"Approved":"emerald","Pending Auth":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const statuses = ['Approved', 'Pending Auth', 'Approved', 'Approved', 'Approved'];
        return { updateid: 'CPL-' + (2001 + i), patientname: names[i], planid: 'NCP-' + (7000 + i), changereason: 'Change in condition', updatedby: 'Nurse Smith', status: statuses[i] };
      }),
  },
  "/nurse/documentation/handover": {
    ui: 4,
    title: "Handover Documentation", description: "Formal SBAR (Situation-Background-Assessment-Recommendation) records.",
    stats: [{ label: "Handovers Logged", color: "text-blue-400", value: "22" }, { label: "Acknowledged", color: "text-emerald-400", value: "20" }, { label: "Incomplete", color: "text-amber-400", value: "2" }],
    columns: [["SBAR ID", "sbarid"], ["Patient Name", "patientname"], ["To Shift", "toshift"], ["Receiving Nurse", "receivingnurse"], ["Time", "time"]],
    badge: ["Status", "status", {"Acknowledged":"emerald","Pending Ack":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const statuses = ['Acknowledged', 'Acknowledged', 'Pending Ack', 'Acknowledged', 'Acknowledged'];
        return { sbarid: 'SBR-' + (3001 + i), patientname: names[i], toshift: 'Evening', receivingnurse: 'Nurse Chapel', time: '14:00', status: statuses[i] };
      }),
  },
  "/nurse/documentation/incident": {
    ui: 4,
    title: "Incident Reports", description: "Documentation of adverse events, falls, or medication errors.",
    stats: [{ label: "Incidents Today", color: "text-amber-400", value: "1" }, { label: "Under Investigation", color: "text-blue-400", value: "1" }, { label: "Closed", color: "text-emerald-400", value: "5 (Monthly)" }],
    columns: [["Incident ID", "incidentid"], ["Patient/Staff Involved", "patientstaffinvolved"], ["Event Type", "eventtype"], ["Severity", "severity"], ["Reported By", "reportedby"]],
    badge: ["Status", "status", {"Investigating":"amber","Closed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const types = ['Patient Fall', 'Med Error (Near Miss)', 'Equipment Failure', 'Patient Fall', 'Aggressive Behavior'];
        const statuses = ['Investigating', 'Closed', 'Closed', 'Investigating', 'Closed'];
        return { incidentid: 'INC-' + (4001 + i), patientstaffinvolved: names[i], eventtype: types[i], severity: 'Low', reportedby: 'Nurse Joy', status: statuses[i] };
      }),
  },
  "/nurse/education/diet": {
    ui: 4,
    title: "Dietary Education", description: "Patient and family education regarding therapeutic diets.",
    stats: [{ label: "Sessions Today", color: "text-blue-400", value: "12" }, { label: "Diabetic Diets", color: "text-amber-400", value: "5" }, { label: "Completed", color: "text-emerald-400", value: "10" }],
    columns: [["Edu ID", "eduid"], ["Patient Name", "patientname"], ["Diet Type", "diettype"], ["Educated By", "educatedby"], ["Understanding", "understanding"]],
    badge: ["Status", "status", {"Completed":"emerald","Pending":"amber","Follow-up Needed":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const diets = ['Diabetic', 'Low Sodium', 'Renal', 'Clear Liquid', 'Diabetic'];
        const statuses = ['Completed', 'Completed', 'Pending', 'Completed', 'Follow-up Needed'];
        return { eduid: 'EDU-D-' + (1001 + i), patientname: names[i], diettype: diets[i], educatedby: 'Nurse Joy', understanding: 'Good', status: statuses[i] };
      }),
  },
  "/nurse/education/discharge": {
    ui: 4,
    title: "Discharge Education", description: "Final checklist of educational needs prior to patient discharge.",
    stats: [{ label: "Pending Discharges", color: "text-amber-400", value: "8" }, { label: "Cleared", color: "text-emerald-400", value: "6" }, { label: "Refusals", color: "text-gray-400", value: "0" }],
    columns: [["Edu ID", "eduid"], ["Patient Name", "patientname"], ["Topic Covered", "topiccovered"], ["Family Present", "familypresent"], ["Time Spent", "timespent"]],
    badge: ["Status", "status", {"Cleared":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const statuses = ['Cleared', 'Pending', 'Cleared', 'Cleared', 'Pending'];
        return { eduid: 'EDU-X-' + (3001 + i), patientname: names[i], topiccovered: 'Wound Care & Meds', familypresent: 'Yes', timespent: '15 mins', status: statuses[i] };
      }),
  },
  "/nurse/education/home-care": {
    ui: 4,
    title: "Home Care Training", description: "Specialized training for devices (e.g. ostomies, catheters) at home.",
    stats: [{ label: "Trainings Required", color: "text-blue-400", value: "5" }, { label: "Competent", color: "text-emerald-400", value: "3" }, { label: "Needs Review", color: "text-amber-400", value: "2" }],
    columns: [["Edu ID", "eduid"], ["Patient Name", "patientname"], ["Device/Skill", "deviceskill"], ["Demonstration", "demonstration"], ["Return Demo", "returndemo"]],
    badge: ["Status", "status", {"Competent":"emerald","Needs Review":"amber","Pending Demo":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const skills = ['Ostomy Care', 'Foley Care', 'Drain Mgmt', 'Insulin Injection', 'Trach Care'];
        const statuses = ['Competent', 'Needs Review', 'Competent', 'Competent', 'Pending Demo'];
        return { eduid: 'EDU-H-' + (4001 + i), patientname: names[i], deviceskill: skills[i], demonstration: 'Done', returndemo: 'Pending', status: statuses[i] };
      }),
  },
  "/nurse/education/medication": {
    ui: 4,
    title: "Medication Education", description: "Counseling on new prescriptions and medication adherence.",
    stats: [{ label: "Sessions Today", color: "text-blue-400", value: "18" }, { label: "Inhaler Technique", color: "text-amber-400", value: "4" }, { label: "Completed", color: "text-emerald-400", value: "16" }],
    columns: [["Edu ID", "eduid"], ["Patient Name", "patientname"], ["Medication Class", "medicationclass"], ["Educated By", "educatedby"], ["Handouts Given", "handoutsgiven"]],
    badge: ["Status", "status", {"Completed":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const meds = ['Insulin', 'Inhalers', 'Anticoagulants', 'Antibiotics', 'Insulin'];
        const statuses = ['Completed', 'Completed', 'Pending', 'Completed', 'Completed'];
        return { eduid: 'EDU-M-' + (2001 + i), patientname: names[i], medicationclass: meds[i], educatedby: 'Nurse Smith', handoutsgiven: 'Yes', status: statuses[i] };
      }),
  },
  "/nurse/emergency/code-blue": {
    ui: 4,
    title: "Code Blue Log", description: "Documentation of cardiac/respiratory arrest events.",
    stats: [{ label: "Codes This Month", color: "text-blue-400", value: "4" }, { label: "ROSC Achieved", color: "text-emerald-400", value: "3" }, { label: "Active Codes", color: "text-emerald-400", value: "0" }],
    columns: [["Code ID", "codeid"], ["Patient Name", "patientname"], ["Location", "location"], ["Code Start", "codestart"], ["Code End", "codeend"]],
    badge: ["Status", "status", {"ROSC":"emerald","Deceased":"gray","Active Code":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Brown', 'Emily Davis'];
        const locs = ['ER Resus', 'ICU-3', 'General Ward', 'ICU-1', 'ER Triage'];
        const statuses = ['ROSC', 'Deceased', 'ROSC', 'ROSC', 'Active Code'];
        return { codeid: 'CDB-' + (2001 + i), patientname: names[i], location: locs[i], codestart: '14:20', codeend: '14:45', status: statuses[i] };
      }),
  },
  "/nurse/emergency/cpr": {
    ui: 4,
    title: "CPR/Resus Records", description: "Detailed logs of compressions, shocks, and meds during a code.",
    stats: [{ label: "Records Pending Sign", color: "text-amber-400", value: "1" }, { label: "Signed", color: "text-emerald-400", value: "14" }, { label: "Audited", color: "text-blue-400", value: "10" }],
    columns: [["Record ID", "recordid"], ["Code ID", "codeid"], ["Recorder", "recorder"], ["Total Shocks", "totalshocks"], ["Epinephrine Given", "epinephrinegiven"]],
    badge: ["Status", "status", {"Signed":"emerald","Pending Sign":"gray","Audited":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Signed', 'Pending Sign', 'Signed', 'Audited', 'Signed'];
        return { recordid: 'CPR-' + (3001 + i), codeid: 'CDB-' + (2000 + i), recorder: 'Nurse Joy', totalshocks: (1 + i), epinephrinegiven: (2 + i) + ' doses', status: statuses[i] };
      }),
  },
  "/nurse/emergency/medication": {
    ui: 4,
    title: "ER Crash Cart/Meds", description: "Usage logs and inventory checks for emergency medications.",
    stats: [{ label: "Carts Checked", color: "text-emerald-400", value: "5/5" }, { label: "Restock Required", color: "text-amber-400", value: "1" }, { label: "Expired Items", color: "text-emerald-400", value: "0" }],
    columns: [["Check ID", "checkid"], ["Cart Location", "cartlocation"], ["Checked By", "checkedby"], ["Missing/Used Items", "missinguseditems"], ["Last Checked", "lastchecked"]],
    badge: ["Status", "status", {"Secure":"emerald","Restock Required":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const locs = ['ER Main', 'ER Trauma', 'ICU 1', 'ICU 2', 'Ward A'];
        const miss = ['None', 'Epinephrine (2)', 'None', 'None', 'Defib Pads'];
        const statuses = ['Secure', 'Restock Required', 'Secure', 'Secure', 'Restock Required'];
        return { checkid: 'CRT-' + (4001 + i), cartlocation: locs[i], checkedby: 'Nurse Smith', missinguseditems: miss[i], lastchecked: '07:00 AM', status: statuses[i] };
      }),
  },
  "/nurse/emergency/patients": {
    ui: 4,
    title: "ER Patients (Nurse View)", description: "Triage queue and active ER patients requiring nursing care.",
    stats: [{ label: "My ER Patients", color: "text-blue-400", value: "6" }, { label: "Critical (Red)", color: "text-red-500", value: "1" }, { label: "Waiting Triage", color: "text-amber-400", value: "3" }],
    columns: [["ER ID", "erid"], ["Patient Name", "patientname"], ["Triage Priority", "triagepriority"], ["Assigned Bed", "assignedbed"], ["Primary Complaint", "primarycomplaint"]],
    badge: ["Status", "status", {"Resuscitation":"amber","Stable":"emerald","Stabilizing":"red","Waiting":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const pris = ['Level 1', 'Level 3', 'Level 2', 'Level 4', 'Level 3'];
        const beds = ['Resus-1', 'Bed-4', 'Bed-2', 'Waiting Room', 'Bed-6'];
        const statuses = ['Resuscitation', 'Stable', 'Stabilizing', 'Waiting', 'Stable'];
        return { erid: 'ER-' + (1001 + i), patientname: names[i], triagepriority: pris[i], assignedbed: beds[i], primarycomplaint: 'Trauma/Chest Pain', status: statuses[i] };
      }),
  },
  "/nurse/icu/central-line": {
    ui: 4,
    title: "Central Line Care", description: "Central Venous Catheter (CVC) insertion logs and site care.",
    stats: [{ label: "Active Lines", color: "text-blue-400", value: "8" }, { label: "Dressing Due", color: "text-amber-400", value: "2" }, { label: "CLABSI Risk", color: "text-emerald-400", value: "0" }],
    columns: [["Line ID", "lineid"], ["Patient Name", "patientname"], ["Line Type", "linetype"], ["Insertion Site", "insertionsite"], ["Days In Situ", "daysinsitu"]],
    badge: ["Status", "status", {"Active":"emerald","Dressing Due":"amber","Remove Today":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const types = ['CVC', 'PICC', 'Arterial Line', 'CVC', 'PICC'];
        const statuses = ['Active', 'Active', 'Dressing Due', 'Active', 'Remove Today'];
        return { lineid: 'CLN-' + (1001 + i), patientname: names[i], linetype: types[i], insertionsite: 'Rt Subclavian', daysinsitu: (2 + i) + ' Days', status: statuses[i] };
      }),
  },
  "/nurse/icu/dialysis": {
    ui: 4,
    title: "Dialysis Monitoring", description: "CRRT/Hemodialysis session monitoring and fluid tracking.",
    stats: [{ label: "Active Sessions", color: "text-blue-400", value: "2" }, { label: "Completed", color: "text-emerald-400", value: "3" }, { label: "Alarms", color: "text-gray-400", value: "0" }],
    columns: [["Session ID", "sessionid"], ["Patient Name", "patientname"], ["Modality", "modality"], ["Blood Flow (Qb)", "bloodflowqb"], ["Fluid Removal", "fluidremoval"]],
    badge: ["Status", "status", {"Running":"emerald","Completed":"emerald","Paused":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const modes = ['CRRT', 'SLED', 'CRRT', 'HD', 'CRRT'];
        const statuses = ['Running', 'Running', 'Completed', 'Completed', 'Paused'];
        return { sessionid: 'DYL-' + (2001 + i), patientname: names[i], modality: modes[i], bloodflowqb: '150 ml/min', fluidremoval: '50 ml/hr', status: statuses[i] };
      }),
  },
  "/nurse/icu/monitoring": {
    ui: 4,
    title: "ICU Flowsheet", description: "Intensive hour-by-hour monitoring logs for critical patients.",
    stats: [{ label: "ICU Patients", color: "text-blue-400", value: "4" }, { label: "Flowsheets Active", color: "text-emerald-400", value: "4" }, { label: "Missed Hourly Check", color: "text-emerald-400", value: "0" }],
    columns: [["Flowsheet ID", "flowsheetid"], ["Patient Name", "patientname"], ["Bed", "bed"], ["Hemodynamics", "hemodynamics"], ["Neuro (GCS)", "neurogcs"]],
    badge: ["Status", "status", {"Stable":"emerald","Critical":"amber","Monitoring":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const hemo = ['MAP 75', 'MAP 60 (Low)', 'MAP 80', 'MAP 90', 'MAP 70'];
        const statuses = ['Stable', 'Critical', 'Stable', 'Stable', 'Monitoring'];
        return { flowsheetid: 'ICU-' + (1001 + i), patientname: names[i], bed: 'ICU-' + (1 + i), hemodynamics: hemo[i], neurogcs: '14', status: statuses[i] };
      }),
  },
  "/nurse/icu/ventilator": {
    ui: 4,
    title: "Ventilator Checks", description: "Routine checks of ventilator settings, alarms, and patient tolerance.",
    stats: [{ label: "Vented Patients", color: "text-blue-400", value: "3" }, { label: "Weaning Trials", color: "text-amber-400", value: "1" }, { label: "Checks Overdue", color: "text-emerald-400", value: "0" }],
    columns: [["Check ID", "checkid"], ["Patient Name", "patientname"], ["Mode", "mode"], ["FiO2 / PEEP", "fio2peep"], ["Tidal Volume", "tidalvolume"]],
    badge: ["Status", "status", {"Tolerating":"emerald","Sedated":"gray","Weaning":"gray","Extubated":"emerald","Desaturating":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const modes = ['SIMV', 'ACVC', 'CPAP (Weaning)', 'Off Vent', 'ACVC'];
        const sets = ['40% / 5', '50% / 8', '30% / 5', 'N/A', '60% / 10'];
        const statuses = ['Tolerating', 'Sedated', 'Weaning', 'Extubated', 'Desaturating'];
        return { checkid: 'VNT-' + (2001 + i), patientname: names[i], mode: modes[i], fio2peep: sets[i], tidalvolume: '450ml', status: statuses[i] };
      }),
  },
  "/nurse/medication/blood": {
    ui: 4,
    title: "Blood Transfusions", description: "Specialized log for monitoring blood product transfusions.",
    stats: [{ label: "Active Transfusions", color: "text-blue-400", value: "2" }, { label: "Reactions", color: "text-emerald-400", value: "0" }, { label: "Completed", color: "text-emerald-400", value: "4" }],
    columns: [["Transfusion ID", "transfusionid"], ["Patient Name", "patientname"], ["Product/Group", "productgroup"], ["Start Time", "starttime"], ["Vitals Checked", "vitalschecked"]],
    badge: ["Status", "status", {"Running":"amber","Completed":"emerald","Awaiting Blood":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const statuses = ['Running', 'Completed', 'Awaiting Blood', 'Running', 'Completed'];
        return { transfusionid: 'BLD-' + (20001 + i), patientname: names[i], productgroup: 'PRBC / O+', starttime: '12:00 PM', vitalschecked: 'Q15M', status: statuses[i] };
      }),
  },
  "/nurse/medication/history": {
    ui: 4,
    title: "Medication History", description: "Comprehensive record of all administered medications.",
    stats: [{ label: "Logs Today", color: "text-blue-400", value: "450" }, { label: "Dispense Errors", color: "text-emerald-400", value: "0" }, { label: "PRN Total", color: "text-gray-400", value: "24" }],
    columns: [["Log ID", "logid"], ["Patient Name", "patientname"], ["Medication", "medication"], ["Dose Given", "dosegiven"], ["Time", "time"]],
    badge: ["Status", "status", {"Administered":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const statuses = ['Administered', 'Administered', 'Administered', 'Administered', 'Administered'];
        return { logid: 'MHX-' + (30001 + i), patientname: names[i], medication: 'Paracetamol', dosegiven: '500mg', time: '08:00 AM', status: statuses[i] };
      }),
  },
  "/nurse/medication/injections": {
    ui: 4,
    title: "Injection Log", description: "Track IM, SC, and specialized injections.",
    stats: [{ label: "Injections Today", color: "text-blue-400", value: "32" }, { label: "Insulin", color: "text-amber-400", value: "12" }, { label: "Vaccines", color: "text-emerald-400", value: "5" }],
    columns: [["Log ID", "logid"], ["Patient Name", "patientname"], ["Injection Name", "injectionname"], ["Site", "site"], ["Administered By", "administeredby"]],
    badge: ["Status", "status", {"Given":"emerald","Scheduled":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const statuses = ['Given', 'Given', 'Scheduled', 'Given', 'Given'];
        return { logid: 'INJ-' + (10001 + i), patientname: names[i], injectionname: 'Insulin Aspart', site: 'Abdomen', administeredby: 'Nurse Joy', status: statuses[i] };
      }),
  },
  "/nurse/medication/iv-fluids": {
    ui: 4,
    title: "IV Fluids Tracking", description: "Manage IV drips, flow rates, and volume infused.",
    stats: [{ label: "Active Drips", color: "text-blue-400", value: "8" }, { label: "Completing Soon", color: "text-amber-400", value: "2" }, { label: "Completed", color: "text-emerald-400", value: "12" }],
    columns: [["IV ID", "ivid"], ["Patient Name", "patientname"], ["Fluid Type", "fluidtype"], ["Rate (ml/hr)", "ratemlhr"], ["Vol Infused", "volinfused"]],
    badge: ["Status", "status", {"Running":"amber","Completed":"emerald","Paused":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const statuses = ['Running', 'Completed', 'Running', 'Paused', 'Running'];
        return { ivid: 'IV-' + (9001 + i), patientname: names[i], fluidtype: 'Normal Saline 0.9%', ratemlhr: '100', volinfused: '450/1000', status: statuses[i] };
      }),
  },
  "/nurse/medication/mar": {
    ui: 4,
    title: "MAR Sheet", description: "Medication Administration Record for detailed logging.",
    stats: [{ label: "Active MARs", color: "text-blue-400", value: "24" }, { label: "PRN Meds Given", color: "text-amber-400", value: "4" }, { label: "Signatures Pending", color: "text-red-400", value: "2" }],
    columns: [["MAR ID", "marid"], ["Patient Name", "patientname"], ["Drug Name", "drugname"], ["Dose/Freq", "dosefreq"], ["Last Given", "lastgiven"]],
    badge: ["Status", "status", {"Active":"emerald","Discontinued":"gray","Sign Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const statuses = ['Active', 'Active', 'Discontinued', 'Active', 'Sign Pending'];
        return { marid: 'MAR-' + (8001 + i), patientname: names[i], drugname: 'Lisinopril', dosefreq: '10mg OD', lastgiven: '08:00 AM', status: statuses[i] };
      }),
  },
  "/nurse/medication/missed": {
    ui: 4,
    title: "Missed Medications", description: "Log and review medications missed or refused by patients.",
    stats: [{ label: "Missed Today", color: "text-red-400", value: "3" }, { label: "Refused by Patient", color: "text-amber-400", value: "2" }, { label: "Doctor Notified", color: "text-emerald-400", value: "3" }],
    columns: [["Log ID", "logid"], ["Patient Name", "patientname"], ["Medication", "medication"], ["Scheduled Time", "scheduledtime"], ["Reason", "reason"]],
    badge: ["Status", "status", {"Notified":"emerald","Rescheduled":"amber","Pending Stock":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const reasons = ['Patient Refused', 'NPO Status', 'Patient Sleeping', 'Stock Unavailable', 'Patient Refused'];
        const statuses = ['Notified', 'Notified', 'Rescheduled', 'Pending Stock', 'Notified'];
        return { logid: 'MSD-' + (40001 + i), patientname: names[i], medication: 'Vitamins', scheduledtime: '09:00 AM', reason: reasons[i], status: statuses[i] };
      }),
  },
  "/nurse/medication/schedule": {
    ui: 4,
    title: "Medication Schedule", description: "Upcoming medication rounds and timings.",
    stats: [{ label: "Meds Due Next Hour", color: "text-amber-400", value: "12" }, { label: "Administered Today", color: "text-emerald-400", value: "84" }, { label: "Overdue", color: "text-emerald-400", value: "0" }],
    columns: [["Task ID", "taskid"], ["Time Due", "timedue"], ["Patient Name", "patientname"], ["Medication", "medication"], ["Route", "route"]],
    badge: ["Status", "status", {"Due":"amber","Administered":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const meds = ['Amoxicillin', 'Paracetamol', 'IV Fluids', 'Insulin', 'Aspirin'];
        const statuses = ['Due', 'Administered', 'Due', 'Due', 'Administered'];
        return { taskid: 'MED-' + (7001 + i), timedue: '14:00', patientname: names[i], medication: meds[i], route: 'Oral', status: statuses[i] };
      }),
  },
  "/nurse/monitoring/fall-risk": {
    ui: 4,
    title: "Fall Risk Assessments", description: "Evaluate and log patient fall risks (e.g., Morse Fall Scale).",
    stats: [{ label: "Patients Assessed", color: "text-blue-400", value: "22" }, { label: "High Fall Risk", color: "text-red-400", value: "4" }, { label: "Bed Alarms Active", color: "text-amber-400", value: "3" }],
    columns: [["Eval ID", "evalid"], ["Patient Name", "patientname"], ["Scale Used", "scaleused"], ["Score", "score"], ["Precautions", "precautions"]],
    badge: ["Status", "status", {"Active":"emerald","Standard":"emerald","Monitor":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const scores = ['45 (High)', '10 (Low)', '50 (High)', '0 (Low)', '25 (Medium)'];
        const statuses = ['Active', 'Standard', 'Active', 'Standard', 'Monitor'];
        return { evalid: 'FAL-' + (5001 + i), patientname: names[i], scaleused: 'Morse', score: scores[i], precautions: 'Bed Rails Up', status: statuses[i] };
      }),
  },
  "/nurse/monitoring/gcs": {
    ui: 4,
    title: "GCS Tracking", description: "Glasgow Coma Scale monitoring for neurological patients.",
    stats: [{ label: "GCS Tracked", color: "text-blue-400", value: "5" }, { label: "Deteriorating", color: "text-red-400", value: "1" }, { label: "Stable", color: "text-emerald-400", value: "4" }],
    columns: [["Eval ID", "evalid"], ["Patient Name", "patientname"], ["Eye (E)", "eyee"], ["Verbal (V)", "verbalv"], ["Motor (M)", "motorm"], ["Total Score / Status", "totalscorestatus"]],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const e = ['4', '3', '4', '1', '4'];
        const v = ['5', '4', '5', '1', '5'];
        const m = ['6', '5', '6', '1', '6'];
        const statuses = ['15 (Normal)', '12 (Mild)', '15 (Normal)', '3 (Severe)', '15 (Normal)'];
        return { evalid: 'GCS-' + (3001 + i), patientname: names[i], eyee: e[i], verbalv: v[i], motorm: m[i], totalscorestatus: statuses[i] };
      }),
  },
  "/nurse/monitoring/io": {
    ui: 4,
    title: "Intake/Output (I/O)", description: "Track patient fluid balance, intake, and output volumes.",
    stats: [{ label: "Patients Tracked", color: "text-blue-400", value: "12" }, { label: "Negative Balance", color: "text-amber-400", value: "2" }, { label: "Target Met", color: "text-emerald-400", value: "10" }],
    columns: [["I/O ID", "ioid"], ["Patient Name", "patientname"], ["Shift", "shift"], ["Total Intake (ml)", "totalintakeml"], ["Total Output (ml)", "totaloutputml"]],
    badge: ["Status", "status", {"Balanced":"emerald","Monitor closely":"amber","Fluid Retention":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const ins = ['1500', '1200', '800', '2000', '1000'];
        const outs = ['1400', '1300', '600', '1950', '400'];
        const statuses = ['Balanced', 'Balanced', 'Monitor closely', 'Balanced', 'Fluid Retention'];
        return { ioid: 'IO-' + (1001 + i), patientname: names[i], shift: 'Morning', totalintakeml: ins[i], totaloutputml: outs[i], status: statuses[i] };
      }),
  },
  "/nurse/monitoring/pressure-ulcer": {
    ui: 4,
    title: "Pressure Ulcer Risk", description: "Skin assessments and Braden Scale for pressure ulcers.",
    stats: [{ label: "High Risk Patients", color: "text-red-400", value: "3" }, { label: "Turning Schedule Active", color: "text-amber-400", value: "5" }, { label: "Intact Skin", color: "text-emerald-400", value: "18" }],
    columns: [["Eval ID", "evalid"], ["Patient Name", "patientname"], ["Braden Score", "bradenscore"], ["Skin Integrity", "skinintegrity"], ["Intervention", "intervention"]],
    badge: ["Status", "status", {"Active":"emerald","Normal":"emerald","Critical":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const scores = ['12 (High)', '18 (Low)', '16 (Low)', '10 (Sev Risk)', '19 (No Risk)'];
        const statuses = ['Active', 'Normal', 'Normal', 'Critical', 'Normal'];
        return { evalid: 'PUC-' + (6001 + i), patientname: names[i], bradenscore: scores[i], skinintegrity: 'Intact', intervention: 'Q2H Turns', status: statuses[i] };
      }),
  },
  "/nurse/monitoring/vitals": {
    ui: 4,
    title: "Vitals Log", description: "Record and track routine vital signs for assigned patients.",
    stats: [{ label: "Vitals Logged Today", color: "text-blue-400", value: "45" }, { label: "Overdue Logs", color: "text-red-400", value: "2" }, { label: "Abnormal", color: "text-amber-400", value: "1" }],
    columns: [["Record ID", "recordid"], ["Patient Name", "patientname"], ["Time Logged", "timelogged"], ["BP (mmHg)", "bpmmhg"], ["HR / Temp", "hrtemp"]],
    badge: ["Status", "status", {"Normal":"emerald","Elevated":"amber","Overdue":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const statuses = ['Normal', 'Elevated', 'Normal', 'Normal', 'Overdue'];
        return { recordid: 'VIT-' + (8001 + i), patientname: names[i], timelogged: '10:00 AM', bpmmhg: '120/80', hrtemp: '72 bpm / 98.6F', status: statuses[i] };
      }),
  },
  "/nurse/orders/completed": {
    ui: 4,
    title: "Completed Orders", description: "Log of fully executed and resulted physician orders.",
    stats: [{ label: "Completed Today", color: "text-blue-400", value: "84" }, { label: "Medications", color: "text-emerald-400", value: "45" }, { label: "Lab/Tests", color: "text-emerald-400", value: "39" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Order Type", "ordertype"], ["Executed By", "executedby"], ["Time Completed", "timecompleted"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const types = ['X-Ray Chest', 'IV Antibiotics', 'Diet Change', 'Blood Transfusion', 'Catheter Removal'];
        const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Completed'];
        return { orderid: 'ORD-' + (3001 + i), patientname: names[i], ordertype: types[i], executedby: 'Nurse Smith', timecompleted: 'Today 09:00 AM', status: statuses[i] };
      }),
  },
  "/nurse/orders/new": {
    ui: 4,
    title: "New Medical Orders", description: "Recently placed physician orders requiring acknowledgment.",
    stats: [{ label: "Unacknowledged", color: "text-amber-400", value: "8" }, { label: "Stat Orders", color: "text-red-400", value: "2" }, { label: "Acknowledged Today", color: "text-emerald-400", value: "45" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Ordered By", "orderedby"], ["Order Type", "ordertype"], ["Time Placed", "timeplaced"]],
    badge: ["Status", "status", {"Pending Ack":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const docs = ['Dr. Grey', 'Dr. Shepherd', 'Dr. Sloan', 'Dr. Jenkins', 'Dr. House'];
        const types = ['Lab (CBC)', 'Medication (IV)', 'Radiology (X-Ray)', 'Diet Change', 'Physiotherapy'];
        const statuses = ['Pending Ack', 'Pending Ack', 'Pending Ack', 'Pending Ack', 'Pending Ack'];
        return { orderid: 'ORD-' + (1001 + i), patientname: names[i], orderedby: docs[i], ordertype: types[i], timeplaced: '10 mins ago', status: statuses[i] };
      }),
  },
  "/nurse/orders/pending": {
    ui: 4,
    title: "Pending Orders", description: "Orders acknowledged but awaiting execution or results.",
    stats: [{ label: "Pending Execution", color: "text-amber-400", value: "12" }, { label: "Awaiting Results", color: "text-blue-400", value: "8" }, { label: "Overdue", color: "text-emerald-400", value: "0" }],
    columns: [["Order ID", "orderid"], ["Patient Name", "patientname"], ["Order Type", "ordertype"], ["Execution Due", "executiondue"], ["Assigned To", "assignedto"]],
    badge: ["Status", "status", {"Pending Execution":"gray","In Progress":"gray","Awaiting Result":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const types = ['Blood Draw', 'Med Administration', 'ECG', 'Sputum Collection', 'Wound Swab'];
        const statuses = ['Pending Execution', 'In Progress', 'Awaiting Result', 'Pending Execution', 'In Progress'];
        return { orderid: 'ORD-' + (2001 + i), patientname: names[i], ordertype: types[i], executiondue: 'Within 1 hour', assignedto: 'Nurse Joy', status: statuses[i] };
      }),
  },
  "/nurse/orders/stat": {
    ui: 4,
    title: "STAT Orders", description: "High-priority emergency orders requiring immediate execution.",
    stats: [{ label: "Active STATs", color: "text-red-500", value: "2" }, { label: "Avg Response", color: "text-emerald-400", value: "4 mins" }, { label: "Completed", color: "text-blue-400", value: "12" }],
    columns: [["STAT ID", "statid"], ["Patient Name", "patientname"], ["Ordered By", "orderedby"], ["Order Detail", "orderdetail"], ["Time Placed", "timeplaced"]],
    badge: ["Status", "status", {"Urgent":"amber","In Progress":"gray","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const details = ['ECG Immediate', 'IV Epinephrine', 'Arterial Blood Gas', 'Portable X-Ray', 'Push IV Fluids'];
        const statuses = ['Urgent', 'In Progress', 'Completed', 'Completed', 'Completed'];
        return { statid: 'STA-' + (4001 + i), patientname: names[i], orderedby: 'Dr. House', orderdetail: details[i], timeplaced: (5 + i) + ' mins ago', status: statuses[i] };
      }),
  },
  "/nurse/orders/tasks": {
    ui: 4,
    title: "Nursing Tasks", description: "Daily checklist and routine care tasks for assigned patients.",
    stats: [{ label: "Total Tasks", color: "text-blue-400", value: "45" }, { label: "Completed", color: "text-emerald-400", value: "22" }, { label: "Overdue", color: "text-red-400", value: "1" }],
    columns: [["Task ID", "taskid"], ["Patient Name", "patientname"], ["Task Description", "taskdescription"], ["Due By", "dueby"], ["Priority", "priority"]],
    badge: ["Status", "status", {"Pending":"gray","Completed":"emerald","Overdue":"amber","In Progress":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const tasks = ['Patient Turning Q2H', 'Sponge Bath', 'Check Cannula', 'Empty Catheter Bag', 'Assist to Chair'];
        const pris = ['High', 'Routine', 'Routine', 'High', 'Routine'];
        const statuses = ['Pending', 'Completed', 'Pending', 'Overdue', 'In Progress'];
        return { taskid: 'TSK-' + (5001 + i), patientname: names[i], taskdescription: tasks[i], dueby: '12:00 PM', priority: pris[i], status: statuses[i] };
      }),
  },
  "/nurse/patients/admitted": {
    ui: 4,
    title: "Admitted Log", description: "Log of newly admitted patients requiring initial assessment.",
    stats: [{ label: "Admitted Today", color: "text-blue-400", value: "12" }, { label: "Assessments Pending", color: "text-red-400", value: "4" }, { label: "Stabilized", color: "text-emerald-400", value: "8" }],
    columns: [["Admit ID", "admitid"], ["Patient Name", "patientname"], ["Time of Admit", "timeofadmit"], ["From Dept", "fromdept"], ["Initial Vitals", "initialvitals"]],
    badge: ["Status", "status", {"Awaiting Assessment":"amber","Stable":"emerald","Monitoring":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const depts = ['ER', 'OPD', 'Surgery', 'ER', 'ICU Transfer'];
        const vitals = ['Pending', 'Completed', 'Completed', 'Pending', 'Completed'];
        const statuses = ['Awaiting Assessment', 'Stable', 'Monitoring', 'Awaiting Assessment', 'Stable'];
        return { admitid: 'ADM-' + (5001 + i), patientname: names[i], timeofadmit: '10:00 AM', fromdept: depts[i], initialvitals: vitals[i], status: statuses[i] };
      }),
  },
  "/nurse/patients/bed-allocation": {
    ui: 4,
    title: "Bed Allocations", description: "Manage and update patient bed assignments within the ward.",
    stats: [{ label: "Beds Managed", color: "text-blue-400", value: "20" }, { label: "Pending Transfers", color: "text-amber-400", value: "3" }, { label: "Allocated Today", color: "text-emerald-400", value: "5" }],
    columns: [["Allocation ID", "allocationid"], ["Patient Name", "patientname"], ["Current Bed", "currentbed"], ["New Bed (Transfer)", "newbedtransfer"], ["Action By", "actionby"]],
    badge: ["Status", "status", {"Pending Transfer":"amber","Allocated":"emerald","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const currents = ['ER-1', 'ICU-3', 'Ward-12', 'Ward-5', 'N/A'];
        const news = ['Ward-2', 'N/A', 'ICU-1', 'Discharged', 'Ward-1'];
        const statuses = ['Pending Transfer', 'Allocated', 'Pending Transfer', 'Completed', 'Allocated'];
        return { allocationid: 'BED-' + (4001 + i), patientname: names[i], currentbed: currents[i], newbedtransfer: news[i], actionby: 'Admin', status: statuses[i] };
      }),
  },
  "/nurse/patients/discharge": {
    ui: 4,
    title: "Discharge Processing", description: "Finalize nursing checklist for departing patients.",
    stats: [{ label: "Discharges Today", color: "text-blue-400", value: "8" }, { label: "Cleared to Leave", color: "text-emerald-400", value: "5" }, { label: "Pending Meds", color: "text-amber-400", value: "3" }],
    columns: [["Discharge ID", "dischargeid"], ["Patient Name", "patientname"], ["Bed", "bed"], ["Checklist", "checklist"], ["Cannula Removed", "cannularemoved"]],
    badge: ["Status", "status", {"Pending Meds":"amber","Cleared":"emerald","In Progress":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const checks = ['4/5', '5/5', '1/5', '5/5', '2/5'];
        const canns = ['Yes', 'Yes', 'No', 'Yes', 'No'];
        const statuses = ['Pending Meds', 'Cleared', 'In Progress', 'Cleared', 'In Progress'];
        return { dischargeid: 'DIS-' + (7001 + i), patientname: names[i], bed: 'Ward-' + (10 + i), checklist: checks[i], cannularemoved: canns[i], status: statuses[i] };
      }),
  },
  "/nurse/patients/my-patients": {
    ui: 4,
    title: "My Assigned Patients", description: "Directory of all patients currently under your care.",
    stats: [{ label: "Total Assigned", color: "text-blue-400", value: "8" }, { label: "High Acuity", color: "text-red-400", value: "2" }, { label: "Routine Care", color: "text-emerald-400", value: "6" }],
    columns: [["Patient ID", "patientid"], ["Patient Name", "patientname"], ["Age/Gender", "agegender"], ["Bed", "bed"], ["Primary Dx", "primarydx"]],
    badge: ["Status", "status", {"Stable":"emerald","Monitoring":"red","Critical":"red","Discharging":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const genders = ['22/M', '21/F', '23/M', '21/F', '18/M'];
        const statuses = ['Stable', 'Monitoring', 'Critical', 'Stable', 'Discharging'];
        return { patientid: 'PAT-' + (3001 + i), patientname: names[i], agegender: genders[i], bed: 'ICU-' + (1 + i), primarydx: 'Fever', status: statuses[i] };
      }),
  },
  "/nurse/patients/transfers": {
    ui: 4,
    title: "Unit Transfers", description: "Patients moving into or out of your assigned unit.",
    stats: [{ label: "Incoming Transfers", color: "text-amber-400", value: "2" }, { label: "Outgoing Transfers", color: "text-blue-400", value: "1" }, { label: "Completed", color: "text-emerald-400", value: "4" }],
    columns: [["Transfer ID", "transferid"], ["Patient Name", "patientname"], ["From/To Unit", "fromtounit"], ["Transfer Time", "transfertime"], ["Reason", "reason"]],
    badge: ["Status", "status", {"In Transit":"gray","Completed":"emerald","Pending":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
        const units = ['ER -> ICU', 'ICU -> Ward', 'Ward -> Surgery', 'Surgery -> ICU', 'Ward -> Ward'];
        const statuses = ['In Transit', 'Completed', 'Pending', 'Completed', 'In Transit'];
        return { transferid: 'TRF-' + (6001 + i), patientname: names[i], fromtounit: units[i], transfertime: '14:30', reason: 'Upgrade of Care', status: statuses[i] };
      }),
  },
  "/nurse/performance/assignments": {
    ui: 4,
    title: "Assignment Load", description: "Analysis of patient acuity and workload distribution.",
    stats: [{ label: "Avg Acuity Load", color: "text-amber-400", value: "Medium-High" }, { label: "Balanced Shifts", color: "text-emerald-400", value: "85%" }, { label: "Overburdened", color: "text-red-400", value: "1" }],
    columns: [["Log ID", "logid"], ["Nurse Name", "nursename"], ["Avg Patients", "avgpatients"], ["Acuity Score", "acuityscore"], ["Overtime Hrs", "overtimehrs"]],
    badge: ["Status", "status", {"Balanced":"emerald","Heavy Load":"amber","Light Load":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Nurse Joy', 'Nurse Smith', 'Nurse Chapel', 'Nurse Ratched', 'Nurse Jackie'];
        const statuses = ['Balanced', 'Heavy Load', 'Balanced', 'Balanced', 'Light Load'];
        return { logid: 'PER-A-' + (2001 + i), nursename: names[i], avgpatients: '5', acuityscore: '24', overtimehrs: '2', status: statuses[i] };
      }),
  },
  "/nurse/performance/kpis": {
    ui: 4,
    title: "Nursing KPIs", description: "Overall department and individual key performance indicators.",
    stats: [{ label: "KPIs Met", color: "text-emerald-400", value: "15/18" }, { label: "Overall Grade", color: "text-blue-400", value: "A-" }, { label: "Focus Areas", color: "text-amber-400", value: "Documentation" }],
    columns: [["KPI ID", "kpiid"], ["Metric Name", "metricname"], ["Target", "target"], ["Current Score", "currentscore"], ["Variance", "variance"]],
    badge: ["Status", "status", {"Target Met":"emerald","Lagging":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['Patient Satisfaction', 'Fall Rate', 'CLABSI Rate', 'Charting Compliance', 'Overtime %'];
        const statuses = ['Target Met', 'Target Met', 'Target Met', 'Lagging', 'Target Met'];
        return { kpiid: 'KPI-N-' + (4001 + i), metricname: metrics[i], target: '95%', currentscore: '96%', variance: '+1%', status: statuses[i] };
      }),
  },
  "/nurse/performance/medication": {
    ui: 4,
    title: "Medication Safety Score", description: "Individual nurse metrics for safe medication administration.",
    stats: [{ label: "Overall Safety", color: "text-emerald-400", value: "99.8%" }, { label: "Barcode Compliance", color: "text-emerald-400", value: "98%" }, { label: "Errors (30d)", color: "text-emerald-400", value: "0" }],
    columns: [["Metric ID", "metricid"], ["Nurse Name", "nursename"], ["Meds Administered", "medsadministered"], ["Errors", "errors"], ["Barcode Scan %", "barcodescan"]],
    badge: ["Status", "status", {"Excellent":"emerald","Good":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Nurse Joy', 'Nurse Smith', 'Nurse Chapel', 'Nurse Ratched', 'Nurse Jackie'];
        const statuses = ['Excellent', 'Excellent', 'Excellent', 'Good', 'Excellent'];
        return { metricid: 'PER-M-' + (3001 + i), nursename: names[i], medsadministered: '450', errors: '0', barcodescan: '99%', status: statuses[i] };
      }),
  },
  "/nurse/performance/tasks": {
    ui: 4,
    title: "Task Efficiency", description: "Metrics tracking individual nurse task completion times.",
    stats: [{ label: "Avg Efficiency", color: "text-emerald-400", value: "94%" }, { label: "High Performers", color: "text-blue-400", value: "12" }, { label: "Needs Support", color: "text-amber-400", value: "2" }],
    columns: [["Metric ID", "metricid"], ["Nurse Name", "nursename"], ["Tasks Assigned", "tasksassigned"], ["Completed On-Time", "completedontime"], ["Efficiency %", "efficiency"]],
    badge: ["Status", "status", {"Excellent":"emerald","Good":"emerald","Average":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Nurse Joy', 'Nurse Smith', 'Nurse Chapel', 'Nurse Ratched', 'Nurse Jackie'];
        const statuses = ['Excellent', 'Good', 'Excellent', 'Average', 'Good'];
        return { metricid: 'PER-T-' + (1001 + i), nursename: names[i], tasksassigned: '45', completedontime: '43', efficiency: '95%', status: statuses[i] };
      }),
  },
  "/nurse/reports/care": {
    ui: 4,
    title: "Care Plan Audits", description: "Audit reports measuring the completeness of nursing care plans.",
    stats: [{ label: "Charts Audited", color: "text-blue-400", value: "50" }, { label: "Pass Rate", color: "text-emerald-400", value: "92%" }, { label: "Action Required", color: "text-red-400", value: "4" }],
    columns: [["Audit ID", "auditid"], ["Ward", "ward"], ["Charts Audited", "chartsaudited"], ["Complete Plans", "completeplans"], ["Deficiencies", "deficiencies"]],
    badge: ["Status", "status", {"Passed":"emerald","Action Req":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Passed', 'Action Req', 'Passed', 'Passed', 'Passed'];
        return { auditid: 'ADT-C-' + (4001 + i), ward: 'Ward ' + (1 + i), chartsaudited: '10', completeplans: '9', deficiencies: '1', status: statuses[i] };
      }),
  },
  "/nurse/reports/census": {
    ui: 4,
    title: "Ward Census Report", description: "Daily summary of admissions, discharges, and bed occupancy.",
    stats: [{ label: "Avg Occupancy", color: "text-blue-400", value: "88%" }, { label: "Highest Volume Day", color: "text-gray-400", value: "Monday" }, { label: "Turnover Rate", color: "text-emerald-400", value: "12%" }],
    columns: [["Report ID", "reportid"], ["Date", "date"], ["Total Beds", "totalbeds"], ["Occupied", "occupied"], ["Admissions", "admissions"], ["Discharges", "discharges"]],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportid: 'RPT-C-' + (1001 + i), date: (10 + i) + ' Jul 2026', totalbeds: '50', occupied: '45', admissions: '5', discharges: '4', status: 'Generated' };
      }),
  },
  "/nurse/reports/incident": {
    ui: 4,
    title: "Incident Analytics", description: "Trends and analysis of nursing-related incident reports.",
    stats: [{ label: "Incidents (YTD)", color: "text-amber-400", value: "15" }, { label: "Fall Rate", color: "text-emerald-400", value: "1.2/1000" }, { label: "Action Plans", color: "text-blue-400", value: "3" }],
    columns: [["Report ID", "reportid"], ["Month", "month"], ["Total Incidents", "totalincidents"], ["Falls", "falls"], ["Med Errors", "mederrors"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportid: 'RPT-I-' + (6001 + i), month: ['Jan', 'Feb', 'Mar', 'Apr', 'May'][i], totalincidents: '3', falls: '2', mederrors: '0', status: 'Generated' };
      }),
  },
  "/nurse/reports/medication": {
    ui: 4,
    title: "Medication Admin Report", description: "Analytics on medication timings, errors, and PRN usage.",
    stats: [{ label: "On-Time Admin", color: "text-emerald-400", value: "96%" }, { label: "PRN Doses", color: "text-blue-400", value: "45" }, { label: "Errors Reported", color: "text-emerald-400", value: "0" }],
    columns: [["Report ID", "reportid"], ["Ward", "ward"], ["Meds Given", "medsgiven"], ["On-Time %", "ontime"], ["Missed/Refused", "missedrefused"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportid: 'RPT-M-' + (2001 + i), ward: 'General Ward ' + ['A', 'B', 'C', 'ICU', 'ER'][i], medsgiven: '350', ontime: '95%', missedrefused: '5', status: 'Generated' };
      }),
  },
  "/nurse/reports/shift": {
    ui: 4,
    title: "Shift Summary Reports", description: "Aggregated data on nurse workload, overtime, and staffing ratios.",
    stats: [{ label: "Avg Ratio", color: "text-blue-400", value: "1:5" }, { label: "Overtime Hours", color: "text-amber-400", value: "12" }, { label: "Sick Calls", color: "text-red-400", value: "2" }],
    columns: [["Report ID", "reportid"], ["Date", "date"], ["Shift", "shift"], ["Nurses on Duty", "nursesonduty"], ["Patient Ratio", "patientratio"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const shifts = ['Morning', 'Evening', 'Night', 'Morning', 'Evening'];
        return { reportid: 'RPT-S-' + (5001 + i), date: 'Today', shift: shifts[i], nursesonduty: '8', patientratio: '1:5', status: 'Generated' };
      }),
  },
  "/nurse/reports/vitals": {
    ui: 4,
    title: "Vitals Compliance", description: "Report on nursing compliance with scheduled vitals checks.",
    stats: [{ label: "Overall Compliance", color: "text-emerald-400", value: "98%" }, { label: "Missed Checks", color: "text-amber-400", value: "12" }, { label: "Night Shift Diff", color: "text-gray-400", value: "-2%" }],
    columns: [["Report ID", "reportid"], ["Date Range", "daterange"], ["Total Checks Due", "totalchecksdue"], ["Checks Done", "checksdone"], ["Compliance %", "compliance"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportid: 'RPT-V-' + (3001 + i), daterange: 'Week ' + (1 + i), totalchecksdue: '1200', checksdone: '1180', compliance: '98%', status: 'Generated' };
      }),
  },
  "/nurse/settings/preferences": {
    ui: 4,
    title: "Dashboard Preferences", description: "Customize layout, notifications, and default ward views.",
    stats: [{ label: "Theme", color: "text-blue-400", value: "Dark Mode" }, { label: "Alerts", color: "text-emerald-400", value: "Enabled (High)" }, { label: "Default View", color: "text-gray-400", value: "My Patients" }],
    columns: [["Setting ID", "settingid"], ["Preference Name", "preferencename"], ["Category", "category"], ["Current Value", "currentvalue"], ["Last Updated", "lastupdated"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const prefs = ['Default Ward', 'Push Notifications', 'Sound Alerts', 'Language', 'Data Refresh Rate'];
        const vals = ['ICU', 'Enabled', 'High Priority Only', 'English', 'Auto (1m)'];
        return { settingid: 'SET-' + (2001 + i), preferencename: prefs[i], category: 'UI/UX', currentvalue: vals[i], lastupdated: 'Today', status: 'Active' };
      }),
  },
  "/nurse/settings/profile": {
    ui: 4,
    title: "Nurse Profile", description: "Manage your personal details, credentials, and certifications.",
    stats: [{ label: "License Status", color: "text-emerald-400", value: "Active" }, { label: "CEUs Earned", color: "text-blue-400", value: "24/30" }, { label: "Expiring Soon", color: "text-amber-400", value: "BLS (30 days)" }],
    columns: [["Credential ID", "credentialid"], ["Document Type", "documenttype"], ["Issue Date", "issuedate"], ["Expiry Date", "expirydate"], ["Verification", "verification"]],
    badge: ["Status", "status", {"Valid":"emerald","Expiring Soon":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const docs = ['RN License', 'BLS Certification', 'ACLS Certification', 'PALS Certification', 'Infection Control Module'];
        const statuses = ['Valid', 'Expiring Soon', 'Valid', 'Valid', 'Valid'];
        return { credentialid: 'CRD-' + (1001 + i), documenttype: docs[i], issuedate: '01 Jan 2024', expirydate: '01 Jan 2026', verification: 'Verified', status: statuses[i] };
      }),
  },
  "/nurse/shift/handover": {
    ui: 4,
    title: "Shift Handovers", description: "Critical patient notes transferred between nursing shifts.",
    stats: [{ label: "Pending Handovers", color: "text-amber-400", value: "4" }, { label: "Acknowledged", color: "text-emerald-400", value: "24" }, { label: "Critical Patients", color: "text-red-400", value: "2" }],
    columns: [["Handover ID", "handoverid"], ["Patient Name", "patientname"], ["Bed", "bed"], ["Outgoing Nurse", "outgoingnurse"], ["Key Notes", "keynotes"]],
    badge: ["Status", "status", {"Pending Ack":"amber","Acknowledged":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const notes = ['BP unstable', 'Awaiting Labs', 'Ready for discharge', 'Check IV at 10 AM', 'No issues'];
        const statuses = ['Pending Ack', 'Acknowledged', 'Acknowledged', 'Pending Ack', 'Acknowledged'];
        return { handoverid: 'HND-' + (2001 + i), patientname: names[i], bed: 'ICU-' + (1 + i), outgoingnurse: 'Nurse Smith', keynotes: notes[i], status: statuses[i] };
      }),
  },
  "/nurse/shift/roster": {
    ui: 4,
    title: "Shift Roster", description: "Monthly nursing schedule and upcoming shifts.",
    stats: [{ label: "Total Shifts", color: "text-blue-400", value: "22" }, { label: "Night Shifts", color: "text-amber-400", value: "5" }, { label: "Leave Days", color: "text-gray-400", value: "4" }],
    columns: [["Shift Date", "shiftdate"], ["Day", "day"], ["Shift Timing", "shifttiming"], ["Ward/Unit", "wardunit"], ["Charge Nurse", "chargenurse"]],
    badge: ["Status", "status", {"Completed":"emerald","Active":"emerald","Scheduled":"amber","Off Duty":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const timings = ['08:00 AM - 04:00 PM', '04:00 PM - 12:00 AM', '12:00 AM - 08:00 AM', '08:00 AM - 04:00 PM', 'Off Duty'];
        const wards = ['ICU', 'General Ward A', 'Post-Op', 'ER', 'N/A'];
        const statuses = ['Completed', 'Completed', 'Active', 'Scheduled', 'Off Duty'];
        return { shiftdate: (10 + i) + ' Jul, 2026', day: days[i], shifttiming: timings[i], wardunit: wards[i], chargenurse: 'Nurse Joy', status: statuses[i] };
      }),
  },
  "/nurse/shift/today": {
    ui: 4,
    title: "Today's Shift", description: "Current shift overview and primary responsibilities.",
    stats: [{ label: "My Patients Today", color: "text-blue-400", value: "8" }, { label: "Tasks Pending", color: "text-amber-400", value: "12" }, { label: "Time Left", color: "text-emerald-400", value: "4h 15m" }],
    columns: [["Assignment ID", "assignmentid"], ["Ward/Unit", "wardunit"], ["Patients Assigned", "patientsassigned"], ["Start Time", "starttime"], ["End Time", "endtime"]],
    badge: ["Status", "status", {"Active":"emerald","Completed":"emerald","Upcoming":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const wards = ['ICU', 'General Ward A', 'Post-Op', 'ER', 'NICU'];
        const statuses = ['Active', 'Completed', 'Upcoming', 'Active', 'Active'];
        return { assignmentid: 'ASN-' + (1001 + i), wardunit: wards[i], patientsassigned: (5 + i), starttime: '08:00 AM', endtime: '04:00 PM', status: statuses[i] };
      }),
  },
  "/nurse/shift/wards": {
    ui: 4,
    title: "Ward Overview", description: "High-level view of all beds and patients in your current ward.",
    stats: [{ label: "Total Beds", color: "text-blue-400", value: "20" }, { label: "Occupied", color: "text-amber-400", value: "18" }, { label: "Vacant", color: "text-emerald-400", value: "2" }],
    columns: [["Bed Number", "bednumber"], ["Patient Name", "patientname"], ["Admission Reason", "admissionreason"], ["Attending Dr", "attendingdr"], ["Last Check", "lastcheck"]],
    badge: ["Status", "status", {"Stable":"emerald","Critical":"red","Observation":"amber","Discharging":"gray","Vacant":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const statuses = ['Stable', 'Critical', 'Observation', 'Discharging', 'Vacant'];
        return { bednumber: 'Ward A - ' + (1 + i), patientname: i === 4 ? '-' : names[i], admissionreason: i === 4 ? '-' : 'Observation', attendingdr: i === 4 ? '-' : 'Dr. Grey', lastcheck: '15 mins ago', status: statuses[i] };
      }),
  },
  "/nurse/specimen/collection": {
    ui: 4,
    title: "Specimen Collection", description: "Tasks for collecting blood, urine, or swab samples.",
    stats: [{ label: "Pending Collections", color: "text-amber-400", value: "12" }, { label: "Collected Today", color: "text-emerald-400", value: "45" }, { label: "STAT", color: "text-red-400", value: "2" }],
    columns: [["Task ID", "taskid"], ["Patient Name", "patientname"], ["Specimen Type", "specimentype"], ["Test Ordered", "testordered"], ["Due Time", "duetime"]],
    badge: ["Status", "status", {"Pending Collection":"amber","Collected":"emerald","Overdue":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
        const specs = ['Blood (EDTA)', 'Urine MSU', 'Blood (Serum)', 'Sputum', 'Wound Swab'];
        const statuses = ['Pending Collection', 'Collected', 'Pending Collection', 'Overdue', 'Collected'];
        return { taskid: 'SPC-' + (1001 + i), patientname: names[i], specimentype: specs[i], testordered: 'CBC', duetime: '10:00 AM', status: statuses[i] };
      }),
  },
  "/nurse/specimen/dispatch": {
    ui: 4,
    title: "Specimen Dispatch", description: "Log of specimens sent to the laboratory.",
    stats: [{ label: "Dispatched Today", color: "text-blue-400", value: "40" }, { label: "In Transit", color: "text-amber-400", value: "5" }, { label: "Received by Lab", color: "text-emerald-400", value: "35" }],
    columns: [["Dispatch ID", "dispatchid"], ["Patient Name", "patientname"], ["Specimen Type", "specimentype"], ["Sent Via", "sentvia"], ["Time Sent", "timesent"]],
    badge: ["Status", "status", {"Received by Lab":"emerald","In Transit":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
        const statuses = ['Received by Lab', 'In Transit', 'Received by Lab', 'Received by Lab', 'In Transit'];
        return { dispatchid: 'DSP-' + (2001 + i), patientname: names[i], specimentype: 'Blood', sentvia: 'Pneumatic Tube', timesent: '09:30 AM', status: statuses[i] };
      }),
  },
  "/nurse/specimen/pending": {
    ui: 4,
    title: "Pending Lab Results", description: "Track specimens awaiting results from the laboratory.",
    stats: [{ label: "Awaiting Results", color: "text-amber-400", value: "24" }, { label: "Overdue (TAT)", color: "text-red-400", value: "2" }, { label: "Results Ready", color: "text-emerald-400", value: "10" }],
    columns: [["Req ID", "reqid"], ["Patient Name", "patientname"], ["Test Name", "testname"], ["Lab Dept", "labdept"], ["Turnaround Time", "turnaroundtime"]],
    badge: ["Status", "status", {"Processing":"amber","Results Ready":"emerald","Overdue":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const statuses = ['Processing', 'Results Ready', 'Processing', 'Overdue', 'Processing'];
        return { reqid: 'REQ-' + (3001 + i), patientname: names[i], testname: 'Electrolytes', labdept: 'Biochemistry', turnaroundtime: '2 hours', status: statuses[i] };
      }),
  },
};

export default pages;
