import { LayoutDashboard, Building2 } from "lucide-react";
import type { NavItem } from "./types";

// Module A: Hospital Administration, in workflow order:
// Hospital Setup -> Department Creation -> Room & Bed Configuration -> Staff Assignment ->
// Service Configuration -> Approval Setup -> Hospital Operations.
// Data is stored as JSON in the browser (frontend only) until the backend is built.
export const hospitalAdministrationItems = [
  { label: "Workflow Overview", href: "/admin/hospital-admin" },
  { label: "Hospital Profile", href: "/admin/hospital-admin/profile" },
  { label: "Branch Configuration", href: "/admin/hospital-admin/branches" },
  { label: "Department Management", href: "/admin/hospital-admin/departments" },
  { label: "Cost Centre Management", href: "/admin/hospital-admin/cost-centres" },
  { label: "Building & Floor Management", href: "/admin/hospital-admin/buildings" },
  { label: "Ward & Room Management", href: "/admin/hospital-admin/wards-rooms" },
  { label: "Bed Management", href: "/admin/hospital-admin/beds" },
  { label: "Doctor & Staff Master", href: "/admin/hospital-admin/staff" },
  { label: "Service & Tariff Management", href: "/admin/hospital-admin/services" },
  { label: "Hospital Policies & SOPs", href: "/admin/hospital-admin/policies" },
  { label: "Approval Management", href: "/admin/hospital-admin/approvals" },
  { label: "Hospital Operational Reports", href: "/admin/hospital-admin/reports" },
];

export const adminMenu: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard/admin",
  },
  {
    icon: Building2,
    label: "Hospital Administration",
    href: "/admin/hospital-admin",
    subItems: hospitalAdministrationItems,
  },
];
