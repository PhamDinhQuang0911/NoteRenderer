const fs = require('fs');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

let pos = 0;
while ((pos = jsVanilla.indexOf('addPapers:', pos)) !== -1) {
  console.log('addPapers: at', pos);
  console.log(jsVanilla.substring(pos - 50, pos + 250));
  pos += 10;
}
