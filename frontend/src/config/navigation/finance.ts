import { LayoutDashboard, Users, FileText, Settings, Activity, CheckSquare, Wrench, Shield, Receipt, Wallet, Banknote, CreditCard, Landmark, Calculator, Percent, PieChart } from "lucide-react";
import type { NavItem } from "./types";

export const financeMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: Receipt,
        label: "Patient Billing",
        href: "/finance/billing",
        subItems: [
          { label: "OPD Billing", href: "/finance/billing/opd" },
          { label: "IPD Billing", href: "/finance/billing/ipd" },
          { label: "Emergency Billing", href: "/finance/billing/emergency" },
          { label: "Pharmacy Billing", href: "/finance/billing/pharmacy" },
          { label: "Laboratory Billing", href: "/finance/billing/laboratory" },
          { label: "Radiology Billing", href: "/finance/billing/radiology" },
          { label: "Procedure Billing", href: "/finance/billing/procedure" },
          { label: "Package Billing", href: "/finance/billing/package" },
          { label: "Corporate Billing", href: "/finance/billing/corporate" },
        ]
      },
      {
        icon: Wallet,
        label: "Cash & Receipts",
        href: "/finance/cash",
        subItems: [
          { label: "Cash Collection", href: "/finance/cash/collection" },
          { label: "Receipt Entry", href: "/finance/cash/receipt" },
          { label: "Advance Collection", href: "/finance/cash/advance" },
          { label: "Refund Management", href: "/finance/cash/refund" },
          { label: "Deposit Management", href: "/finance/cash/deposit" },
          { label: "Shift Closing", href: "/finance/cash/shift" },
          { label: "Cash Book", href: "/finance/cash/book" },
        ]
      },
      {
        icon: CreditCard,
        label: "Patient Payments",
        href: "/finance/payments",
        subItems: [
          { label: "Outstanding Payments", href: "/finance/payments/outstanding" },
          { label: "Payment History", href: "/finance/payments/history" },
          { label: "Payment Adjustments", href: "/finance/payments/adjustments" },
          { label: "Credit Settlement", href: "/finance/payments/settlement" },
          { label: "Payment Plans", href: "/finance/payments/plans" },
        ]
      },
      {
        icon: Shield,
        label: "Insurance & TPA",
        href: "/finance/insurance",
        subItems: [
          { label: "Insurance Verification", href: "/finance/insurance/verification" },
          { label: "Pre-Authorization", href: "/finance/insurance/preauth" },
          { label: "Cashless Approval", href: "/finance/insurance/approval" },
          { label: "Claim Submission", href: "/finance/insurance/submission" },
          { label: "Claim Tracking", href: "/finance/insurance/tracking" },
          { label: "Claim Settlement", href: "/finance/insurance/settlement" },
          { label: "Claim Rejection", href: "/finance/insurance/rejection" },
          { label: "TPA Management", href: "/finance/insurance/tpa" },
        ]
      },
      {
        icon: Landmark,
        label: "Government Schemes",
        href: "/finance/schemes",
        subItems: [
          { label: "Ayushman Bharat (PM-JAY)", href: "/finance/schemes/ayushman" },
          { label: "CGHS", href: "/finance/schemes/cghs" },
          { label: "ESIC", href: "/finance/schemes/esic" },
          { label: "MJPJAY", href: "/finance/schemes/mjpjay" },
          { label: "State Health Schemes", href: "/finance/schemes/state" },
          { label: "Scheme Verification", href: "/finance/schemes/verification" },
          { label: "Package Approval", href: "/finance/schemes/approval" },
          { label: "Claim Management", href: "/finance/schemes/claims" },
        ]
      },
      {
        icon: Banknote,
        label: "Accounts Receivable (AR)",
        href: "/finance/ar",
        subItems: [
          { label: "Patient Receivables", href: "/finance/ar/patient" },
          { label: "Insurance Receivables", href: "/finance/ar/insurance" },
          { label: "Corporate Receivables", href: "/finance/ar/corporate" },
          { label: "Aging Analysis", href: "/finance/ar/aging" },
          { label: "Collection Follow-up", href: "/finance/ar/collection" },
        ]
      },
      {
        icon: Calculator,
        label: "Accounts Payable (AP)",
        href: "/finance/ap",
        subItems: [
          { label: "Vendor Bills", href: "/finance/ap/bills" },
          { label: "Purchase Invoices", href: "/finance/ap/invoices" },
          { label: "Payment Approval", href: "/finance/ap/approval" },
          { label: "Vendor Payments", href: "/finance/ap/payments" },
          { label: "Outstanding Payables", href: "/finance/ap/outstanding" },
        ]
      },
      {
        icon: FileText,
        label: "Accounting",
        href: "/finance/accounting",
        subItems: [
          { label: "Journal Entries", href: "/finance/accounting/journal" },
          { label: "General Ledger", href: "/finance/accounting/ledger" },
          { label: "Chart of Accounts", href: "/finance/accounting/coa" },
          { label: "Cost Centers", href: "/finance/accounting/cost-centers" },
          { label: "Trial Balance", href: "/finance/accounting/trial-balance" },
          { label: "Opening Balances", href: "/finance/accounting/opening" },
        ]
      },
      {
        icon: Landmark,
        label: "Banking",
        href: "/finance/banking",
        subItems: [
          { label: "Bank Accounts", href: "/finance/banking/accounts" },
          { label: "Bank Deposits", href: "/finance/banking/deposits" },
          { label: "Bank Payments", href: "/finance/banking/payments" },
          { label: "Bank Transfers", href: "/finance/banking/transfers" },
          { label: "Bank Reconciliation", href: "/finance/banking/reconciliation" },
        ]
      },
      {
        icon: Percent,
        label: "Taxation",
        href: "/finance/taxation",
        subItems: [
          { label: "GST", href: "/finance/taxation/gst" },
          { label: "TDS", href: "/finance/taxation/tds" },
          { label: "Tax Invoices", href: "/finance/taxation/invoices" },
          { label: "Credit Notes", href: "/finance/taxation/credit" },
          { label: "Debit Notes", href: "/finance/taxation/debit" },
          { label: "Tax Reports", href: "/finance/taxation/reports" },
        ]
      },
      {
        icon: Wrench,
        label: "Fixed Assets",
        href: "/finance/assets",
        subItems: [
          { label: "Asset Register", href: "/finance/assets/register" },
          { label: "Asset Depreciation", href: "/finance/assets/depreciation" },
          { label: "Asset Capitalization", href: "/finance/assets/capitalization" },
          { label: "Asset Disposal", href: "/finance/assets/disposal" },
        ]
      },
      {
        icon: Users,
        label: "Payroll Finance",
        href: "/finance/payroll",
        subItems: [
          { label: "Salary Posting", href: "/finance/payroll/salary" },
          { label: "Payroll Journal", href: "/finance/payroll/journal" },
          { label: "Statutory Deductions", href: "/finance/payroll/deductions" },
          { label: "PF / ESI Posting", href: "/finance/payroll/pf-esi" },
        ]
      },
      {
        icon: Activity,
        label: "Revenue Management",
        href: "/finance/revenue",
        subItems: [
          { label: "Department Revenue", href: "/finance/revenue/department" },
          { label: "Doctor Revenue", href: "/finance/revenue/doctor" },
          { label: "Package Revenue", href: "/finance/revenue/package" },
          { label: "Daily Revenue", href: "/finance/revenue/daily" },
          { label: "Monthly Revenue", href: "/finance/revenue/monthly" },
          { label: "Revenue Analytics", href: "/finance/revenue/analytics" },
        ]
      },
      {
        icon: FileText,
        label: "Financial Reports",
        href: "/finance/reports",
        subItems: [
          { label: "Daily Collection", href: "/finance/reports/collection" },
          { label: "Revenue Report", href: "/finance/reports/revenue" },
          { label: "Income Statement (P&L)", href: "/finance/reports/pl" },
          { label: "Balance Sheet", href: "/finance/reports/balance-sheet" },
          { label: "Cash Flow", href: "/finance/reports/cash-flow" },
          { label: "Trial Balance", href: "/finance/reports/trial-balance" },
          { label: "General Ledger Report", href: "/finance/reports/gl" },
          { label: "GST Report", href: "/finance/reports/gst" },
          { label: "Insurance Report", href: "/finance/reports/insurance" },
          { label: "Government Scheme Report", href: "/finance/reports/scheme" },
          { label: "Outstanding Report", href: "/finance/reports/outstanding" },
          { label: "Refund Report", href: "/finance/reports/refund" },
          { label: "Department Revenue Report", href: "/finance/reports/department" },
        ]
      },
      {
        icon: CheckSquare,
        label: "Audit & Compliance",
        href: "/finance/audit",
        subItems: [
          { label: "Financial Audit", href: "/finance/audit/financial" },
          { label: "Transaction Audit", href: "/finance/audit/transaction" },
          { label: "Audit Logs", href: "/finance/audit/logs" },
          { label: "Approval History", href: "/finance/audit/approval" },
        ]
      },
      {
        icon: PieChart,
        label: "Analytics",
        href: "/finance/analytics",
        subItems: [
          { label: "Revenue Dashboard", href: "/finance/analytics/revenue" },
          { label: "Collection Analytics", href: "/finance/analytics/collection" },
          { label: "Profitability Analysis", href: "/finance/analytics/profitability" },
          { label: "Insurance Analytics", href: "/finance/analytics/insurance" },
          { label: "Financial KPIs", href: "/finance/analytics/kpis" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/finance/settings",
        subItems: [
          { label: "Charge Master", href: "/finance/settings/charge-master" },
          { label: "Billing Rules", href: "/finance/settings/billing-rules" },
          { label: "Payment Modes", href: "/finance/settings/payment-modes" },
          { label: "Discount Rules", href: "/finance/settings/discount-rules" },
          { label: "Financial Year", href: "/finance/settings/financial-year" },
          { label: "Number Series", href: "/finance/settings/number-series" },
          { label: "Approval Matrix", href: "/finance/settings/approval-matrix" },
        ]
      }
];
