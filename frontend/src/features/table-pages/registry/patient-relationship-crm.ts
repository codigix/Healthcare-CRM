import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/communication/email": {
    ui: 0,
    title: "Email Dispatcher", description: "Track automated emails for reports, invoices, and updates.",
    stats: [{ label: "Emails Sent", color: "text-blue-400", value: "8,540" }, { label: "Open Rate", color: "text-emerald-400", value: "45%" }, { label: "Bounces", color: "text-red-400", value: "0.2%" }],
    columns: [["Email ID", "emailid"], ["Recipient", "recipient"], ["Subject", "subject"], ["Sent Time", "senttime"], ["Opens/Clicks", "opensclicks"]],
    badge: ["Status", "status", {"Delivered":"emerald","Bounced":"red","Sent":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const recs = ['user1@mail.com', 'user2@mail.com', 'user3@mail.com', 'user4@mail.com', 'user5@mail.com'];
        const subs = ['Your Lab Results', 'Invoice #1092', 'Newsletter - Jun', 'Appointment Confirmed', 'Welcome to MedixPro'];
        const opens = ['1 / 0', '2 / 1', '0 / 0', '1 / 0', '3 / 2'];
        const statuses = ['Delivered', 'Delivered', 'Bounced', 'Sent', 'Delivered'];
        return { emailid: 'EML-' + (3001 + i), recipient: recs[i], subject: subs[i], senttime: '09:' + (15 + i) + ' AM', opensclicks: opens[i], status: statuses[i] };
      }),
  },
  "/communication/reminders": {
    ui: 0,
    title: "Automated Reminders", description: "Configure and monitor scheduled appointment and medication reminders.",
    stats: [{ label: "Active Campaigns", color: "text-blue-400", value: "4" }, { label: "Reminders Today", color: "text-emerald-400", value: "450" }, { label: "No Shows Avoided", color: "text-emerald-400", value: "Estimated 85" }],
    columns: [["Reminder ID", "reminderid"], ["Patient", "patient"], ["Reminder Type", "remindertype"], ["Channel", "channel"], ["Scheduled For", "scheduledfor"]],
    badge: ["Status", "status", {"Scheduled":"gray","Sent":"emerald","Draft":"gray"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const pats = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const types = ['Appt (24h)', 'Appt (2h)', 'Medication Refill', 'Follow-up Due', 'Annual Checkup'];
        const chans = ['SMS & Email', 'WhatsApp', 'SMS', 'Email', 'SMS'];
        const scheds = ['Tomorrow 09:00 AM', 'Today 02:00 PM', '15 Jun, 2026', '01 Jul, 2026', '12 Aug, 2026'];
        const statuses = ['Scheduled', 'Sent', 'Scheduled', 'Draft', 'Scheduled'];
        return { reminderid: 'REM-' + (4001 + i), patient: pats[i], remindertype: types[i], channel: chans[i], scheduledfor: scheds[i], status: statuses[i] };
      }),
  },
  "/communication/sms": {
    ui: 0,
    title: "SMS Gateway", description: "Monitor and send automated SMS alerts and broadcasts.",
    stats: [{ label: "Sent Today", color: "text-blue-400", value: "1,450" }, { label: "Delivered", color: "text-emerald-400", value: "98.5%" }, { label: "Failed", color: "text-red-400", value: "1.5%" }],
    columns: [["Message ID", "messageid"], ["Recipient", "recipient"], ["Template", "template"], ["Sent Time", "senttime"], ["Gateway Status", "gatewaystatus"]],
    badge: ["Status", "status", {"Delivered":"emerald","Failed":"red","Sent":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const recs = ['+1 555-0101', '+1 555-0102', '+1 555-0103', '+1 555-0104', '+1 555-0105'];
        const tpls = ['Appt Reminder', 'Lab Result Ready', 'Payment OTP', 'Promo Broadcast', 'Appt Reminder'];
        const statuses = ['Delivered', 'Delivered', 'Failed', 'Sent', 'Delivered'];
        return { messageid: 'SMS-' + (1001 + i), recipient: recs[i], template: tpls[i], senttime: '10:' + (10 + i) + ' AM', gatewaystatus: '200 OK', status: statuses[i] };
      }),
  },
  "/communication/whatsapp": {
    ui: 0,
    title: "WhatsApp Integration", description: "Manage WhatsApp Business API messages and templates.",
    stats: [{ label: "Messages Today", color: "text-blue-400", value: "3,200" }, { label: "Read Rate", color: "text-emerald-400", value: "84%" }, { label: "Opt-outs", color: "text-red-400", value: "12" }],
    columns: [["Message ID", "messageid"], ["Recipient", "recipient"], ["Message Type", "messagetype"], ["Direction", "direction"], ["Read Receipt", "readreceipt"]],
    badge: ["Status", "status", {"Completed":"emerald","Action Required":"amber","Sent":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const recs = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Brown', 'Emily Davis'];
        const types = ['Template', 'Session Msg', 'Media (PDF)', 'Template', 'Session Msg'];
        const dirs = ['Outbound', 'Inbound', 'Outbound', 'Outbound', 'Inbound'];
        const reads = ['Read', 'N/A', 'Delivered', 'Read', 'N/A'];
        const statuses = ['Completed', 'Action Required', 'Sent', 'Completed', 'Action Required'];
        return { messageid: 'WA-' + (2001 + i), recipient: recs[i], messagetype: types[i], direction: dirs[i], readreceipt: reads[i], status: statuses[i] };
      }),
  },
  "/crm/analytics/campaign": {
    ui: 5,
    title: "Campaign Analytics", description: "A/B testing results and multi-channel attribution for marketing efforts.",
    stats: [{ label: "Best Channel", color: "text-emerald-400", value: "Google Ads" }, { label: "Avg CPA", color: "text-blue-400", value: "$45" }, { label: "Budget Utilization", color: "text-amber-400", value: "85%" }],
    columns: [["Campaign Group", "campaigngroup"], ["Channel Mix", "channelmix"], ["Spend", "spend"], ["Conversions", "conversions"], ["Cost Per Acquisition", "costperacquisition"]],
    badge: ["Status", "status", {"Analyzed":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        return { campaigngroup: 'Q2 Health Checks', channelmix: 'SMS + FB Ads', spend: '$' + (5000 - i * 500), conversions: (120 - i * 10).toString(), costperacquisition: '$' + (41 + i), status: 'Analyzed' };
      }),
  },
};

export default pages;
