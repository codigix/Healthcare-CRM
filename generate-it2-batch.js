const fs = require('fs');
const path = require('path');

const config = [
  // API & Integrations
  {
    path: 'it/integrations/dashboard', title: 'API Dashboard', desc: 'Overview of all third-party integrations, uptime, and request volumes.',
    cols: ['Integration', 'Type', 'Uptime (30d)', 'Requests (24h)', 'Error Rate', 'Status'],
    stats: [{ label: 'Total Integrations', val: '24', col: 'text-blue-400' }, { label: 'API Requests (24h)', val: '1.2M', col: 'text-emerald-400' }, { label: 'Failed Requests', val: '450', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const integrations = ['LIS (Lab)', 'RIS (Radiology)', 'Payment Gateway', 'SMS Gateway', 'ABHA (NDHM)'];
      return { integration: integrations[i], type: 'REST API', uptime30d: '99.9%', requests24h: (10000+i*2000).toString(), errorrate: '0.05%', status: 'Active' };
    })`
  },
  {
    path: 'it/integrations/keys', title: 'API Keys', desc: 'Secure management and rotation of API keys used by external vendors or internal apps.',
    cols: ['Key Name', 'Assigned To', 'Permissions', 'Created Date', 'Last Used', 'Status'],
    stats: [{ label: 'Active Keys', val: '15', col: 'text-blue-400' }, { label: 'Expiring < 30D', val: '2', col: 'text-amber-400' }, { label: 'Revoked Keys', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { keyname: 'Prod-App-Key-' + (1+i), assignedto: 'Mobile App', permissions: 'Read/Write', createddate: 'Jan 2026', lastused: 'Just Now', status: i===0?'Expiring Soon':'Active' };
    })`
  },
  {
    path: 'it/integrations/logs', title: 'API Logs', desc: 'Detailed request/response payloads for debugging integration failures.',
    cols: ['Timestamp', 'Endpoint', 'Method', 'Response Code', 'Latency', 'Action'],
    stats: [{ label: 'Total Logs (24h)', val: '1.2M', col: 'text-blue-400' }, { label: '4xx Errors', val: '1,200', col: 'text-amber-400' }, { label: '5xx Errors', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timestamp: '10:05 AM', endpoint: '/api/v1/sync', method: 'POST', responsecode: i===0?'500':'200', latency: i===0?'1200ms':'45ms', action: 'View Payload' };
    })`
  },
  {
    path: 'it/integrations/hl7', title: 'HL7 Integration', desc: 'Monitoring legacy Health Level 7 (HL7) message queues (ADT, ORM, ORU) with clinical devices.',
    cols: ['Message Type', 'Source Node', 'Target Node', 'Messages Queued', 'Last Processed', 'Status'],
    stats: [{ label: 'HL7 Msgs (24h)', val: '45,000', col: 'text-blue-400' }, { label: 'ACK Failed', val: '12', col: 'text-red-400' }, { label: 'Connection Drops', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['ADT^A01 (Admit)', 'ORM^O01 (Order)', 'ORU^R01 (Result)', 'ADT^A03 (Discharge)', 'SIU^S12 (Appt)'];
      return { messagetype: types[i], sourcenode: 'HIS', targetnode: 'LIS', messagesqueued: i===0?'5':'0', lastprocessed: 'Just Now', status: 'Active' };
    })`
  },
  {
    path: 'it/integrations/fhir', title: 'FHIR Integration', desc: 'Modern Fast Healthcare Interoperability Resources (FHIR) API monitoring.',
    cols: ['Resource', 'Requests (1h)', 'Avg Latency', 'Error Rate', 'Subscribers', 'Status'],
    stats: [{ label: 'FHIR Resources', val: '12', col: 'text-blue-400' }, { label: 'Avg Response', val: '45ms', col: 'text-emerald-400' }, { label: 'Sync Errors', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const resources = ['Patient', 'Observation', 'Encounter', 'Condition', 'Medication'];
      return { resource: resources[i], requests1h: (500-i*50).toString(), avglatency: '35ms', errorrate: '0.01%', subscribers: '3 Apps', status: 'Healthy' };
    })`
  },
  {
    path: 'it/integrations/abdm', title: 'ABDM / ABHA', desc: 'Integration with India\'s Ayushman Bharat Digital Mission (ABDM) for health IDs.',
    cols: ['Operation', 'Total Calls', 'Success Rate', 'Avg Latency', 'Last Sync', 'Status'],
    stats: [{ label: 'ABHA IDs Created', val: '120 (Today)', col: 'text-blue-400' }, { label: 'Records Linked', val: '450', col: 'text-emerald-400' }, { label: 'API Gateway', val: 'Online', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { operation: ['Create ABHA', 'Verify ABHA', 'Link CareContext', 'Discover Data', 'Consent Request'][i], totalcalls: (100+i*10).toString(), successrate: '99%', avglatency: '200ms', lastsync: '10 Mins Ago', status: 'Optimal' };
    })`
  },
  {
    path: 'it/integrations/lis', title: 'LIS Integration', desc: 'Laboratory Information System (LIS) two-way sync for orders and results.',
    cols: ['Sync Type', 'Orders Sent', 'Results Received', 'Pending Sync', 'Last Error', 'Status'],
    stats: [{ label: 'Orders Synced', val: '4,500', col: 'text-blue-400' }, { label: 'Results Synced', val: '4,200', col: 'text-emerald-400' }, { label: 'Pending Results', val: '300', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { synctype: i===0?'Outbound (Orders)':'Inbound (Results)', orderssent: (1000-i*100).toString(), resultsreceived: (900-i*100).toString(), pendingsync: i===0?'12':'0', lasterror: '-', status: 'Active' };
    })`
  },
  {
    path: 'it/integrations/ris', title: 'RIS Integration', desc: 'Radiology Information System (RIS) integration for imaging orders.',
    cols: ['Modality', 'Orders Sent', 'Reports Received', 'Queue Size', 'Last Sync', 'Status'],
    stats: [{ label: 'Total Orders', val: '450', col: 'text-blue-400' }, { label: 'Reports Finalized', val: '400', col: 'text-emerald-400' }, { label: 'Turnaround Time', val: '4 Hrs', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const modalities = ['MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'PET-CT'];
      return { modality: modalities[i], orderssent: (100-i*10).toString(), reportsreceived: (90-i*10).toString(), queuesize: i===0?'5':'0', lastsync: 'Just Now', status: 'Active' };
    })`
  },
  {
    path: 'it/integrations/pacs', title: 'PACS Integration', desc: 'Picture Archiving and Communication System (PACS) DICOM viewer links.',
    cols: ['Modality Node', 'Studies Pushed', 'Storage Used', 'Viewer Active Conns', 'Last Ping', 'Status'],
    stats: [{ label: 'Studies (Today)', val: '450', col: 'text-blue-400' }, { label: 'Storage Growth', val: '+12GB', col: 'text-amber-400' }, { label: 'PACS Gateway', val: 'Online', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { modalitynode: 'DICOM_NODE_' + (1+i), studiespushed: (50-i*5).toString(), storageused: (100-i*10) + ' GB', vieweractiveconns: (10-i).toString(), lastping: '1 Min Ago', status: 'Healthy' };
    })`
  },
  {
    path: 'it/integrations/payment', title: 'Payment Gateway', desc: 'Stripe, Razorpay, or local banking integrations for online billing.',
    cols: ['Gateway', 'Txn Count (24h)', 'Success Rate', 'Refunds Processing', 'Total Value', 'Status'],
    stats: [{ label: 'Total Online Txn', val: '$45,000', col: 'text-blue-400' }, { label: 'Success Rate', val: '98%', col: 'text-emerald-400' }, { label: 'Failed Txn', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { gateway: i===0?'Razorpay':'Stripe', txncount24h: (450-i*50).toString(), successrate: '98%', refundsprocessing: (5-i).toString(), totalvalue: '$' + (20000-i*5000), status: 'Active' };
    })`
  },
  {
    path: 'it/integrations/sms', title: 'SMS Gateway', desc: 'Transactional SMS routes (Twilio, Gupshup) for patient appointments and OTPs.',
    cols: ['Provider', 'Route Type', 'SMS Sent (Mo)', 'Delivery Rate', 'Credits Left', 'Status'],
    stats: [{ label: 'SMS Sent (Mo)', val: '125,000', col: 'text-blue-400' }, { label: 'Delivery Rate', val: '96%', col: 'text-emerald-400' }, { label: 'Credits Exhausting', val: '1 Route', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { provider: 'Twilio', routetype: i===0?'Transactional':'Promotional', smssentmo: (50000-i*10000).toString(), deliveryrate: '96%', creditsleft: i===0?'4,500':'120,000', status: i===0?'Low Credits':'Active' };
    })`
  },
  {
    path: 'it/integrations/whatsapp', title: 'WhatsApp API', desc: 'WhatsApp Business API integration for automated reports and reminders.',
    cols: ['WABA Account', 'Messages Sent', 'Read Rate', 'Template Approvals', 'Quality Rating', 'Status'],
    stats: [{ label: 'Active Users', val: '4,500', col: 'text-blue-400' }, { label: 'Opt-out Rate', val: '0.5%', col: 'text-emerald-400' }, { label: 'Quality Status', val: 'High', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { wabaaccount: 'Main Hospital', messagessent: '45,000', readrate: '85%', templateapprovals: '12/12 Approved', qualityrating: 'High', status: 'Active' };
    })`
  },
  {
    path: 'it/integrations/email', title: 'Email Server', desc: 'SMTP (SendGrid, AWS SES) configuration for mass emails and transactional receipts.',
    cols: ['SMTP Server', 'Emails Sent (Mo)', 'Bounce Rate', 'Spam Complaints', 'Domain Rep.', 'Status'],
    stats: [{ label: 'Emails Sent', val: '85,000', col: 'text-blue-400' }, { label: 'Bounce Rate', val: '1.2%', col: 'text-emerald-400' }, { label: 'Spam Rate', val: '0.01%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { smtpserver: 'AWS SES', emailssentmo: '45,000', bouncerate: '1.2%', spamcomplaints: '4', domainrep: 'Good', status: 'Healthy' };
    })`
  },

  // Cyber Security
  {
    path: 'it/security/dashboard', title: 'Security Dashboard', desc: 'Central view of threat alerts, firewall drops, and overall system security posture.',
    cols: ['Security Metric', 'Current Status', 'Last Scan', 'Vulnerabilities', 'Action Required', 'Status'],
    stats: [{ label: 'Overall Security Score', val: '92/100', col: 'text-emerald-400' }, { label: 'Active Threats', val: '0', col: 'text-green-500' }, { label: 'Patches Pending', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Firewall Status', 'Antivirus Defs', 'Intrusion Detection', 'WAF Rules', 'Endpoint Security'];
      return { securitymetric: metrics[i], currentstatus: 'Active', lastscan: '1 Hr Ago', vulnerabilities: i===4?'2 Low':'0', actionrequired: i===4?'Review':'None', status: 'Secure' };
    })`
  },
  {
    path: 'it/security/firewall', title: 'Firewall Rules', desc: 'Managing inbound/outbound traffic rules, port forwarding, and VPN access.',
    cols: ['Rule ID', 'Source IP', 'Destination IP', 'Port', 'Action (Allow/Deny)', 'Status'],
    stats: [{ label: 'Active Rules', val: '145', col: 'text-blue-400' }, { label: 'Blocked Connections', val: '1.2k (24h)', col: 'text-emerald-400' }, { label: 'VPN Users Active', val: '12', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ruleid: 'FW-' + (101+i), sourceip: i===0?'Any':'10.0.0.0/24', destinationip: '192.168.1.100', port: i===0?'443':'22', actionallowdeny: i===0?'Allow':'Deny', status: 'Active' };
    })`
  },
  {
    path: 'it/security/antivirus', title: 'Antivirus Status', desc: 'Centralized view of Endpoint Detection & Response (EDR) across all hospital PCs.',
    cols: ['Hostname', 'Agent Version', 'Last Scan', 'Threats Found', 'Defs Updated', 'Status'],
    stats: [{ label: 'Endpoints Protected', val: '1,200', col: 'text-emerald-400' }, { label: 'Outdated Definitions', val: '15', col: 'text-amber-400' }, { label: 'Threats Blocked', val: '4 (Mo)', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { hostname: 'PC-OPD-' + (1+i), agentversion: 'v10.2', lastscan: 'Yesterday', threatsfound: '0', defsupdated: i===0?'Last Week':'Today', status: i===0?'Warning':'Protected' };
    })`
  },
  {
    path: 'it/security/threats', title: 'Threat Detection', desc: 'Intrusion Detection System (IDS) alerts for malware, ransomware, or phishing.',
    cols: ['Alert ID', 'Threat Type', 'Severity', 'Target Asset', 'Detected Time', 'Status'],
    stats: [{ label: 'High Severity Alerts', val: '0', col: 'text-green-500' }, { label: 'Medium Severity', val: '2', col: 'text-amber-400' }, { label: 'Phishing Emails Blocked', val: '450', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { alertid: 'TRT-' + (1001+i), threattype: 'Failed SSH Bruteforce', severity: i===0?'Medium':'Low', targetasset: 'Web Server 1', detectedtime: 'Yesterday 14:00', status: 'Resolved' };
    })`
  },
  {
    path: 'it/security/failed-logins', title: 'Failed Login Attempts', desc: 'Audit trail of brute-force attempts on ERP, VPN, or Web portals.',
    cols: ['Username', 'Source IP', 'Target System', 'Attempt Count', 'Lockout Triggered', 'Status'],
    stats: [{ label: 'Failed Logins (24h)', val: '124', col: 'text-amber-400' }, { label: 'Accounts Locked', val: '5', col: 'text-red-400' }, { label: 'Unique Attack IPs', val: '12', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { username: 'admin', sourceip: '185.xxx.xxx.xxx', targetsystem: 'VPN Gateway', attemptcount: i===0?'45':'3', lockouttriggered: i===0?'Yes':'No', status: i===0?'IP Blocked':'Monitored' };
    })`
  },
  {
    path: 'it/security/whitelist', title: 'IP Whitelist', desc: 'Approved external IPs (e.g., specific vendors, remote doctors) allowed to bypass firewall.',
    cols: ['IP Address', 'Assigned To/Vendor', 'Purpose', 'Added By', 'Expiry Date', 'Status'],
    stats: [{ label: 'Whitelisted IPs', val: '45', col: 'text-blue-400' }, { label: 'Pending Approval', val: '2', col: 'text-amber-400' }, { label: 'Expiring Soon', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ipaddress: '203.0.113.' + i, assignedtovendor: 'Teleradiology Co.', purpose: 'PACS Access', addedby: 'IT Head', expirydate: '31 Dec 2026', status: 'Active' };
    })`
  },
  {
    path: 'it/security/blacklist', title: 'IP Blacklist', desc: 'Known malicious IPs or subnets permanently blocked at the edge router.',
    cols: ['IP / Subnet', 'Source of Threat', 'Block Reason', 'Added Date', 'Hit Count', 'Status'],
    stats: [{ label: 'Total Blocked IPs', val: '1,240', col: 'text-emerald-400' }, { label: 'Auto-Blocked (IDS)', val: '450', col: 'text-blue-400' }, { label: 'Hits on Blocklist', val: '14.5k (24h)', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { ipsubnet: '198.51.100.' + i, sourceofthreat: 'IDS Auto-block', blockreason: 'SSH Bruteforce', addeddate: 'Jan 2026', hitcount: (450-i*50).toString(), status: 'Blocked' };
    })`
  },
  {
    path: 'it/security/ssl', title: 'SSL Certificates', desc: 'Tracking expiry of domain certificates to prevent application downtime.',
    cols: ['Domain/Subdomain', 'Issued By', 'Valid From', 'Valid To', 'Days Remaining', 'Status'],
    stats: [{ label: 'Active Certificates', val: '15', col: 'text-blue-400' }, { label: 'Expiring < 30D', val: '1', col: 'text-amber-400' }, { label: 'Auto-Renew Enabled', val: '10', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { domainsubdomain: i===0?'api.hospital.com':'portal.hospital.com', issuedby: 'Let\'s Encrypt', validfrom: 'Jan 2026', validto: i===0?'Next Week':'Jan 2027', daysremaining: i===0?'12 Days':'300 Days', status: i===0?'Expiring Soon':'Valid' };
    })`
  },
  {
    path: 'it/security/policies', title: 'Security Policies', desc: 'Documented ISO 27001 / HIPAA IT policies and staff acknowledgement tracking.',
    cols: ['Policy Name', 'Version', 'Last Updated', 'Staff Acknowledged', 'Next Review', 'Status'],
    stats: [{ label: 'Total Policies', val: '12', col: 'text-blue-400' }, { label: 'Staff Compliance', val: '85%', col: 'text-amber-400' }, { label: 'Reviews Pending', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { policyname: 'Clean Desk Policy', version: 'v2.1', lastupdated: 'Jan 2025', staffacknowledged: '85%', nextreview: 'Jan 2027', status: 'Enforced' };
    })`
  },

  // Device Management
  {
    path: 'it/devices/desktops', title: 'Desktop Management', desc: 'Inventory of PCs, MAC addresses, OS versions, and assigned departments.',
    cols: ['Asset Tag', 'Hostname', 'Department', 'OS Version', 'Last Seen', 'Status'],
    stats: [{ label: 'Total Desktops', val: '850', col: 'text-blue-400' }, { label: 'Online Now', val: '720', col: 'text-emerald-400' }, { label: 'Needs OS Update', val: '45', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { assettag: 'IT-PC-' + (1001+i), hostname: 'OPD-Desk-' + i, department: 'OPD', osversion: 'Win 11 Pro', lastseen: '10 Mins Ago', status: i===0?'Update Pending':'Active' };
    })`
  },
  {
    path: 'it/devices/mobile', title: 'Mobile Devices', desc: 'Mobile Device Management (MDM) for corporate-issued phones to doctors/staff.',
    cols: ['Device IMEI', 'Assigned To', 'Model', 'MDM Enrolled', 'Compliance', 'Status'],
    stats: [{ label: 'Managed Devices', val: '120', col: 'text-blue-400' }, { label: 'Non-Compliant', val: '2', col: 'text-red-400' }, { label: 'Remote Wipes (YTD)', val: '1', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { deviceimei: '8643210' + i, assignedto: 'Dr. Smith', model: 'iPhone 13', mdmenrolled: 'Yes', compliance: i===0?'Jailbroken':'Compliant', status: i===0?'Locked':'Active' };
    })`
  },
  {
    path: 'it/devices/tablets', title: 'Tablets', desc: 'iPads/Tablets used by nurses for bedside EMR documentation.',
    cols: ['Asset Tag', 'Ward Assigned', 'Battery Health', 'App Version', 'Last Sync', 'Status'],
    stats: [{ label: 'Total Tablets', val: '145', col: 'text-blue-400' }, { label: 'In Repair', val: '4', col: 'text-amber-400' }, { label: 'App Up to Date', val: '100%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { assettag: 'IT-TAB-' + (2001+i), wardassigned: 'ICU', batteryhealth: (95-i*5) + '%', appversion: 'v4.2.1', lastsync: 'Just Now', status: 'Active' };
    })`
  },
  {
    path: 'it/devices/scanners', title: 'Barcode Scanners', desc: 'Pharmacy and lab barcode scanners tracking.',
    cols: ['Scanner ID', 'Type (Wired/BT)', 'Department', 'Associated PC', 'Last Ping', 'Status'],
    stats: [{ label: 'Total Scanners', val: '240', col: 'text-blue-400' }, { label: 'Faulty', val: '2', col: 'text-red-400' }, { label: 'Battery Low (BT)', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { scannerid: 'SCN-' + (3001+i), typewiredbt: i===0?'Bluetooth':'Wired', department: 'Pharmacy', associatedpc: 'PHRM-PC-1', lastping: 'Active', status: i===0?'Low Battery':'Optimal' };
    })`
  },
  {
    path: 'it/devices/biometric', title: 'Biometric Devices', desc: 'Fingerprint/Face scanners for staff attendance and access control.',
    cols: ['Device ID', 'Location', 'Model', 'Sync Status', 'Stored Templates', 'Status'],
    stats: [{ label: 'Total Devices', val: '34', col: 'text-blue-400' }, { label: 'Offline Devices', val: '0', col: 'text-emerald-400' }, { label: 'Sync Errors', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { deviceid: 'BIO-' + (4001+i), location: 'Main Entrance', model: 'ZK Teco', syncstatus: 'Synced', storedtemplates: '1,240', status: 'Online' };
    })`
  },
  {
    path: 'it/devices/printers', title: 'Printers', desc: 'Network printers, label printers (Lab/Pharmacy), and toner level monitoring.',
    cols: ['Printer IP', 'Location', 'Type', 'Pages Printed', 'Toner Level', 'Status'],
    stats: [{ label: 'Total Printers', val: '120', col: 'text-blue-400' }, { label: 'Low Toner', val: '8', col: 'text-amber-400' }, { label: 'Paper Jam Errors', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { printerip: '10.0.5.' + i, location: 'Billing Desk ' + i, type: 'LaserJet', pagesprinted: (15000+i*1000).toString(), tonerlevel: i===0?'5%':'65%', status: i===0?'Replace Toner':'Online' };
    })`
  },
  {
    path: 'it/devices/medical', title: 'Medical Devices (IoT)', desc: 'Network-connected clinical devices (Monitors, Ventilators) sending data to HIS.',
    cols: ['Device MAC', 'Modality/Type', 'Ward', 'Integration Status', 'Data Packets', 'Status'],
    stats: [{ label: 'Connected Devices', val: '450', col: 'text-blue-400' }, { label: 'Data Syncing', val: '445', col: 'text-emerald-400' }, { label: 'Connection Drops', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { devicemac: 'AA:BB:CC:00:11:0' + i, modalitytype: 'Patient Monitor', ward: 'ICU Bed ' + (1+i), integrationstatus: 'HL7 Out', datapackets: '45/min', status: 'Healthy' };
    })`
  },

  // System Logs
  {
    path: 'it/logs/audit', title: 'Audit Logs', desc: 'Immutable trails of who changed what data (e.g., deleted a bill, edited an EMR).',
    cols: ['Timestamp', 'User', 'Module', 'Action', 'Record ID', 'Action'],
    stats: [{ label: 'Logs (24h)', val: '145k', col: 'text-blue-400' }, { label: 'Critical Actions', val: '120', col: 'text-amber-400' }, { label: 'Storage Size', val: '45 GB', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timestamp: '10:15 AM', user: 'Admin', module: 'Billing', action: 'Refund Initiated', recordid: 'INV-9876' + i, action_: 'View Diff' };
    })`
  },
  {
    path: 'it/logs/login', title: 'Login Logs', desc: 'Record of all successful and failed authentication attempts.',
    cols: ['Timestamp', 'User ID', 'IP Address', 'Result', 'Browser/App', 'Action'],
    stats: [{ label: 'Total Logins (24h)', val: '2,400', col: 'text-blue-400' }, { label: 'Failed Attempts', val: '45', col: 'text-red-400' }, { label: 'MFA Success', val: '98%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timestamp: '08:00 AM', userid: 'EMP-' + (100+i), ipaddress: '192.168.1.' + i, result: i===0?'Failed (Bad Password)':'Success', browserapp: 'Chrome', action_: 'Block IP' };
    })`
  },
  {
    path: 'it/logs/error', title: 'Error Logs', desc: 'Application crashes, unhandled exceptions, and stack traces.',
    cols: ['Timestamp', 'Error Level', 'Service', 'Error Message', 'Occurrence', 'Action'],
    stats: [{ label: 'Fatal Errors', val: '0', col: 'text-green-500' }, { label: 'Warnings', val: '145', col: 'text-amber-400' }, { label: 'Unresolved', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timestamp: 'Yesterday', errorlevel: i===0?'ERROR':'WARNING', service: 'Billing API', errormessage: 'NullReferenceException', occurrence: (5-i).toString(), action_: 'View Stack' };
    })`
  },
  {
    path: 'it/logs/api', title: 'API Logs', desc: 'Payload logs for external integrations to resolve disputes or missing data.',
    cols: ['Timestamp', 'Endpoint', 'Vendor', 'Status Code', 'Response Time', 'Action'],
    stats: [{ label: 'Total API Calls', val: '1.2M', col: 'text-blue-400' }, { label: 'Avg Latency', val: '120ms', col: 'text-emerald-400' }, { label: '4xx Errors', val: '450', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timestamp: 'Just Now', endpoint: '/api/sms/send', vendor: 'Twilio', statuscode: '200 OK', responsetime: '45ms', action_: 'View Body' };
    })`
  },
  {
    path: 'it/logs/activity', title: 'Activity Logs', desc: 'General usage telemetry (clicks, page views) for UX analytics.',
    cols: ['Timestamp', 'User Role', 'Page Visited', 'Time Spent', 'Action Flow', 'Status'],
    stats: [{ label: 'Page Views (24h)', val: '45k', col: 'text-blue-400' }, { label: 'Most Used Module', val: 'OPD Queue', col: 'text-emerald-400' }, { label: 'Avg Session', val: '14 Mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timestamp: '10:00 AM', userrole: 'Nurse', pagevisited: '/ipd/ward-dashboard', timespent: '4 Mins', actionflow: 'View -> Edit Vitals', status: 'Logged' };
    })`
  },
  {
    path: 'it/logs/event', title: 'Event Logs', desc: 'System-level events (server restarts, cron job execution, backup completion).',
    cols: ['Timestamp', 'Event Source', 'Event Type', 'Description', 'Severity', 'Action'],
    stats: [{ label: 'Total Events', val: '1,240', col: 'text-blue-400' }, { label: 'Critical Events', val: '0', col: 'text-green-500' }, { label: 'Cron Success', val: '100%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timestamp: '01:00 AM', eventsource: 'Backup Daemon', eventtype: 'Task Completion', description: 'DB Full Backup Success', severity: 'Info', action_: 'View Details' };
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
        const isGood = val === 'Active' || val === 'Healthy' || val === 'Online' || val === 'Success' || val === 'Completed' || val === 'Normal' || val === 'Optimal' || val === 'Running' || val === 'Enforced' || val === 'Mapped' || val === 'Approved' || val === 'Verified' || val === 'Ready' || val === 'Secure' || val === 'Protected' || val === 'Resolved';
        const isWarning = val === 'Suspicious' || val === 'Pending Approval' || val === 'Flagged' || val === 'Warning' || val === 'Degraded' || val === 'Expiring Soon' || val === 'Review Suggested' || val === 'Pending' || val === 'Low Battery' || val === 'Update Pending' || val === 'Low Credits' || val === 'Monitored';
        const isNeutral = val === 'Logged' || val === 'View' || val === 'Analyze' || val === 'Restart Now' || val === 'View Payload' || val === 'View Stack' || val === 'View Body' || val === 'View Details' || val === 'View Diff';
        const isDanger = val === 'Locked' || val === 'Bypassed' || val === 'Critical' || val === 'Offline' || val === 'Failed' || val === 'Rejected' || val === 'IP Blocked' || val === 'Blocked' || val === 'Replace Toner';
        
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
