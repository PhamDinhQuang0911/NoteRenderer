const fs = require('fs');
const { execSync } = require('child_process');

// In each frame of all_frames_10fps (f_0001.png to f_0288.png):
// The user is writing on the right half of the screen.
// Let's crop around the pen in each frame or find the frames where there's a hand cursor.
// What does a hand cursor look like? It has fingers pointing up, or palm!
// Let's write a script to crop around the active writing area across frames 1 to 288 at 1-second intervals
const outDir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/cursor_scans';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Let's check frames 10, 20, 30, 40, ..., 280
for (let i = 10; i <= 280; i += 10) {
  const pad = String(i).padStart(4, '0');
  const inFile = `C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/all_frames_10fps/f_${pad}.png`;
  // crop where the user wrote
  execSync(`ffmpeg -y -i "${inFile}" -vf "crop=400:300:2050:800" "${outDir}/scan_${pad}.png"`);
}
console.log('Cursor scans cropped');
