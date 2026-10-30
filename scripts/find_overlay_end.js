const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

const overlayPos = js.indexOf('function TelegramUploadOverlay');
console.log('TelegramUploadOverlay at:', overlayPos);
const nextFuncPos = js.indexOf('function ', overlayPos + 35);
console.log('Next function at:', nextFuncPos);
console.log(js.substring(overlayPos, nextFuncPos));
