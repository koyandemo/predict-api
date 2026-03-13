/*
  Warnings:

  - Added the required column `season_id` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "gameweek_id" INTEGER,
ADD COLUMN     "season_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Season" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER,
    "league_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameWeek" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Season_league_id_name_key" ON "Season"("league_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "GameWeek_season_id_number_key" ON "GameWeek"("season_id", "number");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_gameweek_id_fkey" FOREIGN KEY ("gameweek_id") REFERENCES "GameWeek"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameWeek" ADD CONSTRAINT "GameWeek_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
