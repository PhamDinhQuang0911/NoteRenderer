const { execSync } = require('child_process');
const fs = require('fs');
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_frames/writing_65';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Extract 2 seconds at 30 fps from 63s to 65s
execSync(`ffmpeg -y -ss 00:01:03 -i "E:/Video-Capture/Sổ 2026-10-31 00.46.mp4" -t 3 -r 20 "${outDir}/w_%03d.png"`);
console.log('Extracted frames count:', fs.readdirSync(outDir).length);
