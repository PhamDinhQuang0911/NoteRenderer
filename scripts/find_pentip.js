const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while ((idx = bundle.indexOf('penTip', idx)) !== -1) {
  console.log('penTip at', idx, ':', bundle.slice(Math.max(0, idx - 100), Math.min(bundle.length, idx + 250)));
  idx += 'penTip'.length;
}
