const fs = require('fs');
const path = require('path');

const config = [
  // VISITORS
  {
    path: 'visitors/register', title: 'Visitor Registration', desc: 'Register new visitors and assign them to specific patients or departments.',
    cols: ['Visitor ID', 'Visitor Name', 'Purpose', 'Visiting (Patient/Dept)', 'Entry Time', 'Status'],
    stats: [{ label: 'Total Visitors Today', val: '142', col: 'text-blue-400' }, { label: 'Currently Inside', val: '45', col: 'text-amber-400' }, { label: 'Blacklisted Alerts', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['John Smith', 'Sarah Connor', 'Peter Parker', 'Mary Jane', 'Tony Stark'];
      const purposes = ['Patient Visit', 'Vendor Meeting', 'Patient Visit', 'Interview', 'Official Visit'];
      const targets = ['ICU Bed 12', 'Admin Office', 'Room 304', 'HR Dept', 'Director Office'];
      const times = ['09:15 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:45 AM'];
      const statuses = ['Checked In', 'Checked Out', 'Checked In', 'Checked In', 'Pending'];
      return { visitorid: 'VIS-' + (1001+i), visitorname: names[i], purpose: purposes[i], visitingpatientdept: targets[i], entrytime: times[i], status: statuses[i] };
    })`
  },
  {
    path: 'visitors/pass', title: 'Visitor Passes', desc: 'Issue and manage digital or physical passes for registered visitors.',
    cols: ['Pass ID', 'Visitor Name', 'Pass Type', 'Valid Until', 'Issued By', 'Status'],
    stats: [{ label: 'Active Passes', val: '86', col: 'text-blue-400' }, { label: 'Expired Today', val: '54', col: 'text-gray-400' }, { label: 'Revoked', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['John Smith', 'Sarah Connor', 'Peter Parker', 'Mary Jane', 'Tony Stark'];
      const types = ['One-Time Pass', 'Vendor Pass', 'Attendant Pass', 'One-Time Pass', 'VIP Pass'];
      const valids = ['Today 05:00 PM', '15 Jul, 2026', '30 Jun, 2026', 'Today 06:00 PM', '31 Dec, 2026'];
      const statuses = ['Active', 'Active', 'Expired', 'Active', 'Active'];
      return { passid: 'PAS-' + (2001+i), visitorname: names[i], passtype: types[i], validuntil: valids[i], issuedby: 'Front Desk', status: statuses[i] };
    })`
  },
  {
    path: 'visitors/history', title: 'Visitor History Logs', desc: 'Complete historical logs of all visitor entries and exits.',
    cols: ['Log ID', 'Visitor Name', 'Date', 'Entry Time', 'Exit Time', 'Duration'],
    stats: [{ label: 'Total Logs', val: '45,210', col: 'text-blue-400' }, { label: 'Avg Visit Time', val: '1h 15m', col: 'text-emerald-400' }, { label: 'Overstays', val: '14', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const entries = ['09:00 AM', '10:30 AM', '02:15 PM', '04:00 PM', '08:30 AM'];
      const exits = ['10:00 AM', '12:00 PM', '03:45 PM', '05:30 PM', '09:45 AM'];
      const durations = ['1h 0m', '1h 30m', '1h 30m', '1h 30m', '1h 15m'];
      return { logid: 'LOG-' + (3001+i), visitorname: names[i], date: 'Yesterday', entrytime: entries[i], exittime: exits[i], duration: durations[i] };
    })`
  },
  {
    path: 'visitors/approval', title: 'Visitor Approvals', desc: 'Approve or reject special visitor requests or extended passes.',
    cols: ['Request ID', 'Visitor Name', 'Request Type', 'Reason', 'Requested By', 'Status'],
    stats: [{ label: 'Pending Requests', val: '12', col: 'text-amber-400' }, { label: 'Approved Today', val: '24', col: 'text-emerald-400' }, { label: 'Rejected', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Lex Luthor', 'Joker', 'Riddler', 'Penguin', 'Two-Face'];
      const types = ['Extended Hours', 'ICU Access', 'Vendor Access', 'Overnight Pass', 'VIP Entry'];
      const reasons = ['Critical Condition', 'Family Member', 'Maintenance', 'Attendant', 'Director Meeting'];
      const statuses = ['Pending', 'Rejected', 'Approved', 'Pending', 'Approved'];
      return { requestid: 'REQ-' + (4001+i), visitorname: names[i], requesttype: types[i], reason: reasons[i], requestedby: 'Patient Family', status: statuses[i] };
    })`
  },

  // HELPDESK
  {
    path: 'helpdesk/enquiry', title: 'Helpdesk Enquiries', desc: 'Manage and respond to patient and public enquiries.',
    cols: ['Enquiry ID', 'Caller/Sender', 'Category', 'Received Via', 'Assigned To', 'Status'],
    stats: [{ label: 'Open Enquiries', val: '34', col: 'text-amber-400' }, { label: 'Resolved Today', val: '112', col: 'text-emerald-400' }, { label: 'Avg Response', val: '12 mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const callers = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
      const cats = ['Appointment', 'Billing', 'General Info', 'Insurance', 'Feedback'];
      const vias = ['Phone Call', 'Email', 'Web Portal', 'WhatsApp', 'In-Person'];
      const statuses = ['Open', 'Resolved', 'In Progress', 'Open', 'Resolved'];
      return { enquiryid: 'ENQ-' + (1001+i), callersender: callers[i], category: cats[i], receivedvia: vias[i], assignedto: 'Agent ' + (i+1), status: statuses[i] };
    })`
  },
  {
    path: 'helpdesk/services', title: 'Hospital Services Info', desc: 'Directory of available services for helpdesk reference.',
    cols: ['Service ID', 'Service Name', 'Department', 'Operating Hours', 'Contact Ext', 'Status'],
    stats: [{ label: 'Total Services', val: '45', col: 'text-blue-400' }, { label: '24/7 Services', val: '8', col: 'text-emerald-400' }, { label: 'Temporarily Closed', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const services = ['24/7 Emergency', 'Outpatient Consult', 'Radiology (MRI/CT)', 'In-house Pharmacy', 'Physiotherapy'];
      const depts = ['Emergency', 'OPD', 'Diagnostics', 'Pharmacy', 'Rehabilitation'];
      const hours = ['24/7', '09:00 - 17:00', '24/7', '24/7', '10:00 - 18:00'];
      const exts = ['100', '201', '305', '401', '502'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Maintenance'];
      return { serviceid: 'SRV-' + (2001+i), servicename: services[i], department: depts[i], operatinghours: hours[i], contactext: exts[i], status: statuses[i] };
    })`
  },
  {
    path: 'helpdesk/packages', title: 'Health Packages', desc: 'Manage health checkup packages and promotional offers.',
    cols: ['Package ID', 'Package Name', 'Target Demo', 'Tests Included', 'Price', 'Status'],
    stats: [{ label: 'Active Packages', val: '12', col: 'text-blue-400' }, { label: 'Bookings Today', val: '45', col: 'text-emerald-400' }, { label: 'Revenue Generated', val: '$12,450', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pkgs = ['Master Health Check', 'Cardiac Screening', 'Women Wellness', 'Diabetic Care', 'Senior Citizen Basic'];
      const demos = ['Adults 30+', 'Adults 40+', 'Women 18+', 'Diabetics', 'Adults 60+'];
      const tests = ['45 Tests', '12 Tests', '24 Tests', '15 Tests', '20 Tests'];
      const prices = ['$299', '$499', '$349', '$199', '$149'];
      const statuses = ['Active', 'Active', 'Active', 'Promotional', 'Inactive'];
      return { packageid: 'PKG-' + (3001+i), packagename: pkgs[i], targetdemo: demos[i], testsincluded: tests[i], price: prices[i], status: statuses[i] };
    })`
  },

  // COMMUNICATION
  {
    path: 'communication/sms', title: 'SMS Gateway', desc: 'Monitor and send automated SMS alerts and broadcasts.',
    cols: ['Message ID', 'Recipient', 'Template', 'Sent Time', 'Gateway Status', 'Status'],
    stats: [{ label: 'Sent Today', val: '1,450', col: 'text-blue-400' }, { label: 'Delivered', val: '98.5%', col: 'text-emerald-400' }, { label: 'Failed', val: '1.5%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const recs = ['+1 555-0101', '+1 555-0102', '+1 555-0103', '+1 555-0104', '+1 555-0105'];
      const tpls = ['Appt Reminder', 'Lab Result Ready', 'Payment OTP', 'Promo Broadcast', 'Appt Reminder'];
      const statuses = ['Delivered', 'Delivered', 'Failed', 'Sent', 'Delivered'];
      return { messageid: 'SMS-' + (1001+i), recipient: recs[i], template: tpls[i], senttime: '10:' + (10+i) + ' AM', gatewaystatus: '200 OK', status: statuses[i] };
    })`
  },
  {
    path: 'communication/whatsapp', title: 'WhatsApp Integration', desc: 'Manage WhatsApp Business API messages and templates.',
    cols: ['Message ID', 'Recipient', 'Message Type', 'Direction', 'Read Receipt', 'Status'],
    stats: [{ label: 'Messages Today', val: '3,200', col: 'text-blue-400' }, { label: 'Read Rate', val: '84%', col: 'text-emerald-400' }, { label: 'Opt-outs', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const recs = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Brown', 'Emily Davis'];
      const types = ['Template', 'Session Msg', 'Media (PDF)', 'Template', 'Session Msg'];
      const dirs = ['Outbound', 'Inbound', 'Outbound', 'Outbound', 'Inbound'];
      const reads = ['Read', 'N/A', 'Delivered', 'Read', 'N/A'];
      const statuses = ['Completed', 'Action Required', 'Sent', 'Completed', 'Action Required'];
      return { messageid: 'WA-' + (2001+i), recipient: recs[i], messagetype: types[i], direction: dirs[i], readreceipt: reads[i], status: statuses[i] };
    })`
  },
  {
    path: 'communication/email', title: 'Email Dispatcher', desc: 'Track automated emails for reports, invoices, and updates.',
    cols: ['Email ID', 'Recipient', 'Subject', 'Sent Time', 'Opens/Clicks', 'Status'],
    stats: [{ label: 'Emails Sent', val: '8,540', col: 'text-blue-400' }, { label: 'Open Rate', val: '45%', col: 'text-emerald-400' }, { label: 'Bounces', val: '0.2%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const recs = ['user1@mail.com', 'user2@mail.com', 'user3@mail.com', 'user4@mail.com', 'user5@mail.com'];
      const subs = ['Your Lab Results', 'Invoice #1092', 'Newsletter - Jun', 'Appointment Confirmed', 'Welcome to MedixPro'];
      const opens = ['1 / 0', '2 / 1', '0 / 0', '1 / 0', '3 / 2'];
      const statuses = ['Delivered', 'Delivered', 'Bounced', 'Sent', 'Delivered'];
      return { emailid: 'EML-' + (3001+i), recipient: recs[i], subject: subs[i], senttime: '09:' + (15+i) + ' AM', opensclicks: opens[i], status: statuses[i] };
    })`
  },
  {
    path: 'communication/reminders', title: 'Automated Reminders', desc: 'Configure and monitor scheduled appointment and medication reminders.',
    cols: ['Reminder ID', 'Patient', 'Reminder Type', 'Channel', 'Scheduled For', 'Status'],
    stats: [{ label: 'Active Campaigns', val: '4', col: 'text-blue-400' }, { label: 'Reminders Today', val: '450', col: 'text-emerald-400' }, { label: 'No Shows Avoided', val: 'Estimated 85', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const types = ['Appt (24h)', 'Appt (2h)', 'Medication Refill', 'Follow-up Due', 'Annual Checkup'];
      const chans = ['SMS & Email', 'WhatsApp', 'SMS', 'Email', 'SMS'];
      const scheds = ['Tomorrow 09:00 AM', 'Today 02:00 PM', '15 Jun, 2026', '01 Jul, 2026', '12 Aug, 2026'];
      const statuses = ['Scheduled', 'Sent', 'Scheduled', 'Draft', 'Scheduled'];
      return { reminderid: 'REM-' + (4001+i), patient: pats[i], remindertype: types[i], channel: chans[i], scheduledfor: scheds[i], status: statuses[i] };
    })`
  },

  // SUPPORT
  {
    path: 'support/complaints', title: 'Patient Complaints', desc: 'Track and resolve patient grievances and complaints.',
    cols: ['Ticket ID', 'Complainant', 'Category', 'Severity', 'Assigned Dept', 'Status'],
    stats: [{ label: 'Open Complaints', val: '12', col: 'text-red-400' }, { label: 'Resolved Today', val: '8', col: 'text-emerald-400' }, { label: 'Avg Resolution', val: '2.4 Days', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Angry Patient 1', 'Upset Relative', 'Disappointed User', 'Annoyed Patient', 'Frustrated Caller'];
      const cats = ['Billing Issue', 'Staff Behavior', 'Long Wait Time', 'Facility Cleanliness', 'Food Quality'];
      const sevs = ['High', 'Critical', 'Medium', 'Medium', 'Low'];
      const depts = ['Finance', 'HR', 'Operations', 'Housekeeping', 'Dietary'];
      const statuses = ['Open', 'Escalated', 'In Progress', 'Resolved', 'Resolved'];
      return { ticketid: 'CMP-' + (1001+i), complainant: names[i], category: cats[i], severity: sevs[i], assigneddept: depts[i], status: statuses[i] };
    })`
  },
  {
    path: 'support/suggestions', title: 'Feedback & Suggestions', desc: 'Review patient feedback and improvement suggestions.',
    cols: ['Feedback ID', 'Submitted By', 'Topic', 'Rating', 'Submission Date', 'Status'],
    stats: [{ label: 'Avg Rating', val: '4.6/5.0', col: 'text-emerald-400' }, { label: 'New Submissions', val: '24', col: 'text-blue-400' }, { label: 'Actioned', val: '150', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Happy Patient', 'Anonymous', 'Anonymous', 'Satisfied User', 'Constructive Critic'];
      const topics = ['Great Nursing Staff', 'More Parking Needed', 'Cafeteria Menu', 'Smooth Discharge', 'App UI Improvement'];
      const ratings = ['5/5', '3/5', '4/5', '5/5', '4/5'];
      const statuses = ['Reviewed', 'Action Planned', 'Reviewed', 'Reviewed', 'Pending Review'];
      return { feedbackid: 'FBK-' + (2001+i), submittedby: names[i], topic: topics[i], rating: ratings[i], submissiondate: 'Today', status: statuses[i] };
    })`
  },
  {
    path: 'support/lost-found', title: 'Lost & Found', desc: 'Register and track items lost or found on hospital premises.',
    cols: ['Item ID', 'Item Description', 'Report Type', 'Location', 'Reported By', 'Status'],
    stats: [{ label: 'Items Found', val: '45', col: 'text-emerald-400' }, { label: 'Items Lost', val: '12', col: 'text-amber-400' }, { label: 'Claimed', val: '38', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const items = ['Gold Ring', 'Wallet (Brown)', 'Reading Glasses', 'Mobile Phone', 'Keys'];
      const types = ['Found', 'Lost', 'Found', 'Found', 'Lost'];
      const locs = ['Washroom 2nd Flr', 'Cafeteria', 'Waiting Area A', 'ICU Lobby', 'Parking Lot'];
      const reporters = ['Housekeeping', 'Visitor', 'Security', 'Nurse', 'Patient'];
      const statuses = ['Unclaimed', 'Searching', 'Claimed', 'Unclaimed', 'Searching'];
      return { itemid: 'LNF-' + (3001+i), itemdescription: items[i], reporttype: types[i], location: locs[i], reportedby: reporters[i], status: statuses[i] };
    })`
  },

  // REPORTS (Specific)
  {
    path: 'reports/registration', title: 'Registration Reports', desc: 'Analytics on new patient registrations and demographics.',
    cols: ['Date Range', 'Total Registrations', 'Online', 'Walk-in', 'Revenue Impact', 'Status'],
    stats: [{ label: 'Registrations (MTD)', val: '1,240', col: 'text-blue-400' }, { label: 'Growth', val: '+15%', col: 'text-emerald-400' }, { label: 'Online Share', val: '65%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const ranges = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month'];
      const totals = ['124', '115', '840', '790', '3,450'];
      const onlines = ['80', '75', '550', '500', '2,200'];
      const walkins = ['44', '40', '290', '290', '1,250'];
      const revenues = ['$2,480', '$2,300', '$16,800', '$15,800', '$69,000'];
      return { daterange: ranges[i], totalregistrations: totals[i], online: onlines[i], walkin: walkins[i], revenueimpact: revenues[i], status: 'Generated' };
    })`
  },
  {
    path: 'reports/queue', title: 'Queue & Wait Time Reports', desc: 'Analysis of patient waiting times across departments.',
    cols: ['Department', 'Total Patients', 'Avg Wait Time', 'Max Wait Time', 'Service Time', 'Status'],
    stats: [{ label: 'Global Avg Wait', val: '14 mins', col: 'text-emerald-400' }, { label: 'Longest Queue', val: 'Orthopedics', col: 'text-amber-400' }, { label: 'SLA Breaches', val: '1.2%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Cardiology', 'Orthopedics', 'Pediatrics', 'General Med', 'Dental'];
      const pats = ['145', '210', '180', '320', '85'];
      const avg = ['12 mins', '25 mins', '10 mins', '15 mins', '8 mins'];
      const max = ['30 mins', '55 mins', '25 mins', '45 mins', '15 mins'];
      const serv = ['20 mins', '15 mins', '15 mins', '10 mins', '30 mins'];
      const statuses = ['Optimal', 'Warning', 'Optimal', 'Normal', 'Optimal'];
      return { department: depts[i], totalpatients: pats[i], avgwaittime: avg[i], maxwaittime: max[i], servicetime: serv[i], status: statuses[i] };
    })`
  },
  {
    path: 'reports/admission', title: 'Admission & Discharge Reports', desc: 'Trends and statistics on hospital admissions.',
    cols: ['Period', 'Total Admissions', 'Total Discharges', 'Net Change', 'Avg Length of Stay', 'Status'],
    stats: [{ label: 'Admissions (MTD)', val: '842', col: 'text-blue-400' }, { label: 'Avg LOS', val: '4.2 Days', col: 'text-emerald-400' }, { label: 'Occupancy Rate', val: '82%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const periods = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month'];
      const adms = ['45', '42', '310', '290', '1,240'];
      const dis = ['38', '45', '280', '300', '1,100'];
      const nets = ['+7', '-3', '+30', '-10', '+140'];
      const los = ['N/A', 'N/A', '4.1 Days', '4.3 Days', '4.2 Days'];
      return { period: periods[i], totaladmissions: adms[i], totaldischarges: dis[i], netchange: nets[i], avglengthofstay: los[i], status: 'Generated' };
    })`
  },
  {
    path: 'reports/visitor', title: 'Visitor Tracking Reports', desc: 'Security and footfall reports for facility visitors.',
    cols: ['Location/Gate', 'Total Entries', 'Peak Hour', 'Avg Stay', 'Security Flags', 'Status'],
    stats: [{ label: 'Total Footfall', val: '1,450', col: 'text-blue-400' }, { label: 'Busiest Gate', val: 'Main Entrance', col: 'text-amber-400' }, { label: 'Security Alerts', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const locs = ['Main Entrance', 'ER Gate', 'Staff Entrance', 'Parking A', 'VIP Entry'];
      const entries = ['850', '210', '145', '300', '25'];
      const peaks = ['10:00 AM - 11:00 AM', '08:00 PM - 09:00 PM', '08:00 AM - 09:00 AM', '10:00 AM - 11:00 AM', 'N/A'];
      const stays = ['1h 15m', '45m', '8h 30m', '2h 0m', '1h 0m'];
      const flags = ['1', '1', '0', '0', '0'];
      return { locationgate: locs[i], totalentries: entries[i], peakhour: peaks[i], avgstay: stays[i], securityflags: flags[i], status: 'Generated' };
    })`
  },
  {
    path: 'reports/reception-performance', title: 'Reception Performance', desc: 'KPIs and metrics for front desk staff efficiency.',
    cols: ['Staff Name', 'Patients Handled', 'Avg Registration Time', 'Calls Answered', 'Feedback Score', 'Status'],
    stats: [{ label: 'Avg Reg Time', val: '3m 45s', col: 'text-emerald-400' }, { label: 'Total Handled', val: '1,240', col: 'text-blue-400' }, { label: 'Overall Satisfaction', val: '4.8/5.0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Pam Beesly', 'Erin Hannon', 'Kelly Kapoor', 'Angela Martin', 'Phyllis Vance'];
      const pats = ['145', '120', '95', '110', '105'];
      const times = ['3m 15s', '4m 00s', '3m 45s', '2m 50s', '4m 15s'];
      const calls = ['45', '60', '85', '30', '40'];
      const scores = ['4.9/5', '4.7/5', '4.2/5', '4.8/5', '4.6/5'];
      const statuses = ['Excellent', 'Good', 'Average', 'Excellent', 'Good'];
      return { staffname: names[i], patientshandled: pats[i], avgregistrationtime: times[i], callsanswered: calls[i], feedbackscore: scores[i], status: statuses[i] };
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
        const isGood = val === 'Active' || val === 'Checked Out' || val === 'Resolved' || val === 'Delivered' || val === 'Sent' || val === 'Completed' || val === 'Claimed' || val === 'Generated' || val === 'Optimal' || val === 'Excellent' || val === 'Good' || val === 'Approved';
        const isWarning = val === 'Pending' || val === 'Checked In' || val === 'In Progress' || val === 'Action Required' || val === 'Action Planned' || val === 'Searching' || val === 'Warning' || val === 'Escalated' || val === 'Pending Review' || val === 'Promotional';
        const isNeutral = val === 'Unclaimed' || val === 'Draft' || val === 'Scheduled' || val === 'Open' || val === 'Reviewed';
        
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
        <div className="flex justify-between items-center my-3 my-3">
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

config.forEach(page => {
  const dir = path.join(__dirname, 'frontend', 'src', 'app', ...page.path.split('/'));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page, componentName));
  console.log('Generated: ' + page.path);
});
