const fs = require('fs');

const cssPath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-Cyl3OjHe.css';
let css = fs.readFileSync(cssPath, 'utf8');

function patch(name, oldStr, newStr) {
  if (!css.includes(oldStr)) {
    throw new Error('CSS target not found for: ' + name);
  }
  css = css.replace(oldStr, newStr);
  console.log('[OK] ' + name);
}

// 1. Patch body.nr-fullscreen .toolbar .tb-group.tools to prevent button overlap
const oldFsTools = `/* Chỉ hiển thị các công cụ viết: bút, màu, tẩy, thước, vẽ hình, bảng màu... */
body.nr-fullscreen .toolbar .tb-group.tools {
  display: flex !important;
  align-items: center !important;
  flex: 1 1 auto !important;
  margin: 0 !important;
  overflow-x: auto !important;
  scrollbar-width: none !important;
}
body.nr-fullscreen .toolbar .tb-group.tools::-webkit-scrollbar {
  display: none !important;
}
/* Hiển thị số trang, nút thu phóng và nút thoát toàn màn hình ở góc phải */
body.nr-fullscreen .toolbar .tb-title {
  display: flex !important;
  align-items: center !important;
  gap: 2px !important;
  margin-left: auto !important;
  flex-shrink: 0 !important;
  font-size: 13px !important;
}`;

const newFsTools = `/* Chỉ hiển thị các công cụ viết: bút, màu, tẩy, thước, vẽ hình, bảng màu... */
body.nr-fullscreen .toolbar .tb-group.tools,
body.nr-fullscreen .toolbar.two-rows .tb-group.tools {
  order: 1 !important;
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  flex: 1 1 auto !important;
  width: auto !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border-top: none !important;
  gap: 4px !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  scrollbar-width: none !important;
}
body.nr-fullscreen .toolbar .tb-group.tools::-webkit-scrollbar,
body.nr-fullscreen .toolbar.two-rows .tb-group.tools::-webkit-scrollbar {
  display: none !important;
}
body.nr-fullscreen .toolbar .tb-group.tools > *,
body.nr-fullscreen .toolbar.two-rows .tb-group.tools > * {
  flex-shrink: 0 !important;
  position: relative !important;
}
body.nr-fullscreen .toolbar .tb-group.tools .tb,
body.nr-fullscreen .toolbar.two-rows .tb-group.tools .tb {
  min-width: 38px !important;
  height: 38px !important;
  padding: 0 6px !important;
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
body.nr-fullscreen .toolbar .tb-group.tools button.swatch,
body.nr-fullscreen .toolbar.two-rows .tb-group.tools button.swatch {
  width: 28px !important;
  height: 36px !important;
  min-width: 28px !important;
  flex-shrink: 0 !important;
}
/* Hiển thị số trang, nút thu phóng và nút thoát toàn màn hình ở góc phải */
body.nr-fullscreen .toolbar .tb-title {
  order: 2 !important;
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  margin-left: auto !important;
  flex-shrink: 0 !important;
  font-size: 13px !important;
}`;

patch('1. Fullscreen toolbar single row with nowrap and flex-shrink: 0', oldFsTools, newFsTools);

// 2. Append complete styles for .calc-screen
const calcScreenStyles = `

/* ===================================================================== */
/* CASIO FX-580VN X SEPARATE PROJECTION SCREEN (MÀN HÌNH RỜI CHIẾU MÁY TÍNH) */
/* ===================================================================== */
.calc-screen {
  position: fixed !important;
  left: 28px !important;
  top: 88px !important;
  z-index: 9999 !important;
  width: 380px !important;
  min-width: 280px !important;
  min-height: 180px !important;
  padding: 8px 10px 10px !important;
  border-radius: 12px !important;
  background: #1e293b !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;
  box-sizing: border-box !important;
  user-select: none !important;
  -webkit-user-select: none !important;
  touch-action: none !important;
  display: flex !important;
  flex-direction: column !important;
}

.calc-screen .calc-title {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  width: 100% !important;
  height: 32px !important;
  margin: 0 0 6px 0 !important;
  padding: 0 4px !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  cursor: grab !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
  box-sizing: border-box !important;
  z-index: 10 !important;
}

.calc-screen .calc-title:active {
  cursor: grabbing !important;
}

.calc-screen .calc-title .calc-name {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  color: #f1f5f9 !important;
  letter-spacing: 0.02em !important;
}

.calc-screen .calc-title .calc-close {
  position: relative !important;
  top: auto !important;
  right: auto !important;
  width: 24px !important;
  height: 24px !important;
  border-radius: 50% !important;
  background: rgba(255, 255, 255, 0.12) !important;
  color: #e2e8f0 !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  font-size: 12px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  transition: all 0.15s !important;
  z-index: 10 !important;
}

.calc-screen .calc-title .calc-close:hover {
  background: #ef4444 !important;
  color: #ffffff !important;
  border-color: #ef4444 !important;
}

.calc-screen .calc-lcd {
  position: relative !important;
  left: auto !important;
  top: auto !important;
  width: 100% !important;
  flex: 1 1 auto !important;
  min-height: 140px !important;
  height: auto !important;
  border-radius: 6px !important;
  padding: 4px 8px !important;
  background: #d6e3d6 !important;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.45) !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  z-index: 4 !important;
  overflow: hidden !important;
  color: #121914 !important;
  font-family: AxMath, "Cambria Math", "Times New Roman", serif !important;
  display: flex !important;
  flex-direction: column !important;
}

.calc-screen .calc-lcd * {
  -webkit-text-stroke: 0 !important;
}

/* LCD modes render in .calc-screen */
.calc-screen .calc-lcd .lcd-main {
  flex: 1 !important;
  min-height: 0 !important;
  height: auto !important;
  overflow: hidden !important;
  position: relative !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}

.calc-screen .calc-lcd .lcd-input {
  flex: 0 1 auto !important;
  max-height: 48px !important;
  padding: 2px 0 !important;
  font-size: 14px !important;
}

.calc-screen .calc-lcd .lcd-result {
  flex: 1 1 auto !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: flex-end !important;
  text-align: right !important;
}

.calc-screen .calc-lcd .lcd-result .lcd-value {
  font-size: 22px !important;
  font-weight: 700 !important;
}

.calc-screen .calc-lcd .lcd-result.with-label {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  justify-content: space-between !important;
}

.calc-screen .calc-lcd .lcd-result.with-label .lcd-label {
  align-self: flex-start !important;
  text-align: left !important;
  font-size: 13px !important;
}

.calc-screen .calc-lcd .lcd-result.with-label .lcd-value {
  align-self: flex-end !important;
  margin-left: auto !important;
  font-size: 22px !important;
}

.calc-screen .calc-lcd .lcd-menu,
.calc-screen .calc-lcd .lcd-form,
.calc-screen .calc-lcd .lcd-list {
  font: 700 13px/1.24 "Consolas", "Courier New", "Segoe UI", monospace !important;
}

.calc-screen .calc-lcd .lcd-menu button,
.calc-screen .calc-lcd .lcd-form-row,
.calc-screen .calc-lcd .lcd-list-row {
  min-height: 19px !important;
  padding: 0 4px !important;
  border-radius: 2px !important;
}

.calc-screen .calc-lcd .lcd-grid {
  font: 700 12px "Consolas", "Segoe UI", sans-serif !important;
}

.calc-screen .calc-lcd .lcd-grid th {
  font-size: 10px !important;
  padding: 0 3px !important;
  background: #d6e3d6 !important;
}

.calc-screen .calc-lcd .lcd-grid td {
  padding: 2px 4px !important;
  height: 17px !important;
  font-size: 12.5px !important;
}

.calc-screen .calc-lcd .lcd-error,
.calc-screen .calc-lcd .lcd-message {
  font: 700 13px/1.3 "Consolas", "Courier New", monospace !important;
}

.calc-screen .calc-resize {
  position: absolute !important;
  right: 2px !important;
  bottom: 2px !important;
  width: 18px !important;
  height: 18px !important;
  cursor: nwse-resize !important;
  opacity: 0.65 !important;
  z-index: 20 !important;
}

.calc-screen .calc-resize::after {
  content: "" !important;
  position: absolute !important;
  right: 3px !important;
  bottom: 3px !important;
  width: 8px !important;
  height: 8px !important;
  border-right: 2px solid rgba(255, 255, 255, 0.45) !important;
  border-bottom: 2px solid rgba(255, 255, 255, 0.45) !important;
}

/* Calculator separate screen projection button in title bar */
.calc > .calc-title .calc-screen-btn {
  position: absolute !important;
  top: 10px !important;
  right: 38px !important;
  width: 24px !important;
  height: 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.35) !important;
  border-radius: 50% !important;
  background: rgba(15, 23, 42, 0.65) !important;
  color: #f1f5f9 !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  z-index: 10 !important;
}

.calc > .calc-title .calc-screen-btn:hover {
  background: #2563eb !important;
  color: #ffffff !important;
  border-color: #3b82f6 !important;
  transform: scale(1.08) !important;
}

.calc > .calc-title .calc-screen-btn.on {
  background: #2563eb !important;
  color: #ffffff !important;
  border-color: #60a5fa !important;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.7) !important;
}

.calc > .calc-title .calc-screen-btn svg {
  width: 14px !important;
  height: 13px !important;
}
`;

css += calcScreenStyles;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('[OK] Appended .calc-screen projection window styles to index-Cyl3OjHe.css');
