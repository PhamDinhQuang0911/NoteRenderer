const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const buNeedle = 'const BU=e=>.55+.9*e;function jO(e){const t=e.width/2;if(e.kind!=="pen")return()=>t;switch(e.pen){case"felt":return()=>t*1.2;case"fountain":return n=>t*(.6+.8*n);case"pencil":return n=>t*(.7+.6*n);case"brush":return n=>t*(.25+1.75*n);default:return n=>t*BU(n)}}';
console.log('buNeedle found:', code.includes(buNeedle));

const pressNeedle = 'pressureOf(t){if(t.pointerType==="pen"&&this.pen.pressure!==!1){if(typeof t.pressure==="number"&&t.pressure>0){const p=Math.pow(t.pressure,0.85);return Math.max(0.2,Math.min(1,p));}return 0.2;}return.5;}';
console.log('pressNeedle found:', code.includes(pressNeedle));
