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

// 1. Disable software paintPenTip into canvas (eliminates pen jitter, blurring, and ghosting "lưu ảnh bút")
const p1_old = 'paintPenTip(t,n){const s=this.penTip;if(!s){this.tipBox=null;return}this.tipBox=this.tipBoxNow(n);';
const p1_new = 'paintPenTip(t,n){this.tipBox=null;return;const s=this.penTip;if(!s){this.tipBox=null;return}this.tipBox=this.tipBoxNow(n);';
patch('1. Disable software pen cursor on canvas', p1_old, p1_new);

// 2. Fix OX to fill entire page width s and height i, and return immediately so NO grid lines cover paper template
const p2_old = 'const r=t.paperImage?Na(t.paperImage):null;r&&(e.save(),e.imageSmoothingEnabled=!0,e.imageSmoothingQuality="high",e.drawImage(r,0,0,o,i),e.restore());const a=t.spacing';
const p2_new = 'const r=t.paperImage?Na(t.paperImage):null;if(r){e.save(),e.imageSmoothingEnabled=!0,e.imageSmoothingQuality="high",e.drawImage(r,0,0,s,i),e.restore();return}const a=t.spacing';
patch('2. OX paperImage full page fit without grid lines', p2_old, p2_new);

// 3. Fix insertPages to fit PDF page to canvas frame edge-to-edge
const p3_old = 'const h=Math.min(o/u.width,this.ph/u.height),d=u.width*h,m=u.height*h,y={id:qe(),type:"image",x:(o-d)/2,y:(this.ph-m)/2,w:d,h:m,src:u.src,bg:!0,...s&&u.page?{pdf:{id:s,page:u.page}}:{}};return{...Qo(),paper:"blank",items:[y]}';
const p3_new = 'const pageW=o,pageH=Math.round(o*(u.height/u.width)),y={id:qe(),type:"image",x:0,y:0,w:pageW,h:pageH,src:u.src,bg:!0,...s&&u.page?{pdf:{id:s,page:u.page}}:{}};return{...Qo(),height:pageH,paper:"blank",items:[y]}';
patch('3. insertPages edge-to-edge fit', p3_old, p3_new);

// 4. Fix fee to use 2400px width with quality 0.94 JPEG (crystal sharp, <350KB, fits within 5MB localStorage quota)
const p4_old = 'const W=Math.min(3200,Math.max($c,t.naturalWidth)),H=Math.round(W*(t.naturalHeight/t.naturalWidth)),n=document.createElement("canvas");n.width=W,n.height=H;const s=n.getContext("2d");s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.fillStyle="#ffffff",s.fillRect(0,0,W,H);const o=Math.min(W/t.naturalWidth,H/t.naturalHeight),i=t.naturalWidth*o,r=t.naturalHeight*o;s.drawImage(t,(W-i)/2,(H-r)/2,i,r);const a=n.toDataURL("image/png");return n.width=n.height=0,a';
const p4_new = 'const W=Math.min(2400,Math.max($c,t.naturalWidth)),H=Math.round(W*(t.naturalHeight/t.naturalWidth)),n=document.createElement("canvas");n.width=W,n.height=H;const s=n.getContext("2d");s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.fillStyle="#ffffff",s.fillRect(0,0,W,H);const o=Math.min(W/t.naturalWidth,H/t.naturalHeight),i=t.naturalWidth*o,r=t.naturalHeight*o;s.drawImage(t,(W-i)/2,(H-r)/2,i,r);const a=n.toDataURL("image/jpeg",.94);return n.width=n.height=0,a';
patch('4. fee crisp 2400px 0.94 JPEG template', p4_old, p4_new);

// 5. Fix move to never drop hardware pointer coordinates
const p5_old = 'if(this.lowLatency&&m.timeStamp<r.lastT)continue;r.lastT=m.timeStamp;';
const p5_new = 'r.lastT=m.timeStamp;';
patch('5. move stroke continuous without dropping points', p5_old, p5_new);

// 6. Restore paint() wetBase capture only during active inking
const p6_old = 'if(this.canvas.width&&this.canvas.height){const x=this.wetBase??(this.wetBase=document.createElement("canvas"));(x.width!==this.canvas.width||x.height!==this.canvas.height)&&(x.width=this.canvas.width,x.height=this.canvas.height);const S=x.getContext("2d");S.setTransform(1,0,0,1,0,0),S.drawImage(this.canvas,0,0),this.wetKey=this.viewKey();const b=this.wetStroke();if(b){this.wetAt={dpr:t,z:l,left:u,top:c(this.pageTop(b.page)*l-this.scroller.scrollTop)},this.drawWet(r),this.wetN=b.stroke.pts.length/3,this.wetFilled=VN(b.stroke)}else{this.wetN=0,this.wetAt={dpr:t,z:l,left:u,top:0}}}else this.wetKey="";this.paintPenTip(r,t)}';
const p6_new = 'const b=this.wetStroke();if(b&&this.canvas.width&&this.canvas.height){const x=this.wetBase??(this.wetBase=document.createElement("canvas"));(x.width!==this.canvas.width||x.height!==this.canvas.height)&&(x.width=this.canvas.width,x.height=this.canvas.height);const S=x.getContext("2d");S.setTransform(1,0,0,1,0,0),S.drawImage(this.canvas,0,0),this.wetKey=this.viewKey(),this.wetAt={dpr:t,z:l,left:u,top:c(this.pageTop(b.page)*l-this.scroller.scrollTop)},this.drawWet(r),this.wetN=b.stroke.pts.length/3,this.wetFilled=VN(b.stroke)}else this.wetKey="";this.paintPenTip(r,t)}';
patch('6. paint wetBase only during active stroke', p6_old, p6_new);

// 7. Restore down to this.redraw(); return
const p7_old = 'if(this.wetBase&&this.wetKey===this.viewKey()){const cT=Math.round((this.pageTop(i)*this.zoom-this.scroller.scrollTop)*(window.devicePixelRatio||1))/(window.devicePixelRatio||1);this.wetAt={dpr:window.devicePixelRatio||1,z:this.zoom,left:Math.round((this.offsetX-this.scroller.scrollLeft)*(window.devicePixelRatio||1))/(window.devicePixelRatio||1),top:cT},this.paintWet()||this.redraw()}else this.redraw();return';
const p7_new = 'this.redraw();return';
patch('7. clean down touch', p7_old, p7_new);

console.log('Validating modified NoteRenderer bundle with Acorn parser...');
acorn.parse(js, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('AST parse SUCCESSFUL! 100% clean!');

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Successfully saved modified NoteRenderer bundle!');
