const fs = require('fs');
const tg = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/tgBlock.js', 'utf8');
const qn = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/qnBlock.js', 'utf8');

console.log('tg uses ri:', tg.includes('ri'));
console.log('tg uses z.:', tg.includes('z.'));
console.log('tg uses f.:', tg.includes('f.'));

console.log('qn uses an:', qn.includes('an'));
console.log('qn uses z.:', qn.includes('z.'));
console.log('qn uses f.:', qn.includes('f.'));
