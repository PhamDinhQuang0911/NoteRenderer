const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const needle = 'settings:()=>p.jsxs(q.Fragment,{children:[St("settings")&&p.jsx(ct,{title:n.settings,onClick:()=>te({k:"settings"}),children:p.jsx(me.settings,{})}),p.jsx(ct,{title:toolbarSide==="left"?"Chuyển thanh công cụ lên trên":"Chuyển thanh công cụ sang dọc bên trái",onClick:toggleToolbarSide,children:p.jsx("span",{style:{fontSize:"14px",fontWeight:"bold",color:"var(--muted, #555)"},children:toolbarSide==="left"?"⬆":"⬅"})}),p.jsx(ct,{title:sw?"Thanh công cụ: Chuyển về 1 dòng":"Thanh công cụ: Hiển thị 2 dòng",on:sw,onClick:toggleTwoRows,children:p.jsx("span",{style:{fontSize:"13px",fontWeight:"bold",color:"var(--muted, #555)"},children:"2☰"})})]}),record:()=>e.saveVideo&&St("record")&&p.jsx(ct,{title:n.record,on:bm,onClick:U2,children:p.jsx(me.record,{})})};return Mu.filter(X=>oD.has(X)).map(X=>{var ae;return p.jsx(q.Fragment,{children:(ae=j[X])==null?void 0:ae.call(j)},X)})})()})]}),';

console.log('Includes oldActionsGroup:', js.includes(needle));
if (!js.includes(needle)) {
  const shortNeedle = 'record:()=>e.saveVideo&&St("record")&&p.jsx(ct,{title:n.record,on:bm,onClick:U2,children:p.jsx(me.record,{})})};return Mu.filter(X=>oD.has(X)).map(X=>{var ae;return p.jsx(q.Fragment,{children:(ae=j[X])==null?void 0:ae.call(j)},X)})})()})]}),';
  console.log('Includes shortNeedle:', js.includes(shortNeedle));
  if (!js.includes(shortNeedle)) {
    const endNeedle = 'Mu.filter(X=>oD.has(X)).map(X=>{var ae;return p.jsx(q.Fragment,{children:(ae=j[X])==null?void 0:ae.call(j)},X)})})()})]}),';
    console.log('Includes endNeedle:', js.includes(endNeedle));
    const pos = js.indexOf('Mu.filter(X=>oD.has(X))');
    console.log('Pos of Mu.filter:', pos);
    console.log(js.substring(pos - 100, pos + 200));
  }
}
