const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let m;
const reg1 = /(?:function\s+Gm|const\s+Gm\s*=|let\s+Gm\s*=)/g;
while ((m = reg1.exec(bundle)) !== null) console.log('Gm at', m.index, ':', bundle.slice(m.index, m.index + 200));

const reg2 = /(?:function\s+Vl|const\s+Vl\s*=|let\s+Vl\s*=)/g;
while ((m = reg2.exec(bundle)) !== null) console.log('Vl at', m.index, ':', bundle.slice(m.index, m.index + 200));
