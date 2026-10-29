const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/qmath-lms-auth.js', 'utf8');

function findMatches(pattern) {
  let m;
  while ((m = pattern.exec(content)) !== null) {
    console.log('Match at', m.index, ':', content.slice(Math.max(0, m.index - 50), Math.min(content.length, m.index + 200)));
  }
}

console.log('--- Search save / upload / modal ---');
findMatches(/function\s+(?:showSave|saveLesson|handleSave|openSave|loadLesson|initViewMode)\b/g);
findMatches(/(?:saveLessonModal|openSaveModal|saveToClass|saveClass)\b/g);
findMatches(/viewMode|loadNote|renderLesson/g);
