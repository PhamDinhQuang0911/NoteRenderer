const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

// Search backwards from 1848514 for 'za=' or 'za = '
const snippet = bundle.slice(1840000, 1850000);
console.log('Snippet length:', snippet.length);

// Let's find definitions of za in this range
const matches = [...snippet.matchAll(/(?:const|let|var|function)\s*za\b|za\s*=\s*async/g)];
matches.forEach(m => {
  const pos = 1840000 + m.index;
  console.log(`Found match at pos ${pos}:`, bundle.slice(pos - 50, pos + 400));
});
