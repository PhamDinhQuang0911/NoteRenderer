const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

console.log('--- Context of M1 around 1679500 ---');
console.log(code.substring(1679200, 1680400));
