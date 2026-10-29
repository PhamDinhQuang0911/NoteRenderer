const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/qmath-lms-auth.js', 'utf8');

const regex = /(?:window\.__NR_\w+|loadAndRenderLessonNote|\.load\(|setTool|clearDoc|emptyDoc)/g;
let m;
while ((m = regex.exec(content)) !== null) {
  console.log(m[0], 'at', m.index, ':', content.slice(Math.max(0, m.index - 50), Math.min(content.length, m.index + 120)));
}
