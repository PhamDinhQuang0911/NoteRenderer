const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-Cyl3OjHe.css', 'utf8');
let idx = 0;
while((idx = css.indexOf('quick-hidden', idx)) !== -1) {
  console.log(css.substring(Math.max(0, idx - 50), Math.min(css.length, idx + 100)));
  idx += 12;
}
