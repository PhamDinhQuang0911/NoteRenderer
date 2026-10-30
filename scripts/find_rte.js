const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = js.indexOf('function Rte(');
console.log('function Rte at:', pos);
if (pos !== -1) {
  console.log(js.substring(pos - 100, pos + 200));
}
