const fs = require('fs');
const path = require('path');
const vm = require('vm');

const cssPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css';
const jsPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js';

// Always start from pristine backup to guarantee clean baseline
const backupJsPath = 'C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-v0.7.0-Backup-PrePolish/dist/assets/index-CtXdKE8z.js';
const backupCssPath = 'C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-v0.7.0-Backup-PrePolish/dist/assets/index-DiHPgRMg.css';

let css = fs.readFileSync(backupCssPath, 'utf8');
let js = fs.readFileSync(backupJsPath, 'utf8');

console.log('Baseline backup sizes -> CSS:', css.length, 'JS:', js.length);

// ==========================================
// FIX 1: Fullscreen toolbar isolation & Esc key
// ==========================================
// 1. In CSS: Hide .tb-group:not(.tools), .tb-group.actions, .rec-bar, .tb-rec-dot, .toolbar-recording-btn, .tb-title
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

if (!css.includes(cssFsTarget)) throw new Error('CSS fullscreen target not found');
css = css.replace(cssFsTarget, cssFsReplacement);
console.log('[OK] CSS Fullscreen rules applied.');

// 2. In JS: Esc key handling in useEffect:
const jsEscTarget = 'const E=X=>{if(X.key==="Escape"&&(Ks||document.body.classList.contains("nr-fullscreen")||document.fullscreenElement)){X.preventDefault(),xu(!1)}},ae=()=>{document.fullscreenElement||e.setFullScreen||(Z5(!1),yt({fullScreen:!1}),document.body.classList.remove("nr-fullscreen"))}';
const jsEscReplacement = 'const E=X=>{if(X.key==="Escape"&&(Ks||document.body.classList.contains("nr-fullscreen")||document.fullscreenElement)){X.preventDefault(),X.stopPropagation(),xu(!1)}},ae=()=>{document.fullscreenElement||(Z5(!1),yt({fullScreen:!1}),document.body.classList.remove("nr-fullscreen"))}';

if (!js.includes(jsEscTarget)) throw new Error('JS Esc target not found');
js = js.replace(jsEscTarget, jsEscReplacement);
console.log('[OK] JS Esc key listener polished.');

// ==========================================
// FIX 2: Scribble to erase (Di xoá) button & sensitivity
// ==========================================
// Render "Di xoá" button along with "=Đều" inside uniform group wrapped in Fragment
const uniformTarget = 'uniform:()=>(St("pen")||St("highlighter"))&&p.jsx(ct,{title:u.pressure===!1?"Nét đều: ĐANG BẬT (bấm để chuyển nét thanh đậm)":"Nét đều: ĐANG TẮT (bấm để viết các nét chữ đều nhau)",on:u.pressure===!1,className:u.pressure===!1?"on checked":"",onClick:()=>{const next=u.pressure===!1?void 0:!1;va({pressure:next}),yt({pen:{...u,pressure:next}});try{if(Q&&Q.pen){Q.pen={...Q.pen,pressure:next}}}catch(_){}},children:p.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"2px",fontSize:"11px",fontWeight:"700",letterSpacing:"-0.2px"},children:[p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",children:p.jsx("path",{d:"M3 9h18M3 15h18"})}),p.jsx("span",{children:"Đều"})]})}),shapes:';

const uniformWithScratch = 'uniform:()=>(St("pen")||St("highlighter"))&&p.jsxs(p.Fragment,{children:[p.jsx(ct,{title:u.pressure===!1?"Nét đều: ĐANG BẬT (bấm để chuyển nét thanh đậm)":"Nét đều: ĐANG TẮT (bấm để viết các nét chữ đều nhau)",on:u.pressure===!1,className:u.pressure===!1?"on checked":"",onClick:()=>{const next=u.pressure===!1?void 0:!1;va({pressure:next}),yt({pen:{...u,pressure:next}});try{if(Q&&Q.pen){Q.pen={...Q.pen,pressure:next}}}catch(_){}},children:p.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"2px",fontSize:"11px",fontWeight:"700",letterSpacing:"-0.2px"},children:[p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",children:p.jsx("path",{d:"M3 9h18M3 15h18"})}),p.jsx("span",{children:"Đều"})]})}),p.jsx(ct,{title:_s?"Di xoá: ĐANG BẬT (tô di qua lại đè lên chữ để xoá)":"Di xoá: ĐANG TẮT (bấm để bật tô di đè chữ để xoá)",on:_s,className:_s?"on checked":"",onClick:()=>{const next=!_s;bo(n.scratchEraseNow(next));Au(next)},children:p.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"2px",fontSize:"11px",fontWeight:"700",letterSpacing:"-0.2px"},children:[p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:p.jsx("path",{d:"M3 17l4-8 4 8 4-8 4 8"})}),p.jsx("span",{children:"Di xoá"})]})})]}),shapes:';

if (!js.includes(uniformTarget)) throw new Error('Uniform target not found');
js = js.replace(uniformTarget, uniformWithScratch);
console.log('[OK] Di xoá toolbar button inserted into tools toolbar.');

// PU sensitivity:
const puTarget = 'return d[0]>=4&&u>=2.5*h||d[1]>=6}';
const puReplacement = 'return(d[0]>=3&&u>=1.8*h)||(d[0]>=4&&u>=2.5*h)||d[1]>=4}';
if (!js.includes(puTarget)) throw new Error('PU sensitivity target not found');
js = js.replace(puTarget, puReplacement);

// EU sensitivity:
const euTarget = 'u>=.6*c&&r.push(l)';
const euReplacement = '(u>=.35*c||u>=5)&&r.push(l)';
if (!js.includes(euTarget)) throw new Error('EU sensitivity target not found');
js = js.replace(euTarget, euReplacement);
console.log('[OK] PU/EU scribble erase algorithm fine-tuned.');

// ==========================================
// FIX 3: Anti-drop FPS & Zero-latency inking
// ==========================================
// Note: We deliberately KEEP pristine down(t) (this.redraw(); return;) - NO synchronous drawImage!
// In paintSoon(): Always perform fast incremental paintWet() without full repaint even if lowLatency checkbox is off!
const paintSoonTarget = 'paintSoon(){this.lowLatency&&!this.needFull&&performance.now()-this.lastPaint>=5&&this.paintWet()||this.schedule()}';
const paintSoonReplacement = 'paintSoon(){(!this.needFull&&this.paintWet())||this.schedule()}';

if (!js.includes(paintSoonTarget)) throw new Error('paintSoon target not found');
js = js.replace(paintSoonTarget, paintSoonReplacement);
console.log('[OK] Zero-latency incremental paintSoon enabled.');

// ==========================================
// FIX 4: Tablet cursor rock-solid: NO double cursor, NO blur, NO jitter, locked to pen-down
// ==========================================
// 1. In mne component:
// - On desktop: when hovering (!mob && g.buttons === 0), hide .tablet-cursor completely (native OS cursor takes over, 0ms lag, no double pen).
// - Only when pen touches down (g.buttons > 0): show .tablet-cursor so pen remains visible just like mouse inking.
// - Integer coordinates (Math.round) eliminate all subpixel blur and anti-aliasing edge jitter.
// - Immediate event-driven transform updates without RAF lag.
const mneTarget = 'function mne({kind:e,scale:t,off:n}){const o=q.useRef(null),s=q.useRef(n);s.current=n;const i=e==="pen"||e==="dot"?e:"arrow",r=dne[i];return q.useEffect(()=>{const a=o.current;let l=0;const c=()=>{clearTimeout(l),a.style.display="none"},u=g=>{if(g.pointerType==="pen"){if(clearTimeout(l),s.current||g.buttons&32||g.button===5)return c();const evs=g.getCoalescedEvents?g.getCoalescedEvents():null,last=evs&&evs.length?evs[evs.length-1]:g;a.style.display="block",a.style.transform=`translate3d(${last.clientX-r.x*t}px, ${last.clientY-r.y*t}px, 0)`}},h=g=>{g.pointerType==="pen"&&(clearTimeout(l),l=window.setTimeout(c,pne))},d=g=>{g.pointerType==="pen"&&!g.relatedTarget&&c()},f={capture:!0,passive:!0};return window.addEventListener("pointerdown",u,f),window.addEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.addEventListener("pointerrawupdate",u,f),window.addEventListener("pointerup",h,f),window.addEventListener("pointercancel",c,f),window.addEventListener("pointerout",d,f),()=>{clearTimeout(l),window.removeEventListener("pointerdown",u,f),window.removeEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.removeEventListener("pointerrawupdate",u,f),window.removeEventListener("pointerup",h,f),window.removeEventListener("pointercancel",c,f),window.removeEventListener("pointerout",d,f)}},[r,t]),q.useEffect(()=>{n&&o.current&&(o.current.style.display="none")},[n]),p.jsx("div",{ref:o,className:"tablet-cursor",style:{width:r.size*t,height:r.size*t,backgroundImage:`url("data:image/svg+xml,${encodeURIComponent(hne[i])}")`}})}';

const mneReplacement = 'function mne({kind:e,scale:t,off:n}){const o=q.useRef(null),s=q.useRef(n);s.current=n;const mob=typeof document!=="undefined"&&document.documentElement.classList.contains("mobile"),i=e==="pen"||e==="dot"?e:"arrow",r=dne[i];return q.useEffect(()=>{const a=o.current;if(!a)return;const c=()=>{a.style.display="none"},u=g=>{if(g.pointerType==="pen"){if(s.current||g.buttons&32||g.button===5)return c();if(!mob&&g.buttons===0)return c();const px=Math.round(g.clientX-r.x*t),py=Math.round(g.clientY-r.y*t);a.style.display!=="block"&&(a.style.display="block"),a.style.transform=`translate3d(${px}px, ${py}px, 0)`}},h=g=>{g.pointerType==="pen"&&c()},f={capture:!0,passive:!0};return window.addEventListener("pointerdown",u,f),window.addEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.addEventListener("pointerrawupdate",u,f),window.addEventListener("pointerup",h,f),window.addEventListener("pointercancel",c,f),window.addEventListener("pointerout",c,f),window.addEventListener("pointerleave",c,f),()=>{window.removeEventListener("pointerdown",u,f),window.removeEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.removeEventListener("pointerrawupdate",u,f),window.removeEventListener("pointerup",h,f),window.removeEventListener("pointercancel",c,f),window.removeEventListener("pointerout",c,f),window.removeEventListener("pointerleave",c,f)}},[r,t,mob]),q.useEffect(()=>{n&&o.current&&(o.current.style.display="none")},[n]),p.jsx("div",{ref:o,className:"tablet-cursor",style:{width:Math.round(r.size*t),height:Math.round(r.size*t),backgroundImage:`url("data:image/svg+xml,${encodeURIComponent(hne[i])}")`}})}';

if (!js.includes(mneTarget)) throw new Error('mne target not found');
js = js.replace(mneTarget, mneReplacement);

// 2. Render mne on desktop (remove e.mobile requirement)
const mneRender = 'e.mobile&&dm&&p.jsx(mne,{kind:Cu,scale:ir,off:a.k==="eraser"})';
const mneRenderReplacement = 'dm&&p.jsx(mne,{kind:Cu,scale:ir,off:a.k==="eraser"})';
if (!js.includes(mneRender)) throw new Error('mne render target not found');
js = js.replace(mneRender, mneRenderReplacement);

// 3. Default dm state to true (c.tabletCursor ?? !0)
const dmStateTarget = '[dm,pm]=q.useState(c.tabletCursor??!1)';
const dmStateReplacement = '[dm,pm]=q.useState(c.tabletCursor??!0)';
if (!js.includes(dmStateTarget)) throw new Error('dm state target not found');
js = js.replace(dmStateTarget, dmStateReplacement);

// 4. In settings modal, pass tabletCursor: dm for desktop too
const settingsTabletTarget = 'tabletCursor:e.mobile?dm:void 0';
const settingsTabletReplacement = 'tabletCursor:dm';
if (!js.includes(settingsTabletTarget)) throw new Error('settings tabletCursor prop target not found');
js = js.replace(settingsTabletTarget, settingsTabletReplacement);

// 5. In CSS: optimize .tablet-cursor layer containment & crisp rendering
const cssCursorTarget = '.tablet-cursor{position:fixed;left:0;top:0;display:none;z-index:2147483647;pointer-events:none;background:center / contain no-repeat;will-change:transform}';
const cssCursorReplacement = '.tablet-cursor{position:fixed;left:0;top:0;display:none;z-index:2147483647;pointer-events:none;background:center / contain no-repeat;will-change:transform;contain:layout paint;image-rendering:crisp-edges;backface-visibility:hidden;transform:translate3d(-100px,-100px,0)}';
if (!css.includes(cssCursorTarget)) throw new Error('CSS tablet-cursor target not found');
css = css.replace(cssCursorTarget, cssCursorReplacement);
console.log('[OK] CSS tablet-cursor performance and crisp rendering rules applied.');

// VERIFY WITH VM SOURCE TEXT MODULE BEFORE WRITING!
console.log('Validating full ESM syntax with vm.SourceTextModule...');
new vm.SourceTextModule(js);
console.log('[VERIFIED] Full ESM syntax is 100% VALID!');

// Write back files
fs.writeFileSync(cssPath, css, 'utf8');
fs.writeFileSync(jsPath, js, 'utf8');
console.log('Successfully written updated files! CSS:', css.length, 'JS:', js.length);
