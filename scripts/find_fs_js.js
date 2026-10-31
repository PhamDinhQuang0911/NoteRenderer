const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while (true) {
    const idx = js.indexOf('nr-fullscreen', pos);
    if (idx === -1) break;
    console.log('--- nr-fullscreen in JS at', idx, '---');
    console.log(js.substring(Math.max(0, idx - 100), Math.min(js.length, idx + 200)));
    pos = idx + 13;
}
