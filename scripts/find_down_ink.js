const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const idx = js.indexOf('capture(t.pointerId),this.drag=');
console.log(js.substring(idx - 100, idx + 400));
