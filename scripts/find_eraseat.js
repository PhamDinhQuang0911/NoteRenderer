const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('this.eraseAt(', pos)) !== -1) {
  console.log('this.eraseAt at', pos);
  console.log(js.substring(pos - 40, pos + 300));
  pos += 12;
}
