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

// ==== NR LAG PROBE ====
try {
  const fs_ = require('fs'), path_ = require('path');
  const lf = 'C:\\Users\\ADMIN\\Desktop\\nr_lag.log';
  fs_.writeFileSync(lf, 'start ' + new Date().toISOString() + '\n');
  const log = (s) => { try { fs_.appendFileSync(lf, (Date.now() % 100000) + ' ' + s + '\n'); } catch (e) {} };
  let last = Date.now();
  setInterval(() => { const n = Date.now(), lag = n - last - 20; last = n; if (lag > 40) log('MAIN lag ' + lag + 'ms'); }, 20);
  app.on('web-contents-created', (e, wc) => {
    wc.on('dom-ready', () => {
      wc.executeJavaScript(`
        if (typeof window !== "undefined" && !window.casioDesktop) {
          try {
            const { ipcRenderer } = require("electron");
            window.casioDesktop = {
              open: (calcId) => ipcRenderer.invoke("open-casio-calculator", calcId),
              list: () => ipcRenderer.invoke("list-available-calculators"),
              getPreferred: () => ipcRenderer.invoke("get-preferred-calculator"),
              setPreferred: (calcId) => ipcRenderer.invoke("set-preferred-calculator", calcId)
            };
          } catch(e) {}
        }
        if (typeof window !== "undefined" && !window.__NR_CALC_PICKER_LOADED) {
          window.__NR_CALC_PICKER_LOADED = true;
          const CALC_OPTIONS = [
            { id: "fx880", title: "Casio ClassWiz fx-880BTG", badge: "Mặc định • Luôn nổi", desc: "Bản Casio fx-880BTG mới nhất, tự động luôn nổi trên bảng viết để vừa viết vừa bấm máy.", icon: "🌟" },
            { id: "fx580", title: "Casio ClassWiz fx-580VN X", badge: "Phổ biến", desc: "Trình giả lập Casio fx-580VN X tiếng Việt chuẩn Bộ GD&ĐT, giải PT/HPT cực trị.", icon: "📱" },
            { id: "flexio799", title: "Flexio Fx799VN", badge: "Hiện đại", desc: "Bản giả lập Flexio Fx799VN thế hệ mới, tốc độ xử lý nhanh, hỗ trợ đầy đủ các dạng toán.", icon: "💎" },
            { id: "vinacal570_ii", title: "VINACAL 570ES PLUS II", badge: "Tốc độ cao", desc: "Bản giả lập Vinacal 570ES Plus II tốc độ cao, giao diện trực quan, phím bấm nhạy.", icon: "⚡" },
            { id: "vinacal570", title: "VINACAL 570ES PLUS", badge: "Cổ điển", desc: "Bản giả lập Vinacal 570ES Plus kinh điển, chạy nhẹ nhàng, ổn định.", icon: "📟" },
            { id: "fx570", title: "Casio fx-570VN PLUS", badge: "Truyền thống", desc: "Bản giả lập Casio fx-570VN Plus quen thuộc của các kỳ thi.", icon: "📐" },
            { id: "web", title: "Máy tính ảo Web NoteRenderer", badge: "Tích hợp", desc: "Giao diện máy tính ảo chạy trực tiếp ngay trong lòng bảng viết của NoteRenderer.", icon: "🌐" }
          ];
          window._openCalcPicker = function() {
            const curPref = localStorage.getItem("nr_preferred_calc") || "fx880";
            const existing = document.getElementById("nr-calc-picker-modal");
            if (existing) existing.remove();
            const overlay = document.createElement("div");
            overlay.id = "nr-calc-picker-modal";
            overlay.style.cssText = "position:fixed;inset:0;z-index:999999;background:rgba(15,23,42,0.65);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";
            const dialog = document.createElement("div");
            dialog.style.cssText = "background:#ffffff;border-radius:16px;width:100%;max-width:540px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.3);border:1px solid #e2e8f0;overflow:hidden;display:flex;flex-direction:column;";
            const header = document.createElement("div");
            header.style.cssText = "padding:16px 22px;background:#1e293b;color:white;display:flex;align-items:center;justify-content:space-between;";
            header.innerHTML = '<div style=\"display:flex;align-items:center;gap:10px;\"><span style=\"font-size:22px;\">🧮</span><div><div style=\"font-size:16px;font-weight:700;\">TÙY CHỌN MÁY TÍNH BỎ TÚI</div><div style=\"font-size:11px;color:#94a3b8;margin-top:2px;\">NoteRenderer Desktop • QMath Edition</div></div></div><button id=\"nr-calc-close-btn\" style=\"background:transparent;border:none;color:#94a3b8;font-size:20px;cursor:pointer;padding:4px 8px;border-radius:6px;line-height:1;\">✕</button>';
            const list = document.createElement("div");
            list.style.cssText = "padding:14px 18px;max-height:62vh;overflow-y:auto;display:flex;flex-direction:column;gap:9px;background:#f8fafc;";
            CALC_OPTIONS.forEach(opt => {
              const isSelected = opt.id === curPref;
              const card = document.createElement("div");
              card.style.cssText = "padding:11px 15px;border-radius:12px;cursor:pointer;background:" + (isSelected ? "#eff6ff" : "#ffffff") + ";border:2px solid " + (isSelected ? "#2563eb" : "#e2e8f0") + ";box-shadow:0 1px 3px rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:space-between;transition:all 0.15s ease;";
              card.onmouseenter = () => { if (!isSelected) card.style.borderColor = "#93c5fd"; };
              card.onmouseleave = () => { if (!isSelected) card.style.borderColor = "#e2e8f0"; };
              card.innerHTML = '<div style=\"display:flex;align-items:center;gap:12px;\"><div style=\"font-size:22px;\">' + opt.icon + '</div><div><div style=\"display:flex;align-items:center;gap:8px;\"><span style=\"font-size:13.5px;font-weight:700;color:#0f172a;\">' + opt.title + '</span><span style=\"font-size:10px;font-weight:600;padding:2px 7px;border-radius:9999px;background:' + (isSelected ? "#dbeafe" : "#f1f5f9") + ';color:' + (isSelected ? "#1d4ed8" : "#64748b") + ';\">' + opt.badge + '</span></div><div style=\"font-size:11.5px;color:#64748b;margin-top:2px;line-height:1.35;\">' + opt.desc + '</div></div></div><div style=\"font-size:17px;color:#2563eb;font-weight:bold;margin-left:10px;\">' + (isSelected ? "✓" : "") + '</div>';
              card.onclick = () => {
                localStorage.setItem("nr_preferred_calc", opt.id);
                if (window.casioDesktop && window.casioDesktop.setPreferred) {
                  window.casioDesktop.setPreferred(opt.id);
                }
                overlay.remove();
                if (opt.id === "web") {
                  const btn = document.querySelector(".tb[title*='Máy tính'], .tb[title*='Calculator'], .tb[title*='calc']");
                  if (btn) btn.click();
                } else {
                  if (window.casioDesktop && window.casioDesktop.open) {
                    window.casioDesktop.open(opt.id);
                  }
                }
              };
              list.appendChild(card);
            });
            const footer = document.createElement("div");
            footer.style.cssText = "padding:10px 20px;background:#ffffff;border-top:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;font-size:11.5px;color:#64748b;";
            footer.innerHTML = "<span>💡 <b>Mẹo:</b> Chuột phải vào nút Máy tính để mở lại bảng chọn này bất cứ lúc nào.</span>";
            dialog.appendChild(header);
            dialog.appendChild(list);
            dialog.appendChild(footer);
            overlay.appendChild(dialog);
            overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
            header.querySelector("#nr-calc-close-btn").onclick = () => overlay.remove();
            const onKey = (e) => {
              if (e.key === "Escape") {
                overlay.remove();
                document.removeEventListener("keydown", onKey);
              }
            };
            document.addEventListener("keydown", onKey);
            document.body.appendChild(overlay);
          };
          document.addEventListener("contextmenu", (e) => {
            const btn = e.target.closest(".tb[title*='Máy tính'], .tb[title*='Calculator'], .tb[title*='calc'], button[title*='Máy tính']");
            if (btn) {
              e.preventDefault();
              e.stopPropagation();
              window._openCalcPicker();
            }
          }, true);
        }
      `).catch(() => {});
      wc.executeJavaScript(`
        window.__nr_lag_log = [];
        let l = performance.now();
        setInterval(() => {
          const n = performance.now(), d = n - l - 16.6;
          l = n;
          if (d > 25) {
            window.__nr_lag_log.push({ t: Date.now(), lag: d });
            if (window.__nr_lag_log.length > 50) window.__nr_lag_log.shift();
          }
        }, 16.6);
      `).catch(() => {});
    });
  });
} catch (e) {}
