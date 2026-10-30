const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('==="settings"', pos)) !== -1) {
  console.log('==="settings" at', pos);
  console.log(js.substring(pos - 60, pos + 250));
  pos += 13;
}
