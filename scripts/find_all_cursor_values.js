const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css', 'utf8');

const r = /cursor\s*:\s*([^;!}]+)/gi;
let m;
const cursors = new Set();
while ((m = r.exec(css)) !== null) {
  cursors.add(m[1].trim());
}
console.log('All cursor values in CSS:');
for (const c of cursors) {
  if (c.includes('url')) console.log('url(...)');
  else console.log(c);
}
