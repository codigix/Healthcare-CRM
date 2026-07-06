const fs = require('fs');
const path = require('path');

const config = [
  // ORDERS MANAGEMENT
  {
    path: 'diagnostics/orders/pending', title: 'Pending Orders', desc: 'Lab and imaging orders awaiting sample collection or scheduling.',
    cols: ['Order ID', 'Patient Name', 'Test/Procedure', 'Doctor', 'Priority', 'Status'],
    stats: [{ label: 'Total Pending', val: '45', col: 'text-amber-400' }, { label: 'STAT Orders', val: '5', col: 'text-red-400' }, { label: 'Routine', val: '40', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const tests = ['CBC', 'MRI Brain', 'Lipid Panel', 'X-Ray Chest', 'ECG'];
      const priorities = ['Routine', 'STAT', 'Routine', 'Urgent', 'Routine'];
      return { orderid: 'ORD-' + (1001+i), patientname: names[i], testprocedure: tests[i], doctor: 'Dr. House', priority: priorities[i], status: 'Pending Collection' };
    })`
  },
  {
    path: 'diagnostics/orders/today', title: "Today's Orders", desc: 'All diagnostic orders generated for the current day.',
    cols: ['Order ID', 'Patient Name', 'Test/Procedure', 'Time Ordered', 'Department', 'Status'],
    stats: [{ label: 'Orders Today', val: '120', col: 'text-blue-400' }, { label: 'Completed', val: '80', col: 'text-emerald-400' }, { label: 'In Progress', val: '40', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Collected', 'Processing', 'Report Ready', 'Pending Collection', 'Processing'];
      return { orderid: 'ORD-' + (2001+i), patientname: 'Patient ' + (i+1), testprocedure: 'Blood Glucose', timeordered: '08:00 AM', department: 'Laboratory', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/orders/emergency', title: 'Emergency Orders', desc: 'Orders originating from the ER or marked as life-threatening.',
    cols: ['Order ID', 'Patient Name', 'Test/Procedure', 'Origin', 'TAT Target', 'Status'],
    stats: [{ label: 'Active ER Orders', val: '8', col: 'text-red-400' }, { label: 'Breached TAT', val: '0', col: 'text-emerald-400' }, { label: 'Completed (Today)', val: '15', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Processing', 'Collected', 'Processing', 'Report Ready', 'Pending Collection'];
      return { orderid: 'ER-' + (3001+i), patientname: 'ER Patient ' + (i+1), testprocedure: 'Troponin-I', origin: 'ER Bed 3', tattarget: '30 mins', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/orders/stat', title: 'STAT Orders', desc: 'High-priority orders requiring immediate processing across all departments.',
    cols: ['Order ID', 'Patient Name', 'Test/Procedure', 'Doctor', 'Time Ordered', 'Status'],
    stats: [{ label: 'Active STAT', val: '12', col: 'text-amber-400' }, { label: 'Avg TAT', val: '45 mins', col: 'text-emerald-400' }, { label: 'Completed', val: '22', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Processing', 'Processing', 'Collected', 'Report Ready', 'Processing'];
      return { orderid: 'STAT-' + (4001+i), patientname: 'IPD Patient ' + (i+1), testprocedure: 'ABG Analysis', doctor: 'Dr. Strange', timeordered: '10:15 AM', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/orders/referral', title: 'Referral Orders', desc: 'Samples or orders sent to external reference laboratories.',
    cols: ['Order ID', 'Patient Name', 'Test/Procedure', 'External Lab', 'Dispatch Time', 'Status'],
    stats: [{ label: 'Pending Referrals', val: '5', col: 'text-amber-400' }, { label: 'Dispatched', val: '10', col: 'text-blue-400' }, { label: 'Results Received', val: '8', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Dispatched', 'Results Received', 'Pending Dispatch', 'Dispatched', 'Dispatched'];
      return { orderid: 'REF-' + (5001+i), patientname: 'Patient ' + (i+1), testprocedure: 'Genetic Panel', externallab: 'Quest Diagnostics', dispatchtime: '09:00 AM', status: statuses[i] };
    })`
  },

  // SAMPLE COLLECTION
  {
    path: 'diagnostics/sample/collection', title: 'Sample Collection', desc: 'Phlebotomy dashboard for collecting blood and other specimens.',
    cols: ['Order ID', 'Patient Name', 'Tests', 'Container Type', 'Fasting', 'Status'],
    stats: [{ label: 'Awaiting Collection', val: '35', col: 'text-amber-400' }, { label: 'Collected Today', val: '142', col: 'text-emerald-400' }, { label: 'Missed/Refused', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const containers = ['EDTA (Purple)', 'SST (Yellow)', 'Sodium Citrate (Blue)', 'Urine Container', 'Fluoride (Grey)'];
      const statuses = ['Pending', 'Collected', 'Pending', 'Pending', 'Collected'];
      return { orderid: 'ORD-' + (6001+i), patientname: 'Patient ' + (i+1), tests: 'CBC, HbA1c', containertype: containers[i], fasting: 'Yes (12h)', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/sample/barcode', title: 'Barcode Printing', desc: 'Generate and print barcode labels for specimen tubes.',
    cols: ['Order ID', 'Patient Name', 'Test Code', 'Container Type', 'Barcode Status', 'Status'],
    stats: [{ label: 'Pending Print', val: '15', col: 'text-amber-400' }, { label: 'Printed Today', val: '180', col: 'text-emerald-400' }, { label: 'Printer Errors', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Printed', 'Pending Print', 'Printed', 'Printed', 'Pending Print'];
      return { orderid: 'ORD-' + (7001+i), patientname: 'Patient ' + (i+1), testcode: 'LIP-01', containertype: 'SST', barcodestatus: 'Generated', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/sample/tracking', title: 'Sample Tracking', desc: 'Track the movement of samples from collection to the laboratory.',
    cols: ['Barcode ID', 'Patient Name', 'Collected By', 'Location', 'Time Since Collection', 'Status'],
    stats: [{ label: 'In Transit', val: '24', col: 'text-blue-400' }, { label: 'Received in Lab', val: '120', col: 'text-emerald-400' }, { label: 'Delayed', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const locs = ['Phlebotomy Room 1', 'Pneumatic Tube', 'Lab Reception', 'Centrifuge', 'Pneumatic Tube'];
      const statuses = ['In Transit', 'Received', 'In Transit', 'In Transit', 'Received'];
      return { barcodeid: 'BC-' + (8001+i), patientname: 'Patient ' + (i+1), collectedby: 'Tech John', location: locs[i], timesincecollection: '15 mins', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/sample/rejection', title: 'Sample Rejection', desc: 'Log of rejected samples due to hemolysis, clotting, or insufficient quantity.',
    cols: ['Barcode ID', 'Patient Name', 'Test', 'Rejection Reason', 'Rejected By', 'Status'],
    stats: [{ label: 'Rejected Today', val: '3', col: 'text-red-400' }, { label: 'Rejection Rate', val: '1.5%', col: 'text-amber-400' }, { label: 'Recollected', val: '2', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const reasons = ['Hemolyzed', 'Clotted', 'Insufficient Quantity', 'Wrong Container', 'Unlabeled'];
      const statuses = ['Recollection Pending', 'Recollected', 'Recollection Pending', 'Recollected', 'Recollection Pending'];
      return { barcodeid: 'BC-' + (9001+i), patientname: 'Patient ' + (i+1), test: 'K+', rejectionreason: reasons[i], rejectedby: 'Lab Tech Sarah', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/sample/home', title: 'Home Collection', desc: 'Manage home visit schedules for phlebotomists.',
    cols: ['Visit ID', 'Patient Name', 'Address', 'Time Slot', 'Phlebotomist', 'Status'],
    stats: [{ label: 'Total Visits', val: '18', col: 'text-blue-400' }, { label: 'Completed', val: '10', col: 'text-emerald-400' }, { label: 'In Route', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'In Route', 'Scheduled', 'Scheduled', 'Completed'];
      return { visitid: 'HV-' + (1001+i), patientname: 'Patient ' + (i+1), address: '123 Main St, Apt ' + i, timeslot: '08:00 AM - 10:00 AM', phlebotomist: 'John Doe', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/sample/history', title: 'Collection History', desc: 'Historical log of all sample collections and phlebotomy activity.',
    cols: ['Collection ID', 'Date', 'Total Samples', 'Successful Collections', 'Rejections', 'Status'],
    stats: [{ label: 'Avg Daily Collections', val: '150', col: 'text-blue-400' }, { label: 'Success Rate', val: '98%', col: 'text-emerald-400' }, { label: 'Patient Satisfaction', val: '4.8/5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { collectionid: 'LOG-' + (20260701+i), date: '0' + (i+1) + ' Jul 2026', totalsamples: '145', successfulcollections: '142', rejections: '3', status: 'Archived' };
    })`
  },

  // LABORATORY
  {
    path: 'diagnostics/laboratory/queue', title: 'Test Queue', desc: 'Samples received in the lab waiting to be processed.',
    cols: ['Barcode ID', 'Patient Name', 'Test Panel', 'Department', 'TAT Target', 'Status'],
    stats: [{ label: 'In Queue', val: '45', col: 'text-amber-400' }, { label: 'Processing', val: '30', col: 'text-blue-400' }, { label: 'Completed Today', val: '210', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Biochemistry', 'Hematology', 'Microbiology', 'Immunology', 'Pathology'];
      const statuses = ['In Queue', 'Processing', 'In Queue', 'Processing', 'In Queue'];
      return { barcodeid: 'BC-' + (10001+i), patientname: 'Patient ' + (i+1), testpanel: 'Liver Function Test', department: depts[i], tattarget: '2 hours', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/laboratory/processing', title: 'Sample Processing', desc: 'Samples currently loaded in analyzers and being tested.',
    cols: ['Run ID', 'Analyzer Machine', 'Test Panel', 'Samples Loaded', 'Est. Completion', 'Status'],
    stats: [{ label: 'Active Runs', val: '8', col: 'text-blue-400' }, { label: 'Machine Alerts', val: '0', col: 'text-emerald-400' }, { label: 'Pending Load', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const machines = ['Cobas 6000', 'Sysmex XN-1000', 'Architect i1000', 'VITEK 2', 'Cobas 6000'];
      const statuses = ['Running', 'Running', 'Completed', 'Running', 'Initializing'];
      return { runid: 'RUN-' + (2001+i), analyzermachine: machines[i], testpanel: 'Routine Chem', samplesloaded: '40/50', estcompletion: '15 mins', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/laboratory/entry', title: 'Manual Test Entry', desc: 'Interface for entering results for rapid tests, microscopy, and manual assays.',
    cols: ['Barcode ID', 'Patient Name', 'Test Name', 'Technician', 'Entry Time', 'Status'],
    stats: [{ label: 'Pending Entry', val: '12', col: 'text-amber-400' }, { label: 'Entered Today', val: '55', col: 'text-emerald-400' }, { label: 'Draft', val: '3', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const tests = ['Urine Routine', 'Malaria Smear', 'Rapid Flu A/B', 'Stool Occult Blood', 'Urine Pregnancy'];
      const statuses = ['Pending Entry', 'Draft', 'Entered', 'Entered', 'Pending Entry'];
      return { barcodeid: 'BC-' + (3001+i), patientname: 'Patient ' + (i+1), testname: tests[i], technician: 'Tech Mark', entrytime: '11:00 AM', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/laboratory/verification', title: 'Result Verification', desc: 'Technician verification of automated analyzer results and flags.',
    cols: ['Result ID', 'Patient Name', 'Test Panel', 'Flags', 'Machine TAT', 'Status'],
    stats: [{ label: 'Awaiting Verification', val: '24', col: 'text-amber-400' }, { label: 'Flagged Results', val: '5', col: 'text-red-400' }, { label: 'Verified', val: '180', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const flags = ['None', 'High (H)', 'Low (L), Critical (C)', 'None', 'Delta (D)'];
      const statuses = ['Pending Verify', 'Verified', 'Pending Verify', 'Verified', 'Pending Verify'];
      return { resultid: 'RES-' + (4001+i), patientname: 'Patient ' + (i+1), testpanel: 'CBC', flags: flags[i], machinetat: '45 mins', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/laboratory/authorization', title: 'Result Authorization', desc: 'Pathologist/Doctor authorization before releasing reports to patients.',
    cols: ['Report ID', 'Patient Name', 'Department', 'Verified By', 'Abnormalities', 'Status'],
    stats: [{ label: 'Pending Authorization', val: '15', col: 'text-amber-400' }, { label: 'Authorized Today', val: '150', col: 'text-emerald-400' }, { label: 'Held Back', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Biochemistry', 'Hematology', 'Microbiology', 'Immunology', 'Pathology'];
      const statuses = ['Pending Auth', 'Authorized', 'Pending Auth', 'Authorized', 'Held for Review'];
      return { reportid: 'REP-' + (5001+i), patientname: 'Patient ' + (i+1), department: depts[i], verifiedby: 'Tech Mark', abnormalities: 'Yes', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/laboratory/critical', title: 'Critical Values Log', desc: 'Log of life-threatening test results and mandatory doctor notifications.',
    cols: ['Result ID', 'Patient Name', 'Test', 'Critical Value', 'Notified Doctor', 'Status'],
    stats: [{ label: 'Criticals Today', val: '4', col: 'text-red-400' }, { label: 'Doctors Notified', val: '3', col: 'text-blue-400' }, { label: 'Pending Notification', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const tests = ['Potassium', 'Hemoglobin', 'Troponin-I', 'Platelets', 'Glucose'];
      const vals = ['6.5 mEq/L (H)', '5.2 g/dL (L)', '2.5 ng/mL (H)', '15,000 /uL (L)', '40 mg/dL (L)'];
      const statuses = ['Notified', 'Pending Notification', 'Notified', 'Notified', 'Notified'];
      return { resultid: 'CRT-' + (6001+i), patientname: 'Patient ' + (i+1), test: tests[i], criticalvalue: vals[i], notifieddoctor: 'Dr. Smith', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/laboratory/reports', title: 'Laboratory Metrics', desc: 'Statistical reports on lab performance, volumes, and TAT.',
    cols: ['Metric ID', 'Department', 'Total Tests', 'Avg TAT', 'Criticals', 'Status'],
    stats: [{ label: 'Total Volume', val: '1240', col: 'text-blue-400' }, { label: 'Overall TAT Met', val: '94%', col: 'text-emerald-400' }, { label: 'Revenue', val: '$14,500', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Biochemistry', 'Hematology', 'Microbiology', 'Immunology', 'Clinical Pathology'];
      return { metricid: 'MET-' + (7001+i), department: depts[i], totaltests: (200 * (i+1)).toString(), avgtat: '1.5 hrs', criticals: (i+1).toString(), status: 'Generated' };
    })`
  },

  // RADIOLOGY
  {
    path: 'diagnostics/radiology/xray', title: 'X-Ray Department', desc: 'Digital Radiography (DR) and Computed Radiography (CR) queue.',
    cols: ['Accession No', 'Patient Name', 'Body Part', 'Technician', 'Images', 'Status'],
    stats: [{ label: 'Pending X-Rays', val: '12', col: 'text-amber-400' }, { label: 'Completed', val: '45', col: 'text-emerald-400' }, { label: 'Wait Time', val: '15 mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const parts = ['Chest PA', 'Knee AP/LAT', 'Spine L/S', 'Abdomen Erect', 'Chest AP'];
      const statuses = ['Waiting', 'Completed', 'In Progress', 'Waiting', 'Completed'];
      return { accessionno: 'XR-' + (1001+i), patientname: 'Patient ' + (i+1), bodypart: parts[i], technician: 'Tech Jane', images: '2', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/radiology/ultrasound', title: 'Ultrasound / Sonography', desc: 'USG scheduling, patient queue, and study tracking.',
    cols: ['Accession No', 'Patient Name', 'Study Type', 'Radiologist', 'Images Sent to PACS', 'Status'],
    stats: [{ label: 'Pending USG', val: '8', col: 'text-amber-400' }, { label: 'Completed', val: '22', col: 'text-emerald-400' }, { label: 'Avg Scan Time', val: '20 mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const studies = ['Whole Abdomen', 'KUB', 'Pelvis', 'TVS', 'Neck/Thyroid'];
      const statuses = ['Waiting', 'In Progress', 'Completed', 'Waiting', 'Completed'];
      return { accessionno: 'US-' + (2001+i), patientname: 'Patient ' + (i+1), studytype: studies[i], radiologist: 'Dr. Brown', imagessenttopacs: 'Yes', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/radiology/ctscan', title: 'CT Scan', desc: 'Computed Tomography (CT) scheduling, contrast consents, and studies.',
    cols: ['Accession No', 'Patient Name', 'Study Type', 'Contrast Used', 'Creatinine Level', 'Status'],
    stats: [{ label: 'Scheduled CTs', val: '6', col: 'text-blue-400' }, { label: 'Completed', val: '14', col: 'text-emerald-400' }, { label: 'Contrast Prep', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const studies = ['CT Brain Plain', 'CECT Abdomen', 'HRCT Chest', 'CT KUB', 'CT Angiography'];
      const contrasts = ['No', 'Yes', 'No', 'No', 'Yes'];
      const statuses = ['Waiting', 'Prep', 'Completed', 'Waiting', 'Completed'];
      return { accessionno: 'CT-' + (3001+i), patientname: 'Patient ' + (i+1), studytype: studies[i], contrastused: contrasts[i], creatininelevel: '0.9 mg/dL', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/radiology/mri', title: 'MRI', desc: 'Magnetic Resonance Imaging schedules, screening forms, and studies.',
    cols: ['Accession No', 'Patient Name', 'Study Type', 'Safety Screening', 'Anesthesia', 'Status'],
    stats: [{ label: 'Scheduled MRIs', val: '8', col: 'text-blue-400' }, { label: 'Completed', val: '10', col: 'text-emerald-400' }, { label: 'Wait Time', val: '45 mins', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const studies = ['MRI Brain', 'MRI Spine C-Cervical', 'MRI Knee', 'MRCP', 'MRI Brain w/ Contrast'];
      const statuses = ['Waiting', 'In Progress', 'Completed', 'Scheduled', 'Completed'];
      return { accessionno: 'MRI-' + (4001+i), patientname: 'Patient ' + (i+1), studytype: studies[i], safetyscreening: 'Passed', anesthesia: 'None', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/radiology/mammography', title: 'Mammography', desc: 'Breast imaging studies, BI-RADS tracking, and screenings.',
    cols: ['Accession No', 'Patient Name', 'Study Type', 'Indication', 'BI-RADS Category', 'Status'],
    stats: [{ label: 'Screenings Today', val: '12', col: 'text-blue-400' }, { label: 'Completed', val: '8', col: 'text-emerald-400' }, { label: 'Abnormal (Recall)', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const studies = ['Screening Bilateral', 'Diagnostic Unilateral', 'Screening Bilateral', 'Diagnostic Bilateral', 'Screening Bilateral'];
      const statuses = ['Reported', 'Waiting', 'Reported', 'In Progress', 'Reported'];
      return { accessionno: 'MAM-' + (5001+i), patientname: 'Patient ' + (i+1), studytype: studies[i], indication: 'Routine', biradscategory: (i%2 === 0) ? 'BI-RADS 1' : 'Pending', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/radiology/dexa', title: 'DEXA Scan', desc: 'Bone Densitometry scans and osteoporosis screening reports.',
    cols: ['Accession No', 'Patient Name', 'Sites Scanned', 'T-Score (Lowest)', 'Interpretation', 'Status'],
    stats: [{ label: 'Scans Today', val: '5', col: 'text-blue-400' }, { label: 'Completed', val: '5', col: 'text-emerald-400' }, { label: 'Osteoporosis Detected', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Completed'];
      return { accessionno: 'DXA-' + (6001+i), patientname: 'Patient ' + (i+1), sitesscanned: 'Spine, Hip', tscorelowest: '-2.' + i, interpretation: 'Osteopenia', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/radiology/fluoroscopy', title: 'Fluoroscopy', desc: 'Dynamic X-ray studies like Barium Swallows, HSG, etc.',
    cols: ['Accession No', 'Patient Name', 'Study Type', 'Contrast/Barium', 'Radiologist', 'Status'],
    stats: [{ label: 'Scheduled', val: '4', col: 'text-blue-400' }, { label: 'Completed', val: '3', col: 'text-emerald-400' }, { label: 'Prep Incomplete', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const studies = ['Barium Swallow', 'Barium Meal', 'Barium Enema', 'HSG', 'MCU'];
      const statuses = ['Completed', 'Completed', 'In Progress', 'Scheduled', 'Scheduled'];
      return { accessionno: 'FLR-' + (7001+i), patientname: 'Patient ' + (i+1), studytype: studies[i], contrastbarium: 'Administered', radiologist: 'Dr. Evans', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/radiology/reports', title: 'Radiology Reporting (RIS/PACS)', desc: 'Radiologist workspace for viewing PACS images, dictating, and authorizing reports.',
    cols: ['Report ID', 'Accession No', 'Patient Name', 'Modality', 'Dictation', 'Status'],
    stats: [{ label: 'Pending Dictation', val: '18', col: 'text-amber-400' }, { label: 'Pending Auth', val: '10', col: 'text-blue-400' }, { label: 'Authorized Today', val: '65', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const modalities = ['CR', 'US', 'CT', 'MR', 'CR'];
      const statuses = ['Pending Dictation', 'Transcribed', 'Authorized', 'Pending Dictation', 'Authorized'];
      return { reportid: 'REP-RAD-' + (8001+i), accessionno: 'XR/CT-' + (i+1), patientname: 'Patient ' + (i+1), modality: modalities[i], dictation: 'Required', status: statuses[i] };
    })`
  },

  // CARDIOLOGY DIAGNOSTICS
  {
    path: 'diagnostics/cardiology/ecg', title: 'ECG / EKG', desc: 'Electrocardiogram testing and digital tracing storage.',
    cols: ['Test ID', 'Patient Name', 'Indication', 'Technician', 'Machine Interpretation', 'Status'],
    stats: [{ label: 'ECGs Today', val: '45', col: 'text-blue-400' }, { label: 'Abnormal', val: '5', col: 'text-amber-400' }, { label: 'Completed', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'Completed', 'Completed', 'Pending', 'Completed'];
      return { testid: 'ECG-' + (1001+i), patientname: 'Patient ' + (i+1), indication: 'Chest Pain', technician: 'Tech Alex', machineinterpretation: 'Sinus Rhythm', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/cardiology/echo', title: 'Echocardiography', desc: '2D/3D Echo studies, EF calculation, and reporting.',
    cols: ['Test ID', 'Patient Name', 'Study Type', 'Cardiologist', 'Ejection Fraction', 'Status'],
    stats: [{ label: 'Echos Today', val: '15', col: 'text-blue-400' }, { label: 'Waiting', val: '3', col: 'text-amber-400' }, { label: 'Completed', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Waiting', 'In Progress', 'Reported', 'Reported', 'Waiting'];
      return { testid: 'ECO-' + (2001+i), patientname: 'Patient ' + (i+1), studytype: '2D Echo Adult', cardiologist: 'Dr. Heart', ejectionfraction: (55 + i) + '%', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/cardiology/tmt', title: 'TMT (Stress Test)', desc: 'Treadmill Test monitoring, protocols, and stress ECG.',
    cols: ['Test ID', 'Patient Name', 'Protocol', 'Max Target HR', 'Result', 'Status'],
    stats: [{ label: 'Scheduled', val: '8', col: 'text-blue-400' }, { label: 'Completed', val: '6', col: 'text-emerald-400' }, { label: 'Positive for Ischemia', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'Completed', 'Scheduled', 'In Progress', 'Completed'];
      return { testid: 'TMT-' + (3001+i), patientname: 'Patient ' + (i+1), protocol: 'Bruce', maxtargethr: '150 bpm', result: 'Negative', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/cardiology/holter', title: 'Holter Monitoring', desc: '24/48 hour ambulatory ECG monitor assignment and analysis.',
    cols: ['Test ID', 'Patient Name', 'Duration', 'Hook-up Time', 'Analyzer Report', 'Status'],
    stats: [{ label: 'Devices Attached', val: '4', col: 'text-amber-400' }, { label: 'Devices Available', val: '2', col: 'text-emerald-400' }, { label: 'Pending Analysis', val: '1', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Attached', 'Pending Analysis', 'Reported', 'Attached', 'Attached'];
      return { testid: 'HLT-' + (4001+i), patientname: 'Patient ' + (i+1), duration: '24 Hours', hookuptime: '09:00 AM', analyzerreport: 'Pending', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/cardiology/stress', title: 'Dobutamine Stress Echo', desc: 'Pharmacological stress testing monitoring and results.',
    cols: ['Test ID', 'Patient Name', 'Drug/Dose', 'Cardiologist', 'Wall Motion', 'Status'],
    stats: [{ label: 'Scheduled', val: '2', col: 'text-blue-400' }, { label: 'Completed', val: '2', col: 'text-emerald-400' }, { label: 'Adverse Events', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Scheduled', 'Completed', 'Completed', 'Scheduled', 'Scheduled'];
      return { testid: 'DSE-' + (5001+i), patientname: 'Patient ' + (i+1), drugdose: 'Dobutamine', cardiologist: 'Dr. Heart', wallmotion: 'Normal', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/cardiology/reports', title: 'Cardiology Reports', desc: 'Review, authorize, and print comprehensive cardiology diagnostic reports.',
    cols: ['Report ID', 'Patient Name', 'Modality', 'Cardiologist', 'Dictation', 'Status'],
    stats: [{ label: 'Pending Auth', val: '12', col: 'text-amber-400' }, { label: 'Authorized Today', val: '40', col: 'text-emerald-400' }, { label: 'Printed', val: '35', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const modalities = ['ECG', 'Echo', 'TMT', 'Holter', 'ECG'];
      const statuses = ['Pending Auth', 'Authorized', 'Authorized', 'Pending Auth', 'Authorized'];
      return { reportid: 'REP-CAR-' + (6001+i), patientname: 'Patient ' + (i+1), modality: modalities[i], cardiologist: 'Dr. Heart', dictation: 'Completed', status: statuses[i] };
    })`
  },

  // BLOOD BANK
  {
    path: 'diagnostics/blood-bank/inventory', title: 'Blood Inventory', desc: 'Current stock of Whole Blood, PRBC, FFP, Platelets, and Cryo.',
    cols: ['Component', 'Blood Group', 'Units Available', 'Expiring < 7 Days', 'Min Reorder Level', 'Status'],
    stats: [{ label: 'Total Units', val: '150', col: 'text-blue-400' }, { label: 'Low Stock Groups', val: 'O-, B-', col: 'text-red-400' }, { label: 'Expiring Soon', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const comps = ['PRBC', 'FFP', 'Platelets', 'PRBC', 'Whole Blood'];
      const groups = ['A+', 'O+', 'B-', 'O-', 'AB+'];
      const statuses = ['Adequate', 'Adequate', 'Low Stock', 'Critical Low', 'Adequate'];
      return { component: comps[i], bloodgroup: groups[i], unitsavailable: (10 + i * 5).toString(), expiring7days: i.toString(), minreorderlevel: '10', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/blood-bank/requests', title: 'Blood Requests', desc: 'Requisitions from wards and OT for blood components.',
    cols: ['Req ID', 'Patient Name', 'Blood Group', 'Component Requested', 'Urgency', 'Status'],
    stats: [{ label: 'Pending Requests', val: '8', col: 'text-amber-400' }, { label: 'STAT/Emergency', val: '2', col: 'text-red-400' }, { label: 'Reserved', val: '6', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const urgencies = ['Routine', 'STAT', 'Routine', 'Urgent', 'Routine'];
      const statuses = ['Pending Crossmatch', 'Reserved', 'Pending Crossmatch', 'Reserved', 'Issued'];
      return { reqid: 'BREQ-' + (1001+i), patientname: 'Patient ' + (i+1), bloodgroup: 'A+', componentrequested: 'PRBC (2 Units)', urgency: urgencies[i], status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/blood-bank/cross-matching', title: 'Cross Matching', desc: 'Compatibility testing between donor units and patient samples.',
    cols: ['Match ID', 'Patient Sample ID', 'Donor Unit No', 'Technician', 'Result', 'Status'],
    stats: [{ label: 'Matches Today', val: '24', col: 'text-blue-400' }, { label: 'Compatible', val: '22', col: 'text-emerald-400' }, { label: 'Incompatible', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const results = ['Compatible', 'Compatible', 'Incompatible', 'Compatible', 'Pending'];
      const statuses = ['Reserved', 'Reserved', 'Rejected', 'Reserved', 'Processing'];
      return { matchid: 'XMAT-' + (2001+i), patientsampleid: 'SAMP-' + (900+i), donorunitno: 'UNIT-' + (5000+i), technician: 'Tech Lisa', result: results[i], status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/blood-bank/issue', title: 'Blood Issue', desc: 'Final release of reserved blood components to the requesting ward.',
    cols: ['Issue ID', 'Patient Name', 'Unit No', 'Issued To', 'Issue Time', 'Status'],
    stats: [{ label: 'Units Issued Today', val: '18', col: 'text-blue-400' }, { label: 'Pending Issue', val: '4', col: 'text-amber-400' }, { label: 'Transfusion Reactions', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Issued', 'Pending Issue', 'Issued', 'Issued', 'Issued'];
      return { issueid: 'ISS-' + (3001+i), patientname: 'Patient ' + (i+1), unitno: 'UNIT-' + (6000+i), issuedto: 'OT Nurse (John)', issuetime: '10:30 AM', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/blood-bank/donation', title: 'Blood Donation', desc: 'Donor registration, screening, and phlebotomy records.',
    cols: ['Donor ID', 'Donor Name', 'Blood Group', 'Screening', 'Bag Type', 'Status'],
    stats: [{ label: 'Donors Today', val: '12', col: 'text-blue-400' }, { label: 'Accepted', val: '10', col: 'text-emerald-400' }, { label: 'Deferred', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const screenings = ['Fit', 'Deferred (Low Hb)', 'Fit', 'Fit', 'Pending'];
      const statuses = ['Completed', 'Deferred', 'Completed', 'Bleeding', 'Screening'];
      return { donorid: 'DON-' + (4001+i), donorname: 'Volunteer ' + (i+1), bloodgroup: 'O+', screening: screenings[i], bagtype: '450ml Quadruple', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/blood-bank/transfusion', title: 'Transfusion Monitoring', desc: 'Post-issue tracking of transfusion start, end, and adverse reactions.',
    cols: ['Issue ID', 'Patient Name', 'Unit No', 'Start Time', 'End Time', 'Reaction', 'Status'],
    stats: [{ label: 'Active Transfusions', val: '6', col: 'text-blue-400' }, { label: 'Completed', val: '12', col: 'text-emerald-400' }, { label: 'Adverse Reactions', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In Progress', 'Completed', 'In Progress', 'Completed', 'Completed'];
      return { issueid: 'ISS-' + (5001+i), patientname: 'Patient ' + (i+1), unitno: 'UNIT-' + (7000+i), starttime: '11:00 AM', endtime: statuses[i] === 'Completed' ? '01:00 PM' : '-', reaction: 'None', status: statuses[i] };
    })`
  },
  {
    path: 'diagnostics/blood-bank/components', title: 'Component Separation', desc: 'Preparation of PRBC, FFP, and Platelets from Whole Blood.',
    cols: ['Whole Blood Unit', 'Collection Time', 'Separation Time', 'Components Produced', 'Technician', 'Status'],
    stats: [{ label: 'Units to Separate', val: '10', col: 'text-amber-400' }, { label: 'Separated Today', val: '25', col: 'text-emerald-400' }, { label: 'Discarded', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Separated', 'Separating', 'Pending', 'Separated', 'Separated'];
      return { wholebloodunit: 'UNIT-' + (8001+i), collectiontime: '08:00 AM', separationtime: '12:00 PM', componentsproduced: 'PRBC, FFP, PLT', technician: 'Tech Lisa', status: statuses[i] };
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
        const isGood = val === 'Completed' || val === 'Active' || val === 'Collected' || val === 'Report Ready' || val === 'Results Received' || val === 'Printed' || val === 'Received' || val === 'Recollected' || val === 'Entered' || val === 'Verified' || val === 'Authorized' || val === 'Notified' || val === 'Generated' || val === 'Reported' || val === 'Adequate' || val === 'Reserved' || val === 'Issued' || val === 'Separated' || val === 'Transcribed';
        const isWarning = val === 'Pending Collection' || val === 'Processing' || val === 'Pending Dispatch' || val === 'Pending Print' || val === 'In Transit' || val === 'Recollection Pending' || val === 'Scheduled' || val === 'In Queue' || val === 'Pending Entry' || val === 'Draft' || val === 'Pending Verify' || val === 'Pending Auth' || val === 'Held for Review' || val === 'Pending Notification' || val === 'Waiting' || val === 'Prep' || val === 'Pending Dictation' || val === 'Low Stock' || val === 'Pending Crossmatch' || val === 'Pending Issue' || val === 'Screening' || val === 'Pending' || val === 'Separating';
        const isNeutral = val === 'Dispatched' || val === 'Initializing' || val === 'In Progress' || val === 'Bleeding' || val === 'Attached';
        const isDanger = val === 'Rejected' || val === 'Deferred' || val === 'Critical Low';
        
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
      <div className="flex justify-between items-center my-3">
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
