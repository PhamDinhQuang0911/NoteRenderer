const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("noteRenderer", {
  ready: () => ipcRenderer.send("renderer-ready"),
  licenseStatus: () => ipcRenderer.invoke("license-status"),
  activateLicense: (key) => ipcRenderer.invoke("license-activate", key),
  startTrial: () => ipcRenderer.invoke("license-trial"),
  renderFormula: (formula, color, display) => ipcRenderer.invoke("render-formula", formula, color, display),
  setDirty: (isDirty) => ipcRenderer.send("set-dirty", isDirty),
  setAutosave: (val) => ipcRenderer.send("set-autosave", val),
  forgetFile: (path) => ipcRenderer.send("forget-file", path),
  newWindow: () => ipcRenderer.send("new-window"),
  openFile: () => ipcRenderer.invoke("open-file"),
  saveFile: (data, path) => ipcRenderer.invoke("save-file", data, path),
  notesFolder: () => ipcRenderer.invoke("notes-folder"),
  chooseNotesFolder: () => ipcRenderer.invoke("choose-notes-folder"),
  openNotesFolder: () => ipcRenderer.invoke("open-notes-folder"),
  exportPng: (dataUrl) => ipcRenderer.invoke("export-png", dataUrl),
  exportPdf: (data) => ipcRenderer.invoke("export-pdf", data),
  clipboardImage: () => ipcRenderer.invoke("clipboard-image"),
  copyText: (text) => ipcRenderer.invoke("copy-text", text),
  closeReady: () => ipcRenderer.send("close-ready"),
  closeWindow: () => ipcRenderer.send("close-window"),
  toggleFullScreen: () => ipcRenderer.send("toggle-fullscreen"),
  checkForUpdates: () => ipcRenderer.invoke("check-update"),
  setLanguage: (lang) => ipcRenderer.send("set-language", lang),
  appVersion: () => ipcRenderer.invoke("app-version"),
  recognizeHandwriting: (payload) => ipcRenderer.invoke("recognize-handwriting", payload),
  onOpenDoc: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on("open-doc", handler);
    return () => ipcRenderer.removeListener("open-doc", handler);
  },
  onSaveAndClose: (callback) => {
    const handler = () => callback();
    ipcRenderer.on("save-and-close", handler);
    return () => ipcRenderer.removeListener("save-and-close", handler);
  },
  onUpdateStatus: (callback) => {
    const handler = (event, status) => callback(status);
    ipcRenderer.on("update-status", handler);
    return () => ipcRenderer.removeListener("update-status", handler);
  }
});
