const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateDestinationsRegions() {
  try {
    console.log('🔄 Updating destinations with region relationships...\n');

    // Get all regions
    const regions = await prisma.region.findMany();
    console.log('📍 Found regions:', regions.map(r => `${r.nameVi} (${r.key})`).join(', '));

    // Define region mappings for destinations
    const destinationRegionMap = {
      'hanoi': 'north',
      'thai-nguyen': 'north',
      'da-nang': 'central',
      'hoi-an': 'central',
      'hue': 'central',
      'ho-chi-minh-city': 'south',
      'can-tho': 'south',
      'phu-quoc': 'south'
    };

    // Update each destination
    for (const [slug, regionKey] of Object.entries(destinationRegionMap)) {
      const region = regions.find(r => r.key === regionKey);
      if (!region) {
        console.log(`❌ Region not found: ${regionKey}`);
        continue;
      }

      const destination = await prisma.destination.findUnique({
        where: { slug }
      });

      if (destination) {
        await prisma.destination.update({
          where: { id: destination.id },
          data: { regionId: region.id }
        });
        console.log(`✅ Updated ${destination.nameVi} -> ${region.nameVi}`);
      } else {
        console.log(`❌ Destination not found: ${slug}`);
      }
    }

    // Verify updates
    console.log('\n🔍 Verifying updates...');
    const updatedDestinations = await prisma.destination.findMany({
      include: { Region: true }
    });

    updatedDestinations.forEach(d => {
      console.log(`📍 ${d.nameVi}: ${d.Region?.nameVi || 'No Region'}`);
    });

    console.log('\n✅ Update completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDestinationsRegions();
