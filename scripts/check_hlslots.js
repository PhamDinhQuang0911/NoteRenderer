const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = content.indexOf('highlightWidth');
console.log(content.substring(idx - 20, idx + 250));
