const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'frontend', 'src', 'app');

const targetGroups = {
  '(dashboard)': ['dashboard', 'executive'],
  '(doctors)': ['doctor', 'doctors'],
  '(patients)': ['patients', 'admissions'],
  '(appointments)': ['appointments', 'calendar'],
  '(prescriptions)': ['prescriptions'],
  '(ambulance)': ['ambulance'],
  '(pharmacy)': ['pharmacy'],
  '(blood-bank)': ['blood-bank'],
  '(departments)': ['admin', 'departments', 'superadmin', 'settings'],
  '(inventory)': ['inventory'],
  '(staff)': ['hr', 'staff'],
  '(laboratory)': ['diagnostics', 'nurse'],
  '(room-allotment)': ['room-allotment', 'facilities', 'ot', 'visitors'],
  '(billing)': ['billing', 'finance', 'invoices'],
  '(reports)': ['reports', 'records'],
  '(crm-reviews)': ['crm', 'chat', 'communication', 'contacts', 'email', 'tasks', 'feedback', 'helpdesk', 'it', 'reviews', 'support'],
  '(auth)': ['authentication', 'login']
};

const oldGroups = [
  '(administrative)', '(auth)', '(clinical)', '(communication-crm)', '(finance)',
  '(hr)', '(management)', '(operations)', '(pharmacy)', '(support-it)'
];

// Create new groups
for (const group of Object.keys(targetGroups)) {
  const groupPath = path.join(srcApp, group);
  if (!fs.existsSync(groupPath)) {
    fs.mkdirSync(groupPath, { recursive: true });
  }
}

// Find all top-level module folders inside old groups
const moduleLocations = {};

for (const oldGroup of oldGroups) {
  const oldGroupPath = path.join(srcApp, oldGroup);
  if (fs.existsSync(oldGroupPath)) {
    const modules = fs.readdirSync(oldGroupPath);
    for (const mod of modules) {
      const modPath = path.join(oldGroupPath, mod);
      if (fs.statSync(modPath).isDirectory()) {
        moduleLocations[mod] = modPath;
      }
    }
  }
}

// Check for top level modules in src/app itself like `crm`
const appFolders = fs.readdirSync(srcApp);
for (const f of appFolders) {
    const fPath = path.join(srcApp, f);
    if (fs.statSync(fPath).isDirectory() && !f.startsWith('(') && !f.startsWith('.')) {
        moduleLocations[f] = fPath;
    }
}

// Move them to their new target groups
for (const [targetGroup, modules] of Object.entries(targetGroups)) {
  for (const mod of modules) {
    if (moduleLocations[mod]) {
      const oldPath = moduleLocations[mod];
      const newPath = path.join(srcApp, targetGroup, mod);
      // Skip if already moved
      if (oldPath === newPath) continue;
      
      console.log(`Copying ${oldPath} -> ${newPath}`);
      try {
        fs.cpSync(oldPath, newPath, { recursive: true });
        
        // Try to delete the old folder
        try {
            fs.rmSync(oldPath, { recursive: true, force: true });
            console.log(`Deleted ${oldPath}`);
        } catch (e) {
            console.log(`Could not delete ${oldPath}: ${e.message}`);
        }
      } catch (e) {
        console.log(`Could not copy ${oldPath}: ${e.message}`);
      }
    }
  }
}

// Remove empty old groups
for (const oldGroup of oldGroups) {
  const oldGroupPath = path.join(srcApp, oldGroup);
  if (fs.existsSync(oldGroupPath)) {
    try {
        const contents = fs.readdirSync(oldGroupPath);
        if (contents.length === 0) {
            console.log(`Deleting empty group ${oldGroupPath}`);
            fs.rmdirSync(oldGroupPath);
        } else {
            console.log(`Warning: ${oldGroupPath} not empty, remaining files: ${contents.join(', ')}`);
        }
    } catch(e) {}
  }
}

console.log("Migration complete!");
