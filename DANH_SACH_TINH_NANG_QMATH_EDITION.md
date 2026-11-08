# BẢNG ĐỐI CHIẾU & ĐẶC TẢ TÍNH NĂNG ĐỘC QUYỀN
# NOTERENDERER - QMATH EDITION

> **MỤC ĐÍCH TÀI LIỆU:**  
> Tài liệu này liệt kê chi tiết toàn bộ các tính năng, cải tiến kỹ thuật, bản vá tối ưu và cơ chế tích hợp độc quyền của phiên bản **NoteRenderer - QMath Edition** so với **Bản gốc NoteRenderer (Official)**.  
> ⚠️ **QUY TẮC BẢO LƯU BẮT BUỘC:** Trong bất kỳ lần cập nhật mã nguồn nào trong tương lai (kể cả khi nâng cấp lên các phiên bản 0.7.x, 0.8.x...), **tuyệt đối không được làm mất hoặc ghi đè** bất kỳ tính năng nào trong danh sách này.

---

## 1. BẢNG SO SÁNH TỔNG QUAN GIỮA HAI PHIÊN BẢN

| Nhóm chức năng | Bản gốc (NoteRenderer Official) | Bản QMath Edition (Hiện tại) | Trạng thái bảo lưu |
| :--- | :--- | :--- | :---: |
| **Bản quyền & Kích hoạt** | Kiểm tra key online, giới hạn dùng thử, popup cảnh báo hết hạn, crash nếu sửa ASAR. | **Mở khóa vĩnh viễn (Permanent Unlock)**, vô hiệu hóa toàn bộ popup cảnh báo, patch mã băm SHA-256 header. | 🔴 Bắt buộc |
| **Máy tính bỏ túi** | Máy tính đơn giản, giao diện phẳng tối giản. | **Bản Desktop:** Hệ thống Đa máy tính (Multi-Calculator Hub) tích hợp sẵn 6 dòng máy phổ biến: Casio fx-880BTG, Casio fx-580VN X, Flexio Fx799VN, Vinacal 570ES Plus II, Vinacal 570ES Plus, Casio fx-570VN Plus. **Mặc định tự động kích hoạt chế độ Luôn nổi (Always-on-Top)** trên bảng viết, chuột phải vào nút Máy tính để chọn đổi máy tùy ý.<br>**Bản Web:** Máy tính ảo tích hợp skin Casio LCD dot-matrix, giải PT bậc 2 & Hệ PT. | 🔴 Bắt buộc |
| **Công cụ Đổ màu** | Chỉ có tô vùng kín hoặc tô thủ công riêng biệt trong menu con. | **Tô màu thông minh hợp nhất (Smart Unified Fill)**: Tự động nhận diện 1-chạm (vùng kín $\to$ tự động, đầu mút $\to$ thủ công), snapping đỉnh hình khối, xem trước Live Preview. | 🔴 Bắt buộc |
| **Phím tắt nhanh** | Phím mặc định: R (Ruler), C (Circle)... | **Bộ phím tắt tối ưu giáo viên**: <kbd>I</kbd> (Tròn), <kbd>R</kbd> (Chữ nhật), <kbd>M</kbd> (Highlight), <kbd>O</kbd> (Laser). | 🔴 Bắt buộc |
| **Thao tác Thước kẻ** | Bắt buộc mở menu công cụ để tắt thước. | **Nút tắt nhanh màu đỏ `[✕]`** gắn trực tiếp ở đầu thước thẳng, thước đo độ, êke. | 🔴 Bắt buộc |
| **Font chữ Viết tay** | Font Patrick Hand rụng dấu tiếng Việt (chữ có dấu biến thành font hệ thống). | **Khắc phục 100% lỗi font**: Bổ sung đầy đủ 3 dải unicode-range (`vietnamese`, `latin-ext`, `latin`), hiển thị 146/146 ký tự tiếng Việt mượt mà. | 🔴 Bắt buộc |
| **Trải hình khối 3D** | Khi trải hình bị nghiêng góc 3D, thanh trượt unfold bị ẩn. | **Nội suy góc nhìn trực diện $0^\circ$ mượt mà**, cố định trọng tâm hình học (Centroid Anchor), thanh trượt Mức trải hình luôn hiển thị sẵn. | 🔴 Bắt buộc |
| **Macro Toán học** | Chỉ hỗ trợ LaTeX quốc tế cơ bản. | **Bổ sung macro SGK Việt Nam**: `\heva{...}` (hệ phương trình), `\hoac{...}` (tuyển các trường hợp). | 🔴 Bắt buộc |
| **Trợ lý AI Toán học** | Không có. | **AI Math Assistant**: Khoanh nét viết tay $\to$ tự động biến thành Đồ thị hàm số hoặc Công thức LaTeX vector, tích hợp Gemini Vision. | 🔴 Bắt buộc |
| **Đồng bộ QMath LMS** | Không có kết nối LMS. | **Tích hợp sâu QMath LMS**: Xác thực Supabase, phân quyền Giáo viên/Học sinh, Cloud Hub quản lý bài học theo lớp, player video bài giảng. | 🔴 Bắt buộc |
| **Lưu trữ & Chống mất bài** | Lưu file cục bộ đơn thuần. | **Hệ thống an toàn 4 lớp**: Auto-Backup IndexedDB mỗi 5s, cảnh báo tắt tab, lưu đám mây R2 chống trùng lặp SHA-256 WebP siêu nhẹ, xuất PDF theo yêu cầu. | 🔴 Bắt buộc |
| **Tối ưu phần cứng & Nét viết** | Cài đặt mặc định của Electron. | **Cờ GPU tăng tốc**: Bật `enable-gpu-rasterization`, `enable-zero-copy`, `disable-gpu-sandbox`, tích hợp **Lag Probe** đo độ trễ nét vẽ thời gian thực. | 🔴 Bắt buộc |
| **Tính năng mới 0.7.0** | Chỉ có ở bản 0.7.0 gốc. | **Tích hợp trọn vẹn**: `formulaSheet` (Sổ tay Lí-Hóa-Sinh), `tikzImage` (Soạn TikZ), `tabletCursor` (Ẩn/hiện con trỏ bút), `penStats` (Số đo FPS/latency), `scratchErase` (Viết nguệch ngoạc để xóa), Thanh công cụ 4 hướng. | 🔴 Bắt buộc |

---

## 2. CHI TIẾT TỪNG PHÂN HỆ TÍNH NĂNG ĐẶC QUYỀN

### Phân hệ 1: Hệ thống Máy tính Khoa học Đa năng (Multi-Calculator Hub)
* **Trên Bản Desktop (NoteRenderer Desktop v0.7.5):**
  - Đóng gói sẵn trọn bộ 6 máy tính bỏ túi chuyên dụng cho giáo dục tại `resources/tools/`:
    1. **Casio ClassWiz fx-880BTG** (Mặc định): Phiên bản mới nhất, tự động luôn nổi trên bảng.
    2. **Casio ClassWiz fx-580VN X**: Giả lập tiếng Việt chuẩn GDPT.
    3. **Flexio Fx799VN**: Giả lập Flexio thế hệ mới tốc độ cao, hỗ trợ vẽ đồ thị & tính năng mới.
    4. **VINACAL 570ES PLUS II**: Giả lập Vinacal thế hệ mới tốc độ cao.
    5. **VINACAL 570ES PLUS**: Giả lập Vinacal cổ điển.
    6. **Casio fx-570VN PLUS**: Giả lập Casio 570 truyền thống.
  - **Mặc định tự động Luôn nổi (Always-on-Top):** Ngay khi mở máy tính, hệ thống tự động ghim cửa sổ ở chế độ `HWND_TOPMOST` nổi cố định trên bảng viết mà giáo viên không cần phải bấm nút ghim thủ công.
  - **Bảng chọn máy tính (Calculator Picker):** Nhấp chuột phải vào biểu tượng Máy tính trên thanh công cụ để mở giao diện chuyển đổi máy tính trong 1 cú nhấp chuột (ghi nhớ lựa chọn vĩnh viễn).
* **Trên Bản Web (NoteRenderer Web / Browser):**
  - Hình ảnh skin bàn phím Casio độ phân giải cao (`casio_580_skin.png`).
  - Màn hình hiển thị tinh thể lỏng LCD dot-matrix chuyên dụng, loại bỏ hoàn toàn các ký tự bóng mờ.
  - Menu Ứng dụng Toán học ($4 \times 2$), Bộ giải PT bậc 2 (kèm cực trị Parabol) & Hệ PT 2 ẩn.

---

### Phân hệ 2: Cơ Chế Tô Màu Thông Minh Hợp Nhất (Smart Unified Fill)
* **Nhận diện Thông minh 2-trong-1 (Mặc định: Tự động thông minh):**
  - **Khi bấm vào vùng không gian kín:** Tự động phát hiện đường biên bao quanh và thực hiện tô tự động tức thời (Flood fill) chỉ với 1 chạm duy nhất.
  - **Khi bấm vào đầu mút điểm / đỉnh:** Tự động chuyển sang chế độ tô thủ công theo đầu mút / đỉnh khép kín mà không cần mở menu dropdown.
* **Bắt dính đầu mút thông minh (Smart Snapping):**
  - Bắt dính chính xác vào đầu mút các nét vẽ tay (`strokes`).
  - Bắt dính vào các đỉnh hình học phẳng (tam giác, tứ giác, đa giác, các góc khung chữ nhật).
  - Bắt dính vào các điểm đối tượng hình học (`geo points`).
* **Hiển thị trực quan quá trình chọn đỉnh:**
  - **Điểm 1 (Gốc):** Vòng tròn màu xanh lá cây đậm có số `1` nổi bật.
  - **Các điểm tiếp theo (2, 3...):** Chấm tròn màu cam đánh số thứ tự nối với nhau bằng đường nét liền màu cam.
  - **Xem trước màu tô (Live Preview):** Khi chọn từ 3 điểm trở lên, toàn bộ miền đa giác bên trong lập tức được phủ màu bán trong suốt (~35% độ mờ, không che nét chữ) kèm nhãn hướng dẫn `"✓ Chạm để tô"`.
  - **Khép kín & Hoàn tất:** Chạm lại vào Điểm số 1, chạm đúp điểm cuối, hoặc nhấn phím <kbd>Enter</kbd>.

---

### Phân hệ 3: Tối Ưu Hóa Thao Tác & Trải Nghiệm Giáo Viên
* **Bộ Phím Tắt Tiện Dụng:**
  - <kbd>I</kbd>: Vẽ hình tròn (`circle`).
  - <kbd>R</kbd>: Vẽ hình chữ nhật (`rect`).
  - <kbd>M</kbd>: Bút highlight (`highlighter`).
  - <kbd>O</kbd>: Bút laser trình chiếu (`laser`).
  - Nhãn tooltip giao diện tiếng Việt tương ứng: *"Hình tròn (I)"*, *"Hình chữ nhật (R)"*, *"Bút highlight (M)"*, *"Bút laser (O)"*.
* **Nút Tắt Nhanh Thước Kẻ `[✕]`:**
  - Nút tròn màu đỏ chữ `✕` trắng gắn ở góc đầu của các công cụ thước (Thước thẳng, Thước đo độ, Thước êke).
  - 1 chạm để đóng ngay công cụ thước mà không cần bấm lại vào thanh menu.
* **Cải tiến Bút Highlight:**
  - Lưu nhanh 3 ô màu chính (Quick Swatches) hiển thị trực tiếp trên thanh công cụ.
  - Đồng bộ thanh trượt kích cỡ nét bút cho bút highlight.
  - Chế độ hòa trộn màu `multiply` chất lượng cao, không làm đè mất nét chữ hoặc công thức phía dưới.

---

### Phân hệ 4: Bộ Phông Chữ & Đồ Họa Toán Học Chuẩn Việt Nam
* **Khắc Phục Toàn Diện Font Viết Tay Patrick Hand:**
  - Nhúng đầy đủ 3 phân tập phông Google Fonts:
    1. `vietnamese`: Bao phủ toàn bộ dải ký tự dấu thanh, móc, mũ tiếng Việt (`U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9...`).
    2. `latin-ext`: Ký tự Latinh mở rộng.
    3. `latin`: Ký tự Latinh cơ bản.
  - Đã nạp trước bộ font (`document.fonts.load`). Đảm bảo 146/146 ký tự tiếng Việt hiển thị đồng nhất nét viết tay mềm mại, không bao giờ bị nhảy về font hệ thống Arial.
* **Động Cơ Trải Hình 3D Khối Tròn Xoay Mượt Mà:**
  - Khối nón, nón cụt, hình trụ khi bấm "Trải hình" sẽ nội suy góc nhìn từ góc phối cảnh SGK ($72.5^\circ$) về góc phẳng trực diện ($0^\circ$).
  - Giữ cố định trọng tâm hình học (Centroid Anchor) giúp hình mở phẳng ngay tại vị trí ban đầu trên trang giấy.
  - Thanh trượt `Mức trải hình` luôn hiển thị sẵn để giáo viên kéo quan sát từng bước liên tục.
* **Macro Toán Học SGK Việt Nam:**
  - `\heva{...}`: Tạo hệ phương trình với dấu ngoặc nhọn bên trái.
  - `\hoac{...}`: Tạo tuyển các trường hợp với dấu ngoặc vuông bên trái.

---

### Phân hệ 5: Trợ Lý Trí Tuệ Nhân Tạo (AI Math Assistant)
* **Khai báo mã nguồn:** Tích hợp trong `dist/assets/ai-math-assistant.js` và nạp tự động qua thẻ `<script>` trong `index.html`.
* **Cơ chế hoạt động:**
  - Khi giáo viên khoanh vùng nét viết tay trên bảng vẽ, nút bấm nổi **"AI Toán học"** sẽ hiển thị.
  - **Biến thành đồ thị hàm số:** Tự động phát hiện phương trình hàm số $y=f(x)$ từ nét vẽ tay và chèn công cụ đồ thị tọa độ chuẩn xác.
  - **Biến thành công thức toán (LaTeX):** Nhận diện công thức viết tay phức tạp (tích phân, ma trận, phân số, giới hạn) và render thành công thức MathJax vector sắc nét.
  - **Tích hợp Gemini Vision Key:** Cho phép giáo viên cấu hình API key cá nhân để AI nhận diện siêu tốc.

---

### Phân hệ 6: Hệ Sinh Thái QMath LMS & Cơ Chế Chống Mất Bài 4 Lớp
* **Khai báo mã nguồn:** Tích hợp trong `dist/assets/qmath-lms-auth.js` (~3.000 dòng mã logic nghiệp vụ).
* **Bảo mật & Phân quyền:**
  - Tích hợp Supabase Auth của dự án `qmath.io.vn`.
  - Phân quyền: Giáo viên (Toàn quyền soạn giảng, lưu đám mây) / Học sinh (Chế độ xem bài, lật trang, xoay hình 3D, không sửa bài).
* **Hệ thống An Toàn 4 Lớp Chống Mất Bài Giảng:**
  1. *Lớp 1:* Huy hiệu trạng thái "Đã lưu" / "Chưa lưu" hiển thị trực tiếp trên thanh công cụ + phím tắt lưu nhanh <kbd>Ctrl</kbd>+<kbd>S</kbd>.
  2. *Lớp 2:* Cảnh báo xác nhận khi tắt tab hoặc đóng trình duyệt (`beforeunload`) nếu còn nét viết chưa lưu.
  3. *Lớp 3:* Tự động sao lưu ngầm vào ổ cứng máy tính qua **IndexedDB Auto-Backup mỗi 5 giây**, chống mất bài khi mất điện hoặc tắt máy đột ngột.
  4. *Lớp 4:* Tự động phát hiện và hiển thị hộp thoại khôi phục bài viết dở khi mở lại phần mềm.
* **Động cơ Lưu trữ Đám mây R2 Deduplication:**
  - Tách hình ảnh đính kèm sang định dạng WebP lưu theo mã băm SHA-256 (chống lưu trùng lặp 100%).
  - Dữ liệu bài giảng chỉ lưu file nét vẽ vector `.nrn` (dung lượng siêu nhẹ chỉ 15–40 KB).
  - Hỗ trợ xuất file PDF tức thời theo yêu cầu (On-demand PDF) mà không tốn dung lượng lưu trữ trên máy chủ.
* **Smart Classroom & Lesson Hub:**
  - Quản lý cây thư mục bài giảng theo Khóa học / Lớp học / Buổi học.
  - Tích hợp video player bài giảng trực tuyến và tài liệu đính kèm ngay trong không gian viết bảng.

---

### Phân hệ 7: Kiến Trúc Backend Desktop Electron & Bản Quyền Vĩnh Viễn
* **Cấu hình Tối ưu Phần cứng & Tránh Giật Lag (trong `electron/main.cjs`):**
  - `disable-gpu-sandbox`
  - `disable-web-security`
  - `allow-running-insecure-content`
  - `ignore-gpu-blocklist`
  - `enable-gpu-rasterization`
  - `enable-zero-copy`
* **Mở Khóa Bản Quyền Vĩnh Viễn (Permanent Bypass):**
  - Hook module `guard.jsc`: `guard.entitled = () => true`, `guard.integrity = () => true`, `guard.stall = () => {}`.
  - Hook module `license.jsc`: `lic.isActivated = () => true`, `lic.status` trả về máy đã kích hoạt trọn đời.
  - Vô hiệu hóa toàn bộ `Notification` hệ thống cảnh báo dùng thử / hết hạn key.
  - Hook các kênh IPC: `"license-status"`, `"license-activate"`, `"license-trial"`.
* **Bộ Giám Sát Độ Mượt (Lag Probe):**
  - Chạy ngầm trong `main.cjs`, đo độ trễ vòng lặp chính theo chu kỳ 20ms và ghi nhận cảnh báo lag vào `C:\Users\ADMIN\Desktop\nr_lag.log` khi có hiện tượng khựng khung hình.
* **Patch Mã Băm Toàn Vẹn SHA-256:**
  - File thực thi `NoteRenderer.exe` kiểm tra mã băm SHA-256 của header file `app.asar` tại offset `187687791`. Mỗi khi đóng gói lại `app.asar`, hash mới phải được ghi đè chính xác vào offset này để ứng dụng khởi động không bị crash.

---

### Phân hệ 8: Các Tính Năng Thừa Hưởng Từ Bản Upstream 0.7.0
1. **`formulaSheet` (Sổ tay Công thức Tự nhiên):** Bộ tra cứu công thức Lí, Hóa, Sinh phân theo Lớp và Chương (sách Kết nối tri thức).
2. **`tikzImage` (Trình biên tập TikZ):** Soạn thảo mã TikZ và chèn hình vẽ vector trực tiếp lên bảng.
3. **`tabletCursor` (Con trỏ Bút vẽ Bảng điện tử):** Bật/tắt con trỏ bút khi tì viết và rê bút trên bảng vẽ Wacom / Huion.
4. **`penStats` (Bảng Đo Số Đo Bút):** Theo dõi độ trễ nét vẽ (ms) và tốc độ FPS.
5. **`scratchErase` (Cử chỉ Xóa nguệch ngoạc):** Vẽ ziczac đè lên nét viết để tự động xóa nét vẽ đó.
6. **`barTop`, `barBottom`, `barLeft`, `barRight`:** Tùy biến thanh công cụ linh hoạt theo 4 hướng màn hình.

---

## 3. CHECKLIST KỸ THUẬT KHI NÂNG CẤP PHẦN MỀM TRONG TƯƠNG LAI

Khi có bản cập nhật mới (ví dụ từ nhà phát triển gốc NoteRenderer):

- [ ] **1. File `electron/main.cjs`:**
  - Giữ nguyên các cờ tăng tốc GPU (`enable-gpu-rasterization`, `enable-zero-copy`).
  - Giữ nguyên các đoạn mã hook bypass `guard.jsc`, `license.jsc` và `ipcMain.handle("license-*")`.
  - Giữ nguyên cơ chế tắt `Notification` thông báo bản quyền.
  - Giữ nguyên bộ đo độ trễ `Lag Probe`.

- [ ] **2. File `dist/index.html`:**
  - Thẻ `<title>` đặt tên nhận diện phiên bản (ví dụ: `NoteRenderer - QMath Edition`).
  - Nạp 2 script bổ sung:
    ```html
    <script type="module" crossorigin src="./assets/ai-math-assistant.js"></script>
    <script type="module" crossorigin src="./assets/qmath-lms-auth.js"></script>
    ```
  - Cấu hình CSP cho phép kết nối Supabase, Cloudflare, R2, Telegram và Gemini API.
  - Bộ thẻ style chống giật / chống cuộn trang (`overscroll-behavior: none !important`, `touch-action: none !important`).
  - Listener chặn cử chỉ zoom của trình duyệt (`gesturestart/change/end`).

- [ ] **3. Thư mục `dist/assets/`:**
  - Bảo lưu tệp ảnh skin máy tính: `casio_580_skin.png`.
  - Bảo lưu 2 tệp script hệ sinh thái: `ai-math-assistant.js` và `qmath-lms-auth.js`.
  - Bảo lưu các font chữ Việt hóa: `PatrickHand-vietnamese-*.woff2`, `PatrickHand-latin-*.woff2`.

- [ ] **4. Mã nguồn Bundle JavaScript chính (`dist/assets/index-*.js`):**
  - Patch 1: Bảng phím tắt bàn phím (<kbd>I</kbd> circle, <kbd>R</kbd> rect, <kbd>M</kbd> highlighter, <kbd>O</kbd> laser).
  - Patch 2: Nút tắt nhanh thước kẻ `[✕]`.
  - Patch 3: Giao diện và giải thuật Casio fx-580VN X (LCD, menu $4\times 2$, giải PT bậc 2 & Hệ PT 2 ẩn).
  - Patch 4: Động cơ Tô màu thông minh hợp nhất (Smart Unified Fill).
  - Patch 5: Khai báo macro tiếng Việt `\heva` và `\hoac`.
  - Patch 6: Động cơ trải hình 3D mượt mà kèm Centroid Anchor và thanh trượt hiển thị sẵn.

- [ ] **5. Đóng gói ASAR & Patch File Thực Thi:**
  - Đóng gói thư mục bằng `npx asar pack . resources/app.asar`.
  - Tính mã băm SHA-256 của header `app.asar`.
  - Ghi đè chuỗi hash hex 64 ký tự vào offset `187687791` trong `NoteRenderer.exe`.
