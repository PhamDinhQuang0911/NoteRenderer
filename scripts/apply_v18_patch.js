const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let content = fs.readFileSync(bundlePath, 'utf8');

function applyPatch(name, oldStr, newStr) {
  if (!content.includes(oldStr)) {
    throw new Error('Target not found for: ' + name);
  }
  content = content.replace(oldStr, newStr);
  console.log('[OK] ' + name);
}

// 1. High-quality bicubic smoothing when rendering paperImage on canvas
applyPatch(
  '1. OX paperImage smoothing',
  'const r=t.paperImage?Na(t.paperImage):null;r&&e.drawImage(r,0,0,o,i);const a=t.spacing',
  'const r=t.paperImage?Na(t.paperImage):null;r&&(e.save(),e.imageSmoothingEnabled=!0,e.imageSmoothingQuality="high",e.drawImage(r,0,0,o,i),e.restore());const a=t.spacing'
);

// 2. High-resolution (2480x3508 / 300 DPI) paper image processing in fee
applyPatch(
  '2. fee 2480px high resolution',
  'async function fee(e){const t=new Image;t.src=e,await t.decode();const n=document.createElement("canvas");n.width=$c,n.height=Mf;const s=n.getContext("2d");s.fillStyle="#ffffff",s.fillRect(0,0,$c,Mf);const o=Math.min($c/t.naturalWidth,Mf/t.naturalHeight),i=t.naturalWidth*o,r=t.naturalHeight*o;s.drawImage(t,($c-i)/2,(Mf-r)/2,i,r);const a=n.toDataURL("image/jpeg",.85);return n.width=n.height=0,a}',
  'async function fee(e){const t=new Image;t.src=e,await t.decode();const W=Math.max(2480,t.naturalWidth),H=Math.round(W*(Mf/$c)),n=document.createElement("canvas");n.width=W,n.height=H;const s=n.getContext("2d");s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.fillStyle="#ffffff",s.fillRect(0,0,W,H);const o=Math.min(W/t.naturalWidth,H/t.naturalHeight),i=t.naturalWidth*o,r=t.naturalHeight*o;s.drawImage(t,(W-i)/2,(H-r)/2,i,r);const a=n.toDataURL("image/jpeg",.93);return n.width=n.height=0,a}'
);

// 3. Restore saved paper type on app load in SL
applyPatch(
  '3. SL paper persistence',
  'KZ(_.lineWeight)?{lineWeight:_.lineWeight}:{},..._.landscape===!0?{landscape:!0}:{},...Ps(tO,_.size)?{size:_.size}:{}}),o}',
  'KZ(_.lineWeight)?{lineWeight:_.lineWeight}:{},..._.landscape===!0?{landscape:!0}:{},...Ps(tO,_.size)?{size:_.size}:{},..._.image?{image:_.image}:{}}),(()=>{try{const P0=JSON.parse(localStorage.getItem("nr_saved_paper")??"null");P0&&typeof P0=="object"&&(o.paper={...o.paper,...P0})}catch(_){}})(),o}'
);

// 4. Save and use default paper type across notebooks in t0 and x2
applyPatch(
  '4. t0 and x2 paper saving',
  'const t0=()=>{var X;const E=c.paper??l$(((X=o.current)==null?void 0:X.doc)??ex());return{...ex(E.paper,E.spacing),titleBox:E.titleBox,names:E.names,...E.infinite?{infinite:!0,width:sr(E)+x1}:{},...E.landscape?{landscape:!0}:{},...E.size&&E.size!=="a4"?{size:E.size}:{},...E.labelSize?{labelSize:E.labelSize}:{},...E.labelColor?{labelColor:E.labelColor}:{},...E.dotColor?{dotColor:E.dotColor}:{},...E.dotSize?{dotSize:E.dotSize}:{},...E.dots?{}:{dots:!1},...E.margins===!1?{margins:!1}:{},...E.color?{paperColor:E.color}:{},...E.lineColor?{lineColor:E.lineColor}:{},...E.lineWeight&&E.lineWeight!==1?{lineWeight:E.lineWeight}:{}}},x2=({image:E,...X})=>{c.paper=X,wt({paper:X})};',
  'const t0=()=>{var X;let S0=null;try{const R0=localStorage.getItem("nr_saved_paper");if(R0)S0=JSON.parse(R0)}catch(_){}const E=S0??c.paper??l$(((X=o.current)==null?void 0:X.doc)??ex()),pk=E.paper??"ruled",ps=typeof E.spacing=="number"&&E.spacing>=10?E.spacing:28,pi=E.image||E.paperImage;return{...ex(pk,ps),titleBox:E.titleBox,names:E.names,...E.infinite?{infinite:!0,width:sr(E)+x1}:{},...E.landscape?{landscape:!0}:{},...E.size&&E.size!=="a4"?{size:E.size}:{},...E.labelSize?{labelSize:E.labelSize}:{},...E.labelColor?{labelColor:E.labelColor}:{},...E.dotColor?{dotColor:E.dotColor}:{},...E.dotSize?{dotSize:E.dotSize}:{},...E.dots===!1?{dots:!1}:{},...E.margins===!1?{margins:!1}:{},...(E.color||E.paperColor)?{paperColor:E.color||E.paperColor}:{},...E.lineColor?{lineColor:E.lineColor}:{},...E.lineWeight&&E.lineWeight!==1?{lineWeight:E.lineWeight}:{},...pi?{paperImage:pi}:{}}},x2=E=>{const{image:I0,...X0}=E||{};c.paper=E,wt({paper:X0});try{localStorage.setItem("nr_saved_paper",JSON.stringify(E))}catch(_){try{localStorage.setItem("nr_saved_paper",JSON.stringify(X0))}catch(__){}}};'
);

// 5. Inherit saved paper when adding new sheet tab
applyPatch(
  '5. add sheet inherit t0',
  'i0([...Un,{id:qe("s"),name:n.sheetName(X)}]),Uh(Un.length),Xh(!0),E.load({...ex(E.doc.paper,E.doc.spacing),names:E.doc.names})}',
  'i0([...Un,{id:qe("s"),name:n.sheetName(X)}]),Uh(Un.length),Xh(!0),E.load({...t0(),names:E.doc.names})}'
);

console.log('Validating modified bundle with Acorn parser...');
acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('AST parse SUCCESSFUL! 100% clean!');

fs.writeFileSync(bundlePath, content, 'utf8');
console.log('Saved modified bundle to:', bundlePath);
