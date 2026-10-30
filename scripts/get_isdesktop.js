const fs = require('fs');
const lms = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/qmath-lms-auth.js', 'utf8');

const pos = lms.indexOf('isDesktopOrLocal');
console.log('pos:', pos);
if (pos !== -1) {
  console.log(lms.substring(pos - 100, pos + 400));
}
