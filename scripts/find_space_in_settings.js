const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

let pos = 1935600;
while (true) {
    const idx = code.indexOf('space', pos);
    if (idx === -1 || idx > 1950000) break;
    const snippet = code.substring(Math.max(0, idx - 40), Math.min(code.length, idx + 150));
    if (snippet.includes('spaceMode') || snippet.includes('space') && snippet.includes('option') || snippet.includes('space')) {
        console.log('--- match at', idx, '---');
        console.log(snippet);
    }
    pos = idx + 5;
}
