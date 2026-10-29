const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while ((idx = bundle.indexOf('pointerSeen', idx)) !== -1) {
  console.log('pointerSeen at', idx, ':', bundle.slice(Math.max(0, idx - 50), Math.min(bundle.length, idx + 150)));
  idx += 'pointerSeen'.length;
}
