const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

function findDef(js, name) {
  let pos = js.indexOf(name);
  while (pos !== -1) {
    if (js[pos - 1] === '.' || js[pos - 1] === ' ') {
      // not a declaration
    } else {
      console.log('Found', name, 'at', pos);
      console.log(js.substring(pos, pos + 400));
      console.log('---');
    }
    pos = js.indexOf(name, pos + 1);
  }
}

console.log('=== STABLE drawWet ===');
findDef(jsStable, 'drawWet(');

console.log('=== VANILLA drawWet ===');
findDef(jsVanilla, 'drawWet(');
