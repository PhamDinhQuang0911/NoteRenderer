const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = bundle.indexOf('paintWet(){');
console.log(bundle.slice(idx, idx + 1200));
