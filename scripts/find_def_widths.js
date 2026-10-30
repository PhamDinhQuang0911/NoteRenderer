const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

function findVarDef(js, name) {
  let pos = js.indexOf(name + "=");
  console.log(name, 'at', pos);
  if (pos !== -1) {
    console.log(js.substring(pos - 20, pos + 100));
  }
}

findVarDef(jsStable, 'Zae');
findVarDef(jsVanilla, 'jce');
