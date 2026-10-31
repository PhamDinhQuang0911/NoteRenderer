const fs = require('fs');

const origPath = 'C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-v0.7.0-Backup-PrePolish/dist/assets/index-CtXdKE8z.js';
const currPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js';

const origJs = fs.readFileSync(origPath, 'utf8');
const currJs = fs.readFileSync(currPath, 'utf8');

console.log('Original length:', origJs.length);
console.log('Current length:', currJs.length);

// Tìm trong bản gốc:
// 1. paintPenTip
const idxTipOrig = origJs.indexOf('paintPenTip(');
console.log('=== Original paintPenTip ===');
console.log(origJs.slice(idxTipOrig - 50, idxTipOrig + 250));

// 2. wetBase trong paint()
const idxWetOrig = origJs.indexOf('const b=this.wetStroke()');
console.log('\n=== Original wetBase in paint() ===');
console.log(origJs.slice(idxWetOrig, idxWetOrig + 350));

// 3. schedule()
const idxSchOrig = origJs.indexOf('schedule(){');
console.log('\n=== Original schedule() ===');
console.log(origJs.slice(idxSchOrig, idxSchOrig + 200));

// 4. paintSoon()
const idxSoonOrig = origJs.indexOf('paintSoon(){');
console.log('\n=== Original paintSoon() ===');
console.log(origJs.slice(idxSoonOrig, idxSoonOrig + 150));

// 5. pointermove gọi gì cho ink
const idxMoveOrig = origJs.indexOf('r.k==="ink"?');
console.log('\n=== Original move ink ===');
console.log(origJs.slice(idxMoveOrig - 50, idxMoveOrig + 100));
