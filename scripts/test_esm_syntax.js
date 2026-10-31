const fs = require('fs');
const vm = require('vm');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

try {
    const mod = new vm.SourceTextModule(js, { identifier: 'index-CtXdKE8z.js' });
    console.log('SourceTextModule successfully created!');
} catch (e) {
    console.error('SyntaxError message:', e.message);
    console.error('Stack:', e.stack);
    if (e.lineNumber) console.log('LineNumber:', e.lineNumber);
    if (e.columnNumber) console.log('ColumnNumber:', e.columnNumber);
}
