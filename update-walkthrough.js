const fs = require('fs');

const walkthroughPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/4a711156-c12c-470d-9402-b39f8111e7f9/walkthrough.md';
let walkthrough = fs.readFileSync(walkthroughPath, 'utf8');

const itPages = `
## IT & System Pages
### User & Access Management
- [Users List](http://localhost:3000/it/users/list)
- [User Groups](http://localhost:3000/it/users/groups)
- [Roles & Permissions](http://localhost:3000/it/users/roles)
- [Login Management](http://localhost:3000/it/users/logins)
- [Password Policy](http://localhost:3000/it/users/password)
- [Multi-Factor Authentication](http://localhost:3000/it/users/mfa)
- [Session Management](http://localhost:3000/it/users/sessions)

### Department Access
- [Department Logins](http://localhost:3000/it/access/logins)
- [Role Mapping](http://localhost:3000/it/access/mapping)
- [Approval Matrix](http://localhost:3000/it/access/approval)
- [Access Requests](http://localhost:3000/it/access/requests)
- [User Activity Monitor](http://localhost:3000/it/access/activity)

### Infrastructure Monitoring
- [Server Monitoring](http://localhost:3000/it/infrastructure/server)
- [CPU & RAM Usage](http://localhost:3000/it/infrastructure/usage)
- [Disk Usage](http://localhost:3000/it/infrastructure/disk)
- [Network Monitoring](http://localhost:3000/it/infrastructure/network)
- [Internet Status](http://localhost:3000/it/infrastructure/internet)
- [UPS Monitoring](http://localhost:3000/it/infrastructure/ups)
- [Data Center Health](http://localhost:3000/it/infrastructure/datacenter)

### Application Monitoring
- [ERP Health](http://localhost:3000/it/application/erp)
- [Web Server Status](http://localhost:3000/it/application/web)
- [API Health](http://localhost:3000/it/application/api)
- [Queue Services](http://localhost:3000/it/application/queue)
- [Scheduled Jobs](http://localhost:3000/it/application/jobs)
- [Background Services](http://localhost:3000/it/application/services)
- [Service Restart](http://localhost:3000/it/application/restart)

### Database Management
- [Database Dashboard](http://localhost:3000/it/database/dashboard)
- [Database Backup](http://localhost:3000/it/database/backup)
- [Database Restore](http://localhost:3000/it/database/restore)
- [Database Performance](http://localhost:3000/it/database/performance)
- [Query Monitor](http://localhost:3000/it/database/queries)
- [Replication Status](http://localhost:3000/it/database/replication)
- [Database Logs](http://localhost:3000/it/database/logs)

### Backup & Disaster Recovery
- [Automatic Backup](http://localhost:3000/it/backup/automatic)
- [Manual Backup](http://localhost:3000/it/backup/manual)
- [Restore Backup](http://localhost:3000/it/backup/restore)
- [Disaster Recovery](http://localhost:3000/it/backup/dr)
- [Backup Verification](http://localhost:3000/it/backup/verification)
- [Backup Schedule](http://localhost:3000/it/backup/schedule)

### API & Integrations
- [API Dashboard](http://localhost:3000/it/integrations/dashboard)
- [API Keys](http://localhost:3000/it/integrations/keys)
- [API Logs](http://localhost:3000/it/integrations/logs)
- [HL7 Integration](http://localhost:3000/it/integrations/hl7)
- [FHIR Integration](http://localhost:3000/it/integrations/fhir)
- [ABDM / ABHA](http://localhost:3000/it/integrations/abdm)
- [LIS Integration](http://localhost:3000/it/integrations/lis)
- [RIS Integration](http://localhost:3000/it/integrations/ris)
- [PACS Integration](http://localhost:3000/it/integrations/pacs)
- [Payment Gateway](http://localhost:3000/it/integrations/payment)
- [SMS Gateway](http://localhost:3000/it/integrations/sms)
- [WhatsApp API](http://localhost:3000/it/integrations/whatsapp)
- [Email Server](http://localhost:3000/it/integrations/email)

### Cyber Security
- [Security Dashboard](http://localhost:3000/it/security/dashboard)
- [Firewall Rules](http://localhost:3000/it/security/firewall)
- [Antivirus Status](http://localhost:3000/it/security/antivirus)
- [Threat Detection](http://localhost:3000/it/security/threats)
- [Failed Login Attempts](http://localhost:3000/it/security/failed-logins)
- [IP Whitelist](http://localhost:3000/it/security/whitelist)
- [IP Blacklist](http://localhost:3000/it/security/blacklist)
- [SSL Certificates](http://localhost:3000/it/security/ssl)
- [Security Policies](http://localhost:3000/it/security/policies)

### Device Management
- [Desktop Management](http://localhost:3000/it/devices/desktops)
- [Mobile Devices](http://localhost:3000/it/devices/mobile)
- [Tablets](http://localhost:3000/it/devices/tablets)
- [Barcode Scanners](http://localhost:3000/it/devices/scanners)
- [Biometric Devices](http://localhost:3000/it/devices/biometric)
- [Printers](http://localhost:3000/it/devices/printers)
- [Medical Devices (IoT)](http://localhost:3000/it/devices/medical)

### System Logs
- [Audit Logs](http://localhost:3000/it/logs/audit)
- [Login Logs](http://localhost:3000/it/logs/login)
- [Error Logs](http://localhost:3000/it/logs/error)
- [API Logs](http://localhost:3000/it/logs/api)
- [Activity Logs](http://localhost:3000/it/logs/activity)
- [Event Logs](http://localhost:3000/it/logs/event)

### Notifications
- [Email Notifications](http://localhost:3000/it/notifications/email)
- [SMS Notifications](http://localhost:3000/it/notifications/sms)
- [WhatsApp Notifications](http://localhost:3000/it/notifications/whatsapp)
- [Push Notifications](http://localhost:3000/it/notifications/push)
- [Alert Rules](http://localhost:3000/it/notifications/rules)

### Support Desk
- [IT Tickets](http://localhost:3000/it/support/tickets)
- [Incident Management](http://localhost:3000/it/support/incident)
- [Service Requests](http://localhost:3000/it/support/requests)
- [Problem Management](http://localhost:3000/it/support/problem)
- [Change Requests](http://localhost:3000/it/support/change)
- [Remote Support](http://localhost:3000/it/support/remote)

### Software Management
- [ERP Version](http://localhost:3000/it/software/version)
- [Module Management](http://localhost:3000/it/software/modules)
- [Feature Flags](http://localhost:3000/it/software/flags)
- [Patch Management](http://localhost:3000/it/software/patches)
- [License Management](http://localhost:3000/it/software/licenses)
- [Software Updates](http://localhost:3000/it/software/updates)

### Performance Monitoring
- [System Performance](http://localhost:3000/it/performance/system)
- [Database Performance](http://localhost:3000/it/performance/database)
- [API Performance](http://localhost:3000/it/performance/api)
- [Response Time](http://localhost:3000/it/performance/response)
- [User Sessions](http://localhost:3000/it/performance/sessions)
- [Load Analysis](http://localhost:3000/it/performance/load)

### Compliance
- [HIPAA Compliance](http://localhost:3000/it/compliance/hipaa)
- [NABH IT Compliance](http://localhost:3000/it/compliance/nabh)
- [Audit Compliance](http://localhost:3000/it/compliance/audit)
- [Data Privacy](http://localhost:3000/it/compliance/privacy)
- [Data Retention](http://localhost:3000/it/compliance/retention)
- [Access Audit](http://localhost:3000/it/compliance/access)

### Reports
- [User Login Report](http://localhost:3000/it/reports/logins)
- [Server Report](http://localhost:3000/it/reports/server)
- [Backup Report](http://localhost:3000/it/reports/backup)
- [Security Report](http://localhost:3000/it/reports/security)
- [API Report](http://localhost:3000/it/reports/api)
- [Database Report](http://localhost:3000/it/reports/database)
- [IT Asset Report](http://localhost:3000/it/reports/assets)
- [Incident Report](http://localhost:3000/it/reports/incident)
- [Performance Report](http://localhost:3000/it/reports/performance)

### Analytics
- [Infrastructure Dashboard](http://localhost:3000/it/analytics/infrastructure)
- [Security Analytics](http://localhost:3000/it/analytics/security)
- [User Analytics](http://localhost:3000/it/analytics/users)
- [API Analytics](http://localhost:3000/it/analytics/api)
- [Database Analytics](http://localhost:3000/it/analytics/database)
- [System Health Score](http://localhost:3000/it/analytics/health)

### Settings
- [General Settings](http://localhost:3000/it/settings/general)
- [Environment Variables](http://localhost:3000/it/settings/env)
- [Time Zone](http://localhost:3000/it/settings/timezone)
- [Mail Configuration](http://localhost:3000/it/settings/mail)
- [SMS Configuration](http://localhost:3000/it/settings/sms)
- [API Configuration](http://localhost:3000/it/settings/api)
- [Backup Settings](http://localhost:3000/it/settings/backup)
`;

if (!walkthrough.includes('IT & System Pages')) {
  walkthrough += '\n\n' + itPages;
  fs.writeFileSync(walkthroughPath, walkthrough);
  console.log('Updated walkthrough with IT & System Pages.');
} else {
  console.log('IT & System Pages already exist in walkthrough.');
}
