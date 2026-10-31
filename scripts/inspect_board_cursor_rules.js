const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css', 'utf8');

const idx = css.indexOf('.board[data-cursor=system]');
console.log(css.slice(idx - 300, idx + 200));
