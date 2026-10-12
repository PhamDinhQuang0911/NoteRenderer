const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { dialog } = require("electron");

let currentNotebookPath = null;

function readNotebook(filePath) {
  const raw = fs.readFileSync(filePath);
  let jsonStr;
  if (raw.length >= 2 && raw[0] === 0x1f && raw[1] === 0x8b) {
    jsonStr = zlib.gunzipSync(raw).toString("utf8");
  } else {
    jsonStr = raw.toString("utf8");
  }
  const doc = JSON.parse(jsonStr);
  const name = path.basename(filePath, path.extname(filePath));
  return { doc, name, path: filePath };
}

function saveNotebookSync(data, targetPath) {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const gzipped = zlib.gzipSync(buf);
  const tmpPath = `${targetPath}.saving`;
  fs.writeFileSync(tmpPath, gzipped);
  fs.renameSync(tmpPath, targetPath);
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
  return readNotebook(currentNotebookPath);
}

async function handleSaveFile(win, data, isSaveAs, defaultFolder) {
  // 1. Nếu người dùng chủ động chọn "Lưu thành..." (Save As)
  if (isSaveAs === true) {
    const res = await dialog.showSaveDialog(win, {
      title: "Lưu sổ thành... (Save As)",
      defaultPath: currentNotebookPath || path.join(defaultFolder, `Notebook_${new Date().toISOString().slice(0, 10)}.nrn`),
      filters: [
        { name: "NoteRenderer Notebook (*.nrn)", extensions: ["nrn"] }
      ]
    });
    if (res.canceled || !res.filePath) return null;
    currentNotebookPath = res.filePath;
    saveNotebookSync(data, currentNotebookPath);
    return path.basename(currentNotebookPath, path.extname(currentNotebookPath));
  }

  // 2. Lưu bình thường hoặc Tự động lưu (Autosave khi đang viết)
  // Nếu đã có đường dẫn file từ trước: Lưu ngầm tĩnh lặng, TUYỆT ĐỐI KHÔNG hiện bảng popup
  if (currentNotebookPath) {
    saveNotebookSync(data, currentNotebookPath);
    return path.basename(currentNotebookPath, path.extname(currentNotebookPath));
  }

  // 3. Nếu là sổ mới chưa từng lưu:
  // Tự động tạo file trong thư mục sổ tay theo ngày giờ và lưu ngầm, không làm phiền người dùng
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = `${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}`;
  const autoFileName = `Notebook_${dateStr}_${timeStr}.nrn`;
  currentNotebookPath = path.join(defaultFolder, autoFileName);

  saveNotebookSync(data, currentNotebookPath);
  return path.basename(currentNotebookPath, path.extname(currentNotebookPath));
}

async function handleExportPng(win, dataUrl, defaultFolder) {
  const res = await dialog.showSaveDialog(win, {
    title: "Xuất ảnh PNG (Export PNG)",
    defaultPath: path.join(defaultFolder, `Export_${Date.now()}.png`),
    filters: [{ name: "PNG Image (*.png)", extensions: ["png"] }]
  });
  if (res.canceled || !res.filePath) return false;
  const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  fs.writeFileSync(res.filePath, Buffer.from(base64Data, "base64"));
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
  readNotebook,
  handleOpenFile,
  handleSaveFile,
  handleExportPng,
  handleExportPdf
};
