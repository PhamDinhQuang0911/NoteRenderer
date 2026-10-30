const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

function findFuncDef(js, name) {
  let pos = js.indexOf('function ' + name + '(');
  if (pos !== -1) {
    console.log('function ' + name + ' at', pos);
    console.log(js.substring(pos, pos + 400));
    console.log('---');
  } else {
    // maybe const name =
    pos = js.indexOf(name + '=');
    if (pos !== -1) {
      console.log(name + '= at', pos);
      console.log(js.substring(pos, pos + 400));
      console.log('---');
    }
  }
}

console.log('=== STABLE jG ===');
findFuncDef(jsStable, 'jG');

console.log('=== VANILLA BU ===');
findFuncDef(jsVanilla, 'BU');
