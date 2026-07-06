const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.startsWith('generate-') && f.endsWith('.js'));
const map = {};
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const match = content.match(/path:\s*['"]([^/'"]+)/);
  if (match) {
    if (!map[match[1]]) map[match[1]] = [];
    map[match[1]].push(f);
  } else if (content.includes('src/app/(')) {
    const rm = content.match(/src\/app\/\(([^)]+)\)/);
    if (rm) {
      if (!map['(' + rm[1] + ')']) map['(' + rm[1] + ')'] = [];
      map['(' + rm[1] + ')'].push(f);
    }
  }
});
console.log(JSON.stringify(map, null, 2));
