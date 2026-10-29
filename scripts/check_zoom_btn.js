const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = content.indexOf('tb-zoom-step-btn');
console.log(content.substring(idx - 60, idx + 400));
