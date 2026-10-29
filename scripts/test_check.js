const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');
console.log('Includes oldPaintPenTip (this.tipBox=null;return;):', content.includes('this.tipBox=null;return;'));
console.log('Includes oldDownPenTip:', content.includes('this.showPointer(t),t.pointerType==="pen"&&(this.penTip={sx:n,sy:s})'));
console.log('Includes toggleTwoRows:', content.includes('toggleTwoRows'));
console.log('Includes tb-zoom-step-btn:', content.includes('tb-zoom-step-btn'));
