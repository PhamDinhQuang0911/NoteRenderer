const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/qmath-lms-auth.js', 'utf8');

function showAround(pattern) {
  let m = pattern.exec(content);
  if (m) {
    console.log(content.slice(m.index, m.index + 2000));
  } else {
    console.log('Not found:', pattern);
  }
}

console.log('=== openSaveToClassModal ===');
showAround(/function\s+openSaveToClassModal\b/);
