const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

console.log('--- Context of iF before 1396446 ---');
console.log(code.substring(1394500, 1396500));
