import { LayoutDashboard, Users, FileText, BarChart3, Settings, Activity, Stethoscope, Package, Users2, MessageSquare, Receipt, Code, ShieldAlert, Server, Key, HardDrive, Link2, ShieldCheck, Building2, Globe, GitBranch } from "lucide-react";
import type { NavItem } from "./types";

export const superAdminMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/superadmin",
      },
      {
        icon: Building2,
        label: "Hospital Management",
        // Same database-backed screens as the Administration menu.
        href: "/admin/hospital",
        subItems: [
          { label: "Hospital Profile", href: "/admin/hospital/profile" },
          { label: "Branch Information", href: "/admin/hospital/branch" },
          { label: "Buildings", href: "/admin/hospital/buildings" },
          { label: "Floors", href: "/admin/hospital/floors" },
          { label: "Wards", href: "/admin/hospital/wards" },
          { label: "Rooms", href: "/admin/hospital/rooms" },
          { label: "Bed Management", href: "/admin/hospital/beds" },
        ]
      },
      {
        icon: GitBranch,
        label: "Organization Management",
        href: "/superadmin/organization",
        subItems: [
          { label: "Organization Hierarchy", href: "/superadmin/organization/hierarchy" },
          { label: "Departments", href: "/superadmin/organization/departments" },
          { label: "Specialties", href: "/superadmin/organization/specialties" },
          { label: "Designations", href: "/superadmin/organization/designations" },
          { label: "Cost Centers", href: "/superadmin/organization/cost-centers" },
          { label: "Business Units", href: "/superadmin/organization/business-units" },
        ]
      },
      {
        icon: Globe,
        label: "Global Masters",
        href: "/superadmin/masters",
        subItems: [
          { label: "Department Master", href: "/superadmin/masters/department" },
          { label: "Service Master", href: "/superadmin/masters/service" },
          { label: "Procedure Master", href: "/superadmin/masters/procedure" },
          { label: "Diagnosis Master (ICD)", href: "/superadmin/masters/diagnosis" },
          { label: "CPT Codes", href: "/superadmin/masters/cpt" },
          { label: "Medicine Master", href: "/superadmin/masters/medicine" },
          { label: "Laboratory Test Master", href: "/superadmin/masters/lab" },
          { label: "Radiology Test Master", href: "/superadmin/masters/radiology" },
          { label: "Item Master", href: "/superadmin/masters/item" },
          { label: "Package Master", href: "/superadmin/masters/package" },
          { label: "Insurance Master", href: "/superadmin/masters/insurance" },
          { label: "Government Scheme Master", href: "/superadmin/masters/scheme" },
          { label: "Vendor Master", href: "/superadmin/masters/vendor" },
        ]
      },
      {
        icon: Users,
        label: "User & Access Management",
        href: "/superadmin/users",
        subItems: [
          { label: "Users", href: "/superadmin/users/list" },
          { label: "Employees", href: "/superadmin/users/employees" },
          { label: "Roles", href: "/superadmin/users/roles" },
          { label: "Permissions", href: "/superadmin/users/permissions" },
          { label: "Role Templates", href: "/superadmin/users/templates" },
          { label: "Login Management", href: "/superadmin/users/logins" },
          { label: "Department Access", href: "/superadmin/users/departments" },
          { label: "Password Policy", href: "/superadmin/users/password" },
          { label: "MFA", href: "/superadmin/users/mfa" },
          { label: "Active Sessions", href: "/superadmin/users/sessions" },
        ]
      },
      {
        icon: GitBranch,
        label: "Workflow Management",
        href: "/superadmin/workflow",
        subItems: [
          { label: "Approval Matrix", href: "/superadmin/workflow/approval" },
          { label: "Department Workflow", href: "/superadmin/workflow/department" },
          { label: "Escalation Rules", href: "/superadmin/workflow/escalation" },
          { label: "SLA Rules", href: "/superadmin/workflow/sla" },
          { label: "Notification Rules", href: "/superadmin/workflow/notification" },
        ]
      },
      {
        icon: Receipt,
        label: "Billing Configuration",
        href: "/superadmin/billing",
        subItems: [
          { label: "Charge Master", href: "/superadmin/billing/charge" },
          { label: "Tax Configuration", href: "/superadmin/billing/tax" },
          { label: "Discount Rules", href: "/superadmin/billing/discount" },
          { label: "Payment Modes", href: "/superadmin/billing/payment" },
          { label: "Invoice Series", href: "/superadmin/billing/invoice" },
          { label: "Receipt Series", href: "/superadmin/billing/receipt" },
          { label: "Financial Year", href: "/superadmin/billing/financial" },
        ]
      },
      {
        icon: Stethoscope,
        label: "Clinical Configuration",
        href: "/superadmin/clinical",
        subItems: [
          { label: "Consultation Templates", href: "/superadmin/clinical/consultation" },
          { label: "Prescription Templates", href: "/superadmin/clinical/prescription" },
          { label: "Diagnosis Templates", href: "/superadmin/clinical/diagnosis" },
          { label: "Procedure Templates", href: "/superadmin/clinical/procedure" },
          { label: "Discharge Templates", href: "/superadmin/clinical/discharge" },
          { label: "Clinical Forms", href: "/superadmin/clinical/forms" },
        ]
      },
      {
        icon: Package,
        label: "Inventory Configuration",
        href: "/superadmin/inventory",
        subItems: [
          { label: "Warehouse Master", href: "/superadmin/inventory/warehouse" },
          { label: "Item Categories", href: "/superadmin/inventory/categories" },
          { label: "Units", href: "/superadmin/inventory/units" },
          { label: "Stock Settings", href: "/superadmin/inventory/stock" },
          { label: "Reorder Rules", href: "/superadmin/inventory/reorder" },
          { label: "Barcode Settings", href: "/superadmin/inventory/barcode" },
        ]
      },
      {
        icon: Users2,
        label: "HR Configuration",
        href: "/superadmin/hr",
        subItems: [
          { label: "Shift Master", href: "/superadmin/hr/shift" },
          { label: "Leave Master", href: "/superadmin/hr/leave" },
          { label: "Payroll Settings", href: "/superadmin/hr/payroll" },
          { label: "Salary Components", href: "/superadmin/hr/salary" },
          { label: "Attendance Rules", href: "/superadmin/hr/attendance" },
        ]
      },
      {
        icon: MessageSquare,
        label: "Communication Center",
        href: "/superadmin/communication",
        subItems: [
          { label: "SMS Gateway", href: "/superadmin/communication/sms" },
          { label: "WhatsApp API", href: "/superadmin/communication/whatsapp" },
          { label: "Email Server", href: "/superadmin/communication/email" },
          { label: "Push Notifications", href: "/superadmin/communication/push" },
          { label: "Notification Templates", href: "/superadmin/communication/templates" },
        ]
      },
      {
        icon: Link2,
        label: "Integrations",
        href: "/superadmin/integrations",
        subItems: [
          { label: "HL7", href: "/superadmin/integrations/hl7" },
          { label: "FHIR", href: "/superadmin/integrations/fhir" },
          { label: "ABDM / ABHA", href: "/superadmin/integrations/abdm" },
          { label: "Ayushman Bharat", href: "/superadmin/integrations/ayushman" },
          { label: "LIS", href: "/superadmin/integrations/lis" },
          { label: "RIS", href: "/superadmin/integrations/ris" },
          { label: "PACS", href: "/superadmin/integrations/pacs" },
          { label: "Payment Gateway", href: "/superadmin/integrations/payment" },
          { label: "Biometric", href: "/superadmin/integrations/biometric" },
          { label: "Barcode Printers", href: "/superadmin/integrations/printers" },
          { label: "PACS Viewer", href: "/superadmin/integrations/viewer" },
          { label: "Third-party APIs", href: "/superadmin/integrations/api" },
        ]
      },
      {
        icon: Server,
        label: "IT Infrastructure",
        href: "/superadmin/infrastructure",
        subItems: [
          { label: "Servers", href: "/superadmin/infrastructure/servers" },
          { label: "Databases", href: "/superadmin/infrastructure/databases" },
          { label: "Storage", href: "/superadmin/infrastructure/storage" },
          { label: "API Services", href: "/superadmin/infrastructure/api" },
          { label: "Queue Services", href: "/superadmin/infrastructure/queue" },
          { label: "SSL Certificates", href: "/superadmin/infrastructure/ssl" },
          { label: "Domain Management", href: "/superadmin/infrastructure/domain" },
          { label: "CDN", href: "/superadmin/infrastructure/cdn" },
          { label: "Cloud Storage", href: "/superadmin/infrastructure/cloud" },
        ]
      },
      {
        icon: ShieldCheck,
        label: "Security Center",
        href: "/superadmin/security",
        subItems: [
          { label: "Firewall", href: "/superadmin/security/firewall" },
          { label: "Security Policies", href: "/superadmin/security/policies" },
          { label: "IP Restrictions", href: "/superadmin/security/ip" },
          { label: "Device Management", href: "/superadmin/security/devices" },
          { label: "Login Monitoring", href: "/superadmin/security/login" },
          { label: "Audit Logs", href: "/superadmin/security/logs" },
          { label: "Threat Detection", href: "/superadmin/security/threats" },
          { label: "Data Encryption", href: "/superadmin/security/encryption" },
        ]
      },
      {
        icon: HardDrive,
        label: "Backup & Disaster Recovery",
        href: "/superadmin/backup",
        subItems: [
          { label: "Database Backup", href: "/superadmin/backup/database" },
          { label: "File Backup", href: "/superadmin/backup/file" },
          { label: "Restore", href: "/superadmin/backup/restore" },
          { label: "Disaster Recovery", href: "/superadmin/backup/dr" },
          { label: "Backup Schedule", href: "/superadmin/backup/schedule" },
          { label: "Backup Verification", href: "/superadmin/backup/verification" },
        ]
      },
      {
        icon: Activity,
        label: "Monitoring Center",
        href: "/superadmin/monitoring",
        subItems: [
          { label: "System Health", href: "/superadmin/monitoring/health" },
          { label: "Server Monitoring", href: "/superadmin/monitoring/server" },
          { label: "Database Monitoring", href: "/superadmin/monitoring/database" },
          { label: "API Monitoring", href: "/superadmin/monitoring/api" },
          { label: "Network Monitoring", href: "/superadmin/monitoring/network" },
          { label: "Storage Monitoring", href: "/superadmin/monitoring/storage" },
          { label: "Error Monitoring", href: "/superadmin/monitoring/error" },
        ]
      },
      {
        icon: Key,
        label: "License Management",
        href: "/superadmin/license",
        subItems: [
          { label: "License Plans", href: "/superadmin/license/plans" },
          { label: "Subscription", href: "/superadmin/license/subscription" },
          { label: "Hospital Activation", href: "/superadmin/license/hospital" },
          { label: "Module Activation", href: "/superadmin/license/module" },
          { label: "User Limits", href: "/superadmin/license/users" },
          { label: "Storage Usage", href: "/superadmin/license/storage" },
          { label: "Renewal History", href: "/superadmin/license/history" },
        ]
      },
      {
        icon: ShieldAlert,
        label: "Audit & Compliance",
        href: "/superadmin/audit",
        subItems: [
          { label: "Activity Logs", href: "/superadmin/audit/activity" },
          { label: "Login Logs", href: "/superadmin/audit/login" },
          { label: "System Audit", href: "/superadmin/audit/system" },
          { label: "Database Audit", href: "/superadmin/audit/database" },
          { label: "API Audit", href: "/superadmin/audit/api" },
          { label: "Security Audit", href: "/superadmin/audit/security" },
          { label: "Compliance Reports", href: "/superadmin/audit/compliance" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/superadmin/reports",
        subItems: [
          { label: "Hospital Reports", href: "/superadmin/reports/hospital" },
          { label: "Branch Reports", href: "/superadmin/reports/branch" },
          { label: "Financial Reports", href: "/superadmin/reports/financial" },
          { label: "User Reports", href: "/superadmin/reports/user" },
          { label: "Audit Reports", href: "/superadmin/reports/audit" },
          { label: "System Reports", href: "/superadmin/reports/system" },
          { label: "License Reports", href: "/superadmin/reports/license" },
        ]
      },
      {
        icon: BarChart3,
        label: "Business Intelligence",
        href: "/superadmin/bi",
        subItems: [
          { label: "Global Dashboard", href: "/superadmin/bi/dashboard" },
          { label: "Revenue Analytics", href: "/superadmin/bi/revenue" },
          { label: "Hospital Comparison", href: "/superadmin/bi/hospital" },
          { label: "Branch Comparison", href: "/superadmin/bi/branch" },
          { label: "User Analytics", href: "/superadmin/bi/users" },
          { label: "AI Insights", href: "/superadmin/bi/ai" },
          { label: "Forecasting", href: "/superadmin/bi/forecasting" },
        ]
      },
      {
        icon: Code,
        label: "Developer Center",
        href: "/superadmin/developer",
        subItems: [
          { label: "API Management", href: "/superadmin/developer/api" },
          { label: "Webhooks", href: "/superadmin/developer/webhooks" },
          { label: "Environment Variables", href: "/superadmin/developer/env" },
          { label: "Scheduler", href: "/superadmin/developer/scheduler" },
          { label: "Queue Manager", href: "/superadmin/developer/queue" },
          { label: "Feature Flags", href: "/superadmin/developer/flags" },
          { label: "Version Management", href: "/superadmin/developer/version" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/superadmin/settings",
        subItems: [
          { label: "General Settings", href: "/superadmin/settings/general" },
          { label: "Localization", href: "/superadmin/settings/localization" },
          { label: "Languages", href: "/superadmin/settings/languages" },
          { label: "Currency", href: "/superadmin/settings/currency" },
          { label: "Time Zone", href: "/superadmin/settings/timezone" },
          { label: "Theme", href: "/superadmin/settings/theme" },
          { label: "Number Series", href: "/superadmin/settings/number" },
        ]
      }
];
