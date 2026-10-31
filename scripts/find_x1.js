const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while (true) {
    const idx = code.indexOf('X1', pos);
    if (idx === -1) break;
    const before = code[idx - 1];
    const after = code[idx + 2];
    if (!/[a-zA-Z0-9_$]/.test(before) && !/[a-zA-Z0-9_$]/.test(after)) {
        console.log('--- match X1 at', idx, '---');
        console.log(code.substring(Math.max(0, idx - 80), Math.min(code.length, idx + 120)));
    }
    pos = idx + 2;
}
