const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const oldD2Block = 'h2=!!(e.toggleFullScreen||e.setFullScreen),d2=()=>{var E;if(!e.setFullScreen)return(E=e.toggleFullScreen)==null?void 0:E.call(e);Up(!$h),e.setFullScreen(!$h),wt({fullScreen:!$h})};z.useEffect(()=>{var E;c.fullScreen&&((E=e.setFullScreen)==null||E.call(e,!0))},[e]);';

console.log('Matches oldD2Block exactly?', content.includes(oldD2Block));
if (!content.includes(oldD2Block)) {
  let idx = content.indexOf('h2=!!(');
  console.log(content.substring(idx, idx + 260));
}
