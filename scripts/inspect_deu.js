const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

const target1 = 'children:p.jsx("path",{d:"M3 9h18M3 15h18"})}),p.jsx("span",{children:"Ð?u"})]})}),shapes:()=>St("shapes")';
console.log('target1 index:', js.indexOf(target1));
if (js.indexOf(target1) === -1) {
    const idx = js.indexOf('d:"M3 9h18M3 15h18"');
    const exact = js.substring(idx - 25, idx + 75);
    console.log('exact:', JSON.stringify(exact));
}
