const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-v0.7.0-Backup-PrePolish/dist/assets/index-CtXdKE8z.js', 'utf8');

const pIdx = js.indexOf('paintSoon(){');
console.log('paintSoon:', js.substring(pIdx, pIdx + 300));
