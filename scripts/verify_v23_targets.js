const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js', 'utf8');

const t1 = 'this.lowLatency&&!this.needFull&&performance.now()-this.lastPaint>=2&&this.paintWet()||this.schedule()';
console.log('T1:', bundle.includes(t1));

const t2 = 'const a=u=>{var h;this.lowLatency&&((h=this.drag)==null?void 0:h.k)==="ink"&&this.move(u)};i.addEventListener("pointerrawupdate",a)';
console.log('T2:', bundle.includes(t2));

const t3 = 'const h=((u=t.getCoalescedEvents)==null?void 0:u.call(t))??[t],d=r.stroke.pts.slice();for(const m of h.length?h:[t]){if(this.lowLatency&&m.timeStamp<r.lastT)continue;r.lastT=m.timeStamp;const y=this.eventPoint(m),b=this.toPage(this.toDoc(y.sx,y.sy),r.page),v=r.snap?r.snap(b):b,k=d[d.length-3],w=d[d.length-2];Math.hypot(v.x-k,v.y-w)<.8/this.zoom||d.push(v.x,v.y,this.pressureOf(m))}r.stroke={...r.stroke,pts:d},this.trailFrom(t,r.stroke);break}';
console.log('T3:', bundle.includes(t3));

const t4 = 'function fee(e){const t=new Image;t.src=e,await t.decode();const W=Math.min(1600,Math.max($c,t.naturalWidth)),H=Math.round(W*(Mf/$c)),n=document.createElement("canvas");n.width=W,n.height=H;const s=n.getContext("2d");s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.fillStyle="#ffffff",s.fillRect(0,0,W,H);const o=Math.min(W/t.naturalWidth,H/t.naturalHeight),i=t.naturalWidth*o,r=t.naturalHeight*o;s.drawImage(t,(W-i)/2,(H-r)/2,i,r);const a=n.toDataURL("image/jpeg",.9);return n.width=n.height=0,a}';
console.log('T4:', bundle.includes(t4));
