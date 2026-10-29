const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while ((idx = bundle.indexOf('pickPdf', idx)) !== -1) {
  console.log('--- pickPdf at ' + idx + ' ---');
  console.log(bundle.slice(Math.max(0, idx - 150), Math.min(bundle.length, idx + 400)));
  idx += 'pickPdf'.length;
}
