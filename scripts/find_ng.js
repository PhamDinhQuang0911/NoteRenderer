const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

// Search for ng definition
const snippet = bundle.slice(2380000, 2405000);
const matches = [...snippet.matchAll(/(?:const|let|var|function)\s*ng\b|ng\s*=\s*/g)];
matches.forEach(m => {
  const pos = 2380000 + m.index;
  console.log(`Found match at pos ${pos}:`, bundle.slice(pos - 50, pos + 400));
});
