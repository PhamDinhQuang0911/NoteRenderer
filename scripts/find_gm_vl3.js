const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const snippet = bundle.slice(2315000, 2335000);
[...snippet.matchAll(/\b(?:const|let|var|,)\s*(?:Vl|Gm|Wa)\s*=\s*/g)].forEach(m => {
  console.log(m[0], 'at', 2315000 + m.index);
});
