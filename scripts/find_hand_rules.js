const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css', 'utf8');

const r = /([^{};]+)\{[^}]*cursor\s*:\s*(pointer|grab|grabbing)[^}]*\}/gi;
let m;
while ((m = r.exec(css)) !== null) {
  console.log(m[1].trim(), '-->', m[2]);
}
