const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/pdfimport-C80fD9x7.js', 'utf8');

console.log('const g=2400:', code.includes('const g=2400'));
console.log('image/jpeg,.94:', code.includes('t.toDataURL("image/jpeg",.94)'));
