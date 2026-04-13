import { PrismaClient} from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmin() {
  const password = await bcrypt.hash("Wai@2180channel", 10);

  await prisma.user.upsert({
    where: {
      email: "Wai@2180channel",
    },
    update: {},
    create: {
      name: "Admin",
      email: "predictadmin@gmail.com",
      provider: "email",
      password,
      role: "ADMIN",
      avatar_url: "",
      avatar_bg_color: "",
    },
  });

  console.log("✅ Admin user seeded");
}

seedAdmin()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });