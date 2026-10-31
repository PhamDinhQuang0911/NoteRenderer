const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const teNeedle = 'async function _te(e){const t=new Image;t.src=e,await t.decode();const W=Math.min(2400,Math.max(nu,t.naturalWidth)),H=Math.round(W*(t.naturalHeight/t.naturalWidth)),n=document.createElement("canvas");n.width=W,n.height=H;const o=n.getContext("2d");o.imageSmoothingEnabled=!0,o.imageSmoothingQuality="high",o.fillStyle="#ffffff",o.fillRect(0,0,W,H);o.drawImage(t,0,0,W,H);const a=n.toDataURL("image/jpeg",.94);return n.width=n.height=0,a}';
console.log('teNeedle found:', code.includes(teNeedle));
