const fs = require('fs');
const { execSync } = require('child_process');

const dir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/all_frames_10fps';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();

// Let's crop the Hz line from stats box:
// Box is around x: 2150..2480, y: 880..1080.
// Line 2 'Khung hình trang: XX Hz' is around x: 2170..2480, y: 920..960
const outHz = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/hz_crops';
if (!fs.existsSync(outHz)) fs.mkdirSync(outHz, { recursive: true });

for (let i = 0; i < files.length; i += 10) {
  const f = files[i];
  execSync(`ffmpeg -y -i "${dir}/${f}" -vf "crop=300:50:2180:920" "${outHz}/${f}"`);
}
console.log('Hz crops extracted');
