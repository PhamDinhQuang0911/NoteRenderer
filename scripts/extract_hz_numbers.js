const fs = require('fs');
const { execSync } = require('child_process');

// In all_frames_10fps, f_0001.png to f_0288.png
// The 'Số đo bút' box is at x: 2260..2480, y: 880..980.
// Let's write a small script to find any frame where the Hz value is in the 70s or 60s or 80s
// We can use ffmpeg to crop the exact number area and read raw pixels or OCR
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/hz_numbers';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Number is after 'Khung hình trang: '
// Let's crop just x: 2360..2440, y: 920..945
for (let i = 1; i <= 288; i += 5) {
  const pad = String(i).padStart(4, '0');
  const inFile = `C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/all_frames_10fps/f_${pad}.png`;
  const outFile = `${outDir}/num_${pad}.png`;
  if (fs.existsSync(inFile)) {
    execSync(`ffmpeg -y -i "${inFile}" -vf "crop=100:30:2370:925" "${outFile}"`);
  }
}
console.log('Hz numbers extracted');
