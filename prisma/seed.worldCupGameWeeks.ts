import prisma from "../src/prisma";

const SEASON_NAME = "FIFA World Cup 2026 Season";

const GAME_WEEKS = [
  { number: 1, name: "Group Stage - Jun 12" },
  { number: 2, name: "Group Stage - Jun 13" },
  { number: 3, name: "Group Stage - Jun 14" },
  { number: 4, name: "Group Stage - Jun 15" },
  { number: 5, name: "Group Stage - Jun 16" },
  { number: 6, name: "Group Stage - Jun 17" },
  { number: 7, name: "Group Stage - Jun 18" },
  { number: 8, name: "Group Stage - Jun 19" },
  { number: 9, name: "Group Stage - Jun 20" },
  { number: 10, name: "Group Stage - Jun 21" },
  { number: 11, name: "Group Stage - Jun 22" },
  { number: 12, name: "Group Stage - Jun 23" },
  { number: 13, name: "Group Stage - Jun 24" },
  { number: 14, name: "Group Stage - Jun 25" },
  { number: 15, name: "Group Stage - Jun 26" },
  { number: 16, name: "Group Stage - Jun 27" },
  { number: 17, name: "Group Stage - Jun 28" },
  { number: 18, name: "Round of 32" },
  { number: 19, name: "Round of 16" },
  { number: 20, name: "Quarter-finals" },
  { number: 21, name: "Semi-finals" },
  { number: 22, name: "Third Place Playoff" },
  { number: 23, name: "Final" },
];

async function main() {
  try {
    const season = await prisma.season.findUnique({
      where: { name: SEASON_NAME },
    });

    if (!season) {
      console.error("❌ World Cup season not found");
      return;
    }

    for (const gw of GAME_WEEKS) {
      await prisma.gameWeek.upsert({
        where: {
          season_id_number: {
            season_id: season.id,
            number: gw.number,
          },
        },
        update: {},
        create: {
          season_id: season.id,
          number: gw.number,
          name: gw.name,
        },
      });
    }

    console.log(
      `✅ ${GAME_WEEKS.length} World Cup GameWeeks created successfully`
    );
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
