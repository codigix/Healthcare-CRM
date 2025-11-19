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
      // Add import after the 'use client' line and imports
      const importIndex = content.lastIndexOf("import ");
      if (importIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', importIndex);
        content = content.substring(0, nextLineIndex + 1) + "\nconst API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';\n" + content.substring(nextLineIndex + 1);
      }
    }
    
    // Replace single-quoted URLs
    content = content.replace(/fetch\('http:\/\/localhost:5000\/api/g, "fetch(`${API_URL}");
    content = content.replace(/URL: 'http:\/\/localhost:5000\/api/g, "URL: `${API_URL}");
    content = content.replace(/baseURL: 'http:\/\/localhost:5000\/api/g, "baseURL: `${API_URL}");
    
    // Replace double-quoted URLs
    content = content.replace(/fetch\("http:\/\/localhost:5000\/api/g, "fetch(`${API_URL}");
    content = content.replace(/URL: "http:\/\/localhost:5000\/api/g, "URL: `${API_URL}");
    content = content.replace(/baseURL: "http:\/\/localhost:5000\/api/g, "baseURL: `${API_URL}");
    
    // Replace template literal URLs that are still quoted
    content = content.replace(/`\$\{http:\/\/localhost:5000\/api/g, "`${API_URL}");
    
    // Fix closing quotes for single/double quotes that became template literals
    content = content.replace(/\${API_URL}([^`]*?)['"](\s*[,\);\n}])/g, "`${API_URL}$1`$2");
    
    if (content !== origContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${path.basename(path.dirname(filePath))}/page.tsx`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log('\n✅ URL replacement complete!');
