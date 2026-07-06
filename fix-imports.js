const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('<DataTable')) {
    // 1. Fix DataTable import
    if (!content.includes('import DataTable')) {
      if (content.includes('import Link from "next/link";')) {
         content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport DataTable from "@/components/UI/DataTable";');
      } else if (content.includes('} from "lucide-react";')) {
         content = content.replace('} from "lucide-react";', '} from "lucide-react";\nimport DataTable from "@/components/UI/DataTable";');
      } else {
         content = content.replace('"use client";', '"use client";\nimport DataTable from "@/components/UI/DataTable";');
      }
      changed = true;
    }

    // 2. Fix searchTerm state
    if (!content.includes('const [searchTerm')) {
      content = content.replace(/export default function [^{]+\{/, '$&\n  const [searchTerm, setSearchTerm] = useState("");');
      changed = true;

      // Ensure useState import exists
      if (!content.includes('useState')) {
        content = content.replace('"use client";', '"use client";\nimport { useState } from "react";');
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log("Fixed:", filePath);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('page.tsx')) {
      fixFile(fullPath);
    }
  }
}

traverseDir(path.join(__dirname, 'frontend', 'src', 'app', 'superadmin'));
