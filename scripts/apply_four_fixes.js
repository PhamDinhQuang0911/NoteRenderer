const fs = require('fs');
const path = require('path');

const cssPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css';
const jsPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js';

let css = fs.readFileSync(cssPath, 'utf8');
let js = fs.readFileSync(jsPath, 'utf8');

console.log('Original sizes -> CSS:', css.length, 'JS:', js.length);

// ==========================================
// FIX 1: Fullscreen toolbar isolation & Esc key
// ==========================================
// In CSS: Hide .tb-group:not(.tools), .tb-group.actions, .rec-bar, .tb-rec-dot, .toolbar-recording-btn, .tb-title
// Show only .tb-group.tools centered.
const cssFsTarget = `/* Fullscreen Classroom Mode & Recording Quality Styles (062v37) */
body.nr-fullscreen {
  overflow: hidden !important;
}
body.nr-fullscreen .tab-bar {
  display: none !important;
}
body.nr-fullscreen .app {
  height: 100vh !important;
  width: 100vw !important;
}
body.nr-fullscreen .work {
  height: 100% !important;
  max-height: 100vh !important;
}
body.nr-fullscreen .toolbar .tb-title {
  display: none !important;
}`;

const cssFsReplacement = `/* Fullscreen Classroom Mode & Recording Quality Styles (062v37) */
body.nr-fullscreen {
  overflow: hidden !important;
}
body.nr-fullscreen .tab-bar {
  display: none !important;
}
body.nr-fullscreen .app {
  height: 100vh !important;
  width: 100vw !important;
}
body.nr-fullscreen .work {
  height: 100% !important;
  max-height: 100vh !important;
}
body.nr-fullscreen .toolbar .tb-group:not(.tools),
body.nr-fullscreen .toolbar .tb-group.actions,
body.nr-fullscreen .toolbar .rec-bar,
body.nr-fullscreen .toolbar .tb-rec-dot,
body.nr-fullscreen .toolbar .toolbar-recording-btn,
body.nr-fullscreen .toolbar .tb-title {
  display: none !important;
}
body.nr-fullscreen .toolbar {
  justify-content: center !important;
}
body.nr-fullscreen .toolbar .tb-group.tools {
  display: flex !important;
  flex-wrap: nowrap !important;
  justify-content: center !important;
  margin: 0 auto !important;
}`;

if (css.includes(cssFsTarget)) {
  css = css.replace(cssFsTarget, cssFsReplacement);
  console.log('[OK] CSS Fullscreen rules applied.');
} else if (css.includes(cssFsReplacement)) {
  console.log('[INFO] CSS Fullscreen rules already present.');
} else {
  throw new Error('CSS fullscreen target not found');
}

// In JS: Esc key handling in useEffect:
const jsEscTarget = 'const E=X=>{if(X.key==="Escape"&&(Ks||document.body.classList.contains("nr-fullscreen")||document.fullscreenElement)){X.preventDefault(),xu(!1)}},ae=()=>{document.fullscreenElement||e.setFullScreen||(Z5(!1),yt({fullScreen:!1}),document.body.classList.remove("nr-fullscreen"))}';
const jsEscReplacement = 'const E=X=>{if(X.key==="Escape"&&(Ks||document.body.classList.contains("nr-fullscreen")||document.fullscreenElement)){X.preventDefault(),X.stopPropagation(),xu(!1)}},ae=()=>{document.fullscreenElement||(Z5(!1),yt({fullScreen:!1}),document.body.classList.remove("nr-fullscreen"))}';

if (js.includes(jsEscTarget)) {
  js = js.replace(jsEscTarget, jsEscReplacement);
  console.log('[OK] JS Esc key listener polished.');
} else if (js.includes(jsEscReplacement)) {
  console.log('[INFO] JS Esc key listener already polished.');
} else {
  throw new Error('JS Esc target not found');
}

// ==========================================
// FIX 2: Scribble to erase (Di xoá) button & sensitivity
// ==========================================
// Insert "Di xoá" button right next to "=Đều" button in .tb-group.tools
const deuIdx = js.indexOf('d:"M3 9h18M3 15h18"');
if (deuIdx === -1) throw new Error('Deu icon not found');
const deuBtnEndIdx = js.indexOf('})}),shapes:', deuIdx);
if (deuBtnEndIdx === -1) throw new Error('Deu button end not found');

const scratchBtnCode = 'p.jsx(ct,{title:_s?"Di xo\\u00e1: \\u0110ANG B\\u1eacT (t\\u00f4 di qua l\\u1ea1i \\u0111\\u00e8 l\\u00ean ch\\u1eef \\u0111\\u1ec3 xo\\u00e1)":"Di xo\\u00e1: \\u0110ANG T\\u1eaeT (b\\u1ea5m \\u0111\\u1ec3 b\\u1eadt t\\u00f4 di \\u0111\\u00e8 ch\\u1eef \\u0111\\u1ec3 xo\\u00e1)",on:_s,className:_s?"on checked":"",onClick:()=>{const next=!_s;bo(n.scratchEraseNow(next));Au(next)},children:p.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"2px",fontSize:"11px",fontWeight:"700",letterSpacing:"-0.2px"},children:[p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:p.jsx("path",{d:"M3 17l4-8 4 8 4-8 4 8"})}),p.jsx("span",{children:"Di xo\\u00e1"})]})}),';

if (!js.includes('M3 17l4-8 4 8 4-8 4 8')) {
  js = js.substring(0, deuBtnEndIdx + 4) + scratchBtnCode + js.substring(deuBtnEndIdx + 4);
  console.log('[OK] Di xoá toolbar button inserted.');
} else {
  console.log('[INFO] Di xoá toolbar button already present.');
}

// PU sensitivity:
const puTarget = 'return d[0]>=4&&u>=2.5*h||d[1]>=6}';
const puReplacement = 'return(d[0]>=3&&u>=1.8*h)||(d[0]>=4&&u>=2.5*h)||d[1]>=4}';
if (js.includes(puTarget)) {
  js = js.replace(puTarget, puReplacement);
  console.log('[OK] PU sensitivity enhanced.');
} else if (js.includes(puReplacement)) {
  console.log('[INFO] PU sensitivity already enhanced.');
} else {
  throw new Error('PU sensitivity target not found');
}

// EU sensitivity:
const euTarget = 'u>=.6*c&&r.push(l)';
const euReplacement = '(u>=.35*c||u>=5)&&r.push(l)';
if (js.includes(euTarget)) {
  js = js.replace(euTarget, euReplacement);
  console.log('[OK] EU sensitivity enhanced.');
} else if (js.includes(euReplacement)) {
  console.log('[INFO] EU sensitivity already enhanced.');
} else {
  throw new Error('EU sensitivity target not found');
}

// ==========================================
// FIX 3: Ink startup latency elimination
// ==========================================
// In down(t):
const downInkTarget = 'stroke:{id:He(),kind:b,color:v.color,width:v.width,pts:[S.x,S.y,k],...this.dashed&&!g?{dashed:!0}:{},...b==="pen"&&!g&&this.pen.type!=="ballpoint"?{pen:this.pen.type}:{},...b==="pen"&&!g&&(this.pen.smooth??1)!==1?{smooth:this.pen.smooth}:{},...b==="highlighter"&&this.highlighter.alpha!==void 0?{alpha:this.highlighter.alpha}:{}}},this.redraw();return}case"select":';
const downInkReplacement = 'stroke:{id:He(),kind:b,color:v.color,width:v.width,pts:[S.x,S.y,k],...this.dashed&&!g?{dashed:!0}:{},...b==="pen"&&!g&&this.pen.type!=="ballpoint"?{pen:this.pen.type}:{},...b==="pen"&&!g&&(this.pen.smooth??1)!==1?{smooth:this.pen.smooth}:{},...b==="highlighter"&&this.highlighter.alpha!==void 0?{alpha:this.highlighter.alpha}:{}}};if(this.lowLatency&&this.canvas.width&&this.canvas.height){const _wb=this.wetBase??(this.wetBase=document.createElement("canvas"));(_wb.width!==this.canvas.width||_wb.height!==this.canvas.height)&&(_wb.width=this.canvas.width,_wb.height=this.canvas.height);const _wctx=_wb.getContext("2d");_wctx.setTransform(1,0,0,1,0,0),_wctx.drawImage(this.canvas,0,0),this.wetKey=this.viewKey();const _dpr=window.devicePixelRatio||1,_l=this.zoom,_c=x=>Math.round(x*_dpr)/_dpr;this.wetAt={dpr:_dpr,z:_l,left:_c(this.offsetX-this.scroller.scrollLeft),top:_c(this.pageTop(i)*_l-this.scroller.scrollTop)},this.wetN=0,this.needFull=!1,this.paintWet()||this.redraw()}else this.redraw();return}case"select":';

if (js.includes(downInkTarget)) {
  js = js.replace(downInkTarget, downInkReplacement);
  console.log('[OK] down(t) 0ms instant ink applied.');
} else if (js.includes(downInkReplacement)) {
  console.log('[INFO] down(t) 0ms instant ink already present.');
} else {
  throw new Error('down(t) ink target not found');
}

// In paintSoon():
const paintSoonTarget = 'paintSoon(){this.lowLatency&&!this.needFull&&performance.now()-this.lastPaint>=5&&this.paintWet()||this.schedule()}';
const paintSoonReplacement = 'paintSoon(){(this.lowLatency&&!this.needFull&&this.paintWet())||this.schedule()}';

if (js.includes(paintSoonTarget)) {
  js = js.replace(paintSoonTarget, paintSoonReplacement);
  console.log('[OK] paintSoon RAF stall eliminated.');
} else if (js.includes(paintSoonReplacement)) {
  console.log('[INFO] paintSoon RAF stall already eliminated.');
} else {
  throw new Error('paintSoon target not found');
}

// ==========================================
// FIX 4: Stylus pen cursor visibility & smoothness
// ==========================================
// 1. In mne component: use RAF syncing, debounced boundary check to prevent flickering/jitter
const mneTarget = 'function mne({kind:e,scale:t,off:n}){const o=q.useRef(null),s=q.useRef(n);s.current=n;const i=e==="pen"||e==="dot"?e:"arrow",r=dne[i];return q.useEffect(()=>{const a=o.current;let l=0;const c=()=>{clearTimeout(l),a.style.display="none"},u=g=>{if(g.pointerType==="pen"){if(clearTimeout(l),s.current||g.buttons&32||g.button===5)return c();const evs=g.getCoalescedEvents?g.getCoalescedEvents():null,last=evs&&evs.length?evs[evs.length-1]:g;a.style.display="block",a.style.transform=`translate3d(${last.clientX-r.x*t}px, ${last.clientY-r.y*t}px, 0)`}},h=g=>{g.pointerType==="pen"&&(clearTimeout(l),l=window.setTimeout(c,pne))},d=g=>{g.pointerType==="pen"&&!g.relatedTarget&&c()},f={capture:!0,passive:!0};return window.addEventListener("pointerdown",u,f),window.addEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.addEventListener("pointerrawupdate",u,f),window.addEventListener("pointerup",h,f),window.addEventListener("pointercancel",c,f),window.addEventListener("pointerout",d,f),()=>{clearTimeout(l),window.removeEventListener("pointerdown",u,f),window.removeEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.removeEventListener("pointerrawupdate",u,f),window.removeEventListener("pointerup",h,f),window.removeEventListener("pointercancel",c,f),window.removeEventListener("pointerout",d,f)}},[r,t]),q.useEffect(()=>{n&&o.current&&(o.current.style.display="none")},[n]),p.jsx("div",{ref:o,className:"tablet-cursor",style:{width:r.size*t,height:r.size*t,backgroundImage:`url("data:image/svg+xml,${encodeURIComponent(hne[i])}")`}})}';

const mneReplacement = 'function mne({kind:e,scale:t,off:n}){const o=q.useRef(null),s=q.useRef(n);s.current=n;const i=e==="pen"||e==="dot"?e:"arrow",r=dne[i];return q.useEffect(()=>{const a=o.current;if(!a)return;let l=0,rafId=0,px=-100,py=-100;const c=()=>{clearTimeout(l),rafId&&(cancelAnimationFrame(rafId),rafId=0),a.style.display="none"},sync=()=>{rafId=0,a.style.display!=="block"&&(a.style.display="block"),a.style.transform=`translate3d(${px-r.x*t}px, ${py-r.y*t}px, 0)`},u=g=>{if(g.pointerType==="pen"){clearTimeout(l);if(s.current||g.buttons&32||g.button===5)return c();const evs=g.getCoalescedEvents?g.getCoalescedEvents():null,last=evs&&evs.length?evs[evs.length-1]:g;px=last.clientX,py=last.clientY,rafId||(rafId=requestAnimationFrame(sync))}},h=g=>{g.pointerType==="pen"&&(clearTimeout(l),l=window.setTimeout(c,pne))},d=g=>{if(g.pointerType==="pen"&&(g.clientX<=0||g.clientY<=0||g.clientX>=window.innerWidth||g.clientY>=window.innerHeight)){clearTimeout(l),l=window.setTimeout(c,200)}},f={capture:!0,passive:!0};return window.addEventListener("pointerdown",u,f),window.addEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.addEventListener("pointerrawupdate",u,f),window.addEventListener("pointerup",h,f),window.addEventListener("pointercancel",c,f),window.addEventListener("pointerout",d,f),()=>{clearTimeout(l),rafId&&(cancelAnimationFrame(rafId),rafId=0),window.removeEventListener("pointerdown",u,f),window.removeEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.removeEventListener("pointerrawupdate",u,f),window.removeEventListener("pointerup",h,f),window.removeEventListener("pointercancel",c,f),window.removeEventListener("pointerout",d,f)}},[r,t]),q.useEffect(()=>{n&&o.current&&(o.current.style.display="none")},[n]),p.jsx("div",{ref:o,className:"tablet-cursor",style:{width:r.size*t,height:r.size*t,backgroundImage:`url("data:image/svg+xml,${encodeURIComponent(hne[i])}")`}})}';

if (js.includes(mneTarget)) {
  js = js.replace(mneTarget, mneReplacement);
  console.log('[OK] mne RAF & boundary handling applied.');
} else if (js.includes(mneReplacement)) {
  console.log('[INFO] mne RAF & boundary handling already present.');
} else {
  throw new Error('mne target not found');
}

// 2. Render mne on desktop (remove e.mobile requirement)
const mneRender = 'e.mobile&&dm&&p.jsx(mne,{kind:Cu,scale:ir,off:a.k==="eraser"})';
const mneRenderReplacement = 'dm&&p.jsx(mne,{kind:Cu,scale:ir,off:a.k==="eraser"})';
if (js.includes(mneRender)) {
  js = js.replace(mneRender, mneRenderReplacement);
  console.log('[OK] mne rendered on desktop.');
} else if (js.includes(mneRenderReplacement)) {
  console.log('[INFO] mne already rendered on desktop.');
} else {
  throw new Error('mne render target not found');
}

// 3. Default dm state to true (c.tabletCursor ?? !0)
const dmStateTarget = '[dm,pm]=q.useState(c.tabletCursor??!1)';
const dmStateReplacement = '[dm,pm]=q.useState(c.tabletCursor??!0)';
if (js.includes(dmStateTarget)) {
  js = js.replace(dmStateTarget, dmStateReplacement);
  console.log('[OK] dm state defaults to true.');
} else if (js.includes(dmStateReplacement)) {
  console.log('[INFO] dm state already defaults to true.');
} else {
  throw new Error('dm state target not found');
}

// 4. In settings modal, pass tabletCursor: dm for desktop too
const settingsTabletTarget = 'tabletCursor:e.mobile?dm:void 0';
const settingsTabletReplacement = 'tabletCursor:dm';
if (js.includes(settingsTabletTarget)) {
  js = js.replace(settingsTabletTarget, settingsTabletReplacement);
  console.log('[OK] Settings modal tabletCursor visible on desktop.');
} else if (js.includes(settingsTabletReplacement)) {
  console.log('[INFO] Settings modal tabletCursor already visible on desktop.');
} else {
  throw new Error('settings tabletCursor prop target not found');
}

// Write back files
fs.writeFileSync(cssPath, css, 'utf8');
fs.writeFileSync(jsPath, js, 'utf8');
console.log('Successfully written updated files! CSS:', css.length, 'JS:', js.length);
