const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css', 'utf8');

const idx = css.indexOf('M18%2011V6a2');
console.log(css.slice(idx - 350, idx));
