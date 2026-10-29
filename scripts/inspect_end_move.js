const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const target = 'this.redraw();';
let pos = 1588000;
console.log(content.substring(pos, pos + 1000));
