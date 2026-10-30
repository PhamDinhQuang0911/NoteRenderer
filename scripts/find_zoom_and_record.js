const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = js.indexOf('Phóng to trang');
console.log('Phóng to trang at:', pos);
if (pos !== -1) {
  console.log(js.substring(pos - 60, pos + 250));
}

// Search for stop() in record context
pos = 0;
while ((pos = js.indexOf('.stop()', pos)) !== -1) {
  console.log('.stop() at:', pos);
  console.log(js.substring(pos - 50, pos + 150));
  pos += 7;
}
