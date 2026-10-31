const { execSync } = require('child_process');
const fs = require('fs');
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_frames/early_crop';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (let i = 8; i <= 18; i++) {
    const num = i < 10 ? '0' + i : i;
    const src = `C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_frames/early_writing/e_${num}.png`;
    const dst = `${outDir}/ec_${num}.png`;
    execSync(`ffmpeg -y -i "${src}" -vf "crop=400:300:900:300" "${dst}"`);
}
console.log('Early cropped ready');
