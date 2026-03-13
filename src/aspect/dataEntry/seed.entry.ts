const prisma = require("../../prisma");
const data = require("../dataEntry/data.entry.json");


async function seedPremierLeague() {
  console.log("🌱 Seeding Premier League matches...");

  for (const match of data.matches) {
    const createdMatch = await prisma.match.create({
      data: {
        slug: match.slug,
        kickoff: new Date(match.kickoff),
        timezone: match.timezone,

        venue: match.venue,

        status: match.status,
        type: match.type,

        allow_draw: match.allow_draw,
        big_match: match.big_match,
        derby: match.derby,

        home_team_name: match.home_team_name,
        away_team_name: match.away_team_name,

        home_team_id: match.home_team_id,
        away_team_id: match.away_team_id,

        league_id: match.league_id,

        published: match.published,

        scoreOptions: {
          create: match.scoreOptions.map((option) => ({
            home_score: option.home_score,
            away_score: option.away_score,

            adminScorePrediction: option.adminScorePrediction
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
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });