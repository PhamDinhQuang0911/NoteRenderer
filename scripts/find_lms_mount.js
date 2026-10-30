const fs = require('fs');
const lms = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/qmath-lms-auth.js', 'utf8');

const regexes = [
  /mount|inject|init|button|toolbar|Lưu|UI/gi
];

let pos = 0;
while ((pos = lms.indexOf('createElement', pos)) !== -1) {
  console.log('--- createElement at', pos, '---');
  console.log(lms.substring(pos - 50, pos + 250));
  pos += 13;
}
