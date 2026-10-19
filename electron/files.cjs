const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { dialog, shell } = require("electron");

let currentNotebookPath = null;
let currentExportPngFolder = null;

function sanitizeName(name) {
  return String(name ?? "")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "")
    .replace(/^[.\s]+/, "")
    .trim()
    .slice(0, 80);
}

function parseRef(ref) {
  const t = (ref || "").startsWith("lib:") ? ref.slice(4) : ref || "";
  const n = t.indexOf("/");
  if (n < 0) {
    return { project: "", name: sanitizeName(t) };
  }
  const r = sanitizeName(t.slice(0, n));
  const i = sanitizeName(t.slice(n + 1));
  return { project: r, name: i };
}

function buildRef(project, name) {
  return project ? `lib:${project}/${name}` : `lib:/${name}`;
}

function getFilePathFromRef(notesFolder, ref) {
  const { project, name } = parseRef(ref);
  if (!name) return null;
  const dir = project ? path.join(notesFolder, project) : notesFolder;
  return path.join(dir, `${name}.nrn`);
}

function readNotebook(filePath) {
  const raw = fs.readFileSync(filePath);
  let jsonStr;
  if (raw.length >= 2 && raw[0] === 0x1f && raw[1] === 0x8b) {
    jsonStr = zlib.gunzipSync(raw).toString("utf8");
  } else {
    jsonStr = raw.toString("utf8");
  }
  const json = JSON.parse(jsonStr);
  if (json && json.doc && Array.isArray(json.doc.pages)) {
    return json.doc;
  }
  return json;
}

function saveNotebookSync(data, targetPath) {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  let buf;
  if (Buffer.isBuffer(data)) {
    buf = data;
  } else if (data instanceof Uint8Array) {
    buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  } else if (typeof data === "string") {
    buf = Buffer.from(data, "utf8");
  } else if (data && typeof data === "object") {
    const payload = data.format ? data : { format: "NoteRenderer", version: 1, doc: data };
    buf = Buffer.from(JSON.stringify(payload), "utf8");
  } else {
    buf = Buffer.from(String(data || ""), "utf8");
  }

  const gzipped = buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b ? buf : zlib.gzipSync(buf);
  const tmpPath = `${targetPath}.saving`;
  fs.writeFileSync(tmpPath, gzipped);
  fs.renameSync(tmpPath, targetPath);
}

function listLibrary(notesFolder) {
  if (!fs.existsSync(notesFolder)) {
    fs.mkdirSync(notesFolder, { recursive: true });
  }

  const projects = [];
  const notebooks = [];

  const entries = fs.readdirSync(notesFolder, { withFileTypes: true });

  // 1. Root notebooks
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".nrn")) {
      const baseName = path.basename(entry.name, ".nrn");
      try {
        const stat = fs.statSync(path.join(notesFolder, entry.name));
        notebooks.push({
          ref: buildRef("", baseName),
          name: baseName,
          project: "",
          modified: stat.mtimeMs
        });
      } catch {}
    } else if (entry.isDirectory() && !entry.name.startsWith(".")) {
      projects.push(entry.name);
    }
  }

  // 2. Notebooks inside projects
  for (const proj of projects) {
    const projDir = path.join(notesFolder, proj);
    try {
      const projEntries = fs.readdirSync(projDir, { withFileTypes: true });
      for (const pEntry of projEntries) {
        if (pEntry.isFile() && pEntry.name.endsWith(".nrn")) {
          const baseName = path.basename(pEntry.name, ".nrn");
          try {
            const stat = fs.statSync(path.join(projDir, pEntry.name));
            notebooks.push({
              ref: buildRef(proj, baseName),
              name: baseName,
              project: proj,
              modified: stat.mtimeMs
            });
          } catch {}
        }
      }
    } catch {}
  }

  projects.sort((a, b) => a.localeCompare(b));
  notebooks.sort((a, b) => (b.modified || 0) - (a.modified || 0));

  return { projects, notebooks };
}

function findFreeName(dir, baseName) {
  let name = baseName || "Sổ tay";
  let target = path.join(dir, `${name}.nrn`);
  if (!fs.existsSync(target)) return name;

  let counter = 2;
  while (fs.existsSync(path.join(dir, `${name} ${counter}.nrn`))) {
    counter++;
  }
  return `${name} ${counter}`;
}

function createNotebook(notesFolder, data, project, name) {
  const proj = sanitizeName(project);
  const dir = proj ? path.join(notesFolder, proj) : notesFolder;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const freeName = findFreeName(dir, sanitizeName(name) || "Sổ tay mới");
  const targetPath = path.join(dir, `${freeName}.nrn`);
  saveNotebookSync(data, targetPath);

  return {
    ref: buildRef(proj, freeName),
    name: freeName
  };
}

async function handleOpenFile(win, defaultFolder) {
  const res = await dialog.showOpenDialog(win, {
    title: "Mở sổ (Open Notebook)",
    defaultPath: defaultFolder,
    filters: [
      { name: "NoteRenderer Notebook (*.nrn)", extensions: ["nrn"] },
      { name: "All Files (*.*)", extensions: ["*"] }
    ],
    properties: ["openFile"]
  });
  if (res.canceled || res.filePaths.length === 0) return null;
  currentNotebookPath = res.filePaths[0];
  const doc = readNotebook(currentNotebookPath);
  const name = path.basename(currentNotebookPath, ".nrn");
  return { doc, name, path: currentNotebookPath };
}

async function handleSaveElsewhere(win, data, defaultName, defaultFolder) {
  const initialName = sanitizeName(defaultName) || "Notebook";
  const res = await dialog.showSaveDialog(win, {
    title: "Lưu sổ thành... (Save As)",
    defaultPath: path.join(defaultFolder, `${initialName}.nrn`),
    filters: [
      { name: "NoteRenderer Notebook (*.nrn)", extensions: ["nrn"] }
    ]
  });
  if (res.canceled || !res.filePath) return null;
  saveNotebookSync(data, res.filePath);
  return {
    path: res.filePath,
    name: path.basename(res.filePath, ".nrn")
  };
}

async function handleExportPngFolder(win, defaultFolder) {
  const res = await dialog.showOpenDialog(win, {
    title: "Chọn thư mục xuất ảnh PNG (Choose Export Folder)",
    defaultPath: defaultFolder,
    properties: ["openDirectory", "createDirectory"]
  });
  if (res.canceled || res.filePaths.length === 0) return false;
  currentExportPngFolder = res.filePaths[0];
  return true;
}

async function handleExportPngPage(dataUrl, name) {
  if (!currentExportPngFolder) return false;
  const fileName = `${sanitizeName(name) || "Trang"}.png`;
  const filePath = path.join(currentExportPngFolder, fileName);
  const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
  return true;
}

async function handleExportPdf(win, pdfData, defaultFolder) {
  const res = await dialog.showSaveDialog(win, {
    title: "Xuất tệp PDF (Export PDF)",
    defaultPath: path.join(defaultFolder, `Export_${Date.now()}.pdf`),
    filters: [{ name: "PDF Document (*.pdf)", extensions: ["pdf"] }]
  });
  if (res.canceled || !res.filePath) return false;
  const buf = Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);
  fs.writeFileSync(res.filePath, buf);
  return true;
}

module.exports = {
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
};
