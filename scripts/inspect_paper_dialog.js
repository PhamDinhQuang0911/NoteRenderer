const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

function inspectArea(pos, lengthBefore = 1000, lengthAfter = 1000) {
  const start = Math.max(0, pos - lengthBefore);
  const end = Math.min(bundle.length, pos + lengthAfter);
  return bundle.slice(start, end);
}

console.log('=== Around za and paper dialog ===');
console.log(inspectArea(1848514, 1500, 1500));
