#!/usr/bin/env ts-node

/**
 * Master seed script for FIFA World Cup 2026
 * Run this to set up the complete World Cup tournament structure
 */

import prisma from "../src/prisma";

async function runSeeds() {
  console.log('🏆 Starting FIFA World Cup 2026 setup...\n');

  try {
    // Import and run each seed file
    await import('./seed.worldCupLeague');
    console.log('');
    
    await import('./seed.worldCupTeams');
    console.log('');
    
    await import('./seed.worldCupSeason');
    console.log('');
    
    await import('./seed.worldCupLeagueSeason');
    console.log('');
    
    await import('./seed.worldCupGameWeeks');
    console.log('');
    
    await import('./seed.worldCupMatches');
    console.log('');

    console.log('🎉 FIFA World Cup 2026 setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - League created: FIFA World Cup 2026');
    console.log('   - Teams: 24 national teams across 6 groups');
    console.log('   - Season: 2026');
    console.log('   - GameWeeks: 8 (3 group stage + 5 knockout)');
    console.log('   - Matches: Group stage + Round of 16 + Quarter-finals + Semi-finals + Final + Third Place');
    console.log('\n✨ You can now start using the World Cup features!');
  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runSeeds();
