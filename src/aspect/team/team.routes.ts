import { Router } from "express";
import {
  createTeamController,
  getTeamsController,
  getTeamByIdController,
  updateTeamController,
  deleteTeamController,
} from "./team.controller";

const router = Router();

router.post("/key", createTeamController);
router.get("/key", getTeamsController);
router.get("/:id/key", getTeamByIdController);
router.put("/:id/key", updateTeamController);
router.delete("/:id/key", deleteTeamController);

export default router;