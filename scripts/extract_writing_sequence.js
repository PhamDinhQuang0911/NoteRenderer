const fs = require('fs');
const { execSync } = require('child_process');

const dir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/all_frames_10fps';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();

// Let's create an image diff between consecutive frames around the writing area:
// x: 1900..2500, y: 500..1140
// And let's find any frame where an unusual icon (like a hand cursor) appears!
// Let's crop frames 30 to 80 (where the user writes the first few words: "Cho hàm số y = 2x + 3")
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/hand_search';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (let i = 25; i <= 85; i++) {
  const pad = String(i).padStart(4, '0');
  execSync(`ffmpeg -y -i "${dir}/f_${pad}.png" -vf "crop=350:250:2000:700" "${outDir}/w_${pad}.png"`);
}
console.log('Writing sequence extracted for inspection');
