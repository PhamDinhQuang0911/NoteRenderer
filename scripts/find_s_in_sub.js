const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const idx = code.indexOf('onSave:S,onClose:T');
const sub = code.substring(idx, idx + 18000);
let p = 0;
while (true) {
    const i = sub.indexOf('S(', p);
    if (i === -1) break;
    console.log('--- S( at', i, '---');
    console.log(sub.substring(Math.max(0, i - 40), Math.min(sub.length, i + 150)));
    p = i + 2;
}
