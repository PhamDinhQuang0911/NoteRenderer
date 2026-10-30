const fs = require('fs');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

let pos = jsVanilla.indexOf('t.paperImage?');
console.log('t.paperImage? in vanilla at:', pos);
if (pos !== -1) {
  console.log(jsVanilla.substring(pos - 100, pos + 250));
}
