const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const regex = /imageSmoothing/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  console.log('imageSmoothing at', m.index, ':', bundle.slice(m.index - 50, m.index + 100));
}
if (!bundle.includes('imageSmoothing')) {
  console.log('imageSmoothing NEVER mentioned in bundle!');
}
