import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getUsersController,
  loginUserController,
  registerUserController,
  registerWithProviderController,
  updateUserController,
  updateUserProfileController,
} from "./user.controller";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/register-provider", registerWithProviderController);
router.put("/profile/key", updateUserProfileController);
router.post("/key", createUserController);
router.get("/", getUsersController);
router.put("/:id/key", updateUserController);
router.delete("/:id/key", deleteUserController);

export default router;
