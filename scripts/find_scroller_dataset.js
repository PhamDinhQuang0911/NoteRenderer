const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while (true) {
    const idx = js.indexOf('scroller.dataset', pos);
    if (idx === -1) break;
    console.log('scroller.dataset at', idx, ':', js.substring(Math.max(0, idx - 20), Math.min(js.length, idx + 100)));
    pos = idx + 16;
}
