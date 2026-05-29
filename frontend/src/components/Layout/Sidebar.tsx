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

  if (dept === 'admin') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/admin",
      },
      getBaseItem("Doctors"),
      getBaseItem("Patients"),
      getBaseItem("Appointments"),
      getBaseItem("Laboratory"),
      getBaseItem("Pharmacy"),
      getBaseItem("Inventory"),
      getBaseItem("Blood Bank"),
      getBaseItem("Ambulance"),
      getBaseItem("Billing"),
      getBaseItem("Room Allotment"),
      getBaseItem("Staff"),
      getBaseItem("Departments"),
      getBaseItem("Reports"),
      getBaseItem("Reviews"),
      {
        icon: Settings,
        label: "Settings",
        href: "/settings",
      }
    ].filter(Boolean);
  } else if (dept === 'doctor') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/doctor",
      },
      getBaseItem("Appointments"),
      getBaseItem("Patients"),
      getBaseItem("Prescriptions"),
      {
        icon: Syringe,
        label: "Issue Blood",
        href: "/blood-bank/issue-request",
      },
      getBaseItem("Reports"),
      getBaseItem("Reviews"),
    ].filter(Boolean);
  } else if (dept === 'receptionist') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/receptionist",
      },
      getBaseItem("Patients"),
      getBaseItem("Appointments"),
      getBaseItem("Billing"),
      getBaseItem("Room Allotment"),
      getBaseItem("Ambulance"),
    ].filter(Boolean);
  } else if (dept === 'laboratory') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/laboratory",
      },
      {
        icon: ClipboardList,
        label: "Test Requests",
        href: "/records/lab-tests",
      },
      getBaseItem("Patients"),
      {
        icon: FileText,
        label: "Reports Upload",
        href: "/records",
      },
    ].filter(Boolean);
  } else if (dept === 'pharmacy') {
    filteredMenuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/pharmacy",
      },
      {
        icon: Clipboard,
        label: "Prescriptions",
        href: "/pharmacy/prescriptions",
        subItems: [
          { label: "Pending Prescriptions", href: "/pharmacy/prescriptions/pending" },
          { label: "Prescription History", href: "/pharmacy/prescriptions/history" },
        ],
      },
      {
        icon: Pill,
        label: "Medicines",
        href: "/pharmacy/medicines",
        subItems: [
          { label: "Medicine List", href: "/pharmacy/medicines" },
          { label: "Add Medicine", href: "/pharmacy/add-medicine" },
          { label: "Medicine Categories", href: "/pharmacy/categories" },
        ],
      },
      {
        icon: ClipboardList,
        label: "Medicine Issue",
        href: "/pharmacy/issue",
        subItems: [
          { label: "OPD Medicine Issue", href: "/pharmacy/issue/opd" },
          { label: "IPD Medicine Supply", href: "/pharmacy/issue/ipd" },
        ],
      },
      {
        icon: FileText,
        label: "Billing",
        href: "/pharmacy/billing",
        subItems: [
          { label: "Medicine Bills", href: "/pharmacy/billing" },
        ],
      },
      {
        icon: Bell,
        label: "Alerts",
        href: "/pharmacy/alerts",
        subItems: [
          { label: "Low Stock Medicines", href: "/pharmacy/alerts/low-stock" },
          { label: "Expiring Medicines", href: "/pharmacy/alerts/expiring" },
        ],
      },
      {
        icon: BarChart3,
        label: "Reports",
        href: "/pharmacy/reports",
        subItems: [
          { label: "Pharmacy Reports", href: "/pharmacy/reports" },
          { label: "Medicine Usage Reports", href: "/pharmacy/reports/usage" },
        ],
      },
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
        label: "Inventory",
        href: "/inventory",
        subItems: [
          { label: "Inventory Items", href: "/inventory" },
          { label: "Add Item", href: "/inventory/add" },
          { label: "Inventory Categories", href: "/inventory/categories" },
          { label: "Stock Alerts", href: "/inventory/alerts" },
          { label: "Expiry Alerts", href: "/inventory/expiry" },
        ],
      },
      {
        icon: Users2,
        label: "Suppliers",
        href: "/inventory/suppliers",
        subItems: [
          { label: "Suppliers List", href: "/inventory/suppliers" },
        ],
      },
      {
        icon: BarChart3,
        label: "Reports",
        href: "/inventory/reports",
        subItems: [
          { label: "Inventory Reports", href: "/inventory/reports" },
          { label: "Asset Reports", href: "/inventory/reports/assets" },
        ],
      },
      getBaseItem("Blood Bank"),
    ].filter(Boolean);
  } else {
    filteredMenuItems = menuItems;
  }

  const filteredSecondaryMenuItems = ['admin', 'doctor', 'receptionist', 'laboratory', 'inventory', 'pharmacy'].includes(dept)
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
    "Medicine Issue",
    "Alerts",
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
        className="fixed z-50 p-2 top-4 left-4 lg:hidden bg-dark-secondary rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed lg:static top-0 left-0 h-screen w-64 sidebar transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } z-40 pt-16 lg:pt-0 flex flex-col`}
        data-tour="sidebar"
      >
        <div className="p-6 border-b border-dark-tertiary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              M
            </div>
            <h1 className="text-xl font-bold">MedixPro</h1>
          </div>
        </div>

        <nav 
          ref={navRef}
          onScroll={handleScroll}
          className="flex-1 p-4 space-y-2 overflow-y-auto"
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
                      className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-colors ${
                        currentPath.startsWith(item.href)
                          ? "bg-accent/10 text-accent"
                          : "text-gray-300 hover:bg-dark-tertiary"
                      }`}
                      data-tour={
                        item.label.toLowerCase().replace(" ", "-") + "-nav"
                      }
                    >
                      <div className="flex items-center gap-3">
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
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-md ${
                                isSubActive
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
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
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-dark-tertiary rounded-lg transition-colors"
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
