import { Activity, BarChart3, Calendar, Clipboard, FileText, FlaskConical, HeartPulse, Hotel, LayoutDashboard, LogOut, Package, Syringe } from "lucide-react";
import type { NavItem } from "./types";

// Workflow menu: only the sections this department uses, in the order the work flows.
export const otMenu: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
    },
];
