import { PrismaClient } from "../generated/prisma";
import teams from "./data/team/seriaa-league-teams.json";
import { LEAGUE_ID } from "./utils";

const prisma = new PrismaClient();

async function main() {
  for (const team of teams) {
    await prisma.team.upsert({
      where: { slug: team.slug },
      update: {},
      create: {
        ...team,
        league_id:LEAGUE_ID
      },
    });
  }
}

main();
