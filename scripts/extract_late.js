const { execSync } = require('child_process');
const fs = require('fs');
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_frames/late_writing';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Extract from 64s to 67s at 10 fps
execSync(`ffmpeg -y -ss 00:01:04 -i "E:/Video-Capture/Sổ 2026-10-31 00.46.mp4" -t 3 -r 10 "${outDir}/lw_%02d.png"`);
console.log('Late writing count:', fs.readdirSync(outDir).length);
