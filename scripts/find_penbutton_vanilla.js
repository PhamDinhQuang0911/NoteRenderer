const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('penButton', pos)) !== -1) {
  const snip = js.substring(Math.max(0, pos - 80), Math.min(js.length, pos + 180));
  console.log('pos', pos, ':', snip);
  console.log('---');
  pos += 9;
}
