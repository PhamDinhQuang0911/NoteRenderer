const fs = require('fs');
const vm = require('vm');

let js = fs.readFileSync('C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-v0.7.0-Backup-PrePolish/dist/assets/index-CtXdKE8z.js', 'utf8');

function testStep(name, fn) {
    try {
        fn();
        new vm.SourceTextModule(js);
        console.log(`[PASS] ${name}`);
    } catch (e) {
        console.error(`[FAIL] ${name} -> ${e.message}`);
    }
}

// 1. Esc key
testStep('Fix 1: Esc key', () => {
    const jsEscTarget = 'const E=X=>{if(X.key==="Escape"&&(Ks||document.body.classList.contains("nr-fullscreen")||document.fullscreenElement)){X.preventDefault(),xu(!1)}},ae=()=>{document.fullscreenElement||e.setFullScreen||(Z5(!1),yt({fullScreen:!1}),document.body.classList.remove("nr-fullscreen"))}';
    const jsEscReplacement = 'const E=X=>{if(X.key==="Escape"&&(Ks||document.body.classList.contains("nr-fullscreen")||document.fullscreenElement)){X.preventDefault(),X.stopPropagation(),xu(!1)}},ae=()=>{document.fullscreenElement||(Z5(!1),yt({fullScreen:!1}),document.body.classList.remove("nr-fullscreen"))}';
    if (!js.includes(jsEscTarget)) throw new Error('Target not found');
    js = js.replace(jsEscTarget, jsEscReplacement);
});

// 2a. Di xoa button inside Fragment
testStep('Fix 2a: Di xoa button', () => {
    const uniformTarget = 'uniform:()=>(St("pen")||St("highlighter"))&&p.jsx(ct,{title:u.pressure===!1?"Nét đều: ĐANG BẬT (bấm để chuyển nét thanh đậm)":"Nét đều: ĐANG TẮT (bấm để viết các nét chữ đều nhau)",on:u.pressure===!1,className:u.pressure===!1?"on checked":"",onClick:()=>{const next=u.pressure===!1?void 0:!1;va({pressure:next}),yt({pen:{...u,pressure:next}});try{if(Q&&Q.pen){Q.pen={...Q.pen,pressure:next}}}catch(_){}},children:p.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"2px",fontSize:"11px",fontWeight:"700",letterSpacing:"-0.2px"},children:[p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",children:p.jsx("path",{d:"M3 9h18M3 15h18"})}),p.jsx("span",{children:"Đều"})]})}),shapes:';

    const uniformWithScratch = 'uniform:()=>(St("pen")||St("highlighter"))&&p.jsxs(p.Fragment,{children:[p.jsx(ct,{title:u.pressure===!1?"Nét đều: ĐANG BẬT (bấm để chuyển nét thanh đậm)":"Nét đều: ĐANG TẮT (bấm để viết các nét chữ đều nhau)",on:u.pressure===!1,className:u.pressure===!1?"on checked":"",onClick:()=>{const next=u.pressure===!1?void 0:!1;va({pressure:next}),yt({pen:{...u,pressure:next}});try{if(Q&&Q.pen){Q.pen={...Q.pen,pressure:next}}}catch(_){}},children:p.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"2px",fontSize:"11px",fontWeight:"700",letterSpacing:"-0.2px"},children:[p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",children:p.jsx("path",{d:"M3 9h18M3 15h18"})}),p.jsx("span",{children:"Đều"})]})}),p.jsx(ct,{title:_s?"Di xoá: ĐANG BẬT (tô di qua lại đè lên chữ để xoá)":"Di xoá: ĐANG TẮT (bấm để bật tô di đè chữ để xoá)",on:_s,className:_s?"on checked":"",onClick:()=>{const next=!_s;bo(n.scratchEraseNow(next));Au(next)},children:p.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"2px",fontSize:"11px",fontWeight:"700",letterSpacing:"-0.2px"},children:[p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:p.jsx("path",{d:"M3 17l4-8 4 8 4-8 4 8"})}),p.jsx("span",{children:"Di xoá"})]})})]}),shapes:';

    if (!js.includes(uniformTarget)) throw new Error('Uniform target not found');
    js = js.replace(uniformTarget, uniformWithScratch);
});

// 2b. PU sensitivity
testStep('Fix 2b: PU sensitivity', () => {
    const puTarget = 'return d[0]>=4&&u>=2.5*h||d[1]>=6}';
    const puReplacement = 'return(d[0]>=3&&u>=1.8*h)||(d[0]>=4&&u>=2.5*h)||d[1]>=4}';
    if (!js.includes(puTarget)) throw new Error('Target not found');
    js = js.replace(puTarget, puReplacement);
});

// 2c. EU sensitivity
testStep('Fix 2c: EU sensitivity', () => {
    const euTarget = 'u>=.6*c&&r.push(l)';
    const euReplacement = '(u>=.35*c||u>=5)&&r.push(l)';
    if (!js.includes(euTarget)) throw new Error('Target not found');
    js = js.replace(euTarget, euReplacement);
});

// 3. paintSoon without stall (and clean down)
testStep('Fix 3: paintSoon fast incremental', () => {
    const paintSoonTarget = 'paintSoon(){this.lowLatency&&!this.needFull&&performance.now()-this.lastPaint>=5&&this.paintWet()||this.schedule()}';
    const paintSoonReplacement = 'paintSoon(){(!this.needFull&&this.paintWet())||this.schedule()}';
    if (!js.includes(paintSoonTarget)) throw new Error('Target not found');
    js = js.replace(paintSoonTarget, paintSoonReplacement);
});

// 4a. mne component: NO double cursor, NO blur, NO jitter, locked to pen-down
testStep('Fix 4a: mne component rock-solid', () => {
    const mneTarget = 'function mne({kind:e,scale:t,off:n}){const o=q.useRef(null),s=q.useRef(n);s.current=n;const i=e==="pen"||e==="dot"?e:"arrow",r=dne[i];return q.useEffect(()=>{const a=o.current;let l=0;const c=()=>{clearTimeout(l),a.style.display="none"},u=g=>{if(g.pointerType==="pen"){if(clearTimeout(l),s.current||g.buttons&32||g.button===5)return c();const evs=g.getCoalescedEvents?g.getCoalescedEvents():null,last=evs&&evs.length?evs[evs.length-1]:g;a.style.display="block",a.style.transform=`translate3d(${last.clientX-r.x*t}px, ${last.clientY-r.y*t}px, 0)`}},h=g=>{g.pointerType==="pen"&&(clearTimeout(l),l=window.setTimeout(c,pne))},d=g=>{g.pointerType==="pen"&&!g.relatedTarget&&c()},f={capture:!0,passive:!0};return window.addEventListener("pointerdown",u,f),window.addEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.addEventListener("pointerrawupdate",u,f),window.addEventListener("pointerup",h,f),window.addEventListener("pointercancel",c,f),window.addEventListener("pointerout",d,f),()=>{clearTimeout(l),window.removeEventListener("pointerdown",u,f),window.removeEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.removeEventListener("pointerrawupdate",u,f),window.removeEventListener("pointerup",h,f),window.removeEventListener("pointercancel",c,f),window.removeEventListener("pointerout",d,f)}},[r,t]),q.useEffect(()=>{n&&o.current&&(o.current.style.display="none")},[n]),p.jsx("div",{ref:o,className:"tablet-cursor",style:{width:r.size*t,height:r.size*t,backgroundImage:`url("data:image/svg+xml,${encodeURIComponent(hne[i])}")`}})}';

    const mneReplacement = 'function mne({kind:e,scale:t,off:n}){const o=q.useRef(null),s=q.useRef(n);s.current=n;const mob=typeof document!=="undefined"&&document.documentElement.classList.contains("mobile"),i=e==="pen"||e==="dot"?e:"arrow",r=dne[i];return q.useEffect(()=>{const a=o.current;if(!a)return;const c=()=>{a.style.display="none"},u=g=>{if(g.pointerType==="pen"){if(s.current||g.buttons&32||g.button===5)return c();if(!mob&&g.buttons===0)return c();const px=Math.round(g.clientX-r.x*t),py=Math.round(g.clientY-r.y*t);a.style.display!=="block"&&(a.style.display="block"),a.style.transform=`translate3d(${px}px, ${py}px, 0)`}},h=g=>{g.pointerType==="pen"&&c()},f={capture:!0,passive:!0};return window.addEventListener("pointerdown",u,f),window.addEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.addEventListener("pointerrawupdate",u,f),window.addEventListener("pointerup",h,f),window.addEventListener("pointercancel",c,f),window.addEventListener("pointerout",c,f),()=>{window.removeEventListener("pointerdown",u,f),window.removeEventListener("pointermove",u,f),"onpointerrawupdate"in window&&window.removeEventListener("pointerrawupdate",u,f),window.removeEventListener("pointerup",h,f),window.removeEventListener("pointercancel",c,f),window.removeEventListener("pointerout",c,f)}},[r,t,mob]),q.useEffect(()=>{n&&o.current&&(o.current.style.display="none")},[n]),p.jsx("div",{ref:o,className:"tablet-cursor",style:{width:Math.round(r.size*t),height:Math.round(r.size*t),backgroundImage:`url("data:image/svg+xml,${encodeURIComponent(hne[i])}")`}})}';

    if (!js.includes(mneTarget)) throw new Error('Target not found');
    js = js.replace(mneTarget, mneReplacement);
});

// 4b. mne render
testStep('Fix 4b: mne render', () => {
    const mneRender = 'e.mobile&&dm&&p.jsx(mne,{kind:Cu,scale:ir,off:a.k==="eraser"})';
    const mneRenderReplacement = 'dm&&p.jsx(mne,{kind:Cu,scale:ir,off:a.k==="eraser"})';
    if (!js.includes(mneRender)) throw new Error('Target not found');
    js = js.replace(mneRender, mneRenderReplacement);
});

// 4c. dm state
testStep('Fix 4c: dm state', () => {
    const dmStateTarget = '[dm,pm]=q.useState(c.tabletCursor??!1)';
    const dmStateReplacement = '[dm,pm]=q.useState(c.tabletCursor??!0)';
    if (!js.includes(dmStateTarget)) throw new Error('Target not found');
    js = js.replace(dmStateTarget, dmStateReplacement);
});

// 4d. settings modal tabletCursor
testStep('Fix 4d: settings modal tabletCursor', () => {
    const settingsTabletTarget = 'tabletCursor:e.mobile?dm:void 0';
    const settingsTabletReplacement = 'tabletCursor:dm';
    if (!js.includes(settingsTabletTarget)) throw new Error('Target not found');
    js = js.replace(settingsTabletTarget, settingsTabletReplacement);
});
