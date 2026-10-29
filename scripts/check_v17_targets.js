const fs = require('fs');

const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let content = fs.readFileSync(bundlePath, 'utf8');

// Target 1: k3 (highlighter slots)
console.log('k3 match:', content.includes('k3=["#ffeb3b","#4cff73","#3ee8ff"]'));

// Target 2: LM (tools list)
console.log('LM match:', content.includes('"highlighter","dashed",'));

// Target 3: widths in E
console.log('widths in E match:', content.includes('widths:()=>bt("widths")&&f.jsx("span",{className:"tb-palette"'));

// Target 4: lowLatency timestamp check in case "ink"
console.log('lowLatency stamp match:', content.includes('if(this.lowLatency&&m.timeStamp<=r.lastT)continue;'));

// Target 5: pressureOf
console.log('pressureOf match:', content.includes('pressureOf(t){if(t.pointerType==="pen"&&this.pen.pressure!==!1){if(typeof t.pressure==="number"&&t.pressure>0){const p=Math.pow(t.pressure,0.85);return Math.max(0.05,Math.min(1,p));}return 0.05;}return.5;}'));

// Target 6: up pointercancel ink discard
console.log('up discard match:', content.includes('const s=this.drag;if(this.drag=null,!!s){if(n){this.live=null,this.redraw();return}'));

// Target 7: pointer listeners
console.log('pointer listeners match:', content.includes('r("pointerdown",u=>this.down(u)),r("pointermove",u=>this.move(u))'));

// Target 8: down(t) start
console.log('down start match:', content.includes('down(t){try{this.scroller.dataset.writing="true";}catch(_){}'));
