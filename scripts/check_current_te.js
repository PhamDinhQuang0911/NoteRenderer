const fs = require('fs');
const jsCurrent = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const pos = jsCurrent.indexOf('async function _te');
console.log('_te in current at:', pos);
if (pos !== -1) {
  console.log(jsCurrent.substring(pos, pos + 500));
}
