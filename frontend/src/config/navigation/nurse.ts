import { Activity, AlertCircle, BarChart3, Clipboard, ClipboardList, Clock, FlaskConical, HeartPulse, LayoutDashboard, Pill, Users } from "lucide-react";
import type { NavItem } from "./types";

// Workflow menu: only the sections this department uses, in the order the work flows.
export const nurseMenu: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
    },
    {
      icon: FlaskConical,
      label: "Specimen Management",
      href: "/nurse/specimen",
      subItems: [
        { label: "Sample Collection", href: "/nurse/specimen/collection" },
        { label: "Sample Dispatch", href: "/nurse/specimen/dispatch" },
        { label: "Pending Collections", href: "/nurse/specimen/pending" },
      ],
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
      ],
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
      ],
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
      ],
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
      ],
    },
];
