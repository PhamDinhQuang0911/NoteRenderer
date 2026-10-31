const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const checks = [
    {
        name: 'Item 1 - M1.figures',
        target: 'figures:["shapes","segment","vector","line","circle","triangle","rect","square","geo","geoMove","gridSnap","trace","clearTrace","graph","vartable","oxyz","flatPlane","spreadPlane","formula","problem","tikzFigure","tikzImage","chem","periodic","lab","circuit","forces","optics","physGraph","bioGraph","waveTool","fieldTool","physConst","formulaSheet","ecology","dna","division","bioFig","pedigree","cross","apparatus","chemDiagram","atomTool","structure","sticker","calc","calcScreen","text",'
    },
    {
        name: 'Item 1 - VI keyActions',
        target: 'keyActions:{newNote:"Sổ mới",open:"Mở sổ",save:"Lưu",saveAs:"Lưu thành...",undo:"Hoàn tác",redo:"Làm lại",'
    },
    {
        name: 'Item 1 - EN keyActions',
        target: 'keyActions:{newNote:"New notebook",open:"Open",save:"Save",saveAs:"Save as...",undo:"Undo",redo:"Redo",'
    },
    {
        name: 'Item 2 - BU and jO inking width',
        target: 'const BU=e=>.55+.9*e;function jO(e){const t=e.width/2;if(e.kind!=="pen")return()=>t;switch(e.pen){case"felt":return()=>t*1.2;case"fountain":return n=>t*(.6+.8*n);case"pencil":return n=>t*(.7+.6*n);case"brush":return n=>t*(.25+1.75*n);default:return n=>t*BU(n)}}'
    },
    {
        name: 'Item 2 - pressureOf clamp',
        target: 'pressureOf(t){if(t.pointerType==="pen"&&this.pen.pressure!==!1){if(typeof t.pressure==="number"&&t.pressure>0){const p=Math.pow(t.pressure,0.85);return Math.max(0.2,Math.min(1,p));}return 0.2;}return.5;}'
    },
    {
        name: 'Item 3 - mne tablet cursor delay',
        target: 'u=g=>{if(g.pointerType==="pen"){if(clearTimeout(l),s.current||g.buttons&32||g.button===5)return c();a.style.display="block",a.style.transform=`translate(${g.clientX-r.x*t}px, ${g.clientY-r.y*t}px)`}},h=g=>{g.pointerType==="pen"&&(clearTimeout(l),l=window.setTimeout(c,pne))},d=g=>{g.pointerType==="pen"&&!g.relatedTarget&&c()},f={capture:!0,passive:!0};return window.addEventListener("pointerdown",u,f),window.addEventListener("pointermove",u,f),window.addEventListener("pointerup",h,f),window.addEventListener("pointercancel",c,f),window.addEventListener("pointerout",d,f),()=>{clearTimeout(l),window.removeEventListener("pointerdown",u,f),window.removeEventListener("pointermove",u,f),window.removeEventListener("pointerup",h,f),window.removeEventListener("pointercancel",c,f),window.removeEventListener("pointerout",d,f)}}'
    },
    {
        name: 'Item 4 - VI spaceSizes',
        target: 'spaceSizes:{drag:"Trang chèn cao đúng đoạn kéo",full:"Đẩy nội dung xuống trang sau (mọi trang giữ đúng khổ)",flow:"Chèn đúng đoạn kéo, nội dung bị đẩy xuống (phần tràn sang trang mới)"}'
    },
    {
        name: 'Item 4 - EN spaceSizes',
        target: 'spaceSizes:{drag:"Page put in as tall as the drag",full:"Push what is below on to the next page (pages keep their size)",flow:"Room exactly as tall as the drag, pushing what is below down (what runs over goes on to a new page)"}'
    },
    {
        name: 'Item 4 - Rte space choices',
        target: '["drag","full","flow"].map(xe=>p.jsxs("label",{className:"check",children:[p.jsx("input",{type:"radio",name:"space-size",checked:J===xe,onChange:()=>ue(xe)})," ",ht.spaceSizes[xe]]},xe))'
    },
    {
        name: 'Item 4 - Rte initial space state',
        target: '[U,W]=q.useState(c.spaceFlow?"flow":c.spaceFull?"full":"drag")'
    },
    {
        name: 'Item 4 - Rte onSave space state',
        target: 'W(ce),yt({spaceFull:ce==="full",spaceFlow:ce==="flow"}),Q.spaceFull=ce==="full",Q.spaceFlow=ce==="flow"'
    },
    {
        name: 'Item 4 - Editor insertSpace',
        target: 'async insertSpace(t,n,o){var g;const s=zl(this.doc),i=(g=this.doc.pages[t])==null?void 0:g.height,r=i!==void 0&&i<s-.5;if(o>0)return await zc([this.doc.pages[t]]),r&&i+o<=s+.5&&this.pushWithin(t,n,o,i+o)||this.pushWithin(t,n,o)?void 0:this.spaceFlow?this.flowForSpace(t,n,o):this.splitForSpace(t,n,o);'
    },
    {
        name: 'Item 4 - _te paperFrom 3200px PNG',
        target: 'async function _te(e){const t=new Image;t.src=e,await t.decode();const W=Math.min(2400,Math.max(nu,t.naturalWidth)),H=Math.round(W*(t.naturalHeight/t.naturalWidth)),n=document.createElement("canvas");n.width=W,n.height=H;const o=n.getContext("2d");o.imageSmoothingEnabled=!0,o.imageSmoothingQuality="high",o.fillStyle="#ffffff",o.fillRect(0,0,W,H);o.drawImage(t,0,0,W,H);const a=n.toDataURL("image/jpeg",.94);return n.width=n.height=0,a}'
    }
];

let allOk = true;
for (const c of checks) {
    const ok = code.includes(c.target);
    console.log((ok ? '✓' : '✗') + ' ' + c.name);
    if (!ok) allOk = false;
}
console.log('--- ALL OK?', allOk, '---');
