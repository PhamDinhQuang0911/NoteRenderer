const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-Cyl3OjHe.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('quick-hidden')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
