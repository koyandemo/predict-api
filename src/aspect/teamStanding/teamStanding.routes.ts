import { Router } from "express";
import { createTeamStandingController, deleteTeamStandingController, getTeamStandingByIdController, getTeamStandingsController, updateTeamStandingController } from "./teamStanding.controller";


const router = Router();

router.post("/", createTeamStandingController);
router.get("/", getTeamStandingsController);
router.get("/:id", getTeamStandingByIdController);
router.put("/:id", updateTeamStandingController);
router.delete("/:id", deleteTeamStandingController);

export default router;