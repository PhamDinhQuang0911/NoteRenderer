const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let content = fs.readFileSync(bundlePath, 'utf8');

function applyPatch(name, oldStr, newStr) {
  if (!content.includes(oldStr)) {
    throw new Error('Could not find target for: ' + name);
  }
  content = content.replace(oldStr, newStr);
  console.log('[OK] ' + name);
}

// 1. Expand k3 to 6 highlighter colors (Vàng, Cam, Hồng, Tím, Lam, Lục)
applyPatch('1. Expand k3',
  'k3=["#ffeb3b","#4cff73","#3ee8ff"]',
  'k3=["#ffeb3b","#ffa94d","#ff7b7b","#e57bff","#3ee8ff","#4cff73"]'
);

// 1b. Ensure hlSlots state initialization picks up all 6 colors even with old 3 slots in localStorage
applyPatch('1b. Init hlSlots with all k3 colors',
  '[L,P]=z.useState(()=>{var E;return((E=c.hlSlots)==null?void 0:E.slice(0,k3.length))??k3.map(X=>({color:X,width:j,alpha:C}))})',
  '[L,P]=z.useState(()=>{var E;const prev=((E=c.hlSlots)==null?void 0:E.slice(0,k3.length))||[];return k3.map((X,idx)=>prev[idx]||{color:X,width:j,alpha:C})})'
);

// 1c. Add quick size buttons into Jv (pen/highlighter panel)
const oldJvSlider = 'f.jsx("input",{className:"pp-width",type:"range",min:c.min,max:c.max,step:o?1:.25,value:e.width,"aria-label":i.thickness,onChange:m=>t({width:Number(m.target.value)})}),';
const newJvSlider = 'f.jsx("input",{className:"pp-width",type:"range",min:c.min,max:c.max,step:o?1:.25,value:e.width,"aria-label":i.thickness,onChange:m=>t({width:Number(m.target.value)})}),f.jsxs("div",{style:{display:"flex",gap:"4px",margin:"4px 0 8px",justifyContent:"center",flexWrap:"wrap"},children:(o?[8,14,20,28,36]:[1,2,3,4,6]).map(sz=>f.jsx("button",{type:"button",className:`swatch${e.width===sz?" on":""}`,style:{padding:"2px 7px",fontSize:"11px",fontWeight:"700",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:e.width===sz?"var(--accent,#1e293b)":"transparent",color:e.width===sz?"#fff":"inherit",cursor:"pointer"},onClick:()=>t({width:sz}),children:sz+"px"},sz))}),';
applyPatch('1c. Jv quick size buttons', oldJvSlider, newJvSlider);

// 2. Add "uniform" to LM tools list
applyPatch('2. Add uniform to LM',
  '"highlighter","dashed",',
  '"highlighter","dashed","uniform",'
);

// 2b. Add "uniform" button in E (tb-group tools)
const oldDashedInE = 'dashed:()=>bt("dashed")&&f.jsx(Nt,{title:n.dashedTip,on:i==null?void 0:i.dashed,onClick:()=>Z==null?void 0:Z.toggleDashed(),children:f.jsx(fe.dashed,{})}),';
const newDashedWithUniform = 'dashed:()=>bt("dashed")&&f.jsx(Nt,{title:n.dashedTip,on:i==null?void 0:i.dashed,onClick:()=>Z==null?void 0:Z.toggleDashed(),children:f.jsx(fe.dashed,{})}),uniform:()=>(bt("pen")||bt("highlighter"))&&f.jsx(Nt,{title:u.pressure===!1?"Nét đều: ĐANG BẬT (bấm để chuyển nét thanh đậm)":"Nét đều: ĐANG TẮT (bấm để viết các nét chữ đều nhau)",on:u.pressure===!1,className:u.pressure===!1?"on checked":"",onClick:()=>{const next=u.pressure===!1?void 0:!1;gi({pressure:next}),wt({pen:{...u,pressure:next}});try{if(Z&&Z.pen){Z.pen={...Z.pen,pressure:next}}}catch(_){}},children:f.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"2px",fontSize:"11px",fontWeight:"700",letterSpacing:"-0.2px"},children:[f.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",children:f.jsx("path",{d:"M3 9h18M3 15h18"})}),f.jsx("span",{children:"Đều"})]})}),';
applyPatch('2b. Uniform button in E', oldDashedInE, newDashedWithUniform);

// 3. iPad WebKit fixes:
// 3a. preventDefault in down(t)
applyPatch('3a. preventDefault on down',
  'down(t){try{this.scroller.dataset.writing="true";}catch(_){}',
  'down(t){if(t.pointerType==="pen"||this.tool.k==="pen"||this.tool.k==="highlighter"||this.tool.k==="scratch"||this.tool.k==="eraser"){try{t.cancelable&&t.preventDefault()}catch(_){}}try{this.scroller.dataset.writing="true";}catch(_){}'
);

// 3b. Always capture pointerdown in press(t)
applyPatch('3b. capture pointer on press',
  'pasteAt=null,this.showPointer(t),(t.pointerType==="pen"||t.pointerType==="mouse"||this.tool.k==="pen"||this.tool.k==="highlighter"||this.tool.k==="scratch")&&(this.penTip={sx:n,sy:s}),t.pointerType==="touch"){',
  'pasteAt=null,this.showPointer(t),(t.pointerType==="pen"||t.pointerType==="mouse"||this.tool.k==="pen"||this.tool.k==="highlighter"||this.tool.k==="scratch")&&(this.penTip={sx:n,sy:s}),this.capture(t.pointerId),t.pointerType==="touch"){'
);

// 3c. preventDefault on move(t) when inking
applyPatch('3c. preventDefault on move',
  'move(t){var a,l,c,u;if(this.showPointer(t)',
  'move(t){var a,l,c,u;if(this.drag&&(this.drag.k==="ink"||this.drag.k==="erase")){try{t.cancelable&&t.preventDefault()}catch(_){}}if(this.showPointer(t)'
);

// 3d. Add touchstart/touchmove passive:false prevention on scroller
const oldListeners = 'r("pointerdown",u=>this.down(u)),r("pointermove",u=>this.move(u));';
const newListeners = 'r("pointerdown",u=>this.down(u)),r("pointermove",u=>this.move(u));try{i.addEventListener("touchstart",u=>{if(u.touches.length===1&&(this.tool.k==="pen"||this.tool.k==="highlighter"||this.tool.k==="scratch"||this.tool.k==="eraser"||this.fingerDraw)){u.cancelable&&u.preventDefault()}},{passive:!1});i.addEventListener("touchmove",u=>{if(this.drag&&(this.drag.k==="ink"||this.drag.k==="erase")){u.cancelable&&u.preventDefault()}},{passive:!1});}catch(_){}';
applyPatch('3d. touch listeners on scroller', oldListeners, newListeners);

// 3e. Fix lowLatency timestamp skipping on iPad
applyPatch('3e. lowLatency timestamp skip fix',
  'if(this.lowLatency&&m.timeStamp<=r.lastT)continue;',
  'if(this.lowLatency&&m.timeStamp<r.lastT)continue;'
);

// 3f. Increase minimum pressure clamp from 0.05 to 0.20
applyPatch('3f. minimum pressure clamp',
  'return Math.max(0.05,Math.min(1,p));}return 0.05;}return.5;}',
  'return Math.max(0.2,Math.min(1,p));}return 0.2;}return.5;}'
);

// 3g. Gracefully commit in-progress stroke on pointercancel instead of discarding it
applyPatch('3g. graceful pointercancel stroke commit',
  'const s=this.drag;if(this.drag=null,!!s){if(n){this.live=null,this.redraw();return}',
  'const s=this.drag;if(this.drag=null,!!s){if(n){if(s.k==="ink"&&s.stroke&&s.stroke.pts.length>=6){this.live=null,this.commit(this.updatePage(s.page,l=>({...l,strokes:[...l.strokes,s.stroke]})));return}this.live=null,this.redraw();return}'
);

console.log('Validating modified code with Acorn parser...');
acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('AST parse SUCCESSFUL! 100% clean!');

fs.writeFileSync(bundlePath, content, 'utf8');
console.log('Saved modified bundle to:', bundlePath);
