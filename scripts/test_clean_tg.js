const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

const tgStart = js.indexOf('const TelegramLectureService = {');
const tgEnd = 1785803;
let tg = js.substring(tgStart, tgEnd);

tg = tg.replace(/\bf\./g, 'p.');
tg = tg.replace(/\bz\./g, 'q.');
tg = tg.replace(/\bri\b/g, 'ln');
tg = tg.replace(/\ban\b/g, 'ln');

fs.writeFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/tgBlock_clean.js', tg);

try {
  acorn.parse(tg, { ecmaVersion: 'latest', sourceType: 'module' });
  console.log('tgBlock_clean.js parsed 100% cleanly! Length:', tg.length);
} catch (err) {
  console.error('Parse error:', err.message);
}
