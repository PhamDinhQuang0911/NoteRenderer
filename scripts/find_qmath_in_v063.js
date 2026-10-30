const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('qmath', pos)) !== -1) {
  console.log('--- qmath at', pos, '---');
  console.log(js.substring(pos - 100, pos + 300));
  pos += 5;
}

pos = 0;
while ((pos = js.indexOf('QMath', pos)) !== -1) {
  console.log('--- QMath at', pos, '---');
  console.log(js.substring(pos - 100, pos + 300));
  pos += 5;
}
