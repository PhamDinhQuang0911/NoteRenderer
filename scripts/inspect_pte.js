const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = content.indexOf('pte=');
if (idx === -1) idx = content.indexOf('pte =');
console.log('pte def at', idx);
console.log(content.substring(idx - 20, idx + 200));
