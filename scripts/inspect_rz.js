const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = content.indexOf('const y=RZ(s.subjects)');
console.log(content.substring(idx - 100, idx + 200));

let rzIdx = content.indexOf('function RZ(');
if (rzIdx === -1) rzIdx = content.indexOf('RZ=');
console.log('RZ definition:');
console.log(content.substring(rzIdx - 20, rzIdx + 200));
