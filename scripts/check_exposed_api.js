const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const pos = js.indexOf('__NR_API');
console.log('pos:', pos);
if (pos !== -1) {
  console.log(js.substring(pos - 100, pos + 800));
}
