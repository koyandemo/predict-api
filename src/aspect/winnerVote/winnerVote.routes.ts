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
router.post("/vote", createWinnerVoteController);
router.put("/vote/:voteId", updateWinnerVoteController);

router.post("/admin/vote", createAdminWinnerVoteController);
router.put("/admin/vote/:voteId", updateAdminWinnerVoteController);
router.delete("/admin/vote/:voteId", deleteAdminWinnerVoteController);

export default router;
