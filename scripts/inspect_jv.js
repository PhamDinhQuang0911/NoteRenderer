const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = content.indexOf('function Jv(');
if (idx === -1) idx = content.indexOf('Jv=');
console.log('Jv def at', idx);
console.log(content.substring(idx - 20, idx + 1500));
