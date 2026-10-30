const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

const regexes = [
  /quickNote/gi,
  /key\s*===?\s*['"]q['"]/gi,
  /key\s*===?\s*['"]Q['"]/gi,
  /giấy note/gi,
  /pushpin/gi,
  /note paper/gi,
  /"q"|"Q"/g
];

for (const r of regexes) {
  const matches = [...js.matchAll(r)];
  console.log(r.source, 'matches:', matches.length);
  for (const m of matches.slice(0, 3)) {
    const start = Math.max(0, m.index - 120);
    const end = Math.min(js.length, m.index + m[0].length + 120);
    console.log('Snippet:', js.substring(start, end));
    console.log('---');
  }
}
