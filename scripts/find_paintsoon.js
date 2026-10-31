const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 1640000;
while (pos < 1650000) {
    const idx = js.indexOf('paintSoon', pos);
    if (idx === -1 || idx > 1650000) break;
    console.log('--- paintSoon at', idx, '---');
    console.log(js.substring(Math.max(0, idx - 50), Math.min(js.length, idx + 200)));
    pos = idx + 9;
}
