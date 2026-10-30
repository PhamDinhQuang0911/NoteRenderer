const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = js.indexOf('va=');
while (pos !== -1) {
  console.log('va= at', pos);
  console.log(js.substring(pos - 20, pos + 150));
  pos = js.indexOf('va=', pos + 3);
}
