const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 2432000;
while (true) {
    const idx = code.indexOf('c.space', pos);
    if (idx === -1 || idx > 2445000) break;
    console.log('--- c.space match at', idx, '---');
    console.log(code.substring(Math.max(0, idx - 40), Math.min(code.length, idx + 150)));
    pos = idx + 7;
}
