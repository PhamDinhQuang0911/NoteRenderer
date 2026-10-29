const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = content.indexOf('const E={pen:()=>bt("pen")');
console.log(content.substring(idx + 2500, idx + 4000));
