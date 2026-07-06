const fs = require('fs');
const path = require('path');

const config = [
  // OT Scheduling
  {
    path: 'ot/scheduling/calendar', title: 'Surgery Calendar', desc: 'Interactive calendar view of all scheduled surgeries across theaters.',
    cols: ['Surgery Date', 'Time Slot', 'OT Room', 'Patient Name', 'Surgeon', 'Status'],
    stats: [{ label: 'Surgeries Today', val: '12', col: 'text-blue-400' }, { label: 'Available Slots', val: '4', col: 'text-emerald-400' }, { label: 'Emergency Add-ons', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Confirmed', 'Confirmed', 'Tentative', 'Confirmed', 'In Progress'];
      return { surgerydate: 'Today', timeslot: (8+i) + ':00 AM', otroom: 'OT ' + (1+i), patientname: 'Patient ' + (i+1), surgeon: 'Dr. Grey', status: statuses[i] };
    })`
  },
  {
    path: 'ot/scheduling/booking', title: 'OT Booking', desc: 'Interface for surgeons to request and book operation theater slots.',
    cols: ['Booking ID', 'Patient Name', 'Procedure', 'Requested Date', 'Duration', 'Status'],
    stats: [{ label: 'Pending Requests', val: '8', col: 'text-amber-400' }, { label: 'Approved Today', val: '15', col: 'text-emerald-400' }, { label: 'Declined/Rescheduled', val: '1', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending', 'Approved', 'Approved', 'Pending', 'Rescheduled'];
      return { bookingid: 'BKG-' + (1001+i), patientname: 'Patient ' + (i+1), procedure: 'Appendectomy', requesteddate: 'Next Week', duration: '2 Hours', status: statuses[i] };
    })`
  },
  {
    path: 'ot/scheduling/availability', title: 'OT Availability', desc: 'Real-time dashboard showing occupied and available operation theaters.',
    cols: ['OT Room', 'Current Status', 'Current Surgery', 'Next Scheduled', 'Turnaround Time', 'Status'],
    stats: [{ label: 'Total OTs', val: '8', col: 'text-blue-400' }, { label: 'Currently Active', val: '5', col: 'text-emerald-400' }, { label: 'Under Maintenance', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In Use', 'Available', 'Cleaning', 'In Use', 'Maintenance'];
      return { otroom: 'OT ' + (1+i), currentstatus: statuses[i], currentsurgery: statuses[i] === 'In Use' ? 'CABG' : '-', nextscheduled: '2:00 PM', turnaroundtime: '45 mins', status: statuses[i] };
    })`
  },
  {
    path: 'ot/scheduling/emergency', title: 'Emergency OT', desc: 'Rapid booking and mobilization for life-saving emergency surgeries.',
    cols: ['Case ID', 'Patient Name', 'Emergency Type', 'Triage Level', 'Time to Knife', 'Status'],
    stats: [{ label: 'Active Trauma Cases', val: '2', col: 'text-red-400' }, { label: 'Avg Time to Knife', val: '18 mins', col: 'text-emerald-400' }, { label: 'Standby Teams', val: '1', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In OT', 'Prep', 'Completed', 'In OT', 'Completed'];
      return { caseid: 'EMG-' + (2001+i), patientname: 'Patient ' + (i+1), emergencytype: 'Polytrauma', triagelevel: 'Level 1 (Red)', timetoknife: '15 mins', status: statuses[i] };
    })`
  },
  {
    path: 'ot/scheduling/queue', title: 'Surgery Queue', desc: 'Waitlist and queue management for elective and semi-urgent procedures.',
    cols: ['Queue ID', 'Patient Name', 'Procedure', 'Wait Time (Days)', 'Priority', 'Status'],
    stats: [{ label: 'Total in Queue', val: '45', col: 'text-blue-400' }, { label: 'High Priority', val: '12', col: 'text-red-400' }, { label: 'Cleared This Week', val: '20', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Waiting', 'Scheduled', 'Waiting', 'Deferred', 'Scheduled'];
      return { queueid: 'Q-' + (3001+i), patientname: 'Patient ' + (i+1), procedure: 'Hernia Repair', waittimedays: (5 + i).toString(), priority: i%2===0?'High':'Normal', status: statuses[i] };
    })`
  },

  // Pre-Operative
  {
    path: 'ot/pre-operative/assessment', title: 'Surgery Assessment', desc: 'Pre-admission screening and surgical risk assessments.',
    cols: ['Assessment ID', 'Patient Name', 'Procedure', 'ASA Grade', 'Assessed By', 'Status'],
    stats: [{ label: 'Pending Assessments', val: '14', col: 'text-amber-400' }, { label: 'Cleared for Surgery', val: '30', col: 'text-emerald-400' }, { label: 'High Risk Cases', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Cleared', 'Pending', 'High Risk', 'Cleared', 'Pending Labs'];
      return { assessmentid: 'PRE-' + (1001+i), patientname: 'Patient ' + (i+1), procedure: 'Cholecystectomy', asagrade: 'ASA II', assessedby: 'Dr. Smith', status: statuses[i] };
    })`
  },
  {
    path: 'ot/pre-operative/pac', title: 'Pre-Anesthesia Checkup (PAC)', desc: 'Anesthesiologist clearance and airway assessment records.',
    cols: ['PAC ID', 'Patient Name', 'Airway Class (Mallampati)', 'Allergies', 'Anesthetist', 'Status'],
    stats: [{ label: 'PACs Today', val: '22', col: 'text-blue-400' }, { label: 'Cleared', val: '18', col: 'text-emerald-400' }, { label: 'Unfit for Anesthesia', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Fit', 'Fit', 'Pending', 'Unfit (Cardio consult)', 'Fit'];
      return { pacid: 'PAC-' + (2001+i), patientname: 'Patient ' + (i+1), airwayclassmallampati: 'Class II', allergies: 'Penicillin', anesthetist: 'Dr. Sleep', status: statuses[i] };
    })`
  },
  {
    path: 'ot/pre-operative/consent', title: 'Consent Verification', desc: 'Digital tracking of informed consents for surgery and anesthesia.',
    cols: ['Form ID', 'Patient Name', 'Procedure', 'Patient Signed', 'Doctor Signed', 'Status'],
    stats: [{ label: 'Consents Pending', val: '5', col: 'text-amber-400' }, { label: 'Fully Executed', val: '40', col: 'text-emerald-400' }, { label: 'Refusals', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Complete', 'Complete', 'Pending Patient', 'Complete', 'Pending Doctor'];
      return { formid: 'CON-' + (3001+i), patientname: 'Patient ' + (i+1), procedure: 'Knee Replacement', patientsigned: 'Yes', doctorsigned: statuses[i]==='Complete'?'Yes':'-', status: statuses[i] };
    })`
  },
  {
    path: 'ot/pre-operative/checklist', title: 'Pre-Op Ward Checklist', desc: 'Ward nurse checklist before transferring patient to the OT (NPO status, site marking, etc).',
    cols: ['Checklist ID', 'Patient Name', 'Ward', 'NPO Confirmed', 'Site Marked', 'Status'],
    stats: [{ label: 'Transfers Today', val: '12', col: 'text-blue-400' }, { label: 'Ready to Transfer', val: '3', col: 'text-emerald-400' }, { label: 'Incomplete Prep', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Ready', 'Ready', 'Incomplete', 'Transferred', 'Incomplete'];
      return { checklistid: 'CHK-' + (4001+i), patientname: 'Patient ' + (i+1), ward: 'Surgical Ward A', npoconfirmed: 'Yes (>8h)', sitemarked: 'Yes', status: statuses[i] };
    })`
  },
  {
    path: 'ot/pre-operative/preparation', title: 'Patient Preparation', desc: 'Holding area notes, IV line insertion, and pre-medication tracking.',
    cols: ['Prep ID', 'Patient Name', 'Holding Bay', 'IV Access', 'Pre-Meds Given', 'Status'],
    stats: [{ label: 'Patients in Holding', val: '4', col: 'text-blue-400' }, { label: 'Fully Prepped', val: '2', col: 'text-emerald-400' }, { label: 'Delayed', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Prepped', 'Prepping', 'Waiting', 'Prepped', 'Prepping'];
      return { prepid: 'PRP-' + (5001+i), patientname: 'Patient ' + (i+1), holdingbay: 'Bay ' + (1+i), ivaccess: '18G Right Hand', premedsgiven: 'Midazolam 2mg', status: statuses[i] };
    })`
  },

  // Operation Theatre
  {
    path: 'ot/operation-theatre/today', title: "Today's Surgeries", desc: 'Live view of all surgeries scheduled, ongoing, and completed today.',
    cols: ['OT Room', 'Patient Name', 'Procedure', 'Surgeon', 'Start Time', 'Status'],
    stats: [{ label: 'Total Surgeries', val: '18', col: 'text-blue-400' }, { label: 'Completed', val: '10', col: 'text-emerald-400' }, { label: 'Ongoing', val: '5', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['In Progress', 'Completed', 'Next Up', 'In Progress', 'Completed'];
      return { otroom: 'OT ' + (1+i), patientname: 'Patient ' + (i+1), procedure: 'Craniotomy', surgeon: 'Dr. Shepherd', starttime: '08:00 AM', status: statuses[i] };
    })`
  },
  {
    path: 'ot/operation-theatre/active', title: 'Active Surgeries Dashboard', desc: 'Real-time monitoring of currently ongoing operations and their phases.',
    cols: ['OT Room', 'Surgery Phase', 'Time Elapsed', 'Surgeon', 'Anesthetist', 'Status'],
    stats: [{ label: 'Active Rooms', val: '5/8', col: 'text-blue-400' }, { label: 'Overtime Surgeries', val: '1', col: 'text-red-400' }, { label: 'Closing Phase', val: '2', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const phases = ['Induction', 'Incision', 'Main Procedure', 'Closure', 'Extubation'];
      const statuses = ['Ongoing', 'Ongoing', 'Prolonged', 'Ongoing', 'Finishing'];
      return { otroom: 'OT ' + (1+i), surgeryphase: phases[i], timeelapsed: (30 + i*45) + ' mins', surgeon: 'Dr. Grey', anesthetist: 'Dr. Sleep', status: statuses[i] };
    })`
  },
  {
    path: 'ot/operation-theatre/allocation', title: 'OT Allocation & Staffing', desc: 'Assignment of nurses, scrub techs, and support staff to specific rooms.',
    cols: ['OT Room', 'Scrub Nurse', 'Circulating Nurse', 'Technician', 'Shift', 'Status'],
    stats: [{ label: 'Staff on Duty', val: '24', col: 'text-blue-400' }, { label: 'Rooms Fully Staffed', val: '8/8', col: 'text-emerald-400' }, { label: 'Relief Needed', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Assigned', 'Assigned', 'Relief Req', 'Assigned', 'Assigned'];
      return { otroom: 'OT ' + (1+i), scrubnurse: 'Nurse ' + (i+1), circulatingnurse: 'Nurse ' + (i+6), technician: 'Tech ' + (i+1), shift: 'Morning', status: statuses[i] };
    })`
  },
  {
    path: 'ot/operation-theatre/team', title: 'Surgical Team Logs', desc: 'Check-in and scrub times for the surgical and anesthesia teams.',
    cols: ['Team Member', 'Role', 'OT Room', 'Scrub In Time', 'Scrub Out Time', 'Status'],
    stats: [{ label: 'Active Surgeons', val: '6', col: 'text-blue-400' }, { label: 'Active Anesthetists', val: '5', col: 'text-emerald-400' }, { label: 'Total Team Hours', val: '142 hrs', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const roles = ['Lead Surgeon', 'Assistant Surgeon', 'Anesthetist', 'Scrub Nurse', 'Perfusionist'];
      const statuses = ['Scrubbed In', 'Scrubbed In', 'Scrubbed Out', 'Scrubbed In', 'Scrubbed In'];
      return { teammember: 'Dr. Person ' + (i+1), role: roles[i], otroom: 'OT 1', scrubintime: '08:15 AM', scrubouttime: statuses[i]==='Scrubbed Out'?'12:00 PM':'-', status: statuses[i] };
    })`
  },
  {
    path: 'ot/operation-theatre/checklist', title: 'WHO Surgical Safety Checklist', desc: 'Sign In, Time Out, and Sign Out verification logs.',
    cols: ['Surgery ID', 'Patient Name', 'Sign In', 'Time Out', 'Sign Out', 'Status'],
    stats: [{ label: 'Compliance Rate', val: '100%', col: 'text-emerald-400' }, { label: 'Pending Time Out', val: '1', col: 'text-amber-400' }, { label: 'Completed Today', val: '10', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Complete', 'Time Out Done', 'Sign In Done', 'Complete', 'Complete'];
      return { surgeryid: 'SUR-' + (1001+i), patientname: 'Patient ' + (i+1), signin: 'Verified', timeout: statuses[i] !== 'Sign In Done' ? 'Verified' : '-', signout: statuses[i] === 'Complete' ? 'Verified' : '-', status: statuses[i] };
    })`
  },
  {
    path: 'ot/operation-theatre/implants', title: 'Implants & Consumables', desc: 'Tracking of surgical implants, meshes, and high-value consumables used.',
    cols: ['Log ID', 'Surgery ID', 'Item Name', 'Lot/Serial No', 'Quantity Used', 'Status'],
    stats: [{ label: 'Implants Used', val: '4', col: 'text-blue-400' }, { label: 'Cost Tracked', val: '$12,500', col: 'text-emerald-400' }, { label: 'Wastage', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const items = ['Knee Prosthesis (Titanium)', 'Prolene Mesh 15x15', 'Bone Screws (x4)', 'Surgical Stapler', 'Pacemaker Lead'];
      const statuses = ['Logged', 'Logged', 'Logged', 'Logged', 'Logged'];
      return { logid: 'IMP-' + (2001+i), surgeryid: 'SUR-' + (1000+i), itemname: items[i], lotserialno: 'LOT-' + (9876+i), quantityused: '1', status: statuses[i] };
    })`
  },
  {
    path: 'ot/operation-theatre/notes', title: 'Intraoperative Notes', desc: 'Circulating nurse documentation of events, tourniquet times, and counts.',
    cols: ['Note ID', 'Surgery ID', 'Sponge Count', 'Sharp Count', 'Tourniquet Time', 'Status'],
    stats: [{ label: 'Count Discrepancies', val: '0', col: 'text-emerald-400' }, { label: 'Notes Finalized', val: '8', col: 'text-blue-400' }, { label: 'Draft Notes', val: '3', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Finalized', 'Finalized', 'Draft', 'Finalized', 'Draft'];
      return { noteid: 'NOT-' + (3001+i), surgeryid: 'SUR-' + (1000+i), spongecount: 'Correct (30/30)', sharpcount: 'Correct (15/15)', tourniquettime: '45 mins', status: statuses[i] };
    })`
  },

  // Anesthesia
  {
    path: 'ot/anesthesia/assessment', title: 'Intra-Op Anesthesia Assessment', desc: 'Continuous logging of patient condition and depth of anesthesia.',
    cols: ['Log ID', 'Surgery ID', 'Anesthesia Type', 'Airway Device', 'BIS Index', 'Status'],
    stats: [{ label: 'General Anesthesia', val: '12', col: 'text-blue-400' }, { label: 'Regional/Spinal', val: '4', col: 'text-emerald-400' }, { label: 'MAC/Sedation', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['General (GA)', 'Spinal', 'Epidural', 'GA', 'MAC'];
      const statuses = ['Active', 'Completed', 'Active', 'Completed', 'Active'];
      return { logid: 'ANE-' + (1001+i), surgeryid: 'SUR-' + (1000+i), anesthesiatype: types[i], airwaydevice: 'Endotracheal Tube', bisindex: '45-60', status: statuses[i] };
    })`
  },
  {
    path: 'ot/anesthesia/plan', title: 'Anesthesia Plan', desc: 'Pre-defined protocols for drug administration and pain management.',
    cols: ['Plan ID', 'Patient Name', 'Induction Agents', 'Maintenance', 'Analgesia Plan', 'Status'],
    stats: [{ label: 'Plans Created', val: '18', col: 'text-blue-400' }, { label: 'Approved', val: '18', col: 'text-emerald-400' }, { label: 'Deviations', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { planid: 'APL-' + (2001+i), patientname: 'Patient ' + (i+1), inductionagents: 'Propofol, Fentanyl', maintenance: 'Desflurane', analgesiaplan: 'IV Paracetamol, Morphine', status: 'Approved' };
    })`
  },
  {
    path: 'ot/anesthesia/medication', title: 'Anesthesia Medication Log', desc: 'Exact timestamps and dosages of anesthetics and emergency drugs given.',
    cols: ['Med Log ID', 'Surgery ID', 'Drug Name', 'Dose', 'Time Administered', 'Status'],
    stats: [{ label: 'Total Drugs Logged', val: '145', col: 'text-blue-400' }, { label: 'Narcotics Checked', val: '100%', col: 'text-emerald-400' }, { label: 'Emergency Drugs Used', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const drugs = ['Propofol', 'Rocuronium', 'Fentanyl', 'Ephedrine', 'Neostigmine'];
      return { medlogid: 'AML-' + (3001+i), surgeryid: 'SUR-1001', drugname: drugs[i], dose: (10 * (i+1)) + ' mg', timeadministered: '08:' + (15+i*10) + ' AM', status: 'Administered' };
    })`
  },
  {
    path: 'ot/anesthesia/monitoring', title: 'Intraoperative Monitoring', desc: 'Automated vitals data capture (HR, BP, SpO2, EtCO2) from monitors.',
    cols: ['Monitor ID', 'OT Room', 'Avg HR', 'Avg MAP', 'EtCO2 Range', 'Status'],
    stats: [{ label: 'Connected Monitors', val: '8/8', col: 'text-emerald-400' }, { label: 'Alarms Triggered', val: '2', col: 'text-red-400' }, { label: 'Data Integrity', val: '99.9%', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Stable', 'Stable', 'Alarm (BP Drop)', 'Stable', 'Stable'];
      return { monitorid: 'MON-' + (4001+i), otroom: 'OT ' + (1+i), avghr: '75 bpm', avgmap: '85 mmHg', etco2range: '35-40 mmHg', status: statuses[i] };
    })`
  },
  {
    path: 'ot/anesthesia/recovery', title: 'Extubation & Handover', desc: 'Reversal of anesthesia, extubation notes, and handover to PACU.',
    cols: ['Handover ID', 'Patient Name', 'Extubation Time', 'Aldrete Score', 'Handover To', 'Status'],
    stats: [{ label: 'Handovers Today', val: '10', col: 'text-blue-400' }, { label: 'Delayed Emergence', val: '0', col: 'text-emerald-400' }, { label: 'Re-intubations', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'Completed', 'In Progress', 'Completed', 'Completed'];
      return { handoverid: 'HND-' + (5001+i), patientname: 'Patient ' + (i+1), extubationtime: '12:30 PM', aldretescore: '8/10', handoverto: 'PACU Nurse', status: statuses[i] };
    })`
  },

  // Recovery Room (PACU)
  {
    path: 'ot/recovery/monitoring', title: 'PACU Monitoring Dashboard', desc: 'Post-Anesthesia Care Unit patient tracking and vitals monitoring.',
    cols: ['Bed ID', 'Patient Name', 'Surgery Type', 'Time in PACU', 'Aldrete Score', 'Status'],
    stats: [{ label: 'Occupied Beds', val: '6/10', col: 'text-amber-400' }, { label: 'Ready for Ward', val: '3', col: 'text-emerald-400' }, { label: 'Critical (Keep in PACU)', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Recovering', 'Ready for Ward', 'Recovering', 'Ready for Ward', 'Extended Observation'];
      return { bedid: 'PACU-' + (1+i), patientname: 'Patient ' + (i+1), surgerytype: 'General', timeinpacu: (45 + i*15) + ' mins', aldretescore: (7 + i%3) + '/10', status: statuses[i] };
    })`
  },
  {
    path: 'ot/recovery/notes', title: 'PACU Nursing Notes', desc: 'Documentation of patient awakening, airway patency, and hemodynamic stability.',
    cols: ['Note ID', 'Patient Name', 'Airway Status', 'Consciousness Level', 'Nurse', 'Status'],
    stats: [{ label: 'Notes Logged', val: '24', col: 'text-blue-400' }, { label: 'Airway Interventions', val: '0', col: 'text-emerald-400' }, { label: 'Pending Notes', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { noteid: 'PACN-' + (1001+i), patientname: 'Patient ' + (i+1), airwaystatus: 'Maintaining own airway', consciousnesslevel: 'Arousable to voice', nurse: 'Nurse Jane', status: 'Draft' };
    })`
  },
  {
    path: 'ot/recovery/pain', title: 'Post-Op Pain Management', desc: 'Tracking of VAS scores and administration of rescue analgesia.',
    cols: ['Patient Name', 'Initial VAS', 'Current VAS', 'Analgesics Given', 'Nausea/Vomiting (PONV)', 'Status'],
    stats: [{ label: 'Patients in Pain (VAS > 4)', val: '2', col: 'text-red-400' }, { label: 'Comfortable', val: '4', col: 'text-emerald-400' }, { label: 'PONV Cases', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Comfortable', 'Mild Pain', 'Severe Pain', 'Comfortable', 'Comfortable'];
      return { patientname: 'Patient ' + (i+1), initialvas: '8/10', currentvas: statuses[i]==='Severe Pain'?'7/10':'2/10', analgesicsgiven: 'Fentanyl 50mcg', nauseavomitingponv: 'None', status: statuses[i] };
    })`
  },
  {
    path: 'ot/recovery/discharge', title: 'Discharge from PACU', desc: 'Final clearance criteria evaluation before transferring to Ward or ICU.',
    cols: ['Patient Name', 'Discharge Criteria Met', 'Destination', 'Cleared By', 'Time', 'Status'],
    stats: [{ label: 'Discharged Today', val: '8', col: 'text-blue-400' }, { label: 'Pending Clearance', val: '4', col: 'text-amber-400' }, { label: 'Transferred to ICU', val: '2', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Cleared', 'Pending', 'Cleared', 'Cleared', 'Pending Review'];
      return { patientname: 'Patient ' + (i+1), dischargecriteriamet: statuses[i]==='Cleared'?'Yes (Score 10/10)':'No', destination: 'Surgical Ward', clearedby: 'Dr. Anesthesiologist', time: '14:00', status: statuses[i] };
    })`
  },

  // ICU & Critical Care
  {
    path: 'ot/icu/icu-patients', title: 'Intensive Care Unit (ICU)', desc: 'Central dashboard for general adult intensive care patients.',
    cols: ['Bed ID', 'Patient Name', 'Admission Diagnosis', 'Acuity Level', 'Days in ICU', 'Status'],
    stats: [{ label: 'Total Beds', val: '20', col: 'text-blue-400' }, { label: 'Occupied', val: '18', col: 'text-amber-400' }, { label: 'Critical', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Stable', 'Critical', 'Improving', 'Stable', 'Critical'];
      return { bedid: 'ICU-' + (1+i), patientname: 'Patient ' + (i+1), admissiondiagnosis: 'Sepsis', acuitylevel: 'Level 3', daysinicu: (2+i).toString(), status: statuses[i] };
    })`
  },
  {
    path: 'ot/icu/ccu-patients', title: 'Coronary Care Unit (CCU)', desc: 'Dashboard for cardiac emergencies, MIs, and post-CABG patients.',
    cols: ['Bed ID', 'Patient Name', 'Cardiac Event', 'Intervention', 'Rhythm', 'Status'],
    stats: [{ label: 'Occupied Beds', val: '8/10', col: 'text-amber-400' }, { label: 'Cath Lab Transfers', val: '2', col: 'text-blue-400' }, { label: 'Arrhythmia Alerts', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const events = ['STEMI', 'NSTEMI', 'Post-CABG', 'Heart Failure', 'Arrhythmia'];
      const statuses = ['Critical', 'Stable', 'Stable', 'Critical', 'Improving'];
      return { bedid: 'CCU-' + (1+i), patientname: 'Patient ' + (10+i), cardiacevent: events[i], intervention: 'PCI to LAD', rhythm: 'Sinus Tachycardia', status: statuses[i] };
    })`
  },
  {
    path: 'ot/icu/nicu-patients', title: 'Neonatal ICU (NICU)', desc: 'Monitoring for premature and critically ill newborns.',
    cols: ['Incubator ID', 'Neonate Name', 'Gestational Age', 'Birth Weight', 'Respiratory Support', 'Status'],
    stats: [{ label: 'Neonates', val: '12', col: 'text-blue-400' }, { label: 'On Ventilator', val: '4', col: 'text-amber-400' }, { label: 'Ready to Step-down', val: '2', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const supports = ['CPAP', 'Mechanical Vent', 'Room Air', 'High Flow O2', 'CPAP'];
      return { incubatorid: 'NICU-' + (1+i), neonatename: 'Baby of Smith', gestationalage: '32 Weeks', birthweight: '1.5 kg', respiratorysupport: supports[i], status: 'Stable' };
    })`
  },
  {
    path: 'ot/icu/picu-patients', title: 'Pediatric ICU (PICU)', desc: 'Intensive care dashboard for critically ill children.',
    cols: ['Bed ID', 'Patient Name', 'Age', 'Diagnosis', 'PEWS Score', 'Status'],
    stats: [{ label: 'Occupied Beds', val: '6/8', col: 'text-amber-400' }, { label: 'High PEWS Alerts', val: '1', col: 'text-red-400' }, { label: 'Stable', val: '5', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Stable', 'Stable', 'Deteriorating', 'Improving', 'Stable'];
      return { bedid: 'PICU-' + (1+i), patientname: 'Child ' + (i+1), age: (2+i) + ' Years', diagnosis: 'Pneumonia', pewsscore: statuses[i]==='Deteriorating'?'6':'2', status: statuses[i] };
    })`
  },
  {
    path: 'ot/icu/sicu-patients', title: 'Surgical ICU (SICU)', desc: 'Post-operative critical care and trauma recovery monitoring.',
    cols: ['Bed ID', 'Patient Name', 'Surgical Procedure', 'Post-Op Day', 'Drain Output', 'Status'],
    stats: [{ label: 'Occupied Beds', val: '10/12', col: 'text-blue-400' }, { label: 'Ventilated', val: '3', col: 'text-amber-400' }, { label: 'Discharge Planned', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { bedid: 'SICU-' + (1+i), patientname: 'Patient ' + (20+i), surgicalprocedure: 'Whipple Procedure', postopday: 'POD ' + (1+i), drainoutput: (50 + i*20) + ' ml', status: 'Stable' };
    })`
  },
  {
    path: 'ot/icu/micu-patients', title: 'Medical ICU (MICU)', desc: 'Dashboard for severe medical conditions (sepsis, ARDS, DKA).',
    cols: ['Bed ID', 'Patient Name', 'Primary System', 'SOFA Score', 'Inotropes', 'Status'],
    stats: [{ label: 'Occupied Beds', val: '14/15', col: 'text-red-400' }, { label: 'Septic Shock', val: '4', col: 'text-red-400' }, { label: 'Improving', val: '6', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const systems = ['Respiratory', 'Renal', 'Neurological', 'Cardiovascular', 'Hepatic'];
      return { bedid: 'MICU-' + (1+i), patientname: 'Patient ' + (30+i), primarysystem: systems[i], sofascore: (4+i).toString(), inotropes: i%2===0?'Noradrenaline':'None', status: 'Critical' };
    })`
  },
  {
    path: 'ot/icu/hdu-patients', title: 'High Dependency Unit (HDU)', desc: 'Step-down unit for patients requiring close monitoring but not ICU level care.',
    cols: ['Bed ID', 'Patient Name', 'Transferred From', 'Monitoring Level', 'Expected Ward Transfer', 'Status'],
    stats: [{ label: 'Occupied Beds', val: '10/12', col: 'text-blue-400' }, { label: 'Ready for Ward', val: '5', col: 'text-emerald-400' }, { label: 'Deteriorating', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Ready for Ward', 'Monitoring', 'Monitoring', 'Ready for Ward', 'Monitoring'];
      return { bedid: 'HDU-' + (1+i), patientname: 'Patient ' + (40+i), transferredfrom: 'ICU', monitoringlevel: 'Continuous Vitals', expectedwardtransfer: 'Today', status: statuses[i] };
    })`
  },

  // Critical Monitoring
  {
    path: 'ot/monitoring/vitals', title: 'Live Vitals Board', desc: 'Centralized live feed of patient monitors across all critical care units.',
    cols: ['Unit/Bed', 'Patient Name', 'Heart Rate', 'Blood Pressure', 'SpO2 / Resp Rate', 'Status'],
    stats: [{ label: 'Monitors Online', val: '64/64', col: 'text-emerald-400' }, { label: 'Active Alarms', val: '3', col: 'text-red-400' }, { label: 'Arrhythmias Detected', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Normal', 'Normal', 'Alarm (Low BP)', 'Normal', 'Normal'];
      return { unitbed: 'ICU-' + (1+i), patientname: 'Patient ' + (i+1), heartrate: '85 bpm', bloodpressure: statuses[i]==='Alarm (Low BP)'?'80/50 mmHg':'120/80 mmHg', spo2resprate: '98% / 16', status: statuses[i] };
    })`
  },
  {
    path: 'ot/monitoring/ventilator', title: 'Ventilator Monitoring', desc: 'Tracking ventilator modes, settings, ABGs, and weaning progress.',
    cols: ['Bed ID', 'Patient Name', 'Vent Mode', 'FiO2 / PEEP', 'Latest ABG (PaO2)', 'Status'],
    stats: [{ label: 'Patients Ventilated', val: '15', col: 'text-blue-400' }, { label: 'Weaning Trials', val: '4', col: 'text-amber-400' }, { label: 'Extubated Today', val: '2', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const modes = ['PRVC', 'SIMV', 'CPAP/PS', 'BiPAP', 'PRVC'];
      const statuses = ['Ventilated', 'Ventilated', 'Weaning', 'NIV', 'Ventilated'];
      return { bedid: 'ICU-' + (1+i), patientname: 'Patient ' + (i+1), ventmode: modes[i], fio2peep: '40% / 5', latestabgpao2: '85 mmHg', status: statuses[i] };
    })`
  },
  {
    path: 'ot/monitoring/oxygen', title: 'Oxygen Therapy', desc: 'Monitoring oxygen delivery devices, flow rates, and cylinder statuses.',
    cols: ['Bed ID', 'Patient Name', 'Delivery Device', 'Flow Rate', 'Target SpO2', 'Status'],
    stats: [{ label: 'O2 Therapy Patients', val: '45', col: 'text-blue-400' }, { label: 'High Flow (HFNC)', val: '8', col: 'text-amber-400' }, { label: 'Central O2 Pressure', val: 'Normal', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const devices = ['Nasal Cannula', 'NRBM', 'HFNC', 'Venturi Mask', 'Simple Mask'];
      return { bedid: 'HDU-' + (1+i), patientname: 'Patient ' + (i+1), deliverydevice: devices[i], flowrate: (2+i*2) + ' L/min', targetspo2: '> 94%', status: 'Maintaining Target' };
    })`
  },
  {
    path: 'ot/monitoring/infusion', title: 'Infusion Pumps', desc: 'Centralized tracking of syringe pumps, IV fluids, and vasoactive drugs.',
    cols: ['Pump ID', 'Bed ID', 'Medication', 'Dose Rate', 'Time Remaining', 'Status'],
    stats: [{ label: 'Active Pumps', val: '120', col: 'text-blue-400' }, { label: 'Inotropes/Vasopressors', val: '15', col: 'text-red-400' }, { label: 'Near Empty Alarms', val: '4', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Running', 'Near Empty', 'Running', 'Running', 'Paused'];
      return { pumpid: 'PMP-' + (1001+i), bedid: 'ICU-' + (1+i), medication: 'Noradrenaline', doserate: '0.05 mcg/kg/min', timeremaining: statuses[i]==='Near Empty'?'10 mins':'4 hrs', status: statuses[i] };
    })`
  },
  {
    path: 'ot/monitoring/central-line', title: 'Central Line & Invasive Monitoring', desc: 'Tracking CVP, Arterial Lines, PICC lines, and CLABSI bundles.',
    cols: ['Line ID', 'Bed ID', 'Line Type', 'Insertion Date', 'CVP Reading', 'Status'],
    stats: [{ label: 'Active Central Lines', val: '32', col: 'text-blue-400' }, { label: 'Arterial Lines', val: '18', col: 'text-amber-400' }, { label: 'Dressing Due', val: '5', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['CVC (Right IJV)', 'Arterial Line (Radial)', 'PICC', 'CVC (Subclavian)', 'Arterial Line (Femoral)'];
      const statuses = ['Functional', 'Functional', 'Dressing Due', 'Functional', 'Remove Today'];
      return { lineid: 'LIN-' + (2001+i), bedid: 'ICU-' + (1+i), linetype: types[i], insertiondate: '01 Jul 2026', cvpreading: types[i].includes('CVC') ? '8 mmHg' : '-', status: statuses[i] };
    })`
  },
  {
    path: 'ot/monitoring/dialysis', title: 'CRRT & Dialysis', desc: 'Continuous Renal Replacement Therapy and bedside hemodialysis monitoring.',
    cols: ['Session ID', 'Bed ID', 'Modality', 'Blood Flow (Qb)', 'Fluid Removal Rate', 'Status'],
    stats: [{ label: 'Active CRRT', val: '3', col: 'text-red-400' }, { label: 'Bedside HD Today', val: '5', col: 'text-blue-400' }, { label: 'Filter Clot Alarms', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const modalities = ['CVVHDF', 'SLED', 'CVVHDF', 'Hemodialysis', 'CVVH'];
      const statuses = ['Running', 'Running', 'Completed', 'Scheduled', 'Running'];
      return { sessionid: 'DYL-' + (3001+i), bedid: 'ICU-' + (1+i), modality: modalities[i], bloodflowqb: '150 ml/min', fluidremovalrate: '50 ml/hr', status: statuses[i] };
    })`
  },

  // Patient Care (ICU/OT)
  {
    path: 'ot/patient-care/rounds', title: 'Daily ICU Rounds', desc: 'Multidisciplinary team round notes, FASTHUG checklists, and goals of care.',
    cols: ['Round ID', 'Bed ID', 'Lead Intensivist', 'FASTHUG Status', 'Goals Documented', 'Status'],
    stats: [{ label: 'Rounds Completed', val: '18/20', col: 'text-emerald-400' }, { label: 'Pending', val: '2', col: 'text-amber-400' }, { label: 'Family Updates Done', val: '15', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Completed', 'Completed', 'Pending', 'Completed', 'Completed'];
      return { roundid: 'RND-' + (1001+i), bedid: 'ICU-' + (1+i), leadintensivist: 'Dr. House', fasthugstatus: 'Reviewed', goalsdocumented: 'Yes', status: statuses[i] };
    })`
  },
  {
    path: 'ot/patient-care/progress', title: 'Doctor Progress Notes', desc: 'Detailed clinical progress notes, SOAP format, for critical patients.',
    cols: ['Note ID', 'Bed ID', 'Patient Name', 'Author', 'Primary System Focus', 'Status'],
    stats: [{ label: 'Notes Authored Today', val: '45', col: 'text-blue-400' }, { label: 'Missing Daily Note', val: '1', col: 'text-red-400' }, { label: 'Signed', val: '40', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Signed', 'Draft', 'Signed', 'Signed', 'Draft'];
      return { noteid: 'PRG-' + (2001+i), bedid: 'ICU-' + (1+i), patientname: 'Patient ' + (i+1), author: 'Dr. Resident', primarysystemfocus: 'Respiratory', status: statuses[i] };
    })`
  },
  {
    path: 'ot/patient-care/nursing', title: 'Nursing Care Notes', desc: 'Hourly nursing assessments, interventions, and GCS charting.',
    cols: ['Entry ID', 'Bed ID', 'Nurse', 'GCS Score', 'Pain Score', 'Status'],
    stats: [{ label: 'Hourly Notes Compliance', val: '98%', col: 'text-emerald-400' }, { label: 'Overdue Notes', val: '2', col: 'text-amber-400' }, { label: 'Total Entries', val: '480', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { entryid: 'NRS-' + (3001+i), bedid: 'ICU-' + (1+i), nurse: 'Nurse Joy', gcsscore: '14/15', painscore: '2/10', status: 'Recorded' };
    })`
  },
  {
    path: 'ot/patient-care/medication', title: 'Intensive Medication Chart', desc: 'Administration record for routine meds, PRNs, and stat doses in ICU.',
    cols: ['Chart ID', 'Bed ID', 'Medication', 'Dose', 'Administered By', 'Status'],
    stats: [{ label: 'Doses Given (Shift)', val: '240', col: 'text-blue-400' }, { label: 'Missed Doses', val: '0', col: 'text-emerald-400' }, { label: 'Pharmacy Delays', val: '1', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Administered', 'Administered', 'Pending', 'Administered', 'Administered'];
      return { chartid: 'MED-' + (4001+i), bedid: 'ICU-' + (1+i), medication: 'Meropenem', dose: '1g IV', administeredby: statuses[i]==='Administered'?'Nurse Jane':'-', status: statuses[i] };
    })`
  },
  {
    path: 'ot/patient-care/io', title: 'Intake & Output (I/O)', desc: 'Hourly tracking of all fluids in (IV, feeds) and out (urine, drains, NG).',
    cols: ['Log ID', 'Bed ID', 'Total Intake (24h)', 'Total Output (24h)', 'Net Balance', 'Status'],
    stats: [{ label: 'Hourly I/O Logged', val: '100%', col: 'text-emerald-400' }, { label: 'Positive Balance > 1L', val: '3', col: 'text-amber-400' }, { label: 'Oliguria Alerts', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const net = (500 - i*200);
      const statuses = net > 0 ? 'Positive Balance' : 'Negative Balance';
      return { logid: 'IO-' + (5001+i), bedid: 'ICU-' + (1+i), totalintake24h: (2500 + i*100) + ' ml', totaloutput24h: (2000 + i*300) + ' ml', netbalance: (net > 0 ? '+' : '') + net + ' ml', status: statuses };
    })`
  },
  {
    path: 'ot/patient-care/fluid', title: 'Fluid & Electrolyte Balance', desc: 'Integration of lab electrolytes (Na, K, ABG) with fluid management plans.',
    cols: ['Patient Name', 'Bed ID', 'Target Fluid Balance', 'Latest K+', 'Latest Na+', 'Status'],
    stats: [{ label: 'Electrolyte Derangements', val: '4', col: 'text-red-400' }, { label: 'Corrective Boluses Active', val: '2', col: 'text-amber-400' }, { label: 'Stable', val: '14', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Stable', 'Correction Active', 'Stable', 'Critical Low K+', 'Stable'];
      return { patientname: 'Patient ' + (i+1), bedid: 'ICU-' + (1+i), targetfluidbalance: 'Even', latestk: statuses[i].includes('Critical')?'2.8 mEq/L':'4.2 mEq/L', latestna: '140 mEq/L', status: statuses[i] };
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
        const isGood = val === 'Confirmed' || val === 'Approved' || val === 'Available' || val === 'Completed' || val === 'Cleared' || val === 'Complete' || val === 'Ready' || val === 'Prepped' || val === 'Assigned' || val === 'Verified' || val === 'Logged' || val === 'Finalized' || val === 'Stable' || val === 'Recovering' || val === 'Ready for Ward' || val === 'Improving' || val === 'Normal' || val === 'Functional' || val === 'Recorded' || val === 'Administered';
        const isWarning = val === 'Tentative' || val === 'Pending' || val === 'Cleaning' || val === 'Maintenance' || val === 'Waiting' || val === 'Scheduled' || val === 'Pending Labs' || val === 'Pending Patient' || val === 'Pending Doctor' || val === 'Incomplete' || val === 'Prepping' || val === 'In Progress' || val === 'Ongoing' || val === 'Relief Req' || val === 'Draft' || val === 'Active' || val === 'Extended Observation' || val === 'Pending Review' || val === 'Weaning' || val === 'NIV' || val === 'Near Empty' || val === 'Dressing Due' || val === 'Positive Balance' || val === 'Correction Active' || val === 'Sign In Done' || val === 'Time Out Done';
        const isNeutral = val === 'Rescheduled' || val === 'Deferred' || val === 'Next Up' || val === 'Finishing' || val === 'Scrubbed In' || val === 'Scrubbed Out' || val === 'Paused' || val === 'Negative Balance' || val === 'Monitoring' || val === 'Maintaining Target';
        const isDanger = val === 'In Use' || val === 'In OT' || val === 'Prep' || val === 'High Risk' || val === 'Unfit (Cardio consult)' || val === 'Prolonged' || val === 'Alarm (BP Drop)' || val === 'Alarm (Low BP)' || val === 'Remove Today' || val === 'Critical' || val === 'Deteriorating' || val === 'Critical Low K+';
        
        let colorClass = 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
        if (isGood) colorClass = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
        else if (isWarning) colorClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        else if (isNeutral) colorClass = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        else if (isDanger) colorClass = 'bg-red-500/10 text-red-500 border border-red-500/20';

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
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
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
      <div className="flex justify-between items-center">
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
        <div className="flex justify-between items-center my-3">
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

const uniqueConfig = config.filter((v, i, a) => a.findIndex(v2 => (v2.path === v.path)) === i);

uniqueConfig.forEach(page => {
  const dir = path.join(__dirname, 'frontend', 'src', 'app', ...page.path.split('/'));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page, componentName));
  console.log('Generated: ' + page.path);
});
