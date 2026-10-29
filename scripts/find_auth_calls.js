const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/qmath-lms-auth.js', 'utf8');

let idx = 0;
while ((idx = content.indexOf('authenticate(', idx)) !== -1) {
  console.log('Call at', idx, ':', content.slice(Math.max(0, idx - 60), Math.min(content.length, idx + 120)));
  idx += 13;
}
