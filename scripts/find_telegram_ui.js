const fs = require('fs');
const js = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/scripts/index-C4FEyT2h-stable.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('telegramSettings', pos)) !== -1) {
  console.log('--- telegramSettings at', pos, '---');
  console.log(js.substring(pos - 100, pos + 300));
  pos += 16;
}

pos = 0;
while ((pos = js.indexOf('SaveLectureVideoModal', pos)) !== -1) {
  console.log('--- SaveLectureVideoModal at', pos, '---');
  console.log(js.substring(pos - 100, pos + 400));
  pos += 21;
}

pos = 0;
while ((pos = js.indexOf('TelegramVideoModal', pos)) !== -1) {
  console.log('--- TelegramVideoModal at', pos, '---');
  console.log(js.substring(pos - 100, pos + 400));
  pos += 18;
}
