import { LayoutDashboard, Users, FileText, BarChart3, Settings, Pill, Activity, Stethoscope, Package, ClipboardList, Star, CheckSquare, Shield, ShoppingBag, Receipt } from "lucide-react";
import type { NavItem } from "./types";

export const pharmacyMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/pharmacy",
      },
      {
        icon: ClipboardList,
        label: "Prescription Management",
        href: "/pharmacy/prescriptions",
        subItems: [
          { label: "Prescription Queue", href: "/pharmacy/prescriptions/queue" },
          { label: "New Prescription", href: "/pharmacy/prescriptions/new" },
          { label: "Pending Verification", href: "/pharmacy/prescriptions/verification" },
          { label: "Dispensing Queue", href: "/pharmacy/prescriptions/dispensing" },
          { label: "E-Prescriptions", href: "/pharmacy/prescriptions/e-prescriptions" },
        ]
      },
      {
        icon: Pill,
        label: "Medicine Dispensing",
        href: "/pharmacy/dispensing",
        subItems: [
          { label: "OPD Dispensing", href: "/pharmacy/dispensing/opd" },
          { label: "IPD Dispensing", href: "/pharmacy/dispensing/ipd" },
          { label: "Emergency Dispensing", href: "/pharmacy/dispensing/emergency" },
          { label: "Discharge Medicines", href: "/pharmacy/dispensing/discharge" },
          { label: "Partial Dispensing", href: "/pharmacy/dispensing/partial" },
          { label: "Return Medicines", href: "/pharmacy/dispensing/return" },
        ]
      },
      {
        icon: Package,
        label: "Medicine Inventory",
        href: "/pharmacy/inventory",
        subItems: [
          { label: "Current Stock", href: "/pharmacy/inventory/current" },
          { label: "Stock Availability", href: "/pharmacy/inventory/availability" },
          { label: "Batch Management", href: "/pharmacy/inventory/batch" },
          { label: "Expiry Management", href: "/pharmacy/inventory/expiry" },
          { label: "Near Expiry", href: "/pharmacy/inventory/near-expiry" },
          { label: "Damaged Medicines", href: "/pharmacy/inventory/damaged" },
          { label: "Stock Adjustment", href: "/pharmacy/inventory/adjustment" },
        ]
      },
      {
        icon: ShoppingBag,
        label: "Purchase & Procurement",
        href: "/pharmacy/purchase",
        subItems: [
          { label: "Purchase Requisition", href: "/pharmacy/purchase/requisition" },
          { label: "Purchase Orders", href: "/pharmacy/purchase/orders" },
          { label: "Goods Receipt (GRN)", href: "/pharmacy/purchase/grn" },
          { label: "Vendor Management", href: "/pharmacy/purchase/vendor" },
          { label: "Purchase Returns", href: "/pharmacy/purchase/returns" },
          { label: "Invoice Verification", href: "/pharmacy/purchase/invoice" },
        ]
      },
      {
        icon: FileText,
        label: "Medicine Master",
        href: "/pharmacy/master",
        subItems: [
          { label: "Medicine Catalog", href: "/pharmacy/master/catalog" },
          { label: "Generic Medicines", href: "/pharmacy/master/generic" },
          { label: "Brand Medicines", href: "/pharmacy/master/brand" },
          { label: "Drug Classification", href: "/pharmacy/master/classification" },
          { label: "Strength & Dosage", href: "/pharmacy/master/strength" },
          { label: "Manufacturers", href: "/pharmacy/master/manufacturers" },
        ]
      },
      {
        icon: Stethoscope,
        label: "Clinical Pharmacy",
        href: "/pharmacy/clinical",
        subItems: [
          { label: "Drug Interaction Check", href: "/pharmacy/clinical/interaction" },
          { label: "Allergy Check", href: "/pharmacy/clinical/allergy" },
          { label: "Duplicate Therapy", href: "/pharmacy/clinical/duplicate" },
          { label: "High Risk Medicines", href: "/pharmacy/clinical/high-risk" },
          { label: "Antibiotic Stewardship", href: "/pharmacy/clinical/antibiotic" },
        ]
      },
      {
        icon: Shield,
        label: "Controlled Drugs",
        href: "/pharmacy/controlled",
        subItems: [
          { label: "Narcotic Register", href: "/pharmacy/controlled/narcotic" },
          { label: "Controlled Drug Issue", href: "/pharmacy/controlled/issue" },
          { label: "Controlled Drug Returns", href: "/pharmacy/controlled/returns" },
          { label: "Controlled Drug Audit", href: "/pharmacy/controlled/audit" },
        ]
      },
      {
        icon: Receipt,
        label: "Billing",
        href: "/pharmacy/billing",
        subItems: [
          { label: "Pharmacy Billing", href: "/pharmacy/billing/pharmacy" },
          { label: "Insurance Billing", href: "/pharmacy/billing/insurance" },
          { label: "Corporate Billing", href: "/pharmacy/billing/corporate" },
          { label: "Government Scheme Billing", href: "/pharmacy/billing/scheme" },
          { label: "Refunds", href: "/pharmacy/billing/refunds" },
          { label: "Credit Billing", href: "/pharmacy/billing/credit" },
        ]
      },
      {
        icon: Users,
        label: "Patient Services",
        href: "/pharmacy/services",
        subItems: [
          { label: "Medication History", href: "/pharmacy/services/history" },
          { label: "Refill Requests", href: "/pharmacy/services/refill" },
          { label: "Patient Counseling", href: "/pharmacy/services/counseling" },
          { label: "Home Delivery", href: "/pharmacy/services/delivery" },
          { label: "Medication Reminders", href: "/pharmacy/services/reminders" },
        ]
      },
      {
        icon: Activity,
        label: "Inventory Operations",
        href: "/pharmacy/operations",
        subItems: [
          { label: "Stock Transfer", href: "/pharmacy/operations/transfer" },
          { label: "Internal Issue", href: "/pharmacy/operations/issue" },
          { label: "Stock Return", href: "/pharmacy/operations/return" },
          { label: "Physical Stock Audit", href: "/pharmacy/operations/audit" },
          { label: "Cycle Count", href: "/pharmacy/operations/cycle-count" },
        ]
      },
      {
        icon: CheckSquare,
        label: "Quality & Compliance",
        href: "/pharmacy/quality",
        subItems: [
          { label: "Expired Medicines", href: "/pharmacy/quality/expired" },
          { label: "Recall Management", href: "/pharmacy/quality/recall" },
          { label: "Temperature Monitoring", href: "/pharmacy/quality/temperature" },
          { label: "Cold Chain Management", href: "/pharmacy/quality/cold-chain" },
          { label: "Regulatory Compliance", href: "/pharmacy/quality/compliance" },
        ]
      },
      {
        icon: BarChart3,
        label: "Reports",
        href: "/pharmacy/reports",
        subItems: [
          { label: "Daily Sales", href: "/pharmacy/reports/sales" },
          { label: "Medicine Sales", href: "/pharmacy/reports/medicine-sales" },
          { label: "Stock Report", href: "/pharmacy/reports/stock" },
          { label: "Expiry Report", href: "/pharmacy/reports/expiry" },
          { label: "Purchase Report", href: "/pharmacy/reports/purchase" },
          { label: "Dispensing Report", href: "/pharmacy/reports/dispensing" },
          { label: "Controlled Drug Report", href: "/pharmacy/reports/controlled" },
          { label: "Profit & Loss", href: "/pharmacy/reports/pl" },
          { label: "Inventory Valuation", href: "/pharmacy/reports/valuation" },
        ]
      },
      {
        icon: Star,
        label: "Analytics",
        href: "/pharmacy/analytics",
        subItems: [
          { label: "Fast Moving Medicines", href: "/pharmacy/analytics/fast-moving" },
          { label: "Slow Moving Medicines", href: "/pharmacy/analytics/slow-moving" },
          { label: "ABC Analysis", href: "/pharmacy/analytics/abc" },
          { label: "XYZ Analysis", href: "/pharmacy/analytics/xyz" },
          { label: "Drug Consumption", href: "/pharmacy/analytics/consumption" },
          { label: "Pharmacist Performance", href: "/pharmacy/analytics/performance" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/pharmacy/settings",
        subItems: [
          { label: "Pharmacy Profile", href: "/pharmacy/settings/profile" },
          { label: "Medicine Categories", href: "/pharmacy/settings/categories" },
          { label: "Units of Measure", href: "/pharmacy/settings/units" },
          { label: "Tax Configuration", href: "/pharmacy/settings/tax" },
          { label: "Discount Rules", href: "/pharmacy/settings/discount" },
        ]
      }
];
