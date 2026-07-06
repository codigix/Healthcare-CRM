const fs = require('fs');
const path = require('path');

function fixIcons(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('<Edit2') && !content.includes('Edit2,')) {
    // try to add Edit2 to lucide-react import
    if (content.includes('} from "lucide-react";')) {
      content = content.replace('} from "lucide-react";', ', Edit2 } from "lucide-react";');
      changed = true;
    }
  }

  if (content.includes('<Trash2') && !content.includes('Trash2,')) {
    // try to add Trash2 to lucide-react import
    if (content.includes('} from "lucide-react";')) {
      content = content.replace('} from "lucide-react";', ', Trash2 } from "lucide-react";');
      changed = true;
    }
  }
  
  if (content.includes('<Search') && !content.includes('Search,')) {
    if (content.includes('} from "lucide-react";')) {
      content = content.replace('} from "lucide-react";', ', Search } from "lucide-react";');
      changed = true;
    }
  }
  
  // also handle when they are missing completely but used
  const icons = ['Edit2', 'Trash2', 'Search'];
  icons.forEach(icon => {
    // a more robust regex to check if it's imported
    const importRegex = new RegExp(`import\\s+\\{[^}]*\\b${icon}\\b[^}]*\\}\\s+from\\s+['"]lucide-react['"]`);
    if (content.includes(`<${icon}`) && !importRegex.test(content)) {
      if (content.includes('} from "lucide-react";')) {
        content = content.replace('} from "lucide-react";', `, ${icon} } from "lucide-react";`);
        changed = true;
      } else {
        content = content.replace('"use client";', `"use client";\nimport { ${icon} } from "lucide-react";`);
        changed = true;
      }
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log("Fixed icons in:", filePath);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('page.tsx')) {
      fixIcons(fullPath);
    }
  }
}

traverseDir(path.join(__dirname, 'frontend', 'src', 'app', 'superadmin'));
