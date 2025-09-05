const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateDestinationImages() {
  try {
    console.log('🔄 Updating destination images with working URLs...\n');

    // Define new working image URLs for destinations
    const destinationImageMap = {
      'da-nang': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'hoi-an': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'hue': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'ho-chi-minh-city': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'can-tho': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'phu-quoc': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    };

    // Update each destination
    for (const [slug, imageUrl] of Object.entries(destinationImageMap)) {
      const destination = await prisma.destination.findUnique({
        where: { slug }
      });

      if (destination) {
        await prisma.destination.update({
          where: { id: destination.id },
          data: { image: imageUrl }
        });
        console.log(`✅ Updated ${destination.nameVi} image -> ${imageUrl.substring(0, 50)}...`);
      } else {
        console.log(`❌ Destination not found: ${slug}`);
      }
    }

    // Verify updates
    console.log('\n🔍 Verifying image updates...');
    const updatedDestinations = await prisma.destination.findMany({
      select: { nameVi: true, image: true }
    });

    updatedDestinations.forEach(d => {
      console.log(`📍 ${d.nameVi}: ${d.image.substring(0, 60)}...`);
    });

    console.log('\n✅ Image updates completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDestinationImages();
