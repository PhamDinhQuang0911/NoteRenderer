const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const regex = /(?:const|let|var|,)\s*(?:Vl|Gm|Wa)\s*=\s*[^,;()]+/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log(m[0], 'at', m.index);
}
