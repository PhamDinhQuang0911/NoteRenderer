const { execSync } = require('child_process');
const fs = require('fs');
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_frames/motion';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

execSync(`ffmpeg -y -ss 00:00:32 -i "E:/Video-Capture/Sổ 2026-10-31 00.46.mp4" -t 2 -r 15 "${outDir}/f_%02d.png"`);
console.log('Extracted frames count:', fs.readdirSync(outDir).length);
