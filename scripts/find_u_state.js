const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 2430000;
while (pos < 2435000) {
    const idx = code.indexOf(',U,', pos);
    const idx2 = code.indexOf('[U,', pos);
    const found = idx !== -1 ? (idx2 !== -1 ? Math.min(idx, idx2) : idx) : idx2;
    if (found === -1 || found > 2435000) break;
    console.log('--- U at', found, '---');
    console.log(code.substring(Math.max(0, found - 30), Math.min(code.length, found + 80)));
    pos = found + 3;
}
