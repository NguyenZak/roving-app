const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample gallery images for different tours
const galleryImages = {
  'hanoi-old-quarter-walking-tour': [
    {
      imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
      alt: 'Hanoi Old Quarter street view',
      caption: 'Narrow streets of Hanoi Old Quarter',
      order: 1
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      alt: 'Hoan Kiem Lake',
      caption: 'Beautiful Hoan Kiem Lake in the heart of Hanoi',
      order: 2
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      alt: 'Vietnamese street food',
      caption: 'Delicious Vietnamese street food',
      order: 3
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      alt: 'Temple of Literature',
      caption: 'Ancient Temple of Literature',
      order: 4
    }
  ],
  'ha-long-bay-cruise': [
    {
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&h=600&fit=crop',
      alt: 'Ha Long Bay limestone karsts',
      caption: 'Magnificent limestone karsts of Ha Long Bay',
      order: 1
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
      alt: 'Ha Long Bay cruise boat',
      caption: 'Traditional junk boat cruise',
      order: 2
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      alt: 'Ha Long Bay sunset',
      caption: 'Breathtaking sunset over Ha Long Bay',
      order: 3
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?w=800&h=600&fit=crop',
      alt: 'Ha Long Bay caves',
      caption: 'Exploring the mysterious caves',
      order: 4
    }
  ],
  'hoi-an-ancient-town': [
    {
      imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop',
      alt: 'Hoi An lantern street',
      caption: 'Colorful lanterns lighting up Hoi An streets',
      order: 1
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop',
      alt: 'Hoi An ancient houses',
      caption: 'Well-preserved ancient architecture',
      order: 2
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1576128801400-24f277d8b89c?w=800&h=600&fit=crop',
      alt: 'Hoi An river',
      caption: 'Peaceful Thu Bon River',
      order: 3
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop',
      alt: 'Hoi An market',
      caption: 'Vibrant local market',
      order: 4
    }
  ],
  'mekong-delta-cruise': [
    {
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      alt: 'Mekong Delta waterways',
      caption: 'Intricate network of waterways',
      order: 1
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      alt: 'Floating market',
      caption: 'Bustling floating market',
      order: 2
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      alt: 'Mekong Delta village',
      caption: 'Traditional riverside village',
      order: 3
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
      alt: 'Mekong Delta boat',
      caption: 'Local boat transportation',
      order: 4
    }
  ]
};

async function addGalleryImages() {
  try {
    console.log('🖼️  Adding gallery images to tours...');
    
    // Get all tours
    const tours = await prisma.tour.findMany({
      select: { id: true, slug: true, title: true }
    });
    
    console.log(`Found ${tours.length} tours`);
    
    for (const tour of tours) {
      let images = galleryImages[tour.slug];
      
      // If no exact match, try to find by partial slug or title
      if (!images) {
        const titleLower = tour.title.toLowerCase();
        const slugLower = tour.slug.toLowerCase();
        
        if (titleLower.includes('hanoi') || slugLower.includes('hanoi')) {
          images = galleryImages['hanoi-old-quarter-walking-tour'];
        } else if (titleLower.includes('ha long') || slugLower.includes('ha-long')) {
          images = galleryImages['ha-long-bay-cruise'];
        } else if (titleLower.includes('hoi an') || slugLower.includes('hoi-an')) {
          images = galleryImages['hoi-an-ancient-town'];
        } else if (titleLower.includes('mekong') || slugLower.includes('mekong')) {
          images = galleryImages['mekong-delta-cruise'];
        }
      }
      
      if (images) {
        // Clear existing gallery images for this tour
        await prisma.tourGallery.deleteMany({
          where: { tourId: tour.id }
        });
        
        // Add new gallery images
        for (const imageData of images) {
          await prisma.tourGallery.create({
            data: {
              tourId: tour.id,
              ...imageData
            }
          });
        }
        
        console.log(`✅ Added ${images.length} gallery images to: ${tour.title}`);
      } else {
        console.log(`⚠️  No gallery images found for: ${tour.title} (${tour.slug})`);
      }
    }
    
    console.log('🎉 Gallery images added successfully!');
  } catch (error) {
    console.error('❌ Error adding gallery images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addGalleryImages();
