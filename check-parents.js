const fs = require('fs');
const path = require('path');

const parentDirs = [
  'hospital', 'department', 'employee', 'doctor', 'patient', 'operation', 'approval', 'policy', 'committee',
  'incident', 'resource', 'calendar', 'communication', 'vendor', 'compliance', 'reports'
];

parentDirs.forEach(dir => {
  const p = path.join(__dirname, 'frontend', 'src', 'app', 'admin', dir, 'page.tsx');
  if (!fs.existsSync(p)) {
    console.log(`Missing Parent Page: /admin/${dir}`);
  }
});
