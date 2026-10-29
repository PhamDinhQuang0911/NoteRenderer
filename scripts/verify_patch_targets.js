const fs = require('fs');

const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let content = fs.readFileSync(bundlePath, 'utf8');

// Check 1: Subject persistence
const targetFl = '[Fl,c2]=z.useState(()=>(Array.isArray(c.subjects)&&c.subjects.length>1)?c.subjects:IZ)';
console.log('Found targetFl?', content.includes(targetFl));

// Check 2: c2 calls
const targetPopChange = 'c2(next),wt({subjects:next})';
console.log('Found targetPopChange?', content.includes(targetPopChange));

const targetSettingsSave = 'c2(Ks),wt({subjects:Ks})';
console.log('Found targetSettingsSave?', content.includes(targetSettingsSave));

// Check 3: d2 and useEffect
let idxD2 = content.indexOf('h2=!!(e.toggleFullScreen||e.setFullScreen),d2=()=>');
console.log('Found idxD2?', idxD2 !== -1);
if (idxD2 !== -1) {
  console.log('d2 snippet:', content.substring(idxD2, idxD2 + 250));
}

// Check 4: tb-zoom-step-btn in tb-title
let idxZoomBtn = content.indexOf('title:"Phóng to trang (+)"');
console.log('Found idxZoomBtn?', idxZoomBtn !== -1);
if (idxZoomBtn !== -1) {
  console.log('zoomBtn snippet:', content.substring(idxZoomBtn - 30, idxZoomBtn + 350));
}
