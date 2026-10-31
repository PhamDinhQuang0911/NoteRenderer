const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

console.log('--- Context of pushWithin before insertSpace ---');
console.log(code.substring(1604500, 1606300));
