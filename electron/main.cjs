const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, ipcMain, clipboard, shell } = require("electron");
const { renderFormula } = require("./formula.cjs");
const {
  readNotebook,
  handleOpenFile,
  handleSaveFile,
  handleExportPng,
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

const openWindows = new Set();

function createWindow(filePath = null) {
  const win = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 800,
    minHeight: 600,
    title: "NoteRenderer",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  openWindows.add(win);

  win.on("closed", () => {
    openWindows.delete(win);
  });

  const distIndex = path.join(__dirname, "..", "dist", "index.html");
  win.loadFile(distIndex);

  win.webContents.on("did-finish-load", () => {
    if (filePath && fs.existsSync(filePath)) {
      try {
        const fileData = readNotebook(filePath);
        win.webContents.send("open-doc", fileData);
      } catch (err) {
        console.error("Failed to load notebook:", err);
      }
    }
  });

  return win;
}

// Lifecycle events
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC handlers & listeners
ipcMain.on("renderer-ready", () => {
  // Renderer initialized
});

ipcMain.on("set-dirty", (event, isDirty) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && win.setDocumentEdited) {
    win.setDocumentEdited(!!isDirty);
  }
});

ipcMain.on("set-autosave", (event, val) => {
  // Autosave configuration
});

ipcMain.on("forget-file", (event, filePath) => {
  // Discard file associations
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

ipcMain.on("set-language", (event, lang) => {
  // Language updated
});

// IPC Invocations
ipcMain.handle("app-version", () => {
  return app.getVersion();
});

ipcMain.handle("license-status", () => {
  // Permanent unlocked status for the author
  return {
    activated: true,
    trial: { state: "active", daysLeft: 9999 }
  };
});

ipcMain.handle("license-activate", () => {
  return { activated: true };
});

ipcMain.handle("license-trial", () => {
  return { activated: true };
});

ipcMain.handle("check-update", () => {
  return { updateAvailable: false };
});

ipcMain.handle("render-formula", (event, formula, color, display) => {
  return renderFormula(formula, color, display);
});

ipcMain.handle("open-file", async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return await handleOpenFile(win, currentNotesFolder);
});

ipcMain.handle("save-file", async (event, data, currentPath) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return await handleSaveFile(win, data, currentPath, currentNotesFolder);
});

ipcMain.handle("export-png", async (event, dataUrl) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return await handleExportPng(win, dataUrl, currentNotesFolder);
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

ipcMain.handle("notes-folder", () => {
  return currentNotesFolder;
});

ipcMain.handle("choose-notes-folder", async () => {
  const { dialog } = require("electron");
  const res = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"],
    defaultPath: currentNotesFolder
  });
  if (!res.canceled && res.filePaths.length > 0) {
    currentNotesFolder = res.filePaths[0];
    return currentNotesFolder;
  }
  return currentNotesFolder;
});

ipcMain.handle("open-notes-folder", () => {
  shell.openPath(currentNotesFolder);
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
      req.on("error", (e) => {
        console.error("Handwriting API request error:", e);
        resolve(null);
      });
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

