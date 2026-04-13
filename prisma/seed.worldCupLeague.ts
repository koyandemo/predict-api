import prisma from "../src/prisma";

const worldCupLeague = {
  name: "FIFA World Cup 2026",
  country: "USA/Canada/Mexico",
  slug: "fifa-world-cup-2026",
  logo_url: "/generic-football-tournament-logo.png",
  sort_order: 0,
  is_tournament: true,
  published: true,
};

async function main() {
  try {
    await prisma.league.upsert({
      where: { slug: worldCupLeague.slug },
      update: worldCupLeague,
      create: worldCupLeague,
    });

    console.log("✅ FIFA World Cup 2026 league created/updated");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
