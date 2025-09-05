# 🚀 Đề xuất cải tiến Tour Schema

## 📊 Phân tích hiện trạng

### ✅ Thông tin đã có:
- **Cơ bản**: title, description, price, location, image
- **Phân loại**: category, difficulty, featured, status
- **Thời gian**: duration, availableDates
- **Nhóm**: maxGroupSize
- **Liên kết**: destinationId

### ❌ Thông tin cần bổ sung:

## 🎯 Đề xuất Schema mới

### 1. **Tour Model Enhancement**

```prisma
model Tour {
  // Existing fields
  id             String     @id @default(cuid())
  slug           String     @unique
  title          String
  description    String
  price          Int
  location       String
  destinationId  String?
  image          String
  featured       Boolean    @default(false)
  status         String     @default("active")
  duration       String?
  maxGroupSize   Int?
  difficulty     String?
  category       String?
  availableDates DateTime[]
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  
  // NEW FIELDS - Basic Info
  tourCode       String?    // Mã tour duy nhất
  shortDescription String?  // Mô tả ngắn gọn
  departurePoint String?    // Điểm khởi hành
  returnPoint    String?    // Điểm kết thúc
  minGroupSize   Int?       // Số người tối thiểu
  ageRestriction String?    // Giới hạn tuổi
  
  // NEW FIELDS - Detailed Info
  itinerary      String?    // Lịch trình chi tiết (JSON hoặc Text)
  highlights     String[]   // Điểm nổi bật
  inclusions     String[]   // Dịch vụ bao gồm
  exclusions     String[]   // Dịch vụ không bao gồm
  transportation String?    // Phương tiện di chuyển
  accommodation  String?    // Thông tin khách sạn
  guide          String?    // Thông tin hướng dẫn viên
  
  // NEW FIELDS - Additional Info
  whatToBring    String[]   // Cần mang theo gì
  physicalReq    String?    // Yêu cầu thể lực
  cancellationPolicy String? // Chính sách hủy
  weatherPolicy  String?    // Chính sách thời tiết
  
  // NEW FIELDS - SEO & Marketing
  metaDescription String?   // Mô tả SEO
  keywords       String[]   // Từ khóa
  tags           String[]   // Thẻ tag
  
  // Relations
  bookings       Booking[]
  Destination    Destination? @relation(fields: [destinationId], references: [id])
  galleries      TourGallery[]
  reviews        TourReview[]
  
  @@index([destinationId])
  @@index([featured])
  @@index([status])
  @@index([category])
  @@index([difficulty])
}
```

### 2. **New Related Models**

```prisma
// Bộ sưu tập ảnh tour
model TourGallery {
  id        String   @id @default(cuid())
  tourId    String
  imageUrl  String
  alt       String?
  caption   String?
  order     Int      @default(0)
  createdAt DateTime @default(now())
  
  tour      Tour     @relation(fields: [tourId], references: [id], onDelete: Cascade)
  
  @@index([tourId])
}

// Đánh giá tour
model TourReview {
  id        String   @id @default(cuid())
  tourId    String
  userId    String?
  userName  String
  userEmail String
  rating    Int      // 1-5 stars
  comment   String
  isVerified Boolean @default(false)
  createdAt DateTime @default(now())
  
  tour      Tour     @relation(fields: [tourId], references: [id], onDelete: Cascade)
  user      User?    @relation(fields: [userId], references: [id])
  
  @@index([tourId])
  @@index([rating])
}
```

## 🎨 Đề xuất Giao diện User

### 1. **Tour Listing Page**
- Grid layout với ảnh, title, price, duration
- Filter: category, difficulty, price range, duration
- Sort: price, duration, rating, featured

### 2. **Tour Detail Page**
- Hero section với ảnh chính và basic info
- Tabs: Overview, Itinerary, Inclusions, Reviews
- Booking form với date picker
- Related tours

### 3. **Booking Form**
- Tour selection
- Date selection
- Number of people
- Customer information
- Payment integration

## 🚀 Implementation Plan

### Phase 1: Schema Enhancement
1. Add new fields to Tour model
2. Create TourGallery and TourReview models
3. Run migration
4. Update API endpoints

### Phase 2: Admin Interface
1. Update tour creation/edit forms
2. Add gallery management
3. Add review management
4. Enhanced filtering and search

### Phase 3: User Interface
1. Create tour listing page
2. Create tour detail page
3. Implement booking system
4. Add review system

### Phase 4: Advanced Features
1. Search and filtering
2. Recommendation system
3. Payment integration
4. Email notifications

## 📈 Benefits

- **Better User Experience**: Complete tour information
- **Improved SEO**: Rich content and metadata
- **Enhanced Marketing**: Visual galleries and reviews
- **Professional Look**: Industry-standard information
- **Better Conversion**: Detailed information builds trust
