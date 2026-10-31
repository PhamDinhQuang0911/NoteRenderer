const fs = require('fs');
const c1 = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');
const c2 = fs.readFileSync('C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-v0.6.3/dist/assets/index-CtXdKE8z.js', 'utf8');

const i1 = c1.indexOf('paintPenTip(t,n){');
const i2 = c2.indexOf('paintPenTip(t,n){');

console.log('GitHub repo paintPenTip:', c1.substring(i1, i1 + 80));
console.log('Desktop source paintPenTip:', c2.substring(i2, i2 + 80));
