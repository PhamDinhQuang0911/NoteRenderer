const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const idx = code.indexOf('function Yd(');
if (idx !== -1) {
    console.log(code.substring(idx - 50, idx + 400));
} else {
    console.log('function Yd not found');
}
