const { execSync } = require('child_process');
const fs = require('fs');
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_frames/early_writing';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Extract 2 seconds at 15 fps from 6s to 8s
execSync(`ffmpeg -y -ss 00:00:06 -i "E:/Video-Capture/Sổ 2026-10-31 00.46.mp4" -t 3 -r 15 "${outDir}/e_%02d.png"`);
console.log('Extracted early frames:', fs.readdirSync(outDir).length);
