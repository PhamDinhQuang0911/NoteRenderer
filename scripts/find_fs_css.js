const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css', 'utf8');

let pos = 0;
while (true) {
    const idx = css.indexOf('nr-fullscreen', pos);
    if (idx === -1) break;
    console.log('--- nr-fullscreen in CSS at', idx, '---');
    console.log(css.substring(Math.max(0, idx - 100), Math.min(css.length, idx + 300)));
    pos = idx + 13;
}
