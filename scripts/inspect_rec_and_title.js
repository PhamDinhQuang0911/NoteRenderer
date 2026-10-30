const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

// 1. Context of ge.onstop
console.log('=== ge.onstop context ===');
console.log(js.substring(1818300, 1819100));

// 2. Search for tb-title in index-CtXdKE8z.js
let pos = js.indexOf('tb-title');
while (pos !== -1) {
  console.log('tb-title at', pos);
  console.log(js.substring(pos - 40, pos + 300));
  pos = js.indexOf('tb-title', pos + 10);
}
