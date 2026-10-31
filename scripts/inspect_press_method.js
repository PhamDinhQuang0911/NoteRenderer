const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const idx = js.indexOf('press(t){');
console.log(js.slice(idx + 1400, idx + 2800));
