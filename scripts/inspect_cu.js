const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const idx = js.indexOf('[Cu,hm]=q.useState(');
console.log(js.slice(idx - 200, idx + 400));
