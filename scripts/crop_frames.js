const { execSync } = require('child_process');
const fs = require('fs');
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_frames/cropped';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Crop around the writing area: width 800, height 500, x 1200, y 300
for (const i of [10, 15, 20, 25, 30, 35, 40]) {
    const src = `C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_frames/writing_65/w_0${i}.png`;
    const dst = `${outDir}/crop_${i}.png`;
    execSync(`ffmpeg -y -i "${src}" -vf "crop=800:500:1200:300" "${dst}"`);
}
console.log('Cropped frames ready');
