const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const regex = /(?:const|let|var|,)\s*Wa\s*=\s*(?:async\s*)?\(/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log(m[0], 'at', m.index);
}
const regex2 = /(?:const|let|var|,)\s*Vl\s*=\s*(?:async\s*)?\(/g;
while ((m = regex2.exec(bundle)) !== null) {
  console.log(m[0], 'at', m.index);
}
const regex3 = /(?:const|let|var|,)\s*Gm\s*=\s*(?:async\s*)?\(/g;
while ((m = regex3.exec(bundle)) !== null) {
  console.log(m[0], 'at', m.index);
}
