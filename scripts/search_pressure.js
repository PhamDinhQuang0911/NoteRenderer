const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while((idx = content.indexOf('pressure', idx)) !== -1) {
  console.log('pressure at', idx, ':', content.substring(Math.max(0, idx - 60), Math.min(content.length, idx + 120)));
  idx += 8;
}
