import prisma from "../src/prisma";

async function runSeeds() {
  console.log('🏆 Starting FIFA World Cup 2026 setup...\n');

  try {
    await import ("./seed.admin");
    //npm run seed:admin
    console.log("Admin Seed Successfully");

    await import ("./seed.worldCupLeague");
    //npm run seed:worldcup:league
    console.log("World Cup League Seed Successfully");

    await import ("./seed.worldCupSeason");
    //npm run seed:worldcup:season
    console.log("World Cup Season Seed Successfully");

    await import ("./seed.worldCupLeagueSeason");
    //npm run seed:worldcup:leagueSeason
    console.log("World Cup League Season Seed Successfully");

    await import ("./seed.worldCupTeams");
    //npm run seed:worldcup:teams
    console.log("World Cup Teams Seed Successfully");

    await import ("./seed.worldCupGameWeeks");
    //npm run seed:worldcup:gameweeks
    console.log("World Cup Game Weeks Seed Successfully");

    await import ("./seed.worldCupMatches");
    //npm run seed:worldcup:matches
    console.log("World Cup Matches Seed Successfully");
    
    await import ("./seed.teamStanding");
    //npm run seed:teamStanding
    console.log("World Cup TeamStanding Seed Successfully");

    await import ("./seed.userSeed.ts");
    //npm run seed:userSeed
    console.log("World Cup TeamStanding Seed Successfully");





    // // Import and run each seed file
    // await import('./seed.worldCupLeague');
    // console.log('');
    
    // await import('./seed.worldCupTeams');
    // console.log('');
    
    // await import('./seed.worldCupSeason');
    // console.log('');
    
    // await import('./seed.worldCupLeagueSeason');
    // console.log('');
    
    // await import('./seed.worldCupGameWeeks');
    // console.log('');
    
    // await import('./seed.worldCupMatches');
    // console.log('');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runSeeds();
