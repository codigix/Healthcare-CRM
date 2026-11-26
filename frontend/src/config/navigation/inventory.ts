import { LayoutDashboard, FileText, BarChart3, Settings, LogOut, Activity, Syringe, Clipboard, Package, ClipboardList, Hotel, Clock, CheckSquare, Wrench, Receipt } from "lucide-react";
import type { NavItem } from "./types";

export const inventoryMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/inventory",
      },
      {
        icon: Package,
        label: "Item Master",
        href: "/inventory/master",
        subItems: [
          { label: "Item Master", href: "/inventory/master/items" },
          { label: "Categories", href: "/inventory/master/categories" },
          { label: "Sub Categories", href: "/inventory/master/subcategories" },
          { label: "Units of Measure", href: "/inventory/master/units" },
          { label: "Brands", href: "/inventory/master/brands" },
          { label: "Manufacturers", href: "/inventory/master/manufacturers" },
          { label: "Item Mapping", href: "/inventory/master/mapping" },
          { label: "Barcode / QR Code", href: "/inventory/master/barcode" },
        ]
      },
      {
        icon: Hotel,
        label: "Warehouse Management",
        href: "/inventory/warehouse",
        subItems: [
          { label: "Warehouses", href: "/inventory/warehouse/list" },
          { label: "Store Locations", href: "/inventory/warehouse/locations" },
          { label: "Rack Management", href: "/inventory/warehouse/racks" },
          { label: "Bin Management", href: "/inventory/warehouse/bins" },
        ]
      },
      {
        icon: ClipboardList,
        label: "Stock Management",
        href: "/inventory/stock",
        subItems: [
          { label: "Current Stock", href: "/inventory/stock/current" },
          { label: "Stock Ledger", href: "/inventory/stock/ledger" },
          { label: "Stock Availability", href: "/inventory/stock/availability" },
          { label: "Stock Adjustment", href: "/inventory/stock/adjustment" },
          { label: "Opening Stock", href: "/inventory/stock/opening" },
          { label: "Closing Stock", href: "/inventory/stock/closing" },
          { label: "Reorder Level", href: "/inventory/stock/reorder" },
          { label: "Minimum & Maximum Stock", href: "/inventory/stock/min-max" },
        ]
      },
      {
        icon: Clock,
        label: "Batch & Expiry",
        href: "/inventory/batch",
        subItems: [
          { label: "Batch Management", href: "/inventory/batch/management" },
          { label: "Expiry Monitoring", href: "/inventory/batch/expiry" },
          { label: "Near Expiry", href: "/inventory/batch/near-expiry" },
          { label: "Expired Items", href: "/inventory/batch/expired" },
          { label: "Recall Management", href: "/inventory/batch/recall" },
        ]
      },
      {
        icon: Receipt,
        label: "Goods Receipt",
        href: "/inventory/grn",
        subItems: [
          { label: "Goods Receipt Note (GRN)", href: "/inventory/grn/note" },
          { label: "GRN Verification", href: "/inventory/grn/verification" },
          { label: "GRN History", href: "/inventory/grn/history" },
          { label: "Pending GRN", href: "/inventory/grn/pending" },
        ]
      },
      {
        icon: Clipboard,
        label: "Department Issue",
        href: "/inventory/issue",
        subItems: [
          { label: "Issue Request", href: "/inventory/issue/request" },
          { label: "Pending Requests", href: "/inventory/issue/pending" },
          { label: "Approved Issues", href: "/inventory/issue/approved" },
          { label: "Issue Slip", href: "/inventory/issue/slip" },
          { label: "Issue History", href: "/inventory/issue/history" },
        ]
      },
      {
        icon: FileText,
        label: "Department Returns",
        href: "/inventory/returns",
        subItems: [
          { label: "Return Requests", href: "/inventory/returns/request" },
          { label: "Return Approval", href: "/inventory/returns/approval" },
          { label: "Return History", href: "/inventory/returns/history" },
          { label: "Damaged Returns", href: "/inventory/returns/damaged" },
        ]
      },
      {
        icon: LogOut,
        label: "Internal Transfers",
        href: "/inventory/transfers",
        subItems: [
          { label: "Store Transfer", href: "/inventory/transfers/store" },
          { label: "Ward Transfer", href: "/inventory/transfers/ward" },
          { label: "Pharmacy Transfer", href: "/inventory/transfers/pharmacy" },
          { label: "Laboratory Transfer", href: "/inventory/transfers/laboratory" },
          { label: "OT Transfer", href: "/inventory/transfers/ot" },
          { label: "ICU Transfer", href: "/inventory/transfers/icu" },
          { label: "Asset Transfer", href: "/inventory/transfers/asset" },
        ]
      },
      {
        icon: Syringe,
        label: "Consumables",
        href: "/inventory/consumables",
        subItems: [
          { label: "Ward Consumables", href: "/inventory/consumables/ward" },
          { label: "OT Consumables", href: "/inventory/consumables/ot" },
          { label: "ICU Consumables", href: "/inventory/consumables/icu" },
          { label: "Laboratory Consumables", href: "/inventory/consumables/laboratory" },
          { label: "Radiology Consumables", href: "/inventory/consumables/radiology" },
        ]
      },
      {
        icon: Wrench,
        label: "Assets",
        href: "/inventory/assets",
        subItems: [
          { label: "Asset Register", href: "/inventory/assets/register" },
          { label: "Asset Allocation", href: "/inventory/assets/allocation" },
          { label: "Asset Movement", href: "/inventory/assets/movement" },
          { label: "Asset Verification", href: "/inventory/assets/verification" },
          { label: "Asset Disposal", href: "/inventory/assets/disposal" },
        ]
      },
      {
        icon: Activity,
        label: "Biomedical Equipment",
        href: "/inventory/biomedical",
        subItems: [
          { label: "Equipment Register", href: "/inventory/biomedical/register" },
          { label: "Equipment Allocation", href: "/inventory/biomedical/allocation" },
          { label: "Calibration", href: "/inventory/biomedical/calibration" },
          { label: "Preventive Maintenance", href: "/inventory/biomedical/maintenance" },
          { label: "Breakdown History", href: "/inventory/biomedical/breakdown" },
          { label: "AMC Tracking", href: "/inventory/biomedical/amc" },
        ]
      },
      {
        icon: CheckSquare,
        label: "Physical Verification",
        href: "/inventory/verification",
        subItems: [
          { label: "Physical Stock Count", href: "/inventory/verification/count" },
          { label: "Cycle Count", href: "/inventory/verification/cycle" },
          { label: "Stock Reconciliation", href: "/inventory/verification/reconciliation" },
          { label: "Variance Report", href: "/inventory/verification/variance" },
        ]
      },
      {
        icon: FileText,
        label: "Inventory Reports",
        href: "/inventory/reports",
        subItems: [
          { label: "Stock Report", href: "/inventory/reports/stock" },
          { label: "Stock Valuation", href: "/inventory/reports/valuation" },
          { label: "Stock Movement", href: "/inventory/reports/movement" },
          { label: "Item Consumption", href: "/inventory/reports/consumption" },
          { label: "Department Consumption", href: "/inventory/reports/department" },
          { label: "Expiry Report", href: "/inventory/reports/expiry" },
          { label: "Batch Report", href: "/inventory/reports/batch" },
          { label: "Dead Stock Report", href: "/inventory/reports/dead-stock" },
          { label: "Slow Moving Items", href: "/inventory/reports/slow-moving" },
          { label: "Fast Moving Items", href: "/inventory/reports/fast-moving" },
          { label: "ABC Analysis", href: "/inventory/reports/abc" },
          { label: "XYZ Analysis", href: "/inventory/reports/xyz" },
          { label: "FSN Analysis", href: "/inventory/reports/fsn" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/inventory/analytics",
        subItems: [
          { label: "Inventory Dashboard", href: "/inventory/analytics/dashboard" },
          { label: "Department Consumption", href: "/inventory/analytics/department" },
          { label: "Stock Turnover", href: "/inventory/analytics/turnover" },
          { label: "Inventory Cost Analysis", href: "/inventory/analytics/cost" },
          { label: "Reorder Analysis", href: "/inventory/analytics/reorder" },
          { label: "Monthly Trends", href: "/inventory/analytics/trends" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/inventory/settings",
        subItems: [
          { label: "Inventory Settings", href: "/inventory/settings/general" },
          { label: "Number Series", href: "/inventory/settings/number-series" },
          { label: "Barcode Settings", href: "/inventory/settings/barcode" },
          { label: "Approval Rules", href: "/inventory/settings/approval" },
        ]
      }
];
