const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 2432000;
while (true) {
    const idx = code.indexOf('spaceFlow', pos);
    if (idx === -1 || idx > 2445000) break;
    console.log('--- spaceFlow match at', idx, '---');
    console.log(code.substring(Math.max(0, idx - 80), Math.min(code.length, idx + 100)));
    pos = idx + 9;
}
