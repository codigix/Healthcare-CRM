"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Pill,
  Activity,
  Stethoscope,
  Syringe,
  Clipboard,
  Package,
  UserCog,
  ClipboardList,
  Hotel,
  Star,
  MessageCircle,
  Clock,
  Mail,
  CheckSquare,
  Users2,
  Bell,
  MessageSquare,
  HeartPulse,
  Search,
  Video,
  FlaskConical,
  AlertCircle,
  Wrench,
  Shield,
  ShoppingBag,
  Receipt,
  Wallet,
  Banknote,
  CreditCard,
  Landmark,
  Calculator,
  Percent,
  PieChart,
  UserPlus,
  CalendarDays,
  Target,
  BookOpen,
  FolderOpen,
  Files,
  Archive,
  Code,
  Award,
  Bug,
  Scale,
  FileStack,
  Send,
  HeartHandshake,
  Megaphone,
  CalendarClock,
  ThumbsUp,
  Frown,
  Gift,
  Network,
  PhoneCall,
  LifeBuoy,
  Building,
  Cpu,
  Sparkles,
  Shirt,
  Truck,
  Bus,
  Trash2,
  Zap,
  ShieldAlert,
  Server,
  Wifi,
  Database,
  Laptop,
  Monitor,
  Key,
  HardDrive,
  Link2,
  Smartphone,
  FileCode,
  ShieldCheck,
  Presentation,
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  Building2,
  Globe,
  GitBranch,
  AlertTriangle,
  ShoppingCart,
  UsersRound,
  LayoutGrid,
  Box,
} from "lucide-react";
import { useAuthStore, useUIStore } from "@/lib/store";
import { useState, useEffect, useRef } from "react";
import ModuleTour from "@/components/ModuleTour";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    moduleId: "dashboard",
    subItems: [
      { label: "Admin Dashboard", href: "/dashboard/admin" },
      { label: "Doctor Dashboard", href: "/dashboard/doctor" },
      { label: "Patient Dashboard", href: "/dashboard/patient" },
    ],
  },
  {
    icon: UserCheck,
    label: "Doctors",
    href: "/doctors",
    moduleId: "doctors",
    subItems: [
      { label: "Doctors List", href: "/doctors" },
      { label: "Add Doctor", href: "/doctors/add" },
      { label: "Doctor Schedule", href: "/doctors/schedule" },
      //{ label: 'Specializations', href: '/doctors/specializations' },
    ],
  },
  {
    icon: Users,
    label: "Patients",
    href: "/patients",
    moduleId: "patients",
    subItems: [
      { label: "Patients List", href: "/patients" },
      { label: "Add Patient", href: "/patients/add" },
    ],
  },
  {
    icon: Calendar,
    label: "Appointments",
    href: "/appointments",
    moduleId: "appointments",
    subItems: [
      { label: "All Appointments", href: "/appointments/all" },
      { label: "Add Appointment", href: "/appointments/add" },
      { label: "Calendar View", href: "/appointments/calendar" },
      { label: "Appointment Requests", href: "/appointments/requests" },
    ],
  },
  {
    icon: Clipboard,
    label: "Prescriptions",
    href: "/prescriptions",
    moduleId: "prescriptions",
    subItems: [
      { label: "All Prescriptions", href: "/prescriptions/all" },
      { label: "Create Prescription", href: "/prescriptions/create" },
    ],
  },
  {
    icon: Activity,
    label: "Ambulance",
    href: "/ambulance",
    moduleId: "ambulance",
    subItems: [
      { label: "Ambulance Call List", href: "/ambulance/calls" },
      { label: "Ambulance List", href: "/ambulance/list" },
      { label: "Ambulance Details", href: "/ambulance/details" },
    ],
  },
  {
    icon: Pill,
    label: "Pharmacy",
    href: "/pharmacy",
    moduleId: "pharmacy",
    subItems: [
      { label: "Pending Prescriptions", href: "/pharmacy/prescriptions/pending" },
      { label: "Prescription History", href: "/pharmacy/prescriptions/history" },
      { label: "Medicine List", href: "/pharmacy/medicines" },
      { label: "Add Medicine", href: "/pharmacy/add-medicine" },
      { label: "Medicine Categories", href: "/pharmacy/categories" },
      { label: "OPD Medicine Issue", href: "/pharmacy/issue/opd" },
      { label: "IPD Medicine Supply", href: "/pharmacy/issue/ipd" },
      { label: "Medicine Bills", href: "/pharmacy/billing" },
      { label: "Low Stock Medicines", href: "/pharmacy/alerts/low-stock" },
      { label: "Expiring Medicines", href: "/pharmacy/alerts/expiring" },
      { label: "Pharmacy Reports", href: "/pharmacy/reports" },
      { label: "Medicine Usage Reports", href: "/pharmacy/reports/usage" },
    ],
  },
  {
    icon: Syringe,
    label: "Blood Bank",
    href: "/blood-bank",
    moduleId: "blood-bank",
    subItems: [
      { label: "Blood Stock", href: "/blood-bank/stock" },
      { label: "Blood Donor", href: "/blood-bank/donors" },
      { label: "Add Blood Unit", href: "/blood-bank/add-unit" },
      { label: "Issue Blood", href: "/blood-bank/issued" },
    ],
  },
  {
    icon: Stethoscope,
    label: "Departments",
    href: "/departments",
    moduleId: "departments",
    subItems: [
      { label: "Department List", href: "/departments" },
      { label: "Add Department", href: "/departments/add" },
      { label: "Services Offered", href: "/departments/services" },
    ],
  },
  {
    icon: Package,
    label: "Inventory",
    href: "/inventory",
    moduleId: "inventory",
    subItems: [
      { label: "Inventory Items", href: "/inventory" },
      { label: "Add Item", href: "/inventory/add" },
      { label: "Inventory Categories", href: "/inventory/categories" },
      { label: "Stock Alerts", href: "/inventory/alerts" },
      { label: "Expiry Alerts", href: "/inventory/expiry" },
      { label: "Suppliers List", href: "/inventory/suppliers" },
      { label: "Inventory Reports", href: "/inventory/reports" },
      { label: "Asset Reports", href: "/inventory/reports/assets" },
    ],
  },
  {
    icon: UserCog,
    label: "Staff",
    href: "/staff",
    moduleId: "staff",
    subItems: [
      { label: "All Staff", href: "/staff" },
      { label: "Add Staff", href: "/staff/add" },
      { label: "Roles & Permissions", href: "/staff/roles" },
      { label: "Attendance", href: "/staff/attendance" },
    ],
  },
  {
    icon: ClipboardList,
    label: "Laboratory",
    href: "/records",
    moduleId: "laboratory",
    subItems: [
      { label: "Lab Test Requests", href: "/records/lab-tests" },
      { label: "Birth Records", href: "/records/birth" },
      { label: "Death Records", href: "/records/death" },
    ],
  },
  {
    icon: Hotel,
    label: "Room Allotment",
    href: "/room-allotment",
    moduleId: "room-allotment",
    subItems: [
      { label: "Admission Requests", href: "/room-allotment/requests" },
      { label: "Alloted Rooms", href: "/room-allotment/alloted" },
      { label: "New Allotment", href: "/room-allotment/new" },
      { label: "Rooms by Department", href: "/room-allotment/by-department" },
      { label: "Add New Room", href: "/room-allotment/add-room" },
    ],
  },
  {
    icon: FileText,
    label: "Billing",
    href: "/billing",
    moduleId: "billing",
    subItems: [
      { label: "Invoices", href: "/billing/invoices" },
      { label: "Create Invoice", href: "/billing/create-invoice" },
      { label: "Payments History", href: "/billing/payments" },
      { label: "Insurance Claims", href: "/billing/insurance" },
    ],
  },
  {
    icon: BarChart3,
    label: "Reports",
    href: "/reports",
    moduleId: "reports",
    subItems: [
      { label: "Appointment Reports", href: "/reports/appointment" },
      { label: "Financial Reports", href: "/reports/financial" },
      { label: "Patient Visit Reports", href: "/reports/patient-visit" },
      { label: "Inventory Reports", href: "/reports/inventory" },
    ],
  },
  {
    icon: Star,
    label: "Reviews",
    href: "/reviews",
    moduleId: "reviews",
    subItems: [
      { label: "Doctor Reviews", href: "/reviews/doctors" },
      { label: "Patient Reviews", href: "/reviews/patients" },
    ],
  },
  {
    icon: MessageCircle,
    label: "Feedback",
    href: "/feedback",
  },
];

const secondaryMenuItems = [
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
    tourId: "settings-nav",
  },
  {
    icon: UserCheck,
    label: "Authentication",
    href: "/authentication",
    tourId: "authentication-nav",
  },
  {
    icon: Calendar,
    label: "Calendar",
    href: "/calendar",
    tourId: "calendar-nav",
  },
  { icon: CheckSquare, label: "Tasks", href: "/tasks", tourId: "tasks-nav" },
  {
    icon: Users2,
    label: "Contacts",
    href: "/contacts",
    tourId: "contacts-nav",
  },
  { icon: Mail, label: "Email", href: "/email", tourId: "email-nav" },
];

interface ModuleInfo {
  title: string;
  description: string;
  features: string[];
  icon?: string;
  actionLabel?: string;
}

const moduleDatabase: Record<string, ModuleInfo> = {
  dashboard: {
    title: "📊 Dashboard - System Overview",
    description:
      "Welcome to your Hospital Management Dashboard! This is your central hub where you can see all key metrics and performance indicators at a glance.",
    features: [
      "Total Revenue Card: Track financial performance with month-over-month growth",
      "Metrics Overview: Quick stats on appointments, patients, and doctors",
      "Revenue Trends Chart: Visualize earnings patterns over time",
      "Patient Growth Chart: Monitor registration trends and capacity planning",
      "Recent Appointments: Quick view of latest bookings and status tracking",
    ],
  },
  doctors: {
    title: "👨‍⚕️ Doctors Management - Medical Staff Control",
    description:
      "Manage your medical staff efficiently. Maintain comprehensive doctor profiles, schedules, and specialties for optimal resource allocation.",
    features: [
      "Doctors List: Browse and search all registered medical professionals",
      "Add Doctor: Register new staff members with complete profiles",
      "Doctor Schedule: Manage appointments and availability slots",
      "Specialties: Organize doctors by medical specializations",
      "Performance Tracking: Monitor doctor efficiency and patient satisfaction",
    ],
  },
  patients: {
    title: "👥 Patients Management - Patient Records System",
    description:
      "Central patient information hub. Manage all patient data, medical history, and treatment records with secure storage.",
    features: [
      "Patients List: Browse and search complete patient database",
      "Add Patient: Register new patients with comprehensive profiles",
      "Medical History: Store and track patient treatment records",
      "Contact Information: Maintain patient communication details",
      "Treatment Plans: Organize ongoing care and medication schedules",
    ],
  },
  appointments: {
    title: "📅 Appointments Management - Complete Scheduling System",
    description:
      "The Appointments module provides comprehensive scheduling and management of patient bookings with multiple views and flexibility.",
    features: [
      "All Appointments: Complete appointment list with status tracking and management",
      "Calendar View: Visual appointment timeline with drag-and-drop scheduling",
      "Add Appointment: Create new appointments with automatic conflict checking",
      "Appointment Requests: Manage pending booking requests and confirmations",
      "Notification System: Automatic reminders for patients and doctors",
    ],
  },
  prescriptions: {
    title: "💊 Prescriptions Module - Digital Medication Management",
    description:
      "Digital prescription management for modern healthcare. Streamline medication dispensing and maintain detailed records.",
    features: [
      "All Prescriptions: Access prescription history and complete records",
      "Create Prescription: Write new prescriptions digitally with validation",
      "Dosage Management: Precise dosing instructions and frequency control",
      "Patient Medication History: Track all prescriptions and medication compliance",
    ],
  },
  ambulance: {
    title: "🚑 Ambulance Services - Emergency Response Coordination",
    description:
      "Emergency response coordination and ambulance management. Ensure rapid response for critical situations.",
    features: [
      "Ambulance Call List: Track all emergency response calls and status",
      "Ambulance Fleet: Manage vehicle inventory and availability",
      "Driver Management: Maintain driver profiles and certifications",
      "Response Tracking: Monitor call response times and efficiency",
      "Maintenance Logs: Schedule regular vehicle maintenance and inspections",
    ],
  },
  pharmacy: {
    title: "🏥 Pharmacy Integration - Medicine Inventory Management",
    description:
      "Integrated pharmacy management within your clinic. Connect prescriptions to dispensing with accurate inventory tracking.",
    features: [
      "Medicine List: Complete inventory of available medications",
      "Add Medicine: Stock new medications and supplies",
      "Stock Levels: Monitor medication availability and low-stock alerts",
      "Supplier Management: Organize vendor relationships and orders",
      "Expiry Tracking: Automatic alerts for expiring medications",
    ],
  },
  "blood-bank": {
    title: "🩸 Blood Bank Management - Blood Inventory System",
    description:
      "Complete blood bank operations and inventory management. Critical for emergency transfusions and surgical procedures.",
    features: [
      "Blood Stock: Monitor blood type availability and quantities",
      "Blood Donor: Manage donor database and donation schedules",
      "Blood Issued: Track blood transfusions and usage patterns",
      "Add Blood Unit: Register new blood donations and testing",
      "Issue Blood: Process blood requests and distribution safely",
    ],
  },
  departments: {
    title: "🏢 Departments Management - Specialty Organization",
    description:
      "Organize your clinic by medical specialties. Structure healthcare services by expertise areas and departments.",
    features: [
      "Department List: View all medical departments and specialties",
      "Add Department: Create new specialty departments",
      "Services Offered: Manage department-specific capabilities",
      "Department Head: Assign medical leadership and hierarchy",
      "Service Hours: Define department operating hours and schedules",
    ],
  },
  inventory: {
    title: "📦 Inventory Control - Medical Supplies Management",
    description:
      "Medical supplies and equipment inventory management. Ensure you never run out of critical supplies.",
    features: [
      "Inventory List: Track all medical supplies and equipment",
      "Add Item: Register new inventory items with details",
      "Stock Alerts: Automatic low-stock notifications and reorders",
      "Suppliers List: Manage vendor relationships and pricing",
      "Usage Reports: Analyze consumption patterns and trends",
    ],
  },
  staff: {
    title: "👥 Staff Management - Workforce Administration",
    description:
      "Comprehensive staff administration and HR functions. Manage your entire healthcare workforce efficiently.",
    features: [
      "All Staff: Complete staff directory and employee profiles",
      "Add Staff: Hire and onboard new employees efficiently",
      "Roles & Permissions: Control access levels and responsibilities",
      "Attendance: Track staff schedules, shifts, and presence",
      "Performance Reviews: Monitor employee productivity and evaluations",
    ],
  },
  "room-allotment": {
    title: "🏠 Room Allotment - Bed Management System",
    description:
      "Hospital room and bed management system. Optimize bed utilization and patient accommodation.",
    features: [
      "Allotted Rooms: View current room assignments and occupancy",
      "New Allotment: Assign patients to available rooms quickly",
      "Rooms by Department: Department-specific room organization",
      "Add New Room: Register new rooms and facilities",
      "Occupancy Reports: Track bed utilization and availability",
    ],
  },
  billing: {
    title: "💰 Billing & Payments - Financial Management",
    description:
      "Complete financial management for healthcare services. Streamline revenue collection and financial reporting.",
    features: [
      "Invoices: Generate and manage patient bills and statements",
      "Create Invoice: Process new billing requests accurately",
      "Payments History: Track all financial transactions and receipts",
      "Insurance Claims: Handle insurance processing and submissions",
      "Financial Reports: Generate revenue and expense analysis",
    ],
  },
  reports: {
    title: "📊 Reports & Analytics - Data-Driven Decisions",
    description:
      "Comprehensive reporting for data-driven decisions. Transform your data into actionable insights.",
    features: [
      "Appointment Reports: Scheduling and utilization analytics",
      "Financial Reports: Revenue and expense analysis dashboards",
      "Patient Visit Reports: Treatment and outcome metrics",
      "Inventory Reports: Supply chain and usage statistics",
      "Staff Performance: Productivity and efficiency metrics analysis",
    ],
  },
  reviews: {
    title: "⭐ Reviews & Feedback - Quality Monitoring",
    description:
      "Patient and staff feedback management. Monitor service quality and identify improvement areas.",
    features: [
      "Doctor Reviews: Patient feedback on medical care quality",
      "Patient Reviews: Overall clinic experience ratings",
      "Feedback Analytics: Analyze trends and common feedback themes",
      "Response Management: Track and respond to customer feedback",
      "Rating Reports: Generate quality assurance reports",
    ],
  },
  settings: {
    title: "⚙️ System Settings - Configuration Control",
    description:
      "Configure your clinic management system. Customize preferences, behavior, and administrative controls.",
    features: [
      "User Preferences: Customize personal system settings and themes",
      "System Configuration: Adjust core system behavior and features",
      "Notification Settings: Control alert preferences and channels",
      "Security Settings: Manage passwords and access controls",
      "System Logs: Monitor system activities and audit trails",
    ],
  },
};

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, setIsNavigating, isNavigating } = useUIStore();

  let userDept = user?.department;
  if (!userDept && user) {
    if (user.role === 'admin') userDept = 'Admin';
    else if (user.role === 'doctor') userDept = 'Doctor';
    else userDept = 'Admin';
  }
  if (!userDept) userDept = 'Admin';

  const dept = userDept.toLowerCase();
  let filteredMenuItems: any[] = [];

  const getBaseItem = (label: string) => {
    const item = menuItems.find(i => i.label === label);
    if (!item) return null;

    const cloned = {
      ...item,
      subItems: item.subItems ? [...item.subItems] : undefined
    };

    if (cloned.label === "Patients" && (dept === "doctor" || dept === "laboratory")) {
      cloned.subItems = cloned.subItems?.filter(s => s.label !== "Add Patient");
    }

    if (cloned.label === "Appointments" && dept === "doctor") {
      cloned.subItems = cloned.subItems?.filter(
        (s) => s.label !== "Add Appointment" && s.label !== "Appointment Requests"
      );
    }

    return cloned;
  };

  if (dept === 'admin' || dept === 'administration') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/admin",
      },
      {
        icon: Building2,
        label: "Hospital Management",
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
        icon: Stethoscope,
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
        icon: Users2,
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
        icon: CheckCircle2,
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
        icon: UsersRound,
        label: "Committee Management",
        href: "/admin/committee",
        subItems: [
          { label: "Infection Control Committee", href: "/admin/committee/infection" },
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
        icon: Package,
        label: "Resource Management",
        href: "/admin/resource",
        subItems: [
          { label: "Room Allocation", href: "/admin/resource/room" },
          { label: "Equipment Allocation", href: "/admin/resource/equipment" },
          { label: "Vehicle Allocation", href: "/admin/resource/vehicle" },
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
          { label: "Service Contracts", href: "/admin/vendor/contracts" },
          { label: "AMC Contracts", href: "/admin/vendor/amc" },
          { label: "Vendor Evaluation", href: "/admin/vendor/evaluation" },
        ]
      },
      {
        icon: ShieldAlert,
        label: "Compliance",
        href: "/admin/compliance",
        subItems: [
          { label: "NABH Compliance", href: "/admin/compliance/nabh" },
          { label: "Fire Safety", href: "/admin/compliance/fire" },
          { label: "Biomedical Waste", href: "/admin/compliance/waste" },
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
        href: "/admin/analytics",
        subItems: [
          { label: "Hospital Dashboard", href: "/admin/analytics/dashboard" },
          { label: "Operational KPIs", href: "/admin/analytics/kpis" },
          { label: "Resource Utilization", href: "/admin/analytics/utilization" },
          { label: "Department Comparison", href: "/admin/analytics/comparison" },
          { label: "Capacity Analysis", href: "/admin/analytics/capacity" },
          { label: "Administrative KPIs", href: "/admin/analytics/administrative" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/admin/settings",
        subItems: [
          { label: "Hospital Settings", href: "/admin/settings/hospital" },
          { label: "Working Hours", href: "/admin/settings/hours" },
          { label: "Number Series", href: "/admin/settings/series" },
          { label: "Approval Workflow", href: "/admin/settings/workflow" },
          { label: "Notification Settings", href: "/admin/settings/notifications" },
        ]
      }
    ];
  } else if (dept === 'doctor' || dept === 'clinical') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/doctor",
      },
      {
        icon: Calendar,
        label: "My Schedule",
        href: "/doctor/schedule",
        subItems: [
          { label: "Today's Schedule", href: "/doctor/schedule/today" },
          { label: "Doctor Availability", href: "/doctor/schedule/availability" },
          { label: "Calendar", href: "/doctor/schedule/calendar" },
          { label: "Leave & Block Time", href: "/doctor/schedule/leave" },
        ]
      },
      {
        icon: Users,
        label: "Patient Queue",
        href: "/doctor/queue",
        subItems: [
          { label: "Today's Queue", href: "/doctor/queue/today" },
          { label: "Waiting Patients", href: "/doctor/queue/waiting" },
          { label: "Checked-In Patients", href: "/doctor/queue/checked-in" },
          { label: "Emergency Queue", href: "/doctor/queue/emergency" },
          { label: "Follow-up Queue", href: "/doctor/queue/follow-up" },
          { label: "Telemedicine Queue", href: "/doctor/queue/telemedicine" },
        ]
      },
      {
        icon: Stethoscope,
        label: "OPD",
        href: "/doctor/opd",
        subItems: [
          { label: "OPD Dashboard", href: "/doctor/opd/dashboard" },
          { label: "Consultation", href: "/doctor/opd/consultation" },
          { label: "Follow-up", href: "/doctor/opd/follow-up" },
          { label: "OPD Procedures", href: "/doctor/opd/procedures" },
        ]
      },
      {
        icon: Hotel,
        label: "IPD",
        href: "/doctor/ipd",
        subItems: [
          { label: "Admitted Patients", href: "/doctor/ipd/admitted" },
          { label: "Daily Rounds", href: "/doctor/ipd/rounds" },
          { label: "Progress Notes", href: "/doctor/ipd/progress-notes" },
          { label: "Treatment Plan", href: "/doctor/ipd/treatment-plan" },
          { label: "Transfer Requests", href: "/doctor/ipd/transfer-requests" },
          { label: "Discharge Planning", href: "/doctor/ipd/discharge-planning" },
        ]
      },
      {
        icon: Activity,
        label: "Emergency",
        href: "/doctor/emergency",
        subItems: [
          { label: "Emergency Dashboard", href: "/doctor/emergency/dashboard" },
          { label: "Triage Patients", href: "/doctor/emergency/triage" },
          { label: "Critical Patients", href: "/doctor/emergency/critical" },
          { label: "Trauma Cases", href: "/doctor/emergency/trauma" },
          { label: "Emergency Procedures", href: "/doctor/emergency/procedures" },
        ]
      },
      {
        icon: MessageSquare,
        label: "Consultation",
        href: "/doctor/consultation",
        subItems: [
          { label: "SOAP Notes", href: "/doctor/consultation/soap-notes" },
          { label: "Clinical Notes", href: "/doctor/consultation/clinical-notes" },
          { label: "Diagnosis", href: "/doctor/consultation/diagnosis" },
          { label: "Differential Diagnosis", href: "/doctor/consultation/differential" },
          { label: "Clinical Templates", href: "/doctor/consultation/templates" },
        ]
      },
      {
        icon: HeartPulse,
        label: "Vitals & Assessment",
        href: "/doctor/vitals",
        subItems: [
          { label: "Patient Vitals", href: "/doctor/vitals/patient" },
          { label: "Clinical Assessment", href: "/doctor/vitals/assessment" },
          { label: "Pain Assessment", href: "/doctor/vitals/pain" },
          { label: "Risk Assessment", href: "/doctor/vitals/risk" },
        ]
      },
      {
        icon: Search,
        label: "Diagnosis",
        href: "/doctor/diagnosis",
        subItems: [
          { label: "Diagnosis Entry", href: "/doctor/diagnosis/entry" },
          { label: "ICD Diagnosis", href: "/doctor/diagnosis/icd" },
          { label: "Chronic Conditions", href: "/doctor/diagnosis/chronic" },
          { label: "Medical History", href: "/doctor/diagnosis/history" },
        ]
      },
      {
        icon: Pill,
        label: "Prescription",
        href: "/doctor/prescription",
        subItems: [
          { label: "New Prescription", href: "/doctor/prescription/new" },
          { label: "Medication History", href: "/doctor/prescription/history" },
          { label: "Repeat Prescription", href: "/doctor/prescription/repeat" },
          { label: "E-Prescription", href: "/doctor/prescription/e-prescription" },
          { label: "Prescription Templates", href: "/doctor/prescription/templates" },
        ]
      },
      {
        icon: ClipboardList,
        label: "Orders",
        href: "/doctor/orders",
        subItems: [
          { label: "Laboratory Orders", href: "/doctor/orders/laboratory" },
          { label: "Radiology Orders", href: "/doctor/orders/radiology" },
          { label: "Procedure Orders", href: "/doctor/orders/procedure" },
          { label: "Surgery Requests", href: "/doctor/orders/surgery" },
          { label: "Blood Requests", href: "/doctor/orders/blood" },
          { label: "Physiotherapy Orders", href: "/doctor/orders/physiotherapy" },
          { label: "Diet Orders", href: "/doctor/orders/diet" },
        ]
      },
      {
        icon: Syringe,
        label: "Procedures",
        href: "/doctor/procedures",
        subItems: [
          { label: "Minor Procedures", href: "/doctor/procedures/minor" },
          { label: "Major Procedures", href: "/doctor/procedures/major" },
          { label: "Procedure Notes", href: "/doctor/procedures/notes" },
          { label: "Procedure History", href: "/doctor/procedures/history" },
        ]
      },
      {
        icon: FileText,
        label: "Clinical Documentation",
        href: "/doctor/documentation",
        subItems: [
          { label: "Progress Notes", href: "/doctor/documentation/progress" },
          { label: "Consultation Notes", href: "/doctor/documentation/consultation" },
          { label: "Operative Notes", href: "/doctor/documentation/operative" },
          { label: "Referral Notes", href: "/doctor/documentation/referral" },
          { label: "Medical Certificates", href: "/doctor/documentation/certificates" },
        ]
      },
      {
        icon: UserCheck,
        label: "Referrals",
        href: "/doctor/referrals",
        subItems: [
          { label: "Internal Referral", href: "/doctor/referrals/internal" },
          { label: "External Referral", href: "/doctor/referrals/external" },
          { label: "Specialist Referral", href: "/doctor/referrals/specialist" },
        ]
      },
      {
        icon: Clock,
        label: "Follow-up",
        href: "/doctor/follow-up",
        subItems: [
          { label: "Follow-up Schedule", href: "/doctor/follow-up/schedule" },
          { label: "Follow-up Patients", href: "/doctor/follow-up/patients" },
          { label: "Missed Follow-up", href: "/doctor/follow-up/missed" },
        ]
      },
      {
        icon: Video,
        label: "Telemedicine",
        href: "/doctor/telemedicine",
        subItems: [
          { label: "Video Consultation", href: "/doctor/telemedicine/video" },
          { label: "Chat Consultation", href: "/doctor/telemedicine/chat" },
          { label: "Telemedicine History", href: "/doctor/telemedicine/history" },
        ]
      },
      {
        icon: LogOut,
        label: "Discharge",
        href: "/doctor/discharge",
        subItems: [
          { label: "Discharge Summary", href: "/doctor/discharge/summary" },
          { label: "Discharge Advice", href: "/doctor/discharge/advice" },
          { label: "Follow-up Instructions", href: "/doctor/discharge/instructions" },
        ]
      },
      {
        icon: BarChart3,
        label: "Clinical Reports",
        href: "/doctor/reports",
        subItems: [
          { label: "OPD Reports", href: "/doctor/reports/opd" },
          { label: "IPD Reports", href: "/doctor/reports/ipd" },
          { label: "Diagnosis Reports", href: "/doctor/reports/diagnosis" },
          { label: "Prescription Reports", href: "/doctor/reports/prescription" },
          { label: "Procedure Reports", href: "/doctor/reports/procedure" },
          { label: "Referral Reports", href: "/doctor/reports/referral" },
          { label: "Clinical Outcome Reports", href: "/doctor/reports/outcome" },
        ]
      },
      {
        icon: Star,
        label: "My Performance",
        href: "/doctor/performance",
        subItems: [
          { label: "Consultation Statistics", href: "/doctor/performance/consultation" },
          { label: "Procedure Statistics", href: "/doctor/performance/procedure" },
          { label: "Patient Feedback", href: "/doctor/performance/feedback" },
          { label: "Clinical KPIs", href: "/doctor/performance/kpis" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/doctor/settings",
        subItems: [
          { label: "Doctor Profile", href: "/doctor/settings/profile" },
          { label: "Preferences", href: "/doctor/settings/preferences" },
        ]
      }
    ];
  } else if (dept === 'nurse' || dept === 'nursing') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/nurse",
      },
      {
        icon: Clock,
        label: "My Shift",
        href: "/nurse/shift",
        subItems: [
          { label: "Today's Shift", href: "/nurse/shift/today" },
          { label: "Duty Roster", href: "/nurse/shift/roster" },
          { label: "Shift Handover", href: "/nurse/shift/handover" },
          { label: "Assigned Wards", href: "/nurse/shift/wards" },
        ]
      },
      {
        icon: Users,
        label: "Patient Management",
        href: "/nurse/patients",
        subItems: [
          { label: "My Patients", href: "/nurse/patients/my-patients" },
          { label: "Admitted Patients", href: "/nurse/patients/admitted" },
          { label: "Bed Allocation", href: "/nurse/patients/bed-allocation" },
          { label: "Patient Transfers", href: "/nurse/patients/transfers" },
          { label: "Discharge Preparation", href: "/nurse/patients/discharge" },
        ]
      },
      {
        icon: HeartPulse,
        label: "Patient Monitoring",
        href: "/nurse/monitoring",
        subItems: [
          { label: "Vitals Monitoring", href: "/nurse/monitoring/vitals" },
          { label: "Intake & Output (I/O)", href: "/nurse/monitoring/io" },
          { label: "Pain Assessment", href: "/nurse/monitoring/pain" },
          { label: "Glasgow Coma Scale (GCS)", href: "/nurse/monitoring/gcs" },
          { label: "Early Warning Score (NEWS/MEWS)", href: "/nurse/monitoring/ews" },
          { label: "Fall Risk Assessment", href: "/nurse/monitoring/fall-risk" },
          { label: "Pressure Ulcer Assessment", href: "/nurse/monitoring/pressure-ulcer" },
        ]
      },
      {
        icon: Pill,
        label: "Medication Administration",
        href: "/nurse/medication",
        subItems: [
          { label: "Medication Schedule", href: "/nurse/medication/schedule" },
          { label: "MAR (Medication Administration Record)", href: "/nurse/medication/mar" },
          { label: "IV Fluids", href: "/nurse/medication/iv-fluids" },
          { label: "Injections", href: "/nurse/medication/injections" },
          { label: "Blood Transfusion", href: "/nurse/medication/blood" },
          { label: "Medication History", href: "/nurse/medication/history" },
          { label: "Missed Medications", href: "/nurse/medication/missed" },
        ]
      },
      {
        icon: ClipboardList,
        label: "Doctor Orders",
        href: "/nurse/orders",
        subItems: [
          { label: "New Orders", href: "/nurse/orders/new" },
          { label: "Pending Orders", href: "/nurse/orders/pending" },
          { label: "Completed Orders", href: "/nurse/orders/completed" },
          { label: "STAT Orders", href: "/nurse/orders/stat" },
          { label: "Nursing Tasks", href: "/nurse/orders/tasks" },
        ]
      },
      {
        icon: Stethoscope,
        label: "Clinical Care",
        href: "/nurse/care",
        subItems: [
          { label: "Nursing Notes", href: "/nurse/care/notes" },
          { label: "Care Plan", href: "/nurse/care/plan" },
          { label: "Progress Notes", href: "/nurse/care/progress" },
          { label: "Dressing Management", href: "/nurse/care/dressing" },
          { label: "Catheter Care", href: "/nurse/care/catheter" },
          { label: "Wound Care", href: "/nurse/care/wound" },
          { label: "Drain Management", href: "/nurse/care/drain" },
        ]
      },
      {
        icon: AlertCircle,
        label: "Emergency & Code Blue",
        href: "/nurse/emergency",
        subItems: [
          { label: "Emergency Patients", href: "/nurse/emergency/patients" },
          { label: "Code Blue Events", href: "/nurse/emergency/code-blue" },
          { label: "CPR Documentation", href: "/nurse/emergency/cpr" },
          { label: "Emergency Medication", href: "/nurse/emergency/medication" },
        ]
      },
      {
        icon: Activity,
        label: "ICU & Critical Care",
        href: "/nurse/icu",
        subItems: [
          { label: "ICU Monitoring", href: "/nurse/icu/monitoring" },
          { label: "Ventilator Monitoring", href: "/nurse/icu/ventilator" },
          { label: "Central Line Monitoring", href: "/nurse/icu/central-line" },
          { label: "Dialysis Monitoring", href: "/nurse/icu/dialysis" },
        ]
      },
      {
        icon: FileText,
        label: "Patient Education",
        href: "/nurse/education",
        subItems: [
          { label: "Diet Education", href: "/nurse/education/diet" },
          { label: "Medication Education", href: "/nurse/education/medication" },
          { label: "Discharge Education", href: "/nurse/education/discharge" },
          { label: "Home Care Instructions", href: "/nurse/education/home-care" },
        ]
      },
      {
        icon: FlaskConical,
        label: "Specimen Management",
        href: "/nurse/specimen",
        subItems: [
          { label: "Sample Collection", href: "/nurse/specimen/collection" },
          { label: "Sample Dispatch", href: "/nurse/specimen/dispatch" },
          { label: "Pending Collections", href: "/nurse/specimen/pending" },
        ]
      },
      {
        icon: CheckSquare,
        label: "Care Checklists",
        href: "/nurse/checklists",
        subItems: [
          { label: "Admission Checklist", href: "/nurse/checklists/admission" },
          { label: "Shift Checklist", href: "/nurse/checklists/shift" },
          { label: "OT Checklist", href: "/nurse/checklists/ot" },
          { label: "ICU Checklist", href: "/nurse/checklists/icu" },
          { label: "Discharge Checklist", href: "/nurse/checklists/discharge" },
          { label: "Infection Control Checklist", href: "/nurse/checklists/infection" },
        ]
      },
      {
        icon: Clipboard,
        label: "Clinical Documentation",
        href: "/nurse/documentation",
        subItems: [
          { label: "Nursing Assessment", href: "/nurse/documentation/assessment" },
          { label: "Nursing Care Plan", href: "/nurse/documentation/care-plan" },
          { label: "Shift Handover Notes", href: "/nurse/documentation/handover" },
          { label: "Incident Reports", href: "/nurse/documentation/incident" },
        ]
      },
      {
        icon: MessageCircle,
        label: "Communication",
        href: "/nurse/communication",
        subItems: [
          { label: "Doctor Communication", href: "/nurse/communication/doctor" },
          { label: "Internal Messages", href: "/nurse/communication/messages" },
          { label: "Nurse Handover", href: "/nurse/communication/handover" },
        ]
      },
      {
        icon: BarChart3,
        label: "Reports",
        href: "/nurse/reports",
        subItems: [
          { label: "Nursing Census", href: "/nurse/reports/census" },
          { label: "Medication Report", href: "/nurse/reports/medication" },
          { label: "Vital Signs Report", href: "/nurse/reports/vitals" },
          { label: "Patient Care Report", href: "/nurse/reports/care" },
          { label: "Incident Report", href: "/nurse/reports/incident" },
          { label: "Shift Report", href: "/nurse/reports/shift" },
        ]
      },
      {
        icon: Star,
        label: "My Performance",
        href: "/nurse/performance",
        subItems: [
          { label: "Task Completion", href: "/nurse/performance/tasks" },
          { label: "Patient Assignments", href: "/nurse/performance/assignments" },
          { label: "Medication Compliance", href: "/nurse/performance/medication" },
          { label: "Nursing KPIs", href: "/nurse/performance/kpis" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/nurse/settings",
        subItems: [
          { label: "Nurse Profile", href: "/nurse/settings/profile" },
          { label: "Preferences", href: "/nurse/settings/preferences" },
        ]
      }
    ];
  } else if (dept === 'receptionist' || dept === 'reception') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/receptionist",
      },
      {
        icon: Users,
        label: "Patient Management",
        href: "/patients",
        subItems: [
          { label: "Patient Registration", href: "/patients/add" },
          { label: "Patient Search", href: "/patients" },
          { label: "Demographics", href: "/patients/demographics" },
          { label: "Consents & Forms", href: "/patients/consents" },
          { label: "Patient Documents", href: "/patients/documents" },
          { label: "Patient Photo Capture", href: "/patients/photo" },
          { label: "Patient ID Card", href: "/patients/id-card" },
        ]
      },
      {
        icon: Calendar,
        label: "Appointments",
        href: "/appointments",
        subItems: [
          { label: "Book Appointment", href: "/appointments/add" },
          { label: "Appointment Schedule", href: "/appointments/calendar" },
          { label: "Doctor Availability", href: "/appointments/availability" },
          { label: "Today's Queue", href: "/appointments/queue" },
          { label: "Check-In", href: "/appointments/check-in" },
          { label: "Walk-In Patients", href: "/appointments/walk-in" },
          { label: "Follow-up Appointments", href: "/appointments/follow-up" },
          { label: "Telemedicine Appointments", href: "/appointments/telemedicine" },
        ]
      },
      {
        icon: Hotel,
        label: "Admissions",
        href: "/admissions",
        subItems: [
          { label: "IPD Admission", href: "/admissions/ipd" },
          { label: "Bed Status", href: "/admissions/bed-status" },
          { label: "Room Allotment", href: "/room-allotment" },
          { label: "Patient Transfer", href: "/admissions/transfer" },
          { label: "Admission Requests", href: "/room-allotment/requests" },
        ]
      },
      {
        icon: UserCheck,
        label: "Visitor Management",
        href: "/visitors",
        subItems: [
          { label: "Visitor Registration", href: "/visitors/register" },
          { label: "Visitor Pass", href: "/visitors/pass" },
          { label: "Visitor History", href: "/visitors/history" },
          { label: "Visitor Approval", href: "/visitors/approval" },
        ]
      },
      {
        icon: MessageCircle,
        label: "Help Desk",
        href: "/helpdesk",
        subItems: [
          { label: "General Enquiry", href: "/helpdesk/enquiry" },
          { label: "Doctor Directory", href: "/doctors" },
          { label: "Department Directory", href: "/departments" },
          { label: "Hospital Services", href: "/helpdesk/services" },
          { label: "Health Packages", href: "/helpdesk/packages" },
        ]
      },
      {
        icon: Mail,
        label: "Communication",
        href: "/communication",
        subItems: [
          { label: "SMS Center", href: "/communication/sms" },
          { label: "WhatsApp Center", href: "/communication/whatsapp" },
          { label: "Email Notifications", href: "/communication/email" },
          { label: "Appointment Reminders", href: "/communication/reminders" },
        ]
      },
      {
        icon: MessageSquare,
        label: "Patient Support",
        href: "/support",
        subItems: [
          { label: "Feedback", href: "/feedback" },
          { label: "Complaints", href: "/support/complaints" },
          { label: "Suggestions", href: "/support/suggestions" },
          { label: "Lost & Found", href: "/support/lost-found" },
        ]
      },
      {
        icon: BarChart3,
        label: "Reports",
        href: "/reports",
        subItems: [
          { label: "Registration Report", href: "/reports/registration" },
          { label: "Appointment Report", href: "/reports/appointment" },
          { label: "Queue Report", href: "/reports/queue" },
          { label: "Admission Report", href: "/reports/admission" },
          { label: "Visitor Report", href: "/reports/visitor" },
          { label: "Reception Performance", href: "/reports/reception-performance" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/settings",
        subItems: [
          { label: "Reception Profile", href: "/settings/profile" },
          { label: "Preferences", href: "/settings/preferences" },
        ]
      }
    ];
  } else if (dept === 'laboratory' || dept === 'diagnostics') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/diagnostics",
      },
      {
        icon: ClipboardList,
        label: "Orders Management",
        href: "/diagnostics/orders",
        subItems: [
          { label: "Pending Orders", href: "/diagnostics/orders/pending" },
          { label: "Today's Orders", href: "/diagnostics/orders/today" },
          { label: "Emergency Orders", href: "/diagnostics/orders/emergency" },
          { label: "STAT Orders", href: "/diagnostics/orders/stat" },
          { label: "Referral Orders", href: "/diagnostics/orders/referral" },
        ]
      },
      {
        icon: FlaskConical,
        label: "Sample Collection",
        href: "/diagnostics/sample",
        subItems: [
          { label: "Sample Collection", href: "/diagnostics/sample/collection" },
          { label: "Barcode Printing", href: "/diagnostics/sample/barcode" },
          { label: "Sample Tracking", href: "/diagnostics/sample/tracking" },
          { label: "Sample Rejection", href: "/diagnostics/sample/rejection" },
          { label: "Home Collection", href: "/diagnostics/sample/home" },
          { label: "Collection History", href: "/diagnostics/sample/history" },
        ]
      },
      {
        icon: FileText,
        label: "Laboratory",
        href: "/diagnostics/laboratory",
        subItems: [
          { label: "Test Queue", href: "/diagnostics/laboratory/queue" },
          { label: "Sample Processing", href: "/diagnostics/laboratory/processing" },
          { label: "Test Entry", href: "/diagnostics/laboratory/entry" },
          { label: "Result Verification", href: "/diagnostics/laboratory/verification" },
          { label: "Result Authorization", href: "/diagnostics/laboratory/authorization" },
          { label: "Critical Values", href: "/diagnostics/laboratory/critical" },
          { label: "Laboratory Reports", href: "/diagnostics/laboratory/reports" },
        ]
      },
      {
        icon: Activity,
        label: "Radiology",
        href: "/diagnostics/radiology",
        subItems: [
          { label: "X-Ray", href: "/diagnostics/radiology/xray" },
          { label: "Ultrasound", href: "/diagnostics/radiology/ultrasound" },
          { label: "CT Scan", href: "/diagnostics/radiology/ctscan" },
          { label: "MRI", href: "/diagnostics/radiology/mri" },
          { label: "Mammography", href: "/diagnostics/radiology/mammography" },
          { label: "DEXA Scan", href: "/diagnostics/radiology/dexa" },
          { label: "Fluoroscopy", href: "/diagnostics/radiology/fluoroscopy" },
          { label: "Radiology Reports", href: "/diagnostics/radiology/reports" },
        ]
      },
      {
        icon: HeartPulse,
        label: "Cardiology Diagnostics",
        href: "/diagnostics/cardiology",
        subItems: [
          { label: "ECG", href: "/diagnostics/cardiology/ecg" },
          { label: "Echo", href: "/diagnostics/cardiology/echo" },
          { label: "TMT", href: "/diagnostics/cardiology/tmt" },
          { label: "Holter Monitoring", href: "/diagnostics/cardiology/holter" },
          { label: "Stress Test", href: "/diagnostics/cardiology/stress" },
          { label: "Cardiology Reports", href: "/diagnostics/cardiology/reports" },
        ]
      },
      {
        icon: Syringe,
        label: "Blood Bank",
        href: "/diagnostics/blood-bank",
        subItems: [
          { label: "Blood Inventory", href: "/diagnostics/blood-bank/inventory" },
          { label: "Blood Requests", href: "/diagnostics/blood-bank/requests" },
          { label: "Cross Matching", href: "/diagnostics/blood-bank/cross-matching" },
          { label: "Blood Issue", href: "/diagnostics/blood-bank/issue" },
          { label: "Blood Donation", href: "/diagnostics/blood-bank/donation" },
          { label: "Blood Transfusion", href: "/diagnostics/blood-bank/transfusion" },
          { label: "Blood Component Management", href: "/diagnostics/blood-bank/components" },
        ]
      },
      {
        icon: CheckSquare,
        label: "Quality Control",
        href: "/diagnostics/qc",
        subItems: [
          { label: "Internal QC", href: "/diagnostics/qc/internal" },
          { label: "External QC", href: "/diagnostics/qc/external" },
          { label: "Equipment Calibration", href: "/diagnostics/qc/calibration" },
          { label: "Machine Maintenance", href: "/diagnostics/qc/maintenance" },
          { label: "Reagent Management", href: "/diagnostics/qc/reagent" },
        ]
      },
      {
        icon: Wrench,
        label: "Equipment Management",
        href: "/diagnostics/equipment",
        subItems: [
          { label: "Diagnostic Machines", href: "/diagnostics/equipment/machines" },
          { label: "Maintenance Schedule", href: "/diagnostics/equipment/maintenance" },
          { label: "Calibration", href: "/diagnostics/equipment/calibration" },
          { label: "Downtime Log", href: "/diagnostics/equipment/downtime" },
        ]
      },
      {
        icon: FileText,
        label: "Result Management",
        href: "/diagnostics/results",
        subItems: [
          { label: "Pending Results", href: "/diagnostics/results/pending" },
          { label: "Verified Results", href: "/diagnostics/results/verified" },
          { label: "Released Reports", href: "/diagnostics/results/released" },
          { label: "Amended Reports", href: "/diagnostics/results/amended" },
          { label: "Digital Signature", href: "/diagnostics/results/signature" },
        ]
      },
      {
        icon: Clipboard,
        label: "Patient Reports",
        href: "/diagnostics/patient-reports",
        subItems: [
          { label: "Laboratory Reports", href: "/diagnostics/patient-reports/laboratory" },
          { label: "Radiology Reports", href: "/diagnostics/patient-reports/radiology" },
          { label: "Cardiology Reports", href: "/diagnostics/patient-reports/cardiology" },
          { label: "Blood Bank Reports", href: "/diagnostics/patient-reports/blood-bank" },
          { label: "Download Reports", href: "/diagnostics/patient-reports/download" },
        ]
      },
      {
        icon: MessageCircle,
        label: "Communication",
        href: "/diagnostics/communication",
        subItems: [
          { label: "Notify Doctor", href: "/diagnostics/communication/doctor" },
          { label: "Notify Patient", href: "/diagnostics/communication/patient" },
          { label: "Email Reports", href: "/diagnostics/communication/email" },
          { label: "WhatsApp Reports", href: "/diagnostics/communication/whatsapp" },
          { label: "SMS Notification", href: "/diagnostics/communication/sms" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics & Reports",
        href: "/diagnostics/analytics",
        subItems: [
          { label: "Test Volume Report", href: "/diagnostics/analytics/volume" },
          { label: "Department Performance", href: "/diagnostics/analytics/performance" },
          { label: "Technician Performance", href: "/diagnostics/analytics/technician" },
          { label: "Critical Result Report", href: "/diagnostics/analytics/critical" },
          { label: "TAT Report", href: "/diagnostics/analytics/tat" },
          { label: "Revenue Report", href: "/diagnostics/analytics/revenue" },
          { label: "Pending Test Report", href: "/diagnostics/analytics/pending" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/diagnostics/settings",
        subItems: [
          { label: "Test Master", href: "/diagnostics/settings/master" },
          { label: "Report Templates", href: "/diagnostics/settings/templates" },
          { label: "Machine Integration", href: "/diagnostics/settings/integration" },
          { label: "Reference Range", href: "/diagnostics/settings/reference" },
          { label: "Preferences", href: "/diagnostics/settings/preferences" },
        ]
      }
    ];
  } else if (dept === 'ot') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/ot",
      },
      {
        icon: Calendar,
        label: "OT Scheduling",
        href: "/ot/scheduling",
        subItems: [
          { label: "Surgery Calendar", href: "/ot/scheduling/calendar" },
          { label: "OT Booking", href: "/ot/scheduling/booking" },
          { label: "OT Availability", href: "/ot/scheduling/availability" },
          { label: "Emergency OT", href: "/ot/scheduling/emergency" },
          { label: "Surgery Queue", href: "/ot/scheduling/queue" },
        ]
      },
      {
        icon: Clipboard,
        label: "Pre-Operative",
        href: "/ot/pre-operative",
        subItems: [
          { label: "Surgery Assessment", href: "/ot/pre-operative/assessment" },
          { label: "Pre-Anesthesia Checkup (PAC)", href: "/ot/pre-operative/pac" },
          { label: "Consent Verification", href: "/ot/pre-operative/consent" },
          { label: "Pre-Operative Checklist", href: "/ot/pre-operative/checklist" },
          { label: "Patient Preparation", href: "/ot/pre-operative/preparation" },
        ]
      },
      {
        icon: Activity,
        label: "Operation Theatre",
        href: "/ot/operation-theatre",
        subItems: [
          { label: "Today's Surgeries", href: "/ot/operation-theatre/today" },
          { label: "Active Surgeries", href: "/ot/operation-theatre/active" },
          { label: "OT Allocation", href: "/ot/operation-theatre/allocation" },
          { label: "Surgical Team", href: "/ot/operation-theatre/team" },
          { label: "OT Checklist", href: "/ot/operation-theatre/checklist" },
          { label: "Implant & Consumables", href: "/ot/operation-theatre/implants" },
          { label: "Intraoperative Notes", href: "/ot/operation-theatre/notes" },
        ]
      },
      {
        icon: Syringe,
        label: "Anesthesia",
        href: "/ot/anesthesia",
        subItems: [
          { label: "Anesthesia Assessment", href: "/ot/anesthesia/assessment" },
          { label: "Anesthesia Plan", href: "/ot/anesthesia/plan" },
          { label: "Medication Administration", href: "/ot/anesthesia/medication" },
          { label: "Intraoperative Monitoring", href: "/ot/anesthesia/monitoring" },
          { label: "Recovery Assessment", href: "/ot/anesthesia/recovery" },
        ]
      },
      {
        icon: Hotel,
        label: "Recovery Room (PACU)",
        href: "/ot/recovery",
        subItems: [
          { label: "Recovery Monitoring", href: "/ot/recovery/monitoring" },
          { label: "Recovery Notes", href: "/ot/recovery/notes" },
          { label: "Pain Assessment", href: "/ot/recovery/pain" },
          { label: "Discharge from Recovery", href: "/ot/recovery/discharge" },
        ]
      },
      {
        icon: HeartPulse,
        label: "ICU & Critical Care",
        href: "/ot/icu",
        subItems: [
          { label: "ICU Patients", href: "/ot/icu/icu-patients" },
          { label: "CCU Patients", href: "/ot/icu/ccu-patients" },
          { label: "NICU Patients", href: "/ot/icu/nicu-patients" },
          { label: "PICU Patients", href: "/ot/icu/picu-patients" },
          { label: "SICU Patients", href: "/ot/icu/sicu-patients" },
          { label: "MICU Patients", href: "/ot/icu/micu-patients" },
          { label: "HDU Patients", href: "/ot/icu/hdu-patients" },
        ]
      },
      {
        icon: Stethoscope,
        label: "Critical Monitoring",
        href: "/ot/monitoring",
        subItems: [
          { label: "Live Vitals", href: "/ot/monitoring/vitals" },
          { label: "Ventilator Monitoring", href: "/ot/monitoring/ventilator" },
          { label: "Oxygen Therapy", href: "/ot/monitoring/oxygen" },
          { label: "Infusion Pumps", href: "/ot/monitoring/infusion" },
          { label: "Central Line Monitoring", href: "/ot/monitoring/central-line" },
          { label: "Dialysis Monitoring", href: "/ot/monitoring/dialysis" },
        ]
      },
      {
        icon: Users,
        label: "Patient Care",
        href: "/ot/patient-care",
        subItems: [
          { label: "Daily ICU Rounds", href: "/ot/patient-care/rounds" },
          { label: "Progress Notes", href: "/ot/patient-care/progress" },
          { label: "Nursing Notes", href: "/ot/patient-care/nursing" },
          { label: "Medication Chart", href: "/ot/patient-care/medication" },
          { label: "Intake & Output", href: "/ot/patient-care/io" },
          { label: "Fluid Balance", href: "/ot/patient-care/fluid" },
        ]
      },
      {
        icon: ClipboardList,
        label: "Doctor Orders",
        href: "/ot/orders",
        subItems: [
          { label: "Pending Orders", href: "/ot/orders/pending" },
          { label: "Laboratory Orders", href: "/ot/orders/laboratory" },
          { label: "Radiology Orders", href: "/ot/orders/radiology" },
          { label: "Blood Requests", href: "/ot/orders/blood" },
          { label: "Procedure Orders", href: "/ot/orders/procedure" },
        ]
      },
      {
        icon: FlaskConical,
        label: "Blood & Transfusion",
        href: "/ot/blood",
        subItems: [
          { label: "Blood Requests", href: "/ot/blood/requests" },
          { label: "Cross Match Status", href: "/ot/blood/cross-match" },
          { label: "Blood Issue", href: "/ot/blood/issue" },
          { label: "Transfusion Monitoring", href: "/ot/blood/transfusion" },
        ]
      },
      {
        icon: Package,
        label: "CSSD",
        href: "/ot/cssd",
        subItems: [
          { label: "Instrument Sterilization", href: "/ot/cssd/sterilization" },
          { label: "Instrument Inventory", href: "/ot/cssd/inventory" },
          { label: "Sterile Packs", href: "/ot/cssd/packs" },
          { label: "Autoclave Cycle", href: "/ot/cssd/autoclave" },
          { label: "OT Instrument Tracking", href: "/ot/cssd/tracking" },
        ]
      },
      {
        icon: LogOut,
        label: "Transfers",
        href: "/ot/transfers",
        subItems: [
          { label: "ICU Admission", href: "/ot/transfers/icu-admission" },
          { label: "ICU Transfer", href: "/ot/transfers/icu-transfer" },
          { label: "OT Transfer", href: "/ot/transfers/ot-transfer" },
          { label: "Ward Transfer", href: "/ot/transfers/ward-transfer" },
          { label: "Bed Transfer", href: "/ot/transfers/bed-transfer" },
        ]
      },
      {
        icon: FileText,
        label: "Discharge",
        href: "/ot/discharge",
        subItems: [
          { label: "ICU Discharge", href: "/ot/discharge/icu" },
          { label: "OT Discharge Summary", href: "/ot/discharge/ot" },
          { label: "Critical Care Summary", href: "/ot/discharge/critical" },
          { label: "Follow-up Instructions", href: "/ot/discharge/instructions" },
        ]
      },
      {
        icon: BarChart3,
        label: "Reports",
        href: "/ot/reports",
        subItems: [
          { label: "OT Utilization Report", href: "/ot/reports/utilization" },
          { label: "Surgery Report", href: "/ot/reports/surgery" },
          { label: "ICU Occupancy", href: "/ot/reports/occupancy" },
          { label: "Ventilator Usage", href: "/ot/reports/ventilator" },
          { label: "Mortality Report", href: "/ot/reports/mortality" },
          { label: "Infection Report", href: "/ot/reports/infection" },
          { label: "Critical Care Report", href: "/ot/reports/critical" },
        ]
      },
      {
        icon: Star,
        label: "Analytics",
        href: "/ot/analytics",
        subItems: [
          { label: "OT Performance", href: "/ot/analytics/performance" },
          { label: "Surgeon Performance", href: "/ot/analytics/surgeon" },
          { label: "Surgery Duration", href: "/ot/analytics/duration" },
          { label: "ICU KPIs", href: "/ot/analytics/kpis" },
          { label: "Bed Utilization", href: "/ot/analytics/bed-utilization" },
          { label: "Equipment Utilization", href: "/ot/analytics/equipment-utilization" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/ot/settings",
        subItems: [
          { label: "Surgery Types", href: "/ot/settings/surgery-types" },
          { label: "OT Rooms", href: "/ot/settings/rooms" },
          { label: "Procedure Templates", href: "/ot/settings/templates" },
          { label: "OT Preferences", href: "/ot/settings/preferences" },
        ]
      }
    ];
  } else if (dept === 'pharmacy' || dept === 'pharmacist') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/pharmacy",
      },
      {
        icon: ClipboardList,
        label: "Prescription Management",
        href: "/pharmacy/prescriptions",
        subItems: [
          { label: "Prescription Queue", href: "/pharmacy/prescriptions/queue" },
          { label: "New Prescription", href: "/pharmacy/prescriptions/new" },
          { label: "Pending Verification", href: "/pharmacy/prescriptions/verification" },
          { label: "Dispensing Queue", href: "/pharmacy/prescriptions/dispensing" },
          { label: "E-Prescriptions", href: "/pharmacy/prescriptions/e-prescriptions" },
        ]
      },
      {
        icon: Pill,
        label: "Medicine Dispensing",
        href: "/pharmacy/dispensing",
        subItems: [
          { label: "OPD Dispensing", href: "/pharmacy/dispensing/opd" },
          { label: "IPD Dispensing", href: "/pharmacy/dispensing/ipd" },
          { label: "Emergency Dispensing", href: "/pharmacy/dispensing/emergency" },
          { label: "Discharge Medicines", href: "/pharmacy/dispensing/discharge" },
          { label: "Partial Dispensing", href: "/pharmacy/dispensing/partial" },
          { label: "Return Medicines", href: "/pharmacy/dispensing/return" },
        ]
      },
      {
        icon: Package,
        label: "Medicine Inventory",
        href: "/pharmacy/inventory",
        subItems: [
          { label: "Current Stock", href: "/pharmacy/inventory/current" },
          { label: "Stock Availability", href: "/pharmacy/inventory/availability" },
          { label: "Batch Management", href: "/pharmacy/inventory/batch" },
          { label: "Expiry Management", href: "/pharmacy/inventory/expiry" },
          { label: "Near Expiry", href: "/pharmacy/inventory/near-expiry" },
          { label: "Damaged Medicines", href: "/pharmacy/inventory/damaged" },
          { label: "Stock Adjustment", href: "/pharmacy/inventory/adjustment" },
        ]
      },
      {
        icon: ShoppingBag,
        label: "Purchase & Procurement",
        href: "/pharmacy/purchase",
        subItems: [
          { label: "Purchase Requisition", href: "/pharmacy/purchase/requisition" },
          { label: "Purchase Orders", href: "/pharmacy/purchase/orders" },
          { label: "Goods Receipt (GRN)", href: "/pharmacy/purchase/grn" },
          { label: "Vendor Management", href: "/pharmacy/purchase/vendor" },
          { label: "Purchase Returns", href: "/pharmacy/purchase/returns" },
          { label: "Invoice Verification", href: "/pharmacy/purchase/invoice" },
        ]
      },
      {
        icon: FileText,
        label: "Medicine Master",
        href: "/pharmacy/master",
        subItems: [
          { label: "Medicine Catalog", href: "/pharmacy/master/catalog" },
          { label: "Generic Medicines", href: "/pharmacy/master/generic" },
          { label: "Brand Medicines", href: "/pharmacy/master/brand" },
          { label: "Drug Classification", href: "/pharmacy/master/classification" },
          { label: "Strength & Dosage", href: "/pharmacy/master/strength" },
          { label: "Manufacturers", href: "/pharmacy/master/manufacturers" },
        ]
      },
      {
        icon: Stethoscope,
        label: "Clinical Pharmacy",
        href: "/pharmacy/clinical",
        subItems: [
          { label: "Drug Interaction Check", href: "/pharmacy/clinical/interaction" },
          { label: "Allergy Check", href: "/pharmacy/clinical/allergy" },
          { label: "Duplicate Therapy", href: "/pharmacy/clinical/duplicate" },
          { label: "High Risk Medicines", href: "/pharmacy/clinical/high-risk" },
          { label: "Antibiotic Stewardship", href: "/pharmacy/clinical/antibiotic" },
        ]
      },
      {
        icon: Shield,
        label: "Controlled Drugs",
        href: "/pharmacy/controlled",
        subItems: [
          { label: "Narcotic Register", href: "/pharmacy/controlled/narcotic" },
          { label: "Controlled Drug Issue", href: "/pharmacy/controlled/issue" },
          { label: "Controlled Drug Returns", href: "/pharmacy/controlled/returns" },
          { label: "Controlled Drug Audit", href: "/pharmacy/controlled/audit" },
        ]
      },
      {
        icon: Receipt,
        label: "Billing",
        href: "/pharmacy/billing",
        subItems: [
          { label: "Pharmacy Billing", href: "/pharmacy/billing/pharmacy" },
          { label: "Insurance Billing", href: "/pharmacy/billing/insurance" },
          { label: "Corporate Billing", href: "/pharmacy/billing/corporate" },
          { label: "Government Scheme Billing", href: "/pharmacy/billing/scheme" },
          { label: "Refunds", href: "/pharmacy/billing/refunds" },
          { label: "Credit Billing", href: "/pharmacy/billing/credit" },
        ]
      },
      {
        icon: Users,
        label: "Patient Services",
        href: "/pharmacy/services",
        subItems: [
          { label: "Medication History", href: "/pharmacy/services/history" },
          { label: "Refill Requests", href: "/pharmacy/services/refill" },
          { label: "Patient Counseling", href: "/pharmacy/services/counseling" },
          { label: "Home Delivery", href: "/pharmacy/services/delivery" },
          { label: "Medication Reminders", href: "/pharmacy/services/reminders" },
        ]
      },
      {
        icon: Activity,
        label: "Inventory Operations",
        href: "/pharmacy/operations",
        subItems: [
          { label: "Stock Transfer", href: "/pharmacy/operations/transfer" },
          { label: "Internal Issue", href: "/pharmacy/operations/issue" },
          { label: "Stock Return", href: "/pharmacy/operations/return" },
          { label: "Physical Stock Audit", href: "/pharmacy/operations/audit" },
          { label: "Cycle Count", href: "/pharmacy/operations/cycle-count" },
        ]
      },
      {
        icon: CheckSquare,
        label: "Quality & Compliance",
        href: "/pharmacy/quality",
        subItems: [
          { label: "Expired Medicines", href: "/pharmacy/quality/expired" },
          { label: "Recall Management", href: "/pharmacy/quality/recall" },
          { label: "Temperature Monitoring", href: "/pharmacy/quality/temperature" },
          { label: "Cold Chain Management", href: "/pharmacy/quality/cold-chain" },
          { label: "Regulatory Compliance", href: "/pharmacy/quality/compliance" },
        ]
      },
      {
        icon: BarChart3,
        label: "Reports",
        href: "/pharmacy/reports",
        subItems: [
          { label: "Daily Sales", href: "/pharmacy/reports/sales" },
          { label: "Medicine Sales", href: "/pharmacy/reports/medicine-sales" },
          { label: "Stock Report", href: "/pharmacy/reports/stock" },
          { label: "Expiry Report", href: "/pharmacy/reports/expiry" },
          { label: "Purchase Report", href: "/pharmacy/reports/purchase" },
          { label: "Dispensing Report", href: "/pharmacy/reports/dispensing" },
          { label: "Controlled Drug Report", href: "/pharmacy/reports/controlled" },
          { label: "Profit & Loss", href: "/pharmacy/reports/pl" },
          { label: "Inventory Valuation", href: "/pharmacy/reports/valuation" },
        ]
      },
      {
        icon: Star,
        label: "Analytics",
        href: "/pharmacy/analytics",
        subItems: [
          { label: "Fast Moving Medicines", href: "/pharmacy/analytics/fast-moving" },
          { label: "Slow Moving Medicines", href: "/pharmacy/analytics/slow-moving" },
          { label: "ABC Analysis", href: "/pharmacy/analytics/abc" },
          { label: "XYZ Analysis", href: "/pharmacy/analytics/xyz" },
          { label: "Drug Consumption", href: "/pharmacy/analytics/consumption" },
          { label: "Pharmacist Performance", href: "/pharmacy/analytics/performance" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/pharmacy/settings",
        subItems: [
          { label: "Pharmacy Profile", href: "/pharmacy/settings/profile" },
          { label: "Medicine Categories", href: "/pharmacy/settings/categories" },
          { label: "Units of Measure", href: "/pharmacy/settings/units" },
          { label: "Tax Configuration", href: "/pharmacy/settings/tax" },
          { label: "Discount Rules", href: "/pharmacy/settings/discount" },
        ]
      }
    ];
  } else if (dept === 'inventory') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/inventory",
      },
      {
        icon: Package,
        label: "Item Master",
        href: "/inventory/master",
        subItems: [
          { label: "Item Master", href: "/inventory/master/items" },
          { label: "Categories", href: "/inventory/master/categories" },
          { label: "Sub Categories", href: "/inventory/master/subcategories" },
          { label: "Units of Measure", href: "/inventory/master/units" },
          { label: "Brands", href: "/inventory/master/brands" },
          { label: "Manufacturers", href: "/inventory/master/manufacturers" },
          { label: "Item Mapping", href: "/inventory/master/mapping" },
          { label: "Barcode / QR Code", href: "/inventory/master/barcode" },
        ]
      },
      {
        icon: Hotel,
        label: "Warehouse Management",
        href: "/inventory/warehouse",
        subItems: [
          { label: "Warehouses", href: "/inventory/warehouse/list" },
          { label: "Store Locations", href: "/inventory/warehouse/locations" },
          { label: "Rack Management", href: "/inventory/warehouse/racks" },
          { label: "Bin Management", href: "/inventory/warehouse/bins" },
        ]
      },
      {
        icon: ClipboardList,
        label: "Stock Management",
        href: "/inventory/stock",
        subItems: [
          { label: "Current Stock", href: "/inventory/stock/current" },
          { label: "Stock Ledger", href: "/inventory/stock/ledger" },
          { label: "Stock Availability", href: "/inventory/stock/availability" },
          { label: "Stock Adjustment", href: "/inventory/stock/adjustment" },
          { label: "Opening Stock", href: "/inventory/stock/opening" },
          { label: "Closing Stock", href: "/inventory/stock/closing" },
          { label: "Reorder Level", href: "/inventory/stock/reorder" },
          { label: "Minimum & Maximum Stock", href: "/inventory/stock/min-max" },
        ]
      },
      {
        icon: Clock,
        label: "Batch & Expiry",
        href: "/inventory/batch",
        subItems: [
          { label: "Batch Management", href: "/inventory/batch/management" },
          { label: "Expiry Monitoring", href: "/inventory/batch/expiry" },
          { label: "Near Expiry", href: "/inventory/batch/near-expiry" },
          { label: "Expired Items", href: "/inventory/batch/expired" },
          { label: "Recall Management", href: "/inventory/batch/recall" },
        ]
      },
      {
        icon: Receipt,
        label: "Goods Receipt",
        href: "/inventory/grn",
        subItems: [
          { label: "Goods Receipt Note (GRN)", href: "/inventory/grn/note" },
          { label: "GRN Verification", href: "/inventory/grn/verification" },
          { label: "GRN History", href: "/inventory/grn/history" },
          { label: "Pending GRN", href: "/inventory/grn/pending" },
        ]
      },
      {
        icon: Clipboard,
        label: "Department Issue",
        href: "/inventory/issue",
        subItems: [
          { label: "Issue Request", href: "/inventory/issue/request" },
          { label: "Pending Requests", href: "/inventory/issue/pending" },
          { label: "Approved Issues", href: "/inventory/issue/approved" },
          { label: "Issue Slip", href: "/inventory/issue/slip" },
          { label: "Issue History", href: "/inventory/issue/history" },
        ]
      },
      {
        icon: FileText,
        label: "Department Returns",
        href: "/inventory/returns",
        subItems: [
          { label: "Return Requests", href: "/inventory/returns/request" },
          { label: "Return Approval", href: "/inventory/returns/approval" },
          { label: "Return History", href: "/inventory/returns/history" },
          { label: "Damaged Returns", href: "/inventory/returns/damaged" },
        ]
      },
      {
        icon: LogOut,
        label: "Internal Transfers",
        href: "/inventory/transfers",
        subItems: [
          { label: "Store Transfer", href: "/inventory/transfers/store" },
          { label: "Ward Transfer", href: "/inventory/transfers/ward" },
          { label: "Pharmacy Transfer", href: "/inventory/transfers/pharmacy" },
          { label: "Laboratory Transfer", href: "/inventory/transfers/laboratory" },
          { label: "OT Transfer", href: "/inventory/transfers/ot" },
          { label: "ICU Transfer", href: "/inventory/transfers/icu" },
          { label: "Asset Transfer", href: "/inventory/transfers/asset" },
        ]
      },
      {
        icon: Syringe,
        label: "Consumables",
        href: "/inventory/consumables",
        subItems: [
          { label: "Ward Consumables", href: "/inventory/consumables/ward" },
          { label: "OT Consumables", href: "/inventory/consumables/ot" },
          { label: "ICU Consumables", href: "/inventory/consumables/icu" },
          { label: "Laboratory Consumables", href: "/inventory/consumables/laboratory" },
          { label: "Radiology Consumables", href: "/inventory/consumables/radiology" },
        ]
      },
      {
        icon: Wrench,
        label: "Assets",
        href: "/inventory/assets",
        subItems: [
          { label: "Asset Register", href: "/inventory/assets/register" },
          { label: "Asset Allocation", href: "/inventory/assets/allocation" },
          { label: "Asset Movement", href: "/inventory/assets/movement" },
          { label: "Asset Verification", href: "/inventory/assets/verification" },
          { label: "Asset Disposal", href: "/inventory/assets/disposal" },
        ]
      },
      {
        icon: Activity,
        label: "Biomedical Equipment",
        href: "/inventory/biomedical",
        subItems: [
          { label: "Equipment Register", href: "/inventory/biomedical/register" },
          { label: "Equipment Allocation", href: "/inventory/biomedical/allocation" },
          { label: "Calibration", href: "/inventory/biomedical/calibration" },
          { label: "Preventive Maintenance", href: "/inventory/biomedical/maintenance" },
          { label: "Breakdown History", href: "/inventory/biomedical/breakdown" },
          { label: "AMC Tracking", href: "/inventory/biomedical/amc" },
        ]
      },
      {
        icon: CheckSquare,
        label: "Physical Verification",
        href: "/inventory/verification",
        subItems: [
          { label: "Physical Stock Count", href: "/inventory/verification/count" },
          { label: "Cycle Count", href: "/inventory/verification/cycle" },
          { label: "Stock Reconciliation", href: "/inventory/verification/reconciliation" },
          { label: "Variance Report", href: "/inventory/verification/variance" },
        ]
      },
      {
        icon: FileText,
        label: "Inventory Reports",
        href: "/inventory/reports",
        subItems: [
          { label: "Stock Report", href: "/inventory/reports/stock" },
          { label: "Stock Valuation", href: "/inventory/reports/valuation" },
          { label: "Stock Movement", href: "/inventory/reports/movement" },
          { label: "Item Consumption", href: "/inventory/reports/consumption" },
          { label: "Department Consumption", href: "/inventory/reports/department" },
          { label: "Expiry Report", href: "/inventory/reports/expiry" },
          { label: "Batch Report", href: "/inventory/reports/batch" },
          { label: "Dead Stock Report", href: "/inventory/reports/dead-stock" },
          { label: "Slow Moving Items", href: "/inventory/reports/slow-moving" },
          { label: "Fast Moving Items", href: "/inventory/reports/fast-moving" },
          { label: "ABC Analysis", href: "/inventory/reports/abc" },
          { label: "XYZ Analysis", href: "/inventory/reports/xyz" },
          { label: "FSN Analysis", href: "/inventory/reports/fsn" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/inventory/analytics",
        subItems: [
          { label: "Inventory Dashboard", href: "/inventory/analytics/dashboard" },
          { label: "Department Consumption", href: "/inventory/analytics/department" },
          { label: "Stock Turnover", href: "/inventory/analytics/turnover" },
          { label: "Inventory Cost Analysis", href: "/inventory/analytics/cost" },
          { label: "Reorder Analysis", href: "/inventory/analytics/reorder" },
          { label: "Monthly Trends", href: "/inventory/analytics/trends" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/inventory/settings",
        subItems: [
          { label: "Inventory Settings", href: "/inventory/settings/general" },
          { label: "Number Series", href: "/inventory/settings/number-series" },
          { label: "Barcode Settings", href: "/inventory/settings/barcode" },
          { label: "Approval Rules", href: "/inventory/settings/approval" },
        ]
      }
    ];
  } else if (dept === 'finance' || dept === 'accountant') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/finance",
      },
      {
        icon: Receipt,
        label: "Patient Billing",
        href: "/finance/billing",
        subItems: [
          { label: "OPD Billing", href: "/finance/billing/opd" },
          { label: "IPD Billing", href: "/finance/billing/ipd" },
          { label: "Emergency Billing", href: "/finance/billing/emergency" },
          { label: "Pharmacy Billing", href: "/finance/billing/pharmacy" },
          { label: "Laboratory Billing", href: "/finance/billing/laboratory" },
          { label: "Radiology Billing", href: "/finance/billing/radiology" },
          { label: "Procedure Billing", href: "/finance/billing/procedure" },
          { label: "Package Billing", href: "/finance/billing/package" },
          { label: "Corporate Billing", href: "/finance/billing/corporate" },
        ]
      },
      {
        icon: Wallet,
        label: "Cash & Receipts",
        href: "/finance/cash",
        subItems: [
          { label: "Cash Collection", href: "/finance/cash/collection" },
          { label: "Receipt Entry", href: "/finance/cash/receipt" },
          { label: "Advance Collection", href: "/finance/cash/advance" },
          { label: "Refund Management", href: "/finance/cash/refund" },
          { label: "Deposit Management", href: "/finance/cash/deposit" },
          { label: "Shift Closing", href: "/finance/cash/shift" },
          { label: "Cash Book", href: "/finance/cash/book" },
        ]
      },
      {
        icon: CreditCard,
        label: "Patient Payments",
        href: "/finance/payments",
        subItems: [
          { label: "Outstanding Payments", href: "/finance/payments/outstanding" },
          { label: "Payment History", href: "/finance/payments/history" },
          { label: "Payment Adjustments", href: "/finance/payments/adjustments" },
          { label: "Credit Settlement", href: "/finance/payments/settlement" },
          { label: "Payment Plans", href: "/finance/payments/plans" },
        ]
      },
      {
        icon: Shield,
        label: "Insurance & TPA",
        href: "/finance/insurance",
        subItems: [
          { label: "Insurance Verification", href: "/finance/insurance/verification" },
          { label: "Pre-Authorization", href: "/finance/insurance/preauth" },
          { label: "Cashless Approval", href: "/finance/insurance/approval" },
          { label: "Claim Submission", href: "/finance/insurance/submission" },
          { label: "Claim Tracking", href: "/finance/insurance/tracking" },
          { label: "Claim Settlement", href: "/finance/insurance/settlement" },
          { label: "Claim Rejection", href: "/finance/insurance/rejection" },
          { label: "TPA Management", href: "/finance/insurance/tpa" },
        ]
      },
      {
        icon: Landmark,
        label: "Government Schemes",
        href: "/finance/schemes",
        subItems: [
          { label: "Ayushman Bharat (PM-JAY)", href: "/finance/schemes/ayushman" },
          { label: "CGHS", href: "/finance/schemes/cghs" },
          { label: "ESIC", href: "/finance/schemes/esic" },
          { label: "MJPJAY", href: "/finance/schemes/mjpjay" },
          { label: "State Health Schemes", href: "/finance/schemes/state" },
          { label: "Scheme Verification", href: "/finance/schemes/verification" },
          { label: "Package Approval", href: "/finance/schemes/approval" },
          { label: "Claim Management", href: "/finance/schemes/claims" },
        ]
      },
      {
        icon: Banknote,
        label: "Accounts Receivable (AR)",
        href: "/finance/ar",
        subItems: [
          { label: "Patient Receivables", href: "/finance/ar/patient" },
          { label: "Insurance Receivables", href: "/finance/ar/insurance" },
          { label: "Corporate Receivables", href: "/finance/ar/corporate" },
          { label: "Aging Analysis", href: "/finance/ar/aging" },
          { label: "Collection Follow-up", href: "/finance/ar/collection" },
        ]
      },
      {
        icon: Calculator,
        label: "Accounts Payable (AP)",
        href: "/finance/ap",
        subItems: [
          { label: "Vendor Bills", href: "/finance/ap/bills" },
          { label: "Purchase Invoices", href: "/finance/ap/invoices" },
          { label: "Payment Approval", href: "/finance/ap/approval" },
          { label: "Vendor Payments", href: "/finance/ap/payments" },
          { label: "Outstanding Payables", href: "/finance/ap/outstanding" },
        ]
      },
      {
        icon: FileText,
        label: "Accounting",
        href: "/finance/accounting",
        subItems: [
          { label: "Journal Entries", href: "/finance/accounting/journal" },
          { label: "General Ledger", href: "/finance/accounting/ledger" },
          { label: "Chart of Accounts", href: "/finance/accounting/coa" },
          { label: "Cost Centers", href: "/finance/accounting/cost-centers" },
          { label: "Trial Balance", href: "/finance/accounting/trial-balance" },
          { label: "Opening Balances", href: "/finance/accounting/opening" },
        ]
      },
      {
        icon: Landmark,
        label: "Banking",
        href: "/finance/banking",
        subItems: [
          { label: "Bank Accounts", href: "/finance/banking/accounts" },
          { label: "Bank Deposits", href: "/finance/banking/deposits" },
          { label: "Bank Payments", href: "/finance/banking/payments" },
          { label: "Bank Transfers", href: "/finance/banking/transfers" },
          { label: "Bank Reconciliation", href: "/finance/banking/reconciliation" },
        ]
      },
      {
        icon: Percent,
        label: "Taxation",
        href: "/finance/taxation",
        subItems: [
          { label: "GST", href: "/finance/taxation/gst" },
          { label: "TDS", href: "/finance/taxation/tds" },
          { label: "Tax Invoices", href: "/finance/taxation/invoices" },
          { label: "Credit Notes", href: "/finance/taxation/credit" },
          { label: "Debit Notes", href: "/finance/taxation/debit" },
          { label: "Tax Reports", href: "/finance/taxation/reports" },
        ]
      },
      {
        icon: Wrench,
        label: "Fixed Assets",
        href: "/finance/assets",
        subItems: [
          { label: "Asset Register", href: "/finance/assets/register" },
          { label: "Asset Depreciation", href: "/finance/assets/depreciation" },
          { label: "Asset Capitalization", href: "/finance/assets/capitalization" },
          { label: "Asset Disposal", href: "/finance/assets/disposal" },
        ]
      },
      {
        icon: Users,
        label: "Payroll Finance",
        href: "/finance/payroll",
        subItems: [
          { label: "Salary Posting", href: "/finance/payroll/salary" },
          { label: "Payroll Journal", href: "/finance/payroll/journal" },
          { label: "Statutory Deductions", href: "/finance/payroll/deductions" },
          { label: "PF / ESI Posting", href: "/finance/payroll/pf-esi" },
        ]
      },
      {
        icon: Activity,
        label: "Revenue Management",
        href: "/finance/revenue",
        subItems: [
          { label: "Department Revenue", href: "/finance/revenue/department" },
          { label: "Doctor Revenue", href: "/finance/revenue/doctor" },
          { label: "Package Revenue", href: "/finance/revenue/package" },
          { label: "Daily Revenue", href: "/finance/revenue/daily" },
          { label: "Monthly Revenue", href: "/finance/revenue/monthly" },
          { label: "Revenue Analytics", href: "/finance/revenue/analytics" },
        ]
      },
      {
        icon: FileText,
        label: "Financial Reports",
        href: "/finance/reports",
        subItems: [
          { label: "Daily Collection", href: "/finance/reports/collection" },
          { label: "Revenue Report", href: "/finance/reports/revenue" },
          { label: "Income Statement (P&L)", href: "/finance/reports/pl" },
          { label: "Balance Sheet", href: "/finance/reports/balance-sheet" },
          { label: "Cash Flow", href: "/finance/reports/cash-flow" },
          { label: "Trial Balance", href: "/finance/reports/trial-balance" },
          { label: "General Ledger Report", href: "/finance/reports/gl" },
          { label: "GST Report", href: "/finance/reports/gst" },
          { label: "Insurance Report", href: "/finance/reports/insurance" },
          { label: "Government Scheme Report", href: "/finance/reports/scheme" },
          { label: "Outstanding Report", href: "/finance/reports/outstanding" },
          { label: "Refund Report", href: "/finance/reports/refund" },
          { label: "Department Revenue Report", href: "/finance/reports/department" },
        ]
      },
      {
        icon: CheckSquare,
        label: "Audit & Compliance",
        href: "/finance/audit",
        subItems: [
          { label: "Financial Audit", href: "/finance/audit/financial" },
          { label: "Transaction Audit", href: "/finance/audit/transaction" },
          { label: "Audit Logs", href: "/finance/audit/logs" },
          { label: "Approval History", href: "/finance/audit/approval" },
        ]
      },
      {
        icon: PieChart,
        label: "Analytics",
        href: "/finance/analytics",
        subItems: [
          { label: "Revenue Dashboard", href: "/finance/analytics/revenue" },
          { label: "Collection Analytics", href: "/finance/analytics/collection" },
          { label: "Profitability Analysis", href: "/finance/analytics/profitability" },
          { label: "Insurance Analytics", href: "/finance/analytics/insurance" },
          { label: "Financial KPIs", href: "/finance/analytics/kpis" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/finance/settings",
        subItems: [
          { label: "Charge Master", href: "/finance/settings/charge-master" },
          { label: "Billing Rules", href: "/finance/settings/billing-rules" },
          { label: "Payment Modes", href: "/finance/settings/payment-modes" },
          { label: "Discount Rules", href: "/finance/settings/discount-rules" },
          { label: "Financial Year", href: "/finance/settings/financial-year" },
          { label: "Number Series", href: "/finance/settings/number-series" },
          { label: "Approval Matrix", href: "/finance/settings/approval-matrix" },
        ]
      }
    ];
  } else if (dept === 'hr' || dept === 'human resources') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/hr",
      },
      {
        icon: Users,
        label: "Employee Management",
        href: "/hr/employees",
        subItems: [
          { label: "Employees", href: "/hr/employees/list" },
          { label: "Employee Profile", href: "/hr/employees/profile" },
          { label: "Employee Documents", href: "/hr/employees/documents" },
          { label: "Employee ID Cards", href: "/hr/employees/id-cards" },
          { label: "Employee Transfer", href: "/hr/employees/transfer" },
          { label: "Employee Exit", href: "/hr/employees/exit" },
        ]
      },
      {
        icon: UserPlus,
        label: "Recruitment",
        href: "/hr/recruitment",
        subItems: [
          { label: "Job Openings", href: "/hr/recruitment/openings" },
          { label: "Candidates", href: "/hr/recruitment/candidates" },
          { label: "Interview Schedule", href: "/hr/recruitment/schedule" },
          { label: "Interview Feedback", href: "/hr/recruitment/feedback" },
          { label: "Offer Letters", href: "/hr/recruitment/offers" },
          { label: "Joining Process", href: "/hr/recruitment/joining" },
        ]
      },
      {
        icon: UserCheck,
        label: "Onboarding",
        href: "/hr/onboarding",
        subItems: [
          { label: "Employee Onboarding", href: "/hr/onboarding/process" },
          { label: "Department Allocation", href: "/hr/onboarding/department" },
          { label: "Role Assignment", href: "/hr/onboarding/role" },
          { label: "System Access", href: "/hr/onboarding/access" },
          { label: "Orientation Checklist", href: "/hr/onboarding/orientation" },
          { label: "Probation Management", href: "/hr/onboarding/probation" },
        ]
      },
      {
        icon: Clock,
        label: "Attendance",
        href: "/hr/attendance",
        subItems: [
          { label: "Daily Attendance", href: "/hr/attendance/daily" },
          { label: "Biometric Attendance", href: "/hr/attendance/biometric" },
          { label: "Attendance Corrections", href: "/hr/attendance/corrections" },
          { label: "Attendance Regularization", href: "/hr/attendance/regularization" },
          { label: "Shift Attendance", href: "/hr/attendance/shift" },
        ]
      },
      {
        icon: Calendar,
        label: "Shift Management",
        href: "/hr/shift",
        subItems: [
          { label: "Shift Master", href: "/hr/shift/master" },
          { label: "Duty Roster", href: "/hr/shift/roster" },
          { label: "Shift Allocation", href: "/hr/shift/allocation" },
          { label: "Shift Swap", href: "/hr/shift/swap" },
          { label: "Overtime Management", href: "/hr/shift/overtime" },
          { label: "Night Shift", href: "/hr/shift/night" },
        ]
      },
      {
        icon: CalendarDays,
        label: "Leave Management",
        href: "/hr/leave",
        subItems: [
          { label: "Leave Requests", href: "/hr/leave/requests" },
          { label: "Leave Approval", href: "/hr/leave/approval" },
          { label: "Leave Calendar", href: "/hr/leave/calendar" },
          { label: "Leave Balance", href: "/hr/leave/balance" },
          { label: "Holiday Calendar", href: "/hr/leave/holidays" },
        ]
      },
      {
        icon: Banknote,
        label: "Payroll",
        href: "/hr/payroll",
        subItems: [
          { label: "Salary Structure", href: "/hr/payroll/structure" },
          { label: "Payroll Processing", href: "/hr/payroll/processing" },
          { label: "Salary Slips", href: "/hr/payroll/slips" },
          { label: "Bonus", href: "/hr/payroll/bonus" },
          { label: "Incentives", href: "/hr/payroll/incentives" },
          { label: "Deductions", href: "/hr/payroll/deductions" },
          { label: "Reimbursements", href: "/hr/payroll/reimbursements" },
          { label: "Full & Final Settlement", href: "/hr/payroll/fnf" },
        ]
      },
      {
        icon: Target,
        label: "Performance Management",
        href: "/hr/performance",
        subItems: [
          { label: "KPI Management", href: "/hr/performance/kpi" },
          { label: "Performance Review", href: "/hr/performance/review" },
          { label: "Appraisals", href: "/hr/performance/appraisals" },
          { label: "Promotions", href: "/hr/performance/promotions" },
          { label: "Increment History", href: "/hr/performance/increment" },
        ]
      },
      {
        icon: BookOpen,
        label: "Training & Development",
        href: "/hr/training",
        subItems: [
          { label: "Training Calendar", href: "/hr/training/calendar" },
          { label: "Training Programs", href: "/hr/training/programs" },
          { label: "Certifications", href: "/hr/training/certifications" },
          { label: "CME Programs", href: "/hr/training/cme" },
          { label: "Skill Assessment", href: "/hr/training/assessment" },
        ]
      },
      {
        icon: Shield,
        label: "Compliance",
        href: "/hr/compliance",
        subItems: [
          { label: "Employee Documents", href: "/hr/compliance/documents" },
          { label: "License Verification", href: "/hr/compliance/license" },
          { label: "Medical Registration", href: "/hr/compliance/registration" },
          { label: "NABH Compliance", href: "/hr/compliance/nabh" },
          { label: "Vaccination Records", href: "/hr/compliance/vaccination" },
          { label: "Mandatory Trainings", href: "/hr/compliance/training" },
        ]
      },
      {
        icon: HeartPulse,
        label: "Employee Health",
        href: "/hr/health",
        subItems: [
          { label: "Health Checkups", href: "/hr/health/checkups" },
          { label: "Vaccination Status", href: "/hr/health/vaccination" },
          { label: "Occupational Health", href: "/hr/health/occupational" },
          { label: "Injury Reports", href: "/hr/health/injury" },
          { label: "Fitness Certificates", href: "/hr/health/fitness" },
        ]
      },
      {
        icon: Receipt,
        label: "Claims & Reimbursements",
        href: "/hr/claims",
        subItems: [
          { label: "Travel Claims", href: "/hr/claims/travel" },
          { label: "Medical Reimbursements", href: "/hr/claims/medical" },
          { label: "Expense Claims", href: "/hr/claims/expense" },
          { label: "Approval Workflow", href: "/hr/claims/workflow" },
        ]
      },
      {
        icon: MessageCircle,
        label: "Communication",
        href: "/hr/communication",
        subItems: [
          { label: "HR Announcements", href: "/hr/communication/announcements" },
          { label: "Internal Messages", href: "/hr/communication/messages" },
          { label: "Circulars", href: "/hr/communication/circulars" },
          { label: "Employee Notices", href: "/hr/communication/notices" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/hr/reports",
        subItems: [
          { label: "Employee Report", href: "/hr/reports/employee" },
          { label: "Attendance Report", href: "/hr/reports/attendance" },
          { label: "Leave Report", href: "/hr/reports/leave" },
          { label: "Payroll Report", href: "/hr/reports/payroll" },
          { label: "Recruitment Report", href: "/hr/reports/recruitment" },
          { label: "Training Report", href: "/hr/reports/training" },
          { label: "Performance Report", href: "/hr/reports/performance" },
          { label: "Compliance Report", href: "/hr/reports/compliance" },
          { label: "Attrition Report", href: "/hr/reports/attrition" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/hr/analytics",
        subItems: [
          { label: "Workforce Dashboard", href: "/hr/analytics/workforce" },
          { label: "Department-wise Employees", href: "/hr/analytics/department" },
          { label: "Attendance Analytics", href: "/hr/analytics/attendance" },
          { label: "Payroll Analytics", href: "/hr/analytics/payroll" },
          { label: "Recruitment Analytics", href: "/hr/analytics/recruitment" },
          { label: "Attrition Analytics", href: "/hr/analytics/attrition" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/hr/settings",
        subItems: [
          { label: "Departments", href: "/hr/settings/departments" },
          { label: "Designations", href: "/hr/settings/designations" },
          { label: "Employment Types", href: "/hr/settings/employment" },
          { label: "Salary Components", href: "/hr/settings/salary" },
          { label: "Leave Types", href: "/hr/settings/leave" },
          { label: "Shift Rules", href: "/hr/settings/shift" },
          { label: "Approval Matrix", href: "/hr/settings/approval" },
        ]
      }

    ];
  } else if (dept === 'medical records' || dept === 'quality' || dept === 'records') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/records",
      },
      {
        icon: FolderOpen,
        label: "Medical Records",
        href: "/records/medical",
        subItems: [
          { label: "Patient Medical Records", href: "/records/medical/patient" },
          { label: "OPD Records", href: "/records/medical/opd" },
          { label: "IPD Records", href: "/records/medical/ipd" },
          { label: "Emergency Records", href: "/records/medical/emergency" },
          { label: "Archived Records", href: "/records/medical/archived" },
          { label: "Record Requests", href: "/records/medical/requests" },
          { label: "Record Tracking", href: "/records/medical/tracking" },
        ]
      },
      {
        icon: FileText,
        label: "Clinical Documentation",
        href: "/records/clinical",
        subItems: [
          { label: "Progress Notes", href: "/records/clinical/progress" },
          { label: "Doctor Notes", href: "/records/clinical/doctor" },
          { label: "Nursing Notes", href: "/records/clinical/nursing" },
          { label: "Operative Notes", href: "/records/clinical/operative" },
          { label: "Procedure Notes", href: "/records/clinical/procedure" },
          { label: "Consultation Notes", href: "/records/clinical/consultation" },
          { label: "Discharge Summary", href: "/records/clinical/discharge" },
          { label: "Death Summary", href: "/records/clinical/death" },
        ]
      },
      {
        icon: Archive,
        label: "Health Information Management",
        href: "/records/him",
        subItems: [
          { label: "Record Indexing", href: "/records/him/indexing" },
          { label: "Record Completion", href: "/records/him/completion" },
          { label: "Missing Documents", href: "/records/him/missing" },
          { label: "Incomplete Records", href: "/records/him/incomplete" },
          { label: "Duplicate Record Check", href: "/records/him/duplicate" },
          { label: "Document Scanning", href: "/records/him/scanning" },
          { label: "Digital Archive", href: "/records/him/archive" },
        ]
      },
      {
        icon: Code,
        label: "Medical Coding",
        href: "/records/coding",
        subItems: [
          { label: "ICD-10 Coding", href: "/records/coding/icd10" },
          { label: "ICD-11 Coding", href: "/records/coding/icd11" },
          { label: "CPT Coding", href: "/records/coding/cpt" },
          { label: "Procedure Coding", href: "/records/coding/procedure" },
          { label: "DRG Coding", href: "/records/coding/drg" },
          { label: "Coding Audit", href: "/records/coding/audit" },
        ]
      },
      {
        icon: Stethoscope,
        label: "Clinical Audit",
        href: "/records/audit",
        subItems: [
          { label: "Documentation Audit", href: "/records/audit/documentation" },
          { label: "Case Sheet Audit", href: "/records/audit/case-sheet" },
          { label: "Prescription Audit", href: "/records/audit/prescription" },
          { label: "Mortality Audit", href: "/records/audit/mortality" },
          { label: "Readmission Audit", href: "/records/audit/readmission" },
          { label: "Surgical Audit", href: "/records/audit/surgical" },
        ]
      },
      {
        icon: Award,
        label: "Quality Management",
        href: "/records/quality",
        subItems: [
          { label: "Quality Indicators", href: "/records/quality/indicators" },
          { label: "Patient Safety Indicators", href: "/records/quality/patient-safety" },
          { label: "KPI Dashboard", href: "/records/quality/kpi" },
          { label: "Sentinel Events", href: "/records/quality/sentinel" },
          { label: "Near Miss Events", href: "/records/quality/near-miss" },
          { label: "Root Cause Analysis (RCA)", href: "/records/quality/rca" },
          { label: "CAPA", href: "/records/quality/capa" },
        ]
      },
      {
        icon: Shield,
        label: "NABH / Accreditation",
        href: "/records/accreditation",
        subItems: [
          { label: "NABH Standards", href: "/records/accreditation/nabh" },
          { label: "JCI Standards", href: "/records/accreditation/jci" },
          { label: "Department Checklists", href: "/records/accreditation/checklists" },
          { label: "Policy Management", href: "/records/accreditation/policy" },
          { label: "SOP Management", href: "/records/accreditation/sop" },
          { label: "Accreditation Audit", href: "/records/accreditation/audit" },
          { label: "Compliance Tracking", href: "/records/accreditation/compliance" },
        ]
      },
      {
        icon: Bug,
        label: "Infection Control",
        href: "/records/infection",
        subItems: [
          { label: "HAI Surveillance", href: "/records/infection/hai" },
          { label: "Infection Reporting", href: "/records/infection/reporting" },
          { label: "Antibiotic Stewardship", href: "/records/infection/antibiotic" },
          { label: "Isolation Monitoring", href: "/records/infection/isolation" },
          { label: "Infection Audit", href: "/records/infection/audit" },
          { label: "Infection Trends", href: "/records/infection/trends" },
        ]
      },
      {
        icon: Scale,
        label: "Consent & Legal",
        href: "/records/legal",
        subItems: [
          { label: "Consent Management", href: "/records/legal/consent" },
          { label: "Medico-Legal Cases (MLC)", href: "/records/legal/mlc" },
          { label: "Legal Requests", href: "/records/legal/requests" },
          { label: "Court Cases", href: "/records/legal/court" },
          { label: "Police Requests", href: "/records/legal/police" },
          { label: "Record Release Approval", href: "/records/legal/release" },
        ]
      },
      {
        icon: FileStack,
        label: "Document Management",
        href: "/records/documents",
        subItems: [
          { label: "Patient Documents", href: "/records/documents/patient" },
          { label: "Consent Forms", href: "/records/documents/consent" },
          { label: "Scanned Documents", href: "/records/documents/scanned" },
          { label: "Digital Signatures", href: "/records/documents/signatures" },
          { label: "Document Templates", href: "/records/documents/templates" },
          { label: "Version Control", href: "/records/documents/version" },
        ]
      },
      {
        icon: Send,
        label: "Release of Information (ROI)",
        href: "/records/roi",
        subItems: [
          { label: "Patient Requests", href: "/records/roi/patient" },
          { label: "Insurance Requests", href: "/records/roi/insurance" },
          { label: "Corporate Requests", href: "/records/roi/corporate" },
          { label: "Government Requests", href: "/records/roi/government" },
          { label: "Legal Requests", href: "/records/roi/legal" },
          { label: "Approval Workflow", href: "/records/roi/workflow" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/records/reports",
        subItems: [
          { label: "Medical Record Reports", href: "/records/reports/medical" },
          { label: "Coding Reports", href: "/records/reports/coding" },
          { label: "Audit Reports", href: "/records/reports/audit" },
          { label: "NABH Reports", href: "/records/reports/nabh" },
          { label: "Infection Reports", href: "/records/reports/infection" },
          { label: "Compliance Reports", href: "/records/reports/compliance" },
          { label: "Record Completion Reports", href: "/records/reports/completion" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/records/analytics",
        subItems: [
          { label: "Documentation Analytics", href: "/records/analytics/documentation" },
          { label: "Quality Analytics", href: "/records/analytics/quality" },
          { label: "Infection Analytics", href: "/records/analytics/infection" },
          { label: "Coding Analytics", href: "/records/analytics/coding" },
          { label: "Audit Analytics", href: "/records/analytics/audit" },
          { label: "Compliance Dashboard", href: "/records/analytics/compliance" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/records/settings",
        subItems: [
          { label: "ICD Master", href: "/records/settings/icd" },
          { label: "Document Templates", href: "/records/settings/templates" },
          { label: "Audit Templates", href: "/records/settings/audit" },
          { label: "Quality Indicators", href: "/records/settings/quality" },
          { label: "Compliance Rules", href: "/records/settings/compliance" },
          { label: "Record Retention Policy", href: "/records/settings/retention" },
        ]
      }

    ];
  } else if (dept === 'crm' || dept === 'patient relationship') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/crm",
      },
      {
        icon: HeartHandshake,
        label: "Patient Engagement",
        href: "/crm/engagement",
        subItems: [
          { label: "Patient Directory", href: "/crm/engagement/directory" },
          { label: "Patient Timeline", href: "/crm/engagement/timeline" },
          { label: "Patient Journey", href: "/crm/engagement/journey" },
          { label: "VIP Patients", href: "/crm/engagement/vip" },
          { label: "International Patients", href: "/crm/engagement/international" },
        ]
      },
      {
        icon: Megaphone,
        label: "Lead & Enquiry Management",
        href: "/crm/leads",
        subItems: [
          { label: "General Enquiries", href: "/crm/leads/enquiries" },
          { label: "Lead Management", href: "/crm/leads/management" },
          { label: "Health Camp Leads", href: "/crm/leads/camp" },
          { label: "Corporate Leads", href: "/crm/leads/corporate" },
          { label: "Referral Leads", href: "/crm/leads/referral" },
          { label: "Lead Conversion", href: "/crm/leads/conversion" },
        ]
      },
      {
        icon: CalendarClock,
        label: "Appointments & Follow-up",
        href: "/crm/appointments",
        subItems: [
          { label: "Follow-up Patients", href: "/crm/appointments/followup" },
          { label: "Missed Appointments", href: "/crm/appointments/missed" },
          { label: "Recall Patients", href: "/crm/appointments/recall" },
          { label: "Appointment Reminders", href: "/crm/appointments/reminders" },
          { label: "Follow-up Calendar", href: "/crm/appointments/calendar" },
        ]
      },
      {
        icon: MessageCircle,
        label: "Communication Center",
        href: "/crm/communication",
        subItems: [
          { label: "SMS Center", href: "/crm/communication/sms" },
          { label: "WhatsApp Center", href: "/crm/communication/whatsapp" },
          { label: "Email Center", href: "/crm/communication/email" },
          { label: "Push Notifications", href: "/crm/communication/push" },
          { label: "Voice Calls", href: "/crm/communication/voice" },
          { label: "Communication History", href: "/crm/communication/history" },
        ]
      },
      {
        icon: ThumbsUp,
        label: "Feedback & Surveys",
        href: "/crm/feedback",
        subItems: [
          { label: "Patient Feedback", href: "/crm/feedback/patient" },
          { label: "Satisfaction Survey", href: "/crm/feedback/satisfaction" },
          { label: "NPS Survey", href: "/crm/feedback/nps" },
          { label: "Doctor Feedback", href: "/crm/feedback/doctor" },
          { label: "Department Feedback", href: "/crm/feedback/department" },
          { label: "Service Rating", href: "/crm/feedback/rating" },
        ]
      },
      {
        icon: Frown,
        label: "Complaints & Grievances",
        href: "/crm/complaints",
        subItems: [
          { label: "Complaint Registration", href: "/crm/complaints/registration" },
          { label: "Complaint Assignment", href: "/crm/complaints/assignment" },
          { label: "Complaint Tracking", href: "/crm/complaints/tracking" },
          { label: "Escalation Management", href: "/crm/complaints/escalation" },
          { label: "Resolution", href: "/crm/complaints/resolution" },
          { label: "Complaint Analytics", href: "/crm/complaints/analytics" },
        ]
      },
      {
        icon: Video,
        label: "Telemedicine",
        href: "/crm/telemedicine",
        subItems: [
          { label: "Video Consultation", href: "/crm/telemedicine/video" },
          { label: "Chat Consultation", href: "/crm/telemedicine/chat" },
          { label: "Telemedicine Schedule", href: "/crm/telemedicine/schedule" },
          { label: "Telemedicine History", href: "/crm/telemedicine/history" },
          { label: "Digital Prescription", href: "/crm/telemedicine/prescription" },
        ]
      },
      {
        icon: Megaphone,
        label: "Marketing & Campaigns",
        href: "/crm/marketing",
        subItems: [
          { label: "Email Campaigns", href: "/crm/marketing/email" },
          { label: "SMS Campaigns", href: "/crm/marketing/sms" },
          { label: "WhatsApp Campaigns", href: "/crm/marketing/whatsapp" },
          { label: "Health Camp Management", href: "/crm/marketing/camp" },
          { label: "Wellness Programs", href: "/crm/marketing/wellness" },
          { label: "Promotional Campaigns", href: "/crm/marketing/promotional" },
        ]
      },
      {
        icon: Gift,
        label: "Loyalty & Membership",
        href: "/crm/loyalty",
        subItems: [
          { label: "Membership Plans", href: "/crm/loyalty/plans" },
          { label: "Loyalty Points", href: "/crm/loyalty/points" },
          { label: "Family Membership", href: "/crm/loyalty/family" },
          { label: "Corporate Membership", href: "/crm/loyalty/corporate" },
          { label: "Wellness Packages", href: "/crm/loyalty/wellness" },
        ]
      },
      {
        icon: Network,
        label: "Referral Management",
        href: "/crm/referrals",
        subItems: [
          { label: "Doctor Referrals", href: "/crm/referrals/doctor" },
          { label: "Patient Referrals", href: "/crm/referrals/patient" },
          { label: "Corporate Referrals", href: "/crm/referrals/corporate" },
          { label: "Referral Rewards", href: "/crm/referrals/rewards" },
          { label: "Referral Analytics", href: "/crm/referrals/analytics" },
        ]
      },
      {
        icon: PhoneCall,
        label: "Call Center",
        href: "/crm/calls",
        subItems: [
          { label: "Call Queue", href: "/crm/calls/queue" },
          { label: "Incoming Calls", href: "/crm/calls/incoming" },
          { label: "Outgoing Calls", href: "/crm/calls/outgoing" },
          { label: "Missed Calls", href: "/crm/calls/missed" },
          { label: "Call Recordings", href: "/crm/calls/recordings" },
          { label: "Call History", href: "/crm/calls/history" },
        ]
      },
      {
        icon: LifeBuoy,
        label: "Patient Support",
        href: "/crm/support",
        subItems: [
          { label: "Help Desk", href: "/crm/support/helpdesk" },
          { label: "FAQs", href: "/crm/support/faqs" },
          { label: "Lost & Found", href: "/crm/support/lost" },
          { label: "Transport Assistance", href: "/crm/support/transport" },
          { label: "International Patient Support", href: "/crm/support/international" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/crm/reports",
        subItems: [
          { label: "CRM Dashboard", href: "/crm/reports/dashboard" },
          { label: "Follow-up Report", href: "/crm/reports/followup" },
          { label: "Feedback Report", href: "/crm/reports/feedback" },
          { label: "Complaint Report", href: "/crm/reports/complaint" },
          { label: "Marketing Report", href: "/crm/reports/marketing" },
          { label: "Referral Report", href: "/crm/reports/referral" },
          { label: "Telemedicine Report", href: "/crm/reports/telemedicine" },
          { label: "Patient Retention Report", href: "/crm/reports/retention" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/crm/analytics",
        subItems: [
          { label: "Patient Satisfaction", href: "/crm/analytics/satisfaction" },
          { label: "Patient Retention", href: "/crm/analytics/retention" },
          { label: "Campaign Analytics", href: "/crm/analytics/campaign" },
          { label: "Communication Analytics", href: "/crm/analytics/communication" },
          { label: "CRM KPIs", href: "/crm/analytics/kpis" },
          { label: "Doctor Ratings", href: "/crm/analytics/ratings" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/crm/settings",
        subItems: [
          { label: "Communication Templates", href: "/crm/settings/templates" },
          { label: "Feedback Templates", href: "/crm/settings/feedback" },
          { label: "Campaign Templates", href: "/crm/settings/campaign" },
          { label: "Reminder Settings", href: "/crm/settings/reminders" },
          { label: "Loyalty Rules", href: "/crm/settings/loyalty" },
        ]
      }
    ];
  } else if (dept === 'facilities' || dept === 'support' || dept === 'facilities & support') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/facilities",
      },
      {
        icon: Building,
        label: "Facility Management",
        href: "/facilities/management",
        subItems: [
          { label: "Buildings", href: "/facilities/management/buildings" },
          { label: "Floors", href: "/facilities/management/floors" },
          { label: "Wards", href: "/facilities/management/wards" },
          { label: "Rooms", href: "/facilities/management/rooms" },
          { label: "Facility Requests", href: "/facilities/management/requests" },
          { label: "Facility Inspections", href: "/facilities/management/inspections" },
        ]
      },
      {
        icon: Wrench,
        label: "Maintenance Management",
        href: "/facilities/maintenance",
        subItems: [
          { label: "Maintenance Dashboard", href: "/facilities/maintenance/dashboard" },
          { label: "Work Orders", href: "/facilities/maintenance/work-orders" },
          { label: "Preventive Maintenance", href: "/facilities/maintenance/preventive" },
          { label: "Corrective Maintenance", href: "/facilities/maintenance/corrective" },
          { label: "Breakdown Requests", href: "/facilities/maintenance/breakdown" },
          { label: "AMC Management", href: "/facilities/maintenance/amc" },
          { label: "Service History", href: "/facilities/maintenance/history" },
        ]
      },
      {
        icon: Cpu,
        label: "Biomedical Engineering",
        href: "/facilities/biomedical",
        subItems: [
          { label: "Equipment Dashboard", href: "/facilities/biomedical/dashboard" },
          { label: "Equipment Register", href: "/facilities/biomedical/register" },
          { label: "Equipment Allocation", href: "/facilities/biomedical/allocation" },
          { label: "Calibration", href: "/facilities/biomedical/calibration" },
          { label: "Preventive Maintenance", href: "/facilities/biomedical/preventive" },
          { label: "Breakdown Maintenance", href: "/facilities/biomedical/breakdown" },
          { label: "AMC Contracts", href: "/facilities/biomedical/amc" },
          { label: "Service Reports", href: "/facilities/biomedical/reports" },
        ]
      },
      {
        icon: Sparkles,
        label: "Housekeeping",
        href: "/facilities/housekeeping",
        subItems: [
          { label: "Cleaning Schedule", href: "/facilities/housekeeping/schedule" },
          { label: "Room Cleaning", href: "/facilities/housekeeping/room" },
          { label: "Ward Cleaning", href: "/facilities/housekeeping/ward" },
          { label: "OT Cleaning", href: "/facilities/housekeeping/ot" },
          { label: "ICU Cleaning", href: "/facilities/housekeeping/icu" },
          { label: "Isolation Room Cleaning", href: "/facilities/housekeeping/isolation" },
          { label: "Housekeeping Requests", href: "/facilities/housekeeping/requests" },
          { label: "Cleaning Checklist", href: "/facilities/housekeeping/checklist" },
        ]
      },
      {
        icon: Shirt,
        label: "Laundry & Linen",
        href: "/facilities/laundry",
        subItems: [
          { label: "Linen Inventory", href: "/facilities/laundry/inventory" },
          { label: "Linen Issue", href: "/facilities/laundry/issue" },
          { label: "Linen Return", href: "/facilities/laundry/return" },
          { label: "Laundry Processing", href: "/facilities/laundry/processing" },
          { label: "Damaged Linen", href: "/facilities/laundry/damaged" },
          { label: "Laundry Reports", href: "/facilities/laundry/reports" },
        ]
      },
      {
        icon: Shield,
        label: "Security Management",
        href: "/facilities/security",
        subItems: [
          { label: "Security Dashboard", href: "/facilities/security/dashboard" },
          { label: "Security Staff", href: "/facilities/security/staff" },
          { label: "Visitor Verification", href: "/facilities/security/visitor" },
          { label: "Gate Pass", href: "/facilities/security/gatepass" },
          { label: "Incident Reports", href: "/facilities/security/incident" },
          { label: "CCTV Monitoring", href: "/facilities/security/cctv" },
          { label: "Lost & Found", href: "/facilities/security/lost" },
        ]
      },
      {
        icon: Truck,
        label: "Ambulance Management",
        href: "/facilities/ambulance",
        subItems: [
          { label: "Ambulance Dashboard", href: "/facilities/ambulance/dashboard" },
          { label: "Ambulance Booking", href: "/facilities/ambulance/booking" },
          { label: "Emergency Dispatch", href: "/facilities/ambulance/dispatch" },
          { label: "Driver Management", href: "/facilities/ambulance/driver" },
          { label: "Vehicle Tracking", href: "/facilities/ambulance/tracking" },
          { label: "Trip History", href: "/facilities/ambulance/history" },
          { label: "Ambulance Billing", href: "/facilities/ambulance/billing" },
        ]
      },
      {
        icon: Bus,
        label: "Transport Management",
        href: "/facilities/transport",
        subItems: [
          { label: "Vehicle Management", href: "/facilities/transport/vehicle" },
          { label: "Driver Management", href: "/facilities/transport/driver" },
          { label: "Fuel Log", href: "/facilities/transport/fuel" },
          { label: "Vehicle Maintenance", href: "/facilities/transport/maintenance" },
          { label: "Transport Requests", href: "/facilities/transport/requests" },
        ]
      },
      {
        icon: Archive,
        label: "Mortuary Management",
        href: "/facilities/mortuary",
        subItems: [
          { label: "Mortuary Register", href: "/facilities/mortuary/register" },
          { label: "Body Admission", href: "/facilities/mortuary/admission" },
          { label: "Body Release", href: "/facilities/mortuary/release" },
          { label: "Postmortem Register", href: "/facilities/mortuary/postmortem" },
          { label: "Cold Storage", href: "/facilities/mortuary/storage" },
          { label: "Mortuary Reports", href: "/facilities/mortuary/reports" },
        ]
      },
      {
        icon: Trash2,
        label: "Waste Management",
        href: "/facilities/waste",
        subItems: [
          { label: "Biomedical Waste", href: "/facilities/waste/biomedical" },
          { label: "Waste Collection", href: "/facilities/waste/collection" },
          { label: "Waste Segregation", href: "/facilities/waste/segregation" },
          { label: "Waste Disposal", href: "/facilities/waste/disposal" },
          { label: "Vendor Collection", href: "/facilities/waste/vendor" },
          { label: "Compliance Reports", href: "/facilities/waste/compliance" },
        ]
      },
      {
        icon: Zap,
        label: "Utilities Management",
        href: "/facilities/utilities",
        subItems: [
          { label: "Electricity Monitoring", href: "/facilities/utilities/electricity" },
          { label: "Water Monitoring", href: "/facilities/utilities/water" },
          { label: "Oxygen Supply", href: "/facilities/utilities/oxygen" },
          { label: "Medical Gas Pipeline", href: "/facilities/utilities/gas" },
          { label: "Generator Monitoring", href: "/facilities/utilities/generator" },
          { label: "HVAC Monitoring", href: "/facilities/utilities/hvac" },
        ]
      },
      {
        icon: Package,
        label: "Inventory Requests",
        href: "/facilities/inventory",
        subItems: [
          { label: "Department Requests", href: "/facilities/inventory/department" },
          { label: "Consumable Requests", href: "/facilities/inventory/consumable" },
          { label: "Maintenance Materials", href: "/facilities/inventory/maintenance" },
          { label: "Approval Queue", href: "/facilities/inventory/approval" },
        ]
      },
      {
        icon: Users2,
        label: "Vendor & AMC",
        href: "/facilities/vendors",
        subItems: [
          { label: "Vendor Directory", href: "/facilities/vendors/directory" },
          { label: "AMC Contracts", href: "/facilities/vendors/contracts" },
          { label: "Service Providers", href: "/facilities/vendors/providers" },
          { label: "Contract Renewal", href: "/facilities/vendors/renewal" },
          { label: "Vendor Performance", href: "/facilities/vendors/performance" },
        ]
      },
      {
        icon: ShieldAlert,
        label: "Compliance & Safety",
        href: "/facilities/compliance",
        subItems: [
          { label: "Fire Safety", href: "/facilities/compliance/fire" },
          { label: "Safety Inspection", href: "/facilities/compliance/inspection" },
          { label: "Emergency Drills", href: "/facilities/compliance/drills" },
          { label: "Disaster Management", href: "/facilities/compliance/disaster" },
          { label: "Compliance Audit", href: "/facilities/compliance/audit" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/facilities/reports",
        subItems: [
          { label: "Maintenance Report", href: "/facilities/reports/maintenance" },
          { label: "Housekeeping Report", href: "/facilities/reports/housekeeping" },
          { label: "Laundry Report", href: "/facilities/reports/laundry" },
          { label: "Security Report", href: "/facilities/reports/security" },
          { label: "Ambulance Report", href: "/facilities/reports/ambulance" },
          { label: "Mortuary Report", href: "/facilities/reports/mortuary" },
          { label: "Waste Report", href: "/facilities/reports/waste" },
          { label: "Utility Report", href: "/facilities/reports/utility" },
          { label: "AMC Report", href: "/facilities/reports/amc" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/facilities/analytics",
        subItems: [
          { label: "Facility Dashboard", href: "/facilities/analytics/dashboard" },
          { label: "Maintenance Analytics", href: "/facilities/analytics/maintenance" },
          { label: "Equipment Downtime", href: "/facilities/analytics/downtime" },
          { label: "Utility Consumption", href: "/facilities/analytics/utility" },
          { label: "Vendor Performance", href: "/facilities/analytics/vendor" },
          { label: "Cost Analysis", href: "/facilities/analytics/cost" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/facilities/settings",
        subItems: [
          { label: "Facility Settings", href: "/facilities/settings/facility" },
          { label: "Maintenance Categories", href: "/facilities/settings/categories" },
          { label: "Work Order Types", href: "/facilities/settings/work-orders" },
          { label: "AMC Settings", href: "/facilities/settings/amc" },
          { label: "Preferences", href: "/facilities/settings/preferences" },
        ]
      }
    ];
  } else if (dept === 'it' || dept === 'system') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/it",
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
  } else if (dept === 'executive' || dept === 'mis') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/executive",
      },
      {
        icon: Presentation,
        label: "Executive Overview",
        href: "/executive/overview",
        subItems: [
          { label: "Hospital KPIs", href: "/executive/overview/kpis" },
          { label: "Today's Summary", href: "/executive/overview/summary" },
          { label: "Live Dashboard", href: "/executive/overview/live" },
          { label: "Hospital Scorecard", href: "/executive/overview/scorecard" },
          { label: "Executive Alerts", href: "/executive/overview/alerts" },
        ]
      },
      {
        icon: Users,
        label: "Patient Analytics",
        href: "/executive/patients",
        subItems: [
          { label: "OPD Analytics", href: "/executive/patients/opd" },
          { label: "IPD Analytics", href: "/executive/patients/ipd" },
          { label: "Emergency Analytics", href: "/executive/patients/emergency" },
          { label: "Admissions", href: "/executive/patients/admissions" },
          { label: "Discharges", href: "/executive/patients/discharges" },
          { label: "Readmissions", href: "/executive/patients/readmissions" },
          { label: "Patient Flow", href: "/executive/patients/flow" },
          { label: "Bed Occupancy", href: "/executive/patients/occupancy" },
          { label: "Average Length of Stay", href: "/executive/patients/alos" },
        ]
      },
      {
        icon: Stethoscope,
        label: "Clinical Analytics",
        href: "/executive/clinical",
        subItems: [
          { label: "Department Performance", href: "/executive/clinical/departments" },
          { label: "Doctor Performance", href: "/executive/clinical/doctors" },
          { label: "Surgery Analytics", href: "/executive/clinical/surgery" },
          { label: "ICU Analytics", href: "/executive/clinical/icu" },
          { label: "Mortality Analysis", href: "/executive/clinical/mortality" },
          { label: "Infection Analytics", href: "/executive/clinical/infection" },
          { label: "Clinical Outcomes", href: "/executive/clinical/outcomes" },
          { label: "Quality Indicators", href: "/executive/clinical/quality" },
        ]
      },
      {
        icon: Banknote,
        label: "Financial Analytics",
        href: "/executive/financial",
        subItems: [
          { label: "Revenue Dashboard", href: "/executive/financial/revenue" },
          { label: "Daily Collections", href: "/executive/financial/collections" },
          { label: "Department Revenue", href: "/executive/financial/departments" },
          { label: "Doctor Revenue", href: "/executive/financial/doctors" },
          { label: "Insurance Revenue", href: "/executive/financial/insurance" },
          { label: "Government Scheme Revenue", href: "/executive/financial/schemes" },
          { label: "Profit & Loss", href: "/executive/financial/pnl" },
          { label: "Cash Flow", href: "/executive/financial/cashflow" },
          { label: "Outstanding Receivables", href: "/executive/financial/receivables" },
          { label: "Financial KPIs", href: "/executive/financial/kpis" },
        ]
      },
      {
        icon: Activity,
        label: "Operational Analytics",
        href: "/executive/operations",
        subItems: [
          { label: "Appointment Analytics", href: "/executive/operations/appointments" },
          { label: "Waiting Time", href: "/executive/operations/waiting" },
          { label: "Queue Analysis", href: "/executive/operations/queue" },
          { label: "OT Utilization", href: "/executive/operations/ot" },
          { label: "Laboratory Performance", href: "/executive/operations/lab" },
          { label: "Radiology Performance", href: "/executive/operations/radiology" },
          { label: "Pharmacy Performance", href: "/executive/operations/pharmacy" },
        ]
      },
      {
        icon: Package,
        label: "Inventory Analytics",
        href: "/executive/inventory",
        subItems: [
          { label: "Stock Valuation", href: "/executive/inventory/valuation" },
          { label: "Stock Consumption", href: "/executive/inventory/consumption" },
          { label: "Reorder Status", href: "/executive/inventory/reorder" },
          { label: "Purchase Analytics", href: "/executive/inventory/purchase" },
          { label: "Vendor Performance", href: "/executive/inventory/vendors" },
          { label: "Asset Utilization", href: "/executive/inventory/assets" },
          { label: "Equipment Downtime", href: "/executive/inventory/downtime" },
        ]
      },
      {
        icon: Users2,
        label: "Human Resource Analytics",
        href: "/executive/hr",
        subItems: [
          { label: "Employee Dashboard", href: "/executive/hr/dashboard" },
          { label: "Attendance Analytics", href: "/executive/hr/attendance" },
          { label: "Payroll Analytics", href: "/executive/hr/payroll" },
          { label: "Productivity", href: "/executive/hr/productivity" },
          { label: "Staff Utilization", href: "/executive/hr/utilization" },
          { label: "Recruitment Analytics", href: "/executive/hr/recruitment" },
          { label: "Attrition Analysis", href: "/executive/hr/attrition" },
        ]
      },
      {
        icon: ShieldAlert,
        label: "Quality & Compliance",
        href: "/executive/quality",
        subItems: [
          { label: "NABH Compliance", href: "/executive/quality/nabh" },
          { label: "Clinical Audit", href: "/executive/quality/audit" },
          { label: "Infection Control", href: "/executive/quality/infection" },
          { label: "Incident Reports", href: "/executive/quality/incidents" },
          { label: "CAPA Tracking", href: "/executive/quality/capa" },
          { label: "Patient Safety Indicators", href: "/executive/quality/safety" },
        ]
      },
      {
        icon: HeartPulse,
        label: "Patient Experience",
        href: "/executive/experience",
        subItems: [
          { label: "Patient Satisfaction", href: "/executive/experience/satisfaction" },
          { label: "NPS Score", href: "/executive/experience/nps" },
          { label: "Feedback Analysis", href: "/executive/experience/feedback" },
          { label: "Complaint Analysis", href: "/executive/experience/complaints" },
          { label: "CRM Performance", href: "/executive/experience/crm" },
          { label: "Telemedicine Analytics", href: "/executive/experience/telemedicine" },
        ]
      },
      {
        icon: Building,
        label: "Facility Analytics",
        href: "/executive/facility",
        subItems: [
          { label: "Housekeeping KPIs", href: "/executive/facility/housekeeping" },
          { label: "Maintenance KPIs", href: "/executive/facility/maintenance" },
          { label: "Ambulance Utilization", href: "/executive/facility/ambulance" },
          { label: "Biomedical Equipment", href: "/executive/facility/biomedical" },
          { label: "Utility Consumption", href: "/executive/facility/utilities" },
        ]
      },
      {
        icon: TrendingUp,
        label: "Strategic Planning",
        href: "/executive/strategy",
        subItems: [
          { label: "Budget Planning", href: "/executive/strategy/budget" },
          { label: "Forecasting", href: "/executive/strategy/forecasting" },
          { label: "Capacity Planning", href: "/executive/strategy/capacity" },
          { label: "Growth Analysis", href: "/executive/strategy/growth" },
          { label: "Branch Comparison", href: "/executive/strategy/branch" },
          { label: "Department Benchmarking", href: "/executive/strategy/benchmarking" },
        ]
      },
      {
        icon: BrainCircuit,
        label: "AI Insights",
        href: "/executive/ai",
        subItems: [
          { label: "Revenue Prediction", href: "/executive/ai/revenue" },
          { label: "Patient Volume Forecast", href: "/executive/ai/patients" },
          { label: "Disease Trends", href: "/executive/ai/disease" },
          { label: "Resource Forecast", href: "/executive/ai/resources" },
          { label: "Staffing Prediction", href: "/executive/ai/staffing" },
          { label: "Inventory Forecast", href: "/executive/ai/inventory" },
          { label: "Risk Analysis", href: "/executive/ai/risk" },
          { label: "Executive Recommendations", href: "/executive/ai/recommendations" },
        ]
      },
      {
        icon: CheckCircle2,
        label: "Approvals",
        href: "/executive/approvals",
        subItems: [
          { label: "Financial Approvals", href: "/executive/approvals/financial" },
          { label: "Purchase Approvals", href: "/executive/approvals/purchase" },
          { label: "HR Approvals", href: "/executive/approvals/hr" },
          { label: "Leave Approvals", href: "/executive/approvals/leave" },
          { label: "Discount Approvals", href: "/executive/approvals/discount" },
          { label: "High Value Claims", href: "/executive/approvals/claims" },
          { label: "Policy Approvals", href: "/executive/approvals/policy" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/executive/reports",
        subItems: [
          { label: "Executive Reports", href: "/executive/reports/executive" },
          { label: "Board Reports", href: "/executive/reports/board" },
          { label: "Daily MIS", href: "/executive/reports/daily" },
          { label: "Weekly MIS", href: "/executive/reports/weekly" },
          { label: "Monthly MIS", href: "/executive/reports/monthly" },
          { label: "Quarterly MIS", href: "/executive/reports/quarterly" },
          { label: "Annual MIS", href: "/executive/reports/annual" },
          { label: "Custom Reports", href: "/executive/reports/custom" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics Center",
        href: "/executive/analytics-center",
        subItems: [
          { label: "Interactive Dashboards", href: "/executive/analytics-center/dashboards" },
          { label: "KPI Builder", href: "/executive/analytics-center/kpi" },
          { label: "Report Builder", href: "/executive/analytics-center/reports" },
          { label: "Data Warehouse", href: "/executive/analytics-center/warehouse" },
          { label: "Business Intelligence", href: "/executive/analytics-center/bi" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/executive/settings",
        subItems: [
          { label: "Dashboard Preferences", href: "/executive/settings/preferences" },
          { label: "KPI Configuration", href: "/executive/settings/kpi" },
          { label: "Report Scheduling", href: "/executive/settings/scheduling" },
          { label: "Notification Settings", href: "/executive/settings/notifications" },
        ]
      }
    ];
  } else if (dept === 'superadmin' || dept === 'super admin') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/superadmin",
      },
      {
        icon: Building2,
        label: "Hospital Management",
        href: "/superadmin/hospital",
        subItems: [
          { label: "Hospital Master", href: "/superadmin/hospital/master" },
          { label: "Hospital Registration", href: "/superadmin/hospital/registration" },
          { label: "Branch Management", href: "/superadmin/hospital/branch" },
          { label: "Group Hospitals", href: "/superadmin/hospital/group" },
          { label: "Hospital License", href: "/superadmin/hospital/license" },
          { label: "Accreditation", href: "/superadmin/hospital/accreditation" },
          { label: "Hospital Settings", href: "/superadmin/hospital/settings" },
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
  } else if (dept === 'admin' || dept === 'administrator') {
    filteredMenuItems = [
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
  } else {
    filteredMenuItems = menuItems;
  }

  const filteredSecondaryMenuItems = ['doctor', 'receptionist', 'laboratory', 'inventory', 'pharmacy', 'finance', 'accountant', 'hr', 'human resources', 'medical records', 'quality', 'records', 'crm', 'patient relationship', 'facilities', 'support', 'facilities & support', 'it', 'system', 'executive', 'mis', 'superadmin', 'super admin'].includes(dept)
    ? []
    : secondaryMenuItems;

  const [isOpen, setIsOpen] = useState(sidebarOpen);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Dashboard",
    "Doctors",
    "Patients",
    "Appointments",
    "Prescriptions",
    "Ambulance",
    "Pharmacy",
    "Blood Bank",
    "Departments",
    "Inventory",
    "Assets",
    "Medicines",
    "Medicine Dispensing",
    "Inventory & Alerts",
    "Staff",
    "Records",
    "Room Allotment",
    "Billing",
    "Reports",
    "Reviews",
  ]);
  const [showModuleTour, setShowModuleTour] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (navRef.current) {
      const savedScroll = sessionStorage.getItem('sidebarScrollPos');
      if (savedScroll) {
        navRef.current.scrollTop = parseInt(savedScroll, 10);
      }
    }

    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isNavigating) {
      setPendingPath(null);
    }
  }, [isNavigating, pathname]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      sessionStorage.setItem('sidebarScrollPos', target.scrollTop.toString());
    }, 150);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    window.location.href = "/login";
  };

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
        className="fixed z-50 p-2 top-4 left-4 lg:hidden bg-dark-secondary rounded"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed lg:static top-0 left-0 h-screen w-70 sidebar transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } z-40 pt-16 lg:pt-0 flex flex-col`}
        data-tour="sidebar"
      >
        <div className="p-2 border-b border-dark-tertiary">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center ">
              M
            </div>
            <h1 className="text-xl ">MedixPro</h1>
          </div>
        </div>

        <nav
          ref={navRef}
          onScroll={handleScroll}
          className="flex-1 p-2 space-y-2 overflow-y-auto"
        >
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const currentPath = pendingPath || pathname;
            const isActive = currentPath === item.href;
            const isExpanded = expandedItems.includes(item.label);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.href}>
                {hasSubItems ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      suppressHydrationWarning
                      className={`flex items-center justify-between w-full gap-2 p-2  text-xs  rounded transition-colors ${currentPath.startsWith(item.href)
                        ? "bg-accent/10 text-accent"
                        : "text-gray-300 hover:bg-dark-tertiary"
                        }`}
                      data-tour={
                        item.label.toLowerCase().replace(" ", "-") + "-nav"
                      }
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.subItems.map((subItem) => {
                          const isSubActive = currentPath === subItem.href;
                          return (
                            <Link
                              key={`${subItem.href}-${subItem.label}`}
                              href={subItem.href}
                              className={`flex items-center gap-2 p-2 rounded  text-xs  transition-colors text-md ${isSubActive
                                ? "bg-accent text-white text-md"
                                : " hover:bg-dark-tertiary hover:text-gray-300"
                                }`}
                              onClick={() => { setIsOpen(false); setPendingPath(subItem.href); setIsNavigating(true); }}
                            >
                              <span>{subItem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 p-2 rounded  text-xs  transition-colors ${isActive
                      ? "bg-accent text-white"
                      : "text-gray-300 hover:bg-dark-tertiary"
                      }`}
                    onClick={() => { setIsOpen(false); setPendingPath(item.href); setIsNavigating(true); }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            );
          })}

          <div className="my-4 border-t border-dark-tertiary" />

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
            Others
          </div>

          {filteredSecondaryMenuItems.map((item) => {
            const Icon = item.icon;
            const currentPath = pendingPath || pathname;
            const isActive = currentPath === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 p-2 rounded  text-xs  transition-colors ${isActive
                  ? "bg-accent text-white"
                  : "text-gray-300 hover:bg-dark-tertiary"
                  }`}
                data-tour={item.tourId}
                onClick={() => { setIsOpen(false); setPendingPath(item.href); setIsNavigating(true); }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-tertiary">
          <button
            onClick={handleLogout}
            suppressHydrationWarning
            className="flex items-center gap-2 w-full p-2 text-gray-300 hover:bg-dark-tertiary rounded transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <ModuleTour
        isOpen={showModuleTour}
        onClose={() => setShowModuleTour(false)}
        module={selectedModule}
        onExplore={() => {
          setShowModuleTour(false);
          setIsOpen(false);
        }}
      />
    </>
  );
}
