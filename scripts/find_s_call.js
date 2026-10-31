const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 1948000;
while (true) {
    const idx = code.indexOf('S(', pos);
    if (idx === -1 || idx > 1952000) break;
    console.log('--- S( match at', idx, '---');
    console.log(code.substring(Math.max(0, idx - 40), Math.min(code.length, idx + 200)));
    pos = idx + 2;
}
