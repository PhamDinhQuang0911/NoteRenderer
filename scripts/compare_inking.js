const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

// Let's find getStroke or outline calculation
// In perfect-freehand / stroke libraries:
const r = /getStroke|size:|thinning|streamline|smoothing/g;
console.log('Matches in stable:');
let m;
while ((m = r.exec(jsStable)) !== null) {
  console.log('stable', m[0], 'at', m.index, jsStable.substring(m.index - 50, m.index + 100));
}

console.log('Matches in vanilla:');
while ((m = r.exec(jsVanilla)) !== null) {
  console.log('vanilla', m[0], 'at', m.index, jsVanilla.substring(m.index - 50, m.index + 100));
}
