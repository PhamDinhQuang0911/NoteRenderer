const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('fullScreen', pos)) !== -1) {
  console.log('fullScreen at', pos);
  console.log(js.substring(pos - 40, pos + 250));
  pos += 10;
}
