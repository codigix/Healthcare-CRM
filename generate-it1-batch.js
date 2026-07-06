const fs = require('fs');
const path = require('path');

const config = [
  // User & Access Management
  {
    path: 'it/users/list', title: 'Users List', desc: 'Central directory of all hospital employees and their login status.',
    cols: ['Employee ID', 'Name', 'Department', 'Role', 'Last Login', 'Status'],
    stats: [{ label: 'Total Active Users', val: '1,250', col: 'text-blue-400' }, { label: 'Locked Accounts', val: '5', col: 'text-red-400' }, { label: 'New Today', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Cardiology', 'Billing', 'Pharmacy', 'IT', 'Nursing'];
      return { employeeid: 'EMP-' + (1000+i), name: 'User ' + (1+i), department: depts[i], role: 'Staff', lastlogin: '10 mins ago', status: i===2?'Locked':'Active' };
    })`
  },
  {
    path: 'it/users/groups', title: 'User Groups', desc: 'Logical grouping of users for bulk permission assignment (e.g., Ward Nurses).',
    cols: ['Group Name', 'Members', 'Assigned Roles', 'Created Date', 'Managed By', 'Status'],
    stats: [{ label: 'Total Groups', val: '45', col: 'text-blue-400' }, { label: 'Users Assigned', val: '1,100', col: 'text-emerald-400' }, { label: 'Empty Groups', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { groupname: 'Group ' + (1+i), members: (20+i*5).toString(), assignedroles: 'Clinical Staff', createddate: 'Jan 2026', managedby: 'System Admin', status: 'Active' };
    })`
  },
  {
    path: 'it/users/roles', title: 'Roles & Permissions', desc: 'Granular access control matrices defining what modules users can view or edit.',
    cols: ['Role Name', 'Modules Accessible', 'Total Permissions', 'Users Assigned', 'Risk Level', 'Status'],
    stats: [{ label: 'Configured Roles', val: '34', col: 'text-blue-400' }, { label: 'Admin Roles', val: '3', col: 'text-red-400' }, { label: 'Last Audited', val: '10 Days Ago', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const roles = ['Doctor', 'Nurse', 'Pharmacist', 'Cashier', 'IT Admin'];
      return { rolename: roles[i], modulesaccessible: (5+i).toString(), totalpermissions: (50+i*10).toString(), usersassigned: (100-i*10).toString(), risklevel: i===4?'High':'Medium', status: 'Active' };
    })`
  },
  {
    path: 'it/users/logins', title: 'Login Management', desc: 'Active sessions, forced logouts, and login history tracking.',
    cols: ['User ID', 'IP Address', 'Device/Browser', 'Login Time', 'Location', 'Status'],
    stats: [{ label: 'Active Sessions', val: '850', col: 'text-blue-400' }, { label: 'Suspicious Logins', val: '2', col: 'text-red-400' }, { label: 'Failed Attempts', val: '45', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { userid: 'EMP-100' + i, ipaddress: '192.168.1.' + (10+i), devicebrowser: 'Chrome / Win', logintime: '08:00 AM', location: 'Hospital LAN', status: i===0?'Suspicious':'Active' };
    })`
  },
  {
    path: 'it/users/password', title: 'Password Policy', desc: 'Enforcement of complex passwords, expiry cycles, and reset workflows.',
    cols: ['Policy Setting', 'Configured Value', 'Enforced Across', 'Exceptions', 'Last Modified', 'Status'],
    stats: [{ label: 'Users Needs Reset', val: '120', col: 'text-amber-400' }, { label: 'Policy Compliance', val: '98%', col: 'text-emerald-400' }, { label: 'Self-Resets (Mo)', val: '340', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { policysetting: i===0?'Min Length':'Expiry Days', configuredvalue: i===0?'12 Chars':'90 Days', enforcedacross: 'All Staff', exceptions: i===0?'None':'Service Accounts', lastmodified: 'Jan 2026', status: 'Enforced' };
    })`
  },
  {
    path: 'it/users/mfa', title: 'Multi-Factor Authentication', desc: 'Status of MFA adoption across the organization for secure access.',
    cols: ['User Name', 'Department', 'MFA Method', 'Enrolled Date', 'Last Used', 'Status'],
    stats: [{ label: 'MFA Enrolled', val: '95%', col: 'text-emerald-400' }, { label: 'Pending Setup', val: '45 Users', col: 'text-amber-400' }, { label: 'MFA Bypassed', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { username: 'User ' + (1+i), department: 'IT', mfamethod: 'Authenticator App', enrolleddate: 'Dec 2025', lastused: 'Today', status: i===0?'Bypassed':'Active' };
    })`
  },
  {
    path: 'it/users/sessions', title: 'Session Management', desc: 'Timeout configurations and concurrent login limits.',
    cols: ['User Role', 'Idle Timeout', 'Max Concurrent', 'Token Expiry', 'Last Audited', 'Status'],
    stats: [{ label: 'Avg Session Length', val: '4 Hrs', col: 'text-blue-400' }, { label: 'Terminated (Timeout)', val: '120/day', col: 'text-amber-400' }, { label: 'Concurrent Blocks', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { userrole: 'Nurse', idletimeout: '15 Mins', maxconcurrent: '1 Device', tokenexpiry: '12 Hours', lastaudited: 'Last Week', status: 'Active' };
    })`
  },

  // Department Access
  {
    path: 'it/access/logins', title: 'Department Logins', desc: 'Monitoring logins filtered by specific clinical or support departments.',
    cols: ['Department', 'Total Users', 'Active Now', 'Peak Login Time', 'Failed Logins (24h)', 'Status'],
    stats: [{ label: 'Highest Activity', val: 'Billing', col: 'text-blue-400' }, { label: 'Lowest Activity', val: 'Mortuary', col: 'text-gray-400' }, { label: 'Access Anomalies', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: ['Cardiology', 'Billing', 'Pharmacy', 'HR', 'IT'][i], totalusers: (50-i*5).toString(), activenow: (30-i*2).toString(), peaklogintime: '08:00 AM', failedlogins24h: i.toString(), status: 'Normal' };
    })`
  },
  {
    path: 'it/access/mapping', title: 'Role Mapping', desc: 'Mapping physical departments to software modules (e.g., Radiology Dept -> RIS Module).',
    cols: ['Department', 'Module Mapped', 'Default Role', 'Data Segregation', 'Override Permitted', 'Status'],
    stats: [{ label: 'Departments Mapped', val: '34/34', col: 'text-emerald-400' }, { label: 'Cross-dept Access', val: '12 Users', col: 'text-amber-400' }, { label: 'Pending Maps', val: '0', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { department: 'Radiology', modulemapped: 'RIS', defaultrole: 'Technician', datasegregation: 'Strict', overridepermitted: 'HOD Only', status: 'Mapped' };
    })`
  },
  {
    path: 'it/access/approval', title: 'Approval Matrix', desc: 'Defining who can approve access requests for sensitive modules (e.g., EMR).',
    cols: ['Module', 'Request Type', 'L1 Approver', 'L2 Approver', 'SLA', 'Status'],
    stats: [{ label: 'Configured Workflows', val: '45', col: 'text-blue-400' }, { label: 'Pending Reviews', val: '2', col: 'text-amber-400' }, { label: 'SLA Adherence', val: '98%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { module: 'EMR', requesttype: 'View All Patients', l1approver: 'Dept HOD', l2approver: 'Med Director', sla: '24 Hours', status: 'Active' };
    })`
  },
  {
    path: 'it/access/requests', title: 'Access Requests', desc: 'Ticketing system for users requesting new software permissions or module access.',
    cols: ['Request ID', 'User', 'Requested Access', 'Justification', 'Pending With', 'Status'],
    stats: [{ label: 'Open Requests', val: '15', col: 'text-amber-400' }, { label: 'Approved (Today)', val: '8', col: 'text-emerald-400' }, { label: 'Rejected (Today)', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { requestid: 'AR-' + (1001+i), user: 'Nurse Bob', requestedaccess: 'Discharge Module', justification: 'Shift Change', pendingwith: i===0?'HOD':'-', status: i===0?'Pending Approval':'Approved' };
    })`
  },
  {
    path: 'it/access/activity', title: 'User Activity Monitor', desc: 'Granular tracking of what a specific user is doing within their department access.',
    cols: ['Timestamp', 'User', 'Module', 'Action Performed', 'Record ID', 'Status'],
    stats: [{ label: 'Transactions (1h)', val: '12.5k', col: 'text-blue-400' }, { label: 'Data Exports', val: '45', col: 'text-amber-400' }, { label: 'Deletes Logged', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timestamp: '10:05 AM', user: 'Dr. Smith', module: 'EMR', actionperformed: i===0?'Deleted Note':'Viewed File', recordid: 'PT-1234' + i, status: i===0?'Flagged':'Logged' };
    })`
  },

  // Infrastructure Monitoring
  {
    path: 'it/infrastructure/server', title: 'Server Monitoring', desc: 'Health status, uptime, and availability of physical and virtual servers.',
    cols: ['Server Name', 'IP Address', 'Role/Service', 'Uptime', 'Ping Status', 'Health Status'],
    stats: [{ label: 'Total Servers', val: '45', col: 'text-blue-400' }, { label: 'Servers Online', val: '44', col: 'text-emerald-400' }, { label: 'Servers Down', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { servername: 'SRV-APP-' + (1+i), ipaddress: '10.0.1.' + (10+i), roleservice: i===0?'Web Server':'App Server', uptime: '99.9%', pingstatus: i===4?'No Response':'<5ms', healthstatus: i===4?'Offline':'Healthy' };
    })`
  },
  {
    path: 'it/infrastructure/usage', title: 'CPU & RAM Usage', desc: 'Real-time and historical resource utilization across infrastructure.',
    cols: ['Server Name', 'CPU Load', 'RAM Usage', 'Top Process', 'Disk I/O', 'Status'],
    stats: [{ label: 'Avg CPU Load', val: '45%', col: 'text-blue-400' }, { label: 'Servers >80% RAM', val: '2', col: 'text-amber-400' }, { label: 'Process Bottlenecks', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { servername: 'SRV-DB-' + (1+i), cpuload: i===0?'85%':'30%', ramusage: i===0?'90%':'45%', topprocess: 'postgres', diskio: 'High', status: i===0?'Warning':'Normal' };
    })`
  },
  {
    path: 'it/infrastructure/disk', title: 'Disk Usage', desc: 'Storage capacity planning and alerts for almost-full drives.',
    cols: ['Drive/Mount', 'Server', 'Total Space', 'Used Space', 'Free Space', 'Status'],
    stats: [{ label: 'Total Storage', val: '150 TB', col: 'text-blue-400' }, { label: 'Used Storage', val: '110 TB', col: 'text-amber-400' }, { label: 'Critical Drives', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { drivemount: '/data', server: 'SRV-DB-' + (1+i), totalspace: '10 TB', usedspace: i===0?'9.5 TB':'4 TB', freespace: i===0?'0.5 TB':'6 TB', status: i===0?'Critical':'Normal' };
    })`
  },
  {
    path: 'it/infrastructure/network', title: 'Network Monitoring', desc: 'Switch, router, and firewall throughput and latency tracking.',
    cols: ['Device Name', 'IP/Subnet', 'Throughput', 'Packet Loss', 'Active Conns', 'Status'],
    stats: [{ label: 'Network Health', val: '99.9%', col: 'text-emerald-400' }, { label: 'Avg Latency', val: '2ms', col: 'text-blue-400' }, { label: 'Packet Drops', val: '0.01%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { devicename: 'Core-Switch-' + (1+i), ipsubnet: '10.0.0.1', throughput: '1.2 Gbps', packetloss: '0%', activeconns: '4500', status: 'Healthy' };
    })`
  },
  {
    path: 'it/infrastructure/internet', title: 'Internet Status', desc: 'ISP link monitoring, failover status, and bandwidth utilization.',
    cols: ['ISP Link', 'Bandwidth', 'Current Load', 'Latency', 'Failover Status', 'Status'],
    stats: [{ label: 'Primary Link', val: 'Active', col: 'text-emerald-400' }, { label: 'Total Bandwidth', val: '1 Gbps', col: 'text-blue-400' }, { label: 'Uptime (Mo)', val: '99.9%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { isplink: i===0?'Primary (Airtel)':'Secondary (Jio)', bandwidth: '500 Mbps', currentload: i===0?'350 Mbps':'Idle', latency: '15ms', failoverstatus: i===0?'Active':'Standby', status: 'Online' };
    })`
  },
  {
    path: 'it/infrastructure/ups', title: 'UPS Monitoring', desc: 'Uninterruptible Power Supply loads and battery health in server rooms.',
    cols: ['UPS Unit', 'Location', 'Current Load', 'Battery Level', 'Est. Runtime', 'Status'],
    stats: [{ label: 'Total UPS Load', val: '45 kVA', col: 'text-blue-400' }, { label: 'All Batteries', val: 'Healthy', col: 'text-emerald-400' }, { label: 'Active on UPS', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { upsunit: 'UPS-DC-' + (1+i), location: 'Data Center 1', currentload: '40%', batterylevel: '100%', estruntime: '45 Mins', status: 'Normal' };
    })`
  },
  {
    path: 'it/infrastructure/datacenter', title: 'Data Center Health', desc: 'Environment variables like temperature and humidity in server rooms.',
    cols: ['Sensor Location', 'Temperature', 'Humidity', 'Water Leak', 'Door Access', 'Status'],
    stats: [{ label: 'Avg Temp', val: '21°C', col: 'text-blue-400' }, { label: 'Cooling Units', val: 'Active', col: 'text-emerald-400' }, { label: 'Alerts', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { sensorlocation: 'Rack ' + (1+i), temperature: '21.5°C', humidity: '45%', waterleak: 'None', dooraccess: 'Locked', status: 'Optimal' };
    })`
  },

  // Application Monitoring
  {
    path: 'it/application/erp', title: 'ERP Health', desc: 'Core Hospital Information System (HIS) application availability and response times.',
    cols: ['Module', 'Node', 'Uptime', 'Avg Response', 'Active Users', 'Status'],
    stats: [{ label: 'Overall App Health', val: '99.9%', col: 'text-emerald-400' }, { label: 'Avg Latency', val: '120ms', col: 'text-blue-400' }, { label: 'Errors (1h)', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { module: ['Billing', 'EMR', 'Pharmacy', 'Inventory', 'Lab'][i], node: 'Node-' + (1+i), uptime: '99.9%', avgresponse: '110ms', activeusers: (150-i*10).toString(), status: 'Healthy' };
    })`
  },
  {
    path: 'it/application/web', title: 'Web Server Status', desc: 'NGINX/Apache metrics, active connections, and SSL validity.',
    cols: ['Server', 'Active Conns', 'Requests/Sec', '5xx Errors', 'SSL Expiry', 'Status'],
    stats: [{ label: 'Global Requests/s', val: '1,240', col: 'text-blue-400' }, { label: 'Error Rate', val: '0.01%', col: 'text-emerald-400' }, { label: 'SSL Expiring', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { server: 'Web-0' + (1+i), activeconns: (300+i*50).toString(), requestssec: '450', '5xxerrors': i===0?'2':'0', sslexpiry: 'Dec 2026', status: 'Running' };
    })`
  },
  {
    path: 'it/application/api', title: 'API Health', desc: 'Internal microservices and external API endpoint monitoring.',
    cols: ['Endpoint', 'Method', 'Avg Latency', 'Success Rate', 'Throughput', 'Status'],
    stats: [{ label: 'Total Endpoints', val: '124', col: 'text-blue-400' }, { label: 'API Uptime', val: '100%', col: 'text-emerald-400' }, { label: 'Slow Endpoints', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { endpoint: '/api/v1/patients', method: 'GET', avglatency: i===0?'850ms':'45ms', successrate: '99.9%', throughput: '120 req/s', status: i===0?'Degraded':'Optimal' };
    })`
  },
  {
    path: 'it/application/queue', title: 'Queue Services', desc: 'Redis/RabbitMQ message queues for async tasks (e.g., sending SMS, PDF generation).',
    cols: ['Queue Name', 'Pending Msgs', 'Processing Rate', 'Failed Msgs', 'Consumers', 'Status'],
    stats: [{ label: 'Total Queued', val: '1,200', col: 'text-blue-400' }, { label: 'Processing Speed', val: '450/s', col: 'text-emerald-400' }, { label: 'Dead Letter Queue', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { queuename: ['sms_queue', 'email_queue', 'pdf_gen', 'hl7_sync', 'analytics'][i], pendingmsgs: i===0?'45':'0', processingrate: '50/s', failedmsgs: '0', consumers: '4', status: 'Healthy' };
    })`
  },
  {
    path: 'it/application/jobs', title: 'Scheduled Jobs', desc: 'Cron jobs and scheduled tasks (e.g., Daily End-of-Day billing aggregation).',
    cols: ['Job Name', 'Schedule', 'Last Run', 'Duration', 'Next Run', 'Status'],
    stats: [{ label: 'Active Jobs', val: '45', col: 'text-blue-400' }, { label: 'Failed Jobs', val: '1', col: 'text-red-400' }, { label: 'Success Rate', val: '98%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { jobname: 'EOD_Billing_Sync', schedule: '00:00 Daily', lastrun: 'Today 00:00', duration: '15 Mins', nextrun: 'Tmrw 00:00', status: i===0?'Failed':'Success' };
    })`
  },
  {
    path: 'it/application/services', title: 'Background Services', desc: 'Systemd or Windows services running critical background modules.',
    cols: ['Service Name', 'PID', 'Memory Used', 'Uptime', 'Restart Count', 'Status'],
    stats: [{ label: 'Total Services', val: '85', col: 'text-blue-400' }, { label: 'Services Stopped', val: '0', col: 'text-emerald-400' }, { label: 'Frequent Restarts', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { servicename: 'lis-interface-svc', pid: (1234+i).toString(), memoryused: '256 MB', uptime: '14 Days', restartcount: i===0?'5':'0', status: 'Running' };
    })`
  },
  {
    path: 'it/application/restart', title: 'Service Restart', desc: 'Authorized administrative panel to restart specific application pools or services.',
    cols: ['Service/App Pool', 'Node', 'Last Restarted', 'Restarted By', 'Reason', 'Action'],
    stats: [{ label: 'Restarts (24h)', val: '2', col: 'text-amber-400' }, { label: 'Pending Requests', val: '0', col: 'text-emerald-400' }, { label: 'Unauthorized Attempts', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { serviceapppool: 'Billing Web API', node: 'App-Node-1', lastrestarted: 'Yesterday', restartedby: 'SysAdmin', reason: 'High Memory', action: 'Restart Now' };
    })`
  },

  // Database Management
  {
    path: 'it/database/dashboard', title: 'Database Dashboard', desc: 'High-level metrics of database clusters, queries/sec, and storage.',
    cols: ['Cluster', 'Role', 'QPS', 'Connections', 'Storage Used', 'Status'],
    stats: [{ label: 'Total Queries/s', val: '4,500', col: 'text-blue-400' }, { label: 'Active Conns', val: '850', col: 'text-emerald-400' }, { label: 'Slow Queries', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { cluster: 'Postgres-Main', role: i===0?'Master':'Read-Replica', qps: (1500-i*200).toString(), connections: '150', storageused: '1.2 TB', status: 'Healthy' };
    })`
  },
  {
    path: 'it/database/backup', title: 'Database Backup', desc: 'Logs of automated and manual database dumps to secure storage.',
    cols: ['Backup ID', 'Database', 'Type', 'Size', 'Duration', 'Status'],
    stats: [{ label: 'Last Full Backup', val: 'Today 02:00', col: 'text-blue-400' }, { label: 'Storage Consumed', val: '4.5 TB', col: 'text-emerald-400' }, { label: 'Failed Backups', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { backupid: 'BK-' + (1001+i), database: 'HIS_Main', type: i===0?'Full':'Incremental', size: i===0?'120 GB':'5 GB', duration: i===0?'45 Mins':'2 Mins', status: 'Success' };
    })`
  },
  {
    path: 'it/database/restore', title: 'Database Restore', desc: 'Audited workflows for restoring databases to sandbox/staging or production rollback.',
    cols: ['Restore ID', 'Target Env', 'Source Backup', 'Requested By', 'Completion Time', 'Status'],
    stats: [{ label: 'Restores (Mo)', val: '4', col: 'text-blue-400' }, { label: 'Avg Restore Time', val: '2.5 Hrs', col: 'text-emerald-400' }, { label: 'Prod Rollbacks', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { restoreid: 'RST-' + (2001+i), targetenv: 'Staging Env', sourcebackup: 'BK-100' + i, requestedby: 'Dev Team', completiontime: '2 Hrs', status: 'Completed' };
    })`
  },
  {
    path: 'it/database/performance', title: 'Database Performance', desc: 'Deep dive into index usage, cache hit ratios, and lock waits.',
    cols: ['Metric', 'Value', 'Trend', 'Threshold', 'Last Alert', 'Status'],
    stats: [{ label: 'Cache Hit Ratio', val: '99.5%', col: 'text-emerald-400' }, { label: 'Deadlocks', val: '0', col: 'text-green-500' }, { label: 'Index Usage', val: '94%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const metrics = ['Cache Hit Ratio', 'Index Hit Rate', 'Deadlocks/hr', 'Long Running TX', 'Connection Usage'];
      return { metric: metrics[i], value: '99%', trend: 'Stable', threshold: '> 95%', lastalert: '-', status: 'Optimal' };
    })`
  },
  {
    path: 'it/database/queries', title: 'Query Monitor', desc: 'Identifying slow queries and missing indexes impacting application speed.',
    cols: ['Query Hash', 'Avg Execution', 'Calls/Hr', 'Rows Returned', 'Module Affected', 'Action'],
    stats: [{ label: 'Avg Query Time', val: '12ms', col: 'text-emerald-400' }, { label: 'Queries > 1s', val: '4', col: 'text-amber-400' }, { label: 'New Slow Queries', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { queryhash: '0x' + Math.random().toString(16).substr(2, 8), avgexecution: i===0?'1200ms':'45ms', callshr: '120', rowsreturned: '500', moduleaffected: 'Reporting', action: 'Analyze' };
    })`
  },
  {
    path: 'it/database/replication', title: 'Replication Status', desc: 'Monitoring sync lag between Master and High Availability (HA) read-replicas.',
    cols: ['Replica Node', 'Sync Type', 'Replication Lag', 'State', 'Last Sync', 'Status'],
    stats: [{ label: 'Max Lag', val: '0.2s', col: 'text-emerald-400' }, { label: 'Active Replicas', val: '3', col: 'text-blue-400' }, { label: 'Replication Errors', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { replicanode: 'Node-Rep-' + (1+i), synctype: 'Streaming', replicationlag: '0.05s', state: 'Streaming', lastsync: 'Just Now', status: 'Healthy' };
    })`
  },
  {
    path: 'it/database/logs', title: 'Database Logs', desc: 'Error logs, slow query logs, and audit logs of database configuration changes.',
    cols: ['Timestamp', 'Log Level', 'Message', 'User/Process', 'Database', 'Action'],
    stats: [{ label: 'Errors (24h)', val: '12', col: 'text-amber-400' }, { label: 'Fatal Errors', val: '0', col: 'text-emerald-400' }, { label: 'Log Size (Day)', val: '1.2 GB', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { timestamp: '10:00 AM', loglevel: i===0?'WARNING':'INFO', message: 'Connection timeout', userprocess: 'AppServer', database: 'HIS_Main', action: 'View' };
    })`
  },

  // Backup & Disaster Recovery
  {
    path: 'it/backup/automatic', title: 'Automatic Backup', desc: 'Policies and logs for automated daily/weekly backups of codebase and files.',
    cols: ['Backup Job', 'Schedule', 'Destination', 'Last Run', 'Size', 'Status'],
    stats: [{ label: 'Total Jobs', val: '15', col: 'text-blue-400' }, { label: 'Success Rate', val: '100%', col: 'text-emerald-400' }, { label: 'Storage Used', val: '12 TB', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { backupjob: 'App Codebase ' + i, schedule: 'Daily 01:00', destination: 'S3 / NAS', lastrun: 'Today', size: '4.5 GB', status: 'Success' };
    })`
  },
  {
    path: 'it/backup/manual', title: 'Manual Backup', desc: 'Triggering one-off backups before major software upgrades or patches.',
    cols: ['Task ID', 'Target System', 'Triggered By', 'Start Time', 'Duration', 'Status'],
    stats: [{ label: 'Manual Runs (Mo)', val: '4', col: 'text-blue-400' }, { label: 'Avg Duration', val: '15 Mins', col: 'text-emerald-400' }, { label: 'Failed Runs', val: '0', col: 'text-green-500' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { taskid: 'MN-' + (1001+i), targetsystem: 'ERP v2', triggeredby: 'SysAdmin', starttime: 'Yesterday 14:00', duration: '12 Mins', status: 'Completed' };
    })`
  },
  {
    path: 'it/backup/restore', title: 'Restore Backup', desc: 'Logs and test workflows for file or server restorations.',
    cols: ['Restore ID', 'Target Server', 'Backup Date', 'Requested By', 'Completion', 'Status'],
    stats: [{ label: 'Files Restored (Mo)', val: '12', col: 'text-blue-400' }, { label: 'Full Server Restore', val: '0', col: 'text-emerald-400' }, { label: 'Avg Time', val: '45 Mins', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { restoreid: 'RES-' + (2001+i), targetserver: 'File Server 1', backupdate: '01 Jan 2026', requestedby: 'HR Dept', completion: '30 Mins', status: 'Completed' };
    })`
  },
  {
    path: 'it/backup/dr', title: 'Disaster Recovery', desc: 'DR drill logs, RTO/RPO metrics, and failover site status.',
    cols: ['DR Site', 'Sync Status', 'RPO Lag', 'Last Failover Test', 'Readiness Score', 'Status'],
    stats: [{ label: 'Current RPO', val: '15 Mins', col: 'text-emerald-400' }, { label: 'Target RPO', val: '30 Mins', col: 'text-blue-400' }, { label: 'DR Drills (YTD)', val: '2', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { drsite: 'Cloud Region B', syncstatus: 'Syncing', rpolag: '10 Mins', lastfailovertest: 'Oct 2025', readinessscore: '98%', status: 'Ready' };
    })`
  },
  {
    path: 'it/backup/verification', title: 'Backup Verification', desc: 'Automated checks to ensure backup files are not corrupt and can be mounted.',
    cols: ['Verification ID', 'Backup File', 'Checksum Status', 'Mount Test', 'Tested On', 'Status'],
    stats: [{ label: 'Backups Verified', val: '120/120', col: 'text-emerald-400' }, { label: 'Corrupt Files', val: '0', col: 'text-green-500' }, { label: 'Verification Coverage', val: '100%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { verificationid: 'VER-' + (3001+i), backupfile: 'DB_Full_Jan01', checksumstatus: 'Match', mounttest: 'Passed', testedon: '02 Jan 2026', status: 'Verified' };
    })`
  },
  {
    path: 'it/backup/schedule', title: 'Backup Schedule', desc: 'Configuration matrix for GFS (Grandfather-Father-Son) backup retention policies.',
    cols: ['Policy Name', 'Retention (Days)', 'Storage Tier', 'Associated Jobs', 'Cost Est.', 'Status'],
    stats: [{ label: 'Active Policies', val: '5', col: 'text-blue-400' }, { label: 'Storage Cost (Mo)', val: '$1,200', col: 'text-amber-400' }, { label: 'Cold Storage Data', val: '45 TB', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { policyname: i===0?'Daily EMR':'Monthly Archive', retentiondays: i===0?'30 Days':'7 Years', storagetier: i===0?'Standard Cloud':'Glacier/Tape', associatedjobs: '4', costest: '$150', status: 'Active' };
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
        const isGood = val === 'Active' || val === 'Healthy' || val === 'Online' || val === 'Success' || val === 'Completed' || val === 'Normal' || val === 'Optimal' || val === 'Running' || val === 'Enforced' || val === 'Mapped' || val === 'Approved' || val === 'Verified' || val === 'Ready';
        const isWarning = val === 'Suspicious' || val === 'Pending Approval' || val === 'Flagged' || val === 'Warning' || val === 'Degraded' || val === 'Expiring Soon' || val === 'Review Suggested' || val === 'Pending';
        const isNeutral = val === 'Logged' || val === 'View' || val === 'Analyze' || val === 'Restart Now';
        const isDanger = val === 'Locked' || val === 'Bypassed' || val === 'Critical' || val === 'Offline' || val === 'Failed' || val === 'Rejected';
        
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
