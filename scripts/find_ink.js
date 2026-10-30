const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = 0;
while ((idx = bundle.indexOf('case"ink":', idx)) !== -1) {
  console.log('[Pos ' + idx + ']: ' + bundle.slice(idx, idx + 500));
  idx += 9;
}
