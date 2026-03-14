import prisma from "../src/prisma";
import { SEASON_ID } from "./utils";

async function seedLeagueSeasons() {
 
  const leagues = await prisma.league.findMany();

  for (const item of leagues) {
    await prisma.leagueSeason.upsert({
      where: {
        league_id_season_id: {
          league_id: item.id,
          season_id: SEASON_ID,
        },
      },
      update: {},
      create: { league_id: item.id, season_id: SEASON_ID },
    });
  }

  console.log("✅ LeagueSeason seed completed");
}

seedLeagueSeasons()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });