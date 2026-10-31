const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const idx = code.indexOf('["drag","full","flow"]');
console.log(code.substring(idx - 250, idx + 250));
