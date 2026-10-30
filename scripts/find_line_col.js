const fs = require('fs');

const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');
const lines = js.split('\n');
console.log('Total lines:', lines.length);
if (lines.length >= 3276) {
  const l = lines[3275]; // 0-indexed line 3276
  console.log('Line 3276 length:', l.length);
  const col = 326713;
  console.log('Around col 326713:');
  console.log(l.substring(Math.max(0, col - 80), Math.min(l.length, col + 80)));
}
