const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while ((idx = bundle.indexOf('__NR_API', idx)) !== -1) {
  console.log('__NR_API at', idx, ':', bundle.slice(Math.max(0, idx - 60), Math.min(bundle.length, idx + 400)));
  idx += '__NR_API'.length;
}
