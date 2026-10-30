const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = js.indexOf('iS=');
console.log('iS= at:', pos);
if (pos !== -1) {
  console.log(js.substring(pos - 20, pos + 250));
}
