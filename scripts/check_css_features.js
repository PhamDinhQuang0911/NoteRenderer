const fs = require('fs');
const css = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-DiHPgRMg.css', 'utf8');

const checks = [
  'quicknote-dialog',
  'quicknote-grid',
  'quicknote-card',
  'body.nr-fullscreen',
  'tg-upload-overlay',
  'telegram-settings-dialog',
  'rec-quality-select',
  'calc-screen'
];

for (const c of checks) {
  console.log(c, ':', css.includes(c));
}
