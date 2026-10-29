const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
let idx = content.indexOf('up(t,n=!1){');
console.log(content.substring(idx, idx + 400));
