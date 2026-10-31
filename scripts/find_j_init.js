const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const idx = code.indexOf('["drag","full","flow"]');
const sub = code.substring(idx - 1000, idx);
const m = sub.match(/\[J,\s*ue\][^;]+;/);
console.log('Match for [J, ue]:', m ? m[0] : 'not found');
if (!m) console.log(sub.substring(sub.length - 400));
