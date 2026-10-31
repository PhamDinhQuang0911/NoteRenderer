const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while (true) {
    const idx = js.indexOf('scratchErase', pos);
    if (idx === -1) break;
    console.log('--- scratchErase at', idx, '---');
    console.log(js.substring(Math.max(0, idx - 60), Math.min(js.length, idx + 140)));
    pos = idx + 12;
}
