const fs = require('fs');
const { execSync } = require('child_process');

const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/stats_crops';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (let i = 1; i <= 58; i += 2) {
  const pad = String(i).padStart(3, '0');
  const inFile = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/testvideo_frames/frame_' + pad + '.png';
  const outFile = outDir + '/stats_' + pad + '.png';
  if (fs.existsSync(inFile)) {
    execSync(`ffmpeg -y -i "${inFile}" -vf "crop=350:200:2150:880" "${outFile}"`);
  }
}
console.log('Stats crops extracted');
