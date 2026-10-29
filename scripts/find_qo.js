const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while ((idx = bundle.indexOf('Qo()', idx)) !== -1) {
  console.log('Qo() at', idx, ':', bundle.slice(idx - 60, idx + 150));
  idx += 4;
}
