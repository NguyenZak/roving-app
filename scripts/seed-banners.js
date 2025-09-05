const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedBanners() {
  try {
    console.log('🌱 Seeding banners...');

    // Xóa tất cả banner cũ
    await prisma.banner.deleteMany({});
    console.log('🗑️  Deleted old banners');

    // Tạo banner mẫu
    const banners = [
      {
        title: "Discover Vietnam",
        subtitle: "Live fully in every journey",
        image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop",
        alt: "Ha Long Bay limestone karsts at sunset",
        type: "image",
        order: 1,
        isActive: true,
      },
      {
        title: "Ancient Beauty",
        subtitle: "Experience the charm of Hoi An",
        image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2000&auto=format&fit=crop",
        alt: "Hoi An lantern street at night",
        type: "image",
        order: 2,
        isActive: true,
      },
      {
        title: "Coastal Paradise",
        subtitle: "Beautiful beaches await you",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2000&auto=format&fit=crop",
        alt: "Sand beach and turquoise water in Vietnam",
        type: "image",
        order: 3,
        isActive: true,
      },
      {
        title: "Mountain Adventure",
        subtitle: "Explore the highlands of Sapa",
        image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=2000&auto=format&fit=crop",
        alt: "Sapa mountain terraces",
        type: "image",
        order: 4,
        isActive: true,
      },
      {
        title: "Cultural Heritage",
        subtitle: "Discover the traditions of Vietnam",
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2000&auto=format&fit=crop",
        alt: "Vietnamese cultural performance",
        type: "image",
        order: 5,
        isActive: true,
      }
    ];

    // Thêm banner vào database
    for (const banner of banners) {
      await prisma.banner.create({
        data: banner,
      });
      console.log(`✅ Created banner: ${banner.title}`);
    }

    console.log('🎉 Banner seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBanners();
