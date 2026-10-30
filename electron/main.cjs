// Entry point. In development the real code is appmain.cjs, source we can read and debug. In a packaged
// build that source is left out and only its V8 bytecode (appmain.jsc) ships, loaded through bytenode.
// A packaged build never looks for the source: an appmain.cjs placed next to it would otherwise run instead.
const path = require("path");
const { app } = require("electron");

if (!app.isPackaged) {
  require("./appmain.cjs");
} else {
  require("bytenode");
  require(path.join(__dirname, "appmain.jsc"));
}
