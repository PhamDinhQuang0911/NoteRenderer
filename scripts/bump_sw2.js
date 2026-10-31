const fs = require('fs');
const p = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/sw.js';
let s = fs.readFileSync(p, 'utf8');
s = s.replace(/nr-cache-v070-[^"]+/, 'nr-cache-v070-ultimate-v2-mvvazuqz');
fs.writeFileSync(p, s, 'utf8');
console.log('Bumped sw cache:', s.substring(0, 70));
