const fs = require('fs');
let js = fs.readFileSync('C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-v0.7.0-Backup-PrePolish/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while (true) {
    const idx = js.indexOf('uniform', pos);
    if (idx === -1) break;
    console.log('uniform at', idx, ':', js.substring(Math.max(0, idx - 40), Math.min(js.length, idx + 80)));
    pos = idx + 7;
}
