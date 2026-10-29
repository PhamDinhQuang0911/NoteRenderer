const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = content.indexOf('const Ne=D===le&&Gt("highlighter");W(le),Gh(se,le)');
console.log(content.substring(idx - 1500, idx));
