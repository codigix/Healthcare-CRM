import { LayoutDashboard, Users, UserCheck, Calendar, BarChart3, Settings, Hotel, MessageCircle, Mail, MessageSquare } from "lucide-react";
import type { NavItem } from "./types";

export const receptionMenu: NavItem[] = [
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
          { label: "Patients List", href: "/patients" },

        ]
      },
      {
        icon: Calendar,
        label: "Appointments",
        href: "/appointments",
        subItems: [
          { label: "Appointment List", href: "/appointments" },
          { label: "Book Appointment", href: "/appointments/add" },

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
