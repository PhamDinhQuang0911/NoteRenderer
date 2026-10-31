const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css', 'utf8');

const idx = css.indexOf('/* Native hardware cursors (062v41)');
console.log(css.substring(idx, idx + 1800));
