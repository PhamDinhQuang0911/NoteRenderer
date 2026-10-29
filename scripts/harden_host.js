const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let content = fs.readFileSync(bundlePath, 'utf8');

const oldTarget = 'const i=this.host.dataset.cursor||"pen";';
const newTarget = 'const i=((this.host&&this.host.dataset&&this.host.dataset.cursor)||localStorage.getItem("cursor")||"pen");';

if (content.includes(oldTarget)) {
  content = content.replace(oldTarget, newTarget);
  acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'module' });
  fs.writeFileSync(bundlePath, content, 'utf8');
  console.log('Successfully hardened host dataset access!');
} else {
  console.log('Target not found or already hardened.');
}
