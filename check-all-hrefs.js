const fs = require('fs');
const path = require('path');

const sidebar = `
      {
        icon: Building2,
        label: "Hospital Management",
        href: "/admin/hospital",
        subItems: [
          { label: "Hospital Profile", href: "/admin/hospital/profile" },
          { label: "Branch Management", href: "/admin/hospital/branch" },
          { label: "Building Management", href: "/admin/hospital/buildings" },
          { label: "Floor Management", href: "/admin/hospital/floors" },
          { label: "Ward Management", href: "/admin/hospital/wards" },
          { label: "Room Allocation", href: "/admin/hospital/rooms" },
          { label: "Bed Allocation", href: "/admin/hospital/beds" },
        ]
      },
      {
        icon: LayoutGrid,
        label: "Department Management",
        href: "/admin/department",
        subItems: [
          { label: "Departments", href: "/admin/department/list" },
          { label: "Specialties", href: "/admin/department/specialties" },
          { label: "Units", href: "/admin/department/units" },
          { label: "Cost Centers", href: "/admin/department/cost-centers" },
          { label: "Department Heads", href: "/admin/department/heads" },
        ]
      },
      {
        icon: Users,
        label: "Employee Administration",
        href: "/admin/employee",
        subItems: [
          { label: "Employee Directory", href: "/admin/employee/directory" },
          { label: "Department Allocation", href: "/admin/employee/allocation" },
          { label: "Staff Transfers", href: "/admin/employee/transfers" },
          { label: "Duty Assignment", href: "/admin/employee/duty" },
          { label: "ID Cards", href: "/admin/employee/id-cards" },
        ]
      },
      {
        icon: UserCheck,
        label: "Doctor Administration",
        href: "/admin/doctor",
        subItems: [
          { label: "Doctor Directory", href: "/admin/doctor/directory" },
          { label: "Doctor Schedule", href: "/admin/doctor/schedule" },
          { label: "Doctor Availability", href: "/admin/doctor/availability" },
          { label: "On-call Roster", href: "/admin/doctor/roster" },
          { label: "Visiting Consultants", href: "/admin/doctor/consultants" },
        ]
      },
      {
        icon: Users,
        label: "Patient Administration",
        href: "/admin/patient",
        subItems: [
          { label: "Patient Overview", href: "/admin/patient/overview" },
          { label: "VIP Patients", href: "/admin/patient/vip" },
          { label: "International Patients", href: "/admin/patient/international" },
          { label: "Corporate Patients", href: "/admin/patient/corporate" },
          { label: "Medico Legal Cases (MLC)", href: "/admin/patient/mlc" },
        ]
      },
      {
        icon: Activity,
        label: "Operation Management",
        href: "/admin/operation",
        subItems: [
          { label: "Daily Operations", href: "/admin/operation/daily" },
          { label: "Hospital Census", href: "/admin/operation/census" },
          { label: "Bed Occupancy", href: "/admin/operation/bed-occupancy" },
          { label: "Patient Flow", href: "/admin/operation/flow" },
          { label: "Resource Allocation", href: "/admin/operation/resource" },
        ]
      },
      {
        icon: CheckSquare,
        label: "Approval Center",
        href: "/admin/approval",
        subItems: [
          { label: "Admission Approval", href: "/admin/approval/admission" },
          { label: "Transfer Approval", href: "/admin/approval/transfer" },
          { label: "Discharge Approval", href: "/admin/approval/discharge" },
          { label: "Discount Approval", href: "/admin/approval/discount" },
          { label: "Refund Approval", href: "/admin/approval/refund" },
          { label: "Purchase Approval", href: "/admin/approval/purchase" },
          { label: "Leave Approval", href: "/admin/approval/leave" },
          { label: "Asset Approval", href: "/admin/approval/asset" },
        ]
      },
      {
        icon: FileText,
        label: "Policy & SOP Management",
        href: "/admin/policy",
        subItems: [
          { label: "Hospital Policies", href: "/admin/policy/hospital" },
          { label: "SOP Library", href: "/admin/policy/sop" },
          { label: "Department SOPs", href: "/admin/policy/department" },
          { label: "Policy Acknowledgement", href: "/admin/policy/acknowledgement" },
          { label: "Document Control", href: "/admin/policy/document" },
        ]
      },
      {
        icon: Users,
        label: "Committee Management",
        href: "/admin/committee",
        subItems: [
          { label: "Infection Control", href: "/admin/committee/infection" },
          { label: "Pharmacy Committee", href: "/admin/committee/pharmacy" },
          { label: "Ethics Committee", href: "/admin/committee/ethics" },
          { label: "Quality Committee", href: "/admin/committee/quality" },
          { label: "Mortality Committee", href: "/admin/committee/mortality" },
          { label: "Safety Committee", href: "/admin/committee/safety" },
        ]
      },
      {
        icon: AlertTriangle,
        label: "Incident Management",
        href: "/admin/incident",
        subItems: [
          { label: "Incident Reports", href: "/admin/incident/reports" },
          { label: "Risk Management", href: "/admin/incident/risk" },
          { label: "Sentinel Events", href: "/admin/incident/sentinel" },
          { label: "Root Cause Analysis", href: "/admin/incident/rca" },
          { label: "CAPA Tracking", href: "/admin/incident/capa" },
        ]
      },
      {
        icon: Box,
        label: "Resource Management",
        href: "/admin/resource",
        subItems: [
          { label: "Room Allocation", href: "/admin/resource/rooms" },
          { label: "Equipment Allocation", href: "/admin/resource/equipment" },
          { label: "Vehicle Allocation", href: "/admin/resource/vehicles" },
          { label: "Ambulance Allocation", href: "/admin/resource/ambulance" },
          { label: "Conference Rooms", href: "/admin/resource/conference" },
        ]
      },
      {
        icon: Calendar,
        label: "Hospital Calendar",
        href: "/admin/calendar",
        subItems: [
          { label: "Hospital Holidays", href: "/admin/calendar/holidays" },
          { label: "Events", href: "/admin/calendar/events" },
          { label: "Meetings", href: "/admin/calendar/meetings" },
          { label: "Training Programs", href: "/admin/calendar/training" },
          { label: "Maintenance Schedule", href: "/admin/calendar/maintenance" },
        ]
      },
      {
        icon: MessageSquare,
        label: "Communication Center",
        href: "/admin/communication",
        subItems: [
          { label: "Internal Notices", href: "/admin/communication/notices" },
          { label: "Circulars", href: "/admin/communication/circulars" },
          { label: "Announcements", href: "/admin/communication/announcements" },
          { label: "Broadcast Messages", href: "/admin/communication/broadcast" },
          { label: "Emergency Alerts", href: "/admin/communication/emergency" },
        ]
      },
      {
        icon: ShoppingCart,
        label: "Vendor Administration",
        href: "/admin/vendor",
        subItems: [
          { label: "Vendor Directory", href: "/admin/vendor/directory" },
          { label: "Service Contracts", href: "/admin/vendor/service-contracts" },
          { label: "AMC Contracts", href: "/admin/vendor/amc-contracts" },
          { label: "Vendor Evaluation", href: "/admin/vendor/evaluation" },
        ]
      },
      {
        icon: ShieldCheck,
        label: "Compliance",
        href: "/admin/compliance",
        subItems: [
          { label: "NABH Compliance", href: "/admin/compliance/nabh" },
          { label: "Fire Safety", href: "/admin/compliance/fire-safety" },
          { label: "Biomedical Waste", href: "/admin/compliance/biomedical" },
          { label: "Government Compliance", href: "/admin/compliance/government" },
          { label: "Audit Compliance", href: "/admin/compliance/audit" },
        ]
      },
      {
        icon: FileText,
        label: "Reports",
        href: "/admin/reports",
        subItems: [
          { label: "Daily Hospital Report", href: "/admin/reports/daily" },
          { label: "Bed Occupancy Report", href: "/admin/reports/bed" },
          { label: "Department Performance", href: "/admin/reports/department" },
          { label: "Doctor Performance", href: "/admin/reports/doctor" },
          { label: "Patient Statistics", href: "/admin/reports/patient" },
          { label: "Incident Reports", href: "/admin/reports/incident" },
          { label: "Administrative Reports", href: "/admin/reports/admin" },
        ]
      },
      {
        icon: BarChart3,
        label: "Analytics",
        href: "/admin/analytics"
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/admin/settings"
      }
`;

const regex = /href:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(sidebar)) !== null) {
  const p = path.join(__dirname, 'frontend', 'src', 'app', ...match[1].split('/').filter(x => x), 'page.tsx');
  if (!fs.existsSync(p)) {
    console.log(`404 File Missing: ${match[1]} (${p})`);
  }
}
