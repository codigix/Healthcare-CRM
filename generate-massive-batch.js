const fs = require('fs');
const path = require('path');

const generateAuthPage = () => {
  const dir = path.join(__dirname, 'frontend', 'src', 'app', 'authentication');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const content = `"use client";
import React, { useState } from 'react';
import { Lock, Mail, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthenticationPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard/superadmin');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('/grid.svg')] bg-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center mb-6">
          <Lock className="text-blue-500" size={32} />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">MedixPro Authentication</h2>
        <p className="mt-2 text-center text-sm text-gray-400">Secure access to the CRM Portal</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#1E293B] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-800">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email address</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input type="email" required className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-700 rounded-lg shadow-sm bg-[#0F172A] text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="admin@medixpro.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input type="password" required className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-700 rounded-lg shadow-sm bg-[#0F172A] text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#1E293B] transition-all">
                Authenticate Securely
                <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
};

generateAuthPage();

// Massive data definition for all remaining pages
const config = [
  // REPORTS
  {
    path: 'admin/reports/occupancy', title: 'Bed Occupancy Report', desc: 'Granular bed occupancy and turnover metrics.',
    cols: ['Ward', 'Total Beds', 'Occupied', 'Available', 'Turnover Rate', 'Status'],
    stats: [{ label: 'Avg Occupancy', val: '86%', col: 'text-blue-400' }, { label: 'High Demand', val: 'ICU', col: 'text-amber-400' }, { label: 'Available Beds', val: '124', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const wards = ['Cardiac ICU', 'General Ward A', 'Maternity Wing', 'Pediatric Unit', 'Neurology ICU'];
      const total = [45, 120, 80, 60, 30];
      const occ = [42, 90, 75, 45, 29];
      const avail = [3, 30, 5, 15, 1];
      const rates = ['92%', '75%', '85%', '80%', '95%'];
      const statuses = ['Critical', 'Normal', 'High', 'Normal', 'Critical'];
      return { ward: wards[i], totalbeds: total[i], occupied: occ[i], available: avail[i], turnoverrate: rates[i], status: statuses[i] };
    })`
  },
  {
    path: 'admin/reports/administrative', title: 'Administrative Reports', desc: 'Overview of administrative activities and audits.',
    cols: ['Report ID', 'Report Type', 'Generated By', 'Date', 'Flagged Issues', 'Status'],
    stats: [{ label: 'Total Reports', val: '450', col: 'text-blue-400' }, { label: 'Critical Flags', val: '12', col: 'text-red-400' }, { label: 'Resolved', val: '8', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Monthly Compliance', 'Inventory Audit', 'Staff Attendance', 'Fire Safety Review', 'Budget Variance'];
      const users = ['Admin User', 'Inventory Mgr', 'HR Dept', 'Safety Officer', 'Finance Team'];
      const flags = ['2', '0', '14', '1', '5'];
      const statuses = ['Reviewed', 'Approved', 'Action Required', 'Reviewed', 'Pending'];
      return { reportid: 'ADM-REP-' + (1001+i), reporttype: types[i], generatedby: users[i], date: 'Today', flaggedissues: flags[i], status: statuses[i] };
    })`
  },

  // ANALYTICS
  {
    path: 'admin/analytics/dashboard', title: 'Analytics Dashboard', desc: 'High-level predictive analytics and insights.',
    cols: ['Insight ID', 'Metric Group', 'Current Value', 'Target', 'Variance', 'Status'],
    stats: [{ label: 'Overall Growth', val: '+12.4%', col: 'text-emerald-400' }, { label: 'Data Freshness', val: 'Real-time', col: 'text-blue-400' }, { label: 'Anomalies', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const groups = ['Patient Inflow', 'Avg Treatment Cost', 'Bed Turnover (Days)', 'Outpatient Revenue', 'Surgery Success Rate'];
      const vals = ['4,250', '$4,100', '3.2', '$1.2M', '99.1%'];
      const tgts = ['4,000', '$4,500', '3.5', '$1.0M', '98.5%'];
      const vars = ['+6.2%', '-8.8%', '-8.5%', '+20.0%', '+0.6%'];
      const statuses = ['Exceeding', 'On Track', 'Exceeding', 'Exceeding', 'On Track'];
      return { insightid: 'ANL-' + (1001+i), metricgroup: groups[i], currentvalue: vals[i], target: tgts[i], variance: vars[i], status: statuses[i] };
    })`
  },
  {
    path: 'admin/analytics/kpis', title: 'Key Performance Indicators', desc: 'Track and manage vital hospital KPIs.',
    cols: ['KPI Name', 'Category', 'Current Score', 'Last Month', 'Trend', 'Status'],
    stats: [{ label: 'Active KPIs', val: '24', col: 'text-blue-400' }, { label: 'Improving', val: '18', col: 'text-emerald-400' }, { label: 'Declining', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Patient Satisfaction', 'Readmission Rate', 'Avg Wait Time', 'Staff Retention', 'Cost per Patient'];
      const cats = ['Quality', 'Clinical', 'Operational', 'HR', 'Financial'];
      const scores = ['4.8/5.0', '12%', '14 mins', '92%', '$1,240'];
      const last = ['4.5/5.0', '14%', '18 mins', '90%', '$1,300'];
      const trends = ['Up', 'Down', 'Down', 'Up', 'Down'];
      const statuses = ['Excellent', 'Improving', 'Improving', 'Stable', 'Improving'];
      return { kpiname: names[i], category: cats[i], currentscore: scores[i], lastmonth: last[i], trend: trends[i], status: statuses[i] };
    })`
  },
  {
    path: 'admin/analytics/utilization', title: 'Resource Utilization', desc: 'Analytics on equipment and room usage.',
    cols: ['Resource Type', 'Total Units', 'Active Usage', 'Downtime', 'Utilization Rate', 'Status'],
    stats: [{ label: 'Avg Utilization', val: '78%', col: 'text-emerald-400' }, { label: 'Underutilized', val: '12%', col: 'text-amber-400' }, { label: 'Critical Load', val: '4%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['MRI Scanners', 'CT Scanners', 'Ventilators', 'Operation Theatres', 'Ambulances'];
      const units = ['4', '6', '120', '15', '12'];
      const active = ['4', '5', '95', '12', '8'];
      const downtime = ['0%', '15%', '5%', '8%', '20%'];
      const rates = ['100%', '85%', '80%', '80%', '65%'];
      const statuses = ['Max Load', 'Optimal', 'Optimal', 'Optimal', 'Underutilized'];
      return { resourcetype: types[i], totalunits: units[i], activeusage: active[i], downtime: downtime[i], utilizationrate: rates[i], status: statuses[i] };
    })`
  },
  {
    path: 'admin/analytics/comparison', title: 'Benchmarking & Comparison', desc: 'Compare departments and branches.',
    cols: ['Entity', 'Comparison Metric', 'Score', 'Industry Avg', 'Percentile', 'Status'],
    stats: [{ label: 'Top Percentile', val: '3 Depts', col: 'text-emerald-400' }, { label: 'Below Avg', val: '0', col: 'text-gray-400' }, { label: 'Industry Rank', val: '#12', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const entities = ['Cardiology Dept', 'Neurology Dept', 'North Branch', 'South Branch', 'ER Dept'];
      const metrics = ['Infection Rate', 'Recovery Time', 'Patient Satisfaction', 'Patient Satisfaction', 'Wait Time'];
      const scores = ['0.5%', '4.2 Days', '4.9/5', '4.6/5', '12 mins'];
      const ind = ['1.2%', '5.1 Days', '4.2/5', '4.2/5', '25 mins'];
      const percs = ['95th', '88th', '99th', '85th', '92nd'];
      const statuses = ['Leading', 'Above Avg', 'Leading', 'Above Avg', 'Leading'];
      return { entity: entities[i], comparisonmetric: metrics[i], score: scores[i], industryavg: ind[i], percentile: percs[i], status: statuses[i] };
    })`
  },
  {
    path: 'admin/analytics/capacity', title: 'Capacity Forecasting', desc: 'Predictive models for future hospital capacity.',
    cols: ['Forecast Period', 'Predicted Admits', 'Bed Requirement', 'Staff Required', 'Confidence', 'Status'],
    stats: [{ label: '7-Day Forecast', val: '+12% Volume', col: 'text-amber-400' }, { label: 'Model Accuracy', val: '94.2%', col: 'text-emerald-400' }, { label: 'Risk Level', val: 'Moderate', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const periods = ['Next 24 Hours', 'Next 7 Days', 'Next 30 Days', 'Q4 2026', 'Q1 2027'];
      const admits = ['150 - 180', '1,200 - 1,400', '5,000 - 5,500', '16,000+', '15,000+'];
      const beds = ['85%', '92%', '88%', '95%', '90%'];
      const staff = ['Standard', 'Surge +10%', 'Standard', 'Surge +15%', 'Standard'];
      const confs = ['98%', '92%', '85%', '78%', '70%'];
      const statuses = ['Normal', 'High Alert', 'Normal', 'Critical Surge', 'Normal'];
      return { forecastperiod: periods[i], predictedadmits: admits[i], bedrequirement: beds[i], staffrequired: staff[i], confidence: confs[i], status: statuses[i] };
    })`
  },

  // SETTINGS
  {
    path: 'admin/settings/hospital', title: 'Hospital Settings', desc: 'Global configurations for the hospital.',
    cols: ['Setting Key', 'Category', 'Current Value', 'Last Updated', 'Modified By', 'Status'],
    stats: [{ label: 'Global Configs', val: '124', col: 'text-blue-400' }, { label: 'Require Restart', val: '0', col: 'text-emerald-400' }, { label: 'Sync Status', val: 'Synced', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const keys = ['HOSPITAL_NAME', 'PRIMARY_CURRENCY', 'DEFAULT_LANGUAGE', 'TIMEZONE', 'MAX_BED_CAPACITY'];
      const vals = ['MedixPro Health', 'USD ($)', 'English (US)', 'America/New_York', '1500'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
      return { settingkey: keys[i], category: 'General', currentvalue: vals[i], lastupdated: 'Today', modifiedby: 'SuperAdmin', status: statuses[i] };
    })`
  },
  {
    path: 'admin/settings/hours', title: 'Working Hours', desc: 'Configure operational hours and shifts.',
    cols: ['Shift Name', 'Department', 'Start Time', 'End Time', 'Grace Period', 'Status'],
    stats: [{ label: 'Total Shifts', val: '8', col: 'text-blue-400' }, { label: '24/7 Depts', val: '4', col: 'text-emerald-400' }, { label: 'Overnight Shifts', val: '4', col: 'text-indigo-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const shifts = ['Morning OPD', 'Evening OPD', 'Night Shift ICU', 'ER Rotating', 'Admin Normal'];
      const depts = ['Outpatient', 'Outpatient', 'ICU', 'Emergency', 'Administration'];
      const starts = ['08:00 AM', '04:00 PM', '08:00 PM', '12:00 AM', '09:00 AM'];
      const ends = ['04:00 PM', '10:00 PM', '08:00 AM', '08:00 AM', '05:00 PM'];
      return { shiftname: shifts[i], department: depts[i], starttime: starts[i], endtime: ends[i], graceperiod: '15 mins', status: 'Active' };
    })`
  },
  {
    path: 'admin/settings/series', title: 'ID Series & Prefixes', desc: 'Configure prefixes for auto-generated IDs.',
    cols: ['Entity', 'Prefix', 'Padding', 'Current Sequence', 'Example', 'Status'],
    stats: [{ label: 'Custom Series', val: '24', col: 'text-blue-400' }, { label: 'Active Sequences', val: '24', col: 'text-emerald-400' }, { label: 'Conflicts', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const entities = ['Patient', 'Employee', 'Invoice', 'Prescription', 'Appointment'];
      const prefixes = ['PAT-', 'EMP-', 'INV-', 'RX-', 'APT-'];
      const seq = ['10425', '1102', '55291', '9921', '40212'];
      const ex = ['PAT-010425', 'EMP-001102', 'INV-055291', 'RX-009921', 'APT-040212'];
      return { entity: entities[i], prefix: prefixes[i], padding: '6 Digits', currentsequence: seq[i], example: ex[i], status: 'Active' };
    })`
  },
  {
    path: 'admin/settings/workflow', title: 'Workflow Automation', desc: 'Configure automated approval and task workflows.',
    cols: ['Workflow Rule', 'Trigger', 'Action', 'Target Group', 'Executions', 'Status'],
    stats: [{ label: 'Active Rules', val: '18', col: 'text-blue-400' }, { label: 'Automations Today', val: '1.2k', col: 'text-emerald-400' }, { label: 'Failed Executions', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const rules = ['Auto-approve basic leave', 'High-value purchase alert', 'Critical lab result SMS', 'VIP Admission notify', 'Bed empty cleaning task'];
      const triggers = ['Leave < 2 Days', 'PO > $10,000', 'Lab = Abnormal', 'Admit = VIP', 'Discharge = Complete'];
      const actions = ['Approve Leave', 'Email CFO', 'SMS Doctor', 'Notify Admin Head', 'Task to Housekeeping'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
      return { workflowrule: rules[i], trigger: triggers[i], action: actions[i], targetgroup: 'System', executions: '452', status: statuses[i] };
    })`
  },
  {
    path: 'admin/settings/notifications', title: 'Notification Preferences', desc: 'Configure global email and SMS alerts.',
    cols: ['Notification Type', 'Channel', 'Recipients', 'Template', 'Frequency', 'Status'],
    stats: [{ label: 'Email Alerts', val: 'Enabled', col: 'text-emerald-400' }, { label: 'SMS Gateway', val: 'Connected', col: 'text-emerald-400' }, { label: 'Push Service', val: 'Active', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Appointment Reminder', 'Lab Result Ready', 'Payment Receipt', 'Shift Reminder', 'System Outage'];
      const channels = ['SMS', 'SMS & Email', 'Email', 'Push', 'All Channels'];
      const freqs = ['24h Before', 'Immediate', 'Immediate', '2h Before', 'Immediate'];
      return { notificationtype: types[i], channel: channels[i], recipients: 'Patients', template: 'TPL-0' + (i+1), frequency: freqs[i], status: 'Active' };
    })`
  },

  // OPERATIONS
  {
    path: 'admin/operations/daily', title: 'Daily Operations', desc: 'Day-to-day operational overview and checklists.',
    cols: ['Task Name', 'Assigned Dept', 'Check Time', 'Completion', 'Supervisor', 'Status'],
    stats: [{ label: 'Tasks Today', val: '145', col: 'text-blue-400' }, { label: 'Completed', val: '92', col: 'text-emerald-400' }, { label: 'Overdue', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const tasks = ['Morning Ward Rounds', 'Equipment Calibration', 'Cafeteria Inspection', 'Night Shift Handover', 'Pharmacy Stock Check'];
      const depts = ['Clinical', 'Biomedical', 'Facilities', 'Nursing', 'Pharmacy'];
      const times = ['08:00 AM', '09:00 AM', '11:00 AM', '08:00 PM', '06:00 AM'];
      const statuses = ['Completed', 'Completed', 'Pending', 'Scheduled', 'Overdue'];
      return { taskname: tasks[i], assigneddept: depts[i], checktime: times[i], completion: '100%', supervisor: 'Admin', status: statuses[i] };
    })`
  },
  {
    path: 'admin/operations/census', title: 'Hospital Census', desc: 'Live patient population and demographic tracking.',
    cols: ['Ward/Zone', 'Admitted', 'Discharges', 'Transfers In', 'Transfers Out', 'Status'],
    stats: [{ label: 'Total Census', val: '842', col: 'text-blue-400' }, { label: 'Net Change', val: '+12', col: 'text-emerald-400' }, { label: 'Capacity', val: '85%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const zones = ['ICU Level 1', 'General Med A', 'General Surg B', 'Pediatrics', 'Maternity'];
      const adms = ['4', '15', '8', '6', '12'];
      const dis = ['2', '10', '9', '4', '14'];
      const statuses = ['High Volume', 'Normal', 'Normal', 'Normal', 'High Volume'];
      return { wardzone: zones[i], admitted: adms[i], discharges: dis[i], transfersin: '2', transfersout: '1', status: statuses[i] };
    })`
  },
  {
    path: 'admin/operations/occupancy', title: 'Bed Occupancy', desc: 'Detailed occupancy tracking.',
    cols: ['Zone', 'Total Beds', 'Occupied', 'Available', 'Cleaning', 'Status'],
    stats: [{ label: 'Total Beds', val: '1,250', col: 'text-blue-400' }, { label: 'Occupied', val: '842', col: 'text-amber-400' }, { label: 'Available', val: '380', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const zones = ['ICU Level 1', 'General Med A', 'General Surg B', 'Pediatrics', 'Maternity'];
      const totals = ['50', '200', '150', '100', '120'];
      const occs = ['48', '150', '110', '85', '115'];
      const statuses = ['Critical', 'Normal', 'Normal', 'High', 'Critical'];
      return { zone: zones[i], totalbeds: totals[i], occupied: occs[i], available: '10', cleaning: '5', status: statuses[i] };
    })`
  },
  {
    path: 'admin/operations/flow', title: 'Patient Flow', desc: 'Track patient movement from ER to Discharge.',
    cols: ['Patient Route', 'Avg ER Time', 'Avg Wait Time', 'Avg Length of Stay', 'Bottlenecks', 'Status'],
    stats: [{ label: 'Avg ER Wait', val: '14m', col: 'text-emerald-400' }, { label: 'Avg LOS', val: '4.2 Days', col: 'text-blue-400' }, { label: 'Severe Bottlenecks', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const routes = ['ER -> ICU', 'OPD -> Ward', 'Direct Admit -> VIP', 'ER -> Surgery', 'Ward -> Discharge'];
      const ers = ['45 mins', 'N/A', 'N/A', '30 mins', 'N/A'];
      const los = ['6.5 Days', '3.2 Days', '4.0 Days', '8.5 Days', '2.1 Days'];
      const statuses = ['Delayed', 'Optimal', 'Optimal', 'Delayed', 'Optimal'];
      return { patientroute: routes[i], avgertime: ers[i], avgwaittime: '20 mins', avglengthofstay: los[i], bottlenecks: 'Bed Availability', status: statuses[i] };
    })`
  },
  {
    path: 'admin/operations/resources', title: 'Operations Resources', desc: 'Manage operational assets like stretchers and wheelchairs.',
    cols: ['Resource', 'Total Count', 'In Use', 'Available', 'Maintenance', 'Status'],
    stats: [{ label: 'Total Assets', val: '450', col: 'text-blue-400' }, { label: 'Available', val: '120', col: 'text-emerald-400' }, { label: 'In Maintenance', val: '14', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const res = ['Wheelchairs', 'Stretchers', 'IV Stands', 'Mobile Monitors', 'Oxygen Cylinders'];
      const tot = ['150', '80', '200', '45', '300'];
      const use = ['120', '65', '180', '40', '210'];
      const statuses = ['Normal', 'Normal', 'High Demand', 'Critical', 'Normal'];
      return { resource: res[i], totalcount: tot[i], inuse: use[i], available: '20', maintenance: '5', status: statuses[i] };
    })`
  },

  // APPROVALS
  {
    path: 'admin/approvals/admission', title: 'Admission Approvals', desc: 'Review and approve pending admissions.',
    cols: ['Req ID', 'Patient', 'Requested Dept', 'Priority', 'Requested By', 'Status'],
    stats: [{ label: 'Pending', val: '14', col: 'text-amber-400' }, { label: 'Approved Today', val: '45', col: 'text-emerald-400' }, { label: 'Rejected', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'Robert Wilson'];
      const depts = ['Cardiology', 'Neurology', 'Oncology', 'Surgery', 'General Med'];
      const pris = ['High', 'Normal', 'Urgent', 'Normal', 'Low'];
      const statuses = ['Pending', 'Approved', 'Pending', 'Rejected', 'Approved'];
      return { reqid: \`ADM-\${1001+i}\`, patient: pats[i], requesteddept: depts[i], priority: pris[i], requestedby: 'Dr. Jenkins', status: statuses[i] };
    })`
  },
  {
    path: 'admin/approvals/transfer', title: 'Transfer Approvals', desc: 'Approve inter-departmental transfers.',
    cols: ['Transfer ID', 'Patient', 'From Ward', 'To Ward', 'Reason', 'Status'],
    stats: [{ label: 'Pending Transfers', val: '8', col: 'text-amber-400' }, { label: 'Completed', val: '22', col: 'text-emerald-400' }, { label: 'On Hold', val: '1', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['Alex Morgan', 'David Clark', 'Sarah Lee', 'James Bond', 'Tony Stark'];
      const froms = ['ER', 'ICU', 'General Med', 'Surgery', 'ER'];
      const tos = ['ICU', 'General Med', 'Cardiology', 'Discharge', 'VIP Suite'];
      const statuses = ['Approved', 'Pending', 'On Hold', 'Approved', 'Approved'];
      return { transferid: \`TRF-\${2001+i}\`, patient: pats[i], fromward: froms[i], toward: tos[i], reason: 'Condition Change', status: statuses[i] };
    })`
  },
  {
    path: 'admin/approvals/discharge', title: 'Discharge Approvals', desc: 'Final review and sign-off for discharges.',
    cols: ['Discharge ID', 'Patient', 'Attending Dr', 'Clearance', 'Billing Status', 'Status'],
    stats: [{ label: 'Pending Clearances', val: '12', col: 'text-amber-400' }, { label: 'Ready for Exit', val: '8', col: 'text-emerald-400' }, { label: 'Total Today', val: '98', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const clears = ['Med & Bill', 'Med Only', 'None', 'Med & Bill', 'Bill Only'];
      const bills = ['Cleared', 'Pending', 'Pending', 'Cleared', 'Pending'];
      const statuses = ['Approved', 'Pending', 'Action Required', 'Approved', 'Pending'];
      return { dischargeid: \`DIS-\${3001+i}\`, patient: pats[i], attendingdr: 'Dr. House', clearance: clears[i], billingstatus: bills[i], status: statuses[i] };
    })`
  },
  {
    path: 'admin/approvals/discount', title: 'Discount Approvals', desc: 'Approve billing discounts and waivers.',
    cols: ['Discount ID', 'Patient/Invoice', 'Bill Amount', 'Requested %', 'Requested By', 'Status'],
    stats: [{ label: 'Pending Requests', val: '5', col: 'text-amber-400' }, { label: 'Approved Amount', val: '$12,450', col: 'text-emerald-400' }, { label: 'Rejected', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const invoices = ['INV-1092', 'INV-1094', 'INV-1098', 'INV-1102', 'INV-1105'];
      const bills = ['$4,500', '$12,000', '$850', '$24,000', '$1,200'];
      const reqs = ['10%', '25% (Staff)', '15%', '50% (Charity)', '10%'];
      const statuses = ['Pending', 'Approved', 'Approved', 'Pending', 'Rejected'];
      return { discountid: \`DSC-\${4001+i}\`, patientinvoice: invoices[i], billamount: bills[i], requested: reqs[i], requestedby: 'Billing Dept', status: statuses[i] };
    })`
  },
  {
    path: 'admin/approvals/refund', title: 'Refund Approvals', desc: 'Approve refund requests for patients.',
    cols: ['Refund ID', 'Patient', 'Original Amount', 'Refund Amount', 'Reason', 'Status'],
    stats: [{ label: 'Pending Refunds', val: '4', col: 'text-amber-400' }, { label: 'Processed Today', val: '$3,200', col: 'text-emerald-400' }, { label: 'Avg Processing', val: '1.2 Days', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['John Doe', 'Jane Smith', 'Bob Vance', 'Phyllis Lapin', 'Stanley Hudson'];
      const orig = ['$5,000', '$2,500', '$1,000', '$4,500', '$800'];
      const ref = ['$500', '$2,500', '$100', '$450', '$800'];
      const statuses = ['Pending', 'Approved', 'Processed', 'Pending', 'Rejected'];
      return { refundid: \`REF-\${5001+i}\`, patient: pats[i], originalamount: orig[i], refundamount: ref[i], reason: 'Overpayment', status: statuses[i] };
    })`
  },
  {
    path: 'admin/approvals/purchase', title: 'Purchase Approvals', desc: 'Approve purchase orders for inventory and assets.',
    cols: ['PO Number', 'Department', 'Vendor', 'Total Value', 'Priority', 'Status'],
    stats: [{ label: 'Pending POs', val: '12', col: 'text-amber-400' }, { label: 'Value Pending', val: '$145,000', col: 'text-blue-400' }, { label: 'Approved Today', val: '6', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['Pharmacy', 'IT', 'Surgery', 'Facilities', 'Radiology'];
      const vendors = ['PharmaCorp', 'Dell EMC', 'MedSurg Inc', 'CleanCo', 'Siemens'];
      const vals = ['$45,000', '$12,500', '$85,000', '$2,400', '$250,000'];
      const statuses = ['Pending', 'Approved', 'Pending', 'Approved', 'Under Review'];
      return { ponumber: \`PO-\${6001+i}\`, department: depts[i], vendor: vendors[i], totalvalue: vals[i], priority: 'High', status: statuses[i] };
    })`
  },
  {
    path: 'admin/approvals/leave', title: 'Leave Approvals', desc: 'Approve staff and doctor leave requests.',
    cols: ['Leave ID', 'Employee', 'Department', 'Leave Type', 'Duration', 'Status'],
    stats: [{ label: 'Pending Requests', val: '24', col: 'text-amber-400' }, { label: 'Approved', val: '18', col: 'text-emerald-400' }, { label: 'Critical Shortage', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const emps = ['Nurse Jackie', 'Dr. Strange', 'Dr. Banner', 'Peter Parker', 'Tony Stark'];
      const types = ['Annual Leave', 'Sick Leave', 'Conference', 'Annual Leave', 'Personal'];
      const durs = ['5 Days', '2 Days', '3 Days', '1 Day', '14 Days'];
      const statuses = ['Pending', 'Approved', 'Approved', 'Pending', 'Rejected'];
      return { leaveid: \`LVE-\${7001+i}\`, employee: emps[i], department: 'Clinical', leavetype: types[i], duration: durs[i], status: statuses[i] };
    })`
  },
  {
    path: 'admin/approvals/asset', title: 'Asset Approvals', desc: 'Approve asset requisitions and write-offs.',
    cols: ['Request ID', 'Asset Category', 'Requested By', 'Action', 'Value Impact', 'Status'],
    stats: [{ label: 'Pending Requisitions', val: '8', col: 'text-amber-400' }, { label: 'Pending Write-offs', val: '3', col: 'text-red-400' }, { label: 'Approved', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['IT Equipment', 'Medical Device', 'Furniture', 'Vehicle', 'IT Equipment'];
      const actions = ['New Request', 'Write-off', 'Repair', 'New Request', 'Upgrade'];
      const impacts = ['$1,200', '-$4,500', '$800', '$45,000', '$2,400'];
      const statuses = ['Pending', 'Under Review', 'Approved', 'Pending', 'Approved'];
      return { requestid: \`REQ-\${8001+i}\`, assetcategory: cats[i], requestedby: 'Dept Head', action: actions[i], valueimpact: impacts[i], status: statuses[i] };
    })`
  },

  // POLICY
  {
    path: 'admin/policy/library', title: 'Policy Library', desc: 'Central repository for all hospital policies.',
    cols: ['Policy ID', 'Policy Title', 'Category', 'Version', 'Last Updated', 'Status'],
    stats: [{ label: 'Total Policies', val: '142', col: 'text-blue-400' }, { label: 'Recently Updated', val: '12', col: 'text-emerald-400' }, { label: 'Review Needed', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const titles = ['Hand Hygiene Protocol', 'Data Privacy (HIPAA)', 'Fire Evacuation', 'Code Blue Response', 'Waste Management'];
      const cats = ['Clinical', 'Admin & IT', 'Safety', 'Clinical', 'Facilities'];
      const vers = ['v2.4', 'v3.1', 'v1.8', 'v4.0', 'v2.1'];
      const statuses = ['Active', 'Active', 'Review Needed', 'Active', 'Active'];
      return { policyid: \`POL-\${1001+i}\`, policytitle: titles[i], category: cats[i], version: vers[i], lastupdated: '12 Aug, 2026', status: statuses[i] };
    })`
  },
  {
    path: 'admin/policy/departments', title: 'Department Policies', desc: 'Policies specific to individual departments.',
    cols: ['Doc ID', 'Title', 'Department', 'Mandatory For', 'Compliance', 'Status'],
    stats: [{ label: 'Department Docs', val: '350', col: 'text-blue-400' }, { label: 'Avg Compliance', val: '94%', col: 'text-emerald-400' }, { label: 'Non-Compliant', val: '2 Depts', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const titles = ['Radiation Safety', 'ICU Sterilization', 'Pharmacy Dispensing', 'ER Triage Guidelines', 'Server Access Control'];
      const depts = ['Radiology', 'ICU', 'Pharmacy', 'Emergency', 'IT Services'];
      const comps = ['100%', '98%', '100%', '92%', '100%'];
      const statuses = ['Active', 'Active', 'Active', 'Action Required', 'Active'];
      return { docid: \`DPOL-\${2001+i}\`, title: titles[i], department: depts[i], mandatoryfor: 'All Dept Staff', compliance: comps[i], status: statuses[i] };
    })`
  },
  {
    path: 'admin/policy/control', title: 'Document Control', desc: 'Manage document revisions and approvals.',
    cols: ['Control ID', 'Document Name', 'Author', 'Changes Made', 'Reviewer', 'Status'],
    stats: [{ label: 'Pending Reviews', val: '8', col: 'text-amber-400' }, { label: 'Approved This Week', val: '14', col: 'text-emerald-400' }, { label: 'Archived', val: '450', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const docs = ['HR Manual 2027', 'Surgical Checklist', 'Visitor Policy', 'COVID Protocol', 'Discharge Summary Tpl'];
      const changes = ['Annual Update', 'Added Item 4', 'Revised Hours', 'Archiving', 'Formatting'];
      const statuses = ['Pending Review', 'Approved', 'Pending Review', 'Archived', 'Approved'];
      return { controlid: \`CTRL-\${3001+i}\`, documentname: docs[i], author: 'Admin', changesmade: changes[i], reviewer: 'Compliance Comm', status: statuses[i] };
    })`
  }
];

const template = (page, componentName) => {
  let columnsGen = "";
  page.cols.forEach(col => {
    const accessorKey = col.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (col === 'Status') {
      columnsGen += `
    { 
      header: '${col}', 
      accessor: (row: any) => {
        const val = row.${accessorKey};
        const isGood = val === 'Active' || val === 'Normal' || val === 'Optimal' || val === 'Approved' || val === 'Exceeding' || val === 'Excellent' || val === 'Leading' || val === 'Processed' || val === 'On Track' || val === 'Improving' || val === 'Reviewed' || val === 'Completed';
        const isWarning = val === 'Pending' || val === 'High' || val === 'Warning' || val === 'Action Required' || val === 'Review Needed' || val === 'Pending Review' || val === 'High Alert' || val === 'Under Review' || val === 'Delayed' || val === 'High Volume';
        const isNeutral = val === 'Stable' || val === 'Archived';
        
        let colorClass = 'bg-red-500/10 text-red-500 border border-red-500/20';
        if (isGood) colorClass = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
        else if (isWarning) colorClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        else if (isNeutral) colorClass = 'bg-gray-500/10 text-gray-400 border border-gray-500/20';

        return (
          <span className={"px-2 py-1 rounded text-xs font-medium " + colorClass}>
            {val}
          </span>
        )
      },
      sortable: true 
    },`;
    } else {
      columnsGen += `
    { header: '${col}', accessor: '${accessorKey}', sortable: true },`;
    }
  });


  let statsGen = "";
  page.stats.forEach(stat => {
    statsGen += `
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">${stat.label}</p>
          <p className={"text-2xl font-bold mt-2 " + "${stat.col}"}>${stat.val}</p>
        </div>`;
  });

  return `"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ${componentName}Page() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [${columnsGen}
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <div className="flex justify-end gap-2">
          <button className="p-1.5 hover:bg-dark-tertiary rounded text-gray-400 hover:text-white transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      )
    }
  ];

  const mockData = ${page.mockDataGenerator};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            ${page.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">${page.desc}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all">
            <Plus size={16} /> Create New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">${statsGen}
      </div>

      <div className="">
        <div className="flex justify-between items-center my-3 my-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-white w-64 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition-colors text-white">
            <Filter size={16} /> Filter
          </button>
        </div>
        <DataTable 
          columns={columns} 
          data={mockData} 
          searchTerm={searchTerm} 
        />
      </div>
    </div>
  );
}`;
};

config.forEach(page => {
  const dir = path.join(__dirname, 'frontend', 'src', 'app', ...page.path.split('/'));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page, componentName));
  console.log('Generated: ' + page.path);
});
