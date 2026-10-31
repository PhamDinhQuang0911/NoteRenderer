const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let idx = 0;
while ((idx = js.indexOf('penButton', idx)) !== -1) {
  console.log(js.slice(Math.max(0, idx - 40), Math.min(js.length, idx + 80)));
  console.log('---');
  idx += 9;
}
