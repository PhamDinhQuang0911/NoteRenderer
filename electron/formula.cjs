let htmlDoc = null;
let adaptor = null;

function initMathJax() {
  if (htmlDoc) return { htmlDoc, adaptor };
  try {
    const { mathjax } = require("@mathjax/src/cjs/mathjax.js");
    const { TeX } = require("@mathjax/src/cjs/input/tex.js");
    const { SVG } = require("@mathjax/src/cjs/output/svg.js");
    const { liteAdaptor } = require("@mathjax/src/cjs/adaptors/liteAdaptor.js");
    const { RegisterHTMLHandler } = require("@mathjax/src/cjs/handlers/html.js");
    const { BaseConfiguration } = require("@mathjax/src/cjs/input/tex/base/BaseConfiguration.js");
    const { AmsConfiguration } = require("@mathjax/src/cjs/input/tex/ams/AmsConfiguration.js");

    adaptor = liteAdaptor();
    RegisterHTMLHandler(adaptor);
    const tex = new TeX({
      packages: [BaseConfiguration.name, AmsConfiguration.name]
    });
    const svg = new SVG({ fontCache: "local" });
    htmlDoc = mathjax.document("", { InputJax: tex, OutputJax: svg });
    return { htmlDoc, adaptor };
  } catch (err) {
    console.error("MathJax initialization error:", err);
    return null;
  }
}

function renderFormula(formula, color = "#000000", display = true) {
  try {
    const mj = initMathJax();
    if (!mj) return null;
    const node = mj.htmlDoc.convert(formula || "", { display: !!display });
    const svgEl = mj.adaptor.tags(node, "svg")[0];
    if (!svgEl) return null;
    if (color && typeof color === "string") {
      mj.adaptor.setStyle(svgEl, "color", color);
    }
    return mj.adaptor.outerHTML(svgEl);
  } catch (e) {
    console.error("renderFormula error:", e);
    return null;
  }
}

module.exports = { renderFormula };
