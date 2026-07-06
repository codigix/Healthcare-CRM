const fs = require('fs');
const path = require('path');

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has DataTable
  if (content.includes('<DataTable')) return false;
  if (!content.includes('<table')) return false;

  // 1. Find the mock array name and its keys
  const mapMatch = content.match(/\{([a-zA-Z0-9_]+)\.map\(\s*\(\s*([a-zA-Z0-9_]+)\s*\)/);
  if (!mapMatch) {
    console.log(`Could not find map function in ${filePath}`);
    return false;
  }
  const arrayName = mapMatch[1];
  
  // Try to find the array definition to extract keys
  const arrayDefRegex = new RegExp(`const\\s+${arrayName}\\s*=\\s*\\[\\s*\\{([\\s\\S]*?)\\}`);
  const arrayDefMatch = content.match(arrayDefRegex);
  if (!arrayDefMatch) {
     console.log(`Could not find array def for ${arrayName} in ${filePath}`);
     return false;
  }
  
  // Extract keys from the first object
  const keyMatches = arrayDefMatch[1].matchAll(/([a-zA-Z0-9_]+)\s*:/g);
  const keys = [];
  for (const match of keyMatches) {
     keys.push(match[1]);
  }

  // 2. Extract headers
  const theadMatch = content.match(/<thead>([\s\S]*?)<\/thead>/);
  if (!theadMatch) return false;
  
  const headers = [];
  const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/g;
  let thMatch;
  while ((thMatch = thRegex.exec(theadMatch[1])) !== null) {
    let text = thMatch[1].replace(/<[^>]+>/g, '').trim();
    if (text) headers.push(text);
  }

  // Generate Columns definition
  let columnsCode = `\n  const columns = [\n`;
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    if (h.toLowerCase() === 'actions') {
      columnsCode += `    { header: "${h}", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },\n`;
      continue;
    }
    
    // We should have a key for this header if it's not actions
    const key = keys[i];
    if (!key) {
        // Fallback if keys don't align
        columnsCode += `    { header: "${h}", accessor: "c${i}", sortable: true },\n`;
        continue;
    }
    
    if (h.toLowerCase().includes('status') || key.toLowerCase().includes('status')) {
       columnsCode += `    { header: "${h}", accessor: (row: any) => <span className={\`px-3 py-1 rounded-full text-xs font-medium \${row.${key} === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.${key} === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}\`}>{row.${key}}</span>, sortable: true },\n`;
    } else {
       columnsCode += `    { header: "${h}", accessor: "${key}", sortable: true },\n`;
    }
  }
  columnsCode += `  ];\n`;

  // 3. Inject columns right before return
  content = content.replace(/(\s*return\s*\()/g, columnsCode + '$1');

  // 4. Inject searchTerm state if not exists
  if (!content.includes('searchTerm')) {
      content = content.replace(/(export default function[^{]*{\n)/, `$1  const [searchTerm, setSearchTerm] = useState("");\n`);
  }
  
  // 5. Replace input field to bind to searchTerm
  content = content.replace(/<input\s+type="text"\s+placeholder="([^"]+)"\s+className="([^"]+)"\s*\/>/, 
     `<input type="text" placeholder="$1" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="$2" />`);

  // 6. Replace table block
  // This regex replaces `<table ...> ... </table>` including outer `<div className="overflow-x-auto">` if it exists.
  // Actually, some files don't have the overflow-x-auto wrapper inside the card.
  // We'll just replace the `<table...</table>`.
  content = content.replace(/<table[\s\S]*?<\/table>/, `<DataTable columns={columns} data={${arrayName}} searchTerm={searchTerm} />`);

  // 7. Add DataTable import
  if (!content.includes('import DataTable')) {
      content = content.replace(/(import {[^}]+}\s*from\s*"lucide-react";\n)/, `$1import DataTable from "@/components/UI/DataTable";\n`);
  }
  
  // Also, add DataTable import if lucide-react is not there (unlikely, but just in case)
  if (!content.includes('lucide-react') && !content.includes('import DataTable')) {
      content = content.replace(/(import {[^}]+}\s*from\s*"react";\n)/, `$1import DataTable from "@/components/UI/DataTable";\n`);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Refactored ${filePath}`);
  return true;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'page.tsx') {
      refactorFile(fullPath);
    }
  }
}

const targetDir = path.join(__dirname, 'frontend', 'src', 'app', 'superadmin');
processDirectory(targetDir);
console.log("Finished refactoring tables!");
