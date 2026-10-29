const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const pos = bundle.indexOf('function vle()', 2418000);
console.log('vle at pos:', pos);
if (pos !== -1) {
  console.log(bundle.slice(pos, pos + 2500));
}
