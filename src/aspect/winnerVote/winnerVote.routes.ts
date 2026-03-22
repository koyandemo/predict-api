import { Router } from "express";
import {
  getLeagueSeasonWinnerVotesController,
  getUserWinnerVoteController,
  createWinnerVoteController,
  updateWinnerVoteController,
  createAdminWinnerVoteController,
  updateAdminWinnerVoteController,
  deleteAdminWinnerVoteController,
} from "./winnerVote.controller";

const router = Router();

router.get("/league-season/:leagueSeasonId", getLeagueSeasonWinnerVotesController);
router.get("/user/:leagueSeasonId", getUserWinnerVoteController);
router.post("/vote/key", createWinnerVoteController);
router.put("/vote/:voteId/key", updateWinnerVoteController);

router.post("/admin/vote/key", createAdminWinnerVoteController);
router.put("/admin/vote/:voteId/key", updateAdminWinnerVoteController);
router.delete("/admin/vote/:voteId", deleteAdminWinnerVoteController);

export default router;
