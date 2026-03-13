/*
  Warnings:

  - You are about to drop the column `league_id` on the `Season` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Season" DROP CONSTRAINT "Season_league_id_fkey";

-- DropIndex
DROP INDEX "Season_league_id_name_key";

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "league_id";

-- CreateTable
CREATE TABLE "LeagueSeason" (
    "id" SERIAL NOT NULL,
    "league_id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeagueSeason_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeagueSeason_league_id_season_id_key" ON "LeagueSeason"("league_id", "season_id");

-- AddForeignKey
ALTER TABLE "LeagueSeason" ADD CONSTRAINT "LeagueSeason_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueSeason" ADD CONSTRAINT "LeagueSeason_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
