const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

// Find where $c and Mf are assigned in the range 1700000 to 1814000
const snippet = bundle.slice(1750000, 1814000);
console.log('Snippet length:', snippet.length);

// Search for $c= and Mf=
[...snippet.matchAll(/\$c\s*=[^,;]+|Mf\s*=[^,;]+/g)].forEach(m => {
  console.log(m[0]);
});
