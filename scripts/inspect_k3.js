const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = content.indexOf('k3=');
if (idx === -1) idx = content.indexOf('k3 =');
console.log('k3 def at', idx);
console.log(content.substring(idx - 40, idx + 200));
