const fs = require('fs');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

// Find _te in vanilla
let pos = jsVanilla.indexOf('async function _te');
if (pos === -1) pos = jsVanilla.indexOf('_te(');
console.log('_te in vanilla at:', pos);
if (pos !== -1) {
  console.log(jsVanilla.substring(pos, pos + 1000));
}

// Also find insertPages in vanilla
pos = jsVanilla.indexOf('insertPages(');
console.log('insertPages in vanilla at:', pos);
if (pos !== -1) {
  console.log(jsVanilla.substring(pos, pos + 1000));
}

// Find paperImage in vanilla
pos = jsVanilla.indexOf('paperImage');
while (pos !== -1) {
  console.log('paperImage at', pos, ':', jsVanilla.substring(pos - 40, pos + 150));
  pos = jsVanilla.indexOf('paperImage', pos + 10);
}
