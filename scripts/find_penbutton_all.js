const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('penButton', pos)) !== -1) {
  const snip = js.substring(Math.max(0, pos - 100), Math.min(js.length, pos + 250));
  console.log('pos', pos, ':', snip);
  console.log('---');
  pos += 9;
}
