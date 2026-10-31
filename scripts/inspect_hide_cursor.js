const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css', 'utf8');

const idx = css.indexOf('data-write-cursor=hide');
console.log(css.substring(idx - 100, idx + 400));
