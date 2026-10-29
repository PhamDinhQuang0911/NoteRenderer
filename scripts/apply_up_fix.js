const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let content = fs.readFileSync(bundlePath, 'utf8');

const oldUp = 'if(PN(!1),t.pointerType==="pen"&&(this.penDown=!1,this.penAt=performance.now(),this.penTip=null)';
const newUp = 'if(PN(!1),(t.pointerType==="pen"||t.pointerType==="mouse")&&(this.penDown=!1,this.penAt=performance.now(),this.penTip=null)';

if (!content.includes(oldUp)) {
  console.log('oldUp not found directly. Searching for penDown=!1');
  let idx = content.indexOf('this.penDown=!1');
  console.log(content.substring(idx - 40, idx + 80));
} else {
  content = content.replace(oldUp, newUp);
  acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'module' });
  fs.writeFileSync(bundlePath, content, 'utf8');
  console.log('Successfully updated up() and validated AST!');
}
