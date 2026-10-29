const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = 0;
while((idx = content.indexOf('className:"tb-', idx)) !== -1) {
  console.log('tb- at', idx, ':', content.substring(idx, Math.min(content.length, idx + 50)));
  idx += 14;
}
