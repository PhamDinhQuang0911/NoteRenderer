const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while((idx = content.indexOf('highlightWidth', idx)) !== -1) {
  console.log('at', idx, ':', content.substring(idx - 30, idx + 150));
  idx += 14;
}
