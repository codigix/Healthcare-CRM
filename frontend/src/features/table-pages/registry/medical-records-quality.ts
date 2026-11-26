import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/records/accreditation/audit": {
    ui: 5,
    title: "Accreditation Audit", description: "Internal mock audits simulating external assessor visits.",
    stats: [{ label: "Mock Audits (YTD)", color: "text-blue-400", value: "4" }, { label: "Avg Score", color: "text-emerald-400", value: "88%" }, { label: "Total Open NCs", color: "text-amber-400", value: "15" }],
    columns: [["Audit Date", "auditdate"], ["Auditor/Assessor", "auditorassessor"], ["Chapters Covered", "chapterscovered"], ["Score Achieved", "scoreachieved"], ["NCs Raised", "ncsraised"]],
    badge: ["Status", "status", {"Report Drafting":"amber","Closed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { auditdate: '01 Jun 2026', auditorassessor: 'Internal Quality Team', chapterscovered: 'HIC, CQI', scoreachieved: (85 + i * 2) + '%', ncsraised: (2 + i).toString(), status: i === 0 ? 'Report Drafting' : 'Closed' };
      }),
  },
  "/records/accreditation/checklists": {
    ui: 5,
    title: "Department Checklists", description: "Daily/Weekly self-assessment checklists for wards and departments.",
    stats: [{ label: "Daily Submissions", color: "text-emerald-400", value: "24/24" }, { label: "Avg Score", color: "text-blue-400", value: "96%" }, { label: "Missed Checklists", color: "text-emerald-400", value: "0" }],
    columns: [["Checklist Type", "checklisttype"], ["Department", "department"], ["Frequency", "frequency"], ["Last Submitted", "lastsubmitted"], ["Score", "score"]],
    badge: ["Status", "status", {"Submitted":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { checklisttype: 'Facility Round', department: 'Ward ' + String.fromCharCode(65 + i), frequency: 'Daily', lastsubmitted: 'Today 08:00', score: (95 + i) + '%', status: 'Submitted' };
      }),
  },
  "/records/accreditation/jci": {
    ui: 5,
    title: "JCI Standards", description: "Tracking requirements for Joint Commission International (if applicable/aspiring).",
    stats: [{ label: "JCI Readiness", color: "text-amber-400", value: "75%" }, { label: "Target Assessment", color: "text-blue-400", value: "Dec 2026" }, { label: "Open Gaps", color: "text-red-400", value: "45" }],
    columns: [["Chapter", "chapter"], ["Measurable Element", "measurableelement"], ["Current Practice", "currentpractice"], ["Gap Identified", "gapidentified"], ["Action Plan", "actionplan"]],
    badge: ["Status", "status", {"In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { chapter: 'IPSG', measurableelement: 'ME ' + (1 + i), currentpractice: 'Partially Implemented', gapidentified: 'Documentation lack', actionplan: 'Training scheduled', status: 'In Progress' };
      }),
  },
  "/records/accreditation/nabh": {
    ui: 5,
    title: "NABH Standards", description: "Mapping of hospital practices against specific chapters and objective elements of NABH.",
    stats: [{ label: "Overall NABH Score", color: "text-emerald-400", value: "92%" }, { label: "Chapters 100%", color: "text-blue-400", value: "4/10" }, { label: "Major Gaps", color: "text-emerald-400", value: "0" }],
    columns: [["Chapter", "chapter"], ["Standard", "standard"], ["Objective Element", "objectiveelement"], ["Compliance %", "compliance"], ["Evidence Attached", "evidenceattached"]],
    badge: ["Status", "status", {"Compliant":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const chapters = ['AAC', 'COP', 'MOM', 'PRE', 'HIC'];
        return { chapter: chapters[i], standard: chapters[i] + '.1', objectiveelement: 'a, b, c', compliance: (85 + i * 3) + '%', evidenceattached: '3 Files', status: 'Compliant' };
      }),
  },
  "/records/accreditation/policy": {
    ui: 5,
    title: "Policy Management", description: "Centralized control for all hospital policies required by accrediting bodies.",
    stats: [{ label: "Total Policies", color: "text-blue-400", value: "124" }, { label: "Up to Date", color: "text-emerald-400", value: "120" }, { label: "Reviews Due", color: "text-amber-400", value: "4" }],
    columns: [["Policy ID", "policyid"], ["Policy Name", "policyname"], ["Chapter Reference", "chapterreference"], ["Last Updated", "lastupdated"], ["Next Review", "nextreview"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { policyid: 'POL-' + (101 + i), policyname: 'Patient Rights & Education', chapterreference: 'PRE', lastupdated: '01 Jan 2026', nextreview: '01 Jan 2027', status: 'Active' };
      }),
  },
  "/records/accreditation/sop": {
    ui: 5,
    title: "SOP Management", description: "Standard Operating Procedures library with version control and department access.",
    stats: [{ label: "Total SOPs", color: "text-blue-400", value: "345" }, { label: "Recent Updates", color: "text-emerald-400", value: "12" }, { label: "Draft SOPs", color: "text-amber-400", value: "5" }],
    columns: [["SOP ID", "sopid"], ["SOP Name", "sopname"], ["Department", "department"], ["Version", "version"], ["Approved By", "approvedby"]],
    badge: ["Status", "status", {"Published":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { sopid: 'SOP-' + (501 + i), sopname: 'Biomedical Waste Segregation', department: 'Housekeeping', version: 'v2.1', approvedby: 'Medical Director', status: 'Published' };
      }),
  },
  "/records/analytics/audit": {
    ui: 5,
    title: "Audit Analytics", description: "Identifying departments or doctors with recurrent non-compliances.",
    stats: [{ label: "Most Improved Dept", color: "text-emerald-400", value: "Emergency" }, { label: "Highest NC Dept", color: "text-red-400", value: "Orthopedics" }, { label: "Avg Audit Score", color: "text-blue-400", value: "91%" }],
    columns: [["Department", "department"], ["Audit Failure Rate", "auditfailurerate"], ["Recurrent NC Area", "recurrentncarea"], ["Root Cause", "rootcause"], ["Improvement Plan", "improvementplan"]],
    badge: ["Status", "status", {"Action Needed":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { department: 'Dept ' + (1 + i), auditfailurerate: (2 + i) + '%', recurrentncarea: 'Consent Signatures', rootcause: 'Time constraints', improvementplan: 'Digital Consents', status: 'Action Needed' };
      }),
  },
  "/records/analytics/coding": {
    ui: 5,
    title: "Coding Analytics", description: "Revenue impact analysis based on coding accuracy and case mix index.",
    stats: [{ label: "Overall CMI", color: "text-emerald-400", value: "1.45" }, { label: "Denials due to Coding", color: "text-amber-400", value: "1.5%" }, { label: "Revenue Recovered", color: "text-blue-400", value: "$12,500" }],
    columns: [["Specialty", "specialty"], ["Case Mix Index", "casemixindex"], ["Coding Denials", "codingdenials"], ["Revenue Impact", "revenueimpact"], ["Avg DRG Weight", "avgdrgweight"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { specialty: 'Cardiology', casemixindex: (1.8 + i * 0.1).toFixed(2), codingdenials: '2%', revenueimpact: 'Minimal', avgdrgweight: (1.2 + i * 0.2).toFixed(2), status: 'Analyzed' };
      }),
  },
  "/records/analytics/compliance": {
    ui: 5,
    title: "Compliance Dashboard", description: "Executive view of all statutory, legal, and accreditation risks.",
    stats: [{ label: "Hospital Risk Profile", color: "text-emerald-400", value: "Low Risk" }, { label: "Critical Gaps", color: "text-emerald-400", value: "0" }, { label: "Licensing Status", color: "text-blue-400", value: "100% Valid" }],
    columns: [["Compliance Category", "compliancecategory"], ["Readiness Score", "readinessscore"], ["Critical Gaps", "criticalgaps"], ["Upcoming Deadlines", "upcomingdeadlines"], ["Owner", "owner"]],
    badge: ["Status", "status", {"Compliant":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const categories = ['NABH Readiness', 'Statutory Licenses', 'Bio-Medical Waste', 'Fire Safety', 'Radiation (AERB)'];
        return { compliancecategory: categories[i], readinessscore: (95 - i) + '%', criticalgaps: 'None', upcomingdeadlines: i === 1 ? '30 Days' : 'None', owner: 'Quality Head', status: 'Compliant' };
      }),
  },
  "/records/analytics/documentation": {
    ui: 5,
    title: "Documentation Analytics", description: "Insights into EMR usage, charting time, and documentation quality.",
    stats: [{ label: "Avg Charting Time", color: "text-amber-400", value: "12 Mins/Encounter" }, { label: "Note Completion Rate", color: "text-emerald-400", value: "98%" }, { label: "Copy-Paste Rate", color: "text-blue-400", value: "15%" }],
    columns: [["Metric", "metric"], ["Current Value", "currentvalue"], ["Previous Period", "previousperiod"], ["Variance", "variance"]],
    badge: ["Status", "status", {"Stable":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['Notes created in real-time', 'Files closed within 24h', 'Use of Templates', 'Voice dictation usage', 'Addendums made'];
        return { metric: metrics[i], currentvalue: (80 + i * 2) + '%', previousperiod: (78 + i * 2) + '%', variance: '+2%', status: 'Stable' };
      }),
  },
  "/records/analytics/infection": {
    ui: 5,
    title: "Infection Analytics", description: "Heatmaps and predictive modeling of infection outbreaks within wards.",
    stats: [{ label: "High Risk Zones", color: "text-emerald-400", value: "0" }, { label: "Outbreak Alerts", color: "text-emerald-400", value: "None" }, { label: "Antibiotic Usage", color: "text-blue-400", value: "Optimized" }],
    columns: [["Ward/ICU", "wardicu"], ["Infection Rate", "infectionrate"], ["Predominant Bug", "predominantbug"], ["Outbreak Risk", "outbreakrisk"], ["Action Required", "actionrequired"]],
    badge: ["Status", "status", {"Monitored":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { wardicu: 'ICU ' + (1 + i), infectionrate: (0.5 + i * 0.1) + '%', predominantbug: 'K. pneumoniae', outbreakrisk: 'Low', actionrequired: 'Standard Precautions', status: 'Monitored' };
      }),
  },
  "/records/analytics/quality": {
    ui: 5,
    title: "Quality Analytics", description: "Trending analysis of quality indicators to predict potential safety risks.",
    stats: [{ label: "Overall Quality Index", color: "text-emerald-400", value: "9.2/10" }, { label: "Predictive Risks", color: "text-amber-400", value: "1" }, { label: "Patient Satisfaction", color: "text-blue-400", value: "4.6/5" }],
    columns: [["Quality Domain", "qualitydomain"], ["Trend Direction", "trenddirection"], ["Risk Level", "risklevel"], ["Key Driver", "keydriver"], ["Mitigation", "mitigation"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const domains = ['Medication Safety', 'Surgical Outcomes', 'Patient Falls', 'Discharge Delays', 'Wait Times'];
        return { qualitydomain: domains[i], trenddirection: 'Improving', risklevel: 'Low', keydriver: 'New SOP implemented', mitigation: 'Continue monitoring', status: 'Analyzed' };
      }),
  },
  "/records/audit/case-sheet": {
    ui: 5,
    title: "Case Sheet Audit", description: "In-depth peer review of inpatient files to ensure adherence to clinical pathways.",
    stats: [{ label: "Files Audited", color: "text-blue-400", value: "120" }, { label: "Protocol Deviations", color: "text-amber-400", value: "5" }, { label: "Clinical Excellence", color: "text-emerald-400", value: "45" }],
    columns: [["IPD No", "ipdno"], ["Patient", "patient"], ["Primary Doctor", "primarydoctor"], ["Auditor", "auditor"], ["Pathway Adherence", "pathwayadherence"]],
    badge: ["Status", "status", {"Audited":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { ipdno: 'IPD-' + (2001 + i), patient: 'Patient ' + (1 + i), primarydoctor: 'Dr. Surgeon', auditor: 'Dr. Peer', pathwayadherence: i === 2 ? 'Minor Deviation' : '100%', status: 'Audited' };
      }),
  },
  "/records/audit/documentation": {
    ui: 5,
    title: "Documentation Audit", description: "Reviewing clinical notes for legibility, timeliness, and completeness.",
    stats: [{ label: "Avg Dept Score", color: "text-blue-400", value: "88%" }, { label: "Top Dept (Docs)", color: "text-emerald-400", value: "ICU" }, { label: "Open NCs", color: "text-amber-400", value: "12" }],
    columns: [["Audit ID", "auditid"], ["Department", "department"], ["Records Sampled", "recordssampled"], ["Compliance Score", "compliancescore"], ["Major Deficiencies", "majordeficiencies"]],
    badge: ["Status", "status", {"Compliant":"emerald","Action Needed":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['ICU', 'Cardiology', 'Orthopedics', 'Emergency', 'Pediatrics'];
        return { auditid: 'DAUD-' + (101 + i), department: depts[i], recordssampled: '50', compliancescore: (85 + i * 2) + '%', majordeficiencies: i === 3 ? 'Delayed Notes' : 'None', status: i === 3 ? 'Action Needed' : 'Compliant' };
      }),
  },
  "/records/audit/mortality": {
    ui: 5,
    title: "Mortality Audit", description: "Clinical review of all hospital deaths to identify preventable causes.",
    stats: [{ label: "Total Reviews", color: "text-blue-400", value: "8" }, { label: "Pending Reviews", color: "text-amber-400", value: "2" }, { label: "Preventable (YTD)", color: "text-emerald-400", value: "0" }],
    columns: [["Death Record", "deathrecord"], ["Date of Death", "dateofdeath"], ["Department", "department"], ["Review Committee", "reviewcommittee"], ["Preventability", "preventability"]],
    badge: ["Status", "status", {"Under Review":"amber","Closed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { deathrecord: 'DTH-' + (4001 + i), dateofdeath: '01 Jun 2026', department: 'ICU', reviewcommittee: 'Mortality Board', preventability: 'Non-preventable', status: i === 0 ? 'Under Review' : 'Closed' };
      }),
  },
  "/records/audit/prescription": {
    ui: 5,
    title: "Prescription Audit", description: "Auditing prescriptions for legibility, generic names, allergies, and interactions.",
    stats: [{ label: "Generic Prescribing", color: "text-emerald-400", value: "92%" }, { label: "DDI Alerts Overridden", color: "text-amber-400", value: "18" }, { label: "Illegible Rx", color: "text-emerald-400", value: "0" }],
    columns: [["Rx ID", "rxid"], ["Prescriber", "prescriber"], ["No of Drugs", "noofdrugs"], ["Generics %", "generics"], ["Errors Found", "errorsfound"]],
    badge: ["Status", "status", {"Passed QA":"emerald","Feedback Sent":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { rxid: 'RX-' + (3001 + i), prescriber: 'Dr. ' + (1 + i), noofdrugs: (3 + i).toString(), generics: '100%', errorsfound: i === 1 ? 'Dose omission' : 'None', status: i === 1 ? 'Feedback Sent' : 'Passed QA' };
      }),
  },
  "/records/audit/readmission": {
    ui: 5,
    title: "Readmission Audit", description: "Tracking patients readmitted within 30 days for the same diagnosis.",
    stats: [{ label: "30-Day Readmit Rate", color: "text-emerald-400", value: "2.4%" }, { label: "High Risk Dept", color: "text-amber-400", value: "Pulmonology" }, { label: "Cases Analyzed", color: "text-blue-400", value: "15" }],
    columns: [["UHID", "uhid"], ["Patient", "patient"], ["Previous Discharge", "previousdischarge"], ["Readmission Date", "readmissiondate"], ["Root Cause", "rootcause"]],
    badge: ["Status", "status", {"Analyzed":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { uhid: 'UHID-' + (5001 + i), patient: 'Patient ' + (1 + i), previousdischarge: '15 May 2026', readmissiondate: '02 Jun 2026', rootcause: 'Non-compliance to Rx', status: 'Analyzed' };
      }),
  },
  "/records/audit/surgical": {
    ui: 5,
    title: "Surgical Audit", description: "Review of surgical outcomes, prolonged OT times, and post-op complications.",
    stats: [{ label: "Avg OT Utilization", color: "text-emerald-400", value: "85%" }, { label: "Surgical Site Infections", color: "text-emerald-400", value: "0" }, { label: "Re-explorations", color: "text-red-400", value: "1" }],
    columns: [["Surgery ID", "surgeryid"], ["Procedure", "procedure"], ["Surgeon", "surgeon"], ["Est. Time", "esttime"], ["Actual Time", "actualtime"], ["Complication", "complication"]],
    badge: ["Status", "status", {"Audited":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { surgeryid: 'SUR-' + (6001 + i), procedure: 'Appendectomy', surgeon: 'Dr. Surgeon', esttime: '60 Mins', actualtime: (55 + i * 10) + ' Mins', complication: i === 4 ? 'Prolonged Time' : 'None', status: 'Audited' };
      }),
  },
  "/records/clinical/consultation": {
    ui: 5,
    title: "Consultation Notes", description: "Cross-departmental referral notes and specialist opinions.",
    stats: [{ label: "Active Referrals", color: "text-blue-400", value: "45" }, { label: "Avg Response Time", color: "text-emerald-400", value: "2.5 Hrs" }, { label: "Overdue Consults", color: "text-red-400", value: "3" }],
    columns: [["Ref ID", "refid"], ["Patient", "patient"], ["Referring Dept", "referringdept"], ["Consulting Dept", "consultingdept"], ["Opinion Status", "opinionstatus"]],
    badge: ["Status", "status", {"Completed":"emerald","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { refid: 'REF-' + (5001 + i), patient: 'Patient ' + (1 + i), referringdept: 'Ortho', consultingdept: 'Cardio', opinionstatus: i === 1 ? 'Pending Eval' : 'Opinion Provided', status: i === 1 ? 'In Progress' : 'Completed' };
      }),
  },
  "/records/clinical/death": {
    ui: 5,
    title: "Death Summary", description: "Detailed clinical summary and cause of death documentation.",
    stats: [{ label: "Mortality (Mo)", color: "text-gray-400", value: "8" }, { label: "Summaries Pending", color: "text-emerald-400", value: "0" }, { label: "MLC Conversions", color: "text-amber-400", value: "1" }],
    columns: [["IPD No", "ipdno"], ["Patient", "patient"], ["Date of Death", "dateofdeath"], ["Consultant", "consultant"], ["Cause Declared", "causedeclared"]],
    badge: ["Status", "status", {"Finalized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { ipdno: 'IPD-' + (7001 + i), patient: 'Patient ' + (1 + i), dateofdeath: '01 Jun 2026', consultant: 'Dr. Smith', causedeclared: 'Cardiac Arrest', status: 'Finalized' };
      }),
  },
  "/records/clinical/discharge": {
    ui: 5,
    title: "Discharge Summary", description: "Comprehensive summary generated at the time of patient discharge.",
    stats: [{ label: "Discharges (Today)", color: "text-blue-400", value: "34" }, { label: "Summaries Pending", color: "text-amber-400", value: "4" }, { label: "Avg TAT to Patient", color: "text-emerald-400", value: "45 Mins" }],
    columns: [["IPD No", "ipdno"], ["Patient", "patient"], ["Discharge Date", "dischargedate"], ["Primary Consultant", "primaryconsultant"], ["Summary Draft", "summarydraft"]],
    badge: ["Status", "status", {"Action Required":"amber","Handed Over":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i === 0 ? 'Draft' : 'Finalized';
        return { ipdno: 'IPD-' + (6001 + i), patient: 'Patient ' + (1 + i), dischargedate: 'Today', primaryconsultant: 'Dr. House', summarydraft: statuses, status: statuses === 'Draft' ? 'Action Required' : 'Handed Over' };
      }),
  },
  "/records/clinical/doctor": {
    ui: 5,
    title: "Doctor Notes", description: "Detailed clinical evaluations, differential diagnosis, and treatment plans.",
    stats: [{ label: "Consult Notes (Today)", color: "text-blue-400", value: "340" }, { label: "Pending Addendums", color: "text-amber-400", value: "8" }, { label: "Peer Reviewed", color: "text-emerald-400", value: "15" }],
    columns: [["Visit/IPD No", "visitipdno"], ["Patient", "patient"], ["Consultant", "consultant"], ["Note Type", "notetype"], ["Last Updated", "lastupdated"]],
    badge: ["Status", "status", {"Finalized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Initial Eval', 'Follow-up', 'Consultation', 'Follow-up', 'Initial Eval'];
        return { visitipdno: 'OPD-' + (2001 + i), patient: 'Patient ' + (1 + i), consultant: 'Dr. Chief', notetype: types[i], lastupdated: 'Today', status: 'Finalized' };
      }),
  },
  "/records/clinical/nursing": {
    ui: 5,
    title: "Nursing Notes", description: "Nursing assessments, care plans, vital signs monitoring, and handover notes.",
    stats: [{ label: "Handover Compliance", color: "text-emerald-400", value: "98%" }, { label: "Missed Vitals", color: "text-red-400", value: "4" }, { label: "Care Plans Active", color: "text-blue-400", value: "340" }],
    columns: [["Patient", "patient"], ["Ward/Bed", "wardbed"], ["Nurse on Duty", "nurseonduty"], ["Shift", "shift"], ["Entry Type", "entrytype"]],
    badge: ["Status", "status", {"Logged":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Shift Handover', 'Vitals Charting', 'Medication Admin', 'Wound Care', 'Shift Handover'];
        return { patient: 'Patient ' + (1 + i), wardbed: 'ICU / Bed ' + (1 + i), nurseonduty: 'Nurse Alice', shift: 'Morning', entrytype: types[i], status: 'Logged' };
      }),
  },
  "/records/clinical/operative": {
    ui: 5,
    title: "Operative Notes", description: "Detailed surgical procedures documented by the primary surgeon.",
    stats: [{ label: "Surgeries Today", color: "text-blue-400", value: "24" }, { label: "Notes Pending", color: "text-amber-400", value: "2" }, { label: "Anesthesia Notes", color: "text-emerald-400", value: "24/24" }],
    columns: [["Surgery ID", "surgeryid"], ["Patient", "patient"], ["Primary Surgeon", "primarysurgeon"], ["Procedure", "procedure"], ["Date", "date"]],
    badge: ["Status", "status", {"Dictation Pending":"amber","Signed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { surgeryid: 'SUR-' + (3001 + i), patient: 'Patient ' + (1 + i), primarysurgeon: 'Dr. Cutter', procedure: 'CABG', date: 'Today', status: i === 0 ? 'Dictation Pending' : 'Signed' };
      }),
  },
  "/records/clinical/procedure": {
    ui: 5,
    title: "Procedure Notes", description: "Documentation for minor procedures (endoscopy, cath lab, dialysis).",
    stats: [{ label: "Procedures (Today)", color: "text-blue-400", value: "85" }, { label: "Complications Logged", color: "text-emerald-400", value: "0" }, { label: "Pending Notes", color: "text-amber-400", value: "5" }],
    columns: [["Proc ID", "procid"], ["Patient", "patient"], ["Performing Doctor", "performingdoctor"], ["Procedure Type", "proceduretype"], ["Date", "date"]],
    badge: ["Status", "status", {"Finalized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Endoscopy', 'Dialysis', 'Angiography', 'Dialysis', 'Biopsy'];
        return { procid: 'PRC-' + (4001 + i), patient: 'Patient ' + (1 + i), performingdoctor: 'Dr. Specialist', proceduretype: types[i], date: 'Yesterday', status: 'Finalized' };
      }),
  },
  "/records/clinical/progress": {
    ui: 5,
    title: "Progress Notes", description: "Daily chronological records of patient status, written by the care team.",
    stats: [{ label: "Notes Logged (24H)", color: "text-blue-400", value: "1,240" }, { label: "Unsigned Notes", color: "text-amber-400", value: "45" }, { label: "Late Entries", color: "text-red-400", value: "12" }],
    columns: [["Note ID", "noteid"], ["Patient", "patient"], ["Author", "author"], ["Designation", "designation"], ["Date & Time", "datetime"]],
    badge: ["Status", "status", {"Draft":"blue","Signed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { noteid: 'PRG-' + (1001 + i), patient: 'Patient ' + (1 + i), author: 'Dr. Smith', designation: 'Resident', datetime: 'Today 09:00', status: i === 0 ? 'Draft' : 'Signed' };
      }),
  },
  "/records/coding/audit": {
    ui: 5,
    title: "Coding Audit", description: "Quality checks on assigned codes to prevent upcoding, downcoding, or rejections.",
    stats: [{ label: "Files Audited (Mo)", color: "text-blue-400", value: "350" }, { label: "Accuracy Rate", color: "text-emerald-400", value: "94%" }, { label: "Major Errors", color: "text-red-400", value: "3" }],
    columns: [["Audit ID", "auditid"], ["Encounter", "encounter"], ["Original Coder", "originalcoder"], ["Auditor", "auditor"], ["Variance Found", "variancefound"]],
    badge: ["Status", "status", {"Passed QA":"emerald","Failed QA":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const variances = i === 1 ? 'Upcoding Detected' : (i === 3 ? 'Modifier Missing' : 'None');
        return { auditid: 'AUD-' + (5001 + i), encounter: 'IPD-' + (101 + i), originalcoder: 'Coder A', auditor: 'Lead Coder', variancefound: variances, status: variances === 'None' ? 'Passed QA' : 'Failed QA' };
      }),
  },
  "/records/coding/cpt": {
    ui: 5,
    title: "CPT Coding", description: "Current Procedural Terminology coding for outpatient and surgical procedures.",
    stats: [{ label: "Procedures Coded", color: "text-blue-400", value: "85" }, { label: "Pending CPT", color: "text-amber-400", value: "12" }, { label: "Claim Ready %", color: "text-emerald-400", value: "95%" }],
    columns: [["Procedure ID", "procedureid"], ["Patient", "patient"], ["Procedure Name", "procedurename"], ["CPT Code", "cptcode"], ["Modifier", "modifier"]],
    badge: ["Status", "status", {"Coded":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { procedureid: 'PRC-' + (3001 + i), patient: 'Patient ' + (1 + i), procedurename: 'Colonoscopy', cptcode: '45378', modifier: '-', status: 'Coded' };
      }),
  },
  "/records/coding/drg": {
    ui: 5,
    title: "DRG Coding", description: "Diagnosis-Related Group assignments for inpatient insurance billing and case mix analysis.",
    stats: [{ label: "DRG Assigned (Mo)", color: "text-blue-400", value: "850" }, { label: "Case Mix Index", color: "text-emerald-400", value: "1.45" }, { label: "DRG Denials", color: "text-red-400", value: "2%" }],
    columns: [["IPD No", "ipdno"], ["Patient", "patient"], ["Primary ICD", "primaryicd"], ["Secondary ICDs", "secondaryicds"], ["Assigned DRG", "assigneddrg"]],
    badge: ["Status", "status", {"Assigned":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { ipdno: 'IPD-' + (4001 + i), patient: 'Patient ' + (1 + i), primaryicd: 'I10', secondaryicds: '2 Codes', assigneddrg: 'DRG-' + (100 + i), status: 'Assigned' };
      }),
  },
  "/records/coding/icd10": {
    ui: 5,
    title: "ICD-10 Coding", description: "Assigning International Classification of Diseases (10th Rev) codes to diagnoses.",
    stats: [{ label: "Files Coded (Today)", color: "text-blue-400", value: "145" }, { label: "Pending Coding", color: "text-amber-400", value: "34" }, { label: "Auto-Coded %", color: "text-emerald-400", value: "45%" }],
    columns: [["Encounter ID", "encounterid"], ["Patient", "patient"], ["Primary Diagnosis", "primarydiagnosis"], ["ICD-10 Code", "icd10code"], ["Coder", "coder"]],
    badge: ["Status", "status", {"Coded":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const diags = ['Essential Hypertension', 'Type 2 Diabetes', 'Acute Appendicitis', 'Pneumonia', 'Migraine'];
        const codes = ['I10', 'E11.9', 'K35.80', 'J18.9', 'G43.909'];
        return { encounterid: 'ENC-' + (1001 + i), patient: 'Patient ' + (1 + i), primarydiagnosis: diags[i], icd10code: codes[i], coder: i === 0 ? 'System' : 'Coder A', status: 'Coded' };
      }),
  },
  "/records/coding/icd11": {
    ui: 5,
    title: "ICD-11 Coding", description: "Transition and mapping to the latest ICD-11 coding standards.",
    stats: [{ label: "Transition Progress", color: "text-blue-400", value: "85%" }, { label: "Mapping Errors", color: "text-red-400", value: "12" }, { label: "Verified Codes", color: "text-emerald-400", value: "1,240" }],
    columns: [["Encounter ID", "encounterid"], ["Patient", "patient"], ["ICD-10 Code", "icd10code"], ["ICD-11 Mapping", "icd11mapping"], ["Verification", "verification"]],
    badge: ["Status", "status", {"Active":"emerald","Review Needed":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { encounterid: 'ENC-' + (2001 + i), patient: 'Patient ' + (1 + i), icd10code: 'I10', icd11mapping: 'BA00', verification: i === 1 ? 'Pending' : 'Verified', status: i === 1 ? 'Review Needed' : 'Active' };
      }),
  },
  "/records/coding/procedure": {
    ui: 5,
    title: "Procedure Coding (Internal)", description: "Hospital-specific tariff/procedure codes mapping to standard CPT/ICD.",
    stats: [{ label: "Total Internal Codes", color: "text-blue-400", value: "4,500" }, { label: "Unmapped Codes", color: "text-red-400", value: "24" }, { label: "Recent Updates", color: "text-amber-400", value: "5" }],
    columns: [["Internal Code", "internalcode"], ["Service Name", "servicename"], ["Standard Mapping", "standardmapping"], ["Charge Head", "chargehead"]],
    badge: ["Status", "status", {"Mapped":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { internalcode: 'HOSP-' + (1001 + i), servicename: 'Specialist Consult ' + (1 + i), standardmapping: '99214', chargehead: 'Consultation', status: 'Mapped' };
      }),
  },
  "/records/documents/consent": {
    ui: 5,
    title: "Consent Forms (Templates)", description: "Library of blank consent forms in multiple languages.",
    stats: [{ label: "Active Templates", color: "text-blue-400", value: "450" }, { label: "Languages Supported", color: "text-emerald-400", value: "6" }, { label: "Pending Updates", color: "text-amber-400", value: "12" }],
    columns: [["Template ID", "templateid"], ["Procedure Name", "procedurename"], ["Language", "language"], ["Version", "version"], ["Last Updated", "lastupdated"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { templateid: 'TPL-' + (2001 + i), procedurename: 'Angioplasty', language: 'English/Hindi', version: 'v1.4', lastupdated: '01 Jan 2026', status: 'Active' };
      }),
  },
  "/records/documents/patient": {
    ui: 5,
    title: "Patient Documents", description: "General uploaded documents like ID proofs, external lab reports, and old records.",
    stats: [{ label: "Total Uploads", color: "text-blue-400", value: "1.4M" }, { label: "Storage Used", color: "text-amber-400", value: "2.4 TB" }, { label: "Uncategorized", color: "text-amber-400", value: "45" }],
    columns: [["Doc ID", "docid"], ["Patient", "patient"], ["Document Category", "documentcategory"], ["Uploaded By", "uploadedby"], ["Upload Date", "uploaddate"]],
    badge: ["Status", "status", {"Verified":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { docid: 'DOC-' + (1001 + i), patient: 'Patient ' + (1 + i), documentcategory: 'Govt ID Proof', uploadedby: 'Front Desk', uploaddate: 'Today', status: 'Verified' };
      }),
  },
  "/records/documents/scanned": {
    ui: 5,
    title: "Scanned Documents", description: "Raw scanned image files waiting to be tagged and assigned to a patient.",
    stats: [{ label: "Unassigned Scans", color: "text-amber-400", value: "124" }, { label: "Processed (Today)", color: "text-emerald-400", value: "850" }, { label: "OCR Accuracy", color: "text-blue-400", value: "88%" }],
    columns: [["Batch ID", "batchid"], ["Source Machine", "sourcemachine"], ["Page Count", "pagecount"], ["Scan Quality", "scanquality"], ["Date", "date"]],
    badge: ["Status", "status", {"Pending Tagging":"amber","Processed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { batchid: 'SCN-' + (3001 + i), sourcemachine: 'Scanner 1', pagecount: '15 Pages', scanquality: '300 DPI', date: 'Today', status: i < 2 ? 'Pending Tagging' : 'Processed' };
      }),
  },
  "/records/documents/signatures": {
    ui: 5,
    title: "Digital Signatures", description: "Managing e-signatures, DSC tokens, and biometric validations for doctors.",
    stats: [{ label: "Active DSCs", color: "text-blue-400", value: "120" }, { label: "Expiring (30D)", color: "text-amber-400", value: "5" }, { label: "PIN Resets Req", color: "text-red-400", value: "2" }],
    columns: [["Sign ID", "signid"], ["Doctor/Staff Name", "doctorstaffname"], ["Auth Method", "authmethod"], ["Signature Image", "signatureimage"], ["Valid Till", "validtill"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { signid: 'SIG-' + (4001 + i), doctorstaffname: 'Dr. ' + (1 + i), authmethod: 'Biometric + PIN', signatureimage: 'On File', validtill: '31 Dec 2026', status: 'Active' };
      }),
  },
  "/records/documents/templates": {
    ui: 5,
    title: "Document Templates", description: "Standardized letterheads, medical certificate formats, and discharge summary layouts.",
    stats: [{ label: "Total Templates", color: "text-blue-400", value: "85" }, { label: "Most Used", color: "text-emerald-400", value: "Fitness Cert." }, { label: "Draft Templates", color: "text-amber-400", value: "3" }],
    columns: [["Template Name", "templatename"], ["Department", "department"], ["Format Type", "formattype"], ["Created By", "createdby"], ["Last Used", "lastused"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { templatename: 'Medical Leave Certificate', department: 'General', formattype: 'PDF/Word', createdby: 'Admin', lastused: 'Today', status: 'Active' };
      }),
  },
  "/records/documents/version": {
    ui: 5,
    title: "Version Control", description: "Audit trail of edits made to clinical notes or consent forms after initial saving.",
    stats: [{ label: "Edits Tracked (Today)", color: "text-blue-400", value: "45" }, { label: "Major Revisions", color: "text-amber-400", value: "5" }, { label: "Locked Documents", color: "text-emerald-400", value: "45,000" }],
    columns: [["Document ID", "documentid"], ["Patient", "patient"], ["Edit Timestamp", "edittimestamp"], ["Edited By", "editedby"], ["Previous Version", "previousversion"]],
    badge: ["Status", "status", {"Logged":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { documentid: 'DOC-' + (5001 + i), patient: 'Patient ' + (1 + i), edittimestamp: 'Today 10:00', editedby: 'Dr. Smith', previousversion: 'v1.0 (Archived)', status: 'Logged' };
      }),
  },
  "/records/him/archive": {
    ui: 5,
    title: "Digital Archive", description: "Secure, long-term storage vault for all finalized electronic health records.",
    stats: [{ label: "Archive Size", color: "text-blue-400", value: "4.5 TB" }, { label: "Files Secured", color: "text-emerald-400", value: "1.2M" }, { label: "Backup Status", color: "text-emerald-400", value: "Synced" }],
    columns: [["File ID", "fileid"], ["Patient", "patient"], ["Size", "size"], ["Encryption Level", "encryptionlevel"], ["Archive Date", "archivedate"]],
    badge: ["Status", "status", {"Secured":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { fileid: 'ARC-' + (6001 + i), patient: 'Patient ' + (1 + i), size: (12 + i) + ' MB', encryptionlevel: 'AES-256', archivedate: '01 Jan 2026', status: 'Secured' };
      }),
  },
  "/records/him/duplicate": {
    ui: 5,
    title: "Duplicate Record Check", description: "Identifying and merging duplicate patient UHIDs to maintain data integrity.",
    stats: [{ label: "Suspected Duplicates", color: "text-amber-400", value: "18" }, { label: "Merged (YTD)", color: "text-emerald-400", value: "145" }, { label: "False Positives", color: "text-blue-400", value: "12" }],
    columns: [["Potential Duplicates", "potentialduplicates"], ["Match Score", "matchscore"], ["Name 1 (UHID 1)", "name1uhid1"], ["Name 2 (UHID 2)", "name2uhid2"], ["Action", "action"]],
    badge: ["Status", "status", {"Review Needed":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { potentialduplicates: '2 Records', matchscore: (90 + i) + '%', name1: 'John D (U-101)', name2: 'J. Doe (U-504)', action: 'Merge Pending', status: 'Review Needed' };
      }),
  },
  "/records/him/incomplete": {
    ui: 5,
    title: "Incomplete Records", description: "Dashboard of partially filled forms or notes lacking critical clinical data.",
    stats: [{ label: "Incomplete Forms", color: "text-amber-400", value: "28" }, { label: "Doctors Notified", color: "text-blue-400", value: "15" }, { label: "Average Age", color: "text-amber-400", value: "4 Days" }],
    columns: [["Doc ID", "docid"], ["Document Name", "documentname"], ["Author", "author"], ["Deficiency Details", "deficiencydetails"], ["Date Flagged", "dateflagged"]],
    badge: ["Status", "status", {"Pending Doctor":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { docid: 'DOC-' + (4001 + i), documentname: 'Admission Assessment', author: 'Dr. Junior', deficiencydetails: 'Allergies not filled', dateflagged: 'Yesterday', status: 'Pending Doctor' };
      }),
  },
  "/records/him/indexing": {
    ui: 5,
    title: "Record Indexing", description: "Categorization and tagging of medical records for easy search and retrieval.",
    stats: [{ label: "Backlog to Index", color: "text-amber-400", value: "145" }, { label: "Indexed Today", color: "text-blue-400", value: "850" }, { label: "Accuracy Rate", color: "text-emerald-400", value: "99.5%" }],
    columns: [["Record ID", "recordid"], ["Patient", "patient"], ["Document Type", "documenttype"], ["Indexed By", "indexedby"], ["Tags", "tags"]],
    badge: ["Status", "status", {"Indexed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { recordid: 'REC-' + (1001 + i), patient: 'Patient ' + (1 + i), documenttype: 'Lab Report', indexedby: 'HIM Clerk', tags: 'Blood, Pathology', status: 'Indexed' };
      }),
  },
  "/records/him/missing": {
    ui: 5,
    title: "Missing Documents", description: "Tracking specific documents (e.g., consents, reports) absent from the master file.",
    stats: [{ label: "Total Deficiencies", color: "text-red-400", value: "34" }, { label: "Resolved Today", color: "text-emerald-400", value: "12" }, { label: "Escalated", color: "text-amber-400", value: "4" }],
    columns: [["UHID", "uhid"], ["Patient", "patient"], ["Encounter", "encounter"], ["Missing Document", "missingdocument"], ["Responsible Dept", "responsibledept"]],
    badge: ["Status", "status", {"Action Required":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const docs = ['Anesthesia Consent', 'ECG Report', 'Transfer Note', 'Blood Transfusion Form', 'Discharge Summary Copy'];
        return { uhid: 'UHID-' + (3001 + i), patient: 'Patient ' + (1 + i), encounter: 'IPD-' + (100 + i), missingdocument: docs[i], responsibledept: 'Ward A', status: 'Action Required' };
      }),
  },
  "/records/him/scanning": {
    ui: 5,
    title: "Document Scanning", description: "Queue management for digitization of old physical files or external reports.",
    stats: [{ label: "Pages Scanned (Mo)", color: "text-blue-400", value: "14,500" }, { label: "Pending Queue", color: "text-amber-400", value: "850" }, { label: "QA Rejects", color: "text-red-400", value: "2%" }],
    columns: [["Batch ID", "batchid"], ["Source Dept", "sourcedept"], ["Document Count", "documentcount"], ["Scanned By", "scannedby"], ["QA Check", "qacheck"]],
    badge: ["Status", "status", {"Pending QA":"amber","Digitized":"emerald","Rejected":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending QA', 'Digitized', 'Pending QA', 'Rejected', 'Digitized'];
        return { batchid: 'BCH-' + (5001 + i), sourcedept: 'OPD', documentcount: (50 + i * 10).toString(), scannedby: 'Operator 1', qacheck: statuses[i] === 'Digitized' ? 'Passed' : (statuses[i] === 'Rejected' ? 'Failed' : 'Pending'), status: statuses[i] };
      }),
  },
  "/records/infection/antibiotic": {
    ui: 5,
    title: "Antibiotic Stewardship", description: "Tracking usage of restricted antibiotics and adherence to hospital formulary.",
    stats: [{ label: "Restricted Rx (Today)", color: "text-amber-400", value: "24" }, { label: "Unapproved Uses", color: "text-red-400", value: "2" }, { label: "Stewardship Compliance", color: "text-emerald-400", value: "92%" }],
    columns: [["Patient", "patient"], ["Restricted Drug", "restricteddrug"], ["Prescriber", "prescriber"], ["Days on Drug", "daysondrug"], ["Approval Code", "approvalcode"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { patient: 'Patient ' + (1 + i), restricteddrug: 'Meropenem', prescriber: 'Dr. Critical', daysondrug: (2 + i).toString(), approvalcode: 'AUTH-' + (500 + i), status: i === 0 ? 'Pending Auth' : 'Approved' };
      }),
  },
  "/records/infection/audit": {
    ui: 5,
    title: "Infection Audit", description: "Hand hygiene compliance and environmental cleaning audits.",
    stats: [{ label: "Hand Hygiene Score", color: "text-amber-400", value: "88%" }, { label: "OT Swab Cultures", color: "text-emerald-400", value: "100% Sterile" }, { label: "Audits (Mo)", color: "text-blue-400", value: "45" }],
    columns: [["Audit Area", "auditarea"], ["Audit Type", "audittype"], ["Auditor", "auditor"], ["Score", "score"], ["Deficiencies", "deficiencies"]],
    badge: ["Status", "status", {"Audited":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { auditarea: 'ICU', audittype: 'Hand Hygiene', auditor: 'ICN Alice', score: (80 + i * 2) + '%', deficiencies: i === 0 ? 'Jewelry Worn' : 'None', status: 'Audited' };
      }),
  },
  "/records/infection/hai": {
    ui: 5,
    title: "HAI Surveillance", description: "Hospital-Acquired Infection tracking (VAP, CAUTI, CLABSI, SSI).",
    stats: [{ label: "Total HAI (Mo)", color: "text-amber-400", value: "12" }, { label: "SSI Rate", color: "text-emerald-400", value: "0.5%" }, { label: "Device Days", color: "text-blue-400", value: "1,240" }],
    columns: [["HAI ID", "haiid"], ["Patient", "patient"], ["Infection Type", "infectiontype"], ["Onset Date", "onsetdate"], ["Location", "location"]],
    badge: ["Status", "status", {"Monitored":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['VAP', 'CAUTI', 'CLABSI', 'SSI', 'VAP'];
        return { haiid: 'HAI-' + (1001 + i), patient: 'Patient ' + (1 + i), infectiontype: types[i], onsetdate: '01 Jul 2026', location: 'ICU', status: 'Monitored' };
      }),
  },
  "/records/infection/isolation": {
    ui: 5,
    title: "Isolation Monitoring", description: "Log of patients placed in contact, droplet, or airborne isolation.",
    stats: [{ label: "Active Isolations", color: "text-amber-400", value: "8" }, { label: "Negative Pressure Rooms", color: "text-blue-400", value: "4/5 Full" }, { label: "Isolation Breaches", color: "text-emerald-400", value: "0" }],
    columns: [["Patient", "patient"], ["Isolation Type", "isolationtype"], ["Ward/Room", "wardroom"], ["Start Date", "startdate"], ["End Date", "enddate"]],
    badge: ["Status", "status", {"Active":"emerald","Cleared":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['Contact', 'Airborne', 'Droplet', 'Contact', 'Airborne'];
        return { patient: 'Patient ' + (1 + i), isolationtype: types[i], wardroom: 'Iso Ward ' + (1 + i), startdate: '01 Jul 2026', enddate: i < 2 ? '-' : '05 Jul 2026', status: i < 2 ? 'Active' : 'Cleared' };
      }),
  },
  "/records/infection/reporting": {
    ui: 5,
    title: "Infection Reporting", description: "Mandatory reporting of notifiable diseases (e.g., TB, COVID, Dengue) to authorities.",
    stats: [{ label: "Notifiable Diseases (YTD)", color: "text-amber-400", value: "45" }, { label: "Reports Filed", color: "text-emerald-400", value: "45/45" }, { label: "Pending Dispatches", color: "text-emerald-400", value: "0" }],
    columns: [["Report ID", "reportid"], ["Disease Name", "diseasename"], ["Patient", "patient"], ["Reported To", "reportedto"], ["Date", "date"]],
    badge: ["Status", "status", {"Reported":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportid: 'NTR-' + (2001 + i), diseasename: 'Tuberculosis', patient: 'Patient ' + (1 + i), reportedto: 'Local Health Authority', date: 'Yesterday', status: 'Reported' };
      }),
  },
  "/records/infection/trends": {
    ui: 5,
    title: "Infection Trends", description: "Antibiogram data showing local antibiotic resistance patterns.",
    stats: [{ label: "Total Cultures Done", color: "text-blue-400", value: "850" }, { label: "MDR Organisms", color: "text-red-400", value: "12%" }, { label: "Data Updated", color: "text-emerald-400", value: "Last Month" }],
    columns: [["Organism", "organism"], ["Sample Source", "samplesource"], ["Resistant Drug 1", "resistantdrug1"], ["Resistant Drug 2", "resistantdrug2"], ["Sensitivity Trend", "sensitivitytrend"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const organisms = ['K. pneumoniae', 'MRSA', 'E. coli', 'Acinetobacter', 'P. aeruginosa'];
        return { organism: organisms[i], samplesource: 'Blood/Urine', resistantdrug1: 'Ceftriaxone', resistantdrug2: 'Ciprofloxacin', sensitivitytrend: 'Decreasing', status: 'Analyzed' };
      }),
  },
  "/records/legal/consent": {
    ui: 5,
    title: "Consent Management", description: "Centralized repository of all signed informed consents (Surgical, Anesthesia, High-Risk).",
    stats: [{ label: "Consents Signed (24H)", color: "text-blue-400", value: "124" }, { label: "Missing Consents", color: "text-emerald-400", value: "0" }, { label: "Digital Consents", color: "text-blue-400", value: "85%" }],
    columns: [["Consent ID", "consentid"], ["Patient", "patient"], ["Consent Type", "consenttype"], ["Procedure", "procedure"], ["Signed By", "signedby"]],
    badge: ["Status", "status", {"Valid":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { consentid: 'CON-' + (1001 + i), patient: 'Patient ' + (1 + i), consenttype: 'Surgical Consent', procedure: 'Appendectomy', signedby: 'Patient & Witness', status: 'Valid' };
      }),
  },
  "/records/legal/court": {
    ui: 5,
    title: "Court Cases", description: "Tracking ongoing litigation, hearings, and required hospital representations.",
    stats: [{ label: "Active Litigation", color: "text-red-400", value: "3" }, { label: "Upcoming Hearings", color: "text-amber-400", value: "1" }, { label: "Favorable Judgments", color: "text-emerald-400", value: "5" }],
    columns: [["Case No", "caseno"], ["Court Name", "courtname"], ["Hearing Date", "hearingdate"], ["Hospital Rep.", "hospitalrep"], ["Case Type", "casetype"]],
    badge: ["Status", "status", {"Ongoing":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { caseno: 'CC-' + (2025001 + i), courtname: 'District Court', hearingdate: '20 Jul 2026', hospitalrep: 'Dr. Medical Supt', casetype: 'Consumer Forum', status: 'Ongoing' };
      }),
  },
  "/records/legal/mlc": {
    ui: 5,
    title: "Medico-Legal Cases (MLC)", description: "Specialized registry for accidents, assaults, or poisonings requiring police intimation.",
    stats: [{ label: "Active MLCs", color: "text-red-400", value: "15" }, { label: "Intimations Pending", color: "text-amber-400", value: "1" }, { label: "Closed MLCs", color: "text-blue-400", value: "145" }],
    columns: [["MLC No", "mlcno"], ["Patient", "patient"], ["Incident Type", "incidenttype"], ["Intimation Sent", "intimationsent"], ["Police Station", "policestation"]],
    badge: ["Status", "status", {"Action Required":"amber","Intimated":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { mlcno: 'MLC-' + (2026001 + i), patient: 'Patient ' + (1 + i), incidenttype: 'RTA', intimationsent: i === 0 ? 'No' : 'Yes', policestation: 'City Center PS', status: i === 0 ? 'Action Required' : 'Intimated' };
      }),
  },
  "/records/legal/police": {
    ui: 5,
    title: "Police Requests", description: "Responses to police inquiries, requisition of clinical notes or CCTV footage.",
    stats: [{ label: "Pending Inquiries", color: "text-amber-400", value: "2" }, { label: "Replies Sent", color: "text-blue-400", value: "45" }, { label: "Avg Response Time", color: "text-emerald-400", value: "48 Hrs" }],
    columns: [["Req ID", "reqid"], ["Police Station", "policestation"], ["IO Name", "ioname"], ["Information Requested", "informationrequested"], ["Date Received", "datereceived"]],
    badge: ["Status", "status", {"Drafting Reply":"amber","Sent":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reqid: 'POL-' + (4001 + i), policestation: 'North PS', ioname: 'Inspector John', informationrequested: 'Treatment Dates', datereceived: 'Yesterday', status: i === 0 ? 'Drafting Reply' : 'Sent' };
      }),
  },
  "/records/legal/release": {
    ui: 5,
    title: "Record Release Approval", description: "Final Medical Superintendent/Legal approval before handing any record to a third party.",
    stats: [{ label: "Pending Approvals", color: "text-amber-400", value: "5" }, { label: "Approved (Today)", color: "text-emerald-400", value: "12" }, { label: "Rejected", color: "text-red-400", value: "2" }],
    columns: [["Approval ID", "approvalid"], ["Patient", "patient"], ["Requesting Party", "requestingparty"], ["Documents Included", "documentsincluded"], ["Approver", "approver"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { approvalid: 'REL-' + (5001 + i), patient: 'Patient ' + (1 + i), requestingparty: 'Insurance TPA', documentsincluded: 'Discharge, Labs', approver: 'MS Office', status: i < 2 ? 'Pending Auth' : 'Approved' };
      }),
  },
  "/records/legal/requests": {
    ui: 5,
    title: "Legal Requests", description: "Managing subpoenas and formal requests from lawyers or courts for patient records.",
    stats: [{ label: "Open Subpoenas", color: "text-amber-400", value: "4" }, { label: "Records Sent (YTD)", color: "text-blue-400", value: "24" }, { label: "Overdue Replies", color: "text-emerald-400", value: "0" }],
    columns: [["Req ID", "reqid"], ["Requestor", "requestor"], ["Patient", "patient"], ["Deadline", "deadline"], ["Lawyer Assigned", "lawyerassigned"]],
    badge: ["Status", "status", {"Pending Preparation":"gray","Dispatched":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reqid: 'LGL-' + (3001 + i), requestor: 'Advocate Smith', patient: 'Patient ' + (1 + i), deadline: '15 Jul 2026', lawyerassigned: 'Hospital Counsel', status: i === 0 ? 'Pending Preparation' : 'Dispatched' };
      }),
  },
  "/records/medical/archived": {
    ui: 5,
    title: "Archived Records", description: "Historical patient files securely stored as per statutory retention policies.",
    stats: [{ label: "Total Archived", color: "text-blue-400", value: "45,200" }, { label: "Due for Destruction", color: "text-amber-400", value: "120" }, { label: "Digitized %", color: "text-emerald-400", value: "85%" }],
    columns: [["Archive ID", "archiveid"], ["UHID", "uhid"], ["Patient", "patient"], ["Archived Date", "archiveddate"], ["Retention Till", "retentiontill"]],
    badge: ["Status", "status", {"Securely Archived":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { archiveid: 'ARC-' + (5001 + i), uhid: 'UHID-' + (500 + i), patient: 'Patient ' + (1 + i), archivedate: '01 Jan 2020', retentiontill: '01 Jan 2030', status: 'Securely Archived' };
      }),
  },
  "/records/medical/emergency": {
    ui: 5,
    title: "Emergency Records", description: "Rapid documentation and triage logs for emergency department cases.",
    stats: [{ label: "ER Cases (24H)", color: "text-red-400", value: "85" }, { label: "Admitted from ER", color: "text-amber-400", value: "24" }, { label: "MLC Cases", color: "text-red-400", value: "5" }],
    columns: [["ER No", "erno"], ["Patient", "patient"], ["Triage Level", "triagelevel"], ["Arrival Time", "arrivaltime"], ["Disposition", "disposition"]],
    badge: ["Status", "status", {"Stabilized":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const levels = ['Red (Resuscitation)', 'Yellow (Emergent)', 'Green (Urgent)', 'Yellow', 'Green'];
        const dispositions = ['Admitted to ICU', 'Under Observation', 'Discharged', 'Admitted to Ward', 'Discharged'];
        return { erno: 'ER-' + (4001 + i), patient: 'Patient ' + (1 + i), triagelevel: levels[i], arrivaltime: 'Today 10:' + (10 + i * 5), disposition: dispositions[i], status: 'Stabilized' };
      }),
  },
  "/records/medical/ipd": {
    ui: 5,
    title: "IPD Records", description: "Comprehensive inpatient case sheets from admission to discharge.",
    stats: [{ label: "Active IPD Cases", color: "text-blue-400", value: "340" }, { label: "Discharged (Mo)", color: "text-emerald-400", value: "850" }, { label: "Files Pending Closure", color: "text-amber-400", value: "45" }],
    columns: [["IPD No", "ipdno"], ["Patient", "patient"], ["Ward/Bed", "wardbed"], ["Admission Date", "admissiondate"], ["Discharge Date", "dischargedate"]],
    badge: ["Status", "status", {"Admitted":"gray","Discharged (File Open)":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i === 1 ? 'Discharged (File Open)' : 'Admitted';
        return { ipdno: 'IPD-' + (3001 + i), patient: 'Patient ' + (1 + i), wardbed: 'Ward A / Bed ' + (10 + i), admissiondate: '01 Jul 2026', dischargedate: statuses === 'Admitted' ? '-' : '05 Jul 2026', status: statuses };
      }),
  },
  "/records/medical/opd": {
    ui: 5,
    title: "OPD Records", description: "Outpatient consultation notes, prescriptions, and follow-up data.",
    stats: [{ label: "OPD Visits (Mo)", color: "text-blue-400", value: "4,500" }, { label: "Prescriptions Gen", color: "text-emerald-400", value: "4,200" }, { label: "Follow-ups Due", color: "text-amber-400", value: "150" }],
    columns: [["Visit ID", "visitid"], ["UHID", "uhid"], ["Patient", "patient"], ["Consulting Dept", "consultingdept"], ["Date", "date"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { visitid: 'OPD-' + (2001 + i), uhid: 'UHID-' + (10001 + i), patient: 'Patient ' + (1 + i), consultingdept: 'Cardiology', date: 'Today', status: 'Completed' };
      }),
  },
  "/records/medical/patient": {
    ui: 5,
    title: "Patient Medical Records", description: "Central repository of all longitudinal patient health records (EMR).",
    stats: [{ label: "Total Active Records", color: "text-blue-400", value: "124,500" }, { label: "Updated Today", color: "text-emerald-400", value: "450" }, { label: "Missing Data", color: "text-red-400", value: "12" }],
    columns: [["UHID", "uhid"], ["Patient Name", "patientname"], ["Last Visit", "lastvisit"], ["Primary Doctor", "primarydoctor"], ["Record Status", "recordstatus"]],
    badge: ["Status", "status", {"Active":"emerald","Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Complete', 'Pending Updates', 'Complete', 'Archived', 'Complete'];
        return { uhid: 'UHID-' + (10001 + i), patientname: 'Patient ' + (i + 1), lastvisit: '01 Jul 2026', primarydoctor: 'Dr. Smith', recordstatus: statuses[i], status: statuses[i] === 'Complete' ? 'Active' : 'Review' };
      }),
  },
  "/records/medical/requests": {
    ui: 5,
    title: "Record Requests", description: "Internal requests from doctors or departments for physical file retrieval.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "12" }, { label: "Fulfilled Today", color: "text-emerald-400", value: "34" }, { label: "Avg TAT", color: "text-blue-400", value: "15 Mins" }],
    columns: [["Req ID", "reqid"], ["Requested By", "requestedby"], ["UHID", "uhid"], ["Purpose", "purpose"], ["Date", "date"]],
    badge: ["Status", "status", {"Pending Auth":"amber","Dispatched":"emerald","Returned":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = ['Pending Auth', 'Dispatched', 'Pending Auth', 'Returned', 'Dispatched'];
        return { reqid: 'REQ-' + (6001 + i), requestedby: 'Dr. Jones', uhid: 'UHID-' + (100 + i), purpose: 'Surgical Planning', date: 'Today', status: statuses[i] };
      }),
  },
  "/records/medical/tracking": {
    ui: 5,
    title: "Record Tracking", description: "Barcode/RFID tracking system for movement of physical medical files.",
    stats: [{ label: "Files in Circulation", color: "text-blue-400", value: "145" }, { label: "Overdue Returns", color: "text-red-400", value: "8" }, { label: "Lost Files", color: "text-emerald-400", value: "0" }],
    columns: [["File No", "fileno"], ["UHID", "uhid"], ["Current Location", "currentlocation"], ["Issued To", "issuedto"], ["Issued On", "issuedon"]],
    badge: ["Status", "status", {"Checked Out":"blue","Overdue":"red","In Transit":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i === 1 ? 'Overdue' : (i === 3 ? 'In Transit' : 'Checked Out');
        return { fileno: 'FIL-' + (7001 + i), uhid: 'UHID-' + (200 + i), currentlocation: i === 3 ? 'Transport Staff' : 'Ward A', issuedto: 'Nurse Mary', issuedon: 'Yesterday', status: statuses };
      }),
  },
  "/records/quality/capa": {
    ui: 5,
    title: "CAPA", description: "Corrective and Preventive Actions tracking arising from audits or RCAs.",
    stats: [{ label: "Total Open CAPAs", color: "text-amber-400", value: "15" }, { label: "Overdue Actions", color: "text-red-400", value: "2" }, { label: "Closed (Mo)", color: "text-emerald-400", value: "8" }],
    columns: [["CAPA ID", "capaid"], ["Source", "source"], ["Action Description", "actiondescription"], ["Assigned To", "assignedto"], ["Deadline", "deadline"]],
    badge: ["Status", "status", {"Overdue":"red","In Progress":"amber","Closed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const statuses = i === 0 ? 'Overdue' : (i === 1 ? 'In Progress' : 'Closed');
        return { capaid: 'CAPA-' + (4001 + i), source: 'Internal Audit', actiondescription: 'Update hand hygiene SOP', assignedto: 'Infection Control Officer', deadline: '30 Jun 2026', status: statuses };
      }),
  },
  "/records/quality/indicators": {
    ui: 5,
    title: "Quality Indicators", description: "Hospital-wide clinical and managerial quality metrics (NABH/JCI based).",
    stats: [{ label: "Total Indicators", color: "text-blue-400", value: "64" }, { label: "Meeting Targets", color: "text-emerald-400", value: "58" }, { label: "Falling Short", color: "text-red-400", value: "6" }],
    columns: [["Indicator ID", "indicatorid"], ["Domain", "domain"], ["Indicator Name", "indicatorname"], ["Target", "target"], ["Current Value", "currentvalue"]],
    badge: ["Status", "status", {"Monitored":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Time to Initial Assessment', 'Medication Error Rate', 'Return to ICU < 48h', 'Patient Satisfaction Score', 'Bed Occupancy Rate'];
        const targets = ['< 15 Mins', '0%', '< 2%', '> 90%', '75-85%'];
        const currents = ['12 Mins', '0.1%', '1.5%', '92%', '82%'];
        return { indicatorid: 'QI-' + (101 + i), domain: 'Clinical', indicatorname: names[i], target: targets[i], currentvalue: currents[i], status: 'Monitored' };
      }),
  },
  "/records/quality/kpi": {
    ui: 5,
    title: "Quality KPI Dashboard", description: "Executive dashboard visualizing performance across all quality parameters.",
    stats: [{ label: "Hospital Quality Score", color: "text-blue-400", value: "94%" }, { label: "Top Quality Dept", color: "text-emerald-400", value: "ICU" }, { label: "Requires Action", color: "text-amber-400", value: "2 Depts" }],
    columns: [["Department", "department"], ["KPI Metric", "kpimetric"], ["Target", "target"], ["Achieved", "achieved"], ["Variance", "variance"]],
    badge: ["Status", "status", {"Action Needed":"amber","On Track":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { department: 'Dept ' + (1 + i), kpimetric: 'Overall Compliance', target: '95%', achieved: (90 + i) + '%', variance: (i - 5) + '%', status: i < 2 ? 'Action Needed' : 'On Track' };
      }),
  },
  "/records/quality/near-miss": {
    ui: 5,
    title: "Near Miss Events", description: "Reporting of errors caught just before they reached the patient (Good Catches).",
    stats: [{ label: "Good Catches (Mo)", color: "text-blue-400", value: "12" }, { label: "Top Reporting Dept", color: "text-emerald-400", value: "Pharmacy" }, { label: "Reward Points Distributed", color: "text-amber-400", value: "120" }],
    columns: [["Report ID", "reportid"], ["Date", "date"], ["Reported By", "reportedby"], ["Event Description", "eventdescription"], ["Harm Prevented", "harmprevented"]],
    badge: ["Status", "status", {"Acknowledged":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportid: 'NMR-' + (2001 + i), date: 'Today', reportedby: 'Nurse Alice', eventdescription: 'Look-alike drug dispensed', harmprevented: 'Adverse Drug Event', status: 'Acknowledged' };
      }),
  },
  "/records/quality/patient-safety": {
    ui: 5,
    title: "Patient Safety", description: "Specific indicators tracking falls, bedsores, and medication safety.",
    stats: [{ label: "Patient Falls (Mo)", color: "text-amber-400", value: "2" }, { label: "HAPU (Bedsores)", color: "text-emerald-400", value: "0" }, { label: "Safety Score", color: "text-emerald-400", value: "98/100" }],
    columns: [["Safety Area", "safetyarea"], ["Metric", "metric"], ["Occurrences (Mo)", "occurrencesmo"], ["Severity Level", "severitylevel"], ["Trend", "trend"]],
    badge: ["Status", "status", {"Compliant":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const areas = ['Patient Falls', 'Pressure Ulcers', 'Medication Errors', 'Patient Identification', 'Surgical Safety'];
        return { safetyarea: areas[i], metric: 'Incidents/1000 Patient Days', occurrences: i === 0 ? '2' : '0', severitylevel: i === 0 ? 'Low' : 'None', trend: 'Stable', status: 'Compliant' };
      }),
  },
  "/records/quality/rca": {
    ui: 5,
    title: "Root Cause Analysis (RCA)", description: "Structured problem-solving (Fishbone/5 Whys) for identified quality failures.",
    stats: [{ label: "Open RCAs", color: "text-amber-400", value: "3" }, { label: "Avg Completion Time", color: "text-blue-400", value: "14 Days" }, { label: "Corrective Actions Formed", color: "text-emerald-400", value: "18" }],
    columns: [["RCA ID", "rcaid"], ["Linked Event", "linkedevent"], ["Methodology", "methodology"], ["Lead Investigator", "leadinvestigator"], ["Target Date", "targetdate"]],
    badge: ["Status", "status", {"In Progress":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { rcaid: 'RCA-' + (3001 + i), linkedevent: 'INC-' + (100 + i), methodology: '5 Whys', leadinvestigator: 'Quality Head', targetdate: '15 Jul 2026', status: i === 0 ? 'In Progress' : 'Completed' };
      }),
  },
  "/records/quality/sentinel": {
    ui: 5,
    title: "Sentinel Events", description: "Logging and immediate investigation of severe, unexpected patient harm events.",
    stats: [{ label: "Sentinel Events (YTD)", color: "text-red-400", value: "1" }, { label: "Open Investigations", color: "text-emerald-400", value: "0" }, { label: "Days Since Last Event", color: "text-emerald-400", value: "214" }],
    columns: [["Event ID", "eventid"], ["Date & Time", "datetime"], ["Event Description", "eventdescription"], ["Location", "location"], ["Immediate Action", "immediateaction"]],
    badge: ["Status", "status", {"Closed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 2 }).map((_, i) => {
        return { eventid: 'SNT-' + (1001 + i), datetime: '15 Nov 2025', eventdescription: 'Wrong site surgery (near miss)', location: 'OT 2', immediateaction: 'Procedure Halted', status: 'Closed' };
      }),
  },
  "/records/reports/audit": {
    ui: 5,
    title: "Audit Reports", description: "Output of clinical and documentation audits for department heads.",
    stats: [{ label: "Audits Completed (YTD)", color: "text-blue-400", value: "124" }, { label: "Action Items Open", color: "text-red-400", value: "15" }, { label: "Continuous Improv.", color: "text-emerald-400", value: "+4%" }],
    columns: [["Audit Topic", "audittopic"], ["Department", "department"], ["Audit Period", "auditperiod"], ["Overall Score", "overallscore"], ["Auditor", "auditor"]],
    badge: ["Status", "status", {"Published":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { audittopic: 'Prescription Quality', department: 'Cardiology', auditperiod: 'Q2 2026', overallscore: (88 + i) + '%', auditor: 'Clinical Pharmacy', status: 'Published' };
      }),
  },
  "/records/reports/coding": {
    ui: 5,
    title: "Coding Reports", description: "Summary of ICD/CPT codes assigned and frequency of specific diseases.",
    stats: [{ label: "Top ICD-10 Code", color: "text-blue-400", value: "I10 (Hypertension)" }, { label: "Uncoded Cases", color: "text-amber-400", value: "24" }, { label: "Coding TAT", color: "text-emerald-400", value: "24 Hrs" }],
    columns: [["Report Name", "reportname"], ["Department", "department"], ["Top Diagnosis", "topdiagnosis"], ["Case Count", "casecount"], ["Exported On", "exportedon"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportname: 'Morbidity Profile', department: 'Medicine', topdiagnosis: 'Essential Hypertension', casecount: '450', exportedon: '01 Jul 2026', status: 'Generated' };
      }),
  },
  "/records/reports/completion": {
    ui: 5,
    title: "Record Completion Reports", description: "Tracking which doctors have the highest number of incomplete patient files.",
    stats: [{ label: "Total Deficient Files", color: "text-amber-400", value: "45" }, { label: "Avg Delay", color: "text-blue-400", value: "3 Days" }, { label: "Privileges Suspended", color: "text-emerald-400", value: "0" }],
    columns: [["Doctor Name", "doctorname"], ["Department", "department"], ["Incomplete Files", "incompletefiles"], ["Avg Delay", "avgdelay"], ["Action Taken", "actiontaken"]],
    badge: ["Status", "status", {"Action Required":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { doctorname: 'Dr. ' + (1 + i), department: 'Surgery', incompletefiles: (5 - i).toString(), avgdelay: (4 - i) + ' Days', actiontaken: i === 0 ? 'Warning Sent' : 'Reminded', status: 'Action Required' };
      }),
  },
  "/records/reports/compliance": {
    ui: 5,
    title: "Compliance Reports", description: "Summary of statutory reporting (MLCs, Births, Deaths, Notifiable diseases).",
    stats: [{ label: "Filings Due This Week", color: "text-amber-400", value: "2" }, { label: "Late Filings", color: "text-emerald-400", value: "0" }, { label: "Total Compliance", color: "text-emerald-400", value: "100%" }],
    columns: [["Compliance Area", "compliancearea"], ["Report Frequency", "reportfrequency"], ["Last Submitted", "lastsubmitted"], ["Authority", "authority"], ["Filing Ref", "filingref"]],
    badge: ["Status", "status", {"Filed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const areas = ['Birth Register', 'Death Register', 'MLC Register', 'Biomedical Waste', 'Notifiable Diseases'];
        return { compliancearea: areas[i], reportfrequency: 'Monthly', lastsubmitted: '01 Jul 2026', authority: 'Municipal Corp', filingref: 'REF-2026-' + (10 + i), status: 'Filed' };
      }),
  },
  "/records/reports/infection": {
    ui: 5,
    title: "Infection Reports", description: "Epidemiological data, HAI rates, and antibiograms for the Infection Control Committee.",
    stats: [{ label: "HAI Rate (Overall)", color: "text-emerald-400", value: "1.2%" }, { label: "SSI Rate (Surgeries)", color: "text-emerald-400", value: "0.4%" }, { label: "Committee Meetings", color: "text-blue-400", value: "Monthly" }],
    columns: [["Report Focus", "reportfocus"], ["Date Range", "daterange"], ["Key Finding", "keyfinding"], ["Reported To", "reportedto"], ["Format", "format"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportfocus: 'ICU Device Days & VAP', daterange: 'Last Month', keyfinding: 'No VAP reported', reportedto: 'ICC Board', format: 'Excel/PDF', status: 'Generated' };
      }),
  },
  "/records/reports/medical": {
    ui: 5,
    title: "Medical Record Reports", description: "Statistics on records created, accessed, and archived.",
    stats: [{ label: "Reports Generated (Mo)", color: "text-blue-400", value: "45" }, { label: "Auto-Scheduled", color: "text-emerald-400", value: "8" }, { label: "Avg Generation Time", color: "text-blue-400", value: "4s" }],
    columns: [["Report Type", "reporttype"], ["Date Range", "daterange"], ["Generated On", "generatedon"], ["Generated By", "generatedby"], ["Format", "format"]],
    badge: ["Status", "status", {"Ready":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reporttype: 'New IPD Files Summary', daterange: 'Last 7 Days', generatedon: 'Today', generatedby: 'System', format: 'PDF', status: 'Ready' };
      }),
  },
  "/records/reports/nabh": {
    ui: 5,
    title: "NABH Reports", description: "Structured reports formatted exactly as required for NABH submission.",
    stats: [{ label: "Mandatory Reports", color: "text-blue-400", value: "24" }, { label: "Data Completeness", color: "text-emerald-400", value: "100%" }, { label: "Pending Sign-off", color: "text-amber-400", value: "2" }],
    columns: [["Report Title", "reporttitle"], ["NABH Chapter", "nabhchapter"], ["Reporting Month", "reportingmonth"], ["Data Points", "datapoints"], ["Validation", "validation"]],
    badge: ["Status", "status", {"Drafting":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reporttitle: 'Quality Indicators CQI', nabhchapter: 'CQI', reportingmonth: 'June 2026', datapoints: '64 KPIs', validation: 'Pending MS Sign-off', status: 'Drafting' };
      }),
  },
  "/records/roi/corporate": {
    ui: 5,
    title: "Corporate Requests", description: "Pre-employment or annual health check reports sent to corporate HR partners.",
    stats: [{ label: "Pending Dispatches", color: "text-amber-400", value: "2" }, { label: "Batches Sent (Mo)", color: "text-blue-400", value: "15" }, { label: "Total Emp Covered", color: "text-emerald-400", value: "850" }],
    columns: [["Batch ID", "batchid"], ["Corporate Name", "corporatename"], ["Employee Count", "employeecount"], ["Assessment Type", "assessmenttype"], ["Sent Date", "sentdate"]],
    badge: ["Status", "status", {"Compiling":"amber","Sent":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { batchid: 'CORP-' + (3001 + i), corporatename: 'Tech Corp Ltd', employeecount: '45', assessmenttype: 'Pre-Employment', sentdate: i === 0 ? '-' : '01 Jul 2026', status: i === 0 ? 'Compiling' : 'Sent' };
      }),
  },
  "/records/roi/government": {
    ui: 5,
    title: "Government Requests", description: "Requests from health ministries or municipal bodies (e.g., birth/death stats).",
    stats: [{ label: "Statutory Reports", color: "text-amber-400", value: "4 Due" }, { label: "Compliance", color: "text-emerald-400", value: "100%" }, { label: "Last Submitted", color: "text-emerald-400", value: "Today" }],
    columns: [["Req ID", "reqid"], ["Govt Department", "govtdepartment"], ["Data Requested", "datarequested"], ["Filing Frequency", "filingfrequency"], ["Deadline", "deadline"]],
    badge: ["Status", "status", {"Compiled":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reqid: 'GOV-' + (4001 + i), govtdepartment: 'Municipal Corp', datarequested: 'Birth Register (June)', filingfrequency: 'Monthly', deadline: '05 Jul 2026', status: 'Compiled' };
      }),
  },
  "/records/roi/insurance": {
    ui: 5,
    title: "Insurance Requests", description: "Requests from TPA/Insurance companies for claims verification.",
    stats: [{ label: "Open Queries", color: "text-amber-400", value: "34" }, { label: "Sent (Today)", color: "text-emerald-400", value: "45" }, { label: "Denials due to Docs", color: "text-emerald-400", value: "0" }],
    columns: [["Req ID", "reqid"], ["TPA Name", "tpaname"], ["Patient (Claim ID)", "patientclaimid"], ["Requested Docs", "requesteddocs"], ["Due Date", "duedate"]],
    badge: ["Status", "status", {"Pending Upload":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reqid: 'TPA-' + (2001 + i), tpaname: 'Star Health', patient: 'Patient ' + (1 + i), requesteddocs: 'Indoor Case Papers', duedate: 'Tomorrow', status: 'Pending Upload' };
      }),
  },
  "/records/roi/legal": {
    ui: 5,
    title: "Legal Requests", description: "Subpoenas and court orders for medical records (overlaps with Legal but focused on fulfillment).",
    stats: [{ label: "Pending Prep", color: "text-red-400", value: "3" }, { label: "Awaiting Auth", color: "text-amber-400", value: "1" }, { label: "Dispatched (YTD)", color: "text-blue-400", value: "24" }],
    columns: [["Req ID", "reqid"], ["Requestor", "requestor"], ["Patient", "patient"], ["Documents Prepared", "documentsprepared"], ["Verification", "verification"]],
    badge: ["Status", "status", {"Ready for Dispatch":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reqid: 'LGL-ROI-' + (5001 + i), requestor: 'City Court', patient: 'Patient ' + (1 + i), documentsprepared: 'Yes', verification: 'Legal Head Signed', status: 'Ready for Dispatch' };
      }),
  },
  "/records/roi/patient": {
    ui: 5,
    title: "Patient Requests", description: "Requests directly from patients for copies of their own medical records.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "12" }, { label: "Fulfilled (YTD)", color: "text-blue-400", value: "1,240" }, { label: "Avg Processing Time", color: "text-emerald-400", value: "24 Hrs" }],
    columns: [["Request ID", "requestid"], ["Patient", "patient"], ["Purpose", "purpose"], ["Date Received", "datereceived"], ["Expected TAT", "expectedtat"]],
    badge: ["Status", "status", {"Processing":"amber","Dispatched":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { requestid: 'ROI-' + (1001 + i), patient: 'Patient ' + (1 + i), purpose: 'Personal Keep', datereceived: 'Yesterday', expectedtat: '48 Hrs', status: i === 0 ? 'Processing' : 'Dispatched' };
      }),
  },
  "/records/roi/workflow": {
    ui: 5,
    title: "Approval Workflow", description: "Internal queue for Medical Records Dept head to authorize outgoing information.",
    stats: [{ label: "Pending My Auth", color: "text-amber-400", value: "18" }, { label: "Approved (Today)", color: "text-emerald-400", value: "45" }, { label: "Revenue from ROI", color: "text-blue-400", value: "$450" }],
    columns: [["Auth ID", "authid"], ["Request Source", "requestsource"], ["Patient", "patient"], ["Information Type", "informationtype"], ["Fee Collected", "feecollected"]],
    badge: ["Status", "status", {"Pending Auth":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { authid: 'AUTH-' + (6001 + i), requestsource: 'Patient', patient: 'Patient ' + (1 + i), informationtype: 'Full Medical Record', feecollected: 'Paid ($10)', status: 'Pending Auth' };
      }),
  },
  "/records/settings/audit": {
    ui: 5,
    title: "Audit Templates", description: "Creating custom checklists and scoring logic for internal clinical audits.",
    stats: [{ label: "Configured Audits", color: "text-blue-400", value: "24" }, { label: "Automated Scoring", color: "text-emerald-400", value: "Enabled" }, { label: "Scheduled Audits", color: "text-blue-400", value: "8/Month" }],
    columns: [["Audit Name", "auditname"], ["Questions", "questions"], ["Scoring Type", "scoringtype"], ["Applicable Depts", "applicabledepts"], ["Frequency", "frequency"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { auditname: 'Nursing Handover Audit', questions: '15', scoringtype: 'Percentage (0-100)', applicabledepts: 'All IPD', frequency: 'Weekly', status: 'Active' };
      }),
  },
  "/records/settings/compliance": {
    ui: 5,
    title: "Compliance Rules", description: "Setting up automated alerts and escalation matrices for missing signatures or documents.",
    stats: [{ label: "Active Rules", color: "text-blue-400", value: "15" }, { label: "Auto-escalations (YTD)", color: "text-amber-400", value: "145" }, { label: "System Locks", color: "text-red-400", value: "12" }],
    columns: [["Rule Name", "rulename"], ["Trigger Condition", "triggercondition"], ["Alert Timing", "alerttiming"], ["Escalation To", "escalationto"], ["Auto-Locking", "autolocking"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { rulename: 'Discharge Summary Sign', triggercondition: 'Missing > 24H', alerttiming: '24H post discharge', escalationto: 'Dept Head', autolocking: 'At 48H', status: 'Active' };
      }),
  },
  "/records/settings/icd": {
    ui: 5,
    title: "ICD Master", description: "Configuration and mapping of the International Classification of Diseases database.",
    stats: [{ label: "Total ICD-10 Codes", color: "text-blue-400", value: "72,184" }, { label: "Custom Mappings", color: "text-emerald-400", value: "4,500" }, { label: "Last DB Update", color: "text-blue-400", value: "Jan 2026" }],
    columns: [["ICD Code", "icdcode"], ["Description", "description"], ["Category", "category"], ["Mapped CPT", "mappedcpt"], ["Active Status", "activestatus"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { icdcode: 'A0' + i + '.0', description: 'Infectious disease type ' + i, category: 'Infectious', mappedcpt: 'Multiple', activestatus: 'Yes', status: 'Active' };
      }),
  },
  "/records/settings/quality": {
    ui: 5,
    title: "Quality Indicators Settings", description: "Defining formulas, data sources, and benchmarks for all KPIs.",
    stats: [{ label: "Active Indicators", color: "text-blue-400", value: "64" }, { label: "Automated Data Collection", color: "text-emerald-400", value: "48" }, { label: "Manual Entry", color: "text-amber-400", value: "16" }],
    columns: [["Indicator", "indicator"], ["Numerator", "numerator"], ["Denominator", "denominator"], ["Target/Benchmark", "targetbenchmark"], ["Source Dept", "sourcedept"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { indicator: 'Medication Errors', numerator: 'No of Errors', denominator: 'Total Patient Days', targetbenchmark: '0', sourcedept: 'Pharmacy/Nursing', status: 'Active' };
      }),
  },
  "/records/settings/retention": {
    ui: 5,
    title: "Record Retention Policy", description: "Configuring statutory timeframes for archiving and purging physical/digital records.",
    stats: [{ label: "Retention Policies", color: "text-blue-400", value: "12" }, { label: "Files on Legal Hold", color: "text-red-400", value: "45" }, { label: "Next Purge Cycle", color: "text-amber-400", value: "Dec 2026" }],
    columns: [["Record Type", "recordtype"], ["Retention Period (Adult)", "retentionperiodadult"], ["Retention Period (Minor)", "retentionperiodminor"], ["Action Post Retention", "actionpostretention"], ["Legal Hold", "legalhold"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['OPD Records', 'IPD Records', 'MLC Records', 'Birth/Death Records', 'Consents'];
        return { recordtype: types[i], retentionperiodadult: i === 2 ? 'Lifetime' : '5 Years', retentionperiodminor: 'Till age 21', actionpostretention: 'Secure Destruction', legalhold: 'No', status: 'Active' };
      }),
  },
  "/records/settings/templates": {
    ui: 5,
    title: "Document Templates Settings", description: "Builder interface for creating dynamic clinical forms and discharge summaries.",
    stats: [{ label: "Dynamic Forms", color: "text-blue-400", value: "124" }, { label: "Print Templates", color: "text-emerald-400", value: "45" }, { label: "Drafts", color: "text-amber-400", value: "3" }],
    columns: [["Template Name", "templatename"], ["Target Entity", "targetentity"], ["Fields Count", "fieldscount"], ["Last Edited By", "lasteditedby"], ["Version", "version"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { templatename: 'Cardio Assessment Form', targetentity: 'OPD Encounter', fieldscount: (20 + i * 5).toString(), lasteditedby: 'Admin', version: 'v1.' + i, status: 'Active' };
      }),
  },
  "/reports/admission": {
    ui: 0,
    title: "Admission & Discharge Reports", description: "Trends and statistics on hospital admissions.",
    stats: [{ label: "Admissions (MTD)", color: "text-blue-400", value: "842" }, { label: "Avg LOS", color: "text-emerald-400", value: "4.2 Days" }, { label: "Occupancy Rate", color: "text-blue-400", value: "82%" }],
    columns: [["Period", "period"], ["Total Admissions", "totaladmissions"], ["Total Discharges", "totaldischarges"], ["Net Change", "netchange"], ["Avg Length of Stay", "avglengthofstay"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const periods = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month'];
        const adms = ['45', '42', '310', '290', '1,240'];
        const dis = ['38', '45', '280', '300', '1,100'];
        const nets = ['+7', '-3', '+30', '-10', '+140'];
        const los = ['N/A', 'N/A', '4.1 Days', '4.3 Days', '4.2 Days'];
        return { period: periods[i], totaladmissions: adms[i], totaldischarges: dis[i], netchange: nets[i], avglengthofstay: los[i], status: 'Generated' };
      }),
  },
  "/reports/queue": {
    ui: 0,
    title: "Queue & Wait Time Reports", description: "Analysis of patient waiting times across departments.",
    stats: [{ label: "Global Avg Wait", color: "text-emerald-400", value: "14 mins" }, { label: "Longest Queue", color: "text-amber-400", value: "Orthopedics" }, { label: "SLA Breaches", color: "text-red-400", value: "1.2%" }],
    columns: [["Department", "department"], ["Total Patients", "totalpatients"], ["Avg Wait Time", "avgwaittime"], ["Max Wait Time", "maxwaittime"], ["Service Time", "servicetime"]],
    badge: ["Status", "status", {"Optimal":"emerald","Warning":"amber","Normal":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Cardiology', 'Orthopedics', 'Pediatrics', 'General Med', 'Dental'];
        const pats = ['145', '210', '180', '320', '85'];
        const avg = ['12 mins', '25 mins', '10 mins', '15 mins', '8 mins'];
        const max = ['30 mins', '55 mins', '25 mins', '45 mins', '15 mins'];
        const serv = ['20 mins', '15 mins', '15 mins', '10 mins', '30 mins'];
        const statuses = ['Optimal', 'Warning', 'Optimal', 'Normal', 'Optimal'];
        return { department: depts[i], totalpatients: pats[i], avgwaittime: avg[i], maxwaittime: max[i], servicetime: serv[i], status: statuses[i] };
      }),
  },
  "/reports/reception-performance": {
    ui: 0,
    title: "Reception Performance", description: "KPIs and metrics for front desk staff efficiency.",
    stats: [{ label: "Avg Reg Time", color: "text-emerald-400", value: "3m 45s" }, { label: "Total Handled", color: "text-blue-400", value: "1,240" }, { label: "Overall Satisfaction", color: "text-emerald-400", value: "4.8/5.0" }],
    columns: [["Staff Name", "staffname"], ["Patients Handled", "patientshandled"], ["Avg Registration Time", "avgregistrationtime"], ["Calls Answered", "callsanswered"], ["Feedback Score", "feedbackscore"]],
    badge: ["Status", "status", {"Excellent":"emerald","Good":"emerald","Average":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Pam Beesly', 'Erin Hannon', 'Kelly Kapoor', 'Angela Martin', 'Phyllis Vance'];
        const pats = ['145', '120', '95', '110', '105'];
        const times = ['3m 15s', '4m 00s', '3m 45s', '2m 50s', '4m 15s'];
        const calls = ['45', '60', '85', '30', '40'];
        const scores = ['4.9/5', '4.7/5', '4.2/5', '4.8/5', '4.6/5'];
        const statuses = ['Excellent', 'Good', 'Average', 'Excellent', 'Good'];
        return { staffname: names[i], patientshandled: pats[i], avgregistrationtime: times[i], callsanswered: calls[i], feedbackscore: scores[i], status: statuses[i] };
      }),
  },
  "/reports/registration": {
    ui: 0,
    title: "Registration Reports", description: "Analytics on new patient registrations and demographics.",
    stats: [{ label: "Registrations (MTD)", color: "text-blue-400", value: "1,240" }, { label: "Growth", color: "text-emerald-400", value: "+15%" }, { label: "Online Share", color: "text-emerald-400", value: "65%" }],
    columns: [["Date Range", "daterange"], ["Total Registrations", "totalregistrations"], ["Online", "online"], ["Walk-in", "walkin"], ["Revenue Impact", "revenueimpact"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const ranges = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month'];
        const totals = ['124', '115', '840', '790', '3,450'];
        const onlines = ['80', '75', '550', '500', '2,200'];
        const walkins = ['44', '40', '290', '290', '1,250'];
        const revenues = ['$2,480', '$2,300', '$16,800', '$15,800', '$69,000'];
        return { daterange: ranges[i], totalregistrations: totals[i], online: onlines[i], walkin: walkins[i], revenueimpact: revenues[i], status: 'Generated' };
      }),
  },
  "/reports/visitor": {
    ui: 0,
    title: "Visitor Tracking Reports", description: "Security and footfall reports for facility visitors.",
    stats: [{ label: "Total Footfall", color: "text-blue-400", value: "1,450" }, { label: "Busiest Gate", color: "text-amber-400", value: "Main Entrance" }, { label: "Security Alerts", color: "text-red-400", value: "2" }],
    columns: [["Location/Gate", "locationgate"], ["Total Entries", "totalentries"], ["Peak Hour", "peakhour"], ["Avg Stay", "avgstay"], ["Security Flags", "securityflags"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const locs = ['Main Entrance', 'ER Gate', 'Staff Entrance', 'Parking A', 'VIP Entry'];
        const entries = ['850', '210', '145', '300', '25'];
        const peaks = ['10:00 AM - 11:00 AM', '08:00 PM - 09:00 PM', '08:00 AM - 09:00 AM', '10:00 AM - 11:00 AM', 'N/A'];
        const stays = ['1h 15m', '45m', '8h 30m', '2h 0m', '1h 0m'];
        const flags = ['1', '1', '0', '0', '0'];
        return { locationgate: locs[i], totalentries: entries[i], peakhour: peaks[i], avgstay: stays[i], securityflags: flags[i], status: 'Generated' };
      }),
  },
};

export default pages;
