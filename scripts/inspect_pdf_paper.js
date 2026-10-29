const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

function inspectArea(pos, lengthBefore = 200, lengthAfter = 800) {
  const start = Math.max(0, pos - lengthBefore);
  const end = Math.min(bundle.length, pos + lengthAfter);
  return bundle.slice(start, end);
}

console.log('=== II(e) area around pos 1304904 ===');
console.log(inspectArea(1304904, 100, 1200));

console.log('\n=== paperFromPdf occurrences in code ===');
let idx = 0;
while ((idx = bundle.indexOf('paperFromPdf', idx)) !== -1) {
  console.log(`--- Match at ${idx} ---`);
  console.log(inspectArea(idx, 200, 800));
  idx += 'paperFromPdf'.length;
}
