const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

console.log('1. tipBoxNow & paintPenTip check:');
const tipBoxIdx = content.indexOf('tipBoxNow(t){');
console.log('tipBoxIdx:', tipBoxIdx);
if (tipBoxIdx !== -1) {
  console.log(content.slice(tipBoxIdx, tipBoxIdx + 300));
}

console.log('\n2. LX check:');
const lxIdx = content.indexOf('const LX=40;');
console.log('LX=40 found:', lxIdx !== -1);

console.log('\n3. fee check:');
const feeIdx = content.indexOf('async function fee(e){');
console.log('feeIdx:', feeIdx);
if (feeIdx !== -1) {
  console.log(content.slice(feeIdx, feeIdx + 250));
}

console.log('\n4. wheel check:');
const wheelIdx = content.indexOf('wheel(t){');
console.log('wheelIdx:', wheelIdx);
if (wheelIdx !== -1) {
  console.log(content.slice(wheelIdx, wheelIdx + 300));
}

console.log('\n5. shiftAt / board keydown check:');
const shiftIdx = content.indexOf('u.key==="Shift"&&!u.repeat&&(this.shiftAt=performance.now())');
console.log('shiftAt found:', shiftIdx !== -1);
if (shiftIdx !== -1) {
  console.log(content.slice(shiftIdx - 30, shiftIdx + 120));
}

console.log('\n6. t0 / x2 saved paper check:');
const x2Idx = content.indexOf('x2=E=>{const{image:I0,...X0}=E||{};c.paper=E,wt({paper:X0})');
console.log('x2 found:', x2Idx !== -1);
if (x2Idx !== -1) {
  console.log(content.slice(x2Idx, x2Idx + 250));
}
