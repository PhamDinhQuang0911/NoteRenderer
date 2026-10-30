const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const jsPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js';
let js = fs.readFileSync(jsPath, 'utf8');

const tgBlock = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/tgBlock_clean.js', 'utf8');
const qnBlock = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/qnBlock_clean.js', 'utf8');

function patch(name, oldStr, newStr) {
  if (!js.includes(oldStr)) {
    throw new Error('Target not found for: ' + name);
  }
  js = js.replace(oldStr, newStr);
  console.log('[OK] ' + name);
}

console.log('Applying all 6 fixes to index-CtXdKE8z.js...');

// =========================================================================
// 1. ITEM 5: PEN STROKE WIDTH & PRESSURE CLAMPING
// =========================================================================
const p_pressure_old = 'pressureOf(t){return t.pointerType==="pen"&&this.pen.pressure!==!1&&t.pressure||.5}';
const p_pressure_new = 'pressureOf(t){if(t.pointerType==="pen"&&this.pen.pressure!==!1){if(typeof t.pressure==="number"&&t.pressure>0){const p=Math.pow(t.pressure,0.85);return Math.max(0.2,Math.min(1,p));}return 0.2;}return.5;}';
patch('Item 5: pressureOf minimum clamp 0.2 and power curve 0.85', p_pressure_old, p_pressure_new);

// Add uniform tool to iS
const p_is_old = 'iS=[...u7,"pen","eraser","inkMode","scratch","laser","colors","widths","highlighter","dashed",';
const p_is_new = 'iS=[...u7,"pen","eraser","inkMode","scratch","laser","colors","widths","highlighter","dashed","uniform",';
patch('Item 5: add uniform tool to iS list', p_is_old, p_is_new);

// Add uniform button to toolbar tools
const p_dashed_old = 'dashed:()=>St("dashed")&&p.jsx(ct,{title:n.dashedTip,on:i==null?void 0:i.dashed,onClick:()=>Q==null?void 0:Q.toggleDashed(),children:p.jsx(me.dashed,{})}),';
const p_dashed_new = 'dashed:()=>St("dashed")&&p.jsx(ct,{title:n.dashedTip,on:i==null?void 0:i.dashed,onClick:()=>Q==null?void 0:Q.toggleDashed(),children:p.jsx(me.dashed,{})}),uniform:()=>(St("pen")||St("highlighter"))&&p.jsx(ct,{title:u.pressure===!1?"Nét đều: ĐANG BẬT (bấm để chuyển nét thanh đậm)":"Nét đều: ĐANG TẮT (bấm để viết các nét chữ đều nhau)",on:u.pressure===!1,className:u.pressure===!1?"on checked":"",onClick:()=>{const next=u.pressure===!1?void 0:!1;va({pressure:next}),yt({pen:{...u,pressure:next}});try{if(Q&&Q.pen){Q.pen={...Q.pen,pressure:next}}}catch(_){}},children:p.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"2px",fontSize:"11px",fontWeight:"700",letterSpacing:"-0.2px"},children:[p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",children:p.jsx("path",{d:"M3 9h18M3 15h18"})}),p.jsx("span",{children:"Đều"})]})}),';
patch('Item 5: add uniform button to toolbar tools', p_dashed_old, p_dashed_new);

// =========================================================================
// 2. ITEM 6: REVERT PDF PAPER TEMPLATE TO CLEAN VANILLA V0.7.0
// =========================================================================
const p_ox_old = 'const _cp=t.pages[n];if(_cp&&(_cp.paper==="blank"||(_cp.items&&_cp.items.some(x=>x.bg&&x.pdf))))return;const r=t.paperImage?la(t.paperImage):null;if(r){e.save(),e.imageSmoothingEnabled=!0,e.imageSmoothingQuality="high",e.drawImage(r,0,0,o,i),e.restore();return}';
const p_ox_new = 'const r=t.paperImage?la(t.paperImage):null;if(r){e.save(),e.imageSmoothingEnabled=!0,e.imageSmoothingQuality="high",e.drawImage(r,0,0,o,i),e.restore();return}const _cp=t.pages[n];if(_cp&&(_cp.paper==="blank"||(_cp.items&&_cp.items.some(x=>x.bg&&x.pdf))))return;';
patch('Item 6: draw paperImage first before blank check', p_ox_old, p_ox_new);

// =========================================================================
// 3. ITEM 2: PEN BUTTON HOLD TO INSERT SPACE / BLANK ROOM
// =========================================================================
const p_penbtn_dict_vi_old = 'penButton:"Giữ nút trên bút (S Pen, bút Surface)",penButtons:{select:"Chọn vùng",erase:"Tẩy"},';
const p_penbtn_dict_vi_new = 'penButton:"Giữ nút trên bút (S Pen, bút Surface)",penButtons:{select:"Chọn vùng",erase:"Tẩy",space:"Chèn khoảng trống"},';
patch('Item 2: penButtons vi dict include space', p_penbtn_dict_vi_old, p_penbtn_dict_vi_new);

const p_penbtn_dict_en_old = 'penButton:"Holding the pen\'s button (S Pen, Surface pen)",penButtons:{select:"Selects",erase:"Erases"},';
const p_penbtn_dict_en_new = 'penButton:"Holding the pen\'s button (S Pen, Surface pen)",penButtons:{select:"Selects",erase:"Erases",space:"Insert space"},';
patch('Item 2: penButtons en dict include space', p_penbtn_dict_en_old, p_penbtn_dict_en_new);

const p_penbtn_val_old = 'const f=ko(["select","erase"],o.penButton);';
const p_penbtn_val_new = 'const f=ko(["select","erase","space"],o.penButton);';
patch('Item 2: penButton validation include space', p_penbtn_val_old, p_penbtn_val_new);

const p_penbtn_ui_old = 'p.jsx("h4",{children:ht.penButton}),p.jsx("div",{className:"paper-choices cursors",children:dJ.map(xe=>p.jsxs("button",{className:`paper-choice${B===xe?" on":""}`,onClick:()=>K(xe),children:[xe==="erase"?p.jsx(me.eraser,{}):p.jsx(me.select,{}),ht.penButtons[xe]]},xe))})';
const p_penbtn_ui_new = 'p.jsx("h4",{children:ht.penButton}),p.jsx("div",{className:"paper-choices cursors",children:["select","erase","space"].map(xe=>p.jsxs("button",{className:`paper-choice${B===xe?" on":""}`,onClick:()=>K(xe),children:[xe==="erase"?p.jsx(me.eraser,{}):xe==="space"?p.jsx(me.space,{}):p.jsx(me.select,{}),ht.penButtons[xe]]},xe))})';
patch('Item 2: penButton settings choices include space button', p_penbtn_ui_old, p_penbtn_ui_new);

const p_penbtn_down_old = 'astDown={t:l?0:a,x:n,y:o},this.capture(t.pointerId),t.pointerType==="pen"&&this.penButton==="select"&&(t.button===2||(t.buttons&2)!==0)&&t.button!==5&&(t.buttons&32)===0){if(this.tool.k!=="select"){const g=this.tool;this.setTool({k:"select"}),this.selectFrom=g';
const p_penbtn_down_new = 'astDown={t:l?0:a,x:n,y:o},this.capture(t.pointerId),t.pointerType==="pen"&&this.penButton==="space"&&(t.button===2||(t.buttons&2)!==0)&&t.button!==5&&(t.buttons&32)===0){this.drag={k:"space",page:i,y:r.y,dy:0,room:this.spaceRoom(i,r.y)};return}if(t.pointerType==="pen"&&this.penButton==="select"&&(t.button===2||(t.buttons&2)!==0)&&t.button!==5&&(t.buttons&32)===0){if(this.tool.k!=="select"){const g=this.tool;this.setTool({k:"select"}),this.selectFrom=g';
patch('Item 2: pointerdown handle penButton space drag', p_penbtn_down_old, p_penbtn_down_new);

// =========================================================================
// 4. ITEM 3: FULLSCREEN MODE HIDES SETTINGS AND SHOWS ONLY WRITING BAR
// =========================================================================
const p_fs_d2_old = 'ad=!!(e.toggleFullScreen||e.setFullScreen),xu=()=>{var j;if(!e.setFullScreen)return(j=e.toggleFullScreen)==null?void 0:j.call(e);Z5(!Ks),e.setFullScreen(!Ks),yt({fullScreen:!Ks})};q.useEffect(()=>{var j;c.fullScreen&&((j=e.setFullScreen)==null||j.call(e,!0))},[e]);';
const p_fs_d2_new = 'ad=!0,xu=(E)=>{const X=typeof E=="boolean"?E:!Ks;Z5(X),yt({fullScreen:X});try{document.body.classList.toggle("nr-fullscreen",X)}catch(_){}if(e.setFullScreen){try{e.setFullScreen(X)}catch(_){}}else if(e.toggleFullScreen){try{e.toggleFullScreen()}catch(_){}}try{X?(document.documentElement.requestFullscreen&&!document.fullscreenElement&&document.documentElement.requestFullscreen().catch(()=>{})):(document.fullscreenElement&&document.exitFullscreen&&document.exitFullscreen().catch(()=>{}))}catch(_){}};q.useEffect(()=>{c.fullScreen&&xu(!0);const E=X=>{if(X.key==="Escape"&&(Ks||document.body.classList.contains("nr-fullscreen")||document.fullscreenElement)){X.preventDefault(),xu(!1)}},ae=()=>{document.fullscreenElement||e.setFullScreen||(Z5(!1),yt({fullScreen:!1}),document.body.classList.remove("nr-fullscreen"))};window._openSaveLectureModal=P=>_setPendVid&&_setPendVid(P);window._setTgUploadState=P=>_setTgUp&&_setTgUp(P);window._openTelegramSettings=()=>te({k:"telegramSettings"});window._tgStartUpload=(blob,filename,caption)=>{const cfg=TelegramLectureService.getConfig();if(!cfg.botToken||!cfg.chatId||cfg.autoUpload===!1)return;const ctrl=new AbortController();const totalMb=(blob.size/(1024*1024)).toFixed(1);_setTgUp({progress:0,loadedMB:"0.0",totalMB:totalMb,cancel:()=>ctrl.abort()});TelegramLectureService.uploadVideo({botToken:cfg.botToken,chatId:cfg.chatId,blob,filename,caption,signal:ctrl.signal,onProgress:(p,loaded,total)=>{_setTgUp({progress:p,loadedMB:(loaded/(1024*1024)).toFixed(1),totalMB:(total/(1024*1024)).toFixed(1)})}}).then(res=>{_setTgUp(null);if(res.ok){i("Đã tải video lên Kho Lưu Trữ Telegram thành công!");}else{i("Lỗi tải video lên Telegram: "+res.error);}}).catch(err=>{_setTgUp(null);i("Lỗi tải video: "+(err.message||err));});};return window.addEventListener("keydown",E,!0),document.addEventListener("fullscreenchange",ae),()=>{window.removeEventListener("keydown",E,!0),document.removeEventListener("fullscreenchange",ae)}},[Ks,e]);';
patch('Item 3: Fullscreen toggle helper xu with nr-fullscreen and ESC key', p_fs_d2_old, p_fs_d2_new);

// Add zoom out, zoom in, and fullscreen button into tb-title
const p_title_old = 'p.jsx("div",{className:"tb-title",children:St("pageZoom")&&p.jsxs(p.Fragment,{children:[p.jsx(ei,{align:"center",open:wt==="page",';
const p_title_new = 'p.jsx("div",{className:"tb-title",children:St("pageZoom")&&p.jsxs(p.Fragment,{children:[p.jsx("button",{className:"tb-zoom-step-btn",title:"Thu nhỏ trang (-)",onClick:()=>Q==null?void 0:Q.setZoom(Math.max(0.2,Math.round((((i==null?void 0:i.zoom)??1)/1.2)*100)/100)),style:{width:"22px",height:"24px",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:"transparent",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"700",padding:0,margin:"0 2px",color:"inherit"},children:"-"}),p.jsx("button",{className:"tb-zoom-step-btn",title:"Phóng to trang (+)",onClick:()=>Q==null?void 0:Q.setZoom(Math.min(5,Math.round((((i==null?void 0:i.zoom)??1)*1.2)*100)/100)),style:{width:"22px",height:"24px",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:"transparent",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"700",padding:0,margin:"0 2px",color:"inherit"},children:"+"}),p.jsx("button",{className:"tb-zoom-step-btn tb-fullscreen-toggle",title:Ks?"Thu nhỏ cửa sổ (Bấm phím ESC)":"Phóng to toàn màn hình",onClick:()=>xu(),style:{width:"24px",height:"24px",borderRadius:"4px",border:"1px solid var(--border,rgba(0,0,0,0.15))",background:Ks?"rgba(225,29,72,0.15)":"transparent",color:Ks?"#e11d48":"inherit",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,margin:"0 2px"},children:Ks?p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:p.jsx("path",{d:"M4 14h6v6m10-10h-6V4m0 6 7-7M3 21l7-7"})}):p.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:p.jsx("path",{d:"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"})})}),p.jsx(ei,{align:"center",open:wt==="page",';
patch('Item 3: Add Zoom -, Zoom +, and Fullscreen buttons into tb-title', p_title_old, p_title_new);

// =========================================================================
// 5. ITEM 1 & 4: INSERT TELEGRAM & QUICKNOTE MODULE BLOCKS
// =========================================================================
const p_rte_old = 'function Rte({doc:e,cursor:t,';
const p_rte_new = tgBlock + '\n' + qnBlock + '\n' + 'function Rte({doc:e,cursor:t,';
patch('Items 1 & 4: Insert TelegramLectureService, modals, QN_TEMPLATES, QuickNoteModal', p_rte_old, p_rte_new);

// Declare _pendVid and _tgUp states in NoteRenderer component
const p_state_old = '[Ks,Z5]=q.useState(!!c.fullScreen),';
const p_state_new = '[Ks,Z5]=q.useState(!!c.fullScreen),[_pendVid,_setPendVid]=q.useState(null),[_tgUp,_setTgUp]=q.useState(null),';
patch('Item 4: Declare _pendVid and _tgUp states', p_state_old, p_state_new);

// Wire record onstop to call _openSaveLectureModal
const p_rec_onstop_old = ',await e.saveVideo(rt,tt,t)&&i(l.recordSaved)}catch(rt){';
const p_rec_onstop_new = ';if(typeof window._openSaveLectureModal==="function"){window._openSaveLectureModal({blob:rt,format:tt,ext:tt,defaultName:t||("Bài giảng "+new Date().toLocaleDateString("vi-VN")),durationSec:Math.round((Date.now()-we-Ne)/1e3)});}else{await e.saveVideo(rt,tt,t)&&i(l.recordSaved);}}catch(rt){';
patch('Item 4: record onstop triggers SaveLectureVideoModal', p_rec_onstop_old, p_rec_onstop_new);

// Add quickNote hotkey 'Q' into shortcuts mapping
const p_kbd_old = 'square:["Shift+Q"],geoMove:["U"],';
const p_kbd_new = 'square:["Shift+Q"],quickNote:["Q"],geoMove:["U"],';
patch('Item 1: Keyboard shortcut Q for quickNote', p_kbd_old, p_kbd_new);

// Add quickNote into action dispatcher
const p_disp_old = 'case"sticker":return te({k:"sticker"});';
const p_disp_new = 'case"sticker":return te({k:"sticker"});case"quickNote":return te({k:"quickNote"});';
patch('Item 1: Action dispatcher for quickNote', p_disp_old, p_disp_new);

// Add modals into main dialog rendering
const p_modals_old = '(F==null?void 0:F.k)==="sticker"&&p.jsx(Xte,{onClose:()=>te(null),keyOf:j=>e.mobile?"":on(`sticker:${j}`),onPick:(j,X,ae)=>{te(null),Q==null||Q.insertImage(j,{w:X,h:ae}).catch(Uo)}}),';
const p_modals_new = '(F==null?void 0:F.k)==="sticker"&&p.jsx(Xte,{onClose:()=>te(null),keyOf:j=>e.mobile?"":on(`sticker:${j}`),onPick:(j,X,ae)=>{te(null),Q==null||Q.insertImage(j,{w:X,h:ae}).catch(Uo)}}),(F==null?void 0:F.k)==="quickNote"&&p.jsx(QuickNoteModal,{onClose:()=>te(null),onPick:(j,X,ae)=>{te(null),Q==null||Q.insertImage(j,{w:X,h:ae,quickNote:!0}).catch(Uo)}}),(F==null?void 0:F.k)==="telegramSettings"&&p.jsx(TelegramSettingsModal,{onClose:()=>te(null),notify:i}),(F==null?void 0:F.k)==="lectureVideo"&&p.jsx(LectureVideoModal,{d:s.current?.doc,tctrl:s.current,onClose:()=>te(null),openSettings:()=>te({k:"telegramSettings"}),notify:i}),_pendVid&&p.jsx(SaveLectureVideoModal,{data:_pendVid,onSave:name=>{e.saveVideo(_pendVid.blob,_pendVid.format,name);_setPendVid(null)},onClose:()=>_setPendVid(null),notify:i}),_tgUp&&p.jsx(TelegramUploadOverlay,{progress:_tgUp.progress,loadedMB:_tgUp.loadedMB,totalMB:_tgUp.totalMB,done:_tgUp.done,error:_tgUp.error,message:_tgUp.message,onCancel:_tgUp.cancel}),';
patch('Items 1 & 4: Render QuickNoteModal, TelegramSettingsModal, LectureVideoModal, SaveLectureVideoModal, TelegramUploadOverlay', p_modals_old, p_modals_new);

// Add quickNote and handwriting sync selection in pointerdown
const p_down_qn_old = 'this.erasedInk=!1,this.eraseAt(i,r);return}const h=this.doc.pages[i],d=gt(h.geo);switch(this.tool.k){case"pen":';
const p_down_qn_new = 'this.erasedInk=!1,this.eraseAt(i,r);return}const h=this.doc.pages[i],d=gt(h.geo);const qnH=[...h.items].reverse().find(x=>!x.bg&&(x.quickNote||(x.src&&typeof x.src==="string"&&x.src.startsWith("data:image/svg+xml;base64,PHN2Zy")))&&r.x>=x.x&&r.x<=x.x+x.w&&r.y>=x.y&&r.y<=x.y+48);if(qnH){const selNote={page:i,strokes:new Set,items:new Set([qnH.id]),points:new Set,shapes:new Set};for(const st of h.strokes){const b=Wi(st),cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2;cx>=qnH.x-10&&cx<=qnH.x+qnH.w+10&&cy>=qnH.y-10&&cy<=qnH.y+qnH.h+10&&selNote.strokes.add(st.id);}this.sel=selNote,this.drag={k:"move",page:i,from:r,moved:!1},this.redraw(),this.emit();return;}switch(this.tool.k){case"pen":';
patch('Item 1: Drag quicknote header selects note and all contained handwriting', p_down_qn_old, p_down_qn_new);

// Add select tool group select for quickNote
const p_sel_qn_old = 'else if(v&&!w)d.items.add(v.id);else{';
const p_sel_qn_new = 'else if(v&&!w){const qn=[...n.items].reverse().find(x=>!x.bg&&(x.quickNote||(x.src&&typeof x.src==="string"&&x.src.startsWith("data:image/svg+xml;base64,PHN2Zy")))&&v&&v.id===x.id);if(qn){d.items.add(qn.id);for(const st of n.strokes){const sb=Wi(st),cx=(sb.x0+sb.x1)/2,cy=(sb.y0+sb.y1)/2;cx>=qn.x-10&&cx<=qn.x+qn.w+10&&cy>=qn.y-10&&cy<=qn.y+qn.h+10&&d.strokes.add(st.id);}}else{d.items.add(v.id);}}else{';
patch('Item 1: Selecting quicknote with select tool selects contained handwriting', p_sel_qn_old, p_sel_qn_new);

// Replace the actions group in toolbar
const oldActionsGroup = 'settings:()=>p.jsxs(q.Fragment,{children:[St("settings")&&p.jsx(ct,{title:n.settings,onClick:()=>te({k:"settings"}),children:p.jsx(me.settings,{})}),p.jsx(ct,{title:toolbarSide==="left"?"Chuyển thanh công cụ lên trên":"Chuyển thanh công cụ sang dọc bên trái",onClick:toggleToolbarSide,children:p.jsx("span",{style:{fontSize:"14px",fontWeight:"bold",color:"var(--muted, #555)"},children:toolbarSide==="left"?"⬆":"⬅"})}),p.jsx(ct,{title:sw?"Thanh công cụ: Chuyển về 1 dòng":"Thanh công cụ: Hiển thị 2 dòng",on:sw,onClick:toggleTwoRows,children:p.jsx("span",{style:{fontSize:"13px",fontWeight:"bold",color:"var(--muted, #555)"},children:"2☰"})})]}),record:()=>e.saveVideo&&St("record")&&p.jsx(ct,{title:n.record,on:bm,onClick:U2,children:p.jsx(me.record,{})})};return Mu.filter(X=>oD.has(X)).map(X=>{var ae;return p.jsx(q.Fragment,{children:(ae=j[X])==null?void 0:ae.call(j)},X)})})()})]}),';

const newActionsGroup = 'settings:()=>p.jsxs(q.Fragment,{children:[St("settings")&&p.jsx(ct,{title:n.settings,onClick:()=>te({k:"settings"}),children:p.jsx(me.settings,{})}),p.jsx(ct,{title:toolbarSide==="left"?"Chuyển thanh công cụ lên trên":"Chuyển thanh công cụ sang dọc bên trái",onClick:toggleToolbarSide,children:p.jsx("span",{style:{fontSize:"14px",fontWeight:"bold",color:"var(--muted, #555)"},children:toolbarSide==="left"?"⬆":"⬅"})}),p.jsx(ct,{title:sw?"Thanh công cụ: Chuyển về 1 dòng":"Thanh công cụ: Hiển thị 2 dòng",on:sw,onClick:toggleTwoRows,children:p.jsx("span",{style:{fontSize:"13px",fontWeight:"bold",color:"var(--muted, #555)"},children:"2☰"})})]}),record:()=>e.saveVideo&&St("record")&&p.jsx(ct,{title:n.record,on:bm,onClick:U2,children:p.jsx(me.record,{})})};return Mu.filter(X=>oD.has(X)).map(X=>{var ae;return p.jsx(q.Fragment,{children:(ae=j[X])==null?void 0:ae.call(j)},X)})})()}),p.jsxs("div",{className:"tb-group actions",children:[p.jsx(ei,{open:wt==="subjects",setOpen:j=>At(j?"subjects":""),button:p.jsxs(ct,{title:"Chế độ Môn học: Bật/Tắt môn dạy",onClick:()=>At(wt==="subjects"?"":"subjects"),children:[p.jsx("span",{style:{fontSize:"14px"},children:"🔬"}),p.jsx(me.chevron,{})]}),children:p.jsxs("div",{className:"subject-picker-pop",style:{padding:"8px 12px",minWidth:"160px"},children:[p.jsx("div",{style:{fontWeight:"bold",fontSize:"12px",marginBottom:"8px",color:"var(--muted, #666)"},children:"CHỌN MÔN DẠY"}),[{id:"math",name:"Toán",icon:"📐"},{id:"physics",name:"Vật lí",icon:"⚛️"},{id:"chemistry",name:"Hóa học",icon:"🧪"},{id:"biology",name:"Sinh học",icon:"🧬"}].map(sub=>p.jsxs("label",{key:sub.id,style:{display:"flex",alignItems:"center",gap:"8px",padding:"5px 0",cursor:"pointer",fontSize:"13px"},children:[p.jsx("input",{type:"checkbox",checked:Tr.includes(sub.id),onChange:()=>{const next=Tr.includes(sub.id)?(Tr.length<=1?Tr:Tr.filter(x=>x!==sub.id)):[...Tr,sub.id];X5(next),yt({subjects:next}),localStorage.setItem("nr_subjects",JSON.stringify(next))}}),p.jsx("span",{children:sub.icon}),p.jsx("span",{style:{fontWeight:Tr.includes(sub.id)?"bold":"normal"},children:sub.name})]},sub.id))]})}),p.jsx(ct,{title:"Chèn giấy note (Q)",onClick:()=>te({k:"quickNote"}),children:p.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[p.jsx("path",{d:"M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z"}),p.jsx("path",{d:"M15 3v6h6"})]})}),p.jsx(ct,{title:(s.current?.doc?.telegramVideo||(i&&i.telegramVideo))?"Xem video bài giảng (Kho Đám Mây)":"Gắn / Xem video bài giảng",on:!!(s.current?.doc?.telegramVideo||(i&&i.telegramVideo)),onClick:()=>te({k:"lectureVideo"}),children:p.jsx("span",{style:{fontSize:"16px",lineHeight:"1"},children:"🎬"})}),p.jsx(ct,{title:"Lưu bài viết lên Web QMath LMS (Ctrl+S)",onClick:()=>{if(typeof window.QMathLMS?.openSaveModal==="function"){window.QMathLMS.openSaveModal();}else{const b=document.getElementById("qmath-btn-save-cloud");if(b)b.click();else alert("Bảng viết chưa sẵn sàng hoặc vui lòng mở từ hệ thống LMS!");}},children:p.jsx("span",{style:{fontSize:"16px",lineHeight:"1"},children:"☁️"})}),e.saveVideo&&p.jsx(ct,{title:bm?"🔴 Đang quay - Bấm để Dừng":n.record,on:bm,onClick:U2,className:bm?"toolbar-recording-btn on":"",children:bm?p.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px"},children:[p.jsx("span",{className:"tb-rec-dot"}),p.jsx("span",{style:{fontSize:"11px",fontWeight:"700",color:"#ef4444"},children:"DỪNG"})]}):p.jsx(me.record,{})}),p.jsx(ct,{title:n.settings,onClick:()=>te({k:"settings"}),children:p.jsx(me.settings,{})}),p.jsx(ct,{title:toolbarSide==="left"?"Chuyển thanh công cụ lên trên":"Chuyển thanh công cụ sang dọc bên trái",onClick:toggleToolbarSide,children:p.jsx("span",{style:{fontSize:"14px",fontWeight:"bold",color:"var(--muted, #555)"},children:toolbarSide==="left"?"⬆":"⬅"})}),p.jsx(ct,{title:sw?"Thanh công cụ: Chuyển về 1 dòng":"Thanh công cụ: Hiển thị 2 dòng",on:sw,onClick:toggleTwoRows,children:p.jsx("span",{style:{fontSize:"13px",fontWeight:"bold",color:"var(--muted, #555)"},children:"2☰"})})]})]}),';

patch('Items 1, 4: Pinned Actions Toolbar (Subjects, QuickNote Q, Telegram Video, QMath Save, Record, Settings, Side, TwoRows)', oldActionsGroup, newActionsGroup);

console.log('Validating full bundle with Acorn parser...');
acorn.parse(js, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('Acorn validation 100% SUCCESSFUL! Zero syntax errors!');

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Saved patched bundle to:', jsPath);
