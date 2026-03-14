import prisma from "../src/prisma";
import teams from "./data/team/world-cup-teams.json";

const LEAGUE_SLUG = "fifa-world-cup-2026";

async function main() {
  try {
    const league = await prisma.league.findUnique({
      where: { slug: LEAGUE_SLUG },
    });

    if (!league) {
      console.error("❌ FIFA World Cup league not found. Please run seed.worldCupLeague.ts first.");
      return;
    }

    for (const team of teams) {
      await prisma.team.upsert({
        where: { slug: team.slug },
        update: {
          ...team,
          league_id: league.id,
        },
        create: {
          ...team,
          league_id: league.id,
        },
      });
    }

    console.log(`✅ ${teams.length} World Cup teams created/updated successfully`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
