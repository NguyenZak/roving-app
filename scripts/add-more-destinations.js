const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMoreDestinations() {
  try {
    console.log('🔄 Adding more destinations for each region...\n');

    // Get all regions
    const regions = await prisma.region.findMany();
    console.log('📍 Found regions:', regions.map(r => `${r.nameVi} (${r.key})`).join(', '));

    // Define new destinations for each region
    const newDestinations = [
      // Miền Bắc (North)
      {
        slug: 'sapa',
        nameVi: 'Sapa',
        nameEn: 'Sapa',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        alt: 'Sapa - Thị trấn mờ sương',
        isFeatured: true,
        order: 3,
        region: 'north'
      },
      {
        slug: 'ha-long-bay',
        nameVi: 'Vịnh Hạ Long',
        nameEn: 'Ha Long Bay',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        alt: 'Vịnh Hạ Long - Kỳ quan thiên nhiên',
        isFeatured: true,
        order: 4,
        region: 'north'
      },
      {
        slug: 'ninh-binh',
        nameVi: 'Ninh Bình',
        nameEn: 'Ninh Binh',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        alt: 'Ninh Bình - Vùng đất cố đô',
        isFeatured: false,
        order: 5,
        region: 'north'
      },

      // Miền Trung (Central)
      {
        slug: 'quy-nhon',
        nameVi: 'Quy Nhơn',
        nameEn: 'Quy Nhon',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        alt: 'Quy Nhơn - Thành phố biển xinh đẹp',
        isFeatured: true,
        order: 6,
        region: 'central'
      },
      {
        slug: 'nha-trang',
        nameVi: 'Nha Trang',
        nameEn: 'Nha Trang',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        alt: 'Nha Trang - Thành phố biển',
        isFeatured: true,
        order: 7,
        region: 'central'
      },
      {
        slug: 'dalat',
        nameVi: 'Đà Lạt',
        nameEn: 'Da Lat',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        alt: 'Đà Lạt - Thành phố ngàn hoa',
        isFeatured: true,
        order: 8,
        region: 'central'
      },

      // Miền Nam (South)
      {
        slug: 'vung-tau',
        nameVi: 'Vũng Tàu',
        nameEn: 'Vung Tau',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        alt: 'Vũng Tàu - Thành phố biển gần Sài Gòn',
        isFeatured: false,
        order: 9,
        region: 'south'
      },
      {
        slug: 'con-dao',
        nameVi: 'Côn Đảo',
        nameEn: 'Con Dao',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        alt: 'Côn Đảo - Hòn đảo thiên đường',
        isFeatured: true,
        order: 10,
        region: 'south'
      },
      {
        slug: 'tay-ninh',
        nameVi: 'Tây Ninh',
        nameEn: 'Tay Ninh',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        alt: 'Tây Ninh - Vùng đất tâm linh',
        isFeatured: false,
        order: 11,
        region: 'south'
      }
    ];

    // Add each destination
    for (const destData of newDestinations) {
      const region = regions.find(r => r.key === destData.region);
      if (!region) {
        console.log(`❌ Region not found: ${destData.region}`);
        continue;
      }

      // Check if destination already exists
      const existing = await prisma.destination.findUnique({
        where: { slug: destData.slug }
      });

      if (existing) {
        console.log(`⚠️  Destination already exists: ${destData.nameVi}`);
        continue;
      }

      // Create new destination
      const newDest = await prisma.destination.create({
        data: {
          ...destData,
          regionId: region.id
        }
      });

      console.log(`✅ Added ${newDest.nameVi} -> ${region.nameVi}`);
    }

    // Verify final count
    console.log('\n🔍 Verifying final destinations...');
    const finalDestinations = await prisma.destination.findMany({
      include: { Region: true },
      orderBy: { order: 'asc' }
    });

    console.log('\n📊 Final destinations by region:');
    const byRegion = {};
    finalDestinations.forEach(d => {
      const regionKey = d.Region?.key || 'unknown';
      if (!byRegion[regionKey]) byRegion[regionKey] = [];
      byRegion[regionKey].push(d.nameVi);
    });

    Object.entries(byRegion).forEach(([region, dests]) => {
      console.log(`📍 ${region}: ${dests.join(', ')} (${dests.length})`);
    });

    console.log(`\n✅ Total destinations: ${finalDestinations.length}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreDestinations();
