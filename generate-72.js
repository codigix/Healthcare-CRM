const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'frontend', 'src', 'app', 'superadmin');

const modules = [
  {
    name: 'infrastructure',
    icon: 'Server',
    pages: [
      { id: 'servers', title: 'Servers', cols: ['Server ID', 'Hostname', 'IP Address', 'Status'] },
      { id: 'databases', title: 'Databases', cols: ['Cluster Name', 'Engine', 'Version', 'Status'] },
      { id: 'storage', title: 'Storage', cols: ['Volume ID', 'Size', 'Type', 'Status'] },
      { id: 'api', title: 'API Services', cols: ['Service', 'Endpoint', 'Method', 'Status'] },
      { id: 'queue', title: 'Queue Services', cols: ['Queue Name', 'Provider', 'Messages', 'Status'] },
      { id: 'ssl', title: 'SSL Certificates', cols: ['Domain', 'Issuer', 'Expiry', 'Status'] },
      { id: 'domain', title: 'Domain Management', cols: ['Domain Name', 'Registrar', 'Expiry', 'Status'] },
      { id: 'cdn', title: 'CDN Configuration', cols: ['Distribution', 'Origin', 'Bandwidth', 'Status'] },
      { id: 'cloud', title: 'Cloud Storage', cols: ['Bucket', 'Provider', 'Usage', 'Status'] }
    ]
  },
  {
    name: 'security',
    icon: 'ShieldCheck',
    pages: [
      { id: 'firewall', title: 'Firewall Rules', cols: ['Rule ID', 'Source', 'Destination', 'Status'] },
      { id: 'policies', title: 'Security Policies', cols: ['Policy Name', 'Scope', 'Last Updated', 'Status'] },
      { id: 'ip', title: 'IP Restrictions', cols: ['IP Range', 'Type', 'Description', 'Status'] },
      { id: 'devices', title: 'Device Management', cols: ['Device ID', 'User', 'OS', 'Status'] },
      { id: 'login', title: 'Login Monitoring', cols: ['Username', 'IP', 'Time', 'Status'] },
      { id: 'logs', title: 'Security Audit Logs', cols: ['Event ID', 'Action', 'User', 'Status'] },
      { id: 'threats', title: 'Threat Detection', cols: ['Threat ID', 'Severity', 'Source', 'Status'] },
      { id: 'encryption', title: 'Data Encryption', cols: ['Key ID', 'Algorithm', 'Rotation Date', 'Status'] }
    ]
  },
  {
    name: 'backup',
    icon: 'HardDrive',
    pages: [
      { id: 'database', title: 'Database Backup', cols: ['Backup ID', 'Database', 'Size', 'Status'] },
      { id: 'file', title: 'File Backup', cols: ['Backup ID', 'Path', 'Size', 'Status'] },
      { id: 'restore', title: 'Restore Points', cols: ['Point ID', 'Date', 'Type', 'Status'] },
      { id: 'dr', title: 'Disaster Recovery', cols: ['Plan ID', 'Region', 'RTO', 'Status'] },
      { id: 'schedule', title: 'Backup Schedule', cols: ['Job Name', 'Frequency', 'Next Run', 'Status'] },
      { id: 'verification', title: 'Backup Verification', cols: ['Test ID', 'Target', 'Result', 'Status'] }
    ]
  },
  {
    name: 'monitoring',
    icon: 'Activity',
    pages: [
      { id: 'health', title: 'System Health', cols: ['Component', 'Uptime', 'Load', 'Status'] },
      { id: 'server', title: 'Server Monitoring', cols: ['Server', 'CPU', 'RAM', 'Status'] },
      { id: 'database', title: 'Database Monitoring', cols: ['DB', 'Connections', 'Queries/s', 'Status'] },
      { id: 'api', title: 'API Monitoring', cols: ['Endpoint', 'Latency', 'Error Rate', 'Status'] },
      { id: 'network', title: 'Network Monitoring', cols: ['Interface', 'Bandwidth In', 'Bandwidth Out', 'Status'] },
      { id: 'storage', title: 'Storage Monitoring', cols: ['Volume', 'Used', 'Free', 'Status'] },
      { id: 'error', title: 'Error Monitoring', cols: ['Error ID', 'Service', 'Count', 'Status'] }
    ]
  },
  {
    name: 'license',
    icon: 'Key',
    pages: [
      { id: 'plans', title: 'License Plans', cols: ['Plan Name', 'Price', 'Billing Cycle', 'Status'] },
      { id: 'subscription', title: 'Subscriptions', cols: ['Sub ID', 'Hospital', 'Plan', 'Status'] },
      { id: 'hospital', title: 'Hospital Activation', cols: ['Hospital', 'Activation Date', 'License Key', 'Status'] },
      { id: 'module', title: 'Module Activation', cols: ['Module Name', 'Enabled By', 'Since', 'Status'] },
      { id: 'users', title: 'User Limits', cols: ['Plan', 'Max Users', 'Current Usage', 'Status'] },
      { id: 'storage', title: 'Storage Usage limits', cols: ['Plan', 'Max Storage', 'Current Usage', 'Status'] },
      { id: 'history', title: 'Renewal History', cols: ['Invoice ID', 'Date', 'Amount', 'Status'] }
    ]
  },
  {
    name: 'audit',
    icon: 'ShieldAlert',
    pages: [
      { id: 'activity', title: 'Activity Logs', cols: ['Log ID', 'User', 'Action', 'Status'] },
      { id: 'login', title: 'Login Logs', cols: ['Log ID', 'IP', 'Timestamp', 'Status'] },
      { id: 'system', title: 'System Audit', cols: ['Audit ID', 'Component', 'Date', 'Status'] },
      { id: 'database', title: 'Database Audit', cols: ['Query ID', 'User', 'Table', 'Status'] },
      { id: 'api', title: 'API Audit', cols: ['Request ID', 'Endpoint', 'Client IP', 'Status'] },
      { id: 'security', title: 'Security Audit', cols: ['Scan ID', 'Vulnerabilities', 'Date', 'Status'] },
      { id: 'compliance', title: 'Compliance Reports', cols: ['Report ID', 'Standard', 'Generated', 'Status'] }
    ]
  },
  {
    name: 'reports',
    icon: 'FileText',
    pages: [
      { id: 'hospital', title: 'Hospital Reports', cols: ['Report Name', 'Generated By', 'Date', 'Status'] },
      { id: 'branch', title: 'Branch Reports', cols: ['Report Name', 'Branch', 'Date', 'Status'] },
      { id: 'financial', title: 'Financial Reports', cols: ['Report Name', 'Period', 'Revenue', 'Status'] },
      { id: 'user', title: 'User Reports', cols: ['Report Name', 'Role Group', 'Date', 'Status'] },
      { id: 'audit', title: 'Audit Reports', cols: ['Report Name', 'Type', 'Date', 'Status'] },
      { id: 'system', title: 'System Reports', cols: ['Report Name', 'Category', 'Date', 'Status'] },
      { id: 'license', title: 'License Reports', cols: ['Report Name', 'Subject', 'Date', 'Status'] }
    ]
  },
  {
    name: 'bi',
    icon: 'BarChart3',
    pages: [
      { id: 'dashboard', title: 'Global Dashboard Config', cols: ['Widget Name', 'Type', 'Source', 'Status'] },
      { id: 'revenue', title: 'Revenue Analytics', cols: ['Metric', 'Current', 'Previous', 'Status'] },
      { id: 'hospital', title: 'Hospital Comparison', cols: ['Metric', 'Hospital A', 'Hospital B', 'Status'] },
      { id: 'branch', title: 'Branch Comparison', cols: ['Metric', 'Branch X', 'Branch Y', 'Status'] },
      { id: 'users', title: 'User Analytics', cols: ['Role', 'Active Count', 'Avg Session', 'Status'] },
      { id: 'ai', title: 'AI Insights Model', cols: ['Model Name', 'Accuracy', 'Last Trained', 'Status'] },
      { id: 'forecasting', title: 'Forecasting Config', cols: ['Target Metric', 'Algorithm', 'Confidence', 'Status'] }
    ]
  },
  {
    name: 'developer',
    icon: 'Code',
    pages: [
      { id: 'api', title: 'API Management', cols: ['Endpoint', 'Auth Required', 'Rate Limit', 'Status'] },
      { id: 'webhooks', title: 'Webhooks', cols: ['Webhook URL', 'Event', 'Failures', 'Status'] },
      { id: 'env', title: 'Environment Variables', cols: ['Key Name', 'Scope', 'Last Modified', 'Status'] },
      { id: 'scheduler', title: 'Task Scheduler', cols: ['Job Name', 'Cron Expr', 'Last Run', 'Status'] },
      { id: 'queue', title: 'Queue Manager', cols: ['Queue', 'Pending', 'Failed', 'Status'] },
      { id: 'flags', title: 'Feature Flags', cols: ['Flag Name', 'Enabled For', 'Created', 'Status'] },
      { id: 'version', title: 'Version Management', cols: ['Version', 'Release Date', 'Type', 'Status'] }
    ]
  },
  {
    name: 'settings',
    icon: 'Settings',
    pages: [
      { id: 'general', title: 'General Settings', cols: ['Setting Name', 'Value', 'Category', 'Status'] },
      { id: 'localization', title: 'Localization', cols: ['Region', 'Format', 'Applied To', 'Status'] },
      { id: 'languages', title: 'Languages', cols: ['Language Code', 'Native Name', 'Completeness', 'Status'] },
      { id: 'currency', title: 'Currency', cols: ['Code', 'Symbol', 'Exchange Rate', 'Status'] },
      { id: 'timezone', title: 'Time Zone', cols: ['Zone ID', 'Offset', 'Servers', 'Status'] },
      { id: 'theme', title: 'Theme Configuration', cols: ['Theme Name', 'Primary Color', 'Type', 'Status'] },
      { id: 'number', title: 'Number Series', cols: ['Entity', 'Prefix', 'Next Num', 'Status'] }
    ]
  }
];

function generateMockData(cols) {
  const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Pending'];
  const mockRows = [];
  for (let i = 0; i < 12; i++) {
    const row = {};
    cols.forEach((col, idx) => {
      let val = '';
      if (col.toLowerCase().includes('status')) {
        val = statuses[Math.floor(Math.random() * statuses.length)];
      } else if (idx === 0) {
        val = 'ID-' + (Math.floor(Math.random() * 9000) + 1000);
      } else {
        val = 'Sample ' + col + ' ' + (i + 1);
      }
      row['c' + idx] = val;
    });
    mockRows.push(row);
  }
  return mockRows;
}

const getTemplate = (title, icon, modName, cols, data) => {
  const compName = title.replace(/[^a-zA-Z]/g, '') + 'Page';

  let columnsConfig = 'const columns = [\n';
  cols.forEach((c, j) => {
    if (c.toLowerCase().includes('status')) {
      columnsConfig += '  { header: "' + c + '", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.c' + j + ' === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.c' + j + ' === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.c' + j + '}</span>, sortable: true },\n';
    } else {
      columnsConfig += '  { header: "' + c + '", accessor: "c' + j + '", sortable: true },\n';
    }
  });
  columnsConfig += '  { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false }\n';
  columnsConfig += '];';

  return `"use client";\n\n` +
    `import { useState } from "react";\n` +
    `import { ${icon}, Search, Edit2, Trash2, Plus } from "lucide-react";\n` +
    `import DataTable from "@/components/UI/DataTable";\n\n` +
    `export default function ${compName}() {\n` +
    `  const [searchTerm, setSearchTerm] = useState("");\n` +
    `  const [data] = useState(${JSON.stringify(data, null, 2)});\n\n` +
    columnsConfig + `\n\n` +
    `  return (\n` +
    `    <div className="">\n` +
    `      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">\n` +
    `        <div>\n` +
    `          <h1 className="text-2xl text-white flex items-center gap-3">\n` +
    `            <${icon} className="text-blue-500" />\n` +
    `            ${title}\n` +
    `          </h1>\n` +
    `          <p className="text-gray-400 mt-1 text-xs">Manage ${title.toLowerCase()} configurations globally</p>\n` +
    `        </div>\n` +
    `        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">\n` +
    `          <Plus size={20} />\n` +
    `          <span>Add New</span>\n` +
    `        </button>\n` +
    `      </div>\n\n` +
    `      <div className="">\n` +
    `        <div className="">\n` +
    `          <div className="relative w-80">\n` +
    `            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />\n` +
    `            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />\n` +
    `          </div>\n` +
    `        </div>\n` +
    `        <div className="overflow-x-auto">\n` +
    `          <DataTable columns={columns} data={data} searchTerm={searchTerm} />\n` +
    `        </div>\n` +
    `      </div>\n` +
    `    </div>\n` +
    `  );\n` +
    `}\n`;
};

modules.forEach(mod => {
  mod.pages.forEach(page => {
    const dirPath = path.join(basePath, mod.name, page.id);
    fs.mkdirSync(dirPath, { recursive: true });

    const data = generateMockData(page.cols);
    const content = getTemplate(page.title, mod.icon, mod.name, page.cols, data);

    fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
    console.log(`Generated ${mod.name}/${page.id} with DataTable`);
  });
});

console.log("All 72 pages generated successfully with DataTables!");
