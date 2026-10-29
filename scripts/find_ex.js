const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while ((idx = bundle.indexOf('ex(', idx)) !== -1) {
  console.log('ex( at', idx, ':', bundle.slice(idx - 50, idx + 200));
  idx += 3;
}
