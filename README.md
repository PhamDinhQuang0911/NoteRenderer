# NoteRenderer - Dự án mã nguồn đã khôi phục thành công

Dự án này đã được trích xuất và khôi phục hoàn chỉnh từ file cài đặt gốc `NoteRenderer-Setup-0.1.9.exe`.

## 1. Cấu trúc thư mục dự án

```text
NoteRenderer_Source/
├── dist/                          # Toàn bộ giao diện người dùng (Frontend)
│   ├── assets/
│   │   ├── index-DfN6Vfks.js      # Mã nguồn chính (React) - Đã được format & unminify
│   │   └── index-9Fx6VmpB.css     # Toàn bộ stylesheet
│   ├── fonts/                     # Các bộ font toán học KaTeX và AxMath
│   └── index.html                 # Trang HTML chính của ứng dụng
├── electron/                      # Mã nguồn Backend Desktop (Electron)
│   ├── main.cjs                   # Quản lý vòng đời ứng dụng, cửa sổ và IPC
│   ├── preload.cjs                # Context bridge an toàn giữa Electron và UI
│   ├── files.cjs                  # Xử lý lưu/mở sổ .nrn, xuất PNG, xuất PDF
│   ├── formula.cjs                # Bộ render công thức toán học MathJax
│   └── legacy_jsc_backup/         # Thư mục lưu trữ các file bytecode cũ (.jsc)
├── node_modules/                  # Các thư viện phụ thuộc đã có sẵn
├── package.json                   # Cấu hình dự án & dependencies
├── Chay_Phan_Mem.bat              # Chạy trực tiếp ứng dụng không cần cài đặt
└── Build_Cai_Dat.bat              # Đóng gói ra bản cài đặt mới (.exe)
```

## 2. Cách chạy ứng dụng trên máy này

* **Cách 1 (Nhanh nhất):** Ra ngoài màn hình Desktop, bấm đúp vào file **`Chay_NoteRenderer.bat`**.
* **Cách 2:** Mở thư mục này, bấm đúp vào **`Chay_Phan_Mem.bat`**.
* **Cách 3 (Bằng dòng lệnh):**
  ```bash
  cd "C:\Users\ADMIN\Desktop\NoteRenderer_Source"
  npx electron .
  ```

## 3. Cách đóng gói lại thành file cài đặt .exe mới

Nếu bạn muốn tạo file bộ cài `.exe` mới (Installer hoặc Portable) để chia sẻ hoặc cài đặt:
1. Bấm đúp vào file **`Build_Cai_Dat.bat`**.
2. Hoặc chạy lệnh trong terminal:
   ```bash
   npx electron-builder --win portable --win nsis
   ```
3. Sau khi đóng gói hoàn tất, file `.exe` mới sẽ nằm trong thư mục `dist-electron/`.

## 4. Những cải tiến sau khi khôi phục

1. **Loại bỏ ràng buộc phần cứng cũ:** Toàn bộ cơ chế khóa HWID cũ trên laptop đã mất được gỡ bỏ trong backend mới. Phần mềm luôn ở trạng thái kích hoạt đầy đủ (Activated) cho bạn.
2. **Mã nguồn trong sáng:** Không còn phụ thuộc vào Bytenode (`.jsc`), toàn bộ backend đều là JavaScript chuẩn (`.cjs`), dễ dàng đọc, bảo trì và thêm tính năng mới.
3. **Mã giao diện React:** Đã được format và làm đẹp (unminify/beautify) bằng Prettier để bạn thuận tiện đọc lại toàn bộ component và thuật toán render.
