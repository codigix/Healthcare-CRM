import { LayoutDashboard, Users, UserCheck, Calendar, FileText, BarChart3, Settings, LogOut, Pill, Activity, Stethoscope, Syringe, ClipboardList, Hotel, Star, Clock, MessageSquare, HeartPulse, Search, Video } from "lucide-react";
import type { NavItem } from "./types";

export const doctorMenu: NavItem[] = [
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
