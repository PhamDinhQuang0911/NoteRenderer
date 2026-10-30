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

// 1. Fix d2 and do NOT persist fullScreen in permanent settings across launches
const oldD2Block = 'h2=!0,d2=(E)=>{const X=typeof E=="boolean"?E:!$h;Up(X),wt({fullScreen:X});try{document.body.classList.toggle("nr-fullscreen",X)}catch(_){}if(e.setFullScreen){try{e.setFullScreen(X)}catch(_){}}else if(e.toggleFullScreen){try{e.toggleFullScreen()}catch(_){}}try{X?(document.documentElement.requestFullscreen&&!document.fullscreenElement&&document.documentElement.requestFullscreen().catch(()=>{})):(document.fullscreenElement&&document.exitFullscreen&&document.exitFullscreen().catch(()=>{}))}catch(_){}};z.useEffect(()=>{c.fullScreen&&d2(!0);const E=X=>{if(X.key==="Escape"&&($h||document.body.classList.contains("nr-fullscreen")||document.fullscreenElement)){X.preventDefault(),d2(!1)}},ae=()=>{document.fullscreenElement||e.setFullScreen||(Up(!1),wt({fullScreen:!1}),document.body.classList.remove("nr-fullscreen"))};return window.addEventListener("keydown",E,!0),document.addEventListener("fullscreenchange",ae),()=>{window.removeEventListener("keydown",E,!0),document.removeEventListener("fullscreenchange",ae)}},[$h,e]);';

const newD2Block = 'h2=!0,d2=(E)=>{const X=typeof E=="boolean"?E:!$h;Up(X);try{document.body.classList.toggle("nr-fullscreen",X)}catch(_){}if(e.setFullScreen){try{e.setFullScreen(X)}catch(_){}}else if(e.toggleFullScreen){try{e.toggleFullScreen()}catch(_){}}try{X?(document.documentElement.requestFullscreen&&!document.fullscreenElement&&document.documentElement.requestFullscreen().catch(()=>{})):(document.fullscreenElement&&document.exitFullscreen&&document.exitFullscreen().catch(()=>{}))}catch(_){}};z.useEffect(()=>{const E=X=>{if(X.key==="Escape"&&($h||document.body.classList.contains("nr-fullscreen")||document.fullscreenElement)){X.preventDefault(),d2(!1)}},ae=()=>{if(!document.fullscreenElement&&!$h){Up(!1);try{document.body.classList.remove("nr-fullscreen")}catch(_){}}};return window.addEventListener("keydown",E,!0),document.addEventListener("fullscreenchange",ae),()=>{window.removeEventListener("keydown",E,!0),document.removeEventListener("fullscreenchange",ae)}},[$h,e]);';

patch('1. Do not persist fullScreen across launches', oldD2Block, newD2Block);

// 2. Pre-capture wetBase in paint() even at idle (so inking never needs full repaint)
const oldPaintWetBase = 'const b=this.wetStroke();if(b&&this.canvas.width&&this.canvas.height){const x=this.wetBase??(this.wetBase=document.createElement("canvas"));(x.width!==this.canvas.width||x.height!==this.canvas.height)&&(x.width=this.canvas.width,x.height=this.canvas.height);const S=x.getContext("2d");S.setTransform(1,0,0,1,0,0),S.drawImage(this.canvas,0,0),this.wetKey=this.viewKey(),this.wetAt={dpr:t,z:l,left:u,top:c(this.pageTop(b.page)*l-this.scroller.scrollTop)},this.drawWet(r),this.wetN=b.stroke.pts.length/3,this.wetFilled=VN(b.stroke)}else this.wetKey="";this.paintPenTip(r,t)';

const newPaintWetBase = 'if(this.canvas.width&&this.canvas.height){const x=this.wetBase??(this.wetBase=document.createElement("canvas"));(x.width!==this.canvas.width||x.height!==this.canvas.height)&&(x.width=this.canvas.width,x.height=this.canvas.height);const S=x.getContext("2d");S.setTransform(1,0,0,1,0,0),S.drawImage(this.canvas,0,0),this.wetKey=this.viewKey();const b=this.wetStroke();if(b){this.wetAt={dpr:t,z:l,left:u,top:c(this.pageTop(b.page)*l-this.scroller.scrollTop)},this.drawWet(r),this.wetN=b.stroke.pts.length/3,this.wetFilled=VN(b.stroke)}else{this.wetN=0,this.wetAt={dpr:t,z:l,left:u,top:0}}}else this.wetKey="";this.paintPenTip(r,t)';

patch('2. Pre-capture wetBase at idle in paint()', oldPaintWetBase, newPaintWetBase);

// 3. Instant inking on pointerdown in press() without calling this.redraw()
const oldCasePen = 'case"pen":case"scratch":case"laser":case"highlighter":{const y=this.tool.k==="laser",b=this.tool.k==="highlighter"?"highlighter":"pen",v=y?{color:this.laserHue??sk(this.pen.color),width:Math.max(3,this.pen.width)}:b==="pen"?this.pen:this.highlighter,k=y?.5:this.pressureOf(t);let w=null;const x=this.instrumentShown?rL(this.instrument,o,v.width):null;if(x){const A=this.pageTop(i);w=C=>{const _=x({x:C.x,y:C.y+A});return{x:_.x,y:_.y-A}}}const S=w?w(r):r;this.drag={k:"ink",page:i,snap:w,straight:y?!1:t.shiftKey?"snap":performance.now()-this.shiftAt<bZ?"free":!1,still:{x:t.clientX,y:t.clientY},lastT:t.timeStamp,mode:this.tool.k==="scratch"?"scratch":y?"laser":"ink",stroke:{id:qe(),kind:b,color:v.color,width:v.width,pts:[S.x,S.y,k],...this.dashed&&!y?{dashed:!0}:{},...b==="pen"&&!y&&this.pen.type!=="ballpoint"?{pen:this.pen.type}:{},...b==="pen"&&!y&&(this.pen.smooth??1)!==1?{smooth:this.pen.smooth}:{},...b==="highlighter"&&this.highlighter.alpha!==void 0?{alpha:this.highlighter.alpha}:{}}},this.redraw();return}';

const newCasePen = 'case"pen":case"scratch":case"laser":case"highlighter":{const y=this.tool.k==="laser",b=this.tool.k==="highlighter"?"highlighter":"pen",v=y?{color:this.laserHue??sk(this.pen.color),width:Math.max(3,this.pen.width)}:b==="pen"?this.pen:this.highlighter,k=y?.5:this.pressureOf(t);let w=null;const x=this.instrumentShown?rL(this.instrument,o,v.width):null;if(x){const A=this.pageTop(i);w=C=>{const _=x({x:C.x,y:C.y+A});return{x:_.x,y:_.y-A}}}const S=w?w(r):r;this.drag={k:"ink",page:i,snap:w,straight:y?!1:t.shiftKey?"snap":performance.now()-this.shiftAt<bZ?"free":!1,still:{x:t.clientX,y:t.clientY},lastT:t.timeStamp,mode:this.tool.k==="scratch"?"scratch":y?"laser":"ink",stroke:{id:qe(),kind:b,color:v.color,width:v.width,pts:[S.x,S.y,k],...this.dashed&&!y?{dashed:!0}:{},...b==="pen"&&!y&&this.pen.type!=="ballpoint"?{pen:this.pen.type}:{},...b==="pen"&&!y&&(this.pen.smooth??1)!==1?{smooth:this.pen.smooth}:{},...b==="highlighter"&&this.highlighter.alpha!==void 0?{alpha:this.highlighter.alpha}:{}}};if(this.wetBase&&this.wetKey===this.viewKey()){const cT=Math.round((this.pageTop(i)*this.zoom-this.scroller.scrollTop)*(window.devicePixelRatio||1))/(window.devicePixelRatio||1);this.wetAt={dpr:window.devicePixelRatio||1,z:this.zoom,left:Math.round((this.offsetX-this.scroller.scrollLeft)*(window.devicePixelRatio||1))/(window.devicePixelRatio||1),top:cT},this.paintWet()||this.redraw()}else this.redraw();return}';

patch('3. Instant wet inking on pointerdown', oldCasePen, newCasePen);

// 4. Remove dataset.writing to stop Windows OS cursor recreation flicker
const oldDownWriting = 'try{this.scroller.dataset.writing="true";}catch(_){}';
const newDownWriting = '';
patch('4a. Remove dataset.writing on down', oldDownWriting, newDownWriting);

const oldUpWriting = 'try{this.scroller.dataset.writing="false";}catch(_){}';
const newUpWriting = '';
patch('4b. Remove dataset.writing on up', oldUpWriting, newUpWriting);

// 5. Append clean-up script at startup to ensure body never has nr-fullscreen and settings has no fullScreen
const cleanupSnippet = ';if(typeof window!=="undefined"){try{document.body.classList.remove("nr-fullscreen");const _s=JSON.parse(localStorage.getItem("settings")||"null");if(_s&&_s.fullScreen){delete _s.fullScreen;localStorage.setItem("settings",JSON.stringify(_s));}}catch(_){}}';
js += cleanupSnippet;

console.log('Validating modified JS bundle with Acorn...');
acorn.parse(js, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('Acorn validation 100% SUCCESSFUL!');

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Saved patched JS to:', jsPath);

// Now patch CSS
const cssPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-Cyl3OjHe.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Ensure fullscreen toggle button is always cleanly styled
const extraCss = `
/* Fullscreen Toggle Button in Toolbar */
.tb-zoom-step-btn.tb-fullscreen-toggle {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 26px !important;
  height: 26px !important;
  border-radius: 6px !important;
  border: 1.5px solid rgba(0, 0, 0, 0.18) !important;
  background: #f8fafc !important;
  color: #334155 !important;
  cursor: pointer !important;
  margin: 0 4px !important;
  transition: all 0.15s ease !important;
}
.tb-zoom-step-btn.tb-fullscreen-toggle:hover {
  background: #e2e8f0 !important;
  border-color: #0284c7 !important;
  color: #0284c7 !important;
  transform: scale(1.05) !important;
}
body.nr-fullscreen .tb-zoom-step-btn.tb-fullscreen-toggle {
  background: rgba(225, 29, 72, 0.12) !important;
  color: #e11d48 !important;
  border-color: rgba(225, 29, 72, 0.35) !important;
}
`;

css += extraCss;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('[OK] Appended fullscreen toggle CSS styles');
