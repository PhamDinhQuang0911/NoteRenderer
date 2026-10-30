const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

let pos = js.indexOf('className:"tb-group actions"');
if (pos === -1) pos = js.indexOf('"tb-group actions"');
console.log('tb-group actions at:', pos);
if (pos !== -1) {
  console.log(js.substring(pos - 60, pos + 1200));
}
