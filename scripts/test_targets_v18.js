const fs = require('fs');
const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
const content = fs.readFileSync(bundlePath, 'utf8');

const patches = [
  {
    name: '1. OX paperImage smoothing',
    oldStr: 'const r=t.paperImage?Na(t.paperImage):null;r&&e.drawImage(r,0,0,o,i);const a=t.spacing'
  },
  {
    name: '2. fee 2480px high resolution',
    oldStr: 'async function fee(e){const t=new Image;t.src=e,await t.decode();const n=document.createElement("canvas");n.width=$c,n.height=Mf;const s=n.getContext("2d");s.fillStyle="#ffffff",s.fillRect(0,0,$c,Mf);const o=Math.min($c/t.naturalWidth,Mf/t.naturalHeight),i=t.naturalWidth*o,r=t.naturalHeight*o;s.drawImage(t,($c-i)/2,(Mf-r)/2,i,r);const a=n.toDataURL("image/jpeg",.85);return n.width=n.height=0,a}'
  },
  {
    name: '3. SL paper persistence',
    oldStr: 'KZ(_.lineWeight)?{lineWeight:_.lineWeight}:{},..._.landscape===!0?{landscape:!0}:{},...Ps(tO,_.size)?{size:_.size}:{}}),o}'
  },
  {
    name: '4. t0 and x2 paper saving',
    oldStr: 'const t0=()=>{var X;const E=c.paper??l$(((X=o.current)==null?void 0:X.doc)??ex());return{...ex(E.paper,E.spacing),titleBox:E.titleBox,names:E.names,...E.infinite?{infinite:!0,width:sr(E)+x1}:{},...E.landscape?{landscape:!0}:{},...E.size&&E.size!=="a4"?{size:E.size}:{},...E.labelSize?{labelSize:E.labelSize}:{},...E.labelColor?{labelColor:E.labelColor}:{},...E.dotColor?{dotColor:E.dotColor}:{},...E.dotSize?{dotSize:E.dotSize}:{},...E.dots?{}:{dots:!1},...E.margins===!1?{margins:!1}:{},...E.color?{paperColor:E.color}:{},...E.lineColor?{lineColor:E.lineColor}:{},...E.lineWeight&&E.lineWeight!==1?{lineWeight:E.lineWeight}:{}}},x2=({image:E,...X})=>{c.paper=X,wt({paper:X})};'
  },
  {
    name: '5. add sheet inherit t0',
    oldStr: 'i0([...Un,{id:qe("s"),name:n.sheetName(X)}]),Uh(Un.length),Xh(!0),E.load({...ex(E.doc.paper,E.doc.spacing),names:E.doc.names})}'
  }
];

patches.forEach(p => {
  const found = content.includes(p.oldStr);
  console.log(`[${found ? 'MATCH' : 'FAIL'}] ${p.name}`);
});
