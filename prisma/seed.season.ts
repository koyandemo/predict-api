import prisma from "../src/prisma";

async function seedSeasons() {
  const startYear = 2025;
  const endYear = 2030;

  const seasons:any = [];

  for (let year = startYear; year < endYear; year++) {
    seasons.push({
      name: `${year}/${year + 1}`,
      year: year,
    });
  }

  for (const season of seasons) {
    await prisma.season.upsert({
      where: { name: season.name },
      update: {},
      create: season,
    });
  }

  console.log("✅ Seasons 2025–2030 seeded");
}

seedSeasons()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });