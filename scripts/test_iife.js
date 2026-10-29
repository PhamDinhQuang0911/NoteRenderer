const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const code = `
function test(s, fM) {
  const o = {};
  const _ = s.paper;
  return _ && (o.paper = { paper: _.paper, ..._.image ? { image: _.image } : {} }),
    (() => {
      try {
        const P0 = JSON.parse(localStorage.getItem("nr_saved_paper") ?? "null");
        P0 && typeof P0 == "object" && (o.paper = { ...o.paper, ...P0 });
      } catch(_) {}
    })(),
    o;
}
`;

console.log(acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' }));
console.log('Valid JS!');
