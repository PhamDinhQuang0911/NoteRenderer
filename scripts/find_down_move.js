const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

function findDownMove(js, tag) {
  // Find down(t)
  const dPos = js.indexOf('down(t){');
  console.log(tag, 'down(t) at', dPos);
  if (dPos !== -1) {
    console.log(js.substring(dPos, dPos + 600));
  }
  // Find move(t)
  const mPos = js.indexOf('move(t){');
  console.log(tag, 'move(t) at', mPos);
  if (mPos !== -1) {
    console.log(js.substring(mPos, mPos + 1000));
  }
}

findDownMove(jsStable, 'STABLE');
findDownMove(jsVanilla, 'VANILLA');
