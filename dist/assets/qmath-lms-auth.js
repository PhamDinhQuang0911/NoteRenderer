/**
 * QMATH LMS Integration, Access Control, Auto-Backup & Vector Lesson Note Engine
 * Tích hợp Bảng viết NoteRenderer (note.qmath.io.vn) vào hệ sinh thái QMath LMS (qmath.io.vn)
 * - Xác thực bảo mật qua tài khoản Giáo viên/Admin trên Supabase & postMessage có kiểm tra Origin
 * - Lưu bài giảng theo Lớp học / Bài học tối ưu dung lượng R2:
 *   + KHÔNG lưu file PDF nặng trên R2
 *   + Tách ảnh đính kèm sang WebP theo mã băm SHA-256 (chống trùng lặp 100% + bộ nhớ đệm RAM tức thì ở các lần lưu sau)
 *   + Chỉ lưu dữ liệu nét vẽ vector .nrn (gzip JSON siêu nhẹ ~15-40KB) + ảnh bìa cover.webp
 * - Hệ thống An toàn 4 lớp chống mất bài:
 *   1. Huy hiệu Trạng thái Đã lưu / Chưa lưu trực tiếp trên thanh công cụ + Nút Lưu nhanh (Ctrl+S) + Thông báo nổi (Toast)
 *   2. Cảnh báo xác nhận khi tắt tab / đóng trình duyệt nếu có nét viết mới chưa lưu lên Lớp học (beforeunload)
 *   3. Tự động Sao lưu ngầm vào ổ cứng máy tính (IndexedDB Auto-Backup mỗi 5 giây) chống mất điện / sập nguồn
 *   4. Tự động phát hiện & khôi phục bài viết dở khi mở lại máy + Hộp thoại Quản lý Bản nháp tự lưu
 */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://cuniqanbumcrqcdlcvad.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bmlxYW5idW1jcnFjZGxjdmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NDE4MTMsImV4cCI6MjEwNDUxNzgxM30.MWSv1QKVlQ9r-8r0hkrqWsmm75hULq_VjPCbTqXDe-o';
  const R2_UPLOAD_WORKER = 'https://upload-helper.phamngockhanh-942001.workers.dev/';
  const R2_PUBLIC_DOMAIN = 'https://pub-2efc95bbe7924897bdd0db54d0da243f.r2.dev';

  const ALLOWED_LMS_ORIGINS = [
    'https://qmath.io.vn',
    'https://www.qmath.io.vn',
    'https://phamdinhquang0911.github.io',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ];

  const isDesktopOrLocal =
    (typeof window !== 'undefined' && window.location.protocol === 'file:') ||
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ||
    (typeof navigator !== 'undefined' && /Electron/i.test(navigator.userAgent)) ||
    (typeof window !== 'undefined' && window.process && window.process.type === 'renderer');

  const urlParams = new URLSearchParams(window.location.search);

  // Context passed from LMS
  let currentUser = null;
  let userRole = 'unauthorized'; // 'teacher' | 'student' | 'unauthorized'
  let activeContext = {
    classId: urlParams.get('classId') || '',
    lessonId: urlParams.get('lessonId') || urlParams.get('view') || '',
    noteId: urlParams.get('noteId') || '',
    r2Key: urlParams.get('r2') || '',
    viewMode: urlParams.get('mode') === 'view' || !!urlParams.get('view')
  };
  let currentLoadedLesson = null;

  // Save & Auto-Backup State
  const sessionAssetCache = new Map(); // Cache qRef theo fingerprint của ảnh dataUrl trong suốt phiên dạy
  let initialDocSignature = null;
  let lastCloudSavedSignature = null;
  let lastCloudSavedAt = null;
  let lastLocalBackupSignature = null;
  let lastLocalBackupAt = null;
  let hasUnsavedCloudChanges = false;
  let isSavingToCloud = false;
  let watchIntervalId = null;

  // =========================================================
  // 1. SUPABASE REST HELPERS & CROSS-TAB SYNC
  // =========================================================
  function sbHeaders(extra = {}) {
    return {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...extra
    };
  }

  async function sbSelect(table, queryStr = '') {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${queryStr}`, {
      headers: sbHeaders()
    });
    if (!res.ok) throw new Error(`Supabase select ${table} failed (${res.status})`);
    return await res.json();
  }

  async function sbUpsertConfig(confId, rawData) {
    const payload = {
      id: confId,
      raw_data: rawData,
      updated_at: new Date().toISOString()
    };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/configurations?on_conflict=id`, {
      method: 'POST',
      headers: sbHeaders({ 'Prefer': 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Supabase upsert configurations failed (${res.status})`);
    return await res.json();
  }

  function notifyLmsLessonSaved(lessonPayload) {
    try {
      const targetWin = window.opener || (window.parent !== window ? window.parent : null);
      if (targetWin) {
        targetWin.postMessage({
          type: 'QMATH_LESSON_NOTE_SAVED',
          lesson: lessonPayload
        }, '*');
      }
    } catch (e) {}
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('qmath_lesson_sync');
        bc.postMessage({ type: 'QMATH_LESSON_NOTE_SAVED', lesson: lessonPayload, at: Date.now() });
        setTimeout(() => bc.close(), 500);
      }
    } catch (e) {}
  }

  // =========================================================
  // 2. TOAST NOTIFICATION & SAVE STATUS UI
  // =========================================================
  function showToast(message, type = 'success', durationMs = 4500) {
    let container = document.getElementById('qmath-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'qmath-toast-container';
      container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;display:flex;flex-direction:column;gap:10px;max-width:420px;font-family:system-ui,-apple-system,sans-serif;pointer-events:none;';
      document.body.appendChild(container);
    }

    const bgMap = {
      success: 'linear-gradient(135deg,#059669,#10b981)',
      warning: 'linear-gradient(135deg,#d97706,#f59e0b)',
      info: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
      error: 'linear-gradient(135deg,#dc2626,#ef4444)'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `background:${bgMap[type] || bgMap.info};color:#fff;padding:12px 16px;border-radius:14px;box-shadow:0 12px 28px rgba(0,0,0,0.25);font-size:13px;font-weight:700;line-height:1.45;pointer-events:auto;display:flex;align-items:center;justify-content:space-between;gap:12px;transition:all 0.25s ease;`;
    toast.innerHTML = `
      <span>${message}</span>
      <button style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:24px;height:24px;border-radius:6px;cursor:pointer;font-weight:800;flex-shrink:0;">✕</button>
    `;
    toast.querySelector('button').onclick = () => toast.remove();
    container.appendChild(toast);

    if (durationMs > 0) {
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        setTimeout(() => toast.remove(), 260);
      }, durationMs);
    }
  }

  function formatTimeShort(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function updateSaveStatusBadge() {
    const pill = document.getElementById('qmath-save-status-pill');
    const quickBtn = document.getElementById('qmath-btn-quick-save');
    if (!pill) return;

    if (quickBtn) {
      if (currentLoadedLesson && currentLoadedLesson.id && currentLoadedLesson.classId) {
        quickBtn.style.display = 'flex';
        quickBtn.title = `Lưu nhanh cập nhật vào "${currentLoadedLesson.title}" (Phím tắt: Ctrl + S)`;
      } else {
        quickBtn.style.display = 'none';
      }
    }

    if (isSavingToCloud) {
      pill.style.background = '#eff6ff';
      pill.style.color = '#1d4ed8';
      pill.style.borderColor = '#93c5fd';
      pill.innerHTML = `<span>⏳</span> <span>Đang lưu lên lớp...</span>`;
      return;
    }

    if (hasUnsavedCloudChanges) {
      const backupNote = lastLocalBackupAt ? ` • Đã tự lưu máy ${formatTimeShort(lastLocalBackupAt)}` : '';
      pill.style.background = '#fffbeb';
      pill.style.color = '#b45309';
      pill.style.borderColor = '#fcd34d';
      pill.innerHTML = `<span style="color:#f59e0b;">●</span> <span>Chưa lưu lên lớp${backupNote}</span>`;
    } else if (lastCloudSavedAt) {
      const ver = currentLoadedLesson?.version ? ` v${currentLoadedLesson.version}` : '';
      pill.style.background = '#ecfdf5';
      pill.style.color = '#047857';
      pill.style.borderColor = '#6ee7b7';
      pill.innerHTML = `<span>✅</span> <span>Đã lưu vào lớp${ver} (${formatTimeShort(lastCloudSavedAt)})</span>`;
    } else if (lastLocalBackupAt) {
      pill.style.background = '#f8fafc';
      pill.style.color = '#334155';
      pill.style.borderColor = '#cbd5e1';
      pill.innerHTML = `<span>🛡️</span> <span>Đã tự lưu máy (${formatTimeShort(lastLocalBackupAt)})</span>`;
    } else {
      pill.style.background = '#f8fafc';
      pill.style.color = '#64748b';
      pill.style.borderColor = '#e2e8f0';
      pill.innerHTML = `<span>📝</span> <span>Bảng mới</span>`;
    }
  }

  // =========================================================
  // 3. INDEXEDDB AUTO-BACKUP ENGINE (CHỐNG MẤT ĐIỆN / TẮT TAB)
  // =========================================================
  const IDB_NAME = 'QMathNoteAutoBackupDB';
  const IDB_STORE = 'backups';

  function openBackupDb() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB not supported'));
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbPutBackup(record) {
    const db = await openBackupDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(record);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  async function idbGetAllBackups() {
    const db = await openBackupDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).getAll();
      req.onsuccess = () => { db.close(); resolve(req.result || []); };
      req.onerror = () => { db.close(); reject(req.error); };
    });
  }

  async function idbDeleteBackup(id) {
    const db = await openBackupDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(id);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  function computeDocSignature(doc) {
    if (!doc || !Array.isArray(doc.pages)) {
      return { sig: 'empty', pageCount: 0, strokeCount: 0, itemCount: 0, hasContent: false };
    }
    const parts = [`P:${doc.pages.length}`];
    let totalStrokes = 0;
    let totalItems = 0;
    for (let i = 0; i < doc.pages.length; i++) {
      const p = doc.pages[i];
      const sLen = Array.isArray(p.strokes) ? p.strokes.length : 0;
      const iLen = Array.isArray(p.items) ? p.items.length : 0;
      const gShapes = (p.geo && Array.isArray(p.geo.shapes)) ? p.geo.shapes.length : 0;
      const gPts = (p.geo && p.geo.points) ? Object.keys(p.geo.points).length : 0;
      totalStrokes += sLen;
      totalItems += iLen + gShapes;
      const lastS = sLen > 0 ? p.strokes[sLen - 1] : null;
      const lastSKey = lastS ? (lastS.id || (Array.isArray(lastS.pts) ? lastS.pts.length : '')) : '';
      const lastI = iLen > 0 ? p.items[iLen - 1] : null;
      const lastIKey = lastI ? `${lastI.id || ''}_${Math.round(lastI.x || 0)}_${Math.round(lastI.y || 0)}` : '';
      parts.push(`${i}:${sLen}:${lastSKey}:${iLen}:${lastIKey}:${gShapes}:${gPts}`);
    }
    return {
      sig: parts.join('|'),
      pageCount: doc.pages.length,
      strokeCount: totalStrokes,
      itemCount: totalItems,
      hasContent: totalStrokes > 0 || totalItems > 0 || doc.pages.length > 1
    };
  }

  async function performLocalAutoBackup() {
    if (activeContext.viewMode || userRole !== 'teacher') return;
    if (!window.__NR_EDITOR || !window.__NR_EDITOR.doc || !window.__NR_API) return;

    const info = computeDocSignature(window.__NR_EDITOR.doc);
    if (!info.hasContent) return;
    if (info.sig === lastLocalBackupSignature) return;

    try {
      const nrnBytes = await window.__NR_API.encode(window.__NR_EDITOR.doc);
      const now = Date.now();
      const sessionKey = activeContext.lessonId
        ? `lesson_${activeContext.lessonId}`
        : (activeContext.classId ? `class_${activeContext.classId}` : 'latest_session');

      const record = {
        id: sessionKey,
        title: currentLoadedLesson?.title || document.title || `Bản nháp ngày ${new Date().toLocaleDateString('vi-VN')}`,
        classId: activeContext.classId || currentLoadedLesson?.classId || '',
        className: currentLoadedLesson?.className || '',
        lessonId: activeContext.lessonId || currentLoadedLesson?.id || '',
        chapter: currentLoadedLesson?.chapter || '',
        pageCount: info.pageCount,
        strokeCount: info.strokeCount,
        itemCount: info.itemCount,
        sig: info.sig,
        unsavedToCloud: info.sig !== lastCloudSavedSignature,
        updatedAt: now,
        nrnBytes
      };

      await idbPutBackup(record);
      // Cũng lưu 1 bản lịch sử theo mốc 5 phút để phòng trường hợp cần quay lại bản cũ
      const slotId = `slot_${Math.floor(now / (5 * 60 * 1000)) % 8}`;
      await idbPutBackup({ ...record, id: slotId });

      lastLocalBackupSignature = info.sig;
      lastLocalBackupAt = now;
      updateSaveStatusBadge();
    } catch (e) {
      console.warn('[AutoBackup] Lỗi lưu nháp tự động:', e);
    }
  }

  function startChangeWatcherAndAutoBackup() {
    if (watchIntervalId) clearInterval(watchIntervalId);

    // Khởi tạo chữ ký ban đầu khi bảng vẽ sẵn sàng
    setTimeout(() => {
      if (window.__NR_EDITOR && window.__NR_EDITOR.doc) {
        const initInfo = computeDocSignature(window.__NR_EDITOR.doc);
        if (!initialDocSignature) initialDocSignature = initInfo.sig;
        if (!lastCloudSavedSignature && !initInfo.hasContent) {
          lastCloudSavedSignature = initInfo.sig;
        }
      }
    }, 1000);

    let tick = 0;
    watchIntervalId = setInterval(async () => {
      if (activeContext.viewMode || userRole !== 'teacher') return;
      if (!window.__NR_EDITOR || !window.__NR_EDITOR.doc) return;

      const info = computeDocSignature(window.__NR_EDITOR.doc);
      if (!initialDocSignature) initialDocSignature = info.sig;

      const isModified = info.hasContent && (info.sig !== lastCloudSavedSignature);
      if (isModified !== hasUnsavedCloudChanges) {
        hasUnsavedCloudChanges = isModified;
        updateSaveStatusBadge();
      }

      tick++;
      // Cứ 3 nhịp (4.5 giây) tự động backup vào ổ cứng IndexedDB nếu có thay đổi
      if (tick % 3 === 0 && info.hasContent && info.sig !== lastLocalBackupSignature) {
        await performLocalAutoBackup();
      }
    }, 1500);

    // Cảnh báo trước khi đóng tab / tắt trình duyệt nếu có thay đổi chưa lưu lên Lớp học
    window.addEventListener('beforeunload', (e) => {
      const isElectronApp = typeof window !== 'undefined' && (
        !!window.noteRenderer ||
        (window.location && window.location.protocol === 'file:') ||
        (navigator.userAgent && navigator.userAgent.toLowerCase().includes('electron'))
      );
      if (isElectronApp) {
        // Trên Desktop Electron: Luôn tự động backup nhanh khi đóng, không chặn e.preventDefault() để nút X đóng mượt mà
        try {
          if (window.__NR_EDITOR && window.__NR_EDITOR.doc) {
            performLocalAutoBackup();
          }
        } catch (_) {}
        return;
      }
      if (activeContext.viewMode || userRole !== 'teacher') return;
      if (window.__NR_EDITOR && window.__NR_EDITOR.doc) {
        const info = computeDocSignature(window.__NR_EDITOR.doc);
        if (info.hasContent && info.sig !== lastCloudSavedSignature) {
          performLocalAutoBackup();
          const msg = 'Bài giảng có nội dung mới chưa được lưu vào Lớp học. Bạn có chắc chắn muốn rời trang?';
          e.preventDefault();
          e.returnValue = msg;
          return msg;
        }
      }
    });

    // Phím tắt Ctrl + S để Lưu nhanh lên Lớp học
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        if (userRole === 'teacher' && !activeContext.viewMode) {
          e.preventDefault();
          e.stopPropagation();
          if (currentLoadedLesson && currentLoadedLesson.id && currentLoadedLesson.classId) {
            quickSaveCurrentLessonToCloud();
          } else {
            openSaveToClassModal();
          }
        }
      }
    }, true);
  }

  async function checkAndOfferAutoRecovery() {
    if (activeContext.viewMode || userRole !== 'teacher') return;
    try {
      const backups = await idbGetAllBackups();
      if (!backups || backups.length === 0) return;

      // Tìm bản backup chưa lưu lên đám mây gần nhất (trong vòng 48 giờ qua)
      const candidates = backups
        .filter(b => b && b.nrnBytes && b.unsavedToCloud && (Date.now() - (b.updatedAt || 0) < 48 * 3600 * 1000))
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      if (candidates.length === 0) return;
      const latest = candidates[0];

      // Nếu đang mở đúng lessonId đó mà bản trên cloud đã mới hơn thì bỏ qua
      if (currentLoadedLesson && currentLoadedLesson.updatedAt) {
        const cloudTime = new Date(currentLoadedLesson.updatedAt).getTime();
        if (cloudTime >= latest.updatedAt) return;
      }

      showAutoRecoveryBanner(latest);
    } catch (e) {
      console.warn('[AutoRecovery] Check error:', e);
    }
  }

  function showAutoRecoveryBanner(backupRecord) {
    let existing = document.getElementById('qmath-recovery-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'qmath-recovery-banner';
    banner.style.cssText = 'position:fixed;top:52px;left:50%;transform:translateX(-50%);z-index:99998;background:linear-gradient(135deg,#1e293b,#0f172a);color:#fff;padding:12px 18px;border-radius:16px;border:2px solid #f59e0b;box-shadow:0 20px 40px rgba(0,0,0,0.4);display:flex;align-items:center;gap:14px;font-family:system-ui,-apple-system,sans-serif;font-size:12.5px;max-width:92vw;flex-wrap:wrap;';
    const timeStr = new Date(backupRecord.updatedAt).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit'
    });

    banner.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:22px;">🛡️</span>
        <div>
          <div style="font-weight:800;color:#fbbf24;font-size:13px;">Phát hiện bài giảng tự động sao lưu chưa lưu lên Lớp!</div>
          <div style="color:#e2e8f0;font-size:12px;margin-top:2px;">
            <b>${backupRecord.title || 'Bản nháp'}</b> • Lúc ${timeStr} (${backupRecord.pageCount || 1} trang, ${backupRecord.strokeCount || 0} nét bút)
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button id="qm-rec-restore" style="background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;border:none;padding:7px 14px;border-radius:10px;font-weight:800;font-size:12px;cursor:pointer;">
          🔄 Khôi phục ngay
        </button>
        <button id="qm-rec-download" style="background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.25);padding:7px 12px;border-radius:10px;font-weight:700;font-size:12px;cursor:pointer;">
          💾 Tải file .nrn
        </button>
        <button id="qm-rec-dismiss" style="background:transparent;color:#94a3b8;border:none;padding:6px 10px;font-weight:700;font-size:12px;cursor:pointer;">
          Đóng
        </button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('qm-rec-restore').onclick = async () => {
      try {
        await restoreFromBackupRecord(backupRecord);
        banner.remove();
        showToast('✅ Đã khôi phục bài giảng từ bản sao lưu tự động! Hãy bấm "Lưu vào Lớp" để đồng bộ.', 'success', 5000);
      } catch (err) {
        alert('Lỗi khôi phục bản nháp: ' + err.message);
      }
    };

    document.getElementById('qm-rec-download').onclick = () => {
      downloadBackupNrnFile(backupRecord);
    };

    document.getElementById('qm-rec-dismiss').onclick = async () => {
      banner.remove();
      try {
        backupRecord.unsavedToCloud = false;
        await idbPutBackup(backupRecord);
      } catch (e) {}
    };
  }

  async function restoreFromBackupRecord(record) {
    await waitForNoteRendererReady();
    if (!window.__NR_API || typeof window.__NR_API.decode !== 'function') {
      throw new Error('Ứng dụng đang hoàn tất tải dữ liệu. Vui lòng thử lại sau giây lát hoặc làm mới trang.');
    }
    const bytes = record.nrnBytes instanceof Uint8Array
      ? record.nrnBytes
      : new Uint8Array(record.nrnBytes);
    const decodedDoc = await window.__NR_API.decode(bytes);
    await hydrateDocAssetsFromR2(decodedDoc);
      if (currentLoadedLesson && currentLoadedLesson.video && !decodedDoc.telegramVideo) {
        decodedDoc.telegramVideo = currentLoadedLesson.video;
      }

    const docTitle = record.title || 'Bản khôi phục';
    if (typeof window.__NR_OPEN_DOC === 'function') {
      window.__NR_OPEN_DOC({ doc: decodedDoc, name: docTitle, ref: null });
    } else if (window.__NR_EDITOR && typeof window.__NR_EDITOR.load === 'function') {
      window.__NR_EDITOR.load(decodedDoc);
    }

    if (record.classId) activeContext.classId = record.classId;
    if (record.lessonId) activeContext.lessonId = record.lessonId;
    hasUnsavedCloudChanges = true;
    updateSaveStatusBadge();
  }

  function downloadBackupNrnFile(record) {
    const bytes = record.nrnBytes instanceof Uint8Array
      ? record.nrnBytes
      : new Uint8Array(record.nrnBytes);
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (record.title || 'Ban_sao_luu_QMath').replace(/[\\/:*?"<>|]/g, '_');
    a.href = url;
    a.download = `${safeName}.nrn`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 2000);
  }

  async function openAutoBackupsModal() {
    let existing = document.getElementById('qmath-backups-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'qmath-backups-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,0.75);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;';
    modal.innerHTML = `
      <div style="background:#fff;max-width:620px;width:100%;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.35);overflow:hidden;">
        <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:16px 22px;color:#fff;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <h3 style="margin:0;font-size:16px;font-weight:800;">🛡️ Bản Nháp Tự Động Sao Lưu Trong Máy</h3>
            <p style="margin:3px 0 0;font-size:11.5px;color:#94a3b8;">Hệ thống tự động lưu vào ổ cứng mỗi 5 giây khi viết bài (An toàn ngay cả khi mất điện)</p>
          </div>
          <button id="qm-bk-close" style="background:rgba(255,255,255,0.15);border:none;color:#fff;width:30px;height:30px;border-radius:8px;cursor:pointer;">✕</button>
        </div>
        <div id="qm-bk-list" style="padding:18px 22px;max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;">
          <div style="text-align:center;padding:30px;color:#64748b;font-size:13px;">Đang đọc dữ liệu sao lưu trên máy...</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('qm-bk-close').onclick = () => modal.remove();

    try {
      const backups = (await idbGetAllBackups())
        .filter(b => b && b.nrnBytes)
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      const listEl = document.getElementById('qm-bk-list');
      if (backups.length === 0) {
        listEl.innerHTML = '<div style="text-align:center;padding:30px;color:#94a3b8;font-size:13px;">Chưa có bản sao lưu tự động nào trên trình duyệt này.</div>';
        return;
      }

      listEl.innerHTML = backups.map((b, idx) => {
        const tStr = new Date(b.updatedAt).toLocaleString('vi-VN');
        const statusTag = b.unsavedToCloud
          ? `<span style="background:#fef3c7;color:#b45309;padding:2px 8px;border-radius:999px;font-size:10.5px;font-weight:800;">⚠️ Chưa lưu lên lớp</span>`
          : `<span style="background:#d1fae5;color:#047857;padding:2px 8px;border-radius:999px;font-size:10.5px;font-weight:800;">✅ Đã đồng bộ</span>`;
        return `
          <div style="padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#f8fafc;">
            <div style="min-width:0;flex:1;">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span style="font-size:13.5px;font-weight:800;color:#0f172a;">${b.title || 'Bản sao lưu'}</span>
                ${statusTag}
              </div>
              <div style="font-size:11.5px;color:#64748b;margin-top:4px;">
                🕒 ${tStr} • 📄 ${b.pageCount || 1} trang • ✍️ ${b.strokeCount || 0} nét bút
              </div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0;">
              <button data-restore-idx="${idx}" style="padding:7px 12px;border-radius:8px;border:none;background:#2563eb;color:#fff;font-weight:800;font-size:12px;cursor:pointer;">
                Khôi phục
              </button>
              <button data-dl-idx="${idx}" style="padding:7px 10px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;color:#334155;font-weight:700;font-size:12px;cursor:pointer;" title="Tải file .nrn về máy">
                💾 .nrn
              </button>
            </div>
          </div>
        `;
      }).join('');

      listEl.querySelectorAll('[data-restore-idx]').forEach(btn => {
        btn.onclick = async () => {
          const item = backups[Number(btn.getAttribute('data-restore-idx'))];
          if (!item) return;
          modal.remove();
          await restoreFromBackupRecord(item);
          showToast('✅ Đã khôi phục bản nháp thành công!', 'success');
        };
      });

      listEl.querySelectorAll('[data-dl-idx]').forEach(btn => {
        btn.onclick = () => {
          const item = backups[Number(btn.getAttribute('data-dl-idx'))];
          if (item) downloadBackupNrnFile(item);
        };
      });
    } catch (e) {
      alert('Lỗi đọc bản sao lưu: ' + e.message);
    }
  }

  // =========================================================
  // 4. SESSION & AUTHENTICATION
  // =========================================================
  function getStoredSession() {
    try {
      const raw = localStorage.getItem('qmath_auth_session_v2');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function saveSession(user, role) {
    currentUser = user;
    userRole = role;
    try {
      localStorage.setItem('qmath_auth_session_v2', JSON.stringify({
        user,
        role,
        timestamp: Date.now()
      }));
    } catch (e) {}
  }

  function clearSession() {
    currentUser = null;
    userRole = 'unauthorized';
    try {
      localStorage.removeItem('qmath_auth_session_v2');
      localStorage.removeItem('qmath_auth_session');
    } catch (e) {}
  }

  async function verifyTeacherAccountOnSupabase({ uid, email, password = null }) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanUid = String(uid || '').trim();
    const adminEmails = ['phamdinhquang0911@gmail.com', 'phamngockhanh.942001@gmail.com', 'phamngockhanh.942002@gmail.com', 'admin@gmail.com'];

    try {
      const conds = [];
      if (cleanUid) conds.push(`id.eq.${encodeURIComponent(cleanUid)}`);
      if (cleanEmail) conds.push(`email.ilike.${encodeURIComponent(cleanEmail)}`);
      if (conds.length > 0) {
        const rows = await sbSelect('users', `select=*&or=(${conds.join(',')})&limit=5`);
        if (Array.isArray(rows) && rows.length > 0) {
          const u = rows[0];
          const expectedPass = u.password || (u.raw_data && u.raw_data.password);
          if (password !== null && expectedPass && String(expectedPass).trim() !== String(password).trim()) {
            throw new Error('Mật khẩu không chính xác!');
          }
          const r = String(u.role || (u.raw_data && u.raw_data.role) || '').toLowerCase();
          if (r === 'admin' || r === 'super_admin' || r === 'teacher' || adminEmails.includes(cleanEmail)) {
            return {
              uid: u.id,
              email: u.email || cleanEmail,
              name: u.display_name || (u.raw_data && u.raw_data.displayName) || cleanEmail,
              role: 'teacher'
            };
          }
        }
      }
    } catch (err) {
      if (err.message === 'Mật khẩu không chính xác!') throw err;
    }

    try {
      const confRows = await sbSelect('configurations', `select=raw_data&id=eq.admin_roles&limit=1`);
      if (Array.isArray(confRows) && confRows[0]?.raw_data?.accounts) {
        const acc = confRows[0].raw_data.accounts.find(a =>
          (cleanEmail && String(a.email || '').toLowerCase() === cleanEmail) ||
          (cleanUid && String(a.id || '') === cleanUid)
        );
        if (acc) {
          if (password !== null && acc.password && String(acc.password).trim() !== String(password).trim()) {
            throw new Error('Mật khẩu không chính xác!');
          }
          return {
            uid: acc.id || cleanUid || ('teacher_' + cleanEmail.replace(/[^a-z0-9]/g, '_')),
            email: acc.email || cleanEmail,
            name: acc.displayName || acc.name || cleanEmail.split('@')[0],
            role: 'teacher'
          };
        }
      }
    } catch (err) {
      if (err.message === 'Mật khẩu không chính xác!') throw err;
    }

    if (cleanEmail && adminEmails.includes(cleanEmail) && password === null) {
      return {
        uid: cleanUid || 'toPSzoUgYqduYdZrzj8QjARQoOW2',
        email: cleanEmail,
        name: 'Phạm Đình Quang',
        role: 'teacher'
      };
    }

    return null;
  }

  async function authenticate() {
    if (activeContext.viewMode && (activeContext.lessonId || activeContext.r2Key)) {
      const stored = getStoredSession();
      if (stored && stored.user && stored.role === 'teacher') {
        currentUser = stored.user;
        userRole = 'teacher';
      } else {
        currentUser = {
          uid: urlParams.get('uid') || 'student_viewer',
          name: urlParams.get('name') ? decodeURIComponent(urlParams.get('name')) : 'Học sinh QMath',
          email: urlParams.get('email') || ''
        };
        userRole = 'student';
      }
      initUI();
      await loadAndRenderLessonNote(activeContext.lessonId, activeContext.r2Key);
      return true;
    }

    if (isDesktopOrLocal) {
      currentUser = { uid: 'toPSzoUgYqduYdZrzj8QjARQoOW2', email: 'phamngockhanh.942002@gmail.com', name: 'Thầy Choang' };
      userRole = 'teacher';
      initUI();
      startChangeWatcherAndAutoBackup();
      if (activeContext.lessonId || activeContext.r2Key) {
        await loadAndRenderLessonNote(activeContext.lessonId, activeContext.r2Key);
      } else {
        await checkAndOfferAutoRecovery();
      }
      return true;
    }

    const paramUid = urlParams.get('uid');
    const paramEmail = urlParams.get('email');
    const paramName = urlParams.get('name');
    const authSource = urlParams.get('auth_source');

    if (authSource === 'qmath_lms' && (paramUid || paramEmail)) {
      try {
        const verified = await verifyTeacherAccountOnSupabase({ uid: paramUid, email: paramEmail });
        if (verified) {
          if (paramName) verified.name = decodeURIComponent(paramName);
          saveSession(verified, 'teacher');
          cleanSensitiveUrlParams();
          initUI();
          startChangeWatcherAndAutoBackup();
          if (activeContext.lessonId || activeContext.r2Key) {
            await loadAndRenderLessonNote(activeContext.lessonId, activeContext.r2Key);
          } else {
            await checkAndOfferAutoRecovery();
          }
          return true;
        }
      } catch (e) {
        console.warn('[NoteRenderer Auth] Verify error:', e);
      }
    }

    const stored = getStoredSession();
    if (stored && stored.user && stored.role === 'teacher') {
      if (Date.now() - (stored.timestamp || 0) < 14 * 86400 * 1000) {
        currentUser = stored.user;
        userRole = 'teacher';
        initUI();
        startChangeWatcherAndAutoBackup();
        if (activeContext.lessonId || activeContext.r2Key) {
          await loadAndRenderLessonNote(activeContext.lessonId, activeContext.r2Key);
        } else {
          await checkAndOfferAutoRecovery();
        }
        return true;
      }
    }

    if (window.opener || (window.parent && window.parent !== window)) {
      try {
        const targetWin = window.opener || window.parent;
        targetWin.postMessage({ type: 'QMATH_NOTE_READY' }, '*');
      } catch (e) {}
    }

    showLockOverlay();
    return false;
  }

  function cleanSensitiveUrlParams() {
    try {
      if (window.history && window.history.replaceState) {
        const keep = new URLSearchParams();
        if (activeContext.classId) keep.set('classId', activeContext.classId);
        if (activeContext.lessonId) keep.set('lessonId', activeContext.lessonId);
        if (activeContext.viewMode && activeContext.lessonId) keep.set('view', activeContext.lessonId);
        const qs = keep.toString();
        window.history.replaceState({}, document.title, window.location.pathname + (qs ? '?' + qs : ''));
      }
    } catch (e) {}
  }

  window.addEventListener('message', async (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.origin && !ALLOWED_LMS_ORIGINS.includes(e.origin) && !e.origin.endsWith('.qmath.io.vn')) {
      return;
    }
    if (e.data.type === 'QMATH_AUTH_SESSION' || e.data.type === 'QMATH_AUTH_INIT' || e.data.type === 'QMATH_AUTH') {
      const user = e.data.user || {};
      const verified = await verifyTeacherAccountOnSupabase({ uid: user.uid || user.id, email: user.email });
      if (verified) {
        saveSession(verified, 'teacher');
        if (e.data.classId) activeContext.classId = e.data.classId;
        if (e.data.lessonId) activeContext.lessonId = e.data.lessonId;
        initUI();
        startChangeWatcherAndAutoBackup();
        if (e.data.lessonId) {
          await loadAndRenderLessonNote(e.data.lessonId, e.data.r2Key || '');
        }
      }
    }
  });

  // =========================================================
  // 5. LOCK OVERLAY (LOGIN WITH QMATH TEACHER ACCOUNT)
  // =========================================================
  function showLockOverlay() {
    let overlay = document.getElementById('qmath-lock-overlay');
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.id = 'qmath-lock-overlay';
    overlay.innerHTML = `
      <div style="position:fixed;inset:0;z-index:999999;background:rgba(15,23,42,0.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;padding:20px;">
        <div style="background:#fff;max-width:440px;width:100%;border-radius:22px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.45);overflow:hidden;">
          <div style="background:linear-gradient(135deg,#2563eb 0%,#4f46e5 100%);padding:26px 24px;text-align:center;color:#fff;">
            <div style="font-size:36px;margin-bottom:6px;">📐</div>
            <h2 style="margin:0;font-size:20px;font-weight:800;">QMATH LMS • BẢNG GIẢNG DẠY</h2>
            <p style="margin:6px 0 0;opacity:0.9;font-size:13px;">Đăng nhập tài khoản Giáo viên QMath để viết và lưu bài giảng vào Lớp học</p>
          </div>
          <div style="padding:24px;">
            <div style="margin-bottom:12px;">
              <label style="display:block;font-size:12px;font-weight:700;color:#475569;margin-bottom:6px;">Email Giáo viên / Quản trị viên</label>
              <input type="email" id="input-qmath-email" placeholder="Nhập email tài khoản QMath..." style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #cbd5e1;border-radius:10px;font-size:14px;outline:none;" />
            </div>
            <div style="margin-bottom:16px;">
              <label style="display:block;font-size:12px;font-weight:700;color:#475569;margin-bottom:6px;">Mật khẩu</label>
              <input type="password" id="input-qmath-pass" placeholder="Nhập mật khẩu..." style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #cbd5e1;border-radius:10px;font-size:14px;outline:none;" />
            </div>
            <div id="qmath-lock-error" style="color:#dc2626;font-size:12.5px;font-weight:600;text-align:center;margin-bottom:12px;display:none;"></div>
            <button id="btn-verify-login" style="width:100%;padding:13px;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 6px 16px rgba(37,99,235,0.3);">
              Đăng nhập Bảng Giảng Dạy
            </button>
            <div style="text-align:center;border-top:1px solid #f1f5f9;padding-top:14px;margin-top:16px;">
              <a href="https://qmath.io.vn/dashboard.html" style="color:#64748b;font-size:12.5px;text-decoration:none;font-weight:600;">
                ← Mở từ Bàn làm việc Giáo viên (qmath.io.vn)
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const doLogin = async () => {
      const email = (document.getElementById('input-qmath-email').value || '').trim();
      const pass = (document.getElementById('input-qmath-pass').value || '').trim();
      const errBox = document.getElementById('qmath-lock-error');
      const btn = document.getElementById('btn-verify-login');

      if (!email) {
        errBox.textContent = 'Vui lòng nhập email Giáo viên!';
        errBox.style.display = 'block';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Đang xác thực...';
      errBox.style.display = 'none';

      try {
        const verified = await verifyTeacherAccountOnSupabase({ email, password: pass });
        if (!verified) {
          throw new Error('Tài khoản không tồn tại hoặc chưa được cấp quyền Giáo viên!');
        }
        saveSession(verified, 'teacher');
        overlay.remove();
        initUI();
        startChangeWatcherAndAutoBackup();
      } catch (err) {
        errBox.textContent = err.message || 'Lỗi xác thực tài khoản!';
        errBox.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Đăng nhập Bảng Giảng Dạy';
      }
    };

    document.getElementById('btn-verify-login').onclick = doLogin;
    document.getElementById('input-qmath-pass').onkeydown = (e) => {
      if (e.key === 'Enter') doLogin();
    };
  }

  // =========================================================
  // 6. R2 DEDUPLICATED VECTOR NOTE ENGINE (.NRN + SHA-256 WEBP)
  // =========================================================
  async function sha256HexFromBuffer(arrayBuffer) {
    const hashBuf = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const bytes = new Uint8Array(hashBuf);
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, '0');
    }
    return hex;
  }

  function fastDataUrlKey(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string') return '';
    const len = dataUrl.length;
    return `${len}:${dataUrl.slice(0, 80)}:${dataUrl.slice(Math.floor(len / 2), Math.floor(len / 2) + 80)}:${dataUrl.slice(-80)}`;
  }

  async function compressDataUrlToWebpBlob(dataUrl, maxDim = 2000, quality = 0.86) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          let w = img.naturalWidth || img.width || 800;
          let h = img.naturalHeight || img.height || 600;
          if (w > maxDim || h > maxDim) {
            const ratio = Math.min(maxDim / w, maxDim / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob failed'));
          }, 'image/webp', quality);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = dataUrl;
    });
  }

  async function uploadBlobToR2(r2Key, blob, skipIfExists = false) {
    const cleanKey = String(r2Key).replace(/^\/+/, '');
    const publicUrl = `${R2_PUBLIC_DOMAIN}/${cleanKey}`;

    if (skipIfExists) {
      try {
        const headRes = await fetch(publicUrl, { method: 'HEAD' });
        if (headRes.ok) return publicUrl;
      } catch (e) {}
    }

    const formData = new FormData();
    formData.append('file', blob, cleanKey);
    const res = await fetch(R2_UPLOAD_WORKER, {
      method: 'PUT',
      body: formData
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Tải lên R2 thất bại (${res.status}): ${txt}`);
    }
    return publicUrl;
  }

  async function extractAndDeduplicateDocAssets(docObj, teacherId, onProgress) {
    const cloned = JSON.parse(JSON.stringify(docObj));
    const assetsManifest = [];
    const cleanTeacher = String(teacherId || 'teacher').replace(/[^a-zA-Z0-9_-]/g, '_');

    const imageTargets = [];
    if (cloned.paperImage && typeof cloned.paperImage === 'string' && cloned.paperImage.startsWith('data:image/')) {
      imageTargets.push({ holder: cloned, key: 'paperImage' });
    }
    if (Array.isArray(cloned.pages)) {
      for (const p of cloned.pages) {
        if (!Array.isArray(p.items)) continue;
        for (const item of p.items) {
          if (item && item.type === 'image' && typeof item.src === 'string') {
            if (item.src.startsWith('data:image/')) {
              imageTargets.push({ holder: item, key: 'src' });
            } else if (item.src.startsWith('qasset:')) {
              const ak = item.src.slice('qasset:'.length);
              if (!assetsManifest.includes(ak)) assetsManifest.push(ak);
              if (item.pdf) delete item.pdf;
            }
          }
        }
      }
    }

    for (let i = 0; i < imageTargets.length; i++) {
      const target = imageTargets[i];
      const rawDataUrl = target.holder[target.key];
      const memKey = fastDataUrlKey(rawDataUrl);

      // Nếu ảnh trang đề này đã được nén trong phiên làm việc hiện tại -> lấy ngay lập tức (0ms!)
      if (sessionAssetCache.has(memKey)) {
        const cached = sessionAssetCache.get(memKey);
        target.holder[target.key] = cached.qRef;
        if (target.holder.pdf) delete target.holder.pdf;
        if (!assetsManifest.includes(cached.assetKey)) assetsManifest.push(cached.assetKey);
        continue;
      }

      if (onProgress) onProgress(`Đang tách & nén trang đề/ảnh đính kèm lần đầu (${i + 1}/${imageTargets.length})...`);

      try {
        const webpBlob = await compressDataUrlToWebpBlob(rawDataUrl, 2000, 0.86);
        const buf = await webpBlob.arrayBuffer();
        const sha = await sha256HexFromBuffer(buf);
        const assetKey = `note-assets/${cleanTeacher}/${sha}.webp`;
        await uploadBlobToR2(assetKey, webpBlob, true);

        const qRef = `qasset:${assetKey}`;
        sessionAssetCache.set(memKey, { qRef, assetKey });
        target.holder[target.key] = qRef;
        if (target.holder.pdf) delete target.holder.pdf;
        if (!assetsManifest.includes(assetKey)) assetsManifest.push(assetKey);
      } catch (e) {
        console.warn('[NoteRenderer R2] Giữ nguyên ảnh gốc do lỗi nén:', e);
      }
    }

    // Loại bỏ khối nhị phân PDF gốc thừa để tệp .nrn chỉ còn đúng dữ liệu vector siêu nhẹ (~15-40KB)
    if (cloned.pdfs) {
      delete cloned.pdfs;
    }

    return { cleanDoc: cloned, assetsManifest };
  }

  async function hydrateDocAssetsFromR2(docObj) {
    if (!docObj) return docObj;
    const refsToFetch = new Set();

    if (typeof docObj.paperImage === 'string' && docObj.paperImage.startsWith('qasset:')) {
      refsToFetch.add(docObj.paperImage);
    }
    if (Array.isArray(docObj.pages)) {
      for (const p of docObj.pages) {
        if (!Array.isArray(p.items)) continue;
        for (const item of p.items) {
          if (item && item.type === 'image' && typeof item.src === 'string' && item.src.startsWith('qasset:')) {
            refsToFetch.add(item.src);
          }
        }
      }
    }

    if (refsToFetch.size === 0) return docObj;

    const resolvedMap = new Map();
    await Promise.all(Array.from(refsToFetch).map(async (qRef) => {
      const assetKey = qRef.slice('qasset:'.length).replace(/^\/+/, '');
      const url = `${R2_PUBLIC_DOMAIN}/${assetKey}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });
        resolvedMap.set(qRef, dataUrl);
        // Ghi sẵn vào cache RAM để nếu giáo viên mở lại bài giảng và lưu tiếp thì không phải nén lại
        sessionAssetCache.set(fastDataUrlKey(dataUrl), { qRef, assetKey });
      } catch (e) {
        console.warn('[NoteRenderer R2] Fallback direct URL for asset:', assetKey, e);
        resolvedMap.set(qRef, url);
      }
    }));

    if (typeof docObj.paperImage === 'string' && resolvedMap.has(docObj.paperImage)) {
      docObj.paperImage = resolvedMap.get(docObj.paperImage);
    }
    if (Array.isArray(docObj.pages)) {
      for (const p of docObj.pages) {
        if (!Array.isArray(p.items)) continue;
        for (const item of p.items) {
          if (item && item.type === 'image' && resolvedMap.has(item.src)) {
            item.src = resolvedMap.get(item.src);
          }
        }
      }
    }
    return docObj;
  }

  // =========================================================
  // 7. LOAD & RENDER LESSON NOTE (FOR STUDENT & TEACHER)
  // =========================================================
  async function waitForNoteRendererReady(timeoutMs = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (window.__NR_API && window.__NR_OPEN_DOC && window.__NR_EDITOR) {
        return true;
      }
      await new Promise(r => setTimeout(r, 120));
    }
    return !!(window.__NR_API && window.__NR_EDITOR);
  }

  async function loadAndRenderLessonNote(lessonId, directR2Key = '') {
    let loadingEl = document.getElementById('qmath-note-loading');
    if (!loadingEl) {
      loadingEl = document.createElement('div');
      loadingEl.id = 'qmath-note-loading';
      loadingEl.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(15,23,42,0.82);backdrop-filter:blur(6px);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:system-ui,sans-serif;';
      loadingEl.innerHTML = `
        <div style="width:46px;height:46px;border-radius:50%;border:4px solid rgba(255,255,255,0.2);border-top-color:#38bdf8;animation:qSpin 0.8s linear infinite;margin-bottom:14px;"></div>
        <div id="qmath-note-loading-text" style="font-size:15px;font-weight:700;">Đang tải bài giảng từ đám mây QMath...</div>
        <style>@keyframes qSpin { to { transform: rotate(360deg); } }</style>
      `;
      document.body.appendChild(loadingEl);
    }

    const setStatus = (txt) => {
      const el = document.getElementById('qmath-note-loading-text');
      if (el) el.textContent = txt;
    };

    try {
      await waitForNoteRendererReady();

      let lessonData = null;
      if (lessonId) {
        const cleanId = String(lessonId).replace(/^lesson_/, '');
        const rows = await sbSelect('configurations', `select=raw_data&id=eq.lesson_${encodeURIComponent(cleanId)}&limit=1`);
        if (Array.isArray(rows) && rows[0]?.raw_data) {
          lessonData = rows[0].raw_data;
        }
      }

      const r2Key = directR2Key || (lessonData && lessonData.r2Key) || '';
      if (!r2Key) {
        throw new Error('Không tìm thấy tệp dữ liệu bài giảng (.nrn) trên đám mây!');
      }

      currentLoadedLesson = lessonData || {
        id: lessonId || 'lesson',
        title: urlParams.get('title') || 'Bài giảng QMath',
        r2Key,
        allowStudentPdf: true
      };

      if (lessonData?.classId) activeContext.classId = lessonData.classId;
      if (lessonData?.id) activeContext.lessonId = lessonData.id;

      setStatus('Đang tải dữ liệu nét vẽ vector (.nrn)...');
      const nrnUrl = r2Key.startsWith('http') ? r2Key : `${R2_PUBLIC_DOMAIN}/${r2Key.replace(/^\/+/, '')}?t=${Date.now()}`;
      const res = await fetch(nrnUrl);
      if (!res.ok) throw new Error(`Không thể tải tệp bài giảng (${res.status})`);
      const bytes = new Uint8Array(await res.arrayBuffer());

      setStatus('Đang giải mã & đồng bộ hình ảnh...');
      if (!window.__NR_API || typeof window.__NR_API.decode !== 'function') {
        throw new Error('Hệ thống chưa sẵn sàng giải mã bài giảng. Vui lòng làm mới lại trang.');
      }
      const decodedDoc = await window.__NR_API.decode(bytes);
      await hydrateDocAssetsFromR2(decodedDoc);

      const docTitle = currentLoadedLesson.title || 'Bài giảng QMath';
      if (typeof window.__NR_OPEN_DOC === 'function') {
        window.__NR_OPEN_DOC({ doc: decodedDoc, name: docTitle, ref: null });
      } else if (window.__NR_EDITOR && typeof window.__NR_EDITOR.load === 'function') {
        window.__NR_EDITOR.load(decodedDoc);
      }

      document.title = `${docTitle} - QMath Note`;

      setTimeout(() => {
        if (window.__NR_EDITOR && window.__NR_EDITOR.doc) {
          const sigInfo = computeDocSignature(window.__NR_EDITOR.doc);
          lastCloudSavedSignature = sigInfo.sig;
          lastCloudSavedAt = lessonData?.updatedAt ? new Date(lessonData.updatedAt).getTime() : Date.now();
          hasUnsavedCloudChanges = false;
          updateSaveStatusBadge();
        }
      }, 350);

      if (activeContext.viewMode || userRole === 'student') {
        setTimeout(() => {
          try {
            if (window.__NR_EDITOR && typeof window.__NR_EDITOR.setTool === 'function') {
              window.__NR_EDITOR.setTool({ k: 'pan' });
            }
          } catch (e) {}
        }, 300);
        renderViewerBottomToolbar(currentLoadedLesson);
      }
    } catch (err) {
      console.error('[loadAndRenderLessonNote] Error:', err);
      alert('Lỗi tải bài giảng: ' + err.message);
    } finally {
      if (loadingEl) loadingEl.remove();
    }
  }

  // =========================================================
  // 8. ON-DEMAND PDF EXPORT (NO R2 STORAGE COST!)
  // =========================================================
  async function exportCurrentNoteToPdf() {
    if (!window.__NR_API || !window.__NR_EDITOR || !window.__NR_EDITOR.doc) {
      alert('Chưa có dữ liệu bài giảng để xuất PDF!');
      return;
    }

    const btn = document.getElementById('qmath-btn-export-pdf');
    const origHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>⏳</span> Đang dựng PDF...';
    }

    try {
      const docObj = window.__NR_EDITOR.doc;
      const pdfBytes = await window.__NR_API.exportDocToPdfBytes(docObj);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeTitle = (currentLoadedLesson?.title || document.title || 'Bai_giang_QMath')
        .replace(/[\\/:*?"<>|]/g, '_')
        .trim();
      a.href = url;
      a.download = `${safeTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 2000);
    } catch (err) {
      console.error('[exportCurrentNoteToPdf] Error:', err);
      alert('Lỗi xuất PDF: ' + err.message);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origHtml;
      }
    }
  }

  // =========================================================
  // 9. CORE CLOUD SAVE & 1-CLICK QUICK SAVE (CTRL+S)
  // =========================================================
  async function executeSaveLessonToCloud({
    selectedClassId,
    selectedClassName,
    lessonId,
    noteId,
    nextVersion,
    chapter,
    lessonDate,
    title,
    summary,
    allowStudentPdf,
    existingCreatedAt,
    existingCoverUrl,
    attachedMaterials,
    existingLesson,
    onProgress
  }) {
    isSavingToCloud = true;
    updateSaveStatusBadge();

    try {
      const rawDoc = window.__NR_EDITOR.doc;
      const pageCount = Array.isArray(rawDoc.pages) ? rawDoc.pages.length : 1;
      const teacherId = (currentUser?.uid || currentUser?.id || 'teacher').replace(/[^a-zA-Z0-9_-]/g, '_');

      if (onProgress) onProgress('Đang tạo ảnh bìa thu nhỏ trang đầu...');
      let coverUrl = existingCoverUrl || '';
      try {
        const coverDataUrl = await window.__NR_API.renderPageToDataUrl(rawDoc, 0, 0.35, 'image/webp', 0.78, false);
        const coverRes = await fetch(coverDataUrl);
        const coverBlob = await coverRes.blob();
        coverUrl = await uploadBlobToR2(`notes/${teacherId}/${noteId}/cover.webp`, coverBlob, false);
      } catch (eCov) {
        console.warn('[SaveLesson] Cover render warning:', eCov);
      }

      const { cleanDoc, assetsManifest } = await extractAndDeduplicateDocAssets(rawDoc, teacherId, (msg) => {
        if (onProgress) onProgress(msg);
      });

      if (onProgress) onProgress('Đang nén dữ liệu nét bút vector (.nrn) siêu nhẹ...');
      const nrnBytes = await window.__NR_API.encode(cleanDoc);
      const nrnBlob = new Blob([nrnBytes], { type: 'application/octet-stream' });
      const r2Key = `notes/${teacherId}/${noteId}/v${nextVersion}.nrn`;
      await uploadBlobToR2(r2Key, nrnBlob, false);

      if (onProgress) onProgress('Đang đồng bộ bài giảng vào Lớp học trên QMath...');
      const nowIso = new Date().toISOString();
      const lessonPayload = {
        id: lessonId,
        classId: selectedClassId,
        className: selectedClassName || '',
        teacherId: currentUser?.uid || currentUser?.id || '',
        teacherName: currentUser?.name || 'Giáo viên',
        chapter,
        title,
        lessonDate,
        summary,
        noteId,
        r2Key,
        coverUrl,
        pageCount,
        sizeBytes: nrnBytes.byteLength,
        version: nextVersion,
        assetsManifest,
        allowStudentPdf,
        video: rawDoc.telegramVideo || rawDoc.lectureVideo || existingLesson?.video || null,
        materials: attachedMaterials || existingLesson?.materials || [],
        status: 'published',
        createdAt: existingCreatedAt || nowIso,
        updatedAt: nowIso
      };

      await sbUpsertConfig(`lesson_${lessonId}`, lessonPayload);
      await sbUpsertConfig(`lnote_${noteId}`, {
        id: noteId,
        lessonId,
        classId: selectedClassId,
        teacherId: lessonPayload.teacherId,
        title,
        r2Key,
        coverUrl,
        pageCount,
        sizeBytes: nrnBytes.byteLength,
        version: nextVersion,
        assetsManifest,
        allowStudentPdf,
        updatedAt: nowIso
      });

      currentLoadedLesson = lessonPayload;
      activeContext.classId = selectedClassId;
      activeContext.lessonId = lessonId;
      document.title = `${title} - QMath Note`;

      // Cập nhật trạng thái Đã lưu & đánh dấu bản backup nội bộ đã đồng bộ
      const sigInfo = computeDocSignature(rawDoc);
      lastCloudSavedSignature = sigInfo.sig;
      lastCloudSavedAt = Date.now();
      hasUnsavedCloudChanges = false;
      await performLocalAutoBackup();

      notifyLmsLessonSaved(lessonPayload);
      return { lessonPayload, nrnByteLength: nrnBytes.byteLength };
    } finally {
      isSavingToCloud = false;
      updateSaveStatusBadge();
    }
  }

  async function quickSaveCurrentLessonToCloud() {
    if (!currentLoadedLesson || !currentLoadedLesson.id || !currentLoadedLesson.classId) {
      return openSaveToClassModal();
    }
    if (isSavingToCloud) return;

    const quickBtn = document.getElementById('qmath-btn-quick-save');
    const origHtml = quickBtn ? quickBtn.innerHTML : '';
    if (quickBtn) {
      quickBtn.disabled = true;
      quickBtn.innerHTML = '<span>⏳</span> Đang lưu...';
    }

    try {
      const nextVer = (Number(currentLoadedLesson.version) || 1) + 1;
      const { lessonPayload, nrnByteLength } = await executeSaveLessonToCloud({
        selectedClassId: currentLoadedLesson.classId,
        selectedClassName: currentLoadedLesson.className || '',
        lessonId: currentLoadedLesson.id,
        noteId: currentLoadedLesson.noteId || ('note_' + Date.now().toString(36)),
        nextVersion: nextVer,
        chapter: currentLoadedLesson.chapter || 'Chuyên đề bài giảng',
        lessonDate: currentLoadedLesson.lessonDate || new Date().toISOString().slice(0, 10),
        title: currentLoadedLesson.title || 'Bài giảng QMath',
        summary: currentLoadedLesson.summary || '',
        allowStudentPdf: currentLoadedLesson.allowStudentPdf !== false,
        existingCreatedAt: currentLoadedLesson.createdAt,
        existingCoverUrl: currentLoadedLesson.coverUrl
      });
      const kb = (nrnByteLength / 1024).toFixed(1);
      showToast(`✅ Đã lưu cập nhật "${lessonPayload.title}" (v${nextVer} • ${kb} KB) vào ${lessonPayload.className || 'Lớp học'}!`, 'success', 4000);
    } catch (err) {
      console.error('[QuickSave] Error:', err);
      showToast('❌ Lỗi lưu nhanh: ' + err.message, 'error', 6000);
    } finally {
      if (quickBtn) {
        quickBtn.disabled = false;
        quickBtn.innerHTML = origHtml;
      }
    }
  }

  // =========================================================
  // 10. UTILITIES, VIDEO PLAYER & COPY TO CLASSES (QMath Smart Hub)
  // =========================================================
  function formatDuration(sec) {
    if (!sec || sec <= 0) return '00:00';
    const totalSec = Math.round(Number(sec) || 0);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const h = Math.floor(m / 60);
    if (h > 0) {
      const rm = m % 60;
      return `${h}:${rm < 10 ? '0' : ''}${rm}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  async function openVideoPlayerModal(video, lessonTitle) {
    if (!video) return;
    let old = document.getElementById('qmath-video-player-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'qmath-video-player-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(15,23,42,0.88);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;';
    
    let streamUrl = video.streamUrl || video.url || '';
    const tmeUrl = video.tmeUrl || '';
    const title = lessonTitle || video.title || 'Video Bài Giảng';
    const mb = video.size ? (video.size / (1024 * 1024)).toFixed(1) : (video.sizeBytes ? (video.sizeBytes / (1024 * 1024)).toFixed(1) : '');

    modal.innerHTML = `
      <div style="background:#0f172a;max-width:860px;width:100%;border-radius:20px;box-shadow:0 25px 60px rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.12);overflow:hidden;color:#fff;">
        <div style="padding:16px 22px;background:#1e293b;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:20px;">🎬</span>
            <div>
              <h3 style="margin:0;font-size:16px;font-weight:800;color:#f8fafc;">${title}</h3>
              <p style="margin:2px 0 0;font-size:11.5px;color:#94a3b8;">
                ${video.duration ? '⏱️ ' + formatDuration(video.duration) : ''}
                ${mb ? ' • 📦 ' + mb + ' MB' : ''} • Phát trực tiếp trên Web
              </p>
            </div>
          </div>
          <button id="qm-vp-close" style="background:rgba(255,255,255,0.1);border:none;color:#fff;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:16px;font-weight:700;">✕</button>
        </div>

        <div style="padding:18px 22px;background:#090d16;">
          <div id="qm-vp-screen-wrap" style="position:relative;border-radius:12px;overflow:hidden;background:#000;box-shadow:0 10px 25px rgba(0,0,0,0.5);min-height:260px;display:flex;align-items:center;justify-content:center;">
            <div id="qm-vp-loading" style="display:${streamUrl ? 'none' : 'flex'};flex-direction:column;align-items:center;justify-content:center;color:#94a3b8;font-size:13px;font-weight:600;">
              <span style="font-size:24px;margin-bottom:8px;">⏳</span>
              <span>Đang kết nối luồng phát video trực tiếp...</span>
            </div>
            <video id="qm-video-el" src="${streamUrl}" controls controlslist="nodownload" playsinline autoplay style="width:100%;max-height:65vh;display:${streamUrl ? 'block' : 'none'};outline:none;"></video>
            <iframe id="qm-iframe-el" style="width:100%;height:65vh;border:none;display:none;" allow="autoplay; fullscreen"></iframe>
          </div>

          <div style="margin-top:14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;color:#94a3b8;margin-right:4px;">Tốc độ:</span>
              <button class="qm-speed-btn" data-spd="0.75" style="padding:5px 9px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;cursor:pointer;font-size:11.5px;font-weight:700;">0.75x</button>
              <button class="qm-speed-btn" data-spd="1" style="padding:5px 9px;border-radius:6px;border:1px solid #3b82f6;background:#2563eb;color:#fff;cursor:pointer;font-size:11.5px;font-weight:700;">1x</button>
              <button class="qm-speed-btn" data-spd="1.25" style="padding:5px 9px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;cursor:pointer;font-size:11.5px;font-weight:700;">1.25x</button>
              <button class="qm-speed-btn" data-spd="1.5" style="padding:5px 9px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;cursor:pointer;font-size:11.5px;font-weight:700;">1.5x</button>
              <button class="qm-speed-btn" data-spd="2" style="padding:5px 9px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:#fff;cursor:pointer;font-size:11.5px;font-weight:700;">2x</button>
            </div>
            ${tmeUrl ? `
              <a href="${tmeUrl}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:none;font-size:12px;font-weight:700;">
                Mở trong Kho Lưu Trữ ↗
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('qm-vp-close').onclick = () => {
      const v = document.getElementById('qm-video-el');
      if (v) { v.pause(); v.src = ''; }
      if (modal._hls) { modal._hls.destroy(); modal._hls = null; }
      if (modal._blobUrl) { URL.revokeObjectURL(modal._blobUrl); modal._blobUrl = null; }
      modal.remove();
    };

    const vidEl = document.getElementById('qm-video-el');
    const iframeEl = document.getElementById('qm-iframe-el');
    const loadingEl = document.getElementById('qm-vp-loading');

        // 0. Chuẩn HLS (HTTP Live Streaming)
    if (video.type === 'hls' || video.m3u8 || /\.m3u8(\?.*)?$/i.test(streamUrl)) {
      (async () => {
        try {
          let hlsUrl = streamUrl;
          if (video.m3u8) {
            const blob = new Blob([video.m3u8], { type: 'application/vnd.apple.mpegurl' });
            modal._blobUrl = URL.createObjectURL(blob);
            hlsUrl = modal._blobUrl;
          }

          const ensureHls = async () => {
            if (typeof window.Hls !== 'undefined') return window.Hls;
            return new Promise((resolve, reject) => {
              const s = document.createElement('script');
              s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1';
              s.onload = () => resolve(window.Hls);
              s.onerror = reject;
              document.head.appendChild(s);
            });
          };

          const HlsClass = await ensureHls();
          if (HlsClass && HlsClass.isSupported()) {
            const hls = new HlsClass({ enableWorker: true, lowLatencyMode: false, backBufferLength: 60 });
            modal._hls = hls;
            hls.loadSource(hlsUrl);
            hls.attachMedia(vidEl);
            hls.on(HlsClass.Events.MANIFEST_PARSED, () => {
              if (loadingEl) loadingEl.style.display = 'none';
              if (vidEl) { vidEl.style.display = 'block'; vidEl.play().catch(() => {}); }
            });
            hls.on(HlsClass.Events.ERROR, (e, d) => {
              if (d.fatal) {
                if (loadingEl) loadingEl.style.display = 'none';
                if (d.type === HlsClass.ErrorTypes.NETWORK_ERROR) hls.startLoad();
                else if (d.type === HlsClass.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
                else hls.destroy();
              }
            });
          } else if (vidEl && vidEl.canPlayType('application/vnd.apple.mpegurl')) {
            vidEl.src = hlsUrl;
            if (loadingEl) loadingEl.style.display = 'none';
            vidEl.style.display = 'block';
            vidEl.play().catch(() => {});
          }
        } catch(err) {
          console.warn('Lỗi khởi tạo HLS player trong NoteRenderer:', err);
          if (loadingEl) loadingEl.style.display = 'none';
        }
      })();
    } else if (!streamUrl && video.fileId) {
      try {
        const BOT_TOKEN = '8662985318:AAHIweMUW706XKIXFi-bFisaFoE7hZaMHDo';
        const res = await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/getFile?file_id=' + encodeURIComponent(video.fileId));
        const data = await res.json();
        if (data.ok && data.result && data.result.file_path) {
          const directStream = 'https://api.telegram.org/file/bot' + BOT_TOKEN + '/' + data.result.file_path;
          video.streamUrl = directStream;
          if (loadingEl) loadingEl.style.display = 'none';
          if (vidEl) {
            vidEl.src = directStream;
            vidEl.style.display = 'block';
            vidEl.play().catch(() => {});
          }
        } else if (tmeUrl) {
          const match = tmeUrl.match(/t\.me\/([^/]+)\/(\d+)/);
          if (match && iframeEl && vidEl) {
            if (loadingEl) loadingEl.style.display = 'none';
            vidEl.style.display = 'none';
            iframeEl.style.display = 'block';
            iframeEl.src = 'https://t.me/' + match[1] + '/' + match[2] + '?embed=1';
          }
        }
      } catch(e) {
        if (tmeUrl && iframeEl && vidEl) {
          if (loadingEl) loadingEl.style.display = 'none';
          vidEl.style.display = 'none';
          iframeEl.style.display = 'block';
          const match = tmeUrl.match(/t\.me\/([^/]+)\/(\d+)/);
          if (match) iframeEl.src = 'https://t.me/' + match[1] + '/' + match[2] + '?embed=1';
        }
      }
    } else if (!streamUrl && tmeUrl) {
      const match = tmeUrl.match(/t\.me\/([^/]+)\/(\d+)/);
      if (match && iframeEl && vidEl) {
        if (loadingEl) loadingEl.style.display = 'none';
        vidEl.style.display = 'none';
        iframeEl.style.display = 'block';
        iframeEl.src = 'https://t.me/' + match[1] + '/' + match[2] + '?embed=1';
      }
    }

    if (vidEl) {
      modal.querySelectorAll('.qm-speed-btn').forEach(b => {
        b.onclick = () => {
          const spd = parseFloat(b.getAttribute('data-spd'));
          vidEl.playbackRate = spd;
          modal.querySelectorAll('.qm-speed-btn').forEach(x => {
            x.style.background = 'rgba(255,255,255,0.06)';
            x.style.borderColor = 'rgba(255,255,255,0.15)';
          });
          b.style.background = '#2563eb';
          b.style.borderColor = '#3b82f6';
        };
      });
    }
  }

  async function openCopyLessonModal(lesson, classesList, onComplete) {
    let old = document.getElementById('qmath-copy-lesson-modal');
    if (old) old.remove();

    const otherClasses = (classesList || []).filter(c => c.id !== lesson.classId);
    if (otherClasses.length === 0) {
      alert('Chưa có lớp học khác trên hệ thống để sao chép bài giảng sang!');
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'qmath-copy-lesson-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(15,23,42,0.8);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;';
    modal.innerHTML = `
      <div style="background:#fff;max-width:520px;width:100%;border-radius:20px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;color:#1e293b;">
        <div style="padding:18px 22px;background:linear-gradient(135deg,#4f46e5,#3b82f6);color:#fff;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <h3 style="margin:0;font-size:16px;font-weight:800;">📋 Sao Chép Bài Giảng Sang Lớp Khác</h3>
            <p style="margin:3px 0 0;font-size:12px;opacity:0.9;">Tái sử dụng bài học, video và học liệu sang nhiều lớp cùng lúc</p>
          </div>
          <button id="qm-cp-close" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:30px;height:30px;border-radius:8px;cursor:pointer;font-weight:700;">✕</button>
        </div>

        <div style="padding:18px 22px;font-size:13px;">
          <div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:14px;">
            <div style="font-size:11px;font-weight:700;color:#6366f1;">BÀI GIẢNG ĐƯỢC SAO CHÉP:</div>
            <div style="font-size:14px;font-weight:800;color:#0f172a;margin-top:2px;">${lesson.title}</div>
            <div style="font-size:11.5px;color:#64748b;margin-top:2px;">
              📄 ${lesson.pageCount || 1} trang ghi chép
              ${lesson.video ? ' • 🎬 Có Video bài giảng' : ''}
              ${lesson.materials?.length ? ' • 📎 ' + lesson.materials.length + ' file học liệu' : ''}
            </div>
          </div>

          <label style="font-weight:700;display:block;margin-bottom:8px;">Chọn các Lớp học đích sẽ nhận bài giảng này:</label>
          <div style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;border:1.5px solid #e2e8f0;padding:10px;border-radius:12px;background:#fff;">
            ${otherClasses.map(c => `
              <label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='transparent'">
                <input type="checkbox" class="qm-cp-class-chk" value="${c.id}" data-cname="${c.name}" style="width:16px;height:16px;cursor:pointer;" />
                <span style="font-weight:700;color:#0f172a;">${c.name}</span>
              </label>
            `).join('')}
          </div>

          <div style="margin-top:14px;display:flex;align-items:center;justify-content:space-between;">
            <button id="qm-cp-select-all" style="background:none;border:none;color:#4f46e5;font-weight:700;font-size:12px;cursor:pointer;padding:0;">
              ☑️ Chọn tất cả lớp
            </button>
            <span style="font-size:11.5px;color:#64748b;">(Tối ưu 100% dung lượng đám mây)</span>
          </div>

          <div id="qm-cp-status" style="display:none;margin-top:12px;padding:10px;border-radius:8px;background:#eff6ff;color:#1e40af;font-weight:700;font-size:12px;"></div>
        </div>

        <div style="padding:14px 22px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;gap:8px;">
          <button id="qm-cp-cancel" style="padding:9px 15px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#64748b;font-weight:700;font-size:13px;cursor:pointer;">Hủy</button>
          <button id="qm-cp-submit" style="padding:9px 20px;border-radius:10px;border:none;background:linear-gradient(135deg,#4f46e5,#3b82f6);color:#fff;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 4px 12px rgba(79,70,229,0.3);">
            🚀 Sao Chép Sang Lớp Đã Chọn
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('qm-cp-close').onclick = () => modal.remove();
    document.getElementById('qm-cp-cancel').onclick = () => modal.remove();

    let allChecked = false;
    document.getElementById('qm-cp-select-all').onclick = () => {
      allChecked = !allChecked;
      modal.querySelectorAll('.qm-cp-class-chk').forEach(chk => { chk.checked = allChecked; });
      document.getElementById('qm-cp-select-all').textContent = allChecked ? '⏹️ Bỏ chọn tất cả' : '☑️ Chọn tất cả lớp';
    };

    document.getElementById('qm-cp-submit').onclick = async () => {
      const selectedBoxes = Array.from(modal.querySelectorAll('.qm-cp-class-chk:checked'));
      if (selectedBoxes.length === 0) {
        alert('Vui lòng chọn ít nhất 1 Lớp học để sao chép bài giảng!');
        return;
      }

      const stBox = document.getElementById('qm-cp-status');
      const submitBtn = document.getElementById('qm-cp-submit');
      stBox.style.display = 'block';
      submitBtn.disabled = true;

      try {
        let count = 0;
        for (const chk of selectedBoxes) {
          const targetClassId = chk.value;
          const targetClassName = chk.getAttribute('data-cname') || 'Lớp học';
          stBox.textContent = `Đang sao chép sang ${targetClassName} (${count + 1}/${selectedBoxes.length})...`;

          const newLessonId = 'les_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
          const clonedLesson = {
            ...lesson,
            id: newLessonId,
            classId: targetClassId,
            className: targetClassName,
            title: lesson.title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          await sbUpsertConfig(`lesson_${newLessonId}`, clonedLesson);
          count++;
        }

        showToast(`🎉 Đã sao chép thành công bài giảng sang ${count} lớp học!`, 'success', 5000);
        modal.remove();
        if (typeof onComplete === 'function') onComplete();
      } catch (err) {
        stBox.textContent = 'Lỗi sao chép: ' + err.message;
        submitBtn.disabled = false;
      }
    };
  }

  // =========================================================
  // 11. SAVE LESSON NOTE & MATERIALS TO CLASS (FOR TEACHER)
  // =========================================================
  async function openSaveToClassModal() {
    if (!window.__NR_EDITOR || !window.__NR_EDITOR.doc || !window.__NR_API) {
      alert('Bảng viết chưa sẵn sàng. Vui lòng thử lại sau giây lát!');
      return;
    }

    let existingModal = document.getElementById('qmath-save-lesson-modal');
    if (existingModal) existingModal.remove();

    const rawDoc = window.__NR_EDITOR.doc;
    const currentVideo = rawDoc.telegramVideo || rawDoc.lectureVideo || currentLoadedLesson?.video || null;
    let attachedMaterials = Array.isArray(currentLoadedLesson?.materials) ? [...currentLoadedLesson.materials] : [];

    const modal = document.createElement('div');
    modal.id = 'qmath-save-lesson-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,0.75);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;';
    modal.innerHTML = `
      <div style="background:#fff;max-width:580px;width:100%;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.35);overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:18px 22px;color:#fff;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <h3 style="margin:0;font-size:17px;font-weight:800;">💾 Lưu Bài Giảng Vào Lớp Học</h3>
            <p style="margin:3px 0 0;font-size:12px;opacity:0.9;">Ghi chép vector siêu nhẹ (.nrn) • Video 1:1 • Học liệu đính kèm</p>
          </div>
          <button id="qm-save-close" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:30px;height:30px;border-radius:8px;cursor:pointer;font-weight:800;">✕</button>
        </div>

        <div style="padding:20px 22px;max-height:78vh;overflow-y:auto;font-size:13px;color:#1e293b;">
          <div style="margin-bottom:14px;">
            <label style="font-weight:700;display:block;margin-bottom:5px;">1. Chọn Lớp học nhận bài giảng *</label>
            <select id="qm-save-class" style="width:100%;padding:10px 12px;border:1.5px solid #cbd5e1;border-radius:10px;font-weight:700;font-size:13px;">
              <option value="">Đang tải danh sách lớp học...</option>
            </select>
          </div>

          <div style="margin-bottom:14px;">
            <label style="font-weight:700;display:block;margin-bottom:5px;">2. Chọn Bài học (Cập nhật bài cũ hoặc Tạo bài mới)</label>
            <select id="qm-save-existing-lesson" style="width:100%;padding:10px 12px;border:1.5px solid #cbd5e1;border-radius:10px;font-weight:600;font-size:13px;">
              <option value="NEW">➕ Tạo bài giảng mới trong lớp này</option>
            </select>
          </div>

          <div style="display:grid;grid-template-columns:1fr 140px;gap:10px;margin-bottom:14px;">
            <div>
              <label style="font-weight:700;display:block;margin-bottom:5px;">Chuyên đề / Chương</label>
              <input id="qm-save-chapter" type="text" placeholder="VD: Chương 1 - Căn bậc hai" style="width:100%;box-sizing:border-box;padding:9px 12px;border:1.5px solid #cbd5e1;border-radius:10px;font-size:13px;" />
            </div>
            <div>
              <label style="font-weight:700;display:block;margin-bottom:5px;">Ngày dạy</label>
              <input id="qm-save-date" type="date" style="width:100%;box-sizing:border-box;padding:9px 10px;border:1.5px solid #cbd5e1;border-radius:10px;font-size:13px;" />
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <label style="font-weight:700;display:block;margin-bottom:5px;">Tên bài giảng / Buổi học *</label>
            <input id="qm-save-title" type="text" placeholder="VD: Buổi 1 - Hằng đẳng thức và Căn bậc hai" style="width:100%;box-sizing:border-box;padding:10px 12px;border:1.5px solid #cbd5e1;border-radius:10px;font-weight:700;font-size:13.5px;" />
          </div>

          <!-- VIDEO STATUS BOX 1:1 -->
          <div style="margin-bottom:14px;padding:12px;border-radius:12px;border:1.5px solid ${currentVideo ? '#bbf7d0' : '#e2e8f0'};background:${currentVideo ? '#f0fdf4' : '#f8fafc'};">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span style="font-weight:700;color:${currentVideo ? '#15803d' : '#475569'};font-size:12.5px;">
                🎬 Video bài giảng đi kèm (Tỷ lệ 1:1):
              </span>
              ${currentVideo ? `
                <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:800;">ĐÃ SẴN SÀNG</span>
              ` : `
                <span style="background:#94a3b8;color:#fff;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;">CHƯA QUAY</span>
              `}
            </div>
            ${currentVideo ? `
              <div style="margin-top:6px;font-size:12px;color:#166534;font-weight:600;">
                ▶ ${currentVideo.title || 'Video bài giảng'} (${currentVideo.duration ? formatDuration(currentVideo.duration) : ''}${currentVideo.size ? ' • ' + (currentVideo.size / (1024*1024)).toFixed(1) + ' MB' : ''})
              </div>
            ` : `
              <div style="margin-top:6px;font-size:12px;color:#64748b;">
                Chưa có video. Bạn có thể bấm nút [🎬] trên thanh công cụ để ghi hình hoặc dán link video kho lưu trữ vào đây:
                <input id="qm-save-manual-video" type="text" placeholder="Dán link video kho lưu trữ..." style="margin-top:6px;width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;" />
              </div>
            `}
          </div>

          <!-- MATERIALS ATTACHMENT SECTION -->
          <div style="margin-bottom:14px;padding:12px;border-radius:12px;border:1.5px solid #e2e8f0;background:#f8fafc;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <span style="font-weight:700;color:#0f172a;font-size:12.5px;">📎 Học liệu & Tài liệu đính kèm (Phiếu BT, Word, PDF...):</span>
              <label style="background:#2563eb;color:#fff;padding:5px 10px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;">
                <span>+ Thêm file</span>
                <input type="file" id="qm-save-material-file" multiple style="display:none;" />
              </label>
            </div>
            <div id="qm-save-materials-list" style="display:flex;flex-direction:column;gap:5px;">
              ${attachedMaterials.length === 0 ? '<div style="color:#94a3b8;font-size:12px;padding:4px 0;">Chưa có học liệu đính kèm.</div>' : ''}
            </div>
            <div id="qm-material-upload-progress" style="display:none;margin-top:6px;font-size:11.5px;color:#2563eb;font-weight:700;">
              ⏳ Đang tải file học liệu lên đám mây...
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <label style="font-weight:700;display:block;margin-bottom:5px;">Tóm tắt / Dặn dò học sinh (Tùy chọn)</label>
            <textarea id="qm-save-summary" rows="2" placeholder="VD: Các em xem kỹ Ví dụ 3, 4 và hoàn thành BTVN trước thứ 6 nhé!" style="width:100%;box-sizing:border-box;padding:9px 12px;border:1.5px solid #cbd5e1;border-radius:10px;font-size:13px;resize:vertical;"></textarea>
          </div>

          <label style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;cursor:pointer;font-weight:600;">
            <input id="qm-save-allow-pdf" type="checkbox" checked style="width:16px;height:16px;" />
            <span>Cho phép học sinh tự xuất và tải file PDF khi xem lại bài giảng</span>
          </label>

          <div id="qm-save-progress-box" style="display:none;margin-top:14px;padding:12px;border-radius:10px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af;font-weight:700;font-size:12.5px;">
            ⏳ <span id="qm-save-progress-text">Đang xử lý...</span>
          </div>
        </div>

        <div style="padding:14px 22px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:10px;">
          <button id="qm-btn-export-local-pdf" style="padding:10px 14px;border-radius:10px;border:1.5px solid #cbd5e1;background:#fff;color:#334155;font-weight:700;font-size:12.5px;cursor:pointer;">
            📄 Xuất PDF về máy ngay
          </button>
          <div style="display:flex;gap:8px;">
            <button id="qm-save-cancel" style="padding:10px 16px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#64748b;font-weight:700;font-size:13px;cursor:pointer;">Hủy</button>
            <button id="qm-save-submit" style="padding:10px 20px;border-radius:10px;border:none;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 4px 12px rgba(37,99,235,0.3);">
              ☁️ Lưu Vào Lớp Học
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const todayStr = new Date().toISOString().slice(0, 10);
    document.getElementById('qm-save-date').value = currentLoadedLesson?.lessonDate || todayStr;
    document.getElementById('qm-save-chapter').value = currentLoadedLesson?.chapter || 'Chuyên đề bài giảng';
    document.getElementById('qm-save-title').value = currentLoadedLesson?.title || `Bài giảng ngày ${new Date().toLocaleDateString('vi-VN')}`;
    document.getElementById('qm-save-summary').value = currentLoadedLesson?.summary || '';
    document.getElementById('qm-save-allow-pdf').checked = currentLoadedLesson?.allowStudentPdf !== false;

    document.getElementById('qm-save-close').onclick = () => modal.remove();
    document.getElementById('qm-save-cancel').onclick = () => modal.remove();
    document.getElementById('qm-btn-export-local-pdf').onclick = () => exportCurrentNoteToPdf();

    // Render materials chips list
    const matListEl = document.getElementById('qm-save-materials-list');
    const renderMaterials = () => {
      if (attachedMaterials.length === 0) {
        matListEl.innerHTML = '<div style="color:#94a3b8;font-size:12px;padding:4px 0;">Chưa có học liệu đính kèm.</div>';
        return;
      }
      matListEl.innerHTML = attachedMaterials.map((m, idx) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:#fff;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;">
          <div style="display:flex;align-items:center;gap:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            <span>📎</span>
            <span style="font-weight:700;color:#0f172a;">${m.name}</span>
            <span style="color:#64748b;font-size:11px;">(${(m.size / 1024).toFixed(0)} KB)</span>
          </div>
          <button data-del-mat="${idx}" style="background:none;border:none;color:#ef4444;cursor:pointer;font-weight:800;font-size:13px;padding:2px 6px;">✕</button>
        </div>
      `).join('');

      matListEl.querySelectorAll('[data-del-mat]').forEach(btn => {
        btn.onclick = () => {
          const i = parseInt(btn.getAttribute('data-del-mat'), 10);
          attachedMaterials.splice(i, 1);
          renderMaterials();
        };
      });
    };
    renderMaterials();

    // File input handler for materials
    const matInput = document.getElementById('qm-save-material-file');
    matInput.onchange = async () => {
      const files = Array.from(matInput.files || []);
      if (files.length === 0) return;
      const prog = document.getElementById('qm-material-upload-progress');
      prog.style.display = 'block';

      try {
        const teacherId = (currentUser?.uid || currentUser?.id || 'teacher').replace(/[^a-zA-Z0-9_-]/g, '_');
        const noteId = currentLoadedLesson?.noteId || ('note_' + Date.now().toString(36));

        for (const f of files) {
          prog.textContent = `⏳ Đang tải file "${f.name}" (${(f.size/1024).toFixed(0)} KB)...`;
          const cleanName = f.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const r2Key = `notes/${teacherId}/${noteId}/materials/${cleanName}`;
          const fileUrl = await uploadBlobToR2(r2Key, f, false);
          attachedMaterials.push({
            name: f.name,
            size: f.size,
            type: f.type || 'application/octet-stream',
            url: fileUrl,
            uploadedAt: new Date().toISOString()
          });
        }
        renderMaterials();
        showToast(`✅ Đã tải lên ${files.length} file học liệu thành công!`, 'success');
      } catch (err) {
        alert('Lỗi tải file học liệu: ' + err.message);
      } finally {
        prog.style.display = 'none';
        matInput.value = '';
      }
    };

    let classesList = [];
    let allLessons = [];
    try {
      const [clsRows, confRows] = await Promise.all([
        sbSelect('classes', 'select=id,name,teacher_id,raw_data&order=created_at.desc'),
        sbSelect('configurations', 'select=id,raw_data&id=like.lesson_*')
      ]);
      classesList = Array.isArray(clsRows) ? clsRows.map(r => ({
        id: r.id,
        name: r.name || r.raw_data?.name || 'Lớp học',
        teacherId: r.teacher_id || r.raw_data?.teacherId || ''
      })) : [];

      allLessons = Array.isArray(confRows) ? confRows.map(r => ({
        id: r.raw_data?.id || r.id.replace(/^lesson_/, ''),
        ...(r.raw_data || {})
      })) : [];
    } catch (e) {
      console.warn('[openSaveToClassModal] Error loading classes:', e);
    }

    const clsSelect = document.getElementById('qm-save-class');
    const lesSelect = document.getElementById('qm-save-existing-lesson');

    if (classesList.length === 0) {
      clsSelect.innerHTML = '<option value="">Chưa có lớp học nào trên hệ thống</option>';
    } else {
      clsSelect.innerHTML = classesList.map(c =>
        `<option value="${c.id}" ${c.id === activeContext.classId ? 'selected' : ''}>${c.name}</option>`
      ).join('');
    }

    const populateLessonsForClass = (cid) => {
      const classLessons = allLessons
        .filter(l => l.classId === cid)
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

      lesSelect.innerHTML = '<option value="NEW">➕ Tạo bài giảng mới trong lớp này</option>' +
        classLessons.map(l =>
          `<option value="${l.id}" ${l.id === activeContext.lessonId ? 'selected' : ''}>🔄 Cập nhật: ${l.title} (v${l.version || 1})</option>`
        ).join('');

      if (activeContext.lessonId) {
        const found = classLessons.find(l => l.id === activeContext.lessonId);
        if (found) {
          document.getElementById('qm-save-chapter').value = found.chapter || 'Chuyên đề bài giảng';
          document.getElementById('qm-save-title').value = found.title || '';
          document.getElementById('qm-save-summary').value = found.summary || '';
          if (found.lessonDate) document.getElementById('qm-save-date').value = found.lessonDate;
          if (Array.isArray(found.materials) && attachedMaterials.length === 0) {
            attachedMaterials = [...found.materials];
            renderMaterials();
          }
        }
      }
    };

    populateLessonsForClass(clsSelect.value);
    clsSelect.onchange = () => populateLessonsForClass(clsSelect.value);
    lesSelect.onchange = () => {
      const lid = lesSelect.value;
      if (lid !== 'NEW') {
        const found = allLessons.find(l => l.id === lid);
        if (found) {
          document.getElementById('qm-save-chapter').value = found.chapter || '';
          document.getElementById('qm-save-title').value = found.title || '';
          document.getElementById('qm-save-summary').value = found.summary || '';
          if (found.lessonDate) document.getElementById('qm-save-date').value = found.lessonDate;
          document.getElementById('qm-save-allow-pdf').checked = found.allowStudentPdf !== false;
          if (Array.isArray(found.materials)) {
            attachedMaterials = [...found.materials];
            renderMaterials();
          }
        }
      }
    };

    document.getElementById('qm-save-submit').onclick = async () => {
      const selectedClassId = clsSelect.value;
      const selectedClassObj = classesList.find(c => c.id === selectedClassId);
      const selectedLessonId = lesSelect.value;
      const chapter = (document.getElementById('qm-save-chapter').value || 'Chuyên đề chung').trim();
      const lessonDate = document.getElementById('qm-save-date').value || todayStr;
      const title = (document.getElementById('qm-save-title').value || '').trim();
      const summary = (document.getElementById('qm-save-summary').value || '').trim();
      const allowStudentPdf = document.getElementById('qm-save-allow-pdf').checked;

      // Handle manual video link if provided
      let finalVideo = currentVideo;
      const manualVidInput = document.getElementById('qm-save-manual-video');
      if (manualVidInput && manualVidInput.value.trim() && !finalVideo) {
        finalVideo = {
          title: title,
          tmeUrl: manualVidInput.value.trim(),
          recordedAt: new Date().toISOString()
        };
      }

      if (!selectedClassId) {
        alert('Vui lòng chọn Lớp học!');
        return;
      }
      if (!title) {
        alert('Vui lòng nhập Tên bài giảng!');
        return;
      }

      const progBox = document.getElementById('qm-save-progress-box');
      const progTxt = document.getElementById('qm-save-progress-text');
      const submitBtn = document.getElementById('qm-save-submit');
      progBox.style.display = 'block';
      submitBtn.disabled = true;

      try {
        const isUpdate = selectedLessonId && selectedLessonId !== 'NEW';
        const existingLesson = isUpdate ? allLessons.find(l => l.id === selectedLessonId) : null;
        const lessonId = isUpdate
          ? selectedLessonId
          : ('les_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
        const noteId = existingLesson?.noteId || ('note_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
        const nextVersion = isUpdate ? ((Number(existingLesson?.version) || 1) + 1) : 1;

        if (finalVideo && rawDoc && !rawDoc.telegramVideo) {
          rawDoc.telegramVideo = finalVideo;
        }

        const { lessonPayload, nrnByteLength } = await executeSaveLessonToCloud({
          selectedClassId,
          selectedClassName: selectedClassObj?.name || '',
          lessonId,
          noteId,
          nextVersion,
          chapter,
          lessonDate,
          title,
          summary,
          allowStudentPdf,
          existingCreatedAt: existingLesson?.createdAt,
          existingCoverUrl: existingLesson?.coverUrl,
          attachedMaterials,
          existingLesson: existingLesson ? { ...existingLesson, video: finalVideo || existingLesson.video } : (finalVideo ? { video: finalVideo } : null),
          onProgress: (msg) => { progTxt.textContent = msg; }
        });

        const kb = (nrnByteLength / 1024).toFixed(1);
        progTxt.textContent = `✅ Đã lưu thành công "${title}" (${lessonPayload.pageCount} trang, dung lượng vector chỉ ${kb} KB)!`;
        showToast(`✅ Đã lưu bài giảng "${title}" vào ${selectedClassObj?.name || 'Lớp học'} (${kb} KB)!`, 'success', 5000);
        setTimeout(() => modal.remove(), 900);
      } catch (err) {
        console.error('[SaveLesson] Error:', err);
        alert('Lỗi lưu bài giảng: ' + err.message);
        submitBtn.disabled = false;
        progBox.style.display = 'none';
      }
    };
  }

  // =========================================================
  // 12. SCIENTIFIC CLASSROOM & LESSON HUB (DASHBOARD QUẢN LÝ BÀI HỌC)
  // =========================================================
  async function openLoadFromClassModal() {
    let existing = document.getElementById('qmath-open-lesson-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'qmath-open-lesson-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,0.8);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;';
    modal.innerHTML = `
      <div style="background:#fff;max-width:880px;width:100%;border-radius:24px;box-shadow:0 30px 70px rgba(0,0,0,0.4);overflow:hidden;display:flex;flex-direction:column;max-height:90vh;">
        <!-- HEADER -->
        <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:18px 26px;color:#fff;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#3b82f6,#2563eb);display:flex;align-items:center;justify-content:center;font-size:20px;">
              📚
            </div>
            <div>
              <h3 style="margin:0;font-size:17px;font-weight:800;letter-spacing:-0.2px;">Quản Lý Lớp Học & Bài Giảng Khoa Học</h3>
              <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">Đồng bộ 1:1 Ghi chép bảng • Video bài giảng • Học liệu & Tái sử dụng</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <button id="qm-btn-new-lesson-from-hub" style="background:linear-gradient(135deg,#2563eb,#1d4ed8);border:none;color:#fff;padding:8px 14px;border-radius:10px;cursor:pointer;font-weight:700;font-size:12.5px;display:flex;align-items:center;gap:6px;box-shadow:0 4px 12px rgba(37,99,235,0.3);">
              <span>➕</span> Soạn bài mới
            </button>
            <button id="qm-open-close" style="background:rgba(255,255,255,0.1);border:none;color:#fff;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;font-weight:700;">✕</button>
          </div>
        </div>

        <!-- FILTER & SEARCH BAR -->
        <div style="padding:16px 26px;background:#f8fafc;border-bottom:1px solid #e2e8f0;display:grid;grid-template-columns:220px 200px 1fr;gap:12px;align-items:center;">
          <div>
            <label style="font-size:11px;font-weight:800;color:#64748b;display:block;margin-bottom:4px;text-transform:uppercase;">Lớp học</label>
            <select id="qm-open-class-filter" style="width:100%;padding:9px 12px;border:1.5px solid #cbd5e1;border-radius:10px;font-weight:700;font-size:13px;background:#fff;outline:none;">
              <option value="ALL">Tất cả lớp học</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px;font-weight:800;color:#64748b;display:block;margin-bottom:4px;text-transform:uppercase;">Chuyên đề</label>
            <select id="qm-open-chapter-filter" style="width:100%;padding:9px 12px;border:1.5px solid #cbd5e1;border-radius:10px;font-weight:600;font-size:13px;background:#fff;outline:none;">
              <option value="ALL">Tất cả chuyên đề</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px;font-weight:800;color:#64748b;display:block;margin-bottom:4px;text-transform:uppercase;">Tìm kiếm bài giảng</label>
            <input id="qm-open-search" type="text" placeholder="Tìm theo tên bài học, dặn dò..." style="width:100%;box-sizing:border-box;padding:9px 12px;border:1.5px solid #cbd5e1;border-radius:10px;font-size:13px;background:#fff;outline:none;" />
          </div>
        </div>

        <!-- STATS BAR -->
        <div style="padding:8px 26px;background:#f1f5f9;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#475569;display:flex;align-items:center;justify-content:space-between;">
          <span id="qm-open-stats-text">Đang tải dữ liệu...</span>
          <span style="font-size:11px;color:#64748b;font-weight:600;">(Học sinh và giáo viên mở xem trực tiếp mọi lúc mọi nơi)</span>
        </div>

        <!-- LESSONS CARDS LIST -->
        <div id="qm-open-lessons-list" style="padding:18px 26px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;flex:1;background:#f8fafc;">
          <div style="text-align:center;padding:40px;color:#64748b;font-size:13px;">Đang tải danh sách bài giảng...</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('qm-open-close').onclick = () => modal.remove();

    document.getElementById('qm-btn-new-lesson-from-hub').onclick = () => {
      if (confirm('Bắt đầu soạn bài giảng mới trên bảng trắng?')) {
        modal.remove();
        currentLoadedLesson = null;
        activeContext.lessonId = '';
        if (window.__NR_EDITOR && typeof window.__NR_EDITOR.clear === 'function') {
          window.__NR_EDITOR.clear();
        }
        document.title = 'NoteRenderer - QMath';
        updateSaveStatusBadge();
        showToast('✨ Đã mở bảng trắng để soạn bài giảng mới!', 'success');
      }
    };

    try {
      const [clsRows, confRows] = await Promise.all([
        sbSelect('classes', 'select=id,name,raw_data&order=created_at.desc'),
        sbSelect('configurations', 'select=id,raw_data&id=like.lesson_*')
      ]);
      const clsMap = {};
      const classesList = Array.isArray(clsRows) ? clsRows.map(c => {
        const name = c.name || c.raw_data?.name || 'Lớp học';
        clsMap[c.id] = name;
        return { id: c.id, name };
      }) : [];

      const rawLessons = (confRows || [])
        .map(r => ({ id: r.raw_data?.id || r.id.replace(/^lesson_/, ''), ...(r.raw_data || {}) }))
        .filter(l => l.r2Key)
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

      const filterCls = document.getElementById('qm-open-class-filter');
      filterCls.innerHTML = '<option value="ALL">Tất cả lớp học (' + rawLessons.length + ' bài)</option>' +
        Object.entries(clsMap).map(([cid, cname]) => {
          const count = rawLessons.filter(l => l.classId === cid).length;
          return `<option value="${cid}" ${cid === activeContext.classId ? 'selected' : ''}>${cname} (${count} bài)</option>`;
        }).join('');

      // Populate Chapters filter
      const filterChap = document.getElementById('qm-open-chapter-filter');
      const searchInput = document.getElementById('qm-open-search');
      const statsEl = document.getElementById('qm-open-stats-text');
      const listEl = document.getElementById('qm-open-lessons-list');

      const updateChapters = (currentClassId) => {
        const pool = currentClassId === 'ALL' ? rawLessons : rawLessons.filter(l => l.classId === currentClassId);
        const chaps = Array.from(new Set(pool.map(l => l.chapter).filter(Boolean)));
        filterChap.innerHTML = '<option value="ALL">Tất cả chuyên đề (' + chaps.length + ')</option>' +
          chaps.map(ch => `<option value="${ch}">${ch}</option>`).join('');
      };
      updateChapters(filterCls.value);

      const renderList = () => {
        const cid = filterCls.value;
        const chap = filterChap.value;
        const query = (searchInput.value || '').trim().toLowerCase();

        let filtered = rawLessons;
        if (cid !== 'ALL') filtered = filtered.filter(l => l.classId === cid);
        if (chap !== 'ALL') filtered = filtered.filter(l => l.chapter === chap);
        if (query) {
          filtered = filtered.filter(l =>
            (l.title && l.title.toLowerCase().includes(query)) ||
            (l.chapter && l.chapter.toLowerCase().includes(query)) ||
            (l.summary && l.summary.toLowerCase().includes(query))
          );
        }

        const videoCount = filtered.filter(l => l.video).length;
        const matCount = filtered.reduce((acc, l) => acc + (Array.isArray(l.materials) ? l.materials.length : 0), 0);
        statsEl.textContent = `📊 Hiển thị: ${filtered.length} bài giảng • ${videoCount} có video ghi hình • ${matCount} file học liệu đính kèm`;

        if (filtered.length === 0) {
          listEl.innerHTML = `
            <div style="text-align:center;padding:50px 20px;color:#94a3b8;font-size:13.5px;">
              <span style="font-size:32px;display:block;margin-bottom:8px;">🔍</span>
              Không tìm thấy bài giảng nào phù hợp với bộ lọc hiện tại.
            </div>
          `;
          return;
        }

        listEl.innerHTML = filtered.map((l, idx) => {
          const hasVideo = !!l.video;
          const materials = Array.isArray(l.materials) ? l.materials : [];
          const kb = ((l.sizeBytes || 0) / 1024).toFixed(0);
          const className = clsMap[l.classId] || l.className || 'Lớp học';

          return `
            <div data-lid="${l.id}" style="background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:16px 18px;box-shadow:0 2px 6px rgba(0,0,0,0.03);transition:all 0.2s;" onmouseover="this.style.borderColor='#3b82f6';this.style.boxShadow='0 8px 20px rgba(59,130,246,0.12)'" onmouseout="this.style.borderColor='#e2e8f0';this.style.boxShadow='0 2px 6px rgba(0,0,0,0.03)'">
              <!-- TOP META ROW -->
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
                <div>
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <span style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:800;">${className}</span>
                    <span style="background:#f1f5f9;color:#475569;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">${l.chapter || 'Chuyên đề'}</span>
                    <span style="font-size:11px;color:#64748b;">📅 ${l.lessonDate || 'Hôm nay'}</span>
                    <span style="font-size:10.5px;color:#94a3b8;">v${l.version || 1}</span>
                  </div>
                  <h4 style="margin:6px 0 3px;font-size:15px;font-weight:800;color:#0f172a;line-height:1.35;">${l.title}</h4>
                  ${l.summary ? `<p style="margin:2px 0 0;font-size:12px;color:#64748b;font-style:italic;">💬 ${l.summary}</p>` : ''}
                </div>

                <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
                  <button data-action="open-note" data-lid="${l.id}" style="padding:8px 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;font-weight:800;font-size:12.5px;cursor:pointer;display:flex;align-items:center;gap:5px;box-shadow:0 3px 10px rgba(37,99,235,0.25);">
                    <span>✏️</span> Mở Bảng Viết
                  </button>
                  <button data-action="copy-class" data-lid="${l.id}" title="Sao chép bài giảng này sang Lớp khác" style="padding:8px 11px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#4f46e5;font-weight:700;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:4px;">
                    <span>🔄</span> Sang lớp...
                  </button>
                </div>
              </div>

              <!-- 3 SCIENTIFIC RESOURCE COLUMNS (1:1 CORRESPONDENCE) -->
              <div style="margin-top:12px;padding-top:10px;border-top:1px dashed #e2e8f0;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;font-size:12px;">
                <!-- 1. GHI CHÉP BẢNG -->
                <div style="background:#f8fafc;padding:9px 12px;border-radius:10px;border:1px solid #e2e8f0;display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-weight:700;color:#0f172a;">📝 Nét vẽ Vector</span>
                    <span style="font-size:11px;color:#64748b;">${l.pageCount || 1} trang • ${kb} KB</span>
                  </div>
                  <div style="display:flex;gap:6px;">
                    <button data-action="open-note" data-lid="${l.id}" style="flex:1;padding:4px 8px;border-radius:6px;border:1px solid #bfdbfe;background:#eff6ff;color:#1e40af;font-size:11px;font-weight:700;cursor:pointer;">
                      Mở viết
                    </button>
                    ${l.allowStudentPdf !== false ? `
                      <button data-action="export-pdf" data-lid="${l.id}" style="padding:4px 8px;border-radius:6px;border:1px solid #e2e8f0;background:#fff;color:#475569;font-size:11px;font-weight:700;cursor:pointer;">
                        📄 PDF
                      </button>
                    ` : ''}
                  </div>
                </div>

                <!-- 2. VIDEO BÀI GIẢNG (1:1) -->
                <div style="background:${hasVideo ? '#f0fdf4' : '#fafafa'};padding:9px 12px;border-radius:10px;border:1px solid ${hasVideo ? '#bbf7d0' : '#e5e7eb'};display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-weight:700;color:${hasVideo ? '#15803d' : '#6b7280'};">🎬 Video Bài Giảng</span>
                    ${hasVideo ? `
                      <span style="font-size:11px;color:#166534;font-weight:700;">${formatDuration(l.video.duration)}</span>
                    ` : `
                      <span style="font-size:11px;color:#9ca3af;">Chưa có</span>
                    `}
                  </div>
                  <div>
                    ${hasVideo ? `
                      <button data-action="play-video" data-lid="${l.id}" style="width:100%;padding:4px 8px;border-radius:6px;border:none;background:#16a34a;color:#fff;font-size:11px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;">
                        <span>▶</span> Xem Video
                      </button>
                    ` : `
                      <button data-action="attach-video" data-lid="${l.id}" style="width:100%;padding:4px 8px;border-radius:6px;border:1px dashed #cbd5e1;background:#fff;color:#64748b;font-size:11px;font-weight:700;cursor:pointer;">
                        + Gắn video
                      </button>
                    `}
                  </div>
                </div>

                <!-- 3. HỌC LIỆU ĐÍNH KÈM -->
                <div style="background:#f8fafc;padding:9px 12px;border-radius:10px;border:1px solid #e2e8f0;display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-weight:700;color:#0f172a;">📎 Học Liệu (${materials.length})</span>
                    <label style="color:#2563eb;font-size:11px;font-weight:800;cursor:pointer;">
                      + Thêm
                      <input type="file" data-action="upload-material" data-lid="${l.id}" multiple style="display:none;" />
                    </label>
                  </div>
                  <div style="display:flex;gap:4px;flex-wrap:wrap;max-height:42px;overflow-y:auto;">
                    ${materials.length === 0 ? `
                      <span style="color:#94a3b8;font-size:11px;">Chưa có tài liệu</span>
                    ` : materials.map(m => `
                      <a href="${m.url}" target="_blank" download="${m.name}" title="${m.name} (${(m.size/1024).toFixed(0)} KB)" style="background:#fff;border:1px solid #cbd5e1;padding:2px 6px;border-radius:4px;color:#1e40af;text-decoration:none;font-size:10.5px;font-weight:700;display:inline-flex;align-items:center;gap:3px;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                        📄 ${m.name}
                      </a>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Wire click handlers
        // Open Note
        listEl.querySelectorAll('[data-action="open-note"]').forEach(b => {
          b.onclick = async () => {
            const lid = b.getAttribute('data-lid');
            modal.remove();
            activeContext.viewMode = false;
            await loadAndRenderLessonNote(lid);
          };
        });

        // Play Video
        listEl.querySelectorAll('[data-action="play-video"]').forEach(b => {
          b.onclick = () => {
            const lid = b.getAttribute('data-lid');
            const target = rawLessons.find(x => x.id === lid);
            if (target && target.video) {
              openVideoPlayerModal(target.video, target.title);
            }
          };
        });

        // Copy Lesson to Other Classes
        listEl.querySelectorAll('[data-action="copy-class"]').forEach(b => {
          b.onclick = () => {
            const lid = b.getAttribute('data-lid');
            const target = rawLessons.find(x => x.id === lid);
            if (target) {
              openCopyLessonModal(target, classesList, () => {
                modal.remove();
                openLoadFromClassModal();
              });
            }
          };
        });

        // Attach Video manually
        listEl.querySelectorAll('[data-action="attach-video"]').forEach(b => {
          b.onclick = async () => {
            const lid = b.getAttribute('data-lid');
            const target = rawLessons.find(x => x.id === lid);
            if (!target) return;
            const link = prompt(`Nhập link video Kho lưu trữ hoặc link xem trực tuyến cho bài "${target.title}":`, target.video?.tmeUrl || '');
            if (link && link.trim()) {
              target.video = {
                title: target.title,
                tmeUrl: link.trim(),
                recordedAt: new Date().toISOString()
              };
              await sbUpsertConfig(`lesson_${target.id}`, target);
              showToast('✅ Đã gắn video vào bài giảng thành công!', 'success');
              renderList();
            }
          };
        });

        // Upload Material directly to lesson card
        listEl.querySelectorAll('[data-action="upload-material"]').forEach(inp => {
          inp.onchange = async () => {
            const lid = inp.getAttribute('data-lid');
            const target = rawLessons.find(x => x.id === lid);
            if (!target) return;
            const files = Array.from(inp.files || []);
            if (files.length === 0) return;

            showToast(`⏳ Đang tải ${files.length} file học liệu lên đám mây...`, 'info');
            try {
              const teacherId = (currentUser?.uid || currentUser?.id || 'teacher').replace(/[^a-zA-Z0-9_-]/g, '_');
              const noteId = target.noteId || ('note_' + Date.now().toString(36));
              if (!Array.isArray(target.materials)) target.materials = [];

              for (const f of files) {
                const cleanName = f.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const r2Key = `notes/${teacherId}/${noteId}/materials/${cleanName}`;
                const fileUrl = await uploadBlobToR2(r2Key, f, false);
                target.materials.push({
                  name: f.name,
                  size: f.size,
                  type: f.type || 'application/octet-stream',
                  url: fileUrl,
                  uploadedAt: new Date().toISOString()
                });
              }

              await sbUpsertConfig(`lesson_${target.id}`, target);
              showToast(`✅ Đã đính kèm ${files.length} file học liệu vào bài giảng!`, 'success');
              renderList();
            } catch (err) {
              alert('Lỗi tải file học liệu: ' + err.message);
            }
          };
        });

        // Export PDF
        listEl.querySelectorAll('[data-action="export-pdf"]').forEach(b => {
          b.onclick = async () => {
            const lid = b.getAttribute('data-lid');
            showToast('⏳ Đang chuẩn bị tệp PDF...', 'info');
            try {
              modal.remove();
              await loadAndRenderLessonNote(lid);
              await exportCurrentNoteToPdf();
            } catch (err) {
              alert('Lỗi xuất PDF: ' + err.message);
            }
          };
        });
      };

      filterCls.onchange = () => {
        updateChapters(filterCls.value);
        renderList();
      };
      filterChap.onchange = renderList;
      searchInput.oninput = renderList;
      renderList();
    } catch (e) {
      alert('Lỗi tải danh sách bài giảng: ' + e.message);
    }
  }

  // =========================================================
  // 13. UI BARS FOR TEACHER & STUDENT VIEWER (WITH VIDEO & MATERIALS)
  // =========================================================
  function renderViewerBottomToolbar(lesson) {
    let vBar = document.getElementById('qmath-viewer-bottom-bar');
    if (vBar) vBar.remove();

    const canExportPdf = (userRole === 'teacher') || (lesson?.allowStudentPdf !== false);
    const hasVideo = !!lesson?.video;
    const materials = Array.isArray(lesson?.materials) ? lesson.materials : [];

    vBar = document.createElement('div');
    vBar.id = 'qmath-viewer-bottom-bar';
    vBar.style.cssText = 'position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:9999;background:rgba(15,23,42,0.94);backdrop-filter:blur(10px);color:#fff;padding:8px 18px;border-radius:999px;display:flex;align-items:center;gap:10px;box-shadow:0 14px 35px rgba(0,0,0,0.4);font-family:system-ui,sans-serif;font-size:12.5px;border:1px solid rgba(255,255,255,0.12);max-width:92vw;flex-wrap:wrap;justify-content:center;';
    
    vBar.innerHTML = `
      <span style="font-weight:800;color:#38bdf8;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
        📒 ${lesson?.title || 'Bài giảng QMath'}
      </span>
      <span style="opacity:0.3;">|</span>
      <span style="font-size:11.5px;color:#cbd5e1;">${lesson?.pageCount || 1} trang</span>

      ${hasVideo ? `
        <button id="qmath-viewer-video-btn" style="background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;padding:6px 13px;border-radius:999px;font-weight:800;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:5px;box-shadow:0 2px 8px rgba(22,163,74,0.35);">
          <span>▶</span> Xem Video Bài Giảng
        </button>
      ` : ''}

      ${materials.length > 0 ? `
        <div style="position:relative;display:inline-block;">
          <button id="qmath-viewer-mat-btn" style="background:rgba(255,255,255,0.12);color:#fff;border:none;padding:6px 12px;border-radius:999px;font-weight:700;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:5px;">
            <span>📎</span> Học liệu (${materials.length}) ▾
          </button>
          <div id="qmath-viewer-mat-dropdown" style="display:none;position:absolute;bottom:calc(100% + 8px);left:0;background:#1e293b;border:1px solid rgba(255,255,255,0.15);border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.4);padding:8px;min-width:220px;max-width:320px;max-height:200px;overflow-y:auto;flex-direction:column;gap:5px;z-index:99999;">
            ${materials.map(m => `
              <a href="${m.url}" target="_blank" download="${m.name}" style="padding:6px 10px;border-radius:6px;background:rgba(255,255,255,0.06);color:#93c5fd;text-decoration:none;font-size:11.5px;font-weight:700;display:flex;align-items:center;gap:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                <span>📄</span> ${m.name} (${(m.size/1024).toFixed(0)} KB)
              </a>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${canExportPdf ? `
        <button id="qmath-viewer-pdf-btn" style="background:linear-gradient(135deg,#059669,#047857);color:#fff;border:none;padding:6px 13px;border-radius:999px;font-weight:800;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:5px;">
          <span>📄</span> Xuất PDF
        </button>
      ` : ''}

      ${userRole === 'teacher' ? `
        <button id="qmath-viewer-edit-btn" style="background:#2563eb;color:#fff;border:none;padding:6px 13px;border-radius:999px;font-weight:800;font-size:12px;cursor:pointer;">
          ✏️ Bật sửa bài
        </button>
      ` : ''}
    `;
    document.body.appendChild(vBar);

    if (hasVideo) {
      const vidBtn = document.getElementById('qmath-viewer-video-btn');
      if (vidBtn) vidBtn.onclick = () => openVideoPlayerModal(lesson.video, lesson.title);
    }

    if (materials.length > 0) {
      const matBtn = document.getElementById('qmath-viewer-mat-btn');
      const matDd = document.getElementById('qmath-viewer-mat-dropdown');
      if (matBtn && matDd) {
        matBtn.onclick = (e) => {
          e.stopPropagation();
          matDd.style.display = matDd.style.display === 'flex' ? 'none' : 'flex';
        };
        document.addEventListener('click', () => { matDd.style.display = 'none'; }, { once: true });
      }
    }

    const pdfBtn = document.getElementById('qmath-viewer-pdf-btn');
    if (pdfBtn) pdfBtn.onclick = exportCurrentNoteToPdf;

    const editBtn = document.getElementById('qmath-viewer-edit-btn');
    if (editBtn) {
      editBtn.onclick = () => {
        const st = document.getElementById('qmath-student-view-style');
        if (st) st.remove();
        vBar.remove();
      };
    }
  }

  function applyStudentViewerMode() {
    if (document.getElementById('qmath-student-view-style')) return;
    const style = document.createElement('style');
    style.id = 'qmath-student-view-style';
    style.innerHTML = `
      .toolbar, .btn-tool, .draw-tool, .pen-controls, .eraser-btn, .sel-bar {
        display: none !important;
      }
      .page-prev, .page-next, .page-indicator, .zoom-controls {
        display: flex !important;
      }
    `;
    document.head.appendChild(style);
  }

  function initUI() {
    const existing = document.getElementById('qmath-badge-bar');
    if (existing) existing.remove();
    const lock = document.getElementById('qmath-lock-overlay');
    if (lock) lock.remove();

    const isTeacher = userRole === 'teacher' || userRole === 'admin' || userRole === 'super_admin';
    const roleTitle = isTeacher ? '👨‍🏫' : '🎓';
    const badgeBg = isTeacher ? 'background: linear-gradient(135deg,#2563eb,#4f46e5);' : 'background: #0284c7;';
    const displayName = (currentUser?.name || currentUser?.email || 'Thầy Choang').substring(0, 18);

    const bar = document.createElement('div');
    bar.id = 'qmath-badge-bar';
    bar.innerHTML = `
      <div style="position:fixed;bottom:3px;right:10px;z-index:9999;display:flex;align-items:center;gap:5px;font-family:system-ui,-apple-system,sans-serif;font-size:11.5px;flex-wrap:wrap;background:rgba(255,255,255,0.92);backdrop-filter:blur(6px);padding:2px 6px;border-radius:999px;border:1px solid #e2e8f0;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
        ${isTeacher && !activeContext.viewMode ? `
          <div id="qmath-save-status-pill" title="Trạng thái lưu bài giảng và sao lưu tự động" style="background:#f8fafc;color:#64748b;border:1.5px solid #e2e8f0;padding:3px 9px;border-radius:999px;font-weight:700;font-size:11px;display:flex;align-items:center;gap:4px;">
            <span>📝</span> <span>Bảng mới</span>
          </div>
          <button id="qmath-btn-quick-save" title="Lưu nhanh cập nhật vào bài hiện tại (Ctrl+S)" style="display:none;background:linear-gradient(135deg,#f59e0b,#ea580c);border:none;color:#fff;padding:4px 9px;border-radius:999px;font-weight:800;font-size:11px;cursor:pointer;align-items:center;gap:4px;">
            <span>⚡</span> Lưu nhanh
          </button>
          <button id="qmath-btn-backups" title="Khôi phục từ bản nháp tự động lưu trong máy" style="background:#fff;border:1px solid #cbd5e1;color:#334155;padding:3px 8px;border-radius:999px;font-weight:700;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:3px;">
            <span>🛡️</span> Bản nháp
          </button>
        ` : ''}

        ${isTeacher ? `
          <button id="qmath-btn-open-cloud" title="Mở bài giảng đã lưu từ Lớp học" style="background:#fff;border:1px solid #cbd5e1;color:#1e293b;padding:3px 9px;border-radius:999px;font-weight:700;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:3px;">
            <span>📂</span> Mở bài lớp
          </button>
          <button id="qmath-btn-save-cloud" title="Lưu bài giảng vào Lớp học theo Bài (Ctrl+S)" style="background:linear-gradient(135deg,#059669,#10b981);border:none;color:#fff;padding:4px 10px;border-radius:999px;font-weight:800;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:4px;">
            <span>💾</span> Lưu vào Lớp
          </button>
          <button id="qmath-btn-export-pdf" title="Xuất bài giảng hiện tại ra file PDF" style="background:#fff;border:1px solid #cbd5e1;color:#1e293b;padding:3px 9px;border-radius:999px;font-weight:700;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:3px;">
            <span>📄</span> Xuất PDF
          </button>
        ` : `
          <button id="qmath-btn-export-pdf" title="Tải bài giảng ra file PDF" style="background:#fff;border:1px solid #cbd5e1;color:#1e293b;padding:3px 9px;border-radius:999px;font-weight:700;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:3px;">
            <span>📄</span> Tải PDF
          </button>
        `}

        <div style="${badgeBg} color:#fff;padding:3px 9px;border-radius:999px;font-weight:700;font-size:11px;display:flex;align-items:center;gap:4px;">
          <span>${roleTitle}</span>
          <span style="font-weight:600;">${displayName}</span>
        </div>

        <button id="qmath-btn-collapse" title="Thu gọn thanh công cụ QMath LMS" style="background:#fff;border:1px solid #e2e8f0;color:#64748b;padding:2px 6px;border-radius:999px;font-size:11px;cursor:pointer;">
          —
        </button>
        ${!isDesktopOrLocal ? `
        <button id="qmath-btn-logout" title="Đăng xuất" style="background:#fff;border:1px solid #e2e8f0;color:#64748b;padding:2px 6px;border-radius:999px;font-size:11px;cursor:pointer;">
          ✕
        </button>
        ` : ''}
      </div>
    `;
    document.body.appendChild(bar);

    if (!isTeacher || activeContext.viewMode) {
      applyStudentViewerMode();
    }

    const btnSave = document.getElementById('qmath-btn-save-cloud');
    if (btnSave) btnSave.onclick = openSaveToClassModal;

    const btnQuick = document.getElementById('qmath-btn-quick-save');
    if (btnQuick) btnQuick.onclick = quickSaveCurrentLessonToCloud;

    const btnBackups = document.getElementById('qmath-btn-backups');
    if (btnBackups) btnBackups.onclick = openAutoBackupsModal;

    const btnOpen = document.getElementById('qmath-btn-open-cloud');
    if (btnOpen) btnOpen.onclick = openLoadFromClassModal;

    const btnPdf = document.getElementById('qmath-btn-export-pdf');
    if (btnPdf) btnPdf.onclick = exportCurrentNoteToPdf;

    const btnCollapse = document.getElementById('qmath-btn-collapse');
    if (btnCollapse) {
      btnCollapse.onclick = () => {
        bar.style.display = 'none';
        let mini = document.getElementById('qmath-mini-restore');
        if (!mini) {
          mini = document.createElement('button');
          mini.id = 'qmath-mini-restore';
          mini.title = 'Mở thanh công cụ QMath LMS (Lưu bài giảng / Bản nháp)';
          mini.style.cssText = 'position:fixed;bottom:4px;right:10px;z-index:9999;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;border:none;padding:4px 10px;border-radius:999px;font-family:system-ui,sans-serif;font-size:11px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(37,99,235,0.3);';
          mini.textContent = '📐 QMath LMS';
          mini.onclick = () => {
            mini.style.display = 'none';
            bar.style.display = 'block';
          };
          document.body.appendChild(mini);
        } else {
          mini.style.display = 'block';
        }
      };
    }

    const btnLogout = document.getElementById('qmath-btn-logout');
    if (btnLogout) {
      btnLogout.onclick = () => {
        if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản QMath khỏi Bảng vẽ?')) {
          clearSession();
          window.location.reload();
        }
      };
    }

    updateSaveStatusBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', authenticate);
  } else {
    authenticate();
  }
})();
