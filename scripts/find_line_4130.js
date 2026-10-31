const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');
const lines = js.split('\n');
console.log('Total lines:', lines.length);
for (let i = 4125; i <= 4135 && i < lines.length; i++) {
    console.log('Line ' + (i + 1) + ': ' + lines[i].substring(0, 300));
}
