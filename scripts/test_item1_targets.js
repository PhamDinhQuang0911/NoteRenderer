const fs = require('fs');
const code = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-CtXdKE8z.js', 'utf8');

// Target 1: M1.figures
const m1Needle = 'figures:["shapes","segment","vector","line","circle","triangle","rect","square","geo","geoMove","gridSnap","trace","clearTrace","graph","vartable","oxyz","flatPlane","spreadPlane","formula","problem","tikzFigure","tikzImage","chem","periodic","lab","circuit","forces","optics","physGraph","bioGraph","waveTool","fieldTool","physConst","formulaSheet","ecology","dna","division","bioFig","pedigree","cross","apparatus","chemDiagram","atomTool","structure","sticker","calc","calcScreen","text",';
console.log('M1 needle found:', code.includes(m1Needle));

// Target 2: Vietnamese keyActions
const viNeedle = 'keyActions:{newNote:"Sổ mới",open:"Mở sổ",save:"Lưu",saveAs:"Lưu thành...",undo:"Hoàn tác",redo:"Làm lại",';
console.log('VI keyActions needle found:', code.includes(viNeedle));

// Target 3: English keyActions
const enNeedle = 'keyActions:{newNote:"New notebook",open:"Open",save:"Save",saveAs:"Save as...",undo:"Undo",redo:"Redo",';
console.log('EN keyActions needle found:', code.includes(enNeedle));
