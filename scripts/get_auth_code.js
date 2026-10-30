const fs = require('fs');
const lms = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/qmath-lms-auth.js', 'utf8');

const authStart = lms.indexOf('async function authenticate()');
console.log('authStart:', authStart);
if (authStart !== -1) {
  console.log(lms.substring(authStart, authStart + 1200));
}
