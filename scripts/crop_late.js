const { execSync } = require('child_process');
const fs = require('fs');
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_frames/late_crop';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (let i = 1; i <= 15; i++) {
    const num = i < 10 ? '0' + i : i;
    const src = `C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_frames/late_writing/lw_${num}.png`;
    const dst = `${outDir}/lc_${num}.png`;
    execSync(`ffmpeg -y -i "${src}" -vf "crop=500:300:1500:400" "${dst}"`);
}
console.log('Late crop ready');
