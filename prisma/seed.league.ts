import prisma from "../src/prisma";
import leagues from "./data/leagues.json";

async function main() {
  for (const league of leagues) {
    await prisma.league.upsert({
      where: { slug: league.slug },
      update: {},
      create: league
    })
  }
}

main()