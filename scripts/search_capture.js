const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = 0;
while((idx = content.indexOf('this.capture(', idx)) !== -1) {
  console.log('capture at', idx, ':', content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 80)));
  idx += 13;
}
idx = 0;
while((idx = content.indexOf('setPointerCapture', idx)) !== -1) {
  console.log('setPointerCapture at', idx, ':', content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 80)));
  idx += 17;
}
