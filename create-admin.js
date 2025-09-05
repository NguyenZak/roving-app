const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "rovingvietnamtravel@gmail.com";
  const password = "RovingAdmin2024!";
  const hash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { 
      password: hash, 
      name: "Roving Travel Admin", 
      role: "admin", 
      status: "active" 
    },
    create: { 
      email, 
      name: "Roving Travel Admin", 
      password: hash, 
      role: "admin", 
      status: "active" 
    },
  });
  
  console.log("✅ Admin account created/updated successfully!");
  console.log("📧 Email:", user.email);
  console.log("🔑 Password:", password);
  console.log("👤 Name:", user.name);
  console.log("🔐 Role:", user.role);
  console.log("📊 Status:", user.status);
  console.log("\n🚀 You can now login to admin panel with these credentials!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
