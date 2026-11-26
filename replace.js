const fs = require('fs');
const file = 'd:/projects/Healthcare-CRM/frontend/src/components/Layout/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Regex to match the sequence of elements to remove
const rx = /\{\s*label:\s*"Demographics",\s*href:\s*"\/patients\/demographics"\s*\},[\s\S]*?\{\s*label:\s*"Patient ID Card",\s*href:\s*"\/patients\/id-card"\s*\},?/g;

const initialLen = content.length;
content = content.replace(rx, '');
const finalLen = content.length;

fs.writeFileSync(file, content);
console.log(`Replaced ${initialLen - finalLen} characters`);
