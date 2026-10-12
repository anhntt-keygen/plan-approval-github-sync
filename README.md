# Hệ Thống Quản Lý, Duyệt Kế Hoạch & Đồng Bộ GitHub (Plan Approval & GitHub Sync)

Hệ thống cho phép người dùng quản lý các Kịch bản nghiệp vụ (Scenarios), lập Kế hoạch công việc (WBS Tasks), thực hiện quy trình duyệt kế hoạch (Approve Plan) và giả lập đẩy mã nguồn tự động lên kho lưu trữ GitHub (GitHub Sync Mock).

## 1. Kịch Bản Nghiệp Vụ [SC-01]
1. **Khởi tạo**: Người dùng tạo mới một Kế hoạch (Plan) gồm các thông tin cơ bản và danh sách các Task ID (`[TASK-01]`, `[TASK-02]`,...).
2. **Thiết lập trạng thái**: Kế hoạch mới tạo sẽ ở trạng thái `Draft` (Nháp).
3. **Phê duyệt (Approval)**: Quản trị viên hoặc Người duyệt tiến hành kiểm tra và nhấn "Phê duyệt". Trạng thái chuyển sang `Approved`.
4. **Đồng bộ GitHub (GitHub Sync)**: Sau khi được duyệt, hệ thống kích hoạt tiến trình đóng gói mã nguồn tương ứng với các Task và đẩy lên GitHub (Giả lập API GitHub Commit/Push). Trạng thái chuyển sang `Synced`.

## 2. Kế Hoạch Thực Hiện (WBS)
- **[TASK-01]**: Thiết lập cấu trúc thư mục dự án, cấu hình `package.json` và cài đặt các thư viện cần thiết (`express`, `cors`, `body-parser`).
- **[TASK-02]**: Xây dựng RESTful API Backend (`server.js`) quản lý danh sách kế hoạch, xử lý logic duyệt và giả lập đồng bộ GitHub.
- **[TASK-03]**: Thiết kế giao diện Frontend (`index.html`, `style.css`) hiện đại, trực quan, hỗ trợ Responsive.
- **[TASK-04]**: Viết mã nguồn xử lý Frontend (`app.js`) kết nối API, hiển thị danh sách, thêm mới kế hoạch, duyệt và đồng bộ GitHub theo thời gian thực.

## 3. Cấu Trúc Thư Mục Dự Án
```text
project/
├── README.md
├── package.json
├── server.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── tests/
    └── app.spec.mjs
```

## 4. Hướng Dẫn Cài Đặt & Khởi Chạy

### Bước 1: Cài đặt các thư viện phụ thuộc
Mở terminal tại thư mục gốc của dự án và chạy lệnh:
```bash
npm install
```

### Bước 2: Khởi chạy Server Backend
Chạy lệnh sau để khởi động server Node.js:
```bash
npm start
```
Server sẽ chạy tại địa chỉ: `http://localhost:3000`

### Bước 3: Trải nghiệm ứng dụng
Mở trình duyệt web và truy cập vào địa chỉ:
```text
http://localhost:3000
```

### Bước 4: Chạy thử nghiệm tự động (Playwright Test)
Để chạy bộ test tự động Playwright:
```bash
npx playwright test
```
```

---