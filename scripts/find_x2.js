const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const regex = /(?:const|let|var)\s*\[\s*\w+\s*,\s*x2\s*\]/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log('Decl of x2:', m[0], 'at', m.index);
}

// Let's also search what uses x2
let idx = 0;
while ((idx = bundle.indexOf('x2(', idx)) !== -1) {
  console.log('x2( at', idx, ':', bundle.slice(idx - 50, idx + 100));
  idx += 3;
}
