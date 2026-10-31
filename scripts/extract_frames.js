const { execSync } = require('child_process');
const fs = require('fs');
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_frames';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const times = [5, 15, 25, 35, 45, 55, 65, 75];
for (const t of times) {
    execSync(`ffmpeg -y -ss ${t} -i "E:/Video-Capture/Sổ 2026-10-31 00.46.mp4" -vframes 1 -q:v 2 "${outDir}/frame_${t}.png"`);
}
console.log('Frames extracted:', fs.readdirSync(outDir));
