import { LayoutDashboard, FileText, BarChart3, Settings, Package, Users2, Wrench, Shield, Archive, Building, Cpu, Sparkles, Shirt, Truck, Bus, Trash2, Zap, ShieldAlert } from "lucide-react";
import type { NavItem } from "./types";

export const facilitiesMenu: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: Building,
        label: "Facility Management",
        href: "/facilities/management",
        subItems: [
          { label: "Buildings", href: "/facilities/management/buildings" },
          { label: "Floors", href: "/facilities/management/floors" },
          { label: "Wards", href: "/facilities/management/wards" },
          { label: "Rooms", href: "/facilities/management/rooms" },
          { label: "Facility Requests", href: "/facilities/management/requests" },
          { label: "Facility Inspections", href: "/facilities/management/inspections" },
        ]
      },
      {
        icon: Wrench,
        label: "Maintenance Management",
        href: "/facilities/maintenance",
        subItems: [
          { label: "Maintenance Dashboard", href: "/facilities/maintenance/dashboard" },
          { label: "Work Orders", href: "/facilities/maintenance/work-orders" },
          { label: "Preventive Maintenance", href: "/facilities/maintenance/preventive" },
          { label: "Corrective Maintenance", href: "/facilities/maintenance/corrective" },
          { label: "Breakdown Requests", href: "/facilities/maintenance/breakdown" },
          { label: "AMC Management", href: "/facilities/maintenance/amc" },
          { label: "Service History", href: "/facilities/maintenance/history" },
        ]
      },
      {
        icon: Cpu,
        label: "Biomedical Engineering",
        href: "/facilities/biomedical",
        subItems: [
          { label: "Equipment Dashboard", href: "/facilities/biomedical/dashboard" },
          { label: "Equipment Register", href: "/facilities/biomedical/register" },
          { label: "Equipment Allocation", href: "/facilities/biomedical/allocation" },
          { label: "Calibration", href: "/facilities/biomedical/calibration" },
          { label: "Preventive Maintenance", href: "/facilities/biomedical/preventive" },
          { label: "Breakdown Maintenance", href: "/facilities/biomedical/breakdown" },
          { label: "AMC Contracts", href: "/facilities/biomedical/amc" },
          { label: "Service Reports", href: "/facilities/biomedical/reports" },
        ]
      },
      {
        icon: Sparkles,
        label: "Housekeeping",
        href: "/facilities/housekeeping",
        subItems: [
          { label: "Cleaning Schedule", href: "/facilities/housekeeping/schedule" },
          { label: "Room Cleaning", href: "/facilities/housekeeping/room" },
          { label: "Ward Cleaning", href: "/facilities/housekeeping/ward" },
          { label: "OT Cleaning", href: "/facilities/housekeeping/ot" },
          { label: "ICU Cleaning", href: "/facilities/housekeeping/icu" },
          { label: "Isolation Room Cleaning", href: "/facilities/housekeeping/isolation" },
          { label: "Housekeeping Requests", href: "/facilities/housekeeping/requests" },
          { label: "Cleaning Checklist", href: "/facilities/housekeeping/checklist" },
        ]
      },
      {
        icon: Shirt,
        label: "Laundry & Linen",
        href: "/facilities/laundry",
        subItems: [
          { label: "Linen Inventory", href: "/facilities/laundry/inventory" },
          { label: "Linen Issue", href: "/facilities/laundry/issue" },
          { label: "Linen Return", href: "/facilities/laundry/return" },
          { label: "Laundry Processing", href: "/facilities/laundry/processing" },
          { label: "Damaged Linen", href: "/facilities/laundry/damaged" },
          { label: "Laundry Reports", href: "/facilities/laundry/reports" },
        ]
      },
      {
        icon: Shield,
        label: "Security Management",
        href: "/facilities/security",
        subItems: [
          { label: "Security Dashboard", href: "/facilities/security/dashboard" },
          { label: "Security Staff", href: "/facilities/security/staff" },
          { label: "Visitor Verification", href: "/facilities/security/visitor" },
          { label: "Gate Pass", href: "/facilities/security/gatepass" },
          { label: "Incident Reports", href: "/facilities/security/incident" },
          { label: "CCTV Monitoring", href: "/facilities/security/cctv" },
          { label: "Lost & Found", href: "/facilities/security/lost" },
        ]
      },
      {
        icon: Truck,
        label: "Ambulance Management",
        href: "/facilities/ambulance",
        subItems: [
          { label: "Ambulance Dashboard", href: "/facilities/ambulance/dashboard" },
          { label: "Ambulance Booking", href: "/facilities/ambulance/booking" },
          { label: "Emergency Dispatch", href: "/facilities/ambulance/dispatch" },
          { label: "Driver Management", href: "/facilities/ambulance/driver" },
          { label: "Vehicle Tracking", href: "/facilities/ambulance/tracking" },
          { label: "Trip History", href: "/facilities/ambulance/history" },
          { label: "Ambulance Billing", href: "/facilities/ambulance/billing" },
        ]
      },
      {
        icon: Bus,
        label: "Transport Management",
        href: "/facilities/transport",
        subItems: [
          { label: "Vehicle Management", href: "/facilities/transport/vehicle" },
          { label: "Driver Management", href: "/facilities/transport/driver" },
          { label: "Fuel Log", href: "/facilities/transport/fuel" },
          { label: "Vehicle Maintenance", href: "/facilities/transport/maintenance" },
          { label: "Transport Requests", href: "/facilities/transport/requests" },
        ]
      },
      {
        icon: Archive,
        label: "Mortuary Management",
        href: "/facilities/mortuary",
        subItems: [
          { label: "Mortuary Register", href: "/facilities/mortuary/register" },
          { label: "Body Admission", href: "/facilities/mortuary/admission" },
          { label: "Body Release", href: "/facilities/mortuary/release" },
          { label: "Postmortem Register", href: "/facilities/mortuary/postmortem" },
          { label: "Cold Storage", href: "/facilities/mortuary/storage" },
          { label: "Mortuary Reports", href: "/facilities/mortuary/reports" },
        ]
      },
      {
        icon: Trash2,
        label: "Waste Management",
        href: "/facilities/waste",
        subItems: [
          { label: "Biomedical Waste", href: "/facilities/waste/biomedical" },
          { label: "Waste Collection", href: "/facilities/waste/collection" },
          { label: "Waste Segregation", href: "/facilities/waste/segregation" },
          { label: "Waste Disposal", href: "/facilities/waste/disposal" },
          { label: "Vendor Collection", href: "/facilities/waste/vendor" },
          { label: "Compliance Reports", href: "/facilities/waste/compliance" },
        ]
      },
      {
        icon: Zap,
        label: "Utilities Management",
        href: "/facilities/utilities",
        subItems: [
          { label: "Electricity Monitoring", href: "/facilities/utilities/electricity" },
          { label: "Water Monitoring", href: "/facilities/utilities/water" },
          { label: "Oxygen Supply", href: "/facilities/utilities/oxygen" },
          { label: "Medical Gas Pipeline", href: "/facilities/utilities/gas" },
          { label: "Generator Monitoring", href: "/facilities/utilities/generator" },
          { label: "HVAC Monitoring", href: "/facilities/utilities/hvac" },
        ]
      },
      {
        icon: Package,
        label: "Inventory Requests",
        href: "/facilities/inventory",
        subItems: [
          { label: "Department Requests", href: "/facilities/inventory/department" },
          { label: "Consumable Requests", href: "/facilities/inventory/consumable" },
          { label: "Maintenance Materials", href: "/facilities/inventory/maintenance" },
          { label: "Approval Queue", href: "/facilities/inventory/approval" },
        ]
      },
      {
        icon: Users2,
        label: "Vendor & AMC",
        href: "/facilities/vendors",
        subItems: [
          { label: "Vendor Directory", href: "/facilities/vendors/directory" },
          { label: "AMC Contracts", href: "/facilities/vendors/contracts" },
          { label: "Service Providers", href: "/facilities/vendors/providers" },
          { label: "Contract Renewal", href: "/facilities/vendors/renewal" },
          { label: "Vendor Performance", href: "/facilities/vendors/performance" },
        ]
      },
      {
        icon: ShieldAlert,
        label: "Compliance & Safety",
        href: "/facilities/compliance",
        subItems: [
          { label: "Fire Safety", href: "/facilities/compliance/fire" },
          { label: "Safety Inspection", href: "/facilities/compliance/inspection" },
          { label: "Emergency Drills", href: "/facilities/compliance/drills" },
          { label: "Disaster Management", href: "/facilities/compliance/disaster" },
          { label: "Compliance Audit", href: "/facilities/compliance/audit" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/facilities/reports",
        subItems: [
          { label: "Maintenance Report", href: "/facilities/reports/maintenance" },
          { label: "Housekeeping Report", href: "/facilities/reports/housekeeping" },
          { label: "Laundry Report", href: "/facilities/reports/laundry" },
          { label: "Security Report", href: "/facilities/reports/security" },
          { label: "Ambulance Report", href: "/facilities/reports/ambulance" },
          { label: "Mortuary Report", href: "/facilities/reports/mortuary" },
          { label: "Waste Report", href: "/facilities/reports/waste" },
          { label: "Utility Report", href: "/facilities/reports/utility" },
          { label: "AMC Report", href: "/facilities/reports/amc" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/facilities/analytics",
        subItems: [
          { label: "Facility Dashboard", href: "/facilities/analytics/dashboard" },
          { label: "Maintenance Analytics", href: "/facilities/analytics/maintenance" },
          { label: "Equipment Downtime", href: "/facilities/analytics/downtime" },
          { label: "Utility Consumption", href: "/facilities/analytics/utility" },
          { label: "Vendor Performance", href: "/facilities/analytics/vendor" },
          { label: "Cost Analysis", href: "/facilities/analytics/cost" },
        ]
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/facilities/settings",
        subItems: [
          { label: "Facility Settings", href: "/facilities/settings/facility" },
          { label: "Maintenance Categories", href: "/facilities/settings/categories" },
          { label: "Work Order Types", href: "/facilities/settings/work-orders" },
          { label: "AMC Settings", href: "/facilities/settings/amc" },
          { label: "Preferences", href: "/facilities/settings/preferences" },
        ]
      }
];
