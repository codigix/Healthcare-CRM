const fs = require('fs');
const path = require('path');

const filesToFix = [
  'c:/Healthcare-CRM/frontend/src/app/blood-bank/donors/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/blood-bank/issue/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/blood-bank/issued/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/blood-bank/register-donor/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/departments/add/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/departments/services/add/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/departments/services/edit/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/departments/services/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/inventory/add/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/inventory/alerts/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/inventory/suppliers/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/room-allotment/add-room/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/room-allotment/alloted/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/room-allotment/by-department/page.tsx',
  'c:/Healthcare-CRM/frontend/src/app/room-allotment/new/page.tsx'
];

filesToFix.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const origContent = content;
    
    // Check if API_URL is already imported
    if (!content.includes("const API_URL = process.env.NEXT_PUBLIC_API_URL")) {
      // Add import after the 'use client' line
      content = content.replace(
        /'use client';\n\n/,
        "'use client';\n\nconst API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';\n\n"
      );
    }
    
    // Replace hardcoded URLs - handle both single and template literals
    content = content.replace(/fetch\(['"]http:\/\/localhost:5000\/api/g, "fetch(`${API_URL}");
    content = content.replace(/URL:\s*['"]http:\/\/localhost:5000\/api/g, "URL: `${API_URL}");
    content = content.replace(/baseURL:\s*['"]http:\/\/localhost:5000\/api/g, "baseURL: `${API_URL}");
    content = content.replace(/['"`]http:\/\/localhost:5000\/api([^`"']*)[`"']/g, "`${API_URL}$1`");
    
    if (content !== origContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log('URL replacement complete!');
