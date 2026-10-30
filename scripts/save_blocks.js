const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

const tgBlock = js.substring(1757110, 1787525);
fs.writeFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/tgBlock.js', tgBlock);
console.log('Saved tgBlock.js, size:', tgBlock.length);

const qnBlock = js.substring(1864597, 1895732);
fs.writeFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/qnBlock.js', qnBlock);
console.log('Saved qnBlock.js, size:', qnBlock.length);
