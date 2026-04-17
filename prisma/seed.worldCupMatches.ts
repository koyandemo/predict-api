import prisma from "../src/prisma";
import groupStates from "./data/match/fifa-world-cup/groupState.json";

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

    const teams = await prisma.team.findMany({
      where: { league_id: league.id },
    });

    const teamMap = new Map(teams.map((t) => [t.name, t]));

    // Create group stage matches
    for (const match of groupStates) {
      const homeTeam = teamMap.get(match.home);
      const awayTeam = teamMap.get(match.away);

      if (!homeTeam || !awayTeam) {
        console.warn(
          `⚠️  Skipping match: ${match.home} vs ${match.away} - Team not found`
        );
        continue;
      }

      const gameweek = await prisma.gameWeek.findFirst({
        where: {
          season_id: season.id,
          number: match.gameweek,
        },
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      await prisma.match.upsert({
        where: {
          slug: `${match.home}-vs-${match.away}-${match.date}`,
        },
        update: {},
        create: {
          // kickoff: tomorrow,
          kickoff: match.date,
          timezone: "UTC",
          // venue: "TBD",
          venue:match.venue,
          slug: `${match.home}-vs-${match.away}-${match.date}`,
          status: "SCHEDULED",
          type: "GROUP_STAGE",
          group_name: match.group_name,
          allow_draw: true,
          big_match: false,
          derby: false,
          published: true,
          home_team_id: homeTeam.id,
          away_team_id: awayTeam.id,
          league_id: league.id,
          season_id: season.id,
          gameweek_id: gameweek?.id || null,
        },
      });
    }

    console.log("✅ Group stage matches created successfully");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();


// Create knockout matches
    // for (const match of knockoutMatches) {
    //   const gameweek = await prisma.gameWeek.findFirst({
    //     where: {
    //       season_id: season.id,
    //       number: match.gameweek,
    //     },
    //   });

    //   await prisma.match.upsert({
    //     where: {
    //       slug: `knockout-${match.type}-${match.date}`,
    //     },
    //     update: {},
    //     create: {
    //       kickoff: new Date(match.date),
    //       timezone: "UTC",
    //       venue: "TBD",
    //       slug: `knockout-${match.type}-${match.date}`,
    //       status: "SCHEDULED",
    //       type: match.type as any,
    //       allow_draw: match.allow_draw ?? false,
    //       big_match: match.type === "FINAL",
    //       derby: false,
    //       published: true,
    //       home_team_name: match.home,
    //       away_team_name: match.away,
    //       home_team_id: 1, // Placeholder - will be updated when teams qualify
    //       away_team_id: 2, // Placeholder
    //       league_id: league.id,
    //       season_id: season.id,
    //       gameweek_id: gameweek?.id || null,
    //     },
    //   });
    // }

    // console.log(
    //   `✅ ${
    //     groupStageMatches.length + knockoutMatches.length
    //   } World Cup matches created successfully`
    // );