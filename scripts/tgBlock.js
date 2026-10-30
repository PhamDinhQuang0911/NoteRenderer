// === TELEGRAM LECTURE CLOUD & IN-APP VIDEO PLAYER (062v22) ===
const TelegramLectureService = {
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
        message: "Kết nối thành công tới Bot @" + meData.result.username + " & Kênh \"" + (chatData.result.title || chatId) + "\"!"
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
    const baseTitle = filename.replace(/\.[^/.]+$/, "");

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
};

function TelegramSettingsModal({ onClose: t, notify: e }) {
  const [cfg, setCfg] = z.useState(() => TelegramLectureService.getConfig());
  const [showToken, setShowToken] = z.useState(!1);
  const [status, setStatus] = z.useState(null);
  const [testing, setTesting] = z.useState(!1);

  const handleTest = async () => {
    setTesting(!0);
    setStatus(null);
    const res = await TelegramLectureService.testConnection(cfg.botToken.trim(), cfg.chatId.trim());
    setTesting(!1);
    setStatus(res);
  };

  const handleSave = () => {
    TelegramLectureService.saveConfig({
      ...cfg,
      botToken: cfg.botToken.trim(),
      chatId: cfg.chatId.trim()
    });
    e && e("Đã lưu cấu hình Kho Lưu Trữ thành công!");
    t && t();
  };

  return f.jsx(ri, {
    title: "Cấu hình Kho Lưu Trữ Video Bài Giảng",
    onClose: t,
    className: "telegram-settings-dialog",
    children: f.jsxs("div", {
      className: "telegram-settings-content",
      children: [
        f.jsxs("div", {
          className: "tg-tip-box",
          children: [
            f.jsx("b", { children: "💡 Hướng dẫn nhanh:" }),
            f.jsx("p", { children: "1. Cung cấp Mã kết nối Kho (Token) và Địa chỉ Kho lưu trữ." }),
            f.jsx("p", { children: "2. Tạo Kênh (Channel) riêng -> Thêm Bot vừa tạo vào làm Quản trị viên (Admin)." }),
            f.jsx("p", { children: "3. Nhập Token và @tên_kênh (hoặc ID) bên dưới -> Bấm Kiểm tra kết nối." })
          ]
        }),
        f.jsxs("label", {
          className: "tg-field-label",
          children: [
            "Mã kết nối Kho (Token)",
            f.jsxs("div", {
              className: "tg-input-wrap",
              children: [
                f.jsx("input", {
                  type: showToken ? "text" : "password",
                  placeholder: "Ví dụ: 7123456789:AAH...",
                  value: cfg.botToken,
                  onChange: g => setCfg({ ...cfg, botToken: g.target.value })
                }),
                f.jsx("button", {
                  type: "button",
                  className: "tg-eye-btn",
                  onClick: () => setShowToken(!showToken),
                  children: showToken ? "Ẩn" : "Hiện"
                })
              ]
            })
          ]
        }),
        f.jsxs("label", {
          className: "tg-field-label",
          children: [
            "Kênh / Nhóm lưu trữ (Channel ID / Username)",
            f.jsx("input", {
              type: "text",
              placeholder: "Ví dụ: @qmath_lectures hoặc -1001234567890",
              value: cfg.chatId,
              onChange: g => setCfg({ ...cfg, chatId: g.target.value })
            })
          ]
        }),
        f.jsxs("label", {
          className: "tg-field-label",
          children: [
            "Chất lượng ghi hình bài giảng",
            f.jsxs("select", {
              value: (()=>{
                const b = cfg.bitrate;
                if (b === "ultra" || b === "1440p60") return "1440p60";
                if (b === "high" || b === "1080p30" || !b) return "1080p30";
                if (b === "1080p30") return "1080p30";
                if (b === "720p60") return "720p60";
                return "720p30";
              })(),
              onChange: g => {
                setCfg({ ...cfg, bitrate: g.target.value });
                try { localStorage.setItem("nr_video_quality", g.target.value); } catch(_) {}
              },
              children: [
                f.jsx("option", { value: "1440p60", children: "🚀 1440p (2K) - Siêu nét (4.5 Mbps)" }),
                f.jsx("option", { value: "1080p60", children: "⚡ 1080p Full HD 60fps - Mượt mà (2.5 Mbps)" }),
                f.jsx("option", { value: "1080p30", children: "⭐ 1080p Full HD - Tối ưu Web LMS (1.2 Mbps - Khuyên dùng)" }),
                f.jsx("option", { value: "720p60", children: "🎬 720p HD 60fps - Cân bằng (1.0 Mbps)" }),
                f.jsx("option", { value: "720p30", children: "🌱 720p HD 30fps - Siêu nhẹ (700 kbps)" })
              ]
            })
          ]
        }),
        f.jsxs("label", {
          className: "tg-check-label",
          children: [
            f.jsx("input", {
              type: "checkbox",
              checked: cfg.autoUpload !== !1,
              onChange: g => setCfg({ ...cfg, autoUpload: g.target.checked })
            }),
            "Tự động lưu vào Kho Lưu Trữ sau khi kết thúc quay bài giảng"
          ]
        }),
        status && f.jsx("div", {
          className: "tg-status-box " + (status.ok ? "success" : "error"),
          children: status.message
        }),
        f.jsxs("div", {
          className: "tg-btn-row",
          children: [
            f.jsx("button", {
              type: "button",
              className: "tg-btn-test",
              disabled: testing || !cfg.botToken || !cfg.chatId,
              onClick: handleTest,
              children: testing ? "Đang kiểm tra..." : "🔍 Kiểm tra kết nối"
            }),
            f.jsx("button", {
              type: "button",
              className: "tg-btn-save primary",
              onClick: handleSave,
              children: "Lưu cài đặt"
            })
          ]
        })
      ]
    })
  });
}

function LectureVideoModal({ doc: d, te: tctrl, onClose: t, onOpenSettings: e, notify: n }) {
  const videoData = d?.telegramVideo;
  const cfg = TelegramLectureService.getConfig();
  const [streamUrl, setStreamUrl] = z.useState(videoData?.streamUrl || null);
  const [loading, setLoading] = z.useState(!1);
  const [speed, setSpeed] = z.useState(1);
  const [manualLink, setManualLink] = z.useState("");
  const videoRef = z.useRef(null);

  z.useEffect(() => {
    if (!videoData?.fileId || streamUrl || !cfg.botToken) return;
    setLoading(!0);
    TelegramLectureService.getDirectStreamUrl(cfg.botToken, videoData.fileId).then(url => {
      setLoading(!1);
      if (url) {
        setStreamUrl(url);
        if (tctrl && d) {
          tctrl.commit({
            ...d,
            telegramVideo: { ...videoData, streamUrl: url }
          });
        }
      }
    });
  }, [videoData?.fileId, cfg.botToken]);

  const handleSpeed = (s) => {
    setSpeed(s);
    if (videoRef.current) videoRef.current.playbackRate = s;
  };

  const handleAttachManual = () => {
    const link = manualLink.trim();
    if (!link) return;
    const match = link.match(/t\.me\/([^/]+)\/(\d+)/);
    const newRecord = {
      title: d?.name || "Bài giảng",
      tmeUrl: link,
      streamUrl: (link.endsWith(".mp4") || link.endsWith(".webm")) ? link : void 0,
      recordedAt: new Date().toISOString()
    };
    if (match) {
      newRecord.chatUsername = match[1];
      newRecord.messageId = Number(match[2]);
    }
    tctrl && d && tctrl.commit({ ...d, telegramVideo: newRecord });
    n && n("Đã gắn link video bài giảng thành công!");
  };

  const handleRemoveVideo = () => {
    if (window.confirm("Bạn có chắc chắn muốn gỡ video bài giảng này khỏi tài liệu? (Video trên Kho Lưu Trữ vẫn được giữ an toàn)")) {
      tctrl && d && tctrl.commit({ ...d, telegramVideo: void 0 });
      n && n("Đã gỡ video bài giảng.");
      t && t();
    }
  };

  return f.jsx(an, {
    title: videoData ? "🎬 Video Bài giảng: " + (videoData.title || d?.name || "") : "🎬 Video Bài giảng",
    onClose: t,
    className: "lecture-video-dialog",
    children: f.jsxs("div", {
      className: "lecture-video-content",
      children: [
        videoData ? f.jsxs(f.Fragment, {
          children: [
            f.jsxs("div", {
              className: "lv-video-container",
              children: [
                loading ? f.jsx("div", { className: "lv-loading", children: "Đang kết nối luồng phát video..." }) :
                streamUrl ? f.jsx("video", {
                  ref: videoRef,
                  src: streamUrl,
                  controls: !0,
                  autoPlay: !1,
                  playsInline: !0,
                  className: "lv-video-element"
                }) : f.jsxs("div", {
                  className: "lv-no-stream",
                  children: [
                    videoData.tmeUrl ? f.jsx("iframe", {
                      src: videoData.tmeUrl + "?embed=1",
                      style: { width: "100%", height: "380px", border: "none", borderRadius: "10px" },
                      allow: "fullscreen; autoplay"
                    }) : f.jsx("p", { children: "Video được lưu an toàn trong Kho Lưu Trữ Đám Mây." }),
                    videoData.tmeUrl && f.jsxs("a", {
                      href: videoData.tmeUrl,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "lv-telegram-open-btn",
                      children: ["Mở xem trong Kho Lưu Trữ ↗"]
                    }),
                    !cfg.botToken && f.jsx("button", {
                      type: "button",
                      className: "lv-cfg-btn",
                      onClick: e,
                      children: "Nhập Bot Token để xem trực tiếp tại đây"
                    })
                  ]
                })
              ]
            }),
            f.jsxs("div", {
              className: "lv-controls-bar",
              children: [
                f.jsxs("div", {
                  className: "lv-speeds",
                  children: [
                    f.jsx("span", { children: "Tốc độ:" }),
                    [1, 1.25, 1.5, 2].map(s => f.jsxs("button", {
                      type: "button",
                      key: s,
                      className: "lv-speed-btn" + (speed === s ? " on" : ""),
                      onClick: () => handleSpeed(s),
                      children: [s, "x"]
                    }, s))
                  ]
                }),
                f.jsxs("div", {
                  className: "lv-actions",
                  children: [
                    videoData.tmeUrl && f.jsxs("a", {
                      href: videoData.tmeUrl,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "lv-btn-link",
                      title: "Mở bài viết trong Kho Lưu Trữ",
                      children: ["Xem trong Kho ↗"]
                    }),
                    f.jsx("button", {
                      type: "button",
                      className: "lv-btn-remove",
                      onClick: handleRemoveVideo,
                      title: "Gỡ video khỏi bài giảng",
                      children: "Gỡ video"
                    })
                  ]
                })
              ]
            })
          ]
        }) : f.jsxs("div", {
          className: "lv-empty-state",
          children: [
            f.jsx("div", { className: "lv-empty-icon", children: "📹" }),
            f.jsx("h4", { children: "Chưa có video ghi hình cho bài giảng này" }),
            f.jsx("p", { children: "Bạn có thể quay màn hình bài giảng (sẽ tự động tải lên Kho Lưu Trữ) hoặc dán link video kho lưu trữ có sẵn vào bên dưới:" }),
            f.jsxs("div", {
              className: "lv-manual-input",
              children: [
                f.jsx("input", {
                  type: "text",
                  placeholder: "Dán link video kho lưu trữ (https://t.me/...)",
                  value: manualLink,
                  onChange: g => setManualLink(g.target.value)
                }),
                f.jsx("button", {
                  type: "button",
                  className: "primary",
                  onClick: handleAttachManual,
                  children: "Gắn vào bài giảng"
                })
              ]
            }),
            f.jsx("hr", {}),
            f.jsx("button", {
              type: "button",
              className: "lv-cfg-btn",
              onClick: e,
              children: "⚙️ Cài đặt Kho Lưu Trữ Video"
            })
          ]
        })
      ]
    })
  });
}


function SaveLectureVideoModal({ data, te, notify: n, onClose: t }) {
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
          "🎬 Bài giảng: " + finalTitle + "\n📅 Ngày ghi: " + new Date().toLocaleString("vi-VN")
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
}

function TelegramUploadOverlay({ progress, loadedMB, totalMB, onCancel }) {
  if (progress === null) return null;
  return f.jsx("div", {
    className: "tg-upload-overlay",
    children: f.jsxs("div", {
      className: "tg-upload-card",
      children: [
        f.jsxs("div", {
          className: "tg-upload-head",
          children: [
            f.jsx("span", { className: "tg-spinner" }),
            f.jsx("b", { children: progress >= 100 ? "Đang xử lý trên Kho Lưu Trữ..." : "Đang tải video bài giảng vào Kho Lưu Trữ..." })
          ]
        }),
        f.jsx("div", {
          className: "tg-progress-bar",
          children: f.jsx("div", {
            className: "tg-progress-fill",
            style: { width: progress + "%" }
          })
        }),
        f.jsxs("div", {
          className: "tg-upload-footer",
          children: [
            f.jsxs("span", {
              children: [progress, "% (", loadedMB, " / ", totalMB, " MB)"]
            }),
            onCancel && f.jsx("button", {
              type: "button",
              className: "tg-cancel-btn",
              onClick: onCancel,
              children: "Hủy"
            })
          ]
        })
      ]
    })
  });
}


function pee({platform:e,name:t,saved:n,pageRect:s,onClose:o,notify:i,stopRef:r,remember:a}){const l=tt(),[c,u]=z.useState(()=>{const H=window.innerWidth,G=window.innerHeight;return X0(n!=null&&n.w?{x:n.x*H,y:n.y*G,w:n.w*H,h:n.h*G}:s())}),[h,d]=z.useState((n==null?void 0:n.mic)??!0),[m,y]=z.useState("select"),[b,v]=z.useState(!1),[k,w]=z.useState(0),x=z.useRef(null),S=z.useRef(null);z.useEffect(()=>()=>{var H;return(H=S.current)==null?void 0:H.stop()},[]),z.useEffect(()=>{if(m!=="select")return;const H=G=>G.key==="Escape"&&o();return window.addEventListener("keydown",H),()=>window.removeEventListener("keydown",H)},[m,o]),z.useEffect(()=>(r.current=m==="rec"?()=>{var H;return(H=S.current)==null?void 0:H.stop()}:m==="select"?o:null,()=>{r.current=null}));const A=H=>G=>{var J,U;m==="select"&&(G.preventDefault(),G.stopPropagation(),(U=(J=G.target).setPointerCapture)==null||U.call(J,G.pointerId),x.current={kind:H,sx:G.clientX,sy:G.clientY,from:H==="new"?{x:G.clientX,y:G.clientY,w:0,h:0}:c})},C=H=>{const G=x.current;if(!G)return;const J=H.clientX-G.sx,U=H.clientY-G.sy,ie=G.from;if(G.kind==="new"){const He=Math.min(G.sx,H.clientX),Te=Math.min(G.sy,H.clientY);u(X0({x:He,y:Te,w:Math.abs(J),h:Math.abs(U)}));return}if(G.kind==="move"){u(X0({...ie,x:ie.x+J,y:ie.y+U}));return}let{x:ce,y:re,w:de,h:ke}=ie;G.kind.includes("w")&&(ce=Math.min(ie.x+J,ie.x+ie.w-ck),de=ie.x+ie.w-ce),G.kind.includes("e")&&(de=ie.w+J),G.kind.includes("n")&&(re=Math.min(ie.y+U,ie.y+ie.h-ck),ke=ie.y+ie.h-re),G.kind.includes("s")&&(ke=ie.h+U),u(X0({x:ce,y:re,w:de,h:ke}))},_=()=>{x.current=null},j=async()=>{var Wt;const H=c;a({...n,x:H.x/window.innerWidth,y:H.y/window.innerHeight,w:H.w/window.innerWidth,h:H.h/window.innerHeight,mic:h});