/**
 * scripts/patch-bundle.cjs
 * Gắn cầu nối API nội bộ (window.__NR_EDITOR, window.__NR_OPEN_DOC, window.__NR_API)
 * vào bundle NoteRenderer v0.6.2 (index--cPWPmO5.js).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetRepo = path.resolve(__dirname, '..');
const assetsDir = path.join(targetRepo, 'dist/assets');
const bundleFiles = fs.readdirSync(assetsDir).filter(f => f.startsWith('index-') && f.endsWith('.js'));

for (const file of bundleFiles) {
    const bundlePath = path.join(assetsDir, file);
    let code = fs.readFileSync(bundlePath, 'utf8');

    // 1. Hook Editor constructor
    code = code.replace(/constructor\(t,n,r,i=!1\)\{(oe|he)\(this,"doc"\);/g, (match, p1) => {
        return `constructor(t,n,r,i=!1){${p1}(this,"doc");window.__NR_EDITOR=this;`;
    });

    // 2. Hook load()
    code = code.replace(/load\(t\)\{this\.doc=t,/g, 'load(t){window.__NR_EDITOR=this,this.doc=t,');

    // 3. Hook onOpenDoc
    code = code.replace('onOpenDoc:()=>()=>{}', 'onOpenDoc:t=>((window.__NR_OPEN_DOC=t),()=>{})');

    // 4. Hook __NR_API
    if (!code.includes('window.__NR_API=')) {
        if (code.includes('export{Do as A,')) {
            const apiBlock = 'if(typeof window!=="undefined"){window.__NR_API={encode:X7,decode:Y7,renderPageToDataUrl:vm,renderPageCanvas:K4,buildPdf:OK,dataUrlToBytes:RK,getPageWidth:Dt,getPageHeight:zo,defaultWidth:Aa,defaultHeight:So,exportDocToPdfBytes:async(docObj,pageIndices)=>{const doc=docObj||(window.__NR_EDITOR&&window.__NR_EDITOR.doc);if(!doc||!Array.isArray(doc.pages))throw new Error("Không tìm thấy tài liệu!");const indices=Array.isArray(pageIndices)&&pageIndices.length>0?pageIndices:doc.pages.map((_,idx)=>idx);const imgs=[];const scale=Math.min(2.5,Math.sqrt(16e6/(Dt(doc)*So(doc))));for(const st of indices){imgs.push(RK(await vm(doc,st,scale,"image/jpeg",.95,!0)))}const me=x3.width/_a,[De,ve]=[Aa(doc)*me,So(doc)*me],we=indices.map(st=>ve*zo(doc,doc.pages[st])/So(doc));return OK(imgs,De*Dt(doc)/Aa(doc),we)}};}export{Do as A,';
            code = code.replace('export{Do as A,', apiBlock);
        }
    }

    fs.writeFileSync(bundlePath, code, 'utf8');
    execSync(`node --check "${bundlePath}"`);
    console.log('Successfully patched and verified:', file);
}
