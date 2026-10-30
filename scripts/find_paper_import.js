const fs = require('fs');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

const pos = jsVanilla.indexOf('ac=async xe=>{');
console.log('ac=async at:', pos);
if (pos !== -1) {
  console.log(jsVanilla.substring(pos, pos + 800));
}
