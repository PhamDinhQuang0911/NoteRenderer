const fs = require('fs');
const lms = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/qmath-lms-auth.js', 'utf8');

let pos = 0;
while ((pos = lms.indexOf('qmath-badge-bar', pos)) !== -1) {
  console.log('--- qmath-badge-bar at', pos, '---');
  console.log(lms.substring(pos - 100, pos + 800));
  pos += 15;
}
