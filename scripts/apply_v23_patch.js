const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const jsPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let js = fs.readFileSync(jsPath, 'utf8');

function patch(name, oldStr, newStr) {
  if (!js.includes(oldStr)) {
    throw new Error('Target not found for: ' + name);
  }
  js = js.replace(oldStr, newStr);
  console.log('[OK] ' + name);
}

// 1. Instant wet inking in paintSoon without VSync wait
const t1_old = 'this.lowLatency&&!this.needFull&&performance.now()-this.lastPaint>=2&&this.paintWet()||this.schedule()';
const t1_new = '(!this.needFull&&performance.now()-this.lastPaint>=1&&this.paintWet())||this.schedule()';
patch('1. Instant wet inking in paintSoon', t1_old, t1_new);

// 2. Enable raw pointer events from stylus/pen
const t2_old = 'const a=u=>{var h;this.lowLatency&&((h=this.drag)==null?void 0:h.k)==="ink"&&this.move(u)};i.addEventListener("pointerrawupdate",a)';
const t2_new = 'const a=u=>{var h;((h=this.drag)==null?void 0:h.k)==="ink"&&this.move(u)};i.addEventListener("pointerrawupdate",a)';
patch('2. Enable pointerrawupdate for inking', t2_old, t2_new);

// 3. Zero-allocation inking loop on pointer move (prevents GC pauses)
const t3_old = 'const h=((u=t.getCoalescedEvents)==null?void 0:u.call(t))??[t],d=r.stroke.pts.slice();for(const m of h.length?h:[t]){if(this.lowLatency&&m.timeStamp<r.lastT)continue;r.lastT=m.timeStamp;const y=this.eventPoint(m),b=this.toPage(this.toDoc(y.sx,y.sy),r.page),v=r.snap?r.snap(b):b,k=d[d.length-3],w=d[d.length-2];Math.hypot(v.x-k,v.y-w)<.8/this.zoom||d.push(v.x,v.y,this.pressureOf(m))}r.stroke={...r.stroke,pts:d},this.trailFrom(t,r.stroke);break}';
const t3_new = 'const h=((u=t.getCoalescedEvents)==null?void 0:u.call(t))??[t],d=r.stroke.pts;for(const m of h.length?h:[t]){if(m.timeStamp<r.lastT)continue;r.lastT=m.timeStamp;const y=this.eventPoint(m),b=this.toPage(this.toDoc(y.sx,y.sy),r.page),v=r.snap?r.snap(b):b,k=d[d.length-3],w=d[d.length-2];Math.hypot(v.x-k,v.y-w)<.8/this.zoom||d.push(v.x,v.y,this.pressureOf(m))}r.stroke.pts=d,this.trailFrom(t,r.stroke);break}';
patch('3. Zero-allocation inking in move()', t3_old, t3_new);

// 4. Sharp, high-resolution PDF paper background in fee()
const t4_old = 'function fee(e){const t=new Image;t.src=e,await t.decode();const W=Math.min(1600,Math.max($c,t.naturalWidth)),H=Math.round(W*(Mf/$c)),n=document.createElement("canvas");n.width=W,n.height=H;const s=n.getContext("2d");s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.fillStyle="#ffffff",s.fillRect(0,0,W,H);const o=Math.min(W/t.naturalWidth,H/t.naturalHeight),i=t.naturalWidth*o,r=t.naturalHeight*o;s.drawImage(t,(W-i)/2,(H-r)/2,i,r);const a=n.toDataURL("image/jpeg",.9);return n.width=n.height=0,a}';
const t4_new = 'function fee(e){const t=new Image;t.src=e,await t.decode();const W=Math.min(3200,Math.max($c,t.naturalWidth)),H=Math.round(W*(t.naturalHeight/t.naturalWidth)),n=document.createElement("canvas");n.width=W,n.height=H;const s=n.getContext("2d");s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.fillStyle="#ffffff",s.fillRect(0,0,W,H);const o=Math.min(W/t.naturalWidth,H/t.naturalHeight),i=t.naturalWidth*o,r=t.naturalHeight*o;s.drawImage(t,(W-i)/2,(H-r)/2,i,r);const a=n.toDataURL("image/jpeg",.98);return n.width=n.height=0,a}';
patch('4. High-resolution PDF paper background in fee()', t4_old, t4_new);

console.log('Testing Acorn parse on modified index JS...');
acorn.parse(js, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('Acorn validation 100% SUCCESSFUL for index-C4FEyT2h.js!');

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Saved modified index-C4FEyT2h.js!');

// Patch pdfimport-D5WU0CSP.js
const pdfPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/pdfimport-D5WU0CSP.js';
let pdfJs = fs.readFileSync(pdfPath, 'utf8');

pdfJs = pdfJs.replace('const g=1600,', 'const g=3200,');
pdfJs = pdfJs.replace('image/jpeg",.93', 'image/jpeg",.98');

console.log('Testing Acorn parse on modified pdfimport JS...');
acorn.parse(pdfJs, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('Acorn validation 100% SUCCESSFUL for pdfimport-D5WU0CSP.js!');

fs.writeFileSync(pdfPath, pdfJs, 'utf8');
console.log('Saved modified pdfimport-D5WU0CSP.js!');
