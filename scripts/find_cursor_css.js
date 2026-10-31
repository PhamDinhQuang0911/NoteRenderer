const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

// Search for cursor CSS or cursor: url or cursor style
let pos = 0;
while (true) {
    const idx = code.indexOf('cursor', pos);
    if (idx === -1) break;
    const snippet = code.substring(Math.max(0, idx - 40), Math.min(code.length, idx + 80));
    if (snippet.includes('cursor:') || snippet.includes('cursorScale') || snippet.includes('cursor =') || snippet.includes('cursor=')) {
        console.log('--- cursor match at', idx, '---');
        console.log(snippet);
    }
    pos = idx + 6;
}
