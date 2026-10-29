const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const regex = /(?:const|let|var|function)\s*sr\b|sr\s*=\s*/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log('sr at', m.index, ':', bundle.slice(m.index - 50, m.index + 200));
}

const regex2 = /(?:const|let|var|function)\s*Bl\b|Bl\s*=\s*/g;
while ((m = regex2.exec(bundle)) !== null) {
  console.log('Bl at', m.index, ':', bundle.slice(m.index - 50, m.index + 200));
}
