const fs = require('fs');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

let pos = jsVanilla.indexOf('gl=');
while (pos !== -1) {
  console.log('gl= at', pos);
  console.log(jsVanilla.substring(pos - 30, pos + 250));
  pos = jsVanilla.indexOf('gl=', pos + 3);
}
