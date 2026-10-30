const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

// Search for QN_TEMPLATES
const qnPos = js.indexOf('QN_TEMPLATES');
console.log('QN_TEMPLATES at:', qnPos);
if (qnPos !== -1) {
  console.log(js.substring(qnPos - 50, qnPos + 2000));
}

// Search for bn definition or keydown shortcuts
const bnPos = js.indexOf('function bn(');
console.log('function bn at:', bnPos);
if (bnPos !== -1) {
  console.log(js.substring(bnPos, bnPos + 500));
} else {
  // Let's search for "quickNote" in shortcuts mapping
  let pos = 0;
  while ((pos = js.indexOf('quickNote', pos)) !== -1) {
    const snip = js.substring(Math.max(0, pos - 50), Math.min(js.length, pos + 100));
    console.log('pos', pos, ':', snip);
    pos += 10;
  }
}
