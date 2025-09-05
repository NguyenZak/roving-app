# Hướng Dẫn Cấu Hình Email - Roving Travel

## Tổng Quan
Hệ thống email tự động sử dụng Nodemailer để gửi email xác nhận cho khách hàng và thông báo cho admin khi có form liên hệ mới.

## Tính Năng
- ✅ Email xác nhận tự động cho khách hàng
- ✅ Email thông báo cho admin
- ✅ Template email đẹp mắt và chuyên nghiệp
- ✅ Responsive design cho mobile
- ✅ Hỗ trợ tiếng Việt
- ✅ Component test email trong admin panel

## Cấu Hình Email

### 1. Tạo App Password cho Gmail
1. Đăng nhập vào tài khoản Google
2. Vào **Bảo mật** > **Xác minh 2 bước** (bật nếu chưa bật)
3. Vào **Mật khẩu ứng dụng**
4. Tạo mật khẩu mới cho "Mail"
5. Copy mật khẩu này (16 ký tự)

### 2. Cấu Hình Biến Môi Trường
Tạo file `.env.local` trong thư mục gốc của project:

```bash
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
ADMIN_EMAIL=admin@rovingtravel.com

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/roving_travel"

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 3. Cấu Hình SMTP Khác (Tùy Chọn)
Nếu không dùng Gmail, có thể dùng SMTP trực tiếp:

```bash
# SMTP Configuration
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
EMAIL_USER=your-email@your-provider.com
EMAIL_PASS=your-password
```

## Cách Hoạt Động

### 1. Khi Khách Hàng Gửi Form
1. Form được gửi đến `/api/contact`
2. Dữ liệu được lưu vào database
3. **Email xác nhận** được gửi đến khách hàng
4. **Email thông báo** được gửi đến admin

### 2. Email Xác Nhận Cho Khách Hàng
- Xác nhận đã nhận thông tin
- Hiển thị thông tin đã gửi
- Giải thích các bước tiếp theo
- Thông tin liên hệ khẩn cấp
- Thiết kế đẹp mắt và chuyên nghiệp

### 3. Email Thông Báo Cho Admin
- Thông báo có khách hàng mới
- Hiển thị thông tin chi tiết
- Nút hành động nhanh (email, WhatsApp)
- Link đến admin panel
- Ưu tiên cao để xử lý

## Test Hệ Thống Email

### 1. Sử Dụng Component Test
1. Vào trang **Admin > Messages**
2. Nhấn nút **"Hiện Test Email"**
3. Điền thông tin test
4. Nhấn **"Gửi Email Test"**
5. Kiểm tra hộp thư

### 2. Test API Trực Tiếp
```bash
curl -X POST http://localhost:3000/api/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "whatsapp": "+84 123 456 789",
    "quantity": 2,
    "date": "2024-12-25",
    "message": "Test message"
  }'
```

## Template Email

### 1. Email Khách Hàng
- **Header**: Gradient xanh dương với logo
- **Thông tin**: Card hiển thị thông tin đã gửi
- **Tin nhắn**: Box hiển thị tin nhắn (nếu có)
- **Các bước**: Giải thích quy trình tiếp theo
- **Liên hệ**: Thông tin liên hệ khẩn cấp
- **Footer**: Thông tin công ty và mạng xã hội

### 2. Email Admin
- **Header**: Gradient đỏ với cảnh báo
- **Cảnh báo**: Box ưu tiên cao
- **Thông tin**: Card thông tin khách hàng
- **Tin nhắn**: Box tin nhắn từ khách hàng
- **Hành động**: Nút email, WhatsApp, xem chi tiết
- **Footer**: Thông tin admin panel

## Xử Lý Lỗi

### 1. Lỗi Xác Thực
```
Error: Invalid login: 535 5.7.8 Username and Password not accepted
```
**Giải pháp**: Kiểm tra lại app password và tài khoản Gmail

### 2. Lỗi SMTP
```
Error: connect ECONNREFUSED 127.0.0.1:587
```
**Giải pháp**: Kiểm tra cấu hình SMTP_HOST và SMTP_PORT

### 3. Lỗi Rate Limit
```
Error: 550 5.7.1 Too many requests
```
**Giải pháp**: Đợi một lúc rồi thử lại

## Bảo Mật

### 1. Biến Môi Trường
- Không commit file `.env.local` vào git
- Sử dụng app password thay vì mật khẩu chính
- Bảo vệ file `.env.local` trên server

### 2. Xác Thực
- Sử dụng OAuth2 nếu có thể
- Giới hạn quyền truy cập email
- Monitor log email để phát hiện bất thường

## Tùy Chỉnh

### 1. Thay Đổi Template
- Chỉnh sửa file `src/lib/email.ts`
- Thay đổi HTML và CSS trong template
- Cập nhật nội dung và branding

### 2. Thêm Loại Email
- Tạo function mới trong `email.ts`
- Thêm API route mới
- Tích hợp vào workflow

### 3. Thay Đổi Cấu Hình
- Chỉnh sửa transporter trong `email.ts`
- Thay đổi biến môi trường
- Restart server sau khi thay đổi

## Monitoring

### 1. Log Email
- Tất cả email được log trong console
- Kiểm tra `messageId` để track
- Monitor lỗi gửi email

### 2. Kiểm Tra Trạng Thái
- Sử dụng component test để verify
- Kiểm tra hộp thư spam
- Test với nhiều email khác nhau

## Troubleshooting

### 1. Email Không Đến
- Kiểm tra spam folder
- Verify cấu hình biến môi trường
- Test với email khác
- Kiểm tra log server

### 2. Template Không Hiển Thị Đúng
- Kiểm tra HTML syntax
- Test trên nhiều email client
- Verify encoding UTF-8
- Kiểm tra CSS inline

### 3. Performance
- Email được gửi async (non-blocking)
- Sử dụng connection pooling
- Monitor thời gian gửi
- Optimize template size

## Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra log server
2. Verify cấu hình biến môi trường
3. Test với component test
4. Kiểm tra quyền Gmail/SMTP
5. Liên hệ support team

---

**Lưu ý**: Đảm bảo tuân thủ chính sách email của nhà cung cấp và không spam email.
