const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

console.log('--- Around 978332 ---');
console.log(content.substring(978300, 978600));

console.log('--- Around 1342000 ---');
console.log(content.substring(1342000, 1342400));
