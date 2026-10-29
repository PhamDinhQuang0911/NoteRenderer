const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = content.indexOf('function qO(');
if (idx === -1) idx = content.indexOf('qO=');
console.log('qO def:', content.substring(idx - 20, idx + 300));
