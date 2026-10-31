const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 1626000;
while (pos < 1631000) {
    const idx = js.indexOf('k:"ink"', pos);
    if (idx === -1 || idx > 1631000) break;
    console.log('--- k:"ink" at', idx, '---');
    console.log(js.substring(Math.max(0, idx - 50), Math.min(js.length, idx + 250)));
    pos = idx + 7;
}
