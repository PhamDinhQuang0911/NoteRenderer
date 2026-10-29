const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const pdfImportPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/pdfimport-D5WU0CSP.js';
let content = fs.readFileSync(pdfImportPath, 'utf8');

content = content.replace('const g=1240,', 'const g=2480,');
content = content.replace(
  'if(!n)throw new w("pdfFailed");n.fillStyle="#ffffff"',
  'if(!n)throw new w("pdfFailed");n.imageSmoothingEnabled=!0,n.imageSmoothingQuality="high",n.fillStyle="#ffffff"'
);
content = content.replace(
  'src:t.toDataURL("image/jpeg",.9)',
  'src:t.toDataURL("image/jpeg",.93)'
);

console.log('Testing AST parse on modified pdfimport...');
acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('AST parse SUCCESS for pdfimport!');
fs.writeFileSync(pdfImportPath, content, 'utf8');
console.log('Saved modified pdfimport-D5WU0CSP.js');
