const fs = require('fs');
const path = require('path');

function deduplicateIcons(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']lucide-react["'];/g;
  
  content = content.replace(importRegex, (match, p1) => {
    // p1 is the list of imports, e.g., " Building2, Plus, Search, Filter, MoreVertical, Edit2, Trash2 , Trash2 "
    const tokens = p1.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const uniqueTokens = [...new Set(tokens)];
    
    if (tokens.length !== uniqueTokens.length) {
      changed = true;
      return `import { ${uniqueTokens.join(', ')} } from "lucide-react";`;
    }
    
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log("Deduplicated imports in:", filePath);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('page.tsx')) {
      deduplicateIcons(fullPath);
    }
  }
}

traverseDir(path.join(__dirname, 'frontend', 'src', 'app', 'superadmin'));
