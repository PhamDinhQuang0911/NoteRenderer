const fs = require('fs');
const { execSync } = require('child_process');

// We have 58 frames in testvideo_frames: frame_001.png to frame_058.png
// Let's create crops or check what is in testvideo.mp4 around writing
// Let's crop the center writing area of frames 001 to 058 to see where the hand icon appears
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/testvideo_crops';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Let's extract 1 frame per second from 0 to 29 seconds, with crop around active writing
// First let's inspect what full frames look like at 5s, 10s, 15s, 20s, 25s
const testFrames = [1, 10, 20, 30, 40, 50, 58];
testFrames.forEach(idx => {
  const pad = String(idx).padStart(3, '0');
  console.log(`Frame ${pad}: size = ${fs.statSync('C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/testvideo_frames/frame_' + pad + '.png').size}`);
});
