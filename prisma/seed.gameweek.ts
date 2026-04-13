import prisma from "../src/prisma";



async function seedGameWeeks() {
  const seasons = await prisma.season.findMany();

  for (const season of seasons) {
    const gameweeks = Array.from({ length: 6 }, (_, i) => ({
      number: i + 1,
      season_id: season.id,
    }));

    await prisma.gameWeek.createMany({
      data: gameweeks,
      skipDuplicates: true,
    });

    console.log(`✅ GameWeeks seeded for season ${season.name}`);
  }
}

seedGameWeeks()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });