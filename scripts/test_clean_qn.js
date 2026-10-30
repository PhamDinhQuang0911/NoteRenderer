const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

const qnStart = js.indexOf('const QN_TEMPLATES = [');
const qnEnd = js.indexOf('function QuickNoteModal', qnStart);
const qnModalEnd = js.indexOf('const Oee=26', qnEnd);
let qn = js.substring(qnStart, qnModalEnd);

qn = qn.replace(/\bf\./g, 'p.');
qn = qn.replace(/\bz\./g, 'q.');
qn = qn.replace(/\bri\b/g, 'ln');
qn = qn.replace(/\ban\b/g, 'ln');

fs.writeFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/qnBlock_clean.js', qn);

try {
  acorn.parse(qn, { ecmaVersion: 'latest', sourceType: 'module' });
  console.log('qnBlock_clean.js parsed 100% cleanly! Length:', qn.length);
} catch (err) {
  console.error('Parse error:', err.message);
}
