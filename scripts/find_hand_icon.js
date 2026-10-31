const fs = require('fs');
const { execSync } = require('child_process');

// Let's extract frames at 10 fps (around 290 frames)
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/all_frames_10fps';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

execSync(`ffmpeg -y -i "E:/Video-Capture/testvideo.mp4" -vf "fps=10" "${outDir}/f_%04d.png"`);
console.log('Extracted 10fps frames:', fs.readdirSync(outDir).length);
