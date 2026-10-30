const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = js.indexOf('_nrEditor');
console.log('_nrEditor at:', pos);
if (pos !== -1) {
  console.log(js.substring(pos - 40, pos + 200));
} else {
  // search for __NR_EDITOR
  pos = js.indexOf('__NR_EDITOR');
  console.log('__NR_EDITOR at:', pos);
  console.log(js.substring(pos - 40, pos + 200));
}
