import { LayoutDashboard, Users, FileText, BarChart3, Settings, Activity, Bell, Code, LifeBuoy, ShieldAlert, Server, Database, Monitor, Key, HardDrive, Link2, Smartphone, FileCode, ShieldCheck } from "lucide-react";
import type { NavItem } from "./types";

export const itMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: Users,
        label: "User & Access Management",
        href: "/it/users",
        subItems: [
          { label: "Users", href: "/it/users/list" },
          { label: "User Groups", href: "/it/users/groups" },
          { label: "Roles & Permissions", href: "/it/users/roles" },
          { label: "Login Management", href: "/it/users/logins" },
          { label: "Password Policy", href: "/it/users/password" },
          { label: "MFA", href: "/it/users/mfa" },
          { label: "Session Management", href: "/it/users/sessions" },
        ]
      },
      {
        icon: Key,
        label: "Department Access",
        href: "/it/access",
        subItems: [
          { label: "Department Logins", href: "/it/access/logins" },
          { label: "Role Mapping", href: "/it/access/mapping" },
          { label: "Approval Matrix", href: "/it/access/approval" },
          { label: "Access Requests", href: "/it/access/requests" },
          { label: "User Activity", href: "/it/access/activity" },
        ]
      },
      {
        icon: Server,
        label: "Infrastructure Monitoring",
        href: "/it/infrastructure",
        subItems: [
          { label: "Server Monitoring", href: "/it/infrastructure/server" },
          { label: "CPU & RAM Usage", href: "/it/infrastructure/usage" },
          { label: "Disk Usage", href: "/it/infrastructure/disk" },
          { label: "Network Monitoring", href: "/it/infrastructure/network" },
          { label: "Internet Status", href: "/it/infrastructure/internet" },
          { label: "UPS Monitoring", href: "/it/infrastructure/ups" },
          { label: "Data Center Health", href: "/it/infrastructure/datacenter" },
        ]
      },
      {
        icon: Monitor,
        label: "Application Monitoring",
        href: "/it/application",
        subItems: [
          { label: "ERP Health", href: "/it/application/erp" },
          { label: "Web Server Status", href: "/it/application/web" },
          { label: "API Health", href: "/it/application/api" },
          { label: "Queue Services", href: "/it/application/queue" },
          { label: "Scheduled Jobs", href: "/it/application/jobs" },
          { label: "Background Services", href: "/it/application/services" },
          { label: "Service Restart", href: "/it/application/restart" },
        ]
      },
      {
        icon: Database,
        label: "Database Management",
        href: "/it/database",
        subItems: [
          { label: "Database Dashboard", href: "/it/database/dashboard" },
          { label: "Database Backup", href: "/it/database/backup" },
          { label: "Database Restore", href: "/it/database/restore" },
          { label: "Database Performance", href: "/it/database/performance" },
          { label: "Query Monitor", href: "/it/database/queries" },
          { label: "Replication Status", href: "/it/database/replication" },
          { label: "Database Logs", href: "/it/database/logs" },
        ]
      },
      {
        icon: HardDrive,
        label: "Backup & Disaster Recovery",
        href: "/it/backup",
        subItems: [
          { label: "Automatic Backup", href: "/it/backup/automatic" },
          { label: "Manual Backup", href: "/it/backup/manual" },
          { label: "Restore Backup", href: "/it/backup/restore" },
          { label: "Disaster Recovery", href: "/it/backup/dr" },
          { label: "Backup Verification", href: "/it/backup/verification" },
          { label: "Backup Schedule", href: "/it/backup/schedule" },
        ]
      },
      {
        icon: Link2,
        label: "API & Integrations",
        href: "/it/integrations",
        subItems: [
          { label: "API Dashboard", href: "/it/integrations/dashboard" },
          { label: "API Keys", href: "/it/integrations/keys" },
          { label: "API Logs", href: "/it/integrations/logs" },
          { label: "HL7 Integration", href: "/it/integrations/hl7" },
          { label: "FHIR Integration", href: "/it/integrations/fhir" },
          { label: "ABDM / ABHA", href: "/it/integrations/abdm" },
          { label: "LIS Integration", href: "/it/integrations/lis" },
          { label: "RIS Integration", href: "/it/integrations/ris" },
          { label: "PACS Integration", href: "/it/integrations/pacs" },
          { label: "Payment Gateway", href: "/it/integrations/payment" },
          { label: "SMS Gateway", href: "/it/integrations/sms" },
          { label: "WhatsApp API", href: "/it/integrations/whatsapp" },
          { label: "Email Server", href: "/it/integrations/email" },
        ]
      },
      {
        icon: ShieldCheck,
        label: "Cyber Security",
        href: "/it/security",
        subItems: [
          { label: "Security Dashboard", href: "/it/security/dashboard" },
          { label: "Firewall Rules", href: "/it/security/firewall" },
          { label: "Antivirus Status", href: "/it/security/antivirus" },
          { label: "Threat Detection", href: "/it/security/threats" },
          { label: "Failed Login Attempts", href: "/it/security/failed-logins" },
          { label: "IP Whitelist", href: "/it/security/whitelist" },
          { label: "IP Blacklist", href: "/it/security/blacklist" },
          { label: "SSL Certificates", href: "/it/security/ssl" },
          { label: "Security Policies", href: "/it/security/policies" },
        ]
      },
      {
        icon: Smartphone,
        label: "Device Management",
        href: "/it/devices",
        subItems: [
          { label: "Desktop Management", href: "/it/devices/desktops" },
          { label: "Mobile Devices", href: "/it/devices/mobile" },
          { label: "Tablets", href: "/it/devices/tablets" },
          { label: "Barcode Scanners", href: "/it/devices/scanners" },
          { label: "Biometric Devices", href: "/it/devices/biometric" },
          { label: "Printers", href: "/it/devices/printers" },
          { label: "Medical Devices", href: "/it/devices/medical" },
        ]
      },
      {
        icon: FileCode,
        label: "System Logs",
        href: "/it/logs",
        subItems: [
          { label: "Audit Logs", href: "/it/logs/audit" },
          { label: "Login Logs", href: "/it/logs/login" },
          { label: "Error Logs", href: "/it/logs/error" },
          { label: "API Logs", href: "/it/logs/api" },
          { label: "Activity Logs", href: "/it/logs/activity" },
          { label: "Event Logs", href: "/it/logs/event" },
        ]
      },
      {
        icon: Bell,
        label: "Notifications",
        href: "/it/notifications",
        subItems: [
          { label: "Email Notifications", href: "/it/notifications/email" },
          { label: "SMS Notifications", href: "/it/notifications/sms" },
          { label: "WhatsApp Notifications", href: "/it/notifications/whatsapp" },
          { label: "Push Notifications", href: "/it/notifications/push" },
          { label: "Alert Rules", href: "/it/notifications/rules" },
        ]
      },
      {
        icon: LifeBuoy,
        label: "Support Desk",
        href: "/it/support",
        subItems: [
          { label: "IT Tickets", href: "/it/support/tickets" },
          { label: "Incident Management", href: "/it/support/incident" },
          { label: "Service Requests", href: "/it/support/requests" },
          { label: "Problem Management", href: "/it/support/problem" },
          { label: "Change Requests", href: "/it/support/change" },
          { label: "Remote Support", href: "/it/support/remote" },
        ]
      },
      {
        icon: Code,
        label: "Software Management",
        href: "/it/software",
        subItems: [
          { label: "ERP Version", href: "/it/software/version" },
          { label: "Module Management", href: "/it/software/modules" },
          { label: "Feature Flags", href: "/it/software/flags" },
          { label: "Patch Management", href: "/it/software/patches" },
          { label: "License Management", href: "/it/software/licenses" },
          { label: "Software Updates", href: "/it/software/updates" },
        ]
      },
      {
        icon: Activity,
        label: "Performance Monitoring",
        href: "/it/performance",
        subItems: [
          { label: "System Performance", href: "/it/performance/system" },
          { label: "Database Performance", href: "/it/performance/database" },
          { label: "API Performance", href: "/it/performance/api" },
          { label: "Response Time", href: "/it/performance/response" },
          { label: "User Sessions", href: "/it/performance/sessions" },
          { label: "Load Analysis", href: "/it/performance/load" },
        ]
      },
      {
        icon: ShieldAlert,
        label: "Compliance",
        href: "/it/compliance",
        subItems: [
          { label: "HIPAA Compliance", href: "/it/compliance/hipaa" },
          { label: "NABH IT Compliance", href: "/it/compliance/nabh" },
          { label: "Audit Compliance", href: "/it/compliance/audit" },
          { label: "Data Privacy", href: "/it/compliance/privacy" },
          { label: "Data Retention", href: "/it/compliance/retention" },
          { label: "Access Audit", href: "/it/compliance/access" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/it/reports",
        subItems: [
          { label: "User Login Report", href: "/it/reports/logins" },
          { label: "Server Report", href: "/it/reports/server" },
          { label: "Backup Report", href: "/it/reports/backup" },
          { label: "Security Report", href: "/it/reports/security" },
          { label: "API Report", href: "/it/reports/api" },
          { label: "Database Report", href: "/it/reports/database" },
          { label: "IT Asset Report", href: "/it/reports/assets" },
          { label: "Incident Report", href: "/it/reports/incident" },
          { label: "Performance Report", href: "/it/reports/performance" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/it/analytics",
        subItems: [
          { label: "Infrastructure Dashboard", href: "/it/analytics/infrastructure" },
          { label: "Security Analytics", href: "/it/analytics/security" },
          { label: "User Analytics", href: "/it/analytics/users" },
          { label: "API Analytics", href: "/it/analytics/api" },
          { label: "Database Analytics", href: "/it/analytics/database" },
          { label: "System Health Score", href: "/it/analytics/health" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/it/settings",
        subItems: [
          { label: "General Settings", href: "/it/settings/general" },
          { label: "Environment Variables", href: "/it/settings/env" },
          { label: "Time Zone", href: "/it/settings/timezone" },
          { label: "Mail Configuration", href: "/it/settings/mail" },
          { label: "SMS Configuration", href: "/it/settings/sms" },
          { label: "API Configuration", href: "/it/settings/api" },
          { label: "Backup Settings", href: "/it/settings/backup" },
        ]
      }
];
