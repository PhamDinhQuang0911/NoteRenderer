const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

// Search for dialog-actions in Aee
const pos = bundle.indexOf('dialog-actions', 1845000);
console.log('pos:', pos);
if (pos !== -1) {
  console.log(bundle.slice(pos - 300, pos + 300));
}
