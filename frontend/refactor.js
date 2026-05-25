const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.tsx' && fullPath.includes('app') && !fullPath.includes('login') && fullPath !== path.join(__dirname, 'src/app/page.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/import\s+DashboardLayout\s+from\s+['"].*?DashboardLayout['"];?\n?/, '');
      content = content.replace(/<DashboardLayout[^>]*>/, '<>');
      content = content.replace(/<\/DashboardLayout>/, '</>');
      
      fs.writeFileSync(fullPath, content);
      console.log('Updated: ' + fullPath);
    }
  }
}

processDir(path.join(process.cwd(), 'src/app'));
