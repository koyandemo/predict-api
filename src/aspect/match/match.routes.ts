import { Router } from "express";
import {
  createMatchController,
  createScoreOptionController,
  deleteMatchController,
  deleteScoreOptionController,
  getAdminMatchVotesController,
  getMatchBySlugController,
  getMatchesController,
  getMatchVotesController,
  getPredictionResultsController,
  getScoreOptionsController,
  updateAdminMatchVoteController,
  updateAdminScorePredictionController,
  updateMatchController,
  updateScoreOptionController,
  voteMatchController,
  voteScorePredictionController,
} from "./match.controller";

const router = Router();

router.post("/key", createMatchController);
router.get("/", getMatchesController);
router.get("/:slug", getMatchBySlugController);
router.put("/:id/key", updateMatchController);
router.delete("/:id/key", deleteMatchController);

/**
 * Vote for a match
 */

router.post("/:id/vote/key", voteMatchController);
router.get("/:id/votes", getMatchVotesController);

router.get("/:id/score-options", getScoreOptionsController);
router.post("/:id/score-options/key", createScoreOptionController);
router.patch("/:id/score-options/key", updateScoreOptionController);
router.delete("/:id/score-option/key", deleteScoreOptionController);

router.post("/:id/score-predictions/key", voteScorePredictionController);

router.get("/:id/score-options-predictions", getPredictionResultsController);
router.get("/:id/admin-match-votes", getAdminMatchVotesController);
router.post("/:id/update-admin-match-votes", updateAdminMatchVoteController);
router.post(
  "/:id/update-admin-score-predictions",
  updateAdminScorePredictionController
);

export default router;
