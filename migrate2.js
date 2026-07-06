const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'frontend', 'src', 'app');

const targetGroups = {
  '(super-admin)': ['superadmin'],
  '(administration)': ['admin', 'departments', 'settings'],
  '(reception-front-office)': ['appointments', 'calendar', 'admissions', 'visitors', 'room-allotment'],
  '(clinical-services)': ['doctor', 'doctors', 'patients', 'prescriptions'],
  '(nursing-patient-care)': ['nurse', 'blood-bank'],
  '(diagnostics)': ['diagnostics', 'laboratory'],
  '(ot-critical-care)': ['ot'],
  '(pharmacy)': ['pharmacy'],
  '(inventory-procurement)': ['inventory'],
  '(finance-accounts)': ['finance', 'billing', 'invoices'],
  '(human-resources)': ['hr', 'staff'],
  '(medical-records-quality)': ['records', 'reports'],
  '(patient-relationship-crm)': ['crm', 'chat', 'communication', 'contacts', 'email', 'tasks'],
  '(facilities-support)': ['facilities', 'ambulance'],
  '(it-system)': ['it', 'helpdesk', 'support', 'feedback', 'reviews'],
  '(executive-mis)': ['dashboard', 'executive'],
  '(auth)': ['authentication', 'login']
};

// Find all current groups
const currentFolders = fs.readdirSync(srcApp);
const oldGroups = currentFolders.filter(f => f.startsWith('(') && fs.statSync(path.join(srcApp, f)).isDirectory());

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

// Check for top level modules in src/app itself (shouldn't be any but just in case)
for (const f of currentFolders) {
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
      
      if (oldPath === newPath) continue; // Already in correct place
      
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
  // Don't delete if it's one of the new target groups
  if (Object.keys(targetGroups).includes(oldGroup)) continue;
  
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

console.log("Migration 2 complete!");
