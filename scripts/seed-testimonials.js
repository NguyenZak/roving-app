/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const data = [
    {
      name: 'Nguyễn Thị Mai',
      location: 'Hà Nội',
      rating: 5,
      comment:
        'Chuyến đi đến Hạ Long thật tuyệt vời! Hướng dẫn viên rất nhiệt tình và chuyên nghiệp. Tôi sẽ giới thiệu cho bạn bè.',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      tour: 'Hạ Long Bay 3N2Đ',
      isActive: true,
      order: 1,
    },
    {
      name: 'David Johnson',
      location: 'London, UK',
      rating: 5,
      comment:
        'Amazing experience in Hoi An! The ancient town was beautiful and the food tour was incredible. Highly recommended!',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      tour: 'Hoi An Discovery 4N3Đ',
      isActive: true,
      order: 2,
    },
    {
      name: 'Trần Văn Nam',
      location: 'TP.HCM',
      rating: 5,
      comment:
        'Gói du lịch miền Tây rất thú vị. Được trải nghiệm văn hóa sông nước và ẩm thực đặc trưng. Cảm ơn Roving Travel!',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      tour: 'Miền Tây 5N4Đ',
      isActive: true,
      order: 3,
    },
    {
      name: 'Sarah Chen',
      location: 'Singapore',
      rating: 5,
      comment:
        'The Sapa trekking tour was absolutely breathtaking! The mountain views and local culture experience were unforgettable.',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      tour: 'Sapa Trekking 3N2Đ',
      isActive: true,
      order: 4,
    },
  ];

  console.log('Seeding testimonials...');
  for (const t of data) {
    await prisma.testimonial.create({ data: t });
  }
  console.log('Seeded testimonials:', data.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


