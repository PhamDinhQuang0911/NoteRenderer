const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

const qnStart = js.indexOf('const QN_TEMPLATES = [');
const qnEnd = js.indexOf('function QuickNoteModal', qnStart);
console.log('QN_TEMPLATES block:');
console.log(js.substring(qnStart, qnEnd));
