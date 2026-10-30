const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

console.log('--- Context around 1570242 ---');
console.log(js.substring(1569800, 1570800));

console.log('--- Context around 1578693 ---');
console.log(js.substring(1578300, 1579200));
