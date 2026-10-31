const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while (true) {
    const idx = code.indexOf('spaceSizes:', pos);
    if (idx === -1) break;
    console.log('--- match at', idx, '---');
    console.log(code.substring(Math.max(0, idx - 40), Math.min(code.length, idx + 250)));
    pos = idx + 11;
}
