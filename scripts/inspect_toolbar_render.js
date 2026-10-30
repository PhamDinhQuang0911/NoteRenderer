const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

console.log('=== Toolbar render around pos 2426800 ===');
console.log(js.substring(2426300, 2427200));
