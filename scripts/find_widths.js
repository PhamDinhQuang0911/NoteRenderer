const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

const r = /\[1,2,3|\[2,4,6|\[0\.5|widths|penWidth|penSizes/g;
let m;
while ((m = r.exec(jsStable)) !== null) {
  console.log('Stable widths match:', m[0], 'at', m.index);
  console.log(jsStable.substring(m.index - 30, m.index + 100));
}

while ((m = r.exec(jsVanilla)) !== null) {
  console.log('Vanilla widths match:', m[0], 'at', m.index);
  console.log(jsVanilla.substring(m.index - 30, m.index + 100));
}
