import { Router } from "express";
import { getGameWeeksController } from "./gameWeek.controller";

const router = Router();

router.get("/", getGameWeeksController);

export default router;
