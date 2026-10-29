const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while ((idx = bundle.indexOf('OX(', idx)) !== -1) {
  console.log('--- OX at ' + idx + ' ---');
  console.log(bundle.slice(Math.max(0, idx - 100), Math.min(bundle.length, idx + 300)));
  idx += 'OX('.length;
}
