const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');
const jsCurrent = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

function findSnippet(js, needle) {
  let pos = js.indexOf(needle);
  if (pos === -1) return 'NOT FOUND';
  return js.substring(pos, pos + 300);
}

console.log('--- Stable pressureOf ---');
console.log(findSnippet(jsStable, 'pressureOf('));

console.log('--- Vanilla pressureOf ---');
console.log(findSnippet(jsVanilla, 'pressureOf('));

console.log('--- Current pressureOf ---');
console.log(findSnippet(jsCurrent, 'pressureOf('));
