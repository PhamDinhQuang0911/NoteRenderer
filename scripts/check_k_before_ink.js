const fs = require('fs');
const jsStable = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');
const jsVanilla = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-CtXdKE8z-vanilla.js', 'utf8');

console.log('=== STABLE k before ink ===');
console.log(jsStable.substring(1570800, 1571300));

console.log('=== VANILLA k before ink ===');
console.log(jsVanilla.substring(1624900, 1625400));
