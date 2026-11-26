import { LayoutDashboard, Users, UserCheck, Calendar, FileText, BarChart3, Settings, MessageCircle, Clock, HeartPulse, Shield, Receipt, Banknote, UserPlus, CalendarDays, Target, BookOpen } from "lucide-react";
import type { NavItem } from "./types";

export const hrMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: Users,
        label: "Employee Management",
        href: "/hr/employees",
        subItems: [
          { label: "Employees", href: "/hr/employees/list" },
          { label: "Employee Profile", href: "/hr/employees/profile" },
          { label: "Employee Documents", href: "/hr/employees/documents" },
          { label: "Employee ID Cards", href: "/hr/employees/id-cards" },
          { label: "Employee Transfer", href: "/hr/employees/transfer" },
          { label: "Employee Exit", href: "/hr/employees/exit" },
        ]
      },
      {
        icon: UserPlus,
        label: "Recruitment",
        href: "/hr/recruitment",
        subItems: [
          { label: "Job Openings", href: "/hr/recruitment/openings" },
          { label: "Candidates", href: "/hr/recruitment/candidates" },
          { label: "Interview Schedule", href: "/hr/recruitment/schedule" },
          { label: "Interview Feedback", href: "/hr/recruitment/feedback" },
          { label: "Offer Letters", href: "/hr/recruitment/offers" },
          { label: "Joining Process", href: "/hr/recruitment/joining" },
        ]
      },
      {
        icon: UserCheck,
        label: "Onboarding",
        href: "/hr/onboarding",
        subItems: [
          { label: "Employee Onboarding", href: "/hr/onboarding/process" },
          { label: "Department Allocation", href: "/hr/onboarding/department" },
          { label: "Role Assignment", href: "/hr/onboarding/role" },
          { label: "System Access", href: "/hr/onboarding/access" },
          { label: "Orientation Checklist", href: "/hr/onboarding/orientation" },
          { label: "Probation Management", href: "/hr/onboarding/probation" },
        ]
      },
      {
        icon: Clock,
        label: "Attendance",
        href: "/hr/attendance",
        subItems: [
          { label: "Daily Attendance", href: "/hr/attendance/daily" },
          { label: "Biometric Attendance", href: "/hr/attendance/biometric" },
          { label: "Attendance Corrections", href: "/hr/attendance/corrections" },
          { label: "Attendance Regularization", href: "/hr/attendance/regularization" },
          { label: "Shift Attendance", href: "/hr/attendance/shift" },
        ]
      },
      {
        icon: Calendar,
        label: "Shift Management",
        href: "/hr/shift",
        subItems: [
          { label: "Shift Master", href: "/hr/shift/master" },
          { label: "Duty Roster", href: "/hr/shift/roster" },
          { label: "Shift Allocation", href: "/hr/shift/allocation" },
          { label: "Shift Swap", href: "/hr/shift/swap" },
          { label: "Overtime Management", href: "/hr/shift/overtime" },
          { label: "Night Shift", href: "/hr/shift/night" },
        ]
      },
      {
        icon: CalendarDays,
        label: "Leave Management",
        href: "/hr/leave",
        subItems: [
          { label: "Leave Requests", href: "/hr/leave/requests" },
          { label: "Leave Approval", href: "/hr/leave/approval" },
          { label: "Leave Calendar", href: "/hr/leave/calendar" },
          { label: "Leave Balance", href: "/hr/leave/balance" },
          { label: "Holiday Calendar", href: "/hr/leave/holidays" },
        ]
      },
      {
        icon: Banknote,
        label: "Payroll",
        href: "/hr/payroll",
        subItems: [
          { label: "Salary Structure", href: "/hr/payroll/structure" },
          { label: "Payroll Processing", href: "/hr/payroll/processing" },
          { label: "Salary Slips", href: "/hr/payroll/slips" },
          { label: "Bonus", href: "/hr/payroll/bonus" },
          { label: "Incentives", href: "/hr/payroll/incentives" },
          { label: "Deductions", href: "/hr/payroll/deductions" },
          { label: "Reimbursements", href: "/hr/payroll/reimbursements" },
          { label: "Full & Final Settlement", href: "/hr/payroll/fnf" },
        ]
      },
      {
        icon: Target,
        label: "Performance Management",
        href: "/hr/performance",
        subItems: [
          { label: "KPI Management", href: "/hr/performance/kpi" },
          { label: "Performance Review", href: "/hr/performance/review" },
          { label: "Appraisals", href: "/hr/performance/appraisals" },
          { label: "Promotions", href: "/hr/performance/promotions" },
          { label: "Increment History", href: "/hr/performance/increment" },
        ]
      },
      {
        icon: BookOpen,
        label: "Training & Development",
        href: "/hr/training",
        subItems: [
          { label: "Training Calendar", href: "/hr/training/calendar" },
          { label: "Training Programs", href: "/hr/training/programs" },
          { label: "Certifications", href: "/hr/training/certifications" },
          { label: "CME Programs", href: "/hr/training/cme" },
          { label: "Skill Assessment", href: "/hr/training/assessment" },
        ]
      },
      {
        icon: Shield,
        label: "Compliance",
        href: "/hr/compliance",
        subItems: [
          { label: "Employee Documents", href: "/hr/compliance/documents" },
          { label: "License Verification", href: "/hr/compliance/license" },
          { label: "Medical Registration", href: "/hr/compliance/registration" },
          { label: "NABH Compliance", href: "/hr/compliance/nabh" },
          { label: "Vaccination Records", href: "/hr/compliance/vaccination" },
          { label: "Mandatory Trainings", href: "/hr/compliance/training" },
        ]
      },
      {
        icon: HeartPulse,
        label: "Employee Health",
        href: "/hr/health",
        subItems: [
          { label: "Health Checkups", href: "/hr/health/checkups" },
          { label: "Vaccination Status", href: "/hr/health/vaccination" },
          { label: "Occupational Health", href: "/hr/health/occupational" },
          { label: "Injury Reports", href: "/hr/health/injury" },
          { label: "Fitness Certificates", href: "/hr/health/fitness" },
        ]
      },
      {
        icon: Receipt,
        label: "Claims & Reimbursements",
        href: "/hr/claims",
        subItems: [
          { label: "Travel Claims", href: "/hr/claims/travel" },
          { label: "Medical Reimbursements", href: "/hr/claims/medical" },
          { label: "Expense Claims", href: "/hr/claims/expense" },
          { label: "Approval Workflow", href: "/hr/claims/workflow" },
        ]
      },
      {
        icon: MessageCircle,
        label: "Communication",
        href: "/hr/communication",
        subItems: [
          { label: "HR Announcements", href: "/hr/communication/announcements" },
          { label: "Internal Messages", href: "/hr/communication/messages" },
          { label: "Circulars", href: "/hr/communication/circulars" },
          { label: "Employee Notices", href: "/hr/communication/notices" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/hr/reports",
        subItems: [
          { label: "Employee Report", href: "/hr/reports/employee" },
          { label: "Attendance Report", href: "/hr/reports/attendance" },
          { label: "Leave Report", href: "/hr/reports/leave" },
          { label: "Payroll Report", href: "/hr/reports/payroll" },
          { label: "Recruitment Report", href: "/hr/reports/recruitment" },
          { label: "Training Report", href: "/hr/reports/training" },
          { label: "Performance Report", href: "/hr/reports/performance" },
          { label: "Compliance Report", href: "/hr/reports/compliance" },
          { label: "Attrition Report", href: "/hr/reports/attrition" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/hr/analytics",
        subItems: [
          { label: "Workforce Dashboard", href: "/hr/analytics/workforce" },
          { label: "Department-wise Employees", href: "/hr/analytics/department" },
          { label: "Attendance Analytics", href: "/hr/analytics/attendance" },
          { label: "Payroll Analytics", href: "/hr/analytics/payroll" },
          { label: "Recruitment Analytics", href: "/hr/analytics/recruitment" },
          { label: "Attrition Analytics", href: "/hr/analytics/attrition" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/hr/settings",
        subItems: [
          { label: "Departments", href: "/hr/settings/departments" },
          { label: "Designations", href: "/hr/settings/designations" },
          { label: "Employment Types", href: "/hr/settings/employment" },
          { label: "Salary Components", href: "/hr/settings/salary" },
          { label: "Leave Types", href: "/hr/settings/leave" },
          { label: "Shift Rules", href: "/hr/settings/shift" },
          { label: "Approval Matrix", href: "/hr/settings/approval" },
        ]
      }

];
