import type { NavItem } from "./types";
import { adminMenu } from "./admin";
import { doctorMenu } from "./doctor";
import { nurseMenu } from "./nurse";
import { receptionMenu } from "./reception";
import { laboratoryMenu } from "./laboratory";
import { otMenu } from "./ot";
import { pharmacyMenu } from "./pharmacy";
import { inventoryMenu } from "./inventory";
import { financeMenu } from "./finance";
import { hrMenu } from "./hr";
import { recordsMenu } from "./records";
import { crmMenu } from "./crm";
import { facilitiesMenu } from "./facilities";
import { itMenu } from "./it";
import { executiveMenu } from "./executive";
import { superAdminMenu } from "./superadmin";
import { administratorMenu } from "./administrator";
import { defaultMenu } from "./default";
import { secondaryMenu } from "./secondary";

export type { NavItem, NavSubItem } from "./types";
export { secondaryMenu, defaultMenu };

/** Departments that do not get the "Others" secondary menu. */
const NO_SECONDARY = [
  "doctor", "receptionist", "laboratory", "inventory", "pharmacy", "finance", "accountant",
  "hr", "human resources", "medical records", "quality", "records", "crm", "patient relationship",
  "facilities", "support", "facilities & support", "it", "system", "executive", "mis",
  "superadmin", "super admin",
];

export function getSecondaryMenu(d: string): NavItem[] {
  return NO_SECONDARY.includes(d) ? [] : secondaryMenu;
}

/** Same match order as the original if/else-if chain in Sidebar.tsx. */
export function getMenuForDepartment(d: string): NavItem[] {
  if (d === 'admin' || d === 'administration') return adminMenu;
  else if (d === 'doctor' || d === 'clinical') return doctorMenu;
  else if (d === 'nurse' || d === 'nursing') return nurseMenu;
  else if (d === 'receptionist' || d === 'reception') return receptionMenu;
  else if (d === 'laboratory' || d === 'diagnostics') return laboratoryMenu;
  else if (d === 'ot') return otMenu;
  else if (d === 'pharmacy' || d === 'pharmacist') return pharmacyMenu;
  else if (d === 'inventory') return inventoryMenu;
  else if (d === 'finance' || d === 'accountant') return financeMenu;
  else if (d === 'hr' || d === 'human resources') return hrMenu;
  else if (d === 'medical records' || d === 'quality' || d === 'records') return recordsMenu;
  else if (d === 'crm' || d === 'patient relationship') return crmMenu;
  else if (d === 'facilities' || d === 'support' || d === 'facilities & support') return facilitiesMenu;
  else if (d === 'it' || d === 'system') return itMenu;
  else if (d === 'executive' || d === 'mis') return executiveMenu;
  else if (d === 'superadmin' || d === 'super admin') return superAdminMenu;
  else if (d === 'admin' || d === 'administrator') return administratorMenu;
  return defaultMenu;
}
