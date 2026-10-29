const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const snippet = bundle.slice(2330000, 2337000);
const m1 = [...snippet.matchAll(/\b(?:const|let|var)\s+Gm\s*=\s*[^,;)]+/g)];
m1.forEach(m => console.log('Gm in snippet:', m[0]));

const m2 = [...snippet.matchAll(/\b(?:const|let|var)\s+Vl\s*=\s*[^,;)]+/g)];
m2.forEach(m => console.log('Vl in snippet:', m[0]));
