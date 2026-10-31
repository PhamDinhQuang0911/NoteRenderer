const fs = require('fs');
let js = fs.readFileSync('C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-v0.7.0-Backup-PrePolish/dist/assets/index-CtXdKE8z.js', 'utf8');

const deuIdx = js.indexOf('d:"M3 9h18M3 15h18"');
console.log(js.substring(deuIdx - 1200, deuIdx - 500));
