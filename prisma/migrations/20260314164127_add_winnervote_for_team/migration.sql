-- AlterEnum
ALTER TYPE "MatchType" ADD VALUE 'ROUND_OF_32';

-- CreateTable
CREATE TABLE "WinnerVote" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "league_season_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WinnerVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminWinnerVote" (
    "id" SERIAL NOT NULL,
    "league_season_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminWinnerVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WinnerVote_user_id_league_season_id_key" ON "WinnerVote"("user_id", "league_season_id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminWinnerVote_league_season_id_team_id_key" ON "AdminWinnerVote"("league_season_id", "team_id");

-- AddForeignKey
ALTER TABLE "WinnerVote" ADD CONSTRAINT "WinnerVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WinnerVote" ADD CONSTRAINT "WinnerVote_league_season_id_fkey" FOREIGN KEY ("league_season_id") REFERENCES "LeagueSeason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WinnerVote" ADD CONSTRAINT "WinnerVote_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminWinnerVote" ADD CONSTRAINT "AdminWinnerVote_league_season_id_fkey" FOREIGN KEY ("league_season_id") REFERENCES "LeagueSeason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminWinnerVote" ADD CONSTRAINT "AdminWinnerVote_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminWinnerVote" ADD CONSTRAINT "AdminWinnerVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
