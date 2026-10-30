const fs = require('fs');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

const pos = jsVanilla.indexOf('gl=async j=>{');
console.log('gl at:', pos);
console.log(jsVanilla.substring(pos, pos + 1000));
