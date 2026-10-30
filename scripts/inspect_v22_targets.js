const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

console.log('1. Target d2:');
const d2Idx = content.indexOf('h2=!0,d2=(E)=>{');
console.log('d2Idx:', d2Idx);
if (d2Idx !== -1) {
  console.log(content.slice(d2Idx, d2Idx + 450));
}

console.log('\n2. Target wetBase in paint():');
const paintWetBaseIdx = content.indexOf('const b=this.wetStroke();if(b&&this.canvas.width&&this.canvas.height){');
console.log('paintWetBaseIdx:', paintWetBaseIdx);
if (paintWetBaseIdx !== -1) {
  console.log(content.slice(paintWetBaseIdx - 100, paintWetBaseIdx + 450));
}

console.log('\n3. Target case pen in press(t):');
const casePenIdx = content.indexOf('case"pen":case"scratch":case"laser":case"highlighter":{');
console.log('casePenIdx:', casePenIdx);
if (casePenIdx !== -1) {
  console.log(content.slice(casePenIdx, casePenIdx + 600));
}
