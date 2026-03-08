import { Router } from "express";
import {
  createLeagueController,
  getLeaguesController,
  getLeagueByIdController,
  updateLeagueController,
  deleteLeagueController,
} from "./league.controller";

const router = Router();

router.post("/key", createLeagueController);
router.get("/", getLeaguesController);
router.get("/:id", getLeagueByIdController);
router.put("/:id/key", updateLeagueController);
router.delete("/:id/key", deleteLeagueController);

export default router;