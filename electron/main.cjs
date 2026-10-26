const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, ipcMain, clipboard, shell, dialog } = require("electron");

try {
  app.commandLine.appendSwitch("disable-gpu-sandbox");
  app.commandLine.appendSwitch("disable-web-security");
  app.commandLine.appendSwitch("allow-running-insecure-content");
  app.commandLine.appendSwitch("ignore-gpu-blocklist");
  app.commandLine.appendSwitch("enable-gpu-rasterization");
  app.commandLine.appendSwitch("enable-zero-copy");
} catch (e) {}
const { renderFormula } = require("./formula.cjs");
const {
  sanitizeName,
  parseRef,
  buildRef,
  getFilePathFromRef,
  readNotebook,
  saveNotebookSync,
  listLibrary,
  createNotebook,
  handleOpenFile,
  handleSaveElsewhere,
  handleExportPngFolder,
  handleExportPngPage,
  handleExportPdf
} = require("./files.cjs");

let currentNotesFolder = path.join(app.getPath("documents"), "NoteRenderer");
try {
  if (!fs.existsSync(currentNotesFolder)) {
    fs.mkdirSync(currentNotesFolder, { recursive: true });
  }
} catch (e) {
  console.error("Could not create notes directory:", e);
}

// Window state caching
const windowConfigFile = path.join(app.getPath("userData"), "window-state.json");
function loadWindowState() {
  try {
    if (fs.existsSync(windowConfigFile)) {
      return JSON.parse(fs.readFileSync(windowConfigFile, "utf8"));
    }
  } catch {}
  return { width: 1280, height: 850, maximized: false };
}

function saveWindowState(win) {
  try {
    if (win && !win.isDestroyed()) {
      const isMax = win.isMaximized();
      const bounds = isMax ? win.getNormalBounds() : win.getBounds();
      fs.writeFileSync(
        windowConfigFile,
        JSON.stringify({ ...bounds, maximized: isMax })
      );
    }
  } catch {}
}

const openWindows = new Set();

function createWindow(filePath = null) {
  const state = loadWindowState();
  const win = new BrowserWindow({
    width: state.width || 1280,
    height: state.height || 850,
    minWidth: 800,
    minHeight: 600,
    title: "NoteRenderer",
    backgroundColor: "#ffffff",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: false
    }
  });

  if (state.maximized) {
    win.maximize();
  }

  openWindows.add(win);

  win.webContents.on("will-prevent-unload", (e) => { e.preventDefault(); });
  win.on("close", () => {
    saveWindowState(win);
  });

  win.on("closed", () => {
    openWindows.delete(win);
  });

  const distIndex = path.join(__dirname, "..", "dist", "index.html");
  
  win.webContents.on("console-message", (event, level, message, line, sourceId) => {
    fs.appendFileSync("C:/Users/ADMIN/Desktop/New folder/renderer.log", `[LVL ${level}] ${message} (${sourceId}:${line})\n`);
  });
  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    fs.appendFileSync("C:/Users/ADMIN/Desktop/New folder/renderer.log", `[FAIL LOAD] ${errorCode}: ${errorDescription}\n`);
  });
  win.loadFile(distIndex);


  win.webContents.on("did-finish-load", () => {
    if (filePath && fs.existsSync(filePath)) {
      try {
        const doc = readNotebook(filePath);
        const name = path.basename(filePath, ".nrn");
        win.webContents.send("open-doc", { doc, name, ref: null });
      } catch (err) {
        console.error("Failed to load notebook:", err);
      }
    }
  });

  return win;
}

// Pen button native listener
try {
  const penButtonPath = path.join(process.resourcesPath || __dirname, "pen-button.node");
  if (fs.existsSync(penButtonPath)) {
    const penButton = require(penButtonPath);
    if (penButton && typeof penButton.listen === "function") {
      penButton.listen(() => {
        const focused = BrowserWindow.getFocusedWindow();
        if (focused && !focused.isDestroyed()) {
          focused.webContents.send("pen-button");
        }
      });
    }
  }
} catch (e) {
  // Optional native addon
}

// App lifecycle
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine) => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC event listeners
ipcMain.on("renderer-ready", () => {});

ipcMain.on("set-dirty", (event, isDirty) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && win.setDocumentEdited) {
    win.setDocumentEdited(!!isDirty);
  }
});

ipcMain.on("set-autosave", () => {});

ipcMain.on("set-title", (event, title) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && title) {
    win.setTitle(String(title));
  }
});

ipcMain.on("new-window", () => {
  createWindow();
});

ipcMain.on("close-window", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

ipcMain.on("toggle-fullscreen", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.setFullScreen(!win.isFullScreen());
});

ipcMain.on("close-ready", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.destroy();
});

ipcMain.on("set-language", () => {});

// IPC Invocations
ipcMain.handle("app-version", () => "0.5.1");

ipcMain.handle("license-status", () => {
  // Author unlocked status
  return {
    activated: true,
    trial: { state: "active", daysLeft: 9999 }
  };
});

ipcMain.handle("license-activate", () => ({ activated: true }));
ipcMain.handle("license-trial", () => ({ activated: true }));
ipcMain.handle("check-update", () => ({ updateAvailable: false }));

ipcMain.handle("render-formula", (event, formula, color, display) => {
  return renderFormula(formula, color, display);
});

ipcMain.handle("open-file", async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return await handleOpenFile(win, currentNotesFolder);
});

ipcMain.handle("save-elsewhere", async (event, data, defaultName) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return await handleSaveElsewhere(win, data, defaultName, currentNotesFolder);
});

ipcMain.handle("notes-folder", () => currentNotesFolder);

ipcMain.handle("choose-notes-folder", async () => {
  const res = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"],
    defaultPath: currentNotesFolder
  });
  if (!res.canceled && res.filePaths.length > 0) {
    currentNotesFolder = res.filePaths[0];
  }
  return currentNotesFolder;
});

ipcMain.handle("open-notes-folder", () => {
  shell.openPath(currentNotesFolder);
  return true;
});

ipcMain.handle("export-png-folder", async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return await handleExportPngFolder(win, currentNotesFolder);
});

ipcMain.handle("export-png-page", async (event, dataUrl, name) => {
  return await handleExportPngPage(dataUrl, name);
});

ipcMain.handle("export-pdf", async (event, pdfData) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return await handleExportPdf(win, pdfData, currentNotesFolder);
});

ipcMain.handle("clipboard-image", () => {
  const img = clipboard.readImage();
  if (!img.isEmpty()) {
    return img.toDataURL();
  }
  return null;
});

ipcMain.handle("copy-text", (event, text) => {
  clipboard.writeText(text || "");
  return true;
});

const https = require("https");
ipcMain.handle("recognize-handwriting", async (event, payload) => {
  return new Promise((resolve) => {
    try {
      const postData = JSON.stringify(payload);
      const req = https.request(
        "https://www.google.com/inputtools/request?ime=handwriting",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
          },
          timeout: 6000
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try {
              const json = JSON.parse(body);
              resolve(json);
            } catch (e) {
              resolve(null);
            }
          });
        }
      );
      req.on("error", () => resolve(null));
      req.on("timeout", () => {
        req.destroy();
        resolve(null);
      });
      req.write(postData);
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
});

// Library IPC Handlers
ipcMain.handle("lib-list", () => {
  return listLibrary(currentNotesFolder);
});

ipcMain.handle("lib-read", (event, ref) => {
  const filePath = getFilePathFromRef(currentNotesFolder, ref);
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error("Notebook not found: " + ref);
  }
  return readNotebook(filePath);
});

ipcMain.handle("lib-write", (event, ref, data) => {
  const filePath = getFilePathFromRef(currentNotesFolder, ref);
  if (!filePath) throw new Error("Invalid ref: " + ref);
  saveNotebookSync(data, filePath);
  return true;
});

ipcMain.handle("lib-create", (event, data, project, name) => {
  return createNotebook(currentNotesFolder, data, project, name);
});

ipcMain.handle("lib-add-project", (event, name) => {
  const proj = sanitizeName(name);
  if (!proj) throw new Error("Invalid project name");
  const dir = path.join(currentNotesFolder, proj);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return proj;
});

ipcMain.handle("lib-rename-project", (event, oldName, newName) => {
  const oldProj = sanitizeName(oldName);
  const newProj = sanitizeName(newName);
  if (!oldProj || !newProj) throw new Error("Invalid project name");
  const oldDir = path.join(currentNotesFolder, oldProj);
  const newDir = path.join(currentNotesFolder, newProj);
  if (fs.existsSync(newDir)) {
    const err = new Error("Project name already exists");
    err.name = "nameTaken";
    throw err;
  }
  if (fs.existsSync(oldDir)) {
    fs.renameSync(oldDir, newDir);
  }
  return newProj;
});

ipcMain.handle("lib-remove-project", async (event, name) => {
  const proj = sanitizeName(name);
  if (!proj) return false;
  const dir = path.join(currentNotesFolder, proj);
  if (fs.existsSync(dir)) {
    await shell.trashItem(dir);
  }
  return true;
});

ipcMain.handle("lib-rename", (event, ref, newName) => {
  const { project, name: oldName } = parseRef(ref);
  const cleanNewName = sanitizeName(newName);
  if (!cleanNewName) throw new Error("Invalid notebook name");
  const dir = project ? path.join(currentNotesFolder, project) : currentNotesFolder;
  const oldFile = path.join(dir, `${oldName}.nrn`);
  const newFile = path.join(dir, `${cleanNewName}.nrn`);
  if (fs.existsSync(newFile) && oldFile.toLowerCase() !== newFile.toLowerCase()) {
    const err = new Error("Notebook name already exists");
    err.name = "nameTaken";
    throw err;
  }
  if (fs.existsSync(oldFile)) {
    fs.renameSync(oldFile, newFile);
  }
  return buildRef(project, cleanNewName);
});

ipcMain.handle("lib-move", (event, ref, toProject) => {
  const { project: fromProject, name } = parseRef(ref);
  const targetProject = sanitizeName(toProject);
  const sourceDir = fromProject ? path.join(currentNotesFolder, fromProject) : currentNotesFolder;
  const targetDir = targetProject ? path.join(currentNotesFolder, targetProject) : currentNotesFolder;

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const sourceFile = path.join(sourceDir, `${name}.nrn`);
  const targetFile = path.join(targetDir, `${name}.nrn`);

  if (fs.existsSync(sourceFile)) {
    fs.renameSync(sourceFile, targetFile);
  }

  return buildRef(targetProject, name);
});

ipcMain.handle("lib-remove", async (event, ref) => {
  const filePath = getFilePathFromRef(currentNotesFolder, ref);
  if (filePath && fs.existsSync(filePath)) {
    await shell.trashItem(filePath);
  }
  return true;
});
