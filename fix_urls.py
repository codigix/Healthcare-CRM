#!/usr/bin/env python3
import re
import os

files_to_fix = [
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
]

for file_path in files_to_fix:
    file_path_fixed = file_path.replace('/', '\\')
    if not os.path.exists(file_path_fixed):
        print(f"✗ File not found: {file_path}")
        continue
    
    with open(file_path_fixed, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Add API_URL constant if not present
    if "const API_URL = process.env.NEXT_PUBLIC_API_URL" not in content:
        # Find the import section
        lines = content.split('\n')
        insert_pos = 0
        for i, line in enumerate(lines):
            if line.startswith('import '):
                insert_pos = i + 1
        
        if insert_pos > 0:
            lines.insert(insert_pos, '')
            lines.insert(insert_pos + 1, "const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';")
            content = '\n'.join(lines)
    
    # Replace single-quoted URLs
    content = re.sub(r"fetch\('http://localhost:5000/api", "fetch(`${API_URL}", content)
    # Replace double-quoted URLs
    content = re.sub(r'fetch\("http://localhost:5000/api', 'fetch(`${API_URL}', content)
    # Replace template literal URLs
    content = re.sub(r'fetch\(`http://localhost:5000/api', 'fetch(`${API_URL}', content)
    
    # Fix closing quotes
    content = re.sub(r"(\$\{API_URL\}[^`]*?)['\"](\s*[,\);\n}])", r"`\1`\2", content)
    
    if content != original:
        with open(file_path_fixed, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Fixed: {os.path.basename(os.path.dirname(file_path))}")

print("\n✅ URL replacement complete!")
