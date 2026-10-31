const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while (true) {
    const idx = js.indexOf('writeCursor', pos);
    if (idx === -1) break;
    console.log('writeCursor at', idx, ':', js.substring(Math.max(0, idx - 40), Math.min(js.length, idx + 80)));
    pos = idx + 11;
}

pos = 0;
while (true) {
    const idx = js.indexOf('data-writing', pos);
    if (idx === -1) break;
    console.log('data-writing at', idx, ':', js.substring(Math.max(0, idx - 40), Math.min(js.length, idx + 80)));
    pos = idx + 12;
}
