const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = content.indexOf('function wt(');
if (idx === -1) idx = content.indexOf('wt=');
console.log('wt def:', content.substring(idx - 20, idx + 200));
