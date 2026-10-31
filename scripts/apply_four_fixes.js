const fs = require('fs');
const { execSync } = require('child_process');

const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js';
let code = fs.readFileSync(bundlePath, 'utf8');

// 1. Item 1: Add quickNote to M1.figures and keyActions
const m1Needle = 'figures:["shapes","segment","vector","line","circle","triangle","rect","square","geo","geoMove","gridSnap","trace","clearTrace","graph","vartable","oxyz","flatPlane","spreadPlane","formula","problem","tikzFigure","tikzImage","chem","periodic","lab","circuit","forces","optics","physGraph","bioGraph","waveTool","fieldTool","physConst","formulaSheet","ecology","dna","division","bioFig","pedigree","cross","apparatus","chemDiagram","atomTool","structure","sticker","calc","calcScreen","text",';
const m1Repl = 'figures:["shapes","segment","vector","line","circle","triangle","rect","square","geo","geoMove","gridSnap","trace","clearTrace","graph","vartable","oxyz","flatPlane","spreadPlane","formula","problem","tikzFigure","tikzImage","chem","periodic","lab","circuit","forces","optics","physGraph","bioGraph","waveTool","fieldTool","physConst","formulaSheet","ecology","dna","division","bioFig","pedigree","cross","apparatus","chemDiagram","atomTool","structure","sticker","quickNote","calc","calcScreen","text",';

const viKeyNeedle = 'keyActions:{newNote:"Sổ mới",open:"Mở sổ",save:"Lưu",saveAs:"Lưu thành...",undo:"Hoàn tác",redo:"Làm lại",';
const viKeyRepl = 'keyActions:{newNote:"Sổ mới",open:"Mở sổ",save:"Lưu",saveAs:"Lưu thành...",undo:"Hoàn tác",redo:"Làm lại",quickNote:"Chèn giấy note (nhớ)",';

const enKeyNeedle = 'keyActions:{newNote:"New notebook",open:"Open",save:"Save",saveAs:"Save as...",undo:"Undo",redo:"Redo",';
const enKeyRepl = 'keyActions:{newNote:"New notebook",open:"Open",save:"Save",saveAs:"Save as...",undo:"Undo",redo:"Redo",quickNote:"Sticky quick note",';

// 2. Item 2: Stroke width & pressure
const buNeedle = 'const BU=e=>.55+.9*e;function jO(e){const t=e.width/2;if(e.kind!=="pen")return()=>t;switch(e.pen){case"felt":return()=>t*1.2;case"fountain":return n=>t*(.6+.8*n);case"pencil":return n=>t*(.7+.6*n);case"brush":return n=>t*(.25+1.75*n);default:return n=>t*BU(n)}}';
const buRepl = 'const BU=e=>Math.max(0.95,0.85+.4*e);function jO(e){const t=e.width/2;if(e.kind!=="pen")return()=>t;switch(e.pen){case"felt":return()=>t*1.2;case"fountain":return n=>t*(.88+.45*n);case"pencil":return n=>t*(.88+.35*n);case"brush":return n=>t*(.35+1.65*n);default:return n=>t*BU(n)}}';

const pressNeedle = 'pressureOf(t){if(t.pointerType==="pen"&&this.pen.pressure!==!1){if(typeof t.pressure==="number"&&t.pressure>0){const p=Math.pow(t.pressure,0.85);return Math.max(0.2,Math.min(1,p));}return 0.2;}return.5;}';
const pressRepl = 'pressureOf(t){if(t.pointerType==="pen"&&this.pen.pressure!==!1){if(typeof t.pressure==="number"&&t.pressure>0){const p=Math.pow(t.pressure,0.85);return Math.max(0.35,Math.min(1,p));}return 0.35;}return.5;}';

// 3. Item 3: Tablet cursor delay (pointerrawupdate, getCoalescedEvents, translate3d)
const mneNeedle = 'u=g=>{if(g.pointerType==="pen"){if(clearTimeout(l),s.current||g.buttons&32||g.button===5)return c();a.style.display="block",a.style.transform=`translate(${g.clientX-r.x*t}px, ${g.clientY-r.y*t}px)`}},h=g=>{g.pointerType==="pen"&&(clearTimeout(l),l=window.setTimeout(c,pne))},d=g=>{g.pointerType==="pen"&&!g.relatedTarget&&c()},f={capture:!0,passive:!0};return window.addEventListener("pointerdown",u,f),window.addEventListener("pointermove",u,f),window.addEventListener("pointerup",h,f),window.addEventListener("pointercancel",c,f),window.addEventListener("pointerout",d,f),()=>{clearTimeout(l),window.removeEventListener("pointerdown",u,f),window.removeEventListener("pointermove",u,f),window.removeEventListener("pointerup",h,f),window.removeEventListener("pointercancel",c,f),window.removeEventListener("pointerout",d,f)}}';
const mneRepl = 'u=g=>{if(g.pointerType==="pen"){if(clearTimeout(l),s.current||g.buttons&32||g.button===5)return c();const evs=g.getCoalescedEvents?g.getCoalescedEvents():null,last=evs&&evs.length?evs[evs.length-1]:g;a.style.display="block",a.style.transform=`translate3d(${last.clientX-r.x*t}px, ${last.clientY-r.y*t}px, 0)`}},h=g=>{g.pointerType==="pen"&&(clearTimeout(l),l=window.setTimeout(c,pne))},d=g=>{g.pointerType==="pen"&&!g.relatedTarget&&c()},f={capture:!0,passive:!0};return window.addEventListener("pointerdown",u,f),window.addEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.addEventListener("pointerrawupdate",u,f),window.addEventListener("pointerup",h,f),window.addEventListener("pointercancel",c,f),window.addEventListener("pointerout",d,f),()=>{clearTimeout(l),window.removeEventListener("pointerdown",u,f),window.removeEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.removeEventListener("pointerrawupdate",u,f),window.removeEventListener("pointerup",h,f),window.removeEventListener("pointercancel",c,f),window.removeEventListener("pointerout",d,f)}}';

// 4. Item 4: Space insertion option extend & PDF paper quality
const viSpaceNeedle = 'spaceSizes:{drag:"Trang chèn cao đúng đoạn kéo",full:"Đẩy nội dung xuống trang sau (mọi trang giữ đúng khổ)",flow:"Chèn đúng đoạn kéo, nội dung bị đẩy xuống (phần tràn sang trang mới)"}';
const viSpaceRepl = 'spaceSizes:{extend:"Kéo dài trang hiện tại (không méo ô li, không tràn trang sau)",drag:"Trang chèn cao đúng đoạn kéo",full:"Đẩy nội dung xuống trang sau (mọi trang giữ đúng khổ)",flow:"Chèn đúng đoạn kéo, nội dung bị đẩy xuống (phần tràn sang trang mới)"}';

const enSpaceNeedle = 'spaceSizes:{drag:"Page put in as tall as the drag",full:"Push what is below on to the next page (pages keep their size)",flow:"Room exactly as tall as the drag, pushing what is below down (what runs over goes on to a new page)"}';
const enSpaceRepl = 'spaceSizes:{extend:"Extend current page (no distortion, no page split)",drag:"Page put in as tall as the drag",full:"Push what is below on to the next page (pages keep their size)",flow:"Room exactly as tall as the drag, pushing what is below down (what runs over goes on to a new page)"}';

const choicesNeedle = '["drag","full","flow"].map(xe=>p.jsxs("label",{className:"check",children:[p.jsx("input",{type:"radio",name:"space-size",checked:J===xe,onChange:()=>ue(xe)})," ",ht.spaceSizes[xe]]},xe))';
const choicesRepl = '["extend","drag","full","flow"].map(xe=>p.jsxs("label",{className:"check",children:[p.jsx("input",{type:"radio",name:"space-size",checked:J===xe,onChange:()=>ue(xe)})," ",ht.spaceSizes[xe]]},xe))';

const stateNeedle = '[U,W]=q.useState(c.spaceFlow?"flow":c.spaceFull?"full":"drag")';
const stateRepl = '[U,W]=q.useState(c.spaceMode??(c.spaceFlow?"flow":c.spaceFull?"full":"extend"))';

const onSaveNeedle = 'W(ce),yt({spaceFull:ce==="full",spaceFlow:ce==="flow"}),Q.spaceFull=ce==="full",Q.spaceFlow=ce==="flow"';
const onSaveRepl = 'W(ce),yt({spaceMode:ce,spaceFull:ce==="full",spaceFlow:ce==="flow"}),Q.spaceMode=ce,Q.spaceFull=ce==="full",Q.spaceFlow=ce==="flow"';

const insertSpaceNeedle = 'async insertSpace(t,n,o){var g;const s=zl(this.doc),i=(g=this.doc.pages[t])==null?void 0:g.height,r=i!==void 0&&i<s-.5;if(o>0)return await zc([this.doc.pages[t]]),r&&i+o<=s+.5&&this.pushWithin(t,n,o,i+o)||this.pushWithin(t,n,o)?void 0:this.spaceFlow?this.flowForSpace(t,n,o):this.splitForSpace(t,n,o);';
const insertSpaceRepl = 'async extendPageForSpace(t,n,o){await zc([this.doc.pages[t]]);const page=this.doc.pages[t];if(!page)return;const curH=this.phOf(t),newH=Math.round(curH+o),newItems=[];for(const v of page.items){if(v.type==="image"&&!v.rot&&v.y<n-1&&v.y+v.h>n+1){const w=h3(v,n,v.y+v.h);w?newItems.push(w[0],{...w[1],y:w[1].y+o}):v.y+v.h/2>=n?newItems.push({...v,y:v.y+o}):newItems.push(v)}else v.y+v.h/2>=n?newItems.push({...v,y:v.y+o}):newItems.push(v)}const newStrokes=page.strokes.map(st=>{const b=Wi(st);return(b.y0+b.y1)/2<n?st:{...st,pts:st.pts.map((p,idx)=>idx%3===1?p+o:p)}}),ptsMap=gt(page.geo),compMap=d3(page.geo),compYs=new Map;for(const[ptId,cId]of compMap){const pt=ptsMap.get(ptId);pt&&compYs.set(cId,[...(compYs.get(cId)??[]),pt.y])}const shiftPtIds=new Set;for(const[cId,ys]of compYs)ys.reduce((sum,y)=>sum+y,0)/ys.length>=n&&shiftPtIds.add(cId);const newPoints={};for(const pt of Object.values(page.geo.points)){const cId=compMap.get(pt.id)??pt.id;newPoints[pt.id]=shiftPtIds.has(cId)&&pt.def.t==="free"?{...pt,def:{...pt.def,y:pt.def.y+o}}:pt}this.sel=null,this.commit(this.updatePage(t,p=>({...p,items:newItems,strokes:newStrokes,geo:{...p.geo,points:newPoints},height:newH})))}async insertSpace(t,n,o){var g;const s=zl(this.doc),i=(g=this.doc.pages[t])==null?void 0:g.height,r=i!==void 0&&i<s-.5;if(o>0){await zc([this.doc.pages[t]]);if(this.spaceMode==="extend"||(!this.spaceFlow&&!this.spaceFull&&this.spaceMode!=="drag"))return this.extendPageForSpace(t,n,o);return r&&i+o<=s+.5&&this.pushWithin(t,n,o,i+o)||this.pushWithin(t,n,o)?void 0:this.spaceFlow?this.flowForSpace(t,n,o):this.splitForSpace(t,n,o);}';

const teNeedle = 'async function _te(e){const t=new Image;t.src=e,await t.decode();const W=Math.min(2400,Math.max(nu,t.naturalWidth)),H=Math.round(W*(t.naturalHeight/t.naturalWidth)),n=document.createElement("canvas");n.width=W,n.height=H;const o=n.getContext("2d");o.imageSmoothingEnabled=!0,o.imageSmoothingQuality="high",o.fillStyle="#ffffff",o.fillRect(0,0,W,H);o.drawImage(t,0,0,W,H);const a=n.toDataURL("image/jpeg",.94);return n.width=n.height=0,a}';
const teRepl = 'async function _te(e){const t=new Image;t.src=e,await t.decode();const W=Math.min(3200,Math.max(nu,t.naturalWidth)),H=Math.round(W*(t.naturalHeight/t.naturalWidth)),n=document.createElement("canvas");n.width=W,n.height=H;const o=n.getContext("2d");o.imageSmoothingEnabled=!0,o.imageSmoothingQuality="high",o.fillStyle="#ffffff",o.fillRect(0,0,W,H);o.drawImage(t,0,0,W,H);const a=n.toDataURL("image/png");return n.width=n.height=0,a}';

const patches = [
    [m1Needle, m1Repl, 'M1.figures'],
    [viKeyNeedle, viKeyRepl, 'VI keyActions'],
    [enKeyNeedle, enKeyRepl, 'EN keyActions'],
    [buNeedle, buRepl, 'BU & jO inking'],
    [pressNeedle, pressRepl, 'pressureOf'],
    [mneNeedle, mneRepl, 'mne cursor delay'],
    [viSpaceNeedle, viSpaceRepl, 'VI spaceSizes'],
    [enSpaceNeedle, enSpaceRepl, 'EN spaceSizes'],
    [choicesNeedle, choicesRepl, 'space choices in Rte'],
    [stateNeedle, stateRepl, 'initial space state'],
    [onSaveNeedle, onSaveRepl, 'onSave space state'],
    [insertSpaceNeedle, insertSpaceRepl, 'insertSpace & extendPageForSpace'],
    [teNeedle, teRepl, '_te paperFrom 3200px PNG']
];

for (const [target, repl, name] of patches) {
    if (!code.includes(target)) {
        throw new Error('Target not found: ' + name);
    }
    code = code.replace(target, repl);
    console.log('Applied patch:', name);
}

fs.writeFileSync(bundlePath, code, 'utf8');
console.log('Saved patched bundle to:', bundlePath);

// Patch pdfimport-C80fD9x7.js
const pdfImportPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/pdfimport-C80fD9x7.js';
let pdfCode = fs.readFileSync(pdfImportPath, 'utf8');
pdfCode = pdfCode.replace('const g=2400', 'const g=3200');
pdfCode = pdfCode.replace('t.toDataURL("image/jpeg",.94)', 't.toDataURL("image/png")');
fs.writeFileSync(pdfImportPath, pdfCode, 'utf8');
console.log('Saved patched pdfimport to:', pdfImportPath);

console.log('Running node --check on bundle...');
execSync(`node --check "${bundlePath}"`);
console.log('BUNDLE SYNTAX CHECK: 100% OK!');

console.log('Running node --check on pdfimport...');
execSync(`node --check "${pdfImportPath}"`);
console.log('PDFIMPORT SYNTAX CHECK: 100% OK!');
