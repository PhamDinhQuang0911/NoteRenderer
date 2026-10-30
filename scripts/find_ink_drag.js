const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

function findInkDrag(js, tag) {
  let pos = js.indexOf('case"ink":');
  console.log(tag, 'case"ink": at', pos);
  if (pos !== -1) {
    console.log(js.substring(pos, pos + 1000));
  }
}

findInkDrag(jsStable, 'STABLE');
findInkDrag(jsVanilla, 'VANILLA');
