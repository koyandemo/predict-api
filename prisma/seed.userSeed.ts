import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Google-style profile avatar colors
const GOOGLE_AVATAR_COLORS = [
  "#F28B82", // red
  "#FABF64", // orange
  "#FFF475", // yellow
  "#CCFF90", // green
  "#A8DAB5", // sage
  "#CBF0F8", // light blue
  "#AECBFA", // blue
  "#D7AEFB", // purple
  "#FDCFE8", // pink
  "#E6C9A8", // brown
  "#E8EAED", // grey
  "#FF6D00", // deep orange
  "#00BCD4", // cyan
  "#4CAF50", // dark green
  "#9C27B0", // deep purple
  "#F06292", // hot pink
  "#4DB6AC", // teal
  "#FFB300", // amber
  "#5C6BC0", // indigo
  "#26A69A", // dark teal
];

const mockUsers = [
  { name: "Alice Johnson",    email: "alice.johnson@gmail.com" },
  { name: "Bob Martinez",     email: "bob.martinez@gmail.com" },
  { name: "Carol Williams",   email: "carol.williams@gmail.com" },
  { name: "David Lee",        email: "david.lee@gmail.com" },
  { name: "Eva Brown",        email: "eva.brown@gmail.com" },
  { name: "Frank Garcia",     email: "frank.garcia@gmail.com" },
  { name: "Grace Kim",        email: "grace.kim@gmail.com" },
  { name: "Henry Wilson",     email: "henry.wilson@gmail.com" },
  { name: "Isabella Chen",    email: "isabella.chen@gmail.com" },
  { name: "James Taylor",     email: "james.taylor@gmail.com" },
  { name: "Karen Anderson",   email: "karen.anderson@gmail.com" },
  { name: "Liam Thomas",      email: "liam.thomas@gmail.com" },
  { name: "Mia Jackson",      email: "mia.jackson@gmail.com" },
  { name: "Noah White",       email: "noah.white@gmail.com" },
  { name: "Olivia Harris",    email: "olivia.harris@gmail.com" },
  { name: "Peter Clark",      email: "peter.clark@gmail.com" },
  { name: "Quinn Lewis",      email: "quinn.lewis@gmail.com" },
  { name: "Rachel Robinson",  email: "rachel.robinson@gmail.com" },
  { name: "Samuel Walker",    email: "samuel.walker@gmail.com" },
  { name: "Tina Hall",        email: "tina.hall@gmail.com" },
];

async function seedUsers() {
  const password = await bcrypt.hash("example*...", 10);

  console.log("🌱 Seeding 20 mock users...\n");

  for (let i = 0; i < mockUsers.length; i++) {
    const { name, email } = mockUsers[i];
    // Each user gets the color at their index position (all unique since array length === user count)
    const avatar_bg_color = GOOGLE_AVATAR_COLORS[i];

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        provider: "email",
        password,
        role: "SEED",
        avatar_url: "",
        avatar_bg_color,
      },
    });

    console.log(`  ✅ ${name.padEnd(20)} ${email.padEnd(38)} ${avatar_bg_color}`);
  }

  console.log("\n🎉 All 20 mock users seeded successfully!");
}

seedUsers()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });