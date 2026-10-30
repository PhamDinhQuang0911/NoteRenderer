const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('QuickNoteModal', pos)) !== -1) {
  console.log('--- Found QuickNoteModal at', pos, '---');
  console.log(js.substring(pos - 100, pos + 1200));
  pos += 14;
}

pos = 0;
while ((pos = js.indexOf('"quickNote"', pos)) !== -1) {
  console.log('--- Found "quickNote" at', pos, '---');
  console.log(js.substring(pos - 100, pos + 300));
  pos += 11;
}

pos = 0;
while ((pos = js.indexOf(': "quickNote"', pos)) !== -1) {
  console.log('--- Found : "quickNote" at', pos, '---');
  console.log(js.substring(pos - 100, pos + 300));
  pos += 13;
}
