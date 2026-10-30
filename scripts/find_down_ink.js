const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

function findDownInk(js, tag) {
  let pos = js.indexOf('{k:"ink"');
  console.log(tag, '{k:"ink" at', pos);
  if (pos !== -1) {
    console.log(js.substring(pos - 100, pos + 500));
  }
}

findDownInk(jsStable, 'STABLE');
findDownInk(jsVanilla, 'VANILLA');
