const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const regex = /(?:const|let|var|function)\s*SL\b|SL\s*=\s*/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log('SL at', m.index, ':', bundle.slice(m.index - 50, m.index + 250));
}

const regex2 = /(?:const|let|var|function)\s*wt\b|wt\s*=\s*/g;
while ((m = regex2.exec(bundle)) !== null) {
  console.log('wt at', m.index, ':', bundle.slice(m.index - 50, m.index + 250));
}
