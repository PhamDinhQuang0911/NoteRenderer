const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = 0;
while ((idx = bundle.indexOf('trailFrom(', idx)) !== -1) {
  console.log('[Pos ' + idx + ']: ' + bundle.slice(idx - 50, idx + 400));
  idx += 10;
}
idx = 0;
while ((idx = bundle.indexOf('paintWet(', idx)) !== -1) {
  console.log('[Pos ' + idx + ']: ' + bundle.slice(idx - 50, idx + 400));
  idx += 9;
}
