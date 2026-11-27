import { Activity, BarChart3, CheckSquare, Clipboard, ClipboardList, FileText, FlaskConical, LayoutDashboard, Wrench } from "lucide-react";
import type { NavItem } from "./types";

// Workflow menu: only the sections this department uses, in the order the work flows.
export const laboratoryMenu: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard/laboratory",
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
    },
];
