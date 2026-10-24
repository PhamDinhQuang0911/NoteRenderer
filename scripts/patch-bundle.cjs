/**
 * scripts/patch-bundle.cjs
 * Gắn cầu nối API nội bộ (window.__NR_EDITOR, window.__NR_OPEN_DOC, window.__NR_API)
 * vào dist/assets/index-Cfxrtuua.js một cách an toàn và idempotent (chạy nhiều lần không lỗi).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const bundlePaths = [
    'C:\\Users\\ADMIN\\Documents\\GitHub\\NoteRenderer\\dist\\assets\\index-Cfxrtuua.js',
    'C:\\Users\\ADMIN\\Desktop\\NoteRenderer_Source\\dist\\assets\\index-Cfxrtuua.js'
];

for (const bundlePath of bundlePaths) {
    if (!fs.existsSync(bundlePath)) continue;
    let code = fs.readFileSync(bundlePath, 'utf8');

    // 1. Hook Editor constructor & load()
    const ctorTarget = `constructor(t,n,r,i=!1){oe(this,"doc");`;
    const ctorPatch  = `constructor(t,n,r,i=!1){oe(this,"doc");window.__NR_EDITOR=this;`;
    if (code.includes(ctorTarget) && !code.includes(ctorPatch)) {
        code = code.replace(ctorTarget, ctorPatch);
    }

    const loadTarget = `load(t){this.doc=t,`;
    const loadPatch  = `load(t){window.__NR_EDITOR=this,this.doc=t,`;
    if (code.includes(loadTarget) && !code.includes(loadPatch)) {
        code = code.replace(loadTarget, loadPatch);
    }

    // 2. Hook onOpenDoc in web platform l$()
    const openDocTarget = `onOpenDoc:()=>()=>{}`;
    const openDocPatch  = `onOpenDoc:t=>((window.__NR_OPEN_DOC=t),()=>{})`;
    if (code.includes(openDocTarget) && !code.includes(openDocPatch)) {
        code = code.replace(openDocTarget, openDocPatch);
    }

    // 3. Expose window.__NR_API before final export
    const exportTarget = `export{Mo as A,`;
    const apiBlock = `if(typeof window!=="undefined"){window.__NR_API={encode:i8,decode:s8,renderPageToDataUrl:Dp,renderPageCanvas:$_,buildPdf:wF,dataUrlToBytes:xF,getPageWidth:_t,getPageHeight:Do,defaultWidth:_o,defaultHeight:_s,exportDocToPdfBytes:async(docObj,pageIndices)=>{const doc=docObj||(window.__NR_EDITOR&&window.__NR_EDITOR.doc);if(!doc||!Array.isArray(doc.pages))throw new Error("Không tìm thấy tài liệu!");const indices=Array.isArray(pageIndices)&&pageIndices.length>0?pageIndices:doc.pages.map((_,idx)=>idx);const imgs=[];const scale=Math.min(2.5,Math.sqrt(16e6/(_t(doc)*_s(doc))));for(const st of indices){imgs.push(xF(await Dp(doc,st,scale,"image/jpeg",.95,!0)))}const me=Vv.width/xo,[De,ve]=[_o(doc)*me,_s(doc)*me],we=indices.map(st=>ve*Do(doc,doc.pages[st])/_s(doc));return wF(imgs,De*_t(doc)/_o(doc),we)}};}export{Mo as A,`;

    if (code.includes(exportTarget) && !code.includes('window.__NR_API=')) {
        code = code.replace(exportTarget, apiBlock);
    }

    fs.writeFileSync(bundlePath, code, 'utf8');
    execSync(`node --check "${bundlePath}"`);
    console.log('Successfully patched and verified:', bundlePath);
}
