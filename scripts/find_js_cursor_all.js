const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while (true) {
    const idx = js.indexOf('cursor', pos);
    if (idx === -1) break;
    const sub = js.substring(Math.max(0, idx - 20), Math.min(js.length, idx + 80));
    if (sub.includes('style.cursor') || sub.includes('cursor=') || sub.includes('dataset.cursor') || sub.includes('board-cursor')) {
        console.log('JS at', idx, ':', sub);
    }
    pos = idx + 6;
}
