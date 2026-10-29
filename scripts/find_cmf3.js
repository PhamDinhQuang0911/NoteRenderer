const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const regex = /(?:const|let|var|,)\s*\$c\s*=[^,;)]+/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log('Decl of $c:', m[0], 'at', m.index);
}
const regex2 = /(?:const|let|var|,)\s*Mf\s*=[^,;)]+/g;
while ((m = regex2.exec(bundle)) !== null) {
  console.log('Decl of Mf:', m[0], 'at', m.index);
}
