const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

function findSnippets(kw, maxMatches = 10, context = 120) {
  let idx = 0;
  let count = 0;
  console.log('=== Keyword: ' + kw + ' ===');
  while ((idx = bundle.indexOf(kw, idx)) !== -1 && count < maxMatches) {
    console.log('[Pos ' + idx + ']: ' + bundle.slice(Math.max(0, idx - context), Math.min(bundle.length, idx + kw.length + context)));
    idx += kw.length;
    count++;
  }
}

findSnippets('getViewport');
findSnippets('.render(');
findSnippets('pdfjs');
findSnippets('paper');
