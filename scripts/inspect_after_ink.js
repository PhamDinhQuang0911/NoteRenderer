const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const target = 'this.trailFrom(t,r.stroke);break}';
const p = content.indexOf(target);
console.log('p at', p);
console.log(content.substring(p, p + 1000));
