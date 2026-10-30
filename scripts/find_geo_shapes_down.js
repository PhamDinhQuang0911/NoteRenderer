const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = js.indexOf('d=ut(h.geo)');
if (pos === -1) {
  // Let's search for .geo.shapes in down(t)
  pos = js.indexOf('.geo.shapes');
}
console.log('.geo.shapes at:', pos);
if (pos !== -1) {
  console.log(js.substring(pos - 100, pos + 400));
}
