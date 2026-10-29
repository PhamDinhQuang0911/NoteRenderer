const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const pos = bundle.indexOf('className:"board', 2345000);
console.log('pos:', pos);
if (pos !== -1) {
  console.log(bundle.slice(pos - 200, pos + 800));
}
