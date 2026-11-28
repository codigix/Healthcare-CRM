import { LayoutDashboard, MessageSquare, Search, UserPlus, Fingerprint, FileText, Stethoscope, CalendarCheck, Ticket, ListOrdered, Footprints, FolderOpen, ArrowLeftRight, LogOut, HeartHandshake, Receipt } from "lucide-react";
import type { NavItem } from "./types";

// Module B: Reception. The order follows the patient flow:
// Enquiry -> Existing / new patient -> Registration -> UHID -> Profile -> Department & doctor ->
// Appointment -> Token -> OPD queue -> Follow-up / feedback.
// Data is stored as JSON in the browser (frontend only) until the backend is built.
const B = "/front-office";
export const receptionMenu: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: B },
  { icon: MessageSquare, label: "Patient Enquiry", href: `${B}/enquiries` },
  { icon: Search, label: "Patient Search", href: `${B}/search` },
  { icon: UserPlus, label: "Patient Registration", href: `${B}/registration`, tourId: "patients-nav" },
  { icon: Fingerprint, label: "UHID / MRN Generation", href: `${B}/uhid` },
  { icon: FileText, label: "Patient Profile", href: `${B}/profile` },
  { icon: Stethoscope, label: "Doctor Scheduling", href: `${B}/scheduling` },
  { icon: CalendarCheck, label: "Appointment Booking", href: `${B}/appointments` },
  { icon: Ticket, label: "Token Management", href: `${B}/tokens` },
  { icon: ListOrdered, label: "OPD Queue", href: `${B}/queue` },
  { icon: Footprints, label: "Walk-in Patient", href: `${B}/walk-in` },
  { icon: FolderOpen, label: "Patient Documents", href: `${B}/documents` },
  { icon: ArrowLeftRight, label: "Patient Transfer", href: `${B}/transfers` },
  { icon: LogOut, label: "Patient Discharge Registration", href: `${B}/discharge` },
  { icon: HeartHandshake, label: "Follow-up & Feedback", href: `${B}/follow-up` },
  {
    icon: Receipt,
    label: "Billing & Payments",
    href: "/billing",
    moduleId: "billing",
    tourId: "billing-nav",
    subItems: [
      { label: "Invoices", href: "/billing/invoices" },
      { label: "Create Invoice", href: "/billing/create-invoice" },
      { label: "Payments History", href: "/billing/payments" },
      { label: "Insurance Claims", href: "/billing/insurance" },
    ],
  },
];
