const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dest = 'C:/Users/ADMIN/Desktop/Backup_NoteRenderer_v0.6.3';
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

console.log('Copying installer...');
fs.copyFileSync('C:/Users/ADMIN/Desktop/Cai_Dat_NoteRenderer.exe', path.join(dest, 'Cai_Dat_NoteRenderer.exe'));

console.log('Copying portable zip...');
fs.copyFileSync('C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-Windows-v0.6.3-Portable.zip', path.join(dest, 'NoteRenderer-Windows-v0.6.3-Portable.zip'));

console.log('Copying source zip...');
fs.copyFileSync('C:/Users/ADMIN/Desktop/0.63-notereader/NoteRenderer-v0.6.3-Source.zip', path.join(dest, 'NoteRenderer-v0.6.3-Source.zip'));

console.log('Copying source folder...');
const srcDir = path.join(dest, 'NoteRenderer_Source');
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

// Copy GitHub NoteRenderer excluding .git
function copyDir(src, dst) {
  const items = fs.readdirSync(src);
  for (const item of items) {
    if (item === '.git') continue;
    const s = path.join(src, item);
    const d = path.join(dst, item);
    const stat = fs.statSync(s);
    if (stat.isDirectory()) {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

copyDir('C:/Users/ADMIN/Documents/GitHub/NoteRenderer', srcDir);
console.log('Backup created successfully at:', dest);
console.log('Contents:', fs.readdirSync(dest));
