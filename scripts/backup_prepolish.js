const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer';
const dst = 'C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-v0.7.0-Backup-PrePolish';

console.log('Creating backup from', src, 'to', dst);
if (fs.existsSync(dst)) {
    fs.rmSync(dst, { recursive: true, force: true });
}
fs.mkdirSync(dst, { recursive: true });

execSync(`powershell -NoProfile -Command "Copy-Item -Path '${src}\\*' -Destination '${dst}' -Recurse -Force"`, { stdio: 'inherit' });
console.log('Backup created successfully at:', dst);

// Also create a git tag for extra safety
try {
    execSync(`git -C "${src}" tag -a backup-pre-polish -m "Backup before implementing user 4 polish requests"`, { stdio: 'ignore' });
    console.log('Created git tag backup-pre-polish');
} catch (e) {}
