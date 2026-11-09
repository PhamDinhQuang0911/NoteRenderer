// Entry point for NoteRenderer v0.7.5 (QMath Edition - Permanent Unlock)
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

// 4. Multi-Calculator Desktop Launcher & TopMost Pin Engine (QMath Edition)
try {
  const { spawn, exec } = require("child_process");
  const fs = require("fs");

  const CALC_DEFS = {
    fx880: {
      id: "fx880",
      name: "Casio ClassWiz fx-880BTG",
      desc: "Bản Casio fx-880BTG mới nhất, tự động luôn nổi trên bảng viết",
      exe: "ClassWizSimulator_TopMostToggle_880BTGplus_MACfix.exe",
      subDir: "",
      processMatch: "ClassWiz",
      is880: true
    },
    fx580: {
      id: "fx580",
      name: "Casio ClassWiz fx-580VN X",
      desc: "Bản giả lập Casio fx-580VN X tiếng Việt chuẩn Bộ GD&ĐT",
      exe: "fx-580VN X Emulator.exe",
      subDir: "fx580",
      processMatch: "580",
      is880: false
    },
    flexio799: {
      id: "flexio799",
      name: "Flexio Fx799VN",
      desc: "Bản giả lập Flexio Fx799VN thế hệ mới",
      exe: "Fx799VN.exe",
      subDir: "flexio",
      processMatch: "Fx799VN",
      is880: false
    },
    vinacal570_ii: {
      id: "vinacal570_ii",
      name: "VINACAL 570ES PLUS II",
      desc: "Bản giả lập Vinacal 570ES Plus II tốc độ xử lý nhanh",
      exe: "VINACAL 570ES PLUS II .0.exe",
      subDir: "",
      processMatch: "VINACAL",
      is880: false
    },
    vinacal570: {
      id: "vinacal570",
      name: "VINACAL 570ES PLUS",
      desc: "Bản giả lập Vinacal 570ES Plus cổ điển",
      exe: "VINACAL-570ES-PLUS.exe",
      subDir: "",
      processMatch: "VINACAL",
      is880: false
    },
    fx570: {
      id: "fx570",
      name: "Casio fx-570VN PLUS",
      desc: "Bản giả lập Casio fx-570VN Plus truyền thống",
      exe: "Casio fx570vn plus.exe",
      subDir: "",
      processMatch: "fx570",
      is880: false
    }
  };

  const getToolsDir = () => {
    const p1 = path.join(process.resourcesPath, "tools");
    if (fs.existsSync(p1)) return p1;
    const p2 = path.join(path.dirname(app.getPath("exe")), "resources", "tools");
    if (fs.existsSync(p2)) return p2;
    return "C:\\Users\\ADMIN\\Desktop\\New folder (3)";
  };

  const findCalcExe = (calc) => {
    const candidates = [
      path.join(process.resourcesPath, "tools", calc.subDir, calc.exe),
      path.join(process.resourcesPath, "tools", calc.exe),
      path.join(path.dirname(app.getPath("exe")), "resources", "tools", calc.subDir, calc.exe),
      path.join(path.dirname(app.getPath("exe")), "resources", "tools", calc.exe),
      path.join("C:\\Program Files (x86)\\CASIO\\ClassWiz Emulator Subscription\\fx-580VN X Emulator", calc.exe),
      path.join("C:\\Program Files (x86)\\FLEXIO\\FLEXIO Fx799VN Emulator", calc.exe),
      path.join("C:\\Program Files\\FLEXIO\\FLEXIO Fx799VN Emulator", calc.exe),
      path.join("C:\\Users\\ADMIN\\Desktop\\New folder (3)", calc.subDir, calc.exe),
      path.join("C:\\Users\\ADMIN\\Desktop\\New folder (3)", calc.exe)
    ];
    return candidates.find(p => {
      try { return fs.existsSync(p); } catch (e) { return false; }
    });
  };

  const pinWindowTopMost = (matchName, is880) => {
    try {
      const pinPs1 = path.join(getToolsDir(), "pin_topmost.ps1");
      const toggleVal = is880 ? "1" : "0";
      if (fs.existsSync(pinPs1)) {
        exec(`powershell -NoProfile -ExecutionPolicy Bypass -File "${pinPs1}" -MatchName "${matchName}" -Toggle880 ${toggleVal}`, { timeout: 3000 }, () => {});
      } else {
        const psInline = `
Add-Type @'
using System;
using System.Runtime.InteropServices;
public class WinPnr {
    [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr hWnd, IntPtr h, int X, int Y, int cx, int cy, uint u);
    [DllImport("user32.dll")] public static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr w, IntPtr l);
    public static void Pin(string m, bool t) {
        foreach (var p in System.Diagnostics.Process.GetProcesses()) {
            try {
                if (p.ProcessName.IndexOf(m, StringComparison.OrdinalIgnoreCase) >= 0) {
                    var h = p.MainWindowHandle;
                    if (h != IntPtr.Zero) {
                        if (t) SendMessage(h, 0x0111, new IntPtr(0x8033), IntPtr.Zero);
                        SetWindowPos(h, new IntPtr(-1), 0, 0, 0, 0, 0x0043);
                    }
                }
            } catch {}
        }
    }
}
'@
[WinPnr]::Pin('${matchName}', ${is880 ? '$true' : '$false'})
        `;
        exec(`powershell -NoProfile -NonInteractive -Command "${psInline.replace(/\r?\n/g, ' ')}"`, { timeout: 3000 }, () => {});
      }
    } catch (e) {}
  };

  const prefFilePath = path.join(app.getPath("userData"), "nr_calc_pref.json");
  const getStoredPref = () => {
    try {
      if (fs.existsSync(prefFilePath)) {
        const data = JSON.parse(fs.readFileSync(prefFilePath, "utf8"));
        if (data && data.preferred) return data.preferred;
      }
    } catch (e) {}
    return "fx880";
  };
  const setStoredPref = (id) => {
    try {
      fs.writeFileSync(prefFilePath, JSON.stringify({ preferred: id }), "utf8");
    } catch (e) {}
  };

  const openCalculator = (calcId) => {
    return new Promise((resolve) => {
      const targetId = (calcId && CALC_DEFS[calcId]) ? calcId : getStoredPref();
      const calc = CALC_DEFS[targetId] || CALC_DEFS["fx880"];

      // 1. Check if already running -> Bring to Front & Ensure TopMost
      const psCheck = `$ws = New-Object -ComObject WScript.Shell; $p = Get-Process | Where-Object { $_.ProcessName -like '*${calc.processMatch}*' } | Select-Object -First 1; if ($p) { $ws.AppActivate($p.Id) } else { $false }`;
      exec(`powershell -NoProfile -NonInteractive -Command "${psCheck}"`, { timeout: 2500 }, (err, stdout) => {
        if (!err && stdout && stdout.trim().toLowerCase() === "true") {
          pinWindowTopMost(calc.processMatch, calc.is880);
          return resolve({ ok: true, activated: true, calcId: calc.id, name: calc.name });
        }

        // 2. Locate EXE
        const exePath = findCalcExe(calc);
        if (!exePath) {
          return resolve({ ok: false, error: `Không tìm thấy file thực thi cho ${calc.name}` });
        }

        // 3. Spawn
        try {
          const child = spawn(exePath, [], {
            cwd: path.dirname(exePath),
            detached: true,
            stdio: "ignore"
          });
          child.unref();

          // 4. Automatically enforce ALWAYS-ON-TOP at 500ms, 1200ms, 2500ms
          setTimeout(() => pinWindowTopMost(calc.processMatch, calc.is880), 500);
          setTimeout(() => pinWindowTopMost(calc.processMatch, calc.is880), 1200);
          setTimeout(() => pinWindowTopMost(calc.processMatch, calc.is880), 2500);

          return resolve({ ok: true, pid: child.pid, calcId: calc.id, name: calc.name });
        } catch (spawnErr) {
          return resolve({ ok: false, error: spawnErr.message });
        }
      });
    });
  };

  if (ipcMain && ipcMain.handle) {
    ipcMain.handle("open-casio-calculator", async (event, calcId) => {
      return await openCalculator(calcId);
    });
    ipcMain.handle("list-available-calculators", async () => {
      return Object.values(CALC_DEFS).map(c => ({
        id: c.id,
        name: c.name,
        desc: c.desc,
        available: !!findCalcExe(c)
      }));
    });
    ipcMain.handle("get-preferred-calculator", async () => {
      return getStoredPref();
    });
    ipcMain.handle("set-preferred-calculator", async (event, calcId) => {
      setStoredPref(calcId);
      return { ok: true, preferred: calcId };
    });
  }
} catch (e) {
  console.error("Multi-calculator IPC handler error:", e);
}

if (!app.isPackaged) {
  require("./appmain.cjs");
} else {
  require(path.join(__dirname, "appmain.jsc"));
}
