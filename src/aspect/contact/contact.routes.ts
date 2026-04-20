import { Router } from "express";
import { createContactController, getAllContactsController } from "./contact.controller";

const router = Router();

router.post("/", createContactController);
router.get("/", getAllContactsController);
// router.get("/:id", getLeagueByIdController);
// router.put("/:id/key", updateLeagueController);
// router.delete("/:id/key", deleteLeagueController);

export default router;
