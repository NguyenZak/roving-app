const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Seeding regions...');

  const regions = [
    {
      key: 'north',
      nameVi: 'Miền Bắc',
      nameEn: 'North',
      descriptionVi: 'Miền Bắc Việt Nam với thủ đô Hà Nội, vịnh Hạ Long, Sapa và nhiều di tích lịch sử quan trọng.',
      descriptionEn: 'Northern Vietnam featuring Hanoi capital, Ha Long Bay, Sapa and many important historical sites.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      order: 1
    },
    {
      key: 'central',
      nameVi: 'Miền Trung',
      nameEn: 'Central',
      descriptionVi: 'Miền Trung Việt Nam với Huế, Đà Nẵng, Hội An - những thành phố di sản văn hóa thế giới.',
      descriptionEn: 'Central Vietnam featuring Hue, Da Nang, Hoi An - UNESCO World Heritage cities.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      order: 2
    },
    {
      key: 'south',
      nameVi: 'Miền Nam',
      nameEn: 'South',
      descriptionVi: 'Miền Nam Việt Nam với TP.HCM, đồng bằng sông Cửu Long và những vùng đất trù phú.',
      descriptionEn: 'Southern Vietnam featuring Ho Chi Minh City, Mekong Delta and fertile lands.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      order: 3
    }
  ];

  for (const region of regions) {
    try {
      const existing = await prisma.region.findUnique({
        where: { key: region.key }
      });

      if (existing) {
        console.log(`✅ Region ${region.key} already exists, updating...`);
        await prisma.region.update({
          where: { key: region.key },
          data: region
        });
      } else {
        console.log(`🌍 Creating region ${region.key}...`);
        await prisma.region.create({
          data: region
        });
      }
    } catch (error) {
      console.error(`❌ Error with region ${region.key}:`, error);
    }
  }

  console.log('✅ Regions seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
