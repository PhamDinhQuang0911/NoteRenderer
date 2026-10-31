const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css', 'utf8');

console.log('--- CSS cursor occurrences ---');
let pos = 0;
while (true) {
    const idx = css.indexOf('cursor', pos);
    if (idx === -1) break;
    const sub = css.substring(Math.max(0, idx - 20), Math.min(css.length, idx + 80));
    if (sub.includes('board') || sub.includes('pen') || sub.includes('tablet') || sub.includes('none') || sub.includes('canvas')) {
        console.log('CSS at', idx, ':', sub);
    }
    pos = idx + 6;
}
