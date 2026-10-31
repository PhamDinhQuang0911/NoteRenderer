const fs = require('fs');
const vm = require('vm');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

function check(code) {
    try {
        new vm.SourceTextModule(code);
        return true;
    } catch (e) {
        return e.message;
    }
}

console.log('Whole file check:', check(js));

// Let's find the error location by bisecting or checking slices!
// Since an ES module must have valid syntax across the whole file,
// let's parse using a tolerant parser or by checking smaller code chunks!
