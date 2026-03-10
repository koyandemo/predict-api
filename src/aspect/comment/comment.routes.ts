import { Router } from "express";
import {
    addReaction,
  createCommentController,
  createReplyCommentController,
  getAllCommentsController,
  getReplies,
} from "./comment.controller";

const router = Router();

router.post("/:id", createCommentController);
router.get("/:id", getAllCommentsController);
router.post("/:parentCommentId/replies", createReplyCommentController);
router.get("/:commentId/replies", getReplies);
router.post("/:commentId/reactions", addReaction);
// router.get("/:id", getLeagueByIdController);
// router.put("/:id/key", updateLeagueController);
// router.delete("/:id/key", deleteLeagueController);

export default router;
