import { LayoutDashboard, Users, Calendar, Stethoscope, ClipboardList, Pill, FlaskConical, Hotel } from "lucide-react";
import type { NavItem } from "./types";

// Doctor department menu: 8 sections. Most items reuse screens that already existed
// (patients, appointments, prescriptions, /doctor/*, diagnostics reports, pharmacy medicines).
export const doctorMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/doctor",
        subItems: [
          { label: "Doctor Dashboard", href: "/dashboard/doctor" },
          { label: "Today's Overview", href: "/doctor/opd/dashboard" },
          { label: "My Schedule", href: "/doctor/schedule/today" },
        ]
      },
      {
        icon: Users,
        label: "My Patients",
        href: "/patients",
        tourId: "patients-nav",
        subItems: [
          { label: "All Patients", href: "/patients" },
          { label: "Today's Patients", href: "/doctor/patients/today" },
          { label: "Returning Patients", href: "/doctor/patients/returning" },
          { label: "Patient History", href: "/doctor/diagnosis/history" },
          { label: "Patient Medical Records", href: "/records/medical/patient" },
        ]
      },
      {
        icon: Calendar,
        label: "Appointments",
        href: "/appointments",
        subItems: [
          { label: "Today's Appointments", href: "/appointments" },
          { label: "Upcoming Appointments", href: "/appointments/all" },
          { label: "Appointment Calendar", href: "/appointments/calendar" },
          { label: "Appointment Requests", href: "/appointments/requests" },
        ]
      },
      {
        icon: Stethoscope,
        label: "OPD",
        href: "/doctor/queue/today",
        subItems: [
          { label: "OPD Patient Queue", href: "/doctor/queue/today" },
          { label: "Waiting Patients", href: "/doctor/queue/waiting" },
          { label: "Start Consultation", href: "/doctor/opd/consultation" },
          { label: "Consultation History", href: "/doctor/documentation/consultation" },
        ]
      },
      {
        icon: ClipboardList,
        label: "Consultation",
        href: "/doctor/consultation/clinical-notes",
        subItems: [
          { label: "Patient Examination", href: "/doctor/consultation/examination" },
          { label: "Clinical Notes", href: "/doctor/consultation/clinical-notes" },
          { label: "Diagnosis", href: "/doctor/consultation/diagnosis" },
          { label: "Vital Signs", href: "/doctor/vitals/patient" },
          { label: "Treatment Plan", href: "/doctor/ipd/treatment-plan" },
          { label: "Follow-up Advice", href: "/doctor/consultation/follow-up-advice" },
        ]
      },
      {
        icon: Pill,
        label: "Prescriptions",
        href: "/prescriptions/all",
        subItems: [
          { label: "Create Prescription", href: "/prescriptions/create" },
          { label: "Prescription History", href: "/prescriptions/all" },
          { label: "Medicine List", href: "/pharmacy/medicines" },
        ]
      },
      {
        icon: FlaskConical,
        label: "Lab & Radiology",
        href: "/doctor/orders/laboratory",
        subItems: [
          { label: "Lab Test Requests", href: "/doctor/orders/laboratory" },
          { label: "Lab Results", href: "/diagnostics/patient-reports/laboratory" },
          { label: "Radiology Requests", href: "/doctor/orders/radiology" },
          { label: "Radiology Reports", href: "/diagnostics/patient-reports/radiology" },
        ]
      },
      {
        icon: Hotel,
        label: "IPD / Inpatients",
        href: "/doctor/ipd/admitted",
        subItems: [
          { label: "Admitted Patients", href: "/doctor/ipd/admitted" },
          { label: "Ward Rounds", href: "/doctor/ipd/rounds" },
          { label: "Patient Progress Notes", href: "/doctor/ipd/progress-notes" },
          { label: "Discharge Summary", href: "/doctor/ipd/discharge-summary" },
        ]
      },
];
