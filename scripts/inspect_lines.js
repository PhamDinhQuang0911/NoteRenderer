const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-Cyl3OjHe.css', 'utf8');

const lines = css.split('\n');
console.log('Line 745-755:');
console.log(lines.slice(744, 755).join('\n'));

console.log('Line 1730-1745:');
console.log(lines.slice(1730, 1745).join('\n'));
