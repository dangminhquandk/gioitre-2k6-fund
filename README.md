# Fund Tracker Web App (Template) 📊💳

Hệ thống quản lý và theo dõi thu chi / đóng quỹ tự động, tích hợp tạo mã VietQR động theo từng thành viên và xử lý Webhook ngân hàng SePay.

## ✨ Tính năng nổi bật

- **Giao diện hiện đại**: Thiết kế phong cách Glassmorphism, Responsive tối ưu cho cả điện thoại di động và máy tính để bàn.
- **Tạo mã VietQR động**: Tự động sinh mã QR chuyển khoản theo từng thành viên kèm cú pháp nội dung chính xác. Hỗ trợ tải mã QR về máy.
- **Cập nhật tức thì (0ms delay)**: Kết hợp thuật toán Monotonic Merge và bộ nhớ đệm `localStorage` giúp dữ liệu hiển thị ngay lập tức, không phụ thuộc độ trễ mạng.
- **Tự động hóa Webhook**: Endpoint Serverless tiếp nhận thông báo biến động số dư ngân hàng qua SePay và tự động cập nhật trạng thái "Đã đóng".
- **Bộ lọc & Tìm kiếm**: Tìm kiếm thành viên tức thì theo tên, số thứ tự (STT), phân loại Đã đóng / Chưa đóng.
- **Sao chép báo cáo**: Một chạm để sao chép danh sách tiến độ thu quỹ định dạng sẵn để dán vào Zalo / Messenger.

---

## 🛠 Công nghệ sử dụng

- **Frontend**: HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+).
- **Backend**: Node.js Serverless Functions (Vercel).
- **Thanh toán & QR**: VietQR API, SePay Webhook.

---

## 🚀 Hướng dẫn cài đặt & Triển khai

### 1. Cấu hình danh sách thành viên & Tài khoản
Mở các file cấu hình và cập nhật thông tin:
- `api/members.js`: Điền danh sách thành viên và thông tin tài khoản ngân hàng.
- `public/index.html`: Cập nhật cấu hình ngân hàng `BANK_CONFIG`.

### 2. Triển khai lên Vercel
Dự án được tối ưu sẵn cho nền tảng Vercel:

```bash
# Cài đặt Vercel CLI nếu chưa có
npm i -g vercel

# Triển khai dự án
vercel
```

---

## 🔒 Bảo mật & Riêng tư
Kho mã nguồn này là bản mẫu (Template). Toàn bộ danh tính cá nhân, số tài khoản thật và dữ liệu nhạy cảm đã được lược bỏ thành các schema placeholder `{ id, name: "" }`.
