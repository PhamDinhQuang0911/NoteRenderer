const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const idx = code.indexOf('j.spaceFull=U===');
const sub = code.substring(idx - 4000, idx);
const m = sub.match(/\[U,\s*W\][^;]+;/);
console.log('Match for [U, W]:', m ? m[0] : 'not found');
if (m) {
    const p = sub.indexOf(m[0]);
    console.log(sub.substring(p - 50, p + 100));
}
