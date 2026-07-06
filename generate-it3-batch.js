const fs = require('fs');
const path = require('path');

const config = [
  // Notifications
  {
    path: 'it/notifications/email', title: 'Email Notifications', desc: 'Monitoring outbound system emails (e.g., Reports, Resets).',
    cols: ['Message ID', 'Recipient', 'Subject', 'Sent Time', 'Provider Response', 'Status'],
    stats: [{ label: 'Emails Sent (24h)', val: '14.5k', col: 'text-blue-400' }, { label: 'Delivered', val: '99%', col: 'text-emerald-400' }, { label: 'Bounced', val: '24', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { messageid: 'MSG-' + (1001+i), recipient: 'user' + i + '@domain.com', subject: 'Password Reset', senttime: '10:00 AM', providerresponse: '250 OK', status: i===0?'Bounced':'Delivered' };
    })`
  },
  {
    path: 'it/notifications/sms', title: 'SMS Notifications', desc: 'Tracking outbound transactional SMS messages.',
    cols: ['SMS ID', 'Phone Number', 'Message Template', 'Sent Time', 'DLR Status', 'Status'],
    stats: [{ label: 'SMS Sent (24h)', val: '4,500', col: 'text-blue-400' }, { label: 'DLR Received', val: '95%', col: 'text-emerald-400' }, { label: 'Failed Delivery', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { smsid: 'SMS-' + (2001+i), phonenumber: '+123456789' + i, messagetemplate: 'Appt_Reminder', senttime: 'Just Now', dlrstatus: i===0?'Pending':'Delivered', status: i===0?'Sent':'Delivered' };
    })`
  },
  {
    path: 'it/notifications/whatsapp', title: 'WhatsApp Notifications', desc: 'WhatsApp API message logs for reports and telemedicine links.',
    cols: ['WA Message ID', 'Contact', 'Template Name', 'Sent Time', 'Read Receipt', 'Status'],
    stats: [{ label: 'WA Sent (24h)', val: '1,200', col: 'text-blue-400' }, { label: 'Read Rate', val: '85%', col: 'text-emerald-400' }, { label: 'Template Rejects', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { wamessageid: 'WA-' + (3001+i), contact: '+198765432' + i, templatename: 'Lab_Report_Ready', senttime: '1 Hr Ago', readreceipt: i===0?'No':'Yes', status: i===0?'Delivered':'Read' };
    })`
  },
  {
    path: 'it/notifications/push', title: 'Push Notifications', desc: 'FCM/APNS logs for hospital mobile app push alerts.',
    cols: ['Push ID', 'Target Device', 'Payload Title', 'Sent Time', 'Interaction', 'Status'],
    stats: [{ label: 'Push Sent (24h)', val: '45k', col: 'text-blue-400' }, { label: 'Open Rate', val: '12%', col: 'text-amber-400' }, { label: 'Unsubscribed', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { pushid: 'PSH-' + (4001+i), targetdevice: 'iOS-Token-' + i, payloadtitle: 'New Result', senttime: 'Today', interaction: i===0?'Opened':'Ignored', status: 'Sent' };
    })`
  },
  {
    path: 'it/notifications/rules', title: 'Alert Rules', desc: 'Logic defining when system admins receive critical alerts (e.g., DB Down -> SMS + Call).',
    cols: ['Rule Name', 'Trigger Event', 'Channels', 'Escalation Level', 'Active Users', 'Status'],
    stats: [{ label: 'Active Rules', val: '24', col: 'text-blue-400' }, { label: 'Alerts Fired (24h)', val: '2', col: 'text-amber-400' }, { label: 'Escalations', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { rulename: 'DB High CPU', triggerevent: 'CPU > 90% for 5m', channels: 'Email, SMS', escalationlevel: 'L1 Support', activeusers: '4', status: 'Active' };
    })`
  },

  // Support Desk
  {
    path: 'it/support/tickets', title: 'IT Tickets', desc: 'Internal helpdesk for staff raising IT issues (Hardware, Network, Software).',
    cols: ['Ticket ID', 'Raised By', 'Category', 'Priority', 'Assigned Tech', 'Status'],
    stats: [{ label: 'Open Tickets', val: '45', col: 'text-amber-400' }, { label: 'High Priority', val: '5', col: 'text-red-400' }, { label: 'Resolved Today', val: '24', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ticketid: 'TKT-' + (1001+i), raisedby: 'Dr. Jane', category: 'Software Login', priority: i===0?'High':'Normal', assignedtech: 'IT Bob', status: i<2?'Open':'Resolved' };
    })`
  },
  {
    path: 'it/support/incident', title: 'Incident Management', desc: 'Major P1 incidents (e.g., HIS down) tracking and post-mortem logs.',
    cols: ['Incident ID', 'Description', 'Affected Area', 'Downtime', 'Root Cause', 'Status'],
    stats: [{ label: 'Major Incidents (Mo)', val: '1', col: 'text-red-400' }, { label: 'MTTR', val: '45 Mins', col: 'text-amber-400' }, { label: 'Post-Mortems Pending', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { incidentid: 'INC-' + (2001+i), description: 'EMR Sluggish', affectedarea: 'OPD', downtime: '20 Mins', rootcause: 'DB Lock', status: 'Resolved' };
    })`
  },
  {
    path: 'it/support/requests', title: 'Service Requests', desc: 'Requests for new hardware (e.g., new mouse) or software installations.',
    cols: ['Request ID', 'Department', 'Item Requested', 'Justification', 'Approver', 'Status'],
    stats: [{ label: 'Pending Approval', val: '12', col: 'text-amber-400' }, { label: 'Fulfilled (Mo)', val: '85', col: 'text-emerald-400' }, { label: 'Hardware Budget', val: '$4.5k Left', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { requestid: 'SR-' + (3001+i), department: 'Radiology', itemrequested: 'Barcode Scanner', justification: 'Broken', approver: 'Dept Head', status: i===0?'Pending Approval':'Fulfilled' };
    })`
  },
  {
    path: 'it/support/problem', title: 'Problem Management', desc: 'Identifying underlying problems behind recurring tickets (e.g., Network drop in Ward A).',
    cols: ['Problem ID', 'Linked Tickets', 'Description', 'Workaround', 'Target Fix Date', 'Status'],
    stats: [{ label: 'Open Problems', val: '4', col: 'text-amber-400' }, { label: 'Tickets Linked', val: '45', col: 'text-blue-400' }, { label: 'Known Errors', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { problemid: 'PRB-' + (4001+i), linkedtickets: (5+i).toString(), description: 'Wi-Fi drops in ICU', workaround: 'Use LAN Cable', targetfixdate: 'Next Week', status: 'Open' };
    })`
  },
  {
    path: 'it/support/change', title: 'Change Requests', desc: 'CAB (Change Advisory Board) workflows for approving production deployments.',
    cols: ['Change ID', 'System Affected', 'Risk Level', 'Requested By', 'CAB Date', 'Status'],
    stats: [{ label: 'Changes Pending', val: '3', col: 'text-amber-400' }, { label: 'Deployed (Mo)', val: '12', col: 'text-blue-400' }, { label: 'Failed Changes', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { changeid: 'CR-' + (5001+i), systemaffected: 'Billing API', risklevel: i===0?'High':'Medium', requestedby: 'Dev Team', cabdate: 'Friday 14:00', status: i===0?'Under Review':'Approved' };
    })`
  },
  {
    path: 'it/support/remote', title: 'Remote Support', desc: 'Logs of AnyDesk/TeamViewer sessions initiated by IT to fix end-user PCs.',
    cols: ['Session ID', 'IT Tech', 'Target Hostname', 'Duration', 'Issue Fixed', 'Status'],
    stats: [{ label: 'Sessions Today', val: '34', col: 'text-blue-400' }, { label: 'Avg Duration', val: '12 Mins', col: 'text-emerald-400' }, { label: 'First Contact Res.', val: '85%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { sessionid: 'RS-' + (6001+i), ittech: 'Tech Alice', targethostname: 'NURS-PC-12', duration: '15 Mins', issuefixed: 'Printer Mapping', status: 'Closed' };
    })`
  },

  // Software Management
  {
    path: 'it/software/version', title: 'ERP Version', desc: 'Tracking current software builds, release notes, and version history.',
    cols: ['Module', 'Current Version', 'Release Date', 'Critical Patch', 'Rollback Available', 'Status'],
    stats: [{ label: 'Core ERP Version', val: 'v4.5.1', col: 'text-blue-400' }, { label: 'Last Update', val: '15 Days Ago', col: 'text-emerald-400' }, { label: 'Updates Pending', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { module: ['Billing', 'EMR', 'Pharmacy', 'Lab', 'Inventory'][i], currentversion: 'v4.5.' + i, releasedate: '10 Jan 2026', criticalpatch: i===0?'Yes':'No', rollbackavailable: 'Yes', status: i===0?'Update Pending':'Up to Date' };
    })`
  },
  {
    path: 'it/software/modules', title: 'Module Management', desc: 'Enabling/Disabling specific ERP modules (e.g., Telemedicine add-on).',
    cols: ['Module Name', 'License Type', 'Subscribed Users', 'Cost/Mo', 'Expiry', 'Status'],
    stats: [{ label: 'Active Modules', val: '24', col: 'text-blue-400' }, { label: 'SaaS Spend (Mo)', val: '$4,500', col: 'text-amber-400' }, { label: 'Unused Modules', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { modulename: 'Telemedicine Add-on ' + i, licensetype: 'Enterprise', subscribedusers: 'All Doctors', costmo: '$500', expiry: 'Dec 2026', status: i===0?'Inactive':'Active' };
    })`
  },
  {
    path: 'it/software/flags', title: 'Feature Flags', desc: 'Toggle features on/off for specific user groups without deploying code.',
    cols: ['Feature Name', 'Target Group', 'Rollout %', 'Last Toggled By', 'Date', 'Status'],
    stats: [{ label: 'Active Flags', val: '12', col: 'text-blue-400' }, { label: 'Beta Features', val: '3', col: 'text-amber-400' }, { label: 'Deprecated', val: '4', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { featurename: 'New Billing UI ' + i, targetgroup: i===0?'Admin Only':'All Users', rollout: i===0?'10%':'100%', lasttoggledby: 'SysAdmin', date: 'Yesterday', status: i===0?'Testing':'Enabled' };
    })`
  },
  {
    path: 'it/software/patches', title: 'Patch Management', desc: 'OS and 3rd party software (Java, Chrome) patching on user PCs.',
    cols: ['Patch Name', 'Severity', 'Applicable PCs', 'Patched PCs', 'Success Rate', 'Status'],
    stats: [{ label: 'Critical Patches', val: '2', col: 'text-red-400' }, { label: 'Fleet Compliance', val: '92%', col: 'text-amber-400' }, { label: 'Failed Installs', val: '15', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { patchname: 'Win11 KB987' + i, severity: i===0?'Critical':'Moderate', applicablepcs: '850', patchedpcs: (800-i*10).toString(), successrate: '94%', status: i===0?'Deployment Active':'Completed' };
    })`
  },
  {
    path: 'it/software/licenses', title: 'License Management', desc: 'Tracking Microsoft, Antivirus, and specialized clinical software licenses.',
    cols: ['Software/Vendor', 'Total Licenses', 'Allocated', 'Cost/User', 'Renewal Date', 'Status'],
    stats: [{ label: 'Total Licenses', val: '1,200', col: 'text-blue-400' }, { label: 'Available Pool', val: '45', col: 'text-emerald-400' }, { label: 'Renewal (30D)', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { softwarevendor: 'Office 365', totallicenses: '500', allocated: '480', costuser: '$12', renewaldate: 'Dec 2026', status: 'Active' };
    })`
  },
  {
    path: 'it/software/updates', title: 'Software Updates', desc: 'Scheduled maintenance windows and downtime announcements for updates.',
    cols: ['Update Schedule', 'System Affected', 'Expected Downtime', 'Approved By', 'Communication', 'Status'],
    stats: [{ label: 'Upcoming Windows', val: '1 (Sat Night)', col: 'text-blue-400' }, { label: 'Avg Downtime', val: '45 Mins', col: 'text-emerald-400' }, { label: 'Missed Windows', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { updateschedule: 'Sat 02:00 AM', systemaffected: 'Main DB', expecteddowntime: '30 Mins', approvedby: 'IT Head', communication: 'Email Sent', status: i===0?'Scheduled':'Completed' };
    })`
  },

  // Performance Monitoring
  {
    path: 'it/performance/system', title: 'System Performance', desc: 'Overall APM (Application Performance Monitoring) metrics (e.g., Datadog, NewRelic).',
    cols: ['Apdex Score', 'Service', 'Avg Latency', 'P99 Latency', 'Error Rate', 'Status'],
    stats: [{ label: 'Global Apdex', val: '0.95', col: 'text-emerald-400' }, { label: 'Web Transaction', val: '120ms', col: 'text-blue-400' }, { label: 'Service Degraded', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { apdexscore: (0.98-i*0.02).toFixed(2), service: 'Billing Service', avglatency: (100+i*20)+'ms', p99latency: (300+i*50)+'ms', errorrate: '0.01%', status: 'Optimal' };
    })`
  },
  {
    path: 'it/performance/database', title: 'Database Performance', desc: 'Specific deep dives into database query speeds and wait states.',
    cols: ['Query Type', 'Avg Exec Time', 'CPU Bound', 'I/O Bound', 'Lock Waits', 'Status'],
    stats: [{ label: 'Avg DB Latency', val: '12ms', col: 'text-emerald-400' }, { label: 'Lock Wait Ratio', val: '0.5%', col: 'text-emerald-400' }, { label: 'Long Transactions', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { querytype: 'SELECT (EMR)', avgexectime: '15ms', cpubound: 'Low', iobound: 'Medium', lockwaits: i===0?'2%':'0.1%', status: i===0?'Review Query':'Normal' };
    })`
  },
  {
    path: 'it/performance/api', title: 'API Performance', desc: 'Latency tracking for external integrations.',
    cols: ['External API', 'P90 Latency', 'Timeout Ratio', 'Circuit Breaker', 'Last Incident', 'Status'],
    stats: [{ label: 'External Avg', val: '240ms', col: 'text-blue-400' }, { label: 'Timeouts (1h)', val: '4', col: 'text-amber-400' }, { label: 'Breakers Open', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { externalapi: 'Payment Gateway', p90latency: '300ms', timeoutratio: '0.1%', circuitbreaker: 'Closed', lastincident: 'Last Month', status: 'Healthy' };
    })`
  },
  {
    path: 'it/performance/response', title: 'Response Time', desc: 'End-user browser load times (RUM - Real User Monitoring).',
    cols: ['Page / Route', 'Avg Load Time', 'First Contentful Paint', 'Time to Interactive', 'DOM Size', 'Status'],
    stats: [{ label: 'Avg Page Load', val: '1.2s', col: 'text-emerald-400' }, { label: 'Slow Pages (>3s)', val: '2', col: 'text-amber-400' }, { label: 'Bounce Rate (UI)', val: '2%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { pageroute: '/opd/billing', avgloadtime: i===0?'3.2s':'0.8s', firstcontentfulpaint: '0.5s', timetointeractive: i===0?'2.8s':'0.7s', domsize: 'Normal', status: i===0?'Slow':'Fast' };
    })`
  },
  {
    path: 'it/performance/sessions', title: 'User Sessions', desc: 'Resource utilization per active user session (Memory leaks in browser apps).',
    cols: ['User Session', 'Browser', 'Client Memory', 'DOM Nodes', 'JS Heap Size', 'Status'],
    stats: [{ label: 'Avg Client Mem', val: '120 MB', col: 'text-blue-400' }, { label: 'Crashes Reported', val: '12', col: 'text-amber-400' }, { label: 'Active Clients', val: '850', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { usersession: 'Sess-987' + i, browser: 'Chrome 120', clientmemory: i===0?'850 MB':'110 MB', domnodes: '15k', jsheapsize: '45 MB', status: i===0?'High Memory':'Normal' };
    })`
  },
  {
    path: 'it/performance/load', title: 'Load Analysis', desc: 'Capacity planning, tracking concurrent user peaks, and autoscale events.',
    cols: ['Time Window', 'Peak Concurrency', 'Servers Spun Up', 'Max CPU Hit', 'Bandwidth Peak', 'Status'],
    stats: [{ label: 'Peak Users Today', val: '1,150 (11 AM)', col: 'text-blue-400' }, { label: 'Autoscale Events', val: '2', col: 'text-emerald-400' }, { label: 'Capacity Margin', val: '40%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timewindow: '10:00 - 11:00', peakconcurrency: '1,150', serversspunup: i===0?'1':'0', maxcpuhit: '82%', bandwidthpeak: '850 Mbps', status: 'Handled' };
    })`
  },

  // Compliance
  {
    path: 'it/compliance/hipaa', title: 'HIPAA Compliance', desc: 'Checklists ensuring ePHI is encrypted at rest and in transit.',
    cols: ['Control Requirement', 'Implementation', 'Last Audited', 'Findings', 'Evidence Links', 'Status'],
    stats: [{ label: 'Compliance Score', val: '100%', col: 'text-emerald-400' }, { label: 'Open Findings', val: '0', col: 'text-green-500' }, { label: 'Next Audit Due', val: 'Dec 2026', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { controlrequirement: 'Encryption at Rest (DB)', implementation: 'AES-256', lastaudited: 'Jan 2026', findings: 'None', evidencelinks: 'View Report', status: 'Compliant' };
    })`
  },
  {
    path: 'it/compliance/nabh', title: 'NABH IT Compliance', desc: 'Hospital accreditation board IT standards mapping (India).',
    cols: ['NABH Standard', 'Clause', 'IT Mapping', 'Document Proof', 'Internal Score', 'Status'],
    stats: [{ label: 'Standard Met', val: '95%', col: 'text-emerald-400' }, { label: 'Gaps Identified', val: '2', col: 'text-amber-400' }, { label: 'Assessment Date', val: 'Nov 2026', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { nabhstandard: 'Information Management', clause: 'IMS.1', itmapping: 'EMR Data Integrity', documentproof: 'SOP Document', internalscore: '10/10', status: 'Compliant' };
    })`
  },
  {
    path: 'it/compliance/audit', title: 'Audit Compliance', desc: 'Tracking internal IT audits (ISO 27001) and gap closures.',
    cols: ['Audit Topic', 'Auditor', 'Non-Conformities', 'Corrective Action', 'Target Closure', 'Status'],
    stats: [{ label: 'Major NCs', val: '0', col: 'text-green-500' }, { label: 'Minor NCs', val: '4', col: 'text-amber-400' }, { label: 'Actions Closed', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { audittopic: 'Access Control', auditor: 'External Firm', nonconformities: i===0?'1 Minor':'0', correctiveaction: i===0?'Revoke stale accounts':'N/A', targetclosure: 'Next Week', status: i===0?'Action Required':'Pass' };
    })`
  },
  {
    path: 'it/compliance/privacy', title: 'Data Privacy', desc: 'GDPR / DPDP (India) compliance for patient data anonymization and consent management.',
    cols: ['Privacy Request', 'Patient ID', 'Request Type', 'Received Date', 'SLA (Days)', 'Status'],
    stats: [{ label: 'Data Deletion Req', val: '5', col: 'text-amber-400' }, { label: 'Consent Revoked', val: '12', col: 'text-blue-400' }, { label: 'SLA Breaches', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { privacyrequest: 'PRQ-' + (1001+i), patientid: 'PT-987' + i, requesttype: 'Data Export', receiveddate: 'Yesterday', sla: '30 Days', status: 'Processing' };
    })`
  },
  {
    path: 'it/compliance/retention', title: 'Data Retention', desc: 'Rules for archiving EMR > 7 years and purging logs.',
    cols: ['Data Category', 'Retention Policy', 'Storage Tier', 'Last Purge Date', 'Bytes Purged', 'Status'],
    stats: [{ label: 'Archived Data', val: '45 TB', col: 'text-blue-400' }, { label: 'Purged (YTD)', val: '2.5 TB', col: 'text-emerald-400' }, { label: 'Storage Saved', val: '$4,500', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { datacategory: 'OPD Records', retentionpolicy: '7 Years', storagetier: 'Cold Cloud Storage', lastpurgedate: 'Jan 2026', bytespurged: '500 GB', status: 'Policy Active' };
    })`
  },
  {
    path: 'it/compliance/access', title: 'Access Audit', desc: 'Periodic review of user permissions (e.g., Do terminated employees still have access?).',
    cols: ['Review Cycle', 'Department', 'Accounts Reviewed', 'Stale Found', 'Action Taken', 'Status'],
    stats: [{ label: 'Access Reviews', val: 'Quarterly', col: 'text-blue-400' }, { label: 'Stale Accounts', val: '4', col: 'text-amber-400' }, { label: '100% Compliant', val: 'Yes', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reviewcycle: 'Q1 2026', department: 'Cardiology', accountsreviewed: '45', stalefound: i===0?'2':'0', actiontaken: i===0?'Access Revoked':'-', status: 'Completed' };
    })`
  },

  // Reports
  {
    path: 'it/reports/logins', title: 'User Login Report', desc: 'Detailed Excel/PDF export of all staff login activities and hours.',
    cols: ['Report Type', 'Date Range', 'Department Filter', 'Generated By', 'Format', 'Status'],
    stats: [{ label: 'Reports Generated (Mo)', val: '45', col: 'text-blue-400' }, { label: 'Automated Reports', val: '12', col: 'text-emerald-400' }, { label: 'Avg Gen Time', val: '4s', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reporttype: 'Monthly Attendance Sync', daterange: 'June 2026', departmentfilter: 'All', generatedby: 'System', format: 'CSV', status: 'Generated' };
    })`
  },
  {
    path: 'it/reports/server', title: 'Server Report', desc: 'Monthly uptime and hardware fault summaries for management review.',
    cols: ['Report Month', 'Overall Uptime', 'Downtime Incidents', 'SLA Target', 'Penalty Clause', 'Status'],
    stats: [{ label: 'YTD Uptime', val: '99.98%', col: 'text-emerald-400' }, { label: 'Total Incidents', val: '2', col: 'text-blue-400' }, { label: 'SLA Penalties', val: '$0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reportmonth: ['June', 'May', 'April', 'March', 'Feb'][i] + ' 2026', overalluptime: '99.9%', downtimeincidents: i===1?'1':'0', slatarget: '99.5%', penaltyclause: 'N/A', status: 'Generated' };
    })`
  },
  {
    path: 'it/reports/backup', title: 'Backup Report', desc: 'Compliance report proving backups were taken and verified daily.',
    cols: ['Week Ending', 'Total Backups', 'Success Rate', 'Verified Mounts', 'Storage Consumed', 'Status'],
    stats: [{ label: 'Total Success', val: '100%', col: 'text-emerald-400' }, { label: 'Cloud Sync', val: 'Completed', col: 'text-emerald-400' }, { label: 'Audit Ready', val: 'Yes', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { weekending: (20-i*7) + ' Jun 2026', totalbackups: '45', successrate: '100%', verifiedmounts: '45', storageconsumed: '1.2 TB', status: 'Generated' };
    })`
  },
  {
    path: 'it/reports/security', title: 'Security Report', desc: 'Summary of blocked threats, phishing tests, and patching compliance.',
    cols: ['Report Type', 'Threats Blocked', 'Unpatched PCs', 'Phishing Clicks', 'Risk Score', 'Status'],
    stats: [{ label: 'Total Threats Blocked', val: '1,240', col: 'text-blue-400' }, { label: 'Phishing Fails', val: '4%', col: 'text-amber-400' }, { label: 'Security Posture', val: 'Strong', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { reporttype: 'Monthly Security Review', threatsblocked: '450', unpatchedpcs: '12', phishingclicks: '4', riskscore: '90/100', status: 'Generated' };
    })`
  },
  {
    path: 'it/reports/api', title: 'API Report', desc: 'Integration volumes for billing vendors (e.g., SMS cost calculation).',
    cols: ['Integration', 'Total Calls', 'Avg Response', 'Data Transferred', 'Est Cost', 'Status'],
    stats: [{ label: 'API Costs (Mo)', val: '$2,400', col: 'text-blue-400' }, { label: 'Most Used API', val: 'WhatsApp', col: 'text-emerald-400' }, { label: 'Failed API %', val: '0.01%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { integration: 'Twilio SMS', totalcalls: '120k', avgresponse: '45ms', datatransferred: '1.2 GB', estcost: '$850', status: 'Generated' };
    })`
  },
  {
    path: 'it/reports/database', title: 'Database Report', desc: 'Storage growth trends and index fragmentation reporting.',
    cols: ['Database Name', 'Size (GB)', 'MoM Growth', 'Long TX Count', 'Recommendation', 'Status'],
    stats: [{ label: 'Total DB Size', val: '4.5 TB', col: 'text-blue-400' }, { label: 'Growth Rate (Mo)', val: '+2.5%', col: 'text-amber-400' }, { label: 'Index Health', val: 'Good', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { databasename: 'HIS_Main_DB', sizegb: (1200+i*10).toString(), momgrowth: '+2%', longtxcount: '4', recommendation: 'Rebuild Indexes', status: 'Generated' };
    })`
  },
  {
    path: 'it/reports/assets', title: 'IT Asset Report', desc: 'Hardware inventory, depreciation value, and replacement forecasting.',
    cols: ['Asset Class', 'Total Count', 'In Warranty', 'End of Life (EOL)', 'Depreciated Value', 'Status'],
    stats: [{ label: 'Total Asset Value', val: '$450K', col: 'text-blue-400' }, { label: 'Assets EOL (This Yr)', val: '45', col: 'text-red-400' }, { label: 'New Procurements', val: '$24K', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { assetclass: ['Desktops', 'Laptops', 'Servers', 'Printers', 'Scanners'][i], totalcount: (500-i*100).toString(), inwarranty: (400-i*80).toString(), endoflifeeol: (50-i*10).toString(), depreciatedvalue: '$' + (120000-i*20000), status: 'Generated' };
    })`
  },
  {
    path: 'it/reports/incident', title: 'Incident Report', desc: 'SLA reporting for helpdesk ticket resolution times.',
    cols: ['Month', 'Tickets Raised', 'Resolved', 'SLA Breaches', 'Avg Resolution', 'Status'],
    stats: [{ label: 'SLA Compliance', val: '94%', col: 'text-emerald-400' }, { label: 'Avg Resolution Time', val: '4 Hrs', col: 'text-blue-400' }, { label: 'Escalations', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { month: ['June', 'May', 'April', 'March', 'Feb'][i] + ' 2026', ticketsraised: (450-i*20).toString(), resolved: (440-i*20).toString(), slabreaches: (10-i).toString(), avgresolution: '4.5 Hrs', status: 'Generated' };
    })`
  },
  {
    path: 'it/reports/performance', title: 'Performance Report', desc: 'System availability and response time reporting for management.',
    cols: ['Metric', 'Current Month', 'Previous Month', 'Variance', 'Target', 'Status'],
    stats: [{ label: 'Overall Performance', val: 'Excellent', col: 'text-emerald-400' }, { label: 'Downtime (Mo)', val: '12 Mins', col: 'text-blue-400' }, { label: 'User Complaints', val: 'Down 15%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { metric: 'Avg EMR Load Time', currentmonth: '1.2s', previousmonth: '1.4s', variance: '-0.2s (Better)', target: '< 1.5s', status: 'Generated' };
    })`
  },

  // Analytics
  {
    path: 'it/analytics/infrastructure', title: 'Infrastructure Dashboard', desc: 'Visual graphs of CPU, RAM, and Disk trends over time.',
    cols: ['Node/Server', 'Avg CPU (7d)', 'Peak CPU', 'Memory Trend', 'Disk I/O', 'Status'],
    stats: [{ label: 'Infra Utilization', val: '65%', col: 'text-blue-400' }, { label: 'Cost Optimization', val: 'Good', col: 'text-emerald-400' }, { label: 'Nodes Overloaded', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { nodeserver: 'App-Node-' + (1+i), avgcpu7d: '45%', peakcpu: i===0?'92%':'60%', memorytrend: 'Stable', diskio: 'Moderate', status: 'Analyzed' };
    })`
  },
  {
    path: 'it/analytics/security', title: 'Security Analytics', desc: 'Geographic map of blocked IPs and vulnerability trend lines.',
    cols: ['Threat Source', 'Attack Vector', 'Events (7d)', 'Severity Trend', 'Mitigation', 'Status'],
    stats: [{ label: 'Attacks Blocked', val: '12.4k', col: 'text-emerald-400' }, { label: 'Top Source Country', val: 'Russia/China', col: 'text-amber-400' }, { label: 'Malware Found', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { threatsource: 'Botnet (IP ' + i + ')', attackvector: 'DDoS Attempt', events7d: (1500-i*200).toString(), severitytrend: 'Decreasing', mitigation: 'WAF Block', status: 'Analyzed' };
    })`
  },
  {
    path: 'it/analytics/users', title: 'User Analytics', desc: 'Identifying peak usage hours to schedule maintenance windows.',
    cols: ['Time Window', 'Active Users', 'Transactions/Sec', 'Most Active Dept', 'Concurrent Max', 'Status'],
    stats: [{ label: 'Peak Hour', val: '10:00 - 11:00 AM', col: 'text-blue-400' }, { label: 'Max Concurrent', val: '1,250', col: 'text-amber-400' }, { label: 'Night Shift Users', val: '150', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timewindow: (8+i) + ':00 - ' + (9+i) + ':00', activeusers: (500+i*150).toString(), transactionssec: (120+i*20).toString(), mostactivedept: 'OPD / Billing', concurrentmax: (600+i*100).toString(), status: 'Analyzed' };
    })`
  },
  {
    path: 'it/analytics/api', title: 'API Analytics', desc: 'Cost analysis of external API usage (e.g., SMS costs vs Patient show rates).',
    cols: ['API Service', 'Cost (Mo)', 'Value Generated', 'Cost/Call', 'Optimization', 'Status'],
    stats: [{ label: 'Total API Spend', val: '$4,500', col: 'text-blue-400' }, { label: 'ROI Metrics', val: 'Positive', col: 'text-emerald-400' }, { label: 'Inefficient APIs', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { apiservice: 'WhatsApp Bus API', costmo: '$850', valuegenerated: 'Lower No-shows', costcall: '$0.01', optimization: 'Cache templates', status: 'Analyzed' };
    })`
  },
  {
    path: 'it/analytics/database', title: 'Database Analytics', desc: 'Data growth forecasting to plan storage procurement.',
    cols: ['Data Entity', 'Current Size', 'Growth Rate (Mo)', '1 Year Forecast', 'Archive Strategy', 'Status'],
    stats: [{ label: 'DB Size Forecast (1y)', val: '6.5 TB', col: 'text-amber-400' }, { label: 'Storage Needed', val: '+2 TB', col: 'text-red-400' }, { label: 'Budget Impact', val: '$2,400', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { dataentity: 'Radiology Images', currentsize: '1.2 TB', growthratemo: '5%', '1yearforecast': '2.1 TB', archivestrategy: 'Move to AWS S3', status: 'Analyzed' };
    })`
  },
  {
    path: 'it/analytics/health', title: 'System Health Score', desc: 'An aggregated score (0-100) combining uptime, bugs, and performance.',
    cols: ['Component', 'Health Score', 'Weightage', 'Primary Degrader', 'Action Plan', 'Status'],
    stats: [{ label: 'Overall Hospital IT Score', val: '94/100', col: 'text-emerald-400' }, { label: 'Weakest Link', val: 'Legacy LIS', col: 'text-amber-400' }, { label: 'Trend (30d)', val: 'Improving', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { component: ['Core EMR', 'Billing', 'Network', 'Integrations', 'Endpoints'][i], healthscore: (98-i*2).toString() + '/100', weightage: '20%', primarydegrader: i===4?'Old Hardware':'None', actionplan: 'Continue Monitoring', status: 'Analyzed' };
    })`
  },

  // Settings
  {
    path: 'it/settings/general', title: 'General Settings', desc: 'Global configurations like Hospital Name, Logo, and default language.',
    cols: ['Setting Key', 'Value', 'Group', 'Last Updated By', 'Date', 'Status'],
    stats: [{ label: 'Global Settings', val: '45', col: 'text-blue-400' }, { label: 'System Maintenance Mode', val: 'OFF', col: 'text-emerald-400' }, { label: 'Unsaved Changes', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { settingkey: 'HOSPITAL_NAME', value: 'City General Hospital', group: 'Brand', lastupdatedby: 'Admin', date: 'Jan 2026', status: 'Active' };
    })`
  },
  {
    path: 'it/settings/env', title: 'Environment Variables', desc: 'Secure management of DB connection strings and API secrets (Encrypted).',
    cols: ['Variable Name', 'Value (Masked)', 'Environment', 'Service', 'Last Rotated', 'Status'],
    stats: [{ label: 'Total Variables', val: '124', col: 'text-blue-400' }, { label: 'Secrets Expiring', val: '2', col: 'text-amber-400' }, { label: 'Encryption Status', val: 'AES-256', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { variablename: 'DB_PASSWORD', valuemasked: '********', environment: 'Production', service: 'Core API', lastrotated: '3 Months Ago', status: 'Secure' };
    })`
  },
  {
    path: 'it/settings/timezone', title: 'Time Zone', desc: 'Configuring server timezones and date formats for the HIS.',
    cols: ['Setting', 'Selected Value', 'System Default', 'User Override', 'Impacts', 'Status'],
    stats: [{ label: 'Default Timezone', val: 'UTC+5:30 (IST)', col: 'text-blue-400' }, { label: 'Date Format', val: 'DD/MM/YYYY', col: 'text-emerald-400' }, { label: 'NTP Sync Status', val: 'Synced', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { setting: 'Server Timezone', selectedvalue: 'Asia/Kolkata', systemdefault: 'Yes', useroverride: 'No', impacts: 'Billing, Audits', status: 'Active' };
    })`
  },
  {
    path: 'it/settings/mail', title: 'Mail Configuration', desc: 'SMTP credentials, ports, and default sender addresses.',
    cols: ['Configuration', 'Value', 'Provider', 'Test Connection', 'Last Error', 'Status'],
    stats: [{ label: 'SMTP Status', val: 'Connected', col: 'text-emerald-400' }, { label: 'Daily Limit', val: '50,000', col: 'text-blue-400' }, { label: 'Queue Status', val: 'Empty', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { configuration: 'SMTP Host', value: 'email-smtp.us-east-1.amazonaws.com', provider: 'AWS SES', testconnection: 'Pass', lasterror: 'None', status: 'Active' };
    })`
  },
  {
    path: 'it/settings/sms', title: 'SMS Configuration', desc: 'API endpoint, headers, and sender ID configurations for SMS vendors.',
    cols: ['Provider', 'Sender ID', 'Route Type', 'API Key Status', 'Test Message', 'Status'],
    stats: [{ label: 'Default Route', val: 'Twilio', col: 'text-blue-400' }, { label: 'Fallback Route', val: 'Gupshup', col: 'text-emerald-400' }, { label: 'DLT Registered', val: 'Yes', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { provider: 'Twilio', senderid: 'HOSPIT', routetype: 'Transactional', apikeystatus: 'Valid', testmessage: 'Delivered', status: 'Active' };
    })`
  },
  {
    path: 'it/settings/api', title: 'API Configuration', desc: 'Rate limiting thresholds and CORS settings for the hospital APIs.',
    cols: ['Endpoint Group', 'Rate Limit', 'CORS Origins', 'Authentication', 'Cache TTL', 'Status'],
    stats: [{ label: 'Global Rate Limit', val: '100 req/sec', col: 'text-blue-400' }, { label: 'Blocked IPs (Limit)', val: '12', col: 'text-amber-400' }, { label: 'CORS Restrictive', val: 'Yes', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { endpointgroup: '/api/public/*', ratelimit: '50/sec', corsorigins: 'hospital.com', authentication: 'JWT / API Key', cachettl: '60s', status: 'Active' };
    })`
  },
  {
    path: 'it/settings/backup', title: 'Backup Settings', desc: 'Global configurations for S3 buckets or NAS paths where backups are stored.',
    cols: ['Storage Target', 'Path/Bucket', 'Credentials', 'Retention Policy', 'Free Space', 'Status'],
    stats: [{ label: 'Primary Target', val: 'AWS S3', col: 'text-blue-400' }, { label: 'Secondary Target', val: 'Local NAS', col: 'text-emerald-400' }, { label: 'Storage Available', val: '15 TB', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { storagetarget: 'AWS S3', pathbucket: 's3://hosp-backups', credentials: 'Valid', retentionpolicy: '30 Days', freespace: 'Auto-scaling', status: 'Active' };
    })`
  }
];

const template = (page, componentName) => {
  let columnsGen = "";
  page.cols.forEach(col => {
    const accessorKey = col.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (col === 'Status' || col === 'Action') {
      columnsGen += `
    { 
      header: '${col}', 
      accessor: (row: any) => {
        const val = row.${accessorKey};
        const isGood = val === 'Active' || val === 'Healthy' || val === 'Online' || val === 'Success' || val === 'Completed' || val === 'Normal' || val === 'Optimal' || val === 'Running' || val === 'Enforced' || val === 'Mapped' || val === 'Approved' || val === 'Verified' || val === 'Ready' || val === 'Secure' || val === 'Protected' || val === 'Resolved' || val === 'Delivered' || val === 'Sent' || val === 'Read' || val === 'Up to Date' || val === 'Testing' || val === 'Enabled' || val === 'Compliant' || val === 'Generated' || val === 'Analyzed' || val === 'Policy Active' || val === 'Handled' || val === 'Fast' || val === 'Closed' || val === 'Fulfilled';
        const isWarning = val === 'Suspicious' || val === 'Pending Approval' || val === 'Flagged' || val === 'Warning' || val === 'Degraded' || val === 'Expiring Soon' || val === 'Review Suggested' || val === 'Pending' || val === 'Low Battery' || val === 'Update Pending' || val === 'Low Credits' || val === 'Monitored' || val === 'Open' || val === 'Under Review' || val === 'Scheduled' || val === 'High Memory' || val === 'Slow' || val === 'Review Query' || val === 'Action Required' || val === 'Processing';
        const isNeutral = val === 'Logged' || val === 'View' || val === 'Analyze' || val === 'Restart Now' || val === 'View Payload' || val === 'View Stack' || val === 'View Body' || val === 'View Details' || val === 'View Diff';
        const isDanger = val === 'Locked' || val === 'Bypassed' || val === 'Critical' || val === 'Offline' || val === 'Failed' || val === 'Rejected' || val === 'IP Blocked' || val === 'Blocked' || val === 'Replace Toner' || val === 'Bounced' || val === 'Inactive';
        
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
