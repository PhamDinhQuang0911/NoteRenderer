const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while ((idx = bundle.indexOf('__NR_OPEN_DOC', idx)) !== -1) {
  console.log('__NR_OPEN_DOC at', idx, ':', bundle.slice(Math.max(0, idx - 100), Math.min(bundle.length, idx + 300)));
  idx += '__NR_OPEN_DOC'.length;
}
