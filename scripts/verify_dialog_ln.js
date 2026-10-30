const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const pos = js.indexOf('function ln(');
console.log('function ln at:', pos);
if (pos !== -1) {
  console.log(js.substring(pos, pos + 300));
}
