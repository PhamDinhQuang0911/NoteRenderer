const fs = require('fs');
const glob = require('path');
const cssPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets';
for (const f of fs.readdirSync(cssPath)) {
    if (f.endsWith('.css')) {
        const content = fs.readFileSync(cssPath + '/' + f, 'utf8');
        const idx = content.indexOf('tablet-cursor');
        if (idx !== -1) {
            console.log('Found in', f, 'at', idx);
            console.log(content.substring(Math.max(0, idx - 50), Math.min(content.length, idx + 200)));
        }
    }
}
