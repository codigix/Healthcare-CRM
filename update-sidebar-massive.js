const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, 'frontend', 'src', 'components', 'Layout', 'Sidebar.tsx');
let sidebar = fs.readFileSync(sidebarPath, 'utf-8');

// 1. Update Operation
sidebar = sidebar.replace(/"\/admin\/operation"/g, '"/admin/operations"');
sidebar = sidebar.replace(/"\/admin\/operation\//g, '"/admin/operations/');
sidebar = sidebar.replace(/"\/admin\/operations\/bed-occupancy"/g, '"/admin/operations/occupancy"');
sidebar = sidebar.replace(/"\/admin\/operations\/resource"/g, '"/admin/operations/resources"');

// 2. Update Approval
sidebar = sidebar.replace(/"\/admin\/approval"/g, '"/admin/approvals"');
sidebar = sidebar.replace(/"\/admin\/approval\//g, '"/admin/approvals/');

// 3. Update Policy
sidebar = sidebar.replace(/"\/admin\/policy\/sop"/g, '"/admin/policy/library"');
sidebar = sidebar.replace(/"\/admin\/policy\/department"/g, '"/admin/policy/departments"');
sidebar = sidebar.replace(/"\/admin\/policy\/document"/g, '"/admin/policy/control"');
// Note: also update labels if needed
sidebar = sidebar.replace(/{ label: "SOP Library", href: "\/admin\/policy\/library" }/g, '{ label: "Policy Library", href: "/admin/policy/library" }');
sidebar = sidebar.replace(/{ label: "Department SOPs", href: "\/admin\/policy\/departments" }/g, '{ label: "Department Policies", href: "/admin/policy/departments" }');
sidebar = sidebar.replace(/{ label: "Document Control", href: "\/admin\/policy\/control" }/g, '{ label: "Document Control", href: "/admin/policy/control" }');

// 4. Update Reports
sidebar = sidebar.replace(/"\/admin\/reports\/bed"/g, '"/admin/reports/occupancy"');
sidebar = sidebar.replace(/"\/admin\/reports\/admin"/g, '"/admin/reports/administrative"');

// 5. Update Analytics
const oldAnalytics = `{
        icon: BarChart3,
        label: "Analytics",
        href: "/admin/analytics"
      }`;
const newAnalytics = `{
        icon: BarChart3,
        label: "Analytics",
        href: "/admin/analytics",
        subItems: [
          { label: "Dashboard", href: "/admin/analytics/dashboard" },
          { label: "KPIs", href: "/admin/analytics/kpis" },
          { label: "Utilization", href: "/admin/analytics/utilization" },
          { label: "Comparison", href: "/admin/analytics/comparison" },
          { label: "Capacity", href: "/admin/analytics/capacity" },
        ]
      }`;
sidebar = sidebar.replace(oldAnalytics, newAnalytics);

// 6. Update Settings
const oldSettings = `{
        icon: Settings,
        label: "Settings",
        href: "/admin/settings"
      }`;
const newSettings = `{
        icon: Settings,
        label: "Settings",
        href: "/admin/settings",
        subItems: [
          { label: "Hospital", href: "/admin/settings/hospital" },
          { label: "Hours", href: "/admin/settings/hours" },
          { label: "Series", href: "/admin/settings/series" },
          { label: "Workflow", href: "/admin/settings/workflow" },
          { label: "Notifications", href: "/admin/settings/notifications" },
        ]
      }`;
sidebar = sidebar.replace(oldSettings, newSettings);

fs.writeFileSync(sidebarPath, sidebar);
console.log('Sidebar updated!');
