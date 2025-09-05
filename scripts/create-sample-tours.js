const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleTours = [
  {
    title: "Hanoi Old Quarter Walking Tour",
    slug: "hanoi-old-quarter-walking-tour",
    description: "Discover the charm of Hanoi's Old Quarter with our expert local guide. Walk through narrow streets, visit ancient temples, and experience the vibrant street food culture.",
    price: 1500000,
    location: "Hanoi, Vietnam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop",
    duration: "Half day",
    maxGroupSize: 12,
    minGroupSize: 2,
    difficulty: "easy",
    category: "cultural",
    status: "active",
    featured: true,
    
    // NEW FIELDS - Basic Info
    tourCode: "HAN-001",
    shortDescription: "Explore Hanoi's historic Old Quarter with a local guide",
    departurePoint: "Hanoi Opera House",
    returnPoint: "Same as departure",
    ageRestriction: "All ages",
    
    // NEW FIELDS - Detailed Info
    itinerary: "Day 1: Meet at Opera House → Walk through Old Quarter → Visit Hoan Kiem Lake → Temple of Literature → Street food tour → Return to Opera House",
    highlights: [
      "Visit Hoan Kiem Lake and Ngoc Son Temple",
      "Explore 36 Streets of Old Quarter",
      "Try authentic Vietnamese street food",
      "Learn about local history and culture"
    ],
    inclusions: [
      "Professional English-speaking guide",
      "All entrance fees",
      "Street food samples",
      "Walking tour map"
    ],
    exclusions: [
      "Personal expenses",
      "Tips for guide",
      "Additional food and drinks",
      "Transportation to/from hotel"
    ],
    transportation: "Walking tour",
    accommodation: "Not included",
    guide: "English speaking local guide",
    
    // NEW FIELDS - Additional Info
    whatToBring: [
      "Comfortable walking shoes",
      "Camera",
      "Sun hat",
      "Water bottle"
    ],
    physicalReq: "Moderate walking required (2-3 km)",
    cancellationPolicy: "Free cancellation up to 24 hours before tour",
    weatherPolicy: "Tour operates in all weather conditions",
    
    // NEW FIELDS - SEO & Marketing
    metaDescription: "Discover Hanoi's Old Quarter with our walking tour. Visit historic temples, try street food, and learn about local culture with an expert guide.",
    keywords: ["hanoi tour", "old quarter", "walking tour", "vietnam travel", "cultural tour"],
    tags: ["cultural", "walking", "historical", "food"]
  },
  {
    title: "Ha Long Bay Cruise Experience",
    slug: "ha-long-bay-cruise-experience",
    description: "Experience the breathtaking beauty of Ha Long Bay on our luxury cruise. Sail through limestone karsts, visit floating villages, and enjoy fresh seafood.",
    price: 3500000,
    location: "Ha Long Bay, Vietnam",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    duration: "2 days 1 night",
    maxGroupSize: 20,
    minGroupSize: 4,
    difficulty: "easy",
    category: "nature",
    status: "active",
    featured: true,
    
    // NEW FIELDS - Basic Info
    tourCode: "HLB-002",
    shortDescription: "Luxury cruise through the stunning limestone karsts of Ha Long Bay",
    departurePoint: "Ha Long City Port",
    returnPoint: "Same as departure",
    ageRestriction: "5+ years",
    
    // NEW FIELDS - Detailed Info
    itinerary: "Day 1: Depart from port → Cruise through bay → Visit Sung Sot Cave → Kayaking → Sunset dinner → Overnight on boat\nDay 2: Tai Chi on deck → Visit floating village → Return to port",
    highlights: [
      "Cruise through UNESCO World Heritage site",
      "Visit Sung Sot (Surprise) Cave",
      "Kayaking in calm waters",
      "Sunset dinner on deck",
      "Visit floating fishing village"
    ],
    inclusions: [
      "Luxury cruise accommodation",
      "All meals (lunch, dinner, breakfast)",
      "Professional guide",
      "Kayaking equipment",
      "Entrance fees",
      "Tai Chi session"
    ],
    exclusions: [
      "Transportation to/from Hanoi",
      "Personal expenses",
      "Tips for crew",
      "Alcoholic beverages",
      "Travel insurance"
    ],
    transportation: "Luxury cruise boat",
    accommodation: "Deluxe cabin on cruise",
    guide: "English speaking guide and crew",
    
    // NEW FIELDS - Additional Info
    whatToBring: [
      "Swimwear",
      "Sun protection",
      "Camera",
      "Comfortable clothes",
      "Light jacket for evening"
    ],
    physicalReq: "Light physical activity (kayaking optional)",
    cancellationPolicy: "Free cancellation up to 48 hours before departure",
    weatherPolicy: "Cruise operates in most weather conditions, may be modified for safety",
    
    // NEW FIELDS - SEO & Marketing
    metaDescription: "Experience Ha Long Bay's stunning limestone karsts on our luxury cruise. Includes cave visits, kayaking, and overnight accommodation.",
    keywords: ["ha long bay", "cruise", "vietnam", "unesco", "limestone karsts", "kayaking"],
    tags: ["nature", "cruise", "luxury", "unesco", "kayaking"]
  },
  {
    title: "Hoi An Ancient Town & Cooking Class",
    slug: "hoi-an-ancient-town-cooking-class",
    description: "Explore the charming ancient town of Hoi An and learn to cook authentic Vietnamese dishes. Visit local markets, learn traditional recipes, and enjoy your creations.",
    price: 2200000,
    location: "Hoi An, Vietnam",
    image: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&h=600&fit=crop",
    duration: "Full day",
    maxGroupSize: 8,
    minGroupSize: 2,
    difficulty: "easy",
    category: "cultural",
    status: "active",
    featured: false,
    
    // NEW FIELDS - Basic Info
    tourCode: "HOA-003",
    shortDescription: "Discover Hoi An's ancient town and learn authentic Vietnamese cooking",
    departurePoint: "Hoi An Ancient Town",
    returnPoint: "Same as departure",
    ageRestriction: "8+ years",
    
    // NEW FIELDS - Detailed Info
    itinerary: "Morning: Walking tour of ancient town → Visit local market → Cooking class preparation\nAfternoon: Hands-on cooking class → Enjoy your creations → Free time to explore",
    highlights: [
      "Explore UNESCO World Heritage ancient town",
      "Visit bustling local market",
      "Learn 4 traditional Vietnamese dishes",
      "Hands-on cooking experience",
      "Enjoy your own cooked meal"
    ],
    inclusions: [
      "Professional cooking instructor",
      "All cooking ingredients",
      "Market tour with guide",
      "Ancient town walking tour",
      "Lunch (your cooked dishes)",
      "Recipe booklet"
    ],
    exclusions: [
      "Transportation to/from hotel",
      "Personal expenses",
      "Additional food and drinks",
      "Tips for guide and instructor"
    ],
    transportation: "Walking and local transport",
    accommodation: "Not included",
    guide: "English speaking cooking instructor",
    
    // NEW FIELDS - Additional Info
    whatToBring: [
      "Comfortable walking shoes",
      "Camera",
      "Appetite for learning",
      "Notebook (optional)"
    ],
    physicalReq: "Light walking and standing during cooking",
    cancellationPolicy: "Free cancellation up to 24 hours before class",
    weatherPolicy: "Indoor cooking class, operates in all weather",
    
    // NEW FIELDS - SEO & Marketing
    metaDescription: "Learn authentic Vietnamese cooking in Hoi An's ancient town. Includes market tour, cooking class, and UNESCO heritage site visit.",
    keywords: ["hoi an", "cooking class", "vietnamese food", "ancient town", "unesco", "market tour"],
    tags: ["cooking", "cultural", "food", "unesco", "hands-on"]
  },
  {
    title: "Sapa Trekking Adventure",
    slug: "sapa-trekking-adventure",
    description: "Trek through the stunning rice terraces of Sapa and meet local ethnic minority communities. Experience authentic mountain life and breathtaking landscapes.",
    price: 2800000,
    location: "Sapa, Vietnam",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    duration: "3 days 2 nights",
    maxGroupSize: 10,
    minGroupSize: 2,
    difficulty: "medium",
    category: "adventure",
    status: "active",
    featured: true,
    
    // NEW FIELDS - Basic Info
    tourCode: "SAP-004",
    shortDescription: "Trek through Sapa's rice terraces and meet ethnic minority communities",
    departurePoint: "Sapa Town",
    returnPoint: "Same as departure",
    ageRestriction: "12+ years",
    
    // NEW FIELDS - Detailed Info
    itinerary: "Day 1: Arrive in Sapa → Trek to Lao Chai village → Homestay\nDay 2: Trek to Ta Van village → Visit local families → Continue to Giang Ta Chai\nDay 3: Morning trek → Return to Sapa → Departure",
    highlights: [
      "Trek through stunning rice terraces",
      "Meet Hmong and Dao ethnic communities",
      "Experience authentic homestay",
      "Learn about local farming techniques",
      "Breathtaking mountain views"
    ],
    inclusions: [
      "Professional trekking guide",
      "2 nights homestay accommodation",
      "All meals during trek",
      "Trekking equipment (if needed)",
      "Transportation from/to Sapa",
      "Entrance fees"
    ],
    exclusions: [
      "Transportation to/from Hanoi",
      "Personal trekking gear",
      "Travel insurance",
      "Tips for guide and host families",
      "Alcoholic beverages"
    ],
    transportation: "Walking/trekking",
    accommodation: "Traditional homestay",
    guide: "Local ethnic minority guide",
    
    // NEW FIELDS - Additional Info
    whatToBring: [
      "Sturdy hiking boots",
      "Warm clothing (layers)",
      "Rain jacket",
      "Backpack",
      "Camera",
      "Personal toiletries"
    ],
    physicalReq: "Good physical condition required (6-8km daily trekking)",
    cancellationPolicy: "Free cancellation up to 72 hours before departure",
    weatherPolicy: "Trekking may be modified for safety in extreme weather",
    
    // NEW FIELDS - SEO & Marketing
    metaDescription: "Trek through Sapa's rice terraces and experience authentic ethnic minority culture. Includes homestay and local guide.",
    keywords: ["sapa", "trekking", "rice terraces", "ethnic minorities", "homestay", "mountain"],
    tags: ["adventure", "trekking", "cultural", "nature", "homestay"]
  },
  {
    title: "Mekong Delta River Cruise",
    slug: "mekong-delta-river-cruise",
    description: "Cruise through the Mekong Delta's intricate waterways, visit floating markets, and experience the vibrant river life of southern Vietnam.",
    price: 1800000,
    location: "Mekong Delta, Vietnam",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    duration: "Full day",
    maxGroupSize: 15,
    minGroupSize: 4,
    difficulty: "easy",
    category: "nature",
    status: "active",
    featured: false,
    
    // NEW FIELDS - Basic Info
    tourCode: "MKD-005",
    shortDescription: "Explore the Mekong Delta's waterways and floating markets",
    departurePoint: "Can Tho City",
    returnPoint: "Same as departure",
    ageRestriction: "All ages",
    
    // NEW FIELDS - Detailed Info
    itinerary: "Morning: Depart from Can Tho → Cruise to Cai Rang floating market → Visit local workshops\nAfternoon: Continue to smaller canals → Visit fruit orchards → Return to Can Tho",
    highlights: [
      "Visit Cai Rang floating market",
      "Cruise through narrow canals",
      "Visit local workshops (rice paper, coconut candy)",
      "Taste fresh tropical fruits",
      "Experience river life"
    ],
    inclusions: [
      "Boat cruise",
      "Professional guide",
      "All entrance fees",
      "Fresh fruit tasting",
      "Lunch on boat",
      "Workshop visits"
    ],
    exclusions: [
      "Transportation to/from Ho Chi Minh City",
      "Personal expenses",
      "Tips for guide and boat crew",
      "Additional food and drinks"
    ],
    transportation: "Traditional wooden boat",
    accommodation: "Not included",
    guide: "English speaking local guide",
    
    // NEW FIELDS - Additional Info
    whatToBring: [
      "Sun protection",
      "Camera",
      "Comfortable clothes",
      "Light jacket",
      "Cash for souvenirs"
    ],
    physicalReq: "Light walking and boat boarding",
    cancellationPolicy: "Free cancellation up to 24 hours before tour",
    weatherPolicy: "Cruise operates in most weather conditions",
    
    // NEW FIELDS - SEO & Marketing
    metaDescription: "Cruise the Mekong Delta's waterways, visit floating markets, and experience authentic river life in southern Vietnam.",
    keywords: ["mekong delta", "floating market", "river cruise", "vietnam", "cai rang", "waterways"],
    tags: ["nature", "cruise", "cultural", "floating market", "river"]
  }
];

async function createSampleTours() {
  try {
    console.log('Creating sample tours...');
    
    // Get first destination to link tours
    const firstDestination = await prisma.destination.findFirst();
    
    for (const tourData of sampleTours) {
      const tour = await prisma.tour.create({
        data: {
          ...tourData,
          destinationId: firstDestination?.id || null,
        }
      });
      console.log(`Created tour: ${tour.title}`);
    }
    
    console.log('✅ Sample tours created successfully!');
  } catch (error) {
    console.error('❌ Error creating sample tours:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleTours();
