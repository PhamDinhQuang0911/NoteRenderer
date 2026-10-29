const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while((idx = content.indexOf(',Gh]=', idx)) !== -1) {
  console.log(',Gh]= at', idx, ':', content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 100)));
  idx += 5;
}
idx = 0;
while((idx = content.indexOf('[L,', idx)) !== -1) {
  console.log('[L, at', idx, ':', content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 100)));
  idx += 3;
}
