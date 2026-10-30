const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

// Find where width or color is updated in toolbar
let pos = js.indexOf('{width:st})');
console.log('{width:st} at:', pos);
if (pos !== -1) {
  console.log(js.substring(pos - 60, pos + 100));
}
