import prisma from "../src/prisma";

async function main() {
  try {
    const season = await prisma.season.upsert({
      where: { name: "FIFA World Cup 2026 Season" },
      update: {
        year: 2026,
      },
      create: {
        name: "FIFA World Cup 2026 Season",
        year: 2026,
      },
    });

    console.log(`✅ World Cup season created with ID: ${season.id}`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
