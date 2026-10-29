const fs = require('fs');

const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let content = fs.readFileSync(bundlePath, 'utf8');

// 1. Fix paintPenTip
const oldPaintPenTip = 'paintPenTip(t,n){this.tipBox=null;return;this.tipBox=this.tipBoxNow(n);const i=this.host.dataset.cursor;t.save(),t.setTransform(n,0,0,n,n*s.sx,n*s.sy),t.lineJoin="round",i==="dot"?(t.beginPath(),t.arc(0,0,2.6,0,Math.PI*2),t.fillStyle="#222",t.fill(),t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke()):i==="system"||i==="hand"?/Mac/.test(navigator.platform)?(t.fillStyle="#222",t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke(jd().arrow),t.fill(jd().arrow)):(t.setTransform(1,0,0,1,Math.round(n*s.sx),Math.round(n*s.sy)),t.fillStyle="#fff",t.strokeStyle="#000",t.lineWidth=1,t.fill(jd().arrow),t.stroke(jd().arrow)):(t.translate(-2,-22),t.fillStyle="#fff",t.strokeStyle="#222",t.lineWidth=1.4,t.fill(jd().body),t.stroke(jd().body),t.fillStyle="#222",t.fill(jd().point)),t.restore()}';

const newPaintPenTip = 'paintPenTip(t,n){const s=this.penTip;if(!s){this.tipBox=null;return;}this.tipBox=this.tipBoxNow(n);const i=this.host.dataset.cursor||"pen";t.save(),t.setTransform(n,0,0,n,n*s.sx,n*s.sy),t.lineJoin="round",i==="dot"?(t.beginPath(),t.arc(0,0,2.8,0,Math.PI*2),t.fillStyle="#222",t.fill(),t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke()):i==="system"||i==="hand"?/Mac/.test(navigator.platform)?(t.fillStyle="#222",t.strokeStyle="#fff",t.lineWidth=1.2,t.stroke(jd().arrow),t.fill(jd().arrow)):(t.setTransform(1,0,0,1,Math.round(n*s.sx),Math.round(n*s.sy)),t.fillStyle="#fff",t.strokeStyle="#000",t.lineWidth=1,t.fill(jd().arrow),t.stroke(jd().arrow)):(t.translate(-2,-22),t.fillStyle="#ffffff",t.strokeStyle="#222222",t.lineWidth=1.4,t.fill(jd().body),t.stroke(jd().body),t.fillStyle="#222222",t.fill(jd().point)),t.restore()}';

content = content.replace(oldPaintPenTip, newPaintPenTip);

// 2. Ensure penTip is always set on down and move
const oldDownPenTip = 'this.showPointer(t),t.pointerType==="pen"&&(this.penTip={sx:n,sy:s})';
const newDownPenTip = 'this.showPointer(t),(t.pointerType==="pen"||t.pointerType==="mouse"||this.tool.k==="pen"||this.tool.k==="highlighter"||this.tool.k==="scratch")&&(this.penTip={sx:n,sy:s})';
content = content.replace(oldDownPenTip, newDownPenTip);

const oldMovePenTip = 't.pointerType==="pen"&&(this.penTip={sx:s,sy:o})';
const newMovePenTip = '(t.pointerType==="pen"||t.pointerType==="mouse"||r.k==="ink")&&(this.penTip={sx:s,sy:o})';
content = content.replace(oldMovePenTip, newMovePenTip);

// 3. Add Zoom In (+) and Zoom Out (-) buttons next to zoom percentage in tb-title
const idxTbTitleStart = content.indexOf('children:bt("pageZoom")&&f.jsxs(f.Fragment,{children:[f.jsx(Oo,{align:"center",open:Bt==="page"');
const idxTbTitleEnd = content.indexOf('className:"tb-group tools"', idxTbTitleStart);

console.log('oldFullTbTitle:');
console.log(content.substring(idxTbTitleStart, idxTbTitleEnd));

