const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const regex = /(?:const|let|var|function)\s*NN\b|NN\s*=\s*/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log('NN at', m.index, ':', bundle.slice(m.index - 50, m.index + 250));
}
