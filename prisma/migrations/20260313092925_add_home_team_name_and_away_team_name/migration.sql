-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SEED';

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "away_team_name" TEXT,
ADD COLUMN     "home_team_name" TEXT;
