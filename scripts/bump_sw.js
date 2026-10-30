const fs = require('fs');
const swPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/sw.js';
let sw = fs.readFileSync(swPath, 'utf8');
console.log('sw.js snippet:', sw.substring(0, 150));
// Bump cache version if present
sw = sw.replace(/const CACHE_NAME\s*=\s*['"]([^'"]+)['"]/, (m, v) => {
  const next = 'nr-cache-v070-ultimate-' + Date.now().toString(36);
  console.log('Bumping cache name from', v, 'to', next);
  return `const CACHE_NAME = "${next}"`;
});
fs.writeFileSync(swPath, sw, 'utf8');
