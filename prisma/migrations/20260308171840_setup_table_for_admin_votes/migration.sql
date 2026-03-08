-- CreateTable
CREATE TABLE "AdminMatchVote" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "home_votes" INTEGER NOT NULL DEFAULT 0,
    "draw_votes" INTEGER NOT NULL DEFAULT 0,
    "away_votes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminMatchVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminScorePrediction" (
    "id" SERIAL NOT NULL,
    "score_option_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminScorePrediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminMatchVote_match_id_key" ON "AdminMatchVote"("match_id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminScorePrediction_score_option_id_key" ON "AdminScorePrediction"("score_option_id");

-- AddForeignKey
ALTER TABLE "AdminMatchVote" ADD CONSTRAINT "AdminMatchVote_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminMatchVote" ADD CONSTRAINT "AdminMatchVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminScorePrediction" ADD CONSTRAINT "AdminScorePrediction_score_option_id_fkey" FOREIGN KEY ("score_option_id") REFERENCES "ScoreOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminScorePrediction" ADD CONSTRAINT "AdminScorePrediction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
