const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

// 1. Vietnamese spaceSizes
const viSpaceNeedle = 'spaceSizes:{drag:"Trang chèn cao đúng đoạn kéo",full:"Đẩy nội dung xuống trang sau (mọi trang giữ đúng khổ)",flow:"Chèn đúng đoạn kéo, nội dung bị đẩy xuống (phần tràn sang trang mới)"}';
console.log('viSpaceNeedle found:', code.includes(viSpaceNeedle));

// 2. English spaceSizes
const enSpaceNeedle = 'spaceSizes:{drag:"Page put in as tall as the drag",full:"Push what is below on to the next page (pages keep their size)",flow:"Room exactly as tall as the drag, pushing what is below down (what runs over goes on to a new page)"}';
console.log('enSpaceNeedle found:', code.includes(enSpaceNeedle));

// 3. Settings modal options list
const choicesNeedle = '["drag","full","flow"].map(xe=>p.jsxs("label",{className:"check",children:[p.jsx("input",{type:"radio",name:"space-size",checked:J===xe,onChange:()=>ue(xe)})," ",ht.spaceSizes[xe]]},xe))';
console.log('choicesNeedle found:', code.includes(choicesNeedle));

// 4. Default spaceMode or spaceMode state in Settings
const stateNeedle = 'const[J,ue]=q.useState(h??"drag")';
console.log('stateNeedle found:', code.includes(stateNeedle));

// 5. insertSpace
const insertSpaceNeedle = 'async insertSpace(t,n,o){var g;const s=zl(this.doc),i=(g=this.doc.pages[t])==null?void 0:g.height,r=i!==void 0&&i<s-.5;if(o>0)return await zc([this.doc.pages[t]]),r&&i+o<=s+.5&&this.pushWithin(t,n,o,i+o)||this.pushWithin(t,n,o)?void 0:this.spaceFlow?this.flowForSpace(t,n,o):this.splitForSpace(t,n,o);';
console.log('insertSpaceNeedle found:', code.includes(insertSpaceNeedle));
