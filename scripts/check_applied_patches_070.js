const fs = require('fs');
const jsCurrent = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

// Search for _cp in index-CtXdKE8z.js
let pos = jsCurrent.indexOf('_cp');
while (pos !== -1) {
  console.log('_cp at', pos, ':', jsCurrent.substring(pos - 30, pos + 200));
  pos = jsCurrent.indexOf('_cp', pos + 3);
}

// Search for insertPages
pos = jsCurrent.indexOf('insertPages(');
if (pos !== -1) {
  console.log('insertPages at', pos, ':', jsCurrent.substring(pos, pos + 500));
}
