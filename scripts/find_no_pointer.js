const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while (true) {
    const idx = js.indexOf('no-pointer', pos);
    if (idx === -1) break;
    console.log('no-pointer at', idx, ':', js.substring(Math.max(0, idx - 40), Math.min(js.length, idx + 80)));
    pos = idx + 10;
}
