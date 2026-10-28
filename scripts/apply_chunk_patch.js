const fs = require('fs');
const acorn = require('C:/Users/ADMIN/Documents/GitHub/PhamDinhQuang0911.github.io/node_modules/acorn');

const bundlePath = 'C:/Users/ADMIN/Documents/GitHub/NoteRenderer/dist/assets/index-C4FEyT2h.js';
let content = fs.readFileSync(bundlePath, 'utf8');

// 1. Replace TelegramLectureService
const p1_start = content.indexOf('const TelegramLectureService = {');
const p1_end = content.indexOf('function TelegramSettingsModal', p1_start);
if (p1_start === -1 || p1_end === -1) {
  throw new Error('Could not find TelegramLectureService');
}

const newTelegramLectureService = `const TelegramLectureService = {
  getConfig() {
    const def = { botToken: "8662985318:AAHIweMUW706XKIXFi-bFisaFoE7hZaMHDo", chatId: "@kho_video_qmath_2026", autoUpload: !0, bitrate: "1080p60" };
    try {
      const saved = localStorage.getItem("telegram_lecture_config");
      if (!saved) return def;
      const p = JSON.parse(saved);
      return { botToken: p.botToken || def.botToken, chatId: p.chatId || def.chatId, autoUpload: p.autoUpload !== undefined ? p.autoUpload : !0, bitrate: p.bitrate || "1080p60" };
    } catch {
      return def;
    }
  },

  saveConfig(cfg) {
    try {
      localStorage.setItem("telegram_lecture_config", JSON.stringify(cfg));
    } catch {}
  },

  async testConnection(botToken, chatId) {
    if (!botToken || !chatId) {
      return { ok: !1, message: "Vui lòng nhập Bot Token và Chat ID / Channel ID." };
    }
    try {
      const meRes = await fetch("https://api.telegram.org/bot" + botToken + "/getMe");
      const meData = await meRes.json();
      if (!meData.ok) {
        return { ok: !1, message: "Lỗi Bot Token: " + (meData.description || "Token không hợp lệ") };
      }
      if (chatId.toLowerCase().endsWith("_bot") || (meData?.result?.username && chatId.toLowerCase() === "@" + meData.result.username.toLowerCase())) {
        return {
          ok: !1,
          message: "⚠️ LƯU Ý: [" + chatId + "] là TÊN CỦA BOT, KHÔNG PHẢI KÊNH! Bạn hãy tạo Kênh mới trong Kho Lưu Trữ, thêm Bot @" + meData.result.username + " vào Kênh làm Quản trị viên (Admin), rồi nhập @tên_kênh vào đây."
        };
      }
      const chatRes = await fetch("https://api.telegram.org/bot" + botToken + "/getChat?chat_id=" + encodeURIComponent(chatId));
      const chatData = await chatRes.json();
      if (!chatData.ok) {
        return { 
          ok: !1, 
          message: "Bot @" + meData.result.username + " hoạt động, nhưng không tìm thấy Kênh/Nhóm (" + (chatData.description || "Vui lòng kiểm tra ID và chắc chắn đã thêm Bot làm Quản trị viên/Admin Kênh") + ")." 
        };
      }
      return {
        ok: !0,
        botUsername: meData.result.username,
        chatTitle: chatData.result.title || chatData.result.username || chatId,
        message: "Kết nối thành công tới Bot @" + meData.result.username + " & Kênh \\"" + (chatData.result.title || chatId) + "\\"!"
      };
    } catch (e) {
      const msg = (e.message || e) + "";
      if (msg.includes("Failed to fetch")) {
        return { ok: !1, message: "Lỗi kết nối tới Kho Lưu Trữ. Nếu bạn đang dùng bản Web trên trình duyệt Chrome, vui lòng mở bản ứng dụng Desktop NoteRenderer.exe để không bị giới hạn bảo mật CORS của trình duyệt, hoặc kiểm tra kết nối Internet/VPN." };
      }
      return { ok: !1, message: "Lỗi mạng hoặc kết nối: " + msg };
    }
  },

  async getDirectStreamUrl(botToken, fileId) {
    if (!botToken || !fileId) return null;
    try {
      const res = await fetch("https://api.telegram.org/bot" + botToken + "/getFile?file_id=" + encodeURIComponent(fileId));
      const data = await res.json();
      if (data.ok && data.result && data.result.file_path) {
        return "https://api.telegram.org/file/bot" + botToken + "/" + data.result.file_path;
      }
      return null;
    } catch {
      return null;
    }
  },

  async uploadVideo({ botToken, chatId, blob, filename, caption, onProgress, signal }) {
    const CHUNK_SIZE = 14.5 * 1024 * 1024; // ~15.2 MB
    const totalChunks = Math.ceil(blob.size / CHUNK_SIZE);
    const chunks = [];
    let firstMessageId = null;
    let chatUsername = "";

    const ext = filename.split(".").pop() || "mp4";
    const baseTitle = filename.replace(/\\.[^/.]+$/, "");

    for (let i = 0; i < totalChunks; i++) {
      if (signal && signal.aborted) throw new Error("Đã hủy tải lên.");

      const start = i * CHUNK_SIZE;
      const end = Math.min(blob.size, start + CHUNK_SIZE);
      const chunkBlob = blob.slice(start, end);
      const partNum = String(i + 1).padStart(3, "0");
      const chunkName = totalChunks > 1 ? (baseTitle + ".part" + partNum + "." + ext) : filename;

      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("document", chunkBlob, chunkName);
      if (i === 0 && caption) {
        formData.append("caption", caption + (totalChunks > 1 ? (" (Phần 1/" + totalChunks + ")") : ""));
      } else if (totalChunks > 1) {
        formData.append("caption", "🎬 " + baseTitle + " (Phần " + (i + 1) + "/" + totalChunks + ")");
      }

      const chunkRes = await new Promise((resolveChunk, rejectChunk) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.telegram.org/bot" + botToken + "/sendDocument");

        if (signal) {
          signal.addEventListener("abort", () => {
            xhr.abort();
            rejectChunk(new Error("Đã hủy tải lên."));
          });
        }

        if (xhr.upload && onProgress) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const currentLoaded = start + e.loaded;
              const percent = Math.min(99, Math.round((currentLoaded / blob.size) * 100));
              onProgress(percent, currentLoaded, blob.size);
            }
          };
        }

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.ok && data.result) {
              resolveChunk(data.result);
            } else {
              rejectChunk(new Error(data.description || ("Lỗi gửi phần " + (i + 1) + "/" + totalChunks)));
            }
          } catch (err) {
            rejectChunk(new Error("Phản hồi không hợp lệ từ Telegram: " + xhr.status));
          }
        };

        xhr.onerror = () => rejectChunk(new Error("Lỗi kết nối mạng khi tải phần " + (i + 1) + "/" + totalChunks));
        xhr.send(formData);
      });

      const doc = chunkRes.document || chunkRes.video;
      const fileId = doc?.file_id;
      if (!fileId) throw new Error("Không nhận được file_id của phần " + (i + 1));

      chunks.push({
        index: i,
        fileId: fileId,
        size: chunkBlob.size,
        start: start,
        end: end
      });

      if (i === 0) {
        firstMessageId = chunkRes.message_id;
        chatUsername = chunkRes.chat?.username || "";
      }

      // Giãn cách 500ms giữa các chunk để chống Rate Limit của Telegram
      if (totalChunks > 1 && i < totalChunks - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    if (onProgress) onProgress(100, blob.size, blob.size);

    const videoId = "hls_video_" + Date.now();
    const streamUrl = "https://tg-hls.phamngockhanh-942001.workers.dev/stream/" + videoId;

    let tmeUrl = "";
    if (chatUsername) {
      tmeUrl = "https://t.me/" + chatUsername + "/" + firstMessageId;
    } else if (String(chatId).startsWith("-100")) {
      tmeUrl = "https://t.me/c/" + String(chatId).replace(/^-100/, "") + "/" + firstMessageId;
    } else if (String(chatId).startsWith("@")) {
      tmeUrl = "https://t.me/" + String(chatId).slice(1) + "/" + firstMessageId;
    }

    // Tự động đồng bộ metadata phân đoạn lên Supabase
    try {
      await fetch("https://cuniqanbumcrqcdlcvad.supabase.co/rest/v1/configurations?on_conflict=id", {
        method: "POST",
        headers: {
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bmlxYW5idW1jcnFjZGxjdmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NDE4MTMsImV4cCI6MjEwNDUxNzgxM30.MWSv1QKVlQ9r-8r0hkrqWsmm75hULq_VjPCbTqXDe-o",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bmlxYW5idW1jcnFjZGxjdmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NDE4MTMsImV4cCI6MjEwNDUxNzgxM30.MWSv1QKVlQ9r-8r0hkrqWsmm75hULq_VjPCbTqXDe-o",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: videoId,
          raw_data: {
            type: "chunked_stream",
            title: baseTitle,
            filename: filename,
            ext: ext,
            mimeType: blob.type || (filename.endsWith(".mp4") ? "video/mp4" : "video/webm"),
            totalSize: blob.size,
            chunkSize: CHUNK_SIZE,
            chunkCount: chunks.length,
            chunks: chunks,
            fileId: chunks[0].fileId,
            messageId: firstMessageId,
            channel: (chatId || "").replace(/^@/, ""),
            streamUrl: streamUrl,
            content: streamUrl,
            createdAt: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        })
      });
    } catch (e) {
      console.warn("Supabase auto-sync failed:", e);
    }

    return {
      ok: !0,
      videoId: videoId,
      fileId: chunks[0].fileId,
      messageId: firstMessageId,
      chatId: String(chatId),
      chatUsername: chatUsername,
      tmeUrl: tmeUrl,
      streamUrl: streamUrl,
      content: streamUrl,
      size: blob.size,
      chunkCount: chunks.length,
      isChunked: chunks.length > 1
    };
  }
};\n\n`;

content = content.substring(0, p1_start) + newTelegramLectureService + content.substring(p1_end);

// 2. Replace SaveLectureVideoModal
const p2_start = content.indexOf('function SaveLectureVideoModal({');
const p2_end = content.indexOf('function TelegramUploadOverlay', p2_start);
if (p2_start === -1 || p2_end === -1) {
  throw new Error('Could not find SaveLectureVideoModal');
}

const newSaveLectureVideoModal = `function SaveLectureVideoModal({ data, te, notify: n, onClose: t }) {
  const [title, setTitle] = z.useState(data?.defaultName || "Bài giảng " + new Date().toLocaleDateString("vi-VN"));
  const [saveLocal, setSaveLocal] = z.useState(!0);
  const cfg = TelegramLectureService.getConfig();
  const [saveTelegram, setSaveTelegram] = z.useState(() => {
    return !!(cfg.botToken && cfg.chatId && cfg.autoUpload !== !1);
  });
  const [previewUrl] = z.useState(() => data?.blob ? URL.createObjectURL(data.blob) : null);

  z.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleConfirm = async () => {
    const finalTitle = title.trim() || data?.defaultName || "Bài giảng";
    const ext = data?.ext || "mp4";
    const filename = finalTitle + "." + ext;

    // 1. Lưu về máy tính nếu được chọn
    if (saveLocal && data?.blob) {
      try {
        const url = URL.createObjectURL(data.blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          try { a.remove(); URL.revokeObjectURL(url); } catch {}
        }, 3000);
        n && n("Đã lưu video về máy: " + filename);
      } catch (err) {
        console.error("Local save error:", err);
        n && n("Lỗi lưu video: " + (err.message || err));
      }
    }

    // 2. Tự động chia mảnh & lưu vào Kho Đám Mây Telegram + Supabase
    if (saveTelegram && data?.blob) {
      if (!cfg.botToken || !cfg.chatId) {
        n && n("Chưa cấu hình Kho Lưu Trữ. Vui lòng vào Cài đặt Kho Lưu Trữ.");
      } else if (typeof window._tgStartUpload === "function") {
        window._tgStartUpload(
          data.blob,
          filename,
          "🎬 Bài giảng: " + finalTitle + "\\n📅 Ngày ghi: " + new Date().toLocaleString("vi-VN")
        );
      }
    }

    t();
  };

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đoạn video vừa quay?")) {
      t();
    }
  };

  const formatDuration = (sec) => {
    if (!sec || sec < 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  };

  const mbSize = data?.blob ? (data.blob.size / (1024 * 1024)).toFixed(1) : "0.0";
  const numParts = data?.blob ? Math.ceil(data.blob.size / (14.5 * 1024 * 1024)) : 1;

  return f.jsx(an, {
    title: "🎬 Lưu Video Bài giảng",
    onClose: handleCancel,
    className: "save-lecture-dialog",
    children: f.jsxs("div", {
      className: "save-lecture-content",
      children: [
        previewUrl && f.jsx("div", {
          className: "sl-preview-wrap",
          children: f.jsx("video", {
            src: previewUrl,
            controls: !0,
            playsInline: !0,
            className: "sl-preview-video"
          })
        }),
        f.jsxs("div", {
          className: "sl-meta-row",
          children: [
            f.jsxs("span", { children: ["⏱️ Thời lượng: ", f.jsx("b", { children: formatDuration(data?.durationSec) })] }),
            f.jsxs("span", { children: ["📦 Dung lượng: ", f.jsx("b", { children: mbSize + " MB" })] }),
            f.jsxs("span", { children: ["🎞️ Định dạng: ", f.jsx("b", { children: (data?.ext || "mp4").toUpperCase() })] })
          ]
        }),
        f.jsxs("label", {
          className: "sl-field-label",
          children: [
            "Tên bài giảng / video:",
            f.jsx("input", {
              type: "text",
              value: title,
              autoFocus: !0,
              placeholder: "Nhập tên bài giảng...",
              onChange: g => setTitle(g.target.value)
            })
          ]
        }),
        f.jsxs("div", {
          className: "sl-options-box",
          children: [
            f.jsxs("label", {
              className: "sl-check-label",
              children: [
                f.jsx("input", {
                  type: "checkbox",
                  checked: saveLocal,
                  onChange: g => setSaveLocal(g.target.checked)
                }),
                f.jsxs("span", {
                  children: [
                    f.jsx("b", { children: "💾 Lưu file về máy tính" }),
                    f.jsx("small", { children: " (Tùy chọn tải về thư mục máy tính)" })
                  ]
                })
              ]
            }),
            f.jsxs("label", {
              className: "sl-check-label",
              children: [
                f.jsx("input", {
                  type: "checkbox",
                  checked: saveTelegram,
                  onChange: g => setSaveTelegram(g.target.checked)
                }),
                f.jsxs("span", {
                  children: [
                    f.jsx("b", { children: "☁️ Lưu vào Kho Lưu Trữ Đám Mây (Telegram + Web LMS)" }),
                    f.jsx("small", {
                      children: cfg.botToken && cfg.chatId
                        ? (" (Tự động tải lên Kênh " + cfg.chatId + (numParts > 1 ? (" • Tự động chia " + numParts + " phần") : "") + " và tạo link xem trực tiếp)")
                        : " (Chưa cấu hình Bot/Kênh - bấm Cài đặt bên dưới)"
                    })
                  ]
                })
              ]
            })
          ]
        }),
        (!cfg.botToken || !cfg.chatId) && f.jsxs("div", {
          className: "sl-warning-box",
          children: [
            "⚠️ Bạn chưa cấu hình Kho Lưu Trữ Video. ",
            f.jsx("button", {
              type: "button",
              className: "sl-link-btn",
              onClick: () => { window._openTelegramSettings && window._openTelegramSettings(); },
              children: "Bấm vào đây để cấu hình ngay"
            })
          ]
        }),
        f.jsxs("div", {
          className: "sl-btn-row",
          children: [
            f.jsx("button", {
              type: "button",
              className: "sl-btn-cancel",
              onClick: handleCancel,
              children: "Hủy bỏ"
            }),
            f.jsx("button", {
              type: "button",
              className: "sl-btn-confirm primary",
              disabled: !saveLocal && !saveTelegram,
              onClick: handleConfirm,
              children: "☁️ Lưu kho bài giảng"
            })
          ]
        })
      ]
    })
  });
}\n\n`;

content = content.substring(0, p2_start) + newSaveLectureVideoModal + content.substring(p2_end);

// 3. Replace window._tgStartUpload
const p3_start = content.indexOf('window._tgStartUpload=(blob,filename,caption)=>{');
const targetEnd = 'Lỗi tải video vào Kho Lưu Trữ: "+(err.message||err))}})}';
const pTargetEnd = content.indexOf(targetEnd, p3_start);
if (p3_start === -1 || pTargetEnd === -1) {
  throw new Error('Could not find window._tgStartUpload target');
}
const p3_end = pTargetEnd + targetEnd.length;

const newTgStartUpload = `window._tgStartUpload=(blob,filename,caption)=>{const cfg=TelegramLectureService.getConfig();if(!cfg.botToken||!cfg.chatId||cfg.autoUpload===!1)return;const ctrl=new AbortController();const totalMb=(blob.size/(1024*1024)).toFixed(1);_setTgUp({progress:0,loadedMB:"0.0",totalMB:totalMb,cancel:()=>ctrl.abort()});TelegramLectureService.uploadVideo({botToken:cfg.botToken,chatId:cfg.chatId,blob,filename,caption,signal:ctrl.signal,onProgress:(p,loaded,total)=>{_setTgUp({progress:p,loadedMB:(loaded/(1024*1024)).toFixed(1),totalMB:(total/(1024*1024)).toFixed(1),cancel:()=>ctrl.abort()})}}).then(res=>{_setTgUp(null);const te=o.current;if(te&&te.doc){te.commit({...te.doc,telegramVideo:{...res,title:filename.replace(/\\.[^/.]+$/,"")}})}const partText=res.chunkCount>1?(" ("+res.chunkCount+" phần, "+totalMb+" MB)"):(" ("+totalMb+" MB)");Vn("🎉 Đã lưu video bài giảng"+partText+" vào Kho Lưu Trữ! Bấm [🎬 Video] để xem.")}).catch(err=>{_setTgUp(null);if(err.message!=="Đã hủy tải lên."){Vn("Lỗi tải video vào Kho Lưu Trữ: "+(err.message||err))}})}`;

content = content.substring(0, p3_start) + newTgStartUpload + content.substring(p3_end);

console.log('Validating modified bundle with Acorn parser...');
acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'module' });
console.log('AST parse SUCCESSFUL! 100% clean!');

fs.writeFileSync(bundlePath, content, 'utf8');
console.log('Saved modified bundle to:', bundlePath);
