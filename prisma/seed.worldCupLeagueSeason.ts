import prisma from "../src/prisma";

const LEAGUE_SLUG = "fifa-world-cup-2026";
const SEASON_NAME = "FIFA World Cup 2026 Season";

async function main() {
  try {
    const league = await prisma.league.findUnique({
      where: { slug: LEAGUE_SLUG },
    });

    if (!league) {
      console.error("❌ FIFA World Cup league not found");
      return;
    }

    const season = await prisma.season.findUnique({
      where: { name: SEASON_NAME },
    });

    if (!season) {
      console.error("❌ World Cup season not found");
      return;
    }

    await prisma.leagueSeason.upsert({
      where: {
        league_id_season_id: {
          league_id: league.id,
          season_id: season.id,
        },
      },
      update: {},
      create: {
        league_id: league.id,
        season_id: season.id,
      },
    });

    console.log("✅ League-Season relationship created successfully");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
