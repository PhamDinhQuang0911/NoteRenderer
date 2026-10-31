const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

console.log('--- Context around 1681302 ---');
console.log(code.substring(1680500, 1682500));
