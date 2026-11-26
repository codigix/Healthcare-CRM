import { LayoutDashboard, Users, FileText, BarChart3, Settings, Activity, Stethoscope, Package, Users2, HeartPulse, Banknote, Building, ShieldAlert, Presentation, TrendingUp, BrainCircuit, CheckCircle2 } from "lucide-react";
import type { NavItem } from "./types";

export const executiveMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/executive",
      },
      {
        icon: Presentation,
        label: "Executive Overview",
        href: "/executive/overview",
        subItems: [
          { label: "Hospital KPIs", href: "/executive/overview/kpis" },
          { label: "Today's Summary", href: "/executive/overview/summary" },
          { label: "Live Dashboard", href: "/executive/overview/live" },
          { label: "Hospital Scorecard", href: "/executive/overview/scorecard" },
          { label: "Executive Alerts", href: "/executive/overview/alerts" },
        ]
      },
      {
        icon: Users,
        label: "Patient Analytics",
        href: "/executive/patients",
        subItems: [
          { label: "OPD Analytics", href: "/executive/patients/opd" },
          { label: "IPD Analytics", href: "/executive/patients/ipd" },
          { label: "Emergency Analytics", href: "/executive/patients/emergency" },
          { label: "Admissions", href: "/executive/patients/admissions" },
          { label: "Discharges", href: "/executive/patients/discharges" },
          { label: "Readmissions", href: "/executive/patients/readmissions" },
          { label: "Patient Flow", href: "/executive/patients/flow" },
          { label: "Bed Occupancy", href: "/executive/patients/occupancy" },
          { label: "Average Length of Stay", href: "/executive/patients/alos" },
        ]
      },
      {
        icon: Stethoscope,
        label: "Clinical Analytics",
        href: "/executive/clinical",
        subItems: [
          { label: "Department Performance", href: "/executive/clinical/departments" },
          { label: "Doctor Performance", href: "/executive/clinical/doctors" },
          { label: "Surgery Analytics", href: "/executive/clinical/surgery" },
          { label: "ICU Analytics", href: "/executive/clinical/icu" },
          { label: "Mortality Analysis", href: "/executive/clinical/mortality" },
          { label: "Infection Analytics", href: "/executive/clinical/infection" },
          { label: "Clinical Outcomes", href: "/executive/clinical/outcomes" },
          { label: "Quality Indicators", href: "/executive/clinical/quality" },
        ]
      },
      {
        icon: Banknote,
        label: "Financial Analytics",
        href: "/executive/financial",
        subItems: [
          { label: "Revenue Dashboard", href: "/executive/financial/revenue" },
          { label: "Daily Collections", href: "/executive/financial/collections" },
          { label: "Department Revenue", href: "/executive/financial/departments" },
          { label: "Doctor Revenue", href: "/executive/financial/doctors" },
          { label: "Insurance Revenue", href: "/executive/financial/insurance" },
          { label: "Government Scheme Revenue", href: "/executive/financial/schemes" },
          { label: "Profit & Loss", href: "/executive/financial/pnl" },
          { label: "Cash Flow", href: "/executive/financial/cashflow" },
          { label: "Outstanding Receivables", href: "/executive/financial/receivables" },
          { label: "Financial KPIs", href: "/executive/financial/kpis" },
        ]
      },
      {
        icon: Activity,
        label: "Operational Analytics",
        href: "/executive/operations",
        subItems: [
          { label: "Appointment Analytics", href: "/executive/operations/appointments" },
          { label: "Waiting Time", href: "/executive/operations/waiting" },
          { label: "Queue Analysis", href: "/executive/operations/queue" },
          { label: "OT Utilization", href: "/executive/operations/ot" },
          { label: "Laboratory Performance", href: "/executive/operations/lab" },
          { label: "Radiology Performance", href: "/executive/operations/radiology" },
          { label: "Pharmacy Performance", href: "/executive/operations/pharmacy" },
        ]
      },
      {
        icon: Package,
        label: "Inventory Analytics",
        href: "/executive/inventory",
        subItems: [
          { label: "Stock Valuation", href: "/executive/inventory/valuation" },
          { label: "Stock Consumption", href: "/executive/inventory/consumption" },
          { label: "Reorder Status", href: "/executive/inventory/reorder" },
          { label: "Purchase Analytics", href: "/executive/inventory/purchase" },
          { label: "Vendor Performance", href: "/executive/inventory/vendors" },
          { label: "Asset Utilization", href: "/executive/inventory/assets" },
          { label: "Equipment Downtime", href: "/executive/inventory/downtime" },
        ]
      },
      {
        icon: Users2,
        label: "Human Resource Analytics",
        href: "/executive/hr",
        subItems: [
          { label: "Employee Dashboard", href: "/executive/hr/dashboard" },
          { label: "Attendance Analytics", href: "/executive/hr/attendance" },
          { label: "Payroll Analytics", href: "/executive/hr/payroll" },
          { label: "Productivity", href: "/executive/hr/productivity" },
          { label: "Staff Utilization", href: "/executive/hr/utilization" },
          { label: "Recruitment Analytics", href: "/executive/hr/recruitment" },
          { label: "Attrition Analysis", href: "/executive/hr/attrition" },
        ]
      },
      {
        icon: ShieldAlert,
        label: "Quality & Compliance",
        href: "/executive/quality",
        subItems: [
          { label: "NABH Compliance", href: "/executive/quality/nabh" },
          { label: "Clinical Audit", href: "/executive/quality/audit" },
          { label: "Infection Control", href: "/executive/quality/infection" },
          { label: "Incident Reports", href: "/executive/quality/incidents" },
          { label: "CAPA Tracking", href: "/executive/quality/capa" },
          { label: "Patient Safety Indicators", href: "/executive/quality/safety" },
        ]
      },
      {
        icon: HeartPulse,
        label: "Patient Experience",
        href: "/executive/experience",
        subItems: [
          { label: "Patient Satisfaction", href: "/executive/experience/satisfaction" },
          { label: "NPS Score", href: "/executive/experience/nps" },
          { label: "Feedback Analysis", href: "/executive/experience/feedback" },
          { label: "Complaint Analysis", href: "/executive/experience/complaints" },
          { label: "CRM Performance", href: "/executive/experience/crm" },
          { label: "Telemedicine Analytics", href: "/executive/experience/telemedicine" },
        ]
      },
      {
        icon: Building,
        label: "Facility Analytics",
        href: "/executive/facility",
        subItems: [
          { label: "Housekeeping KPIs", href: "/executive/facility/housekeeping" },
          { label: "Maintenance KPIs", href: "/executive/facility/maintenance" },
          { label: "Ambulance Utilization", href: "/executive/facility/ambulance" },
          { label: "Biomedical Equipment", href: "/executive/facility/biomedical" },
          { label: "Utility Consumption", href: "/executive/facility/utilities" },
        ]
      },
      {
        icon: TrendingUp,
        label: "Strategic Planning",
        href: "/executive/strategy",
        subItems: [
          { label: "Budget Planning", href: "/executive/strategy/budget" },
          { label: "Forecasting", href: "/executive/strategy/forecasting" },
          { label: "Capacity Planning", href: "/executive/strategy/capacity" },
          { label: "Growth Analysis", href: "/executive/strategy/growth" },
          { label: "Branch Comparison", href: "/executive/strategy/branch" },
          { label: "Department Benchmarking", href: "/executive/strategy/benchmarking" },
        ]
      },
      {
        icon: BrainCircuit,
        label: "AI Insights",
        href: "/executive/ai",
        subItems: [
          { label: "Revenue Prediction", href: "/executive/ai/revenue" },
          { label: "Patient Volume Forecast", href: "/executive/ai/patients" },
          { label: "Disease Trends", href: "/executive/ai/disease" },
          { label: "Resource Forecast", href: "/executive/ai/resources" },
          { label: "Staffing Prediction", href: "/executive/ai/staffing" },
          { label: "Inventory Forecast", href: "/executive/ai/inventory" },
          { label: "Risk Analysis", href: "/executive/ai/risk" },
          { label: "Executive Recommendations", href: "/executive/ai/recommendations" },
        ]
      },
      {
        icon: CheckCircle2,
        label: "Approvals",
        href: "/executive/approvals",
        subItems: [
          { label: "Financial Approvals", href: "/executive/approvals/financial" },
          { label: "Purchase Approvals", href: "/executive/approvals/purchase" },
          { label: "HR Approvals", href: "/executive/approvals/hr" },
          { label: "Leave Approvals", href: "/executive/approvals/leave" },
          { label: "Discount Approvals", href: "/executive/approvals/discount" },
          { label: "High Value Claims", href: "/executive/approvals/claims" },
          { label: "Policy Approvals", href: "/executive/approvals/policy" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/executive/reports",
        subItems: [
          { label: "Executive Reports", href: "/executive/reports/executive" },
          { label: "Board Reports", href: "/executive/reports/board" },
          { label: "Daily MIS", href: "/executive/reports/daily" },
          { label: "Weekly MIS", href: "/executive/reports/weekly" },
          { label: "Monthly MIS", href: "/executive/reports/monthly" },
          { label: "Quarterly MIS", href: "/executive/reports/quarterly" },
          { label: "Annual MIS", href: "/executive/reports/annual" },
          { label: "Custom Reports", href: "/executive/reports/custom" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics Center",
        href: "/executive/analytics-center",
        subItems: [
          { label: "Interactive Dashboards", href: "/executive/analytics-center/dashboards" },
          { label: "KPI Builder", href: "/executive/analytics-center/kpi" },
          { label: "Report Builder", href: "/executive/analytics-center/reports" },
          { label: "Data Warehouse", href: "/executive/analytics-center/warehouse" },
          { label: "Business Intelligence", href: "/executive/analytics-center/bi" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/executive/settings",
        subItems: [
          { label: "Dashboard Preferences", href: "/executive/settings/preferences" },
          { label: "KPI Configuration", href: "/executive/settings/kpi" },
          { label: "Report Scheduling", href: "/executive/settings/scheduling" },
          { label: "Notification Settings", href: "/executive/settings/notifications" },
        ]
      }
];
