import prisma from "../src/prisma";
import { WORLD_CUP_LEAGUE_ID } from "./utils";


async function seedTeamStanding() {
  try {
    // 1. Get league season (adjust if multiple seasons exist)
    const leagueSeason = await prisma.leagueSeason.findFirst({
      where: {
        league_id: WORLD_CUP_LEAGUE_ID,
      },
      orderBy: {
        created_at: "desc", // latest season
      },
    });

    if (!leagueSeason) {
      throw new Error("LeagueSeason not found");
    }

    // 2. Get all teams in this league
    const teams = await prisma.team.findMany({
      where: {
        league_id: WORLD_CUP_LEAGUE_ID,
      },
      select: {
        id: true,
      },
    });

    console.log(`Found ${teams.length} teams`);

    // 3. Create TeamStanding records
    for (const team of teams) {
      await prisma.teamStanding.upsert({
        where: {
          team_id_league_season_id: {
            team_id: team.id,
            league_season_id: leagueSeason.id,
          },
        },
        update: {}, // do nothing if exists
        create: {
          team_id: team.id,
          league_season_id: leagueSeason.id,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goals_for: 0,
          goals_against: 0,
          goal_difference: 0,
          points: 0,
        },
      });
    }

    console.log("✅ Team standings seeded successfully");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTeamStanding();
