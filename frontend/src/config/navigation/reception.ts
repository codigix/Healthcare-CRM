import { LayoutDashboard, Users, Calendar, Hotel, FileText } from "lucide-react";
import type { NavItem } from "./types";

export const receptionMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/receptionist",
        subItems: [
          { label: "Reception Dashboard", href: "/dashboard/receptionist" },
          { label: "Doctor Dashboard", href: "/dashboard/doctor" },
          { label: "Patient Dashboard", href: "/dashboard/patient" },
        ]
      },
      {
        icon: Users,
        label: "Patient Registration",
        href: "/patients",
        tourId: "patients-nav",
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
        ]
      },
      {
        icon: FileText,
        label: "Billing & Payments",
        href: "/billing",
        moduleId: "billing",
        tourId: "billing-nav",
        subItems: [
          { label: "Invoices", href: "/billing/invoices" },
          { label: "Create Invoice", href: "/billing/create-invoice" },
          { label: "Payments History", href: "/billing/payments" },
          { label: "Insurance Claims", href: "/billing/insurance" },
        ]
      },
];
