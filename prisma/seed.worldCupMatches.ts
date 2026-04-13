import prisma from "../src/prisma";

const LEAGUE_SLUG = "fifa-world-cup-2026";
const SEASON_NAME = "FIFA World Cup 2026 Season";

// Sample group stage matches (simplified - real World Cup has 48 teams in 12 groups)
// For demo: 6 groups of 4 teams = 24 teams
const groupStageMatches = [
  // Group A
  {
    home: "argentina",
    away: "canada",
    gameweek: 1,
    date: "2026-06-11T18:00:00Z",
    group_name: "A",
  },
  {
    home: "brazil",
    away: "australia",
    gameweek: 1,
    date: "2026-06-11T21:00:00Z",
    group_name: "A",
  },
  {
    home: "argentina",
    away: "brazil",
    gameweek: 2,
    date: "2026-06-15T18:00:00Z",
    group_name: "A",
  },
  {
    home: "canada",
    away: "australia",
    gameweek: 2,
    date: "2026-06-15T21:00:00Z",
    group_name: "A",
  },
  {
    home: "argentina",
    away: "australia",
    gameweek: 3,
    date: "2026-06-19T18:00:00Z",
    group_name: "A",
  },
  {
    home: "brazil",
    away: "canada",
    gameweek: 3,
    date: "2026-06-19T21:00:00Z",
    group_name: "A",
  },

  // Group B
  {
    home: "france",
    away: "mexico",
    gameweek: 1,
    date: "2026-06-12T18:00:00Z",
    group_name: "B",
  },
  {
    home: "spain",
    away: "senegal",
    gameweek: 1,
    date: "2026-06-12T21:00:00Z",
    group_name: "B",
  },
  {
    home: "france",
    away: "spain",
    gameweek: 2,
    date: "2026-06-16T18:00:00Z",
    group_name: "B",
  },
  {
    home: "mexico",
    away: "senegal",
    gameweek: 2,
    date: "2026-06-16T21:00:00Z",
    group_name: "B",
  },
  {
    home: "france",
    away: "senegal",
    gameweek: 3,
    date: "2026-06-20T18:00:00Z",
    group_name: "B",
  },
  {
    home: "spain",
    away: "mexico",
    gameweek: 3,
    date: "2026-06-20T21:00:00Z",
    group_name: "B",
  },

  // Group C
  {
    home: "england",
    away: "japan",
    gameweek: 1,
    date: "2026-06-13T18:00:00Z",
    group_name: "C",
  },
  {
    home: "germany",
    away: "nigeria",
    gameweek: 1,
    date: "2026-06-13T21:00:00Z",
    group_name: "C",
  },
  {
    home: "england",
    away: "germany",
    gameweek: 2,
    date: "2026-06-17T18:00:00Z",
    group_name: "C",
  },
  {
    home: "japan",
    away: "nigeria",
    gameweek: 2,
    date: "2026-06-17T21:00:00Z",
    group_name: "C",
  },
  {
    home: "england",
    away: "nigeria",
    gameweek: 3,
    date: "2026-06-21T18:00:00Z",
    group_name: "C",
  },
  {
    home: "germany",
    away: "japan",
    gameweek: 3,
    date: "2026-06-21T21:00:00Z",
    group_name: "C",
  },
];

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

    const teamMap = new Map(teams.map((t) => [t.slug, t]));

    // Create group stage matches
    for (const match of groupStageMatches) {
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
          kickoff: tomorrow,
          timezone: "UTC",
          venue: "TBD",
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
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

// Knockout stage placeholder matches
const knockoutMatches = [
  // Round of 16 (8 matches - top 2 from each group + best third-placed teams)
  {
    type: "ROUND_OF_16",
    home: "TBD",
    away: "TBD",
    gameweek: 4,
    date: "2026-06-27T18:00:00Z",
  },
  {
    type: "ROUND_OF_16",
    home: "TBD",
    away: "TBD",
    gameweek: 4,
    date: "2026-06-27T21:00:00Z",
  },
  {
    type: "ROUND_OF_16",
    home: "TBD",
    away: "TBD",
    gameweek: 4,
    date: "2026-06-28T18:00:00Z",
  },
  {
    type: "ROUND_OF_16",
    home: "TBD",
    away: "TBD",
    gameweek: 4,
    date: "2026-06-28T21:00:00Z",
  },
  {
    type: "ROUND_OF_16",
    home: "TBD",
    away: "TBD",
    gameweek: 4,
    date: "2026-06-29T18:00:00Z",
  },
  {
    type: "ROUND_OF_16",
    home: "TBD",
    away: "TBD",
    gameweek: 4,
    date: "2026-06-29T21:00:00Z",
  },
  {
    type: "ROUND_OF_16",
    home: "TBD",
    away: "TBD",
    gameweek: 4,
    date: "2026-06-30T18:00:00Z",
  },
  {
    type: "ROUND_OF_16",
    home: "TBD",
    away: "TBD",
    gameweek: 4,
    date: "2026-06-30T21:00:00Z",
  },

  // Quarter-finals
  {
    type: "QUARTERFINAL",
    home: "TBD",
    away: "TBD",
    gameweek: 5,
    date: "2026-07-04T18:00:00Z",
  },
  {
    type: "QUARTERFINAL",
    home: "TBD",
    away: "TBD",
    gameweek: 5,
    date: "2026-07-04T21:00:00Z",
  },
  {
    type: "QUARTERFINAL",
    home: "TBD",
    away: "TBD",
    gameweek: 5,
    date: "2026-07-05T18:00:00Z",
  },
  {
    type: "QUARTERFINAL",
    home: "TBD",
    away: "TBD",
    gameweek: 5,
    date: "2026-07-05T21:00:00Z",
  },

  // Semi-finals
  {
    type: "SEMIFINAL",
    home: "TBD",
    away: "TBD",
    gameweek: 6,
    date: "2026-07-09T18:00:00Z",
  },
  {
    type: "SEMIFINAL",
    home: "TBD",
    away: "TBD",
    gameweek: 6,
    date: "2026-07-09T21:00:00Z",
  },

  // Third Place Playoff
  {
    type: "THIRD_PLACE_PLAYOFF",
    home: "TBD",
    away: "TBD",
    gameweek: 7,
    date: "2026-07-13T18:00:00Z",
    allow_draw: false,
  },

  // Final
  {
    type: "FINAL",
    home: "TBD",
    away: "TBD",
    gameweek: 8,
    date: "2026-07-14T18:00:00Z",
    allow_draw: false,
  },
];
