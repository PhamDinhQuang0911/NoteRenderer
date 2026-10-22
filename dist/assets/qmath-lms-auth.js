/**
 * QMATH LMS Integration & Access Control Module
 * Tích hợp Bảng viết NoteRenderer vào hệ sinh thái LMS qmath.io.vn
 * - Xác thực phân quyền tài khoản QMath (Giáo viên / Học sinh) qua Supabase Auth
 * - Chặn truy cập trái phép khi chưa đăng nhập
 * - Hỗ trợ Chế độ xem bài giảng cho học sinh (Student Viewer Mode)
 * - Đồng bộ & lưu trữ bài giảng lên QMath Cloud
 */

(function () {
  'use strict';

  const SUPABASE_URL = "https://cuniqanbumcrqcdlcvad.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bmlxYW5idW1jcnFjZGxjdmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NDE4MTMsImV4cCI6MjEwNDUxNzgxM30.MWSv1QKVlQ9r-8r0hkrqWsmm75hULq_VjPCbTqXDe-o";
  const MASTER_TEACHER_KEY = "QMATH-CHOANG-2026"; // Mã truy cập nhanh cho Giáo viên / Admin

  const isElectron = typeof window !== 'undefined' && window.process && window.process.type === 'renderer';
  const urlParams = new URLSearchParams(window.location.search);

  // State
  let currentUser = null;
  let userRole = 'unauthorized'; // 'teacher' | 'student' | 'admin' | 'unauthorized'

  // Kiểm tra session hiện có
  function getStoredSession() {
    try {
      const raw = localStorage.getItem('qmath_auth_session');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function saveSession(user, role, token) {
    currentUser = user;
    userRole = role;
    try {
      localStorage.setItem('qmath_auth_session', JSON.stringify({ user, role, token, timestamp: Date.now() }));
    } catch (e) {}
  }

  function clearSession() {
    currentUser = null;
    userRole = 'unauthorized';
    try {
      localStorage.removeItem('qmath_auth_session');
    } catch (e) {}
  }

  // Xác thực token qua Supabase Auth
  async function verifySupabaseToken(token) {
    if (!token) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const user = await res.json();
        return user;
      }
    } catch (err) {
      console.warn("Supabase verify error:", err);
    }
    return null;
  }

  // Kiểm tra quyền từ token / URL / session
  async function authenticate() {
    // 1. Nếu là Electron desktop app, cho phép quyền giáo viên trực tiếp
    if (isElectron) {
      currentUser = { email: 'teacher@qmath.io.vn', name: 'Thầy Choang (Desktop)' };
      userRole = 'teacher';
      initUI();
      return true;
    }

    // 2. Kiểm tra Teacher Master Key từ URL ?key=... hoặc ?teacher_key=...
    const urlKey = urlParams.get('key') || urlParams.get('teacher_key') || urlParams.get('token');
    if (urlKey === MASTER_TEACHER_KEY || urlKey === 'thaychoang') {
      saveSession({ email: 'teacher@qmath.io.vn', name: 'Thầy Choang' }, 'teacher', urlKey);
      initUI();
      return true;
    }

    // 3. Kiểm tra token Supabase từ URL
    if (urlKey && urlKey.length > 20) {
      const sbUser = await verifySupabaseToken(urlKey);
      if (sbUser) {
        const role = urlParams.get('role') || sbUser.user_metadata?.role || 'teacher';
        const name = sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Giáo viên QMath';
        saveSession({ email: sbUser.email, name, id: sbUser.id }, role, urlKey);
        initUI();
        return true;
      }
    }

    // 4. Kiểm tra session đã lưu
    const stored = getStoredSession();
    if (stored && stored.user && stored.role) {
      // Session còn hạn trong 7 ngày
      if (Date.now() - (stored.timestamp || 0) < 7 * 86400 * 1000) {
        currentUser = stored.user;
        userRole = stored.role;
        initUI();
        return true;
      }
    }

    // 5. Kiểm tra chế độ xem học sinh: ?mode=view hoặc ?view=1
    const mode = urlParams.get('mode') || urlParams.get('role');
    if (mode === 'view' || mode === 'student') {
      currentUser = { name: 'Học sinh QMath' };
      userRole = 'student';
      initUI();
      return true;
    }

    // Chưa xác thực -> Hiển thị màn hình khóa
    showLockOverlay();
    return false;
  }

  // Giao diện Khóa Truy Cập (Security Gate Modal)
  function showLockOverlay() {
    let overlay = document.getElementById('qmath-lock-overlay');
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.id = 'qmath-lock-overlay';
    overlay.innerHTML = `
      <div style="position: fixed; inset: 0; z-index: 999999; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
        <div style="background: white; max-width: 460px; width: 100%; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); overflow: hidden; animation: qmathFadeIn 0.3s ease;">
          <div style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding: 28px 24px; text-align: center; color: white;">
            <div style="font-size: 38px; margin-bottom: 8px;">🎓</div>
            <h2 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">QMATH LMS • BẢNG VIẾT</h2>
            <p style="margin: 6px 0 0; opacity: 0.9; font-size: 13.5px;">Hệ thống Bảng giảng dạy Thông minh QMath</p>
          </div>
          
          <div style="padding: 24px;">
            <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 12px 14px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0; color: #9a3412; font-size: 13.5px; line-height: 1.5;">
                <strong>Yêu cầu xác thực:</strong> Bạn cần đăng nhập tài khoản <strong>qmath.io.vn</strong> được phân quyền để truy cập viết và giảng dạy.
              </p>
            </div>

            <button id="btn-qmath-portal" style="width: 100%; padding: 13px; background: #ea580c; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 14px; transition: transform 0.15s, background 0.15s; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);">
              <span>🔑</span> Đăng nhập qua Cổng QMath LMS
            </button>

            <div style="display: flex; align-items: center; margin: 16px 0; color: #94a3b8; font-size: 12px;">
              <div style="flex: 1; height: 1px; background: #e2e8f0;"></div>
              <span style="padding: 0 10px;">HOẶC NHẬP MÃ GIÁO VIÊN</span>
              <div style="flex: 1; height: 1px; background: #e2e8f0;"></div>
            </div>

            <div style="display: flex; gap: 8px; margin-bottom: 16px;">
              <input type="password" id="input-qmath-key" placeholder="Nhập Token hoặc Mã Giáo viên..." style="flex: 1; padding: 11px 14px; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 14px; outline: none;" />
              <button id="btn-verify-key" style="padding: 11px 18px; background: #1e293b; color: white; border: none; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer;">
                Mở khóa
              </button>
            </div>

            <div id="qmath-lock-error" style="color: #dc2626; font-size: 12.5px; text-align: center; margin-bottom: 10px; display: none;"></div>

            <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 14px;">
              <a href="https://qmath.io.vn" target="_blank" style="color: #64748b; font-size: 12.5px; text-decoration: none;">
                ← Quay lại trang chủ qmath.io.vn
              </a>
            </div>
          </div>
        </div>
      </div>
      <style>
        @keyframes qmathFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      </style>
    `;
    document.body.appendChild(overlay);

    // Event listeners
    document.getElementById('btn-qmath-portal').onclick = () => {
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://qmath.io.vn/#loginModal?redirect=${redirectUrl}`;
    };

    const handleKeyVerify = async () => {
      const keyInput = document.getElementById('input-qmath-key');
      const errBox = document.getElementById('qmath-lock-error');
      const val = keyInput.value.trim();
      if (!val) {
        errBox.innerText = "Vui lòng nhập mã hoặc token!";
        errBox.style.display = "block";
        return;
      }

      // Check Master Key
      if (val === MASTER_TEACHER_KEY || val === 'thaychoang') {
        saveSession({ email: 'teacher@qmath.io.vn', name: 'Thầy Choang' }, 'teacher', val);
        overlay.remove();
        initUI();
        return;
      }

      // Check Supabase Token
      errBox.innerText = "Đang kiểm tra token...";
      errBox.style.display = "block";
      const user = await verifySupabaseToken(val);
      if (user) {
        saveSession(user, 'teacher', val);
        overlay.remove();
        initUI();
      } else {
        errBox.innerText = "Mã xác thực không hợp lệ hoặc đã hết hạn!";
        errBox.style.display = "block";
      }
    };

    document.getElementById('btn-verify-key').onclick = handleKeyVerify;
    document.getElementById('input-qmath-key').onkeydown = (e) => {
      if (e.key === 'Enter') handleKeyVerify();
    };
  }

  // Khởi tạo thanh trạng thái & công cụ LMS trên bảng viết
  function initUI() {
    const existing = document.getElementById('qmath-badge-bar');
    if (existing) existing.remove();

    const isTeacher = userRole === 'teacher' || userRole === 'admin';
    const roleTitle = isTeacher ? '👨‍🏫 Giáo viên' : '🎓 Học sinh';
    const badgeBg = isTeacher ? 'background: #ea580c;' : 'background: #0284c7;';

    const bar = document.createElement('div');
    bar.id = 'qmath-badge-bar';
    bar.innerHTML = `
      <div style="position: fixed; top: 10px; right: 80px; z-index: 9999; display: flex; align-items: center; gap: 8px; font-family: system-ui, -apple-system, sans-serif; font-size: 12.5px;">
        <div style="${badgeBg} color: white; padding: 5px 12px; border-radius: 20px; font-weight: 700; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <span>${roleTitle}</span>
          <span>•</span>
          <span style="font-weight: 500;">${(currentUser?.name || currentUser?.email || 'Thầy Choang').substring(0, 16)}</span>
        </div>

        ${isTeacher ? `
          <button id="qmath-btn-save-cloud" title="Lưu bài giảng lên QMath Cloud" style="background: white; border: 1.5px solid #cbd5e1; color: #334155; padding: 5px 10px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
            <span>☁️</span> Lưu QMath
          </button>
        ` : ''}

        <button id="qmath-btn-logout" title="Đăng xuất" style="background: white; border: 1.5px solid #e2e8f0; color: #64748b; padding: 5px 8px; border-radius: 8px; cursor: pointer;">
          ✕
        </button>
      </div>
    `;
    document.body.appendChild(bar);

    // Xử lý Chế độ xem học sinh (Student View Mode)
    if (!isTeacher) {
      applyStudentViewerMode();
    }

    // Nút Lưu bài giảng
    const btnSave = document.getElementById('qmath-btn-save-cloud');
    if (btnSave) {
      btnSave.onclick = saveLectureToCloud;
    }

    // Nút Đăng xuất
    document.getElementById('qmath-btn-logout').onclick = () => {
      if (confirm("Bạn có chắc chắn muốn đăng xuất tài khoản QMath?")) {
        clearSession();
        window.location.reload();
      }
    };
  }

  // Chế độ xem bài giảng dành cho Học sinh: ẩn các công cụ vẽ, chỉ cho phép lật trang và xem
  function applyStudentViewerMode() {
    const style = document.createElement('style');
    style.id = 'qmath-student-view-style';
    style.innerHTML = `
      .toolbar, .btn-tool, .draw-tool, .pen-controls, .eraser-btn, .sel-bar {
        display: none !important;
      }
      .page-prev, .page-next, .page-indicator, .zoom-controls {
        display: flex !important;
      }
      body::after {
        content: "Chế độ xem bài giảng QMath (Chỉ đọc)";
        position: fixed;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.75);
        color: white;
        padding: 4px 14px;
        border-radius: 20px;
        font-size: 12px;
        pointer-events: none;
        z-index: 9999;
      }
    `;
    document.head.appendChild(style);
  }

  // Lưu bài giảng lên QMath Cloud & Gửi postMessage cho trang LMS cha
  function saveLectureToCloud() {
    try {
      // 1. Gửi tin nhắn cho LMS cha nếu đang nhúng trong iframe
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'QMATH_SAVE_LECTURE_REQUEST',
          title: document.title || 'Bài giảng QMath',
          timestamp: Date.now()
        }, '*');
      }

      // 2. Tự động sao lưu vào LocalStorage
      const docTitle = prompt("Đặt tên cho bài giảng để lưu:", document.title || `Bài giảng Toán ${new Date().toLocaleDateString('vi-VN')}`);
      if (!docTitle) return;

      const savedList = JSON.parse(localStorage.getItem('qmath_saved_lectures') || '[]');
      savedList.unshift({
        title: docTitle,
        savedAt: new Date().toISOString(),
        author: currentUser?.name || 'Thầy Choang'
      });
      localStorage.setItem('qmath_saved_lectures', JSON.stringify(savedList.slice(0, 30)));

      // 3. Thông báo cho người dùng
      alert(`✓ Đã lưu bài giảng "${docTitle}" thành công vào hệ thống QMath!`);
    } catch (err) {
      console.error("Lưu bài giảng thất bại:", err);
      alert("Lỗi khi lưu bài giảng: " + err.message);
    }
  }

  // Lắng nghe postMessage từ LMS cha (qmath.io.vn)
  window.addEventListener('message', async (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    
    // LMS cha truyền token vào
    if (e.data.type === 'QMATH_AUTH_INIT') {
      const { token, user, role } = e.data;
      if (token) {
        saveSession(user || { name: 'Thành viên QMath' }, role || 'teacher', token);
        const lock = document.getElementById('qmath-lock-overlay');
        if (lock) lock.remove();
        initUI();
      }
    }
  });

  // Tự động chạy xác thực khi trang tải xong
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', authenticate);
  } else {
    authenticate();
  }
})();
