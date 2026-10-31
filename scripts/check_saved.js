const fs = require('fs');
const c = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');
console.log('has extendPageForSpace:', c.includes('extendPageForSpace'));
console.log('has quickNote in keyActions:', c.includes('quickNote:"Chèn giấy note (nhớ)"'));
console.log('has onpointerrawupdate:', c.includes('onpointerrawupdate'));
