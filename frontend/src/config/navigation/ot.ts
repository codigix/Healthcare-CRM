import { LayoutDashboard, Users, Calendar, FileText, BarChart3, Settings, LogOut, Activity, Stethoscope, Syringe, Clipboard, Package, ClipboardList, Hotel, Star, HeartPulse, FlaskConical } from "lucide-react";
import type { NavItem } from "./types";

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
