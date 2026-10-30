const fs = require('fs');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

console.log('--- paperImage in vanilla at 1394000 ---');
console.log(jsVanilla.substring(1393900, 1394400));
