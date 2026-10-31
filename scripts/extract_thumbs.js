const fs = require('fs');
const { execSync } = require('child_process');

const dir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/all_frames_10fps';
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/video_overview';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Sample 1 frame every 2 seconds: 0, 2, 4, 6, 8, ..., 28s
for (let i = 1; i <= 288; i += 20) {
  const pad = String(i).padStart(4, '0');
  execSync(`ffmpeg -y -i "${dir}/f_${pad}.png" -vf "scale=632:285" "${outDir}/thumb_${pad}.png"`);
}
console.log('Thumbs extracted');
