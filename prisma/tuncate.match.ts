import prisma from "../src/prisma";

async function truncateMatches() {
  console.log("🧹 Clearing match related data...");

  await prisma.scorePrediction.deleteMany();
  await prisma.adminScorePrediction.deleteMany();
  await prisma.scoreOption.deleteMany();
  await prisma.adminMatchVote.deleteMany();
  await prisma.matchVote.deleteMany();
  await prisma.commentReaction.deleteMany();
  await prisma.comment.deleteMany();

  await prisma.match.deleteMany();


  console.log("✅ Matches truncated");
}

truncateMatches()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });