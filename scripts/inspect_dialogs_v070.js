const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

console.log('=== Dialogs around pos 2455557 ===');
console.log(js.substring(2455000, 2457000));
