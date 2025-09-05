const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateDestinationImagesFeatured() {
  try {
    console.log('🔄 Updating destination images with beautiful featured images...\n');

    // Define beautiful, featured images for each destination
    const destinationImageMap = {
      // Miền Bắc (North) - Historical, Cultural, Mountainous
      'hanoi': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'thai-nguyen': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'sapa': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'ha-long-bay': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'ninh-binh': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',

      // Miền Trung (Central) - Beaches, Ancient Towns, Culture
      'da-nang': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'hoi-an': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'hue': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'quy-nhon': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'nha-trang': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'dalat': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',

      // Miền Nam (South) - Modern City, Islands, Delta
      'ho-chi-minh-city': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'can-tho': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'phu-quoc': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'vung-tau': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'con-dao': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'tay-ninh': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    };

    // Update each destination with its featured image
    for (const [slug, imageUrl] of Object.entries(destinationImageMap)) {
      const destination = await prisma.destination.findUnique({
        where: { slug }
      });

      if (destination) {
        await prisma.destination.update({
          where: { id: destination.id },
          data: { 
            image: imageUrl,
            alt: `${destination.nameVi} - ${destination.nameEn}`
          }
        });
        console.log(`✅ Updated ${destination.nameVi} image -> ${imageUrl.substring(0, 50)}...`);
      } else {
        console.log(`❌ Destination not found: ${slug}`);
      }
    }

    // Verify updates
    console.log('\n🔍 Verifying image updates...');
    const updatedDestinations = await prisma.destination.findMany({
      select: { nameVi: true, image: true, alt: true },
      orderBy: { order: 'asc' }
    });

    updatedDestinations.forEach(d => {
      console.log(`📍 ${d.nameVi}: ${d.image.substring(0, 60)}...`);
      console.log(`   Alt: ${d.alt}`);
    });

    console.log('\n✅ Image updates completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDestinationImagesFeatured();
