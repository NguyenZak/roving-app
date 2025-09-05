/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@roving.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, name: "Admin", role: "admin", status: "active" },
    create: { email, name: "Admin", password: hash, role: "admin", status: "active" },
  });
  return user;
}

async function seedCategories() {
  const names = [
    "Adventure",
    "Culture & History",
    "Nature",
    "Food & Drink",
    "Beach & Relax",
  ];
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    await prisma.provinceCategory.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name), order: i },
    });
  }
}

async function seedDestinations() {
  const items = [
    { region: "north", nameEn: "Ha Giang", image: "https://images.unsplash.com/photo-1582650931244-0bcb7a9b8d9c?q=80&w=1200&auto=format&fit=crop" },
    { region: "north", nameEn: "Hanoi", image: "https://images.unsplash.com/photo-1543968996-ee822b8176ba?q=80&w=1200&auto=format&fit=crop" },
    { region: "north", nameEn: "Sapa", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop" },
    { region: "central", nameEn: "Da Nang", image: "https://images.unsplash.com/photo-1576128801400-24f277d8b89c?q=80&w=1200&auto=format&fit=crop" },
    { region: "central", nameEn: "Hoi An", image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=1200&auto=format&fit=crop" },
    { region: "central", nameEn: "Hue", image: "https://images.unsplash.com/photo-1584719888063-612f16f6650a?q=80&w=1200&auto=format&fit=crop" },
    { region: "south", nameEn: "Ho Chi Minh City", image: "https://images.unsplash.com/photo-1526481280698-8fcc13fd3572?q=80&w=1200&auto=format&fit=crop" },
    { region: "south", nameEn: "Can Tho", image: "https://images.unsplash.com/photo-1541414779316-956d4b19fe0b?q=80&w=1200&auto=format&fit=crop" },
    { region: "south", nameEn: "Phu Quoc", image: "https://images.unsplash.com/photo-1602016753361-59a6d57c2e59?q=80&w=1200&auto=format&fit=crop" },
  ];
  // map region key -> regionId
  const regions = await prisma.region.findMany();
  const keyToRegionId = new Map(regions.map(r => [r.key, r.id]));
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const slug = slugify(it.nameEn);
    await prisma.destination.upsert({
      where: { slug },
      update: { order: i, regionId: keyToRegionId.get(it.region) || null },
      create: {
        region: it.region,
        regionId: keyToRegionId.get(it.region) || null,
        nameVi: it.nameEn, // demo only
        nameEn: it.nameEn,
        image: it.image,
        alt: it.nameEn,
        slug,
        isFeatured: i % 3 === 0,
        order: i,
      },
    });
  }
}

async function seedTours() {
  const tours = [
    {
      title: "Ha Giang Loop Adventure",
      description: "Experience the legendary Ha Giang loop with panoramic mountain passes and local villages.",
      price: 249,
      location: "Ha Giang, Vietnam",
      image: "https://images.unsplash.com/photo-1520781359717-3eb98461c9fe?q=80&w=1200&auto=format&fit=crop",
      availableDates: [new Date(), new Date(Date.now() + 7*86400000)],
    },
    {
      title: "Hoi An Lantern Night",
      description: "Stroll the ancient town of Hoi An and enjoy a magical lantern night on the river.",
      price: 129,
      location: "Hoi An, Vietnam",
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=1200&auto=format&fit=crop",
      availableDates: [new Date(), new Date(Date.now() + 14*86400000)],
    },
    {
      title: "Sapa Terraced Fields Trek",
      description: "Trek through Muong Hoa valley and meet Hmong and Dao ethnic minorities.",
      price: 179,
      location: "Sapa, Vietnam",
      image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop",
      availableDates: [new Date(), new Date(Date.now() + 21*86400000)],
    },
  ];
  const destinations = await prisma.destination.findMany({ select: { id: true, nameEn: true, nameVi: true, slug: true } });
  for (const t of tours) {
    const slug = slugify(t.title);
    const city = String(t.location || '').split(',')[0].trim().toLowerCase();
    const findMatch = (name) => slugify(name) === slugify(city);
    const dest = destinations.find(d => findMatch(d.nameEn) || findMatch(d.nameVi) || d.slug === slugify(city));
    await prisma.tour.upsert({
      where: { slug },
      update: { destinationId: dest ? dest.id : undefined },
      create: { ...t, slug, destinationId: dest ? dest.id : null },
    });
  }
}

async function seedPackages() {
  const items = [
    {
      title: "Vietnam Highlights 7D6N",
      shortDesc: "Hanoi – Ha Long – Hoi An – HCMC",
      priceFrom: 799,
      durationDays: 7,
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
      featured: true,
    },
    {
      title: "Northern Escape 5D4N",
      shortDesc: "Hanoi – Sapa – Ninh Binh",
      priceFrom: 559,
      durationDays: 5,
      image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop",
      featured: false,
    },
    {
      title: "Central Heritage 4D3N",
      shortDesc: "Hue – Da Nang – Hoi An",
      priceFrom: 449,
      durationDays: 4,
      image: "https://images.unsplash.com/photo-1576128801400-24f277d8b89c?q=80&w=1200&auto=format&fit=crop",
      featured: false,
    },
  ];
  for (const p of items) {
    await prisma.tourPackage.upsert({
      where: { slug: slugify(p.title) },
      update: {},
      create: { ...p, slug: slugify(p.title) },
    });
  }
}

async function seedBookings(admin) {
  const tours = await prisma.tour.findMany({ take: 3 });
  const demo = await prisma.user.upsert({
    where: { email: "john@demo.com" },
    update: {},
    create: {
      email: "john@demo.com",
      name: "John Demo",
      password: await bcrypt.hash("demo123", 10),
      role: "user",
      status: "active",
    },
  });
  const statuses = ["pending", "confirmed", "completed"];
  for (let i = 0; i < tours.length; i++) {
    const t = tours[i];
    const bookingId = `BK${String(Date.now() + i).slice(-6)}`;
    await prisma.booking.create({
      data: {
        bookingId,
        userId: demo.id,
        tourId: t.id,
        customerName: demo.name ?? "John Demo",
        customerEmail: demo.email ?? "john@demo.com",
        tourName: t.title,
        tourDate: new Date(Date.now() + (i+3) * 86400000),
        numberOfPeople: 2 + i,
        totalAmount: (t.price || 100) * (2 + i),
        status: statuses[i % statuses.length],
        notes: i === 0 ? "Allergic to peanuts" : null,
      },
    });
  }
}

async function main() {
  const admin = await ensureAdmin();
  await seedCategories();
  await seedDestinations();
  await seedTours();
  await seedPackages();
  await seedBookings(admin);
  console.log("Seeded sample data successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


