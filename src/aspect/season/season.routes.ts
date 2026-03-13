import { Router } from "express";
import { getSeasonsController } from "./season.controller";

const router = Router();

router.get("/", getSeasonsController);

export default router;
