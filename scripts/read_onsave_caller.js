const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const idx = code.indexOf('onSave:(j,X,ae,ie,ce,Le,st,Ae,Pe,Ut,Ht,fo,Fn');
console.log(code.substring(idx, idx + 600));
