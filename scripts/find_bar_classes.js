const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 2465000;
while (pos < 2510000) {
    const idx = js.indexOf('className:', pos);
    if (idx === -1 || idx > 2510000) break;
    const sub = js.substring(idx, idx + 80);
    if (sub.includes('tb-') || sub.includes('tools') || sub.includes('actions') || sub.includes('bar')) {
        console.log('--- className at', idx, '---');
        console.log(sub);
    }
    pos = idx + 10;
}
