const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = content.indexOf('onSave:(E,X,ae,se,le,Ne,Ye,Ce,Le,Ot,Ct,os,Ks)=>{');
console.log(content.substring(idx, idx + 400));
