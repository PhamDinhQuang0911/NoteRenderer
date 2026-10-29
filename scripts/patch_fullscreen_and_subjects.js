const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let content = fs.readFileSync(bundlePath, 'utf8');

// 1. Fix Subject selection persistence
const oldFl = '[Fl,c2]=z.useState(()=>(Array.isArray(c.subjects)&&c.subjects.length>1)?c.subjects:IZ)';
const newFl = '[Fl,c2]=z.useState(()=>{try{const s=JSON.parse(localStorage.getItem("nr_subjects")||"null");if(Array.isArray(s)&&s.length>0)return s}catch(_){}return(Array.isArray(c.subjects)&&c.subjects.length>0)?c.subjects:["math"]})';

if (!content.includes(oldFl)) throw new Error('Could not find oldFl');
content = content.replace(oldFl, newFl);
console.log('1. Replaced oldFl');

const oldPopChange = 'c2(next),wt({subjects:next})';
const newPopChange = 'c2(next),wt({subjects:next}),localStorage.setItem("nr_subjects",JSON.stringify(next))';
if (!content.includes(oldPopChange)) throw new Error('Could not find oldPopChange');
content = content.replace(oldPopChange, newPopChange);
console.log('2. Replaced oldPopChange');

const oldSettingsSave = 'c2(Ks),wt({subjects:Ks})';
const newSettingsSave = 'c2(Ks),wt({subjects:Ks}),localStorage.setItem("nr_subjects",JSON.stringify(Ks))';
if (!content.includes(oldSettingsSave)) throw new Error('Could not find oldSettingsSave');
content = content.replace(oldSettingsSave, newSettingsSave);
console.log('3. Replaced oldSettingsSave');

// 2. Fix d2 and global Escape keydown listener
const oldD2Block = 'h2=!!(e.toggleFullScreen||e.setFullScreen),d2=()=>{var E;if(!e.setFullScreen)return(E=e.toggleFullScreen)==null?void 0:E.call(e);Up(!$h),e.setFullScreen(!$h),wt({fullScreen:!$h})};z.useEffect(()=>{var E;c.fullScreen&&((E=e.setFullScreen)==null||E.call(e,!0))},[e]);';

const newD2Block = 'h2=!0,d2=(E)=>{const X=typeof E=="boolean"?E:!$h;Up(X),wt({fullScreen:X});try{document.body.classList.toggle("nr-fullscreen",X)}catch(_){}if(e.setFullScreen){try{e.setFullScreen(X)}catch(_){}}else if(e.toggleFullScreen){try{e.toggleFullScreen()}catch(_){}}try{X?(document.documentElement.requestFullscreen&&!document.fullscreenElement&&document.documentElement.requestFullscreen().catch(()=>{})):(document.fullscreenElement&&document.exitFullscreen&&document.exitFullscreen().catch(()=>{}))}catch(_){}};z.useEffect(()=>{c.fullScreen&&d2(!0);const E=X=>{if(X.key==="Escape"&&($h||document.body.classList.contains("nr-fullscreen")||document.fullscreenElement)){X.preventDefault(),d2(!1)}},ae=()=>{document.fullscreenElement||e.setFullScreen||(Up(!1),wt({fullScreen:!1}),document.body.classList.remove("nr-fullscreen"))};return window.addEventListener("keydown",E,!0),document.addEventListener("fullscreenchange",ae),()=>{window.removeEventListener("keydown",E,!0),document.removeEventListener("fullscreenchange",ae)}},[$h,e]);';

if (!content.includes(oldD2Block)) throw new Error('Could not find oldD2Block');
content = content.replace(oldD2Block, newD2Block);
console.log('4. Replaced oldD2Block');

// 3. Add Fullscreen button to tb-title next to Zoom In (+)
const oldZoomInBtn = 'f.jsx("button",{className:"tb-zoom-step-btn",title:"Phóng to trang (+)",onClick:()=>Z==null?void 0:Z.setZoom(Math.min(5,Math.round((((i==null?void 0:i.zoom)??1)*1.2)*100)/100)),style:{width:"22px",height:"24px",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:"transparent",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"700",padding:0,margin:"0 2px",color:"inherit"},children:"+"})';

const newZoomInWithFsBtn = 'f.jsx("button",{className:"tb-zoom-step-btn",title:"Phóng to trang (+)",onClick:()=>Z==null?void 0:Z.setZoom(Math.min(5,Math.round((((i==null?void 0:i.zoom)??1)*1.2)*100)/100)),style:{width:"22px",height:"24px",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:"transparent",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"700",padding:0,margin:"0 2px",color:"inherit"},children:"+"}),f.jsx("button",{className:"tb-zoom-step-btn tb-fullscreen-toggle",title:$h?"Thu nhỏ cửa sổ (Bấm phím ESC)":"Phóng to toàn màn hình",onClick:()=>d2(),style:{width:"24px",height:"24px",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:$h?"rgba(225,29,72,0.15)":"transparent",color:$h?"#e11d48":"inherit",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,margin:"0 2px"},children:$h?f.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:f.jsx("path",{d:"M4 14h6v6m10-10h-6V4m0 6 7-7M3 21l7-7"})}):f.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:f.jsx("path",{d:"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"})})})';

if (!content.includes(oldZoomInBtn)) throw new Error('Could not find oldZoomInBtn');
content = content.replace(oldZoomInBtn, newZoomInWithFsBtn);
console.log('5. Added Fullscreen button to tb-title');

console.log('Validating modified code with Acorn parser...');
acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('Acorn validation SUCCESSFUL! 100% clean!');

fs.writeFileSync(bundlePath, content, 'utf8');
console.log('Saved to', bundlePath);
