const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while (true) {
    const idx = js.indexOf('xJ=', pos);
    if (idx === -1) break;
    console.log('xJ= at', idx, ':', js.substring(Math.max(0, idx - 20), Math.min(js.length, idx + 40)));
    pos = idx + 3;
}
