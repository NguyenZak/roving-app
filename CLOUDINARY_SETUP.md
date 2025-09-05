# Cấu hình Cloudinary cho Travel Web

## Bước 1: Tạo tài khoản Cloudinary
1. Truy cập [cloudinary.com](https://cloudinary.com)
2. Đăng ký tài khoản miễn phí
3. Sau khi đăng nhập, lấy thông tin từ Dashboard

## Bước 2: Cấu hình biến môi trường
Tạo file `.env.local` trong thư mục gốc của project với nội dung:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dfkaxmmso
CLOUDINARY_API_KEY=686472367374311
CLOUDINARY_API_SECRET=OkuMIhmjC2Ofb_tSl437--8dlA8

# Next.js Public Environment Variables
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dfkaxmmso
```

## Bước 3: Thay thế các giá trị
- `your_cloud_name`: Tên cloud từ Dashboard Cloudinary
- `your_api_key`: API Key từ Dashboard Cloudinary  
- `your_api_secret`: API Secret từ Dashboard Cloudinary

## Bước 4: Khởi động lại server
```bash
npm run dev
```

## Tính năng
- Upload ảnh lên Cloudinary
- Hỗ trợ: JPG, PNG, WebP
- Giới hạn: 10MB
- Tự động tạo folder "fresh-travel" trên Cloudinary
- Preview ảnh trước khi lưu
- Validation file type và size

## Lưu ý
- File `.env.local` không được commit lên git
- Đảm bảo Cloudinary account có đủ storage cho project
- Có thể cấu hình thêm folder structure trên Cloudinary
