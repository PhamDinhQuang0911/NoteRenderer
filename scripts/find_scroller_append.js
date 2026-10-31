const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let idx = 0;
while ((idx = js.indexOf('this.scroller.append', idx)) !== -1) {
  console.log(js.slice(idx, idx + 200));
  console.log('---');
  idx += 20;
}
