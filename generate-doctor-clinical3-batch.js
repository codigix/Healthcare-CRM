const fs = require('fs');
const path = require('path');

const config = [
  // PROCEDURES
  {
    path: 'doctor/procedures/minor', title: 'Minor Procedures', desc: 'Log and track minor clinical procedures.',
    cols: ['Procedure ID', 'Patient Name', 'Procedure Type', 'Duration', 'Complications', 'Status'],
    stats: [{ label: 'Procedures Today', val: '24', col: 'text-blue-400' }, { label: 'Successful', val: '23', col: 'text-emerald-400' }, { label: 'Complications', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const procs = ['Suturing', 'Incision & Drainage', 'Mole Removal', 'Splinting', 'Wound Debridement'];
      const statuses = ['Completed', 'Completed', 'In Progress', 'Completed', 'Scheduled'];
      return { procedureid: 'MIN-' + (1001+i), patientname: names[i], proceduretype: procs[i], duration: '15 mins', complications: 'None', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/procedures/major', title: 'Major Procedures', desc: 'Schedule and manage major surgical operations.',
    cols: ['Surgery ID', 'Patient Name', 'Surgery Name', 'OR Room', 'Scheduled Time', 'Status'],
    stats: [{ label: 'Scheduled Surgeries', val: '8', col: 'text-blue-400' }, { label: 'In Progress', val: '2', col: 'text-amber-400' }, { label: 'Completed', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const surgs = ['Appendectomy', 'CABG', 'Hip Replacement', 'Craniotomy', 'Spinal Fusion'];
      const statuses = ['Scheduled', 'In Progress', 'Completed', 'Completed', 'Scheduled'];
      return { surgeryid: 'MAJ-' + (2001+i), patientname: names[i], surgeryname: surgs[i], orroom: 'OR-' + (1+i), scheduledtime: '08:00 AM', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/procedures/notes', title: 'Procedure Notes', desc: 'Detailed operative notes and surgical records.',
    cols: ['Note ID', 'Procedure ID', 'Patient Name', 'Surgeon', 'Note Summary', 'Status'],
    stats: [{ label: 'Pending Notes', val: '5', col: 'text-amber-400' }, { label: 'Signed Today', val: '18', col: 'text-emerald-400' }, { label: 'Co-signed', val: '12', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const statuses = ['Signed', 'Draft', 'Signed', 'Draft', 'Pending Review'];
      return { noteid: 'PNT-' + (3001+i), procedureid: 'MAJ-' + (100+i), patientname: names[i], surgeon: 'Dr. House', notesummary: 'Procedure went smoothly...', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/procedures/history', title: 'Procedure History', desc: 'Comprehensive log of all past patient procedures.',
    cols: ['Record ID', 'Patient Name', 'Procedure', 'Date Performed', 'Surgeon', 'Status'],
    stats: [{ label: 'Total Procedures', val: '12,450', col: 'text-blue-400' }, { label: 'This Month', val: '340', col: 'text-emerald-400' }, { label: 'Success Rate', val: '98%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const procs = ['Tonsillectomy', 'Hernia Repair', 'Cataract Surgery', 'Knee Arthroscopy', 'Gallbladder Removal'];
      const statuses = ['Recovered', 'Recovered', 'Recovered', 'In Rehab', 'Recovered'];
      return { recordid: 'PHX-' + (4001+i), patientname: names[i], procedure: procs[i], dateperformed: '10 Jan 2026', surgeon: 'Dr. Grey', status: statuses[i] };
    })`
  },

  // DOCUMENTATION
  {
    path: 'doctor/documentation/progress', title: 'Progress Notes', desc: 'Daily progress documentation for admitted patients.',
    cols: ['Note ID', 'Patient Name', 'Ward', 'Note Type', 'Authored By', 'Status'],
    stats: [{ label: 'Notes Today', val: '142', col: 'text-blue-400' }, { label: 'Missing Notes', val: '3', col: 'text-red-400' }, { label: 'Reviewed', val: '120', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson', 'Maggie Simpson'];
      const statuses = ['Draft', 'Signed', 'Signed', 'Pending Review', 'Signed'];
      return { noteid: 'PRG-' + (1001+i), patientname: names[i], ward: 'General', notetype: 'Daily Round', authoredby: 'Dr. Jenkins', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/documentation/consultation', title: 'Consultation Notes', desc: 'Detailed documentation for outpatient visits.',
    cols: ['Note ID', 'Patient Name', 'Visit Type', 'Diagnosis', 'Authored By', 'Status'],
    stats: [{ label: 'OPD Notes', val: '84', col: 'text-blue-400' }, { label: 'Drafts', val: '12', col: 'text-amber-400' }, { label: 'Finalized', val: '72', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const statuses = ['Finalized', 'Draft', 'Finalized', 'Finalized', 'Pending Review'];
      return { noteid: 'CNS-' + (2001+i), patientname: names[i], visittype: 'Follow-up', diagnosis: 'Hypertension', authoredby: 'Dr. Smith', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/documentation/operative', title: 'Operative Reports', desc: 'Formal reports generated post-surgery.',
    cols: ['Report ID', 'Patient Name', 'Surgery', 'Date', 'Dictated By', 'Status'],
    stats: [{ label: 'Pending Dictation', val: '4', col: 'text-amber-400' }, { label: 'Transcribed', val: '18', col: 'text-blue-400' }, { label: 'Signed', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Griffin', 'Lois Griffin', 'Meg Griffin', 'Chris Griffin', 'Stewie Griffin'];
      const statuses = ['Signed', 'Pending Dictation', 'Transcribed', 'Signed', 'Transcribed'];
      return { reportid: 'OPR-' + (3001+i), patientname: names[i], surgery: 'Appendectomy', date: 'Today', dictatedby: 'Dr. Shepherd', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/documentation/referral', title: 'Referral Letters', desc: 'Generate and manage outward referral letters.',
    cols: ['Letter ID', 'Patient Name', 'Referred To', 'Specialty', 'Urgency', 'Status'],
    stats: [{ label: 'Letters Sent', val: '12', col: 'text-blue-400' }, { label: 'Urgent', val: '2', col: 'text-red-400' }, { label: 'Pending', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const statuses = ['Sent', 'Draft', 'Sent', 'Draft', 'Pending Auth'];
      return { letterid: 'RFL-' + (4001+i), patientname: names[i], referredto: 'Dr. Strange', specialty: 'Neurology', urgency: 'Routine', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/documentation/certificates', title: 'Medical Certificates', desc: 'Issue sick leaves and fitness certificates.',
    cols: ['Cert ID', 'Patient Name', 'Type', 'Valid From', 'Valid To', 'Status'],
    stats: [{ label: 'Issued Today', val: '45', col: 'text-blue-400' }, { label: 'Sick Leaves', val: '30', col: 'text-amber-400' }, { label: 'Fitness', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const types = ['Sick Leave', 'Fitness Cert', 'Sick Leave', 'Maternity', 'Fitness Cert'];
      const statuses = ['Active', 'Active', 'Expired', 'Active', 'Active'];
      return { certid: 'CRT-' + (5001+i), patientname: names[i], type: types[i], validfrom: '10 Jun', validto: '15 Jun', status: statuses[i] };
    })`
  },

  // REFERRALS
  {
    path: 'doctor/referrals/internal', title: 'Internal Referrals', desc: 'Referrals made to other departments within the hospital.',
    cols: ['Ref ID', 'Patient Name', 'From Dept', 'To Dept', 'Reason', 'Status'],
    stats: [{ label: 'Active Referrals', val: '24', col: 'text-blue-400' }, { label: 'Accepted', val: '18', col: 'text-emerald-400' }, { label: 'Pending', val: '6', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const statuses = ['Accepted', 'Pending', 'Accepted', 'Rejected', 'Accepted'];
      return { refid: 'IRF-' + (1001+i), patientname: names[i], fromdept: 'General Med', todept: 'Cardiology', reason: 'ECG Abnormal', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/referrals/external', title: 'External Referrals', desc: 'Referrals sent to outside hospitals or clinics.',
    cols: ['Ref ID', 'Patient Name', 'Destination', 'Specialty', 'Sent Date', 'Status'],
    stats: [{ label: 'Outbound Referrals', val: '12', col: 'text-blue-400' }, { label: 'Acknowledged', val: '8', col: 'text-emerald-400' }, { label: 'Pending', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const statuses = ['Acknowledged', 'Sent', 'Acknowledged', 'Pending', 'Sent'];
      return { refid: 'ERF-' + (2001+i), patientname: names[i], destination: 'City Hospital', specialty: 'Oncology', sentdate: 'Today', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/referrals/specialist', title: 'Specialist Referrals', desc: 'Incoming referrals from general practitioners.',
    cols: ['Ref ID', 'Patient Name', 'Referring Dr', 'Condition', 'Priority', 'Status'],
    stats: [{ label: 'Incoming Today', val: '15', col: 'text-blue-400' }, { label: 'Reviewed', val: '10', col: 'text-emerald-400' }, { label: 'Urgent', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const statuses = ['Reviewed', 'Pending', 'Scheduled', 'Reviewed', 'Scheduled'];
      return { refid: 'SRF-' + (3001+i), patientname: names[i], referringdr: 'Dr. GP', condition: 'Arrhythmia', priority: 'High', status: statuses[i] };
    })`
  },

  // FOLLOW-UP
  {
    path: 'doctor/follow-up/schedule', title: 'Follow-up Schedule', desc: 'Calendar and list of upcoming patient follow-ups.',
    cols: ['Follow-up ID', 'Patient Name', 'Original Visit', 'Scheduled Date', 'Reason', 'Status'],
    stats: [{ label: 'Follow-ups Today', val: '32', col: 'text-blue-400' }, { label: 'Confirmed', val: '28', col: 'text-emerald-400' }, { label: 'Pending Confirm', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const statuses = ['Confirmed', 'Pending', 'Confirmed', 'Completed', 'Confirmed'];
      return { followupid: 'FUP-' + (1001+i), patientname: names[i], originalvisit: '15 May 2026', scheduleddate: 'Today', reason: 'Post-Op Check', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/follow-up/patients', title: 'Follow-up Patients List', desc: 'Directory of patients requiring long-term follow-ups.',
    cols: ['Patient ID', 'Patient Name', 'Condition', 'Frequency', 'Next Due', 'Status'],
    stats: [{ label: 'Active Roster', val: '450', col: 'text-blue-400' }, { label: 'Due This Week', val: '84', col: 'text-emerald-400' }, { label: 'Overdue', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson', 'Maggie Simpson'];
      const statuses = ['On Track', 'Overdue', 'On Track', 'Scheduled', 'On Track'];
      return { patientid: 'PAT-' + (2001+i), patientname: names[i], condition: 'Diabetes Type 2', frequency: 'Monthly', nextdue: '15 Jul 2026', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/follow-up/missed', title: 'Missed Follow-ups', desc: 'Track patients who missed their scheduled follow-up visits.',
    cols: ['Follow-up ID', 'Patient Name', 'Missed Date', 'Contact Attempts', 'Last Contact', 'Status'],
    stats: [{ label: 'Missed This Week', val: '15', col: 'text-red-400' }, { label: 'Rescheduled', val: '8', col: 'text-emerald-400' }, { label: 'Lost to Follow-up', val: '2', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const statuses = ['Rescheduled', 'Pending Contact', 'Lost to Follow-up', 'Rescheduled', 'Pending Contact'];
      return { followupid: 'FUP-' + (3001+i), patientname: names[i], misseddate: '10 Jun 2026', contactattempts: '2', lastcontact: 'Yesterday', status: statuses[i] };
    })`
  },

  // TELEMEDICINE
  {
    path: 'doctor/telemedicine/video', title: 'Video Consultations', desc: 'Active and scheduled video calls for remote patients.',
    cols: ['Session ID', 'Patient Name', 'Platform', 'Scheduled Time', 'Duration', 'Status'],
    stats: [{ label: 'Calls Today', val: '14', col: 'text-blue-400' }, { label: 'Completed', val: '8', col: 'text-emerald-400' }, { label: 'Missed Calls', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Griffin', 'Lois Griffin', 'Meg Griffin', 'Chris Griffin', 'Stewie Griffin'];
      const statuses = ['Completed', 'Active', 'Waiting', 'Scheduled', 'Missed'];
      return { sessionid: 'VID-' + (1001+i), patientname: names[i], platform: 'In-House Portal', scheduledtime: '10:00 AM', duration: '15 mins', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/telemedicine/chat', title: 'Patient Chat', desc: 'Secure text messaging with patients for minor queries.',
    cols: ['Chat ID', 'Patient Name', 'Last Message', 'Unread', 'Last Active', 'Status'],
    stats: [{ label: 'Active Chats', val: '45', col: 'text-blue-400' }, { label: 'Unread Messages', val: '12', col: 'text-amber-400' }, { label: 'Resolved Today', val: '24', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const statuses = ['Active', 'Unread', 'Resolved', 'Active', 'Unread'];
      return { chatid: 'CHT-' + (2001+i), patientname: names[i], lastmessage: 'Thanks doctor!', unread: '0', lastactive: '10 mins ago', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/telemedicine/history', title: 'Telemedicine History', desc: 'Log of all past virtual consultations and chats.',
    cols: ['Session ID', 'Patient Name', 'Type', 'Date', 'Billed Amount', 'Status'],
    stats: [{ label: 'Total Sessions', val: '1,240', col: 'text-blue-400' }, { label: 'Total Revenue', val: '$45,200', col: 'text-emerald-400' }, { label: 'Avg Rating', val: '4.8/5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const statuses = ['Billed', 'Billed', 'Billed', 'Pending Payment', 'Billed'];
      return { sessionid: 'TMH-' + (3001+i), patientname: names[i], type: 'Video', date: '01 Jun 2026', billedamount: '$50.00', status: statuses[i] };
    })`
  },

  // DISCHARGE
  {
    path: 'doctor/discharge/advice', title: 'Discharge Advice', desc: 'Prepare medical advice and prescriptions for discharging patients.',
    cols: ['Discharge ID', 'Patient Name', 'Ward', 'Diagnosis', 'Advice Drafted', 'Status'],
    stats: [{ label: 'Discharges Today', val: '12', col: 'text-blue-400' }, { label: 'Advice Ready', val: '8', col: 'text-emerald-400' }, { label: 'Pending', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const statuses = ['Drafted', 'Pending', 'Signed', 'Signed', 'Pending'];
      return { dischargeid: 'DIS-' + (1001+i), patientname: names[i], ward: 'General', diagnosis: 'Pneumonia', advicedrafted: 'Yes', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/discharge/instructions', title: 'Home Care Instructions', desc: 'Specific nursing and lifestyle instructions for home care.',
    cols: ['Instruction ID', 'Patient Name', 'Category', 'Provided By', 'Acknowledged', 'Status'],
    stats: [{ label: 'Instructions Issued', val: '45', col: 'text-blue-400' }, { label: 'Acknowledged', val: '40', col: 'text-emerald-400' }, { label: 'Pending Review', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const statuses = ['Acknowledged', 'Pending Review', 'Acknowledged', 'Acknowledged', 'Pending Review'];
      return { instructionid: 'INS-' + (2001+i), patientname: names[i], category: 'Wound Care', providedby: 'Nurse Joy', acknowledged: 'Yes', status: statuses[i] };
    })`
  },

  // REPORTS
  {
    path: 'doctor/reports/opd', title: 'OPD Reports', desc: 'Analytics and summaries of Outpatient Department metrics.',
    cols: ['Report ID', 'Date Range', 'Total Consults', 'New Patients', 'Revenue Generated', 'Status'],
    stats: [{ label: 'Consults This Month', val: '1,240', col: 'text-blue-400' }, { label: 'Avg Daily', val: '45', col: 'text-emerald-400' }, { label: 'Growth', val: '+12%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Generated', 'Generated', 'Processing', 'Generated', 'Generated'];
      return { reportid: 'RPT-O-' + (1001+i), daterange: 'May 2026', totalconsults: '1,200', newpatients: '450', revenuegenerated: '$120,000', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/reports/ipd', title: 'IPD Reports', desc: 'Analytics and summaries of Inpatient Department metrics.',
    cols: ['Report ID', 'Date Range', 'Admissions', 'Discharges', 'Avg Length of Stay', 'Status'],
    stats: [{ label: 'Admissions This Month', val: '340', col: 'text-blue-400' }, { label: 'Avg Stay', val: '4.2 Days', col: 'text-emerald-400' }, { label: 'Mortality Rate', val: '0.1%', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Generated', 'Generated', 'Processing', 'Generated', 'Generated'];
      return { reportid: 'RPT-I-' + (2001+i), daterange: 'May 2026', admissions: '320', discharges: '310', avglengthofstay: '4.5 Days', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/reports/diagnosis', title: 'Diagnosis Analytics', desc: 'Trends and frequency reports of patient diagnoses.',
    cols: ['Report ID', 'ICD-10 Category', 'Total Cases', 'Most Affected Demo', 'Trend', 'Status'],
    stats: [{ label: 'Top Diagnosis', val: 'Hypertension', col: 'text-blue-400' }, { label: 'Seasonal Spike', val: 'Influenza', col: 'text-amber-400' }, { label: 'Rare Cases', val: '12', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Reviewed', 'Reviewed', 'Pending', 'Reviewed', 'Reviewed'];
      return { reportid: 'RPT-D-' + (3001+i), icd10category: 'Circulatory', totalcases: '450', mostaffecteddemo: 'Males 40-60', trend: '+5%', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/reports/prescription', title: 'Prescription Analytics', desc: 'Reports on medication usage, trends, and pharmacy data.',
    cols: ['Report ID', 'Medication Class', 'Total Prescribed', 'Top Prescriber', 'Trend', 'Status'],
    stats: [{ label: 'Most Prescribed', val: 'Antibiotics', col: 'text-blue-400' }, { label: 'e-Rx Adoption', val: '98%', col: 'text-emerald-400' }, { label: 'Alerts', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Reviewed', 'Reviewed', 'Pending', 'Reviewed', 'Reviewed'];
      return { reportid: 'RPT-P-' + (4001+i), medicationclass: 'Antibiotics', totalprescribed: '1,200 Units', topprescriber: 'Dr. Smith', trend: '-2%', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/reports/procedure', title: 'Procedure Analytics', desc: 'Reports on surgical and minor procedure volumes and outcomes.',
    cols: ['Report ID', 'Procedure Category', 'Total Performed', 'Success Rate', 'Avg Duration', 'Status'],
    stats: [{ label: 'Total Procedures', val: '840', col: 'text-blue-400' }, { label: 'Success Rate', val: '99.1%', col: 'text-emerald-400' }, { label: 'Complications', val: '0.9%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Reviewed', 'Reviewed', 'Pending', 'Reviewed', 'Reviewed'];
      return { reportid: 'RPT-S-' + (5001+i), procedurecategory: 'General Surgery', totalperformed: '120', successrate: '99%', avgduration: '45 mins', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/reports/referral', title: 'Referral Analytics', desc: 'Track inbound and outbound referral patterns and conversions.',
    cols: ['Report ID', 'Referral Source', 'Total Received', 'Converted', 'Conversion Rate', 'Status'],
    stats: [{ label: 'Total Inbound', val: '450', col: 'text-blue-400' }, { label: 'Conversion', val: '85%', col: 'text-emerald-400' }, { label: 'Total Outbound', val: '120', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Reviewed', 'Reviewed', 'Pending', 'Reviewed', 'Reviewed'];
      return { reportid: 'RPT-R-' + (6001+i), referralsource: 'City Clinic', totalreceived: '45', converted: '40', conversionrate: '88%', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/reports/outcome', title: 'Clinical Outcomes', desc: 'Reports measuring patient recovery rates and clinical success.',
    cols: ['Report ID', 'Condition', 'Cases Tracked', 'Positive Outcome', 'Readmission Rate', 'Status'],
    stats: [{ label: 'Overall Success', val: '94%', col: 'text-emerald-400' }, { label: 'Readmissions (30d)', val: '2.1%', col: 'text-amber-400' }, { label: 'Mortality', val: '0.1%', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Published', 'Published', 'Draft', 'Published', 'Published'];
      return { reportid: 'RPT-C-' + (7001+i), condition: 'Post-Op Infection', casestracked: '1,200', positiveoutcome: '98%', readmissionrate: '1.5%', status: statuses[i] };
    })`
  },

  // PERFORMANCE
  {
    path: 'doctor/performance/consultation', title: 'Consultation Performance', desc: 'Metrics on OPD efficiency, wait times, and patient volume.',
    cols: ['Metric ID', 'Doctor', 'Avg Consult Time', 'Patients/Day', 'Patient Satisfaction', 'Status'],
    stats: [{ label: 'Avg Consult Time', val: '12m 30s', col: 'text-blue-400' }, { label: 'Target', val: '15m 00s', col: 'text-emerald-400' }, { label: 'Satisfaction', val: '4.8/5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Excellent', 'Good', 'Average', 'Excellent', 'Good'];
      return { metricid: 'PER-C-' + (1001+i), doctor: 'Dr. Smith', avgconsulttime: '12m', patientsday: '45', patientsatisfaction: '4.9', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/performance/procedure', title: 'Procedural Performance', desc: 'Metrics on surgical success rates, complications, and OR time.',
    cols: ['Metric ID', 'Surgeon', 'Procedures Done', 'Success Rate', 'Avg OR Time', 'Status'],
    stats: [{ label: 'Total Procedures', val: '342', col: 'text-blue-400' }, { label: 'Avg Success', val: '99%', col: 'text-emerald-400' }, { label: 'Target OR Util.', val: '85%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Excellent', 'Good', 'Average', 'Excellent', 'Good'];
      return { metricid: 'PER-P-' + (2001+i), surgeon: 'Dr. Shepherd', proceduresdone: '120', successrate: '99.5%', avgortime: '1h 45m', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/performance/feedback', title: 'Patient Feedback', desc: 'Reviews and feedback collected from patients post-visit.',
    cols: ['Feedback ID', 'Patient Name', 'Doctor', 'Rating', 'Comments', 'Status'],
    stats: [{ label: 'Total Reviews', val: '4,520', col: 'text-blue-400' }, { label: 'Avg Rating', val: '4.7/5', col: 'text-emerald-400' }, { label: 'Complaints', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Reviewed', 'Pending', 'Reviewed', 'Reviewed', 'Addressed'];
      return { feedbackid: 'FBK-' + (3001+i), patientname: 'Anonymous', doctor: 'Dr. Grey', rating: '5/5', comments: 'Great experience', status: statuses[i] };
    })`
  },
  {
    path: 'doctor/performance/kpis', title: 'Key Performance Indicators', desc: 'Overall scorecard for departmental and individual KPIs.',
    cols: ['KPI ID', 'Metric Name', 'Current Value', 'Target', 'Variance', 'Status'],
    stats: [{ label: 'KPIs Met', val: '18/20', col: 'text-emerald-400' }, { label: 'Needs Attention', val: '2', col: 'text-amber-400' }, { label: 'Overall Score', val: '92%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['On Track', 'On Track', 'Lagging', 'On Track', 'On Track'];
      return { kpiid: 'KPI-' + (4001+i), metricname: 'Patient Wait Time', currentvalue: '18 mins', target: '15 mins', variance: '+3 mins', status: statuses[i] };
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
        const isGood = val === 'Completed' || val === 'Recovered' || val === 'Signed' || val === 'Finalized' || val === 'Transcribed' || val === 'Sent' || val === 'Active' || val === 'Accepted' || val === 'Acknowledged' || val === 'Confirmed' || val === 'On Track' || val === 'Rescheduled' || val === 'Resolved' || val === 'Billed' || val === 'Generated' || val === 'Reviewed' || val === 'Published' || val === 'Excellent' || val === 'Good' || val === 'Addressed';
        const isWarning = val === 'In Progress' || val === 'Scheduled' || val === 'Pending Review' || val === 'Draft' || val === 'Pending Dictation' || val === 'Pending Auth' || val === 'Pending' || val === 'Pending Contact' || val === 'Missed' || val === 'Pending Payment' || val === 'Processing' || val === 'Lagging' || val === 'Average' || val === 'Overdue' || val === 'Rejected';
        const isNeutral = val === 'Lost to Follow-up' || val === 'Waiting' || val === 'Unread' || val === 'Expired' || val === 'In Rehab';
        
        let colorClass = 'bg-red-500/10 text-red-500 border border-red-500/20';
        if (isGood) colorClass = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
        else if (isWarning) colorClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        else if (isNeutral) colorClass = 'bg-gray-500/10 text-gray-400 border border-gray-500/20';

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

// Filter out duplicates if any in config
const uniqueConfig = config.filter((v, i, a) => a.findIndex(v2 => (v2.path === v.path)) === i);

uniqueConfig.forEach(page => {
  const dir = path.join(__dirname, 'frontend', 'src', 'app', ...page.path.split('/'));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page, componentName));
  console.log('Generated: ' + page.path);
});
