const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const idx = js.indexOf('className:"toolbar');
if (idx !== -1) {
    console.log(js.substring(idx - 100, idx + 400));
} else {
    console.log('className:"toolbar not found, searching for toolbar');
    const idx2 = js.indexOf('toolbar');
    console.log(js.substring(idx2 - 50, idx2 + 200));
}
