const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while (true) {
    const idx = js.indexOf('showPointer(', pos);
    if (idx === -1) break;
    console.log('showPointer( at', idx, ':', js.substring(Math.max(0, idx - 30), Math.min(js.length, idx + 60)));
    pos = idx + 12;
}
