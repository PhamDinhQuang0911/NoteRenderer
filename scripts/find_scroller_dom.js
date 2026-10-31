const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

// Where is board-scroller or board rendered?
const idx = js.indexOf('className:"board-scroller"');
console.log(js.slice(idx - 200, idx + 400));
