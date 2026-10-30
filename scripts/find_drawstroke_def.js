const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

function findFuncDef(js, name) {
  let pos = js.indexOf('function ' + name + '(');
  if (pos !== -1) {
    console.log('function ' + name + ' at', pos);
    console.log(js.substring(pos, pos + 800));
    console.log('---');
  }
}

console.log('=== STABLE ei ===');
findFuncDef(jsStable, 'ei');

console.log('=== VANILLA yi ===');
findFuncDef(jsVanilla, 'yi');
