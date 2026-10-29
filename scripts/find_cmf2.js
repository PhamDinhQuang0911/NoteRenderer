const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

let pos = 0;
while ((pos = bundle.indexOf('n.width=$c', pos)) !== -1) {
  console.log('n.width=$c at:', pos);
  pos++;
}

// Search for where $c is initialized as a constant/variable
const m = bundle.match(/(\w+)=\d+,(\w+)=\d+.*?n\.width=\$c/);
console.log('Match near:', m ? m[0].slice(0, 100) : 'none');

// Let's find all occurrences of $c within 5000 chars before 1813500
const sub = bundle.slice(1805000, 1814000);
console.log('Matches in sub:');
[...sub.matchAll(/\b(\w+)\s*=\s*(\d+)/g)].forEach(x => {
  if (x[1] === '$c' || x[1] === 'Mf' || x[2] > 100) console.log(x[0]);
});
