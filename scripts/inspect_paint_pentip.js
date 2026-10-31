const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

console.log('--- Context of paintPenTip around 1543800 ---');
console.log(code.substring(1543500, 1545500));
