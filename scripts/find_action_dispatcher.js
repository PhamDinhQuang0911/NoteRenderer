const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = js.indexOf('case"sticker":');
console.log('case"sticker": at', pos);
if (pos !== -1) {
  console.log(js.substring(pos - 60, pos + 250));
}
