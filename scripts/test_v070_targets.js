const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

console.log('File size:', js.length);

const targets = {
  pressureOf: 'pressureOf(t){return t.pointerType==="pen"&&this.pen.pressure!==!1&&t.pressure||.5}',
  OX_paperImage: 'const _cp=t.pages[n];if(_cp&&(_cp.paper==="blank"||(_cp.items&&_cp.items.some(x=>x.bg&&x.pdf))))return;const r=t.paperImage?la(t.paperImage):null;if(r){e.save(),e.imageSmoothingEnabled=!0,e.imageSmoothingQuality="high",e.drawImage(r,0,0,o,i),e.restore();return}',
  penButton_dict_vi: 'penButton:"Giữ nút trên bút (S Pen, bút Surface)",penButtons:{select:"Chọn vùng",erase:"Tẩy"},',
  penButton_dict_en: 'penButton:"Holding the pen\'s button (S Pen, Surface pen)",penButtons:{select:"Selects",erase:"Erases"},',
  penButton_dJ: 'p.jsx("h4",{children:ht.penButton}),p.jsx("div",{className:"paper-choices cursors",children:dJ.map(xe=>p.jsxs("button",{className:`paper-choice${B===xe?" on":""}`,onClick:()=>K(xe),children:[xe==="erase"?p.jsx(me.eraser,{}):p.jsx(me.select,{}),ht.penButtons[xe]]},xe))})',
  penButton_pointerdown: 'astDown={t:l?0:a,x:n,y:o},this.capture(t.pointerId),t.pointerType==="pen"&&this.penButton==="select"&&(t.button===2||(t.buttons&2)!==0)&&t.button!==5&&(t.buttons&32)===0){if(this.tool.k!=="select"){const g=this.tool;this.setTool({k:"select"}),this.selectFrom=g',
  penButton_validation: 'const f=ko(["select","erase"],o.penButton);',
  zoomInBtn: 'p.jsx("button",{className:"tb-zoom-step-btn",title:"Phóng to trang (+)",onClick:()=>Q==null?void 0:Q.setZoom(Math.min(5,Math.round((((s==null?void 0:s.zoom)??1)*1.2)*100)/100)),style:{width:"22px",height:"24px",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:"transparent",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"700",padding:0,margin:"0 2px",color:"inherit"},children:"+"})',
  recordStop: 'const $e=h?await h.stop():null;h=null,gt&&gt.remove(),gt=null,l.setRecording(!1)',
};

for (const [key, str] of Object.entries(targets)) {
  const found = js.includes(str);
  console.log(key, ':', found ? 'FOUND' : 'NOT FOUND');
  if (!found) {
    // Search for partial match
    const prefix = str.substring(0, 30);
    const partial = js.includes(prefix);
    console.log('  partial [' + prefix + ']:', partial);
  }
}
