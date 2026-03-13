import prisma from "../src/prisma";
import { SEASON_ID } from "./utils";

async function seedLeagueSeasons() {
 
  const leagues = Array.from({ length: 15 }, (_, i) => i + 1);

  const data = leagues.map((leagueId) => ({
    league_id: leagueId,
    season_id: SEASON_ID,
  }));

  for (const item of data) {
    await prisma.leagueSeason.upsert({
      where: {
        league_id_season_id: {
          league_id: item.league_id,
          season_id: item.season_id,
        },
      },
      update: {},
      create: item,
    });
  }

  console.log("✅ LeagueSeason seed completed");
}

seedLeagueSeasons()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });