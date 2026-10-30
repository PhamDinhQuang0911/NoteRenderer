const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = js.indexOf('triangle:["3"]');
console.log('triangle:["3"] at', pos);
if (pos !== -1) {
  console.log(js.substring(pos - 40, pos + 250));
}
