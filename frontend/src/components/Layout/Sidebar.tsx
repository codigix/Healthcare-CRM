"use client";
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
} from "lucide-react";
import { useAuthStore, useUIStore } from "@/lib/store";
import { useState } from "react";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
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
    subItems: [
      { label: "Patients List", href: "/patients" },
      { label: "Add Patient", href: "/patients/add" },
    ],
  },
  {
    icon: Calendar,
    label: "Appointments",
    href: "/appointments",
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
    subItems: [
      { label: "All Prescriptions", href: "/prescriptions/all" },
      { label: "Create Prescription", href: "/prescriptions/create" },
      { label: "Medicine Templates", href: "/prescriptions/templates" },
    ],
  },
  {
    icon: Activity,
    label: "Ambulance",
    href: "/ambulance",
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
    subItems: [
      { label: "Medicine List", href: "/pharmacy/medicines" },
      { label: "Add Medicine", href: "/pharmacy/add-medicine" },
    ],
  },
  {
    icon: Syringe,
    label: "Blood Bank",
    href: "/blood-bank",
    subItems: [
      { label: "Blood Stock", href: "/blood-bank/stock" },
      { label: "Blood Donor", href: "/blood-bank/donors" },
      { label: "Blood Issued", href: "/blood-bank/issued" },
      { label: "Add Blood Unit", href: "/blood-bank/add-unit" },
      { label: "Issue Blood", href: "/blood-bank/issue" },
    ],
  },
  {
    icon: Stethoscope,
    label: "Departments",
    href: "/departments",
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
    subItems: [
      { label: "Inventory List", href: "/inventory" },
      { label: "Add Item", href: "/inventory/add" },
      { label: "Stock Alerts", href: "/inventory/alerts" },
      { label: "Suppliers List", href: "/inventory/suppliers" },
    ],
  },
  {
    icon: UserCog,
    label: "Staff",
    href: "/staff",
    subItems: [
      { label: "All Staff", href: "/staff" },
      { label: "Add Staff", href: "/staff/add" },
      { label: "Roles & Permissions", href: "/staff/roles" },
      { label: "Attendance", href: "/staff/attendance" },
    ],
  },
  {
    icon: ClipboardList,
    label: "Records",
    href: "/records",
    subItems: [
      { label: "Birth Records", href: "/records/birth" },
      { label: "Death Records", href: "/records/death" },
    ],
  },
  {
    icon: Hotel,
    label: "Room Allotment",
    href: "/room-allotment",
    subItems: [
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
    subItems: [
      { label: "Appointment Reports", href: "/reports/appointment" },
      { label: "Financial Reports", href: "/reports/financial" },
      { label: "Patient Visit Reports", href: "/reports/patient-visit" },
      { label: "Inventory Reports", href: "/reports/inventory" },
      { label: "Staff Performance", href: "/reports" },
      { label: "Custom Reports", href: "/reports" },
    ],
  },
  {
    icon: Star,
    label: "Reviews",
    href: "/reviews",
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
  { icon: Settings, label: "Settings", href: "/settings", tourId: "settings-nav" },
  { icon: UserCheck, label: "Authentication", href: "/authentication", tourId: "authentication-nav" },
  { icon: Calendar, label: "Calendar", href: "/calendar", tourId: "calendar-nav" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks", tourId: "tasks-nav" },
  { icon: Users2, label: "Contacts", href: "/contacts", tourId: "contacts-nav" },
  { icon: Mail, label: "Email", href: "/email", tourId: "email-nav" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [isOpen, setIsOpen] = useState(sidebarOpen);
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
    "Staff",
    "Records",
    "Room Allotment",
    "Billing",
    "Reports",
    "Reviews",
  ]);

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

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isExpanded = expandedItems.includes(item.label);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.href}>
                {hasSubItems ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-colors ${
                        pathname.startsWith(item.href)
                          ? "bg-blue-600/10 text-blue-600"
                          : "text-gray-300 hover:bg-dark-tertiary"
                      }`}
                      data-tour={item.label.toLowerCase().replace(' ', '-') + '-nav'}
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
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                                isSubActive
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-400 hover:bg-dark-tertiary hover:text-gray-300"
                              }`}
                              onClick={() => setIsOpen(false)}
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
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-dark-tertiary"
                    }`}
                    onClick={() => setIsOpen(false)}
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

          {secondaryMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-gray-300 hover:bg-dark-tertiary"
                }`}
                data-tour={item.tourId}
                onClick={() => setIsOpen(false)}
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
    </>
  );
}
