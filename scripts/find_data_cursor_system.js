const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css', 'utf8');

let idx = 0;
while ((idx = css.indexOf('data-cursor=system', idx)) !== -1) {
  console.log(css.slice(Math.max(0, idx - 40), Math.min(css.length, idx + 80)));
  console.log('---');
  idx += 18;
}
