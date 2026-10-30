const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

let tg = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/tgBlock.js', 'utf8');
tg = tg.replace(/\bf\./g, 'p.');
tg = tg.replace(/\bz\./g, 'q.');
tg = tg.replace(/\bri\b/g, 'ln');
tg = tg.replace(/\ban\b/g, 'ln');

fs.writeFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/tgBlock_adapted.js', tg);

try {
  acorn.parse(tg, { ecmaVersion: 'latest', sourceType: 'module' });
  console.log('tgBlock_adapted parsed cleanly!');
} catch (err) {
  console.error('Parse error:', err.message);
}
