const fs = require('fs');
const { execSync } = require('child_process');

// In all_frames_10fps, f_0001.png to f_0288.png
// The pen cursor is a 24x24 or similar icon.
// Let's find every frame where there is an icon that has the hand shape or where cursor changes!
// Notice that the pen cursor has black outline '#222' and white fill '#fff'.
// The hand cursor also has outline and white fill, BUT its shape is different.
// Even simpler: let's crop the cursor in EVERY frame (e.g. frames 1..288) where cursor position changes!
// Let's write a script that detects the cursor position in each frame and crops a 50x50 box around it.

const dir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/all_frames_10fps';
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/cursor_tracking';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Let's find diff between frame[i] and the clean background to isolate foreground (cursor + ink)
console.log('Script ready');
