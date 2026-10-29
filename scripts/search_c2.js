const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = 0;
while((idx = content.indexOf('c2(', idx)) !== -1) {
  console.log('c2( at', idx, ':', content.substring(Math.max(0, idx - 60), Math.min(content.length, idx + 80)));
  idx += 4;
}
let idx2 = 0;
while((idx2 = content.indexOf(',c2]', idx2)) !== -1) {
  console.log(',c2] at', idx2, ':', content.substring(Math.max(0, idx2 - 60), Math.min(content.length, idx2 + 80)));
  idx2 += 4;
}
