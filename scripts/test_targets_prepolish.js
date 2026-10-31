const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const pIdx = js.indexOf('paint(){');
console.log('paint middle:', js.substring(pIdx + 400, pIdx + 1000));
