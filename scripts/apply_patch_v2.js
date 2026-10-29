const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let content = fs.readFileSync(bundlePath, 'utf8');

// 1. Fix paintPenTip
const oldPaintPenTip = 'paintPenTip(t,n){this.tipBox=null;return;this.tipBox=this.tipBoxNow(n);const i=this.host.dataset.cursor;t.save(),t.setTransform(n,0,0,n,n*s.sx,n*s.sy),t.lineJoin="round",i==="dot"?(t.beginPath(),t.arc(0,0,2.6,0,Math.PI*2),t.fillStyle="#222",t.fill(),t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke()):i==="system"||i==="hand"?/Mac/.test(navigator.platform)?(t.fillStyle="#222",t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke(jd().arrow),t.fill(jd().arrow)):(t.setTransform(1,0,0,1,Math.round(n*s.sx),Math.round(n*s.sy)),t.fillStyle="#fff",t.strokeStyle="#000",t.lineWidth=1,t.fill(jd().arrow),t.stroke(jd().arrow)):(t.translate(-2,-22),t.fillStyle="#fff",t.strokeStyle="#222",t.lineWidth=1.4,t.fill(jd().body),t.stroke(jd().body),t.fillStyle="#222",t.fill(jd().point)),t.restore()}';

const newPaintPenTip = 'paintPenTip(t,n){const s=this.penTip;if(!s){this.tipBox=null;return;}this.tipBox=this.tipBoxNow(n);const i=this.host.dataset.cursor||"pen";t.save(),t.setTransform(n,0,0,n,n*s.sx,n*s.sy),t.lineJoin="round",i==="dot"?(t.beginPath(),t.arc(0,0,2.8,0,Math.PI*2),t.fillStyle="#222",t.fill(),t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke()):i==="system"||i==="hand"?/Mac/.test(navigator.platform)?(t.fillStyle="#222",t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke(jd().arrow),t.fill(jd().arrow)):(t.setTransform(1,0,0,1,Math.round(n*s.sx),Math.round(n*s.sy)),t.fillStyle="#fff",t.strokeStyle="#000",t.lineWidth=1,t.fill(jd().arrow),t.stroke(jd().arrow)):(t.translate(-2,-22),t.fillStyle="#ffffff",t.strokeStyle="#222222",t.lineWidth=1.4,t.fill(jd().body),t.stroke(jd().body),t.fillStyle="#222222",t.fill(jd().point)),t.restore()}';

if (!content.includes(oldPaintPenTip)) {
  throw new Error('Could not find oldPaintPenTip in bundle');
}
content = content.replace(oldPaintPenTip, newPaintPenTip);
console.log('1. Fixed paintPenTip successfully');

// 2. Ensure penTip is always set on down and move
const oldDownPenTip = 'this.showPointer(t),t.pointerType==="pen"&&(this.penTip={sx:n,sy:s})';
const newDownPenTip = 'this.showPointer(t),(t.pointerType==="pen"||t.pointerType==="mouse"||this.tool.k==="pen"||this.tool.k==="highlighter"||this.tool.k==="scratch")&&(this.penTip={sx:n,sy:s})';

if (!content.includes(oldDownPenTip)) {
  throw new Error('Could not find oldDownPenTip');
}
content = content.replace(oldDownPenTip, newDownPenTip);
console.log('2. Fixed down penTip successfully');

const oldMovePenTip = 't.pointerType==="pen"&&(this.penTip={sx:s,sy:o})';
const newMovePenTip = '(t.pointerType==="pen"||t.pointerType==="mouse"||r.k==="ink")&&(this.penTip={sx:s,sy:o})';

if (!content.includes(oldMovePenTip)) {
  throw new Error('Could not find oldMovePenTip');
}
content = content.replace(oldMovePenTip, newMovePenTip);
console.log('3. Fixed move penTip successfully');

// 3. Add Zoom In (+) and Zoom Out (-) buttons next to zoom percentage in tb-title
const idxTbTitleStart = content.indexOf('children:bt("pageZoom")&&f.jsxs(f.Fragment,{children:[f.jsx(Oo,{align:"center",open:Bt==="page"');
const idxTbTitleEnd = content.indexOf('className:"tb-group tools"', idxTbTitleStart);
if (idxTbTitleStart === -1 || idxTbTitleEnd === -1) {
  throw new Error('Could not find tb-title block');
}

const oldFullTbTitle = content.substring(idxTbTitleStart, idxTbTitleEnd);
console.log('Found tb-title block, length:', oldFullTbTitle.length);

const newFullTbTitle = `children:bt("pageZoom")&&f.jsxs(f.Fragment,{children:[f.jsx(Oo,{align:"center",open:Bt==="page",setOpen:E=>_t(E?"page":""),button:f.jsxs("button",{className:"zoom-button",onClick:()=>{hr(String(((i==null?void 0:i.page)??0)+1)),_t(Bt==="page"?"":"page")},children:[i?i.page+1:1," / ",(i==null?void 0:i.pages)??1]}),children:p0(!e.mobile)}),f.jsx("span",{className:"dot",children:"·"}),f.jsx("button",{className:"tb-zoom-step-btn",title:"Thu nhỏ trang (-)",onClick:()=>Z==null?void 0:Z.setZoom(Math.max(.2,Math.round((((i==null?void 0:i.zoom)??1)/1.2)*100)/100)),style:{width:"22px",height:"24px",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:"transparent",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"700",padding:0,margin:"0 2px",color:"inherit"},children:"−"}),f.jsxs(Oo,{align:"center",open:Bt==="zoom",setOpen:E=>_t(E?"zoom":""),button:f.jsx("button",{className:"zoom-button",onClick:()=>{Ur(String(Math.round(((i==null?void 0:i.zoom)??1)*100))),_t(Bt==="zoom"?"":"zoom")},children:og}),children:[f.jsxs("form",{className:"zoom-input",onClick:E=>E.stopPropagation(),onSubmit:E=>{E.preventDefault();const X=Number(Oh.replace(",","."));!Number.isFinite(X)||X<=0||(Z==null||Z.setZoom(X/100),_t(""))},children:[f.jsxs("label",{children:[n.zoomTo,f.jsx("input",{type:"text",inputMode:"decimal",value:Oh,autoFocus:!e.mobile,onFocus:E=>E.target.select(),onChange:E=>Ur(E.target.value)}),"%"]}),f.jsx("button",{type:"submit",className:"zoom-apply",children:n.apply})]}),f.jsx("hr",{}),f.jsxs("button",{className:i!=null&&i.zoomLock?"checked":"",onClick:()=>Z==null?void 0:Z.setZoomLock(!(i!=null&&i.zoomLock)),children:[n.zoomLock,f.jsx("kbd",{children:bn("zoomLock")})]}),f.jsxs("button",{onClick:()=>Z==null?void 0:Z.fitWidth(),children:[n.fitWidth,f.jsx("kbd",{children:bn("fitWidth")})]}),[.5,.75,1,1.5,2,3].map(E=>f.jsxs("button",{onClick:()=>Z==null?void 0:Z.setZoom(E),children:[E*100,"%"]},E))]}),f.jsx("button",{className:"tb-zoom-step-btn",title:"Phóng to trang (+)",onClick:()=>Z==null?void 0:Z.setZoom(Math.min(5,Math.round((((i==null?void 0:i.zoom)??1)*1.2)*100)/100)),style:{width:"22px",height:"24px",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:"transparent",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"700",padding:0,margin:"0 2px",color:"inherit"},children:"+"})]}),f.jsx("div",{`;

// Check ending of oldFullTbTitle
console.log('oldFullTbTitle end:', oldFullTbTitle.slice(-20));
// It ends with: ...[E*100,"%"]},E))]})]})}),f.jsx("div",{
// Note the closing: E))]})]})}),f.jsx("div",{
// In newFullTbTitle: ...children:"+"})]})}),f.jsx("div",{
const correctedNewFullTbTitle = `children:bt("pageZoom")&&f.jsxs(f.Fragment,{children:[f.jsx(Oo,{align:"center",open:Bt==="page",setOpen:E=>_t(E?"page":""),button:f.jsxs("button",{className:"zoom-button",onClick:()=>{hr(String(((i==null?void 0:i.page)??0)+1)),_t(Bt==="page"?"":"page")},children:[i?i.page+1:1," / ",(i==null?void 0:i.pages)??1]}),children:p0(!e.mobile)}),f.jsx("span",{className:"dot",children:"·"}),f.jsx("button",{className:"tb-zoom-step-btn",title:"Thu nhỏ trang (-)",onClick:()=>Z==null?void 0:Z.setZoom(Math.max(.2,Math.round((((i==null?void 0:i.zoom)??1)/1.2)*100)/100)),style:{width:"22px",height:"24px",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:"transparent",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"700",padding:0,margin:"0 2px",color:"inherit"},children:"−"}),f.jsxs(Oo,{align:"center",open:Bt==="zoom",setOpen:E=>_t(E?"zoom":""),button:f.jsx("button",{className:"zoom-button",onClick:()=>{Ur(String(Math.round(((i==null?void 0:i.zoom)??1)*100))),_t(Bt==="zoom"?"":"zoom")},children:og}),children:[f.jsxs("form",{className:"zoom-input",onClick:E=>E.stopPropagation(),onSubmit:E=>{E.preventDefault();const X=Number(Oh.replace(",","."));!Number.isFinite(X)||X<=0||(Z==null||Z.setZoom(X/100),_t(""))},children:[f.jsxs("label",{children:[n.zoomTo,f.jsx("input",{type:"text",inputMode:"decimal",value:Oh,autoFocus:!e.mobile,onFocus:E=>E.target.select(),onChange:E=>Ur(E.target.value)}),"%"]}),f.jsx("button",{type:"submit",className:"zoom-apply",children:n.apply})]}),f.jsx("hr",{}),f.jsxs("button",{className:i!=null&&i.zoomLock?"checked":"",onClick:()=>Z==null?void 0:Z.setZoomLock(!(i!=null&&i.zoomLock)),children:[n.zoomLock,f.jsx("kbd",{children:bn("zoomLock")})]}),f.jsxs("button",{onClick:()=>Z==null?void 0:Z.fitWidth(),children:[n.fitWidth,f.jsx("kbd",{children:bn("fitWidth")})]}),[.5,.75,1,1.5,2,3].map(E=>f.jsxs("button",{onClick:()=>Z==null?void 0:Z.setZoom(E),children:[E*100,"%"]},E))]}),f.jsx("button",{className:"tb-zoom-step-btn",title:"Phóng to trang (+)",onClick:()=>Z==null?void 0:Z.setZoom(Math.min(5,Math.round((((i==null?void 0:i.zoom)??1)*1.2)*100)/100)),style:{width:"22px",height:"24px",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:"transparent",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"700",padding:0,margin:"0 2px",color:"inherit"},children:"+"})]})}),f.jsx("div",{`;

content = content.substring(0, idxTbTitleStart) + correctedNewFullTbTitle + content.substring(idxTbTitleEnd);
console.log('4. Added Phóng to (+) & Thu nhỏ (-) buttons in tb-title successfully');

// 4. Add Fullscreen (Phóng to toàn màn hình) button to tb-group actions
const oldActionsEnd = 'f.jsx(Nt,{title:_5?"Thanh công cụ: Chuyển về 1 dòng":"Thanh công cụ: Hiển thị 2 dòng",on:_5,onClick:toggleTwoRows,children:f.jsx("span",{style:{fontSize:"13px",fontWeight:"bold",color:"var(--muted, #555)"},children:"2☰"})})]})';

const newActionsEnd = 'f.jsx(Nt,{title:$h?"Thu nhỏ cửa sổ (F11)":"Phóng to toàn màn hình (F11)",on:$h,onClick:d2,children:$h?f.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:f.jsx("path",{d:"M4 14h6v6m10-10h-6V4m0 6 7-7M3 21l7-7"})}):f.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:f.jsx("path",{d:"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"})})}),f.jsx(Nt,{title:_5?"Thanh công cụ: Chuyển về 1 dòng":"Thanh công cụ: Hiển thị 2 dòng",on:_5,onClick:toggleTwoRows,children:f.jsx("span",{style:{fontSize:"13px",fontWeight:"bold",color:"var(--muted, #555)"},children:"2☰"})})]})';

if (!content.includes(oldActionsEnd)) {
  throw new Error('Could not find oldActionsEnd in tb-group actions');
}
content = content.replace(oldActionsEnd, newActionsEnd);
console.log('5. Added Fullscreen (Phóng to toàn màn hình) button successfully');

console.log('Validating modified bundle with Acorn parser...');
acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('AST parse SUCCESSFUL! 100% clean!');

fs.writeFileSync(bundlePath, content, 'utf8');
console.log('Saved modified bundle to:', bundlePath);
