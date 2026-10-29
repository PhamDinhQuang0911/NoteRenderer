const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const jsPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let content = fs.readFileSync(jsPath, 'utf8');

function patch(name, oldStr, newStr) {
  if (!content.includes(oldStr)) {
    throw new Error('Target not found for: ' + name);
  }
  content = content.replace(oldStr, newStr);
  console.log('[OK] ' + name);
}

// 1. Restore native tipBoxNow
const oldTipBox = 'tipBoxNow(t){const n=this.penTip;return (this._penCursorEl||!n)?null:{x0:t*(n.sx-8),y0:t*(n.sy-28),x1:t*(n.sx+28),y1:t*(n.sy+24)}}';
const newTipBox = 'tipBoxNow(t){const n=this.penTip;return n?{x0:t*(n.sx-8),y0:t*(n.sy-28),x1:t*(n.sx+28),y1:t*(n.sy+24)}:null}';
patch('1. Restore tipBoxNow', oldTipBox, newTipBox);

// 2. Restore native paintPenTip with cached cursor (no DOM cursor overlay, no localStorage spam)
const oldPaintPenTipStart = 'paintPenTip(t,n){const s=this.penTip;if(!this._penCursorEl){let el=document.getElementById("nr-dom-pen-tip");if(!el&&this.scroller){el=document.createElement("div");el.id="nr-dom-pen-tip";el.className="nr-pen-tip-cursor";el.style.cssText="position:absolute;top:0;left:0;width:0;height:0;pointer-events:none;z-index:9999;will-change:transform;";this.scroller.style.position=this.scroller.style.position||"relative";this.scroller.appendChild(el)}this._penCursorEl=el}if(!s){this.tipBox=null;if(this._penCursorEl)this._penCursorEl.style.display="none";return}this.tipBox=null;const i=((this.host&&this.host.dataset&&this.host.dataset.cursor)||localStorage.getItem("cursor")||"pen");if(this._penCursorEl){this._penCursorEl.style.display="block";this._penCursorEl.style.transform=`translate3d(${s.sx}px,${s.sy}px,0)`;if(this._penCursorType!==i){this._penCursorType=i;if(i==="dot"){this._penCursorEl.innerHTML=\'<svg width="12" height="12" viewBox="-6 -6 12 12" style="position:absolute;top:-6px;left:-6px;"><circle cx="0" cy="0" r="2.8" fill="#222" stroke="#fff" stroke-width="1.2"/></svg>\'}else if(i==="system"||i==="hand"){this._penCursorEl.innerHTML=\'<svg width="16" height="16" viewBox="0 0 16 16" style="position:absolute;top:0;left:0;"><path d="M0,0 L0,11 L3,8 L6,14 L8,13 L5,7 L9,7 Z" fill="#fff" stroke="#000" stroke-width="1"/></svg>\'}else{this._penCursorEl.innerHTML=\'<svg width="24" height="24" viewBox="-2 -22 24 24" style="position:absolute;top:-22px;left:-2px;"><path d="M0,0 L18,-18 L22,-14 L4,4 Z" fill="#fff" stroke="#222" stroke-width="1.4"/><polygon points="0,0 4,4 -2,2" fill="#222"/></svg>\'}}}else{t.save(),t.setTransform(n,0,0,n,n*s.sx,n*s.sy),t.lineJoin="round",i==="dot"?(t.beginPath(),t.arc(0,0,2.8,0,Math.PI*2),t.fillStyle="#222",t.fill(),t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke()):i==="system"||i==="hand"?/Mac/.test(navigator.platform)?(t.fillStyle="#222",t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke(jd().arrow),t.fill(jd().arrow)):(t.setTransform(1,0,0,1,Math.round(n*s.sx),Math.round(n*s.sy)),t.fillStyle="#fff",t.strokeStyle="#000",t.lineWidth=1,t.fill(jd().arrow),t.stroke(jd().arrow)):(t.translate(-2,-22),t.fillStyle="#ffffff",t.strokeStyle="#222222",t.lineWidth=1.4,t.fill(jd().body),t.stroke(jd().body),t.fillStyle="#222222",t.fill(jd().point)),t.restore()}}';

const newPaintPenTip = 'paintPenTip(t,n){const s=this.penTip;if(!s){this.tipBox=null;return}this.tipBox=this.tipBoxNow(n);const i=((this.host&&this.host.dataset&&this.host.dataset.cursor)||(window.__nrCursor||(window.__nrCursor=localStorage.getItem("cursor")))||"pen");t.save(),t.setTransform(n,0,0,n,n*s.sx,n*s.sy),t.lineJoin="round",i==="dot"?(t.beginPath(),t.arc(0,0,2.8,0,Math.PI*2),t.fillStyle="#222",t.fill(),t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke()):i==="system"||i==="hand"?/Mac/.test(navigator.platform)?(t.fillStyle="#222",t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke(jd().arrow),t.fill(jd().arrow)):(t.setTransform(1,0,0,1,Math.round(n*s.sx),Math.round(n*s.sy)),t.fillStyle="#fff",t.strokeStyle="#000",t.lineWidth=1,t.fill(jd().arrow),t.stroke(jd().arrow)):(t.translate(-2,-22),t.fillStyle="#ffffff",t.strokeStyle="#222222",t.lineWidth=1.4,t.fill(jd().body),t.stroke(jd().body),t.fillStyle="#222222",t.fill(jd().point)),t.restore()}';
patch('2. Restore canvas paintPenTip', oldPaintPenTipStart, newPaintPenTip);

// 3. Cap image cache LX from 40 to 16
const oldLX = 'const LX=40;';
const newLX = 'const LX=16;';
patch('3. Cap LX to 16', oldLX, newLX);

// 4. Optimize fee paper image resolution to max 1600px
const oldFee = 'async function fee(e){const t=new Image;t.src=e,await t.decode();const W=Math.max(2480,t.naturalWidth),H=Math.round(W*(Mf/$c)),n=document.createElement("canvas");n.width=W,n.height=H;const s=n.getContext("2d");s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.fillStyle="#ffffff",s.fillRect(0,0,W,H);const o=Math.min(W/t.naturalWidth,H/t.naturalHeight),i=t.naturalWidth*o,r=t.naturalHeight*o;s.drawImage(t,(W-i)/2,(H-r)/2,i,r);const a=n.toDataURL("image/jpeg",.93);return n.width=n.height=0,a}';

const newFee = 'async function fee(e){const t=new Image;t.src=e,await t.decode();const W=Math.min(1600,Math.max($c,t.naturalWidth)),H=Math.round(W*(Mf/$c)),n=document.createElement("canvas");n.width=W,n.height=H;const s=n.getContext("2d");s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.fillStyle="#ffffff",s.fillRect(0,0,W,H);const o=Math.min(W/t.naturalWidth,H/t.naturalHeight),i=t.naturalWidth*o,r=t.naturalHeight*o;s.drawImage(t,(W-i)/2,(H-r)/2,i,r);const a=n.toDataURL("image/jpeg",.9);return n.width=n.height=0,a}';
patch('4. Fee max 1600px', oldFee, newFee);

// 5. Prevent saving giant paper images to localStorage
const oldX2 = 'x2=E=>{const{image:I0,...X0}=E||{};c.paper=E,wt({paper:X0});try{localStorage.setItem("nr_saved_paper",JSON.stringify(E))}catch(_){try{localStorage.setItem("nr_saved_paper",JSON.stringify(X0))}catch(__){}}};';
const newX2 = 'x2=E=>{const{image:I0,paperImage:P0,...X0}=E||{};c.paper=E,wt({paper:X0});try{localStorage.setItem("nr_saved_paper",JSON.stringify(X0))}catch(_){}};';
patch('5. x2 strip paper images from localStorage', oldX2, newX2);

// 6. Smooth mouse wheel scrolling for page navigation
const oldWheel = 'wheel(t){t.deltaY>0&&!t.ctrlKey&&!t.shiftKey&&this.growAtEnd(),(t.deltaX>0||t.shiftKey&&t.deltaY>0)&&!t.ctrlKey&&this.growAtRight();const{sx:n,sy:s}=this.eventPoint(t);if(t.ctrlKey){if(t.preventDefault(),this.zoomLock)return;this.wheelZooming=!0,clearTimeout(this.wheelTimer),this.wheelTimer=window.setTimeout(()=>{this.wheelZooming=!1,this.redraw()},150),this.setZoom(this.zoom*Math.exp(-t.deltaY*.0015),{sx:n,sy:s});return}if(this.instrumentShown&&ax(this.instrument,this.toDoc(n,s))){t.preventDefault();const o=(this.instrument.angle+(t.deltaY>0?1:-1)*(t.shiftKey?15:1)+360)%360;this.instrument={...this.instrument,angle:o},this.redraw()}}';

const newWheel = 'wheel(t){t.deltaY>0&&!t.ctrlKey&&!t.shiftKey&&this.growAtEnd(),(t.deltaX>0||t.shiftKey&&t.deltaY>0)&&!t.ctrlKey&&this.growAtRight();const{sx:n,sy:s}=this.eventPoint(t);if(t.ctrlKey){if(t.preventDefault(),this.zoomLock)return;this.wheelZooming=!0,clearTimeout(this.wheelTimer),this.wheelTimer=window.setTimeout(()=>{this.wheelZooming=!1,this.redraw()},150),this.setZoom(this.zoom*Math.exp(-t.deltaY*.0015),{sx:n,sy:s});return}if(this.instrumentShown&&ax(this.instrument,this.toDoc(n,s))){t.preventDefault();const o=(this.instrument.angle+(t.deltaY>0?1:-1)*(t.shiftKey?15:1)+360)%360;this.instrument={...this.instrument,angle:o},this.redraw();return}if(this.scroller){t.preventDefault();const my=t.deltaY*(t.deltaMode===1?32:1),mx=(t.shiftKey?t.deltaY:t.deltaX)*(t.deltaMode===1?32:1);this.scroller.scrollTop+=my;if(t.deltaX||t.shiftKey)this.scroller.scrollLeft+=mx;t.deltaY>0&&this.growAtEnd();(t.deltaX>0||t.shiftKey&&t.deltaY>0)&&this.growAtRight();}}';
patch('6. Wheel smooth page scroll', oldWheel, newWheel);

// 7. Arrow keys (Up/Down/Left/Right/PageUp/PageDown) page scroll in board keydown listener
const oldKeydown = 'const l=u=>{u.key==="Shift"&&!u.repeat&&(this.shiftAt=performance.now())};window.addEventListener("keydown",l),this.disposers.push(()=>window.removeEventListener("keydown",l))';

const newKeydown = 'const l=u=>{u.key==="Shift"&&!u.repeat&&(this.shiftAt=performance.now());const tag=(document.activeElement&&document.activeElement.tagName)||"";if(tag==="INPUT"||tag==="TEXTAREA"||(document.activeElement&&document.activeElement.isContentEditable)||u.ctrlKey||u.metaKey||u.altKey)return;if(u.key==="ArrowDown"||u.key==="PageDown"){u.preventDefault();const st=u.key==="PageDown"?Math.max(200,Math.round(this.scroller.clientHeight*0.8)):140;this.scroller.scrollBy({top:st,behavior:"smooth"});this.growAtEnd();}else if(u.key==="ArrowUp"||u.key==="PageUp"){u.preventDefault();const st=u.key==="PageUp"?Math.max(200,Math.round(this.scroller.clientHeight*0.8)):140;this.scroller.scrollBy({top:-st,behavior:"smooth"});}else if(u.key==="ArrowLeft"){u.preventDefault();this.scroller.scrollBy({left:-140,behavior:"smooth"});}else if(u.key==="ArrowRight"){u.preventDefault();this.scroller.scrollBy({left:140,behavior:"smooth"});this.growAtRight();}};window.addEventListener("keydown",l),this.disposers.push(()=>window.removeEventListener("keydown",l))';
patch('7. Arrow & Page keys smooth scroll', oldKeydown, newKeydown);

// Also clean up any lingering #nr-dom-pen-tip on window load
const cleanupDomCursorSnippet = ';if(typeof window!=="undefined"){try{const oldEl=document.getElementById("nr-dom-pen-tip");oldEl&&oldEl.remove();}catch(_){}}';
content += cleanupDomCursorSnippet;

console.log('Validating modified JS bundle with Acorn...');
acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('Acorn parse 100% SUCCESSFUL!');

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Saved patched JS to:', jsPath);

// Also patch pdfimport-D5WU0CSP.js: set g=1600 (was 2480)
const pdfImportPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/pdfimport-D5WU0CSP.js';
let pdfContent = fs.readFileSync(pdfImportPath, 'utf8');
if (!pdfContent.includes('const g=2480')) {
  console.log('Note: const g=2480 not found in pdfimport, checking if already 1600...');
} else {
  pdfContent = pdfContent.replace('const g=2480', 'const g=1600');
  fs.writeFileSync(pdfImportPath, pdfContent, 'utf8');
  console.log('[OK] pdfimport resolution updated to 1600px');
}
