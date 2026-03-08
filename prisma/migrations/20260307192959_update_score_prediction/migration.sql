/*
  Warnings:

  - You are about to drop the column `away_score` on the `ScorePrediction` table. All the data in the column will be lost.
  - You are about to drop the column `home_score` on the `ScorePrediction` table. All the data in the column will be lost.
  - Added the required column `score_option_id` to the `ScorePrediction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScorePrediction" DROP COLUMN "away_score",
DROP COLUMN "home_score",
ADD COLUMN     "score_option_id" INTEGER NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ScoreOption" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "home_score" INTEGER NOT NULL,
    "away_score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoreOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScoreOption_match_id_home_score_away_score_key" ON "ScoreOption"("match_id", "home_score", "away_score");

-- AddForeignKey
ALTER TABLE "ScoreOption" ADD CONSTRAINT "ScoreOption_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScorePrediction" ADD CONSTRAINT "ScorePrediction_score_option_id_fkey" FOREIGN KEY ("score_option_id") REFERENCES "ScoreOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
