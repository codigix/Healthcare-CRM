const fs = require('fs');
const path = require('path');

const config = [
  // Patient Engagement
  {
    path: 'crm/engagement/directory', title: 'Patient Directory', desc: 'Comprehensive list of all registered patients with contact info and engagement score.',
    cols: ['UHID', 'Patient Name', 'Phone', 'Email', 'Engagement Score', 'Status'],
    stats: [{ label: 'Total Patients', val: '145,200', col: 'text-blue-400' }, { label: 'Active (30D)', val: '12,450', col: 'text-emerald-400' }, { label: 'New Reg (Mo)', val: '850', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { uhid: 'UHID-' + (1001+i), patientname: 'Patient ' + (i+1), phone: '+1 234 567 ' + (8900+i), email: 'patient' + (i+1) + '@email.com', engagementscore: (80+i*2) + '/100', status: 'Active' };
    })`
  },
  {
    path: 'crm/engagement/timeline', title: 'Patient Timeline', desc: 'Chronological view of all patient interactions, visits, calls, and campaigns.',
    cols: ['Interaction Date', 'Patient', 'Touchpoint Type', 'Department/Agent', 'Summary', 'Status'],
    stats: [{ label: 'Interactions Today', val: '2,450', col: 'text-blue-400' }, { label: 'Avg Touchpoints/Pt', val: '4.5', col: 'text-emerald-400' }, { label: 'Unresolved Queries', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['OPD Visit', 'Teleconsult', 'Support Call', 'Marketing SMS', 'Feedback Form'];
      return { interactiondate: 'Today ' + (10+i) + ':00', patient: 'Patient ' + (1+i), touchpointtype: types[i], departmentagent: 'Agent ' + (1+i), summary: 'General inquiry resolved', status: 'Completed' };
    })`
  },
  {
    path: 'crm/engagement/journey', title: 'Patient Journey', desc: 'Mapping the end-to-end experience from lead acquisition to post-discharge care.',
    cols: ['Journey ID', 'Patient', 'Current Stage', 'Days in Stage', 'Next Action Due', 'Status'],
    stats: [{ label: 'Active Journeys', val: '1,240', col: 'text-blue-400' }, { label: 'Drop-off Rate', val: '15%', col: 'text-amber-400' }, { label: 'Conversion to IPD', val: '8%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const stages = ['Awareness', 'Consultation', 'Diagnosis', 'Treatment/IPD', 'Post-Discharge'];
      return { journeyid: 'JRN-' + (2001+i), patient: 'Patient ' + (1+i), currentstage: stages[i], daysinstage: (2+i).toString(), nextactiondue: 'Tomorrow', status: i===4?'Completed':'In Progress' };
    })`
  },
  {
    path: 'crm/engagement/vip', title: 'VIP Patients', desc: 'Special handling and concierge services for HNI, politicians, or celebrity patients.',
    cols: ['UHID', 'VIP Name', 'Category', 'Concierge Assigned', 'Upcoming Visit', 'Status'],
    stats: [{ label: 'Total VIPs', val: '345', col: 'text-amber-400' }, { label: 'Visits Today', val: '4', col: 'text-blue-400' }, { label: 'Concierge Staff', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { uhid: 'VIP-' + (101+i), vipname: 'VIP ' + (i+1), category: 'Corporate Exec', conciergeassigned: 'Staff Member ' + (1+i), upcomingvisit: '15 Jul 2026', status: 'Active' };
    })`
  },
  {
    path: 'crm/engagement/international', title: 'International Patients', desc: 'Managing medical tourism, visa assistance, and language translation services.',
    cols: ['Passport No', 'Patient Name', 'Country', 'Arrival Date', 'Treatment Plan', 'Status'],
    stats: [{ label: 'Intl Patients (Mo)', val: '45', col: 'text-blue-400' }, { label: 'Visa Letters Issued', val: '24', col: 'text-emerald-400' }, { label: 'Revenue (YTD)', val: '$1.2M', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const countries = ['UAE', 'UK', 'Oman', 'Nigeria', 'Bangladesh'];
      return { passportno: 'P' + (10000+i), patientname: 'Intl Patient ' + (1+i), country: countries[i], arrivaldate: '01 Jul 2026', treatmentplan: 'Oncology', status: 'In Country' };
    })`
  },

  // Lead & Enquiry Management
  {
    path: 'crm/leads/enquiries', title: 'General Enquiries', desc: 'Inbound queries from website, phone, or walk-ins needing triage.',
    cols: ['Enquiry ID', 'Name', 'Source', 'Query Type', 'Date Received', 'Status'],
    stats: [{ label: 'New Enquiries', val: '45', col: 'text-amber-400' }, { label: 'Avg Response Time', val: '15 Mins', col: 'text-emerald-400' }, { label: 'Closed Today', val: '85', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { enquiryid: 'ENQ-' + (1001+i), name: 'Prospect ' + (1+i), source: 'Website Form', querytype: 'Treatment Cost', datereceived: 'Today 10:00', status: i<2?'New':'Replied' };
    })`
  },
  {
    path: 'crm/leads/management', title: 'Lead Management', desc: 'Tracking potential patients through the sales funnel (New > Contacted > Converted).',
    cols: ['Lead ID', 'Lead Name', 'Specialty Interest', 'Assigned Rep', 'Follow-up Date', 'Status'],
    stats: [{ label: 'Active Leads', val: '340', col: 'text-blue-400' }, { label: 'Follow-ups Due', val: '45', col: 'text-amber-400' }, { label: 'Lost Leads (Mo)', val: '12%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['New', 'Contacted', 'Interested', 'Contacted', 'Lost'];
      return { leadid: 'LED-' + (2001+i), leadname: 'Lead ' + (1+i), specialtyinterest: 'Orthopedics', assignedrep: 'Rep Alice', followupdate: 'Tomorrow', status: statuses[i] };
    })`
  },
  {
    path: 'crm/leads/camp', title: 'Health Camp Leads', desc: 'Leads generated from community outreach programs and free health camps.',
    cols: ['Camp Name', 'Lead Name', 'Screening Result', 'Recommended Consult', 'Conversion', 'Status'],
    stats: [{ label: 'Total Camp Leads', val: '1,240', col: 'text-blue-400' }, { label: 'Camp Conversion Rate', val: '24%', col: 'text-emerald-400' }, { label: 'Upcoming Camps', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { campname: 'Diabetic Screening', leadname: 'Participant ' + (1+i), screeningresult: 'High BS', recommendedconsult: 'Endocrinology', conversion: i===1?'Converted':'Pending', status: i===1?'Won':'Nurturing' };
    })`
  },
  {
    path: 'crm/leads/corporate', title: 'Corporate Leads', desc: 'B2B leads for corporate tie-ups, annual health checks, and occupational health.',
    cols: ['Company Name', 'Contact Person', 'Deal Size/Emp', 'Sales Rep', 'Proposal Sent', 'Status'],
    stats: [{ label: 'Active Deals', val: '15', col: 'text-blue-400' }, { label: 'Pipeline Value', val: '$450K', col: 'text-amber-400' }, { label: 'Won (YTD)', val: '8', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { companyname: 'Tech Corp ' + (1+i), contactperson: 'HR Head', dealsizeemp: (100+i*50).toString(), salesrep: 'B2B Lead', proposalsent: 'Yes', status: 'Negotiation' };
    })`
  },
  {
    path: 'crm/leads/referral', title: 'Referral Leads', desc: 'Patients referred by external doctors, requiring priority scheduling and updates.',
    cols: ['Patient Name', 'Referred By (Dr/Hosp)', 'Specialty', 'Date Received', 'Appointment Set', 'Status'],
    stats: [{ label: 'Referrals (Mo)', val: '145', col: 'text-blue-400' }, { label: 'Conversion Rate', val: '92%', col: 'text-emerald-400' }, { label: 'Pending Contact', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { patientname: 'Ref Patient ' + (1+i), referredby: 'Dr. External ' + (1+i), specialty: 'Oncology', datereceived: 'Yesterday', appointmentset: i===0?'No':'Yes', status: i===0?'Action Required':'Scheduled' };
    })`
  },
  {
    path: 'crm/leads/conversion', title: 'Lead Conversion', desc: 'Analytics and tools focused specifically on turning warm leads into registered patients.',
    cols: ['Lead ID', 'Source', 'Time to Convert', 'Converted By', 'First Revenue', 'Status'],
    stats: [{ label: 'Overall Conversion', val: '18%', col: 'text-emerald-400' }, { label: 'Best Channel', val: 'Referrals (45%)', col: 'text-blue-400' }, { label: 'Cost Per Acquisition', val: '$45', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { leadid: 'LED-' + (3001+i), source: 'Google Ads', timetoconvert: (2+i) + ' Days', convertedby: 'Rep Alice', firstrevenue: '$150', status: 'Converted' };
    })`
  },

  // Appointments & Follow-up
  {
    path: 'crm/appointments/followup', title: 'Follow-up Patients', desc: 'List of patients due for their post-consultation or post-surgery review.',
    cols: ['UHID', 'Patient Name', 'Primary Doctor', 'Last Visit', 'Follow-up Due Date', 'Status'],
    stats: [{ label: 'Due This Week', val: '340', col: 'text-blue-400' }, { label: 'Confirmed', val: '150', col: 'text-emerald-400' }, { label: 'Not Reachable', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { uhid: 'UHID-' + (4001+i), patientname: 'Patient ' + (1+i), primarydoctor: 'Dr. Smith', lastvisit: '15 Jun 2026', followupduedate: 'Next Week', status: i===0?'Unconfirmed':'Confirmed' };
    })`
  },
  {
    path: 'crm/appointments/missed', title: 'Missed Appointments', desc: 'No-show patients who need to be contacted for rescheduling to prevent revenue leak.',
    cols: ['Appointment ID', 'Patient', 'Doctor', 'Missed Date', 'Reschedule Action', 'Status'],
    stats: [{ label: 'No-Shows (Today)', val: '18', col: 'text-red-400' }, { label: 'Rescheduled', val: '8', col: 'text-emerald-400' }, { label: 'Revenue Saved', val: '$850', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { appointmentid: 'APT-' + (5001+i), patient: 'Patient ' + (1+i), doctor: 'Dr. Jones', misseddate: 'Yesterday', rescheduleaction: i===1?'SMS Sent':'Called & Booked', status: i===1?'Pending Reply':'Rescheduled' };
    })`
  },
  {
    path: 'crm/appointments/recall', title: 'Recall Patients', desc: 'Long-term recalls (e.g., annual dental check, 6-month diabetes review, mammograms).',
    cols: ['UHID', 'Patient Name', 'Recall Type', 'Last Done', 'Next Due', 'Status'],
    stats: [{ label: 'Recalls Due (Mo)', val: '850', col: 'text-blue-400' }, { label: 'Recall Success', val: '45%', col: 'text-emerald-400' }, { label: 'Pending Outreach', val: '120', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { uhid: 'UHID-' + (6001+i), patientname: 'Patient ' + (1+i), recalltype: 'Annual Mammogram', lastdone: 'July 2025', nextdue: 'July 2026', status: 'Outreach Active' };
    })`
  },
  {
    path: 'crm/appointments/reminders', title: 'Appointment Reminders', desc: 'Automated queue for sending SMS/WhatsApp/Email reminders 24h before visits.',
    cols: ['Reminder ID', 'Patient', 'Appointment Time', 'Channel', 'Sent Time', 'Status'],
    stats: [{ label: 'Reminders Sent (Today)', val: '450', col: 'text-blue-400' }, { label: 'Failed Delivery', val: '2', col: 'text-red-400' }, { label: 'Cancellations via Link', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reminderid: 'REM-' + (7001+i), patient: 'Patient ' + (1+i), appointmenttime: 'Tomorrow 10:00', channel: i===2?'Email':'WhatsApp', senttime: 'Today 09:00', status: 'Delivered' };
    })`
  },
  {
    path: 'crm/appointments/calendar', title: 'Follow-up Calendar', desc: 'Visual calendar view for CRM agents to see peak follow-up days and availability.',
    cols: ['Date', 'Total Slots', 'Booked Follow-ups', 'New Patients', 'Available', 'Status'],
    stats: [{ label: 'Capacity Utilization', val: '85%', col: 'text-emerald-400' }, { label: 'Overbooked Days', val: '2', col: 'text-red-400' }, { label: 'Next Open Slot', val: 'Tomorrow', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { date: '1' + i + ' Jul 2026', totalslots: '150', bookedfollowups: (80+i*5).toString(), newpatients: (40-i*2).toString(), available: (30-i*3).toString(), status: 'Active' };
    })`
  },

  // Communication Center
  {
    path: 'crm/communication/sms', title: 'SMS Center', desc: 'Bulk and transactional SMS dispatch for alerts, reports, and promotions.',
    cols: ['Campaign/Alert', 'Target Audience', 'SMS Sent', 'Delivered', 'Failed', 'Status'],
    stats: [{ label: 'SMS Sent (Mo)', val: '45,200', col: 'text-blue-400' }, { label: 'Delivery Rate', val: '98.5%', col: 'text-emerald-400' }, { label: 'Credits Remaining', val: '15,000', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { campaignalert: 'Health Check Promo', targetaudience: 'Age > 40', smssent: '5,000', delivered: '4,900', failed: '100', status: 'Completed' };
    })`
  },
  {
    path: 'crm/communication/whatsapp', title: 'WhatsApp Center', desc: 'Two-way WhatsApp Business API integration for interactive patient communication.',
    cols: ['Chat ID', 'Patient', 'Last Message', 'Agent Assigned', 'Response Time', 'Status'],
    stats: [{ label: 'Active Chats', val: '85', col: 'text-blue-400' }, { label: 'Avg Resolution Time', val: '4 Mins', col: 'text-emerald-400' }, { label: 'Bot Handled %', val: '65%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { chatid: 'WA-' + (1001+i), patient: 'Patient ' + (1+i), lastmessage: '"Can I reschedule?"', agentassigned: i===0?'Bot':'Agent Alice', responsetime: '1 Min', status: i===0?'Auto-Reply':'Active' };
    })`
  },
  {
    path: 'crm/communication/email', title: 'Email Center', desc: 'Newsletters, detailed health tips, and corporate communication dispatch.',
    cols: ['Campaign Name', 'Subject Line', 'Sent To', 'Open Rate', 'Click Rate', 'Status'],
    stats: [{ label: 'Emails Sent (Mo)', val: '12,400', col: 'text-blue-400' }, { label: 'Avg Open Rate', val: '24%', col: 'text-emerald-400' }, { label: 'Unsubscribes', val: '0.5%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { campaignname: 'Monthly Newsletter', subjectline: 'Summer Health Tips', sentto: '10,000', openrate: (20+i) + '%', clickrate: (5+i) + '%', status: 'Sent' };
    })`
  },
  {
    path: 'crm/communication/push', title: 'Push Notifications', desc: 'App-based notifications for patients using the hospital mobile app.',
    cols: ['Notification ID', 'Title', 'Audience Segment', 'Sent', 'Opened', 'Status'],
    stats: [{ label: 'Active App Users', val: '24,500', col: 'text-blue-400' }, { label: 'Push CTR', val: '12%', col: 'text-emerald-400' }, { label: 'Scheduled Pushes', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { notificationid: 'PUSH-' + (2001+i), title: 'Your Report is Ready', audiencesegment: 'Lab Patients', sent: '150', opened: '120', status: 'Delivered' };
    })`
  },
  {
    path: 'crm/communication/voice', title: 'Voice Calls (Robocalls)', desc: 'Automated voice broadcasts for emergency alerts or mass camp announcements.',
    cols: ['Broadcast ID', 'Audio File', 'Target Numbers', 'Answered', 'Avg Duration', 'Status'],
    stats: [{ label: 'Calls Placed (Mo)', val: '5,000', col: 'text-blue-400' }, { label: 'Answer Rate', val: '45%', col: 'text-amber-400' }, { label: 'Cost (Mo)', val: '$150', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { broadcastid: 'VOC-' + (3001+i), audiofile: 'camp_invite_en.mp3', targetnumbers: '1,000', answered: '450', avgduration: '15 Sec', status: 'Completed' };
    })`
  },
  {
    path: 'crm/communication/history', title: 'Communication History', desc: 'Central audit log of every message, email, or call made to any patient.',
    cols: ['Log ID', 'UHID', 'Patient', 'Channel', 'Direction', 'Timestamp'],
    stats: [{ label: 'Total Logs (YTD)', val: '1.2M', col: 'text-blue-400' }, { label: 'Most Used Channel', val: 'WhatsApp', col: 'text-emerald-400' }, { label: 'Outbound %', val: '75%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const channels = ['WhatsApp', 'SMS', 'Email', 'Voice', 'WhatsApp'];
      return { logid: 'LOG-' + (4001+i), uhid: 'UHID-' + (100+i), patient: 'Patient ' + (1+i), channel: channels[i], direction: i===0?'Inbound':'Outbound', timestamp: 'Today 10:' + (10+i) };
    })`
  },

  // Feedback & Surveys
  {
    path: 'crm/feedback/patient', title: 'Patient Feedback', desc: 'Consolidated view of all feedback collected via app, kiosks, or SMS links.',
    cols: ['Feedback ID', 'Patient', 'Department', 'Rating', 'Comments', 'Status'],
    stats: [{ label: 'Feedback Received', val: '450 (Mo)', col: 'text-blue-400' }, { label: 'Avg Rating', val: '4.2/5', col: 'text-emerald-400' }, { label: 'Negative (<3)', val: '15', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { feedbackid: 'FB-' + (1001+i), patient: 'Patient ' + (1+i), department: 'OPD', rating: (3+i%3) + '/5', comments: 'Good service', status: i===0?'Requires Follow-up':'Closed' };
    })`
  },
  {
    path: 'crm/feedback/satisfaction', title: 'Satisfaction Survey (CSAT)', desc: 'Detailed post-discharge or post-consultation survey metrics.',
    cols: ['Survey ID', 'Patient Type', 'Response Rate', 'Overall CSAT', 'Key Area to Improve', 'Status'],
    stats: [{ label: 'Overall CSAT', val: '88%', col: 'text-emerald-400' }, { label: 'Highest Score', val: 'Nursing Care', col: 'text-blue-400' }, { label: 'Lowest Score', val: 'Billing Wait Time', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { surveyid: 'SVY-' + (2001+i), patienttype: 'IPD Discharge', responserate: '35%', overallcsat: (80+i*2) + '%', keyareatoimprove: 'Food Quality', status: 'Active' };
    })`
  },
  {
    path: 'crm/feedback/nps', title: 'NPS Survey', desc: 'Net Promoter Score tracking (Promoters vs Detractors) for brand loyalty.',
    cols: ['Month', 'Total Responses', 'Promoters (9-10)', 'Passives (7-8)', 'Detractors (0-6)', 'NPS Score'],
    stats: [{ label: 'Current NPS', val: '+45', col: 'text-emerald-400' }, { label: 'Promoters', val: '60%', col: 'text-blue-400' }, { label: 'Detractors', val: '15%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { month: 'M' + (6-i) + ' 2026', totalresponses: '300', promoters: '180', passives: '75', detractors: '45', npsscore: '+45' };
    })`
  },
  {
    path: 'crm/feedback/doctor', title: 'Doctor Feedback', desc: 'Specific feedback and ratings targeted at individual physicians.',
    cols: ['Doctor Name', 'Department', 'Consults', 'Reviews', 'Avg Rating', 'Status'],
    stats: [{ label: 'Top Rated Doctor', val: 'Dr. Smith (4.9)', col: 'text-emerald-400' }, { label: 'Doctors < 4.0', val: '2', col: 'text-amber-400' }, { label: 'Total Reviews', val: '2,450', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { doctorname: 'Dr. ' + (1+i), department: 'General Med', consults: (400-i*50).toString(), reviews: (150-i*20).toString(), avgrating: (4.1+i*0.1).toFixed(1), status: 'Monitored' };
    })`
  },
  {
    path: 'crm/feedback/department', title: 'Department Feedback', desc: 'Analyzing feedback sliced by hospital departments (e.g., Radiology, Pharmacy).',
    cols: ['Department', 'Service Area', 'Total Ratings', 'Avg Score', 'Trend', 'Status'],
    stats: [{ label: 'Best Dept', val: 'Radiology (4.7)', col: 'text-emerald-400' }, { label: 'Needs Focus', val: 'Pharmacy (3.8)', col: 'text-amber-400' }, { label: 'Dept Reviews', val: '1,240', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Radiology', 'Pharmacy', 'Laboratory', 'Billing', 'Front Desk'];
      return { department: depts[i], servicearea: 'Wait Time', totalratings: '200', avgscore: (3.5+i*0.2).toFixed(1), trend: 'Upward', status: 'Analyzed' };
    })`
  },
  {
    path: 'crm/feedback/rating', title: 'Service Rating', desc: 'Micro-feedback (e.g., smiley faces) captured via tablets at specific touchpoints.',
    cols: ['Touchpoint/Device', 'Location', 'Excellent', 'Average', 'Poor', 'Status'],
    stats: [{ label: 'Total Taps (Today)', val: '850', col: 'text-blue-400' }, { label: 'Happy Taps', val: '85%', col: 'text-emerald-400' }, { label: 'Alerts Triggered', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { touchpointdevice: 'Tablet Kiosk ' + (1+i), location: 'OPD Waiting', excellent: '120', average: '20', poor: '5', status: 'Online' };
    })`
  },

  // Complaints & Grievances
  {
    path: 'crm/complaints/registration', title: 'Complaint Registration', desc: 'Logging formal grievances from patients regarding care, billing, or staff behavior.',
    cols: ['Complaint ID', 'Patient', 'Category', 'Severity', 'Logged Date', 'Status'],
    stats: [{ label: 'New Complaints', val: '8', col: 'text-amber-400' }, { label: 'High Severity', val: '1', col: 'text-red-400' }, { label: 'Avg Resolution Time', val: '48 Hrs', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { complaintid: 'CMP-' + (1001+i), patient: 'Patient ' + (1+i), category: 'Billing Issue', severity: i===0?'High':'Medium', loggeddate: 'Today', status: i===0?'Open':'In Progress' };
    })`
  },
  {
    path: 'crm/complaints/assignment', title: 'Complaint Assignment', desc: 'Routing complaints to the appropriate HOD or Grievance Officer for resolution.',
    cols: ['Complaint ID', 'Category', 'Assigned To', 'Department', 'Due Date', 'Status'],
    stats: [{ label: 'Unassigned', val: '3', col: 'text-red-400' }, { label: 'Assigned', val: '15', col: 'text-amber-400' }, { label: 'Most Loaded Agent', val: 'Grievance Officer', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { complaintid: 'CMP-' + (2001+i), category: 'Staff Behavior', assignedto: 'HR Manager', department: 'HR', duedate: 'Tomorrow', status: 'Assigned' };
    })`
  },
  {
    path: 'crm/complaints/tracking', title: 'Complaint Tracking', desc: 'Tracking the lifecycle and internal notes for ongoing complaint investigations.',
    cols: ['Complaint ID', 'Patient', 'Current Stage', 'Last Update', 'Updates', 'Status'],
    stats: [{ label: 'Under Investigation', val: '12', col: 'text-amber-400' }, { label: 'Awaiting Patient Reply', val: '4', col: 'text-blue-400' }, { label: 'Resolved (Mo)', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { complaintid: 'CMP-' + (3001+i), patient: 'Patient ' + (1+i), currentstage: 'Fact Finding', lastupdate: 'Today 10:00', updates: '3 Notes', status: 'In Progress' };
    })`
  },
  {
    path: 'crm/complaints/escalation', title: 'Escalation Management', desc: 'Complaints breaching SLA that have auto-escalated to Medical Director or CEO.',
    cols: ['Complaint ID', 'Breach Type', 'Original Assignee', 'Escalated To', 'Age', 'Status'],
    stats: [{ label: 'Escalated Cases', val: '2', col: 'text-red-400' }, { label: 'L1 Breaches', val: '1', col: 'text-amber-400' }, { label: 'L2 Breaches (CEO)', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { complaintid: 'CMP-' + (4001+i), breachtype: 'SLA > 72 Hrs', originalassignee: 'Billing Head', escalatedto: 'Medical Director', age: (4+i) + ' Days', status: 'Escalated' };
    })`
  },
  {
    path: 'crm/complaints/resolution', title: 'Resolution & Closure', desc: 'Finalizing the outcome, providing refunds/apologies, and closing the ticket.',
    cols: ['Complaint ID', 'Patient', 'Resolution Type', 'Approved By', 'Closed Date', 'Status'],
    stats: [{ label: 'Closed (Today)', val: '5', col: 'text-emerald-400' }, { label: 'Refunds Issued', val: '$450', col: 'text-amber-400' }, { label: 'Patient Satisfied %', val: '85%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { complaintid: 'CMP-' + (5001+i), patient: 'Patient ' + (1+i), resolutiontype: 'Bill Waived / Apology', approvedby: 'Finance Head', closeddate: 'Today', status: 'Closed' };
    })`
  },
  {
    path: 'crm/complaints/analytics', title: 'Complaint Analytics', desc: 'Trend analysis to identify systemic issues causing frequent patient dissatisfaction.',
    cols: ['Root Cause Category', 'Total Complaints', 'Trend', 'Avg Cost to Resolve', 'Action Plan', 'Status'],
    stats: [{ label: 'Top Issue', val: 'Wait Times', col: 'text-amber-400' }, { label: 'Complaint Rate', val: '0.5% of visits', col: 'text-emerald-400' }, { label: 'Cost of Quality', val: '$2,400 (Mo)', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const causes = ['Pharmacy Wait Time', 'Billing Errors', 'Rude Staff', 'Doctor Late', 'Cleanliness'];
      return { rootcausecategory: causes[i], totalcomplaints: (20-i*2).toString(), trend: 'Decreasing', avgcosttoresolve: '$' + (50+i*10), actionplan: 'Process Review', status: 'Analyzed' };
    })`
  },

  // Telemedicine
  {
    path: 'crm/telemedicine/video', title: 'Video Consultation', desc: 'Live video call interface for doctors and patients with integrated mini-EMR.',
    cols: ['Consult ID', 'Patient', 'Doctor', 'Scheduled Time', 'Duration', 'Status'],
    stats: [{ label: 'Consults Today', val: '45', col: 'text-blue-400' }, { label: 'Avg Duration', val: '12 Mins', col: 'text-emerald-400' }, { label: 'No-shows', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { consultid: 'VC-' + (1001+i), patient: 'Patient ' + (1+i), doctor: 'Dr. Virtual', scheduledtime: 'Today 10:' + (i*15), duration: i===0?'-':'15 Mins', status: i===0?'Waiting Room':(i===1?'In Call':'Completed') };
    })`
  },
  {
    path: 'crm/telemedicine/chat', title: 'Chat Consultation', desc: 'Asynchronous text-based consultation and follow-ups.',
    cols: ['Chat ID', 'Patient', 'Doctor', 'Started On', 'Messages', 'Status'],
    stats: [{ label: 'Active Chats', val: '24', col: 'text-blue-400' }, { label: 'Pending Dr Reply', val: '5', col: 'text-amber-400' }, { label: 'Resolved Today', val: '18', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { chatid: 'CHT-' + (2001+i), patient: 'Patient ' + (1+i), doctor: 'Dr. Text', startedon: 'Yesterday', messages: (5+i*2).toString(), status: i===0?'Pending Reply':'Active' };
    })`
  },
  {
    path: 'crm/telemedicine/schedule', title: 'Telemedicine Schedule', desc: 'Doctor availability and calendar specifically for remote consultations.',
    cols: ['Doctor Name', 'Specialty', 'Available Slots', 'Booked', 'Platform', 'Status'],
    stats: [{ label: 'Online Doctors', val: '12', col: 'text-emerald-400' }, { label: 'Total Slots', val: '120', col: 'text-blue-400' }, { label: 'Booked %', val: '75%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { doctorname: 'Dr. ' + (1+i), specialty: 'General Med', availableslots: '10', booked: (5+i).toString(), platform: 'Video/Chat', status: 'Online' };
    })`
  },
  {
    path: 'crm/telemedicine/history', title: 'Telemedicine History', desc: 'Logs, call recordings, and chat transcripts for medico-legal compliance.',
    cols: ['Consult ID', 'Patient', 'Date', 'Consult Type', 'Recording Available', 'Status'],
    stats: [{ label: 'Total Tele-consults', val: '4,500', col: 'text-blue-400' }, { label: 'Recordings Stored', val: '2.5 TB', col: 'text-amber-400' }, { label: 'Audit Passing', val: '100%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { consultid: 'VC-' + (3001+i), patient: 'Patient ' + (1+i), date: '01 Jun 2026', consulttype: 'Video', recordingavailable: 'Yes', status: 'Archived' };
    })`
  },
  {
    path: 'crm/telemedicine/prescription', title: 'Digital Prescription', desc: 'E-prescriptions generated post-teleconsultation, shared via WhatsApp/App.',
    cols: ['Rx ID', 'Patient', 'Prescriber', 'Drugs Prescribed', 'Shared Via', 'Status'],
    stats: [{ label: 'E-Rx Generated', val: '40 (Today)', col: 'text-blue-400' }, { label: 'Pharmacy Fulfillment', val: '65%', col: 'text-emerald-400' }, { label: 'Pending Rx', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { rxid: 'ERX-' + (4001+i), patient: 'Patient ' + (1+i), prescriber: 'Dr. Virtual', drugsprescribed: (2+i).toString(), sharedvia: 'WhatsApp + Email', status: 'Sent' };
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
        const isGood = val === 'Active' || val === 'Completed' || val === 'Converted' || val === 'Won' || val === 'Scheduled' || val === 'Confirmed' || val === 'Rescheduled' || val === 'Delivered' || val === 'Sent' || val === 'Auto-Reply' || val === 'Closed' || val === 'Archived' || val === 'Online';
        const isWarning = val === 'In Progress' || val === 'Nurturing' || val === 'Negotiation' || val === 'Action Required' || val === 'Unconfirmed' || val === 'Pending Reply' || val === 'Outreach Active' || val === 'Requires Follow-up' || val === 'Open' || val === 'Assigned' || val === 'Escalated' || val === 'Waiting Room';
        const isNeutral = val === 'New' || val === 'Replied' || val === 'Contacted' || val === 'Interested' || val === 'In Country' || val === 'Analyzed' || val === 'Monitored' || val === 'In Call';
        const isDanger = val === 'Lost' || val === 'Failed' || val === 'Rejected';
        
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
