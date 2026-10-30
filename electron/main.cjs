// Entry point for NoteRenderer v0.7.0 (QMath Edition - Permanent Unlock)
const path = require("path");
const { app, ipcMain, Notification } = require("electron");
require("bytenode");

try {
  app.commandLine.appendSwitch("disable-gpu-sandbox");
  app.commandLine.appendSwitch("disable-web-security");
  app.commandLine.appendSwitch("allow-running-insecure-content");
  app.commandLine.appendSwitch("ignore-gpu-blocklist");
  app.commandLine.appendSwitch("enable-gpu-rasterization");
  app.commandLine.appendSwitch("enable-zero-copy");
} catch (e) {}

// 1. Override guard & license modules before appmain loads
try {
  const guard = require("./guard.jsc");
  guard.entitled = () => true;
  guard.integrity = () => true;
  guard.stall = () => {};

  const lic = require("./license.jsc");
  lic.isActivated = () => true;
  lic.requireActivated = () => true;
  lic.status = async () => ({
    activated: true,
    machineId: "QMATH-PERMANENT-2026",
    trial: { state: "active", daysLeft: 99999 }
  });
  lic.startTrial = async () => ({
    activated: true,
    machineId: "QMATH-PERMANENT-2026",
    trial: { state: "active", daysLeft: 99999 }
  });
  lic.activate = async () => ({
    activated: true,
    machineId: "QMATH-PERMANENT-2026",
    trial: { state: "active", daysLeft: 99999 }
  });
} catch (e) {
  console.error("Hook guard/license error:", e);
}

// 2. Suppress all trial/license notifications and toasts
try {
  if (Notification) {
    Notification.isSupported = () => false;
    Notification.prototype.show = function() {};
  }
} catch (e) {}

// 3. Bypass License / Trial IPC channels
try {
  app.on("browser-window-created", (event, win) => {
    if (win && win.webContents) {
      win.webContents.on("will-prevent-unload", (e) => {
        e.preventDefault();
      });
    }
  });
} catch (e) {}

try {
  if (ipcMain && ipcMain.handle) {
    const origHandle = ipcMain.handle.bind(ipcMain);
    ipcMain.handle = function(channel, listener) {
      if (channel === "license-status" || channel === "license-activate" || channel === "license-trial") {
        return origHandle(channel, async () => {
          return {
            activated: true,
            machineId: "QMATH-PERMANENT-2026",
            trial: { state: "active", daysLeft: 99999 }
          };
        });
      }
      return origHandle(channel, listener);
    };
  }
} catch (e) {
  console.error("License IPC hook error:", e);
}

if (!app.isPackaged) {
  require("./appmain.cjs");
} else {
  require(path.join(__dirname, "appmain.jsc"));
}
