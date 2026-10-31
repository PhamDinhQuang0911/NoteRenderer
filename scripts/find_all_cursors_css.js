const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css', 'utf8');

const r = /cursor:\s*url\([^)]+\)[^;}]*/g;
let m;
while ((m = r.exec(css)) !== null) {
  console.log(m[0]);
  console.log('---');
}
