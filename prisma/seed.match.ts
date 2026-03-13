import prisma from "../src/prisma";
import data from "./data/match/serie-a/season/2025-2026/week-29.json";
import { GAME_WEEK_ID, LEAGUE_ID, SEASON_ID } from "./utils";

async function seedPremierLeague() {
  console.log("🌱 Seeding Premier League matches...");

  for (const match of data) {

    const homeTeam = await prisma.team.findFirst({
      where: {
        name: {
          equals: match.home_team_name,
          mode: "insensitive",
        },
        league_id: LEAGUE_ID,
      },
    });

    const awayTeam = await prisma.team.findFirst({
      where: {
        name: {
          equals: match.away_team_name,
          mode: "insensitive",
        },
        league_id: LEAGUE_ID,
      },
    });

    // if (!homeTeam || !awayTeam) {
    //   console.warn(
    //     `⚠️ Skipping match because team not found: ${match.home_team_name} vs ${match.away_team_name}`
    //   );
    //   continue;
    // }

    const createdMatch = await prisma.match.create({
      data: {
        slug: `${match.slug}-${Date.now()}`,
        kickoff: new Date(match.kickoff),
        timezone: match.timezone,

        venue: match.venue,

        status: match.status as any,
        type: match.type as any,

        allow_draw: match.allow_draw,
        big_match: match.big_match,
        derby: match.derby,

        home_team_name: match.home_team_name,
        away_team_name: match.away_team_name,

        // ✅ Correct IDs from DB
        home_team_id:homeTeam ? homeTeam.id : match.home_team_id,
        away_team_id: awayTeam ? awayTeam.id : match.away_team_id,

        season_id: SEASON_ID,
        gameweek_id: GAME_WEEK_ID,
        league_id: LEAGUE_ID,

        published: match.published,

        scoreOptions: {
          create: match.scoreOptions.map((option: any) => ({
            home_score: option.home_score,
            away_score: option.away_score,

            admin_score_prediction: option.adminScorePrediction
              ? {
                  create: {
                    user_id: option.adminScorePrediction.user_id,
                    vote_count: option.adminScorePrediction.vote_count,
                  },
                }
              : undefined,
          })),
        },

        adminMatchVote: {
          create: {
            user_id: match.adminMatchVote.user_id,
            home_votes: match.adminMatchVote.home_votes,
            draw_votes: match.adminMatchVote.draw_votes,
            away_votes: match.adminMatchVote.away_votes,
          },
        },
      },
    });

    console.log(`✅ Created match ${createdMatch.slug}`);
  }

  console.log("🎉 Premier League seed complete");
}

seedPremierLeague()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });