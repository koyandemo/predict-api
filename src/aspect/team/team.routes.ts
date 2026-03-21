import { Router } from "express";
import {
  createTeamController,
  getTeamsController,
  getTeamByIdController,
  updateTeamController,
  deleteTeamController,
  getTeamsByVoteController,
  getFifaWorldCupTeamStandingController,
} from "./team.controller";

const router = Router();

router.post("/key", createTeamController);
router.get("/", getTeamsController);
router.get("/:id", getTeamByIdController);
router.get("/by-vote/:leagueSeasonId", getTeamsByVoteController);
router.get("/fifa/world-cup-team-standings",getFifaWorldCupTeamStandingController);
router.put("/:id/key", updateTeamController);
router.delete("/:id/key", deleteTeamController);

export default router;
