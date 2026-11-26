import { LayoutDashboard, Users, UserCheck, Calendar, FileText, BarChart3, Settings, Activity, CheckSquare, MessageSquare, ShieldCheck, Building2, AlertTriangle, ShoppingCart, LayoutGrid, Box } from "lucide-react";
import type { NavItem } from "./types";

export const administratorMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/admin"
      },
      {
        icon: Building2,
        label: "Hospital Management",
        href: "/admin/hospital",
        subItems: [
          { label: "Hospital Profile", href: "/admin/hospital/profile" },
          { label: "Branch Management", href: "/admin/hospital/branch" },
          { label: "Building Management", href: "/admin/hospital/buildings" },
          { label: "Floor Management", href: "/admin/hospital/floors" },
          { label: "Ward Management", href: "/admin/hospital/wards" },
          { label: "Room Allocation", href: "/admin/hospital/rooms" },
          { label: "Bed Allocation", href: "/admin/hospital/beds" },
        ]
      },
      {
        icon: LayoutGrid,
        label: "Department Management",
        href: "/admin/departments",
        subItems: [
          { label: "Departments", href: "/admin/departments/list" },
          { label: "Specialties", href: "/admin/departments/specialties" },
          { label: "Units", href: "/admin/departments/units" },
          { label: "Cost Centers", href: "/admin/departments/cost-centers" },
          { label: "Department Heads", href: "/admin/departments/heads" },
        ]
      },
      {
        icon: Users,
        label: "Employee Administration",
        href: "/admin/employees",
        subItems: [
          { label: "Employee Directory", href: "/admin/employees/directory" },
          { label: "Department Allocation", href: "/admin/employees/allocation" },
          { label: "Staff Transfers", href: "/admin/employees/transfers" },
          { label: "Duty Assignment", href: "/admin/employees/duty" },
          { label: "ID Cards", href: "/admin/employees/id-cards" },
        ]
      },
      {
        icon: UserCheck,
        label: "Doctor Administration",
        href: "/admin/doctors",
        subItems: [
          { label: "Doctor Directory", href: "/admin/doctors/directory" },
          { label: "Doctor Schedule", href: "/admin/doctors/schedule" },
          { label: "Doctor Availability", href: "/admin/doctors/availability" },
          { label: "On-call Roster", href: "/admin/doctors/roster" },
          { label: "Visiting Consultants", href: "/admin/doctors/consultants" },
        ]
      },
      {
        icon: Users,
        label: "Patient Administration",
        href: "/admin/patients",
        subItems: [
          { label: "Patient Overview", href: "/admin/patients/overview" },
          { label: "VIP Patients", href: "/admin/patients/vip" },
          { label: "International Patients", href: "/admin/patients/international" },
          { label: "Corporate Patients", href: "/admin/patients/corporate" },
          { label: "Medico Legal Cases (MLC)", href: "/admin/patients/mlc" },
        ]
      },
      {
        icon: Activity,
        label: "Operation Management",
        href: "/admin/operations",
        subItems: [
          { label: "Daily Operations", href: "/admin/operations/daily" },
          { label: "Hospital Census", href: "/admin/operations/census" },
          { label: "Bed Occupancy", href: "/admin/operations/occupancy" },
          { label: "Patient Flow", href: "/admin/operations/flow" },
          { label: "Resource Allocation", href: "/admin/operations/resources" },
        ]
      },
      {
        icon: CheckSquare,
        label: "Approval Center",
        href: "/admin/approvals",
        subItems: [
          { label: "Admission Approval", href: "/admin/approvals/admission" },
          { label: "Transfer Approval", href: "/admin/approvals/transfer" },
          { label: "Discharge Approval", href: "/admin/approvals/discharge" },
          { label: "Discount Approval", href: "/admin/approvals/discount" },
          { label: "Refund Approval", href: "/admin/approvals/refund" },
          { label: "Purchase Approval", href: "/admin/approvals/purchase" },
          { label: "Leave Approval", href: "/admin/approvals/leave" },
          { label: "Asset Approval", href: "/admin/approvals/asset" },
        ]
      },
      {
        icon: FileText,
        label: "Policy & SOP Management",
        href: "/admin/policy",
        subItems: [
          { label: "Hospital Policies", href: "/admin/policy/hospital" },
          { label: "Policy Library", href: "/admin/policy/library" },
          { label: "Department Policies", href: "/admin/policy/departments" },
          { label: "Policy Acknowledgement", href: "/admin/policy/acknowledgement" },
          { label: "Document Control", href: "/admin/policy/control" },
        ]
      },
      {
        icon: Users,
        label: "Committee Management",
        href: "/admin/committee",
        subItems: [
          { label: "Infection Control", href: "/admin/committee/infection" },
          { label: "Pharmacy Committee", href: "/admin/committee/pharmacy" },
          { label: "Ethics Committee", href: "/admin/committee/ethics" },
          { label: "Quality Committee", href: "/admin/committee/quality" },
          { label: "Mortality Committee", href: "/admin/committee/mortality" },
          { label: "Safety Committee", href: "/admin/committee/safety" },
        ]
      },
      {
        icon: AlertTriangle,
        label: "Incident Management",
        href: "/admin/incident",
        subItems: [
          { label: "Incident Reports", href: "/admin/incident/reports" },
          { label: "Risk Management", href: "/admin/incident/risk" },
          { label: "Sentinel Events", href: "/admin/incident/sentinel" },
          { label: "Root Cause Analysis", href: "/admin/incident/rca" },
          { label: "CAPA Tracking", href: "/admin/incident/capa" },
        ]
      },
      {
        icon: Box,
        label: "Resource Management",
        href: "/admin/resource",
        subItems: [
          { label: "Room Allocation", href: "/admin/resource/rooms" },
          { label: "Equipment Allocation", href: "/admin/resource/equipment" },
          { label: "Vehicle Allocation", href: "/admin/resource/vehicles" },
          { label: "Ambulance Allocation", href: "/admin/resource/ambulance" },
          { label: "Conference Rooms", href: "/admin/resource/conference" },
        ]
      },
      {
        icon: Calendar,
        label: "Hospital Calendar",
        href: "/admin/calendar",
        subItems: [
          { label: "Hospital Holidays", href: "/admin/calendar/holidays" },
          { label: "Events", href: "/admin/calendar/events" },
          { label: "Meetings", href: "/admin/calendar/meetings" },
          { label: "Training Programs", href: "/admin/calendar/training" },
          { label: "Maintenance Schedule", href: "/admin/calendar/maintenance" },
        ]
      },
      {
        icon: MessageSquare,
        label: "Communication Center",
        href: "/admin/communication",
        subItems: [
          { label: "Internal Notices", href: "/admin/communication/notices" },
          { label: "Circulars", href: "/admin/communication/circulars" },
          { label: "Announcements", href: "/admin/communication/announcements" },
          { label: "Broadcast Messages", href: "/admin/communication/broadcast" },
          { label: "Emergency Alerts", href: "/admin/communication/alerts" },
        ]
      },
      {
        icon: ShoppingCart,
        label: "Vendor Administration",
        href: "/admin/vendor",
        subItems: [
          { label: "Vendor Directory", href: "/admin/vendor/directory" },
          { label: "Service Contracts", href: "/admin/vendor/service-contracts" },
          { label: "AMC Contracts", href: "/admin/vendor/amc-contracts" },
          { label: "Vendor Evaluation", href: "/admin/vendor/evaluation" },
        ]
      },
      {
        icon: ShieldCheck,
        label: "Compliance",
        href: "/admin/compliance",
        subItems: [
          { label: "NABH Compliance", href: "/admin/compliance/nabh" },
          { label: "Fire Safety", href: "/admin/compliance/fire-safety" },
          { label: "Biomedical Waste", href: "/admin/compliance/biomedical" },
          { label: "Government Compliance", href: "/admin/compliance/government" },
          { label: "Audit Compliance", href: "/admin/compliance/audit" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/admin/reports",
        subItems: [
          { label: "Daily Hospital Report", href: "/admin/reports/daily" },
          { label: "Bed Occupancy Report", href: "/admin/reports/occupancy" },
          { label: "Department Performance", href: "/admin/reports/department" },
          { label: "Doctor Performance", href: "/admin/reports/doctor" },
          { label: "Patient Statistics", href: "/admin/reports/patient" },
          { label: "Incident Reports", href: "/admin/reports/incident" },
          { label: "Administrative Reports", href: "/admin/reports/administrative" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/admin/analytics"
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/admin/settings"
      }
];
