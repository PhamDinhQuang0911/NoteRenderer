const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

function findMethods(js, tag) {
  for (const name of ['drawWet', 'drawStroke', 'wetStroke', 'paintWet', 'paintPenTip']) {
    let pos = js.indexOf(name + '(');
    if (pos === -1) pos = js.indexOf(name + ':');
    console.log(tag, name, 'at', pos);
    if (pos !== -1) {
      console.log(js.substring(pos, pos + 350));
      console.log('---');
    }
  }
}

findMethods(jsStable, 'STABLE');
findMethods(jsVanilla, 'VANILLA');
