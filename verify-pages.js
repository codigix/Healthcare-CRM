const fs = require('fs');
const path = require('path');

const sidebarPaths = [
  '/admin/hospital/profile', '/admin/hospital/branch', '/admin/hospital/buildings', '/admin/hospital/floors', '/admin/hospital/wards', '/admin/hospital/rooms', '/admin/hospital/beds',
  '/admin/department/list', '/admin/department/specialties', '/admin/department/units', '/admin/department/cost-centers', '/admin/department/heads',
  '/admin/employee/directory', '/admin/employee/allocation', '/admin/employee/transfers', '/admin/employee/duty', '/admin/employee/id-cards',
  '/admin/doctor/directory', '/admin/doctor/schedule', '/admin/doctor/availability', '/admin/doctor/roster', '/admin/doctor/consultants',
  '/admin/patient/overview', '/admin/patient/vip', '/admin/patient/international', '/admin/patient/corporate', '/admin/patient/mlc',
  '/admin/operation/daily', '/admin/operation/census', '/admin/operation/bed-occupancy', '/admin/operation/flow', '/admin/operation/resource',
  '/admin/approval/admission', '/admin/approval/transfer', '/admin/approval/discharge', '/admin/approval/discount', '/admin/approval/refund', '/admin/approval/purchase', '/admin/approval/leave', '/admin/approval/asset',
  '/admin/policy/hospital', '/admin/policy/sop', '/admin/policy/department', '/admin/policy/acknowledgement', '/admin/policy/document',
  '/admin/committee/infection', '/admin/committee/pharmacy', '/admin/committee/ethics', '/admin/committee/quality', '/admin/committee/mortality', '/admin/committee/safety',
  '/admin/incident/reports', '/admin/incident/risk', '/admin/incident/sentinel', '/admin/incident/rca', '/admin/incident/capa',
  '/admin/resource/rooms', '/admin/resource/equipment', '/admin/resource/vehicles', '/admin/resource/ambulance', '/admin/resource/conference',
  '/admin/calendar/holidays', '/admin/calendar/events', '/admin/calendar/meetings', '/admin/calendar/training', '/admin/calendar/maintenance',
  '/admin/communication/notices', '/admin/communication/circulars', '/admin/communication/announcements', '/admin/communication/broadcast', '/admin/communication/emergency',
  '/admin/vendor/directory', '/admin/vendor/service-contracts', '/admin/vendor/amc-contracts', '/admin/vendor/evaluation',
  '/admin/compliance/nabh', '/admin/compliance/fire-safety', '/admin/compliance/biomedical', '/admin/compliance/government', '/admin/compliance/audit',
  '/admin/reports/daily', '/admin/reports/bed', '/admin/reports/department', '/admin/reports/doctor', '/admin/reports/patient', '/admin/reports/incident', '/admin/reports/admin',
  '/admin/analytics', '/admin/settings'
];

let missing = 0;
sidebarPaths.forEach(p => {
  const filePath = path.join(__dirname, 'frontend', 'src', 'app', ...p.split('/'), 'page.tsx');
  if (!fs.existsSync(filePath)) {
    console.log('MISSING:', p);
    missing++;
  }
});

if (missing === 0) {
  console.log('All ' + sidebarPaths.length + ' pages exist and are ready!');
}
