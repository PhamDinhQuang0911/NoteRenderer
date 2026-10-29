const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/qmath-lms-auth.js', 'utf8');

const pos = content.indexOf('function renderViewerBottomToolbar');
console.log(content.slice(pos, pos + 2500));
