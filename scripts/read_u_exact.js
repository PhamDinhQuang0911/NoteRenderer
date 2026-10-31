const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const idx = code.indexOf('j.spaceFull=U===');
console.log(code.substring(idx - 400, idx + 100));
