const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

// Find where c and wt are in the main component
const pos = 2308000;
console.log(bundle.slice(pos, pos + 2500));
