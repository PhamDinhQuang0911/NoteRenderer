const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

const tgStart = js.indexOf('// === TELEGRAM LECTURE CLOUD & IN-APP VIDEO PLAYER (062v22) ===');
const qnStart = js.indexOf('const QN_TEMPLATES = [');
const qnEnd = js.indexOf('function QuickNoteModal', qnStart);
const qnModalEnd = js.indexOf('const Oee=26', qnEnd);

console.log('tgStart:', tgStart);
console.log('qnStart:', qnStart);
console.log('qnEnd:', qnEnd);
console.log('qnModalEnd:', qnModalEnd);

// Let's find end of Telegram code
const tgEnd = js.indexOf('function TelegramUploadOverlay', tgStart);
const afterTgUpload = js.indexOf('const G=h?new AudioContext', tgEnd);
console.log('tgEnd:', tgEnd);
console.log('afterTgUpload:', afterTgUpload);
