// Test script to check if tour detail page works
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testTourDetail() {
  try {
    console.log('Testing tour detail functionality...');
    
    // Get a tour by slug
    const tour = await prisma.tour.findFirst({
      where: {
        slug: 'hanoi-old-quarter-walking-tour'
      }
    });
    
    if (tour) {
      console.log('✅ Tour found:', tour.title);
      console.log('   Slug:', tour.slug);
      console.log('   Price:', tour.price);
      console.log('   Status:', tour.status);
    } else {
      console.log('❌ Tour not found');
    }
    
    // Get all tours
    const allTours = await prisma.tour.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true
      }
    });
    
    console.log('\n📋 All tours:');
    allTours.forEach(tour => {
      console.log(`   - ${tour.title} (${tour.slug}) - ${tour.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTourDetail();
