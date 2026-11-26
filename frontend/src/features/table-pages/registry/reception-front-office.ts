import type { TablePageRegistry } from '../types';

// Generated from the original page files. One entry per URL.
const pages: TablePageRegistry = {
  "/admissions/room-allotment": {
    ui: 0,
    title: "Admission Room Allotment", description: "Assign and allocate rooms for new inbound admissions.",
    stats: [{ label: "Pending Allotments", color: "text-amber-400", value: "14" }, { label: "Rooms Allotted", color: "text-emerald-400", value: "86" }, { label: "Waitlist", color: "text-red-400", value: "4" }],
    columns: [["Allotment ID", "allotmentid"], ["Patient", "patient"], ["Requested Type", "requestedtype"], ["Assigned Room", "assignedroom"], ["Allotted By", "allottedby"]],
    badge: ["Status", "status", {"Allotted":"emerald","Waitlisted":"gray","Occupied":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const pats = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
        const reqs = ['General Ward', 'Private Room', 'ICU', 'VIP Suite', 'VIP Suite'];
        const assigned = ['Ward C-12', '-', 'ICU-B04', 'Suite 505', 'Suite 501'];
        const statuses = ['Allotted', 'Waitlisted', 'Allotted', 'Allotted', 'Occupied'];
        return { allotmentid: 'ALM-' + (3001 + i), patient: pats[i], requestedtype: reqs[i], assignedroom: assigned[i], allottedby: 'Admin Desk', status: statuses[i] };
      }),
  },
  "/visitors/approval": {
    ui: 0,
    title: "Visitor Approvals", description: "Approve or reject special visitor requests or extended passes.",
    stats: [{ label: "Pending Requests", color: "text-amber-400", value: "12" }, { label: "Approved Today", color: "text-emerald-400", value: "24" }, { label: "Rejected", color: "text-red-400", value: "3" }],
    columns: [["Request ID", "requestid"], ["Visitor Name", "visitorname"], ["Request Type", "requesttype"], ["Reason", "reason"], ["Requested By", "requestedby"]],
    badge: ["Status", "status", {"Pending":"amber","Rejected":"red","Approved":"emerald"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Lex Luthor', 'Joker', 'Riddler', 'Penguin', 'Two-Face'];
        const types = ['Extended Hours', 'ICU Access', 'Vendor Access', 'Overnight Pass', 'VIP Entry'];
        const reasons = ['Critical Condition', 'Family Member', 'Maintenance', 'Attendant', 'Director Meeting'];
        const statuses = ['Pending', 'Rejected', 'Approved', 'Pending', 'Approved'];
        return { requestid: 'REQ-' + (4001 + i), visitorname: names[i], requesttype: types[i], reason: reasons[i], requestedby: 'Patient Family', status: statuses[i] };
      }),
  },
  "/visitors/history": {
    ui: 0,
    title: "Visitor History Logs", description: "Complete historical logs of all visitor entries and exits.",
    stats: [{ label: "Total Logs", color: "text-blue-400", value: "45,210" }, { label: "Avg Visit Time", color: "text-emerald-400", value: "1h 15m" }, { label: "Overstays", color: "text-amber-400", value: "14" }],
    columns: [["Log ID", "logid"], ["Visitor Name", "visitorname"], ["Date", "date"], ["Entry Time", "entrytime"], ["Exit Time", "exittime"], ["Duration", "duration"]],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
        const entries = ['09:00 AM', '10:30 AM', '02:15 PM', '04:00 PM', '08:30 AM'];
        const exits = ['10:00 AM', '12:00 PM', '03:45 PM', '05:30 PM', '09:45 AM'];
        const durations = ['1h 0m', '1h 30m', '1h 30m', '1h 30m', '1h 15m'];
        return { logid: 'LOG-' + (3001 + i), visitorname: names[i], date: 'Yesterday', entrytime: entries[i], exittime: exits[i], duration: durations[i] };
      }),
  },
  "/visitors/pass": {
    ui: 0,
    title: "Visitor Passes", description: "Issue and manage digital or physical passes for registered visitors.",
    stats: [{ label: "Active Passes", color: "text-blue-400", value: "86" }, { label: "Expired Today", color: "text-gray-400", value: "54" }, { label: "Revoked", color: "text-red-400", value: "2" }],
    columns: [["Pass ID", "passid"], ["Visitor Name", "visitorname"], ["Pass Type", "passtype"], ["Valid Until", "validuntil"], ["Issued By", "issuedby"]],
    badge: ["Status", "status", {"Active":"emerald","Expired":"red"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['John Smith', 'Sarah Connor', 'Peter Parker', 'Mary Jane', 'Tony Stark'];
        const types = ['One-Time Pass', 'Vendor Pass', 'Attendant Pass', 'One-Time Pass', 'VIP Pass'];
        const valids = ['Today 05:00 PM', '15 Jul, 2026', '30 Jun, 2026', 'Today 06:00 PM', '31 Dec, 2026'];
        const statuses = ['Active', 'Active', 'Expired', 'Active', 'Active'];
        return { passid: 'PAS-' + (2001 + i), visitorname: names[i], passtype: types[i], validuntil: valids[i], issuedby: 'Front Desk', status: statuses[i] };
      }),
  },
  "/visitors/register": {
    ui: 0,
    title: "Visitor Registration", description: "Register new visitors and assign them to specific patients or departments.",
    stats: [{ label: "Total Visitors Today", color: "text-blue-400", value: "142" }, { label: "Currently Inside", color: "text-amber-400", value: "45" }, { label: "Blacklisted Alerts", color: "text-emerald-400", value: "0" }],
    columns: [["Visitor ID", "visitorid"], ["Visitor Name", "visitorname"], ["Purpose", "purpose"], ["Visiting (Patient/Dept)", "visitingpatientdept"], ["Entry Time", "entrytime"]],
    badge: ["Status", "status", {"Checked In":"amber","Checked Out":"emerald","Pending":"amber"}],
    actions: "Actions",
    rows: () => Array.from({ length: 5 }).map((_, i) => {
        const names = ['John Smith', 'Sarah Connor', 'Peter Parker', 'Mary Jane', 'Tony Stark'];
        const purposes = ['Patient Visit', 'Vendor Meeting', 'Patient Visit', 'Interview', 'Official Visit'];
        const targets = ['ICU Bed 12', 'Admin Office', 'Room 304', 'HR Dept', 'Director Office'];
        const times = ['09:15 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:45 AM'];
        const statuses = ['Checked In', 'Checked Out', 'Checked In', 'Checked In', 'Pending'];
        return { visitorid: 'VIS-' + (1001 + i), visitorname: names[i], purpose: purposes[i], visitingpatientdept: targets[i], entrytime: times[i], status: statuses[i] };
      }),
  },
};

export default pages;
