const fs = require('fs');
const lms = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/qmath-lms-auth.js', 'utf8');

const r = /__NR_|waitForNoteRendererReady|openSaveModal/g;
let m;
while ((m = r.exec(lms)) !== null) {
  console.log('Found', m[0], 'at', m.index);
  console.log(lms.substring(Math.max(0, m.index - 50), Math.min(lms.length, m.index + 150)));
  console.log('---');
}
