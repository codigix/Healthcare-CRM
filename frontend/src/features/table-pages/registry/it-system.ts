import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/helpdesk/enquiry": {
    ui: 0,
    title: "Helpdesk Enquiries", description: "Manage and respond to patient and public enquiries.",
    stats: [{ label: "Open Enquiries", color: "text-amber-400", value: "34" }, { label: "Resolved Today", color: "text-emerald-400", value: "112" }, { label: "Avg Response", color: "text-blue-400", value: "12 mins" }],
    columns: [["Enquiry ID", "enquiryid"], ["Caller/Sender", "callersender"], ["Category", "category"], ["Received Via", "receivedvia"], ["Assigned To", "assignedto"]],
    badge: ["Status", "status", {"Open":"gray","Resolved":"emerald","In Progress":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const callers = ['Alice Wonderland', 'Bob Builder', 'Charlie Brown', 'Daisy Duck', 'Eve Adams'];
        const cats = ['Appointment', 'Billing', 'General Info', 'Insurance', 'Feedback'];
        const vias = ['Phone Call', 'Email', 'Web Portal', 'WhatsApp', 'In-Person'];
        const statuses = ['Open', 'Resolved', 'In Progress', 'Open', 'Resolved'];
        return { enquiryid: 'ENQ-' + (1001 + i), callersender: callers[i], category: cats[i], receivedvia: vias[i], assignedto: 'Agent ' + (i + 1), status: statuses[i] };
      }),
  },
  "/helpdesk/packages": {
    ui: 0,
    title: "Health Packages", description: "Manage health checkup packages and promotional offers.",
    stats: [{ label: "Active Packages", color: "text-blue-400", value: "12" }, { label: "Bookings Today", color: "text-emerald-400", value: "45" }, { label: "Revenue Generated", color: "text-emerald-400", value: "$12,450" }],
    columns: [["Package ID", "packageid"], ["Package Name", "packagename"], ["Target Demo", "targetdemo"], ["Tests Included", "testsincluded"], ["Price", "price"]],
    badge: ["Status", "status", {"Active":"emerald","Promotional":"amber","Inactive":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const pkgs = ['Master Health Check', 'Cardiac Screening', 'Women Wellness', 'Diabetic Care', 'Senior Citizen Basic'];
        const demos = ['Adults 30+', 'Adults 40+', 'Women 18+', 'Diabetics', 'Adults 60+'];
        const tests = ['45 Tests', '12 Tests', '24 Tests', '15 Tests', '20 Tests'];
        const prices = ['$299', '$499', '$349', '$199', '$149'];
        const statuses = ['Active', 'Active', 'Active', 'Promotional', 'Inactive'];
        return { packageid: 'PKG-' + (3001 + i), packagename: pkgs[i], targetdemo: demos[i], testsincluded: tests[i], price: prices[i], status: statuses[i] };
      }),
  },
  "/helpdesk/services": {
    ui: 0,
    title: "Hospital Services Info", description: "Directory of available services for helpdesk reference.",
    stats: [{ label: "Total Services", color: "text-blue-400", value: "45" }, { label: "24/7 Services", color: "text-emerald-400", value: "8" }, { label: "Temporarily Closed", color: "text-red-400", value: "1" }],
    columns: [["Service ID", "serviceid"], ["Service Name", "servicename"], ["Department", "department"], ["Operating Hours", "operatinghours"], ["Contact Ext", "contactext"]],
    badge: ["Status", "status", {"Active":"emerald","Maintenance":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const services = ['24/7 Emergency', 'Outpatient Consult', 'Radiology (MRI/CT)', 'In-house Pharmacy', 'Physiotherapy'];
        const depts = ['Emergency', 'OPD', 'Diagnostics', 'Pharmacy', 'Rehabilitation'];
        const hours = ['24/7', '09:00 - 17:00', '24/7', '24/7', '10:00 - 18:00'];
        const exts = ['100', '201', '305', '401', '502'];
        const statuses = ['Active', 'Active', 'Active', 'Active', 'Maintenance'];
        return { serviceid: 'SRV-' + (2001 + i), servicename: services[i], department: depts[i], operatinghours: hours[i], contactext: exts[i], status: statuses[i] };
      }),
  },
  "/it/access/activity": {
    ui: 5,
    title: "User Activity Monitor", description: "Granular tracking of what a specific user is doing within their department access.",
    stats: [{ label: "Transactions (1h)", color: "text-blue-400", value: "12.5k" }, { label: "Data Exports", color: "text-amber-400", value: "45" }, { label: "Deletes Logged", color: "text-red-400", value: "12" }],
    columns: [["Timestamp", "timestamp"], ["User", "user"], ["Module", "module"], ["Action Performed", "actionperformed"], ["Record ID", "recordid"]],
    badge: ["Status", "status", {"Flagged":"amber","Logged":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { timestamp: '10:05 AM', user: 'Dr. Smith', module: 'EMR', actionperformed: i === 0 ? 'Deleted Note' : 'Viewed File', recordid: 'PT-1234' + i, status: i === 0 ? 'Flagged' : 'Logged' };
      }),
  },
  "/it/access/approval": {
    ui: 5,
    title: "Approval Matrix", description: "Defining who can approve access requests for sensitive modules (e.g., EMR).",
    stats: [{ label: "Configured Workflows", color: "text-blue-400", value: "45" }, { label: "Pending Reviews", color: "text-amber-400", value: "2" }, { label: "SLA Adherence", color: "text-emerald-400", value: "98%" }],
    columns: [["Module", "module"], ["Request Type", "requesttype"], ["L1 Approver", "l1approver"], ["L2 Approver", "l2approver"], ["SLA", "sla"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { module: 'EMR', requesttype: 'View All Patients', l1approver: 'Dept HOD', l2approver: 'Med Director', sla: '24 Hours', status: 'Active' };
      }),
  },
  "/it/access/logins": {
    ui: 5,
    title: "Department Logins", description: "Monitoring logins filtered by specific clinical or support departments.",
    stats: [{ label: "Highest Activity", color: "text-blue-400", value: "Billing" }, { label: "Lowest Activity", color: "text-gray-400", value: "Mortuary" }, { label: "Access Anomalies", color: "text-emerald-400", value: "0" }],
    columns: [["Department", "department"], ["Total Users", "totalusers"], ["Active Now", "activenow"], ["Peak Login Time", "peaklogintime"], ["Failed Logins (24h)", "failedlogins24h"]],
    badge: ["Status", "status", {"Normal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { department: ['Cardiology', 'Billing', 'Pharmacy', 'HR', 'IT'][i], totalusers: (50 - i * 5).toString(), activenow: (30 - i * 2).toString(), peaklogintime: '08:00 AM', failedlogins24h: i.toString(), status: 'Normal' };
      }),
  },
  "/it/access/requests": {
    ui: 5,
    title: "Access Requests", description: "Ticketing system for users requesting new software permissions or module access.",
    stats: [{ label: "Open Requests", color: "text-amber-400", value: "15" }, { label: "Approved (Today)", color: "text-emerald-400", value: "8" }, { label: "Rejected (Today)", color: "text-red-400", value: "1" }],
    columns: [["Request ID", "requestid"], ["User", "user"], ["Requested Access", "requestedaccess"], ["Justification", "justification"], ["Pending With", "pendingwith"]],
    badge: ["Status", "status", {"Pending Approval":"amber","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { requestid: 'AR-' + (1001 + i), user: 'Nurse Bob', requestedaccess: 'Discharge Module', justification: 'Shift Change', pendingwith: i === 0 ? 'HOD' : '-', status: i === 0 ? 'Pending Approval' : 'Approved' };
      }),
  },
  "/it/analytics/api": {
    ui: 5,
    title: "API Analytics", description: "Cost analysis of external API usage (e.g., SMS costs vs Patient show rates).",
    stats: [{ label: "Total API Spend", color: "text-blue-400", value: "$4,500" }, { label: "ROI Metrics", color: "text-emerald-400", value: "Positive" }, { label: "Inefficient APIs", color: "text-amber-400", value: "1" }],
    columns: [["API Service", "apiservice"], ["Cost (Mo)", "costmo"], ["Value Generated", "valuegenerated"], ["Cost/Call", "costcall"], ["Optimization", "optimization"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { apiservice: 'WhatsApp Bus API', costmo: '$850', valuegenerated: 'Lower No-shows', costcall: '$0.01', optimization: 'Cache templates', status: 'Analyzed' };
      }),
  },
  "/it/analytics/database": {
    ui: 5,
    title: "Database Analytics", description: "Data growth forecasting to plan storage procurement.",
    stats: [{ label: "DB Size Forecast (1y)", color: "text-amber-400", value: "6.5 TB" }, { label: "Storage Needed", color: "text-red-400", value: "+2 TB" }, { label: "Budget Impact", color: "text-blue-400", value: "$2,400" }],
    columns: [["Data Entity", "dataentity"], ["Current Size", "currentsize"], ["Growth Rate (Mo)", "growthratemo"], ["1 Year Forecast", "1yearforecast"], ["Archive Strategy", "archivestrategy"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { dataentity: 'Radiology Images', currentsize: '1.2 TB', growthratemo: '5%', '1yearforecast': '2.1 TB', archivestrategy: 'Move to AWS S3', status: 'Analyzed' };
      }),
  },
  "/it/analytics/health": {
    ui: 5,
    title: "System Health Score", description: "An aggregated score (0-100) combining uptime, bugs, and performance.",
    stats: [{ label: "Overall Hospital IT Score", color: "text-emerald-400", value: "94/100" }, { label: "Weakest Link", color: "text-amber-400", value: "Legacy LIS" }, { label: "Trend (30d)", color: "text-blue-400", value: "Improving" }],
    columns: [["Component", "component"], ["Health Score", "healthscore"], ["Weightage", "weightage"], ["Primary Degrader", "primarydegrader"], ["Action Plan", "actionplan"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { component: ['Core EMR', 'Billing', 'Network', 'Integrations', 'Endpoints'][i], healthscore: (98 - i * 2).toString() + '/100', weightage: '20%', primarydegrader: i === 4 ? 'Old Hardware' : 'None', actionplan: 'Continue Monitoring', status: 'Analyzed' };
      }),
  },
  "/it/analytics/infrastructure": {
    ui: 5,
    title: "Infrastructure Dashboard", description: "Visual graphs of CPU, RAM, and Disk trends over time.",
    stats: [{ label: "Infra Utilization", color: "text-blue-400", value: "65%" }, { label: "Cost Optimization", color: "text-emerald-400", value: "Good" }, { label: "Nodes Overloaded", color: "text-green-500", value: "0" }],
    columns: [["Node/Server", "nodeserver"], ["Avg CPU (7d)", "avgcpu7d"], ["Peak CPU", "peakcpu"], ["Memory Trend", "memorytrend"], ["Disk I/O", "diskio"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { nodeserver: 'App-Node-' + (1 + i), avgcpu7d: '45%', peakcpu: i === 0 ? '92%' : '60%', memorytrend: 'Stable', diskio: 'Moderate', status: 'Analyzed' };
      }),
  },
  "/it/analytics/security": {
    ui: 5,
    title: "Security Analytics", description: "Geographic map of blocked IPs and vulnerability trend lines.",
    stats: [{ label: "Attacks Blocked", color: "text-emerald-400", value: "12.4k" }, { label: "Top Source Country", color: "text-amber-400", value: "Russia/China" }, { label: "Malware Found", color: "text-green-500", value: "0" }],
    columns: [["Threat Source", "threatsource"], ["Attack Vector", "attackvector"], ["Events (7d)", "events7d"], ["Severity Trend", "severitytrend"], ["Mitigation", "mitigation"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { threatsource: 'Botnet (IP ' + i + ')', attackvector: 'DDoS Attempt', events7d: (1500 - i * 200).toString(), severitytrend: 'Decreasing', mitigation: 'WAF Block', status: 'Analyzed' };
      }),
  },
  "/it/analytics/users": {
    ui: 5,
    title: "User Analytics", description: "Identifying peak usage hours to schedule maintenance windows.",
    stats: [{ label: "Peak Hour", color: "text-blue-400", value: "10:00 - 11:00 AM" }, { label: "Max Concurrent", color: "text-amber-400", value: "1,250" }, { label: "Night Shift Users", color: "text-emerald-400", value: "150" }],
    columns: [["Time Window", "timewindow"], ["Active Users", "activeusers"], ["Transactions/Sec", "transactionssec"], ["Most Active Dept", "mostactivedept"], ["Concurrent Max", "concurrentmax"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { timewindow: (8 + i) + ':00 - ' + (9 + i) + ':00', activeusers: (500 + i * 150).toString(), transactionssec: (120 + i * 20).toString(), mostactivedept: 'OPD / Billing', concurrentmax: (600 + i * 100).toString(), status: 'Analyzed' };
      }),
  },
  "/it/application/api": {
    ui: 5,
    title: "API Health", description: "Internal microservices and external API endpoint monitoring.",
    stats: [{ label: "Total Endpoints", color: "text-blue-400", value: "124" }, { label: "API Uptime", color: "text-emerald-400", value: "100%" }, { label: "Slow Endpoints", color: "text-amber-400", value: "2" }],
    columns: [["Endpoint", "endpoint"], ["Method", "method"], ["Avg Latency", "avglatency"], ["Success Rate", "successrate"], ["Throughput", "throughput"]],
    badge: ["Status", "status", {"Degraded":"amber","Optimal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { endpoint: '/api/v1/patients', method: 'GET', avglatency: i === 0 ? '850ms' : '45ms', successrate: '99.9%', throughput: '120 req/s', status: i === 0 ? 'Degraded' : 'Optimal' };
      }),
  },
  "/it/application/erp": {
    ui: 5,
    title: "ERP Health", description: "Core Hospital Information System (HIS) application availability and response times.",
    stats: [{ label: "Overall App Health", color: "text-emerald-400", value: "99.9%" }, { label: "Avg Latency", color: "text-blue-400", value: "120ms" }, { label: "Errors (1h)", color: "text-amber-400", value: "4" }],
    columns: [["Module", "module"], ["Node", "node"], ["Uptime", "uptime"], ["Avg Response", "avgresponse"], ["Active Users", "activeusers"]],
    badge: ["Status", "status", {"Healthy":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { module: ['Billing', 'EMR', 'Pharmacy', 'Inventory', 'Lab'][i], node: 'Node-' + (1 + i), uptime: '99.9%', avgresponse: '110ms', activeusers: (150 - i * 10).toString(), status: 'Healthy' };
      }),
  },
  "/it/application/jobs": {
    ui: 5,
    title: "Scheduled Jobs", description: "Cron jobs and scheduled tasks (e.g., Daily End-of-Day billing aggregation).",
    stats: [{ label: "Active Jobs", color: "text-blue-400", value: "45" }, { label: "Failed Jobs", color: "text-red-400", value: "1" }, { label: "Success Rate", color: "text-emerald-400", value: "98%" }],
    columns: [["Job Name", "jobname"], ["Schedule", "schedule"], ["Last Run", "lastrun"], ["Duration", "duration"], ["Next Run", "nextrun"]],
    badge: ["Status", "status", {"Failed":"red","Success":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { jobname: 'EOD_Billing_Sync', schedule: '00:00 Daily', lastrun: 'Today 00:00', duration: '15 Mins', nextrun: 'Tmrw 00:00', status: i === 0 ? 'Failed' : 'Success' };
      }),
  },
  "/it/application/queue": {
    ui: 5,
    title: "Queue Services", description: "Redis/RabbitMQ message queues for async tasks (e.g., sending SMS, PDF generation).",
    stats: [{ label: "Total Queued", color: "text-blue-400", value: "1,200" }, { label: "Processing Speed", color: "text-emerald-400", value: "450/s" }, { label: "Dead Letter Queue", color: "text-red-400", value: "12" }],
    columns: [["Queue Name", "queuename"], ["Pending Msgs", "pendingmsgs"], ["Processing Rate", "processingrate"], ["Failed Msgs", "failedmsgs"], ["Consumers", "consumers"]],
    badge: ["Status", "status", {"Healthy":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { queuename: ['sms_queue', 'email_queue', 'pdf_gen', 'hl7_sync', 'analytics'][i], pendingmsgs: i === 0 ? '45' : '0', processingrate: '50/s', failedmsgs: '0', consumers: '4', status: 'Healthy' };
      }),
  },
  "/it/application/restart": {
    ui: 5,
    title: "Service Restart", description: "Authorized administrative panel to restart specific application pools or services.",
    stats: [{ label: "Restarts (24h)", color: "text-amber-400", value: "2" }, { label: "Pending Requests", color: "text-emerald-400", value: "0" }, { label: "Unauthorized Attempts", color: "text-emerald-400", value: "0" }],
    columns: [["Service/App Pool", "serviceapppool"], ["Node", "node"], ["Last Restarted", "lastrestarted"], ["Restarted By", "restartedby"], ["Reason", "reason"]],
    badge: ["Action", "action", {"Restart Now":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { serviceapppool: 'Billing Web API', node: 'App-Node-1', lastrestarted: 'Yesterday', restartedby: 'SysAdmin', reason: 'High Memory', action: 'Restart Now' };
      }),
  },
  "/it/application/services": {
    ui: 5,
    title: "Background Services", description: "Systemd or Windows services running critical background modules.",
    stats: [{ label: "Total Services", color: "text-blue-400", value: "85" }, { label: "Services Stopped", color: "text-emerald-400", value: "0" }, { label: "Frequent Restarts", color: "text-amber-400", value: "1" }],
    columns: [["Service Name", "servicename"], ["PID", "pid"], ["Memory Used", "memoryused"], ["Uptime", "uptime"], ["Restart Count", "restartcount"]],
    badge: ["Status", "status", {"Running":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { servicename: 'lis-interface-svc', pid: (1234 + i).toString(), memoryused: '256 MB', uptime: '14 Days', restartcount: i === 0 ? '5' : '0', status: 'Running' };
      }),
  },
  "/it/application/web": {
    ui: 5,
    title: "Web Server Status", description: "NGINX/Apache metrics, active connections, and SSL validity.",
    stats: [{ label: "Global Requests/s", color: "text-blue-400", value: "1,240" }, { label: "Error Rate", color: "text-emerald-400", value: "0.01%" }, { label: "SSL Expiring", color: "text-green-500", value: "0" }],
    columns: [["Server", "server"], ["Active Conns", "activeconns"], ["Requests/Sec", "requestssec"], ["5xx Errors", "5xxerrors"], ["SSL Expiry", "sslexpiry"]],
    badge: ["Status", "status", {"Running":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { server: 'Web-0' + (1 + i), activeconns: (300 + i * 50).toString(), requestssec: '450', '5xxerrors': i === 0 ? '2' : '0', sslexpiry: 'Dec 2026', status: 'Running' };
      }),
  },
  "/it/backup/automatic": {
    ui: 5,
    title: "Automatic Backup", description: "Policies and logs for automated daily/weekly backups of codebase and files.",
    stats: [{ label: "Total Jobs", color: "text-blue-400", value: "15" }, { label: "Success Rate", color: "text-emerald-400", value: "100%" }, { label: "Storage Used", color: "text-amber-400", value: "12 TB" }],
    columns: [["Backup Job", "backupjob"], ["Schedule", "schedule"], ["Destination", "destination"], ["Last Run", "lastrun"], ["Size", "size"]],
    badge: ["Status", "status", {"Success":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { backupjob: 'App Codebase ' + i, schedule: 'Daily 01:00', destination: 'S3 / NAS', lastrun: 'Today', size: '4.5 GB', status: 'Success' };
      }),
  },
  "/it/backup/dr": {
    ui: 5,
    title: "Disaster Recovery", description: "DR drill logs, RTO/RPO metrics, and failover site status.",
    stats: [{ label: "Current RPO", color: "text-emerald-400", value: "15 Mins" }, { label: "Target RPO", color: "text-blue-400", value: "30 Mins" }, { label: "DR Drills (YTD)", color: "text-emerald-400", value: "2" }],
    columns: [["DR Site", "drsite"], ["Sync Status", "syncstatus"], ["RPO Lag", "rpolag"], ["Last Failover Test", "lastfailovertest"], ["Readiness Score", "readinessscore"]],
    badge: ["Status", "status", {"Ready":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { drsite: 'Cloud Region B', syncstatus: 'Syncing', rpolag: '10 Mins', lastfailovertest: 'Oct 2025', readinessscore: '98%', status: 'Ready' };
      }),
  },
  "/it/backup/manual": {
    ui: 5,
    title: "Manual Backup", description: "Triggering one-off backups before major software upgrades or patches.",
    stats: [{ label: "Manual Runs (Mo)", color: "text-blue-400", value: "4" }, { label: "Avg Duration", color: "text-emerald-400", value: "15 Mins" }, { label: "Failed Runs", color: "text-green-500", value: "0" }],
    columns: [["Task ID", "taskid"], ["Target System", "targetsystem"], ["Triggered By", "triggeredby"], ["Start Time", "starttime"], ["Duration", "duration"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { taskid: 'MN-' + (1001 + i), targetsystem: 'ERP v2', triggeredby: 'SysAdmin', starttime: 'Yesterday 14:00', duration: '12 Mins', status: 'Completed' };
      }),
  },
  "/it/backup/restore": {
    ui: 5,
    title: "Restore Backup", description: "Logs and test workflows for file or server restorations.",
    stats: [{ label: "Files Restored (Mo)", color: "text-blue-400", value: "12" }, { label: "Full Server Restore", color: "text-emerald-400", value: "0" }, { label: "Avg Time", color: "text-amber-400", value: "45 Mins" }],
    columns: [["Restore ID", "restoreid"], ["Target Server", "targetserver"], ["Backup Date", "backupdate"], ["Requested By", "requestedby"], ["Completion", "completion"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { restoreid: 'RES-' + (2001 + i), targetserver: 'File Server 1', backupdate: '01 Jan 2026', requestedby: 'HR Dept', completion: '30 Mins', status: 'Completed' };
      }),
  },
  "/it/backup/schedule": {
    ui: 5,
    title: "Backup Schedule", description: "Configuration matrix for GFS (Grandfather-Father-Son) backup retention policies.",
    stats: [{ label: "Active Policies", color: "text-blue-400", value: "5" }, { label: "Storage Cost (Mo)", color: "text-amber-400", value: "$1,200" }, { label: "Cold Storage Data", color: "text-emerald-400", value: "45 TB" }],
    columns: [["Policy Name", "policyname"], ["Retention (Days)", "retentiondays"], ["Storage Tier", "storagetier"], ["Associated Jobs", "associatedjobs"], ["Cost Est.", "costest"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { policyname: i === 0 ? 'Daily EMR' : 'Monthly Archive', retentiondays: i === 0 ? '30 Days' : '7 Years', storagetier: i === 0 ? 'Standard Cloud' : 'Glacier/Tape', associatedjobs: '4', costest: '$150', status: 'Active' };
      }),
  },
  "/it/backup/verification": {
    ui: 5,
    title: "Backup Verification", description: "Automated checks to ensure backup files are not corrupt and can be mounted.",
    stats: [{ label: "Backups Verified", color: "text-emerald-400", value: "120/120" }, { label: "Corrupt Files", color: "text-green-500", value: "0" }, { label: "Verification Coverage", color: "text-blue-400", value: "100%" }],
    columns: [["Verification ID", "verificationid"], ["Backup File", "backupfile"], ["Checksum Status", "checksumstatus"], ["Mount Test", "mounttest"], ["Tested On", "testedon"]],
    badge: ["Status", "status", {"Verified":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { verificationid: 'VER-' + (3001 + i), backupfile: 'DB_Full_Jan01', checksumstatus: 'Match', mounttest: 'Passed', testedon: '02 Jan 2026', status: 'Verified' };
      }),
  },
  "/it/compliance/access": {
    ui: 5,
    title: "Access Audit", description: "Periodic review of user permissions (e.g., Do terminated employees still have access?).",
    stats: [{ label: "Access Reviews", color: "text-blue-400", value: "Quarterly" }, { label: "Stale Accounts", color: "text-amber-400", value: "4" }, { label: "100% Compliant", color: "text-emerald-400", value: "Yes" }],
    columns: [["Review Cycle", "reviewcycle"], ["Department", "department"], ["Accounts Reviewed", "accountsreviewed"], ["Stale Found", "stalefound"], ["Action Taken", "actiontaken"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reviewcycle: 'Q1 2026', department: 'Cardiology', accountsreviewed: '45', stalefound: i === 0 ? '2' : '0', actiontaken: i === 0 ? 'Access Revoked' : '-', status: 'Completed' };
      }),
  },
  "/it/compliance/audit": {
    ui: 5,
    title: "Audit Compliance", description: "Tracking internal IT audits (ISO 27001) and gap closures.",
    stats: [{ label: "Major NCs", color: "text-green-500", value: "0" }, { label: "Minor NCs", color: "text-amber-400", value: "4" }, { label: "Actions Closed", color: "text-emerald-400", value: "12" }],
    columns: [["Audit Topic", "audittopic"], ["Auditor", "auditor"], ["Non-Conformities", "nonconformities"], ["Corrective Action", "correctiveaction"], ["Target Closure", "targetclosure"]],
    badge: ["Status", "status", {"Action Required":"amber","Pass":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { audittopic: 'Access Control', auditor: 'External Firm', nonconformities: i === 0 ? '1 Minor' : '0', correctiveaction: i === 0 ? 'Revoke stale accounts' : 'N/A', targetclosure: 'Next Week', status: i === 0 ? 'Action Required' : 'Pass' };
      }),
  },
  "/it/compliance/hipaa": {
    ui: 5,
    title: "HIPAA Compliance", description: "Checklists ensuring ePHI is encrypted at rest and in transit.",
    stats: [{ label: "Compliance Score", color: "text-emerald-400", value: "100%" }, { label: "Open Findings", color: "text-green-500", value: "0" }, { label: "Next Audit Due", color: "text-blue-400", value: "Dec 2026" }],
    columns: [["Control Requirement", "controlrequirement"], ["Implementation", "implementation"], ["Last Audited", "lastaudited"], ["Findings", "findings"], ["Evidence Links", "evidencelinks"]],
    badge: ["Status", "status", {"Compliant":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { controlrequirement: 'Encryption at Rest (DB)', implementation: 'AES-256', lastaudited: 'Jan 2026', findings: 'None', evidencelinks: 'View Report', status: 'Compliant' };
      }),
  },
  "/it/compliance/nabh": {
    ui: 5,
    title: "NABH IT Compliance", description: "Hospital accreditation board IT standards mapping (India).",
    stats: [{ label: "Standard Met", color: "text-emerald-400", value: "95%" }, { label: "Gaps Identified", color: "text-amber-400", value: "2" }, { label: "Assessment Date", color: "text-blue-400", value: "Nov 2026" }],
    columns: [["NABH Standard", "nabhstandard"], ["Clause", "clause"], ["IT Mapping", "itmapping"], ["Document Proof", "documentproof"], ["Internal Score", "internalscore"]],
    badge: ["Status", "status", {"Compliant":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { nabhstandard: 'Information Management', clause: 'IMS.1', itmapping: 'EMR Data Integrity', documentproof: 'SOP Document', internalscore: '10/10', status: 'Compliant' };
      }),
  },
  "/it/compliance/privacy": {
    ui: 5,
    title: "Data Privacy", description: "GDPR / DPDP (India) compliance for patient data anonymization and consent management.",
    stats: [{ label: "Data Deletion Req", color: "text-amber-400", value: "5" }, { label: "Consent Revoked", color: "text-blue-400", value: "12" }, { label: "SLA Breaches", color: "text-emerald-400", value: "0" }],
    columns: [["Privacy Request", "privacyrequest"], ["Patient ID", "patientid"], ["Request Type", "requesttype"], ["Received Date", "receiveddate"], ["SLA (Days)", "sladays"]],
    badge: ["Status", "status", {"Processing":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { privacyrequest: 'PRQ-' + (1001 + i), patientid: 'PT-987' + i, requesttype: 'Data Export', receiveddate: 'Yesterday', sla: '30 Days', status: 'Processing' };
      }),
  },
  "/it/database/backup": {
    ui: 5,
    title: "Database Backup", description: "Logs of automated and manual database dumps to secure storage.",
    stats: [{ label: "Last Full Backup", color: "text-blue-400", value: "Today 02:00" }, { label: "Storage Consumed", color: "text-emerald-400", value: "4.5 TB" }, { label: "Failed Backups", color: "text-green-500", value: "0" }],
    columns: [["Backup ID", "backupid"], ["Database", "database"], ["Type", "type"], ["Size", "size"], ["Duration", "duration"]],
    badge: ["Status", "status", {"Success":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { backupid: 'BK-' + (1001 + i), database: 'HIS_Main', type: i === 0 ? 'Full' : 'Incremental', size: i === 0 ? '120 GB' : '5 GB', duration: i === 0 ? '45 Mins' : '2 Mins', status: 'Success' };
      }),
  },
  "/it/database/dashboard": {
    ui: 5,
    title: "Database Dashboard", description: "High-level metrics of database clusters, queries/sec, and storage.",
    stats: [{ label: "Total Queries/s", color: "text-blue-400", value: "4,500" }, { label: "Active Conns", color: "text-emerald-400", value: "850" }, { label: "Slow Queries", color: "text-amber-400", value: "12" }],
    columns: [["Cluster", "cluster"], ["Role", "role"], ["QPS", "qps"], ["Connections", "connections"], ["Storage Used", "storageused"]],
    badge: ["Status", "status", {"Healthy":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { cluster: 'Postgres-Main', role: i === 0 ? 'Master' : 'Read-Replica', qps: (1500 - i * 200).toString(), connections: '150', storageused: '1.2 TB', status: 'Healthy' };
      }),
  },
  "/it/database/logs": {
    ui: 5,
    title: "Database Logs", description: "Error logs, slow query logs, and audit logs of database configuration changes.",
    stats: [{ label: "Errors (24h)", color: "text-amber-400", value: "12" }, { label: "Fatal Errors", color: "text-emerald-400", value: "0" }, { label: "Log Size (Day)", color: "text-blue-400", value: "1.2 GB" }],
    columns: [["Timestamp", "timestamp"], ["Log Level", "loglevel"], ["Message", "message"], ["User/Process", "userprocess"], ["Database", "database"]],
    badge: ["Action", "action", {"View":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { timestamp: '10:00 AM', loglevel: i === 0 ? 'WARNING' : 'INFO', message: 'Connection timeout', userprocess: 'AppServer', database: 'HIS_Main', action: 'View' };
      }),
  },
  "/it/database/performance": {
    ui: 5,
    title: "Database Performance", description: "Deep dive into index usage, cache hit ratios, and lock waits.",
    stats: [{ label: "Cache Hit Ratio", color: "text-emerald-400", value: "99.5%" }, { label: "Deadlocks", color: "text-green-500", value: "0" }, { label: "Index Usage", color: "text-blue-400", value: "94%" }],
    columns: [["Metric", "metric"], ["Value", "value"], ["Trend", "trend"], ["Threshold", "threshold"], ["Last Alert", "lastalert"]],
    badge: ["Status", "status", {"Optimal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['Cache Hit Ratio', 'Index Hit Rate', 'Deadlocks/hr', 'Long Running TX', 'Connection Usage'];
        return { metric: metrics[i], value: '99%', trend: 'Stable', threshold: '> 95%', lastalert: '-', status: 'Optimal' };
      }),
  },
  "/it/database/replication": {
    ui: 5,
    title: "Replication Status", description: "Monitoring sync lag between Master and High Availability (HA) read-replicas.",
    stats: [{ label: "Max Lag", color: "text-emerald-400", value: "0.2s" }, { label: "Active Replicas", color: "text-blue-400", value: "3" }, { label: "Replication Errors", color: "text-green-500", value: "0" }],
    columns: [["Replica Node", "replicanode"], ["Sync Type", "synctype"], ["Replication Lag", "replicationlag"], ["State", "state"], ["Last Sync", "lastsync"]],
    badge: ["Status", "status", {"Healthy":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { replicanode: 'Node-Rep-' + (1 + i), synctype: 'Streaming', replicationlag: '0.05s', state: 'Streaming', lastsync: 'Just Now', status: 'Healthy' };
      }),
  },
  "/it/database/restore": {
    ui: 5,
    title: "Database Restore", description: "Audited workflows for restoring databases to sandbox/staging or production rollback.",
    stats: [{ label: "Restores (Mo)", color: "text-blue-400", value: "4" }, { label: "Avg Restore Time", color: "text-emerald-400", value: "2.5 Hrs" }, { label: "Prod Rollbacks", color: "text-green-500", value: "0" }],
    columns: [["Restore ID", "restoreid"], ["Target Env", "targetenv"], ["Source Backup", "sourcebackup"], ["Requested By", "requestedby"], ["Completion Time", "completiontime"]],
    badge: ["Status", "status", {"Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { restoreid: 'RST-' + (2001 + i), targetenv: 'Staging Env', sourcebackup: 'BK-100' + i, requestedby: 'Dev Team', completiontime: '2 Hrs', status: 'Completed' };
      }),
  },
  "/it/devices/biometric": {
    ui: 5,
    title: "Biometric Devices", description: "Fingerprint/Face scanners for staff attendance and access control.",
    stats: [{ label: "Total Devices", color: "text-blue-400", value: "34" }, { label: "Offline Devices", color: "text-emerald-400", value: "0" }, { label: "Sync Errors", color: "text-emerald-400", value: "0" }],
    columns: [["Device ID", "deviceid"], ["Location", "location"], ["Model", "model"], ["Sync Status", "syncstatus"], ["Stored Templates", "storedtemplates"]],
    badge: ["Status", "status", {"Online":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { deviceid: 'BIO-' + (4001 + i), location: 'Main Entrance', model: 'ZK Teco', syncstatus: 'Synced', storedtemplates: '1,240', status: 'Online' };
      }),
  },
  "/it/devices/desktops": {
    ui: 5,
    title: "Desktop Management", description: "Inventory of PCs, MAC addresses, OS versions, and assigned departments.",
    stats: [{ label: "Total Desktops", color: "text-blue-400", value: "850" }, { label: "Online Now", color: "text-emerald-400", value: "720" }, { label: "Needs OS Update", color: "text-amber-400", value: "45" }],
    columns: [["Asset Tag", "assettag"], ["Hostname", "hostname"], ["Department", "department"], ["OS Version", "osversion"], ["Last Seen", "lastseen"]],
    badge: ["Status", "status", {"Update Pending":"amber","Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { assettag: 'IT-PC-' + (1001 + i), hostname: 'OPD-Desk-' + i, department: 'OPD', osversion: 'Win 11 Pro', lastseen: '10 Mins Ago', status: i === 0 ? 'Update Pending' : 'Active' };
      }),
  },
  "/it/devices/medical": {
    ui: 5,
    title: "Medical Devices (IoT)", description: "Network-connected clinical devices (Monitors, Ventilators) sending data to HIS.",
    stats: [{ label: "Connected Devices", color: "text-blue-400", value: "450" }, { label: "Data Syncing", color: "text-emerald-400", value: "445" }, { label: "Connection Drops", color: "text-amber-400", value: "5" }],
    columns: [["Device MAC", "devicemac"], ["Modality/Type", "modalitytype"], ["Ward", "ward"], ["Integration Status", "integrationstatus"], ["Data Packets", "datapackets"]],
    badge: ["Status", "status", {"Healthy":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { devicemac: 'AA:BB:CC:00:11:0' + i, modalitytype: 'Patient Monitor', ward: 'ICU Bed ' + (1 + i), integrationstatus: 'HL7 Out', datapackets: '45/min', status: 'Healthy' };
      }),
  },
  "/it/devices/mobile": {
    ui: 5,
    title: "Mobile Devices", description: "Mobile Device Management (MDM) for corporate-issued phones to doctors/staff.",
    stats: [{ label: "Managed Devices", color: "text-blue-400", value: "120" }, { label: "Non-Compliant", color: "text-red-400", value: "2" }, { label: "Remote Wipes (YTD)", color: "text-emerald-400", value: "1" }],
    columns: [["Device IMEI", "deviceimei"], ["Assigned To", "assignedto"], ["Model", "model"], ["MDM Enrolled", "mdmenrolled"], ["Compliance", "compliance"]],
    badge: ["Status", "status", {"Locked":"red","Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { deviceimei: '8643210' + i, assignedto: 'Dr. Smith', model: 'iPhone 13', mdmenrolled: 'Yes', compliance: i === 0 ? 'Jailbroken' : 'Compliant', status: i === 0 ? 'Locked' : 'Active' };
      }),
  },
  "/it/devices/printers": {
    ui: 5,
    title: "Printers", description: "Network printers, label printers (Lab/Pharmacy), and toner level monitoring.",
    stats: [{ label: "Total Printers", color: "text-blue-400", value: "120" }, { label: "Low Toner", color: "text-amber-400", value: "8" }, { label: "Paper Jam Errors", color: "text-red-400", value: "2" }],
    columns: [["Printer IP", "printerip"], ["Location", "location"], ["Type", "type"], ["Pages Printed", "pagesprinted"], ["Toner Level", "tonerlevel"]],
    badge: ["Status", "status", {"Replace Toner":"red","Online":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { printerip: '10.0.5.' + i, location: 'Billing Desk ' + i, type: 'LaserJet', pagesprinted: (15000 + i * 1000).toString(), tonerlevel: i === 0 ? '5%' : '65%', status: i === 0 ? 'Replace Toner' : 'Online' };
      }),
  },
  "/it/devices/scanners": {
    ui: 5,
    title: "Barcode Scanners", description: "Pharmacy and lab barcode scanners tracking.",
    stats: [{ label: "Total Scanners", color: "text-blue-400", value: "240" }, { label: "Faulty", color: "text-red-400", value: "2" }, { label: "Battery Low (BT)", color: "text-amber-400", value: "5" }],
    columns: [["Scanner ID", "scannerid"], ["Type (Wired/BT)", "typewiredbt"], ["Department", "department"], ["Associated PC", "associatedpc"], ["Last Ping", "lastping"]],
    badge: ["Status", "status", {"Low Battery":"amber","Optimal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { scannerid: 'SCN-' + (3001 + i), typewiredbt: i === 0 ? 'Bluetooth' : 'Wired', department: 'Pharmacy', associatedpc: 'PHRM-PC-1', lastping: 'Active', status: i === 0 ? 'Low Battery' : 'Optimal' };
      }),
  },
  "/it/devices/tablets": {
    ui: 5,
    title: "Tablets", description: "iPads/Tablets used by nurses for bedside EMR documentation.",
    stats: [{ label: "Total Tablets", color: "text-blue-400", value: "145" }, { label: "In Repair", color: "text-amber-400", value: "4" }, { label: "App Up to Date", color: "text-emerald-400", value: "100%" }],
    columns: [["Asset Tag", "assettag"], ["Ward Assigned", "wardassigned"], ["Battery Health", "batteryhealth"], ["App Version", "appversion"], ["Last Sync", "lastsync"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { assettag: 'IT-TAB-' + (2001 + i), wardassigned: 'ICU', batteryhealth: (95 - i * 5) + '%', appversion: 'v4.2.1', lastsync: 'Just Now', status: 'Active' };
      }),
  },
  "/it/infrastructure/datacenter": {
    ui: 5,
    title: "Data Center Health", description: "Environment variables like temperature and humidity in server rooms.",
    stats: [{ label: "Avg Temp", color: "text-blue-400", value: "21°C" }, { label: "Cooling Units", color: "text-emerald-400", value: "Active" }, { label: "Alerts", color: "text-green-500", value: "0" }],
    columns: [["Sensor Location", "sensorlocation"], ["Temperature", "temperature"], ["Humidity", "humidity"], ["Water Leak", "waterleak"], ["Door Access", "dooraccess"]],
    badge: ["Status", "status", {"Optimal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { sensorlocation: 'Rack ' + (1 + i), temperature: '21.5°C', humidity: '45%', waterleak: 'None', dooraccess: 'Locked', status: 'Optimal' };
      }),
  },
  "/it/infrastructure/disk": {
    ui: 5,
    title: "Disk Usage", description: "Storage capacity planning and alerts for almost-full drives.",
    stats: [{ label: "Total Storage", color: "text-blue-400", value: "150 TB" }, { label: "Used Storage", color: "text-amber-400", value: "110 TB" }, { label: "Critical Drives", color: "text-red-400", value: "1" }],
    columns: [["Drive/Mount", "drivemount"], ["Server", "server"], ["Total Space", "totalspace"], ["Used Space", "usedspace"], ["Free Space", "freespace"]],
    badge: ["Status", "status", {"Critical":"red","Normal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { drivemount: '/data', server: 'SRV-DB-' + (1 + i), totalspace: '10 TB', usedspace: i === 0 ? '9.5 TB' : '4 TB', freespace: i === 0 ? '0.5 TB' : '6 TB', status: i === 0 ? 'Critical' : 'Normal' };
      }),
  },
  "/it/infrastructure/internet": {
    ui: 5,
    title: "Internet Status", description: "ISP link monitoring, failover status, and bandwidth utilization.",
    stats: [{ label: "Primary Link", color: "text-emerald-400", value: "Active" }, { label: "Total Bandwidth", color: "text-blue-400", value: "1 Gbps" }, { label: "Uptime (Mo)", color: "text-emerald-400", value: "99.9%" }],
    columns: [["ISP Link", "isplink"], ["Bandwidth", "bandwidth"], ["Current Load", "currentload"], ["Latency", "latency"], ["Failover Status", "failoverstatus"]],
    badge: ["Status", "status", {"Online":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { isplink: i === 0 ? 'Primary (Airtel)' : 'Secondary (Jio)', bandwidth: '500 Mbps', currentload: i === 0 ? '350 Mbps' : 'Idle', latency: '15ms', failoverstatus: i === 0 ? 'Active' : 'Standby', status: 'Online' };
      }),
  },
  "/it/infrastructure/network": {
    ui: 5,
    title: "Network Monitoring", description: "Switch, router, and firewall throughput and latency tracking.",
    stats: [{ label: "Network Health", color: "text-emerald-400", value: "99.9%" }, { label: "Avg Latency", color: "text-blue-400", value: "2ms" }, { label: "Packet Drops", color: "text-emerald-400", value: "0.01%" }],
    columns: [["Device Name", "devicename"], ["IP/Subnet", "ipsubnet"], ["Throughput", "throughput"], ["Packet Loss", "packetloss"], ["Active Conns", "activeconns"]],
    badge: ["Status", "status", {"Healthy":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { devicename: 'Core-Switch-' + (1 + i), ipsubnet: '10.0.0.1', throughput: '1.2 Gbps', packetloss: '0%', activeconns: '4500', status: 'Healthy' };
      }),
  },
  "/it/infrastructure/server": {
    ui: 5,
    title: "Server Monitoring", description: "Health status, uptime, and availability of physical and virtual servers.",
    stats: [{ label: "Total Servers", color: "text-blue-400", value: "45" }, { label: "Servers Online", color: "text-emerald-400", value: "44" }, { label: "Servers Down", color: "text-red-400", value: "1" }],
    columns: [["Server Name", "servername"], ["IP Address", "ipaddress"], ["Role/Service", "roleservice"], ["Uptime", "uptime"], ["Ping Status", "pingstatus"], ["Health Status", "healthstatus"]],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { servername: 'SRV-APP-' + (1 + i), ipaddress: '10.0.1.' + (10 + i), roleservice: i === 0 ? 'Web Server' : 'App Server', uptime: '99.9%', pingstatus: i === 4 ? 'No Response' : '<5ms', healthstatus: i === 4 ? 'Offline' : 'Healthy' };
      }),
  },
  "/it/infrastructure/ups": {
    ui: 5,
    title: "UPS Monitoring", description: "Uninterruptible Power Supply loads and battery health in server rooms.",
    stats: [{ label: "Total UPS Load", color: "text-blue-400", value: "45 kVA" }, { label: "All Batteries", color: "text-emerald-400", value: "Healthy" }, { label: "Active on UPS", color: "text-emerald-400", value: "0" }],
    columns: [["UPS Unit", "upsunit"], ["Location", "location"], ["Current Load", "currentload"], ["Battery Level", "batterylevel"], ["Est. Runtime", "estruntime"]],
    badge: ["Status", "status", {"Normal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { upsunit: 'UPS-DC-' + (1 + i), location: 'Data Center 1', currentload: '40%', batterylevel: '100%', estruntime: '45 Mins', status: 'Normal' };
      }),
  },
  "/it/integrations/abdm": {
    ui: 5,
    title: "ABDM / ABHA", description: "Integration with India's Ayushman Bharat Digital Mission (ABDM) for health IDs.",
    stats: [{ label: "ABHA IDs Created", color: "text-blue-400", value: "120 (Today)" }, { label: "Records Linked", color: "text-emerald-400", value: "450" }, { label: "API Gateway", color: "text-emerald-400", value: "Online" }],
    columns: [["Operation", "operation"], ["Total Calls", "totalcalls"], ["Success Rate", "successrate"], ["Avg Latency", "avglatency"], ["Last Sync", "lastsync"]],
    badge: ["Status", "status", {"Optimal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { operation: ['Create ABHA', 'Verify ABHA', 'Link CareContext', 'Discover Data', 'Consent Request'][i], totalcalls: (100 + i * 10).toString(), successrate: '99%', avglatency: '200ms', lastsync: '10 Mins Ago', status: 'Optimal' };
      }),
  },
  "/it/integrations/dashboard": {
    ui: 5,
    title: "API Dashboard", description: "Overview of all third-party integrations, uptime, and request volumes.",
    stats: [{ label: "Total Integrations", color: "text-blue-400", value: "24" }, { label: "API Requests (24h)", color: "text-emerald-400", value: "1.2M" }, { label: "Failed Requests", color: "text-amber-400", value: "450" }],
    columns: [["Integration", "integration"], ["Type", "type"], ["Uptime (30d)", "uptime30d"], ["Requests (24h)", "requests24h"], ["Error Rate", "errorrate"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const integrations = ['LIS (Lab)', 'RIS (Radiology)', 'Payment Gateway', 'SMS Gateway', 'ABHA (NDHM)'];
        return { integration: integrations[i], type: 'REST API', uptime30d: '99.9%', requests24h: (10000 + i * 2000).toString(), errorrate: '0.05%', status: 'Active' };
      }),
  },
  "/it/integrations/email": {
    ui: 5,
    title: "Email Server", description: "SMTP (SendGrid, AWS SES) configuration for mass emails and transactional receipts.",
    stats: [{ label: "Emails Sent", color: "text-blue-400", value: "85,000" }, { label: "Bounce Rate", color: "text-emerald-400", value: "1.2%" }, { label: "Spam Rate", color: "text-emerald-400", value: "0.01%" }],
    columns: [["SMTP Server", "smtpserver"], ["Emails Sent (Mo)", "emailssentmo"], ["Bounce Rate", "bouncerate"], ["Spam Complaints", "spamcomplaints"], ["Domain Rep.", "domainrep"]],
    badge: ["Status", "status", {"Healthy":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { smtpserver: 'AWS SES', emailssentmo: '45,000', bouncerate: '1.2%', spamcomplaints: '4', domainrep: 'Good', status: 'Healthy' };
      }),
  },
  "/it/integrations/fhir": {
    ui: 5,
    title: "FHIR Integration", description: "Modern Fast Healthcare Interoperability Resources (FHIR) API monitoring.",
    stats: [{ label: "FHIR Resources", color: "text-blue-400", value: "12" }, { label: "Avg Response", color: "text-emerald-400", value: "45ms" }, { label: "Sync Errors", color: "text-green-500", value: "0" }],
    columns: [["Resource", "resource"], ["Requests (1h)", "requests1h"], ["Avg Latency", "avglatency"], ["Error Rate", "errorrate"], ["Subscribers", "subscribers"]],
    badge: ["Status", "status", {"Healthy":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const resources = ['Patient', 'Observation', 'Encounter', 'Condition', 'Medication'];
        return { resource: resources[i], requests1h: (500 - i * 50).toString(), avglatency: '35ms', errorrate: '0.01%', subscribers: '3 Apps', status: 'Healthy' };
      }),
  },
  "/it/integrations/hl7": {
    ui: 5,
    title: "HL7 Integration", description: "Monitoring legacy Health Level 7 (HL7) message queues (ADT, ORM, ORU) with clinical devices.",
    stats: [{ label: "HL7 Msgs (24h)", color: "text-blue-400", value: "45,000" }, { label: "ACK Failed", color: "text-red-400", value: "12" }, { label: "Connection Drops", color: "text-emerald-400", value: "0" }],
    columns: [["Message Type", "messagetype"], ["Source Node", "sourcenode"], ["Target Node", "targetnode"], ["Messages Queued", "messagesqueued"], ["Last Processed", "lastprocessed"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const types = ['ADT^A01 (Admit)', 'ORM^O01 (Order)', 'ORU^R01 (Result)', 'ADT^A03 (Discharge)', 'SIU^S12 (Appt)'];
        return { messagetype: types[i], sourcenode: 'HIS', targetnode: 'LIS', messagesqueued: i === 0 ? '5' : '0', lastprocessed: 'Just Now', status: 'Active' };
      }),
  },
  "/it/integrations/lis": {
    ui: 5,
    title: "LIS Integration", description: "Laboratory Information System (LIS) two-way sync for orders and results.",
    stats: [{ label: "Orders Synced", color: "text-blue-400", value: "4,500" }, { label: "Results Synced", color: "text-emerald-400", value: "4,200" }, { label: "Pending Results", color: "text-amber-400", value: "300" }],
    columns: [["Sync Type", "synctype"], ["Orders Sent", "orderssent"], ["Results Received", "resultsreceived"], ["Pending Sync", "pendingsync"], ["Last Error", "lasterror"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { synctype: i === 0 ? 'Outbound (Orders)' : 'Inbound (Results)', orderssent: (1000 - i * 100).toString(), resultsreceived: (900 - i * 100).toString(), pendingsync: i === 0 ? '12' : '0', lasterror: '-', status: 'Active' };
      }),
  },
  "/it/integrations/logs": {
    ui: 5,
    title: "API Logs", description: "Detailed request/response payloads for debugging integration failures.",
    stats: [{ label: "Total Logs (24h)", color: "text-blue-400", value: "1.2M" }, { label: "4xx Errors", color: "text-amber-400", value: "1,200" }, { label: "5xx Errors", color: "text-red-400", value: "12" }],
    columns: [["Timestamp", "timestamp"], ["Endpoint", "endpoint"], ["Method", "method"], ["Response Code", "responsecode"], ["Latency", "latency"]],
    badge: ["Action", "action", {"View Payload":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { timestamp: '10:05 AM', endpoint: '/api/v1/sync', method: 'POST', responsecode: i === 0 ? '500' : '200', latency: i === 0 ? '1200ms' : '45ms', action: 'View Payload' };
      }),
  },
  "/it/integrations/pacs": {
    ui: 5,
    title: "PACS Integration", description: "Picture Archiving and Communication System (PACS) DICOM viewer links.",
    stats: [{ label: "Studies (Today)", color: "text-blue-400", value: "450" }, { label: "Storage Growth", color: "text-amber-400", value: "+12GB" }, { label: "PACS Gateway", color: "text-emerald-400", value: "Online" }],
    columns: [["Modality Node", "modalitynode"], ["Studies Pushed", "studiespushed"], ["Storage Used", "storageused"], ["Viewer Active Conns", "vieweractiveconns"], ["Last Ping", "lastping"]],
    badge: ["Status", "status", {"Healthy":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { modalitynode: 'DICOM_NODE_' + (1 + i), studiespushed: (50 - i * 5).toString(), storageused: (100 - i * 10) + ' GB', vieweractiveconns: (10 - i).toString(), lastping: '1 Min Ago', status: 'Healthy' };
      }),
  },
  "/it/integrations/payment": {
    ui: 5,
    title: "Payment Gateway", description: "Stripe, Razorpay, or local banking integrations for online billing.",
    stats: [{ label: "Total Online Txn", color: "text-blue-400", value: "$45,000" }, { label: "Success Rate", color: "text-emerald-400", value: "98%" }, { label: "Failed Txn", color: "text-red-400", value: "12" }],
    columns: [["Gateway", "gateway"], ["Txn Count (24h)", "txncount24h"], ["Success Rate", "successrate"], ["Refunds Processing", "refundsprocessing"], ["Total Value", "totalvalue"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { gateway: i === 0 ? 'Razorpay' : 'Stripe', txncount24h: (450 - i * 50).toString(), successrate: '98%', refundsprocessing: (5 - i).toString(), totalvalue: '$' + (20000 - i * 5000), status: 'Active' };
      }),
  },
  "/it/integrations/ris": {
    ui: 5,
    title: "RIS Integration", description: "Radiology Information System (RIS) integration for imaging orders.",
    stats: [{ label: "Total Orders", color: "text-blue-400", value: "450" }, { label: "Reports Finalized", color: "text-emerald-400", value: "400" }, { label: "Turnaround Time", color: "text-amber-400", value: "4 Hrs" }],
    columns: [["Modality", "modality"], ["Orders Sent", "orderssent"], ["Reports Received", "reportsreceived"], ["Queue Size", "queuesize"], ["Last Sync", "lastsync"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const modalities = ['MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'PET-CT'];
        return { modality: modalities[i], orderssent: (100 - i * 10).toString(), reportsreceived: (90 - i * 10).toString(), queuesize: i === 0 ? '5' : '0', lastsync: 'Just Now', status: 'Active' };
      }),
  },
  "/it/integrations/sms": {
    ui: 5,
    title: "SMS Gateway", description: "Transactional SMS routes (Twilio, Gupshup) for patient appointments and OTPs.",
    stats: [{ label: "SMS Sent (Mo)", color: "text-blue-400", value: "125,000" }, { label: "Delivery Rate", color: "text-emerald-400", value: "96%" }, { label: "Credits Exhausting", color: "text-amber-400", value: "1 Route" }],
    columns: [["Provider", "provider"], ["Route Type", "routetype"], ["SMS Sent (Mo)", "smssentmo"], ["Delivery Rate", "deliveryrate"], ["Credits Left", "creditsleft"]],
    badge: ["Status", "status", {"Low Credits":"amber","Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { provider: 'Twilio', routetype: i === 0 ? 'Transactional' : 'Promotional', smssentmo: (50000 - i * 10000).toString(), deliveryrate: '96%', creditsleft: i === 0 ? '4,500' : '120,000', status: i === 0 ? 'Low Credits' : 'Active' };
      }),
  },
  "/it/integrations/whatsapp": {
    ui: 5,
    title: "WhatsApp API", description: "WhatsApp Business API integration for automated reports and reminders.",
    stats: [{ label: "Active Users", color: "text-blue-400", value: "4,500" }, { label: "Opt-out Rate", color: "text-emerald-400", value: "0.5%" }, { label: "Quality Status", color: "text-emerald-400", value: "High" }],
    columns: [["WABA Account", "wabaaccount"], ["Messages Sent", "messagessent"], ["Read Rate", "readrate"], ["Template Approvals", "templateapprovals"], ["Quality Rating", "qualityrating"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { wabaaccount: 'Main Hospital', messagessent: '45,000', readrate: '85%', templateapprovals: '12/12 Approved', qualityrating: 'High', status: 'Active' };
      }),
  },
  "/it/logs/activity": {
    ui: 5,
    title: "Activity Logs", description: "General usage telemetry (clicks, page views) for UX analytics.",
    stats: [{ label: "Page Views (24h)", color: "text-blue-400", value: "45k" }, { label: "Most Used Module", color: "text-emerald-400", value: "OPD Queue" }, { label: "Avg Session", color: "text-blue-400", value: "14 Mins" }],
    columns: [["Timestamp", "timestamp"], ["User Role", "userrole"], ["Page Visited", "pagevisited"], ["Time Spent", "timespent"], ["Action Flow", "actionflow"]],
    badge: ["Status", "status", {"Logged":"blue"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { timestamp: '10:00 AM', userrole: 'Nurse', pagevisited: '/ipd/ward-dashboard', timespent: '4 Mins', actionflow: 'View -> Edit Vitals', status: 'Logged' };
      }),
  },
  "/it/logs/api": {
    ui: 5,
    title: "API Logs", description: "Payload logs for external integrations to resolve disputes or missing data.",
    stats: [{ label: "Total API Calls", color: "text-blue-400", value: "1.2M" }, { label: "Avg Latency", color: "text-emerald-400", value: "120ms" }, { label: "4xx Errors", color: "text-amber-400", value: "450" }],
    columns: [["Timestamp", "timestamp"], ["Endpoint", "endpoint"], ["Vendor", "vendor"], ["Status Code", "statuscode"], ["Response Time", "responsetime"]],
    badge: ["Action", "action", {"undefined":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { timestamp: 'Just Now', endpoint: '/api/sms/send', vendor: 'Twilio', statuscode: '200 OK', responsetime: '45ms', action_: 'View Body' };
      }),
  },
  "/it/logs/error": {
    ui: 5,
    title: "Error Logs", description: "Application crashes, unhandled exceptions, and stack traces.",
    stats: [{ label: "Fatal Errors", color: "text-green-500", value: "0" }, { label: "Warnings", color: "text-amber-400", value: "145" }, { label: "Unresolved", color: "text-red-400", value: "12" }],
    columns: [["Timestamp", "timestamp"], ["Error Level", "errorlevel"], ["Service", "service"], ["Error Message", "errormessage"], ["Occurrence", "occurrence"]],
    badge: ["Action", "action", {"undefined":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { timestamp: 'Yesterday', errorlevel: i === 0 ? 'ERROR' : 'WARNING', service: 'Billing API', errormessage: 'NullReferenceException', occurrence: (5 - i).toString(), action_: 'View Stack' };
      }),
  },
  "/it/logs/event": {
    ui: 5,
    title: "Event Logs", description: "System-level events (server restarts, cron job execution, backup completion).",
    stats: [{ label: "Total Events", color: "text-blue-400", value: "1,240" }, { label: "Critical Events", color: "text-green-500", value: "0" }, { label: "Cron Success", color: "text-emerald-400", value: "100%" }],
    columns: [["Timestamp", "timestamp"], ["Event Source", "eventsource"], ["Event Type", "eventtype"], ["Description", "description"], ["Severity", "severity"]],
    badge: ["Action", "action", {"undefined":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { timestamp: '01:00 AM', eventsource: 'Backup Daemon', eventtype: 'Task Completion', description: 'DB Full Backup Success', severity: 'Info', action_: 'View Details' };
      }),
  },
  "/it/logs/login": {
    ui: 5,
    title: "Login Logs", description: "Record of all successful and failed authentication attempts.",
    stats: [{ label: "Total Logins (24h)", color: "text-blue-400", value: "2,400" }, { label: "Failed Attempts", color: "text-red-400", value: "45" }, { label: "MFA Success", color: "text-emerald-400", value: "98%" }],
    columns: [["Timestamp", "timestamp"], ["User ID", "userid"], ["IP Address", "ipaddress"], ["Result", "result"], ["Browser/App", "browserapp"]],
    badge: ["Action", "action", {"undefined":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { timestamp: '08:00 AM', userid: 'EMP-' + (100 + i), ipaddress: '192.168.1.' + i, result: i === 0 ? 'Failed (Bad Password)' : 'Success', browserapp: 'Chrome', action_: 'Block IP' };
      }),
  },
  "/it/notifications/email": {
    ui: 5,
    title: "Email Notifications", description: "Monitoring outbound system emails (e.g., Reports, Resets).",
    stats: [{ label: "Emails Sent (24h)", color: "text-blue-400", value: "14.5k" }, { label: "Delivered", color: "text-emerald-400", value: "99%" }, { label: "Bounced", color: "text-red-400", value: "24" }],
    columns: [["Message ID", "messageid"], ["Recipient", "recipient"], ["Subject", "subject"], ["Sent Time", "senttime"], ["Provider Response", "providerresponse"]],
    badge: ["Status", "status", {"Bounced":"red","Delivered":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { messageid: 'MSG-' + (1001 + i), recipient: 'user' + i + '@domain.com', subject: 'Password Reset', senttime: '10:00 AM', providerresponse: '250 OK', status: i === 0 ? 'Bounced' : 'Delivered' };
      }),
  },
  "/it/notifications/push": {
    ui: 5,
    title: "Push Notifications", description: "FCM/APNS logs for hospital mobile app push alerts.",
    stats: [{ label: "Push Sent (24h)", color: "text-blue-400", value: "45k" }, { label: "Open Rate", color: "text-amber-400", value: "12%" }, { label: "Unsubscribed", color: "text-red-400", value: "5" }],
    columns: [["Push ID", "pushid"], ["Target Device", "targetdevice"], ["Payload Title", "payloadtitle"], ["Sent Time", "senttime"], ["Interaction", "interaction"]],
    badge: ["Status", "status", {"Sent":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { pushid: 'PSH-' + (4001 + i), targetdevice: 'iOS-Token-' + i, payloadtitle: 'New Result', senttime: 'Today', interaction: i === 0 ? 'Opened' : 'Ignored', status: 'Sent' };
      }),
  },
  "/it/notifications/sms": {
    ui: 5,
    title: "SMS Notifications", description: "Tracking outbound transactional SMS messages.",
    stats: [{ label: "SMS Sent (24h)", color: "text-blue-400", value: "4,500" }, { label: "DLR Received", color: "text-emerald-400", value: "95%" }, { label: "Failed Delivery", color: "text-amber-400", value: "12" }],
    columns: [["SMS ID", "smsid"], ["Phone Number", "phonenumber"], ["Message Template", "messagetemplate"], ["Sent Time", "senttime"], ["DLR Status", "dlrstatus"]],
    badge: ["Status", "status", {"Sent":"emerald","Delivered":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { smsid: 'SMS-' + (2001 + i), phonenumber: '+123456789' + i, messagetemplate: 'Appt_Reminder', senttime: 'Just Now', dlrstatus: i === 0 ? 'Pending' : 'Delivered', status: i === 0 ? 'Sent' : 'Delivered' };
      }),
  },
  "/it/notifications/whatsapp": {
    ui: 5,
    title: "WhatsApp Notifications", description: "WhatsApp API message logs for reports and telemedicine links.",
    stats: [{ label: "WA Sent (24h)", color: "text-blue-400", value: "1,200" }, { label: "Read Rate", color: "text-emerald-400", value: "85%" }, { label: "Template Rejects", color: "text-green-500", value: "0" }],
    columns: [["WA Message ID", "wamessageid"], ["Contact", "contact"], ["Template Name", "templatename"], ["Sent Time", "senttime"], ["Read Receipt", "readreceipt"]],
    badge: ["Status", "status", {"Delivered":"emerald","Read":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { wamessageid: 'WA-' + (3001 + i), contact: '+198765432' + i, templatename: 'Lab_Report_Ready', senttime: '1 Hr Ago', readreceipt: i === 0 ? 'No' : 'Yes', status: i === 0 ? 'Delivered' : 'Read' };
      }),
  },
  "/it/performance/api": {
    ui: 5,
    title: "API Performance", description: "Latency tracking for external integrations.",
    stats: [{ label: "External Avg", color: "text-blue-400", value: "240ms" }, { label: "Timeouts (1h)", color: "text-amber-400", value: "4" }, { label: "Breakers Open", color: "text-emerald-400", value: "0" }],
    columns: [["External API", "externalapi"], ["P90 Latency", "p90latency"], ["Timeout Ratio", "timeoutratio"], ["Circuit Breaker", "circuitbreaker"], ["Last Incident", "lastincident"]],
    badge: ["Status", "status", {"Healthy":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { externalapi: 'Payment Gateway', p90latency: '300ms', timeoutratio: '0.1%', circuitbreaker: 'Closed', lastincident: 'Last Month', status: 'Healthy' };
      }),
  },
  "/it/performance/database": {
    ui: 5,
    title: "Database Performance", description: "Specific deep dives into database query speeds and wait states.",
    stats: [{ label: "Avg DB Latency", color: "text-emerald-400", value: "12ms" }, { label: "Lock Wait Ratio", color: "text-emerald-400", value: "0.5%" }, { label: "Long Transactions", color: "text-amber-400", value: "2" }],
    columns: [["Query Type", "querytype"], ["Avg Exec Time", "avgexectime"], ["CPU Bound", "cpubound"], ["I/O Bound", "iobound"], ["Lock Waits", "lockwaits"]],
    badge: ["Status", "status", {"Review Query":"amber","Normal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { querytype: 'SELECT (EMR)', avgexectime: '15ms', cpubound: 'Low', iobound: 'Medium', lockwaits: i === 0 ? '2%' : '0.1%', status: i === 0 ? 'Review Query' : 'Normal' };
      }),
  },
  "/it/performance/load": {
    ui: 5,
    title: "Load Analysis", description: "Capacity planning, tracking concurrent user peaks, and autoscale events.",
    stats: [{ label: "Peak Users Today", color: "text-blue-400", value: "1,150 (11 AM)" }, { label: "Autoscale Events", color: "text-emerald-400", value: "2" }, { label: "Capacity Margin", color: "text-emerald-400", value: "40%" }],
    columns: [["Time Window", "timewindow"], ["Peak Concurrency", "peakconcurrency"], ["Servers Spun Up", "serversspunup"], ["Max CPU Hit", "maxcpuhit"], ["Bandwidth Peak", "bandwidthpeak"]],
    badge: ["Status", "status", {"Handled":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { timewindow: '10:00 - 11:00', peakconcurrency: '1,150', serversspunup: i === 0 ? '1' : '0', maxcpuhit: '82%', bandwidthpeak: '850 Mbps', status: 'Handled' };
      }),
  },
  "/it/performance/sessions": {
    ui: 5,
    title: "User Sessions", description: "Resource utilization per active user session (Memory leaks in browser apps).",
    stats: [{ label: "Avg Client Mem", color: "text-blue-400", value: "120 MB" }, { label: "Crashes Reported", color: "text-amber-400", value: "12" }, { label: "Active Clients", color: "text-emerald-400", value: "850" }],
    columns: [["User Session", "usersession"], ["Browser", "browser"], ["Client Memory", "clientmemory"], ["DOM Nodes", "domnodes"], ["JS Heap Size", "jsheapsize"]],
    badge: ["Status", "status", {"High Memory":"amber","Normal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { usersession: 'Sess-987' + i, browser: 'Chrome 120', clientmemory: i === 0 ? '850 MB' : '110 MB', domnodes: '15k', jsheapsize: '45 MB', status: i === 0 ? 'High Memory' : 'Normal' };
      }),
  },
  "/it/performance/system": {
    ui: 5,
    title: "System Performance", description: "Overall APM (Application Performance Monitoring) metrics (e.g., Datadog, NewRelic).",
    stats: [{ label: "Global Apdex", color: "text-emerald-400", value: "0.95" }, { label: "Web Transaction", color: "text-blue-400", value: "120ms" }, { label: "Service Degraded", color: "text-green-500", value: "0" }],
    columns: [["Apdex Score", "apdexscore"], ["Service", "service"], ["Avg Latency", "avglatency"], ["P99 Latency", "p99latency"], ["Error Rate", "errorrate"]],
    badge: ["Status", "status", {"Optimal":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { apdexscore: (0.98 - i * 0.02).toFixed(2), service: 'Billing Service', avglatency: (100 + i * 20) + 'ms', p99latency: (300 + i * 50) + 'ms', errorrate: '0.01%', status: 'Optimal' };
      }),
  },
  "/it/reports/api": {
    ui: 5,
    title: "API Report", description: "Integration volumes for billing vendors (e.g., SMS cost calculation).",
    stats: [{ label: "API Costs (Mo)", color: "text-blue-400", value: "$2,400" }, { label: "Most Used API", color: "text-emerald-400", value: "WhatsApp" }, { label: "Failed API %", color: "text-emerald-400", value: "0.01%" }],
    columns: [["Integration", "integration"], ["Total Calls", "totalcalls"], ["Avg Response", "avgresponse"], ["Data Transferred", "datatransferred"], ["Est Cost", "estcost"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { integration: 'Twilio SMS', totalcalls: '120k', avgresponse: '45ms', datatransferred: '1.2 GB', estcost: '$850', status: 'Generated' };
      }),
  },
  "/it/reports/assets": {
    ui: 5,
    title: "IT Asset Report", description: "Hardware inventory, depreciation value, and replacement forecasting.",
    stats: [{ label: "Total Asset Value", color: "text-blue-400", value: "$450K" }, { label: "Assets EOL (This Yr)", color: "text-red-400", value: "45" }, { label: "New Procurements", color: "text-amber-400", value: "$24K" }],
    columns: [["Asset Class", "assetclass"], ["Total Count", "totalcount"], ["In Warranty", "inwarranty"], ["End of Life (EOL)", "endoflifeeol"], ["Depreciated Value", "depreciatedvalue"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { assetclass: ['Desktops', 'Laptops', 'Servers', 'Printers', 'Scanners'][i], totalcount: (500 - i * 100).toString(), inwarranty: (400 - i * 80).toString(), endoflifeeol: (50 - i * 10).toString(), depreciatedvalue: '$' + (120000 - i * 20000), status: 'Generated' };
      }),
  },
  "/it/reports/backup": {
    ui: 5,
    title: "Backup Report", description: "Compliance report proving backups were taken and verified daily.",
    stats: [{ label: "Total Success", color: "text-emerald-400", value: "100%" }, { label: "Cloud Sync", color: "text-emerald-400", value: "Completed" }, { label: "Audit Ready", color: "text-blue-400", value: "Yes" }],
    columns: [["Week Ending", "weekending"], ["Total Backups", "totalbackups"], ["Success Rate", "successrate"], ["Verified Mounts", "verifiedmounts"], ["Storage Consumed", "storageconsumed"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { weekending: (20 - i * 7) + ' Jun 2026', totalbackups: '45', successrate: '100%', verifiedmounts: '45', storageconsumed: '1.2 TB', status: 'Generated' };
      }),
  },
  "/it/reports/database": {
    ui: 5,
    title: "Database Report", description: "Storage growth trends and index fragmentation reporting.",
    stats: [{ label: "Total DB Size", color: "text-blue-400", value: "4.5 TB" }, { label: "Growth Rate (Mo)", color: "text-amber-400", value: "+2.5%" }, { label: "Index Health", color: "text-emerald-400", value: "Good" }],
    columns: [["Database Name", "databasename"], ["Size (GB)", "sizegb"], ["MoM Growth", "momgrowth"], ["Long TX Count", "longtxcount"], ["Recommendation", "recommendation"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { databasename: 'HIS_Main_DB', sizegb: (1200 + i * 10).toString(), momgrowth: '+2%', longtxcount: '4', recommendation: 'Rebuild Indexes', status: 'Generated' };
      }),
  },
  "/it/reports/incident": {
    ui: 5,
    title: "Incident Report", description: "SLA reporting for helpdesk ticket resolution times.",
    stats: [{ label: "SLA Compliance", color: "text-emerald-400", value: "94%" }, { label: "Avg Resolution Time", color: "text-blue-400", value: "4 Hrs" }, { label: "Escalations", color: "text-amber-400", value: "12" }],
    columns: [["Month", "month"], ["Tickets Raised", "ticketsraised"], ["Resolved", "resolved"], ["SLA Breaches", "slabreaches"], ["Avg Resolution", "avgresolution"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { month: ['June', 'May', 'April', 'March', 'Feb'][i] + ' 2026', ticketsraised: (450 - i * 20).toString(), resolved: (440 - i * 20).toString(), slabreaches: (10 - i).toString(), avgresolution: '4.5 Hrs', status: 'Generated' };
      }),
  },
  "/it/reports/logins": {
    ui: 5,
    title: "User Login Report", description: "Detailed Excel/PDF export of all staff login activities and hours.",
    stats: [{ label: "Reports Generated (Mo)", color: "text-blue-400", value: "45" }, { label: "Automated Reports", color: "text-emerald-400", value: "12" }, { label: "Avg Gen Time", color: "text-blue-400", value: "4s" }],
    columns: [["Report Type", "reporttype"], ["Date Range", "daterange"], ["Department Filter", "departmentfilter"], ["Generated By", "generatedby"], ["Format", "format"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reporttype: 'Monthly Attendance Sync', daterange: 'June 2026', departmentfilter: 'All', generatedby: 'System', format: 'CSV', status: 'Generated' };
      }),
  },
  "/it/reports/performance": {
    ui: 5,
    title: "Performance Report", description: "System availability and response time reporting for management.",
    stats: [{ label: "Overall Performance", color: "text-emerald-400", value: "Excellent" }, { label: "Downtime (Mo)", color: "text-blue-400", value: "12 Mins" }, { label: "User Complaints", color: "text-emerald-400", value: "Down 15%" }],
    columns: [["Metric", "metric"], ["Current Month", "currentmonth"], ["Previous Month", "previousmonth"], ["Variance", "variance"], ["Target", "target"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { metric: 'Avg EMR Load Time', currentmonth: '1.2s', previousmonth: '1.4s', variance: '-0.2s (Better)', target: '< 1.5s', status: 'Generated' };
      }),
  },
  "/it/reports/security": {
    ui: 5,
    title: "Security Report", description: "Summary of blocked threats, phishing tests, and patching compliance.",
    stats: [{ label: "Total Threats Blocked", color: "text-blue-400", value: "1,240" }, { label: "Phishing Fails", color: "text-amber-400", value: "4%" }, { label: "Security Posture", color: "text-emerald-400", value: "Strong" }],
    columns: [["Report Type", "reporttype"], ["Threats Blocked", "threatsblocked"], ["Unpatched PCs", "unpatchedpcs"], ["Phishing Clicks", "phishingclicks"], ["Risk Score", "riskscore"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reporttype: 'Monthly Security Review', threatsblocked: '450', unpatchedpcs: '12', phishingclicks: '4', riskscore: '90/100', status: 'Generated' };
      }),
  },
  "/it/reports/server": {
    ui: 5,
    title: "Server Report", description: "Monthly uptime and hardware fault summaries for management review.",
    stats: [{ label: "YTD Uptime", color: "text-emerald-400", value: "99.98%" }, { label: "Total Incidents", color: "text-blue-400", value: "2" }, { label: "SLA Penalties", color: "text-green-500", value: "$0" }],
    columns: [["Report Month", "reportmonth"], ["Overall Uptime", "overalluptime"], ["Downtime Incidents", "downtimeincidents"], ["SLA Target", "slatarget"], ["Penalty Clause", "penaltyclause"]],
    badge: ["Status", "status", {"Generated":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { reportmonth: ['June', 'May', 'April', 'March', 'Feb'][i] + ' 2026', overalluptime: '99.9%', downtimeincidents: i === 1 ? '1' : '0', slatarget: '99.5%', penaltyclause: 'N/A', status: 'Generated' };
      }),
  },
  "/it/security/antivirus": {
    ui: 5,
    title: "Antivirus Status", description: "Centralized view of Endpoint Detection & Response (EDR) across all hospital PCs.",
    stats: [{ label: "Endpoints Protected", color: "text-emerald-400", value: "1,200" }, { label: "Outdated Definitions", color: "text-amber-400", value: "15" }, { label: "Threats Blocked", color: "text-blue-400", value: "4 (Mo)" }],
    columns: [["Hostname", "hostname"], ["Agent Version", "agentversion"], ["Last Scan", "lastscan"], ["Threats Found", "threatsfound"], ["Defs Updated", "defsupdated"]],
    badge: ["Status", "status", {"Warning":"amber","Protected":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { hostname: 'PC-OPD-' + (1 + i), agentversion: 'v10.2', lastscan: 'Yesterday', threatsfound: '0', defsupdated: i === 0 ? 'Last Week' : 'Today', status: i === 0 ? 'Warning' : 'Protected' };
      }),
  },
  "/it/security/blacklist": {
    ui: 5,
    title: "IP Blacklist", description: "Known malicious IPs or subnets permanently blocked at the edge router.",
    stats: [{ label: "Total Blocked IPs", color: "text-emerald-400", value: "1,240" }, { label: "Auto-Blocked (IDS)", color: "text-blue-400", value: "450" }, { label: "Hits on Blocklist", color: "text-amber-400", value: "14.5k (24h)" }],
    columns: [["IP / Subnet", "ipsubnet"], ["Source of Threat", "sourceofthreat"], ["Block Reason", "blockreason"], ["Added Date", "addeddate"], ["Hit Count", "hitcount"]],
    badge: ["Status", "status", {"Blocked":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { ipsubnet: '198.51.100.' + i, sourceofthreat: 'IDS Auto-block', blockreason: 'SSH Bruteforce', addeddate: 'Jan 2026', hitcount: (450 - i * 50).toString(), status: 'Blocked' };
      }),
  },
  "/it/security/dashboard": {
    ui: 5,
    title: "Security Dashboard", description: "Central view of threat alerts, firewall drops, and overall system security posture.",
    stats: [{ label: "Overall Security Score", color: "text-emerald-400", value: "92/100" }, { label: "Active Threats", color: "text-green-500", value: "0" }, { label: "Patches Pending", color: "text-amber-400", value: "4" }],
    columns: [["Security Metric", "securitymetric"], ["Current Status", "currentstatus"], ["Last Scan", "lastscan"], ["Vulnerabilities", "vulnerabilities"], ["Action Required", "actionrequired"]],
    badge: ["Status", "status", {"Secure":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const metrics = ['Firewall Status', 'Antivirus Defs', 'Intrusion Detection', 'WAF Rules', 'Endpoint Security'];
        return { securitymetric: metrics[i], currentstatus: 'Active', lastscan: '1 Hr Ago', vulnerabilities: i === 4 ? '2 Low' : '0', actionrequired: i === 4 ? 'Review' : 'None', status: 'Secure' };
      }),
  },
  "/it/security/failed-logins": {
    ui: 5,
    title: "Failed Login Attempts", description: "Audit trail of brute-force attempts on ERP, VPN, or Web portals.",
    stats: [{ label: "Failed Logins (24h)", color: "text-amber-400", value: "124" }, { label: "Accounts Locked", color: "text-red-400", value: "5" }, { label: "Unique Attack IPs", color: "text-blue-400", value: "12" }],
    columns: [["Username", "username"], ["Source IP", "sourceip"], ["Target System", "targetsystem"], ["Attempt Count", "attemptcount"], ["Lockout Triggered", "lockouttriggered"]],
    badge: ["Status", "status", {"IP Blocked":"red","Monitored":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { username: 'admin', sourceip: '185.xxx.xxx.xxx', targetsystem: 'VPN Gateway', attemptcount: i === 0 ? '45' : '3', lockouttriggered: i === 0 ? 'Yes' : 'No', status: i === 0 ? 'IP Blocked' : 'Monitored' };
      }),
  },
  "/it/security/firewall": {
    ui: 5,
    title: "Firewall Rules", description: "Managing inbound/outbound traffic rules, port forwarding, and VPN access.",
    stats: [{ label: "Active Rules", color: "text-blue-400", value: "145" }, { label: "Blocked Connections", color: "text-emerald-400", value: "1.2k (24h)" }, { label: "VPN Users Active", color: "text-blue-400", value: "12" }],
    columns: [["Rule ID", "ruleid"], ["Source IP", "sourceip"], ["Destination IP", "destinationip"], ["Port", "port"], ["Action (Allow/Deny)", "actionallowdeny"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { ruleid: 'FW-' + (101 + i), sourceip: i === 0 ? 'Any' : '10.0.0.0/24', destinationip: '192.168.1.100', port: i === 0 ? '443' : '22', actionallowdeny: i === 0 ? 'Allow' : 'Deny', status: 'Active' };
      }),
  },
  "/it/security/policies": {
    ui: 5,
    title: "Security Policies", description: "Documented ISO 27001 / HIPAA IT policies and staff acknowledgement tracking.",
    stats: [{ label: "Total Policies", color: "text-blue-400", value: "12" }, { label: "Staff Compliance", color: "text-amber-400", value: "85%" }, { label: "Reviews Pending", color: "text-emerald-400", value: "0" }],
    columns: [["Policy Name", "policyname"], ["Version", "version"], ["Last Updated", "lastupdated"], ["Staff Acknowledged", "staffacknowledged"], ["Next Review", "nextreview"]],
    badge: ["Status", "status", {"Enforced":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { policyname: 'Clean Desk Policy', version: 'v2.1', lastupdated: 'Jan 2025', staffacknowledged: '85%', nextreview: 'Jan 2027', status: 'Enforced' };
      }),
  },
  "/it/security/threats": {
    ui: 5,
    title: "Threat Detection", description: "Intrusion Detection System (IDS) alerts for malware, ransomware, or phishing.",
    stats: [{ label: "High Severity Alerts", color: "text-green-500", value: "0" }, { label: "Medium Severity", color: "text-amber-400", value: "2" }, { label: "Phishing Emails Blocked", color: "text-blue-400", value: "450" }],
    columns: [["Alert ID", "alertid"], ["Threat Type", "threattype"], ["Severity", "severity"], ["Target Asset", "targetasset"], ["Detected Time", "detectedtime"]],
    badge: ["Status", "status", {"Resolved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { alertid: 'TRT-' + (1001 + i), threattype: 'Failed SSH Bruteforce', severity: i === 0 ? 'Medium' : 'Low', targetasset: 'Web Server 1', detectedtime: 'Yesterday 14:00', status: 'Resolved' };
      }),
  },
  "/it/security/whitelist": {
    ui: 5,
    title: "IP Whitelist", description: "Approved external IPs (e.g., specific vendors, remote doctors) allowed to bypass firewall.",
    stats: [{ label: "Whitelisted IPs", color: "text-blue-400", value: "45" }, { label: "Pending Approval", color: "text-amber-400", value: "2" }, { label: "Expiring Soon", color: "text-red-400", value: "1" }],
    columns: [["IP Address", "ipaddress"], ["Assigned To/Vendor", "assignedtovendor"], ["Purpose", "purpose"], ["Added By", "addedby"], ["Expiry Date", "expirydate"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { ipaddress: '203.0.113.' + i, assignedtovendor: 'Teleradiology Co.', purpose: 'PACS Access', addedby: 'IT Head', expirydate: '31 Dec 2026', status: 'Active' };
      }),
  },
  "/it/settings/api": {
    ui: 5,
    title: "API Configuration", description: "Rate limiting thresholds and CORS settings for the hospital APIs.",
    stats: [{ label: "Global Rate Limit", color: "text-blue-400", value: "100 req/sec" }, { label: "Blocked IPs (Limit)", color: "text-amber-400", value: "12" }, { label: "CORS Restrictive", color: "text-emerald-400", value: "Yes" }],
    columns: [["Endpoint Group", "endpointgroup"], ["Rate Limit", "ratelimit"], ["CORS Origins", "corsorigins"], ["Authentication", "authentication"], ["Cache TTL", "cachettl"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { endpointgroup: '/api/public/*', ratelimit: '50/sec', corsorigins: 'hospital.com', authentication: 'JWT / API Key', cachettl: '60s', status: 'Active' };
      }),
  },
  "/it/settings/backup": {
    ui: 5,
    title: "Backup Settings", description: "Global configurations for S3 buckets or NAS paths where backups are stored.",
    stats: [{ label: "Primary Target", color: "text-blue-400", value: "AWS S3" }, { label: "Secondary Target", color: "text-emerald-400", value: "Local NAS" }, { label: "Storage Available", color: "text-emerald-400", value: "15 TB" }],
    columns: [["Storage Target", "storagetarget"], ["Path/Bucket", "pathbucket"], ["Credentials", "credentials"], ["Retention Policy", "retentionpolicy"], ["Free Space", "freespace"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { storagetarget: 'AWS S3', pathbucket: 's3://hosp-backups', credentials: 'Valid', retentionpolicy: '30 Days', freespace: 'Auto-scaling', status: 'Active' };
      }),
  },
  "/it/settings/env": {
    ui: 5,
    title: "Environment Variables", description: "Secure management of DB connection strings and API secrets (Encrypted).",
    stats: [{ label: "Total Variables", color: "text-blue-400", value: "124" }, { label: "Secrets Expiring", color: "text-amber-400", value: "2" }, { label: "Encryption Status", color: "text-emerald-400", value: "AES-256" }],
    columns: [["Variable Name", "variablename"], ["Value (Masked)", "valuemasked"], ["Environment", "environment"], ["Service", "service"], ["Last Rotated", "lastrotated"]],
    badge: ["Status", "status", {"Secure":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { variablename: 'DB_PASSWORD', valuemasked: '********', environment: 'Production', service: 'Core API', lastrotated: '3 Months Ago', status: 'Secure' };
      }),
  },
  "/it/settings/general": {
    ui: 5,
    title: "General Settings", description: "Global configurations like Hospital Name, Logo, and default language.",
    stats: [{ label: "Global Settings", color: "text-blue-400", value: "45" }, { label: "System Maintenance Mode", color: "text-emerald-400", value: "OFF" }, { label: "Unsaved Changes", color: "text-green-500", value: "0" }],
    columns: [["Setting Key", "settingkey"], ["Value", "value"], ["Group", "group"], ["Last Updated By", "lastupdatedby"], ["Date", "date"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { settingkey: 'HOSPITAL_NAME', value: 'City General Hospital', group: 'Brand', lastupdatedby: 'Admin', date: 'Jan 2026', status: 'Active' };
      }),
  },
  "/it/settings/mail": {
    ui: 5,
    title: "Mail Configuration", description: "SMTP credentials, ports, and default sender addresses.",
    stats: [{ label: "SMTP Status", color: "text-emerald-400", value: "Connected" }, { label: "Daily Limit", color: "text-blue-400", value: "50,000" }, { label: "Queue Status", color: "text-green-500", value: "Empty" }],
    columns: [["Configuration", "configuration"], ["Value", "value"], ["Provider", "provider"], ["Test Connection", "testconnection"], ["Last Error", "lasterror"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { configuration: 'SMTP Host', value: 'email-smtp.us-east-1.amazonaws.com', provider: 'AWS SES', testconnection: 'Pass', lasterror: 'None', status: 'Active' };
      }),
  },
  "/it/settings/sms": {
    ui: 5,
    title: "SMS Configuration", description: "API endpoint, headers, and sender ID configurations for SMS vendors.",
    stats: [{ label: "Default Route", color: "text-blue-400", value: "Twilio" }, { label: "Fallback Route", color: "text-emerald-400", value: "Gupshup" }, { label: "DLT Registered", color: "text-emerald-400", value: "Yes" }],
    columns: [["Provider", "provider"], ["Sender ID", "senderid"], ["Route Type", "routetype"], ["API Key Status", "apikeystatus"], ["Test Message", "testmessage"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { provider: 'Twilio', senderid: 'HOSPIT', routetype: 'Transactional', apikeystatus: 'Valid', testmessage: 'Delivered', status: 'Active' };
      }),
  },
  "/it/settings/timezone": {
    ui: 5,
    title: "Time Zone", description: "Configuring server timezones and date formats for the HIS.",
    stats: [{ label: "Default Timezone", color: "text-blue-400", value: "UTC+5:30 (IST)" }, { label: "Date Format", color: "text-emerald-400", value: "DD/MM/YYYY" }, { label: "NTP Sync Status", color: "text-emerald-400", value: "Synced" }],
    columns: [["Setting", "setting"], ["Selected Value", "selectedvalue"], ["System Default", "systemdefault"], ["User Override", "useroverride"], ["Impacts", "impacts"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { setting: 'Server Timezone', selectedvalue: 'Asia/Kolkata', systemdefault: 'Yes', useroverride: 'No', impacts: 'Billing, Audits', status: 'Active' };
      }),
  },
  "/it/software/flags": {
    ui: 5,
    title: "Feature Flags", description: "Toggle features on/off for specific user groups without deploying code.",
    stats: [{ label: "Active Flags", color: "text-blue-400", value: "12" }, { label: "Beta Features", color: "text-amber-400", value: "3" }, { label: "Deprecated", color: "text-gray-400", value: "4" }],
    columns: [["Feature Name", "featurename"], ["Target Group", "targetgroup"], ["Rollout %", "rollout"], ["Last Toggled By", "lasttoggledby"], ["Date", "date"]],
    badge: ["Status", "status", {"Testing":"emerald","Enabled":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { featurename: 'New Billing UI ' + i, targetgroup: i === 0 ? 'Admin Only' : 'All Users', rollout: i === 0 ? '10%' : '100%', lasttoggledby: 'SysAdmin', date: 'Yesterday', status: i === 0 ? 'Testing' : 'Enabled' };
      }),
  },
  "/it/software/licenses": {
    ui: 5,
    title: "License Management", description: "Tracking Microsoft, Antivirus, and specialized clinical software licenses.",
    stats: [{ label: "Total Licenses", color: "text-blue-400", value: "1,200" }, { label: "Available Pool", color: "text-emerald-400", value: "45" }, { label: "Renewal (30D)", color: "text-amber-400", value: "1" }],
    columns: [["Software/Vendor", "softwarevendor"], ["Total Licenses", "totallicenses"], ["Allocated", "allocated"], ["Cost/User", "costuser"], ["Renewal Date", "renewaldate"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { softwarevendor: 'Office 365', totallicenses: '500', allocated: '480', costuser: '$12', renewaldate: 'Dec 2026', status: 'Active' };
      }),
  },
  "/it/software/modules": {
    ui: 5,
    title: "Module Management", description: "Enabling/Disabling specific ERP modules (e.g., Telemedicine add-on).",
    stats: [{ label: "Active Modules", color: "text-blue-400", value: "24" }, { label: "SaaS Spend (Mo)", color: "text-amber-400", value: "$4,500" }, { label: "Unused Modules", color: "text-red-400", value: "2" }],
    columns: [["Module Name", "modulename"], ["License Type", "licensetype"], ["Subscribed Users", "subscribedusers"], ["Cost/Mo", "costmo"], ["Expiry", "expiry"]],
    badge: ["Status", "status", {"Inactive":"red","Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { modulename: 'Telemedicine Add-on ' + i, licensetype: 'Enterprise', subscribedusers: 'All Doctors', costmo: '$500', expiry: 'Dec 2026', status: i === 0 ? 'Inactive' : 'Active' };
      }),
  },
  "/it/software/patches": {
    ui: 5,
    title: "Patch Management", description: "OS and 3rd party software (Java, Chrome) patching on user PCs.",
    stats: [{ label: "Critical Patches", color: "text-red-400", value: "2" }, { label: "Fleet Compliance", color: "text-amber-400", value: "92%" }, { label: "Failed Installs", color: "text-red-400", value: "15" }],
    columns: [["Patch Name", "patchname"], ["Severity", "severity"], ["Applicable PCs", "applicablepcs"], ["Patched PCs", "patchedpcs"], ["Success Rate", "successrate"]],
    badge: ["Status", "status", {"Deployment Active":"gray","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { patchname: 'Win11 KB987' + i, severity: i === 0 ? 'Critical' : 'Moderate', applicablepcs: '850', patchedpcs: (800 - i * 10).toString(), successrate: '94%', status: i === 0 ? 'Deployment Active' : 'Completed' };
      }),
  },
  "/it/software/updates": {
    ui: 5,
    title: "Software Updates", description: "Scheduled maintenance windows and downtime announcements for updates.",
    stats: [{ label: "Upcoming Windows", color: "text-blue-400", value: "1 (Sat Night)" }, { label: "Avg Downtime", color: "text-emerald-400", value: "45 Mins" }, { label: "Missed Windows", color: "text-green-500", value: "0" }],
    columns: [["Update Schedule", "updateschedule"], ["System Affected", "systemaffected"], ["Expected Downtime", "expecteddowntime"], ["Approved By", "approvedby"], ["Communication", "communication"]],
    badge: ["Status", "status", {"Scheduled":"amber","Completed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { updateschedule: 'Sat 02:00 AM', systemaffected: 'Main DB', expecteddowntime: '30 Mins', approvedby: 'IT Head', communication: 'Email Sent', status: i === 0 ? 'Scheduled' : 'Completed' };
      }),
  },
  "/it/software/version": {
    ui: 5,
    title: "ERP Version", description: "Tracking current software builds, release notes, and version history.",
    stats: [{ label: "Core ERP Version", color: "text-blue-400", value: "v4.5.1" }, { label: "Last Update", color: "text-emerald-400", value: "15 Days Ago" }, { label: "Updates Pending", color: "text-amber-400", value: "1" }],
    columns: [["Module", "module"], ["Current Version", "currentversion"], ["Release Date", "releasedate"], ["Critical Patch", "criticalpatch"], ["Rollback Available", "rollbackavailable"]],
    badge: ["Status", "status", {"Update Pending":"amber","Up to Date":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { module: ['Billing', 'EMR', 'Pharmacy', 'Lab', 'Inventory'][i], currentversion: 'v4.5.' + i, releasedate: '10 Jan 2026', criticalpatch: i === 0 ? 'Yes' : 'No', rollbackavailable: 'Yes', status: i === 0 ? 'Update Pending' : 'Up to Date' };
      }),
  },
  "/it/support/change": {
    ui: 5,
    title: "Change Requests", description: "CAB (Change Advisory Board) workflows for approving production deployments.",
    stats: [{ label: "Changes Pending", color: "text-amber-400", value: "3" }, { label: "Deployed (Mo)", color: "text-blue-400", value: "12" }, { label: "Failed Changes", color: "text-emerald-400", value: "0" }],
    columns: [["Change ID", "changeid"], ["System Affected", "systemaffected"], ["Risk Level", "risklevel"], ["Requested By", "requestedby"], ["CAB Date", "cabdate"]],
    badge: ["Status", "status", {"Under Review":"amber","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { changeid: 'CR-' + (5001 + i), systemaffected: 'Billing API', risklevel: i === 0 ? 'High' : 'Medium', requestedby: 'Dev Team', cabdate: 'Friday 14:00', status: i === 0 ? 'Under Review' : 'Approved' };
      }),
  },
  "/it/support/incident": {
    ui: 5,
    title: "Incident Management", description: "Major P1 incidents (e.g., HIS down) tracking and post-mortem logs.",
    stats: [{ label: "Major Incidents (Mo)", color: "text-red-400", value: "1" }, { label: "MTTR", color: "text-amber-400", value: "45 Mins" }, { label: "Post-Mortems Pending", color: "text-emerald-400", value: "0" }],
    columns: [["Incident ID", "incidentid"], ["Description", "description"], ["Affected Area", "affectedarea"], ["Downtime", "downtime"], ["Root Cause", "rootcause"]],
    badge: ["Status", "status", {"Resolved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { incidentid: 'INC-' + (2001 + i), description: 'EMR Sluggish', affectedarea: 'OPD', downtime: '20 Mins', rootcause: 'DB Lock', status: 'Resolved' };
      }),
  },
  "/it/support/problem": {
    ui: 5,
    title: "Problem Management", description: "Identifying underlying problems behind recurring tickets (e.g., Network drop in Ward A).",
    stats: [{ label: "Open Problems", color: "text-amber-400", value: "4" }, { label: "Tickets Linked", color: "text-blue-400", value: "45" }, { label: "Known Errors", color: "text-emerald-400", value: "12" }],
    columns: [["Problem ID", "problemid"], ["Linked Tickets", "linkedtickets"], ["Description", "description"], ["Workaround", "workaround"], ["Target Fix Date", "targetfixdate"]],
    badge: ["Status", "status", {"Open":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { problemid: 'PRB-' + (4001 + i), linkedtickets: (5 + i).toString(), description: 'Wi-Fi drops in ICU', workaround: 'Use LAN Cable', targetfixdate: 'Next Week', status: 'Open' };
      }),
  },
  "/it/support/remote": {
    ui: 5,
    title: "Remote Support", description: "Logs of AnyDesk/TeamViewer sessions initiated by IT to fix end-user PCs.",
    stats: [{ label: "Sessions Today", color: "text-blue-400", value: "34" }, { label: "Avg Duration", color: "text-emerald-400", value: "12 Mins" }, { label: "First Contact Res.", color: "text-emerald-400", value: "85%" }],
    columns: [["Session ID", "sessionid"], ["IT Tech", "ittech"], ["Target Hostname", "targethostname"], ["Duration", "duration"], ["Issue Fixed", "issuefixed"]],
    badge: ["Status", "status", {"Closed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { sessionid: 'RS-' + (6001 + i), ittech: 'Tech Alice', targethostname: 'NURS-PC-12', duration: '15 Mins', issuefixed: 'Printer Mapping', status: 'Closed' };
      }),
  },
  "/it/support/requests": {
    ui: 5,
    title: "Service Requests", description: "Requests for new hardware (e.g., new mouse) or software installations.",
    stats: [{ label: "Pending Approval", color: "text-amber-400", value: "12" }, { label: "Fulfilled (Mo)", color: "text-emerald-400", value: "85" }, { label: "Hardware Budget", color: "text-blue-400", value: "$4.5k Left" }],
    columns: [["Request ID", "requestid"], ["Department", "department"], ["Item Requested", "itemrequested"], ["Justification", "justification"], ["Approver", "approver"]],
    badge: ["Status", "status", {"Pending Approval":"amber","Fulfilled":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { requestid: 'SR-' + (3001 + i), department: 'Radiology', itemrequested: 'Barcode Scanner', justification: 'Broken', approver: 'Dept Head', status: i === 0 ? 'Pending Approval' : 'Fulfilled' };
      }),
  },
  "/it/support/tickets": {
    ui: 5,
    title: "IT Tickets", description: "Internal helpdesk for staff raising IT issues (Hardware, Network, Software).",
    stats: [{ label: "Open Tickets", color: "text-amber-400", value: "45" }, { label: "High Priority", color: "text-red-400", value: "5" }, { label: "Resolved Today", color: "text-emerald-400", value: "24" }],
    columns: [["Ticket ID", "ticketid"], ["Raised By", "raisedby"], ["Category", "category"], ["Priority", "priority"], ["Assigned Tech", "assignedtech"]],
    badge: ["Status", "status", {"Open":"amber","Resolved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { ticketid: 'TKT-' + (1001 + i), raisedby: 'Dr. Jane', category: 'Software Login', priority: i === 0 ? 'High' : 'Normal', assignedtech: 'IT Bob', status: i < 2 ? 'Open' : 'Resolved' };
      }),
  },
  "/it/users/groups": {
    ui: 5,
    title: "User Groups", description: "Logical grouping of users for bulk permission assignment (e.g., Ward Nurses).",
    stats: [{ label: "Total Groups", color: "text-blue-400", value: "45" }, { label: "Users Assigned", color: "text-emerald-400", value: "1,100" }, { label: "Empty Groups", color: "text-amber-400", value: "2" }],
    columns: [["Group Name", "groupname"], ["Members", "members"], ["Assigned Roles", "assignedroles"], ["Created Date", "createddate"], ["Managed By", "managedby"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { groupname: 'Group ' + (1 + i), members: (20 + i * 5).toString(), assignedroles: 'Clinical Staff', createddate: 'Jan 2026', managedby: 'System Admin', status: 'Active' };
      }),
  },
  "/it/users/list": {
    ui: 5,
    title: "Users List", description: "Central directory of all hospital employees and their login status.",
    stats: [{ label: "Total Active Users", color: "text-blue-400", value: "1,250" }, { label: "Locked Accounts", color: "text-red-400", value: "5" }, { label: "New Today", color: "text-emerald-400", value: "12" }],
    columns: [["Employee ID", "employeeid"], ["Name", "name"], ["Department", "department"], ["Role", "role"], ["Last Login", "lastlogin"]],
    badge: ["Status", "status", {"Active":"emerald","Locked":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const depts = ['Cardiology', 'Billing', 'Pharmacy', 'IT', 'Nursing'];
        return { employeeid: 'EMP-' + (1000 + i), name: 'User ' + (1 + i), department: depts[i], role: 'Staff', lastlogin: '10 mins ago', status: i === 2 ? 'Locked' : 'Active' };
      }),
  },
  "/it/users/logins": {
    ui: 5,
    title: "Login Management", description: "Active sessions, forced logouts, and login history tracking.",
    stats: [{ label: "Active Sessions", color: "text-blue-400", value: "850" }, { label: "Suspicious Logins", color: "text-red-400", value: "2" }, { label: "Failed Attempts", color: "text-amber-400", value: "45" }],
    columns: [["User ID", "userid"], ["IP Address", "ipaddress"], ["Device/Browser", "devicebrowser"], ["Login Time", "logintime"], ["Location", "location"]],
    badge: ["Status", "status", {"Suspicious":"amber","Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { userid: 'EMP-100' + i, ipaddress: '192.168.1.' + (10 + i), devicebrowser: 'Chrome / Win', logintime: '08:00 AM', location: 'Hospital LAN', status: i === 0 ? 'Suspicious' : 'Active' };
      }),
  },
  "/it/users/mfa": {
    ui: 5,
    title: "Multi-Factor Authentication", description: "Status of MFA adoption across the organization for secure access.",
    stats: [{ label: "MFA Enrolled", color: "text-emerald-400", value: "95%" }, { label: "Pending Setup", color: "text-amber-400", value: "45 Users" }, { label: "MFA Bypassed", color: "text-red-400", value: "5" }],
    columns: [["User Name", "username"], ["Department", "department"], ["MFA Method", "mfamethod"], ["Enrolled Date", "enrolleddate"], ["Last Used", "lastused"]],
    badge: ["Status", "status", {"Bypassed":"red","Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { username: 'User ' + (1 + i), department: 'IT', mfamethod: 'Authenticator App', enrolleddate: 'Dec 2025', lastused: 'Today', status: i === 0 ? 'Bypassed' : 'Active' };
      }),
  },
  "/it/users/password": {
    ui: 5,
    title: "Password Policy", description: "Enforcement of complex passwords, expiry cycles, and reset workflows.",
    stats: [{ label: "Users Needs Reset", color: "text-amber-400", value: "120" }, { label: "Policy Compliance", color: "text-emerald-400", value: "98%" }, { label: "Self-Resets (Mo)", color: "text-blue-400", value: "340" }],
    columns: [["Policy Setting", "policysetting"], ["Configured Value", "configuredvalue"], ["Enforced Across", "enforcedacross"], ["Exceptions", "exceptions"], ["Last Modified", "lastmodified"]],
    badge: ["Status", "status", {"Enforced":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { policysetting: i === 0 ? 'Min Length' : 'Expiry Days', configuredvalue: i === 0 ? '12 Chars' : '90 Days', enforcedacross: 'All Staff', exceptions: i === 0 ? 'None' : 'Service Accounts', lastmodified: 'Jan 2026', status: 'Enforced' };
      }),
  },
  "/it/users/roles": {
    ui: 5,
    title: "Roles & Permissions", description: "Granular access control matrices defining what modules users can view or edit.",
    stats: [{ label: "Configured Roles", color: "text-blue-400", value: "34" }, { label: "Admin Roles", color: "text-red-400", value: "3" }, { label: "Last Audited", color: "text-emerald-400", value: "10 Days Ago" }],
    columns: [["Role Name", "rolename"], ["Modules Accessible", "modulesaccessible"], ["Total Permissions", "totalpermissions"], ["Users Assigned", "usersassigned"], ["Risk Level", "risklevel"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const roles = ['Doctor', 'Nurse', 'Pharmacist', 'Cashier', 'IT Admin'];
        return { rolename: roles[i], modulesaccessible: (5 + i).toString(), totalpermissions: (50 + i * 10).toString(), usersassigned: (100 - i * 10).toString(), risklevel: i === 4 ? 'High' : 'Medium', status: 'Active' };
      }),
  },
  "/it/users/sessions": {
    ui: 5,
    title: "Session Management", description: "Timeout configurations and concurrent login limits.",
    stats: [{ label: "Avg Session Length", color: "text-blue-400", value: "4 Hrs" }, { label: "Terminated (Timeout)", color: "text-amber-400", value: "120/day" }, { label: "Concurrent Blocks", color: "text-emerald-400", value: "12" }],
    columns: [["User Role", "userrole"], ["Idle Timeout", "idletimeout"], ["Max Concurrent", "maxconcurrent"], ["Token Expiry", "tokenexpiry"], ["Last Audited", "lastaudited"]],
    badge: ["Status", "status", {"Active":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { userrole: 'Nurse', idletimeout: '15 Mins', maxconcurrent: '1 Device', tokenexpiry: '12 Hours', lastaudited: 'Last Week', status: 'Active' };
      }),
  },
  "/support/complaints": {
    ui: 0,
    title: "Patient Complaints", description: "Track and resolve patient grievances and complaints.",
    stats: [{ label: "Open Complaints", color: "text-red-400", value: "12" }, { label: "Resolved Today", color: "text-emerald-400", value: "8" }, { label: "Avg Resolution", color: "text-blue-400", value: "2.4 Days" }],
    columns: [["Ticket ID", "ticketid"], ["Complainant", "complainant"], ["Category", "category"], ["Severity", "severity"], ["Assigned Dept", "assigneddept"]],
    badge: ["Status", "status", {"Open":"gray","Escalated":"amber","In Progress":"amber","Resolved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Angry Patient 1', 'Upset Relative', 'Disappointed User', 'Annoyed Patient', 'Frustrated Caller'];
        const cats = ['Billing Issue', 'Staff Behavior', 'Long Wait Time', 'Facility Cleanliness', 'Food Quality'];
        const sevs = ['High', 'Critical', 'Medium', 'Medium', 'Low'];
        const depts = ['Finance', 'HR', 'Operations', 'Housekeeping', 'Dietary'];
        const statuses = ['Open', 'Escalated', 'In Progress', 'Resolved', 'Resolved'];
        return { ticketid: 'CMP-' + (1001 + i), complainant: names[i], category: cats[i], severity: sevs[i], assigneddept: depts[i], status: statuses[i] };
      }),
  },
  "/support/lost-found": {
    ui: 0,
    title: "Lost & Found", description: "Register and track items lost or found on hospital premises.",
    stats: [{ label: "Items Found", color: "text-emerald-400", value: "45" }, { label: "Items Lost", color: "text-amber-400", value: "12" }, { label: "Claimed", color: "text-blue-400", value: "38" }],
    columns: [["Item ID", "itemid"], ["Item Description", "itemdescription"], ["Report Type", "reporttype"], ["Location", "location"], ["Reported By", "reportedby"]],
    badge: ["Status", "status", {"Unclaimed":"gray","Searching":"amber","Claimed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const items = ['Gold Ring', 'Wallet (Brown)', 'Reading Glasses', 'Mobile Phone', 'Keys'];
        const types = ['Found', 'Lost', 'Found', 'Found', 'Lost'];
        const locs = ['Washroom 2nd Flr', 'Cafeteria', 'Waiting Area A', 'ICU Lobby', 'Parking Lot'];
        const reporters = ['Housekeeping', 'Visitor', 'Security', 'Nurse', 'Patient'];
        const statuses = ['Unclaimed', 'Searching', 'Claimed', 'Unclaimed', 'Searching'];
        return { itemid: 'LNF-' + (3001 + i), itemdescription: items[i], reporttype: types[i], location: locs[i], reportedby: reporters[i], status: statuses[i] };
      }),
  },
  "/support/suggestions": {
    ui: 0,
    title: "Feedback & Suggestions", description: "Review patient feedback and improvement suggestions.",
    stats: [{ label: "Avg Rating", color: "text-emerald-400", value: "4.6/5.0" }, { label: "New Submissions", color: "text-blue-400", value: "24" }, { label: "Actioned", color: "text-emerald-400", value: "150" }],
    columns: [["Feedback ID", "feedbackid"], ["Submitted By", "submittedby"], ["Topic", "topic"], ["Rating", "rating"], ["Submission Date", "submissiondate"]],
    badge: ["Status", "status", {"Reviewed":"gray","Action Planned":"amber","Pending Review":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Happy Patient', 'Anonymous', 'Anonymous', 'Satisfied User', 'Constructive Critic'];
        const topics = ['Great Nursing Staff', 'More Parking Needed', 'Cafeteria Menu', 'Smooth Discharge', 'App UI Improvement'];
        const ratings = ['5/5', '3/5', '4/5', '5/5', '4/5'];
        const statuses = ['Reviewed', 'Action Planned', 'Reviewed', 'Reviewed', 'Pending Review'];
        return { feedbackid: 'FBK-' + (2001 + i), submittedby: names[i], topic: topics[i], rating: ratings[i], submissiondate: 'Today', status: statuses[i] };
      }),
  },
};

export default pages;
