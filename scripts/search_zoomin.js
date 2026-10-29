const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = 0;
while((idx = content.indexOf('zoomIn', idx)) !== -1) {
  console.log('Found zoomIn at', idx, ':', content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 80)));
  idx += 6;
}
