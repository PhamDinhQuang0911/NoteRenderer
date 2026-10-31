const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let idx = 0;
while ((idx = js.indexOf('data-writing', idx)) !== -1) {
    console.log('data-writing at', idx, ':', js.slice(idx - 30, idx + 100));
    idx += 12;
}
if (idx === 0) console.log('data-writing NOT found in JS!');
