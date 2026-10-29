const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let idx = content.indexOf('L.map((se,le)=>f.jsx(Oo,{open:Bt==="hlslot"');
console.log(content.substring(idx - 1500, idx - 500));
