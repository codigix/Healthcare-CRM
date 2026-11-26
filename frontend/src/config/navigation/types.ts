import type { LucideIcon } from "lucide-react";

export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  moduleId?: string;
  tourId?: string;
  subItems?: NavSubItem[];
}
