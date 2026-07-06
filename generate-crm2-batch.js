const fs = require('fs');
const path = require('path');

const config = [
  // Marketing & Campaigns
  {
    path: 'crm/marketing/email', title: 'Email Campaigns', desc: 'Creation and tracking of marketing emails for health checkups and hospital news.',
    cols: ['Campaign Name', 'Target Segment', 'Sent Date', 'Open Rate', 'Conversion', 'Status'],
    stats: [{ label: 'Active Campaigns', val: '4', col: 'text-blue-400' }, { label: 'Avg Open Rate', val: '22%', col: 'text-emerald-400' }, { label: 'Click-to-Open', val: '14%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { campaignname: 'Cardiac Screening Promo', targetsegment: 'Males > 45', sentdate: '01 Jul 2026', openrate: (20+i) + '%', conversion: (2+i*0.5) + '%', status: i===0?'Draft':'Completed' };
    })`
  },
  {
    path: 'crm/marketing/sms', title: 'SMS Campaigns', desc: 'Short promotional broadcasts for immediate reach (e.g., Blood donation camps).',
    cols: ['Campaign Name', 'Sent To', 'Cost ($)', 'Click Rate (Link)', 'Opt-outs', 'Status'],
    stats: [{ label: 'Total Sent (Mo)', val: '45K', col: 'text-blue-400' }, { label: 'Avg Link Clicks', val: '4.5%', col: 'text-amber-400' }, { label: 'Opt-out Rate', val: '0.1%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { campaignname: 'Free Dental Checkup', sentto: '10,000', cost: '$100', clickrate: (3+i*0.5) + '%', optouts: (10+i).toString(), status: 'Completed' };
    })`
  },
  {
    path: 'crm/marketing/whatsapp', title: 'WhatsApp Campaigns', desc: 'Rich media (images/videos) campaigns via WhatsApp Business API.',
    cols: ['Campaign Name', 'Media Type', 'Delivered', 'Read Rate', 'Bot Interactions', 'Status'],
    stats: [{ label: 'Active Campaigns', val: '2', col: 'text-blue-400' }, { label: 'Read Rate', val: '85%', col: 'text-emerald-400' }, { label: 'Lead Gen via Bot', val: '145', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { campaignname: 'Maternity Package Info', mediatype: 'PDF + Image', delivered: '5,000', readrate: (80+i) + '%', botinteractions: (400+i*10).toString(), status: i===0?'Active':'Completed' };
    })`
  },
  {
    path: 'crm/marketing/camp', title: 'Health Camp Management', desc: 'Planning, budgeting, and lead tracking for physical health camps in the community.',
    cols: ['Camp Name', 'Location', 'Date', 'Budget', 'Attendees', 'Status'],
    stats: [{ label: 'Upcoming Camps', val: '3', col: 'text-blue-400' }, { label: 'Total Attendees (YTD)', val: '4,500', col: 'text-emerald-400' }, { label: 'ROI (Revenue/Cost)', val: '3.4x', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { campname: 'Lions Club Eye Camp', location: 'City Center Hub', date: '15 Jul 2026', budget: '$500', attendees: i===0?'-':(200+i*50).toString(), status: i===0?'Planned':'Completed' };
    })`
  },
  {
    path: 'crm/marketing/wellness', title: 'Wellness Programs', desc: 'Corporate and community wellness subscriptions, yoga classes, or diet programs.',
    cols: ['Program Name', 'Target Audience', 'Subscribers', 'Revenue', 'Start Date', 'Status'],
    stats: [{ label: 'Active Programs', val: '5', col: 'text-blue-400' }, { label: 'Total Subscribers', val: '850', col: 'text-emerald-400' }, { label: 'Churn Rate', val: '5%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { programname: 'Diabetic Reversal 90 Days', targetaudience: 'Pre-Diabetics', subscribers: (150-i*10).toString(), revenue: '$' + (15000-i*1000), startdate: '01 Jan 2026', status: 'Active' };
    })`
  },
  {
    path: 'crm/marketing/promotional', title: 'Promotional Campaigns', desc: 'Discounts, seasonal offers (e.g., Monsoon Health Check), and cross-selling.',
    cols: ['Promo Name', 'Promo Code', 'Validity', 'Redemptions', 'Revenue Generated', 'Status'],
    stats: [{ label: 'Active Promos', val: '4', col: 'text-blue-400' }, { label: 'Total Redemptions', val: '340', col: 'text-emerald-400' }, { label: 'Discount Given', val: '$3,400', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { promoname: 'Monsoon Full Body', promocode: 'MONSOON20', validity: '31 Aug 2026', redemptions: (100-i*10).toString(), revenuegenerated: '$' + (5000-i*500), status: 'Active' };
    })`
  },

  // Loyalty & Membership
  {
    path: 'crm/loyalty/plans', title: 'Membership Plans', desc: 'Configuration of hospital membership tiers (Silver, Gold, Platinum) and benefits.',
    cols: ['Plan Name', 'Annual Fee', 'OPD Discount', 'Pharmacy Discount', 'Active Members', 'Status'],
    stats: [{ label: 'Total Members', val: '4,500', col: 'text-blue-400' }, { label: 'Gold/Platinum %', val: '30%', col: 'text-emerald-400' }, { label: 'Renewal Rate', val: '82%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const plans = ['Basic Care', 'Silver Health', 'Gold Premium', 'Platinum Plus', 'Senior Citizen Care'];
      const fees = ['Free', '$50', '$100', '$250', '$40'];
      return { planname: plans[i], annualfee: fees[i], opddiscount: (i*5) + '%', pharmacydiscount: (i*2) + '%', activemembers: (1000-i*150).toString(), status: 'Active' };
    })`
  },
  {
    path: 'crm/loyalty/points', title: 'Loyalty Points', desc: 'Tracking reward points earned by patients on billing, and redemption history.',
    cols: ['Patient Name', 'UHID', 'Points Balance', 'Lifetime Earned', 'Last Redeemed', 'Status'],
    stats: [{ label: 'Total Points Issued', val: '1.2M', col: 'text-blue-400' }, { label: 'Points Redeemed', val: '850K', col: 'text-emerald-400' }, { label: 'Unredeemed Liability', val: '$3,500', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { patientname: 'Patient ' + (1+i), uhid: 'UHID-' + (100+i), pointsbalance: (500+i*100).toString(), lifetimeearned: (2000+i*500).toString(), lastredeemed: '15 Jun 2026', status: 'Active Member' };
    })`
  },
  {
    path: 'crm/loyalty/family', title: 'Family Membership', desc: 'Grouped memberships where benefits and points are shared across family members.',
    cols: ['Family ID', 'Primary Member', 'Dependents', 'Plan Type', 'Expiry Date', 'Status'],
    stats: [{ label: 'Family Plans Active', val: '850', col: 'text-blue-400' }, { label: 'Avg Dependents', val: '3', col: 'text-emerald-400' }, { label: 'Pending Renewals', val: '45', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { familyid: 'FAM-' + (1001+i), primarymember: 'John Doe ' + i, dependents: (2+i%3).toString(), plantype: 'Gold Family', expirydate: '31 Dec 2026', status: 'Active' };
    })`
  },
  {
    path: 'crm/loyalty/corporate', title: 'Corporate Membership', desc: 'Special discounted plans configured for employees of partner companies.',
    cols: ['Corporate Name', 'Employees Covered', 'OPD Discount', 'IPD Tariff', 'Contract Expiry', 'Status'],
    stats: [{ label: 'Corporate Partners', val: '45', col: 'text-blue-400' }, { label: 'Covered Lives', val: '12,400', col: 'text-emerald-400' }, { label: 'Utilization Rate', val: '45%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { corporatename: 'Tech Corp ' + (1+i), employeescovered: (500-i*50).toString(), opddiscount: '15%', ipdtariff: 'CGHS Rates', contractexpiry: '31 Mar 2027', status: 'Active' };
    })`
  },
  {
    path: 'crm/loyalty/wellness', title: 'Wellness Packages', desc: 'Pre-paid health checkup bundles (e.g., Master Health Check, Cardiac Check).',
    cols: ['Package Name', 'Price', 'Tests Included', 'Packages Sold (YTD)', 'Revenue', 'Status'],
    stats: [{ label: 'Total Packages Sold', val: '2,450', col: 'text-blue-400' }, { label: 'Top Seller', val: 'Master Health Check', col: 'text-emerald-400' }, { label: 'Avg Package Value', val: '$120', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pkgs = ['Master Health Check', 'Cardiac Screening', 'Diabetic Profile', 'Women Wellness', 'Senior Citizen Pkg'];
      return { packagename: pkgs[i], price: '$' + (100+i*20), testsincluded: (15-i*2).toString(), packagessold: (500-i*50).toString(), revenue: '$' + (50000-i*5000), status: 'Active' };
    })`
  },

  // Referral Management
  {
    path: 'crm/referrals/doctor', title: 'Doctor Referrals', desc: 'Tracking patients sent by external GPs or partner clinics.',
    cols: ['External Doctor', 'Clinic/Hospital', 'Referrals (YTD)', 'Converted to IPD', 'Revenue Gen.', 'Status'],
    stats: [{ label: 'Active Referrers', val: '145', col: 'text-blue-400' }, { label: 'Total Referrals (Mo)', val: '340', col: 'text-emerald-400' }, { label: 'IPD Conversion', val: '45%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { externaldoctor: 'Dr. John ' + (1+i), clinichospital: 'City Clinic ' + (1+i), referrals: (45-i*5).toString(), convertedtoipd: (20-i*2).toString(), revenuegen: '$' + (45000-i*5000), status: 'Active Partner' };
    })`
  },
  {
    path: 'crm/referrals/patient', title: 'Patient Referrals', desc: 'Word-of-mouth tracking; patients referring friends or family members.',
    cols: ['Referring Patient', 'UHID', 'Referred Friends', 'Converted', 'Reward Points Given', 'Status'],
    stats: [{ label: 'Patient Referrals (Mo)', val: '120', col: 'text-blue-400' }, { label: 'Conversion Rate', val: '65%', col: 'text-emerald-400' }, { label: 'Points Distributed', val: '12,000', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { referringpatient: 'Patient A' + i, uhid: 'UHID-' + (500+i), referredfriends: (5-i).toString(), converted: (3-i%2).toString(), rewardpointsgiven: (1500-i*200).toString(), status: 'Active' };
    })`
  },
  {
    path: 'crm/referrals/corporate', title: 'Corporate Referrals', desc: 'Leads generated via corporate HR or company doctors.',
    cols: ['Corporate Partner', 'HR Contact', 'Referrals Received', 'Health Checks Done', 'IPD Admissions', 'Status'],
    stats: [{ label: 'Corp Referrals (YTD)', val: '850', col: 'text-blue-400' }, { label: 'Top Corporate', val: 'TechCorp Inc.', col: 'text-emerald-400' }, { label: 'Avg Revenue/Patient', val: '$450', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { corporatepartner: 'Company ' + (1+i), hrcontact: 'HR Manager', referralsreceived: (150-i*10).toString(), healthchecksdone: (100-i*5).toString(), ipdadmissions: (15-i).toString(), status: 'Active Partner' };
    })`
  },
  {
    path: 'crm/referrals/rewards', title: 'Referral Rewards', desc: 'Managing payouts, discounts, or loyalty points given to referrers.',
    cols: ['Referrer Name', 'Type', 'Reward Earned', 'Amount/Points', 'Date Issued', 'Status'],
    stats: [{ label: 'Rewards Issued (Mo)', val: '145', col: 'text-blue-400' }, { label: 'Total Value', val: '$4,500', col: 'text-amber-400' }, { label: 'Pending Payouts', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['External Doctor', 'Patient', 'Patient', 'External Doctor', 'Corporate HR'];
      return { referrername: 'Referrer ' + (1+i), type: types[i], rewardearned: types[i]==='Patient'?'Loyalty Points':'Professional Fee', amountpoints: types[i]==='Patient'?'500 Pts':'$100', dateissued: 'Today', status: i===0?'Pending Auth':'Issued' };
    })`
  },
  {
    path: 'crm/referrals/analytics', title: 'Referral Analytics', desc: 'Analyzing which specialties or doctors receive the most external referrals.',
    cols: ['Specialty', 'Referrals (YTD)', 'Top Referrer', 'Conversion Rate', 'Revenue Impact', 'Status'],
    stats: [{ label: 'Highest Volume Dept', val: 'Orthopedics', col: 'text-blue-400' }, { label: 'Highest Revenue Dept', val: 'Cardiology', col: 'text-emerald-400' }, { label: 'Referral Drop-off', val: '12%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Orthopedics', 'Cardiology', 'Oncology', 'Neurology', 'Pediatrics'];
      return { specialty: depts[i], referralsytd: (400-i*50).toString(), topreferrer: 'Dr. Local GP', conversionrate: (80+i*2) + '%', revenueimpact: '$' + (150000-i*20000), status: 'Analyzed' };
    })`
  },

  // Call Center
  {
    path: 'crm/calls/queue', title: 'Call Queue', desc: 'Live view of patients waiting on hold in the IVR system.',
    cols: ['Caller Number', 'IVR Selection', 'Wait Time', 'Priority', 'Assigned Agent', 'Status'],
    stats: [{ label: 'Calls in Queue', val: '5', col: 'text-amber-400' }, { label: 'Max Wait Time', val: '2m 15s', col: 'text-red-400' }, { label: 'Available Agents', val: '4/10', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { callernumber: '+1 234 567 ' + (8900+i), ivrselection: i===0?'Emergency':(i===1?'Appointments':'Billing'), waittime: (30+i*15) + 's', priority: i===0?'High':'Normal', assignedagent: 'Routing...', status: 'Waiting' };
    })`
  },
  {
    path: 'crm/calls/incoming', title: 'Incoming Calls', desc: 'Log of all answered inbound calls with agent handling times.',
    cols: ['Call ID', 'Caller', 'Agent', 'Duration', 'Call Intent', 'Status'],
    stats: [{ label: 'Inbound Calls (Today)', val: '850', col: 'text-blue-400' }, { label: 'Avg Handle Time', val: '3m 45s', col: 'text-emerald-400' }, { label: 'First Call Resolution', val: '82%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { callid: 'INC-' + (1001+i), caller: 'Patient ' + (1+i), agent: 'Agent Alice', duration: (2+i) + 'm ' + (10+i*5) + 's', callintent: 'Book Appointment', status: 'Completed' };
    })`
  },
  {
    path: 'crm/calls/outgoing', title: 'Outgoing Calls', desc: 'Outbound calls made for follow-ups, feedback collection, or lead nurturing.',
    cols: ['Call ID', 'Patient/Lead', 'Agent', 'Purpose', 'Duration', 'Status'],
    stats: [{ label: 'Outbound Calls (Today)', val: '450', col: 'text-blue-400' }, { label: 'Connect Rate', val: '65%', col: 'text-amber-400' }, { label: 'Appointments Booked', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { callid: 'OUT-' + (2001+i), patientlead: 'Lead ' + (1+i), agent: 'Agent Bob', purpose: 'Post-Discharge Follow-up', duration: i===0?'-':(3+i) + 'm 10s', status: i===0?'No Answer':'Completed' };
    })`
  },
  {
    path: 'crm/calls/missed', title: 'Missed Calls (Abandoned)', desc: 'Calls abandoned by patients while waiting in the queue, requiring callbacks.',
    cols: ['Caller Number', 'Abandoned After', 'IVR Node', 'Callback Status', 'Assigned To', 'Status'],
    stats: [{ label: 'Abandoned Calls (Today)', val: '24', col: 'text-red-400' }, { label: 'Abandon Rate', val: '2.8%', col: 'text-emerald-400' }, { label: 'Callbacks Pending', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { callernumber: '+1 987 654 ' + (3210+i), abandonedafter: (1+i) + 'm ' + (10+i*5) + 's', ivrnode: 'Appointments Queue', callbackstatus: i<2?'Pending':'Called Back', assignedto: i<2?'Any Agent':'Agent Alice', status: i<2?'Action Required':'Resolved' };
    })`
  },
  {
    path: 'crm/calls/recordings', title: 'Call Recordings', desc: 'Quality assurance tool to listen to recorded agent-patient conversations.',
    cols: ['Call ID', 'Agent', 'Patient', 'Duration', 'QA Score', 'Status'],
    stats: [{ label: 'Calls Recorded', val: '100%', col: 'text-blue-400' }, { label: 'Calls QA Assessed', val: '15%', col: 'text-amber-400' }, { label: 'Avg QA Score', val: '4.2/5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { callid: 'REC-' + (3001+i), agent: 'Agent Charlie', patient: 'Patient ' + (1+i), duration: '4m 20s', qascore: i===0?'Pending':(4.0+i*0.1).toFixed(1) + '/5', status: i===0?'Requires QA':'Assessed' };
    })`
  },
  {
    path: 'crm/calls/history', title: 'Call History', desc: 'Complete log of all call center activity for reporting and billing.',
    cols: ['Timestamp', 'Direction', 'Number', 'Agent', 'Disposition', 'Status'],
    stats: [{ label: 'Total Volume (Mo)', val: '24,500', col: 'text-blue-400' }, { label: 'Peak Hour', val: '10 AM - 12 PM', col: 'text-amber-400' }, { label: 'Service Level (SLA)', val: '92% (<30s)', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timestamp: 'Today ' + (9+i) + ':00', direction: i%2===0?'Inbound':'Outbound', number: 'Confidential', agent: 'Agent ' + (1+i), disposition: 'Query Resolved', status: 'Logged' };
    })`
  },

  // Patient Support
  {
    path: 'crm/support/helpdesk', title: 'Help Desk', desc: 'Physical and virtual information desk for navigation, general queries, and assistance.',
    cols: ['Ticket ID', 'Requestor', 'Query Type', 'Assigned Desk', 'Resolution Time', 'Status'],
    stats: [{ label: 'Open Queries', val: '15', col: 'text-amber-400' }, { label: 'Resolved (Today)', val: '145', col: 'text-emerald-400' }, { label: 'Avg Time at Desk', val: '3 Mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ticketid: 'HD-' + (1001+i), requestor: 'Visitor ' + (1+i), querytype: 'Doctor Timing', assigneddesk: 'Main Lobby', resolutiontime: '2 Mins', status: 'Resolved' };
    })`
  },
  {
    path: 'crm/support/faqs', title: 'FAQs & Knowledge Base', desc: 'Database of common questions (insurance, visiting hours) used by bots and agents.',
    cols: ['Article ID', 'Question Category', 'Views', 'Usefulness Score', 'Last Updated', 'Status'],
    stats: [{ label: 'Total Articles', val: '85', col: 'text-blue-400' }, { label: 'Bot Deflection Rate', val: '45%', col: 'text-emerald-400' }, { label: 'Needs Update', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Insurance', 'Visiting Hours', 'Parking', 'OPD Timings', 'Room Tariffs'];
      return { articleid: 'KB-' + (101+i), questioncategory: cats[i], views: (500-i*50).toString(), usefulnessscore: (90-i) + '%', lastupdated: '01 Jan 2026', status: 'Published' };
    })`
  },
  {
    path: 'crm/support/lost', title: 'Lost & Found', desc: 'Registry of items misplaced by patients and claimed/returned status.',
    cols: ['Item ID', 'Description', 'Found Location', 'Found Date', 'Claimed By', 'Status'],
    stats: [{ label: 'Items Found (Mo)', val: '24', col: 'text-amber-400' }, { label: 'Items Returned', val: '18', col: 'text-emerald-400' }, { label: 'Pending Claims', val: '6', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemid: 'LF-' + (2001+i), description: i===0?'Wallet':(i===1?'Spectacles':'Keys'), foundlocation: 'OPD Waiting', founddate: 'Yesterday', claimedby: i===0?'-':'Patient ' + (1+i), status: i===0?'Unclaimed':'Returned' };
    })`
  },
  {
    path: 'crm/support/transport', title: 'Transport Assistance', desc: 'Booking cabs, wheelchairs, or ambulance drops for discharging patients.',
    cols: ['Req ID', 'Patient', 'Transport Type', 'Destination', 'Requested Time', 'Status'],
    stats: [{ label: 'Requests Today', val: '34', col: 'text-blue-400' }, { label: 'Wheelchairs in Use', val: '12/20', col: 'text-amber-400' }, { label: 'Cab Bookings', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Wheelchair', 'Hospital Cab', 'Ambulance Drop', 'Wheelchair', 'Hospital Cab'];
      return { reqid: 'TRN-' + (3001+i), patient: 'Patient ' + (1+i), transporttype: types[i], destination: i===0?'Exit Gate':'Home (City Center)', requestedtime: 'Today 14:00', status: i===1?'Driver Dispatched':'Completed' };
    })`
  },
  {
    path: 'crm/support/international', title: 'International Desk', desc: 'Specialized support for forex, language translators, and local accommodation.',
    cols: ['Patient', 'Country', 'Assistance Type', 'Assigned Officer', 'Due Date', 'Status'],
    stats: [{ label: 'Active Int. Patients', val: '15', col: 'text-blue-400' }, { label: 'Translators Active', val: '4', col: 'text-emerald-400' }, { label: 'Visa Extensions', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const assists = ['Arabic Translator', 'Visa Extension', 'Hotel Booking', 'Forex Exchange', 'Airport Pickup'];
      return { patient: 'Intl Patient ' + (1+i), country: 'Oman', assistancetype: assists[i], assignedofficer: 'Support Staff ' + (1+i), duedate: 'Tomorrow', status: i===1?'In Progress':'Arranged' };
    })`
  },

  // Reports
  {
    path: 'crm/reports/dashboard', title: 'CRM Dashboard Report', desc: 'Consolidated PDF/Excel export of all CRM KPIs for management review.',
    cols: ['Report Type', 'Date Range', 'Generated On', 'Generated By', 'Format', 'Status'],
    stats: [{ label: 'Reports Generated', val: '45 (Mo)', col: 'text-blue-400' }, { label: 'Scheduled Exports', val: 'Daily 8 AM', col: 'text-emerald-400' }, { label: 'Last Run Status', val: 'Success', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reporttype: 'Executive CRM Summary', daterange: 'Last 7 Days', generatedon: 'Today 08:00', generatedby: 'System', format: 'PDF', status: 'Ready' };
    })`
  },
  {
    path: 'crm/reports/followup', title: 'Follow-up Report', desc: 'Tracking the success rate of follow-up calls and resultant outpatient visits.',
    cols: ['Department', 'Follow-ups Due', 'Calls Made', 'Converted to Visit', 'Conversion %', 'Status'],
    stats: [{ label: 'Total Conversions', val: '850', col: 'text-emerald-400' }, { label: 'Best Dept', val: 'Orthopedics (65%)', col: 'text-blue-400' }, { label: 'Lost Revenue', val: '$12,500', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Orthopedics', 'Cardiology', 'Pediatrics', 'Dental', 'Ophthalmology'];
      return { department: depts[i], followupsdue: (200-i*20).toString(), callsmade: (180-i*20).toString(), convertedtovisit: (120-i*15).toString(), conversion: (65-i*2) + '%', status: 'Generated' };
    })`
  },
  {
    path: 'crm/reports/feedback', title: 'Feedback Report', desc: 'Detailed breakdown of patient comments, ratings, and CSAT scores by doctor/ward.',
    cols: ['Target Entity', 'Total Feedbacks', 'Avg Score', 'Top Complaint', 'Top Compliment', 'Status'],
    stats: [{ label: 'Overall CSAT', val: '4.2/5', col: 'text-emerald-400' }, { label: 'Total Reviews', val: '1,240', col: 'text-blue-400' }, { label: 'Actionable Items', val: '34', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { targetentity: 'Ward ' + String.fromCharCode(65+i), totalfeedbacks: (150-i*10).toString(), avgscore: (4.5-i*0.1).toFixed(1), topcomplaint: 'Food Temp', topcompliment: 'Nursing Care', status: 'Generated' };
    })`
  },
  {
    path: 'crm/reports/complaint', title: 'Complaint Report', desc: 'SLA adherence, resolution times, and root cause summaries of grievances.',
    cols: ['Complaint Category', 'Total Registered', 'Resolved within SLA', 'SLA Breaches', 'Avg Time', 'Status'],
    stats: [{ label: 'Total Complaints', val: '85', col: 'text-amber-400' }, { label: 'SLA Compliance', val: '92%', col: 'text-emerald-400' }, { label: 'Avg Resolution', val: '42 Hrs', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Billing Errors', 'Wait Times', 'Staff Behavior', 'Facilities', 'Clinical Care'];
      return { complaintcategory: cats[i], totalregistered: (30-i*4).toString(), resolvedwithinsla: (28-i*4).toString(), slabreaches: i<2?'2':'0', avgtime: (36+i*4) + ' Hrs', status: 'Generated' };
    })`
  },
  {
    path: 'crm/reports/marketing', title: 'Marketing Report', desc: 'ROI analysis of SMS/Email campaigns, health camps, and digital ads.',
    cols: ['Campaign/Source', 'Spend ($)', 'Leads Generated', 'Cost per Lead', 'Revenue ROI', 'Status'],
    stats: [{ label: 'Total Marketing Spend', val: '$12,500', col: 'text-blue-400' }, { label: 'Total Leads Gen', val: '1,450', col: 'text-emerald-400' }, { label: 'Overall ROI', val: '4.2x', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { campaignsource: 'Google Ads ' + (1+i), spend: '$' + (2000-i*200), leadsgenerated: (300-i*30).toString(), costperlead: '$' + (6+i), revenueroi: (4.5-i*0.2).toFixed(1) + 'x', status: 'Generated' };
    })`
  },
  {
    path: 'crm/reports/referral', title: 'Referral Report', desc: 'Tracking the source of patient inflows (Doctors, Corporates, Existing Patients).',
    cols: ['Referrer Group', 'Total Referrals', 'Converted', 'Conversion %', 'Revenue Generated', 'Status'],
    stats: [{ label: 'Referral Revenue', val: '$245,000', col: 'text-blue-400' }, { label: 'Top Referrer', val: 'External Docs (60%)', col: 'text-emerald-400' }, { label: 'Growth (MoM)', val: '+12%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const groups = ['External Doctors', 'Existing Patients', 'Corporate HR', 'Insurance Brokers', 'Community Leaders'];
      return { referrergroup: groups[i], totalreferrals: (500-i*100).toString(), converted: (400-i*80).toString(), conversion: '80%', revenuegenerated: '$' + (100000-i*20000), status: 'Generated' };
    })`
  },
  {
    path: 'crm/reports/telemedicine', title: 'Telemedicine Report', desc: 'Adoption rates, consult durations, and revenue generated from virtual care.',
    cols: ['Department', 'Tele-consults Done', 'Avg Duration', 'Prescriptions Gen', 'Revenue', 'Status'],
    stats: [{ label: 'Telemed Revenue', val: '$34,500', col: 'text-blue-400' }, { label: 'Adoption Rate', val: '15% of OPD', col: 'text-emerald-400' }, { label: 'Patient Rating', val: '4.6/5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: 'General Med', teleconsultsdone: (150-i*10).toString(), avgduration: '12 Mins', prescriptionsgen: (140-i*10).toString(), revenue: '$' + (7500-i*500), status: 'Generated' };
    })`
  },
  {
    path: 'crm/reports/retention', title: 'Patient Retention Report', desc: 'Analysis of patient stickiness—how many return for secondary visits or diagnostics.',
    cols: ['Cohort (First Visit Month)', 'Total New Patients', 'Returned in 3 Mo', 'Returned in 6 Mo', 'Retention Rate', 'Status'],
    stats: [{ label: 'Avg 6-Mo Retention', val: '42%', col: 'text-emerald-400' }, { label: 'Loyal Patients', val: '14,500', col: 'text-blue-400' }, { label: 'Churn Risk', val: '1,200', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { cohort: 'Jan 2026', totalnewpatients: '1,000', returnedin3mo: '350', returnedin6mo: '420', retentionrate: '42%', status: 'Generated' };
    })`
  },

  // Analytics
  {
    path: 'crm/analytics/satisfaction', title: 'Patient Satisfaction', desc: 'Deep dive into CSAT scores broken down by demographic, ward, or doctor.',
    cols: ['Slice/Dimension', 'Sample Size', 'NPS Score', 'CSAT (%)', 'Sentiment Analysis', 'Status'],
    stats: [{ label: 'Overall Sentiment', val: 'Positive (78%)', col: 'text-emerald-400' }, { label: 'Word Cloud Top', val: '"Caring", "Clean"', col: 'text-blue-400' }, { label: 'Negative Keywords', val: '"Wait", "Bill"', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const dimensions = ['By Age 18-35', 'By Ward A', 'By Female Patients', 'By IPD Discharges', 'By Cash Payers'];
      return { slicedimension: dimensions[i], samplesize: '450', npsscore: '+42', csat: '88%', sentimentanalysis: '75% Positive', status: 'Analyzed' };
    })`
  },
  {
    path: 'crm/analytics/retention', title: 'Patient Retention Analytics', desc: 'Identifying factors that cause patients to choose competitor hospitals.',
    cols: ['Factor/Variable', 'Impact on Retention', 'Cohort Size', 'Lost Revenue', 'Suggested Action', 'Status'],
    stats: [{ label: 'Top Churn Reason', val: 'High Wait Times', col: 'text-red-400' }, { label: 'Loyalty Value', val: '$1.4M (LTV)', col: 'text-emerald-400' }, { label: 'Win-back Success', val: '15%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const factors = ['OPD Wait > 1Hr', 'Negative Review Left', 'Distance > 15km', 'Insurance Denied', 'Doctor Changed'];
      return { factorvariable: factors[i], impactonretention: 'High', cohortsize: '340', lostrevenue: '$' + (50000-i*5000), suggestedaction: 'Process Review', status: 'Actionable' };
    })`
  },
  {
    path: 'crm/analytics/campaign', title: 'Campaign Analytics', desc: 'A/B testing results and multi-channel attribution for marketing efforts.',
    cols: ['Campaign Group', 'Channel Mix', 'Spend', 'Conversions', 'Cost Per Acquisition', 'Status'],
    stats: [{ label: 'Best Channel', val: 'Google Ads', col: 'text-emerald-400' }, { label: 'Avg CPA', val: '$45', col: 'text-blue-400' }, { label: 'Budget Utilization', val: '85%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { campaigngroup: 'Q2 Health Checks', channelmix: 'SMS + FB Ads', spend: '$' + (5000-i*500), conversions: (120-i*10).toString(), costperacquisition: '$' + (41+i), status: 'Analyzed' };
    })`
  },
  {
    path: 'crm/analytics/communication', title: 'Communication Analytics', desc: 'Engagement rates across SMS, Email, and WhatsApp to optimize outreach timings.',
    cols: ['Channel', 'Time of Day', 'Open Rate', 'Click Rate', 'Engagement Score', 'Status'],
    stats: [{ label: 'Best Time to Send', val: '10 AM - 11 AM', col: 'text-emerald-400' }, { label: 'Highest Open Rate', val: 'WhatsApp (85%)', col: 'text-blue-400' }, { label: 'Spam Rate', val: '0.01%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const channels = ['WhatsApp', 'SMS', 'Email', 'App Push', 'Voice Call'];
      return { channel: channels[i], timeofday: 'Morning (9-11 AM)', openrate: (80-i*15) + '%', clickrate: (15-i*2) + '%', engagementscore: (9.5-i*1.5).toFixed(1) + '/10', status: 'Optimized' };
    })`
  },
  {
    path: 'crm/analytics/kpis', title: 'CRM KPIs', desc: 'Executive dashboard tracking lead conversion velocity, agent productivity, and SLA breaches.',
    cols: ['Metric Name', 'Target', 'Actual (YTD)', 'Variance', 'Trend (Last 6 Mo)', 'Status'],
    stats: [{ label: 'Lead Velocity Rate', val: '+12% MoM', col: 'text-emerald-400' }, { label: 'Agent Utilization', val: '78%', col: 'text-blue-400' }, { label: 'Resolution SLA', val: '94% Met', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Avg Query Resolution Time', 'Lead to Patient Ratio', 'Inbound Call Abandon Rate', 'NPS Score', 'Cost Per Contact'];
      return { metricname: metrics[i], target: i===2?'< 5%':(i===3?'> 40':'Varied'), actualytd: i===2?'2.8%':(i===3?'+45':'Met'), variance: '+2%', trend: 'Improving', status: 'On Target' };
    })`
  },
  {
    path: 'crm/analytics/ratings', title: 'Doctor Ratings', desc: 'Correlating doctor ratings with wait times, billing amounts, and clinical outcomes.',
    cols: ['Doctor/Specialty', 'Avg Rating', 'Avg Wait Time', 'Avg Bill Amount', 'Correlation Factor', 'Status'],
    stats: [{ label: 'Wait Time Impact', val: '-0.8 (Strong)', col: 'text-red-400' }, { label: 'Bill Impact', val: '-0.3 (Weak)', col: 'text-blue-400' }, { label: 'Top Driver', val: 'Doctor Behavior', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { doctorspecialty: 'Orthopedics', avgrating: '4.2/5', avgwaittime: '45 Mins', avgbillamount: '$150', correlationfactor: 'Wait Time (-0.7)', status: 'Analyzed' };
    })`
  },

  // Settings
  {
    path: 'crm/settings/templates', title: 'Communication Templates', desc: 'Pre-approved SMS, Email, and WhatsApp templates ensuring brand consistency.',
    cols: ['Template Name', 'Channel', 'Content Preview', 'Variables Used', 'Approved By', 'Status'],
    stats: [{ label: 'Total Templates', val: '124', col: 'text-blue-400' }, { label: 'WhatsApp Approved', val: '45', col: 'text-emerald-400' }, { label: 'Pending Approval', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { templatename: 'Appointment Reminder ' + (1+i), channel: i===0?'WhatsApp':'SMS', contentpreview: 'Dear {name}, your appt is at...', variablesused: '{name}, {time}', approvedby: 'Marketing Head', status: 'Active' };
    })`
  },
  {
    path: 'crm/settings/feedback', title: 'Feedback Templates', desc: 'Dynamic questionnaire builder for various patient touchpoints (IPD, OPD, ER).',
    cols: ['Form Name', 'Touchpoint', 'Question Count', 'Logic/Branching', 'Active Since', 'Status'],
    stats: [{ label: 'Active Forms', val: '12', col: 'text-blue-400' }, { label: 'Avg Completion Time', val: '2 Mins', col: 'text-emerald-400' }, { label: 'Response Rate', val: '35%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { formname: 'Post-Discharge Survey', touchpoint: 'IPD Discharge', questioncount: '10', logicbranching: 'Yes', activesince: '01 Jan 2026', status: 'Active' };
    })`
  },
  {
    path: 'crm/settings/campaign', title: 'Campaign Templates', desc: 'Visual email builders and audience segmentation rules for marketing.',
    cols: ['Segment Rule', 'Audience Size', 'Last Calculated', 'Refresh Rate', 'Assigned Campaigns', 'Status'],
    stats: [{ label: 'Saved Segments', val: '24', col: 'text-blue-400' }, { label: 'Total Reachable', val: '145,000', col: 'text-emerald-400' }, { label: 'Dynamic Segments', val: '18', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { segmentrule: 'Diabetic Patients > 50yrs', audiencesize: '4,500', lastcalculated: 'Today', refreshrate: 'Daily', assignedcampaigns: '2', status: 'Active' };
    })`
  },
  {
    path: 'crm/settings/reminders', title: 'Reminder Settings', desc: 'Configuring the cadence (24h, 2h before) and channel fallback for appointments.',
    cols: ['Trigger Event', 'Time Before/After', 'Primary Channel', 'Fallback Channel', 'Is Mandatory', 'Status'],
    stats: [{ label: 'Active Triggers', val: '15', col: 'text-blue-400' }, { label: 'Fallback Success', val: '45%', col: 'text-emerald-400' }, { label: 'Cost Saved', val: '$120/Mo', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { triggerevent: 'OPD Appointment', timebeforeafter: '24 Hrs Before', primarychannel: 'WhatsApp', fallbackchannel: 'SMS', ismandatory: 'Yes', status: 'Active' };
    })`
  },
  {
    path: 'crm/settings/loyalty', title: 'Loyalty Rules', desc: 'Defining how points are earned (e.g., 1 point per $10 spent) and redemption limits.',
    cols: ['Rule Name', 'Condition', 'Points Earned/Redeemed', 'Max Limit', 'Validity', 'Status'],
    stats: [{ label: 'Active Rules', val: '8', col: 'text-blue-400' }, { label: 'Points Expiration', val: '12 Months', col: 'text-amber-400' }, { label: 'Base Earn Rate', val: '1%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { rulename: 'OPD Billing Reward', condition: 'Spend > $50', pointsearnedredeemed: '1 Pt / $10', maxlimit: '100 Pts/Visit', validity: '1 Year', status: 'Active' };
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
        const isGood = val === 'Active' || val === 'Completed' || val === 'Active Member' || val === 'Active Partner' || val === 'Issued' || val === 'Analyzed' || val === 'Delivered' || val === 'Sent' || val === 'Resolved' || val === 'Published' || val === 'Returned' || val === 'Arranged' || val === 'Ready' || val === 'Generated' || val === 'Actionable' || val === 'Optimized' || val === 'On Target';
        const isWarning = val === 'Draft' || val === 'Planned' || val === 'Negotiation' || val === 'Pending Auth' || val === 'Waiting' || val === 'Action Required' || val === 'Pending Reply' || val === 'Requires QA' || val === 'Unclaimed' || val === 'Driver Dispatched' || val === 'In Progress';
        const isNeutral = val === 'Logged' || val === 'Assessed';
        const isDanger = val === 'No Answer' || val === 'Failed' || val === 'Lost';
        
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
