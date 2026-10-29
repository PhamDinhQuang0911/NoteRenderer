const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const regex = /(?:function\s+Na|const\s+Na\s*=|let\s+Na\s*=|var\s+Na\s*=)/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log('Match at', m.index, ':', bundle.slice(m.index, m.index + 200));
}
