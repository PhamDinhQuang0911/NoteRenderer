const fs = require('fs');
const vm = require('vm');
const jsBackup = fs.readFileSync('C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-v0.7.0-Backup-PrePolish/dist/assets/index-CtXdKE8z.js', 'utf8');

try {
    new vm.SourceTextModule(jsBackup);
    console.log('Backup is VALID ESM!');
} catch (e) {
    console.log('Backup error:', e.message);
}
