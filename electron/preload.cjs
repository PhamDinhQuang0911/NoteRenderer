try {
  const fs = require("fs");
  const logFile = "C:/Users/ADMIN/Desktop/nr_crash.txt";
  window.addEventListener("error", (e) => {
    try {
      fs.appendFileSync(logFile, "[RENDERER ERROR] " + e.message + " at " + e.filename + ":" + e.lineno + ":" + e.colno + "\n" + (e.error ? e.error.stack : "") + "\n");
    } catch(_) {}
  });
  window.addEventListener("unhandledrejection", (e) => {
    try {
      fs.appendFileSync(logFile, "[RENDERER REJECTION] " + (e.reason ? (e.reason.stack || e.reason) : e) + "\n");
    } catch(_) {}
  });
  const origError = console.error.bind(console);
  console.error = function(...args) {
    origError(...args);
    try {
      fs.appendFileSync(logFile, "[CONSOLE ERROR] " + args.map(a => (a && a.stack) ? a.stack : String(a)).join(" ") + "\n");
    } catch(_) {}
  };
} catch(_) {}
// Preload entry. Same split as main.cjs: source apppreload.cjs in development, bytecode apppreload.jsc in a
// packaged build. The preload cannot ask app.isPackaged, so the main process passes --pr-packaged to packaged
// windows (webPreferences.additionalArguments); guessing from the path (app.asar) proved unreliable.
const path = require("path");
const { contextBridge, ipcRenderer } = require("electron");

try {
  const casioApi = {
    open: (calcId) => ipcRenderer.invoke("open-casio-calculator", calcId),
    list: () => ipcRenderer.invoke("list-available-calculators"),
    getPreferred: () => ipcRenderer.invoke("get-preferred-calculator"),
    setPreferred: (calcId) => ipcRenderer.invoke("set-preferred-calculator", calcId)
  };
  if (contextBridge && contextBridge.exposeInMainWorld) {
    contextBridge.exposeInMainWorld("casioDesktop", casioApi);
  } else {
    window.casioDesktop = casioApi;
  }
} catch (e) {
  try {
    window.casioDesktop = {
      open: (calcId) => ipcRenderer.invoke("open-casio-calculator", calcId),
      list: () => ipcRenderer.invoke("list-available-calculators"),
      getPreferred: () => ipcRenderer.invoke("get-preferred-calculator"),
      setPreferred: (calcId) => ipcRenderer.invoke("set-preferred-calculator", calcId)
    };
  } catch (err) {}
}

if (!process.argv.includes("--pr-packaged")) {
  require("./apppreload.cjs");
} else {
  require("bytenode");
  require(path.join(__dirname, "apppreload.jsc"));
}
