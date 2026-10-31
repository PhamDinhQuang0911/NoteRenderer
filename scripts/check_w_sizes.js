const fs = require('fs');
const dir = 'C:/Users/ADMIN/.gemini/antigravity/brain/c096a0d1-ec7a-4298-9784-66cde1f39154/hand_search';
const files = fs.readdirSync(dir).filter(f => f.startsWith('w_')).sort();

// Let's print file sizes to see sudden changes (cursor appearing/disappearing/changing)
files.forEach((f, i) => {
  const stat = fs.statSync(dir + '/' + f);
  console.log(f, stat.size);
});
