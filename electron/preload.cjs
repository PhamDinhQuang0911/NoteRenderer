const { contextBridge, ipcRenderer } = require("electron");

function listen(channel, callback) {
  const handler = (event, ...args) => callback(...args);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

contextBridge.exposeInMainWorld("noteRenderer", {
  ready: () => ipcRenderer.send("renderer-ready"),
  licenseStatus: () => ipcRenderer.invoke("license-status"),
  activateLicense: (key) => ipcRenderer.invoke("license-activate", key),
  startTrial: () => ipcRenderer.invoke("license-trial"),
  renderFormula: (formula, color, display) => ipcRenderer.invoke("render-formula", formula, color, display),
  setDirty: (dirty) => ipcRenderer.send("set-dirty", dirty),
  setAutosave: (val) => ipcRenderer.send("set-autosave", val),
  setTitle: (title) => ipcRenderer.send("set-title", title),
  newWindow: () => ipcRenderer.send("new-window"),
  openFile: () => ipcRenderer.invoke("open-file"),
  saveElsewhere: (data, defaultName) => ipcRenderer.invoke("save-elsewhere", data, defaultName),
  library: {
    list: () => ipcRenderer.invoke("lib-list"),
    read: (ref) => ipcRenderer.invoke("lib-read", ref),
    write: (ref, data) => ipcRenderer.invoke("lib-write", ref, data),
    create: (data, project, name) => ipcRenderer.invoke("lib-create", data, project, name),
    addProject: (name) => ipcRenderer.invoke("lib-add-project", name),
    renameProject: (oldName, newName) => ipcRenderer.invoke("lib-rename-project", oldName, newName),
    removeProject: (name) => ipcRenderer.invoke("lib-remove-project", name),
    rename: (ref, newName) => ipcRenderer.invoke("lib-rename", ref, newName),
    move: (ref, toProject) => ipcRenderer.invoke("lib-move", ref, toProject),
    remove: (ref) => ipcRenderer.invoke("lib-remove", ref)
  },
  notesFolder: () => ipcRenderer.invoke("notes-folder"),
  chooseNotesFolder: () => ipcRenderer.invoke("choose-notes-folder"),
  openNotesFolder: () => ipcRenderer.invoke("open-notes-folder"),
  exportPdf: (data) => ipcRenderer.invoke("export-pdf", data),
  exportPngFolder: () => ipcRenderer.invoke("export-png-folder"),
  exportPngPage: (dataUrl, name) => ipcRenderer.invoke("export-png-page", dataUrl, name),
  clipboardImage: () => ipcRenderer.invoke("clipboard-image"),
  copyText: (text) => ipcRenderer.invoke("copy-text", text),
  closeReady: () => ipcRenderer.send("close-ready"),
  closeWindow: () => ipcRenderer.send("close-window"),
  toggleFullScreen: () => ipcRenderer.send("toggle-fullscreen"),
  checkForUpdates: () => ipcRenderer.invoke("check-update"),
  setLanguage: (lang) => ipcRenderer.send("set-language", lang),
  appVersion: () => ipcRenderer.invoke("app-version"),
  recognizeHandwriting: (payload) => ipcRenderer.invoke("recognize-handwriting", payload),
  onOpenDoc: (cb) => listen("open-doc", cb),
  onOpenPdf: (cb) => listen("open-pdf", cb),
  onPenButton: (cb) => listen("pen-button", cb),
  onSaveAndClose: (cb) => listen("save-and-close", cb),
  onUpdateStatus: (cb) => listen("update-status", cb)
});
