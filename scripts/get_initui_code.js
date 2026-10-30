const fs = require('fs');
const lms = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/qmath-lms-auth.js', 'utf8');

const uiStart = lms.indexOf('function initUI()');
console.log('uiStart:', uiStart);
if (uiStart !== -1) {
  console.log(lms.substring(uiStart, uiStart + 2500));
}
