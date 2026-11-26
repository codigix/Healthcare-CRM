import { UserCheck, Calendar, Settings, Mail, CheckSquare, Users2 } from "lucide-react";
import type { NavItem } from "./types";

export const secondaryMenu: NavItem[] = [
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
    tourId: "settings-nav",
  },
  {
    icon: UserCheck,
    label: "Authentication",
    href: "/authentication",
    tourId: "authentication-nav",
  },
  {
    icon: Calendar,
    label: "Calendar",
    href: "/calendar",
    tourId: "calendar-nav",
  },
  { icon: CheckSquare, label: "Tasks", href: "/tasks", tourId: "tasks-nav" },
  {
    icon: Users2,
    label: "Contacts",
    href: "/contacts",
    tourId: "contacts-nav",
  },
  { icon: Mail, label: "Email", href: "/email", tourId: "email-nav" },
];
