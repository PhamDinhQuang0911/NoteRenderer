const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

const regexes = [
  /penButton/gi,
  /insertBlankPage/gi,
  /chèn giấy trống|chèn khoảng trống/gi,
  /giữ nút bút/gi,
  /button===2|buttons&2|buttons&32/g
];

for (const r of regexes) {
  const matches = [...js.matchAll(r)];
  console.log(r.source, 'matches:', matches.length);
  for (const m of matches.slice(0, 5)) {
    const start = Math.max(0, m.index - 100);
    const end = Math.min(js.length, m.index + m[0].length + 100);
    console.log('Snippet:', js.substring(start, end));
    console.log('---');
  }
}
