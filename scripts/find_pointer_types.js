const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

// Let's search all occurrences of pointerType
let idx = 0;
while ((idx = js.indexOf('pointerType', idx)) !== -1) {
  console.log(js.slice(Math.max(0, idx - 40), Math.min(js.length, idx + 80)));
  console.log('---');
  idx += 11;
}
