const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('nr-fullscreen', pos)) !== -1) {
  console.log('--- At', pos, '---');
  console.log(js.substring(pos - 200, pos + 800));
  pos += 15;
}
